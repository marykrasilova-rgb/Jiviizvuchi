#!/usr/bin/env python3
"""Idempotently attach the shared language control to every authored page."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INCLUDE = '<script src="/site-translations.js"></script><script src="/site-language.js"></script>'


def main() -> None:
    changed = []
    for path in ROOT.rglob("*.html"):
        if any(part in {".git", "node_modules", "native-placeholder"} for part in path.parts):
            continue
        source = path.read_text(encoding="utf-8")
        if "/site-language.js" in source:
            continue
        if "</body>" not in source.lower():
            raise RuntimeError(f"No closing body tag in {path.relative_to(ROOT)}")
        lower = source.lower()
        index = lower.rfind("</body>")
        updated = source[:index] + INCLUDE + source[index:]
        path.write_text(updated, encoding="utf-8")
        changed.append(str(path.relative_to(ROOT)))
    print(f"Language control attached to {len(changed)} pages")


if __name__ == "__main__":
    main()
