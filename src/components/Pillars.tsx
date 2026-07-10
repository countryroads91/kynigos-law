import Link from "next/link";
import SpearMark from "@/components/SpearMark";

// The brand framework, converted from adjectives into promises with evidence.
// Each pillar names the claim, then the mechanism that makes it true.
const pillars = [
  {
    num: "01",
    name: "Calculated",
    promise: "The plan comes before the work.",
    proof:
      "We begin where an investor would: the objective, the decision points, the downside, and the paths most likely to reach it—before prescribing any work. A decade in structured credit is the habit of pricing risk instead of narrating it.",
  },
  {
    num: "02",
    name: "Zealous",
    promise: "Zeal is claimed in every retainer letter. Ours is priced into it.",
    proof:
      "A defined objective, a price stated in advance, and a next stage we have to earn—advocacy you can verify in the engagement letter, not the brochure.",
  },
  {
    num: "03",
    name: "Invested",
    promise: "Our economics ride on delivering.",
    proof:
      "We carry the efficiency and scope risk we agreed to carry—and where the matter and the rules allow, part of the fee rides on closing, recovery, or another defined result. Our economics never improve just because your problem got slower.",
  },
];

export default function Pillars() {
  return (
    <section
      className="skin band-marked"
      id="pillars"
      aria-labelledby="pillars-heading"
    >
      <SpearMark className="band-mark" />
      <div className="skin-inner">
        <div className="kicker">The Framework</div>
        <h2 className="section-heading" id="pillars-heading">
          Calculated. Zealous. Invested.
        </h2>
        <p className="section-sub">
          Three words every firm could print. Here is what each one costs us.
        </p>

        <div className="pillar-grid">
          {pillars.map((p) => (
            <article className="pillar" key={p.num} data-reveal>
              <span className="pillar-num">{p.num}</span>
              <h3 className="pillar-name">{p.name}</h3>
              <p className="pillar-promise">{p.promise}</p>
              <p className="pillar-proof">{p.proof}</p>
            </article>
          ))}
        </div>

        <p className="skin-rule">
          The rule underneath: <em>Play to Win. Win to Play.</em> We keep
          playing only if the last stage gave you a reason to trust the next
          one.
        </p>

        <div className="cta-row">
          <Link href="/how-it-works" className="btn-secondary">
            How It Works
          </Link>
          <Link href="/philosophy" className="btn-secondary">
            Read The Philosophy
          </Link>
        </div>
      </div>
    </section>
  );
}
