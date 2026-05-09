from __future__ import annotations

import csv
import html
from dataclasses import asdict
from pathlib import Path

from .models import ClaimRecord

CSV_FIELDS = [
    "url",
    "page_title",
    "fetched_at",
    "html_hash",
    "raw_html_path",
    "claim_text",
    "trigger_phrase",
    "classification",
    "risk_score",
    "review_label",
    "source_type",
]


def write_claims_csv(claims: list[ClaimRecord], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=CSV_FIELDS)
        writer.writeheader()
        for claim in claims:
            writer.writerow(asdict(claim))


def write_review_html(claims: list[ClaimRecord], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    cards = []
    for claim in claims:
        cards.append(
            f"""
<article class="card risk-{html.escape(claim.risk_score.lower())}">
  <div class="meta"><strong>{html.escape(claim.risk_score)}</strong> · {html.escape(claim.review_label)} · {html.escape(claim.classification)}</div>
  <blockquote>“{html.escape(claim.claim_text)}”</blockquote>
  <p><a href="{html.escape(claim.url)}">{html.escape(claim.page_title or claim.url)}</a></p>
  <details><summary>Source details</summary>
    <dl>
      <dt>Fetched</dt><dd>{html.escape(claim.fetched_at)}</dd>
      <dt>Trigger</dt><dd>{html.escape(claim.trigger_phrase)}</dd>
      <dt>Hash</dt><dd><code>{html.escape(claim.html_hash)}</code></dd>
      <dt>Raw HTML</dt><dd><code>{html.escape(claim.raw_html_path)}</code></dd>
      <dt>Source type</dt><dd>{html.escape(claim.source_type)}</dd>
    </dl>
  </details>
</article>"""
        )
    body = "\n".join(cards) if cards else "<p>No configured claim phrases were found.</p>"
    path.write_text(
        f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dental Credential Claims Review</title>
<style>
  body {{ font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 0; background: #f8fafc; color: #172033; }}
  header {{ background: #0f2742; color: white; padding: 1rem; position: sticky; top: 0; }}
  main {{ padding: 0.75rem; max-width: 860px; margin: 0 auto; }}
  .notice {{ background: #e8f2ff; border-left: 4px solid #2f6db3; padding: 0.75rem; margin: 1rem 0; }}
  .card {{ background: white; border-radius: 14px; padding: 1rem; margin: 0.85rem 0; box-shadow: 0 1px 8px rgba(15, 39, 66, 0.12); }}
  .meta {{ font-size: 0.95rem; color: #3f4b5f; }}
  blockquote {{ font-size: 1.08rem; line-height: 1.45; margin: 0.75rem 0; padding-left: 0.75rem; border-left: 4px solid #c7d2fe; }}
  a {{ color: #164f91; overflow-wrap: anywhere; }}
  dl {{ display: grid; grid-template-columns: minmax(5rem, 8rem) 1fr; gap: 0.4rem; }}
  dt {{ font-weight: 700; }} dd {{ margin: 0; overflow-wrap: anywhere; }}
  .risk-high {{ border-top: 5px solid #b42318; }}
  .risk-medium {{ border-top: 5px solid #c26a00; }}
  .risk-low {{ border-top: 5px solid #238636; }}
</style>
</head>
<body>
<header><h1>Dental Credential Claims Review</h1></header>
<main>
<section class="notice">Neutral extraction ledger only. A row means “claim found” or “verification needed”; it is not a fraud determination or accusation.</section>
{body}
</main>
</body>
</html>
""",
        encoding="utf-8",
    )
