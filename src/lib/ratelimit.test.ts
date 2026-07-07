import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { limitMock } = vi.hoisted(() => ({ limitMock: vi.fn() }));

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: class {
    static slidingWindow = vi.fn(() => "sliding-window");
    limit = limitMock;
  },
}));
vi.mock("@upstash/redis", () => ({ Redis: class {} }));

import { checkRateLimit, clientIp } from "./ratelimit";

function reqWithIp(ip?: string) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: ip ? { "x-forwarded-for": ip } : {},
  });
}

beforeEach(() => {
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
  limitMock.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("clientIp", () => {
  it("takes the first x-forwarded-for hop", () => {
    expect(clientIp(reqWithIp("1.2.3.4, 5.6.7.8"))).toBe("1.2.3.4");
  });

  it("falls back to unknown", () => {
    expect(clientIp(reqWithIp())).toBe("unknown");
  });
});

describe("checkRateLimit", () => {
  it("allows everything when Upstash env is not configured (feature off)", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    expect(await checkRateLimit(reqWithIp("1.2.3.4"), "contact")).toBe(true);
    expect(limitMock).not.toHaveBeenCalled();
  });

  it("allows requests under the limit", async () => {
    limitMock.mockResolvedValue({ success: true });
    expect(await checkRateLimit(reqWithIp("1.2.3.4"), "contact")).toBe(true);
    expect(limitMock).toHaveBeenCalledWith("1.2.3.4");
  });

  it("blocks requests over the limit", async () => {
    limitMock.mockResolvedValue({ success: false });
    expect(await checkRateLimit(reqWithIp("1.2.3.4"), "contact")).toBe(false);
  });

  it("fails open when the limiter itself errors", async () => {
    limitMock.mockRejectedValue(new Error("redis down"));
    expect(await checkRateLimit(reqWithIp("1.2.3.4"), "contact")).toBe(true);
  });
});
