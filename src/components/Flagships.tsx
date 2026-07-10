import Link from "next/link";
import { FEE_SHAPES, serviceCount, type FeeShapeKey } from "@/content/practices";

type Flagship = {
  num: string;
  name: string;
  blurb: string;
  fee: FeeShapeKey;
  /** Posted price or price note, when one exists. Never invented. */
  price?: string;
  href: string;
};

// The six engagements clients buy most—named products, not a directory.
// Breadth lives in /practice-areas; this section's job is recognition.
const FLAGSHIPS: Flagship[] = [
  {
    num: "01",
    name: "Staged-Fee Divorce",
    blurb:
      "Divorce priced the way it is decided: stage by stage, each with its own fixed number and a gate where you choose whether to continue.",
    fee: "staged",
    href: "/practice-areas/family-law",
  },
  {
    num: "02",
    name: "Professional Contract Review",
    blurb:
      "For physicians, dentists, executives, and professionals: a full redline, market analytics on the offer, and a walkthrough call before you sign.",
    fee: "flat",
    price: "From $444",
    href: "/practice-areas/contract-review",
  },
  {
    num: "03",
    name: "Business Counsel",
    blurb:
      "Contracts, governance, employment documents, and the running questions of an owner-led company—scoped engagements, not an open retainer.",
    fee: "quoted",
    href: "/businesses",
  },
  {
    num: "04",
    name: "Practice & Partner Transactions",
    blurb:
      "Buy-ins, buyouts, admissions, exits, and sales of professional practices—medical, dental, and otherwise—priced to the transaction.",
    fee: "quoted",
    href: "/businesses#practice-lifecycle",
  },
  {
    num: "05",
    name: "Private Lender & Deal Counsel",
    blurb:
      "Loan agreements, security packages, and preferred equity documents, negotiated by counsel from the principal side of the trade.",
    fee: "quoted",
    href: "/capital",
  },
  {
    num: "06",
    name: "DC Legal Opinion Letters",
    blurb:
      "DC-law opinions that close institutional deals—CRE loans, SFR mortgages, preferred equity, membership interests—flat fee per opinion.",
    fee: "flat",
    href: "/practice-areas/capital-markets",
  },
];

export default function Flagships() {
  return (
    <section
      className="process process--band"
      id="engagements"
      aria-labelledby="flagships-heading"
    >
      <div className="kicker">Flagship Engagements</div>
      <h2 className="section-heading" id="flagships-heading">
        The work we are most often hired to do.
      </h2>
      <p className="section-sub">
        Six named engagements, each with a defined deliverable and a fee shape
        stated before it begins. The full directory runs {serviceCount()}{" "}
        services across five practice groups.
      </p>
      <div className="flagship-grid">
        {FLAGSHIPS.map((f) => (
          <Link href={f.href} className="flagship-card" key={f.num} data-reveal>
            <span className="flagship-num" aria-hidden="true">
              {f.num}
            </span>
            <h3 className="flagship-name">{f.name}</h3>
            <p className="flagship-blurb">{f.blurb}</p>
            <span className="flagship-meta">
              <span className="skin-fee">{FEE_SHAPES[f.fee].label}</span>
              {f.price && <span className="flagship-price">{f.price}</span>}
            </span>
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
