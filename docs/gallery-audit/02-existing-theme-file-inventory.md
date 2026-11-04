# 02 — Existing Theme File Inventory

> Theme root: `docs/design/Shopify Themes/Working Theme-via-CLI/` (Shopify OS 2.0, Lumia-based). All paths below are relative to that root. Status: VERIFIED (read during audit, 2026-11-01).

## Routes → template trace (VERIFIED)

| Route | Template | Section chain |
|---|---|---|
| `/pages/vehicle-gallery` | `templates/page.vehicle-gallery.json` | `calder-vehicle-gallery` → `calder-gallery-filters` + `calder-gallery-card`; loads `calder-gallery-v2.css/js` |
| `/pages/wheel-gallery` | `templates/page.wheel-gallery.json` | `calder-wheel-gallery` → same snippets/assets |
| `/pages/gallery-build?build=<handle>` | `templates/page.gallery-build.json` | `calder-gallery-detail` (manual `?build=` parsing, lines 3–6) |
| `/metaobjects/gallery_build/<handle>` (if web pages enabled) | `templates/metaobject.gallery_build.liquid` | `{% section 'calder-gallery-detail' %}` |
| `/pages/gallery` (legacy) | `templates/page.gallery.json` | two `index-gallery` sections, placeholder blocks only — NOT the v2 system |

## File inventory

### Templates
| File | Purpose | Dependencies | Issues | Action | Risk |
|---|---|---|---|---|---|
| `templates/page.vehicle-gallery.json` | Vehicle gallery page config | `calder-vehicle-gallery` | **No `blocks` key at all** → zero fallback entries | KEEP | Med |
| `templates/page.wheel-gallery.json` | Wheel gallery page config | `calder-wheel-gallery` | Single `wheel_build` block links to `shopify://products/apex-201` (**legacy Apex product, predates 6-design registry naming**) | REFACTOR | Med |
| `templates/page.gallery-build.json` | Detail page config | `calder-gallery-detail` | No fallback blocks; relies on `?build=` param | KEEP | Low |
| `templates/metaobject.gallery_build.liquid` | Metaobject route for `gallery_build` | `calder-gallery-detail` | Correct pattern; route only works if metaobject web pages enabled in Admin | KEEP | Low |
| `templates/page.gallery.json` | Legacy parallel gallery | `index-gallery` | Placeholder content ("2024 BMW M3 / Apex 3-Piece"); **comment header inside JSON = invalid JSON**; competes with v2 pages | REMOVE (after confirming no nav links) | Med |
| `templates/page.*.json.backup-102226*` (3 files) | Stale backups | — | Deployable ambiguity / confusion | REMOVE | Low |

### Sections
| File | LOC | Purpose | Issues | Action | Risk |
|---|---|---|---|---|---|
| `sections/calder-vehicle-gallery.liquid` | 324 | v2 vehicle listing. Data: `shop.metaobjects.gallery_build.values` (15–24) + `section.blocks` fallback (25–32). `gallery_type='vehicle'`, filter_keys `make,model,wheel,size,finish,bolt,series,style` | 95% copy-paste twin of wheel gallery; `style_filter_values` setting unfilled | REFACTOR (unify) | Med |
| `sections/calder-wheel-gallery.liquid` | 313 | v2 wheel listing. `gallery_type='wheel'`, filter_keys `wheel,size,finish,bolt,series,construction,style` | Same duplication; `gallery_type` defaulting quirk (see 03) | REFACTOR (unify) | Med |
| `sections/calder-gallery-detail.liquid` | 335 | Shared detail (page + metaobject routes). Hero slider, specs `<dl>`, related loops, `.cg-not-found` state | Hand-rolled query-string parse (`split:'&'`, lines 3–5); reads fields not in setup doc (`wheel_style`, `bolt_pattern`, `weight`, `load_rating`, `image_2/3`); no not-found distinction | KEEP + PATCH | Med |
| `sections/calder-gallery.liquid` | 614 | "Real World Gallery" PDP image grid (settings or product metafield) | Not part of the listing system; name collision | REUSE (PDP only) | Low |
| `sections/home-gallery.liquid` | 630 | Homepage "Fitted Gallery" band | Unrelated to listing pages | KEEP | Low |
| `sections/index-gallery.liquid` | 1124 | Lumia generic image grid (used by legacy `page.gallery.json`, `index.json`, `product.calder.json`) | Placeholder content in gallery context | KEEP (non-gallery use) | Low |
| `*.backup-102226` sections (3) | — | Stale copies with older empty-state markup ("No Matching Wheels Found", setup notice) | **May be what's deployed on live store** — version skew | REMOVE after verifying live | High |

### Snippets
| File | Purpose | Notes | Action |
|---|---|---|---|
| `snippets/calder-gallery-card.liquid` (7 LOC) | Card `<a class="calder-gallery-grid__item">` with `data-make/model/wheel/series/finish/construction/size/bolt/style` dataset | The filter dataset contract | KEEP |
| `snippets/calder-gallery-filters.liquid` (10 LOC) | `<select data-filter-key>` per key + RESET | Options populated client-side from card datasets | KEEP |
| `snippets/calder-design-url.liquid` (70 LOC) | Builds PDP deep links `/products/calder-{design}-wheel?diameter=&center=&barrel=&hardware=` | **The preselection contract already exists here** — but v2 gallery cards do NOT use it | REUSE in gallery |
| `snippets/calder-universal-gallery.liquid` / `-slide.liquid` | PDP media gallery w/ layered finish preview | Unrelated to listings | KEEP |
| `snippets/under-gallery-blocks.liquid` | Product-page trust blocks — **unrelated to public gallery** | Name confusion only | KEEP |

