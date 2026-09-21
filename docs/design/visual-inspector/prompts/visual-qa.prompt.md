# Calder Wheels — Visual QA Runtime Prompt

> **Governing contract:** `../calder-visual-inspector.md`  
> **Role:** Runtime task prompt for GPT-5.6 Sol Visual QA  
> **Operation:** `VISUAL_QA`

Use `calder-visual-inspector.md` as the governing contract. Apply its Visual QA rules, correction schema, severity model, confidence rules, pass/fail criteria, neutral handoff requirements, and correction-history rules.

## Task

Independently compare the approved Calder reference against the current Shopify implementation render for the target page.

This is a **full-page QA pass**, not a review limited to previously reported defects. Prior correction artifacts provide history and verification targets only. They must not narrow inspection scope.

## Runtime Inputs

```text
TASK:
VISUAL_QA

PROJECT:
Calder Wheels

PAGE:
{page}

PAGE_SLUG:
{page-slug}

ITERATION:
{iteration}

REFERENCE:
docs/design/mockups/approved-mockups/{approved-mockup-filename}

IMPLEMENTATION:
docs/design/visual-inspector/qa/renders/{page-slug}.implementation.v{iteration}.png

BASELINE:
docs/design/visual-inspector/visual-specs/{page-slug}.visual-spec.json

PRIOR_CORRECTION:
{prior-correction-path-or-NONE}

STATE:
docs/design/visual-inspector/state/{page-slug}.state.json

SCHEMA:
docs/design/visual-inspector/schemas/calder-visual-correction.schema.json

OUTPUT_JSON:
docs/design/visual-inspector/qa/corrections/{page-slug}.correction.v{iteration}.json

OUTPUT_MARKDOWN:
docs/design/visual-inspector/qa/corrections/{page-slug}.correction.v{iteration}.md
```

## Required Comparison

Evaluate the complete page for:

- structure and section order;
- section boundaries;
- content widths and gutters;
- major geometry and column ratios;
- position, scale, alignment, and spacing;
- typography hierarchy, wrapping, scale, weight, case, and line height;
- buttons, controls, cards, navigation, borders, radii, shadows, and visual states;
- colors, backgrounds, overlays, and gradients;
- imagery, aspect ratio, prominence, crop, fit, and object position;
- shared/global component fidelity;
- page-specific component fidelity;
- important cross-component visual relationships;
- visible functional states that materially affect design fidelity.

When viewport dimensions differ, prioritize normalized coordinates and visual relationships.

## Difference Classification

Every actionable issue must use one category from the governing correction schema:

```text
STRUCTURE
POSITION
SIZE
SPACING
ALIGNMENT
TYPOGRAPHY
COLOR
BACKGROUND
BORDER
RADIUS
SHADOW
IMAGERY
CROP
OVERLAY
GRID
RESPONSIVE
CONTENT
FUNCTIONAL_VISUAL_STATE
OTHER
```

Use severity:

```text
CRITICAL
HIGH
MEDIUM
LOW
INFORMATIONAL
```

Each actionable correction must state:

- stable QA correction ID;
- component;
- category;
- severity;
- reference state;
- implementation state;
- estimated delta where useful;
- desired visual relationship;
- targeted correction;
- what must be preserved;
- confidence.

Prefer relationship-oriented corrections over vague or destructive instructions.

## Prior-Correction Verification

If a prior correction exists, explicitly determine:

1. whether each prior material correction was resolved;
2. whether a correction introduced a regression;
3. whether previously unreported material differences remain;
4. whether shared/global components still match the approved visual system.

Do not assume a prior correction was successfully implemented merely because a new render exists.

## Pass / Fail Rules

Allowed final statuses:

```text
PASS
PASS_WITH_MINOR_NOTES
REVISION_REQUIRED
BLOCKED
```

Apply the exact governing criteria.

In particular:

- `PASS` cannot contain CRITICAL, HIGH, unresolved structural, or materially actionable MEDIUM issues.
- `PASS_WITH_MINOR_NOTES` may contain only LOW or INFORMATIONAL items.
- `REVISION_REQUIRED` applies when actionable MEDIUM/HIGH/CRITICAL differences remain or structural pass is false.
- `BLOCKED` applies when required evidence is missing or reliable comparison cannot be completed.

Do not fail a page for trivial anti-aliasing, browser rasterization, or subpixel differences.

## Restrictions

- Do not redesign the reference.
- Do not write implementation code.
- Do not recommend broad refactors when a targeted correction is sufficient.
- Do not recommend replacing working functionality solely to resolve styling.
- Do not over-correct already matching components.
- Do not let prior QA comments bias the full-page inspection.
- Do not add unrelated conversational commentary.

## Output Contract

Return exactly:

1. `{page-slug}.correction.v{iteration}.json` conforming to `calder-visual-correction.schema.json`.
2. `{page-slug}.correction.v{iteration}.md` conforming to the correction Markdown template.

The correction JSON must pass deterministic validation before OpenCode consumes it. The page state must identify this correction as `latest_correction` before it becomes authoritative for the next implementation iteration.
