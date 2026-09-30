# Calder Wheels — Product Page Visual Specification v1

## Status
**READY_FOR_IMPLEMENTATION**

## Authorities
1. **Primary visual authority:** `Calder - 3 - Product(2).png`
2. **Functional reference:** `Calder-existing-product-reference.png`
3. **Governing inspection contract:** `calder-visual-inspector-v1.1.md`
4. **Cross-page brand authority:** approved Calder homepage
5. **Shared listing-card authority:** approved B1 Calder product card

## Core interpretation
The approved product-page mockup controls the **visual destination**. The existing product page controls the **functional requirements** for **Build Your Wheel** and **Fitment**.

These two existing systems are not disposable placeholders. Their working Liquid/JavaScript/data bindings must be inspected and preserved. The implementation should visually integrate them into the approved Calder product-page system rather than recreate them as static UI.

## P0 — Product hero
Reconstruct the approved two-column product-detail composition: gallery left; product identity, fitment status, configuration, price, quantity and purchase actions right. Preserve dynamic Shopify product and variant data. Do not hardcode the C1 mockup content.

The hero should include the approved hierarchy for breadcrumbs, title/construction label, description, rating/SKU metadata, fitment status, configuration controls, quantity, price, Add to Cart, Save/Share, and the trust row.

## P0 — Build Your Wheel
Use `Calder-existing-product-reference.png` to understand the existing configurator's functional surface: configurable center, barrel/lip and hardware/rivet finishes; preview; availability; pricing; cart; and quote behavior.

**Do not replace or fork its business logic.** Reuse its existing bindings and state. Restyle/wrap the existing implementation to fit the approved product mockup.

The approved mockup's **Choose Your Finish** section is the visual direction, but it is not permission to remove product-specific configurator capabilities. For products requiring multiple finish dimensions, preserve those dimensions using an integrated configurator/progressive-disclosure treatment while matching the approved hierarchy and Calder styling.

## P0 — Fitment
Use the existing page as the functional reference for vehicle fitment. Preserve Year → Make → Model → Generation/Trim dependencies and all existing fitment data/API behavior.

The approved mockup's **Fits Your Vehicle** panel should become the compact confirmed-state presentation in the product hero. When no vehicle is selected—or when the customer chooses **Change Vehicle**—surface the existing full fitment selection workflow. Do not build a second independent fitment engine.

## P1 — Supporting sections
Implement the approved Specifications + Engineered to Perform split section, Available Finishes carousel, Real World gallery, You May Also Like recommendations, wheel-specialist CTA and footer.

Recommendations must use the approved shared **B1 product card**. Header/footer should inherit the approved homepage design system rather than page-specific replacements.

## Responsive requirements
QA at **1440 / 768 / 390 px**. At narrow widths, stack gallery and product information, keep form controls touch-usable, prevent configurator/fitment overflow, and use horizontal scrolling/carousel behavior where it preserves the approved hierarchy.

## Brand baseline
- Navy `#0E2A3E`
- Blue `#1E4C68`
- Gold `#C2A48A`
- Slate `#876E5A`
- Cream `#F2EFE9`
- Near Black `#231F20`
- Surface `#1A1A1A`
- Dark BG `#0A0A0A`
- Headings: Facundo
- UI: Garet
- Fallback: Poppins
- Container: `1178px`

## Implementation safeguards
Inspect the live theme implementation before editing. Preserve product forms, variant state, cart behavior, quote behavior, inventory state, Liquid objects, data attributes, JS listeners, API bindings, app hooks and Theme Editor schema.

Prefer adapting existing sections/snippets over copying functionality into new parallel implementations. Do not hardcode product IDs, variant IDs, prices, vehicle selections or URLs. Keep changes scoped and do not regress the homepage, collection page, shared B1 card, or global Calder components.

## Acceptance
The page should visually track the approved mockup while the existing configurator and fitment workflows continue to work end-to-end. It must introduce no duplicate business logic, no horizontal overflow at the QA widths, and no new Theme Check errors. The completed implementation should be ready for screenshot-based Sol Visual QA.
