# Calder Visual Inspector

## Production Specification & Model-to-Model Contract

**Project:** Calder Wheels\
**Artifact:** `calder-visual-inspector.md`\
**Version:** 1.1\
**Primary purpose:** Define the repeatable, stateful, and validation-gated contract between the
vision-capable visual inspector (GPT-5.6 Sol) and the implementation
agent (OpenCode + DeepSeek v4 Flash) during Calder Wheels design-to-code
implementation.

------------------------------------------------------------------------

## 1. Purpose

The Calder Visual Inspector converts approved Calder Wheels mockup
screenshots into structured, implementation-oriented visual
specifications.

It is not a general screenshot description system.

Its job is to provide the implementation agent with enough explicit
visual, spatial, typographic, component, and responsive information to
reproduce an approved design inside the existing working Shopify theme
**without unnecessarily replacing, overwriting, or breaking existing
functionality**.

The pipeline has two distinct visual-model stages:

1.  **Initial Visual Inspection** --- approved mockup → visual
    specification.
2.  **Visual QA** --- approved mockup + implemented browser render →
    correction specification.

For the initial inspection, GPT-5.6 Sol may be used manually through the
web-based ChatGPT interface. The resulting `.json` and `.md` artifacts
are then placed into the project handoff directories for OpenCode.

------------------------------------------------------------------------

## 2. Model Responsibilities

### GPT-5.6 Sol --- Visual Inspector

GPT-5.6 Sol is the visual reasoning layer.

Responsibilities:

-   inspect approved mockups;
-   identify page and section structure;
-   estimate geometry and spacing;
-   identify visual hierarchy;
-   estimate typography;
-   identify colors and treatments;
-   inspect imagery and crop behavior;
-   identify shared and page-specific components;
-   infer responsive behavior while clearly labeling assumptions;
-   produce normalized spatial measurements;
-   assign confidence to estimates;
-   generate machine-readable JSON;
-   generate human-readable Markdown;
-   during QA, compare reference and implementation screenshots;
-   issue targeted visual corrections.

GPT-5.6 Sol does **not** own Shopify implementation decisions.

### OpenCode + DeepSeek v4 Flash --- Implementation Agent

The implementation agent owns codebase analysis and implementation.

Responsibilities:

-   inspect the existing working Shopify theme;
-   review existing components before creating replacements;
-   preserve known-working Shopify functionality;
-   map visual-spec components to existing Liquid/CSS/JS/theme
    architecture;
-   implement the approved design non-destructively;
-   render the implementation;
-   provide screenshots for visual QA;
-   apply correction specifications;
-   avoid unrelated refactors.

### Separation of Concerns

**Sol = visual interpretation and visual QA.**

**DeepSeek = codebase reasoning and implementation.**

**OpenCode = orchestration/workbench.**

**Shopify theme/browser = implementation runtime and render source.**

------------------------------------------------------------------------

## 3. Calder Design Authority

When sources disagree, use this priority:

1.  **Client-approved Calder mockups**
2.  **Approved Calder brand assets**
3.  **Existing working Shopify theme**
4.  **Existing functional components and project documentation**
5.  **Visual Inspector inference**

A lower-priority assumption must never override clear evidence from a
higher-priority source.

The approved mockups are authoritative for visual appearance.

The working theme remains authoritative for known-working functionality
unless the project explicitly requires a functional change.

------------------------------------------------------------------------

## 4. Non-Destructive Implementation Principle

The visual specification describes **what the implementation should look
like**, not automatically how the code must be rebuilt.

Before creating or replacing a component, the implementation agent must:

1.  locate any existing equivalent;
2.  determine whether it is functional;
3.  determine whether styling or extending it can satisfy the visual
    specification;
4.  preserve its existing data bindings and Shopify behavior where
    practical;
5.  create a new component only when necessary;
6.  avoid changing unrelated components;
7.  avoid broad refactors solely to resolve a localized visual
    discrepancy.

Visual mismatch alone is not permission to replace known-working
functionality.

------------------------------------------------------------------------

## 4.1 Operational Contract Additions

Version 1.1 adds three production controls around the existing visual-inspection
contract:

1. **Per-page state manifests** — each page has one authoritative state file
   identifying its baseline specification, current render, current iteration,
   latest correction, lifecycle status, and accepted render.
2. **Deterministic validation gates** — JSON artifacts must pass schema and
   workflow validation before they are consumed by the next model.
3. **Correction traceability** — every QA correction ID must be traceable to
   the implementation action and files changed.

These controls do not change the design authority hierarchy. They prevent stale
artifacts, invalid JSON, and superseded QA instructions from entering an
autonomous implementation loop.

### Artifact authority within one page

When multiple generated artifacts exist for the same page, use this order:

1. approved reference mockup;
2. frozen baseline `{page}.visual-spec.json`;
3. current `{page}.state.json`;
4. latest correction identified by the state manifest;
5. prior correction/history artifacts.

OpenCode must not select a correction merely because it has the highest-looking
filename. The state manifest identifies the current authoritative iteration.

------------------------------------------------------------------------

# PART I --- INITIAL VISUAL INSPECTION

## 5. Required Inputs

For each page inspection, provide GPT-5.6 Sol:

-   the approved page screenshot;
-   this specification;
-   page filename;
-   known screenshot dimensions when available;
-   relevant Calder brand information when necessary;
-   optionally, the cross-page component assessment if already
    available.

Current approved mockups:

-   `Calder - 1 - Home.png`
-   `Calder - 2 - Category.png`
-   `Calder - 3 - Product.png`
-   `Calder - 4 - Cart.png`
-   `Calder - 5 - Checkout.png`
-   `Calder - 6 - Dealer Dashboard.png`

For best cross-page consistency, all six approved mockups should be
available to the visual inspector when performing the comprehensive
initial assessment.

------------------------------------------------------------------------

## 6. Production Visual Inspector System Prompt

Use the following as the governing prompt for the initial visual
inspection.

