# Dental Claim Ledger

A Python project for harvesting **public** dental advertising credential claims for Washington, DC dentists and practices. It extracts and classifies claim language; it does **not** determine fraud or make accusations.

## What it captures

For each fetched public page, the tool stores:

- raw HTML under `output/raw_html/`
- retrieval timestamp
- URL
- page title
- SHA-256 hash of the HTML
- exact claim text snippets and source URL in `output/claims.csv`
- a phone-readable review page at `output/claims_review.html`

Neutral review labels are used: `claim found`, `verification needed`, `ambiguous`, and `not board-certification claim`.

## Configure searches

Edit `config/search_queries.yml`. The default config includes Washington, DC dental credential searches plus optional seed URLs.

Search is intentionally API-backed rather than scraping search result pages. Set a supported API key to resolve queries:

```bash
export BRAVE_SEARCH_API_KEY=...
```

If no search API key is available, the harvester still processes `seed_urls` from the config and writes a run manifest explaining that query expansion was skipped.

## Run

```bash
python -m dental_claim_ledger.cli --config config/search_queries.yml --output output
```

Useful options:

```bash
python -m dental_claim_ledger.cli --dry-run
python -m dental_claim_ledger.cli --max-urls 25
```

## Test

```bash
pytest
```

## Scope and limitations

- Fetches only `http` and `https` public webpages.
- Checks `robots.txt` before fetching a URL.
- Does not bypass authentication, paywalls, CAPTCHAs, or technical access controls.
- Does not verify credentials; it only preserves and classifies public claims for later human review.
- Avoid using this output as a fraud determination. Use it as a neutral review ledger.
