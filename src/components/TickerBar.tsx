// Curated marquee of named engagements—products a visitor could actually
// buy, not a directory of every conceivable matter. Ordered to sweep the
// three client doors (people → businesses → capital); the brand accent
// recurs at each loop third.
const items = [
  "Staged-Fee Divorce",
  "Professional Contract Review",
  "Prenuptial Agreements",
  "Estate Planning",
  "Severance Negotiation",
  "Not for Feeding the Clock",
  "Business Counsel",
  "Commercial Contracts",
  "Practice Buy-Ins & Buyouts",
  "Partner Exits",
  "Commercial Lease Review",
  "Not for Feeding the Clock",
  "DC Legal Opinion Letters",
  "Private Lender Counsel",
  "Real Estate Finance",
  "Landlord Representation",
  "Mergers & Acquisitions",
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
