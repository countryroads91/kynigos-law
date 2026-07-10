// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getAudience } from "@/content/audiences";

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: React.ComponentProps<"a"> & { href: string }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

import AudienceLanding from "./AudienceLanding";

afterEach(cleanup);

describe("AudienceLanding", () => {
  it("renders matters, engagements, and a truthful defined-scope CTA", () => {
    render(<AudienceLanding audience={getAudience("businesses")!} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("enterprise");
    expect(document.querySelectorAll(".audience-matter-index li")).toHaveLength(6);
    expect(document.querySelectorAll(".audience-service-grid > a")).toHaveLength(3);
    expect(document.body.textContent).toContain("You do not pay more merely because the problem takes us longer.");
    expect(screen.getAllByRole("link", { name: /Tell Us What Is at Stake/i })[0].getAttribute("href")).toBe("/contact");
  });
});
