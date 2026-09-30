# Calder Wheels — Product Design-Scheme Correction v4

## Status
**REVISION_REQUIRED → target READY_FOR_VISUAL_QA_ITERATION_5**

The live PDP now contains the expected functional sections. This pass is therefore **not an architecture rebuild**. It is a visual-system correction.

## Authority
- `Calder - 3 - Product(5).png` — visual source of truth.
- Live Apex 201 PDP — real product data and functional source of truth.
- `Calder-existing-product-reference(1).png` — Build Your Wheel/Fitment behavioral reference only.
- Approved homepage — global header/footer/brand authority.
- Approved B1 card — recommendation-card authority.

**Mockup controls presentation. Apex controls product data. Existing systems control behavior.**

## Global design scheme — P0
Match the approved white/light merchandising surface, navy typography, restrained cool-gray rules/panels and Calder-gold actions/selection. Dark navy belongs only where the approved reference uses it: global header, Engineered to Perform, specialist CTA and footer.

Use established Calder tokens and 1178px desktop container. Headings use Facundo; UI/body uses Garet with Poppins fallback. Do not reduce component scale simply to shorten screenshots.

## Hero — P0
Preserve real Apex media/data. Match the approved gallery-to-configuration proportions, large near-square media, thumbnail strip, right-side information hierarchy, fitment confirmation, controls, quantity/price, gold Add to Cart, Save/Share and trust row.

## Build Your Wheel — P0
Preserve all existing configurator logic. Restyle into a premium light Calder configuration experience: substantial wheel preview, disciplined two-column desktop composition, refined finish selectors, navy labels and gold active states. Do not revert to Lumia styling.

## Fitment
Compact selected-vehicle state should use the approved pale-green confirmation language. Full finder remains the existing selection/change workflow but is visually subordinate.

## Specifications + Engineering
Specifications: Product Details eyebrow, strong navy heading, subtle alternating rows.

Engineering: one dark image-backed manufacturing panel—not generic stacked cards—with white heading/copy and four capability icons along the bottom.

## Available Finishes — P0
Match the approved `AVAILABLE FINISHES / CHOOSE YOUR FINISH` wheel-render showcase. Use actual/configured wheel finish imagery, large wheel renders, labels and gold selected state. Generic photo cards are not acceptable.

## Real World — P0
Match the approved four-wide automotive lifestyle gallery. Use configured real images. Empty boxes are not an acceptable final state.

## Recommendations — P0
Reuse the actual approved shared B1 visual system with real recommended wheel products/media. White cards, wheel-dominant imagery, navy product identity and restrained action treatment.

## Specialist CTA + Footer — P0
Match the approved full-width dark image-backed `NEED HELP WITH FITMENT? / CONTACT A WHEEL SPECIALIST` banner with gold CTA and contact methods. Reuse the approved homepage footer.

## Source hygiene — P0
The live page still exposes `{# ... #}` development markers. Remove them or convert them to valid Liquid `{% comment %}` blocks. Final storefront output must contain zero `{#` markers.

## Responsive
Validate 1440 / 768 / 390. Maintain the same visual language and useful scale through deliberate reflow; no page-level horizontal overflow.

## Non-regression
Do not break or duplicate product forms, variants, real Apex data/media, quantity, cart, Save/Share, Build Your Wheel, configured cart/quote, Fitment engine/state, recommendations or Theme Editor settings.

## Required renders
- `product.desktop.v5.png`
- `product.tablet.v5.png`
- `product.mobile.v5.png`

Finish at **READY_FOR_VISUAL_QA_ITERATION_5**, not ACCEPTED.
