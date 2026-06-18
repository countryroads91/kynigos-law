import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Schedule a consultation with Kynigos Law Firm, PLLC. Washington, DC. Flat-fee and contingency representation.",
};

export default function ContactPage() {
  return (
    <section className="hero">
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 24,
          margin: "16px 0 32px",
          maxWidth: 720,
          width: "100%",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--color-oxblood)",
              marginBottom: 6,
            }}
          >
            Call
          </div>
          <a
            href="tel:+13045491058"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 600,
              color: "var(--color-espresso)",
              textDecoration: "none",
            }}
          >
            (304) 549-1058
          </a>
        </div>
        <div>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--color-oxblood)",
              marginBottom: 6,
            }}
          >
            Email
          </div>
          <a
            href="mailto:info@kynigos.law"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 600,
              color: "var(--color-espresso)",
              textDecoration: "none",
            }}
          >
            info@kynigos.law
          </a>
        </div>
        <div>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--color-oxblood)",
              marginBottom: 6,
            }}
          >
            Location
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 600,
              color: "var(--color-espresso)",
            }}
          >
            Washington, DC
          </div>
        </div>
      </div>
      <div className="cta-row">
        <Link href="/" className="btn-secondary">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
