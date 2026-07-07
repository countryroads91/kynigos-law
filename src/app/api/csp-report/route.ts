import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Collector for the Content-Security-Policy-Report-Only header in
// next.config.ts. Without a report-uri, violation reports only ever appear in
// individual visitors' devtools and the CSP can never graduate to enforcing.
// Reports land in Vercel logs; review them before flipping the header.
export async function POST(req: Request) {
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > 16_384) {
    return new NextResponse(null, { status: 413 });
  }
  try {
    const report = await req.text();
    // Strip control chars except the JSON itself is logged verbatim-ish; cap
    // length so a hostile client cannot flood a single log line.
    console.warn("[csp] violation report:", report.slice(0, 4_000));
  } catch {
    // A malformed report is not worth an error response—it is fire-and-forget.
  }
  return new NextResponse(null, { status: 204 });
}
