import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const { sendMock, limitMock, startMock } = vi.hoisted(() => ({
  sendMock: vi.fn(),
  limitMock: vi.fn(),
  startMock: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));
vi.mock("@/lib/newsletter", () => ({
  startSubscription: startMock,
}));

// Inert unless a test stubs the Upstash env vars—checkRateLimit returns early
// without them.
vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: class {
    static slidingWindow = vi.fn(() => "sliding-window");
    limit = limitMock;
  },
}));
vi.mock("@upstash/redis", () => ({ Redis: class {} }));

beforeEach(() => {
  vi.stubEnv("RESEND_API_KEY", "test-key");
  vi.stubEnv("LEAD_NOTIFY_EMAIL", "notify@example.com");
  // Persistence, Turnstile, and rate limiting are env-gated—leave them off
  // for the base cases and enable per test.
  vi.stubEnv("DATABASE_URL", "");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "");
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
  vi.stubEnv("PAPER_TOKEN_SECRET", "");
  sendMock.mockReset();
  sendMock.mockResolvedValue({ data: { id: "test" } });
  startMock.mockReset();
  startMock.mockResolvedValue("pending");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

const valid = {
  name: "Test Person",
  email: "test@example.com",
  paper: "Misaligned Incentives",
  slug: "misaligned-incentives",
};

describe("POST /api/lead", () => {
  it("accepts a valid lead, sends the notification email, and returns a download URL", async () => {
    const res = await post(valid);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.url).toBe("/api/paper/misaligned-incentives");
    expect(sendMock).toHaveBeenCalledOnce();
    expect(sendMock.mock.calls[0][0].replyTo).toBe(valid.email);
  });

  it("returns a signed, expiring URL when PAPER_TOKEN_SECRET is set", async () => {
    vi.stubEnv("PAPER_TOKEN_SECRET", "test-secret");
    const res = await post(valid);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.url).toMatch(
      /^\/api\/paper\/misaligned-incentives\?e=\d+&s=[0-9a-f]{64}$/,
    );
  });

  it("still returns 200 when the email send fails (download is the deliverable)", async () => {
    sendMock.mockRejectedValue(new Error("resend down"));
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
  });

  it("still returns 200 when email env vars are not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("LEAD_NOTIFY_EMAIL", "");
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects an unknown paper slug and mints no URL", async () => {
    const res = await post({ ...valid, slug: "not-a-real-paper" });
    expect(res.status).toBe(422);
    expect((await res.json()).url).toBeUndefined();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid email", async () => {
    const res = await post({ ...valid, email: "nope" });
    expect(res.status).toBe(422);
    expect((await res.json()).ok).toBe(false);
  });

  it("rejects a well-formed email over 254 characters", async () => {
    const res = await post({
      ...valid,
      email: `${"a".repeat(250)}@example.com`,
    });
    expect(res.status).toBe(422);
  });

  it("returns 429 when the rate limit is exceeded", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
    limitMock.mockResolvedValue({ success: false });
    const res = await post(valid);
    expect(res.status).toBe(429);
    expect((await res.json()).error).toMatch(/too many requests/i);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects a too-short name", async () => {
    const res = await post({ ...valid, name: "A" });
    expect(res.status).toBe(422);
  });

  it("defaults a missing paper title rather than failing", async () => {
    const res = await post({ ...valid, paper: undefined });
    expect(res.status).toBe(200);
  });

  it("pretends success on a filled honeypot and hands out nothing", async () => {
    const res = await post({ ...valid, company: "spam co" });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.url).toBeUndefined();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects oversized payloads with 413", async () => {
    const res = await POST(
      new Request("http://localhost/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "content-length": "100000",
        },
        body: JSON.stringify(valid),
      }),
    );
    expect(res.status).toBe(413);
  });

  it("fails closed with 403 when Turnstile is enabled and the token is missing", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret");
    const res = await post(valid);
    expect(res.status).toBe(403);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("neutralizes control characters in name before the subject line", async () => {
    const res = await post({ ...valid, name: "Test\r\nInjected" });
    expect(res.status).toBe(200);
    expect(sendMock.mock.calls[0][0].subject).not.toMatch(/[\r\n]/);
  });

  it("rejects malformed JSON with a 400", async () => {
    const res = await POST(
      new Request("http://localhost/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{not json",
      }),
    );
    expect(res.status).toBe(400);
  });

  it("starts a newsletter subscription when the gate checkbox opted in", async () => {
    const res = await post({ ...valid, email: "Test@Example.com", subscribe: true });
    expect(res.status).toBe(200);
    expect(startMock).toHaveBeenCalledWith("test@example.com", "Test Person");
  });

  it("does not touch the newsletter without the opt-in", async () => {
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(startMock).not.toHaveBeenCalled();
  });

  it("still delivers the download when the subscription attempt fails", async () => {
    startMock.mockRejectedValue(new Error("newsletter down"));
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await post({ ...valid, subscribe: true });
    expect(res.status).toBe(200);
    expect((await res.json()).url).toBeTruthy();
    error.mockRestore();
  });
});
