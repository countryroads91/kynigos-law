// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: React.ComponentProps<"a"> & { href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import BlogPostPage, { generateMetadata } from "./page";

afterEach(cleanup);

async function renderSlug(slug: string) {
  const element = await BlogPostPage({
    params: Promise.resolve({ slug }),
  });
  return render(element);
}

describe("Blog article template—essay", () => {
  it("carries the personal byline and essay label", async () => {
    await renderSlug("i-have-been-the-client");

    expect(document.body.textContent).toContain("Personal Essay");
    expect(document.body.textContent).toContain(
      "By Bayan Misaghi, Esq., Managing Partner",
    );
    expect(screen.getByRole("link", { name: "← All Insights" }).getAttribute("href")).toBe(
      "/insights",
    );
  });

  it("closes the founding essay with the Why Kynigos Exists band", async () => {
    const { container } = await renderSlug("i-have-been-the-client");

    const label = [...container.querySelectorAll(".related-band-label")].find(
      (el) => el.textContent === "Why Kynigos Exists",
    );
    expect(label).toBeTruthy();
    const band = label!.closest(".related-band");
    expect(band).toBeTruthy();
    expect(band!.querySelector('a[href="/about"]')).toBeTruthy();
    expect(band!.querySelector('a[href="/philosophy"]')).toBeTruthy();
    // The band follows the article body, not the header.
    const prose = container.querySelector(".blog-prose")!;
    expect(
      prose.compareDocumentPosition(band!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("emits Person JSON-LD and personal metadata authorship", async () => {
    const { container } = await renderSlug("i-have-been-the-client");

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);
    expect(data["@type"]).toBe("BlogPosting");
    expect(data.author).toEqual({ "@type": "Person", name: "Bayan Misaghi" });
    expect(data.publisher.name).toBe("Kynigos Law Firm, PLLC");

    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "i-have-been-the-client" }),
    });
    expect(meta.authors).toEqual([{ name: "Bayan Misaghi, Esq." }]);
  });
});

describe("Blog article template—publication", () => {
  it("carries the firm byline with no personal name anywhere", async () => {
    await renderSlug("your-lawyer-has-an-incentive-problem");

    expect(document.body.textContent).toContain("Kynigos Publication");
    expect(document.body.textContent).toContain("By Kynigos Law Firm");
    // Authorship is the point: publications never show the personal name.
    expect(document.body.textContent).not.toContain("Bayan");
    expect(document.body.textContent).not.toContain("Misaghi");
  });

  it("shows the Related Research band before the body when relatedPaper is set", async () => {
    const { container } = await renderSlug(
      "your-lawyer-has-an-incentive-problem",
    );

    const band = screen.getByText("Related Research").closest(".related-band")!;
    expect(band.textContent).toContain("Misaligned Incentives");
    const paperLink = screen.getByRole("link", {
      name: "Explore the full paper →",
    });
    expect(paperLink.getAttribute("href")).toBe("/white-papers");
    const prose = container.querySelector(".blog-prose")!;
    expect(
      band.compareDocumentPosition(prose) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    // Closing CTA band still present.
    expect(screen.getByText("Read the full analysis")).toBeTruthy();
  });

  it("emits Organization JSON-LD and firm metadata authorship", async () => {
    const { container } = await renderSlug(
      "your-lawyer-has-an-incentive-problem",
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);
    expect(data.author).toEqual({
      "@type": "Organization",
      name: "Kynigos Law Firm, PLLC",
    });

    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "your-lawyer-has-an-incentive-problem" }),
    });
    expect(meta.authors).toEqual([{ name: "Kynigos Law Firm" }]);
  });

  it("keeps the DC-only disclaimer", async () => {
    await renderSlug("your-lawyer-has-an-incentive-problem");

    expect(document.body.textContent).toContain(
      "Licensed in the District of Columbia",
    );
    expect(document.body.textContent).not.toContain("Maryland");
  });
});
