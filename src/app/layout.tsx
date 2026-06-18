import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, DM_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TickerBar from "@/components/TickerBar";

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
    "Flat-fee and contingency representation from a finance-trained attorney. Washington, DC. Family law, landlord-tenant, capital markets, and contract review—priced by outcome, not hours.",
  applicationName: "Kynigos Law Firm",
  authors: [{ name: "Bayan Misaghi, Esq." }],
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
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${sourceSerif.variable} ${dmSans.variable}`}
    >
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
        <TickerBar />
      </body>
    </html>
  );
}
