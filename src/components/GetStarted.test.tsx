// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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

import GetStarted from "./GetStarted";

afterEach(cleanup);

function docTab() {
  return screen.getByRole("tab", { name: /I have a document/ });
}
function sitTab() {
  return screen.getByRole("tab", { name: /I have a situation/ });
}

describe("GetStarted fork", () => {
  it("shows the document panel by default and switches on door click", () => {
    render(<GetStarted />);

    expect(docTab().getAttribute("aria-selected")).toBe("true");
    const panels = screen.getAllByRole("tabpanel", { hidden: true });
    expect(panels.length).toBe(2);
    const [docPanel, sitPanel] = panels;
    expect(docPanel.hidden).toBe(false);
    expect(sitPanel.hidden).toBe(true);

    fireEvent.click(sitTab());
    expect(sitTab().getAttribute("aria-selected")).toBe("true");
    expect(docPanel.hidden).toBe(true);
    expect(sitPanel.hidden).toBe(false);
  });

  it("lists a selected file and removes it again", () => {
    render(<GetStarted />);

    const input = screen.getByLabelText("Choose a document to upload");
    const file = new File(["fake"], "offer-letter.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText("offer-letter.pdf")).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", { name: "Remove offer-letter.pdf" }),
    );
    expect(screen.queryByText("offer-letter.pdf")).toBeNull();
  });

  it("rejects files that are not PDF or Word", () => {
    render(<GetStarted />);

    const input = screen.getByLabelText("Choose a document to upload");
    const file = new File(["x"], "photo.png", { type: "image/png" });
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByRole("alert").textContent).toContain(
      "not a PDF or Word document",
    );
    expect(screen.queryByText("photo.png")).toBeNull();
  });

  it("labels the unfinished integrations and keeps working fallbacks", () => {
    render(<GetStarted />);

    // Upload/checkout backend is not connected yet—say so on the page.
    expect(
      screen.getByText(/Upload & checkout—integration pending/),
    ).toBeTruthy();
    const mail = screen.getByRole("link", { name: "Email Your Document" });
    expect(mail.getAttribute("href")).toContain("mailto:bayan@kynigos.law");

    fireEvent.click(sitTab());
    // No NEXT_PUBLIC_CALENDLY_URL in tests → placeholder, not an iframe.
    expect(screen.getByText(/Scheduler—integration pending/)).toBeTruthy();
    expect(document.querySelector("iframe")).toBeNull();
    const consult = screen.getByRole("link", {
      name: "Book A Free Consultation",
    });
    expect(consult.getAttribute("href")).toBe("/contact");
  });
});