### Assets
| File | Purpose | Status |
|---|---|---|
| `assets/calder-gallery-v2.js` (~4 KB minified) | Active: filter/search/sort/pagination + detail slider. `empty.hidden = visible.length>0` | ACTIVE — contains the `[hidden]`-vs-CSS bug (see 03) |
| `assets/calder-gallery-v2.css` (~7.7 KB) | Active `.cg-v2/.cg-detail` styles | ACTIVE — `.calder-gallery-grid__item{display:block}` defeats `[hidden]` |
| `assets/calder-gallery.js` (124 LOC) | v1 filters | **DEAD** — only referenced by `.backup-102226` sections → REMOVE |
| `assets/calder-gallery.css` (787 LOC) | v1 styles | **CONFLICTING** — `layout/theme.liquid:93,98` loads v1 CSS on the v2 pages alongside v2 CSS → REMOVE load |
| `assets/calder-gallery-detail.js` (88 LOC) | v1 lightbox | DEAD → REMOVE |
| `assets/calder-gallery-detail.css` (635 LOC) | v1 detail styles | Loads on metaobject route only, alongside v2 → REMOVE |
| `assets/calder-design-registry.js` (457 KB) | Full 6-design registry (generated, DO-NOT-EDIT) | Unused by any liquid (PDP uses per-design slices) → keep as generator source, don't load |
| `assets/calder-design-registry-{clb06,clb07,clm01,clm02,clm03,clm05}.js` | Per-design registry slices | Loaded by `calder-universal-controls.liquid:8-11` — ACTIVE |
| `assets/calder-config-resolver.js` (378 LOC) | Config→part_number→SKU-first availability (`AVAILABLE, SOLD_OUT, NO_CATALOG_PART, NO_SELLABLE_RECORD, AMBIGUOUS, LEGACY_UNVERIFIED, INVALID, VEHICLE_REQUIRED, LOADING, ERROR`) | ACTIVE, protected |
| `assets/calder-pdp-state.js` (184 LOC) | URL state manager (`?diameter=&center=&barrel=&hardware=`; push/replace/popstate; frozen snapshots) | ACTIVE — **this is the preselection API for gallery→PDP** |
| `assets/calder-demo-inventory.js` (262 LOC) | Demo QuickBooks component feed; `available_to_build = min(on-hand)`, hardware ÷20; never fail-open | ACTIVE, demo data (`settings_data.json:479` → `calder_inventory_source: "demo"`) |
| `assets/calder-universal-pdp.js` / `calder-universal-cta.js` | PDP controls wiring + CTA state matrix (`NO_STOCK`, `VEHICLE_INCOMPATIBLE`, low-stock vs `data-calder-min-qty` default 10) | ACTIVE, protected |
| `assets/gallery.js` / `gallery.css` | Lumia fancybox for `index-gallery` | ACTIVE (non-gallery use) |

### Config / docs
- `config/settings_schema.json`: `fitment_api_url`, `configurator_api_url`, `calder_storefront_access_token`, `calder_inventory_source` (`demo|quickbooks|native`). No gallery-specific global settings.
- `docs/gallery-metaobject-setup.md` (in-repo): documents the `gallery_build` metaobject definition — **creation in Shopify Admin is stated as a pending manual step**.

## Data model (as coded)

**`gallery_build` metaobject** (drives both listings + detail):
`title`, `gallery_type` (`vehicle|wheel`), `featured_image`, `gallery_images` (list of files), `vehicle_year/make/model/trim`, `wheel_model`, `wheel_series`, `wheel_product` (product ref), `front_wheel_size`, `rear_wheel_size`, `center_finish`, `lip_finish`, `bolt_finish`, `overall_finish`, `construction`, `tire_brand`, `front/rear_tire_size`, `fitment_notes`, `featured` (bool), `sort_order` (number), `seo_title`, `seo_description`.

**Section block fallback** (theme editor): `build` / `wheel_build` blocks with mirrored fields + `detail_url`, `gallery_handle`.

## Recommendation summary
- **KEEP:** v2 sections/snippets/assets, detail section, metaobject template, design-url deep-link snippet, registry/resolver/state/CTA stack (protected).
- **REUSE:** `calder-design-url.liquid` pattern to power gallery→PDP preselected links.
- **REFACTOR:** merge the two listing sections into one parameterized section; unify card link emission.
- **REPLACE:** `page.gallery.json` legacy page; fill `style_filter_values`.
- **REMOVE:** dead v1 assets (`calder-gallery.js`, `calder-gallery-detail.js`), v1 CSS loads in `theme.liquid:93,98-99`, all `.backup-*`/`.bak`/`copy` files, legacy `apex-201` block reference.