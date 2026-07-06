"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  OPEN_SETTINGS_EVENT,
  getConsentSnapshot,
  getServerConsentSnapshot,
  subscribeConsent,
  writeConsent,
} from "@/lib/consent";

const CATEGORIES = [
  {
    key: "necessary" as const,
    locked: true,
    title: "Strictly necessary",
    body: "Required for the site to work—including remembering the choice you make here. Always active.",
  },
  {
    key: "functional" as const,
    locked: false,
    title: "Functional",
    body: "Remember helpful preferences and power embedded tools such as the consultation scheduler.",
  },
  {
    key: "analytics" as const,
    locked: false,
    title: "Analytics",
    body: "Help us understand which pages are read and how visitors move through the site, so we can improve it.",
  },
  {
    key: "marketing" as const,
    locked: false,
    title: "Marketing",
    body: "Measure whether our outreach works and allow relevant advertising off this site. Never used to sell your information.",
  },
];

type Toggles = { functional: boolean; analytics: boolean; marketing: boolean };

// Hydration guard without setState-in-effect: server snapshot is false,
// client snapshot is true, so consent-dependent UI renders client-side only.
const subscribeNoop = () => () => {};
const clientTrue = () => true;
const serverFalse = () => false;

export default function CookieConsent() {
  const uid = useId();
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );
  const hydrated = useSyncExternalStore(subscribeNoop, clientTrue, serverFalse);
  const [showPrefs, setShowPrefs] = useState(false);
  const [toggles, setToggles] = useState<Toggles>({
    functional: false,
    analytics: false,
    marketing: false,
  });
  const dialogRef = useRef<HTMLDivElement | null>(null);

  function openPreferences() {
    // Seed the toggles from the saved choices each time the center opens.
    const current = getConsentSnapshot();
    if (current) {
      setToggles({
        functional: current.functional,
        analytics: current.analytics,
        marketing: current.marketing,
      });
    }
    setShowPrefs(true);
  }

  // The footer "Cookie Settings" link reopens the preference center.
  useEffect(() => {
    function open() {
      openPreferences();
    }
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, []);

  useEffect(() => {
    if (!showPrefs) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowPrefs(false);
    }
    document.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [showPrefs]);

  function decide(next: Toggles) {
    writeConsent(next);
    setToggles(next);
    setShowPrefs(false);
  }

  if (!hydrated) return null;
  const showBanner = consent === null && !showPrefs;

  return (
    <>
      {showBanner && (
        <section
          className="cookie-banner"
          aria-label="Cookie preferences"
        >
          <p className="cookie-text">
            We use a few cookies to run this site and—only with your
            consent—to measure how it is used. We never sell your
            information. <Link href="/legal/cookies">Cookie Policy</Link>
          </p>
          <div className="cookie-actions">
            <button
              type="button"
              className="btn-primary cookie-btn"
              onClick={() =>
                decide({ functional: true, analytics: true, marketing: true })
              }
            >
              Accept All
            </button>
            <button
              type="button"
              className="btn-secondary cookie-btn"
              onClick={() =>
                decide({
                  functional: false,
                  analytics: false,
                  marketing: false,
                })
              }
            >
              Reject Non-Essential
            </button>
            <button
              type="button"
              className="btn-secondary cookie-btn"
              onClick={openPreferences}
            >
              Manage Preferences
            </button>
          </div>
        </section>
      )}

      {showPrefs && (
        <div className="cookie-scrim">
          <div
            className="cookie-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${uid}-title`}
            tabIndex={-1}
            ref={dialogRef}
          >
            <h2 className="cookie-modal-title" id={`${uid}-title`}>
              Cookie preferences
            </h2>
            <p className="cookie-modal-sub">
              Choose which categories may run. Strictly necessary cookies are
              always active. Details in the{" "}
              <Link href="/legal/cookies">Cookie Policy</Link>.
            </p>
            {CATEGORIES.map((cat) => (
              <div className="cookie-row" key={cat.key}>
                <div className="cookie-row-text">
                  <label
                    className="cookie-row-title"
                    htmlFor={`${uid}-${cat.key}`}
                  >
                    {cat.title}
                  </label>
                  <p className="cookie-row-body">{cat.body}</p>
                </div>
                {cat.locked ? (
                  <span className="cookie-locked">Always active</span>
                ) : (
                  <input
                    id={`${uid}-${cat.key}`}
                    type="checkbox"
                    className="cookie-toggle"
                    checked={toggles[cat.key as keyof Toggles]}
                    onChange={(e) =>
                      setToggles((cur) => ({
                        ...cur,
                        [cat.key]: e.target.checked,
                      }))
                    }
                  />
                )}
              </div>
            ))}
            <div className="cookie-actions cookie-modal-actions">
              <button
                type="button"
                className="btn-primary cookie-btn"
                onClick={() => decide(toggles)}
              >
                Save Preferences
              </button>
              <button
                type="button"
                className="btn-secondary cookie-btn"
                onClick={() =>
                  decide({ functional: true, analytics: true, marketing: true })
                }
              >
                Accept All
              </button>
              <button
                type="button"
                className="btn-secondary cookie-btn"
                onClick={() => setShowPrefs(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
