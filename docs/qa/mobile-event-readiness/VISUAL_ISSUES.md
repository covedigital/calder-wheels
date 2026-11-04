# Calder Wheels — Mobile & Tablet Visual Issues (Pre-Event QA)

**Storefront**: https://wvpnpr-t7.myshopify.com · **Theme**: `calder-theme` (live, t/6)
**Evidence**: `qa-harness/screenshots/` (per-engine/device/route), `qa-harness/artifacts/layout-audit.json`, `qa-harness/artifacts/visual-audit-*.json`

Method: automated full-page + above-fold screenshots at 9 viewports (Chromium) and 5 viewports (WebKit), in-page layout audits (horizontal overflow, image integrity, aspect-ratio deviation, touch-target size, sticky inventory) at 375/1024 scroll states. 162 Chromium screenshots + 40 WebKit screenshots captured.

> **Human review required**: the automated audits measure geometry; final visual sign-off requires a human to review the baseline PNGs (this session's model could not view images). Baselines are NOT auto-approved. Re-run comparison: `qa-harness` → `node lib/diff-baselines.mjs`.

---

## P1 — defects

### P1-V1. Product listing (collections) page scrolls horizontally at every phone width
| | |
|---|---|
| **Severity** | **P1** — major mobile usability defect on a primary demonstration route |
| **Affected devices** | all phone widths: 320 (+129 px), 360 (+105 px), 375 (+74 px), 393 (+58 px), 412 (+177 px with DPR crop); 768 (+5 px, minor) |
| **Routes** | `/collections/wheels`, `/collections/all` (any grid using premium cards) |
| **Repro** | Open `/collections/wheels` at 375×667 → swipe left/right — page rubber-bands sideways ~74 px |
| **Evidence** | `screenshots/chromium/m-320-narrow/collection-wheels--full.png` is 449 CSS px wide (capture width = scrollWidth); 375/412 captures are 449/589.5 CSS px wide |
| **Root cause** | `.prd-grid.list-options-in-row` (Lumia product-grid variant) lays each card's variant-picker option groups in one horizontal row, forcing a card **min-content width ≈ 412 px**. At ≤412 the single card column exceeds the viewport; page `scrollWidth` = 449 @375. The nowrap price line (`prd-price-regular`, "From $1,100 / wheel" ≈ 166 px) compounds the floor. |
| **Proposed fix** | CSS-only (calder-product-card.css): at `max-width: 749px`, stack `.list-options-in-row` option groups vertically (`flex-direction: column`) and/or set `min-width: 0` + allow the price row to wrap; alternatively make grid tracks `minmax(0,1fr)`. Needs 1 hr + visual regression pass on collection cards. **Not implemented — pending approval (Phase 7).** |

### P1-V2. Universal PDP “You May Also Like” grid overflows at phone widths and 1024 landscape
| | |
|---|---|
| **Severity** | **P1** — horizontal scroll on the money page (PDP) |
| **Affected devices** | 320 (+166 px), 360 (+126 px), 375 (+111 px), 393 (+93 px), 412 (+74 px), 1024 landscape (+50 px) |
| **Routes** | `/products/calder-clm-01-wheel`, `/products/calder-clm-06-wheel` (all universal PDPs) |
| **Repro** | Open a universal PDP at 375×667, scroll to bottom (recommendations) → page scrolls sideways |
| **Evidence** | `artifacts/layout-audit.json` cells `m-*:pdp-clm-01` — docWidth 486 vs 375; culprit: `calder-product-card` at right:486 inside `div.container ← section.calder-recs-wr…` |
| **Root cause** | `.calder-recommendations__grid` uses `repeat(N, 1fr)` tracks; `1fr` floor = item min-content. Premium card min-content ≈ 222 px (nowrap price row 166 px + option row). Two 222 px tracks > 317 px container → grid exceeds page. |
| **Proposed fix** | `grid-template-columns: repeat(2, minmax(0, 1fr))` at phone breakpoints (verified live: scrollWidth 486→375). **Caution**: at 375 the card content (166 px price row in a ~151 px track) then clips inside the card — pair with the P1-V1 content-wrap fix, or use 1 column ≤ 400 px. **Not implemented — pending approval.** |

### P1-V3. Build-Your-Wheel page: broken center-finish swatches + missing center layer in preview — **RESOLVED (A1, 2026-11-03)**
Fixed settings-only (BYW `default_product` = universal CLM-01 variant product; verified live: 0 broken swatches at all widths, center preview layer loads + composites, SyntaxError gone). See MOBILE_QA_REPORT §4a. The EmptyDrop root-cause and data-debt notes are preserved below for the record.
| | |
|---|---|
| **Severity** | **P1** — visibly broken imagery on a demonstration flow (configurator hero visual degraded) |
| **Affected devices** | all 9 viewports (identical; not width-related) |
| **Route** | `/pages/build-your-wheel` |
| **Repro** | Open the page on any device → Center Finish selector shows 3 broken-image icons (Gloss Black / Black Titanium / Satin Silver); the live wheel preview renders barrel + bolts **without a center disk** |
| **Evidence** | `artifacts/layout-audit.json` `*:build-your-wheel` — 27 broken-image records (`assets/design--center-{bk,bkuti,su}.png` 404 at every viewport); functional probe: `.wheel-configurator__layer--center` `src=""`, `naturalWidth=0`; console: `Uncaught SyntaxError: Unexpected token ']'` |
| **Root cause** | Empty-design-code artwork chain (see MOBILE_QA_REPORT §BYW root-cause): `build-your-wheel-page.liquid` resolves `seed_product = all_products[""]` → **truthy EmptyDrop** (the Liquid `if` guard passes) → `configurator-data.liquid` renders `window._calderProductData[] = { product_id: , …}` → **script block fails to parse** → `window._calderDesignCode` left `''` → `configurator-api.js` builds `design--center-*.png` (empty design number → 404) and the center preview layer never gets a valid source. Finish options themselves load from the **external dev API** (`https://calder-dev.covedigitalworks.com`), which also supplies non-Calder finishes ("Satin Silver"). |
| **Proposed fix** | **Settings-only (fastest, zero code risk)**: in the BYW section settings set `default_product` to a universal product handle (e.g. `calder-clm-01-wheel`) — seed becomes a real product, embedded data populates, design code resolves, no external API call. **Code hardening (post-event)**: `{% if seed_product != blank %}` guard in `build-your-wheel-page.liquid` + generic artwork fallback in `buildFinishImageUrl` when `DESIGN_CODE` is empty. **Not implemented — pending approval.** |

---

## P2 — issues

### P2-V4. Composite-layer & card imagery aspect-ratio flags — audit noise, needs one human pass
The automated audit flagged 252 instances where an image's rendered box ratio deviates >18 % from its natural ratio. Triage of the top sources:
- `calder-uc-gal__media-img`, `201-disk-*.png` layers — the universal configurator stack uses **`object-fit: contain`** (calder-universal-controls.css:158-167): the *element box* is square but the *glyph* is letterboxed → **intentional, not distortion**.
- Home category images (`luxury_suv_white.png`, `full_size_truck_blue.png`, …) — `w-100` + aspect-ratio containers with cover/contain → intentional crops.
- `home-newsletter__background-im…` — `background-size` crops, not `<img>` distortion.
**Action**: one 10-minute human pass over the baselines at 320 and 375 (home + PDP + wheel gallery) to confirm no genuine squashing; none found by the geometric audit.

### P2-V5. Small touch targets in the mobile header
Measured raw tap areas below the 24 px WCAG floor (24×24) at 375:
- `.dropdn-link` (menu button) — 32×18 px
- `.top-level-link` ("Home"/"Wheels" mega-menu links) — 75×20 px (desktop nav items; mostly hidden on phones but present in the drawer DOM)
Effective hit areas may include padding on ancestors (needs the human pass); if the raw sizes hold, add ≥ 44×44 hit areas via padding (Apple HIG). **P2.**

### P2-V6. Tablet-landscape sticky stack (4 fixed/sticky elements)
At 1024 landscape on PDP and BYW: `hdr-wrap` (sticky header) + `hdr-mobile-bottom` (mobile bottom bar) + `aside-content` + `js-back-to-top` coexist. **No overlaps detected** at scroll 0/1200 (overlap check passed), but density is high; verify on a physical iPad that the bottom bar doesn't cover the configurator CTA.

---

## P3 — cosmetic / performance-adjacent

- **P3-V7.** Fonts served as OTF/TTF (~562 KB total: Facundo 110 KB, Garet 102 KB + 154 KB, Poppins 160 KB + 36 KB) — no WOFF2. Conversion cuts ~40–60 % of font bytes. (Known deferred item P1-5 from the 2026-10-14 audit.)
- **P3-V8.** Ionicons runtime loaded from `esm.sh` (theme.liquid:316–322) — third-party module CDN; on venue Wi-Fi failure, site icons vanish. Self-host before the event if possible (deferred item P1-6).
- **P3-V9.** BYW “not in stock” notice copy says the *combination* isn't in stock when the *quantity* exceeds component stock (misleading; relates to F-T1 in FUNCTIONAL_TEST_RESULTS.md).

## Platform noise (not defects)
- `POST /sf_private_access_tokens → 401` on every route — Shopify storefront private-access framework.
- `big-skins.com/sales/` XHR blocked by CORS — Lumia theme-family author telemetry.
- `local_rate_limited` body under request bursts — store rate limiter (test-infra only).
