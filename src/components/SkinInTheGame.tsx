import Link from "next/link";

const arenas = [
  {
    num: "01 / Disputes",
    title: "Negotiation before litigation",
    game: "Choose the right next move: demand, respond, negotiate, escalate, or stop.",
    skin: "We have to re-earn the next stage. If this stage does not create confidence, you do not have to keep going.",
    fee: "Staged fixed fee",
  },
  {
    num: "02 / Review",
    title: "Contracts, advice, and opinions",
    game: "Get to a clear answer without turning a practical question into a research project.",
    skin: "Efficiency risk sits with us. If we misjudge the time, that is our problem, not yours.",
    fee: "Defined flat fee",
  },
  {
    num: "03 / Deals",
    title: "Transactions and value creation",
    game: "Improve the outcome: economics, protections, releases, timing, leverage, or certainty.",
    skin: "Where appropriate and permitted, part of the fee can be tied to measurable value created.",
    fee: "Fixed fee + success",
  },
];

export default function SkinInTheGame() {
  return (
    <section
      className="skin"
      id="skin-in-the-game"
      aria-labelledby="skin-heading"
    >
      <div className="skin-inner">
        <div className="kicker">Skin in the Game</div>
        <h2 className="section-heading" id="skin-heading">
          Different legal games require different kinds of skin.
        </h2>
        <p className="section-sub">
          Hourly billing pays the lawyer more when your problem takes longer.
          We structure every fee so the incentive points at your
          outcome—something to lose, something to prove, or something to earn.
        </p>

        <div className="skin-grid">
          {arenas.map((a) => (
            <article className="skin-card" key={a.num}>
              <span className="skin-num">{a.num}</span>
              <h3 className="skin-title">{a.title}</h3>
              <dl className="skin-blocks">
                <div className="skin-block">
                  <dt>The game</dt>
                  <dd>{a.game}</dd>
                </div>
                <div className="skin-block">
                  <dt>The skin</dt>
                  <dd>{a.skin}</dd>
                </div>
              </dl>
              <span className="skin-fee">{a.fee}</span>
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

        <a className="scroll-cue" href="#first-move">
          Ready when you are
          <span className="scroll-cue-arrow" aria-hidden="true">
            ↓
          </span>
        </a>
      </div>
    </section>
  );
}
