import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Landlord-Tenant",
  description:
    "DC eviction and landlord-tenant representation on a hybrid fixed-fee plus success-fee model.",
};

export default function LandlordTenantPage() {
  return (
    <section className="hero">
      <div className="kicker">Practice Area</div>
      <h1 className="headline-line">Landlord-Tenant</h1>
      <p className="subhead">
        Eviction and possession matters in DC, on a hybrid fixed-plus-success
        model.
      </p>
      <p className="lede">
        DC Landlord-Tenant Branch filings, hearings, judgments, and
        possession-side representation. Engagement is priced as a defined fixed
        fee plus a success-based component—incentives aligned with outcomes,
        not with the courtroom calendar.
      </p>
      <p className="lede">
        Full page in progress—scope, fee schedule, and intake checklist
        coming.
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
