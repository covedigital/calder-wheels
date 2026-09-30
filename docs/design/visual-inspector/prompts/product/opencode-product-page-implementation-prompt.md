TASK: PRODUCT_PAGE_IMPLEMENTATION

PROJECT:
Calder Wheels

TARGET:
Existing Shopify Product Page

PRIMARY VISUAL AUTHORITY:
Calder - 3 - Product(2).png

FUNCTIONAL REFERENCE:
Calder-existing-product-reference.png

SUPPORTING SPECIFICATIONS:
product.visual-spec.v1.json
product.visual-spec.v1.md

GOVERNING CONTRACT:
calder-visual-inspector-v1.1.md

CROSS-PAGE AUTHORITIES:
- Approved Calder homepage implementation/design system
- Approved Calder collection-page implementation where shared patterns apply
- Approved B1 Calder product listing card for recommendation cards

OBJECTIVE:
Implement the existing Calder Shopify product page so it visually matches the approved product-page mockup while PRESERVING and INTEGRATING the existing working Build Your Wheel and Fitment systems.

CRITICAL INTERPRETATION:
The approved product mockup is the visual authority.
Calder-existing-product-reference.png is the functional reference for the existing Build Your Wheel and Fitment sections.

Do NOT treat the existing Build Your Wheel or Fitment sections as obsolete.
Do NOT replace them with static mockup controls.
Do NOT create a second configurator or second fitment engine.

The correct implementation is:
APPROVED VISUAL SYSTEM + EXISTING WORKING BUSINESS LOGIC.

==================================================
PHASE 1 — INSPECT BEFORE EDITING
==================================================

Before changing code:

1. Locate the active product template and every section/snippet/asset it renders.
2. Trace the existing Build Your Wheel implementation:
   - Liquid entry point
   - JavaScript controller/state
   - option/finish bindings
   - preview/image state
   - availability/inventory state
   - pricing state
   - add-to-cart path
   - request-quote path
   - required data attributes/events
3. Trace the existing Fitment implementation:
   - Liquid entry point
   - JS controller
   - fitment data/API source
   - Year/Make/Model/Generation or Trim dependency chain
   - selected-vehicle state
   - compatibility state
   - change/reset behavior
   - required data attributes/events
4. Identify existing shared Calder header/footer, brand tokens and B1 product card.
5. Identify what can be reused unchanged, what needs wrapper/markup adaptation, and what requires scoped CSS.

Do not begin by deleting/replacing existing sections.

==================================================
PHASE 2 — IMPLEMENT APPROVED PRODUCT STRUCTURE
==================================================

Rebuild/restyle the product page toward the approved mockup:

A. PRODUCT HERO
- Breadcrumbs
- Large gallery and thumbnails
- Product identity/title/construction
- Short product description
- rating/review metadata where data exists
- SKU
- made-to-order state
- compact fitment-confirmed panel
- Diameter / Width / Finish / Application controls as supported by product data
- Quantity
- dynamic price
- Add to Cart
- Save / Share
- trust/fulfillment row

All product-specific values must remain dynamic.

B. SPECIFICATIONS / ENGINEERING
Create the approved two-column Specifications + Engineered to Perform composition.
Use product metafields/settings where available rather than hardcoding C1 values.

C. BUILD YOUR WHEEL / CHOOSE YOUR FINISH
This is a FUNCTIONAL MIGRATION, not a rewrite.

Use the existing Build Your Wheel implementation as the source of truth for behavior.

The approved mockup's Choose Your Finish presentation is the visual target.
Where a product only needs a single finish selection, the approved finish-carousel pattern can directly represent it.

Where the existing configurator requires Center Finish, Barrel/Lip Finish, Hardware/Rivet Finish, or other independent choices:
- retain those choices and their existing state/bindings;
- visually integrate them into the approved Calder finish/configuration system;
- progressive disclosure/tabs/groups are acceptable if needed;
- retain the configured-wheel preview;
- retain availability/lead-time feedback;
- retain dynamic price;
- retain Add Configured Wheel to Cart;
- retain Request Quote.

