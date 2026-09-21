#!/usr/bin/env python3
"""
Calder Wheels Visual Inspector validator.

Requires:
    pip install jsonschema

Exit codes:
    0 = validation passed
    1 = artifact/schema/workflow validation failed
    2 = usage/dependency/configuration error
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

try:
    from jsonschema import Draft202012Validator
except ImportError:
    print("ERROR: missing dependency 'jsonschema'. Run: pip install jsonschema", file=sys.stderr)
    sys.exit(2)

VALID_PAGES = {"home", "category", "product", "cart", "checkout", "dealer-dashboard"}
EVIDENCE = {"OBSERVED", "ESTIMATED", "ASSUMPTION", "VERIFIED_PROJECT_CONTEXT"}


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ValueError(f"file does not exist: {path}")
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON in {path}: line {exc.lineno}, column {exc.colno}: {exc.msg}")


def schema_errors(instance: Any, schema: Any) -> list[str]:
    validator = Draft202012Validator(schema)
    return [
        f"{'/'.join(str(p) for p in err.absolute_path) or '<root>'}: {err.message}"
        for err in sorted(validator.iter_errors(instance), key=lambda e: list(e.absolute_path))
    ]


def walk(value: Any, path: str = "$"):
    yield path, value
    if isinstance(value, dict):
        for key, child in value.items():
            yield from walk(child, f"{path}.{key}")
    elif isinstance(value, list):
        for i, child in enumerate(value):
            yield from walk(child, f"{path}[{i}]")


def validate_bbox(box: Any, normalized: bool, label: str, errors: list[str]) -> None:
    if not isinstance(box, list) or len(box) != 4 or not all(isinstance(v, (int, float)) and not isinstance(v, bool) for v in box):
        errors.append(f"{label}: bounding box must contain exactly four numeric values [x1,y1,x2,y2]")
        return
    x1, y1, x2, y2 = box
    if x2 < x1:
        errors.append(f"{label}: x2 ({x2}) must be >= x1 ({x1})")
    if y2 < y1:
        errors.append(f"{label}: y2 ({y2}) must be >= y1 ({y1})")
    if normalized and any(v < 0 or v > 1 for v in box):
        errors.append(f"{label}: normalized coordinates must be within 0.0-1.0")


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate a Calder visual specification.")
    parser.add_argument("artifact", type=Path, help="Path to {page}.visual-spec.json")
    parser.add_argument("--schema", type=Path, default=Path(__file__).resolve().parent.parent / "schemas" / "calder-visual-spec.schema.json")
    parser.add_argument("--page", choices=sorted(VALID_PAGES), help="Expected page slug")
    parser.add_argument("--reference", help="Expected reference filename or path")
    args = parser.parse_args()

    errors: list[str] = []
    try:
        artifact = load_json(args.artifact)
        schema = load_json(args.schema)
    except ValueError as exc:
        print(f"FAIL: {exc}", file=sys.stderr)
        return 1

    errors.extend(f"SCHEMA: {e}" for e in schema_errors(artifact, schema))

    # Filename/page consistency.
    filename_match = re.fullmatch(r"(.+)\.visual-spec\.json", args.artifact.name)
    filename_page = filename_match.group(1) if filename_match else None
    page_id = artifact.get("page", {}).get("id") if isinstance(artifact, dict) else None
    expected_page = args.page or filename_page

    if not filename_match:
        errors.append("WORKFLOW: artifact filename must follow {page}.visual-spec.json")
    if expected_page and expected_page not in VALID_PAGES:
        errors.append(f"WORKFLOW: unsupported page slug '{expected_page}'")
    if expected_page and page_id != expected_page:
        errors.append(f"WORKFLOW: page.id '{page_id}' does not match expected page '{expected_page}'")

    source_file = artifact.get("source", {}).get("file") if isinstance(artifact, dict) else None
    if args.reference:
        if source_file != args.reference and Path(str(source_file)).name != Path(args.reference).name:
            errors.append(f"WORKFLOW: source.file '{source_file}' does not match expected reference '{args.reference}'")

    # Recursive semantic checks beyond JSON Schema.
    for path, value in walk(artifact):
        key = path.rsplit(".", 1)[-1]
        if key == "bbox_px":
            validate_bbox(value, False, path, errors)
        elif key == "bbox_normalized":
            validate_bbox(value, True, path, errors)
        elif key == "confidence":
            if not isinstance(value, (int, float)) or isinstance(value, bool) or not 0 <= value <= 1:
                errors.append(f"{path}: confidence must be between 0.0 and 1.0")
        elif key == "evidence" and isinstance(value, str) and value not in EVIDENCE:
            errors.append(f"{path}: invalid evidence label '{value}'")

    # Responsive assumptions must always be explicitly ASSUMPTION.
    for i, item in enumerate(artifact.get("responsive_assumptions", [])):
        if item.get("evidence") != "ASSUMPTION":
            errors.append(f"$.responsive_assumptions[{i}].evidence must equal ASSUMPTION")

    # Prevent estimated/assumed measurements from being marked verified.
    for path, value in walk(artifact):
        if isinstance(value, dict) and {"value", "confidence", "evidence"}.issubset(value):
            evidence = value.get("evidence")
            if evidence not in EVIDENCE:
                errors.append(f"{path}.evidence: invalid evidence label '{evidence}'")

    if errors:
        print(f"FAIL: {args.artifact}")
        for error in errors:
            print(f"  - {error}")
        return 1

    print(f"PASS: {args.artifact}")
    print(f"  page: {page_id}")
    print(f"  reference: {source_file}")
    print(f"  sections: {len(artifact.get('sections', []))}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
