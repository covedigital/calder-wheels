# 2G. Product Specifications and Naming — Integration Reconciliation

## Already completed by admin
The universal products `CLB-06` and `CLB-07` were renamed to `CLM-06` and `CLM-07`, including their handles, page titles, SEO fields and descriptions. **Do not repeat these edits, recreate products, or overwrite approved content.**

## Required development work
Audit and update only connected theme/code references that still rely on old names or handles, including where applicable:
- Universal builder design-to-product lookup tables and product handles.
- JavaScript config objects, metafields/metaobjects, Liquid templates/snippets, section settings and dynamic sources.
- Cross-design navigation, product card links, gallery references, variant/part-number displays, URL generation and redirects.
- API requests, event handlers, shared state, cart line-item metadata, save/share links, analytics, search/filter indexes and test fixtures.
- Hardcoded `CLB-06` / `CLB-07` references; inspect other `CLB` occurrences but **do not bulk replace unrelated historical or valid values**.

## Naming
The approved naming convention for wheel design/product display is `CLM-20X` where applicable. Verify actual catalog mappings before applying to existing products; do not conflate `CLM-06` / `CLM-07` product identifiers with design numbers without proof.

## Unchanged or deferred
Current design diameters and bolt-pattern fitment data are valid per the supplied data sheet. Manufacturing descriptions will be updated after a team meeting. Do not edit them now.

## Acceptance
New handles resolve; old saved/deep links are handled via confirmed redirects or compatible fallback; builders, filters, carts and share links continue working; no duplicate products or accidental SKU mutations.
