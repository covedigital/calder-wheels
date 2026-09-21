# Calder Wheels — Initial Visual Inspection Runtime Prompt

> **Governing contract:** `../calder-visual-inspector.md`  
> **Role:** Runtime task prompt for GPT-5.6 Sol  
> **Operation:** `INITIAL_VISUAL_INSPECTION`

Use `calder-visual-inspector.md` as the governing contract for this task. Its production Visual Inspector system prompt, strict JSON schema, confidence rules, evidence labels, preservation rules, folder conventions, validation gates, and output requirements remain authoritative.

## Task

Perform the initial visual inspection for the specified Calder Wheels page.

Analyze the supplied approved mockup as an engineering/design-to-code artifact, not as a conversational screenshot description. If the other approved Calder mockups are available in the same context, use them only for cross-page visual context, shared-component detection, and consistency. Do **not** average page-specific measurements across pages when the target page can be inspected directly.

## Runtime Inputs

```text
TASK:
INITIAL_VISUAL_INSPECTION

PROJECT:
Calder Wheels

PAGE:
{page}

PAGE_SLUG:
{page-slug}

REFERENCE:
docs/design/mockups/approved-mockups/{approved-mockup-filename}

CROSS_PAGE_CONTEXT:
docs/design/calder-wheels-approved-mockup-layout-component-assessment.md

SCHEMA:
docs/design/visual-inspector/schemas/calder-visual-spec.schema.json

OUTPUT_JSON:
docs/design/visual-inspector/visual-specs/{page-slug}.visual-spec.json

OUTPUT_MARKDOWN:
docs/design/visual-inspector/visual-specs/{page-slug}.visual-spec.md
```

Valid page slugs:

```text
home
category
product
cart
checkout
dealer-dashboard
```

## Required Inspection Behavior

Inspect the target page for:

- top-to-bottom page and section hierarchy;
- section boundaries and approximate dimensions;
- content max-width and desktop gutters;
- vertical spacing and section padding;
- grid structure, column ratios, alignment, and gaps;
- significant component dimensions and spatial relationships;
- pixel and normalized bounding boxes using `[x1, y1, x2, y2]`;
- typography hierarchy, estimated scale, weight, line height, case, alignment, and color;
- buttons, inputs, selectors, cards, navigation, borders, radii, shadows, and states;
- backgrounds, colors, overlays, gradients, and separators;
- image aspect ratios, crop behavior, fit behavior, focal points, and visual prominence;
- GLOBAL, SHARED, and PAGE_SPECIFIC component classification;
- responsive behavior only as explicitly labeled `ASSUMPTION`;
- uncertainties that cannot be reliably resolved from the supplied evidence.

Use ranges and tolerances instead of false precision. Every significant estimate must use the confidence and evidence conventions defined by the governing contract.

## Design Authority

When evidence conflicts, apply this priority:

1. client-approved Calder mockup;
2. approved Calder brand assets;
3. existing working Shopify theme;
4. existing functional components/project documentation;
5. visual inference.

The target approved mockup is authoritative for this page's visual presentation.

## Restrictions

- Do not implement code.
- Do not alter Shopify files.
- Do not redesign, improve, simplify, or reinterpret the approved design.
- Do not invent exact design tokens from screenshot estimates.
- Do not present responsive inference as observed fact.
- Do not replace unknown values with fabricated values.
- Do not let cross-page observations override direct target-page evidence.
- Do not add conversational commentary before or after the required artifacts.

## Output Contract

Return exactly two synchronized artifacts:

1. `{page-slug}.visual-spec.json` — strict JSON conforming to `calder-visual-spec.schema.json`.
2. `{page-slug}.visual-spec.md` — human-readable inspection report conforming to the governing Markdown template.

The JSON is the primary machine contract. The Markdown must communicate the same findings without contradiction.

After generation, the artifacts must pass deterministic validation before the page can advance from `SPEC_CREATED` toward `SPEC_REVIEWED` and `READY_FOR_IMPLEMENTATION`.
