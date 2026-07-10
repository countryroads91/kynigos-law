import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, DM_Sans } from "next/font/google";
import "../app/globals.css";
import "../app/redesign.css";
import "../app/redesign-fixes.css";
import PrimaryNav from "@/components/PrimaryNav";
import PrimaryFooter from "@/components/PrimaryFooter";
import CookieConsent from "@/components/CookieConsent";
import AnalyticsGate from "@/components/AnalyticsGate";
import ConsentModeBridge from "@/components/ConsentModeBridge";
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
    "Clearly scoped counsel for sophisticated individuals, owner-led businesses, and private-capital participants in Washington, DC.",
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
    description: "Sophisticated counsel without the billing black box. Washington, DC.",
    images: [{ url: "/og-image.png", width: 2400, height: 1260 }],
  },
  robots: { index: true, follow: true },
};

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${sourceSerif.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(legalServiceJsonLd) }}
        />
        <PrimaryNav />
        <main>{children}</main>
        <PrimaryFooter />
        <CookieConsent />
        <ScrollReveal />
        <AnalyticsGate />
        <ConsentModeBridge />
      </body>
    </html>
  );
}
