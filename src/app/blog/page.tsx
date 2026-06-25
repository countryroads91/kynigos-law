import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on legal strategy, fee structure, and the economics of representation from Kynigos Law Firm in Washington, DC.",
};

export default function BlogPage() {
  return (
    <section className="hero">
      <div className="kicker">Blog</div>
      <h1 className="headline-line">Notes from the firm.</h1>
      <p className="subhead">Shorter takes on strategy, fees, and the law.</p>
      <p className="lede">
        First posts are on the way. For the long-form work—the economics of
        legal services and the case for outcome-aligned fees—see the white
        papers.
      </p>
      <div className="cta-row">
        <Link href="/white-papers" className="btn-primary">
          Read the White Papers
        </Link>
        <Link href="/" className="btn-secondary">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
