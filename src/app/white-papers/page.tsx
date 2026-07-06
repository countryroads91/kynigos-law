import type { Metadata } from "next";
import Link from "next/link";
import WhitePaperGate from "@/components/WhitePaperGate";
import { papers, type Paper } from "@/content/papers";
import { getPost, formatDate } from "@/content/posts";

export const metadata: Metadata = {
  title: "White Papers",
  description:
    "Formal economic analysis of legal fees—the principal-agent problem and the case against hourly billing. Download the Kynigos Law Firm white paper series.",
};

function jsonLd(paper: Paper) {
  return {
    "@context": "https://schema.org",
    "@type": "Report",
    name: paper.title,
    description: paper.description,
    datePublished: paper.date,
    author: { "@type": "Organization", name: "Kynigos Law Firm, PLLC" },
    publisher: { "@type": "Organization", name: "Kynigos Law Firm, PLLC" },
  };
}

export default function WhitePapersPage() {
  return (
    <section className="hero hero--page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(papers.map(jsonLd)),
        }}
      />
      <div className="kicker">White Papers</div>
      <h1 className="headline-line">The economics, in full.</h1>
      <p className="subhead">The billing model is the argument, not a footnote.</p>
      <p className="lede">
        Our white papers make the formal case behind the firm: that hourly
        billing is a structural problem, not a question of individual character,
        and that aligning fees with outcomes is the fix. Each paper is grounded
        in the academic literature—principal-agent theory, behavioral economics,
        and industrial organization.
      </p>

      {papers.map((paper) => {
        const relatedPosts = paper.relatedPosts
          .map((slug) => getPost(slug))
          .filter((post) => post !== undefined);
        return (
          <div className="paper-feature" key={paper.slug}>
            <div className="paper-feature-body">
              <div className="paper-tag">{paper.tag}</div>
              <h2 className="paper-title">{paper.title}</h2>
              <p className="paper-sub">{paper.sub}</p>
              <span className="eyebrow">Executive Summary</span>
              <p className="paper-desc">{paper.summary}</p>
              <div className="insight-meta">
                <span className="insight-author">{paper.author}</span>
                <span>{formatDate(paper.date)}</span>
                <span>{paper.readingTime}</span>
                <span>{paper.topics.join(" · ")}</span>
              </div>
              {relatedPosts.map((post) => (
                <p className="insight-relation" key={post.slug}>
                  Introduced in the Kynigos publication{" "}
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </p>
              ))}
            </div>
            <div className="paper-gate">
              <div className="gate-label">Download the paper</div>
              <WhitePaperGate
                paper={paper.title}
                file={paper.file}
                fileName={paper.fileName}
              />
            </div>
          </div>
        );
      })}

      <p className="paper-more">
        More papers in the series—behavioral contract theory and the non-compete
        trap, and moral hazard in the legal opinion letter—are in production.
      </p>
    </section>
  );
}
