# Calder Wheels — OpenCode Implementation Prompt Pack

**Prepared:** October 28, 2026  
**Source:** Calder Wheels client meeting summary plus the user's detailed Product-Listing-to-Universal-Product amendment.  
**Target:** Conditional November 3, 2026 SEMA milestone; do not sacrifice cart or fitment correctness to meet date.

## Critical amendment

The original meeting summary describes “consolidating” the PDP and builder. **The user's latest direction is more specific and takes precedence:** the approved **PDP is the only builder/configurator**; the **standalone wheel builder is discontinued**, and there is **no PDP-to-builder synchronization**. The amendment file `00_PRODUCT_LISTING_TO_UNIVERSAL_PDP_AMENDMENT.md` is mandatory for prompts 01–06, 12–13, 17–18 and any change touching product navigation.

## How to run these prompts

1. Give OpenCode the actual repository and current mandatory guardrails.
2. Read `00_PRODUCT_LISTING_TO_UNIVERSAL_PDP_AMENDMENT.md` and the applicable numbered prompt together.
3. Run prompts in dependency order; review each audit and diff before allowing further implementation.
4. Keep changes scoped; do not attempt the entire pack in one uncontrolled edit.
5. Use `99_LAUNCH_QA_AND_DELIVERABLES_CHECKLIST.md` to sign off.

## Prompt index

| File | Focus | Priority |
| --- | --- | --- |
| `01_universal-pdp-architecture-and-design-registry.md` | Universal PDP architecture and design registry | P0 |
| `02_configuration-resolver-and-variant-integrity.md` | Configuration resolver and variant integrity | P0 |
| `03_collection-cards-to-universal-pdp-deep-links.md` | Collection cards to universal PDP deep links | P0 |
| `04_pdp-url-state-and-browser-navigation.md` | PDP URL state and browser navigation | P0 |
| `05_pdp-controls-and-component-preview.md` | PDP controls and component preview | P0 |
| `06_purchase-cta-and-contact-actions.md` | Purchase CTA and contact actions | P0 |
| `07_inventory-and-quickbooks-integration-boundaries.md` | Inventory and QuickBooks integration boundaries | P0 |
| `08_collection-browsing-and-wheel-filters.md` | Collection browsing and wheel filters | P0 |
| `09_shop-by-vehicle-fitment-mode.md` | Shop by Vehicle fitment mode | P0 |
| `10_fitment-data-and-selection-aware-specifications.md` | Fitment data and selection-aware specifications | P0 |
| `11_homepage-hero-and-feature-showcase.md` | Homepage hero and feature showcase | P1 |
| `12_wheel-gallery.md` | Wheel gallery | P1 |
| `13_vehicle-gallery.md` | Vehicle gallery | P1 |
| `14_fitment-guide-relocation.md` | Fitment guide relocation | P1 |
| `15_product-card-image-controls-and-gallery-fidelity.md` | Product-card image controls and gallery fidelity | P1 |
| `16_analytics-and-conversion-tracking.md` | Analytics and conversion tracking | P1 |
| `17_launch-qa,-performance-and-rollback.md` | Launch QA, performance and rollback | P0 |
| `18_catalog-migration-and-seo-compatibility.md` | Catalog migration and SEO compatibility | P1 |

## Client decisions still required

- Verified six-design product/SKU/variant mapping and canonical handles.
- Approved inventory-low threshold and low-stock checkout policy.
- QuickBooks ↔ Shopify sync authority/frequency and inventory reservation behavior.
- Verified phone number and preferred representative contact flow.
- Sergio-approved fitment spreadsheet and known corrections.
- Approved hero footage, wheel photography, exploded construction references, and initial vehicle gallery photos.
- Final legacy URL redirect/compatibility policy, and whether standalone fitment guide remains.

## Scope / sequencing

P0: universal PDP and exact cart resolution; card preload; fitment and specs correctness; safe inventory states; core collection mode; launch QA. P1: gallery polish, expanded vehicle gallery, homepage media and advanced SEO migration when assets/data are ready. The client-requested SEMA deadline is a target, not a reason to ship incorrect inventory or fitment.

**Note:** The numbered prompts are implementation briefs. They do not assert that specific theme files or data sources are present; OpenCode must inspect the repository and report exact paths before editing.
