import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Kynigos Law Firm, PLLC handles the information you submit through kynigos.law—what we collect, why, who processes it, and how to reach us about it.",
};

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <div className="kicker">Legal</div>
      <h1 className="section-heading">Privacy Policy</h1>
      <p className="legal-updated">Last updated July 7, 2026</p>
      <div className="legal-prose">
        <p>
          Kynigos Law Firm, PLLC (&ldquo;the firm,&rdquo; &ldquo;we&rdquo;)
          operates kynigos.law. This policy describes what information the site
          collects, why, and what we do with it. The short version: we collect
          only what you type into our forms, we use it only to respond to you,
          and we do not sell it to anyone.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Contact form.</strong> When you use the contact form, we
            collect your name, email address, phone number (optional), the
            jurisdiction your matter involves, and your message.
          </li>
          <li>
            <strong>White-paper form.</strong> When you request a white paper,
            we collect your name and email address so we can deliver the PDF
            by email.
          </li>
          <li>
            <strong>Inquiry records.</strong> Form submissions are stored in a
            database operated for the firm and recorded in our server logs
            (hosted on Vercel), including when email delivery fails, so that
            your inquiry is not lost and we can respond to it.
          </li>
          <li>
            <strong>Analytics.</strong> With your consent, the site measures
            aggregated page-view data to understand what visitors read.
            Analytics tools run only after you accept the analytics category
            in the cookie banner.
          </li>
          <li>
            <strong>Cookies.</strong> The site uses cookies by category—
            strictly necessary, functional, analytics, and marketing—and
            non-essential categories run only with your consent. The{" "}
            <Link href="/legal/cookies">Cookie Policy</Link> lists each
            cookie, and the &ldquo;Cookie Settings&rdquo; link in the footer
            lets you change your choices at any time.
          </li>
        </ul>

        <h2>Why we collect it</h2>
        <p>
          We use the information above to respond to your inquiries, to
          deliver white papers you request, and to operate and maintain the
          site. Nothing more.
        </p>

        <h2>Service providers</h2>
        <p>
          A small number of providers process data on our behalf: Vercel,
          which hosts the site and provides its analytics; Resend, which
          transmits form submissions to the firm by email; Neon, which stores
          inquiry records in an encrypted database; Cloudflare, whose
          Turnstile service checks that form submissions come from a person
          rather than a bot; and Upstash, which enforces rate limits on form
          submissions. We do not share your information with anyone else, and
          we do not sell personal information.
        </p>

        <h2>Retention</h2>
        <p>
          We keep inquiry information as long as needed to respond to you and
          to comply with our professional and legal obligations.
        </p>

        <h2>Your choices</h2>
        <p>
          To ask what inquiry data we hold about you, or to request its
          deletion, email{" "}
          <a href="mailto:info@kynigos.law">info@kynigos.law</a>. We will
          respond and honor deletion requests except where professional or
          legal obligations require us to retain a record.
        </p>

        <h2>Not legal advice; no attorney-client relationship</h2>
        <p>
          Submitting a form on this site does not create an attorney-client
          relationship. Please do not send confidential or time-sensitive
          information through the site. See our{" "}
          <Link href="/legal/disclaimer">Website Disclaimer &amp; Terms of Use</Link>{" "}
          for more.
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
