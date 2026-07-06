// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let mockPathname = "/";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

import ScrollReveal from "./ScrollReveal";

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

function makeTarget(): HTMLElement {
  const el = document.createElement("div");
  el.setAttribute("data-reveal", "");
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  cleanup();
  document
    .querySelectorAll("[data-reveal]")
    .forEach((el) => el.remove());
  // jsdom has no IntersectionObserver by default; remove any stub we added.
  delete (window as { IntersectionObserver?: unknown }).IntersectionObserver;
});

beforeEach(() => {
  mockPathname = "/";
});

describe("ScrollReveal", () => {
  it("reveals everything immediately when IntersectionObserver is missing", () => {
    const el = makeTarget();
    render(<ScrollReveal />);
    expect(el.classList.contains("is-visible")).toBe(true);
  });

  it("marks elements visible when they intersect, then unobserves them", () => {
    const observed: Element[] = [];
    const unobserved: Element[] = [];
    let callback: ObserverCallback = () => {};
    const disconnect = vi.fn();
    (window as { IntersectionObserver?: unknown }).IntersectionObserver =
      class {
        constructor(cb: ObserverCallback) {
          callback = cb;
        }
        observe(el: Element) {
          observed.push(el);
        }
        unobserve(el: Element) {
          unobserved.push(el);
        }
        disconnect = disconnect;
      };

    const el = makeTarget();
    const { unmount } = render(<ScrollReveal />);
    expect(observed).toContain(el);
    expect(el.classList.contains("is-visible")).toBe(false);

    callback([{ isIntersecting: true, target: el }]);
    expect(el.classList.contains("is-visible")).toBe(true);
    expect(unobserved).toContain(el);

    // Non-intersecting entries do nothing.
    const other = makeTarget();
    callback([{ isIntersecting: false, target: other }]);
    expect(other.classList.contains("is-visible")).toBe(false);

    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it("picks up new [data-reveal] elements after a route change", () => {
    const observed: Element[] = [];
    (window as { IntersectionObserver?: unknown }).IntersectionObserver =
      class {
        constructor() {}
        observe(el: Element) {
          observed.push(el);
        }
        unobserve() {}
        disconnect() {}
      };

    const first = makeTarget();
    const { rerender } = render(<ScrollReveal />);
    expect(observed).toContain(first);

    const second = makeTarget();
    mockPathname = "/practice-areas";
    rerender(<ScrollReveal />);
    expect(observed).toContain(second);
  });
});
