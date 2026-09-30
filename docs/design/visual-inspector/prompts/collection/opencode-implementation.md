# OpenCode — Calder Collection Page Implementation

TASK: IMPLEMENT_COLLECTION_PAGE

Read and obey the Calder Visual Inspector v1.1 workflow. The approved Collection mockup is the visual authority for collection-specific composition. The current accepted Home implementation is the authority for shared Calder design-system behavior.

## Inputs
- `docs/design/mockups/approved-mockups/Calder - 2 - Category.png`
- `docs/design/visual-inspector/visual-specs/collection.visual-spec.json`
- `docs/design/visual-inspector/visual-specs/collection.visual-spec.md`
- current accepted Home implementation/spec
- existing Calder brand tokens/assets
- shared B1 product-card implementation
- shared fitment implementation
- existing Lumia Shopify collection functionality
- current collection/category state manifest

## Mandatory sequence
1. Read the current page state first and confirm it is eligible for implementation.
2. Validate `collection.visual-spec.json` before consuming it.
3. Inspect the existing Shopify collection template, sections, snippets, assets, facets, sorting, pagination, breadcrumbs and product-card pipeline.
4. Inspect the accepted Home implementation and recover the ACTUAL shared values/classes for container, typography, controls, buttons, spacing, breakpoints, header, newsletter/benefits and footer.
5. Produce a component mapping before editing. Classify each requirement as `REUSE`, `RESTYLE`, `EXTEND`, or `CREATE`.
6. Reuse shared components where available. Do not fork the accepted B1 card, fitment component, header, footer, newsletter/benefits or design tokens.
7. Implement only the collection-specific presentation needed to match the approved reference.
8. Preserve dynamic Shopify collection data and existing functionality.
9. Validate, render and prepare for Visual QA.

## Non-negotiable implementation boundaries
- Do not modify the accepted Home page while implementing Collection.
- Do not modify shared components merely to make Collection fit unless the change is safe and explicitly compatible with every existing consumer.
- Do not modify fitment logic or data bindings.
- Do not replace dynamic product data with hard-coded mockup data.
- Do not hard-code screenshot product names, prices, facet counts or selected vehicle.
- Preserve filtering/facets, sorting, pagination and product links.
- Preserve Theme Editor compatibility where practical.
- Avoid global CSS regressions; scope collection-specific CSS.
- Reuse the Calder container system (`--container-max-width: 1178px` where confirmed by current source).
- Reuse existing Facundo/Garet/Poppins roles and brand tokens rather than creating near-duplicate styles.
- Preserve B1 internal card composition. Collection owns only grid placement/available card width.
- Preserve the approved composition: hero → fitment entry → five-tile category navigation → sidebar/results grid → pagination → help CTA → newsletter/benefits → footer.

## Required collection-specific targets
- Full-bleed Forged Wheels hero with content aligned to shared container.
- Compact vehicle-fitment entry overlapping the hero/listing transition, using shared fitment behavior.
- Five category tiles: All Wheels, Forged Monoblock, Forged 3-Piece, By Vehicle, By Style.
- Desktop left filter rail with Wheel Type, Diameter, Width, Bolt Pattern, Finish, Vehicle Fitment and Collection.
- Results toolbar with count, selected-vehicle state/change action, sort and grid/list controls.
- Three-column desktop B1 product grid.
- Centered pagination below grid.
- “Need help finding the right setup?” CTA aligned to the results/grid column.
- Shared newsletter/benefits/footer system.

## Responsive behavior
No approved responsive Collection reference exists. Treat responsive layout as inference. Follow accepted Home/shared-component behavior and existing Lumia functionality. Do not invent elaborate collection-only interactions. A filter drawer/trigger and reduced product columns are acceptable only as conservative adaptations of existing functionality.

## Validation
Run:
- Shopify Theme Check
- relevant JSON/schema validation
- Liquid validation
- JavaScript syntax validation if JS changes
- git diff review
- dynamic collection behavior checks
- responsive checks
- regression check confirming Home was not unintentionally changed
- confirmation that shared B1 behavior remains intact
- confirmation that fitment functionality remains intact

## Required implementation report
Return:
1. implementation summary;
2. files modified;
3. component mapping (`REUSE / RESTYLE / EXTEND / CREATE`);
4. Shopify functionality preserved;
5. QA-ID-ready implementation notes;
6. unresolved questions;
7. render paths;
8. readiness for Visual QA.

## Render outputs
At minimum:
- `docs/design/visual-inspector/qa/renders/collection.implementation.v1.desktop.png`

Where the project’s established responsive QA matrix is active, also:
- `docs/design/visual-inspector/qa/renders/collection.implementation.v1.tablet.png`
- `docs/design/visual-inspector/qa/renders/collection.implementation.v1.mobile.png`

Update state through the normal workflow to `READY_FOR_VISUAL_QA` after implementation gates pass. Do NOT mark the page accepted; acceptance occurs only after Sol Visual QA.
