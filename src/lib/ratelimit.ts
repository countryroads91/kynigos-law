// Per-IP sliding-window rate limit backed by Upstash Redis. Env-gated: with
// no Upstash credentials every request is allowed. Unlike Turnstile this
// FAILS OPEN—on infrastructure errors AND on slowness (a 2s cap), because a
// rate-limiter outage must never turn away a prospective client; Turnstile
// still stands in front of bots.

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const LIMIT = 5; // requests
const WINDOW = "1 m";
const TIMEOUT_MS = 2_000;

// On Vercel, x-forwarded-for is platform-set and trustworthy (Vercel
// overwrites client-supplied values). If this app ever runs behind a
// different proxy chain (e.g. Cloudflare in front), the leftmost hop becomes
// attacker-controlled—revisit before reusing elsewhere.
export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

// Cache limiters per bucket+credentials: reuse warms @upstash/ratelimit's
// ephemeral cache so already-blocked IPs short-circuit without a Redis call,
// and env changes (tests stub per-case) still get a fresh instance.
const limiters = new Map<string, Ratelimit>();

function getLimiter(bucket: string, url: string, token: string): Ratelimit {
  const key = `${bucket}|${url}|${token}`;
  let limiter = limiters.get(key);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(LIMIT, WINDOW),
      prefix: `kynigos:${bucket}`,
      ephemeralCache: new Map(),
    });
    limiters.set(key, limiter);
  }
  return limiter;
}

// Returns true when the request is allowed.
export async function checkRateLimit(
  req: Request,
  bucket: string,
): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return true;
  try {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const result = await Promise.race([
      getLimiter(bucket, url, token).limit(clientIp(req)),
      new Promise<{ success: boolean }>((resolve) => {
        timer = setTimeout(() => resolve({ success: true }), TIMEOUT_MS);
      }),
    ]);
    clearTimeout(timer);
    return result.success;
  } catch (err) {
    console.error("[ratelimit] check failed—allowing request:", err);
    return true;
  }
}
