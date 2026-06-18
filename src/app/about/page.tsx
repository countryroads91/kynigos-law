import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Bayan Misaghi, Managing Partner of Kynigos Law Firm, PLLC. A decade in structured credit at Goldman Sachs, Invictus Capital Partners, LendingOne, and Rocade Capital. JD from Antonin Scalia Law School. Bar-admitted in DC.",
};

export default function AboutPage() {
  return (
    <section className="hero">
      <div className="kicker">About the Firm</div>
      <h1 className="headline-line">Bayan Misaghi</h1>
      <p className="subhead">Managing Partner · Kynigos Law Firm, PLLC.</p>
      <p className="lede">
        Before law, a decade in institutional finance—Goldman Sachs, Invictus
        Capital Partners (Verus securitization platform and SFR/CRE lending),
        LendingOne (large-loan underwriting), Rocade Capital (litigation
        finance). JD from Antonin Scalia Law School (full tuition scholarship).
        BA from Washington and Lee University (Magna Cum Laude, Phi Beta Kappa,
        Johnson Scholar). Bar-admitted in the District of Columbia.
      </p>
      <p className="lede">
        Full About page is in progress. For now, please reach out directly for
        a consultation.
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
