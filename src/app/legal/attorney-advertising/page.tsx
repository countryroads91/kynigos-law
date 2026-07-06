import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attorney Advertising",
  description:
    "Attorney-advertising notice for kynigos.law: portions of this website may constitute attorney advertising; prior results do not guarantee a similar outcome.",
};

export default function AttorneyAdvertisingPage() {
  return (
    <div className="legal-page">
      <div className="kicker">Legal</div>
      <h1 className="section-heading">Attorney Advertising</h1>
      <p className="legal-updated">Last updated July 6, 2026</p>
      <div className="legal-prose">
        <p>
          Portions of this website may constitute attorney advertising under
          applicable rules of professional conduct.
        </p>
        <p>
          Prior results do not guarantee a similar outcome. Descriptions of
          the firm&rsquo;s practice and its work are informational only and
          are not a promise of results in any matter.
        </p>
        <p>
          Responsible attorney: Kynigos Law Firm, PLLC, Washington, DC.
          Licensed to practice law in the District of Columbia only.
        </p>
        <p>
          Questions about this notice:{" "}
          <a href="mailto:info@kynigos.law">info@kynigos.law</a>.
        </p>
      </div>
    </div>
  );
}
