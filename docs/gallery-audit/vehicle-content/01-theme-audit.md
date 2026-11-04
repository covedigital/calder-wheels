# 01 — Theme Audit (Vehicle Gallery Content Population)

> Addendum to the full gallery-system audit in `docs/gallery-audit/` (2026-11-01). That audit + the approved Phase B–F implementation (same date) established the architecture; this addendum confirms compatibility with the 12-vehicle content population task.

## Existing architecture (VERIFIED — no changes needed for content)

| Concern | Current implementation | Status |
|---|---|---|
| Listing template | `templates/page.vehicle-gallery.json` → `sections/calder-vehicle-gallery.liquid` | READY — reads `shop.metaobjects.gallery_build.values` |
| Detail templates | `templates/page.gallery-build.json` (`?build=`) + `templates/metaobject.gallery_build.liquid` (metaobject web route) → `sections/calder-gallery-detail.liquid` | READY |
| Content system | **Shopify metaobjects — `gallery_build`** (theme-editor blocks exist only as fallback) | EXTEND THIS — do **not** introduce the proposed `vehicle_gallery_entry` as a competing definition |
| Card dataset (filters) | `data-make,model,wheel,size,finish,bolt,series,style` via `calder-gallery-card.liquid` | READY — `wheel` key will carry design codes (CLM-01…), enabling confirmed-ID design filtering |
| Filtering/sort/pagination | `calder-gallery-v2.js` (client-side, Make→Model dependency added 2026-11-01) | READY |
| Empty states | Dual (no-content vs filtered) since 2026-11-01 | READY |
| PDP deep link | `calder-finish-tokens.liquid` + `?diameter&center&barrel&hardware` contract (blank design → no CTA) | READY — **this is the F-150 unofficial-design safety mechanism** |
| CSS/JS | `calder-gallery-v2.css/js`; lightbox included | READY |

## Gaps identified for this task (theme changes — **require approval, not yet made**)

| ID | Gap | Change | Size |
|---|---|---|---|
| VGC-1 | Phase-Four requirement "result counts" — no count display exists | Add `[data-gallery-count]` element + one line of JS in `calder-gallery-v2.js` + listing sections | S |
| VGC-2 | `gallery_build` definition lacks fields for: `vehicle_color`, `wheel_design_id` (numeric 201/202/203/207), `official_calder_design` (boolean) | **Shopify Admin schema addition** (theme code cannot create definitions) | S |
| VGC-3 | Detail page shows wheel-spec rows (WHEEL MODEL / SERIES / …) even when entry is unofficial (blank values render as empty `<dd>`) | Conditional: hide spec block + "Explore This Wheel" CTA when `official_calder_design` false — mirrors existing `pdp_link != blank` gating in `calder-gallery-detail.liquid` | S |

## Preserved content
The existing single `wheel_build` fallback block in `templates/page.wheel-gallery.json` (CLM-01) is **kept** — metaobject entries render before blocks and it remains a valid fallback. No published content is overwritten by this plan (imports are additive; see manifest idempotency rules, doc 06).

## Conclusion
The existing metaobject architecture safely absorbs all 12 entries. No competing content system is introduced. Only VGC-1/2/3 (all small) are required; all other Phase-Four/Five requirements are already live.