``` text
You are the CALDER WHEELS DESIGN-TO-CODE VISUAL INSPECTOR.

Your responsibility is NOT to describe screenshots conversationally.

Your responsibility is to reverse-engineer approved Calder Wheels visual
designs into structured implementation specifications that a separate coding
agent can use to reproduce the designs faithfully inside an EXISTING working
Shopify theme.

PIPELINE:

APPROVED CALDER MOCKUP
        ↓
YOU — GPT-5.6 SOL VISUAL INSPECTOR
        ↓
STRUCTURED VISUAL SPECIFICATION
        ↓
OPENCODE + IMPLEMENTATION MODEL
        ↓
EXISTING SHOPIFY THEME

==================================================
DESIGN AUTHORITY
==================================================

Use this priority whenever sources disagree:

1. Client-approved Calder mockups
2. Approved Calder brand assets
3. Existing working Shopify theme
4. Existing functional components/project documentation
5. Your visual inference

Never override clear evidence from a higher-priority source with an assumption
from a lower-priority source.

The screenshot is authoritative for visual presentation.

The implementation agent, not you, owns final code architecture decisions.

==================================================
PRIMARY OBJECTIVE
==================================================

Transform each supplied screenshot into an engineering-oriented visual
specification.

Do not merely answer:

"Describe this screenshot."

Instead inspect it as a design-to-code visual engineer.

Your output must help an implementation model understand:

- what exists;
- where it exists;
- how large it approximately is;
- how it relates spatially to neighboring components;
- which visual properties appear shared;
- which components are page-specific;
- what is directly observed;
- what is estimated;
- what is only a responsive assumption;
- how confident you are in each important inference.

==================================================
1. PAGE STRUCTURE
==================================================

Identify:

- announcement bars;
- global header;
- navigation;
- utility navigation;
- hero;
- fitment controls;
- content sections;
- section boundaries;
- product areas;
- galleries;
- cards;
- filters;
- toolbars;
- forms;
- tables;
- summaries;
- sidebars;
- dealer-portal structures;
- footer;
- overlays;
- floating components;
- persistent/sticky controls.

Determine the top-to-bottom page hierarchy.

==================================================
2. GEOMETRY
==================================================

Estimate:

- screenshot/viewport dimensions;
- section dimensions;
- maximum content widths;
- horizontal gutters;
- vertical spacing;
- section padding;
- component margins;
- grid structure;
- column ratios;
- gaps;
- alignment;
- component dimensions;
- relative scale;
- visual anchors;
- spatial relationships.

Use ranges rather than false precision when appropriate.

Example:

content_max_width:
  estimated: 1360-1440px
  confidence: 0.82

Prefer:

"approximately 45/55 two-column composition"

over:

"two columns."

==================================================
3. SPATIAL COORDINATES
==================================================

For significant sections and components provide:

bbox_px: [x1, y1, x2, y2]

and:

bbox_normalized: [x1, y1, x2, y2]

Coordinate origin is TOP-LEFT.

Pixel bounding boxes use the source screenshot dimensions.

Normalized bounding boxes use values from 0.0 to 1.0 relative to the complete
source screenshot:

x_normalized = x_pixel / screenshot_width
y_normalized = y_pixel / screenshot_height

Bounding-box order is always:

[x1, y1, x2, y2]

Do not change this convention.

Coordinates are implementation guidance, not requirements to hard-code those
exact pixel positions.

==================================================
4. TYPOGRAPHY
==================================================

Inspect and estimate:

- hierarchy;
- role;
- font style/category when visually apparent;
- weight;
- approximate size;
- approximate line height;
- letter spacing;
- capitalization;
- alignment;
- text block width;
- number of lines;
- visual emphasis.

Do NOT invent an exact font family unless supplied project context or clear
evidence identifies it.

Represent uncertain typography as ranges.

Example:

font_size:
  estimated_range: 64-72px
  confidence: 0.78

==================================================
5. COMPONENT STYLING
==================================================

Inspect:

- buttons;
- links;
- inputs;
- selectors;
- cards;
- tabs;
- badges;
- breadcrumbs;
- navigation;
- tables;
- product controls;
- quantity controls;
- filters;
- progress indicators;
- status indicators;
- borders;
- border thickness;
- border radius;
- shadows;
- separators;
- icon treatment.

Estimate component dimensions where visually meaningful.

==================================================
6. COLOR
==================================================

Estimate:

- section backgrounds;
- primary text;
- secondary/muted text;
- borders;
- accent colors;
- overlays;
- gradients;
- button colors;
- state colors.

Return approximate HEX or RGBA values when visually inferable.

Never represent screenshot-derived color estimates as exact source design
tokens unless verified by supplied brand information.

==================================================
7. IMAGERY
==================================================

Determine:

- image bounding boxes;
- approximate aspect ratios;
- cover/contain behavior;
- object positioning;
- cropping;
- masks;
- overlays;
- gradients;
- foreground/background relationships;
- product prominence;
- lifestyle versus product-render usage;
- likely focal point.

Do not assume image assets that are not visible.

==================================================
8. COMPONENT CLASSIFICATION
==================================================

Classify components as:

GLOBAL
SHARED
PAGE_SPECIFIC

GLOBAL means site-wide infrastructure such as primary header/footer.

SHARED means reusable across multiple Calder page types.

PAGE_SPECIFIC means primarily associated with the current page.

When multiple screenshots are supplied, explicitly identify repeated visual
patterns and likely reusable components.

==================================================
9. RESPONSIVE INFERENCE
==================================================

Infer likely responsive behavior from the available composition.

Possible observations include:

- columns likely stack;
- navigation likely collapses;
- filters likely become drawer controls;
- gallery likely becomes swipeable;
- order summary may move below content;
- fixed dimensions likely become fluid;
- horizontal overflow may become scrolling.

Every responsive conclusion inferred without a matching responsive screenshot
must be labeled:

ASSUMPTION

Never present inferred mobile behavior as observed fact.

==================================================
10. VISUAL RELATIONSHIPS
==================================================

Explain relationships important for implementation.

Examples:

- headline aligns with left edge of fitment bar;
- product image visually overlaps hero/background region;
- order summary begins level with first cart item;
- toolbar aligns to collection grid width;
- breadcrumb and product title share a common content column.

These relationships are often more useful than isolated measurements.

==================================================
11. CONFIDENCE
==================================================

Treat screenshot-derived measurements as estimates.

Use this confidence scale:

0.90-1.00 = visually clear / very strong evidence
0.75-0.89 = strong estimate
0.50-0.74 = approximate
0.25-0.49 = weak inference
0.00-0.24 = highly uncertain

Do not manufacture precision.

For important measurements include:

- estimated value or range;
- tolerance where useful;
- confidence;
- evidence type.

Evidence types:

OBSERVED
ESTIMATED
ASSUMPTION
VERIFIED_PROJECT_CONTEXT

==================================================
12. IMPLEMENTATION GUIDANCE
==================================================

Translate observations into implementation-useful language.

Prefer:

"Desktop uses an approximately 45/55 two-column composition with vertically
centered left content."

over:

"The text is on the left."

Prefer:

"Content appears constrained to approximately 1360-1440px with outer desktop
gutters near 6-8vw."

over:

"There is padding."

Implementation guidance must remain visual/structural.

Do not unnecessarily prescribe Shopify code architecture.

==================================================
13. PRESERVATION RULE
==================================================

The project is being implemented inside an existing working Shopify theme.

Do NOT assume existing functionality should be replaced.

The visual specification defines presentation targets.

The implementation agent must determine whether existing Shopify components
can be reused, styled, extended, or minimally modified before replacements
are created.

==================================================
14. UNKNOWN VALUES
==================================================

When something cannot be reliably determined:

- say UNKNOWN;
- explain what additional evidence would resolve it;
- do not fabricate a value.

==================================================
15. OUTPUT CONTRACT
==================================================

For each page return TWO synchronized representations:

A. strict machine-readable JSON conforming to the Calder Visual Specification
schema;

B. human-readable Markdown conforming to the Calder Visual Specification
Markdown template.

The JSON is the primary machine contract.

The Markdown is the human review representation.

Both must communicate the same findings.

Do not add conversational commentary before or after the artifacts.

Do not merely describe the screenshot.

Your output is an engineering artifact intended for another AI agent.
```

------------------------------------------------------------------------

# PART II --- MACHINE-READABLE VISUAL SPECIFICATION

## 7. Strict JSON Schema

The implementation handoff JSON must conform to the following schema.

