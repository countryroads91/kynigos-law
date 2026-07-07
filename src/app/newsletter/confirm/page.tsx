import type { Metadata } from "next";
import ConfirmSubscription from "@/components/ConfirmSubscription";

export const metadata: Metadata = {
  title: "Confirm Subscription",
  description: "Confirm your Kynigos Law Firm research-notes subscription.",
  robots: { index: false, follow: false },
};

// Landing page for the emailed confirmation link. Rendering this page has no
// side effects—the actual confirmation happens only when the reader clicks
// the button (a POST), so scanner prefetches cannot fabricate consent.
export default async function NewsletterConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <div className="legal-page">
      <div className="kicker">Research Notes</div>
      <h1 className="section-heading">One click to finish.</h1>
      <div className="legal-prose">
        {token ? (
          <>
            <p>
              Confirm that you want the firm&rsquo;s research notes—new white
              papers, publications, and economic analysis of legal fee
              structures. Every email includes a one-click unsubscribe.
            </p>
            <ConfirmSubscription token={token} />
          </>
        ) : (
          <p>
            This confirmation link is missing its token. Use the full link
            from the email, request a fresh one from the signup form, or email{" "}
            <a href="mailto:info@kynigos.law">info@kynigos.law</a> and
            we&rsquo;ll add you directly.
          </p>
        )}
      </div>
    </div>
  );
}
