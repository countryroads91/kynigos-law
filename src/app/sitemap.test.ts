import { describe, expect, it } from "vitest";
import sitemap, { BASE_URL, BUILD_DATE, STATIC_ROUTES } from "./sitemap";
import { posts } from "@/content/posts";

describe("sitemap", () => {
  const entries = sitemap();
  const urls = entries.map((e) => e.url);

  it("includes every static route exactly once", () => {
    for (const route of STATIC_ROUTES) {
      expect(urls).toContain(`${BASE_URL}${route}`);
    }
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("includes all blog posts with lastModified from post dates", () => {
    expect(posts.length).toBe(4);
    for (const post of posts) {
      const entry = entries.find(
        (e) => e.url === `${BASE_URL}/blog/${post.slug}`
      );
      expect(entry).toBeDefined();
      expect(entry?.lastModified).toEqual(new Date(post.date));
    }
  });

  it("uses one shared build-time date for static pages", () => {
    const staticEntries = entries.filter((e) =>
      STATIC_ROUTES.some((r) => e.url === `${BASE_URL}${r}`)
    );
    for (const entry of staticEntries) {
      expect(entry.lastModified).toBe(BUILD_DATE);
    }
  });

  it("does not include the removed /blog index", () => {
    expect(urls).not.toContain(`${BASE_URL}/blog`);
  });

  it("uses the canonical https non-www base URL", () => {
    for (const url of urls) {
      expect(url).toMatch(/^https:\/\/kynigos\.law(\/|$)/);
      expect(url).not.toContain("www.");
    }
  });
});