``` json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "calder-visual-spec.schema.json",
  "title": "Calder Visual Specification",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "project",
    "artifact_type",
    "source",
    "page",
    "global_layout",
    "sections",
    "shared_components",
    "unique_components",
    "responsive_assumptions",
    "implementation_notes",
    "uncertainties"
  ],
  "properties": {
    "schema_version": {
      "type": "string",
      "const": "1.0"
    },
    "project": {
      "type": "string",
      "const": "Calder Wheels"
    },
    "artifact_type": {
      "type": "string",
      "const": "visual_specification"
    },
    "source": {
      "type": "object",
      "additionalProperties": false,
      "required": ["file", "viewport"],
      "properties": {
        "file": {"type": "string"},
        "viewport": {
          "type": "object",
          "additionalProperties": false,
          "required": ["width", "height"],
          "properties": {
            "width": {"type": "integer", "minimum": 1},
            "height": {"type": "integer", "minimum": 1}
          }
        }
      }
    },
    "page": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "type", "summary"],
      "properties": {
        "id": {"type": "string"},
        "type": {"type": "string"},
        "summary": {"type": "string"}
      }
    },
    "global_layout": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "content_max_width",
        "horizontal_gutters",
        "primary_alignment",
        "page_background"
      ],
      "properties": {
        "content_max_width": {"$ref": "#/$defs/measurement"},
        "horizontal_gutters": {"$ref": "#/$defs/measurement"},
        "primary_alignment": {"type": "string"},
        "page_background": {"$ref": "#/$defs/colorEstimate"}
      }
    },
    "sections": {
      "type": "array",
      "items": {"$ref": "#/$defs/section"}
    },
    "shared_components": {
      "type": "array",
      "items": {"$ref": "#/$defs/componentReference"}
    },
    "unique_components": {
      "type": "array",
      "items": {"$ref": "#/$defs/componentReference"}
    },
    "responsive_assumptions": {
      "type": "array",
      "items": {"$ref": "#/$defs/assumption"}
    },
    "implementation_notes": {
      "type": "array",
      "items": {"type": "string"}
    },
    "uncertainties": {
      "type": "array",
      "items": {"$ref": "#/$defs/uncertainty"}
    }
  },
  "$defs": {
    "evidence": {
      "type": "string",
      "enum": [
        "OBSERVED",
        "ESTIMATED",
        "ASSUMPTION",
        "VERIFIED_PROJECT_CONTEXT"
      ]
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 1
    },
    "measurement": {
      "type": "object",
      "additionalProperties": false,
      "required": ["value", "confidence", "evidence"],
      "properties": {
        "value": {
          "oneOf": [
            {"type": "number"},
            {"type": "string"}
          ]
        },
        "range": {
          "type": ["string", "null"]
        },
        "tolerance": {
          "type": ["string", "null"]
        },
        "confidence": {"$ref": "#/$defs/confidence"},
        "evidence": {"$ref": "#/$defs/evidence"}
      }
    },
    "colorEstimate": {
      "type": "object",
      "additionalProperties": false,
      "required": ["value", "confidence", "evidence"],
      "properties": {
        "value": {"type": "string"},
        "confidence": {"$ref": "#/$defs/confidence"},
        "evidence": {"$ref": "#/$defs/evidence"}
      }
    },
    "bboxPx": {
      "type": "array",
      "minItems": 4,
      "maxItems": 4,
      "prefixItems": [
        {"type": "number"},
        {"type": "number"},
        {"type": "number"},
        {"type": "number"}
      ]
    },
    "bboxNormalized": {
      "type": "array",
      "minItems": 4,
      "maxItems": 4,
      "prefixItems": [
        {"type": "number", "minimum": 0, "maximum": 1},
        {"type": "number", "minimum": 0, "maximum": 1},
        {"type": "number", "minimum": 0, "maximum": 1},
        {"type": "number", "minimum": 0, "maximum": 1}
      ]
    },
    "typography": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "role": {"type": "string"},
        "case": {"type": "string"},
        "weight": {"type": "string"},
        "font_size": {"$ref": "#/$defs/measurement"},
        "line_height": {"$ref": "#/$defs/measurement"},
        "letter_spacing": {"$ref": "#/$defs/measurement"},
        "alignment": {"type": "string"},
        "color": {"$ref": "#/$defs/colorEstimate"}
      }
    },
    "style": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "background": {"type": "string"},
        "border": {"type": "string"},
        "border_radius": {"type": "string"},
        "shadow": {"type": "string"},
        "overlay": {"type": "string"},
        "gradient": {"type": "string"}
      }
    },
    "component": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "type",
        "classification",
        "bbox_px",
        "bbox_normalized",
        "description",
        "confidence",
        "evidence"
      ],
      "properties": {
        "id": {"type": "string"},
        "type": {"type": "string"},
        "classification": {
          "type": "string",
          "enum": ["GLOBAL", "SHARED", "PAGE_SPECIFIC"]
        },
        "bbox_px": {"$ref": "#/$defs/bboxPx"},
        "bbox_normalized": {"$ref": "#/$defs/bboxNormalized"},
        "description": {"type": "string"},
        "layout": {
          "type": "object",
          "additionalProperties": true
        },
        "typography": {"$ref": "#/$defs/typography"},
        "style": {"$ref": "#/$defs/style"},
        "imagery": {
          "type": "object",
          "additionalProperties": true
        },
        "relationships": {
          "type": "array",
          "items": {"type": "string"}
        },
        "implementation_guidance": {
          "type": "array",
          "items": {"type": "string"}
        },
        "confidence": {"$ref": "#/$defs/confidence"},
        "evidence": {"$ref": "#/$defs/evidence"}
      }
    },
    "section": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "name",
        "bbox_px",
        "bbox_normalized",
        "layout",
        "components",
        "relationships",
        "confidence",
        "evidence"
      ],
      "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "bbox_px": {"$ref": "#/$defs/bboxPx"},
        "bbox_normalized": {"$ref": "#/$defs/bboxNormalized"},
        "layout": {
          "type": "object",
          "additionalProperties": true
        },
        "spacing": {
          "type": "object",
          "additionalProperties": true
        },
        "background": {
          "type": "object",
          "additionalProperties": true
        },
        "components": {
          "type": "array",
          "items": {"$ref": "#/$defs/component"}
        },
        "relationships": {
          "type": "array",
          "items": {"type": "string"}
        },
        "implementation_guidance": {
          "type": "array",
          "items": {"type": "string"}
        },
        "confidence": {"$ref": "#/$defs/confidence"},
        "evidence": {"$ref": "#/$defs/evidence"}
      }
    },
    "componentReference": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "name", "classification", "reason"],
      "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "classification": {
          "type": "string",
          "enum": ["GLOBAL", "SHARED", "PAGE_SPECIFIC"]
        },
        "reason": {"type": "string"}
      }
    },
    "assumption": {
      "type": "object",
      "additionalProperties": false,
      "required": ["target", "assumption", "confidence", "evidence"],
      "properties": {
        "target": {"type": "string"},
        "assumption": {"type": "string"},
        "confidence": {"$ref": "#/$defs/confidence"},
        "evidence": {
          "type": "string",
          "const": "ASSUMPTION"
        }
      }
    },
    "uncertainty": {
      "type": "object",
      "additionalProperties": false,
      "required": ["target", "unknown", "resolution"],
      "properties": {
        "target": {"type": "string"},
        "unknown": {"type": "string"},
        "resolution": {"type": "string"}
      }
    }
  }
}
```

### Schema Rules

1.  `bbox_px` and `bbox_normalized` must use `[x1, y1, x2, y2]`.
2.  Normalized values must remain between `0` and `1`.
3.  No estimated measurement should be represented as verified.
4.  Unknown values must not be fabricated merely to satisfy a field.
5.  When a schema-required bounding box cannot be estimated with
    reasonable confidence, use the broadest defensible bounding region
    and document the uncertainty.
6.  JSON identifiers must be stable and implementation-friendly, for
    example `home-hero`, `global-header`, `product-gallery`.
7.  The JSON artifact is the primary model-to-model contract.

------------------------------------------------------------------------

# PART III --- HUMAN-READABLE MARKDOWN

## 8. Markdown Output Template

For every page, generate a corresponding Markdown document using this
structure.

``` markdown
# Calder Visual Specification — [Page Name]

## Source

- File: `[filename]`
- Source dimensions: `[width] × [height]`
- Page type: `[type]`
- Inspector: GPT-5.6 Sol
- Schema version: 1.0

## Page Summary

[Short structural summary.]

## Global Layout

### Content Width
- Estimate:
- Range:
- Confidence:
- Evidence:

### Horizontal Gutters
- Estimate:
- Range:
- Confidence:
- Evidence:

### Primary Alignment
- ...

### Page Background
- ...

---

## Section 1 — [Section Name]

**ID:** `[section-id]`

### Bounds

- Pixel bbox: `[x1, y1, x2, y2]`
- Normalized bbox: `[x1, y1, x2, y2]`
- Confidence:
- Evidence:

### Layout

- Structure:
- Width:
- Height:
- Grid:
- Columns:
- Alignment:
- Gaps:

### Spacing

- Top padding:
- Bottom padding:
- Left/right padding:
- Component spacing:

### Background

- Color:
- Image:
- Crop behavior:
- Overlay:
- Gradient:

### Components

#### [Component Name]

- ID:
- Classification: GLOBAL / SHARED / PAGE_SPECIFIC
- Type:
- Pixel bbox:
- Normalized bbox:
- Description:

##### Typography
- Role:
- Case:
- Weight:
- Estimated size:
- Line height:
- Letter spacing:
- Alignment:
- Color:
- Confidence:

##### Styling
- Dimensions:
- Background:
- Border:
- Border thickness:
- Radius:
- Shadow:
- State treatment:

##### Imagery
- Aspect ratio:
- Fit behavior:
- Crop:
- Focal point:
- Overlay:

##### Relationships
- ...

##### Implementation Guidance
- ...

### Section Relationships

- ...

### Implementation Guidance

- ...

---

## Shared Components

### [Component]
- Classification:
- Appears on:
- Reuse rationale:
- Important visual invariants:

---

## Page-Specific Components

### [Component]
- Purpose:
- Visual characteristics:
- Implementation considerations:

---

## Responsive Assumptions

> All items in this section are assumptions unless responsive reference
> screenshots are supplied.

### [Target]
- Assumption:
- Confidence:
- Reason:

---

## Visual Relationships

- ...
- ...

---

## Uncertainties

### [Target]
- Unknown:
- Why it cannot be reliably determined:
- Evidence needed to resolve:

---

## Implementation Notes

- ...
- ...

## Inspection Summary

- Highest-confidence findings:
- Lower-confidence findings:
- Critical relationships to preserve:
- Items requiring implementation-side verification:
```

The Markdown must not contradict the JSON.

------------------------------------------------------------------------

# PART IV --- FILE AND FOLDER CONTRACT

## 9. Recommended Project Structure

Use the following conceptual structure inside the Calder project:

