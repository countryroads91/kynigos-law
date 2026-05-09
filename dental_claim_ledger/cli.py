from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from .config import load_search_config
from .extractor import extract_claims, merge_claims
from .fetcher import PublicPageFetcher
from .report import write_claims_csv, write_review_html
from .search import gather_urls


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Harvest public dental advertising credential claims.")
    parser.add_argument("--config", default="config/search_queries.yml", help="Path to YAML search configuration.")
    parser.add_argument("--output", default="output", help="Directory for raw HTML and claim outputs.")
    parser.add_argument("--max-urls", type=int, default=None, help="Optional cap on URLs fetched for this run.")
    parser.add_argument("--dry-run", action="store_true", help="Resolve configured URLs but do not fetch pages.")
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    config_path = Path(args.config)
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)
    config = load_search_config(config_path)

    search_results, notes = gather_urls(config)
    if args.max_urls is not None:
        search_results = search_results[: args.max_urls]

    manifest: dict[str, Any] = {
        "config": str(config_path),
        "url_count": len(search_results),
        "notes": notes,
        "urls": [result.url for result in search_results],
    }
    if args.dry_run:
        (output_dir / "run_manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
        return 0

    fetch_config = config.get("fetch", {}) or {}
    fetcher = PublicPageFetcher(
        output_dir=output_dir,
        user_agent=fetch_config.get("user_agent", "DentalClaimLedger/0.1"),
        timeout_seconds=int(fetch_config.get("timeout_seconds", 15)),
        delay_seconds=float(fetch_config.get("delay_seconds", 1.0)),
        respect_robots_txt=bool(fetch_config.get("respect_robots_txt", True)),
        allowed_schemes=fetch_config.get("allowed_schemes", ["http", "https"]),
    )

    all_claim_groups = []
    for result in search_results:
        page, error = fetcher.fetch(result.url, source_type=result.source_type)
        if error:
            notes.append(error)
            continue
        if page is None:
            continue
        html_path = output_dir / "raw_html" / f"{page.html_hash}.html"
        html = html_path.read_text(encoding="utf-8")
        all_claim_groups.append(extract_claims(html, page))

    claims = merge_claims(all_claim_groups)
    write_claims_csv(claims, output_dir / "claims.csv")
    write_review_html(claims, output_dir / "claims_review.html")
    manifest["notes"] = notes
    manifest["claim_count"] = len(claims)
    (output_dir / "run_manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
