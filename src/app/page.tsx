import type { Metadata } from "next";
import Link from "next/link";
import TickerBar from "@/components/TickerBar";
import ThreeDoors from "@/components/ThreeDoors";
import Flagships from "@/components/Flagships";
import Pillars from "@/components/Pillars";
import EngagementLoop from "@/components/EngagementLoop";
import Founder from "@/components/Founder";
import FeaturedInsights from "@/components/FeaturedInsights";
import FirstMove from "@/components/FirstMove";

export const metadata: Metadata = {
  title: { absolute: "Home | Kynigos Law Firm PLLC" },
};

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

      <div className="kicker">Calculated &middot; Zealous &middot; Invested</div>

      {/* The tagline is strong enough to stand still. Audience breadth moves
          to the subhead triptych and the three doors below. */}
      <div className="headline-block" id="hero-headline">
        <div className="headline-line">Your attorney</div>
        <div className="headline-line">should have</div>
        <div className="headline-line">skin in the game.</div>
      </div>

      <p className="subhead">
        <span className="subhead-line">Your family.</span>
        <span className="subhead-line">Your business.</span>
        <span className="subhead-line">Your capital.</span>
      </p>

      <p className="lede">
        We define the objective, scope the work, and state the price before
        anything begins—then put our own economics behind delivering it. You
        never pay more because your matter took longer.
      </p>

      <div className="cta-row">
        <a href="#doors" className="btn-primary">
          Find Your Path
        </a>
        <Link href="/how-it-works" className="btn-secondary">
          How Our Fees Work
        </Link>
      </div>
    </section>

    <TickerBar />

    <ThreeDoors />

    <Flagships />

    <Pillars />

    <Founder />

    <EngagementLoop />

    <FeaturedInsights />

    <FirstMove />
    </>
  );
}
