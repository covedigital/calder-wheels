TASK: PRODUCT_HIGH_FIDELITY_CORRECTION_V1

PROJECT: Calder Wheels
STATE INPUT: REVISION_REQUIRED

READ FIRST:
- product.visual-correction.v1.json
- product.visual-correction.v1.md
- product.visual-spec.v1.json
- product.visual-spec.v1.md

IMAGE AUTHORITIES:
- APPROVED VISUAL AUTHORITY: `Calder - 3 - Product(3).png`
- FUNCTIONAL REFERENCE ONLY: `Calder-existing-product-reference(1).png`
- CURRENT FAILED RENDERS: `product.desktop.v1.png`, `product.tablet.v1.png`, `product.mobile.v1.png`

GOAL:
Correct the existing v1 product implementation so it materially converges on the APPROVED PRODUCT MOCKUP.

This is a HIGH-FIDELITY CORRECTION, not a redesign and not a minor CSS polish pass.

==================================================
CRITICAL CORRECTION TO THE V1 ARCHITECTURE DECISION
==================================================

Your v1 report states that native Lumia `main-product.liquid` is the foundation and that CSS restyling is sufficient.

That implementation constraint is now REJECTED where it prevents visual fidelity.

You MAY continue reusing native Shopify/Lumia behavior, forms, Liquid data, controllers and events. However, native Lumia markup/order/presentation is NOT authoritative.

If necessary to match the approved mockup:
- add Calder-specific wrappers;
- create Calder presentation snippets;
- render/reorder native block data in Calder-specific markup;
- alter the `product.calder` template composition;
- create a Calder-specific hero presentation while retaining native product form behavior;
- restructure sections without duplicating business logic.

Do not preserve a visibly incorrect layout merely because it is native Lumia.

==================================================
1. FIX THE GLOBAL VISUAL SYSTEM FIRST
==================================================

The approved PDP is NOT a dark page.

Replace the v1 page-wide black/dark treatment with the approved system:
- white/light main surfaces;
- navy Calder headings/text;
- subtle light gray dividers/panels;
- restrained Calder gold accents;
- dark navy only where the approved mockup explicitly uses it, especially branded CTA/footer areas.

Use the approved mockup itself for section backgrounds and contrast decisions.
Do not extrapolate the dark styling of the old functional reference.

==================================================
2. REMOVE UNRELATED PLACEHOLDER MEDIA
==================================================

The aurora/scenic hero, chair image, bridge, flower, rocks, etc. are visually invalid for this PDP.

Product gallery:
- render actual `product.media`;
- preserve thumbnail behavior;
- no unrelated fallback photography.

Recommendations:
- render actual recommended wheel product media through the approved B1 card.

Configurator:
- use the existing configured-wheel preview/media logic.

Real World:
- use section-configured lifestyle imagery/product lifestyle media.
- If merchant imagery is not configured, do not invent random stock imagery as final fidelity.

The approved mockup communicates a wheel/luxury-automotive merchandising page. The corrected render must do the same.

==================================================
3. RECONSTRUCT THE HERO TO THE APPROVED COMPOSITION
==================================================

At 1440px, match the approved composition closely:

LEFT:
- large primary product image/gallery;
- thumbnail row;
- comparable gallery-to-info width ratio.

RIGHT:
- C1-style product title hierarchy driven dynamically;
- construction/category label;
- tagline/short description;
- review + SKU metadata;
- made-to-order indicator;
- approved light `Fits Your Vehicle` status panel;
- Diameter and Width controls;
- Finish control + swatches;
- Vehicle Fitment/Application;
- Quantity and price aligned as shown;
- full-width gold Add to Cart;
- Save and Share secondary buttons;
- trust row below.

Do not compress this into the small dark control stack from v1.

==================================================
4. BUILD YOUR WHEEL — PRESERVE LOGIC, MIGRATE PRESENTATION
==================================================

Do NOT remove or rewrite the existing wheel configurator.

Preserve:
- Center Finish;
- Barrel/Lip Finish;
- Hardware/Rivet Finish;
- configured preview;
- availability/lead time;
- configured price;
- Add Configured Wheel to Cart;
- Request Quote;
- all state/data/event bindings.

But the v1 large dark configurator is not visually accepted.

Integrate the configurator into the approved light Calder PDP.

