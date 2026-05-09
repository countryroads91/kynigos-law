from __future__ import annotations

import re
from html import unescape
from html.parser import HTMLParser
from typing import Iterable

from .models import ClaimRecord, PageRecord

TRIGGER_PATTERNS: tuple[tuple[str, re.Pattern[str]], ...] = tuple(
    (phrase, re.compile(pattern, re.IGNORECASE))
    for phrase, pattern in [
        ("board certified", r"\bboard\s+certified\b"),
        ("board-certified", r"\bboard-certified\b"),
        ("diplomate", r"\bdiplomate\b"),
        ("American Board", r"\bAmerican\s+Board\b"),
        ("board eligible", r"\bboard\s+eligible\b"),
        ("candidate for board certification", r"\bcandidate\s+for\s+(?:the\s+)?(?:American\s+Board\s+of\s+)?[A-Za-z\s]*board\s+certification\b|\bcandidate\s+for\s+the\s+American\s+Board\s+of\s+[A-Za-z\s]+\b"),
        ("specialist", r"\bspecialist\b"),
        ("specializes in", r"\bspecializes\s+in\b"),
        ("MSD", r"\bMSD\b"),
        ("MS", r"\bMS\b"),
        ("MScD", r"\bMScD\b"),
        ("MDSc", r"\bMDSc\b"),
        ("PhD", r"\bPh\.?D\.?\b"),
        ("Fellow", r"\bFellow\b"),
        ("Member", r"\bMember\b"),
    ]
)

RECOGNIZED_SPECIALTIES = {
    "dental anesthesiology",
    "dental public health",
    "endodontics",
    "endodontist",
    "oral and maxillofacial pathology",
    "oral and maxillofacial radiology",
    "oral and maxillofacial surgery",
    "oral medicine",
    "orofacial pain",
    "orthodontics",
    "orthodontist",
    "pediatric dentistry",
    "pediatric dentist",
    "periodontics",
    "periodontist",
    "prosthodontics",
    "prosthodontist",
}

NONRECOGNIZED_SPECIALTY_TERMS = {
    "cosmetic",
    "implant",
    "implants",
    "tmj",
    "sleep",
    "sedation",
    "laser",
    "holistic",
    "biological",
    "family",
    "general",
}

MEMBERSHIP_TERMS = {"member", "membership", "ada", "academy", "association", "society"}


class _TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self.title_parts: list[str] = []
        self._skip_depth = 0
        self._in_title = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"script", "style", "noscript"}:
            self._skip_depth += 1
        if tag == "title":
            self._in_title = True
        if tag in {"p", "div", "li", "br", "h1", "h2", "h3", "h4", "h5", "h6"}:
            self.parts.append(" ")

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style", "noscript"} and self._skip_depth:
            self._skip_depth -= 1
        if tag == "title":
            self._in_title = False
        if tag in {"p", "div", "li", "br", "h1", "h2", "h3", "h4", "h5", "h6"}:
            self.parts.append(" ")

    def handle_data(self, data: str) -> None:
        if self._skip_depth:
            return
        self.parts.append(data)
        if self._in_title:
            self.title_parts.append(data)


def _parse_html(html: str) -> _TextExtractor:
    parser = _TextExtractor()
    parser.feed(html)
    parser.close()
    return parser


def html_to_text(html: str) -> str:
    return normalize_space(" ".join(_parse_html(html).parts))


def page_title(html: str) -> str:
    return normalize_space(" ".join(_parse_html(html).title_parts))


def normalize_space(value: str) -> str:
    return re.sub(r"\s+", " ", unescape(value)).strip()


def sentence_window(text: str, start: int, end: int, radius: int = 180) -> str:
    left = max(0, start - radius)
    right = min(len(text), end + radius)
    sentence_left = max(text.rfind(". ", 0, start), text.rfind("! ", 0, start), text.rfind("? ", 0, start))
    if sentence_left >= left:
        prefix = text[max(0, sentence_left - 4) : sentence_left + 1].lower()
        if prefix.endswith("dr."):
            left = max(left, sentence_left - 2)
        else:
            left = sentence_left + 2
    sentence_right_candidates = [idx for idx in [text.find(". ", end), text.find("! ", end), text.find("? ", end)] if idx != -1]
    if sentence_right_candidates:
        right = min(right, min(sentence_right_candidates) + 1)
    return normalize_space(text[left:right])


