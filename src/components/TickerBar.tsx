const items = [
  "Flat Fee Divorce",
  "Staged-Fee Divorce",
  "Flat Fee Contract Review",
  "Flat Fee Contract Negotiation",
  "Flat Fee Legal Opinion Letters",
  "Flat Fee Eviction Defense",
  "Flat Fee Prenuptial Agreements",
  "Not for Feeding the Clock",
  "Flat Fee Lease Review",
  "Flat Fee Employment Agreement Review",
  "Flat Fee NDA Review",
  "Flat Fee Loan Document Review",
  "Flat Fee Business Agreements",
  "Flat Fee Demand Letters",
  "Flat Fee Settlement Agreements",
  "Flat Fee Privacy Policy Review",
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
