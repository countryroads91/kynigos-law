import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Website Disclaimer & Terms of Use",
  description:
    "Terms governing use of kynigos.law: informational content only, no legal advice, no attorney-client relationship through the site, and DC-only licensure.",
};

export default function DisclaimerPage() {
  return (
    <div className="legal-page">
      <div className="kicker">Legal</div>
      <h1 className="section-heading">Website Disclaimer &amp; Terms of Use</h1>
      <p className="legal-updated">Last updated July 6, 2026</p>
      <div className="legal-prose">
        <h2>Informational only—not legal advice</h2>
        <p>
          Everything on this website is general information about Kynigos Law
          Firm, PLLC and the areas of law in which it practices. It is not
          legal advice, and it is not a substitute for advice from a lawyer
          who knows the facts of your situation. Do not act, or refrain from
          acting, on anything you read here without obtaining counsel on your
          specific matter.
        </p>

        <h2>No attorney-client relationship</h2>
        <p>
          Reading this website, submitting the contact form, requesting a
          white paper, or sending us an email does not create an
          attorney-client relationship. An attorney-client relationship with
          the firm is formed only by a signed engagement letter.
        </p>

        <h2>Confidentiality warning</h2>
        <p>
          Until the firm has agreed in writing to represent you, do not send
          confidential or time-sensitive information through the site&rsquo;s
          forms or by email. Information sent before an engagement exists may
          not be protected by the attorney-client privilege and does not
          obligate the firm to act.
        </p>

        <h2>No guarantee of results</h2>
        <p>
          Descriptions of the firm&rsquo;s work are informational. Prior
          results do not guarantee a similar outcome. Every matter turns on
          its own facts.
        </p>

        <h2>Jurisdiction—District of Columbia only</h2>
        <p>
          Kynigos Law Firm, PLLC is licensed to practice law in the District
          of Columbia only. Nothing on this site is an offer to represent
          anyone in any other jurisdiction. If your matter involves another
          jurisdiction, we may be able to refer you to local counsel.
        </p>

        <h2>Third-party links</h2>
        <p>
          The site may link to third-party websites. Those links are provided
          for convenience; the firm does not control third-party sites and is
          not responsible for their content or their privacy practices.
        </p>

        <h2>Accuracy and timeliness</h2>
        <p>
          We try to keep the content of this site accurate, but the law
          changes and pages can become outdated. The firm makes no warranty
          that any content is current, complete, or error-free.
        </p>

        <h2>Intellectual property</h2>
        <p>
          &copy; Kynigos Law Firm, PLLC. The content of this website may not
          be reproduced for commercial purposes without the firm&rsquo;s
          written permission.
        </p>

        <h2>Related policies</h2>
        <p>
          See also the <Link href="/legal/privacy">Privacy Policy</Link>, the{" "}
          <Link href="/legal/cookies">Cookie Policy</Link>, and the{" "}
          <Link href="/legal/attorney-advertising">
            attorney-advertising notice
          </Link>
          .
        </p>

        <h2>Contact</h2>
        <p>
          Kynigos Law Firm, PLLC · Washington, DC ·{" "}
          <a href="mailto:info@kynigos.law">info@kynigos.law</a> ·{" "}
          <a href="tel:+13045491058">(304) 549-1058</a>
        </p>
      </div>
    </div>
  );
}
