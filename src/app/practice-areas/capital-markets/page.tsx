import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Capital Markets",
  description:
    "Legal Opinion Letters for institutional clients and deal counsel for lenders and funds. DC law. From a decade in structured credit at Goldman Sachs, Invictus, LendingOne, and Rocade.",
};

export default function CapitalMarketsPage() {
  return (
    <section className="hero">
      <div className="kicker">Practice Area</div>
      <h1 className="headline-line">Capital Markets</h1>
      <p className="subhead">
        Legal Opinion Letters and deal counsel—for the lenders, funds, and
        asset managers who already know the difference.
      </p>
      <p className="lede">
        DC-law opinion letters on CRE loans, SFR mortgages, preferred equity,
        LLC membership interests, and related debt instruments. Deal counsel on
        loan agreements, intercreditor agreements, security agreements, and
        preferred equity docs. Background: Goldman Sachs, Invictus Capital
        Partners (Verus securitization platform, SFR/CRE lending), LendingOne,
        Rocade Capital. Inactive Series 7 and 63.
      </p>
      <p className="lede">
        Full page in progress—institutional pricing, scope templates, and
        approved-counsel onboarding materials are coming.
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
