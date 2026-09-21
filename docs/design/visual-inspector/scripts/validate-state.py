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


def resolve_project_path(project_root: Path, value: str | None) -> Path | None:
    if value is None:
        return None
    p = Path(value).expanduser()
    return p if p.is_absolute() else project_root / p


def require_file(project_root: Path, value: str | None, label: str, errors: list[str]) -> None:
    if not value:
        errors.append(f"STATE: {label} must be populated in this state")
        return
    path = resolve_project_path(project_root, value)
    if path is None or not path.is_file():
        errors.append(f"STATE: {label} points to missing file: {value}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate a Calder Visual Inspector state manifest.")
    parser.add_argument("artifact", type=Path, help="Path to {page}.state.json")
    parser.add_argument("--schema", type=Path, default=Path(__file__).resolve().parent.parent / "schemas" / "calder-visual-state.schema.json")
    parser.add_argument("--project-root", type=Path, default=Path.cwd(), help="Project root used to resolve project-relative paths")
    args = parser.parse_args()

    errors: list[str] = []
    try:
        state = load_json(args.artifact)
        schema = load_json(args.schema)
    except ValueError as exc:
        print(f"FAIL: {exc}", file=sys.stderr)
        return 1

    errors.extend(f"SCHEMA: {e}" for e in schema_errors(state, schema))

    page = state.get("page")
    status = state.get("status")
    iteration = state.get("current_iteration", 0)
    current_render = state.get("current_render")
    latest_correction = state.get("latest_correction")
    accepted_render = state.get("accepted_render")

    expected_name = f"{page}.state.json" if page else None
    if expected_name and args.artifact.name != expected_name:
        errors.append(f"WORKFLOW: state filename '{args.artifact.name}' must be '{expected_name}'")

    # Reference always exists for a usable page state.
    require_file(args.project_root, state.get("reference"), "reference", errors)

    baseline_required = status not in {"NOT_INSPECTED"}
    render_required = status in {
        "READY_FOR_VISUAL_QA", "REVISION_REQUIRED", "IMPLEMENTING_CORRECTION",
        "PASS_WITH_MINOR_NOTES", "PASS", "ACCEPTED"
    }
    correction_required = status in {"REVISION_REQUIRED", "IMPLEMENTING_CORRECTION"}
    accepted_required = status == "ACCEPTED"

    if baseline_required:
        require_file(args.project_root, state.get("baseline"), "baseline", errors)
    if render_required:
        require_file(args.project_root, current_render, "current_render", errors)
    if correction_required:
        require_file(args.project_root, latest_correction, "latest_correction", errors)
    if accepted_required:
        require_file(args.project_root, accepted_render, "accepted_render", errors)

    if status != "ACCEPTED" and accepted_render is not None:
        errors.append("WORKFLOW: accepted_render must remain null until status=ACCEPTED")

    if current_render:
        m = re.fullmatch(rf"{re.escape(str(page))}\.implementation\.v(\d+)\.png", Path(current_render).name)
        if not m:
            errors.append(f"WORKFLOW: current_render filename must follow {page}.implementation.v{{iteration}}.png")
        elif int(m.group(1)) != iteration:
            errors.append(
                f"WORKFLOW: current_iteration={iteration} disagrees with current_render iteration v{m.group(1)}"
            )
    elif iteration > 0 and render_required:
        errors.append("WORKFLOW: current_iteration > 0 but current_render is null")

    if latest_correction:
        m = re.fullmatch(rf"{re.escape(str(page))}\.correction\.v(\d+)\.json", Path(latest_correction).name)
        if not m:
            errors.append(f"WORKFLOW: latest_correction filename must follow {page}.correction.v{{iteration}}.json")
        else:
            correction_iteration = int(m.group(1))
            if correction_iteration > iteration:
                errors.append(
                    f"WORKFLOW: latest_correction v{correction_iteration} cannot be newer than current_iteration v{iteration}"
                )
            # A correction normally evaluates the current render. After a patch, state may
            # legitimately carry the prior correction while current_iteration increments.
            if correction_iteration < max(1, iteration - 1):
                errors.append(
                    f"WORKFLOW: latest_correction v{correction_iteration} appears superseded for current_iteration v{iteration}"
                )

    if accepted_render:
        expected = f"{page}.implementation.accepted.png"
        if Path(accepted_render).name != expected:
            errors.append(f"WORKFLOW: accepted_render filename must be '{expected}'")

    if errors:
        print(f"FAIL: {args.artifact}")
        for error in errors:
            print(f"  - {error}")
        return 1

    print(f"PASS: {args.artifact}")
    print(f"  page: {page}")
    print(f"  status: {status}")
    print(f"  current_iteration: {iteration}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
