import Link from "next/link";

// The trust section a young firm cannot skip: no institutional history yet,
// so the founder's specific experience carries the weight. Sitewide
// name-minimization holds—the managing partner is deliberately never named
// in marketing copy, so the credentials speak and the essays carry the voice.
const credentials = [
  {
    label: "Bar Admission",
    detail: "District of Columbia",
  },
  {
    label: "Law",
    detail: "Antonin Scalia Law School, George Mason University",
  },
  {
    label: "Before Law",
    detail:
      "A decade in institutional finance—Goldman Sachs, Invictus Capital Partners, LendingOne",
  },
  {
    label: "Litigation Finance",
    detail: "Rocade Capital—underwriting legal outcomes as investments",
  },
];

export default function Founder() {
  return (
    <section
      className="founder"
      id="attorney"
      aria-labelledby="founder-heading"
    >
      <div className="founder-inner">
        <div className="kicker">The Attorney Behind the Model</div>
        <h2 className="section-heading" id="founder-heading">
          Built by someone who has been the client.
        </h2>
        <div className="founder-grid">
          <div className="founder-story">
            <blockquote className="founder-quote">
              &ldquo;I have been the client. I have paid large retainers and
              watched the meter run before knowing if my lawyer was any
              good.&rdquo;
              <span className="founder-quote-attr">
                From the personal essay behind the firm
              </span>
            </blockquote>
            <p className="founder-body">
              Kynigos has one attorney—the managing partner—and you work with
              him directly. No leverage pyramid, no handoffs, no associate
              learning on your file. Before law, he spent a decade
              underwriting risk on the principal side of institutional
              credit; the firm prices legal work the way a desk prices a
              position, because that is the only pricing he was ever willing
              to buy.
            </p>
            <div className="cta-row">
              <Link href="/blog/i-have-been-the-client" className="btn-primary">
                Read the Essay
              </Link>
              <Link href="/about" className="btn-secondary">
                About the Firm
              </Link>
            </div>
          </div>
          <dl className="founder-credentials">
            {credentials.map((c) => (
              <div className="founder-credential" key={c.label} data-reveal>
                <dt>{c.label}</dt>
                <dd>{c.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
