import type { Metadata } from "next";
import Link from "next/link";
import PracticeDirectory from "@/components/PracticeDirectory";
import FeeDesign from "@/components/FeeDesign";
import SpearMark from "@/components/SpearMark";
import { PRACTICE_GROUPS, serviceCount } from "@/content/practices";

export const metadata: Metadata = {
  title: "Practice Areas",
  description:
    "Family law, employment, business and corporate, real estate, and capital markets counsel in Washington, DC—more than two dozen matters, each priced with a fee designed for its outcome.",
};

export default function PracticeAreasPage() {
  return (
    <>
      <section className="hero hero--page">
        <div className="kicker">Practice Areas</div>
        <h1 className="headline-line">Five practice groups. One discipline.</h1>
        <p className="subhead">
          From a custody dispute to a structured financing.
        </p>
        <p className="lede">
          Kynigos advises individuals, families, businesses, and institutions
          across the District of Columbia—{serviceCount()} kinds of matters
          organized into five practice groups. The matters differ; the
          discipline does not: a defined scope, a number in writing, and a fee
          shaped to the outcome it serves.
        </p>
        <nav className="pa-index" aria-label="Practice groups">
          {PRACTICE_GROUPS.map((group) => (
            <a key={group.slug} href={`#${group.slug}`} className="pa-index-link">
              <span className="pa-index-num" aria-hidden="true">
                {group.num}
              </span>
              {group.name}
            </a>
          ))}
        </nav>
      </section>

      <section className="process process--directory" aria-label="Practice directory">
        <PracticeDirectory />
      </section>

      <section
        className="process process--band band-marked"
        aria-labelledby="fee-heading"
      >
        <SpearMark className="band-mark" />
        <div className="kicker">Fee Design</div>
        <h2 className="process-heading" id="fee-heading">
          The fee is an instrument.
        </h2>
        <p className="section-sub">
          Different matters carry different objectives, different uncertainty,
          and different incentives. Kynigos designs the fee around all
          three—four shapes cover nearly everything the firm takes on, and the
          engagement letter states which one applies to yours.
        </p>
        <FeeDesign />
        <div className="cta-row">
          <Link href="/how-it-works" className="btn-secondary">
            How Fees Are Designed
          </Link>
        </div>
      </section>

      <section className="process" aria-labelledby="start-heading">
        <div className="kicker">Get Started</div>
        <h2 className="process-heading" id="start-heading">
          Start with a conversation
        </h2>
        <p className="section-sub">
          A free consultation scopes the matter and gives you a straight
          answer—including &ldquo;you don&rsquo;t need a lawyer for
          this.&rdquo;
        </p>
        <div className="cta-row">
          <Link href="/contact" className="btn-primary">
            Book A Free Consultation
          </Link>
          <Link href="/philosophy" className="btn-secondary">
            Read The Philosophy
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
