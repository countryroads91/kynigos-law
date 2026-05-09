from __future__ import annotations

import json
import os
from dataclasses import dataclass
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen


@dataclass(frozen=True)
class SearchResult:
    url: str
    title: str = ""
    source_type: str = "practice_or_provider_page"


class SearchProvider:
    def search(self, query: str, max_results: int) -> list[SearchResult]:
        raise NotImplementedError


class BraveSearchProvider(SearchProvider):
    endpoint = "https://api.search.brave.com/res/v1/web/search"

    def __init__(self, api_key: str | None = None) -> None:
        self.api_key = api_key or os.getenv("BRAVE_SEARCH_API_KEY")
        if not self.api_key:
            raise RuntimeError("BRAVE_SEARCH_API_KEY is not set")

    def search(self, query: str, max_results: int) -> list[SearchResult]:
        params = urlencode({"q": query, "count": min(max_results, 20)})
        request = Request(
            f"{self.endpoint}?{params}",
            headers={"Accept": "application/json", "X-Subscription-Token": self.api_key},
        )
        with urlopen(request, timeout=20) as response:
            payload: dict[str, Any] = json.loads(response.read().decode("utf-8"))
        results = payload.get("web", {}).get("results", [])
        return [SearchResult(url=item["url"], title=item.get("title", "")) for item in results if item.get("url")]


def provider_from_config(name: str | None) -> SearchProvider | None:
    if (name or "brave").lower() == "brave":
        try:
            return BraveSearchProvider()
        except RuntimeError:
            return None
    return None


def gather_urls(config: dict[str, Any]) -> tuple[list[SearchResult], list[str]]:
    results: list[SearchResult] = []
    notes: list[str] = []
    for item in config.get("seed_urls", []) or []:
        if isinstance(item, str):
            results.append(SearchResult(url=item))
        elif isinstance(item, dict) and item.get("url"):
            results.append(SearchResult(url=item["url"], source_type=item.get("source_type", "practice_or_provider_page")))

    search_config = config.get("search", {}) or {}
    provider = provider_from_config(search_config.get("provider"))
    queries = search_config.get("queries", []) or []
    max_results = int(search_config.get("max_results_per_query", 10))
    if queries and provider is None:
        notes.append("Search query expansion skipped because no supported search API key was configured.")
    elif provider is not None:
        for query in queries:
            try:
                results.extend(provider.search(query, max_results))
            except Exception as exc:
                notes.append(f"Search failed for {query!r}: {exc}")

    deduped: list[SearchResult] = []
    seen: set[str] = set()
    for result in results:
        if result.url not in seen:
            seen.add(result.url)
            deduped.append(result)
    return deduped, notes
