import type { Metadata } from "next";
import AudienceLanding from "@/components/AudienceLanding";
import { getAudience } from "@/content/audiences";

export const metadata: Metadata = {
  title: "Lenders & Investors",
  description: "Sophisticated, clearly priced counsel for private lending, real-estate finance, legal opinions, and investment structures.",
};

export default function CapitalPage() {
  return <AudienceLanding audience={getAudience("capital")!} />;
}
