import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type ContactBody = {
  name?: string;
  email?: string;
  phone?: string;
  jurisdiction?: string;
  message?: string;
  company?: string; // honeypot—real users never see or fill this field
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Strip control characters so user input cannot forge log lines or reach the
// email subject header un-neutralized.
function clean(value: string): string {
  return value.replace(/[\r\n\t\x00-\x1f]+/g, " ").trim();
}

const SEND_FAILED_ERROR =
  "We could not send your message. Please call (304) 549-1058 or email bayan@kynigos.law directly.";

export async function POST(req: Request) {
  // Reject oversized payloads before parsing; the message cap is 5000 chars.
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > 32_768) {
    return NextResponse.json(
      { ok: false, error: "Request too large." },
      { status: 413 },
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
          "Kynigos Law Firm, PLLC is licensed in the District of Columbia only. For matters in another jurisdiction, email bayan@kynigos.law and we may be able to refer you to local counsel.",
      },
      { status: 422 },
    );
  }

  const stamp = new Date().toISOString();
  console.log(
    `[contact] ${stamp} name="${name}" email="${email}" phone="${phone}"`,
  );

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  const from =
    process.env.LEAD_FROM_EMAIL || "Kynigos Law Firm <onboarding@resend.dev>";

  // Unlike the white-paper lead route (where the download is the deliverable
  // and email is secondary), delivering this email IS the product. If it
  // cannot be sent, say so—never tell a prospective client their message is
  // on its way when it is not. Log the full inquiry first so it is
  // recoverable from Vercel logs.
  if (!apiKey || !to) {
    console.error(
      `[contact] UNDELIVERED (env not configured) ${stamp} name="${name}" email="${email}" phone="${phone}" message="${clean(message)}"`,
    );
    return NextResponse.json(
      { ok: false, error: SEND_FAILED_ERROR },
      { status: 502 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Consultation inquiry—${name}`,
      text: [
        "New consultation inquiry from kynigos.law/contact.",
        "",
        `Name:  ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "(not provided)"}`,
        `Jurisdiction: District of Columbia`,
        `Time:  ${stamp}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });
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
