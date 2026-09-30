TASK: COLLECTION_VISUAL_CORRECTION_V2
PROJECT: Calder Wheels
PAGE: Collection / Category Page
PAGE KEY: collection
SOURCE IMPLEMENTATION: v2
TARGET IMPLEMENTATION: v3

OBJECTIVE
Apply only the bounded corrections in:
- docs/design/visual-inspector/qa/corrections/collection.correction.v2.json
- docs/design/visual-inspector/qa/corrections/collection.correction.v2.md

This is a correction pass, not a redesign, baseline reinspection, or broad theme refactor.

READ FIRST
1. docs/design/visual-inspector/calder-visual-inspector-v1.1.md
2. docs/design/visual-inspector/state/collection.state.json
3. docs/design/visual-inspector/qa/corrections/collection.correction.v2.json
4. docs/design/visual-inspector/qa/corrections/collection.correction.v2.md
5. docs/design/visual-inspector/visual-specs/collection.visual-spec.json
6. docs/design/visual-inspector/visual-specs/collection.visual-spec.md
7. docs/design/mockups/approved-mockups/Calder - 2 - Category.png
8. current v2 Collection implementation and relevant accepted shared components

STATE CHECK
Expected status: REVISION_REQUIRED
Expected current_iteration: 2
Expected latest correction: collection.correction.v2.json after registering this QA correction.
If state/artifact versions conflict, stop and report it.

PRIORITY ORDER
HIGH:
COL-V2-001 capture pipeline
COL-V2-002 desktop results architecture
COL-V2-003 B1 integration
COL-V2-004 footer/trailing whitespace
COL-V2-005 hero assets

MEDIUM:
COL-V2-006 category imagery
COL-V2-007 help CTA imagery/alignment
COL-V2-008 fitment final geometry
COL-V2-009 newsletter/footer transition

COL-V2-001 — CAPTURE PIPELINE
The files that reached Sol did not match the dimensions reported by OpenCode. Trace the entire path:
browser capture -> initial PNG -> any optimization/copy/export -> final repository QA path.
Do not merely verify an intermediate file.
For v3, verify metadata on the EXACT files at:
docs/design/visual-inspector/qa/renders/collection/collection.implementation.v3.desktop.png
docs/design/visual-inspector/qa/renders/collection/collection.implementation.v3.tablet.png
docs/design/visual-inspector/qa/renders/collection/collection.implementation.v3.mobile.png
Required final widths: 1440 / 768 / 390. Do not post-scale. Do not use CSS zoom to fake viewport width.

COL-V2-002 — RESULTS ARCHITECTURE
Before changing CSS, inspect the live rendered DOM and computed styles at 1440px.
Trace:
collection results wrapper
→ product grid section
→ product list
→ product item
→ calder-product-card
For each level record:
display
computed width
grid-template-columns if applicable
flex/flex-basis
min-width
max-width
relevant Bootstrap/Lumia classes
overflow
Identify the FIRST ancestor that constrains the results/card area.
The target is:
[ persistent filter rail ] [ results column: toolbar + 3 equal B1 columns ]
inside the established Calder container.
Do not add arbitrary card widths to mask a broken parent layout.

COL-V2-003 — B1 INTEGRATION
Keep calder-product-card internals unchanged.
Verify its stylesheet is loaded on Collection.
Verify product image markup/data is present and image is not hidden by parent rules.
Remove/narrow Lumia/Bootstrap collection-item rules that conflict with B1 wrappers.
At desktop, three B1 cards must render at normal proportions with visible wheel imagery, fitment/status treatment, concise metadata, price, and full-width CTA.
Do not create a new Collection card.

COL-V2-004 — FOOTER
The v2 render still shows a giant white trailing region and no complete dark footer.
Compare Collection template order with the accepted Home implementation.
Audit the recently added collection-negative-space/index-negative-space section. If that spacer is not required by the approved Collection reference, remove it from Collection.
Inspect actual footer DOM and computed:
display, visibility, background, color, height/min-height, margin/padding, position.
Target:
newsletter/benefits → complete dark Calder footer
with no artificial blank region.
Do not redesign footer.liquid.

