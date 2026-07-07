"use client";

import { useId, useState } from "react";
import { track } from "@/lib/analytics";
import TurnstileWidget, { TURNSTILE_SITE_KEY } from "./TurnstileWidget";

type Status = "idle" | "submitting" | "done" | "error";

export default function ContactForm() {
  const uid = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [message, setMessage] = useState("");
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
          phone,
          jurisdiction,
          message,
          company,
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
      track("generate_lead", { method: "contact_form" });
      setStatus("done");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
      resetTurnstile();
    }
  }

  if (status === "done") {
    return (
      <div className="gate-done" role="status">
        <p>
          Thanks, {name.split(" ")[0] || "there"}. Your message is on its way.
          We respond within one business day.
        </p>
      </div>
    );
  }

  return (
    <form className="gate-form contact-form" onSubmit={onSubmit}>
      <div className="gate-field">
        <label htmlFor={`${uid}-name`}>Name</label>
        <input
          id={`${uid}-name`}
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={120}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
      </div>
      <div className="gate-field">
        <label htmlFor={`${uid}-email`}>Email</label>
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>
      <div className="gate-field">
        <label htmlFor={`${uid}-phone`}>Phone (optional)</label>
        <input
          id={`${uid}-phone`}
          name="phone"
          type="tel"
          maxLength={40}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
        />
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
      <div className="gate-field">
        <label htmlFor={`${uid}-jurisdiction`}>Your matter involves</label>
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
      {outsideDC && (
        <p className="gate-note" role="status">
          Kynigos Law Firm, PLLC is licensed in the District of Columbia only.
          For matters in another jurisdiction, email{" "}
          <a href="mailto:info@kynigos.law">info@kynigos.law</a> and we may be
          able to refer you to local counsel.
        </p>
      )}
      <div className="gate-field">
        <label htmlFor={`${uid}-message`}>How can we help?</label>
        <textarea
          id={`${uid}-message`}
          name="message"
          required
          rows={5}
          maxLength={5000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <TurnstileWidget onToken={setTurnstileToken} resetSignal={turnstileReset} />
      {error && (
        <p className="gate-error" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="btn-primary"
        disabled={status === "submitting" || outsideDC || awaitingTurnstile}
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
      <p className="gate-note">
        Your details go to Kynigos Law Firm so we can respond to your inquiry.
        We do not sell your information. Submitting this form does not create
        an attorney-client relationship. Do not send confidential or
        time-sensitive information.
      </p>
    </form>
  );
}
