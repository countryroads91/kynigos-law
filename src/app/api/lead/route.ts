import { NextResponse } from "next/server";
import { getPaper } from "@/content/papers";
import { crossSiteRequest, oversizedRequest } from "@/lib/http";
import { clean, EMAIL_RE, persistLead, sendNotification } from "@/lib/leads";
import { startSubscription } from "@/lib/newsletter";
import { paperDownloadUrl } from "@/lib/paper-token";
import { checkRateLimit, clientIp } from "@/lib/ratelimit";
import { verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";

type LeadBody = {
  name?: string;
  email?: string;
  paper?: string; // accepted but ignored—the slug-resolved title is canonical
  slug?: string;
  company?: string; // honeypot—real users never see or fill this field
  turnstileToken?: string;
  // Research-notes opt-in checkbox on the gate. Handled here (not by a second
  // client call to /api/subscribe) because this request's Turnstile token is
  // already verified and tokens are single-use.
  subscribe?: boolean;
};

export async function POST(req: Request) {
  if (oversizedRequest(req)) {
    return NextResponse.json(
      { ok: false, error: "Request too large." },
      { status: 413 },
    );
  }

  if (crossSiteRequest(req)) {
    return NextResponse.json(
      { ok: false, error: "Invalid request origin." },
      { status: 403 },
    );
  }

  if (!(await checkRateLimit(req, "lead"))) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a minute." },
      { status: 429 },
    );
  }

  let body: LeadBody;
  try {
    body = (await req.json()) as LeadBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const name = clean(body.name ?? "");
  const email = (body.email ?? "").trim();
  const slug = clean(body.slug ?? "").slice(0, 120);
  const honeypot = (body.company ?? "").trim();

  // Bots fill every field; pretend success and hand out nothing.
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  if (name.length < 2 || name.length > 120 || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { ok: false, error: "Please enter your name and a valid email address." },
      { status: 422 },
    );
  }

  // The download URL is minted per known paper—an unknown slug gets nothing.
  const known = getPaper(slug);
  if (!known) {
    return NextResponse.json(
      { ok: false, error: "Unknown paper. Please refresh the page and try again." },
      { status: 422 },
    );
  }

  // Turnstile LAST among the checks: tokens are single-use, so verifying
  // before validation would burn the token on a 422 and doom the user's
  // corrected resubmission to a 403.
  if (!(await verifyTurnstile(body.turnstileToken, clientIp(req)))) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "We could not verify you are human. Please refresh the page and try again.",
      },
      { status: 403 },
    );
  }

  const stamp = new Date().toISOString();
  // Log as well as persist so a lead is visible in Vercel logs during triage.
  console.log(
    `[lead] ${stamp} paper="${known.slug}" name="${name}" email="${email}"`,
  );

  // Persist FIRST—email is best-effort on this route.
  const leadId = await persistLead({
    name,
    email,
    source: "white_paper",
    paperSlug: known.slug,
  });

  try {
    const sent = await sendNotification({
      subject: `White paper download — ${name}`,
      replyTo: email,
      text: [
        "New white paper lead from kynigos.law.",
        "",
        `Name:  ${name}`,
        `Email: ${email}`,
        // Server-resolved title, never the client-supplied display string.
        `Paper: ${known.title}`,
        `Time:  ${stamp}`,
        `Lead:  ${leadId ?? "(not persisted)"}`,
      ].join("\n"),
    });
    if (!sent) {
      console.warn(
        "[lead] RESEND_API_KEY or LEAD_NOTIFY_EMAIL not set — lead logged only.",
      );
    }
  } catch (err) {
    // Do not block the download; the lead is already persisted and logged.
    console.error("[lead] email send failed:", err);
  }

  if (body.subscribe === true) {
    // Best-effort: a newsletter hiccup must never disturb the download the
    // reader actually came for.
    try {
      await startSubscription(email.toLowerCase(), name);
    } catch (err) {
      console.error("[lead] subscription request failed:", err);
    }
  }

  return NextResponse.json({ ok: true, url: paperDownloadUrl(known.slug) });
}
