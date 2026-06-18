import Link from "next/link";

export default function Nav() {
  return (
    <nav className="nav" aria-label="Primary">
      <Link href="/" className="nav-brand">
        Kynigos
      </Link>
      <div className="nav-links">
        <Link href="/practice-areas/family-law">Family Law</Link>
        <Link href="/practice-areas/landlord-tenant">Landlord-Tenant</Link>
        <Link href="/practice-areas/capital-markets">Capital Markets</Link>
        <Link href="/practice-areas/contract-review">Contract Review</Link>
        <Link href="/about">About</Link>
        <Link href="/contact" className="nav-cta">
          Book Consultation
        </Link>
      </div>
    </nav>
  );
}
