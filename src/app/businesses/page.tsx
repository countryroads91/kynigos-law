import type { Metadata } from "next";
import AudienceLanding from "@/components/AudienceLanding";
import { getAudience } from "@/content/audiences";

export const metadata: Metadata = {
  title: "Businesses & Professionals",
  description: "Defined-scope business counsel for owner-led companies, medical and dental practices, and professional firms.",
};

export default function BusinessesPage() {
  return <AudienceLanding audience={getAudience("businesses")!} />;
}
