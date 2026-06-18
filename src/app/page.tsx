import Link from "next/link";
import HeadlineReel from "@/components/HeadlineReel";

const reelWords = [
  "divorce",
  "capital markets",
  "employment",
  "contract review",
  "eviction",
  "family law",
  "custody",
  "prenuptial",
];

export default function Home() {
  return (
    <section className="hero" aria-labelledby="hero-headline">
      <div className="kicker">Washington, DC</div>

      <div className="headline-block" id="hero-headline">
        <div className="headline-line">Your</div>
        <div className="reel-row">
          <HeadlineReel words={reelWords} />
          <span className="headline-line">attorney</span>
        </div>
        <div className="headline-line">should have skin in the game.</div>
      </div>

      <p className="subhead">
        Flat-fee. Contingency. Aligned with your outcome—not your hours.
      </p>

      <p className="lede">
        Most law firms bill for their time. We price for results. Every practice
        area, one model: you know the cost before you start, and your attorney
        only wins when you do.
      </p>

      <div className="cta-row">
        <Link href="/contact" className="btn-primary">
          Schedule a Consultation
        </Link>
        <Link href="/about" className="btn-secondary">
          How It Works
        </Link>
      </div>
    </section>
  );
}
