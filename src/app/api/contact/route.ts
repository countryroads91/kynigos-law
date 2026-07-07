import { NextResponse } from "next/server";
import { crossSiteRequest } from "@/lib/http";
import { clean, EMAIL_RE, persistLead, sendNotification } from "@/lib/leads";
import { checkRateLimit, clientIp } from "@/lib/ratelimit";
import { verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";

type ContactBody = {
  name?: string;
  email?: string;
  phone?: string;
  jurisdiction?: string;
  message?: string;
  company?: string; // honeypot—real users never see or fill this field
  source?: string; // which form: the contact page or the homepage FirstMove
  turnstileToken?: string;
};

const SEND_FAILED_ERROR =
  "We could not send your message. Please call (304) 549-1058 or email info@kynigos.law directly.";

export async function POST(req: Request) {
  // Reject oversized payloads before parsing; the message cap is 5000 chars.
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > 32_768) {
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

  if (!(await checkRateLimit(req, "contact"))) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a minute." },
      { status: 429 },
    );
  }

  let body: ContactBody;
  try {
    body = (await req.json()) as ContactBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const name = clean(body.name ?? "");
  const email = (body.email ?? "").trim();
  const phone = clean(body.phone ?? "").slice(0, 40);
  const jurisdiction = (body.jurisdiction ?? "").trim().toLowerCase();
  const message = (body.message ?? "").trim();
  const honeypot = (body.company ?? "").trim();
  const source = body.source === "first_move" ? "first_move" : "contact";

  // Bots fill every field; pretend success and send nothing.
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  if (
    name.length < 2 ||
    name.length > 120 ||
    !EMAIL_RE.test(email) ||
    email.length > 254 ||
    message.length < 1 ||
    message.length > 5000
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please enter your name, a valid email, and a short message.",
      },
      { status: 422 },
    );
  }

  // "Not answered" and "outside DC" are different facts—do not conflate them.
  if (!jurisdiction) {
    return NextResponse.json(
      { ok: false, error: "Please select the jurisdiction your matter involves." },
      { status: 422 },
    );
  }

  // Licensed in DC only. The form blocks non-DC matters client-side; enforce
  // the same rule here so this endpoint never records one as an engagement
  // inquiry.
  if (jurisdiction !== "dc") {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Kynigos Law Firm, PLLC is licensed in the District of Columbia only. For matters in another jurisdiction, email info@kynigos.law and we may be able to refer you to local counsel.",
      },
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
  console.log(
    `[contact] ${stamp} source="${source}" name="${name}" email="${email}" phone="${phone}"`,
  );

  // Persist FIRST: once this row exists the lead can never be lost, whatever
  // happens to email delivery below.
  const leadId = await persistLead({
    name,
    email,
    phone,
    jurisdiction,
    message,
    source,
  });

  // Delivering this email IS the product (unlike the white-paper route, where
  // the download is the deliverable). If it cannot be sent, say so—never tell
  // a prospective client their message is on its way when it is not. The
  // inquiry is already persisted (and logged below) so it is recoverable.
  try {
    const sent = await sendNotification({
      subject: `Consultation inquiry—${name}`,
      replyTo: email,
      text: [
        "New consultation inquiry from kynigos.law" +
          (source === "first_move" ? " (homepage First Move form)." : "/contact."),
        "",
        `Name:  ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "(not provided)"}`,
        `Jurisdiction: District of Columbia`,
        `Time:  ${stamp}`,
        `Lead:  ${leadId ?? "(not persisted)"}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });
    if (!sent) {
      console.error(
        `[contact] UNDELIVERED (env not configured) ${stamp} name="${name}" email="${email}" phone="${phone}" message="${clean(message)}"`,
      );
      return NextResponse.json(
        { ok: false, error: SEND_FAILED_ERROR },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error(
      `[contact] UNDELIVERED (send failed) ${stamp} name="${name}" email="${email}" phone="${phone}" message="${clean(message)}"`,
      err,
    );
    return NextResponse.json(
      { ok: false, error: SEND_FAILED_ERROR },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
