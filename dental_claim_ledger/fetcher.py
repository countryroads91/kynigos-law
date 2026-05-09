from __future__ import annotations

import hashlib
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from urllib.robotparser import RobotFileParser

from .extractor import page_title
from .models import PageRecord


class RobotsCache:
    def __init__(self, user_agent: str) -> None:
        self.user_agent = user_agent
        self._cache: dict[str, RobotFileParser | None] = {}

    def can_fetch(self, url: str) -> bool:
        parsed = urlparse(url)
        base = f"{parsed.scheme}://{parsed.netloc}"
        if base not in self._cache:
            parser = RobotFileParser()
            parser.set_url(f"{base}/robots.txt")
            try:
                parser.read()
            except Exception:
                self._cache[base] = None
                return False
            self._cache[base] = parser
        parser = self._cache[base]
        return bool(parser and parser.can_fetch(self.user_agent, url))


class PublicPageFetcher:
    def __init__(
        self,
        output_dir: Path,
        user_agent: str,
        timeout_seconds: int = 15,
        delay_seconds: float = 1.0,
        respect_robots_txt: bool = True,
        allowed_schemes: Iterable[str] = ("http", "https"),
    ) -> None:
        self.output_dir = output_dir
        self.raw_dir = output_dir / "raw_html"
        self.raw_dir.mkdir(parents=True, exist_ok=True)
        self.user_agent = user_agent
        self.timeout_seconds = timeout_seconds
        self.delay_seconds = delay_seconds
        self.respect_robots_txt = respect_robots_txt
        self.allowed_schemes = set(allowed_schemes)
        self.robots = RobotsCache(user_agent)

    def fetch(self, url: str, source_type: str = "practice_or_provider_page") -> tuple[PageRecord | None, str | None]:
        parsed = urlparse(url)
        if parsed.scheme not in self.allowed_schemes or not parsed.netloc:
            return None, f"Skipped non-public or unsupported URL scheme: {url}"
        if self.respect_robots_txt and not self.robots.can_fetch(url):
            return None, f"Skipped by robots.txt: {url}"
        time.sleep(self.delay_seconds)
        request = Request(url, headers={"User-Agent": self.user_agent})
        try:
            with urlopen(request, timeout=self.timeout_seconds) as response:
                status = getattr(response, "status", 200)
                content_type = response.headers.get("content-type", "")
                body = response.read()
        except HTTPError as exc:
            return None, f"HTTP {exc.code}: {url}"
        except URLError as exc:
            return None, f"Fetch failed for {url}: {exc}"
        if status >= 400:
            return None, f"HTTP {status}: {url}"
        if "text/html" not in content_type.lower():
            return None, f"Skipped non-HTML content ({content_type}): {url}"
        html = body.decode("utf-8", errors="replace")
        html_hash = hashlib.sha256(html.encode("utf-8", errors="replace")).hexdigest()
        fetched_at = datetime.now(timezone.utc).isoformat()
        raw_path = self.raw_dir / f"{html_hash}.html"
        raw_path.write_text(html, encoding="utf-8")
        page = PageRecord(
            url=url,
            fetched_at=fetched_at,
            title=page_title(html),
            html_hash=html_hash,
            raw_html_path=str(raw_path),
            source_type=source_type,
        )
        return page, None
