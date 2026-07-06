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
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
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