Do not reduce functionality merely because the approved mockup depicts a simpler product.

D. FITMENT
Preserve the existing fitment engine.

Use the approved hero-level "Fits Your Vehicle" component as the confirmed vehicle state.

Behavior:
- no vehicle selected -> customer can open/use the existing fitment selection workflow;
- selected compatible vehicle -> compact confirmed-state panel;
- Change Vehicle -> return to/reveal the existing selector;
- maintain existing Year → Make → Model → Generation/Trim dependencies and API/data behavior.

Do not hardcode the BMW shown in the mockup.
Do not create visual-only dropdowns disconnected from the existing fitment system.

E. AVAILABLE FINISHES
Implement the approved horizontal finish/wheel presentation.
Bind selection to the existing product/configurator state where applicable.

F. REAL WORLD
Implement the approved lifestyle gallery structure with View Gallery action.

G. YOU MAY ALSO LIKE
Use Shopify recommendation/listing data and the APPROVED SHARED B1 PRODUCT CARD.
Do not invent a new product-card design.

H. CONTACT + FOOTER
Implement/reuse the approved wheel-specialist CTA and the same Calder footer system used by the approved homepage.

==================================================
PRESERVATION RULES
==================================================

MUST preserve:
- Shopify product/variant behavior
- product form semantics
- cart behavior
- quote behavior
- Build Your Wheel business logic
- Fitment business logic/data flow
- inventory/availability state
- Theme Editor compatibility
- relevant Liquid objects
- existing JS hooks/listeners
- required data attributes
- app/integration hooks

Do not hardcode:
- product IDs
- variant IDs
- prices
- inventory
- selected vehicle
- product-specific specs
- product URLs

Prefer reuse/refactoring over duplicated logic.

==================================================
DESIGN CONTINUITY
==================================================

Use the existing Calder design system already established by the approved homepage.

Baseline:
-- Navy: #0E2A3E
-- Blue: #1E4C68
-- Gold: #C2A48A
-- Slate: #876E5A
-- Cream: #F2EFE9
-- Near Black: #231F20
-- Surface: #1A1A1A
-- Dark BG: #0A0A0A
-- Facundo headings
-- Garet UI
-- Poppins fallback
-- container max width: 1178px

Do not introduce a parallel product-page brand system.

==================================================
RESPONSIVE
==================================================

Validate at:
- 1440px desktop
- 768px tablet
- 390px mobile

Do not simply scale down desktop.

Ensure:
- gallery/content stack correctly;
- configurator never escapes its container;
- fitment controls never overflow;
- controls remain touch-usable;
- thumbnails/finishes/gallery/recommendations may use horizontal overflow/carousel behavior where appropriate;
- no page-level horizontal scrollbar.

==================================================
VALIDATION
==================================================

After implementation:

1. Run Theme Check.
2. Confirm no new errors/warnings attributable to this scope.
3. Functional smoke test:
   - variant/product options
   - Build Your Wheel choices
   - configurator preview/state
   - configured add to cart
   - request quote
   - fitment selection dependencies
   - fitment confirmed state
   - Change Vehicle
   - normal Add to Cart
   - quantity
   - recommendations
4. Render screenshots at 1440 / 768 / 390.
5. Do not self-declare visual acceptance.

==================================================
DELIVERABLES
==================================================

Return:
1. Implementation status
2. Files changed
3. Existing Build Your Wheel architecture discovered
4. Existing Fitment architecture discovered
5. What was reused vs modified
6. Functional preservation notes
7. Theme Check results
8. Smoke-test results
9. Remaining limitations
10. Paths to desktop/tablet/mobile screenshots
11. State: READY_FOR_VISUAL_QA

Do not redesign the approved product page.
Do not remove working functionality for visual fidelity.
Do not stop at a static approximation.
