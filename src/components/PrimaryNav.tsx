"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { label: "People", href: "/people" },
  { label: "Businesses", href: "/businesses" },
  { label: "Capital", href: "/capital" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
];

const LEGAL_LINKS = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Disclaimer", href: "/legal/disclaimer" },
  { label: "Attorney Advertising", href: "/legal/attorney-advertising" },
  { label: "Accessibility", href: "/accessibility" },
];

export default function PrimaryNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [previousPath, setPreviousPath] = useState("");
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  if (previousPath !== pathname) {
    setPreviousPath(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
      if (event.key !== "Tab" || !mobileOpen || !navRef.current) return;

      const focusable = Array.from(
        navRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ).filter((element) => element.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    const page = document.querySelector("main");
    const footer = document.querySelector("footer");
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    if (mobileOpen) {
      page?.setAttribute("inert", "");
      footer?.setAttribute("inert", "");
    } else {
      page?.removeAttribute("inert");
      footer?.removeAttribute("inert");
    }

    return () => {
      document.body.style.overflow = "";
      page?.removeAttribute("inert");
      footer?.removeAttribute("inert");
    };
  }, [mobileOpen]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 901px)");
    const closeAtDesktop = () => {
      if (media.matches) setMobileOpen(false);
    };
    media.addEventListener("change", closeAtDesktop);
    return () => media.removeEventListener("change", closeAtDesktop);
  }, []);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function close() {
    setMobileOpen(false);
  }

  return (
    <nav className="nav primary-nav" aria-label="Primary" ref={navRef}>
      <Link href="/" className="nav-brand" onClick={close}>Kynigos</Link>
      <div className="primary-nav-links">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={isActive(link.href) ? "primary-nav-link is-active" : "primary-nav-link"}
            aria-current={isActive(link.href) ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
        <Link href="/contact" className="nav-cta">Start</Link>
      </div>

      <button
        type="button"
        className="nav-burger"
        ref={burgerRef}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
        aria-controls="primary-nav-sheet"
        onClick={() => setMobileOpen((open) => !open)}
      >
        <span /><span /><span />
      </button>

      {mobileOpen && (
        <div
          className="menu-overlay primary-menu-overlay"
          id="primary-nav-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="primary-menu-inner">
            <span className="primary-menu-kicker">Choose a path</span>
            <Link href="/" className={pathname === "/" ? "is-active" : ""} onClick={close}>Home</Link>
            {LINKS.map((link, index) => (
              <Link
                href={link.href}
                key={link.href}
                className={isActive(link.href) ? "is-active" : ""}
                aria-current={isActive(link.href) ? "page" : undefined}
                onClick={close}
              >
                <span>0{index + 1}</span>{link.label}
              </Link>
            ))}
            <Link href="/contact" className="nav-cta primary-menu-start" onClick={close}>Start a Matter</Link>
            <div className="menu-legal">
              {LEGAL_LINKS.map((link) => <Link key={link.href} href={link.href} onClick={close}>{link.label}</Link>)}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
