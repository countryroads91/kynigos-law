import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "White Papers & Writing",
  description:
    "Academic writing on the economics of legal services—principal-agent problems, adverse selection, behavioral contract theory, moral hazard in legal opinion letters.",
};

export default function WhitePapersPage() {
  return (
    <section className="hero">
      <div className="kicker">Writing</div>
      <h1 className="headline-line">White Papers &amp; Essays</h1>
      <p className="subhead">Economic theory, applied to legal services.</p>
      <p className="lede">
        Five white papers in the series so far: principal-agent problem and
        hourly billing; the market for lemons and credence goods; behavioral
        contract theory and the physician non-compete; moral hazard and the
        legal opinion letter; and asymmetric attrition in staged flat-fee
        billing. Index and reading interface coming soon.
      </p>
      <div className="cta-row">
        <Link href="/contact" className="btn-primary">
          Schedule a Consultation
        </Link>
        <Link href="/" className="btn-secondary">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
