const items = [
  "Flat-Fee Divorce",
  "Flat-Fee Custody",
  "Flat-Fee Contract Review",
  "Flat-Fee Legal Opinion Letter",
  "Flat-Fee Eviction Defense",
  "Flat-Fee Prenuptial",
  "Contingency Employment",
  "Deal Counsel for Lenders & Funds",
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
