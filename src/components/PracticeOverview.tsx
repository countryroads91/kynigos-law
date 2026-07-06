import Link from "next/link";
import { PRACTICE_GROUPS } from "@/content/practices";

/**
 * Editorial index of the five practice groups. Each row links into its
 * anchor section on the /practice-areas directory; the small service run
 * under each name is a preview, not the full list.
 */
export default function PracticeOverview() {
  return (
    <section
      className="process"
      id="practice-areas"
      aria-labelledby="practices-heading"
    >
      <div className="kicker">Practice Areas</div>
      <h2 className="section-heading" id="practices-heading">
        One firm for the whole field.
      </h2>
      <p className="section-sub">
        Five practice groups, from family law to structured finance. Whatever
        the matter, the structure is the same: a defined scope and a number
        you see before the work begins.
      </p>
      <div className="practice-index">
        {PRACTICE_GROUPS.map((group) => (
          <Link
            href={`/practice-areas#${group.slug}`}
            className="practice-row"
            key={group.slug}
            data-reveal
          >
            <span className="practice-row-num" aria-hidden="true">
              {group.num}
            </span>
            <span className="practice-row-main">
              <span className="practice-row-name">{group.name}</span>
              <span className="practice-row-services">
                {group.services
                  .slice(0, 4)
                  .map((s) => s.name)
                  .join(" · ")}
              </span>
            </span>
            <span className="practice-row-arrow" aria-hidden="true">
              &rarr;
            </span>
          </Link>
        ))}
      </div>
      <div className="cta-row">
        <Link href="/practice-areas" className="btn-secondary">
          All Practice Areas
        </Link>
      </div>
    </section>
  );
}
