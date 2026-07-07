// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import NewsletterConfirmPage, { metadata } from "./page";

// The page must be side-effect-free; the button component owns the POST.
vi.mock("@/components/ConfirmSubscription", () => ({
  default: ({ token }: { token: string }) => (
    <button data-token={token}>Confirm Subscription</button>
  ),
}));

afterEach(cleanup);

describe("newsletter confirm page", () => {
  it("renders the confirm button with the token from the link", async () => {
    render(
      await NewsletterConfirmPage({
        searchParams: Promise.resolve({ token: "tok-1" }),
      }),
    );
    const button = screen.getByRole("button", { name: "Confirm Subscription" });
    expect(button.getAttribute("data-token")).toBe("tok-1");
  });

  it("explains a missing token instead of rendering the button", async () => {
    render(
      await NewsletterConfirmPage({ searchParams: Promise.resolve({}) }),
    );
    expect(screen.queryByRole("button")).toBeNull();
    expect(document.body.textContent).toContain("missing its token");
  });

  it("is excluded from search indexes", () => {
    expect(metadata.robots).toMatchObject({ index: false });
  });
});
