import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, DM_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import AnalyticsGate from "@/components/AnalyticsGate";
import ScrollReveal from "@/components/ScrollReveal";
import { PRACTICE_GROUPS } from "@/content/practices";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kynigos.law"),
  title: {
    default: "Kynigos Law Firm—Your attorney should have skin in the game.",
    template: "%s · Kynigos Law Firm",
  },
  description:
    "Flat-fee and contingency representation from a finance-trained attorney in Washington, DC. Family, employment, business, real estate, and capital markets matters—priced by outcome, not hours.",
  applicationName: "Kynigos Law Firm",
  authors: [{ name: "Kynigos Law Firm, PLLC" }],
  keywords: [
    "Washington DC attorney",
    "flat fee lawyer",
    "contingency attorney",
    "DC family law",
    "DC landlord tenant",
    "legal opinion letter",
    "physician contract review",
    "Kynigos Law Firm",
  ],
  openGraph: {
    type: "website",
    siteName: "Kynigos Law Firm",
    locale: "en_US",
    title: "Kynigos Law Firm",
    description: "Flat-fee and contingency representation. Washington, DC.",
    images: [{ url: "/og-image.png", width: 2400, height: 1260 }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Organization structured data—only claims supported by page content.
const legalServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "Kynigos Law Firm, PLLC",
  url: "https://kynigos.law",
  logo: "https://kynigos.law/logo.png",
  image: "https://kynigos.law/og-image.png",
  telephone: "+1-304-549-1058",
  email: "info@kynigos.law",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Washington",
    addressRegion: "DC",
    addressCountry: "US",
  },
  areaServed: "District of Columbia",
  priceRange: "Flat fee and contingency",
  knowsAbout: PRACTICE_GROUPS.map((group) => group.name),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // Next 16: data-scroll-behavior lets the router snap scroll-to-top during
    // SPA navigation while CSS scroll-behavior:smooth animates in-page anchors.
    // suppressHydrationWarning: the inline script below adds the `js` class to
    // <html> before hydration (by design—it gates scroll-reveal hiding), so
    // the server markup and hydrated class list intentionally differ here.
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${sourceSerif.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning: browser extensions (password managers,
          shopping assistants) stamp attributes onto <body> before React
          hydrates; that mismatch is theirs, not ours. Applies one level
          deep only—real child mismatches still surface. */}
      <body suppressHydrationWarning>
        {/* Runs synchronously before any content paints: the `js` class gates
            the scroll-reveal hidden state so content is never invisible when
            JavaScript is off (see [data-reveal] in globals.css). */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(legalServiceJsonLd),
          }}
        />
        <Nav />
        <main>{children}</main>
        <Footer />
        <CookieConsent />
        <ScrollReveal />
        {/* Loads only after analytics consent—see AnalyticsGate. */}
        <AnalyticsGate />
      </body>
    </html>
  );
}
