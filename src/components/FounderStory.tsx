import Link from "next/link";

export default function FounderStory() {
  return (
    <section className="founder-story" aria-labelledby="founder-heading">
      <div className="founder-portrait" aria-hidden="true">
        <span>K</span>
        <small>Founder-led<br />Washington, DC</small>
      </div>
      <div className="founder-copy">
        <div className="kicker">The Attorney Behind the Model</div>
        <h2 className="section-heading" id="founder-heading">
          Built by someone who has been the client—and sat on the principal side.
        </h2>
        <p className="founder-lede">
          Kynigos began with a client&rsquo;s complaint: a large retainer, a
          running meter, and no reliable way to know whether the work was
          creating value. A decade on the principal side of finance added the
          other half of the model: define the objective, price the risk, and
          stay accountable to the decision.
        </p>
        <div className="founder-proof">
          <div>
            <span>Perspective</span>
            <strong>Client + principal side</strong>
          </div>
          <div>
            <span>Jurisdiction</span>
            <strong>District of Columbia</strong>
          </div>
          <div>
            <span>Access</span>
            <strong>Founder-led engagements</strong>
          </div>
        </div>
        <div className="cta-row">
          <Link href="/about" className="btn-primary">About Kynigos</Link>
          <Link href="/blog/i-have-been-the-client" className="btn-secondary">
            Read the Founder&rsquo;s Essay
          </Link>
        </div>
      </div>
    </section>
  );
}
