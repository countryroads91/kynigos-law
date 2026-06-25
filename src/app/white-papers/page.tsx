import type { Metadata } from "next";
import WhitePaperGate from "@/components/WhitePaperGate";

export const metadata: Metadata = {
  title: "White Papers",
  description:
    "Formal economic analysis of legal fees—the principal-agent problem and the case against hourly billing. Download the Kynigos Law Firm white paper series.",
};

export default function WhitePapersPage() {
  return (
    <section className="hero">
      <div className="kicker">White Papers</div>
      <h1 className="headline-line">The economics, in full.</h1>
      <p className="subhead">The billing model is the argument, not a footnote.</p>
      <p className="lede">
        Our white papers make the formal case behind the firm: that hourly
        billing is a structural problem, not a question of individual character,
        and that aligning fees with outcomes is the fix. Each paper is grounded
        in the academic literature—principal-agent theory, behavioral economics,
        and industrial organization.
      </p>

      <div className="paper-feature">
        <div className="paper-feature-body">
          <div className="paper-tag">Paper 01 · Principal-Agent Theory</div>
          <h2 className="paper-title">Misaligned Incentives</h2>
          <p className="paper-sub">
            The principal-agent problem and the case against hourly billing.
          </p>
          <p className="paper-desc">
            When you hire an attorney who bills by the hour, you create a
            classic principal-agent problem: your lawyer has information you
            don't and an incentive to bill hours you may not need. This paper
            lays out the formal economics—from Stephen Ross's 1973 framing
            through modern game-theoretic models—and shows why a flat fee
            realigns the relationship.
          </p>
        </div>
        <div className="paper-gate">
          <div className="gate-label">Download the paper</div>
          <WhitePaperGate
            paper="Misaligned Incentives"
            file="/white-papers/misaligned-incentives.pdf"
            fileName="Kynigos-Misaligned-Incentives.pdf"
          />
        </div>
      </div>

      <p className="paper-more">
        More papers in the series—the market for lemons and flat fees as a
        quality signal, behavioral contract theory and the non-compete trap, and
        moral hazard in the legal opinion letter—are in production.
      </p>
    </section>
  );
}
