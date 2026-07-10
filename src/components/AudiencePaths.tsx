import Link from "next/link";
import { AUDIENCES } from "@/content/audiences";

export default function AudiencePaths() {
  return (
    <section className="pathways" id="paths" aria-labelledby="paths-heading">
      <div className="pathways-intro">
        <div className="kicker">Find Your Legal Path</div>
        <h2 className="section-heading" id="paths-heading">
          Start with what is at stake—not a directory of legal terms.
        </h2>
        <p className="section-sub">
          Three doors. Each one leads to a focused set of engagements, pricing
          structures, and next steps built for that kind of client.
        </p>
      </div>
      <div className="pathways-grid">
        {AUDIENCES.map((audience, index) => (
          <Link
            href={`/${audience.slug}`}
            className="pathway-card"
            key={audience.slug}
            data-reveal
          >
            <span className="pathway-num">0{index + 1}</span>
            <span className="pathway-kicker">{audience.kicker}</span>
            <h3>{audience.navLabel}</h3>
            <p>{audience.short}</p>
            <span className="pathway-action">
              Enter this path <span aria-hidden="true">&rarr;</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
