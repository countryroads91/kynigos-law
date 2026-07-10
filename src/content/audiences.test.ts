import { describe, expect, it } from "vitest";
import { AUDIENCES, getAudience } from "./audiences";
import { PRACTICE_GROUPS } from "./practices";
import { getPost } from "./posts";

const GROUP_SLUGS = new Set(PRACTICE_GROUPS.map((g) => g.slug));
const FLAGSHIP_HREFS = new Set(
  PRACTICE_GROUPS.flatMap((g) => g.services)
    .map((s) => s.href)
    .filter(Boolean) as string[],
);

describe("audiences taxonomy", () => {
  it("defines exactly three doors with unique slugs", () => {
    expect(AUDIENCES.length).toBe(3);
    expect(new Set(AUDIENCES.map((a) => a.slug)).size).toBe(3);
    expect(getAudience("people")?.doorLabel).toBe("Individuals & Families");
    expect(getAudience("nonsense")).toBeUndefined();
  });

  it("points every matter at a real destination", () => {
    for (const audience of AUDIENCES) {
      for (const matter of audience.matters) {
        const { href } = matter;
        if (href.startsWith("#")) {
          // Anchor on the audience page itself—must be the strip's own id.
          expect(href).toBe(`#${audience.strip.id}`);
        } else if (href.startsWith("/practice-areas#")) {
          const slug = href.split("#")[1];
          expect(GROUP_SLUGS.has(slug), `${href} names a real group`).toBe(
            true,
          );
        } else {
          // Deep pages must exist in the practice taxonomy's flagship hrefs.
          expect(
            FLAGSHIP_HREFS.has(href),
            `${href} is a known flagship page`,
          ).toBe(true);
        }
      }
    }
  });

  it("relates only to posts that exist—never an invented link", () => {
    for (const audience of AUDIENCES) {
      for (const slug of audience.relatedPosts) {
        expect(getPost(slug), `${slug} exists in posts.ts`).toBeDefined();
      }
    }
  });

  it("keeps the client-facing copy clean—no mojibake, no personal names", () => {
    const text = JSON.stringify(AUDIENCES);
    expect(text).not.toMatch(/Â|â€/);
    expect(text).not.toContain("Bayan");
    expect(text).not.toContain("Maryland");
    // Em dashes carry no surrounding spaces (house copy style).
    expect(text).not.toMatch(/ —|— /);
  });
});
