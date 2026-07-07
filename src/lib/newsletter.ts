// Newsletter subscription persistence (double opt-in). Rows start `pending`
// with a hashed confirmation token; only presenting the emailed token back
// (via the click-to-confirm page) flips them to `confirmed` and (best-effort)
// adds them to the Resend Audience used for broadcasts. Env-gated like
// everything else: no DATABASE_URL means the feature reports itself
// unavailable rather than pretending.

import { createHash, randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { getDb } from "./db";
import { subscribers } from "./db/schema";
import { SITE_URL } from "./http";
import { recordEvent, sendEmail } from "./leads";

// Tokens ride in email links (and therefore mail-provider logs); bound their
// lifetime and store only a hash at rest so neither surface yields a usable
// confirmation link later.
export const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export type UpsertResult =
  | { outcome: "already_confirmed" }
  | { outcome: "pending"; token: string }
  | null; // database not configured

export async function upsertPendingSubscriber(
  email: string,
  name?: string,
): Promise<UpsertResult> {
  const db = getDb();
  if (!db) return null;

  const [existing] = await db
    .select({
      id: subscribers.id,
      name: subscribers.name,
      status: subscribers.status,
    })
    .from(subscribers)
    .where(eq(subscribers.email, email))
    .limit(1);

  if (existing?.status === "confirmed") {
    // Re-signing up IS fresh consent: re-sync to the Resend Audience so a
    // reader who unsubscribed there and deliberately came back is not lost
    // in a silent black hole.
    await addToResendAudience(email, existing.name ?? name ?? null, existing.id);
    return { outcome: "already_confirmed" };
  }

  const token = randomBytes(24).toString("hex");
  const hashed = hashToken(token);
  const issuedAt = new Date();
  if (existing) {
    // Re-request (or resubscribe after unsubscribing): fresh token, back to
    // pending until the new link is clicked.
    await db
      .update(subscribers)
      .set({
        token: hashed,
        tokenIssuedAt: issuedAt,
        status: "pending",
        name: name || null,
      })
      .where(eq(subscribers.id, existing.id));
  } else {
    await db.insert(subscribers).values({
      email,
      name: name || null,
      token: hashed,
      tokenIssuedAt: issuedAt,
      status: "pending",
    });
  }
  return { outcome: "pending", token };
}

export type ConfirmResult =
  | { email: string; name: string | null }
  | null; // unknown/expired token or database not configured

export async function confirmSubscriber(
  token: string,
): Promise<ConfirmResult> {
  const db = getDb();
  if (!db || !token) return null;

  const [row] = await db
    .select({
      id: subscribers.id,
      email: subscribers.email,
      name: subscribers.name,
      status: subscribers.status,
      tokenIssuedAt: subscribers.tokenIssuedAt,
    })
    .from(subscribers)
    .where(eq(subscribers.token, hashToken(token)))
    .limit(1);
  if (!row) return null;

  if (row.status !== "confirmed") {
    if (
      !row.tokenIssuedAt ||
      Date.now() - new Date(row.tokenIssuedAt).getTime() > TOKEN_TTL_MS
    ) {
      return null; // expired—reader must request a fresh link
    }
    await db
      .update(subscribers)
      .set({
        status: "confirmed",
        confirmedAt: new Date(),
        token: null,
        tokenIssuedAt: null,
      })
      .where(eq(subscribers.id, row.id));
    await recordEvent("subscribed", { subscriberId: row.id });
    await addToResendAudience(row.email, row.name, row.id);
  }
  return { email: row.email, name: row.name };
}

// One entry point for "reader asked to subscribe": upsert + confirmation
// email. Callers own the HTTP guards (rate limit, Turnstile, honeypot).
// Throws on send failure; returns "unavailable" when the DB is off.
export type StartResult = "pending" | "already_confirmed" | "unavailable";

export async function startSubscription(
  email: string,
  name?: string,
): Promise<StartResult> {
  const result = await upsertPendingSubscriber(email, name);
  if (result === null) return "unavailable";
  if (result.outcome === "already_confirmed") return "already_confirmed";

  // Click-to-confirm page, NOT a bare state-changing GET: email security
  // scanners prefetch links, and a prefetched confirmation would fabricate
  // consent. The URL is built from the canonical origin, never req.url.
  const confirmUrl = `${SITE_URL}/newsletter/confirm?token=${result.token}`;

  const sent = await sendEmail({
    to: email,
    subject: "Confirm your subscription—Kynigos research notes",
    // Deliberately no reader-supplied text (not even the name): anything an
    // attacker can type must never appear in mail from the firm's domain.
    text: [
      "Hello,",
      "",
      "You asked to receive research notes from Kynigos Law Firm—economic",
      "analysis of legal fee structures, new white papers, and related",
      "publications.",
      "",
      "Confirm your subscription (link valid for 7 days):",
      confirmUrl,
      "",
      "If you did not request this, ignore this email and nothing further",
      "will be sent.",
      "",
      "Kynigos Law Firm, PLLC · Washington, DC · info@kynigos.law",
    ].join("\n"),
  });
  if (!sent) {
    throw new Error("email not configured—confirmation not sent");
  }
  return "pending";
}

// Best-effort projection into the Resend Audience used by broadcasts. The
// Postgres row is the source of truth; a sync failure is logged, not fatal.
async function addToResendAudience(
  email: string,
  name: string | null,
  subscriberId: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) return;
  try {
    const resend = new Resend(apiKey);
    const result = await resend.contacts.create({
      audienceId,
      email,
      ...(name ? { firstName: name.split(" ")[0] } : {}),
      unsubscribed: false,
    });
    if (result?.error) {
      throw new Error(result.error.message ?? "Resend contact create failed");
    }
  } catch (err) {
    // Subscriber id, not the email—PII stays out of the logs.
    console.error(`[newsletter] audience sync failed for subscriber ${subscriberId}`, err);
  }
}
