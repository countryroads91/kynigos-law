import Link from "next/link";
import FirstMove from "@/components/FirstMove";
import SpearMark from "@/components/SpearMark";
import { FEE_SHAPES } from "@/content/practices";
import { getPost, formatDate } from "@/content/posts";
import type { Audience } from "@/content/audiences";

/**
 * Shared template for the three client-door landing pages. Each page answers,
 * in order: is this built for me, what exactly do you do for people like me,
 * why should I believe you, and what happens when I reach out.
 */
export default function AudiencePage({ audience }: { audience: Audience }) {
  const related = audience.relatedPosts
    .map((slug) => getPost(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <section className="hero hero--page">
        <div className="kicker">For {audience.doorLabel}</div>
        <h1 className="headline-line">{audience.headline}</h1>
        <p className="lede">{audience.lede}</p>
        <div className="cta-row">
          <a href="#first-move" className="btn-primary">
            Tell Us What&rsquo;s at Stake
          </a>
          <Link href="/how-it-works" className="btn-secondary">
            How Our Fees Work
          </Link>
        </div>
      </section>

      <section className="process" aria-labelledby={`${audience.slug}-who`}>
        <div className="kicker">Who This Is For</div>
        <h2 className="section-heading" id={`${audience.slug}-who`}>
          You will recognize yourself, or you won&rsquo;t.
        </h2>
        <ul className="who-list">
          {audience.whoFor.map((w) => (
            <li className="who-item" key={w} data-reveal>
              {w}
            </li>
          ))}
        </ul>
      </section>

      <section className="process" aria-labelledby={`${audience.slug}-matters`}>
        <div className="kicker">The Work</div>
        <h2 className="section-heading" id={`${audience.slug}-matters`}>
          Defined engagements, stated prices.
        </h2>
        <p className="section-sub">
          Every matter below is scoped in writing before it begins. The fee
          shape tells you how the firm carries risk alongside you.
        </p>
        <div className="flagship-grid">
          {audience.matters.map((m) =>
            m.href.startsWith("#") ? (
              <a href={m.href} className="flagship-card" key={m.name} data-reveal>
                <h3 className="flagship-name">{m.name}</h3>
                <p className="flagship-blurb">{m.blurb}</p>
                <span className="flagship-meta">
                  <span className="skin-fee">{FEE_SHAPES[m.fee].label}</span>
                </span>
              </a>
            ) : (
              <Link
                href={m.href}
                className="flagship-card"
                key={m.name}
                data-reveal
              >
                <h3 className="flagship-name">{m.name}</h3>
                <p className="flagship-blurb">{m.blurb}</p>
                <span className="flagship-meta">
                  <span className="skin-fee">{FEE_SHAPES[m.fee].label}</span>
                </span>
              </Link>
            ),
          )}
        </div>
        <div className="cta-row">
          <Link href="/practice-areas" className="btn-secondary">
            All Practice Areas
          </Link>
        </div>
      </section>

      <section
        className="skin band-marked"
        id={audience.strip.id}
        aria-labelledby={`${audience.slug}-strip`}
      >
        <SpearMark className="band-mark" />
        <div className="skin-inner">
          <div className="kicker">{audience.strip.kicker}</div>
          <h2 className="section-heading" id={`${audience.slug}-strip`}>
            {audience.strip.heading}
          </h2>
          <p className="strip-body">{audience.strip.body}</p>
          {audience.strip.bullets && (
            <ul className="strip-bullets">
              {audience.strip.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
          <div className="cta-row">
            <Link href={audience.strip.cta.href} className="btn-secondary">
              {audience.strip.cta.label}
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section
          className="process"
          aria-labelledby={`${audience.slug}-reading`}
        >
          <div className="kicker">Related Reading</div>
          <h2 className="section-heading" id={`${audience.slug}-reading`}>
            The argument, before you retain anyone.
          </h2>
          <div className="card-grid">
            {related.map((post) => (
              <Link
                href={`/blog/${post.slug}`}
                className={
                  post.contentType === "essay"
                    ? "insight-card insight-card--essay"
                    : "insight-card insight-card--publication"
                }
                key={post.slug}
                data-reveal
              >
                <span className="insight-label">{post.label}</span>
                <h3 className="insight-title">{post.title}</h3>
                <p className="insight-dek">{post.dek}</p>
                <div className="insight-meta">
                  <span className="insight-author">{post.author}</span>
                  <span>{formatDate(post.date)}</span>
                  <span>{post.readingTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <FirstMove prompt={audience.intakePrompt} />
    </>
  );
}
