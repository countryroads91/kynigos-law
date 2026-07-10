import Link from "next/link";
import type { Audience } from "@/content/audiences";

export default function AudienceLanding({ audience }: { audience: Audience }) {
  return (
    <>
      <section className="audience-hero">
        <div className="audience-hero-copy">
          <div className="kicker">{audience.kicker}</div>
          <h1>{audience.title}</h1>
          <p>{audience.description}</p>
          <div className="cta-row">
            <Link href="/contact" className="btn-primary">Tell Us What Is at Stake</Link>
            <Link href="/how-it-works" className="btn-secondary">How Fees Work</Link>
          </div>
        </div>
        <aside className="audience-matter-index" aria-label="Typical matters">
          <span className="audience-index-label">Typical matters</span>
          <ul>
            {audience.matters.map((matter, index) => (
              <li key={matter}><span>0{index + 1}</span>{matter}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="audience-services" aria-labelledby="services-heading">
        <div className="kicker">Ways to Engage</div>
        <h2 className="section-heading" id="services-heading">
          A defined first move for a consequential matter.
        </h2>
        <p className="section-sub">{audience.proof}</p>
        <div className="audience-service-grid">
          {audience.services.map((service, index) => (
            <Link href={service.href} key={service.title} data-reveal>
              <span className="audience-service-num">0{index + 1}</span>
              <span className="audience-service-fee">{service.fee}</span>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
              <span className="text-link">Explore the engagement <span aria-hidden="true">&rarr;</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="audience-principle" aria-labelledby="principle-heading">
        <div>
          <div className="kicker">The Kynigos Difference</div>
          <h2 id="principle-heading">You do not pay more merely because the problem takes us longer.</h2>
        </div>
        <div>
          <p>
            The objective, deliverable, assumptions, and price are defined
            before the work begins. When a matter needs another stage, you
            receive another decision—not an automatically replenished meter.
          </p>
          <Link href="/philosophy" className="text-link">Read the philosophy <span aria-hidden="true">&rarr;</span></Link>
        </div>
      </section>

      <section className="audience-cta">
        <div className="kicker">Start</div>
        <h2>Tell us what you are trying to accomplish.</h2>
        <p>
          Share the objective, deadline, jurisdiction, and documents already
          in hand. We reply with a straight answer about fit and the next useful step.
        </p>
        <Link href="/contact" className="btn-primary">Make the First Move</Link>
      </section>
    </>
  );
}
