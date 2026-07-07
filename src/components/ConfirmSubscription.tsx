"use client";

// The button behind the double opt-in. Confirmation is a deliberate POST so
// only a human click—never a mail scanner's prefetch—records consent.

import { useState } from "react";

type Status = "idle" | "confirming" | "done" | "error";

export default function ConfirmSubscription({ token }: { token: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onConfirm() {
    if (status === "confirming") return;
    setStatus("confirming");
    setError("");
    try {
      const res = await fetch("/api/subscribe/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        busy?: boolean;
        error?: string;
      };
      if (res.ok && data.ok) {
        setStatus("done");
        return;
      }
      setError(
        data.busy
          ? "Too many requests right now—wait a minute and click again. Your link is still valid."
          : data.error ||
              "This confirmation link is invalid, expired, or already used.",
      );
      setStatus("error");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="gate-done" role="status">
        <p>
          You&rsquo;re subscribed. The current papers are at{" "}
          <a href="/white-papers">kynigos.law/white-papers</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="confirm-subscription">
      <button
        type="button"
        className="btn-primary"
        onClick={onConfirm}
        disabled={status === "confirming"}
      >
        {status === "confirming" ? "Confirming…" : "Confirm Subscription"}
      </button>
      {error && (
        <p className="gate-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
