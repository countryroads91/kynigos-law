import type { Metadata } from "next";
import Link from "next/link";
import { essays, publications, formatDate, getPost, type Post } from "@/content/posts";
import { papers, getPaper } from "@/content/papers";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Essays, publications, and white papers from Kynigos Law Firm—personal perspective from the founder, institutional analysis from the firm, and the formal research beneath both.",
};

// The executive-summary teaser on paper cards: first sentence only.
function firstSentence(text: string): string {
  const end = text.indexOf(". ");
  return end === -1 ? text : text.slice(0, end + 1);
}

function byline(post: Post): string {
  return post.authorTitle
    ? `By ${post.author}, ${post.authorTitle}`
    : `By ${post.author}`;
}

function ArticleCard({ post }: { post: Post }) {
  const relatedPaper = post.relatedPaper ? getPaper(post.relatedPaper) : undefined;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`insight-card insight-card--${post.contentType}`}
    >
      <span className="insight-label">{post.label}</span>
      <h3 className="insight-title">{post.title}</h3>
      <p className="insight-dek">{post.dek}</p>
      {relatedPaper && (
        <p className="insight-relation">
          Based on the Kynigos white paper <em>{relatedPaper.title}</em>
        </p>
      )}
      <div className="insight-meta">
        <span className="insight-author">{byline(post)}</span>
        <span>{post.category}</span>
        <span>{formatDate(post.date)}</span>
        <span>{post.readingTime}</span>
      </div>
    </Link>
  );
}

export default function InsightsPage() {
  const featured = getPost("i-have-been-the-client");
  const essayPosts = essays();
  const publicationPosts = publications();

  return (
    <>
      <section className="hero hero--page">
        <div className="kicker">Insights</div>
        <h1 className="headline-line">The argument, in layers.</h1>
        <p className="subhead">
          One case against hourly billing, told in three voices.
        </p>
        <p className="lede">
          Everything we publish makes the same argument at a different depth:
          personal essays written by the founder about being on the client&rsquo;s
          side of the bill, Kynigos publications that translate the economics
          into plain language, and white papers that carry the formal models and
          the citations. Start wherever suits you—each layer points to the next.
        </p>

        {featured && (
          <article className="insight-card insight-card--essay">
            <span className="insight-label">
              {featured.label} · Why Kynigos Exists
            </span>
            <h2 className="insight-title">
              <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
            </h2>
            <p className="insight-dek">{featured.dek}</p>
            <p className="insight-relation">
              This is the why-the-firm-exists essay—the experience of being the
              client is the reason Kynigos runs on flat fees.{" "}
              <Link href={`/blog/${featured.slug}`}>Read the essay</Link> or{" "}
              <Link href="/about">learn about the firm</Link>.
            </p>
            <div className="insight-meta">
              <span className="insight-author">{byline(featured)}</span>
              <span>{featured.category}</span>
              <span>{formatDate(featured.date)}</span>
              <span>{featured.readingTime}</span>
            </div>
          </article>
        )}
      </section>

      <section id="essays" className="process">
        <div className="kicker">Personal Essays</div>
        <h2 className="section-heading">In the first person.</h2>
        <p className="section-sub">
          Written personally by the founder—personal perspective, not
          institutional analysis.
        </p>
        <div className="card-grid">
          {essayPosts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="publications" className="process process--band">
        <div className="kicker">Kynigos Publications</div>
        <h2 className="section-heading">The firm&rsquo;s analysis.</h2>
        <p className="section-sub">
          Institutional Kynigos analysis—the economics of legal fees in plain
          language, grounded in the white paper research.
        </p>
        <div className="card-grid">
          {publicationPosts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="papers" className="process">
        <div className="kicker">White Papers</div>
        <h2 className="section-heading">The research layer.</h2>
        <p className="section-sub">
          Formal economic analysis with full citations—the foundation the
          essays and publications stand on.
        </p>
        <div className="card-grid">
          {papers.map((paper) => (
            <Link
              key={paper.slug}
              href="/white-papers"
              className="insight-card insight-card--paper"
            >
              <span className="insight-label">{paper.tag}</span>
              <h3 className="insight-title">{paper.title}</h3>
              <p className="insight-dek">{firstSentence(paper.summary)}</p>
              <div className="insight-meta">
                <span className="insight-author">By {paper.author}</span>
                <span>{formatDate(paper.date)}</span>
                <span>{paper.readingTime}</span>
                <span>{paper.topics.join(" · ")}</span>
              </div>
            </Link>
          ))}
        </div>
        <p className="process-note">
          More papers are in production—behavioral contract theory and the
          non-compete trap, and moral hazard in the legal opinion letter.
        </p>
      </section>
    </>
  );
}
