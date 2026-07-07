// Server-side Cloudflare Turnstile verification. Env-gated like every other
// integration: no TURNSTILE_SECRET_KEY means the check is off (the widget is
// likewise hidden without NEXT_PUBLIC_TURNSTILE_SITE_KEY). Once the secret is
// set the check FAILS CLOSED—a missing token or an unreachable Cloudflare is
// a rejection, because at that point the widget is on every form and a real
// browser always has a token.

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  token: string | undefined,
  ip?: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Half-configured: the widget is live (site key set) but nothing verifies
    // its tokens. Looks protected, isn't—make that visible in the logs.
    if (token) {
      console.warn(
        "[turnstile] token received but TURNSTILE_SECRET_KEY is not set—verification skipped.",
      );
    }
    return true;
  }
  if (!token) return false;
  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        response: token,
        ...(ip ? { remoteip: ip } : {}),
      }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("[turnstile] verification request failed:", err);
    return false;
  }
}
