export type AudienceService = {
  title: string;
  body: string;
  href: string;
  fee: string;
};

export type Audience = {
  slug: "people" | "businesses" | "capital";
  navLabel: string;
  kicker: string;
  title: string;
  short: string;
  description: string;
  proof: string;
  matters: string[];
  services: AudienceService[];
};

export const AUDIENCES: Audience[] = [
  {
    slug: "people",
    navLabel: "People",
    kicker: "Individuals & Families",
    title: "When the legal issue is personal—and the stakes are not small.",
    short: "Family, career, estate, and property decisions.",
    description:
      "Strategic counsel for professionals, business owners, investors, and families who need a clear plan without surrendering control of the legal budget.",
    proof:
      "Each stage is scoped separately, so the next engagement has to be earned rather than assumed.",
    matters: [
      "Divorce and separation",
      "Custody and support",
      "Prenuptial agreements",
      "Professional employment terms",
      "Severance and restrictive covenants",
      "Estate and property planning",
    ],
    services: [
      {
        title: "Staged-Fee Divorce",
        body: "A defined strategy, one decision point at a time—from financial map through settlement or hearing.",
        href: "/practice-areas/family-law",
        fee: "Staged fixed fee",
      },
      {
        title: "Professional Contract Review",
        body: "A decision package: issue map, risk ranking, redline, and a practical negotiation position.",
        href: "/practice-areas/contract-review",
        fee: "Defined flat fee",
      },
      {
        title: "Prenuptial & Personal Planning",
        body: "Clear terms for the assets, obligations, and decisions that should not be left to default rules.",
        href: "/practice-areas#family-personal",
        fee: "Quoted in advance",
      },
    ],
  },
  {
    slug: "businesses",
    navLabel: "Businesses",
    kicker: "Owners & Professionals",
    title: "Counsel for the decisions that change an enterprise.",
    short: "Contracts, people, partnerships, practices, and transactions.",
    description:
      "For owner-led companies and professional practices with real volume, real employees, and recurring legal judgment—but no reason to fund a billing black box.",
    proof:
      "The scope follows the business objective: close the agreement, solve the people issue, protect the relationship, or exit cleanly.",
    matters: [
      "Commercial contracts",
      "Employment documentation",
      "Commercial leases",
      "Partner admissions and exits",
      "Practice acquisitions and sales",
      "Outside business counsel",
    ],
    services: [
      {
        title: "Business Counsel",
        body: "Defined recurring capacity for contracts, employment questions, and management decisions.",
        href: "/practice-areas#business-corporate",
        fee: "Fixed recurring scope",
      },
      {
        title: "Practice & Partner Transactions",
        body: "Buy-ins, buyouts, ownership changes, and sales for medical, dental, and other professional practices.",
        href: "/practice-areas#business-corporate",
        fee: "Milestone pricing",
      },
      {
        title: "Negotiation Sprint",
        body: "One defined commercial objective, one focused negotiation, and a price stated before the first move.",
        href: "/practice-areas/contract-review",
        fee: "Fixed fee by round",
      },
    ],
  },
  {
    slug: "capital",
    navLabel: "Capital",
    kicker: "Lenders & Investors",
    title: "Legal documents read in the language of capital.",
    short: "Private credit, real-estate finance, opinions, and investment structures.",
    description:
      "Sophisticated documentation for private lenders, real-estate investors, smaller sponsors, and boutique funds—without assembling a large-firm team.",
    proof:
      "The work is reviewed by counsel who understands what the capital is trying to accomplish, not only what the document says.",
    matters: [
      "DC legal opinion letters",
      "Private lending documentation",
      "Real-estate finance",
      "Joint ventures and preferred equity",
      "Participations and intercreditors",
      "Fund and investment documents",
    ],
    services: [
      {
        title: "Private Lender Counsel",
        body: "Loan documents, diligence, negotiation, and closing support sized for repeat private-credit work.",
        href: "/practice-areas/capital-markets",
        fee: "Deal or portfolio fee",
      },
      {
        title: "DC Legal Opinion Letters",
        body: "A defined diligence list, clear assumptions, and a closing-ready District of Columbia opinion.",
        href: "/practice-areas/capital-markets",
        fee: "Quoted in advance",
      },
      {
        title: "Deal Document Review",
        body: "Economic terms, protections, control rights, and closing conditions reviewed from the principal side.",
        href: "/practice-areas/capital-markets",
        fee: "Milestone pricing",
      },
    ],
  },
];

export function getAudience(slug: Audience["slug"]) {
  return AUDIENCES.find((audience) => audience.slug === slug);
}