COL-V2-005 — HERO ASSETS
V2 cannot mark the hero correction resolved while hero_image/decorative_image are empty.
Inventory existing theme/Shopify Calder assets first.
Assign suitable existing scenic mountain/road imagery and wheel/vehicle imagery that best reproduce the approved reference.
Do not generate substitute imagery.
If no suitable existing asset exists, mark this correction BLOCKED and state exactly which asset is missing rather than calling it resolved.

COL-V2-006 — CATEGORY IMAGERY
Inventory and assign suitable existing image assets to the five category tiles.
Keep current icons, labels, links, and active-state logic.
If suitable assets do not exist, report BLOCKED/PARTIAL rather than resolved.

COL-V2-007 — HELP CTA
Assign existing suitable background/decorative wheel assets if available.
After results architecture is corrected, align CTA to the results column only—not underneath the filter rail.
Do not rebuild CTA behavior.

COL-V2-008 — FITMENT
Preserve the improved two-row v2 implementation and all fitment functionality.
At true desktop, tune only width/spacing/hero overlap/status-reset presentation needed to match the approved reference.
Do not rewrite fitment-finder.js, fitment-data, CALDER_FITMENT_API, or window.__fitmentData.

COL-V2-009 — NEWSLETTER
Retain the accepted scenic Home newsletter treatment.
Ensure desktop horizontal composition/benefit row survives and transitions directly into the full footer.
Do not modify shared newsletter internals unless a verified shared bug exists.

PROTECTED COMPONENTS
Do not broadly modify:
- accepted Home
- global header
- footer internal design
- B1/calder-product-card internal design
- fitment engine/data
- home-newsletter internal design
- global design tokens

VALIDATION
After fixes run:
1. Shopify Theme Check
2. Liquid/JSON validation
3. JS syntax validation if JS changed
4. git diff review
5. filter/facet functionality
6. sorting
7. pagination/infinite scroll
8. fitment regression
9. B1 regression
10. Home regression
11. footer regression
12. newsletter regression
13. desktop/tablet/mobile overflow check

Separate new issues from pre-existing warnings.

REQUIRED V3 RENDERS
Capture full-page browser screenshots at real viewport widths:
Desktop 1440
Tablet 768
Mobile 390

Save EXACTLY:
docs/design/visual-inspector/qa/renders/collection/collection.implementation.v3.desktop.png
docs/design/visual-inspector/qa/renders/collection/collection.implementation.v3.tablet.png
docs/design/visual-inspector/qa/renders/collection/collection.implementation.v3.mobile.png

After every write/copy/export is complete, inspect those exact final files and report their PNG pixel dimensions.

STATE
At start: REVISION_REQUIRED -> IMPLEMENTING
After successful corrections/validation/final captures:
IMPLEMENTING -> READY_FOR_VISUAL_QA
Set current_iteration: 3
Set current_render to collection.implementation.v3.desktop.png
Keep latest_correction pointing to collection.correction.v2.json
Keep accepted_render: null
Do not mark PASS/ACCEPTED.

FINAL REPORT
For each COL-V2-001 through COL-V2-009 report RESOLVED / PARTIALLY RESOLVED / BLOCKED with evidence.
Also report:
- root cause of collapsed results layout, including first constraining ancestor
- DOM/computed-style findings
- B1 stylesheet/render-path findings
- footer/negative-space root cause
- asset inventory and exact assets assigned
- files modified
- protected shared components modified (should normally be none)
- validation results
- exact FINAL v3 PNG dimensions from the repository paths
- unresolved issues
- final state
- READY FOR SOL VISUAL QA ITERATION 3: YES/NO

Do not generate a new design mockup. Do not visually self-approve v3.
