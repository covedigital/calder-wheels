# Calder Wheels — OpenCode Visual Correction Prompt

> **Governing contract:** `../calder-visual-inspector.md`  
> **Role:** OpenCode + implementation model  
> **Operation:** Apply validated Visual QA corrections non-destructively

You are applying a Calder Wheels Visual QA correction specification to an existing implementation. Make the **smallest coherent set of code changes** needed to resolve the authoritative correction while preserving known-working functionality and already matching visual elements.

## Runtime Inputs

```text
PROJECT:
Calder Wheels

PAGE:
{page}

PAGE_SLUG:
{page-slug}

STATE:
docs/design/visual-inspector/state/{page-slug}.state.json

BASELINE:
docs/design/visual-inspector/visual-specs/{page-slug}.visual-spec.json

REFERENCE:
docs/design/mockups/approved-mockups/{approved-mockup-filename}

CURRENT_RENDER:
docs/design/visual-inspector/qa/renders/{page-slug}.implementation.v{current-iteration}.png

CORRECTION:
{value-of-latest_correction-from-state-manifest}

WORKING_THEME:
/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels/docs/design/Shopify Themes/Working Theme-via-CLI

NEXT_RENDER:
docs/design/visual-inspector/qa/renders/{page-slug}.implementation.v{next-iteration}.png
```

## Preflight Gate

Before editing:

1. Read `state/{page-slug}.state.json` first.
2. Confirm the state is `REVISION_REQUIRED` or `IMPLEMENTING_CORRECTION`.
3. Use **only** `latest_correction` from the state manifest as the authoritative correction.
4. Confirm the correction JSON passes deterministic validation.
5. Confirm its page, iteration, reference, and implementation filenames match the state manifest and current render.
6. Stop and report `BLOCKED` if the state and artifacts disagree.
7. Never select a correction merely because it has the highest-looking filename.

## Correction Priority

Process actionable corrections in this general order:

```text
1. CRITICAL
2. HIGH
3. MEDIUM
4. LOW
```

Within comparable severity, prefer:

```text
STRUCTURE
GRID / major geometry
POSITION / SIZE
ALIGNMENT
SPACING
TYPOGRAPHY
IMAGERY / CROP / OVERLAY
COLOR / BACKGROUND
BORDER / RADIUS / SHADOW
LOW-level polish
```

Do not spend effort on low-level polish while a material structural or geometry issue remains.

## Required QA-ID Traceability

Every correction item must retain its QA ID through implementation.

For each correction ID, record one status:

```text
APPLIED
PARTIALLY_APPLIED
DEFERRED
BLOCKED
NOT_APPLICABLE
```

For each ID record:

- implementation status;
- files changed;
- concise action taken;
- any dependency;
- reason if not fully applied.

A correction must never silently disappear.

Example:

```text
QA-HOME-001
Status: APPLIED
Files:
- sections/calder-hero.liquid
- assets/calder-home.css
Action:
Adjusted hero grid ratio and product visual scale while preserving existing fitment behavior.
```

## Preservation Rules

Before each edit:

- inspect the current implementation;
- honor the correction item's `preserve` instructions;
- preserve elements already identified as matching;
- avoid touching unrelated components;
- avoid broad refactors for localized defects;
- preserve Shopify settings, Liquid bindings, JS behavior, and functional states unless the correction specifically requires a functional change;
- protect shared/global components from cross-page regressions.

If a requested correction conflicts with known-working Shopify behavior, do not silently break functionality. Mark the correction `DEFERRED` or `BLOCKED`, explain the conflict, and preserve traceability.

## Implementation Rules

- Fix the visual relationship, not merely a screenshot coordinate.
- Prefer CSS layout adjustments over arbitrary absolute positioning.
- Use the smallest coherent patch.
- Do not rewrite the frozen baseline visual spec during routine QA.
- Do not overwrite correction history.
- Do not alter the approved mockup.
- Do not invent new design behavior.
- Do not assume prior corrections are the only possible defects; the next Visual QA pass will inspect the full page again.

## Validation and Render

After corrections:

1. run relevant theme/build validation;
2. verify affected Shopify functionality;
3. inspect shared-component regression risk;
4. render the complete page at the required reference viewport;
5. increment the render iteration;
6. save the next render using the QA naming convention;
7. update the page state only after required gates succeed;
8. return the page to `READY_FOR_VISUAL_QA`.

Do not mark the page `PASS`, `PASS_WITH_MINOR_NOTES`, or `ACCEPTED`; those states depend on the Visual QA/human acceptance workflow.

## Completion Output

Return:

1. correction execution summary;
2. QA-ID traceability table/list;
3. files modified;
4. functionality preserved and tests performed;
5. deferred/blocked corrections with reasons;
6. shared-component regression considerations;
7. next render path;
8. resulting state;
9. readiness for the next full-page Visual QA pass.
