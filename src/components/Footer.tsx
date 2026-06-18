import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">Kynigos</div>
            <div className="footer-tag">Calculated. Zealous. Invested.</div>
            <p style={{ fontSize: 13 }}>
              Flat-fee and contingency representation. Washington, DC.
            </p>
          </div>
          <div>
            <h4>Practice Areas</h4>
            <ul className="footer-links">
              <li>
                <Link href="/practice-areas/family-law">Family Law</Link>
              </li>
              <li>
                <Link href="/practice-areas/landlord-tenant">
                  Landlord-Tenant
                </Link>
              </li>
              <li>
                <Link href="/practice-areas/capital-markets">
                  Capital Markets
                </Link>
              </li>
              <li>
                <Link href="/practice-areas/contract-review">
                  Contract Review
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Firm</h4>
            <ul className="footer-links">
              <li>
                <Link href="/blog">White Papers</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul className="footer-links">
              <li>
                <a href="tel:+13045491058">(304) 549-1058</a>
              </li>
              <li>
                <a href="mailto:info@kynigos.law">info@kynigos.law</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-disclaimer">
            &copy; {new Date().getFullYear()} Kynigos Law Firm, PLLC. All rights
            reserved. Attorney advertising. This website is for informational
            purposes only and does not constitute legal advice. Kynigos Law
            Firm, PLLC is licensed to practice law in the District of Columbia
            only. Matters outside DC may require referral to local counsel.
            Results may vary depending on your particular facts and legal
            circumstances.
          </p>
        </div>
      </div>
    </footer>
  );
}
