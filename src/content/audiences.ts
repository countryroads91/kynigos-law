// The three client doors. Single source for the homepage door cards, the
// /people, /businesses, and /capital landing pages, the nav, and the footer.
// The practice taxonomy (practices.ts) stays the inventory; this file is the
// storefront—each audience curates the matters that audience actually buys.

import type { FeeShapeKey } from "@/content/practices";

export type AudienceMatter = {
  name: string;
  /** One or two sentences, client-facing. No invented prices. */
  blurb: string;
  fee: FeeShapeKey;
  /** Most specific existing destination—deep page, directory anchor, or an
   *  anchor on the audience page itself. */
  href: string;
};

export type AudienceStrip = {
  /** Anchor id on the audience page. */
  id: string;
  kicker: string;
  heading: string;
  body: string;
  bullets?: string[];
  cta: { label: string; href: string };
};

export type Audience = {
  /** Route segment and anchor id. */
  slug: "people" | "businesses" | "capital";
  num: string;
  /** Full client-facing name—page eyebrow, door card title. */
  doorLabel: string;
  /** Terse nav label. */
  navLabel: string;
  /** Door-card copy on the homepage. */
  doorBlurb: string;
  /** Short run of matter names previewed on the door card. */
  doorMatters: string[];
  /** Landing page H1. */
  headline: string;
  lede: string;
  whoFor: string[];
  matters: AudienceMatter[];
  strip: AudienceStrip;
  /** Placeholder for the intake prompt at the bottom of the page. */
  intakePrompt: string;
  /** Post slugs from posts.ts—never imply an unconfirmed relationship. */
  relatedPosts: string[];
};

