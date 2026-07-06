import type { Metadata } from "next";
import Link from "next/link";
import { essays } from "@/content/posts";

export const metadata: Metadata = {
  title: "The Attorney",
  description:
    "Bayan Misaghi, Esq., Managing Partner of Kynigos Law Firm, PLLC—about a decade in institutional finance before law, and a member of the District of Columbia Bar.",
};

const career = [
  {
    org: "Goldman Sachs",
    role: "Where about a decade in institutional finance began.",
  },
  {
    org: "Invictus Capital Partners",
    role: "Co-founded SFR and CRE lending platforms and the Verus securitization platform.",
  },
  {
    org: "LendingOne",
    role: "Large-loan underwriting on a seven-person deal team.",
  },
  {
    org: "Rocade Capital",
    role: "Litigation finance—pricing legal outcomes for a living.",
  },
];

const credentials = [
  {
    org: "Antonin Scalia Law School",
    role: "JD, full-tuition scholarship.",
  },
  {
    org: "Washington and Lee University",
    role: "BA, magna cum laude, Phi Beta Kappa.",
  },
  {
    org: "District of Columbia Bar",
    role: "Member. Licensed in DC only—matters elsewhere get a prompt referral.",
  },
];

export default function AttorneyPage() {
  return (
    <>
      <section className="hero hero--page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/about">About</Link>
          <span className="crumb-sep">/</span>
          <span>The Attorney</span>
        </nav>
        <div className="kicker">The Attorney</div>
        <h1 className="headline-line">Bayan Misaghi, Esq.</h1>
        <p className="subhead">Managing Partner</p>
        <p className="lede">
          Before law, about a decade in institutional finance—structuring,
          underwriting, and pricing credit risk, where nobody gets paid for
          effort. Kynigos brings that discipline to legal fees.
        </p>
      </section>

      <section className="process" aria-labelledby="career-heading">
        <div className="kicker">Career</div>
        <h2 className="process-heading" id="career-heading">
          Trained to price outcomes, not hours
        </h2>
        <div className="phil-prose">
          <p>
            In institutional credit, the discipline is unforgiving: name the
            risk, price it, and live with the result. That is the training
            Kynigos applies to every fee it quotes.
          </p>
        </div>
        <ul className="phil-timeline">
          {career.map((c) => (
            <li key={c.org}>
              <span className="phil-timeline-org">{c.org}</span>
              <span className="phil-timeline-role">{c.role}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="process process--band" aria-labelledby="credentials-heading">
        <div className="kicker">Education &amp; Admission</div>
        <h2 className="process-heading" id="credentials-heading">
          Credentials
        </h2>
        <ul className="phil-timeline">
          {credentials.map((c) => (
            <li key={c.org}>
              <span className="phil-timeline-org">{c.org}</span>
              <span className="phil-timeline-role">{c.role}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="process" aria-labelledby="essays-heading">
        <div className="kicker">In His Own Words</div>
        <h2 className="process-heading" id="essays-heading">
          Why he built the firm this way
        </h2>
        <p className="section-sub">
          Two personal essays tell the story directly—what it was like to be
          the client, and what the meter taught him.
        </p>
        <div className="card-grid">
          {essays().map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="insight-card insight-card--essay"
            >
              <span className="insight-label">{post.label}</span>
              <h3 className="insight-title">{post.title}</h3>
              <p className="insight-dek">{post.dek}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="process process--band">
        <div className="rule-banner">
          <div className="kicker">Your Move</div>
          <h2 className="rule-heading">Start with thirty free minutes.</h2>
          <p className="rule-body">
            Describe the matter and get a straight answer—including whether you
            need a lawyer at all. You will know the price before the work
            begins.
          </p>
          <div className="cta-row">
            <Link href="/contact" className="btn-primary">
              Book A Free Consultation
            </Link>
            <Link href="/philosophy" className="btn-secondary">
              Read the Philosophy
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
