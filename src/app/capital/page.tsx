import type { Metadata } from "next";
import AudiencePage from "@/components/AudiencePage";
import { getAudience } from "@/content/audiences";

export const metadata: Metadata = {
  title: "For Lenders & Investors",
  description:
    "DC legal opinion letters, loan documentation, and deal counsel for private lenders, investors, and funds—from counsel with a decade on the principal side.",
};

export default function CapitalPage() {
  const audience = getAudience("capital");
  if (!audience) return null;
  return <AudiencePage audience={audience} />;
}
