import Link from "next/link";
import { AUDIENCES } from "@/content/audiences";

const engagements = [
  AUDIENCES[0].services[0],
  AUDIENCES[0].services[1],
  AUDIENCES[1].services[0],
  AUDIENCES[1].services[1],
  AUDIENCES[2].services[0],
  AUDIENCES[2].services[1],
];

export default function FlagshipEngagements() {
  return (
    <section
      className="engagements"
      id="engagements"
      aria-labelledby="engagements-heading"
    >
      <div className="engagements-head">
        <div>
          <div className="kicker">Flagship Engagements</div>
          <h2 className="section-heading" id="engagements-heading">
            Buy a defined piece of legal judgment.
          </h2>
        </div>
        <p className="section-sub">
          The work begins with an objective, a deliverable, and a price. Larger
          matters move in stages; repeat work can be structured as a defined
          portfolio or recurring scope.
        </p>
      </div>
      <div className="engagement-list">
        {engagements.map((engagement, index) => (
          <Link
            href={engagement.href}
            className="engagement-row"
            key={engagement.title}
            data-reveal
          >
            <span className="engagement-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="engagement-main">
              <span className="engagement-title">{engagement.title}</span>
              <span className="engagement-body">{engagement.body}</span>
            </span>
            <span className="engagement-fee">{engagement.fee}</span>
            <span className="engagement-arrow" aria-hidden="true">&rarr;</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
