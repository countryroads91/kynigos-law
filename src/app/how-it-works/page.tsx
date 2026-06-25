import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How it Works",
  description:
    "Flat-fee and contingency representation in Washington, DC. You know the price before any work begins, and your attorney only wins when you do.",
};

export default function HowItWorksPage() {
  return (
    <section className="hero">
      <div className="kicker">How it Works</div>
      <h1 className="headline-line">Priced for results, not hours.</h1>
      <p className="subhead">Calculated. Zealous. Invested.</p>
      <p className="lede">
        Most firms bill for their time, so every email and every hour works
        against you. We price for the outcome. You get a clear flat fee or a
        contingency structure before any work begins—no clock to feed, no
        surprise invoice.
      </p>
      <p className="lede">
        That alignment is the whole point: your attorney only wins when you do.
        It is written into the engagement letter, not the marketing copy.
      </p>
      <p className="lede">
        Kynigos Law Firm, PLLC is licensed in the District of Columbia. Matters
        outside DC may require referral to local counsel.
      </p>
      <div className="cta-row">
        <Link href="/contact" className="btn-primary">
          Book A Free Consultation
        </Link>
        <Link href="/practice-areas" className="btn-secondary">
          See Practice Areas
        </Link>
      </div>
    </section>
  );
}
