from pathlib import Path

from dental_claim_ledger.extractor import extract_claims
from dental_claim_ledger.models import PageRecord


def fixture_page() -> PageRecord:
    return PageRecord(
        url="https://example.test/dentist",
        fetched_at="2026-05-09T00:00:00+00:00",
        title="Fixture Dental Practice",
        html_hash="abc123",
        raw_html_path="output/raw_html/abc123.html",
    )


def claim_by_text(claims, text):
    matches = [claim for claim in claims if text in claim.claim_text]
    assert matches, f"No claim contained {text!r}: {[claim.claim_text for claim in claims]}"
    return matches[0]


def test_known_claim_examples_are_extracted_and_classified():
    html = Path("tests/fixtures/claims.html").read_text(encoding="utf-8")
    claims = extract_claims(html, fixture_page())

    diplomate = claim_by_text(claims, "Diplomate of the American Board of Endodontics")
    assert diplomate.classification == "diplomate_status"
    assert diplomate.risk_score == "High"
    assert diplomate.review_label == "verification needed"
    assert diplomate.url == "https://example.test/dentist"

    periodontist = claim_by_text(claims, "Board-certified periodontist")
    assert periodontist.classification == "direct_board_certification"
    assert periodontist.risk_score == "High"

    candidate = claim_by_text(claims, "Candidate for the American Board of Pediatric Dentistry")
    assert candidate.classification == "board_eligible_or_candidate"
    assert candidate.risk_score == "High"

    cosmetic = claim_by_text(claims, "cosmetic dentistry specialist")
    assert cosmetic.classification == "nonrecognized_specialty_claim"
    assert cosmetic.risk_score == "Medium"

    team = claim_by_text(claims, "Our board-certified specialists")
    assert team.classification == "team_level_ambiguous_claim"
    assert team.review_label == "ambiguous"

    member = claim_by_text(claims, "Member of the ADA")
    assert member.classification == "affiliation_or_fellowship_claim"
    assert member.risk_score == "Low"
    assert member.review_label == "not board-certification claim"

    degree = claim_by_text(claims, "Dr. X, DDS, MSD")
    assert degree.classification == "academic_degree_claim"
    assert degree.risk_score == "High"


def test_third_party_directory_claim_classification_overrides_content():
    page = PageRecord(
        url="https://directory.example.test/profile",
        fetched_at="2026-05-09T00:00:00+00:00",
        title="Directory",
        html_hash="def456",
        raw_html_path="output/raw_html/def456.html",
        source_type="third_party_directory",
    )
    claims = extract_claims("<p>Board-certified periodontist</p>", page)
    assert claims[0].classification == "third_party_directory_claim"
    assert claims[0].review_label == "not board-certification claim"
