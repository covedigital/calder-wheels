# 05 — Recommended Shopify Data Architecture

## Options evaluated

| Criterion | A: Metaobjects only | B: Products/collections | C: Hybrid (metaobjects → product refs) | D: Current theme as-is |
|---|---|---|---|---|
| Maintainability | High | Low (catalog bloat) | High | Med (schema drift) |
| OS 2.0 compatibility | Native (`shop.metaobjects`) | Native | Native | Native |
| Theme editor support | Blocks as fallback only | Full | Blocks + metaobjects | Partial |
| Filtering | Client-side from fields | Native but wrong-tool | Client-side | Client-side |
| Performance | Server-rendered, no fetches | Catalog-scaled | Same as A | Same |
| SEO | Metaobject web pages | Product URLs | Metaobject pages + product links | `?build=` param page |
| Content workflow | Admin metaobject editor | Product admin | Two entry types | As coded |
| Scalability | Hundreds of entries, catalog untouched | Poor (every build a product) | Good | Good |
| Cost/complexity | Low | Medium | Low | — |

**Recommendation: Option C — Hybrid.** Gallery entries are `gallery_build` **metaobjects** (content records, NOT sellable products), each optionally referencing a registry design and a sellable product via `wheel_product`. This is what the theme already codes; the architecture is sound — the **Admin data simply doesn't exist yet**.

## Concept distinctions (required by brief)

| Concept | What it is | Where it lives |
|---|---|---|
| **Vehicle build record** | A photographed installation: vehicle + config used | `gallery_build` metaobject, `gallery_type='vehicle'` |
| **Wheel design record** | One of 6 designs (CLM-01…CLB-07): geometry, series, options | Generated registry (`calder-design-registry-*.js`) + sellable product `calder-{design}-wheel` |
| **Wheel configuration** | Center × barrel/lip × hardware × diameter token set | Resolvable via `calder-config-resolver.js`; may or may not map to a sellable variant |
| **Sellable product/variant** | Shopify product + SKU backing a configuration | `product.calder` template / Storefront SKU lookup |

Relationships: Vehicle build →(0..n design refs)→ wheel design →(config)→ product/variant. One design ↔ many vehicle builds.

## Proposed `gallery_build` schema (superset of current code — reconcile with `docs/gallery-metaobject-setup.md`)

| Field | Shopify type | Req | Example | Relationship | Validation |
|---|---|---|---|---|---|
| `title` | single_line_text | ✓ | `2024 Cadillac Escalade — CLM-01` | — | non-empty |
| `gallery_type` | single_line_text (or select) | ✓ | `vehicle` \| `wheel` | gates listing | enum exactly; **no default** (default `'vehicle'` in current code causes miscategorization) |
| `design_code` | single_line_text | ✓ | `CLM-01` | → registry design | must match `^[A-Z]{3}-\d{2}$` registry codes |
| `wheel_product` | product_reference | ○ | `calder-clm-01-wheel` | → sellable product | product handle must equal `calder-{design}-wheel` |
| `featured_image` | file | ✓ | hero photo | — | ≥1200px wide |
| `gallery_images` | list of files | ○ | 3–10 photos | — | alt text required |
| `vehicle_year` / `make` / `model` / `trim` | single_line_text | year/make/model ✓ (vehicle type) | `2024` / `Cadillac` / `Escalade` / `Premium Luxury` | — | year 4-digit |
| `wheel_model` / `wheel_series` | single_line_text | ✓ | `CLM-01` / `Forged Series` | mirror registry | match registry naming |
| `front_wheel_size` / `rear_wheel_size` | single_line_text | ○ | `24"` | — | `^\d{2}"$` |
| `center_finish` / `lip_finish` / `hardware_finish` | single_line_text | ○ | `Gloss Black` / `Polished` / `Chrome` | → config tokens | must be registry finish vocabulary |
| `overall_finish` | single_line_text | ○ | `Gloss Black` | fallback display | — |
| `construction` | single_line_text | ○ | `3-Piece` | — | — |
| `bolt_pattern` | single_line_text | ○ | `5x120` | → fitment | `^\d{1}x\d{2,3}$`-ish |
| `diameter` | single_line_text | ○ | `24` | → PDP `?diameter=` | 22/24/26 |
| `tire_brand` / `front_tire_size` / `rear_tire_size` / `fitment_notes` | text | ○ | — | — | — |
| `featured` | boolean | ○ | true | sort priority | — |
| `sort_order` | integer | ○ | 10 | sort | — |
| `seo_title` / `seo_description` | single_line_text | ○ | — | → `<meta>` | ≤60/≤155 chars |
| `weight` / `load_rating` / `wheel_style` / `image_2` / `image_3` | — | — | — | — | **either add to definition or remove from Liquid** (BUG-09 drift) |

## Routes strategy
1. **Primary: metaobject web pages** (`/metaobjects/gallery_build/<handle>`) — indexable, unique URLs, template already exists (`templates/metaobject.gallery_build.liquid`). Enable "Create web pages" on the definition in Admin.
2. **Secondary/compat: `/pages/gallery-build?build=<handle>`** — keep for admin-less deep links; both render the same section.
3. Canonical: metaobject URL; the `?build=` page should `canonical_url` to it to prevent duplicate content.

## Content workflow (client)
- Create/edit/unpublish: Shopify Admin → Content → Gallery Builds. Unpublishing a metaobject removes it from `shop.metaobjects` automatically (no `is_published` flag needed).
- Reorder: `sort_order` integer + `featured` boolean (both already coded in Liquid sort path — wire them).
- Images: Files section uploads; alt text mandatory.
- **Theme code cannot create metaobject definitions** — Admin setup (or Admin API) is a launch dependency, documented in `docs/gallery-metaobject-setup.md`.

## Wheel Gallery organization decision
One card **per design** (6 cards), with finish-configuration previews inside the card/detail (per Phase 4 analysis) — avoids up to 12 near-duplicate cards/design at launch. Finish-level `gallery_type='wheel'` entries remain supported for later "every finish photographed" Vossen-style expansion.