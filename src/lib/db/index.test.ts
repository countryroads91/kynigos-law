import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getDb } from "./index";

beforeEach(() => {
  vi.stubEnv("DATABASE_URL", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getDb", () => {
  it("returns null when DATABASE_URL is not set (feature off, never an error)", () => {
    expect(getDb()).toBeNull();
  });

  it("returns a drizzle client when DATABASE_URL is set", () => {
    vi.stubEnv(
      "DATABASE_URL",
      "postgresql://user:pass@ep-test.neon.tech/kynigos",
    );
    const db = getDb();
    expect(db).not.toBeNull();
    expect(typeof db!.insert).toBe("function");
  });
});
