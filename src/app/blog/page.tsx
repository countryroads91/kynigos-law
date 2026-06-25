import type { Metadata } from "next";
import Link from "next/link";
import { posts, formatDate } from "@/content/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "The economics of legal fees in plain language—principal-agent theory, behavioral economics, and why flat fees align your lawyer's incentives with your outcome.",
};

export default function BlogIndex() {
  return (
    <section className="hero">
      <div className="kicker">Blog</div>
      <h1 className="headline-line">Notes from the firm.</h1>
      <p className="subhead">The economics of legal fees, in plain language.</p>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="post-link">
              <span className="post-meta">
                {post.category} · {formatDate(post.date)}
              </span>
              <span className="post-title">{post.title}</span>
              <span className="post-dek">{post.dek}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
