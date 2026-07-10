import Link from "next/link";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import NewsletterSignup from "@/components/NewsletterSignup";
import { PRACTICE_GROUPS } from "@/content/practices";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <div className="footer-brand">Kynigos</div>
            <div className="footer-tag">Calculated. Zealous. Invested.</div>
            <p className="footer-desc">
              Serious legal work, clearly scoped and priced before it begins.
              Washington, DC.
            </p>
            <Link href="/contact" className="footer-cta">
              Start Your Matter
            </Link>
          </div>
          <nav aria-label="Who we serve">
            <h4>Who We Serve</h4>
            <ul className="footer-links">
              <li>
                <Link href="/people">Individuals &amp; Families</Link>
              </li>
              <li>
                <Link href="/businesses">Businesses &amp; Professionals</Link>
              </li>
              <li>
                <Link href="/capital">Lenders &amp; Investors</Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Practice areas">
            <h4>Practice Areas</h4>
            <ul className="footer-links">
              <li>
                <Link href="/practice-areas">All Practice Areas</Link>
              </li>
              {PRACTICE_GROUPS.map((group) => (
                <li key={group.slug}>
                  <Link href={`/practice-areas#${group.slug}`}>
                    {group.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Firm">
            <h4>Firm</h4>
            <ul className="footer-links">
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/how-it-works">How it Works</Link>
              </li>
              <li>
                <Link href="/philosophy">Philosophy</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Insights">
            <h4>Insights</h4>
            <ul className="footer-links">
              <li>
                <Link href="/insights">All Insights</Link>
              </li>
              <li>
                <Link href="/insights#essays">Personal Essays</Link>
              </li>
              <li>
                <Link href="/insights#publications">Kynigos Publications</Link>
              </li>
              <li>
                <Link href="/white-papers">White Papers</Link>
              </li>
            </ul>
          </nav>
          <div>
            <h4>Contact</h4>
            <ul className="footer-links">
              <li>
                <a href="tel:+13045491058">(304) 549-1058</a>
              </li>
              <li>
                <a href="mailto:info@kynigos.law">info@kynigos.law</a>
              </li>
              <li>
                <span className="footer-plain">Washington, DC</span>
              </li>
            </ul>
          </div>
        </div>
        {/* Renders only when NEXT_PUBLIC_NEWSLETTER_ENABLED is set. */}
        <NewsletterSignup />
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
          <ul className="footer-legal">
            <li>
              <Link href="/legal/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/legal/disclaimer">Website Disclaimer</Link>
            </li>
            <li>
              <Link href="/legal/attorney-advertising">
                Attorney Advertising
              </Link>
            </li>
            <li>
              <Link href="/legal/cookies">Cookie Policy</Link>
            </li>
            <li>
              <CookieSettingsButton />
            </li>
            <li>
              <Link href="/accessibility">Accessibility</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
