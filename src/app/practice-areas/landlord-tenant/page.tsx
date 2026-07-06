import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Landlord-Tenant",
  description:
    "Eviction and possession matters, DC Landlord-Tenant Branch filings, hearings, lease disputes, and notice defects—priced as a fixed fee plus a success component.",
};

const SCOPE = [
  "Eviction & possession matters",
  "DC Landlord-Tenant Branch filings",
  "Hearings",
  "Lease disputes",
  "Notice defects",
];

const STEPS = [
  {
    title: "Free consultation",
    body: "You walk through the notice, the lease, and the posture of the case, and get a straight answer on whether the firm should take it.",
  },
  {
    title: "Fixed number in writing",
    body: "The engagement letter states the fixed fee, defines the success component, and defines what counts as success—before anything is billed.",
  },
  {
    title: "Work delivered",
    body: "Filings, appearances, and negotiation on the schedule stated in the engagement letter and the court's calendar.",
  },
  {
    title: "You decide what's next",
    body: "If the matter enters a new phase, the next stage gets its own scope and its own number, and the decision to proceed is yours.",
  },
];

const PREPARE = [
  "The notice you received or served",
  "The lease and any amendments",
  "Any court papers already filed",
  "A record of payments and communications",
];

const FAQ = [
  {
    q: "What does it cost?",
    a: "Landlord-tenant matters are priced as a fixed fee plus a success component. The fixed number and the definition of success are both stated in the engagement letter before work begins—no hourly rate, no meter.",
  },
  {
    q: "Why a success component?",
    a: "Because hourly billing pays the lawyer more when the case takes longer. A success component points the firm's incentive at the outcome instead of at the number of hearings it takes to get there.",
  },
  {
    q: "Are you licensed in my state?",
    a: "Kynigos Law Firm, PLLC is licensed in the District of Columbia only. If your property or dispute sits outside DC, you get a prompt referral to local counsel.",
  },
  {
    q: "How fast does this move?",
    a: "The Landlord-Tenant Branch sets much of the pace. What the firm controls—the schedule for filings and preparation—is stated in the engagement letter.",
  },
];

export default function LandlordTenantPage() {
  return (
    <>
      <section className="hero hero--page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/practice-areas">Practice Areas</Link>
          <span className="crumb-sep">/</span>
          <span>Landlord-Tenant</span>
        </nav>
        <div className="kicker">Practice Area</div>
        <h1 className="headline-line">Landlord-Tenant</h1>
        <p className="subhead">
          <em>The fee is tied to the outcome, not the calendar.</em>
        </p>
        <p className="lede">
          Eviction and possession cases move through DC&rsquo;s
          Landlord-Tenant Branch on the court&rsquo;s schedule, not yours.
          Kynigos handles filings, hearings, lease disputes, and notice
          defects for DC clients—on a fee that pairs a fixed number with a
          success component, so the firm&rsquo;s upside is the result.
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
        <p className="section-sub">
          Possession cases often turn on details—a defective notice, a lease
          term nobody read closely, a filing that missed a requirement. The
          work is finding the detail that decides the case.
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
              <h3>Disputes with a winnable outcome</h3>
            </div>
            <div className="games-cell">
              <span className="games-head">The game</span>
              <p>
                Win the possession question—not rack up appearances while the
                case circles the docket.
              </p>
            </div>
            <div className="games-cell">
              <span className="games-head">The skin</span>
              <p>
                Part of the fee is earned only if the defined outcome is
                achieved. More hearings do not mean more fees.
              </p>
            </div>
            <div className="games-cell">
              <span className="games-head">Fee shape</span>
              <p className="games-fee">Fixed fee + success component</p>
            </div>
          </div>
        </div>
        <div className="phil-callout">
          <em>Hybrid</em> means the fixed portion covers the work regardless
          of result, and the success portion is defined in the engagement
          letter and earned only if that result is achieved.
        </div>
      </section>

      <section className="process" aria-labelledby="process-heading">
        <div className="kicker">The Process</div>
        <h2 className="process-heading" id="process-heading">
          Four steps, no meter
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
        <div className="kicker">Before You Call</div>
        <h2 className="process-heading" id="prepare-heading">
          What to prepare
        </h2>
        <p className="section-sub">
          Bring what you have—the documents below let the consultation get to
          the substance quickly.
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
          Start with a conversation
        </h2>
        <div className="cta-row">
          <Link href="/contact" className="btn-primary">
            Book A Free Consultation
          </Link>
          <Link href="/practice-areas" className="btn-secondary">
            All Practice Areas
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
