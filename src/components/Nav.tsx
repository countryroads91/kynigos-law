"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type MenuItem = { label: string; href: string };
type Menu = {
  label: string;
  /** Every primary label is a real one-tap destination. */
  href: string;
  items: MenuItem[];
};

// Primary labels link to landing pages; the chevron (desktop) or the grouped
// list (mobile overlay) exposes children. No label is only a submenu toggle.
const MENUS: Menu[] = [
  {
    label: "Practice Areas",
    href: "/practice-areas",
    items: [
      { label: "Family Law", href: "/practice-areas/family-law" },
      { label: "Landlord-Tenant", href: "/practice-areas/landlord-tenant" },
      { label: "Capital Markets", href: "/practice-areas/capital-markets" },
      { label: "Contract Review", href: "/practice-areas/contract-review" },
    ],
  },
  {
    label: "About",
    href: "/about",
    items: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Philosophy", href: "/philosophy" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    label: "Insights",
    href: "/insights",
    items: [
      { label: "Personal Essays", href: "/insights#essays" },
      { label: "Kynigos Publications", href: "/insights#publications" },
      { label: "White Papers", href: "/white-papers" },
    ],
  },
];

const LEGAL_LINKS: MenuItem[] = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Disclaimer", href: "/legal/disclaimer" },
  { label: "Attorney Advertising", href: "/legal/attorney-advertising" },
  { label: "Accessibility", href: "/accessibility" },
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

  // While the full-screen menu is open: lock body scroll AND make the page
  // behind it inert so keyboard and screen-reader users cannot reach it.
  useEffect(() => {
    const page = document.querySelector("main");
    const footer = document.querySelector("footer");
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      page?.setAttribute("inert", "");
      footer?.setAttribute("inert", "");
    } else {
      document.body.style.overflow = "";
      page?.removeAttribute("inert");
      footer?.removeAttribute("inert");
    }
    return () => {
      document.body.style.overflow = "";
      page?.removeAttribute("inert");
      footer?.removeAttribute("inert");
    };
  }, [mobileOpen]);

  // Trap Tab focus inside the nav while the full-screen menu is open
  // (design system §16); return focus to the burger when it closes.
  useEffect(() => {
    if (!mobileOpen) return;
    const burger = burgerRef.current;
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
      burger?.focus();
    };
  }, [mobileOpen]);

  // Close the mobile menu when the viewport grows past the mobile breakpoint.
  // CSS hides .nav-burger and .menu-overlay at >=901px, but without this the
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

  function isActive(href: string) {
    const base = href.split("#")[0];
    if (base === "/") return pathname === "/";
    return pathname === base || pathname.startsWith(`${base}/`);
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
            <span className="nav-split">
              <Link
                href={menu.href}
                className={
                  isActive(menu.href) ? "nav-link is-active" : "nav-link"
                }
                aria-current={isActive(menu.href) ? "page" : undefined}
                onClick={closeAll}
              >
                {menu.label}
              </Link>
              <button
                type="button"
                className="nav-trigger"
                aria-haspopup="true"
                aria-expanded={open === i}
                aria-label={`${menu.label} submenu`}
                onClick={() => setOpen((cur) => (cur === i ? null : i))}
              >
                <span className="nav-caret" aria-hidden="true" />
              </button>
            </span>
            <div
              className={open === i ? "nav-dropdown is-open" : "nav-dropdown"}
              role="menu"
            >
              <Link
                href={menu.href}
                className="nav-dropdown-link nav-dropdown-link--all"
                role="menuitem"
                onClick={closeAll}
              >
                All {menu.label === "About" ? "About the Firm" : menu.label}
              </Link>
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
        <div
          className="menu-overlay"
          id="nav-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="menu-scroll">
            <Link
              href="/"
              className={
                pathname === "/"
                  ? "menu-primary-link is-active"
                  : "menu-primary-link"
              }
              aria-current={pathname === "/" ? "page" : undefined}
              onClick={closeAll}
            >
              Home
            </Link>
            {MENUS.map((menu) => (
              <div key={menu.label} className="menu-group">
                <Link
                  href={menu.href}
                  className={
                    isActive(menu.href)
                      ? "menu-primary-link is-active"
                      : "menu-primary-link"
                  }
                  aria-current={isActive(menu.href) ? "page" : undefined}
                  onClick={closeAll}
                >
                  {menu.label}
                </Link>
                <div className="menu-children">
                  {menu.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={
                        isActive(item.href)
                          ? "menu-child-link is-active"
                          : "menu-child-link"
                      }
                      aria-current={isActive(item.href) ? "page" : undefined}
                      onClick={closeAll}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link
              href="/contact"
              className="nav-cta menu-cta"
              onClick={closeAll}
            >
              Book A Free Consultation
            </Link>
            <div className="menu-legal">
              {LEGAL_LINKS.map((l) => (
                <Link key={l.href} href={l.href} onClick={closeAll}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
