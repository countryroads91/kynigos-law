import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { posts, getPost, formatDate } from "@/content/posts";

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
  return { title: post.title, description: post.description };
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  const body = post ? getBody(slug) : null;
  if (!post || !body) notFound();

  return (
    <article className="blog-post">
      <Link href="/blog" className="blog-back-top">
        ← All Posts
      </Link>
      <div className="kicker">{post.category}</div>
      <h1 className="blog-title">{post.title}</h1>
      <p className="blog-dek">{post.dek}</p>
      <div className="blog-byline">
        By {post.author}, {post.authorTitle} · {formatDate(post.date)}
      </div>

      <div className="blog-prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
      </div>

      <aside className="blog-cta">
        <div className="blog-cta-label">Read the full analysis</div>
        <p>
          This piece draws on <em>Misaligned Incentives</em>, our white paper on
          the economics of legal fees—formal models, empirical data, and full
          citations.
        </p>
        <Link href="/white-papers" className="btn-primary">
          Get the White Paper
        </Link>
      </aside>

      <p className="blog-disclaimer">
        Kynigos Law Firm, PLLC · Washington, DC · Licensed in the District of
        Columbia. This article is for informational purposes only and does not
        constitute legal advice. Results may vary depending on your particular
        facts and legal circumstances.
      </p>
    </article>
  );
}
