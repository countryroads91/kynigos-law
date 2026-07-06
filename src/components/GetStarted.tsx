"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";

type Path = "document" | "situation";

const DOC_TYPES = [
  "Contracts",
  "Loan documents",
  "Employment agreements",
  "NDAs",
  "Leases",
  "Settlement agreements",
  "Privacy policies",
  "Business agreements",
  "Legal notices",
  "Other legal documents",
];

const ACCEPT = ".pdf,.doc,.docx";
const MAX_BYTES = 15 * 1024 * 1024;

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Set NEXT_PUBLIC_CALENDLY_URL (e.g. https://calendly.com/kynigos/consult) in
// Vercel env to replace the placeholder with the live scheduler embed.
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL;

export default function GetStarted() {
  const uid = useId();
  const [path, setPath] = useState<Path>("document");
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // While the fork is on screen, a drop that misses the dropzone must not
  // navigate the browser into the file (which would destroy anything typed
  // in the First Move form below).
  useEffect(() => {
    function swallow(e: DragEvent) {
      e.preventDefault();
    }
    window.addEventListener("dragover", swallow);
    window.addEventListener("drop", swallow);
    return () => {
      window.removeEventListener("dragover", swallow);
      window.removeEventListener("drop", swallow);
    };
  }, []);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next: File[] = [];
    const errors: string[] = [];
    for (const file of Array.from(list)) {
      if (file.size > MAX_BYTES) {
        errors.push(`${file.name} is over 15 MB—email it instead.`);
        continue;
      }
      if (!/\.(pdf|docx?)$/i.test(file.name)) {
        errors.push(`${file.name} is not a PDF or Word document.`);
        continue;
      }
      next.push(file);
    }
    setFileError(errors.join(" "));
    if (next.length) setFiles((cur) => [...cur, ...next]);
  }

  function onTablistKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const order: Path[] = ["document", "situation"];
    let target: Path | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      target = order[(order.indexOf(path) + 1) % order.length];
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      target = order[(order.indexOf(path) + order.length - 1) % order.length];
    } else if (e.key === "Home") {
      target = order[0];
    } else if (e.key === "End") {
      target = order[order.length - 1];
    }
    if (!target) return;
    e.preventDefault();
    setPath(target);
    document.getElementById(`${uid}-tab-${target}`)?.focus();
  }

  return (
    <section className="fork" id="get-started" aria-labelledby="fork-heading">
      <div className="fork-inner">
        <div className="kicker">Get Started</div>
        <h2 className="section-heading" id="fork-heading">
          Where are you starting?
        </h2>
        <p className="section-sub">
          Pick the door that fits. Both end in a fixed number, quoted before
          work begins.
        </p>

        <div
          className="fork-doors"
          role="tablist"
          aria-label="Ways to start"
          onKeyDown={onTablistKeyDown}
        >
          <button
            type="button"
            role="tab"
            id={`${uid}-tab-document`}
            aria-selected={path === "document"}
            aria-controls={`${uid}-panel-document`}
            tabIndex={path === "document" ? 0 : -1}
            className="fork-door"
            onClick={() => setPath("document")}
          >
            <span className="fork-door-eyebrow">Path One</span>
            <span className="fork-door-title">I have a document</span>
            <span className="fork-door-body">
              A contract, lease, NDA, loan file, settlement, policy, or notice
              that needs eyes on it.
            </span>
            <span className="fork-door-meta">Review from $444 flat</span>
          </button>
          <button
            type="button"
            role="tab"
            id={`${uid}-tab-situation`}
            aria-selected={path === "situation"}
            aria-controls={`${uid}-panel-situation`}
            tabIndex={path === "situation" ? 0 : -1}
            className="fork-door"
            onClick={() => setPath("situation")}
          >
            <span className="fork-door-eyebrow">Path Two</span>
            <span className="fork-door-title">I have a situation</span>
            <span className="fork-door-body">
              No paper yet—a dispute, a divorce, an eviction, a deal taking
              shape.
            </span>
            <span className="fork-door-meta">Free 30-minute consultation</span>
          </button>
        </div>

        <div
          className="fork-panel"
          role="tabpanel"
          id={`${uid}-panel-document`}
          aria-labelledby={`${uid}-tab-document`}
          tabIndex={0}
          hidden={path !== "document"}
        >
          <div>
            <h3 className="fork-panel-title">
              Reviewed, negotiated, explained, or revised
            </h3>
            <ul className="fork-chips">
              {DOC_TYPES.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="fork-panel-body">
              Full redline, a call to walk through every change, and a fixed
              price you see before we start. Professional Contract Review is
              $444 posted; anything else is quoted up front—never billed by
              the hour.
            </p>
          </div>
          <div>
            {/* Upload UI only—files stay in the browser until a storage +
                checkout backend is connected. The working path today is
                email; keep both visible and honest. */}
            <div
              className={dragging ? "dropzone is-dragging" : "dropzone"}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={(e) => {
                // Ignore leave events fired by crossing the dropzone's own
                // children—only a true exit clears the highlight.
                if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                setDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                addFiles(e.dataTransfer.files);
              }}
            >
              <p className="dropzone-title">Drop your document here</p>
              <p className="dropzone-hint">PDF or Word, up to 15 MB</p>
              <button
                type="button"
                className="btn-secondary dropzone-browse"
                onClick={() => inputRef.current?.click()}
              >
                Browse Files
              </button>
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPT}
                multiple
                className="dropzone-input"
                aria-label="Choose a document to upload"
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              <span className="pending-chip">
                Upload &amp; checkout—integration pending
              </span>
            </div>
            {fileError && (
              <p className="gate-error" role="alert">
                {fileError}
              </p>
            )}
            {files.length > 0 && (
              <ul className="dropzone-files">
                {files.map((f, i) => (
                  <li key={`${f.name}-${i}`}>
                    <span className="dropzone-file-name">{f.name}</span>
                    <span className="dropzone-file-size">
                      {formatSize(f.size)}
                    </span>
                    <button
                      type="button"
                      className="dropzone-remove"
                      aria-label={`Remove ${f.name}`}
                      onClick={() =>
                        setFiles((cur) => cur.filter((_, j) => j !== i))
                      }
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <a
              className="btn-primary fork-panel-cta"
              href="mailto:info@kynigos.law?subject=Document%20review"
            >
              Email Your Document
            </a>
            <p className="fork-note">
              Online upload and checkout are being connected. Until then, the
              document goes straight to the reviewing attorney by email—same
              review, same price. Or{" "}
              <a href="#first-move">describe it below</a> and we reply within
              one business day.
            </p>
          </div>
        </div>

        <div
          className="fork-panel"
          role="tabpanel"
          id={`${uid}-panel-situation`}
          aria-labelledby={`${uid}-tab-situation`}
          tabIndex={0}
          hidden={path !== "situation"}
        >
          <div>
            <h3 className="fork-panel-title">Start with a conversation</h3>
            <ol className="fork-steps">
              <li>
                <strong>Free consultation.</strong> We scope the matter and
                tell you plainly whether the firm should take it.
              </li>
              <li>
                <strong>Defined next step at a fixed fee.</strong> You know the
                full number before any work begins.
              </li>
              <li>
                <strong>You decide whether to re-engage.</strong> Every stage
                closes with your decision, not an invoice.
              </li>
            </ol>
            <p className="fork-panel-body">
              Thirty minutes, no obligation, and a straight answer either way.
            </p>
          </div>
          <div>
            {CALENDLY_URL && path === "situation" ? (
              // Mounted only while this tab is open—loading="lazy" does not
              // reliably defer iframes inside [hidden] containers, and the
              // third-party embed should not tax visitors who never open it.
              <iframe
                src={CALENDLY_URL}
                title="Schedule a free consultation"
                className="calendly-embed"
                loading="lazy"
              />
            ) : CALENDLY_URL ? null : (
              <div className="calendly-placeholder">
                <p className="dropzone-title">Consultation scheduler</p>
                <p className="dropzone-hint">
                  The live calendar appears here once scheduling is connected.
                </p>
                <span className="pending-chip">
                  Scheduler—integration pending
                </span>
              </div>
            )}
            <Link href="/contact" className="btn-primary fork-panel-cta">
              Book A Free Consultation
            </Link>
            <p className="fork-note">
              Prefer to skip the calendar? Call{" "}
              <a href="tel:+13045491058">(304) 549-1058</a> or email{" "}
              <a href="mailto:info@kynigos.law">info@kynigos.law</a>. You
              will speak directly with the attorney—not an intake service.
            </p>
          </div>
        </div>

        <a className="scroll-cue" href="#skin-in-the-game">
          Why price it this way?
          <span className="scroll-cue-arrow" aria-hidden="true">
            ↓
          </span>
        </a>
      </div>
    </section>
  );
}
