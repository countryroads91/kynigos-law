import Link from "next/link";
import { AUDIENCES } from "@/content/audiences";

/**
 * The three client doors—the site's information architecture in one section.
 * The visitor's first job is recognizing themselves, not decoding the firm;
 * each door leads to a curated landing page for that client type.
 */
export default function ThreeDoors() {
  return (
    <section className="process" id="doors" aria-labelledby="doors-heading">
      <div className="kicker">Who We Serve</div>
      <h2 className="section-heading" id="doors-heading">
        Three doors. One discipline.
      </h2>
      <p className="section-sub">
        The firm is built around three kinds of client. Start where you
        stand—every path ends the same way: a defined scope and a price you
        see before the work begins.
      </p>
      <div className="door-grid">
        {AUDIENCES.map((a) => (
          <Link
            href={`/${a.slug}`}
            className="door-card"
            key={a.slug}
            data-reveal
          >
            <span className="door-num" aria-hidden="true">
              {a.num}
            </span>
            <h3 className="door-title">{a.doorLabel}</h3>
            <p className="door-blurb">{a.doorBlurb}</p>
            <span className="door-matters">{a.doorMatters.join(" · ")}</span>
            <span className="door-cue">
              Enter
              <span className="door-arrow" aria-hidden="true">
                &rarr;
              </span>
            </span>
          </Link>
        ))}
      </div>
      <p className="process-note">
        Not sure which door is yours? Skip them all and{" "}
        <a href="#first-move">tell us what you are trying to accomplish</a>.
      </p>
    </section>
  );
}
