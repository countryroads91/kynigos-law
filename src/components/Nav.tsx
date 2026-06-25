"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type MenuItem = { label: string; href: string };
type Menu = {
  label: string;
  overview?: { label: string; href: string };
  items: MenuItem[];
};

const MENUS: Menu[] = [
  {
    label: "About",
    items: [
      { label: "How it Works", href: "/how-it-works" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    label: "Practice Areas",
    overview: { label: "All Practice Areas", href: "/practice-areas" },
    items: [
      { label: "Family Law", href: "/practice-areas/family-law" },
      { label: "Landlord-Tenant", href: "/practice-areas/landlord-tenant" },
      { label: "Capital Markets", href: "/practice-areas/capital-markets" },
      { label: "Contract Review", href: "/practice-areas/contract-review" },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "White Papers", href: "/white-papers" },
      { label: "Blog", href: "/blog" },
    ],
  },
];

export default function Nav() {
  const [open, setOpen] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<number | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const hoverCapable = useRef(false);

  useEffect(() => {
    hoverCapable.current = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
  }, []);

  // Close desktop dropdowns on outside click; close everything on Escape.
  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function closeAll() {
    setOpen(null);
    setMobileOpen(false);
    setMobileSection(null);
  }

  return (
    <nav className="nav" aria-label="Primary" ref={navRef}>
      <Link href="/" className="nav-brand" onClick={closeAll}>
        Kynigos
      </Link>

      <div className="nav-links">
        {MENUS.map((menu, i) => (
          <div
            key={menu.label}
            className="nav-item"
            onMouseEnter={() => {
              if (hoverCapable.current) setOpen(i);
            }}
            onMouseLeave={() => {
              if (hoverCapable.current)
                setOpen((cur) => (cur === i ? null : cur));
            }}
          >
            <button
              type="button"
              className="nav-trigger"
              aria-haspopup="true"
              aria-expanded={open === i}
              onClick={() => setOpen((cur) => (cur === i ? null : i))}
            >
              {menu.label}
              <span className="nav-caret" aria-hidden="true" />
            </button>
            <div
              className={open === i ? "nav-dropdown is-open" : "nav-dropdown"}
              role="menu"
            >
              {menu.overview && (
                <Link
                  href={menu.overview.href}
                  className="nav-dropdown-link"
                  role="menuitem"
                  onClick={closeAll}
                >
                  {menu.overview.label}
                </Link>
              )}
              {menu.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-dropdown-link"
                  role="menuitem"
                  onClick={closeAll}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
        <Link href="/contact" className="nav-cta" onClick={closeAll}>
          Book A Free Consultation
        </Link>
      </div>

      <button
        type="button"
        className="nav-burger"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      {mobileOpen && (
        <div className="nav-mobile">
          {MENUS.map((menu, i) => (
            <div key={menu.label} className="nav-mobile-group">
              <button
                type="button"
                className="nav-mobile-trigger"
                aria-expanded={mobileSection === i}
                onClick={() =>
                  setMobileSection((cur) => (cur === i ? null : i))
                }
              >
                {menu.label}
                <span className="nav-caret" aria-hidden="true" />
              </button>
              <div
                className={
                  mobileSection === i
                    ? "nav-mobile-sub is-open"
                    : "nav-mobile-sub"
                }
              >
                {menu.overview && (
                  <Link href={menu.overview.href} onClick={closeAll}>
                    {menu.overview.label}
                  </Link>
                )}
                {menu.items.map((item) => (
                  <Link key={item.href} href={item.href} onClick={closeAll}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <Link
            href="/contact"
            className="nav-cta nav-mobile-cta"
            onClick={closeAll}
          >
            Book A Free Consultation
          </Link>
        </div>
      )}
    </nav>
  );
}
