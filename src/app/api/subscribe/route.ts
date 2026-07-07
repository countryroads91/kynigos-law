import { NextResponse } from "next/server";
import { crossSiteRequest, oversizedRequest } from "@/lib/http";
import { clean, EMAIL_RE } from "@/lib/leads";
import { startSubscription } from "@/lib/newsletter";
import { checkRateLimit, clientIp } from "@/lib/ratelimit";
import { verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";

type SubscribeBody = {
  email?: string;
  name?: string;
  company?: string; // honeypot—real users never see or fill this field
  turnstileToken?: string;
};

const UNAVAILABLE_ERROR =
  "Newsletter signup is not available yet. Email info@kynigos.law and we will add you.";
const SEND_FAILED_ERROR =
  "We could not send the confirmation email. Please try again later or email info@kynigos.law.";

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

  if (!(await checkRateLimit(req, "subscribe"))) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a minute." },
      { status: 429 },
    );
  }

  let body: SubscribeBody;
  try {
    body = (await req.json()) as SubscribeBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const email = (body.email ?? "").trim();
  const name = clean(body.name ?? "").slice(0, 120);
  const honeypot = (body.company ?? "").trim();

  // Bots fill every field; pretend success and store nothing.
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 422 },
    );
  }

  // This endpoint emails an arbitrary recipient—it gets the same human gate
  // as the other senders. Verified after validation (tokens are single-use).
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

  try {
    const result = await startSubscription(email.toLowerCase(), name);
    if (result === "unavailable") {
      console.warn("[subscribe] DATABASE_URL not set—signup unavailable.");
      return NextResponse.json(
        { ok: false, error: UNAVAILABLE_ERROR },
        { status: 503 },
      );
    }
    // "pending" and "already_confirmed" answer identically—no enumeration.
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[subscribe] failed:", err);
    return NextResponse.json(
      { ok: false, error: SEND_FAILED_ERROR },
      { status: 502 },
    );
  }
}
