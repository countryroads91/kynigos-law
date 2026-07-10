import type { Metadata } from "next";
import AudienceLanding from "@/components/AudienceLanding";
import { getAudience } from "@/content/audiences";

export const metadata: Metadata = {
  title: "Individuals & Families",
  description: "Strategic, clearly scoped counsel for DC divorce, family, career, estate, and property decisions.",
};

export default function PeoplePage() {
  return <AudienceLanding audience={getAudience("people")!} />;
}