The approved `AVAILABLE FINISHES / CHOOSE YOUR FINISH` section is the primary visual direction. Use wheel imagery and gold selected states where product/configurator media supports them.

If the three independent finish dimensions cannot honestly be represented by one carousel, preserve them in a refined multi-group configurator immediately associated with the finish showcase. Fidelity does NOT mean deleting necessary functionality.

==================================================
5. FITMENT — PRESERVE ENGINE, CHANGE NORMAL PRESENTATION
==================================================

Do NOT replace the fitment engine.

Normal selected state:
- compact approved `FITS YOUR VEHICLE` panel in hero.

No selected vehicle / Change Vehicle:
- reveal/use the existing Year → Make → Model → Generation/Trim workflow;
- restyle it in the light Calder system;
- maintain existing dependencies and data source.

The full selector must not permanently dominate the PDP when a vehicle is already confirmed.

==================================================
6. REBUILD LOWER SECTIONS
==================================================

SPECIFICATIONS:
Match approved light striped/table treatment and typography.

ENGINEERED TO PERFORM:
The v1 stack of small dark feature boxes is not the approved design.
Create the large image-led panel shown in the mockup with:
- heading;
- supporting copy;
- manufacturing imagery configurable through section settings;
- four capability/icon items.

AVAILABLE FINISHES:
This section is materially missing in v1.
Implement the approved wheel-finish carousel/showcase with selected gold border and labels, bound to configurator/product state where appropriate.

REAL WORLD:
Replace empty dark boxes with configured landscape imagery and approved heading/subheading/View Gallery treatment.

YOU MAY ALSO LIKE:
Use the ACTUAL approved shared B1 Calder card.
Do not create a visually similar substitute.
Use actual recommendation product images/data.
Match the approved light four-card desktop composition.

SPECIALIST CTA:
Replace the tiny centered v1 CTA with the established approved Calder image-led specialist CTA:
- dark navy/image background;
- left heading/copy;
- right gold Get in Touch;
- contact methods.

FOOTER:
Render/reuse the approved global Calder footer from the homepage.

==================================================
7. RESPONSIVE CORRECTION
==================================================

Required captures:
- desktop: 1440px
- tablet: 768px
- mobile: 390px

The current tablet capture is not accepted as a tablet composition.

At 768:
- use the full viewport;
- preserve two-column structures where readable;
- intentionally stack hero/configurator where necessary;
- avoid tiny desktop typography;
- avoid narrow centered content strips.

At 390:
- use full available width with appropriate page gutters;
- maintain readable type;
- stack hero logically;
- allow thumbnail/finish/gallery/recommendation horizontal scrolling where useful;
- no horizontal page overflow.

==================================================
8. DO NOT REGRESS FUNCTIONALITY
==================================================

Before and after the correction, verify:
- product variants/options;
- normal Add to Cart;
- quantity;
- wheel configurator selections;
- configured preview;
- configured price/availability;
- configured Add to Cart;
- Request Quote;
- fitment dependency chain;
- confirmed fitment state;
- Change Vehicle;
- recommendation links/cards.

No duplicate configurator.
No duplicate fitment engine.
No hardcoded product/vehicle/price IDs.

==================================================
9. VALIDATE AGAINST THE IMAGE, NOT THE V1 IMPLEMENTATION
==================================================

During implementation repeatedly compare the page to:
`Calder - 3 - Product(3).png`

The v1 renders are NOT references to preserve.

Prioritize in this order:
1. color system/backgrounds;
2. product imagery/media correctness;
3. macro layout and section order;
4. hero proportions/configuration hierarchy;
5. Build Your Wheel visual integration;
6. Fitment integration;
7. lower-section composition;
8. typography;
9. spacing/borders/micro-details.

Do not spend time micro-tuning a structurally incorrect dark layout.

==================================================
DELIVERABLE
==================================================

Return:
1. correction status;
2. issue IDs resolved from `PDP-V1-001` through `PDP-V1-013`;
3. files changed;
4. structural changes made beyond CSS;
5. Build Your Wheel preservation notes;
6. Fitment preservation notes;
7. media/data-source corrections;
8. Theme Check result;
9. functional smoke-test result;
10. remaining known deviations;
11. new renders:
   - `product.desktop.v2.png`
   - `product.tablet.v2.png`
   - `product.mobile.v2.png`
12. state: `READY_FOR_VISUAL_QA_ITERATION_2`

Do NOT self-mark the page ACCEPTED.
