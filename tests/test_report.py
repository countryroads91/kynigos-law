import csv

from dental_claim_ledger.models import ClaimRecord
from dental_claim_ledger.report import write_claims_csv, write_review_html


def sample_claim() -> ClaimRecord:
    return ClaimRecord(
        url="https://example.test/dentist",
        page_title="Example Dentist",
        fetched_at="2026-05-09T00:00:00+00:00",
        html_hash="abc123",
        raw_html_path="output/raw_html/abc123.html",
        claim_text="Dr. X is a Board-certified periodontist.",
        trigger_phrase="board-certified",
        classification="direct_board_certification",
        risk_score="High",
        review_label="verification needed",
        source_type="practice_or_provider_page",
    )


def test_writes_csv_preserving_claim_text_and_url(tmp_path):
    path = tmp_path / "claims.csv"
    write_claims_csv([sample_claim()], path)
    rows = list(csv.DictReader(path.open(encoding="utf-8")))
    assert rows[0]["url"] == "https://example.test/dentist"
    assert rows[0]["claim_text"] == "Dr. X is a Board-certified periodontist."


def test_writes_phone_readable_html(tmp_path):
    path = tmp_path / "claims_review.html"
    write_review_html([sample_claim()], path)
    content = path.read_text(encoding="utf-8")
    assert "viewport" in content
    assert "Neutral extraction ledger only" in content
    assert "Board-certified periodontist" in content
