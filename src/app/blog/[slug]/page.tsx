import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { posts, getPost, formatDate, type Post } from "@/content/posts";
import { getPaper } from "@/content/papers";
import NewsletterSignup from "@/components/NewsletterSignup";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    // Authorship is the point: essays carry the personal (unnamed) byline,
    // publications the firm's—metadata must match the visible byline exactly.
    authors: [{ name: post.author }],
  };
}

function getBody(slug: string): string | null {
  try {
    return fs.readFileSync(
      path.join(process.cwd(), "src/content/blog", `${slug}.md`),
      "utf8",
    );
  } catch {
    return null;
  }
}

function byline(post: Post): string {
  return post.authorTitle
    ? `By ${post.author}, ${post.authorTitle}`
    : `By ${post.author}`;
}

function jsonLd(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    description: post.description,
    // No personal names anywhere on the site (by request)—the organization
    // is the structured-data author for both content types.
    author: { "@type": "Organization", name: "Kynigos Law Firm, PLLC" },
    publisher: { "@type": "Organization", name: "Kynigos Law Firm, PLLC" },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  const body = post ? getBody(slug) : null;
  if (!post || !body) notFound();

  const relatedPaper =
    post.contentType === "publication" && post.relatedPaper
      ? getPaper(post.relatedPaper)
      : undefined;

  return (
    <article className="blog-post">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(post)) }}
      />
      <Link href="/insights" className="blog-back-top">
        ← All Insights
      </Link>
      <div className="insight-label">{post.label}</div>
      <div className="kicker">{post.category}</div>
      <h1 className="blog-title">{post.title}</h1>
      <p className="blog-dek">{post.dek}</p>
      <div className="blog-byline">
        {byline(post)} · {formatDate(post.date)} · {post.readingTime}
      </div>

      {relatedPaper && (
        <aside className="related-band">
          <div>
            <div className="related-band-label">Related Research</div>
            <div className="related-band-title">{relatedPaper.title}</div>
            <p>{relatedPaper.sub}</p>
            <Link href="/white-papers">Explore the full paper →</Link>
          </div>
        </aside>
      )}

      <div className="blog-prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {body}
        </ReactMarkdown>
      </div>

      {post.contentType === "essay" && post.whyKynigosExists && (
        <aside className="related-band">
          <div>
            <div className="related-band-label">Why Kynigos Exists</div>
            <p>
              This essay is the founding story—the experience of being the
              client is why Kynigos Law Firm runs on flat fees instead of the
              hourly meter.
            </p>
            <p>
              <Link href="/about">About the firm</Link> ·{" "}
              <Link href="/philosophy">Our philosophy</Link>
            </p>
          </div>
        </aside>
      )}

      <aside className="blog-cta">
        <div className="blog-cta-label">Read the full analysis</div>
        <p>
          {post.ctaText ?? (
            <>
              This piece draws on <em>Misaligned Incentives</em>, our white
              paper on the economics of legal fees—formal models, empirical
              data, and full citations.
            </>
          )}
        </p>
        <Link href="/white-papers" className="btn-primary">
          Get the White Paper
        </Link>
      </aside>

      {post.relatedPractice && (
        <p className="insight-relation">
          Related practice area:{" "}
          <Link href={post.relatedPractice.href}>
            {post.relatedPractice.label}
          </Link>
        </p>
      )}

      {/* Renders only when NEXT_PUBLIC_NEWSLETTER_ENABLED is set. */}
      <NewsletterSignup />

      <p className="blog-disclaimer">
        Kynigos Law Firm, PLLC · Washington, DC · Licensed in the District of
        Columbia. This article is for informational purposes only and does not
        constitute legal advice. Results may vary depending on your particular
        facts and legal circumstances.
      </p>
    </article>
  );
}
