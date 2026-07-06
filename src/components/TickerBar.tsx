// Curated marquee copy spanning all five practice groups—inspired by, not
// bound to, src/content/practices.ts (marquee labels are shortened for
// rhythm). The brand accent recurs at each loop third; fee framing lives in
// the sections below. The marquee's job is breadth.
const items = [
  "Divorce & Separation",
  "Custody & Support",
  "Prenuptial Agreements",
  "Wills, Trusts & Estates",
  "Executive Contract Review",
  "Employment Agreements",
  "Not for Feeding the Clock",
  "Severance Negotiation",
  "Business Formation",
  "Commercial Contracts",
  "Mergers & Acquisitions",
  "Commercial Disputes",
  "Negotiation Counsel",
  "Not for Feeding the Clock",
  "Real Estate & Leasing",
  "Eviction Defense",
  "Legal Opinion Letters",
  "Real Estate Finance",
  "Structured Finance",
  "Private Funds",
  "Not for Feeding the Clock",
];

export default function TickerBar() {
  // Duplicate for seamless loop
  const doubled = [...items, ...items];
  const unique = items.filter((i, n) => items.indexOf(i) === n);
  return (
    <div className="ticker">
      {/* The marquee is decorative and duplicated—announce the list once. */}
      <p className="sr-only">
        Kynigos services: {unique.join(", ")}.
      </p>
      <div className="ticker-track" aria-hidden="true">
        {doubled.map((label, i) => {
          const accent = label === "Not for Feeding the Clock";
          return (
            <span
              key={i}
              className={accent ? "ticker-item ticker-item--accent" : "ticker-item"}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
