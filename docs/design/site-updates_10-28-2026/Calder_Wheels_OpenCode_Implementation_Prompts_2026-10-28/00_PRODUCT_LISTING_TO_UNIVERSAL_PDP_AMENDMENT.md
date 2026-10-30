# Detailed Amendment — Product Listing → Design-Specific Universal PDP

**Supersedes:** Earlier Calder PDP behavior in which alternate barrel/lip or hardware choices triggered “Customize Your Wheel” and scrolled to a separate builder.  
**Client-approved direction supplied October 28, 2026:** The **existing PDP itself is the sole configuration and purchase interface**. The standalone wheel builder is **discontinued**. Do not keep it synchronized with the PDP or build a second configurator.

## A. Non-negotiable product model

- Six initial wheel designs; one **public-facing design-specific product experience** per design.
- Preserve underlying Shopify products, variants, SKUs, inventory tracking and order records. The universal interface is a **presentation and selection layer**, not a catalog merge.
- The design remains fixed while shoppers change **diameter**, **center finish**, **barrel & lip finish**, and **hardware & rivet finish**.
- Navigating to a different design is a separate deliberate action.
- Collection cards and wheel/vehicle gallery items may continue showing multiple preset combinations of one design. Every card/image must open the matching design PDP with **its exact clicked configuration preloaded**.
- Keep the approved PDP layout and primary **Add to Cart** CTA; remove obsolete “scroll to builder” actions, duplicate builder state, and builder UI. Preserve useful unrelated PDP features.

## B. Required discovery before changes

1. Identify all six real design identifiers and existing product associations from authoritative Shopify data. Do not assume sample mappings are complete.
2. Inspect actual products/variants: product handles, variant IDs, option names, inventory status, pricing, SKU, finish metadata, images and current PDP templates.
3. Inspect existing `calder-product-card` snippets/styles, gallery templates, PDP assets and wheel builder assets **only if present**; discover actual filenames rather than assuming them.
4. Confirm whether diameter and center are variants within each preset product while barrel/lip and hardware are product-level attributes; support actual data shape instead of forcing an invented schema.
5. Audit known design/image-code examples where verified: CLM-01→201, CLB-06→206, CLB-07→207. Inspect actual assets and report any incomplete/mismatched layers.
6. Document a canonical design URL for each design, and the legacy product URL compatibility strategy. Obtain approval before bulk redirects.

## C. Data contract and registry

Create one normalized, maintainable design registry backed by verified Shopify data, e.g.:

```json
{
  "design_id": "CLB-06",
  "canonical_handle": "calder-clb-06",
  "configurations": [
    {
      "diameter": "22",
      "center": "black-tint",
      "barrel": "polished",
      "hardware": "chrome",
      "product_id": "VERIFIED_SHOPIFY_PRODUCT_ID",
      "variant_id": "VERIFIED_SHOPIFY_VARIANT_ID"
    }
  ]
}
```

**This JSON is a shape example, not real inventory or permission to hardcode placeholder IDs.** The source of truth should be Shopify records and validated metafields/metaobjects or a verified generated data manifest. Document generation/update ownership and refresh behavior. Use normalized internal tokens and human-friendly labels; ensure one complete configuration resolves to **zero or one** sellable variant, never multiple. Detect duplicate/ambiguous keys as data errors and block cart.

## D. Resolution algorithm

On initial load or any component change:

1. Identify fixed design from current PDP context.
2. Read the four requested option values from UI/URL, validating against the registry.
3. Resolve the **complete** tuple `(design, diameter, center, barrel, hardware)`.
4. If exactly one Shopify product/variant matches, update active variant ID, price, compare-at price where applicable, SKU, image, specs and stock state from that exact record.
5. If no match, distinguish **no catalog configuration** from a known but **sold-out** variant.
6. If data is loading, invalid or ambiguous, block Add to Cart and show a clear message.
7. Prevent stale asynchronous responses from overwriting newer selections.
8. On switching back to an in-stock tuple, restore Add to Cart automatically.
9. Revalidate variant ID at cart submission and let Shopify's actual cart response handle race conditions and sell-through.

Never add the originally loaded preset variant after the user has changed components.

## E. Required purchase states

| Resolution state | Customer message / behavior | Primary CTA |
| --- | --- | --- |
| Exact variant exists and is available | Actual price, specs, verified preview | Add to Cart |
| Exact variant exists but sold out | Sold-out / contact guidance | Contact a Representative |
| No matching catalog variant | Combination not listed; assistance available | Request Custom Configuration |
| Invalid, incomplete, loading or ambiguous mapping | Explain state; disable purchase | No Add to Cart |
| Vehicle incompatible | Separate fitment warning regardless of stock | Select Compatible Option / assistance |

For **Speak With Support**, provide a `tel:` call action **only if the business phone number is verified** in theme settings or approved contact data. Otherwise reuse the approved contact destination and mark the phone number as a client dependency. Do not invent contact details.

Low-inventory messaging near CTA is conditional on an **approved threshold** (10 or 12 are examples, not decisions) and confirmed Shopify/QuickBooks synchronization semantics. Do not publicly display exact quantities unless approved.

## F. Deep linking and migration

Preferred public model: six canonical design URLs, for example:

`/products/calder-clb-06?diameter=22&center=black-tint&barrel=polished&hardware=chrome`

