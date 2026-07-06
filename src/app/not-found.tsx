import Link from "next/link";

export default function NotFound() {
  return (
    <section className="hero hero--page">
      <div className="kicker">404</div>
      <h1 className="headline-line">This page has no matter on file.</h1>
      <p className="subhead">
        The address you followed does not exist—or it has been moved.
      </p>
      <div className="cta-row">
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
        <Link href="/practice-areas" className="btn-secondary">
          Practice Areas
        </Link>
        <Link href="/insights" className="btn-secondary">
          Insights
        </Link>
        <Link href="/contact" className="btn-secondary">
          Contact
        </Link>
      </div>
    </section>
  );
}