``` text
Calder Wheels/
│
├── brand/
│   └── assets/
│
├── docs/
│   └── design/
│       │
│       ├── mockups/
│       │   └── approved-mockups/
│       │       ├── Calder - 1 - Home.png
│       │       ├── Calder - 2 - Category.png
│       │       ├── Calder - 3 - Product.png
│       │       ├── Calder - 4 - Cart.png
│       │       ├── Calder - 5 - Checkout.png
│       │       └── Calder - 6 - Dealer Dashboard.png
│       │
│       ├── visual-inspector/
│       │   ├── calder-visual-inspector.md
│       │   ├── schemas/
│       │   │   ├── calder-visual-spec.schema.json
│       │   │   ├── calder-visual-correction.schema.json
│       │   │   └── calder-visual-state.schema.json
│       │   │
│       │   ├── state/
│       │   │   ├── home.state.json
│       │   │   ├── category.state.json
│       │   │   ├── product.state.json
│       │   │   ├── cart.state.json
│       │   │   ├── checkout.state.json
│       │   │   └── dealer-dashboard.state.json
│       │   │
│       │   ├── scripts/
│       │   │   ├── validate-visual-spec.py
│       │   │   ├── validate-correction.py
│       │   │   └── validate-state.py
│       │   │
│       │   ├── visual-specs/
│       │   │   ├── home.visual-spec.json
│       │   │   ├── home.visual-spec.md
│       │   │   ├── category.visual-spec.json
│       │   │   ├── category.visual-spec.md
│       │   │   ├── product.visual-spec.json
│       │   │   ├── product.visual-spec.md
│       │   │   ├── cart.visual-spec.json
│       │   │   ├── cart.visual-spec.md
│       │   │   ├── checkout.visual-spec.json
│       │   │   ├── checkout.visual-spec.md
│       │   │   ├── dealer-dashboard.visual-spec.json
│       │   │   └── dealer-dashboard.visual-spec.md
│       │   │
│       │   ├── qa/
│       │   │   ├── renders/
│       │   │   ├── corrections/
│       │   │   └── history/
│       │   │
│       │   └── prompts/
│       │       ├── initial-inspection.prompt.md
│       │       ├── visual-qa.prompt.md
│       │       ├── opencode-implementation.prompt.md
│       │       └── opencode-correction.prompt.md
│       │
│       ├── calder-wheels-approved-mockup-layout-component-assessment.md
│       └── Shopify Themes/
│           └── Working Theme-via-CLI/
│
└── [other project files]
```

### Naming Convention

Page slugs:

``` text
home
category
product
cart
checkout
dealer-dashboard
```

Initial specification:

``` text
{page}.visual-spec.json
{page}.visual-spec.md
```

Implementation render:

``` text
{page}.implementation.v{iteration}.png
```

Visual QA correction:

``` text
{page}.correction.v{iteration}.json
{page}.correction.v{iteration}.md
```

Final accepted render:

``` text
{page}.implementation.accepted.png
```

Never overwrite QA history. Increment iteration numbers.

------------------------------------------------------------------------

## 9.1 Per-Page State Manifest

Each page must have one state file:

``` text
state/{page}.state.json
```

The state file is the orchestration authority for generated artifacts. It does
not replace the approved mockup or baseline visual specification.

Example:

``` json
{
  "schema_version": "1.0",
  "project": "Calder Wheels",
  "artifact_type": "visual_inspector_state",
  "page": "home",
  "reference": "docs/design/mockups/approved-mockups/Calder - 1 - Home.png",
  "baseline": "docs/design/visual-inspector/visual-specs/home.visual-spec.json",
  "status": "READY_FOR_VISUAL_QA",
  "current_iteration": 2,
  "current_render": "docs/design/visual-inspector/qa/renders/home.implementation.v2.png",
  "latest_correction": "docs/design/visual-inspector/qa/corrections/home.correction.v1.json",
  "accepted_render": null
}
```

### Allowed state values

``` text
NOT_INSPECTED
SPEC_CREATED
SPEC_REVIEWED
READY_FOR_IMPLEMENTATION
IMPLEMENTING
READY_FOR_VISUAL_QA
REVISION_REQUIRED
IMPLEMENTING_CORRECTION
PASS_WITH_MINOR_NOTES
PASS
ACCEPTED
BLOCKED
```

### State rules

1. `current_iteration` identifies the implementation render currently under
   review or being produced.
2. `latest_correction` must point only to the correction that OpenCode should
   currently consume.
3. `accepted_render` remains `null` until human/project acceptance.
4. Historical correction files remain immutable.
5. State transitions occur only after the required gate succeeds.
6. A state file must never point to a missing artifact.
7. If the state file and directory contents disagree, stop the autonomous loop
   and resolve the state mismatch before implementation continues.

------------------------------------------------------------------------

## 9.2 Strict State JSON Schema

Save as:

``` text
schemas/calder-visual-state.schema.json
```

``` json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "calder-visual-state.schema.json",
  "title": "Calder Visual Inspector Page State",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "project",
    "artifact_type",
    "page",
    "reference",
    "baseline",
    "status",
    "current_iteration",
    "current_render",
    "latest_correction",
    "accepted_render"
  ],
  "properties": {
    "schema_version": {"type": "string", "const": "1.0"},
    "project": {"type": "string", "const": "Calder Wheels"},
    "artifact_type": {"type": "string", "const": "visual_inspector_state"},
    "page": {
      "type": "string",
      "enum": ["home", "category", "product", "cart", "checkout", "dealer-dashboard"]
    },
    "reference": {"type": "string", "minLength": 1},
    "baseline": {"type": ["string", "null"]},
    "status": {
      "type": "string",
      "enum": [
        "NOT_INSPECTED",
        "SPEC_CREATED",
        "SPEC_REVIEWED",
        "READY_FOR_IMPLEMENTATION",
        "IMPLEMENTING",
        "READY_FOR_VISUAL_QA",
        "REVISION_REQUIRED",
        "IMPLEMENTING_CORRECTION",
        "PASS_WITH_MINOR_NOTES",
        "PASS",
        "ACCEPTED",
        "BLOCKED"
      ]
    },
    "current_iteration": {"type": "integer", "minimum": 0},
    "current_render": {"type": ["string", "null"]},
    "latest_correction": {"type": ["string", "null"]},
    "accepted_render": {"type": ["string", "null"]}
  }
}
```

------------------------------------------------------------------------

## 9.3 Deterministic Validation Layer

LLM-generated JSON must not advance the workflow merely because it appears
valid to a human or another model.

Use local validation scripts:

``` text
scripts/validate-visual-spec.py
scripts/validate-correction.py
scripts/validate-state.py
```

At minimum, validators must check:

### Visual specification

- valid JSON;
- valid against `calder-visual-spec.schema.json`;
- required keys present;
- normalized coordinates remain between `0.0` and `1.0`;
- bounding boxes use `[x1, y1, x2, y2]`;
- `x2 >= x1` and `y2 >= y1`;
- evidence labels are valid;
- confidence values remain between `0.0` and `1.0`;
- page slug/reference are consistent with the target task.

### Correction specification

- valid JSON;
- valid against `calder-visual-correction.schema.json`;
- iteration matches the QA task;
- reference and implementation filenames match the state manifest;
- correction IDs are unique;
- severities and categories are valid;
- `PASS` cannot coexist with CRITICAL or HIGH differences;
- `PASS_WITH_MINOR_NOTES` cannot coexist with CRITICAL, HIGH, or actionable
  MEDIUM differences.

### State manifest

- valid JSON;
- valid against `calder-visual-state.schema.json`;
- referenced files exist where the current state requires them;
- current iteration agrees with the current render filename;
- latest correction does not point to a future or superseded iteration;
- accepted render is populated only for an accepted page.

### Gate behavior

``` text
MODEL OUTPUT
    ↓
DETERMINISTIC VALIDATION
    ├── FAIL → repair/reissue artifact; do not hand off
    └── PASS → advance state and hand off
```

Schema validation is a workflow gate, not optional cleanup.

------------------------------------------------------------------------

# PART V --- WEB-BASED CHATGPT INITIAL INSPECTION WORKFLOW

## 10. Manual Initial Inspection Procedure

Because the initial inspection will use web-based GPT-5.6 Sol, use this
workflow.

### Step 1 --- Start a dedicated Calder inspection conversation

Select GPT-5.6 Sol.

For the comprehensive first pass, use a higher reasoning setting when
available.

### Step 2 --- Attach the approved mockups

Prefer attaching all six approved screenshots to the same inspection
context so shared components and cross-page patterns can be recognized.

### Step 3 --- Supply this specification

Tell the model that `calder-visual-inspector.md` is the governing
inspection contract.

### Step 4 --- Run the inspection page by page

Recommended order:

``` text
1. Home
2. Category
3. Product
4. Cart
5. Checkout
6. Dealer Dashboard
```

Home is first because it establishes much of the global Calder visual
language.

### Step 5 --- Save both outputs

For each page, save:

``` text
{page}.visual-spec.json
{page}.visual-spec.md
```

### Step 6 --- Validate

Before handing the artifacts to OpenCode, run the deterministic visual-spec
validator. The artifact must pass the schema and workflow checks defined in
Section 9.3.

Human review should additionally confirm:

-   JSON and Markdown agree;
-   responsive assumptions are labeled;
-   estimates are not represented as exact verified values;
-   component classifications are sensible;
-   the screenshot remains the visual authority;
-   no important relationship was omitted simply because it was difficult to
    express numerically.

### Step 7 --- Freeze the initial spec

Once accepted, treat the initial visual spec as the baseline.

Later QA should generate correction files rather than silently rewriting
the baseline.

Only update the baseline when:

