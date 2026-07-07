import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  PAPER_TOKEN_TTL_MS,
  paperDownloadUrl,
  verifyPaperToken,
} from "./paper-token";

beforeEach(() => {
  vi.stubEnv("PAPER_TOKEN_SECRET", "test-secret");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

function parts(url: string) {
  const u = new URL(url, "http://localhost");
  return {
    slug: u.pathname.split("/").pop()!,
    e: u.searchParams.get("e"),
    s: u.searchParams.get("s"),
  };
}

describe("paper-token", () => {
  it("round-trips: a freshly signed URL verifies", () => {
    const { e, s } = parts(paperDownloadUrl("misaligned-incentives"));
    expect(verifyPaperToken("misaligned-incentives", e, s)).toBe(true);
  });

  it("rejects an expired token", () => {
    const now = Date.now();
    const { e, s } = parts(paperDownloadUrl("misaligned-incentives", now));
    expect(
      verifyPaperToken(
        "misaligned-incentives",
        e,
        s,
        now + PAPER_TOKEN_TTL_MS + 1,
      ),
    ).toBe(false);
  });

  it("rejects a tampered signature", () => {
    const { e, s } = parts(paperDownloadUrl("misaligned-incentives"));
    const flipped = s!.slice(0, -1) + (s!.endsWith("0") ? "1" : "0");
    expect(verifyPaperToken("misaligned-incentives", e, flipped)).toBe(false);
  });

  it("rejects a token minted for a different slug", () => {
    const { e, s } = parts(paperDownloadUrl("misaligned-incentives"));
    expect(verifyPaperToken("market-for-lemons", e, s)).toBe(false);
  });

  it("rejects missing token params", () => {
    expect(verifyPaperToken("misaligned-incentives", null, null)).toBe(false);
  });

  it("is unsigned-open when the secret is not configured", () => {
    vi.stubEnv("PAPER_TOKEN_SECRET", "");
    expect(paperDownloadUrl("misaligned-incentives")).toBe(
      "/api/paper/misaligned-incentives",
    );
    expect(verifyPaperToken("misaligned-incentives", null, null)).toBe(true);
  });
});
