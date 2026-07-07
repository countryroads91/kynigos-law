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

// track() is env- and consent-gated (no-op here), so the GA4 wiring is
// asserted through a mock rather than the dataLayer.
const { trackMock } = vi.hoisted(() => ({ trackMock: vi.fn() }));
vi.mock("@/lib/analytics", () => ({ track: trackMock }));

afterEach(() => {
  cleanup();
  trackMock.mockClear();
});

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

  it("moves between doors with arrow keys (roving tabindex)", () => {
    render(<GetStarted />);

    expect(docTab().tabIndex).toBe(0);
    expect(sitTab().tabIndex).toBe(-1);

    fireEvent.keyDown(docTab().closest("[role=tablist]")!, {
      key: "ArrowRight",
    });
    expect(sitTab().getAttribute("aria-selected")).toBe("true");
    expect(sitTab().tabIndex).toBe(0);
    expect(docTab().tabIndex).toBe(-1);

    fireEvent.keyDown(sitTab().closest("[role=tablist]")!, { key: "Home" });
    expect(docTab().getAttribute("aria-selected")).toBe("true");
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

  it("rejects oversized files but keeps valid files from the same batch", () => {
    render(<GetStarted />);

    const input = screen.getByLabelText("Choose a document to upload");
    const big = new File(["x"], "deal-room.pdf", { type: "application/pdf" });
    Object.defineProperty(big, "size", { value: 16 * 1024 * 1024 });
    const ok = new File(["fine"], "lease.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    fireEvent.change(input, { target: { files: [big, ok] } });

    expect(screen.getByRole("alert").textContent).toContain(
      "deal-room.pdf is over 15 MB",
    );
    // The valid file from the same selection still lands in the list.
    expect(screen.getByText("lease.docx")).toBeTruthy();
    expect(screen.queryByText("deal-room.pdf")).toBeNull();
  });

  it("labels the unfinished integrations and keeps working fallbacks", () => {
    render(<GetStarted />);

    // Upload/checkout backend is not connected yet—say so on the page.
    expect(
      screen.getByText(/Upload & checkout—integration pending/),
    ).toBeTruthy();
    const mail = screen.getByRole("link", { name: "Email Your Document" });
    expect(mail.getAttribute("href")).toContain("mailto:info@kynigos.law");

    fireEvent.click(sitTab());
    // No NEXT_PUBLIC_CALENDLY_URL in tests → placeholder, not an iframe.
    expect(screen.getByText(/Scheduler—integration pending/)).toBeTruthy();
    expect(document.querySelector("iframe")).toBeNull();
    const consult = screen.getByRole("link", {
      name: "Book A Free Consultation",
    });
    expect(consult.getAttribute("href")).toBe("/contact");
  });

  it("tracks the consultation CTA click as a GA4 conversion", () => {
    render(<GetStarted />);
    fireEvent.click(sitTab());

    fireEvent.click(
      screen.getByRole("link", { name: "Book A Free Consultation" }),
    );
    expect(trackMock).toHaveBeenCalledWith("book_consultation", {
      source: "get_started",
    });
  });
});
