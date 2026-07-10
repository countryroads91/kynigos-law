import type { Metadata } from "next";
import Link from "next/link";
import EngagementShapes from "@/components/EngagementShapes";
import SpearMark from "@/components/SpearMark";

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
            <li key={step.title} className="process-step" data-reveal>
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
          Zeal is claimed in every retainer letter. Ours is priced into it:
          we define the work first, then structure the fee so the firm carries
          real stakes in the outcome. Open any shape to see it on a matter.
        </p>
        <EngagementShapes />
        <p className="process-note">
          The matters shown are illustrative archetypes, not case results.
          Kynigos Law Firm, PLLC is licensed in the District of Columbia.
          Matters outside DC may require referral to local counsel. Fee
          structures are confirmed in the engagement letter for your specific
          matter.
        </p>
      </section>

      <section
        className="process process--band band-marked"
        aria-labelledby="rule-heading"
      >
        <SpearMark className="band-mark" />
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
            <Link href="/#first-move" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
