# Calder Collection — Correction v2 → Implementation v3

**QA result:** `REVISION_REQUIRED`  
**Current QA iteration:** 2  
**Target implementation:** v3

## Priority

### HIGH
- **COL-V2-001 — Final QA artifact dimensions:** trace the complete screenshot pipeline. Verify the exact final repository PNGs after the last copy/export operation. Required widths: desktop 1440, tablet 768, mobile 390.
- **COL-V2-002 — Desktop results architecture:** inspect the rendered DOM/computed parent width chain. Restore persistent left facets + wide right results area + exactly three product columns. Do not solve this by piling card-level CSS onto a broken parent.
- **COL-V2-003 — B1 integration:** `calder-product-card` is currently compressed and visually broken. Preserve B1 internals; correct wrapper/item sizing, stylesheet integration, and conflicting Lumia/Bootstrap rules.
- **COL-V2-004 — Footer:** remove/diagnose the artificial blank region. Compare Collection template order with accepted Home. The approved Collection does not contain a giant white spacer between newsletter and footer.
- **COL-V2-005 — Hero assets:** supporting settings are not enough. Assign existing project/Shopify scenic and wheel/vehicle imagery so the photographic hero actually renders.

### MEDIUM
- **COL-V2-006 — Category tiles:** assign existing photographic tile backgrounds.
- **COL-V2-007 — Help CTA:** assign existing background/decorative imagery and re-align after the results grid is fixed.
- **COL-V2-008 — Fitment:** retain the improved structure; only tune geometry after parent/hero layout stabilizes.
- **COL-V2-009 — Newsletter:** retain the scenic shared treatment and fix its transition into the footer.

## Diagnostic rule
For the product area, inspect the actual browser DOM and computed styles before editing. Trace:

`collection results wrapper → product grid section → product list → product item → calder-product-card`

Record width, display, grid/flex properties, flex-basis, min/max width, and inherited Lumia/Bootstrap classes at each level. Identify the first ancestor that constrains the grid.

## Asset rule
Inventory existing Calder assets in the working theme/Shopify configuration before requesting or creating imagery. Do not generate substitute imagery. A correction requiring imagery is not `RESOLVED` while its setting remains empty.

## Protected components
Do not redesign or broadly modify the accepted Home, global header, footer internals, B1 internals, fitment engine/data, shared newsletter internals, or global design tokens.

## State after OpenCode completes v3
`IMPLEMENTING → READY_FOR_VISUAL_QA`

Set `current_iteration: 3` and:

`current_render: docs/design/visual-inspector/qa/renders/collection/collection.implementation.v3.desktop.png`

Keep `latest_correction` pointing to `collection.correction.v2.json`; keep `accepted_render: null`.

## Required v3 renders
- `collection.implementation.v3.desktop.png` — exact final width **1440px**
- `collection.implementation.v3.tablet.png` — exact final width **768px**
- `collection.implementation.v3.mobile.png` — exact final width **390px**

Verify metadata on those exact final files after all writes/copies.