def extract_claims(html: str, page: PageRecord) -> list[ClaimRecord]:
    text = html_to_text(html)
    seen: set[tuple[str, str]] = set()
    claims: list[ClaimRecord] = []
    for trigger, pattern in TRIGGER_PATTERNS:
        for match in pattern.finditer(text):
            claim_text = sentence_window(text, match.start(), match.end())
            key = (claim_text.lower(), trigger.lower())
            if key in seen:
                continue
            seen.add(key)
            classification = classify_claim(claim_text, trigger, page.source_type)
            claims.append(
                ClaimRecord(
                    url=page.url,
                    page_title=page.title,
                    fetched_at=page.fetched_at,
                    html_hash=page.html_hash,
                    raw_html_path=page.raw_html_path,
                    claim_text=claim_text,
                    trigger_phrase=trigger,
                    classification=classification,
                    risk_score=risk_score(claim_text, classification),
                    review_label=review_label(classification, claim_text),
                    source_type=page.source_type,
                )
            )
    return claims


def classify_claim(claim_text: str, trigger: str, source_type: str = "practice_or_provider_page") -> str:
    lower = claim_text.lower()
    if source_type == "third_party_directory":
        return "third_party_directory_claim"
    if re.search(r"\bour\s+board[-\s]+certified\s+specialists\b|\bteam\s+of\s+board[-\s]+certified\b", lower):
        return "team_level_ambiguous_claim"
    if "candidate" in lower and ("american board" in lower or "board certification" in lower):
        return "board_eligible_or_candidate"
    if "board eligible" in lower:
        return "board_eligible_or_candidate"
    if "diplomate" in lower:
        return "diplomate_status"
    if re.search(r"\bboard[-\s]+certified\b", lower):
        return "direct_board_certification"
    if re.search(r"\b(msd|msc?d|mdsc|ph\.?d\.?)\b", lower, re.IGNORECASE):
        return "academic_degree_claim"
    if "fellow" in lower or any(term in lower for term in MEMBERSHIP_TERMS):
        return "affiliation_or_fellowship_claim"
    if "specialist" in lower or "specializes in" in lower:
        if any(term in lower for term in RECOGNIZED_SPECIALTIES):
            return "recognized_specialty_claim"
        if any(term in lower for term in NONRECOGNIZED_SPECIALTY_TERMS):
            return "nonrecognized_specialty_claim"
        return "recognized_specialty_claim"
    if "american board" in lower:
        return "affiliation_or_fellowship_claim"
    return "affiliation_or_fellowship_claim"


def risk_score(claim_text: str, classification: str) -> str:
    lower = claim_text.lower()
    if classification in {"direct_board_certification", "diplomate_status"}:
        return "High"
    if classification == "academic_degree_claim" and re.search(r"\b(msd|msc?d|mdsc|ph\.?d\.?)\b", lower, re.IGNORECASE):
        return "High"
    if classification == "recognized_specialty_claim" and any(term in lower for term in RECOGNIZED_SPECIALTIES):
        return "High"
    if classification == "board_eligible_or_candidate":
        return "High"
    if classification in {"nonrecognized_specialty_claim", "team_level_ambiguous_claim"}:
        return "Medium"
    if "specialist" in lower or "specializes in" in lower:
        return "Medium"
    return "Low"


def review_label(classification: str, claim_text: str) -> str:
    if classification == "team_level_ambiguous_claim":
        return "ambiguous"
    if classification in {"affiliation_or_fellowship_claim", "third_party_directory_claim"}:
        return "not board-certification claim"
    if risk_score(claim_text, classification) in {"High", "Medium"}:
        return "verification needed"
    return "claim found"


def merge_claims(claim_groups: Iterable[Iterable[ClaimRecord]]) -> list[ClaimRecord]:
    merged: list[ClaimRecord] = []
    seen: set[tuple[str, str, str]] = set()
    for group in claim_groups:
        for claim in group:
            key = (claim.url, claim.claim_text.lower(), claim.trigger_phrase.lower())
            if key not in seen:
                seen.add(key)
                merged.append(claim)
    return merged
