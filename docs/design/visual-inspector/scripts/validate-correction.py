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

SEVERITIES = {"CRITICAL", "HIGH", "MEDIUM", "LOW", "INFORMATIONAL"}
CATEGORIES = {
    "STRUCTURE","POSITION","SIZE","SPACING","ALIGNMENT","TYPOGRAPHY","COLOR",
    "BACKGROUND","BORDER","RADIUS","SHADOW","IMAGERY","CROP","OVERLAY","GRID",
    "RESPONSIVE","CONTENT","FUNCTIONAL_VISUAL_STATE","OTHER"
}


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


def same_file(a: str | None, b: str | None) -> bool:
    if not a or not b:
        return a == b
    return a == b or Path(a).name == Path(b).name


def validate_bbox(box: Any, normalized: bool, label: str, errors: list[str]) -> None:
    if box is None:
        return
    if not isinstance(box, list) or len(box) != 4 or not all(isinstance(v, (int, float)) and not isinstance(v, bool) for v in box):
        errors.append(f"{label}: bounding box must contain exactly four numeric values")
        return
    x1, y1, x2, y2 = box
    if x2 < x1:
        errors.append(f"{label}: x2 must be >= x1")
    if y2 < y1:
        errors.append(f"{label}: y2 must be >= y1")
    if normalized and any(v < 0 or v > 1 for v in box):
        errors.append(f"{label}: normalized coordinates must be within 0.0-1.0")


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate a Calder visual correction.")
    parser.add_argument("artifact", type=Path, help="Path to {page}.correction.vN.json")
    parser.add_argument("--schema", type=Path, default=Path(__file__).resolve().parent.parent / "schemas" / "calder-visual-correction.schema.json")
    parser.add_argument("--state", type=Path, help="Authoritative {page}.state.json")
    parser.add_argument("--iteration", type=int, help="Expected QA iteration")
    args = parser.parse_args()

    errors: list[str] = []
    try:
        artifact = load_json(args.artifact)
        schema = load_json(args.schema)
        state = load_json(args.state) if args.state else None
    except ValueError as exc:
        print(f"FAIL: {exc}", file=sys.stderr)
        return 1

    errors.extend(f"SCHEMA: {e}" for e in schema_errors(artifact, schema))

    m = re.fullmatch(r"(.+)\.correction\.v(\d+)\.json", args.artifact.name)
    if not m:
        errors.append("WORKFLOW: filename must follow {page}.correction.v{iteration}.json")
        file_page = None
        file_iteration = None
    else:
        file_page, file_iteration = m.group(1), int(m.group(2))

    page = artifact.get("page")
    iteration = artifact.get("iteration")
    if file_page and page != file_page:
        errors.append(f"WORKFLOW: artifact page '{page}' does not match filename page '{file_page}'")
    if file_iteration is not None and iteration != file_iteration:
        errors.append(f"WORKFLOW: artifact iteration {iteration} does not match filename iteration {file_iteration}")
    if args.iteration is not None and iteration != args.iteration:
        errors.append(f"WORKFLOW: artifact iteration {iteration} does not match expected iteration {args.iteration}")

    differences = artifact.get("differences", [])
    ids = [d.get("id") for d in differences if isinstance(d, dict)]
    duplicates = sorted({x for x in ids if x is not None and ids.count(x) > 1})
    if duplicates:
        errors.append(f"WORKFLOW: duplicate correction IDs: {', '.join(duplicates)}")

    for i, d in enumerate(differences):
        if d.get("severity") not in SEVERITIES:
            errors.append(f"$.differences[{i}].severity: invalid severity '{d.get('severity')}'")
        if d.get("category") not in CATEGORIES:
            errors.append(f"$.differences[{i}].category: invalid category '{d.get('category')}'")
        confidence = d.get("confidence")
        if not isinstance(confidence, (int, float)) or isinstance(confidence, bool) or not 0 <= confidence <= 1:
            errors.append(f"$.differences[{i}].confidence: must be between 0.0 and 1.0")
        for key in ("reference_bbox_px", "implementation_bbox_px"):
            if key in d:
                validate_bbox(d[key], False, f"$.differences[{i}].{key}", errors)
        for key in ("reference_bbox_normalized", "implementation_bbox_normalized"):
            if key in d:
                validate_bbox(d[key], True, f"$.differences[{i}].{key}", errors)

    severities = {d.get("severity") for d in differences if isinstance(d, dict)}
    final_status = artifact.get("final_status")
    structural_pass = artifact.get("structural_pass")
    visual_pass = artifact.get("visual_pass")

    if final_status == "PASS":
        if {"CRITICAL", "HIGH"} & severities:
            errors.append("WORKFLOW: PASS cannot coexist with CRITICAL or HIGH differences")
        if "MEDIUM" in severities:
            errors.append("WORKFLOW: PASS cannot coexist with MEDIUM differences; resolve or reclassify them")
        if structural_pass is not True or visual_pass is not True:
            errors.append("WORKFLOW: PASS requires structural_pass=true and visual_pass=true")
    elif final_status == "PASS_WITH_MINOR_NOTES":
        if {"CRITICAL", "HIGH", "MEDIUM"} & severities:
            errors.append("WORKFLOW: PASS_WITH_MINOR_NOTES may contain only LOW/INFORMATIONAL differences")
        if structural_pass is not True:
            errors.append("WORKFLOW: PASS_WITH_MINOR_NOTES requires structural_pass=true")
    elif final_status == "REVISION_REQUIRED":
        if not ({"CRITICAL", "HIGH", "MEDIUM"} & severities) and structural_pass is True:
            errors.append("WORKFLOW: REVISION_REQUIRED should have a material difference or structural_pass=false")
    elif final_status == "BLOCKED":
        if not artifact.get("blocked_by"):
            errors.append("WORKFLOW: BLOCKED requires at least one blocked_by entry")

    if state is not None:
        if state.get("page") != page:
            errors.append(f"STATE: correction page '{page}' does not match state page '{state.get('page')}'")
        ref_file = artifact.get("reference", {}).get("file")
        impl_file = artifact.get("implementation", {}).get("file")
        if not same_file(ref_file, state.get("reference")):
            errors.append(f"STATE: correction reference '{ref_file}' does not match state reference '{state.get('reference')}'")
        if not same_file(impl_file, state.get("current_render")):
            errors.append(f"STATE: correction implementation '{impl_file}' does not match state current_render '{state.get('current_render')}'")
        if iteration != state.get("current_iteration"):
            errors.append(f"STATE: correction iteration {iteration} does not match state current_iteration {state.get('current_iteration')}")

    if errors:
        print(f"FAIL: {args.artifact}")
        for error in errors:
            print(f"  - {error}")
        return 1

    print(f"PASS: {args.artifact}")
    print(f"  page: {page}")
    print(f"  iteration: {iteration}")
    print(f"  final_status: {final_status}")
    print(f"  differences: {len(differences)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
