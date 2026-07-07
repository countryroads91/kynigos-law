"use client";

import { useId, useState } from "react";
import TurnstileWidget, { TURNSTILE_SITE_KEY } from "./TurnstileWidget";

type Status = "idle" | "submitting" | "done" | "error";

// Lightweight opener—one big prompt, three small fields, same /api/contact
// backend (Resend) as the full contact form.
export default function FirstMove() {
  const uid = useId();
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [company, setCompany] = useState(""); // honeypot—hidden from real users
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReset, setTurnstileReset] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const outsideDC = jurisdiction === "other";
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
    if (outsideDC || status === "submitting") return;
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          jurisdiction,
          message,
          company,
          source: "first_move",
          turnstileToken,
        }),
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

  return (
    <section className="first-move" id="first-move" aria-labelledby="fm-heading">
      <div className="first-move-inner">
        <div className="kicker">Make Contact</div>
        <h2 className="section-heading" id="fm-heading">
          The first move is yours.
        </h2>
        <p className="section-sub">
          Describe the document or the situation in a few sentences. We reply
          within one business day with a straight answer—including
          &ldquo;you don&rsquo;t need a lawyer for this.&rdquo;
        </p>

        {status === "done" ? (
          <div className="gate-done" role="status">
            <p>
              Thanks, {name.split(" ")[0] || "there"}. Your message is on its
              way. We respond within one business day.
            </p>
          </div>
        ) : (
          <form className="first-move-form" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor={`${uid}-message`}>
              Describe your document or situation
            </label>
            <textarea
              id={`${uid}-message`}
              name="message"
              className="first-move-textarea"
              required
              rows={4}
              maxLength={5000}
              placeholder="I was just served an eviction notice… / I have an employment contract to review… / My lender needs a DC opinion letter…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="first-move-grid">
              <div className="gate-field">
                <label htmlFor={`${uid}-name`}>Name</label>
                <input
                  id={`${uid}-name`}
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={120}
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="gate-field">
                <label htmlFor={`${uid}-email`}>Email</label>
                <input
                  id={`${uid}-email`}
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="gate-field">
                <label htmlFor={`${uid}-jurisdiction`}>Matter involves</label>
                <select
                  id={`${uid}-jurisdiction`}
                  name="jurisdiction"
                  required
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  <option value="dc">District of Columbia law</option>
                  <option value="other">Another jurisdiction</option>
                </select>
              </div>
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
            {outsideDC && (
              <p className="gate-note" role="status">
                Kynigos Law Firm, PLLC is licensed in the District of Columbia
                only. For matters in another jurisdiction, email{" "}
                <a href="mailto:info@kynigos.law">info@kynigos.law</a> and we
                may be able to refer you to local counsel.
              </p>
            )}
            <TurnstileWidget
              onToken={setTurnstileToken}
              resetSignal={turnstileReset}
            />
            {error && (
              <p className="gate-error" role="alert">
                {error}
              </p>
            )}
            <div className="first-move-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={status === "submitting" || outsideDC || awaitingTurnstile}
              >
                {status === "submitting" ? "Sending…" : "Make The First Move"}
              </button>
              <p className="gate-note">
                No fee, no obligation, no attorney-client relationship until an
                engagement letter says so.
              </p>
            </div>
          </form>
        )}
        <p className="process-note first-move-note">
          Kynigos Law Firm, PLLC is licensed in the District of Columbia.
          Matters outside DC may require referral to local counsel.
        </p>
      </div>
    </section>
  );
}
