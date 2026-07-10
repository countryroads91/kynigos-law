import Link from "next/link";

const steps = [
  ["01", "Tell us what is at stake.", "Start with the objective, deadline, jurisdiction, and documents already in hand."],
  ["02", "Receive a recommended next step.", "We identify the smallest useful engagement—not a generic retainer."],
  ["03", "Approve a scope and price.", "The deliverable, boundaries, and fee are stated in writing before work begins."],
  ["04", "Decide what comes next.", "Receive the work, assess the result, and choose whether the next stage is worth buying."],
];

export default function EngagementLoop() {
  return (
    <section className="engagement-loop" aria-labelledby="loop-heading">
      <div className="engagement-loop-head">
        <div className="kicker">How an Engagement Works</div>
        <h2 className="section-heading" id="loop-heading">
          Four decisions. No open-ended meter.
        </h2>
        <Link href="/how-it-works" className="text-link">
          See fee structures and examples <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
      <ol className="loop-steps">
        {steps.map(([num, title, body]) => (
          <li key={num} data-reveal>
            <span>{num}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
