import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "kynigos.law sets no cookies and stores nothing in your browser. This policy explains the site's cookieless analytics and how to verify it yourself.",
};

export default function CookiePolicyPage() {
  return (
    <div className="legal-page">
      <div className="kicker">Legal</div>
      <h1 className="section-heading">Cookie Policy</h1>
      <p className="legal-updated">Last updated July 6, 2026</p>
      <div className="legal-prose">
        <h2>This site sets no cookies</h2>
        <p>
          kynigos.law does not set cookies, does not use local storage, and
          does not load advertising or marketing trackers. There is no cookie
          banner because there is nothing to consent to.
        </p>

        <h2>Cookieless analytics</h2>
        <p>
          The site uses Vercel Analytics to count page views. It works without
          cookies: measurements are aggregated, no persistent identifier is
          stored on your device, and you are not tracked across other sites.
        </p>

        <h2>If that ever changes</h2>
        <p>
          If the firm ever adds cookies or any tracking technology to this
          site, we will update this policy and introduce a consent mechanism
          first—before the change goes live.
        </p>

        <h2>How to verify</h2>
        <p>
          You can check this yourself. Open your browser&rsquo;s developer
          tools (usually F12), go to the storage or application panel, and
          inspect the cookies and local storage for kynigos.law. Both should
          be empty.
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
