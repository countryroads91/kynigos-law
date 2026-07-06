import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Practice Areas",
  description:
    "Family law, landlord-tenant, capital markets, and professional contract review in Washington, DC—each matched to a fee structure that puts the firm's skin in the game.",
};

const AREAS = [
  {
    href: "/practice-areas/family-law",
    eyebrow: "Flat fee or staged fixed fees",
    title: "Family Law",
    body: "Uncontested and contested divorce, custody and visitation, child support and modifications, separation and prenuptial agreements. Each stage is scoped and priced in writing before work begins, so the meter never decides how your divorce goes.",
    fee: "Staged fixed fees",
  },
  {
    href: "/practice-areas/landlord-tenant",
    eyebrow: "Fixed fee plus success component",
    title: "Landlord-Tenant",
    body: "Eviction and possession matters, DC Landlord-Tenant Branch filings, hearings, lease disputes, and notice defects. The fee pairs a fixed number with a success component—our upside is the outcome, not the number of hearings.",
    fee: "Fixed + success",
  },
  {
    href: "/practice-areas/capital-markets",
    eyebrow: "Flat fee per opinion",
    title: "Capital Markets",
    body: "DC-law legal opinion letters for institutional clients—CRE loans, SFR mortgages, preferred equity, LLC membership interests—and deal counsel for lenders and funds. Opinions carry a flat fee; deal counsel is quoted per transaction.",
    fee: "Quoted per transaction",
  },
  {
    href: "/practice-areas/contract-review",
    eyebrow: "Self-serve flat fee",
    title: "Professional Contract Review",
    body: "A self-serve product for physicians, dentists, and other professionals: full redline, phone consultation, and market analytics on your offer, delivered within 5 business days. Other documents—leases, NDAs, loan files—are quoted up front.",
    fee: "Flat fee, posted",
  },
];

export default function PracticeAreasPage() {
  return (
    <>
      <section className="hero hero--page">
        <div className="kicker">Practice Areas</div>
        <h1 className="headline-line">Four practices. One model.</h1>
        <p className="subhead">
          Every matter gets a fee structure that proves the zeal.
        </p>
        <p className="lede">
          Kynigos handles four kinds of legal work in the District of Columbia.
          They look different on the surface—a custody dispute is not an
          intercreditor agreement—but each one is priced the same way: a
          defined scope, a fixed number in writing, and a fee shape matched to
          the game being played.
        </p>
      </section>

      <section className="process" aria-labelledby="areas-heading">
        <div className="kicker">The Practices</div>
        <h2 className="process-heading" id="areas-heading">
          Where the firm goes to work
        </h2>
        <div className="examples-grid">
          {AREAS.map((area) => (
            <article className="example-card" key={area.href}>
              <span className="example-eyebrow">{area.eyebrow}</span>
              <h3 className="example-title">
                <Link href={area.href}>{area.title}</Link>
              </h3>
              <p className="example-body">{area.body}</p>
              <span className="skin-fee">{area.fee}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="process process--band" aria-labelledby="model-heading">
        <div className="kicker">The Shared Principle</div>
        <h2 className="process-heading" id="model-heading">
          The fee follows the game
        </h2>
        <p className="section-sub">
          A review problem takes a flat fee. A staged dispute takes staged
          fixed fees, so the firm re-earns the matter one stage at a time. A
          matter with a winnable outcome takes a fixed fee plus a success
          component. No practice area bills by the hour, because a fee that
          grows with your problem is a fee that roots for your problem.
        </p>
        <div className="cta-row">
          <Link href="/how-it-works" className="btn-secondary">
            See How It Works
          </Link>
        </div>
      </section>

      <section className="process" aria-labelledby="start-heading">
        <div className="kicker">Get Started</div>
        <h2 className="process-heading" id="start-heading">
          Start with a conversation
        </h2>
        <p className="section-sub">
          A free consultation scopes the matter and gives you a straight
          answer—including &ldquo;you don&rsquo;t need a lawyer for
          this.&rdquo;
        </p>
        <div className="cta-row">
          <Link href="/contact" className="btn-primary">
            Book A Free Consultation
          </Link>
          <Link href="/philosophy" className="btn-secondary">
            Read The Philosophy
          </Link>
        </div>
        <p className="process-note">
          Kynigos Law Firm, PLLC is licensed in the District of Columbia only.
          Matters outside DC are referred to local counsel. Fee structures are
          confirmed in the engagement letter for your specific matter.
        </p>
      </section>
    </>
  );
}
