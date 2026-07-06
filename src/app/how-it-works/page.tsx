import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How it Works",
  description:
    "How Kynigos scopes, prices, and handles matters: a free consultation, a fixed fee in writing, delivered work product, and your decision to re-engage. No hourly billing.",
};

const steps = [
  {
    title: "Free consultation",
    body: "You describe the matter and get a straight answer on whether the firm should take it—including “you don’t need a lawyer for this.”",
  },
  {
    title: "Fixed fee, defined step",
    body: "The next piece of work is scoped and priced in writing before anything is billed. The engagement letter states the number, not an hourly rate.",
  },
  {
    title: "Work product delivered",
    body: "You receive the filing, redline, opinion, or strategy on the schedule we stated. If we misjudge the time it takes, that is our problem.",
  },
  {
    title: "You decide what’s next",
    body: "Each stage closes with your decision to re-engage—never with a surprise invoice. We re-earn the matter one stage at a time.",
  },
];

const games = [
  {
    bucket: "Negotiation & disputes",
    game: "Move the matter forward without letting conflict become a machine.",
    skin: "We have to earn your confidence stage by stage.",
    fee: "Staged fixed fee",
  },
  {
    bucket: "Review & advice",
    game: "Give you a clear, usable answer without over-lawyering the problem.",
    skin: "We bear the risk of doing the work efficiently.",
    fee: "Defined flat fee",
  },
  {
    bucket: "Deal work",
    game: "Negotiate better economics, better terms, or better downside protection.",
    skin: "Where permitted, we can share in measurable upside.",
    fee: "Fixed fee + success component",
  },
];

const examples = [
  {
    eyebrow: "Document Review",
    title: "An employment contract lands in your inbox",
    body: "Professional Contract Review is $444, posted. Full redline, a phone call to walk through every change, market analytics on the offer—delivered within 5 business days. Other documents—leases, NDAs, loan files, settlements—are quoted the same way: one number, up front.",
    fee: "$444 flat, posted",
  },
  {
    eyebrow: "Transactions",
    title: "Your lender needs a DC opinion letter",
    body: "Opinion letters and deal counsel are scoped per transaction and quoted before signing. The fee reflects the document stack and the risk being opined on—not how many associates touched it.",
    fee: "Quoted per transaction",
  },
  {
    eyebrow: "Family Law",
    title: "A divorce with more questions than paperwork",
    body: "The first stage—strategy, filings, initial negotiation—is priced as a defined flat fee. If the matter escalates, the next stage gets its own fixed number and you decide whether to proceed. The meter never decides for you.",
    fee: "Staged fixed fees",
  },
  {
    eyebrow: "Disputes",
    title: "An eviction notice taped to the door",
    body: "Defense is priced as a fixed fee plus a success component earned only if the outcome is won. Our upside is your outcome—not the number of hearings it takes to get there.",
    fee: "Fixed + success",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="hero hero--page">
        <div className="kicker">How it Works</div>
        <h1 className="headline-line">Priced for results, not hours.</h1>
        <p className="subhead">Calculated. Zealous. Invested.</p>
        <p className="lede">
          Every engagement runs the same loop: scope the work, fix the price in
          writing, deliver, and let you decide what happens next. Here is the
          whole machine.
        </p>
      </section>

      <section className="process" aria-labelledby="flow-heading">
        <div className="kicker">The Flow</div>
        <h2 className="process-heading" id="flow-heading">
          Four steps. No meter.
        </h2>
        <ol className="process-steps process-steps--four">
          {steps.map((step, i) => (
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

      <section className="process process--band" aria-labelledby="games-heading">
        <div className="kicker">Fee Design</div>
        <h2 className="process-heading" id="games-heading">
          The fee is matched to the work.
        </h2>
        <p className="section-sub">
          Every engagement falls into one of three shapes. We define the work
          first, then structure the fee so the firm carries real stakes in the
          outcome.
        </p>
        <div className="games-board">
          {games.map((g) => (
            <div className="games-row" key={g.bucket}>
              <div className="games-cell games-cell--bucket">
                <span className="games-head">Engagement</span>
                <h3>{g.bucket}</h3>
              </div>
              <div className="games-cell">
                <span className="games-head">The objective</span>
                <p>{g.game}</p>
              </div>
              <div className="games-cell">
                <span className="games-head">Our stake</span>
                <p>{g.skin}</p>
              </div>
              <div className="games-cell">
                <span className="games-head">Fee shape</span>
                <p className="games-fee">{g.fee}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="process" aria-labelledby="examples-heading">
        <div className="kicker">In Practice</div>
        <h2 className="process-heading" id="examples-heading">
          What that looks like on real matters
        </h2>
        <div className="examples-grid">
          {examples.map((ex) => (
            <article className="example-card" key={ex.eyebrow}>
              <span className="example-eyebrow">{ex.eyebrow}</span>
              <h3 className="example-title">{ex.title}</h3>
              <p className="example-body">{ex.body}</p>
              <span className="skin-fee">{ex.fee}</span>
            </article>
          ))}
        </div>
        <p className="process-note">
          Kynigos Law Firm, PLLC is licensed in the District of Columbia.
          Matters outside DC may require referral to local counsel. Fee
          structures are confirmed in the engagement letter for your specific
          matter.
        </p>
      </section>

      <section className="process process--band" aria-labelledby="rule-heading">
        <div className="rule-banner">
          <div className="kicker">The Rule Underneath</div>
          <h2 className="rule-heading" id="rule-heading">
            Play to Win. Win to Play.
          </h2>
          <p className="rule-body">
            We should keep playing only if the last stage gave you a reason to
            trust the next one. That is the firm&rsquo;s philosophy, and it has
            a page of its own.
          </p>
          <div className="cta-row">
            <Link href="/philosophy" className="btn-secondary">
              Read The Philosophy
            </Link>
            <Link href="/#get-started" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