The handle and option values above are illustrative until verified. All collection cards, wheel gallery images and vehicle-gallery “Shop This Fitment” links should pass a validated configuration. The PDP must initialize **before enabling purchase**; no flash of the wrong price or variant. No-parameter visits use a designated verified default. Partial or invalid links must not silently select an unrelated sellable preset.

Support browser Back/Forward with consistent state, shareable URLs, safe URL encoding, and a stable canonical design URL for SEO. Existing product URLs should be retained as compatibility entry points or redirected only after verifying that the original preset can be carried forward. Audit search, sitemap, structured data, internal links and redirects before changing canonical tags.

## G. PDP-only visual experience

- Keep product title fixed to the wheel design (e.g. CLB-06), not an underlying product's verbose preset title.
- Show component controls directly on the PDP; **do not display a separate builder section**.
- Reuse validated design-specific visual layers or product imagery to reflect selection. If an exact visual is missing, show a clearly labeled safe fallback, not a visually incorrect finish.
- Update selected specs (diameter, bolt pattern, offset, width, center bore where verified) and price with the resolved variant.
- Ensure swatches, selected labels, accessible names and visual preview remain synchronized.
- Preserve vehicle-fitment status as independent from inventory status.
- Remove or retire obsolete builder event listeners, scroll anchors, deep links and synchronization code **only after checking whether any other live feature depends on them**.

## H. Technical integration and cart correctness

Shopify native forms are often bound to the initially rendered product. When selection resolves to a different underlying product, explicitly update the active variant ID, purchase payload, dynamic checkout availability, selling plan context (if used), inventory state, price and any relevant product metadata. Prefer verified Shopify cart APIs or the theme's existing supported cart integration. Do not assume changing the displayed swatch updates the form. Verify quantity handling, cart drawer refresh, sold-out error handling and analytics item IDs.

Avoid making a false offer in JSON-LD: design-level product markup must not advertise a single price/availability that is only true of a different selected variant. Confirm theme SEO behavior and implement accurately.

## I. Example acceptance test

Given a collection card for design CLB-06, 22-inch, Black Tint center, Polished barrel, Chrome hardware:

1. Clicking its image/title/CTA opens the **CLB-06 design PDP**.
2. Those exact four choices are visibly selected on first usable render.
3. Preview, specs, price and availability reflect that resolved combination.
4. Switching barrel to Black keeps CLB-06 and the other selections intact, and resolves a **different** actual product/variant if one exists.
5. Add to Cart submits exactly the currently resolved variant, not the original card's variant.
6. Sold-out match blocks purchase and offers contact.
7. Missing catalog match says “Request Custom Configuration,” not “Out of Stock.”
8. Browser Back restores previous options, price, imagery and CTA.
9. Copy/paste deep link in a fresh tab restores the selection.
10. Legacy preset URLs preserve or transfer their original selections.
11. Rapid changes, missing assets, unavailable inventory, failed requests and mobile interaction never produce an incorrect cart line.
12. No standalone builder UI or PDP↔builder synchronization remains active.

## J. OpenCode implementation sequence

1. **Audit and mapping** — build authoritative design-to-product-to-variant inventory and URL matrix.
2. **Registry and resolver** — implement deterministic full-tuple matching with safe failure states.
3. **PDP state and URL** — initialize, update, and restore component selections.
4. **PDP controls and preview** — wire the approved PDP only; remove obsolete builder journey.
5. **Price, stock and cart** — connect the exact resolved variant and all purchase-related UI.
6. **Collection/gallery links** — deep link to design PDP with clicked preset.
7. **Compatibility and SEO** — handle legacy product URLs and truthful structured data.
8. **End-to-end QA** — test all six designs and every verified configuration, including negative cases.

## K. Completion report required from OpenCode

Provide a table of changed files, actual data source used, exact mapping coverage per design, number of unmapped/ambiguous configurations, test results, unresolved client decisions, SEO migration status, and confirmation that **the separate wheel builder is discontinued and the PDP is the only configurator**.

## Mandatory execution guardrails

- Inspect the actual Shopify theme repository, current Liquid/JS/CSS, settings, metafields, product data, and relevant existing guardrails before editing. Do not assume filenames, schemas, APIs, or inventory mappings exist.
- First produce a concise audit: affected files, data sources, current behavior, implementation plan, risks, and verification steps. Then implement only the scoped changes.
- Preserve the approved Calder visual design, existing unrelated functionality, theme editor settings, responsive behavior, accessibility, and Shopify compatibility. No unrelated refactors, dependency additions, or broad global CSS.
- Use the existing project's mandatory OpenCode guardrails if present; where they are stricter, follow them. Never silently overwrite or delete existing code.
- Do not fabricate wheel designs, inventory, fitment, pricing, vehicle images, SKU mappings, or asset filenames. Mark missing dependencies clearly and fail safely.
- Keep code modular, scoped, and progressively enhanced. Avoid duplicate event handlers, global namespace pollution, stale state, and unnecessary network requests.
- Never submit a cart line unless the exact resolved, available Shopify variant matches the full selected configuration. Server-side Shopify inventory and checkout remain authoritative.
- Report changed files, why each changed, validation performed, remaining issues, and any required client decisions. If a prerequisite is absent, stop the affected functionality safely and document it.
- Do not claim a feature is complete without tests; do not deploy to production or change live inventory without explicit approval.
