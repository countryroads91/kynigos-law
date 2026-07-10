import type { Metadata } from "next";
import Link from "next/link";
import SpearHero from "@/components/SpearHero";
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
      <SpearHero />

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