-   the client approves a changed mockup;
-   a material inspector error is confirmed;
-   additional authoritative design evidence changes the interpretation.

------------------------------------------------------------------------

# PART VI --- OPENCODE HANDOFF PROTOCOL

## 10.1 Stable System Prompt vs Runtime Task Prompt

The long Production Visual Inspector System Prompt in Section 6 defines stable
inspector behavior. Do not rewrite it for each page.

Each inspection should use a compact runtime task prompt containing only the
operation, page, reference, context, schemas, and required outputs.

Recommended runtime task:

``` text
TASK: INITIAL_VISUAL_INSPECTION

PROJECT:
Calder Wheels

PAGE:
{page}

REFERENCE:
{approved-mockup-path}

CROSS-PAGE CONTEXT:
docs/design/calder-wheels-approved-mockup-layout-component-assessment.md

OUTPUTS:
docs/design/visual-inspector/visual-specs/{page}.visual-spec.json
docs/design/visual-inspector/visual-specs/{page}.visual-spec.md

SCHEMA:
docs/design/visual-inspector/schemas/calder-visual-spec.schema.json

Analyze the reference according to calder-visual-inspector.md.

Do not implement code.
Do not redesign or improve the approved reference.
Do not alter Shopify files.
Return only the required inspection artifacts.
```

The separation is:

``` text
SYSTEM PROMPT → permanent inspector behavior
TASK PROMPT   → current page and operation
SCHEMA        → machine-enforced output contract
STATE         → current workflow authority
```

------------------------------------------------------------------------

## 11. Required OpenCode Inputs

Before implementation of a page begins, OpenCode should have access to:

``` text
APPROVED MOCKUP
+
PAGE VISUAL SPEC JSON
+
PAGE VISUAL SPEC MARKDOWN
+
CROSS-PAGE COMPONENT ASSESSMENT
+
WS1 / IMPLEMENTATION GUIDANCE
+
EXISTING WORKING SHOPIFY THEME
+
CALDER BRAND ASSETS
```

The implementation model should not be expected to infer important
spatial information that the visual inspector has already extracted.

------------------------------------------------------------------------

## 11.1 Required OpenCode Consumption Order

OpenCode must consume artifacts in this order:

``` text
1. Read state/{page}.state.json.
2. Confirm status is READY_FOR_IMPLEMENTATION or IMPLEMENTING.
3. Read {page}.visual-spec.json.
4. Run/confirm visual-spec validation.
5. Read {page}.visual-spec.md.
6. Read calder-wheels-approved-mockup-layout-component-assessment.md.
7. Read ws1-activation-guide.md and applicable implementation guidance.
8. Inspect the existing Working Theme-via-CLI.
9. Inspect the approved mockup if the active implementation model can use
   vision; otherwise rely on the accepted visual spec for extracted geometry.
10. Produce the component mapping.
11. Implement only after the mapping is complete.
```

For each required component, the implementation plan must classify the action:

``` text
REUSE
RESTYLE
EXTEND
CREATE
```

Recommended mapping format:

``` text
REQUIREMENT          EXISTING COMPONENT        ACTION
---------------------------------------------------------
global-header        sections/header...        RESTYLE
hero                 sections/...              EXTEND
fitment-selector     snippets/...              REUSE
wheel-grid           sections/...              RESTYLE
editorial-section    none                      CREATE
```

This audit is mandatory before implementation. It prevents the coding agent
from recreating components that already exist and work.

------------------------------------------------------------------------

## 12. OpenCode Implementation Prompt

Use the following contract when handing a page to OpenCode/DeepSeek.

``` text
You are implementing an approved Calder Wheels design inside an EXISTING
working Shopify theme.

The visual specification supplied with this task is the machine-readable
interpretation of the approved Calder mockup.

Do not independently reinterpret the screenshot when the visual specification
already contains the relevant observation.

Use the approved screenshot as the ultimate visual authority if a discrepancy
between the screenshot and visual specification is discovered.

==================================================
SOURCE PRIORITY
==================================================

1. Approved Calder mockup
2. Approved Calder brand assets
3. Accepted Calder visual specification
4. Existing working Shopify theme
5. Existing project documentation
6. Implementation inference

==================================================
NON-DESTRUCTIVE IMPLEMENTATION
==================================================

Before creating or replacing any component:

1. Search the working theme for an existing equivalent.
2. Identify its files, dependencies, settings, schema, Liquid bindings,
   JavaScript behavior, and CSS.
3. Determine whether the component currently works.
4. Determine whether styling or extending the existing component can satisfy
   the visual specification.
5. Preserve working Shopify functionality and data bindings where practical.
6. Create a replacement only when reuse/extension is not appropriate.
7. Do not perform unrelated refactors.
8. Do not overwrite prior working progress merely to make implementation easier.

==================================================
IMPLEMENTATION PROCEDURE
==================================================

For the target page:

1. Read the visual-spec JSON.
2. Read the corresponding Markdown specification.
3. Inspect the approved mockup.
4. Audit the current theme implementation.
5. Map visual-spec sections/components to existing theme components.
6. Produce an implementation plan.
7. Identify:
   - REUSE
   - RESTYLE
   - EXTEND
   - CREATE
   for each required component.
8. Implement incrementally.
9. Preserve functional behavior.
10. Run relevant theme/build validation.
11. Render the target page at the reference viewport.
12. Capture a screenshot.
13. Save the screenshot using the QA naming convention.
14. Submit the render for Calder Visual QA.

==================================================
MEASUREMENT INTERPRETATION
==================================================

Visual measurements are guidance, not instructions to hard-code desktop
coordinates.

Use CSS layout systems appropriate to the relationship being represented:

- max-width containers;
- CSS Grid;
- Flexbox;
- fluid dimensions;
- aspect-ratio;
- clamp();
- responsive spacing;
- media queries;
- object-fit/object-position.

Do not implement screenshot bounding boxes as absolute positioning unless the
actual design relationship requires absolute positioning.

Preserve RELATIONSHIPS before chasing individual pixel measurements.

==================================================
RESPONSIVE RULE
==================================================

Responsive assumptions in the visual specification are hypotheses, not
approved responsive designs.

Use them as guidance while preserving sensible Shopify/theme responsive
behavior.

Do not invent elaborate responsive interactions without evidence.

==================================================
COMPLETION RULE
==================================================

Implementation is not visually complete merely because the page renders.

A page must enter the Calder Visual QA loop.

Do not declare visual acceptance yourself.

Output:

1. implementation summary;
2. files modified;
3. components reused/restyled/extended/created;
4. functionality preserved;
5. unresolved implementation questions;
6. render screenshot path;
7. readiness for Visual QA.
```

------------------------------------------------------------------------

# PART VII --- VISUAL QA

## 13. Visual QA Inputs

Each QA pass requires:

1.  approved reference screenshot;
2.  current implementation screenshot;
3.  baseline visual-spec JSON;
4.  optionally, prior correction JSON;
5.  reference and implementation viewport dimensions.

The reference and implementation should ideally use the same viewport
dimensions.

If they do not, the QA inspector must rely primarily on normalized
coordinates and layout relationships.

------------------------------------------------------------------------

## 14. Production Visual-QA Prompt

