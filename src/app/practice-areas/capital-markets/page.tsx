import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Capital Markets",
  description:
    "DC-law legal opinion letters for institutional clients—CRE loans, SFR mortgages, preferred equity, LLC membership interests—and deal counsel for lenders and funds. Flat fee per opinion; deal counsel quoted per transaction.",
};

const OPINION_SCOPE = [
  "CRE loans",
  "SFR mortgages",
  "Preferred equity",
  "LLC membership interests",
];

const DEAL_SCOPE = [
  "Loan agreements",
  "Intercreditor agreements",
  "Security agreements",
  "Preferred equity documents",
];

const STEPS = [
  {
    title: "Scoping call",
    body: "You describe the transaction, the documents, and the closing timeline. The firm confirms whether the opinion or engagement is one it should render.",
  },
  {
    title: "Fixed number in writing",
    body: "Opinions carry a flat fee; deal counsel is quoted per transaction. Either way, the number is in the engagement letter before work begins.",
  },
  {
    title: "Work delivered",
    body: "The opinion letter or negotiated documents are delivered against the closing timeline stated in the engagement letter.",
  },
  {
    title: "You decide what's next",
    body: "Repeat business is earned deal by deal. The next transaction gets its own scope and its own quote.",
  },
];

const PREPARE = [
  "The deal documents",
  "The closing timeline",
  "The opinion recipient and reliance parties",
  "The term sheet or commitment, if one exists",
];

const FAQ = [
  {
    q: "What does it cost?",
    a: "Opinion letters carry a flat fee per opinion, set by the document stack and the matters being opined on. Deal counsel is quoted per transaction. Both numbers are stated in writing before the engagement starts—not reconstructed from timesheets after closing.",
  },
  {
    q: "Can you opine on non-DC law?",
    a: "Opinions are rendered on DC law only. Multi-state opinions require co-counsel in the relevant jurisdictions, which the firm can help coordinate.",
  },
  {
    q: "Who is this for?",
    a: "Institutional clients—lenders, funds, and asset managers who need a DC-law opinion to close, or who need their loan, intercreditor, security, or preferred equity documents negotiated and papered.",
  },
  {
    q: "How fast can you turn an opinion?",
    a: "Turnaround is driven by the document stack and the closing timeline, and is stated in the engagement letter. Bring the timeline to the scoping call and you get a committed date, not an estimate.",
  },
];

export default function CapitalMarketsPage() {
  return (
    <>
      <section className="hero hero--page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/practice-areas">Practice Areas</Link>
          <span className="crumb-sep">/</span>
          <span>Capital Markets</span>
        </nav>
        <div className="kicker">Practice Area</div>
        <h1 className="headline-line">Capital Markets</h1>
        <p className="subhead">
          <em>Opinion letters and deal counsel, priced like a deal term.</em>
        </p>
        <p className="lede">
          Lenders, funds, and asset managers need two things from outside
          counsel: a DC-law opinion that closes the deal, and documents
          negotiated by someone who has sat on the principal side of the
          table. Kynigos renders legal opinion letters for institutional
          clients and acts as deal counsel on credit and preferred equity
          transactions—at a flat fee per opinion, quoted per transaction for
          deal work.
        </p>
      </section>

      <section className="process" aria-labelledby="scope-heading">
        <div className="kicker">Scope</div>
        <h2 className="process-heading" id="scope-heading">
          What Kynigos does
        </h2>
        <h3 className="process-title">Legal opinion letters, DC law</h3>
        <ul className="fork-chips">
          {OPINION_SCOPE.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3 className="process-title">Deal counsel for lenders and funds</h3>
        <ul className="fork-chips">
          {DEAL_SCOPE.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="section-sub">
          Opinions are rendered on DC law only. Multi-state opinions require
          co-counsel in the relevant jurisdictions.
        </p>
      </section>

      <section className="process process--band" aria-labelledby="fee-heading">
        <div className="kicker">The Fee</div>
        <h2 className="process-heading" id="fee-heading">
          How the fee works
        </h2>
        <div className="games-board">
          <div className="games-row">
            <div className="games-cell games-cell--bucket">
              <span className="games-head">Bucket</span>
              <h3>Deal work</h3>
            </div>
            <div className="games-cell">
              <span className="games-head">The game</span>
              <p>
                Close the transaction—clean opinions, tight documents, no
                surprises at the closing table.
              </p>
            </div>
            <div className="games-cell">
              <span className="games-head">The skin</span>
              <p>
                The fee is fixed against the scope, so efficiency is the
                firm&rsquo;s problem—and repeat mandates are earned deal by
                deal.
              </p>
            </div>
            <div className="games-cell">
              <span className="games-head">Fee shape</span>
              <p className="games-fee">
                Flat fee per opinion; deal counsel quoted per transaction
              </p>
            </div>
          </div>
        </div>
        <div className="phil-callout">
          <em>Quoted per transaction</em> means the fee reflects the document
          stack and the risk being opined on—not how many associates touched
          the file.
        </div>
      </section>

      <section className="process" aria-labelledby="process-heading">
        <div className="kicker">The Process</div>
        <h2 className="process-heading" id="process-heading">
          Four steps, one closing
        </h2>
        <ol className="process-steps process-steps--four">
          {STEPS.map((step, i) => (
            <li key={step.title} className="process-step">
              <span className="process-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="process-title">{step.title}</h3>
              <p className="process-body">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="process" aria-labelledby="prepare-heading">
        <div className="kicker">Before The Call</div>
        <h2 className="process-heading" id="prepare-heading">
          What to prepare
        </h2>
        <p className="section-sub">
          A quote is only as good as the scope behind it. The items below let
          the firm commit to a number and a date on the first call.
        </p>
        <ul className="fork-chips">
          {PREPARE.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="process process--band" aria-labelledby="faq-heading">
        <div className="kicker">Questions</div>
        <h2 className="process-heading" id="faq-heading">
          Asked and answered
        </h2>
        <div className="examples-grid">
          {FAQ.map((item) => (
            <article className="example-card" key={item.q}>
              <span className="example-eyebrow">FAQ</span>
              <h3 className="example-title">{item.q}</h3>
              <p className="example-body">{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="process" aria-labelledby="cta-heading">
        <div className="kicker">Get Started</div>
        <h2 className="process-heading" id="cta-heading">
          Bring the deal
        </h2>
        <div className="cta-row">
          <Link href="/contact" className="btn-primary">
            Schedule a Scoping Call
          </Link>
          <Link href="/practice-areas" className="btn-secondary">
            All Practice Areas
          </Link>
        </div>
        <p className="process-note">
          Kynigos Law Firm, PLLC is licensed in the District of Columbia only.
          Opinions are rendered on DC law; multi-state opinions require
          co-counsel. Fee structures are confirmed in the engagement letter
          for your specific transaction.
        </p>
      </section>
    </>
  );
}
