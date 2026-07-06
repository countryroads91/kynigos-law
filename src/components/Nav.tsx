"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
      { label: "Philosophy", href: "/philosophy" },
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
  const navRef = useRef<HTMLElement | null>(null);
  const burgerRef = useRef<HTMLButtonElement | null>(null);
  const hoverCapable = useRef(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Safety net: whatever caused the route to change (link tap, back button,
  // programmatic navigation), never leave the menu or its scroll lock behind.
  // State is adjusted during render (not in an effect) per React's
  // "adjusting state when props change" pattern.
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(null);
    setMobileOpen(false);
  }

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

  // Trap Tab focus inside the nav while the full-screen mobile menu is open
  // (design system §16); return focus to the burger when it closes.
  useEffect(() => {
    if (!mobileOpen) return;
    function onTrapKey(e: KeyboardEvent) {
      if (e.key !== "Tab" || !navRef.current) return;
      const focusables = Array.from(
        navRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]):not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !navRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onTrapKey);
    return () => {
      document.removeEventListener("keydown", onTrapKey);
      burgerRef.current?.focus();
    };
  }, [mobileOpen]);

  // Close the mobile menu when the viewport grows past the mobile breakpoint.
  // CSS hides .nav-burger and .nav-sheet at >=901px, but without this the
  // mobileOpen state would stay true and keep the body scroll locked on
  // desktop after a rotate/resize, with no visible control to release it.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 901px)");
    const onChange = () => {
      if (mql.matches) {
        setMobileOpen(false);
      }
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  function closeAll() {
    setOpen(null);
    setMobileOpen(false);
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
        ref={burgerRef}
        className="nav-burger"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
        aria-controls="nav-sheet"
        onClick={() => setMobileOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      {mobileOpen && (
        <>
          {/* Tap anywhere outside the sheet to dismiss. Hidden from keyboard
              and screen readers—the burger is the accessible close control. */}
          <button
            type="button"
            className="nav-scrim"
            aria-hidden="true"
            tabIndex={-1}
            onClick={closeAll}
          />
          <div
            className="nav-sheet"
            id="nav-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <Link href="/" className="nav-sheet-link" onClick={closeAll}>
              Home
            </Link>
            {MENUS.map((menu) => (
              <div key={menu.label} className="nav-sheet-group">
                <div className="nav-sheet-label">{menu.label}</div>
                {menu.overview && (
                  <Link
                    href={menu.overview.href}
                    className="nav-sheet-link"
                    onClick={closeAll}
                  >
                    {menu.overview.label}
                  </Link>
                )}
                {menu.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="nav-sheet-link"
                    onClick={closeAll}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
            <Link
              href="/contact"
              className="nav-cta nav-sheet-cta"
              onClick={closeAll}
            >
              Book A Free Consultation
            </Link>
          </div>
        </>
      )}
    </nav>
  );
}
