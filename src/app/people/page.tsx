import type { Metadata } from "next";
import AudiencePage from "@/components/AudiencePage";
import { getAudience } from "@/content/audiences";

export const metadata: Metadata = {
  title: "For Individuals & Families",
  description:
    "Strategic DC counsel for divorce, custody, prenuptial agreements, employment terms, severance, and estate planning—scoped and priced before the work begins.",
};

export default function PeoplePage() {
  const audience = getAudience("people");
  if (!audience) return null;
  return <AudiencePage audience={audience} />;
}
