import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { confirmMock, limitMock } = vi.hoisted(() => ({
  confirmMock: vi.fn(),
  limitMock: vi.fn(),
}));

vi.mock("@/lib/newsletter", () => ({
  confirmSubscriber: confirmMock,
}));
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
  confirmMock.mockReset();
  limitMock.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/subscribe/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

describe("POST /api/subscribe/confirm", () => {
  it("confirms a valid token", async () => {
    confirmMock.mockResolvedValue({ email: "a@example.com", name: null });
    const res = await post({ token: "good" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(confirmMock).toHaveBeenCalledWith("good");
  });

  it("returns 410 with recovery copy for an unknown or expired token", async () => {
    confirmMock.mockResolvedValue(null);
    const res = await post({ token: "stale" });
    expect(res.status).toBe(410);
    expect((await res.json()).error).toMatch(/invalid, expired/i);
  });

  it("rejects a missing token with 422 without hitting the database", async () => {
    const res = await post({});
    expect(res.status).toBe(422);
    expect(confirmMock).not.toHaveBeenCalled();
  });

  it("treats malformed JSON as a missing token", async () => {
    const res = await post("{not json");
    expect(res.status).toBe(422);
  });

  it("answers rate-limited clicks with a distinct busy signal—never 'invalid'", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
    limitMock.mockResolvedValue({ success: false });
    const res = await post({ token: "good" });
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.busy).toBe(true);
    expect(confirmMock).not.toHaveBeenCalled();
  });

  it("returns 502 (never a raw 500) when the database throws", async () => {
    confirmMock.mockRejectedValue(new Error("neon down"));
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await post({ token: "good" });
    expect(res.status).toBe(502);
    error.mockRestore();
  });
});
