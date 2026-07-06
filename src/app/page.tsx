import type { Metadata } from "next";
import Link from "next/link";
import HeadlineReel from "@/components/HeadlineReel";
import TickerBar from "@/components/TickerBar";

export const metadata: Metadata = {
  title: { absolute: "Home | Kynigos Law Firm PLLC" },
};

const reelWords = [
  "divorce",
  "custody",
  "eviction",
  "contract",
  "capital markets",
];

const steps = [
  {
    title: "Talk to us—free",
    body: "A free consultation to understand your matter, your goals, and whether we are the right fit. No commitment, no clock running.",
  },
  {
    title: "One price, in writing",
    body: "Before any work begins, you get a flat fee or contingency structure in the engagement letter. You know the cost up front—no hourly billing, no surprise invoice.",
  },
  {
    title: "We win when you do",
    body: "With the price fixed, every incentive points at your outcome. Your attorney is invested in the result, not the hours it takes to get there.",
  },
];

export default function Home() {
  return (
    <>
    <section className="hero" aria-labelledby="hero-headline">
      <div className="hero-spear" aria-hidden="true">
        <svg viewBox="0 0 70 175" role="img">
          <path
            className="spear-draw"
            d="M35,0 L33,10 L31,25 L29,38 L27,50 L25,60 L22,75 L19,90 L16,102 L14,112 L12,120 L10,127 L9,132 L13,137 L18,143 L24,150 L27,155 L28,148 L29,138 L30,125 L31,110 L32,92 L33,72 L34,48 L35,42 L36,48 L37,72 L38,92 L39,110 L40,125 L41,138 L42,148 L43,155 L46,150 L52,143 L57,137 L61,132 L60,127 L58,120 L56,112 L54,102 L51,90 L48,75 L45,60 L43,50 L41,38 L39,25 L37,10 Z"
          />
          <path
            className="spear-draw spear-draw-base"
            d="M6,163 L8,169 L62,169 L64,163 Z"
          />
          <path
            className="spear-fill"
            d="M35,0 L33,10 L31,25 L29,38 L27,50 L25,60 L22,75 L19,90 L16,102 L14,112 L12,120 L10,127 L9,132 L13,137 L18,143 L24,150 L27,155 L28,148 L29,138 L30,125 L31,110 L32,92 L33,72 L34,48 L35,42 L36,48 L37,72 L38,92 L39,110 L40,125 L41,138 L42,148 L43,155 L46,150 L52,143 L57,137 L61,132 L60,127 L58,120 L56,112 L54,102 L51,90 L48,75 L45,60 L43,50 L41,38 L39,25 L37,10 Z"
          />
          <path className="spear-fill" d="M6,163 L8,169 L62,169 L64,163 Z" />
        </svg>
      </div>

      <div className="headline-block" id="hero-headline">
        <div className="reel-row">
          <span className="headline-line">Your</span>
          <HeadlineReel words={reelWords} />
        </div>
        <div className="headline-line">attorney should have</div>
        <div className="headline-line">skin in the game.</div>
      </div>

      <p className="subhead">
        <span className="subhead-line">Calculated. Zealous. Invested.</span>
        <span className="subhead-line">Aligned with your outcome.</span>
        <span className="subhead-line">Not for feeding the clock.</span>
      </p>

      <p className="lede">
        Most law firms bill for their time. We price for results. Every practice
        area, one model: you know the cost before you start, and your attorney
        only wins when you do.
      </p>

      <div className="cta-row">
        <Link href="/contact" className="btn-primary">
          Book A Free Consultation
        </Link>
        <a href="#how-it-works" className="btn-secondary">
          How It Works
        </a>
      </div>
    </section>

    <TickerBar />

    <section
      className="process"
      id="how-it-works"
      aria-labelledby="process-heading"
    >
      <div className="kicker">How It Works</div>
      <h2 className="process-heading" id="process-heading">
        Three steps. No meter.
      </h2>
      <ol className="process-steps">
        {steps.map((step, i) => (
          <li key={step.title} className="process-step">
            <span className="process-num" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="process-title">{step.title}</h3>
            <p className="process-body">{step.body}</p>
          </li>
        ))}
      </ol>
      <p className="process-note">
        Kynigos Law Firm, PLLC is licensed in the District of Columbia. Matters
        outside DC may require referral to local counsel.
      </p>
      <div className="cta-row">
        <Link href="/contact" className="btn-primary">
          Book A Free Consultation
        </Link>
        <Link href="/how-it-works" className="btn-secondary">
          Learn More
        </Link>
      </div>
    </section>
    </>
  );
}
