"use client";

import { OPEN_SETTINGS_EVENT } from "@/lib/consent";

// Persistent footer entry point back into the cookie preference center.
export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      className="footer-legal-btn"
      onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))}
    >
      Cookie Settings
    </button>
  );
}
