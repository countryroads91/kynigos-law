import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "The cookies and similar technologies used on kynigos.law, organized by category, and how to accept, reject, or change your preferences at any time.",
};

export default function CookiePolicyPage() {
  return (
    <div className="legal-page">
      <div className="kicker">Legal</div>
      <h1 className="section-heading">Cookie Policy</h1>
      <p className="legal-updated">Last updated July 6, 2026</p>
      <div className="legal-prose">
        <h2>How consent works on this site</h2>
        <p>
          When you first visit kynigos.law, a banner lets you accept all
          cookies, reject all non-essential cookies, or manage preferences by
          category. Accepting and rejecting take the same effort—one click.
          Non-essential cookies and the tools that set them do not run until
          you consent, and you can change your choices at any time through the
          &ldquo;Cookie Settings&rdquo; link in the footer. Your choice is
          stored for twelve months.
        </p>

        <h2>Strictly necessary</h2>
        <p>Always active—the site cannot function without them.</p>
        <ul>
          <li>
            <strong>kynigos-consent</strong> (first-party, 12 months): records
            the cookie choices you make here.
          </li>
          <li>
            <strong>Payment-security cookies</strong> (Stripe, when online
            checkout for the $444 contract review is live): fraud prevention
            and secure payment processing. These exist to protect you and are
            set only on checkout pages.
          </li>
        </ul>

        <h2>Functional</h2>
        <p>
          Set only with your consent. They remember helpful preferences and
          power embedded tools.
        </p>
        <ul>
          <li>
            <strong>Scheduling cookies</strong> (Calendly, when the embedded
            consultation scheduler is enabled): keep your booking session
            working inside the embedded calendar.
          </li>
        </ul>

        <h2>Analytics</h2>
        <p>
          Set or activated only with your consent. They help us understand
          which pages are read and how visitors move through the site.
        </p>
        <ul>
          <li>
            <strong>Vercel Analytics</strong>: aggregated page-view
            measurement. It runs on this site only after you consent to
            analytics.
          </li>
          <li>
            <strong>Google Analytics</strong> (_ga and related cookies, up to
            13 months, when enabled): traffic sources and page-level
            engagement, used to understand which publications and practice
            pages people actually read.
          </li>
        </ul>

        <h2>Marketing</h2>
        <p>
          Set only with your consent. If the firm advertises—for example,
          promoting the $444 contract review to physicians—these measure
          whether that outreach works and enable relevant ads off this site.
        </p>
        <ul>
          <li>
            <strong>Conversion-measurement cookies</strong> (such as Google
            Ads or LinkedIn Insight, when campaigns are active): record that a
            visit or inquiry followed an ad, so the firm knows what to keep
            paying for. We never sell your personal information.
          </li>
        </ul>

        <h2>What we will not do</h2>
        <p>
          No cookie on this site is used to sell your personal information,
          and nothing you type into a contact form is shared with advertising
          platforms. If a new category of cookie is ever needed, this policy
          and the consent banner will be updated before it goes live.
        </p>

        <h2>Managing cookies in your browser</h2>
        <p>
          Beyond the &ldquo;Cookie Settings&rdquo; link in the footer, every
          major browser lets you inspect, block, or delete cookies for this
          site: open the developer tools (usually F12) and look in the storage
          or application panel, or use your browser&rsquo;s privacy settings.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy:{" "}
          <a href="mailto:info@kynigos.law">info@kynigos.law</a>. See also the{" "}
          <Link href="/legal/privacy">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
