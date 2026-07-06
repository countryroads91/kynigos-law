import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Kynigos Law Firm, PLLC is a Washington, DC firm built around flat-fee and contingency pricing—a structural answer to hourly billing, not a discount on it.",
};

const destinations = [
  {
    href: "/how-it-works",
    title: "How It Works",
    blurb: "Four steps, no meter: scope, fixed price, delivery, your decision.",
  },
  {
    href: "/philosophy",
    title: "Philosophy",
    blurb: "Play to Win. Win to Play. The six words that run the firm.",
  },
  {
    href: "/about/attorney",
    title: "The Attorney",
    blurb: "Bayan Misaghi, Esq.—about a decade in institutional finance before law.",
  },
  {
    href: "/practice-areas",
    title: "Practice Areas",
    blurb: "Family law, capital markets, employment and contract review, business matters.",
  },
  {
    href: "/contact",
    title: "Contact",
    blurb: "Book a free consultation. You will know the price before the work begins.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="hero hero--page">
        <div className="kicker">About the Firm</div>
        <h1 className="headline-line">A law firm built like an investment.</h1>
        <p className="subhead">Calculated. Zealous. Invested.</p>
        <p className="lede">
          Kynigos Law Firm, PLLC is a Washington, DC firm built around flat-fee
          and contingency pricing—not as a discount on hourly billing, but as a
          structural answer to it. Every engagement is priced so the firm has
          something to lose, something to prove, or something to earn.
        </p>
      </section>

      <section className="process" aria-labelledby="origin-heading">
        <div className="kicker">Why Kynigos Exists</div>
        <h2 className="process-heading" id="origin-heading">
          The firm started as a client&rsquo;s complaint.
        </h2>
        <blockquote className="phil-quote">
          &ldquo;I have been the client. I have paid large retainers and
          watched the meter run before knowing if my lawyer was any
          good.&rdquo;
          <span className="phil-quote-attr">
            Bayan Misaghi, Esq. · Personal Essay
          </span>
        </blockquote>
        <div className="phil-prose">
          <p>
            That sentence opens the personal essay behind the firm. Kynigos
            exists because its founder hired lawyers, paid by the hour, and
            concluded the problem was not the lawyers—it was the structure that
            paid them for duration instead of outcomes. The firm is the answer
            he wanted to hire and could not find.
          </p>
        </div>
        <div className="cta-row">
          <Link href="/blog/i-have-been-the-client" className="btn-primary">
            Read the Essay
          </Link>
          <Link href="/philosophy" className="btn-secondary">
            Read the Philosophy
          </Link>
        </div>
      </section>

      <section className="process process--band" aria-labelledby="model-heading">
        <div className="rule-banner">
          <div className="kicker">The Model</div>
          <h2 className="rule-heading" id="model-heading">
            The fee follows the game.
          </h2>
          <p className="rule-body">
            First we name the game you are actually playing—a dispute to
            resolve, a document to judge, a deal to improve. Then we price it
            so our margin depends on judgment and efficiency, not on the
            calendar. Each stage closes with a result and your decision to
            re-engage, so the firm re-earns the matter one stage at a time.
          </p>
          <div className="cta-row">
            <Link href="/how-it-works" className="btn-secondary">
              See How It Works
            </Link>
            <Link href="/philosophy" className="btn-secondary">
              Read the Philosophy
            </Link>
          </div>
        </div>
      </section>

      <section className="process" aria-labelledby="jurisdiction-heading">
        <div className="kicker">Jurisdiction &amp; Licensure</div>
        <h2 className="process-heading" id="jurisdiction-heading">
          Licensed in the District of Columbia.
        </h2>
        <div className="phil-prose">
          <p>
            Kynigos Law Firm, PLLC is a member of the District of Columbia Bar
            and licensed in DC only. Matters arising outside the District get a
            prompt referral to local counsel—no guesswork, no borrowed
            jurisdiction.
          </p>
        </div>
      </section>

      <section className="process process--band" aria-labelledby="explore-heading">
        <div className="kicker">Go Deeper</div>
        <h2 className="process-heading" id="explore-heading">
          The rest of the firm, one page at a time
        </h2>
        <ul className="area-list">
          {destinations.map((d) => (
            <li key={d.href}>
              <Link href={d.href} className="area-link">
                <span className="area-title">{d.title}</span>
                <span className="area-blurb">{d.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
