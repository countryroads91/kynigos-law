import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { startMock, limitMock } = vi.hoisted(() => ({
  startMock: vi.fn(),
  limitMock: vi.fn(),
}));

vi.mock("@/lib/newsletter", () => ({
  startSubscription: startMock,
}));
// Inert unless a test stubs the Upstash env vars.
vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: class {
    static slidingWindow = vi.fn(() => "sliding-window");
    limit = limitMock;
  },
}));
vi.mock("@upstash/redis", () => ({ Redis: class {} }));

import { POST } from "./route";

beforeEach(() => {
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "");
  startMock.mockReset();
  startMock.mockResolvedValue("pending");
  limitMock.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

describe("POST /api/subscribe", () => {
  it("starts a subscription with the lowercased email", async () => {
    const res = await post({ email: "Reader@Example.com", name: "Reader" });
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
    expect(startMock).toHaveBeenCalledWith("reader@example.com", "Reader");
  });

  it("answers already-confirmed identically to pending (no enumeration)", async () => {
    startMock.mockResolvedValue("already_confirmed");
    const res = await post({ email: "reader@example.com" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("pretends success on a filled honeypot and stores nothing", async () => {
    const res = await post({ email: "reader@example.com", company: "spam" });
    expect(res.status).toBe(200);
    expect(startMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid email", async () => {
    const res = await post({ email: "nope" });
    expect(res.status).toBe(422);
    expect(startMock).not.toHaveBeenCalled();
  });

  it("fails closed with 403 when Turnstile is enabled and the token is missing", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret");
    const res = await post({ email: "reader@example.com" });
    expect(res.status).toBe(403);
    expect(startMock).not.toHaveBeenCalled();
  });

  it("returns 503 with a human message when the database is not configured", async () => {
    startMock.mockResolvedValue("unavailable");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const res = await post({ email: "reader@example.com" });
    expect(res.status).toBe(503);
    expect((await res.json()).error).toMatch(/info@kynigos.law/);
    warn.mockRestore();
  });

  it("returns 502 when the confirmation email cannot be sent", async () => {
    startMock.mockRejectedValue(new Error("email not configured"));
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await post({ email: "reader@example.com" });
    expect(res.status).toBe(502);
    expect((await res.json()).error).toMatch(/confirmation email/);
    error.mockRestore();
  });

  it("returns 502 (never a raw 500) when the database throws", async () => {
    startMock.mockRejectedValue(new Error("neon down"));
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await post({ email: "reader@example.com" });
    expect(res.status).toBe(502);
    error.mockRestore();
  });

  it("returns 429 when the rate limit is exceeded", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
    limitMock.mockResolvedValue({ success: false });
    const res = await post({ email: "reader@example.com" });
    expect(res.status).toBe(429);
    expect(startMock).not.toHaveBeenCalled();
  });

  it("rejects oversized payloads with 413", async () => {
    const res = await POST(
      new Request("http://localhost/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "content-length": "100000",
        },
        body: JSON.stringify({ email: "reader@example.com" }),
      }),
    );
    expect(res.status).toBe(413);
  });

  it("rejects malformed JSON with a 400", async () => {
    const res = await POST(
      new Request("http://localhost/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{not json",
      }),
    );
    expect(res.status).toBe(400);
  });

  it("rejects cross-site POSTs", async () => {
    const res = await POST(
      new Request("http://localhost/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin: "https://evil.example.com",
        },
        body: JSON.stringify({ email: "reader@example.com" }),
      }),
    );
    expect(res.status).toBe(403);
  });
});
