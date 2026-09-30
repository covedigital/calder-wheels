# Calder Wheels — Product Visual Correction v1

## State
**REVISION_REQUIRED — MAJOR VISUAL DIVERGENCE**

## QA conclusion
The v1 implementation preserves useful functional architecture, but it does **not** visually converge on the approved product-page mockup. This is not a polish pass. The next OpenCode pass must correct the page-level visual system and composition before micro-spacing QA.

### Authority order
1. `Calder - 3 - Product(3).png` — **visual authority**
2. `Calder-existing-product-reference(1).png` — **functional reference only** for Build Your Wheel and Fitment
3. Approved homepage — global Calder header/footer/brand authority
4. Approved B1 card — recommendation-card authority

The v1 renders are evidence of the current implementation, **not design references**.

## Primary failure
The implementation interpreted the PDP as a dark Calder page. The approved PDP is a predominantly **white/light ecommerce page** with navy typography, restrained gray surfaces/rules and gold accents. The dark v1 theme changes the design language, hierarchy, apparent spacing and product merchandising.

The correction must therefore begin with structure and visual tokens—not incremental tweaks to the existing dark CSS.

## Product media
The scenic aurora, chair, bridge, flower and pebble imagery is not acceptable as the visual product implementation. Product hero, thumbnails and recommendation cards must use actual Shopify product/recommendation media. Never invent generic scenic media merely to fill an image slot.

## Hero
Reconstruct the approved desktop hero as a large gallery on the left and dense product/configuration panel on the right. Restore the approved hierarchy: product identity, construction, description, review/SKU, confirmed fitment, dimension/finish/application controls, quantity/price, gold Add to Cart, Save/Share and trust row.

## Build Your Wheel
**Preserve its business logic. Change its presentation.**

The current v1 kept the existing configurator as a large independent dark section. That satisfies preservation but not visual integration.

Use the approved `Choose Your Finish` presentation as the visual direction. If Center, Barrel/Lip and Hardware/Rivet are independently required, retain them in an integrated Calder configurator treatment. Do not discard those dimensions. The working preview, availability, price, configured cart action and quote action remain functional requirements.

## Fitment
Keep the existing fitment engine and dependency chain. In the normal selected state, the approved hero-level `Fits Your Vehicle` panel is the primary presentation. The full Year/Make/Model/Generation selector is the selection/change workflow and should use the approved light styling.

## Lower page
Rebuild toward the approved hierarchy:
- light Specifications table + image-led `Engineered to Perform` panel;
- actual `Available Finishes / Choose Your Finish` wheel showcase;
- landscape `See It in the Real World` gallery;
- approved white B1 recommendation cards with actual wheel products;
- established image-led Calder wheel-specialist CTA;
- approved global Calder footer.

## Responsive
The supplied tablet result does not read as a 768px tablet layout; it reads as a squeezed narrow layout. Treat 1440, 768 and 390 as three intentional layout states. Tablet must preserve useful two-column arrangements where space permits and collapse deliberately where it does not.

## Implementation strategy correction
The statement that no custom hero is needed because native Lumia `main-product` can be restyled is **not a governing constraint**.

Reuse Lumia behavior where useful, but if its markup/order prevents fidelity, OpenCode may:
- add Calder-specific wrappers;
- reorder/render existing blocks differently for `product.calder`;
- create presentation snippets;
- use Calder-specific section markup;
- preserve native forms/controllers underneath that presentation.

**Functionality is reusable. Lumia's visual DOM structure is not authoritative.**

See `product.visual-correction.v1.json` for issue IDs and exit criteria.
