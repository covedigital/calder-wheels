# Calder Wheels — OpenCode Initial Implementation Prompt

> **Governing contract:** `../calder-visual-inspector.md`  
> **Role:** OpenCode + implementation model  
> **Operation:** Baseline design-to-code implementation inside the existing working Shopify theme

You are implementing an approved Calder Wheels page inside an **existing working Shopify theme**. The objective is high visual fidelity without undoing, overwriting, or breaking known-working functionality.

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

REFERENCE:
docs/design/mockups/approved-mockups/{approved-mockup-filename}

VISUAL_SPEC_JSON:
docs/design/visual-inspector/visual-specs/{page-slug}.visual-spec.json

VISUAL_SPEC_MARKDOWN:
docs/design/visual-inspector/visual-specs/{page-slug}.visual-spec.md

CROSS_PAGE_ASSESSMENT:
docs/design/calder-wheels-approved-mockup-layout-component-assessment.md

WORKING_THEME:
/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels/docs/design/Shopify Themes/Working Theme-via-CLI

WS1_GUIDANCE:
{path-to-ws1-activation-guide.md}

BRAND_ASSETS:
/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels/brand/assets/

TARGET_RENDER:
docs/design/visual-inspector/qa/renders/{page-slug}.implementation.v{iteration}.png
```

## Preflight Gate

Before editing:

1. Read `state/{page-slug}.state.json` first.
2. Confirm the state is `READY_FOR_IMPLEMENTATION` or `IMPLEMENTING`.
3. Confirm the state points to the expected baseline.
4. Confirm the visual-spec JSON passes deterministic validation.
5. Stop and report `BLOCKED` if required authoritative artifacts are missing, invalid, stale, or inconsistent with state.
6. Do not choose generated artifacts by filename guessing; use the state manifest as orchestration authority.

## Source Priority

Use:

1. approved Calder mockup;
2. approved Calder brand assets;
3. accepted Calder visual specification;
4. existing working Shopify theme;
5. existing project documentation;
6. implementation inference.

If the screenshot and visual spec materially disagree, the approved screenshot remains the ultimate visual authority. Document the discrepancy rather than silently rewriting the baseline.

## Mandatory Theme Audit

Before implementation, inspect the current working theme and map every required section/component to the existing codebase.

For each requirement classify the action:

```text
REUSE
RESTYLE
EXTEND
CREATE
```

Produce a component mapping before edits, for example:

```text
REQUIREMENT          EXISTING COMPONENT          ACTION
---------------------------------------------------------
global-header        sections/...                RESTYLE
fitment-selector     snippets/...                REUSE
hero                 sections/...                EXTEND
editorial-section    none                        CREATE
```

For each existing candidate, inspect relevant:

- Liquid files;
- section/block schema;
- snippets;
- settings;
- data bindings;
- CSS;
- JavaScript;
- dependencies;
- Shopify behavior.

Do not create a replacement until reuse/restyle/extension has been evaluated.

## Non-Destructive Rules

- Preserve known-working Shopify functionality and data bindings where practical.
- Preserve prior working progress.
- Do not perform unrelated refactors.
- Do not overwrite components merely because their current styling differs.
- Do not remove or bypass existing functional behavior without a documented requirement.
- Prefer the smallest coherent implementation change that satisfies the approved design.
- Treat shared/global components as regression-sensitive.

## Implementation Procedure

1. Read the validated JSON visual spec.
2. Read the Markdown visual spec.
3. Read the cross-page component assessment.
4. Read WS1/implementation guidance.
5. Audit the current theme.
6. Produce the REUSE / RESTYLE / EXTEND / CREATE mapping.
7. Identify files expected to change.
8. Implement incrementally.
9. Preserve visual relationships before chasing isolated pixel values.
10. Use appropriate CSS systems: max-width containers, Grid, Flexbox, fluid sizing, `aspect-ratio`, `clamp()`, media queries, and object positioning.
11. Do not translate screenshot bounding boxes into blanket absolute positioning.
12. Treat responsive assumptions as hypotheses, not approved responsive designs.
13. Run relevant Shopify/theme/build validation.
14. Verify known functionality.
15. Render at the approved reference viewport.
16. Save the render using the required QA naming convention.
17. Update workflow state only after required validation gates succeed.
18. Submit the render for independent Visual QA.

## Shared Component Protection

If implementation changes a shared/global component:

- identify other pages that use it;
- assess regression risk;
- avoid page-specific hacks that damage shared behavior;
- rerender/revalidate already accepted pages when a material shared change can affect them.

## Completion Output

Return an implementation handoff containing:

1. implementation summary;
2. pre-edit component mapping;
3. files modified;
4. components `REUSE` / `RESTYLE` / `EXTEND` / `CREATE`;
5. functionality preserved;
6. validations/tests performed;
7. unresolved questions or blockers;
8. render screenshot path;
9. resulting workflow state;
10. readiness for Visual QA.

Do **not** declare the page visually accepted. Visual acceptance belongs to the Calder Visual QA stage.
