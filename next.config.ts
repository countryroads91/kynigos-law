import type { NextConfig } from "next";

// Report-Only first: layout.tsx carries inline scripts and Phase 4 adds GA4,
// so enforcement waits until the report console is quiet. Everything else
// below is enforced.
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com https://calendly.com https://*.calendly.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  // Violations POST to our own collector (Vercel logs); without this the
  // report-only header reports to nowhere and can never graduate to enforcing.
  "report-uri /api/csp-report",
].join("; ");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The blog index moved to /insights; article pages at /blog/[slug] remain.
      {
        source: "/blog",
        destination: "/insights",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          { key: "Content-Security-Policy-Report-Only", value: CSP_REPORT_ONLY },
        ],
      },
    ];
  },
  // The white-paper PDFs live outside public/ (served only by
  // /api/paper/[slug] after the lead gate); bundle them into that function.
  outputFileTracingIncludes: {
    "/api/paper/*": ["./src/content/white-papers/**"],
  },
};

export default nextConfig;
