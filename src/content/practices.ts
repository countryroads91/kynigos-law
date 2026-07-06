// Practice-area taxonomy. Single source for the /practice-areas directory,
// the homepage practice index, the nav dropdown, and the footer. Groups map
// to anchor sections on /practice-areas; only flagship pages get real routes.

export type FeeShapeKey = "flat" | "staged" | "success" | "quoted";

export type FeeShape = {
  label: string;
  /** One-line explanation used by the fee-design module. */
  short: string;
  /** When this shape is the right instrument. */
  when: string;
};

export const FEE_SHAPES: Record<FeeShapeKey, FeeShape> = {
  flat: {
    label: "Flat fee",
    short: "One number, stated in writing before the work begins.",
    when: "The document or deliverable defines the scope, so the firm can carry the efficiency risk.",
  },
  staged: {
    label: "Staged fixed fees",
    short: "Each phase priced on its own; you decide whether to proceed.",
    when: "Disputes and negotiations, where uncertainty arrives one stage at a time.",
  },
  success: {
    label: "Fixed + success",
    short: "A fixed base plus a component earned on the outcome.",
    when: "Matters with a winnable result, where the firm's upside should be yours.",
  },
  quoted: {
    label: "Quoted per matter",
    short: "Scoped and priced in writing once the matter is defined.",
    when: "Transactions and bespoke engagements, sized to the deal rather than the clock.",
  },
};

export type Service = {
  name: string;
  /** One or two sentences, client-facing. No invented prices. */
  description: string;
  fee: FeeShapeKey;
  /** Deep page, when one exists. */
  href?: string;
};

export type PracticeGroup = {
  /** Anchor id on /practice-areas. */
  slug: string;
  num: string;
  name: string;
  lede: string;
  /** The built-out page that anchors this group, when one exists. */
  flagship?: { label: string; href: string };
  services: Service[];
};

