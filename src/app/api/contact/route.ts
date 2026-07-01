import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type ContactBody = {
  name?: string;
  email?: string;
  phone?: string;
  jurisdiction?: string;
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: ContactBody;
  try {
    body = (await req.json()) as ContactBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").trim().slice(0, 40);
  const jurisdiction = (body.jurisdiction ?? "").trim().toLowerCase();
  const message = (body.message ?? "").trim();

  if (
    name.length < 2 ||
    name.length > 120 ||
    !EMAIL_RE.test(email) ||
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
  // Always log so an inquiry is recoverable from Vercel logs even if email fails.
  console.log(
    `[contact] ${stamp} name="${name}" email="${email}" phone="${phone}"`,
  );

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  const from =
    process.env.LEAD_FROM_EMAIL || "Kynigos Law Firm <onboarding@resend.dev>";

  if (apiKey && to) {
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
      // Do not fail the inquiry; it is already logged above.
      console.error("[contact] email send failed:", err);
    }
  } else {
    console.warn(
      "[contact] RESEND_API_KEY or LEAD_NOTIFY_EMAIL not set — inquiry logged only.",
    );
  }

  return NextResponse.json({ ok: true });
}
