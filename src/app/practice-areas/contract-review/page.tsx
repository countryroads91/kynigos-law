import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Professional Contract Review",
  description:
    "Flat-fee professional contract review for physicians, dentists, and other professionals. $444 per contract. Full redline, phone consultation, market analytics—delivered within 5 business days.",
};

export default function ContractReviewPage() {
  return (
    <section className="hero">
      <div className="kicker">Self-Serve Product · $444</div>
      <h1 className="headline-line">Professional Contract Review</h1>
      <p className="subhead">
        Physicians, dentists, professionals—your contract, redlined.
      </p>
      <p className="lede">
        A flat $444 buys a full redline, a phone consultation, and market
        analytics for your offer. Delivered within 5 business days of contract
        submission. Bayan contacts every client within 24 hours of payment to
        confirm receipt and begin work.
      </p>
      <p className="lede">
        Full product page in progress—Stripe checkout, scope detail,
        PriceComparison calculator, and the post-purchase intake flow are
        coming.
      </p>
      <div className="cta-row">
        <Link href="/contact" className="btn-primary">
          Get Notified at Launch
        </Link>
        <Link href="/" className="btn-secondary">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
