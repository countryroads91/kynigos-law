import type { Metadata } from "next";
import AudiencePage from "@/components/AudiencePage";
import { getAudience } from "@/content/audiences";

export const metadata: Metadata = {
  title: "For Businesses & Professionals",
  description:
    "Outside counsel for owner-led companies and professional practices in DC—contracts, partnerships, practice transactions, leases, and disputes at stated prices.",
};

export default function BusinessesPage() {
  const audience = getAudience("businesses");
  if (!audience) return null;
  return <AudiencePage audience={audience} />;
}