``` text
You are the CALDER WHEELS VISUAL QA INSPECTOR.

You are NOT performing a new general design description.

You are comparing an approved Calder Wheels reference design against a browser
render of its Shopify implementation.

Your responsibility is to produce a precise, implementation-oriented correction
specification for OpenCode + the implementation model.

INPUTS:

A. APPROVED REFERENCE SCREENSHOT
B. CURRENT IMPLEMENTATION SCREENSHOT
C. BASELINE CALDER VISUAL SPECIFICATION
D. OPTIONAL PRIOR CORRECTION SPECIFICATION

==================================================
PRIMARY OBJECTIVE
==================================================

Determine whether the implementation preserves the approved design's:

- page structure;
- section boundaries;
- geometry;
- content widths;
- gutters;
- spacing;
- grid;
- column ratios;
- alignment;
- typography hierarchy;
- typography scale;
- line height;
- capitalization;
- buttons;
- radii;
- borders;
- backgrounds;
- colors;
- imagery;
- aspect ratios;
- crop behavior;
- overlays;
- shadows;
- cards;
- navigation presentation;
- shared components;
- page-specific components;
- visual relationships.

Do not focus only on isolated pixels.

Evaluate both:

1. local component differences;
2. system-level visual relationships.

==================================================
COORDINATE SYSTEM
==================================================

Use:

bbox_px: [x1, y1, x2, y2]

bbox_normalized: [x1, y1, x2, y2]

Origin is top-left.

Normalized coordinates use 0.0-1.0.

When screenshot dimensions differ, prioritize normalized comparisons.

==================================================
DIFFERENCE CLASSIFICATION
==================================================

Classify every actionable difference by category:

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

==================================================
SEVERITY
==================================================

Use:

CRITICAL
HIGH
MEDIUM
LOW
INFORMATIONAL

CRITICAL:
- wrong/missing major section;
- broken layout;
- wrong page structure;
- functionality visibly prevents design completion.

HIGH:
- major hero/product/gallery/grid geometry mismatch;
- materially incorrect typography hierarchy;
- large alignment/scale error;
- dominant imagery significantly incorrect.

MEDIUM:
- noticeable spacing, sizing, alignment, color, or component treatment mismatch.

LOW:
- minor polish discrepancy unlikely to change overall composition.

INFORMATIONAL:
- observation not currently requiring a code change.

==================================================
CORRECTIONS
==================================================

Every actionable correction should identify:

- component;
- category;
- severity;
- observed reference state;
- observed implementation state;
- estimated delta where useful;
- desired visual relationship;
- recommended correction;
- confidence.

Prefer:

"Increase product visual width approximately 12-16%; preserve right alignment
and current vertical center."

over:

"Make wheel bigger."

Prefer:

"Move heading group upward approximately 40-55px at this viewport; maintain
current left edge."

over:

"Fix hero."

==================================================
DO NOT OVER-CORRECT
==================================================

Do not recommend replacing working functionality when a targeted visual
adjustment is sufficient.

Do not request broad refactoring for localized visual issues.

Do not require exact pixel matching where responsive CSS relationships provide
the correct visual result.

Do not treat anti-aliasing, browser font rendering, subpixel differences, or
trivial rasterization differences as meaningful defects.

==================================================
CONFIDENCE
==================================================

Use:

0.90-1.00 = visually clear / very strong evidence
0.75-0.89 = strong estimate
0.50-0.74 = approximate
0.25-0.49 = weak inference
0.00-0.24 = highly uncertain

Do not manufacture precision.

==================================================
PASS / FAIL
==================================================

Evaluate:

STRUCTURAL PASS
VISUAL PASS
FINAL STATUS

Allowed final statuses:

PASS
PASS_WITH_MINOR_NOTES
REVISION_REQUIRED
BLOCKED

A page may only receive PASS when:

- no CRITICAL issues remain;
- no HIGH issues remain;
- no unresolved structural mismatches remain;
- remaining differences are visually negligible or unavoidable rendering
  differences.

PASS_WITH_MINOR_NOTES may be used when:

- no CRITICAL issues remain;
- no HIGH issues remain;
- only LOW issues or non-blocking informational observations remain;
- the design is sufficiently faithful for acceptance subject to optional polish.

REVISION_REQUIRED applies when actionable MEDIUM/HIGH/CRITICAL issues remain.

BLOCKED applies when reliable comparison cannot be completed because required
inputs, assets, states, or renders are missing or invalid.

Return:

1. strict correction JSON;
2. human-readable correction Markdown.

Do not include unrelated commentary.
```

------------------------------------------------------------------------

## 14.1 Neutral Visual-QA Handoff

OpenCode must provide evidence to the Visual QA Inspector without pre-diagnosing
the visual defects.

Recommended task:

``` text
TASK: VISUAL_QA

PAGE:
{page}

ITERATION:
{iteration}

REFERENCE:
{approved-reference}

IMPLEMENTATION:
{current-render}

BASELINE:
{page}.visual-spec.json

PRIOR_CORRECTION:
{prior-correction-or-NONE}

OUTPUT:
{page}.correction.v{iteration}.json
{page}.correction.v{iteration}.md
```

Do not prepend statements such as:

``` text
"The hero is probably the only problem."
"Everything except spacing is correct."
```

The QA inspector must independently inspect the complete page every iteration.
Prior correction files provide history and verification targets; they must not
restrict the new inspection to previously identified defects.

The inspector should explicitly verify:

1. whether prior corrections were resolved;
2. whether the corrections introduced regressions;
3. whether previously unreported material differences remain;
4. whether shared/global components still match the reference system.

------------------------------------------------------------------------

# PART VIII --- CORRECTION SCHEMA

## 15. Strict Visual Correction JSON Schema

``` json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "calder-visual-correction.schema.json",
  "title": "Calder Visual Correction Specification",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "project",
    "artifact_type",
    "page",
    "iteration",
    "reference",
    "implementation",
    "structural_pass",
    "visual_pass",
    "final_status",
    "summary",
    "differences",
    "preserve",
    "blocked_by"
  ],
  "properties": {
    "schema_version": {
      "type": "string",
      "const": "1.0"
    },
    "project": {
      "type": "string",
      "const": "Calder Wheels"
    },
    "artifact_type": {
      "type": "string",
      "const": "visual_correction"
    },
    "page": {"type": "string"},
    "iteration": {"type": "integer", "minimum": 1},
    "reference": {
      "type": "object",
      "additionalProperties": false,
      "required": ["file", "width", "height"],
      "properties": {
        "file": {"type": "string"},
        "width": {"type": "integer", "minimum": 1},
        "height": {"type": "integer", "minimum": 1}
      }
    },
    "implementation": {
      "type": "object",
      "additionalProperties": false,
      "required": ["file", "width", "height"],
      "properties": {
        "file": {"type": "string"},
        "width": {"type": "integer", "minimum": 1},
        "height": {"type": "integer", "minimum": 1}
      }
    },
    "structural_pass": {"type": "boolean"},
    "visual_pass": {"type": "boolean"},
    "final_status": {
      "type": "string",
      "enum": [
        "PASS",
        "PASS_WITH_MINOR_NOTES",
        "REVISION_REQUIRED",
        "BLOCKED"
      ]
    },
    "summary": {"type": "string"},
    "differences": {
      "type": "array",
      "items": {"$ref": "#/$defs/difference"}
    },
    "preserve": {
      "type": "array",
      "items": {"type": "string"}
    },
    "blocked_by": {
      "type": "array",
      "items": {"type": "string"}
    }
  },
  "$defs": {
    "bbox": {
      "type": "array",
      "minItems": 4,
      "maxItems": 4,
      "prefixItems": [
        {"type": "number"},
        {"type": "number"},
        {"type": "number"},
        {"type": "number"}
      ]
    },
    "normalizedBbox": {
      "type": "array",
      "minItems": 4,
      "maxItems": 4,
      "prefixItems": [
        {"type": "number", "minimum": 0, "maximum": 1},
        {"type": "number", "minimum": 0, "maximum": 1},
        {"type": "number", "minimum": 0, "maximum": 1},
        {"type": "number", "minimum": 0, "maximum": 1}
      ]
    },
    "difference": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "component",
        "category",
        "severity",
        "reference_state",
        "implementation_state",
        "desired_relationship",
        "correction",
        "confidence"
      ],
      "properties": {
        "id": {"type": "string"},
        "component": {"type": "string"},
        "category": {
          "type": "string",
          "enum": [
            "STRUCTURE",
            "POSITION",
            "SIZE",
            "SPACING",
            "ALIGNMENT",
            "TYPOGRAPHY",
            "COLOR",
            "BACKGROUND",
            "BORDER",
            "RADIUS",
            "SHADOW",
            "IMAGERY",
            "CROP",
            "OVERLAY",
            "GRID",
            "RESPONSIVE",
            "CONTENT",
            "FUNCTIONAL_VISUAL_STATE",
            "OTHER"
          ]
        },
        "severity": {
          "type": "string",
          "enum": [
            "CRITICAL",
            "HIGH",
            "MEDIUM",
            "LOW",
            "INFORMATIONAL"
          ]
        },
        "reference_bbox_px": {"$ref": "#/$defs/bbox"},
        "implementation_bbox_px": {"$ref": "#/$defs/bbox"},
        "reference_bbox_normalized": {"$ref": "#/$defs/normalizedBbox"},
        "implementation_bbox_normalized": {"$ref": "#/$defs/normalizedBbox"},
        "reference_state": {"type": "string"},
        "implementation_state": {"type": "string"},
        "estimated_delta": {"type": ["string", "null"]},
        "desired_relationship": {"type": "string"},
        "correction": {"type": "string"},
        "preserve": {
          "type": "array",
          "items": {"type": "string"}
        },
        "confidence": {
          "type": "number",
          "minimum": 0,
          "maximum": 1
        }
      }
    }
  }
}
```

------------------------------------------------------------------------

## 16. Correction Markdown Template

``` markdown
# Calder Visual QA — [Page] — Iteration [N]

## Inputs

- Reference:
- Implementation:
- Reference viewport:
- Implementation viewport:
- Baseline spec:

## Result

- Structural pass: YES / NO
- Visual pass: YES / NO
- Final status: PASS / PASS_WITH_MINOR_NOTES / REVISION_REQUIRED / BLOCKED

## Summary

[Concise assessment.]

## Required Corrections

### QA-[PAGE]-001 — [Component]

- Category:
- Severity:
- Confidence:
- Reference state:
- Implementation state:
- Estimated delta:
- Desired relationship:
- Correction:
- Preserve:

### QA-[PAGE]-002 — [Component]

...

## Elements Already Matching

- ...
- ...

## Preserve During Next Iteration

- ...
- ...

## Blocking Issues

- None / ...

## Next Action

[Targeted implementation instruction.]
```

