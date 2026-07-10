import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Philosophy—Play to Win. Win to Play.",
  description:
    "The Kynigos philosophy: every fee is structured so the firm has something to lose, something to prove, or something to earn—and every stage must re-earn the next.",
};

export default function PhilosophyPage() {
  return (
    <>
      <section className="hero hero--page">
        <div className="kicker">Firm Philosophy</div>
        <h1 className="headline-line">Play to Win. Win to Play.</h1>
        <p className="subhead">Calculated. Zealous. Invested.</p>
        <p className="lede">
          Six words carry the whole firm. The first three are a promise about
          effort. The last three are a constraint on us—every stage of an
          engagement has to earn the next one.
        </p>
      </section>

      <section className="process" aria-labelledby="halves-heading">
        <h2 className="process-heading" id="halves-heading">
          Two halves, one principle
        </h2>
        <div className="phil-pair">
          <article className="phil-half">
            <span className="example-eyebrow">Play to Win</span>
            <p>
              Every attorney claims to be zealous. The question is whether the
              fee structure proves it. When the price is fixed—or tied to the
              outcome—effort stops being billable and starts being an
              investment. We are not paid to play; we are paid to win, so
              winning is the only strategy that pays.
            </p>
          </article>
          <article className="phil-half">
            <span className="example-eyebrow">Win to Play</span>
            <p>
              The firm does not own your matter; it rents it, one stage at a
              time. Each stage closes with a result and a decision that is
              yours alone: re-engage or walk away. If the last stage did not
              give you a reason to trust the next one, we have not earned the
              right to keep playing.
            </p>
          </article>
        </div>
        <div className="phil-callout">
          <em>Skin in the game</em> means the fee structure gives us something
          to lose, something to prove, or something to earn.
        </div>
      </section>

      <section className="process process--band" aria-labelledby="why-heading">
        <div className="kicker">Why It Exists</div>
        <h2 className="process-heading" id="why-heading">
          Hourly billing is an incentive problem, not a pricing problem
        </h2>
        <div className="phil-prose">
          <p>
            Economists call it a principal-agent problem: the person doing the
            work profits from its duration, not its outcome. The client carries
            every risk—scope, pace, efficiency—while the meter converts delay
            into revenue. Nobody has to act in bad faith for the result to be
            bad; the structure does it on its own.
          </p>
          <p>
            The fix is not a discount. It is a different structure. Name the
            game the client is actually playing—a dispute to resolve, a
            document to judge, a deal to improve—then price it so the
            firm&rsquo;s margin depends on judgment and efficiency, and the
            client&rsquo;s cost does not depend on the calendar. The fee
            follows the game. The full argument runs through two white papers
            and the blog, if you want it with citations.
          </p>
        </div>
        <div className="cta-row">
          <Link href="/white-papers" className="btn-secondary">
            Read The White Papers
          </Link>
          <Link href="/how-it-works" className="btn-secondary">
            See How It Works
          </Link>
        </div>
      </section>

      <section className="process process--band">
        <div className="rule-banner">
          <div className="kicker">Your Move</div>
          <h2 className="rule-heading">The first move is yours.</h2>
          <p className="rule-body">
            Start with a document, a situation, or thirty free minutes. Either
            way, you will know the price before the work begins.
          </p>
          <p className="process-note">
            Kynigos Law Firm, PLLC is a member of the District of Columbia
            Bar. Licensed in DC only—matters elsewhere get a prompt referral.
          </p>
          <div className="cta-row">
            <Link href="/#first-move" className="btn-primary">
              Get Started
            </Link>
            <Link href="/contact" className="btn-secondary">
              Book A Free Consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
