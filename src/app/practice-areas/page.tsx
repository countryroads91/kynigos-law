import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Practice Areas",
  description:
    "Family law, landlord-tenant, capital markets, and contract review in Washington, DC—each priced by scope, not by the hour.",
};

const AREAS = [
  {
    href: "/practice-areas/family-law",
    title: "Family Law",
    blurb: "Divorce, custody, support, and prenuptial agreements.",
  },
  {
    href: "/practice-areas/landlord-tenant",
    title: "Landlord-Tenant",
    blurb: "Eviction defense and housing matters before the DC courts.",
  },
  {
    href: "/practice-areas/capital-markets",
    title: "Capital Markets",
    blurb: "Opinion letters and transaction support from institutional experience.",
  },
  {
    href: "/practice-areas/contract-review",
    title: "Contract Review",
    blurb: "Employment, non-compete, and partnership agreements reviewed with rigor.",
  },
];

export default function PracticeAreasPage() {
  return (
    <section className="hero">
      <div className="kicker">Practice Areas</div>
      <h1 className="headline-line">Four disciplines. One model.</h1>
      <p className="subhead">Priced by scope, not by the hour.</p>
      <ul className="area-list">
        {AREAS.map((area) => (
          <li key={area.href}>
            <Link href={area.href} className="area-link">
              <span className="area-title">{area.title}</span>
              <span className="area-blurb">{area.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="cta-row">
        <Link href="/contact" className="btn-primary">
          Book A Free Consultation
        </Link>
        <Link href="/" className="btn-secondary">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
