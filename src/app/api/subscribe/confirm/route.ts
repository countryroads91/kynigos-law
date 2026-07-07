import { NextResponse } from "next/server";
import { confirmSubscriber } from "@/lib/newsletter";
import { checkRateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";

// POST-only, called by the click-to-confirm page. Deliberately NOT a GET:
// email security scanners prefetch GET links, and a prefetched confirmation
// would fabricate the very consent double opt-in exists to prove.
export async function POST(req: Request) {
  // Own bucket—the subscribe form in every footer must not be able to starve
  // legitimate confirmation clicks.
  if (!(await checkRateLimit(req, "confirm"))) {
    return NextResponse.json(
      {
        ok: false,
        busy: true,
        error: "Too many requests. Please try again in a minute.",
      },
      { status: 429 },
    );
  }

  let token = "";
  try {
    const body = (await req.json()) as { token?: string };
    token = (body.token ?? "").trim();
  } catch {
    // fall through to the 422 below
  }
  if (!token || token.length > 200) {
    return NextResponse.json(
      { ok: false, error: "Missing confirmation token." },
      { status: 422 },
    );
  }

  try {
    const confirmed = await confirmSubscriber(token);
    if (!confirmed) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "This confirmation link is invalid, expired, or already used. Request a fresh one from the signup form.",
        },
        { status: 410 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[subscribe/confirm] failed:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again shortly." },
      { status: 502 },
    );
  }
}
