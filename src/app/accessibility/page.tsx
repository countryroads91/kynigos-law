import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "Kynigos Law Firm's commitment to an accessible website: WCAG 2.2 AA as the target, the measures taken so far, and how to report a barrier.",
};

export default function AccessibilityPage() {
  return (
    <div className="legal-page">
      <div className="kicker">Accessibility</div>
      <h1 className="section-heading">Accessibility Statement</h1>
      <p className="legal-updated">Last updated July 6, 2026</p>
      <div className="legal-prose">
        <p>
          Kynigos Law Firm, PLLC wants everyone to be able to use this
          website. Our target is conformance with the Web Content
          Accessibility Guidelines (WCAG) 2.2 at Level AA.
        </p>

        <h2>Measures taken</h2>
        <ul>
          <li>Every interactive element is operable by keyboard.</li>
          <li>Visible focus states on links, buttons, and form fields.</li>
          <li>
            Animation respects the reduced-motion preference set in your
            operating system.
          </li>
          <li>
            Semantic HTML structure—headings, landmarks, and labeled form
            fields—for screen-reader navigation.
          </li>
          <li>A contrast-checked color palette for text and controls.</li>
          <li>Touch targets sized at 44px or larger.</li>
        </ul>

        <h2>Known limitations</h2>
        <p>
          Despite these measures, some parts of the site may not yet be fully
          accessible. We treat accessibility as ongoing work, not a finished
          checkbox, and we review the site as it changes.
        </p>

        <h2>Report a barrier</h2>
        <p>
          If anything on this site is difficult or impossible for you to use,
          please tell us. Email{" "}
          <a href="mailto:info@kynigos.law">info@kynigos.law</a> or call{" "}
          <a href="tel:+13045491058">(304) 549-1058</a> and describe the page
          and the problem. We will work to fix it and, in the meantime, get
          you the information another way.
        </p>
      </div>
    </div>
  );
}
