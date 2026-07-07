"use client";

// Research-notes signup (double opt-in via /api/subscribe). Env-gated on
// NEXT_PUBLIC_NEWSLETTER_ENABLED so the form only appears once the database
// and Resend audience are provisioned—same off-until-configured pattern as
// Calendly and Turnstile.

import { useId, useState } from "react";
import { NEWSLETTER_ENABLED } from "@/lib/flags";
import TurnstileWidget, { TURNSTILE_SITE_KEY } from "./TurnstileWidget";

type Status = "idle" | "submitting" | "done" | "error";

export default function NewsletterSignup() {
  const uid = useId();
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot—hidden from real users
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReset, setTurnstileReset] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  if (!NEWSLETTER_ENABLED) return null;

  // With Turnstile configured, hold submission until the challenge resolves.
  const awaitingTurnstile = Boolean(TURNSTILE_SITE_KEY) && !turnstileToken;

  // Tokens are single-use: any failed submission consumed this one, so a
  // fresh challenge must run before the user retries.
  function resetTurnstile() {
    setTurnstileToken("");
    setTurnstileReset((n) => n + 1);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, turnstileToken }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        resetTurnstile();
        return;
      }
      setStatus("done");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
      resetTurnstile();
    }
  }

  if (status === "done") {
    return (
      <div className="newsletter-signup gate-done" role="status">
        <p>
          Check your inbox—click the confirmation link and you&rsquo;re on the
          list.
        </p>
      </div>
    );
  }

  return (
    <form className="newsletter-signup" onSubmit={onSubmit} noValidate>
      <label htmlFor={`${uid}-email`} className="newsletter-label">
        Research notes, when there&rsquo;s something worth sending
      </label>
      <div className="newsletter-row">
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={status === "submitting" || awaitingTurnstile}
        >
          {status === "submitting" ? "Sending…" : "Subscribe"}
        </button>
      </div>
      <div className="gate-honeypot" aria-hidden="true">
        <label htmlFor={`${uid}-company`}>Company</label>
        <input
          id={`${uid}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      <TurnstileWidget onToken={setTurnstileToken} resetSignal={turnstileReset} />
      {error && (
        <p className="gate-error" role="alert">
          {error}
        </p>
      )}
      <p className="gate-note">
        White papers, publications, and fee-structure analysis. Double opt-in,
        one-click unsubscribe, never sold.
      </p>
    </form>
  );
}
