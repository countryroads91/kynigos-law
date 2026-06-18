import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Family Law",
  description:
    "Flat-fee divorce, custody, and support in Washington, DC. Clear scope, defined price, no clock to feed.",
};

export default function FamilyLawPage() {
  return (
    <section className="hero">
      <div className="kicker">Practice Area</div>
      <h1 className="headline-line">Family Law</h1>
      <p className="subhead">
        Divorce, custody, support—priced by scope, not by hour.
      </p>
      <p className="lede">
        Uncontested and contested divorce, child custody and visitation, child
        support and modifications, separation and prenuptial agreements. Every
        engagement priced at a defined flat fee or a hybrid fixed-plus-success
        model. You know the cost before any work begins.
      </p>
      <p className="lede">
        Full page in progress—pricing tables, scope documents, and the
        PriceComparison calculator are coming.
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
