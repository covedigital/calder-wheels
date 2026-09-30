TASK: PRODUCT_DESIGN_SCHEME_CORRECTION_V4
PROJECT: Calder Wheels
TARGET: https://wvpnpr-t7.myshopify.com/products/apex-201

READ FIRST:
- product.design-scheme-correction.v4.json
- product.design-scheme-correction.v4.md
- calder-visual-inspector-v1.1.md

PRIMARY VISUAL AUTHORITY:
- Calder - 3 - Product(5).png

FUNCTIONAL AUTHORITY:
- Current live Apex 201 PDP

BEHAVIORAL REFERENCE ONLY:
- Calder-existing-product-reference(1).png

OBJECTIVE:
The expected PDP components/sections now exist. Do NOT rebuild the page architecture. Correct the current live page's DESIGN SCHEME so it reasonably maintains the fidelity of the approved product-page mockup while preserving real Apex data and all working behavior.

CORE RULE:
APPROVED MOCKUP = PRESENTATION
LIVE APEX PDP = DATA + FUNCTION
EXISTING BUILD YOUR WHEEL / FITMENT = BEHAVIOR

Do not hardcode C1 sample data into Apex 201.

==================================================
1. VISUALLY COMPARE BEFORE EDITING
==================================================
Inspect the approved screenshot and live page side by side.

For every region compare:
- background/surface color
- image type and crop
- banner treatment
- typography/font/scale
- container width
- section height
- spacing
- borders/dividers
- button treatment
- selected states
- icon treatment
- content density
- alignment

Do not mark a region correct merely because its component exists.

==================================================
2. GLOBAL CALDER SCHEME
==================================================
Apply the approved scheme:
- white/light primary page surfaces
- Calder navy #0E2A3E for primary typography
- Calder gold #C2A48A for primary CTA/selected accents
- subtle cool-gray/light neutral panels and rules
- dark navy only for approved dark regions
- Facundo headings
- Garet UI/body
- Poppins fallback
- max desktop container 1178px

Remove residual Lumia/default styling that visibly conflicts with this scheme.

==================================================
3. HERO
==================================================
Keep actual Apex product.media and data.

Bring composition toward approved reference:
- large near-square gallery left
- thumbnail strip below
- coherent configuration panel right
- strong title/construction hierarchy
- description/meta
- compact fitment status
- Diameter/Width
- Finish/swatches
- application where data supports it
- quantity + dynamic price
- full-width gold Add to Cart
- Save + Share
- trust row

Do not replace Apex data with C1 sample data.

==================================================
4. BUILD YOUR WHEEL
==================================================
Do not rewrite logic.

Preserve Center, Barrel/Lip, Hardware/Rivet, preview, availability, configured price, configured cart and quote.

Correct only presentation:
- light premium surface
- larger actual wheel preview
- balanced desktop columns
- navy labels
- gold selected rings/states
- reference-comparable control scale and spacing
- visually integrate with rest of PDP

==================================================
5. FITMENT
==================================================
Preserve existing engine/dependencies.

Selected state:
approved pale-green compact `FITS YOUR VEHICLE` treatment in hero.

Unselected/change state:
existing full finder, styled as subordinate light workflow.

No second fitment implementation.

==================================================
6. SPECIFICATIONS + ENGINEERING
==================================================
Specifications:
match approved eyebrow/heading/table styling and light alternating rows.

Engineering:
rebuild presentation as ONE dark image-backed manufacturing banner/panel with white heading/copy and four bottom capability items.

Do not use generic stacked feature cards if they conflict with approved composition.

==================================================
7. AVAILABLE FINISHES
==================================================
Match approved wheel-based Choose Your Finish treatment.

Use wheel/finish media—not generic scenic/photo cards.
Large wheel renders.
Labels below.
Gold selected border/state.
Horizontal desktop showcase; controlled scroll on smaller widths.
Bind to real finish/configurator state where appropriate.

==================================================
8. REAL WORLD
==================================================
Use configured automotive lifestyle imagery.
Match approved four-wide landscape gallery and View Gallery treatment.
Do not leave empty final placeholders.

==================================================
9. RECOMMENDATIONS
==================================================
Reuse actual approved shared B1 card.
Use real Shopify recommendation wheel media/data.
Do not use a generic Quick Add card treatment if it differs from B1.

==================================================
10. SPECIALIST BANNER + FOOTER
==================================================
Match approved full-width dark/image-backed:
NEED HELP WITH FITMENT?
CONTACT A WHEEL SPECIALIST

Include gold Get in Touch action and contact methods.

Reuse approved homepage global footer rather than a PDP-specific interpretation.

==================================================
11. SOURCE HYGIENE
==================================================
The live storefront currently exposes Jinja-style markers such as:
{# === Gallery === #}
{# === Product Info === #}
and related labels.

Search all PDP files for `{#`.
Remove them or convert to valid Liquid comment blocks.

Final rendered storefront must contain ZERO `{#` markers.

==================================================
12. RESPONSIVE
==================================================
Validate 1440 / 768 / 390.
Do not miniaturize the desktop design to fit screenshot height.
Tablet/mobile should deliberately reflow while retaining the approved visual language.
No page-level horizontal overflow.

==================================================
13. NON-REGRESSION
==================================================
Preserve:
- Shopify product/variant forms
- actual Apex title/SKU/prices/media/specs
- quantity and Add to Cart
- Save/Share
- Build Your Wheel state/preview/availability/price/cart/quote
- Fitment API/dependencies/selected vehicle/Change Vehicle
- recommendations
- Theme Editor settings/schema

No duplicate configurator.
No duplicate fitment engine.

==================================================
14. VALIDATION / OUTPUT
==================================================
Run Theme Check.
Smoke-test all product/configurator/fitment/cart interactions.
Verify rendered source contains zero `{#`.

Capture:
- product.desktop.v5.png at 1440px
- product.tablet.v5.png at 768px
- product.mobile.v5.png at 390px

REPORT:
1. correction status
2. files changed
3. global scheme changes
4. hero changes
5. Build Your Wheel changes
6. Fitment changes
7. Specs/Engineering changes
8. finish showcase changes
9. Real World changes
10. B1 recommendation reuse
11. specialist/footer reuse
12. source-comment cleanup
13. responsive changes
14. Theme Check
15. smoke-test results
16. remaining deviations
17. screenshot paths

FINAL STATE:
READY_FOR_VISUAL_QA_ITERATION_5

Do not self-mark ACCEPTED.
