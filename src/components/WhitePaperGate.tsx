"use client";

import { useId, useState } from "react";
import TurnstileWidget, { TURNSTILE_SITE_KEY } from "./TurnstileWidget";

type Props = {
  paper: string;
  slug: string;
  fileName: string;
};

type Status = "idle" | "submitting" | "done" | "error";

const LINK_EXPIRED_ERROR =
  "This download link has expired. Please refresh the page and request the paper again.";

export default function WhitePaperGate({ paper, slug, fileName }: Props) {
  // Two gates render on the same page; hardcoded ids collided, so the second
  // form's labels focused the first form's inputs.
  const uid = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot—hidden from real users
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReset, setTurnstileReset] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  // The (possibly signed) download URL minted by /api/lead on success.
  const [downloadUrl, setDownloadUrl] = useState("");
  // Failure of the download itself (expired link, missing file)—distinct from
  // form submission errors so the done state can surface it inline.
  const [downloadError, setDownloadError] = useState("");

  // With Turnstile configured, hold submission until the challenge resolves.
  const awaitingTurnstile = Boolean(TURNSTILE_SITE_KEY) && !turnstileToken;

  // Tokens are single-use: any failed submission consumed this one, so a
  // fresh challenge must run before the user retries.
  function resetTurnstile() {
    setTurnstileToken("");
    setTurnstileReset((n) => n + 1);
  }

  // Fetch-then-save instead of a bare <a download>: the signed URL expires,
  // and an anchor would silently save the API's JSON error body under a
  // .pdf filename. Returns false so callers can surface the failure.
  async function triggerDownload(url: string): Promise<boolean> {
    try {
      const res = await fetch(url);
      const type = res.headers.get("content-type") ?? "";
      if (!res.ok || !type.includes("pdf")) return false;
      const objectUrl = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      return true;
    } catch {
      return false;
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, paper, slug, company, turnstileToken }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        url?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        resetTurnstile();
        return;
      }
      const url = data.url || `/api/paper/${slug}`;
      setDownloadUrl(url);
      setStatus("done");
      if (!(await triggerDownload(url))) {
        setDownloadError(LINK_EXPIRED_ERROR);
      }
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
      resetTurnstile();
    }
  }

  async function onDownloadAgain() {
    setDownloadError("");
    if (!(await triggerDownload(downloadUrl))) {
      setDownloadError(LINK_EXPIRED_ERROR);
    }
  }

  if (status === "done") {
    return (
      <div className="gate-done" role="status">
        <p>
          Thanks, {name.split(" ")[0] || "there"}. Your download should begin
          automatically.
        </p>
        <button type="button" className="btn-secondary" onClick={onDownloadAgain}>
          Download again
        </button>
        {downloadError && (
          <p className="gate-error" role="alert">
            {downloadError}
          </p>
        )}
      </div>
    );
  }

  return (
    <form className="gate-form" onSubmit={onSubmit} noValidate>
      <div className="gate-field">
        <label htmlFor={`${uid}-name`}>Name</label>
        <input
          id={`${uid}-name`}
          name="name"
          type="text"
          required
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
      <button
        type="submit"
        className="btn-primary"
        disabled={status === "submitting" || awaitingTurnstile}
      >
        {status === "submitting" ? "Sending…" : "Download the White Paper"}
      </button>
      <p className="gate-note">
        Your name and email go to Kynigos Law Firm so we can share the paper and
        related research. We do not sell your information.
      </p>
    </form>
  );
}
