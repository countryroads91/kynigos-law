import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFile } from "node:fs/promises";
import { paperDownloadUrl, PAPER_TOKEN_TTL_MS } from "@/lib/paper-token";
import { GET } from "./route";

// Pass-through by default; individual tests reject once to hit the 500 path.
vi.mock("node:fs/promises", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs/promises")>();
  return { ...actual, readFile: vi.fn(actual.readFile) };
});

beforeEach(() => {
  vi.stubEnv("PAPER_TOKEN_SECRET", "test-secret");
  vi.stubEnv("DATABASE_URL", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.mocked(readFile).mockClear();
});

function get(path: string, slug: string) {
  return GET(new Request(`http://localhost${path}`), {
    params: Promise.resolve({ slug }),
  });
}

describe("GET /api/paper/[slug]", () => {
  it("404s an unknown slug", async () => {
    const res = await get("/api/paper/not-a-paper", "not-a-paper");
    expect(res.status).toBe(404);
  });

  it("403s a request with no token when the secret is configured", async () => {
    const res = await get(
      "/api/paper/misaligned-incentives",
      "misaligned-incentives",
    );
    expect(res.status).toBe(403);
    expect((await res.json()).error).toMatch(/expired/i);
  });

  it("403s a tampered signature", async () => {
    const url = paperDownloadUrl("misaligned-incentives");
    const res = await get(`${url}extra`, "misaligned-incentives");
    expect(res.status).toBe(403);
  });

  it("serves the PDF for a validly signed URL", async () => {
    const url = paperDownloadUrl("misaligned-incentives");
    const res = await get(url, "misaligned-incentives");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");
    expect(res.headers.get("content-disposition")).toContain(
      "Kynigos-Misaligned-Incentives.pdf",
    );
    expect(res.headers.get("cache-control")).toContain("no-store");
    const body = new Uint8Array(await res.arrayBuffer());
    // PDF magic bytes: %PDF
    expect(String.fromCharCode(...body.slice(0, 4))).toBe("%PDF");
  });

  it("403s an expired token", async () => {
    const past = Date.now() - 2 * PAPER_TOKEN_TTL_MS;
    const url = paperDownloadUrl("misaligned-incentives", past);
    const res = await get(url, "misaligned-incentives");
    expect(res.status).toBe(403);
    expect((await res.json()).error).toMatch(/expired/i);
  });

  it("500s (without leaking paths) when the PDF is missing from the bundle", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(readFile).mockRejectedValueOnce(
      Object.assign(new Error("ENOENT"), { code: "ENOENT" }),
    );
    const url = paperDownloadUrl("misaligned-incentives");
    const res = await get(url, "misaligned-incentives");
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("Download unavailable. Please try again later.");
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  it("serves unsigned requests when no secret is configured (soft-gate fallback)", async () => {
    vi.stubEnv("PAPER_TOKEN_SECRET", "");
    const res = await get(
      "/api/paper/market-for-lemons",
      "market-for-lemons",
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");
  });
});