------------------------------------------------------------------------

# PART IX --- CONFIDENCE CONTRACT

## 17. Confidence Rules

Confidence is required to prevent inferred visual measurements from
becoming false design facts.

### 0.90--1.00 --- Very Strong

Use when:

-   boundary is visually clear;
-   component position is obvious;
-   repeated alignment strongly confirms a relationship;
-   project context verifies the value.

Implementation agent may treat this as strong guidance.

### 0.75--0.89 --- Strong Estimate

Use when:

-   visual evidence is good;
-   exact source token is unavailable;
-   small measurement error is possible.

Suitable for implementation guidance with normal validation.

### 0.50--0.74 --- Approximate

Use when:

-   value is visually plausible;
-   screenshot resolution/cropping limits certainty;
-   several nearby values could reproduce the design.

Implementation should prioritize the relationship over the exact number.

### 0.25--0.49 --- Weak

Use when:

-   inference depends substantially on interpretation;
-   obscured/cropped content prevents confident measurement.

Do not make destructive implementation decisions from this alone.

### 0.00--0.24 --- Highly Uncertain

Use when evidence is insufficient.

Prefer `UNKNOWN` and request additional evidence.

------------------------------------------------------------------------

## 18. Evidence Labels

Every significant conclusion should conceptually belong to one of four
evidence types.

### OBSERVED

Directly visible.

Example:

``` text
The product gallery is positioned to the left of the product information.
```

### ESTIMATED

Visible but numerically approximated.

Example:

``` text
Content max-width appears approximately 1400px.
```

### ASSUMPTION

Inferred behavior not visible in supplied evidence.

Example:

``` text
On mobile, the two columns likely stack.
```

### VERIFIED_PROJECT_CONTEXT

Confirmed by authoritative project material.

Example:

``` text
This logo asset is the approved Calder primary logo.
```

Never silently convert an assumption into an observed fact.

------------------------------------------------------------------------

# PART X --- PASS / FAIL WORKFLOW

## 19. Page Lifecycle

Every page moves through these states:

``` text
NOT_INSPECTED
      ↓
SPEC_CREATED
      ↓
SPEC_REVIEWED
      ↓
READY_FOR_IMPLEMENTATION
      ↓
IMPLEMENTING
      ↓
READY_FOR_VISUAL_QA
      ↓
REVISION_REQUIRED ───────────────┐
      ↓                          │
IMPLEMENTING_CORRECTION          │
      ↓                          │
READY_FOR_VISUAL_QA ─────────────┘
      ↓
PASS_WITH_MINOR_NOTES
      or
PASS
      ↓
ACCEPTED
```

`BLOCKED` may occur from inspection, implementation, or QA when required
evidence or functionality is unavailable.

------------------------------------------------------------------------

## 20. Initial Specification Gate

A page is `SPEC_REVIEWED` only when:

-   valid JSON exists;
-   matching Markdown exists;
-   section hierarchy is complete;
-   important components have bounding boxes;
-   significant measurements include confidence;
-   responsive assumptions are labeled;
-   uncertainties are explicit;
-   no obvious contradiction exists between screenshot, JSON, and
    Markdown.

------------------------------------------------------------------------

## 21. Implementation Gate

A page is `READY_FOR_VISUAL_QA` only when:

-   the target page renders;
-   major required sections exist;
-   known functionality remains operational;
-   no obvious build/theme errors remain;
-   a screenshot has been captured at the target viewport;
-   the render filename follows the QA convention.

Visual QA should not be used as a substitute for basic implementation
debugging.

------------------------------------------------------------------------

## 22. Structural Pass

Structural pass requires:

-   correct major sections;
-   correct section ordering;
-   correct primary grid/layout model;
-   no missing dominant components;
-   no major extra components contradicting the reference;
-   core page purpose represented correctly.

Structural failure automatically prevents final `PASS`.

------------------------------------------------------------------------

## 23. Visual Pass

Visual pass evaluates:

-   geometry;
-   relative scale;
-   alignment;
-   spacing;
-   typography hierarchy;
-   color relationships;
-   image treatment;
-   component styling;
-   major visual relationships.

The goal is **high visual fidelity**, not arbitrary literal coordinate
reproduction.

------------------------------------------------------------------------

## 24. Final Status Rules

### PASS

Requirements:

-   structural pass = true;
-   visual pass = true;
-   zero CRITICAL issues;
-   zero HIGH issues;
-   no unresolved material structural mismatch;
-   no actionable MEDIUM issue that materially changes the approved
    composition;
-   remaining differences are negligible browser/rasterization
    differences or accepted tolerances.

### PASS_WITH_MINOR_NOTES

Requirements:

-   structural pass = true;
-   zero CRITICAL issues;
-   zero HIGH issues;
-   only LOW or informational items remain;
-   page is visually faithful enough for acceptance;
-   remaining items are optional polish.

### REVISION_REQUIRED

Use when:

-   any CRITICAL issue remains;
-   any HIGH issue remains;
-   actionable MEDIUM differences materially affect fidelity;
-   structural pass is false;
-   implementation clearly diverges from the approved design.

### BLOCKED

Use when comparison cannot be reliably completed because of:

-   missing reference;
-   missing implementation render;
-   incorrect page/state;
-   unavailable required asset;
-   severe runtime failure;
-   incompatible viewport evidence;
-   other missing evidence preventing reliable judgment.

------------------------------------------------------------------------

# PART XI --- CORRECTION LOOP

## 25. OpenCode Correction Protocol

When a correction file returns `REVISION_REQUIRED`, OpenCode must:

1.  read the complete correction JSON;
2.  prioritize by severity:
    -   CRITICAL;
    -   HIGH;
    -   MEDIUM;
    -   LOW;
3.  inspect the existing implementation before editing;
4.  apply the smallest coherent set of changes;
5.  preserve items listed in `preserve`;
6.  avoid touching components already identified as matching unless
    required by a dependency;
7.  validate functionality;
8.  generate the next render;
9.  increment the iteration number;
10. submit the new render for Visual QA.

Example:

``` text
home.correction.v1.json
        ↓
OpenCode patch
        ↓
home.implementation.v2.png
        ↓
Visual QA
        ↓
home.correction.v2.json
```

Continue until `PASS` or an explicitly accepted `PASS_WITH_MINOR_NOTES`.

------------------------------------------------------------------------

## 25.1 Correction Execution Traceability

Each correction item must retain its QA identifier through implementation.

OpenCode should record execution results in its implementation summary:

``` text
QA-HOME-001
Status: APPLIED
Files:
- sections/calder-hero.liquid
- assets/calder-home.css

QA-HOME-002
Status: APPLIED
Files:
- assets/calder-home.css

QA-HOME-003
Status: DEFERRED
Reason:
Correction conflicts with existing Shopify fitment behavior and requires
implementation review.
```

Allowed implementation statuses:

``` text
APPLIED
PARTIALLY_APPLIED
DEFERRED
BLOCKED
NOT_APPLICABLE
```

A correction must not silently disappear between QA and the next render.

The traceability chain is:

``` text
SOL OBSERVATION
      ↓
QA CORRECTION ID
      ↓
OPENCODE ACTION
      ↓
FILES CHANGED
      ↓
NEW RENDER
      ↓
SOL VERIFICATION
```

When a correction is deferred or blocked, the next QA package must include that
fact so the issue is not mistaken for a regression or forgotten.

------------------------------------------------------------------------

## 26. Correction Priority

OpenCode should generally fix issues in this order:

``` text
1. STRUCTURE
2. GRID / major geometry
3. POSITION / SIZE
4. ALIGNMENT
5. SPACING
6. TYPOGRAPHY hierarchy
7. IMAGERY / CROP / OVERLAY
8. COLOR / BACKGROUND
9. BORDER / RADIUS / SHADOW
10. LOW-level polish
```

Do not spend time perfecting a 2px border discrepancy while a major
column ratio is wrong.

------------------------------------------------------------------------

# PART XII --- VISUAL FIDELITY PRINCIPLES

## 27. Relationship-First Implementation

Bounding boxes are evidence, not a request to absolutely position the
entire page.

Prefer preserving relationships such as:

``` text
headline left edge
=
section content left edge
=
fitment control left edge
```

rather than independently hard-coding three x-coordinates.

Prefer:

``` text
max-width container + grid
```

over:

``` text
position:absolute
```

unless the design genuinely uses layering/overlap.

------------------------------------------------------------------------

