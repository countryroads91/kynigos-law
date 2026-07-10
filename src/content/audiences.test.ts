import { describe, expect, it } from "vitest";
import { AUDIENCES, getAudience } from "./audiences";

describe("audience architecture", () => {
  it("exposes exactly three distinct client paths", () => {
    expect(AUDIENCES.map((audience) => audience.slug)).toEqual([
      "people",
      "businesses",
      "capital",
    ]);
    expect(new Set(AUDIENCES.flatMap((audience) => audience.services.map((service) => service.title))).size).toBe(9);
  });

  it("retrieves every supported audience", () => {
    for (const audience of AUDIENCES) {
      expect(getAudience(audience.slug)).toBe(audience);
      expect(audience.services).toHaveLength(3);
      expect(audience.matters).toHaveLength(6);
    }
  });
});
