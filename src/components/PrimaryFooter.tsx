import Link from "next/link";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import NewsletterSignup from "@/components/NewsletterSignup";
import { AUDIENCES } from "@/content/audiences";

export default function PrimaryFooter() {
  return (
    <footer className="footer primary-footer">
      <div className="footer-inner">
        <div className="primary-footer-lead">
          <div>
            <div className="footer-brand">Kynigos</div>
            <div className="footer-tag">Calculated. Zealous. Invested.</div>
          </div>
          <p>
            Serious legal work, clearly scoped and intelligently priced, for
            clients with real decisions at stake.
          </p>
          <Link href="/contact" className="footer-cta">Tell Us What Is at Stake</Link>
        </div>

        <div className="primary-footer-grid">
          <nav aria-label="Client paths">
            <h4>Client Paths</h4>
            <ul className="footer-links">
              {AUDIENCES.map((audience) => (
                <li key={audience.slug}><Link href={`/${audience.slug}`}>{audience.kicker}</Link></li>
              ))}
              <li><Link href="/practice-areas">All Practice Areas</Link></li>
            </ul>
          </nav>
          <nav aria-label="Firm">
            <h4>Firm</h4>
            <ul className="footer-links">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/how-it-works">How It Works</Link></li>
              <li><Link href="/philosophy">Philosophy</Link></li>
              <li><Link href="/insights">Insights</Link></li>
            </ul>
          </nav>
          <div>
            <h4>Contact</h4>
            <ul className="footer-links">
              <li><a href="tel:+13045491058">(304) 549-1058</a></li>
              <li><a href="mailto:info@kynigos.law">info@kynigos.law</a></li>
              <li><span className="footer-plain">Washington, DC</span></li>
            </ul>
          </div>
        </div>

        <NewsletterSignup />
        <div className="footer-bottom">
          <p className="footer-disclaimer">
            &copy; {new Date().getFullYear()} Kynigos Law Firm, PLLC. All rights
            reserved. Attorney advertising. This website is for informational
            purposes only and does not constitute legal advice. Kynigos Law
            Firm, PLLC is licensed to practice law in the District of Columbia
            only. Matters outside DC may require referral to local counsel.
            Results may vary depending on your particular facts and legal circumstances.
          </p>
          <ul className="footer-legal">
            <li><Link href="/legal/privacy">Privacy Policy</Link></li>
            <li><Link href="/legal/disclaimer">Website Disclaimer</Link></li>
            <li><Link href="/legal/attorney-advertising">Attorney Advertising</Link></li>
            <li><Link href="/legal/cookies">Cookie Policy</Link></li>
            <li><CookieSettingsButton /></li>
            <li><Link href="/accessibility">Accessibility</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
