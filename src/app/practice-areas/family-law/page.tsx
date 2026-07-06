import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Family Law",
  description:
    "Divorce, custody, support, and prenuptial agreements in Washington, DC—priced as a flat fee or staged fixed fees, stated in writing before work begins.",
};

const SCOPE = [
  "Uncontested divorce",
  "Contested divorce",
  "Custody & visitation",
  "Child support & modifications",
  "Separation agreements",
  "Prenuptial agreements",
];

const STEPS = [
  {
    title: "Free consultation",
    body: "You describe the situation and get a straight answer on whether the firm should take the matter—and what the first stage actually requires.",
  },
  {
    title: "Fixed number in writing",
    body: "The next stage—strategy, filings, negotiation—is scoped and priced in the engagement letter before anything is billed.",
  },
  {
    title: "Work delivered",
    body: "You receive the agreement, filing, or strategy on the schedule stated in the engagement letter. If we misjudge the effort, that is our problem.",
  },
  {
    title: "You decide what's next",
    body: "Each stage closes with your decision to re-engage or walk away—never with a surprise invoice.",
  },
];

const PREPARE = [
  "Date and place of marriage",
  "Any pleadings already filed",
  "Existing agreements or court orders",
  "A financial snapshot—income, assets, debts",
  "Names and ages of children, if custody or support is at issue",
];

const FAQ = [
  {
    q: "What does it cost?",
    a: "Family law matters are priced as a defined flat fee or as staged fixed fees—one number per stage, stated in the engagement letter before work begins. There is no hourly rate and no retainer that drains while you wait.",
  },
  {
    q: "Are you licensed in my state?",
    a: "Kynigos Law Firm, PLLC is licensed in the District of Columbia only. If your matter belongs in another jurisdiction, you get a prompt referral to local counsel instead of a bill.",
  },
  {
    q: "How long will my case take?",
    a: "It depends on the matter and the court's calendar. What the firm controls—the schedule for each stage of work—is stated in the engagement letter.",
  },
  {
    q: "What if my divorce turns contested?",
    a: "Then the next stage gets its own scope and its own fixed number, and you decide whether to proceed. Escalation changes the price of the next stage; it never rewrites the price of the last one.",
  },
];

export default function FamilyLawPage() {
  return (
    <>
      <section className="hero hero--page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/practice-areas">Practice Areas</Link>
          <span className="crumb-sep">/</span>
          <span>Family Law</span>
        </nav>
        <div className="kicker">Practice Area</div>
        <h1 className="headline-line">Family Law</h1>
        <p className="subhead">
          <em>The hardest matters deserve the clearest prices.</em>
        </p>
        <p className="lede">
          Divorce, custody, and support are stressful enough without a meter
          running in the background. Kynigos represents DC clients through
          uncontested and contested divorce, custody and visitation, child
          support, and separation and prenuptial agreements—with each stage
          priced as a fixed number you approve before work begins.
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
          From an uncontested divorce that needs clean paperwork to a contested
          matter that needs a strategy, the engagement is built the same way:
          define the stage, fix the price, do the work.
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
              <h3>Negotiation &amp; disputes</h3>
            </div>
            <div className="games-cell">
              <span className="games-head">The objective</span>
              <p>
                Move the matter forward without letting conflict become a
                machine that runs on your money.
              </p>
            </div>
            <div className="games-cell">
              <span className="games-head">Our stake</span>
              <p>
                The firm re-earns the matter one stage at a time—if a stage
                takes longer than we scoped, we absorb it.
              </p>
            </div>
            <div className="games-cell">
              <span className="games-head">Fee shape</span>
              <p className="games-fee">Flat fee or staged fixed fees</p>
            </div>
          </div>
        </div>
        <div className="phil-callout">
          <em>Staged fixed fees</em> means each phase of your case—strategy,
          filings, negotiation, trial preparation—gets its own scope and its
          own fixed number, and you decide whether to proceed at every stage.
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
          None of this is required for the consultation—but the more of it you
          have, the more precisely the first stage can be scoped.
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
