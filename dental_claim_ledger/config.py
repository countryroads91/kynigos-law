from __future__ import annotations

import ast
from pathlib import Path
from typing import Any


def load_search_config(path: Path) -> dict[str, Any]:
    """Load the small YAML subset used by config/search_queries.yml.

    The project avoids mandatory third-party runtime dependencies. This parser supports
    nested mappings, scalar values, inline lists, empty lists, booleans, numbers, and
    hyphen list items used by the bundled reproducible search configuration.
    """
    lines = _clean_lines(path)
    root: dict[str, Any] = {}
    stack: list[tuple[int, Any]] = [(-1, root)]

    for index, (indent, stripped) in enumerate(lines):
        while stack and indent < stack[-1][0]:
            stack.pop()
        parent = stack[-1][1]
        if stripped.startswith("- "):
            if not isinstance(parent, list):
                raise ValueError(f"List item is not under a list in {path}: {stripped}")
            parent.append(parse_scalar(stripped[2:].strip()))
            continue

        key, separator, value_text = stripped.partition(":")
        if not separator:
            raise ValueError(f"Expected key/value line in {path}: {stripped}")
        if not isinstance(parent, dict):
            raise ValueError(f"Cannot assign mapping key {key!r} under a list in {path}")
        key = key.strip()
        value_text = value_text.strip()
        if value_text:
            parent[key] = parse_scalar(value_text)
            continue

        next_indent, next_stripped = lines[index + 1] if index + 1 < len(lines) else (indent + 2, "")
        value: Any = [] if next_indent > indent and next_stripped.startswith("- ") else {}
        parent[key] = value
        stack.append((indent + 2, value))
    return root


def _clean_lines(path: Path) -> list[tuple[int, str]]:
    cleaned: list[tuple[int, str]] = []
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = _strip_comment(raw_line).rstrip()
        if not line.strip():
            continue
        cleaned.append((len(line) - len(line.lstrip(" ")), line.strip()))
    return cleaned


def _strip_comment(line: str) -> str:
    quote: str | None = None
    escaped = False
    for index, char in enumerate(line):
        if escaped:
            escaped = False
            continue
        if char == "\\":
            escaped = True
            continue
        if char in {"'", '"'}:
            quote = None if quote == char else char if quote is None else quote
            continue
        if char == "#" and quote is None:
            return line[:index]
    return line


def parse_scalar(value: str) -> Any:
    if value in {"[]", "{}"}:
        return [] if value == "[]" else {}
    if value.lower() in {"true", "false"}:
        return value.lower() == "true"
    try:
        return ast.literal_eval(value)
    except Exception:
        pass
    try:
        if "." in value:
            return float(value)
        return int(value)
    except ValueError:
        return value.strip('"\'')
