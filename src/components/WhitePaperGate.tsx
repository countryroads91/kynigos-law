"use client";

import { useId, useState } from "react";

type Props = {
  paper: string;
  file: string;
  fileName: string;
};

type Status = "idle" | "submitting" | "done" | "error";

export default function WhitePaperGate({ paper, file, fileName }: Props) {
  // Two gates render on the same page; hardcoded ids collided, so the second
  // form's labels focused the first form's inputs.
  const uid = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  function triggerDownload() {
    const a = document.createElement("a");
    a.href = file;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, paper }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      triggerDownload();
      setStatus("done");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="gate-done">
        <p>
          Thanks, {name.split(" ")[0] || "there"}. Your download should begin
          automatically.
        </p>
        <a href={file} download={fileName} className="btn-secondary">
          Download again
        </a>
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
      {error && (
        <p className="gate-error" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="btn-primary"
        disabled={status === "submitting"}
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
