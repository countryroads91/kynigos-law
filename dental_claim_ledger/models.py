from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class PageRecord:
    url: str
    fetched_at: str
    title: str
    html_hash: str
    raw_html_path: str
    source_type: str = "practice_or_provider_page"


@dataclass(frozen=True)
class ClaimRecord:
    url: str
    page_title: str
    fetched_at: str
    html_hash: str
    raw_html_path: str
    claim_text: str
    trigger_phrase: str
    classification: str
    risk_score: str
    review_label: str
    source_type: str
