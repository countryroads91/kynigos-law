import Link from "next/link";
import { getPost, formatDate } from "@/content/posts";
import { getPaper } from "@/content/papers";

// Three voices, one system: a personal essay, a firm publication, and the
// research underneathâ€”each visibly its own content type, never a flat grid.
export default function FeaturedInsights() {
  const essay = getPost("i-have-been-the-client");
  const publication = getPost("your-lawyer-has-an-incentive-problem");
  const paper = getPaper("misaligned-incentives");
  if (!essay || !publication || !paper) return null;

  return (
    <section
      className="process process--band"
      id="insights"
      aria-labelledby="insights-heading"
    >
      <div className="kicker">Insights</div>
      <h2 className="section-heading" id="insights-heading">
        Read the argument before you retain anyone.
      </h2>
      <p className="section-sub">
        A personal essay on why the firm exists, the firm&rsquo;s analysis, and
        the research underneath it.
      </p>
      <div className="card-grid card-grid--wide">
        <Link
          href={`/blog/${essay.slug}`}
          className="insight-card insight-card--essay" data-reveal
        >
          <span className="insight-label">Personal Essay Â· Why Kynigos Exists</span>
          <h3 className="insight-title">{essay.title}</h3>
          <p className="insight-dek">{essay.dek}</p>
          <div className="insight-meta">
            <span className="insight-author">{essay.author}</span>
            <span>{formatDate(essay.date)}</span>
            <span>{essay.readingTime}</span>
          </div>
        </Link>
        <Link
          href={`/blog/${publication.slug}`}
          className="insight-card insight-card--publication" data-reveal
        >
          <span className="insight-label">Kynigos Publication</span>
          <h3 className="insight-title">{publication.title}</h3>
          <p className="insight-dek">{publication.dek}</p>
          <p className="insight-relation">
            Based on the Kynigos white paper <em>{paper.title}</em>
          </p>
          <div className="insight-meta">
            <span className="insight-author">{publication.author}</span>
            <span>{formatDate(publication.date)}</span>
            <span>{publication.readingTime}</span>
          </div>
        </Link>
        <Link href="/white-papers" className="insight-card insight-card--paper" data-reveal>
          <span className="insight-label">White Paper</span>
          <h3 className="insight-title">{paper.title}</h3>
          <p className="insight-dek">{paper.sub}</p>
          <div className="insight-meta">
            <span className="insight-author">{paper.author}</span>
            <span>{paper.readingTime}</span>
          </div>
        </Link>
      </div>
      <div className="cta-row" style={{ marginTop: 32 }}>
        <Link href="/insights" className="btn-secondary">
          All Insights
        </Link>
      </div>
    </section>
  );
}