export const PRACTICE_GROUPS: PracticeGroup[] = [
  {
    slug: "family-personal",
    num: "01",
    name: "Family & Personal",
    lede: "The matters closest to home—divorce, children, and what you leave behind. Staged pricing keeps the hardest decisions yours, not the meter's.",
    flagship: { label: "Family Law", href: "/practice-areas/family-law" },
    services: [
      {
        name: "Divorce & Separation",
        description:
          "Uncontested and contested divorce, separation agreements, and the negotiation that decides how both go. Each stage—strategy, filings, settlement—gets its own fixed number before it starts.",
        fee: "staged",
        href: "/practice-areas/family-law",
      },
      {
        name: "Custody, Visitation & Support",
        description:
          "Custody and visitation arrangements, child support, and modifications when circumstances change. Priced by the stage, decided by you.",
        fee: "staged",
        href: "/practice-areas/family-law",
      },
      {
        name: "Prenuptial & Postnuptial Agreements",
        description:
          "An agreement drafted or reviewed while it is still easy—clear terms, full disclosure, and a number fixed before the drafting starts.",
        fee: "flat",
      },
      {
        name: "Wills, Trusts & Estates",
        description:
          "Wills, revocable trusts, powers of attorney, and health-care directives—an estate plan scoped as a defined package, not an open file.",
        fee: "flat",
      },
      {
        name: "Estate & Trust Administration",
        description:
          "Counsel for personal representatives and trustees working through a DC estate—filings, notices, distributions, and the questions in between.",
        fee: "quoted",
      },
    ],
  },
  {
    slug: "work-employment",
    num: "02",
    name: "Work & Employment",
    lede: "What you sign, what you leave with, and what you are still allowed to do next. Most of it is document work—priced flat, before you commit.",
    flagship: {
      label: "Professional Contract Review",
      href: "/practice-areas/contract-review",
    },
    services: [
      {
        name: "Executive & Professional Contract Review",
        description:
          "The firm's posted product for physicians, dentists, executives, and other professionals: a full redline, market analytics on the offer, and a call to walk through every change.",
        fee: "flat",
        href: "/practice-areas/contract-review",
      },
      {
        name: "Employment Agreements & Offers",
        description:
          "Offer letters, employment agreements, and compensation terms—reviewed or negotiated before you sign, while the leverage still exists.",
        fee: "flat",
      },
      {
        name: "Severance & Separation",
        description:
          "When a role ends: what the severance package actually says, what you are waiving, and what can still be negotiated.",
        fee: "flat",
      },
      {
        name: "Non-Competes & Restrictive Covenants",
        description:
          "DC bans most non-competes outright. The review tells you whether yours is one of them—and what the non-solicit and confidentiality terms still reach.",
        fee: "flat",
      },
      {
        name: "Wrongful Termination",
        description:
          "When a firing crosses a legal line, the matter is built around the outcome—a fixed base with a success component tied to the recovery, where permitted.",
        fee: "success",
      },
      {
        name: "Professional License Defense",
        description:
          "Responding to board complaints and license proceedings—the response, the hearing, the resolution—priced stage by stage.",
        fee: "staged",
      },
    ],
  },
  {
    slug: "business-corporate",
    num: "03",
    name: "Business & Corporate",
    lede: "From formation to exit: the agreements a business runs on, the deals that change it, and the disputes that test it.",
    services: [
      {
        name: "Business Formation & Governance",
        description:
          "Entity selection, formation, operating agreements, and bylaws—the governance documents that prevent the disputes lawyers usually get paid to clean up.",
        fee: "flat",
      },
      {
        name: "Commercial Contracts",
        description:
          "Drafting, review, and negotiation of the agreements a business runs on—services, supply, licensing, NDAs, and the terms buried in all of them.",
        fee: "flat",
      },
      {
        name: "Mergers & Acquisitions",
        description:
          "Buying or selling a business—letter of intent through closing, diligence, purchase agreements, and the negotiation between. The fee is sized to the transaction, not the timesheet.",
        fee: "quoted",
      },
      {
        name: "Partnership & Buy-Out Matters",
        description:
          "Partner admissions and exits, buy-sell agreements, and practice buyouts—including for physicians and dentists leaving or joining a group.",
        fee: "quoted",
      },
      {
        name: "Negotiation Counsel",
        description:
          "Strategy behind the scenes or representation at the table for a negotiation already in motion—scoped to the round, not the relationship.",
        fee: "staged",
      },
      {
        name: "Commercial Disputes & Demand Letters",
        description:
          "Demand letters, negotiated resolutions, and settlement agreements. Escalation is your decision at every stage—each one priced before it begins.",
        fee: "staged",
      },
    ],
  },
  {
    slug: "real-estate-housing",
    num: "04",
    name: "Real Estate & Housing",
    lede: "Property bought, leased, defended, and recovered—on either side of the landlord-tenant table.",
    flagship: {
      label: "Landlord-Tenant",
      href: "/practice-areas/landlord-tenant",
    },
    services: [
      {
        name: "Purchases & Sales",
        description:
          "Contract review, negotiation, and closing support for residential and commercial purchases—before the earnest money is at risk.",
        fee: "quoted",
      },
      {
        name: "Commercial & Residential Leasing",
        description:
          "Leases drafted, reviewed, and negotiated before signature—term, escalations, repair obligations, and the exit rights everyone forgets to read.",
        fee: "flat",
      },
      {
        name: "Landlord-Tenant Disputes",
        description:
          "Possession actions, DC Landlord-Tenant Branch filings, hearings, and lease enforcement—a fixed fee paired with a success component.",
        fee: "success",
        href: "/practice-areas/landlord-tenant",
      },
      {
        name: "Eviction Defense",
        description:
          "Notice defects, procedural defenses, and negotiated outcomes for tenants facing eviction. The firm's upside is the result, not the number of hearings.",
        fee: "success",
        href: "/practice-areas/landlord-tenant",
      },
    ],
  },
  {
    slug: "capital-finance",
    num: "05",
    name: "Capital Markets & Finance",
    lede: "Institutional work from counsel who spent a decade on the principal side—opinions that close deals, and documents negotiated like the money is real.",
    flagship: {
      label: "Capital Markets",
      href: "/practice-areas/capital-markets",
    },
    services: [
      {
        name: "Legal Opinion Letters",
        description:
          "DC-law opinions for institutional lenders and funds—CRE loans, SFR mortgages, preferred equity, LLC membership interests—at a flat fee per opinion.",
        fee: "flat",
        href: "/practice-areas/capital-markets",
      },
      {
        name: "Lender & Fund Deal Counsel",
        description:
          "Loan agreements, intercreditor and security agreements, and preferred equity documents—negotiated and papered per transaction.",
        fee: "quoted",
        href: "/practice-areas/capital-markets",
      },
      {
        name: "Real Estate Finance",
        description:
          "Acquisition, bridge, and construction financing—term sheet through closing, for lenders and borrowers alike.",
        fee: "quoted",
      },
      {
        name: "Structured Finance",
        description:
          "Warehouse lines, loan participations, and structured credit arrangements—documented by counsel who has sat inside the structures.",
        fee: "quoted",
      },
      {
        name: "Investment Management & Private Funds",
        description:
          "Fund documents, side letters, and management arrangements—reviewed and negotiated for managers and the investors across from them.",
        fee: "quoted",
      },
    ],
  },
];

/** Total service count across all groups—used for copy and tests. */
export function serviceCount(): number {
  return PRACTICE_GROUPS.reduce((n, g) => n + g.services.length, 0);
}
