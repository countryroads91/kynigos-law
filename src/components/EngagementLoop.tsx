import Link from "next/link";

// The engagement, reduced to the loop a client actually experiences. The
// fourth step is the model: re-engagement is earned at every gate.
const steps = [
  {
    num: "01",
    title: "Tell us what is at stake",
    body: "The document, the dispute, or the deal—and what a good outcome looks like to you.",
  },
  {
    num: "02",
    title: "Get a recommended next step",
    body: "A straight answer about what should be done and in what order—including “not yet” and “you don’t need a lawyer for this.”",
  },
  {
    num: "03",
    title: "Approve a defined scope and price",
    body: "The engagement letter states the deliverable and the number. Nothing starts until you approve both.",
  },
  {
    num: "04",
    title: "Decide what comes next",
    body: "Take the work and stop, or approve the next stage. Re-engagement is earned, never assumed.",
  },
];

export default function EngagementLoop() {
  return (
    <section className="process" id="how" aria-labelledby="loop-heading">
      <div className="kicker">How an Engagement Works</div>
      <h2 className="section-heading" id="loop-heading">
        Four steps. Then it repeats—or it stops.
      </h2>
      <ol className="loop-steps">
        {steps.map((s) => (
          <li className="process-step" key={s.num} data-reveal>
            <span className="process-num">{s.num}</span>
            <h3 className="process-title">{s.title}</h3>
            <p className="process-body">{s.body}</p>
          </li>
        ))}
      </ol>
      <p className="process-note">
        Kynigos Law Firm, PLLC is licensed in the District of Columbia.
        Matters outside DC may require referral to local counsel.
      </p>
      <div className="cta-row">
        <Link href="/how-it-works" className="btn-secondary">
          How Our Fees Work
        </Link>
      </div>
    </section>
  );
}