export const AUDIENCES: Audience[] = [
  {
    slug: "people",
    num: "01",
    doorLabel: "Individuals & Families",
    navLabel: "People",
    doorBlurb:
      "Divorce, custody, prenuptial agreements, employment terms, estate plans—the decisions that reach your family, your career, and what you own.",
    doorMatters: [
      "Staged-Fee Divorce",
      "Contract Review",
      "Severance",
      "Estate Planning",
    ],
    headline: "Counsel for the decisions closest to home.",
    lede: "Built for professionals, executives, physicians, and households with real assets and real decisions at stake—people who want strategic representation without surrendering control of the legal budget.",
    whoFor: [
      "A professional or business owner navigating divorce who wants the economics mapped before the fight is chosen.",
      "A physician, dentist, or executive with an employment agreement, a buy-in, or a severance package on the table.",
      "A couple that wants a prenuptial or postnuptial agreement done while it is still easy.",
      "A household putting wills, trusts, and directives in place around what it has built.",
    ],
    matters: [
      {
        name: "Staged-Fee Divorce",
        blurb:
          "Each stage—strategy, filings, disclosure, settlement, trial—gets its own fixed price before it starts. You decide whether we proceed; we have to earn the next stage.",
        fee: "staged",
        href: "/practice-areas/family-law",
      },
      {
        name: "Custody, Visitation & Support",
        blurb:
          "Custody and visitation arrangements, child support, and the modifications when life changes—priced by the stage, decided by you.",
        fee: "staged",
        href: "/practice-areas/family-law",
      },
      {
        name: "Prenuptial & Postnuptial Agreements",
        blurb:
          "Clear terms and full disclosure, drafted or reviewed at a number fixed before the drafting starts.",
        fee: "flat",
        href: "/practice-areas#family-personal",
      },
      {
        name: "Professional Contract Review",
        blurb:
          "The firm's posted product, from $444: a full redline, market analytics on the offer, and a call to walk through every change before you sign.",
        fee: "flat",
        href: "/practice-areas/contract-review",
      },
      {
        name: "Severance & Restrictive Covenants",
        blurb:
          "What the package actually says, what you are waiving, what DC's non-compete ban still lets you do—and what can still be negotiated.",
        fee: "flat",
        href: "/practice-areas#work-employment",
      },
      {
        name: "Wills, Trusts & Estates",
        blurb:
          "Wills, revocable trusts, powers of attorney, and health-care directives—an estate plan scoped as a defined package, not an open file.",
        fee: "flat",
        href: "/practice-areas#family-personal",
      },
    ],
    strip: {
      id: "staged-fees",
      kicker: "The Model",
      heading: "Staged fees keep the hardest decisions yours.",
      body: "A divorce or a dispute is not one purchase—it is a series of decisions made under pressure. So it is priced as one: each stage scoped and fixed on its own, with a gate between stages where you decide whether the last one earned the next. The firm cannot profit from drift, and you never discover the cost after the fact.",
      cta: { label: "How Our Fees Work", href: "/how-it-works" },
    },
    intakePrompt:
      "I am considering divorce and want to understand my options before anyone files… / I have an employment agreement to review before Friday…",
    relatedPosts: ["i-have-been-the-client", "why-divorce-makes-you-bad-at-math"],
  },
  {
    slug: "businesses",
    num: "02",
    doorLabel: "Business Owners & Professionals",
    navLabel: "Businesses",
    doorBlurb:
      "Contracts, people, partnerships, and practices—for companies substantial enough to need recurring legal judgment, without a legal department's overhead.",
    doorMatters: [
      "Business Counsel",
      "Commercial Contracts",
      "Practice Buyouts",
      "Partner Exits",
    ],
    headline: "Outside counsel that runs on your economics.",
    lede: "For owner-led companies and professional practices: enough legal surface to need real judgment, too much discipline to pre-fund a billing black box. Scoped work, stated prices, and counsel that answers.",
    whoFor: [
      "An owner-led company that needs contracts, employment documents, and deal support—without hiring a general counsel.",
      "A physician or dentist group admitting a partner, buying out a founder, or selling the practice.",
      "Partners or shareholders working through an admission, an exit, or a dispute.",
      "A landlord with a portfolio and a recurring need for enforcement that does not reward delay.",
    ],
    matters: [
      {
        name: "Business Counsel",
        blurb:
          "Formation, governance, and the running legal questions of an operating company—handled as scoped engagements with stated prices, not an open retainer.",
        fee: "quoted",
        href: "/practice-areas#business-corporate",
      },
      {
        name: "Commercial Contracts",
        blurb:
          "Drafting, review, and negotiation of the agreements the business runs on—each one a defined deliverable at a defined price.",
        fee: "flat",
        href: "/practice-areas#business-corporate",
      },
      {
        name: "Practice Buy-Ins, Buyouts & Sales",
        blurb:
          "Joining, admitting, exiting, buying, or selling a professional practice—priced to the transaction, not the timesheet.",
        fee: "quoted",
        href: "#practice-lifecycle",
      },
      {
        name: "Partnership & Shareholder Matters",
        blurb:
          "Admissions, exits, buy-sell agreements, and the disputes that test them—escalation is your decision at every stage.",
        fee: "quoted",
        href: "/practice-areas#business-corporate",
      },
      {
        name: "Leases & Landlord Representation",
        blurb:
          "Commercial leases before signature; DC landlord-tenant enforcement at a fixed fee paired with a success component—the firm's upside is the result, not the number of hearings.",
        fee: "success",
        href: "/practice-areas/landlord-tenant",
      },
      {
        name: "Commercial Disputes & Demand Letters",
        blurb:
          "Demand letters, negotiated resolutions, and settlement agreements—each stage priced before it begins.",
        fee: "staged",
        href: "/practice-areas#business-corporate",
      },
    ],
    strip: {
      id: "practice-lifecycle",
      kicker: "Professional Practices",
      heading: "The whole lifecycle of a professional practice.",
      body: "Physicians, dentists, and professional groups live through the same sequence: join, negotiate the agreement, buy in, admit a partner, work through an exit, buy or sell the practice, sign the lease, answer the board. Kynigos is built for the sequence, not just the transaction in front of you.",
      bullets: [
        "Employment agreements & compensation",
        "Buy-ins & buyouts",
        "Partner admissions & exits",
        "Purchases & sales of practices",
        "Commercial leases",
        "License defense",
      ],
      cta: {
        label: "Contract Review from $444",
        href: "/practice-areas/contract-review",
      },
    },
    intakePrompt:
      "We are buying out a partner and need the agreement papered… / I need a vendor contract reviewed by next week…",
    relatedPosts: ["your-lawyer-has-an-incentive-problem", "i-watched-the-meter-run"],
  },
  {
    slug: "capital",
    num: "03",
    doorLabel: "Lenders & Investors",
    navLabel: "Capital",
    doorBlurb:
      "Opinions, loan documents, and deal counsel from an attorney who spent a decade on the principal side of the trade.",
    doorMatters: [
      "DC Legal Opinions",
      "Deal Counsel",
      "Real Estate Finance",
      "Fund Documents",
    ],
    headline: "Counsel from the principal side of the capital.",
    lede: "For private lenders, real-estate investors, sponsors, and funds: documents reviewed by someone who understands what the capital is trying to accomplish—at flat and per-deal prices a desk can plan around.",
    whoFor: [
      "A private lender that needs DC opinions and loan documents that close on schedule.",
      "A real-estate investor or sponsor papering acquisition, bridge, or construction financing.",
      "A fund or asset manager that wants deal documents negotiated by counsel who has sat inside the structures.",
      "A repeat client that wants defined turnaround standards and per-deal pricing instead of a new mystery every closing.",
    ],
    matters: [
      {
        name: "DC Legal Opinion Letters",
        blurb:
          "DC-law opinions for institutional lenders and funds—CRE loans, SFR mortgages, preferred equity, LLC membership interests—at a flat fee per opinion.",
        fee: "flat",
        href: "/practice-areas/capital-markets",
      },
      {
        name: "Lender & Fund Deal Counsel",
        blurb:
          "Loan agreements, security agreements, and preferred equity documents—negotiated and papered per transaction.",
        fee: "quoted",
        href: "/practice-areas/capital-markets",
      },
      {
        name: "Real Estate Finance",
        blurb:
          "Acquisition, bridge, and construction financing—term sheet through closing, for lenders and borrowers alike.",
        fee: "quoted",
        href: "/practice-areas#capital-finance",
      },
      {
        name: "Intercreditor & Participation Agreements",
        blurb:
          "The agreements between the capital—intercreditor, co-lender, and participation arrangements documented by counsel who has negotiated them from the principal seat.",
        fee: "quoted",
        href: "/practice-areas#capital-finance",
      },
      {
        name: "Structured Finance",
        blurb:
          "Warehouse lines, loan participations, and structured credit arrangements—documented by counsel who has sat inside the structures.",
        fee: "quoted",
        href: "/practice-areas#capital-finance",
      },
      {
        name: "Investment Management & Private Funds",
        blurb:
          "Fund documents, side letters, and management arrangements—reviewed and negotiated for managers and the investors across from them.",
        fee: "quoted",
        href: "/practice-areas#capital-finance",
      },
    ],
    strip: {
      id: "desk",
      kicker: "The Private Capital Desk",
      heading:
        "Documents reviewed by someone who understands what the capital is trying to accomplish.",
      body: "Before law, a decade in institutional credit—Goldman Sachs, Invictus Capital Partners, LendingOne—co-founding lending platforms and underwriting the loans these documents govern. The review starts from the trade, not the template. Flat per-opinion pricing and per-deal quotes let a desk plan legal cost like any other closing cost.",
      cta: {
        label: "The Capital Markets Practice",
        href: "/practice-areas/capital-markets",
      },
    },
    intakePrompt:
      "Our fund needs a DC opinion for a loan closing this month… / We need loan documents negotiated on a bridge facility…",
    relatedPosts: ["your-lawyer-has-an-incentive-problem"],
  },
];

export function getAudience(slug: string): Audience | undefined {
  return AUDIENCES.find((a) => a.slug === slug);
}
