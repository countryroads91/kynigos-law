import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Professional Contract Review",
  description:
    "Flat-fee contract review for physicians, dentists, and other professionals: $444 for a full redline, phone consultation, and market analytics—delivered within 5 business days.",
};

const SCOPE = [
  "Physician employment agreements",
  "Dentist employment agreements",
  "Professional employment contracts",
  "Severance negotiation",
  "Non-compete questions",
];

const DOCS = [
  "Leases",
  "NDAs",
  "Loan documents",
  "Settlement agreements",
  "Employment agreements",
];

const STEPS = [
  {
    title: "Submit your document",
    body: "Send the contract. Online checkout is coming soon—until then, email it to info@kynigos.law and the firm will confirm receipt and arrange payment.",
  },
  {
    title: "Attorney contact within 24 hours",
    body: "The attorney contacts you within 24 hours of payment to confirm scope, flag anything unusual, and begin work.",
  },
  {
    title: "Redline and call within 5 business days",
    body: "You receive the full redline, market analytics on your offer, and a phone consultation walking through every change—within 5 business days of submission.",
  },
];

const PREPARE = [
  "The contract itself",
  "The offer letter, if separate",
  "Any prior drafts or versions",
  "Your questions and priorities",
];

const FAQ = [
  {
    q: "What does $444 include?",
    a: "A full redline of the contract, market analytics on the offer, and a phone consultation walking through every change—delivered within 5 business days of submission. One price, posted, no add-ons discovered later.",
  },
  {
    q: "What about documents that aren't professional employment contracts?",
    a: "The firm reviews other documents too—leases, NDAs, loan documents, settlement agreements. Those are quoted up front the same way: one number before any work begins.",
  },
  {
    q: "Are you licensed in my state?",
    a: "Kynigos Law Firm, PLLC is licensed in the District of Columbia only. Matters that require counsel in another jurisdiction get a prompt referral.",
  },
  {
    q: "How fast is it, really?",
    a: "Attorney contact within 24 hours of payment; redline and consultation within 5 business days of contract submission. Those timelines are part of the product, not an aspiration.",
  },
];

export default function ContractReviewPage() {
  return (
    <>
      <section className="hero hero--page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/practice-areas">Practice Areas</Link>
          <span className="crumb-sep">/</span>
          <span>Professional Contract Review</span>
        </nav>
        <div className="kicker">Practice Area</div>
        <h1 className="headline-line">Professional Contract Review</h1>
        <p className="subhead">
          <em>One contract. One price. Posted.</em>
        </p>
        <p className="lede">
          Physicians, dentists, and other professionals sign the most
          consequential contract of their careers with the least leverage and
          the least information. Kynigos reviews it for a flat $444: a full
          redline, market analytics on your offer, and a phone consultation
          walking through every change—delivered within 5 business days.
        </p>
      </section>

      <section className="process" aria-labelledby="scope-heading">
        <div className="kicker">Scope</div>
        <h2 className="process-heading" id="scope-heading">
          What Kynigos does
        </h2>
        <ul className="fork-chips">
          {SCOPE.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3 className="process-title">Other documents, quoted up front</h3>
        <ul className="fork-chips">
          {DOCS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="section-sub">
          The $444 product covers professional employment contracts. Other
          document reviews get their own fixed quote before any work
          begins—one number, up front, the same way.
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
              <span className="games-head">Engagement</span>
              <h3>Review &amp; advice</h3>
            </div>
            <div className="games-cell">
              <span className="games-head">The objective</span>
              <p>
                Give you a clear, usable answer on your contract without
                over-lawyering the problem.
              </p>
            </div>
            <div className="games-cell">
              <span className="games-head">Our stake</span>
              <p>
                The price is posted before you ever call. The firm bears the
                risk of doing the work efficiently.
              </p>
            </div>
            <div className="games-cell">
              <span className="games-head">Fee shape</span>
              <p className="games-fee">$444 flat, posted</p>
            </div>
          </div>
        </div>
        <div className="phil-callout">
          Online checkout is coming soon. Until then, email your contract to{" "}
          <a href="mailto:info@kynigos.law">info@kynigos.law</a> and the firm
          will confirm receipt and arrange payment.
        </div>
      </section>

      <section className="process" aria-labelledby="process-heading">
        <div className="kicker">The Process</div>
        <h2 className="process-heading" id="process-heading">
          Self-serve, on a clock the firm keeps
        </h2>
        <ol className="process-steps">
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
        <div className="kicker">Before You Submit</div>
        <h2 className="process-heading" id="prepare-heading">
          What to prepare
        </h2>
        <p className="section-sub">
          The review starts the moment the document lands—having these ready
          keeps the 5-business-day clock honest.
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
          Send the contract
        </h2>
        <div className="cta-row">
          <a href="mailto:info@kynigos.law" className="btn-primary">
            Email Your Contract
          </a>
          <Link href="/contact" className="btn-secondary">
            Book A Free Consultation
          </Link>
        </div>
        <p className="process-note">
          Kynigos Law Firm, PLLC is licensed in the District of Columbia only.
          Matters outside DC are referred to local counsel. The $444 fee and
          scope are confirmed in writing before the review begins.
        </p>
      </section>
    </>
  );
}
