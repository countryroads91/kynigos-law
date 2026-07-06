import Link from "next/link";

const areas = [
  {
    href: "/practice-areas/family-law",
    eyebrow: "Flat Fee · Staged",
    title: "Family Law",
    body: "Divorce, custody, support, and prenuptial agreements—each stage priced as a defined flat fee before work begins.",
    fee: "Staged fixed fees",
  },
  {
    href: "/practice-areas/landlord-tenant",
    eyebrow: "Fixed + Success",
    title: "Landlord-Tenant",
    body: "Eviction and possession matters in DC, priced as a fixed fee plus a success component earned only if the outcome is won.",
    fee: "Fixed + success",
  },
  {
    href: "/practice-areas/capital-markets",
    eyebrow: "Per Opinion · Per Deal",
    title: "Capital Markets",
    body: "DC-law opinion letters and deal counsel for lenders and funds—scoped and quoted per transaction, before signing.",
    fee: "Quoted per transaction",
  },
  {
    href: "/practice-areas/contract-review",
    eyebrow: "$444 Flat · Posted",
    title: "Professional Contract Review",
    body: "Physicians, dentists, professionals—a full redline, a call to walk through every change, and market analytics on your offer.",
    fee: "$444 flat",
  },
];

export default function PracticeOverview() {
  return (
    <section
      className="process"
      id="practice-areas"
      aria-labelledby="practices-heading"
    >
      <div className="kicker">Practice Areas</div>
      <h2 className="section-heading" id="practices-heading">
        Four practices. One pricing principle.
      </h2>
      <p className="section-sub">
        Whatever the matter, the structure is the same: a defined scope and a
        number you see before the work begins.
      </p>
      <div className="examples-grid">
        {areas.map((a) => (
          <Link href={a.href} className="example-card practice-card" key={a.href}>
            <span className="example-eyebrow">{a.eyebrow}</span>
            <h3 className="example-title">{a.title}</h3>
            <p className="example-body">{a.body}</p>
            <span className="skin-fee">{a.fee}</span>
          </Link>
        ))}
      </div>
      <div className="cta-row">
        <Link href="/practice-areas" className="btn-secondary">
          All Practice Areas
        </Link>
      </div>
    </section>
  );
}
