"use client";

// Cloudflare Turnstile challenge, explicit-render so multiple forms can host
// their own widget on one page (the white-papers page has two gates).
// Env-gated: without NEXT_PUBLIC_TURNSTILE_SITE_KEY this renders nothing and
// the server skips verification—the same off-until-configured pattern as
// Calendly and Resend.

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Props = {
  // Called with a fresh token on success and with "" on expiry/error, so the
  // host form can gate its submit button on token presence.
  onToken: (token: string) => void;
  // Increment after a failed submission: tokens are single-use, so the widget
  // must issue a fresh challenge or every retry would 403 server-side.
  resetSignal?: number;
};

export default function TurnstileWidget({ onToken, resetSignal = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const onTokenRef = useRef(onToken);
  // Script failed to load (network filter, extension). Without feedback the
  // host form's submit button would sit disabled forever with no explanation.
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!resetSignal) return;
    if (widgetIdRef.current && window.turnstile?.reset) {
      window.turnstile.reset(widgetIdRef.current);
    }
    onTokenRef.current("");
  }, [resetSignal]);

  useEffect(() => {
    const el = ref.current;
    if (!TURNSTILE_SITE_KEY || !el) return;

    let cancelled = false;

    function render() {
      if (cancelled || !el || !window.turnstile || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(el, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => onTokenRef.current(token),
        "expired-callback": () => onTokenRef.current(""),
        "error-callback": () => onTokenRef.current(""),
        // The site is fixed light (Oxblood Atrium)—"auto" would follow the
        // visitor's OS and drop a dark box onto the warm-white gate form.
        theme: "light",
        // Fill the container instead of a fixed 300px that can overflow
        // narrow phones inside the padded form cards.
        size: "flexible",
        appearance: "always",
      });
    }

    function fail() {
      if (!cancelled) setFailed(true);
    }

    function cleanup() {
      cancelled = true;
      if (widgetIdRef.current) {
        window.turnstile?.remove(widgetIdRef.current);
        widgetIdRef.current = undefined;
      }
    }

    if (window.turnstile) {
      render();
      return cleanup;
    }

    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`,
    );
    if (!script) {
      script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", render);
    script.addEventListener("error", fail);
    return () => {
      script.removeEventListener("load", render);
      script.removeEventListener("error", fail);
      cleanup();
    };
  }, []);

  if (!TURNSTILE_SITE_KEY) return null;
  if (failed) {
    return (
      <p className="gate-error" role="alert">
        Our human-verification service could not load, so this form cannot
        submit. Please email{" "}
        <a href="mailto:info@kynigos.law">info@kynigos.law</a> or call{" "}
        <a href="tel:+13045491058">(304) 549-1058</a> instead.
      </p>
    );
  }
  return <div ref={ref} className="turnstile-slot" />;
}
