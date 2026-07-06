"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll-triggered reveals (design system §11): elements marked [data-reveal]
 * fade up when they enter the viewport. The hidden initial state only applies
 * under `html.js` with motion allowed (see globals.css), so content is never
 * invisible without JavaScript or for reduced-motion users. Re-runs on every
 * route change to pick up the new page's elements.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"),
    );
    if (els.length === 0) return;
    if (!("IntersectionObserver" in window)) {
      for (const el of els) el.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      // Trigger slightly before the element clears the fold so the motion
      // reads as arrival, not as lag.
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
