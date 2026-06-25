import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type LeadBody = { name?: string; email?: string; paper?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: LeadBody;
  try {
    body = (await req.json()) as LeadBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const paper = (body.paper ?? "white paper").trim().slice(0, 120);

  if (name.length < 2 || name.length > 120 || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter your name and a valid email address." },
      { status: 422 },
    );
  }

  const stamp = new Date().toISOString();
  // Always log so a lead is recoverable from Vercel logs even if email fails.
  console.log(
    `[lead] ${stamp} paper="${paper}" name="${name}" email="${email}"`,
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
        subject: `White paper download — ${name}`,
        text: [
          "New white paper lead from kynigos.law.",
          "",
          `Name:  ${name}`,
          `Email: ${email}`,
          `Paper: ${paper}`,
          `Time:  ${stamp}`,
        ].join("\n"),
      });
    } catch (err) {
      // Do not block the download; the lead is already logged above.
      console.error("[lead] email send failed:", err);
    }
  } else {
    console.warn(
      "[lead] RESEND_API_KEY or LEAD_NOTIFY_EMAIL not set — lead logged only.",
    );
  }

  return NextResponse.json({ ok: true });
}
