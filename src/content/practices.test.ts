import { describe, expect, it } from "vitest";
import {
  FEE_SHAPES,
  PRACTICE_GROUPS,
  serviceCount,
} from "./practices";

describe("practice taxonomy", () => {
  it("has five groups with unique slugs and sequential numbering", () => {
    expect(PRACTICE_GROUPS.length).toBe(5);
    const slugs = PRACTICE_GROUPS.map((g) => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    PRACTICE_GROUPS.forEach((g, i) => {
      expect(g.num).toBe(String(i + 1).padStart(2, "0"));
    });
  });

  it("covers a broad service list with unique names and valid fee shapes", () => {
    expect(serviceCount()).toBeGreaterThanOrEqual(24);
    const names = PRACTICE_GROUPS.flatMap((g) =>
      g.services.map((s) => s.name),
    );
    expect(new Set(names).size).toBe(names.length);
    for (const group of PRACTICE_GROUPS) {
      expect(group.lede.length).toBeGreaterThan(0);
      for (const service of group.services) {
        expect(FEE_SHAPES[service.fee]).toBeTruthy();
        expect(service.description.length).toBeGreaterThan(40);
      }
    }
  });

  it("keeps every flagship and deep link on a real practice route", () => {
    const validRoutes = [
      "/practice-areas/family-law",
      "/practice-areas/landlord-tenant",
      "/practice-areas/capital-markets",
      "/practice-areas/contract-review",
    ];
    for (const group of PRACTICE_GROUPS) {
      if (group.flagship) {
        expect(validRoutes).toContain(group.flagship.href);
      }
      for (const service of group.services) {
        if (service.href) expect(validRoutes).toContain(service.href);
      }
    }
  });

  it("invents no prices and stays inside the DC license", () => {
    const text = JSON.stringify(PRACTICE_GROUPS) + JSON.stringify(FEE_SHAPES);
    expect(text).not.toMatch(/\$\d/);
    expect(text).not.toContain("Maryland");
    // Em dashes are set tight per the copy style rule.
    expect(text).not.toMatch(/\s—|—\s/);
  });
});
