const items = [
  "Staged-Fee Divorce",
  "Professional Contract Review",
  "Business Counsel",
  "Practice Buyouts",
  "Private Lender Counsel",
  "DC Legal Opinions",
  "Commercial Lease Review",
  "Partner Exits",
];

export default function TickerBar() {
  const tripled = [...items, ...items, ...items];
  return (
    <div className="ticker product-ticker">
      <p className="sr-only">Kynigos flagship engagements: {items.join(", ")}.</p>
      <div className="ticker-track" aria-hidden="true">
        {tripled.map((label, index) => (
          <span className="ticker-item" key={`${label}-${index}`}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
