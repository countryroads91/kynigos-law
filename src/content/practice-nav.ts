// Lightweight nav-facing view of the practice taxonomy: just enough to build
// menu links without pulling the full content model (26 service descriptions
// plus fee copy) into the client bundle of every page. practices.test.ts
// enforces that this list stays in lockstep with PRACTICE_GROUPS.
export type PracticeNavItem = { slug: string; name: string };

export const PRACTICE_NAV: PracticeNavItem[] = [
  { slug: "family-personal", name: "Family & Personal" },
  { slug: "work-employment", name: "Work & Employment" },
  { slug: "business-corporate", name: "Business & Corporate" },
  { slug: "real-estate-housing", name: "Real Estate & Housing" },
  { slug: "capital-finance", name: "Capital Markets & Finance" },
];
