// White papers—the research layer of the Insights system. Institutional
// authorship only. `relatedPosts` names the Kynigos publications that
// introduce or apply each paper (relationships must be real, never implied).

export type Paper = {
  slug: string;
  title: string;
  tag: string;
  sub: string;
  description: string;
  summary: string; // executive summary shown on the paper card/page
  author: string;
  date: string; // ISO YYYY-MM-DD
  readingTime: string;
  fileName: string; // download filename; the PDF itself is served by /api/paper/[slug]
  topics: string[];
  relatedPosts: string[]; // slugs into posts.ts
  relatedPractice?: { label: string; href: string };
};

export const papers: Paper[] = [
  {
    slug: "misaligned-incentives",
    title: "Misaligned Incentives",
    tag: "Paper 01 · Principal-Agent Theory",
    sub: "The principal-agent problem and the case against hourly billing.",
    description:
      "The formal economics of hourly legal billing—from Stephen Ross's 1973 framing through modern game-theoretic models—and why a flat fee realigns the attorney-client relationship.",
    summary:
      "When you hire an attorney who bills by the hour, you create a classic principal-agent problem: your lawyer has information you don't and an incentive to bill hours you may not need. This paper lays out the formal economics—from Stephen Ross's 1973 framing through modern game-theoretic models—and shows why a flat fee realigns the relationship.",
    author: "Kynigos Law Firm",
    date: "2026-06-20",
    readingTime: "35 min read",
    fileName: "Kynigos-Misaligned-Incentives.pdf",
    topics: ["Principal-agent theory", "Fee structures", "Incentive design"],
    relatedPosts: [
      "your-lawyer-has-an-incentive-problem",
      "why-divorce-makes-you-bad-at-math",
    ],
  },
  {
    slug: "market-for-lemons",
    title: "The Market for Lemons",
    tag: "Paper 02 · Information Economics",
    sub: "Flat fees as a quality signal in the market for legal services.",
    description:
      "Akerlof's lemons model applied to legal fees: legal services are a credence good the client cannot evaluate, and a posted flat fee is a credible quality signal.",
    summary:
      "George Akerlof's 1970 “market for lemons” showed how hidden quality can collapse a market: when buyers can't tell good from bad, the price falls to the level of the bad and the good exits. Legal services are a textbook case—a credence good the client cannot evaluate even after delivery. This paper applies the lemons model to legal fees and argues that a flat fee is a credible quality signal: a lawyer who fixes the price before the work commits to the efficiency the hourly model has every reason to avoid.",
    author: "Kynigos Law Firm",
    date: "2026-06-28",
    readingTime: "45 min read",
    fileName: "Kynigos-Market-for-Lemons.pdf",
    topics: ["Information economics", "Adverse selection", "Quality signals"],
    relatedPosts: [],
  },
];

export function getPaper(slug: string): Paper | undefined {
  return papers.find((p) => p.slug === slug);
}
