# Calder Wheels — Live Product Visual Spec v3

## State
**READY_FOR_OPENCODE_CORRECTION → READY_FOR_VISUAL_QA_ITERATION_4**

## Authority
**Primary visual authority:** `Calder - 3 - Product(5).png`  
**Live functional authority:** Apex 201 live PDP  
**Functional reference only:** `Calder-existing-product-reference(1).png`  
**Shared authorities:** approved homepage for global brand/header/footer; approved B1 for recommendation cards; `calder-visual-inspector-v1.1.md` as governing contract.

## Governing rule
**C1 mockup = presentation. Apex 201 = real data. Live systems = behavior.**

Do not hardcode C1 data into Apex 201. Native Lumia may remain infrastructure, but its presentation does not override the approved screenshot.

## P0 — Hero
Use the 1178px Calder desktop container. Match the approved large near-square product gallery + thumbnail strip and coherent right configuration panel. Right hierarchy: identity/construction, tagline/description, review/SKU, Made to Order, compact fitment, Diameter/Width, Finish/swatches, application, quantity/price, gold Add to Cart, Save/Share, trust row. Use actual Shopify product media/data.

## P0 — Build Your Wheel
Preserve Center Finish, Barrel/Lip Finish, Hardware/Rivet Finish, configured preview, availability, configured price, configured Add to Cart, Request Quote, and existing bindings. Change presentation only: substantial preview left, refined controls right, light Calder surfaces, navy typography, gold selection states.

## P0 — Fitment
Do not duplicate the engine. Selected vehicle uses compact hero `Fits Your Vehicle`; Change Vehicle/full Year→Make→Model→Generation flow continues through the existing system. Standalone finder may remain but should be subordinate.

## Specifications + Engineering
Specifications: approved Product Details/table hierarchy, alternating subtle rows, dynamic data. Engineering: one image-led dark manufacturing panel with heading/copy and four capabilities along the bottom.

## P0 — Available Finishes
Match `AVAILABLE FINISHES / CHOOSE YOUR FINISH`: large wheel/finish renders, labels, gold selected state, real/configured finish data. No generic photography.

## P0 — Real World
Four landscape automotive lifestyle images on desktop, approved heading/copy/View Gallery hierarchy. No empty final placeholders.

## P0 — Recommendations
Reuse the actual shared approved B1 Calder card with Shopify recommendation products and real wheel media.

## Specialist CTA + Footer
Match the approved full-width image-backed `NEED HELP WITH FITMENT? / CONTACT A WHEEL SPECIALIST` composition and reuse the approved homepage footer.

## P0 — Storefront code defect
Search for `{# ... #}` development comments. They are not valid Liquid comments. Remove them or convert them to Liquid `{% comment %}` blocks. Final storefront must contain zero `{#` markers.

## Responsive
Validate 1440, 768 and 390px. Do not shrink desktop merely to shorten screenshots. Tablet should deliberately reflow; mobile uses a clear single column and horizontal scrollers where useful. No page-level horizontal overflow.

## Non-regression
Preserve product forms/variants, quantity, pricing, product media, Add to Cart, Save/Share, Build Your Wheel, configured cart/quote, Fitment API/state/dependencies, recommendations and Theme Editor compatibility.

## Required output
`product.desktop.v4.png`, `product.tablet.v4.png`, `product.mobile.v4.png`

Finish at **READY_FOR_VISUAL_QA_ITERATION_4**, not ACCEPTED.
