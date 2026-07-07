import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { verifyTurnstile } from "./turnstile";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret");
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("verifyTurnstile", () => {
  it("passes without calling Cloudflare when no secret is configured (feature off)", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    expect(await verifyTurnstile(undefined)).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails closed on a missing token when the secret is set", async () => {
    expect(await verifyTurnstile(undefined)).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("passes a token Cloudflare confirms", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ success: true })),
    );
    expect(await verifyTurnstile("tok")).toBe(true);
  });

  it("rejects a token Cloudflare denies", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ success: false })),
    );
    expect(await verifyTurnstile("tok")).toBe(false);
  });

  it("fails closed when the verification request itself fails", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));
    expect(await verifyTurnstile("tok")).toBe(false);
  });

  it("fails closed on a non-2xx verification response", async () => {
    fetchMock.mockResolvedValue(new Response("oops", { status: 500 }));
    expect(await verifyTurnstile("tok")).toBe(false);
  });
});
