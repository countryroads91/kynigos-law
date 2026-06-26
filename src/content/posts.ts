export type Post = {
  slug: string;
  title: string;
  dek: string;
  description: string;
  author: string;
  authorTitle: string;
  date: string; // ISO YYYY-MM-DD
  category: string;
};

// Newest first.
export const posts: Post[] = [
  {
    slug: "i-have-been-the-client",
    title: "I Have Been the Client",
    dek: "I paid the retainers. I watched the meter run. I watched a white-shoe firm mangle my own drafts, bill me for the damage, then bill me again to fix what they broke. Then I pushed back—and the firm wrote off nearly $3,000.",
    description:
      "A DC attorney's documented, first-person account of being billed by the hour through his own divorce—four examples with dates and numbers—and why he built Kynigos Law Firm on flat fees.",
    author: "Bayan Misaghi, Esq.",
    authorTitle: "Managing Partner",
    date: "2026-06-26",
    category: "Personal · Why Kynigos Exists",
  },
  {
    slug: "i-watched-the-meter-run",
    title: "I Watched the Meter Run",
    dek: "What my own divorce taught me about the economics of hourly billing—and why I built a firm that refuses to do it.",
    description:
      "A DC attorney's first-person account of being billed by the hour through his own divorce—and why he built Kynigos Law Firm on flat fees that align his incentives with the client's.",
    author: "Bayan Misaghi, Esq.",
    authorTitle: "Managing Partner",
    date: "2026-06-25",
    category: "Personal · Fee Structures",
  },
  {
    slug: "why-divorce-makes-you-bad-at-math",
    title: "Why Divorce Makes You Bad at Math",
    dek: "The behavioral economics of why even sophisticated professionals make terrible financial decisions during divorce—and how the billing model makes it worse.",
    description:
      "Even sophisticated professionals make poor financial decisions during divorce. Behavioral economics explains why—and how hourly billing exploits every cognitive bias.",
    author: "Bayan Misaghi, Esq.",
    authorTitle: "Managing Partner",
    date: "2026-06-24",
    category: "Behavioral Economics",
  },
  {
    slug: "your-lawyer-has-an-incentive-problem",
    title: "Your Lawyer Has an Incentive Problem",
    dek: "Economists have spent fifty years studying how hourly billing quietly works against you. Here's what they found.",
    description:
      "Hourly billing creates a principal-agent problem that quietly works against you. Fifty years of economics explain why flat fees realign your lawyer's incentives with your outcome.",
    author: "Bayan Misaghi, Esq.",
    authorTitle: "Managing Partner",
    date: "2026-06-23",
    category: "Economics · Fee Structures",
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Format an ISO date without Date parsing, to avoid timezone off-by-one.
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