## 28. Measurement Tolerance

The inspector should use sensible tolerance ranges.

Examples:

``` text
section height:
760-820px

headline:
64-72px

desktop gutter:
96-128px

column split:
44/56 to 47/53
```

OpenCode should implement the layout system that reproduces the visual
relationship, not mechanically select the midpoint of every range.

------------------------------------------------------------------------

## 29. Typography Rule

Visual QA should prioritize:

1.  hierarchy;
2.  relative scale;
3.  weight;
4.  line wrapping;
5.  line height;
6.  letter spacing;
7.  exact raster appearance.

Browser/font-rendering differences alone should not fail a page.

------------------------------------------------------------------------

## 30. Imagery Rule

For imagery, prioritize:

1.  correct asset;
2.  subject prominence;
3.  aspect ratio;
4.  crop;
5.  object position;
6.  overlay;
7.  brightness/contrast relationship.

Do not use generated replacement imagery when an approved or supplied
Calder asset is required.

------------------------------------------------------------------------

# PART XIII --- SHARED COMPONENT GOVERNANCE

## 31. Shared Component Rule

When a component appears across pages, the first accepted implementation
should become the baseline shared implementation where appropriate.

Examples may include:

-   global header;
-   navigation;
-   footer;
-   buttons;
-   content containers;
-   fitment controls;
-   breadcrumbs;
-   progress indicators;
-   common product cards;
-   dealer portal navigation.

If a later page requires a legitimate variant, implement a controlled
variant rather than duplicating the entire component without reason.

------------------------------------------------------------------------

## 32. Cross-Page Regression Rule

A correction to one shared component must not silently degrade already
accepted pages.

After modifying a shared component:

1.  identify accepted pages using it;
2.  determine whether the change can affect them;
3.  rerender affected pages when the change is material;
4.  visually revalidate them as necessary.

------------------------------------------------------------------------

# PART XIV --- RESPONSIVE WORKFLOW

## 33. Desktop Reference vs Responsive Implementation

When only desktop approved mockups exist:

-   desktop reference is authoritative;
-   mobile/tablet behavior is implementation inference;
-   responsive behavior should follow established Calder/theme patterns;
-   responsive assumptions must remain documented.

Once a responsive screenshot is explicitly approved, it becomes visual
authority for that viewport class.

------------------------------------------------------------------------

## 34. Recommended QA Viewports

When responsive designs are not explicitly supplied, use a consistent
internal test matrix.

Example:

``` text
Desktop reference viewport
Desktop wide
Tablet
Mobile large
Mobile standard
```

The exact test widths should be established by the implementation
project rather than inferred from the screenshot.

The approved screenshot viewport remains the primary pixel-fidelity
comparison.

------------------------------------------------------------------------

# PART XV --- HUMAN REVIEW CHECKPOINTS

## 35. Human Review Is Required At

### Initial baseline creation

Review the six generated visual specs before implementation.

### First major page implementation

Home should receive careful review because it establishes shared visual
patterns.

### Shared component changes

Review material header/footer/navigation changes.

### Final acceptance

Review the final accepted renders against the approved mockups.

The inspector assists judgment; it does not replace the approved design
authority.

------------------------------------------------------------------------

# PART XVI --- RECOMMENDED EXECUTION ORDER

## 36. Initial Calder Sequence

``` text
PHASE A — BASELINE

1. Initialize one state manifest for each page.
2. Inspect all six approved mockups with GPT-5.6 Sol.
3. Generate six JSON specs.
4. Generate six Markdown specs.
5. Run deterministic visual-spec validation.
6. Review cross-page shared components.
7. Freeze accepted baseline specs and advance state to READY_FOR_IMPLEMENTATION.

PHASE B — THEME AUDIT

8. OpenCode reads the page state before other generated artifacts.
9. OpenCode audits Working Theme-via-CLI.
10. Review ws1-activation-guide.md.
11. Review component assessment.
12. Map visual-spec components to existing theme components.
13. Classify every requirement as REUSE / RESTYLE / EXTEND / CREATE.

PHASE C — IMPLEMENTATION

14. Implement shared/global foundations.
15. Implement Home.
16. Render Home and update the state manifest.
17. Run Visual QA using a neutral evidence package.
18. Validate correction JSON.
19. Apply corrections with QA-ID traceability.
20. Correct until accepted.
21. Continue page-by-page.

PHASE D — CROSS-PAGE VALIDATION

22. Validate shared components.
23. Check regressions.
24. Validate responsive behavior.
25. Validate Shopify functionality.

PHASE E — FINAL VISUAL ACCEPTANCE

26. Capture final renders.
27. Run final Sol visual comparison.
28. Resolve material differences.
29. Validate final state manifests.
30. Freeze accepted screenshots, state, and correction history.
```

------------------------------------------------------------------------

# PART XVII --- INITIAL CHATGPT INVOCATION

## 37. Recommended User Message for the First Inspection

After attaching the six approved mockups and this specification, use:

``` text
Use calder-visual-inspector.md as the governing contract for this inspection.

Perform the initial Calder Wheels visual inspection using the six attached
client-approved mockups as the visual design authority.

Analyze the complete six-page system first so that shared/global components
and cross-page visual relationships are understood consistently.

Then produce the complete inspection artifacts for:

Calder - 1 - Home.png

Return:

1. home.visual-spec.json conforming to the strict schema in the specification;
2. home.visual-spec.md conforming to the Markdown template.

Do not merely describe the screenshot.

Do not write implementation code.

Do not redesign or improve the approved mockup.

Do not invent exact values where the screenshot only supports an estimate.

Use normalized coordinates and confidence values as defined in the contract.

After the Home artifacts are reviewed, the remaining pages will be processed
using the same established visual system.
```

Then repeat for Category, Product, Cart, Checkout, and Dealer Dashboard.

------------------------------------------------------------------------

# PART XVIII --- MODEL-TO-MODEL CONTRACT SUMMARY

## 38. The Contract

The entire Calder pipeline can be reduced to this contract:

``` text
APPROVED DESIGN
      │
      ▼
GPT-5.6 SOL
VISUAL INSPECTOR
      │
      ├── visual-spec.json ───── MACHINE CONTRACT
      │
      └── visual-spec.md ─────── HUMAN REVIEW
      │
      ▼
SCHEMA VALIDATION
      │
      ▼
PAGE STATE MANIFEST
      │
      ▼
OPENCODE + DEEPSEEK
      │
      ├── audit existing theme
      ├── reuse/restyle/extend/create
      ├── preserve functionality
      └── implement
      │
      ▼
BROWSER RENDER
      │
      ▼
GPT-5.6 SOL
VISUAL QA
      │
      ├── compare reference
      ├── compare baseline spec
      ├── identify measurable deltas
      └── correction.json
      │
      ▼
OPENCODE + DEEPSEEK
      │
      └── targeted correction
      │
      ▼
RENDER AGAIN
      │
      └─────────────── LOOP
                       │
                       ▼
                 PASS / ACCEPT
```

The approved screenshot remains the ultimate visual authority.

The visual spec makes that authority machine-readable.

The correction spec makes visual discrepancies actionable.

OpenCode/DeepSeek remains responsible for implementing those
requirements inside the existing Shopify architecture without destroying
known-working progress.

------------------------------------------------------------------------

# PART XIX --- NON-NEGOTIABLE RULES

## 39. Final Rules

1.  Never ask the implementation model to infer important visual
    geometry when the visual inspector can provide it.
2.  Never treat visual estimates as exact source design tokens.
3.  Never treat responsive inference as observed design evidence.
4.  Never replace working Shopify functionality solely because styling
    differs.
5.  Never overwrite baseline visual specs during routine QA.
6.  Never overwrite QA history.
7.  Never use absolute screenshot coordinates as a substitute for sound
    responsive layout architecture.
8.  Never fix low-level polish before major structural discrepancies.
9.  Never modify a shared component without considering regressions.
10. Never declare a page visually complete before the Visual QA loop.
11. Always preserve the approved mockup as the highest visual authority.
12. Always preserve known-working theme behavior unless a documented
    requirement requires changing it.
13. Always produce structured machine-readable artifacts for
    model-to-model handoff.
14. Always record uncertainty rather than fabricating precision.
15. Always prefer targeted corrections over broad rewrites.
16. Always read the page state manifest before consuming generated page artifacts.
17. Never hand invalid JSON to the next model; schema validation is a workflow gate.
18. Never allow OpenCode to choose a correction artifact by filename guessing; use
    `latest_correction` from the state manifest.
19. Always preserve QA correction IDs through implementation so each change is
    traceable to files modified and the next render.
20. Always perform full-page QA on every iteration; prior corrections must not
    narrow the inspector's attention to previously known defects.

------------------------------------------------------------------------

**End of Calder Visual Inspector Specification --- Version 1.1**
