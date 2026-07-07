// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import WhitePaperGate from "./WhitePaperGate";

beforeEach(() => {
  // The blob download clicks a synthetic <a href>; stop jsdom from attempting
  // (unimplemented) navigation, and polyfill the object-URL API it lacks.
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  Object.assign(URL, {
    createObjectURL: vi.fn(() => "blob:mock"),
    revokeObjectURL: vi.fn(),
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function fillGate() {
  fireEvent.change(screen.getByLabelText("Name"), {
    target: { value: "Jordan Reyes" },
  });
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "jordan@example.com" },
  });
}

function pdfResponse() {
  return {
    ok: true,
    headers: new Headers({ "content-type": "application/pdf" }),
    blob: () => Promise.resolve(new Blob(["%PDF-fake"])),
  };
}

function expiredJsonResponse() {
  return {
    ok: false,
    headers: new Headers({ "content-type": "application/json" }),
    json: () => Promise.resolve({ ok: false, error: "expired" }),
  };
}

// Regression: ISSUE-002—two gates on one page shared hardcoded input ids, so
// the second paper's labels focused the first paper's inputs.
// Found by /qa on 2026-07-01.
describe("WhitePaperGate", () => {
  it("renders two instances with unique, correctly-associated ids", () => {
    render(
      <>
        <WhitePaperGate paper="A" slug="paper-a" fileName="a.pdf" />
        <WhitePaperGate paper="B" slug="paper-b" fileName="b.pdf" />
      </>,
    );

    const nameInputs = screen.getAllByLabelText("Name");
    const emailInputs = screen.getAllByLabelText("Email");
    expect(nameInputs).toHaveLength(2);
    expect(emailInputs).toHaveLength(2);

    const ids = [...nameInputs, ...emailInputs].map((el) => el.id);
    expect(new Set(ids).size).toBe(ids.length);

    const allIds = Array.from(document.querySelectorAll("[id]")).map(
      (el) => el.id,
    );
    expect(allIds.filter((v, i) => allIds.indexOf(v) !== i)).toEqual([]);
  });

  it("posts slug and honeypot to /api/lead, then fetch-downloads the server-minted URL", async () => {
    const signedUrl = "/api/paper/paper-a?e=999&s=abc123";
    const fetchMock = vi
      .fn()
      // Call 1: the lead POST mints the signed URL.
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ok: true, url: signedUrl }),
      })
      // Call 2+: the download fetch returns the PDF.
      .mockResolvedValue(pdfResponse());
    vi.stubGlobal("fetch", fetchMock);

    const { container } = render(
      <WhitePaperGate paper="Paper A" slug="paper-a" fileName="a.pdf" />,
    );
    fillGate();
    fireEvent.submit(container.querySelector("form")!);

    const status = await screen.findByRole("status");
    expect(status.textContent).toContain("Thanks, Jordan");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/lead");
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body).toMatchObject({
      name: "Jordan Reyes",
      email: "jordan@example.com",
      paper: "Paper A",
      slug: "paper-a",
      company: "", // honeypot untouched by a real user
    });

    // The download is fetched (so failures are detectable), not <a href>'d.
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(fetchMock.mock.calls[1][0]).toBe(signedUrl);
    expect(screen.queryByRole("alert")).toBeNull();

    // "Download again" re-fetches the same signed URL.
    fireEvent.click(screen.getByRole("button", { name: "Download again" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));
    expect(fetchMock.mock.calls[2][0]).toBe(signedUrl);
  });

  it("falls back to the unsigned paper URL when the response has no url", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ok: true }),
      })
      .mockResolvedValue(pdfResponse());
    vi.stubGlobal("fetch", fetchMock);

    const { container } = render(
      <WhitePaperGate paper="Paper A" slug="paper-a" fileName="a.pdf" />,
    );
    fillGate();
    fireEvent.submit(container.querySelector("form")!);

    await screen.findByRole("status");
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(fetchMock.mock.calls[1][0]).toBe("/api/paper/paper-a");
  });

  it("surfaces an inline error when the download link has expired instead of saving JSON as a PDF", async () => {
    const signedUrl = "/api/paper/paper-a?e=1&s=stale";
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ok: true, url: signedUrl }),
      })
      .mockResolvedValue(expiredJsonResponse());
    vi.stubGlobal("fetch", fetchMock);

    const { container } = render(
      <WhitePaperGate paper="Paper A" slug="paper-a" fileName="a.pdf" />,
    );
    fillGate();
    fireEvent.submit(container.querySelector("form")!);

    await screen.findByRole("status");
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toMatch(/expired/i);
    // Nothing was saved: the anchor-click download path never ran.
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });

  it("surfaces the server's error instead of downloading", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: () =>
          Promise.resolve({
            ok: false,
            error: "Unknown paper. Please refresh the page and try again.",
          }),
      }),
    );

    const { container } = render(
      <WhitePaperGate paper="Paper A" slug="paper-a" fileName="a.pdf" />,
    );
    fillGate();
    fireEvent.submit(container.querySelector("form")!);

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("Unknown paper");
    expect(screen.queryByRole("status")).toBeNull();
  });
});
