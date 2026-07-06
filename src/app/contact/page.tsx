import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a free consultation with Kynigos Law Firm, PLLC in Washington, DC—about 30 minutes, a straight answer, and a fixed fee quoted before any work begins. DC matters only.",
};

const channels = [
  {
    label: "Call",
    value: (
      <a href="tel:+13045491058">
        (304) 549-1058
      </a>
    ),
  },
  {
    label: "Email",
    value: (
      <a href="mailto:info@kynigos.law">
        info@kynigos.law
      </a>
    ),
  },
  {
    label: "Location",
    value: <span>Washington, DC</span>,
  },
];

const expectations = [
  "The consultation is free and runs about 30 minutes.",
  "You get a straight answer on whether the firm should take your matter—including “you don’t need a lawyer for this.”",
  "If we proceed, the next step is scoped and priced as a fixed number in writing before any work begins.",
];

export default function ContactPage() {
  return (
    <section className="hero hero--page">
      <div className="kicker">Get Started</div>
      <h1 className="headline-line">The first move is yours.</h1>
      <p className="subhead">
        A clear flat fee is quoted before any work begins.
      </p>
      <p className="lede">
        Kynigos Law Firm, PLLC is licensed to practice law in the District of
        Columbia only. If your matter involves another jurisdiction, we may be
        able to refer you to local counsel.
      </p>

      <div className="card-grid card-grid--wide">
        {channels.map((c) => (
          <div key={c.label}>
            <span className="eyebrow">{c.label}</span>
            {c.value}
          </div>
        ))}
      </div>

      <div className="kicker">What to Expect</div>
      <ul className="legal-prose">
        {expectations.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>

      <div className="kicker">Or Write to Us</div>
      <ContactForm />

      <p className="gate-note" role="note">
        <strong>Please note:</strong> submitting this form does not create an
        attorney-client relationship, and until one exists you should not send
        confidential or time-sensitive information. How we handle what you do
        send is described in our{" "}
        <Link href="/legal/privacy">Privacy Policy</Link> and{" "}
        <Link href="/legal/disclaimer">Website Disclaimer &amp; Terms of Use</Link>
        .
      </p>

      <div className="cta-row">
        <Link href="/" className="btn-secondary">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
