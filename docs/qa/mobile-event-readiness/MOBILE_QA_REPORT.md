# Calder Wheels — Mobile & Tablet Pre-Event QA Report

**Date**: 2026-11-03 · **Storefront**: https://wvpnpr-t7.myshopify.com · **Theme under test**: `calder-theme` (live, ID `191023546677`, assets `/cdn/shop/t/6/`) — verified byte-identical to the local working theme (`docs/design/Shopify Themes/Working Theme-via-CLI/`) on the 15 most recently modified files; **the live published theme IS the intended preview theme.**

**Deliverable set** (this directory):
- `MOBILE_QA_REPORT.md` — this report (executive summary, verdict, remediation plan)
- `DEVICE_TEST_MATRIX.md` — emulation environment, 9-viewport matrix, routes, platform noise
- `FUNCTIONAL_TEST_RESULTS.md` — 12-area functional results + defects F-T1…F-T3
- `VISUAL_ISSUES.md` — visual/layout defects P1-V1…P1-V3, P2/P3 items
- `PERFORMANCE_RESULTS.md` — Lighthouse, throttled-network pass, reliability signals
- `EVENT_LAUNCH_CHECKLIST.md` — launch gates, verdict, 5-minute manual device script
- `qa-harness/` — Playwright harness (5 spec suites + lighthouse runner), **202 baseline screenshots**, JSON artifacts (layout audits, functional records, perf metrics)

---

## 1. Executive summary

The theme’s **core demonstration flows work on mobile**: the universal wheel configurator drives image compositing correctly (center/barrel/hardware layers swap with selections, zero unloaded layers), vehicle fitment cascades and returns results, both galleries render and tap through, add-to-cart works at qty 1, the inquiry path gates unlisted combinations properly, forms meet the 16 px iOS-zoom floor, CLS is ~0 everywhere, and there are no uncaught JS exceptions on any critical route except Build-Your-Wheel. The recently feared design-nav 404 fix is verified live (all six design links resolve).

Three P1 defects need decision before the event:

| ID | Severity | Summary | Where |
|----|----------|---------|-------|
| **P1-V1** | P1 | Collections page **scrolls horizontally** at every phone width (card min-content 412 px) | `/collections/wheels` |
| **P1-V2** | P1 | Universal PDP recommendations grid **overflows** at phone widths (+74…+166 px) and iPad landscape (+50 px) | all universal PDPs |
| **P1-V3 / F-T3** | P1 | Build-Your-Wheel page: **JS SyntaxError + 3 broken center swatches + missing center layer in preview**; finish data sourced from an external dev API | `/pages/build-your-wheel` |
| **F-T1** | P1 | Mobile drawer menu nearly **empty** (Home, Wheels, dead Gallery) — fitment/dealer/contact/galleries unreachable from mobile nav | all pages |
| **F-T2** | P1 | Component **gate bypassed at over-quantity** (qty 99 add posts anyway, Shopify clamps to 50) — inventory-integrity, low event exposure | universal PDP |

No P0 (demonstration-blocking) defects: every flow a rep will demo completes end-to-end on a 375 px phone.

## 2. Root cause of the BYW defect chain (P1-V3)

1. `build-your-wheel-page.liquid:9-12` resolves `default_product = all_products[""]` (setting is empty) → Liquid returns a **truthy EmptyDrop**; the `if seed_product` guard passes.
2. `configurator-data.liquid` renders against the hollow product → `window._calderProductData[] = { product_id: , … }` → **the entire script block fails to parse** (`SyntaxError: Unexpected token ']'`), so `window._calderDesignCode` and `_calderProductComponents` never bootstrap.
3. `configurator-api.js` (`buildFinishImageUrl`, line 61) prefixes center artwork with the now-empty `DESIGN_CODE` → `design--center-{bk,bkuti,su}.png` → **404** on all three center swatches, at all 9 viewports (27 broken-image records).
4. With embedded data unusable, `loadComponents` falls back to the **external dev API** `https://calder-dev.covedigitalworks.com` — which also supplies non-Calder finishes (“Satin Silver” appears as a center option) — and the preview center layer is left without a source (`src=""`): **the preview wheel renders barrel + bolts but no center disk**.

## 3. Remediation plan (prioritized; NOTHING implemented without approval)

### Tier A — settings-only, zero theme-code risk (recommended before the event)
| # | Action | Fixes | Status |
|---|--------|-------|--------|
| A1 | BYW section `default_product` → universal CLM-01 variant | P1-V3 chain | **✅ APPLIED & VERIFIED 2026-11-03** — see §4a below |
| A2 | Populate the store mobile menu (`menu_mobile`) | F-T1 | **⛔ BLOCKED — needs 5-min admin action** — see §4b below |

#### §4a — A1 result (applied)
`templates/page.build-your-wheel.json` → `sections.build-your-wheel.settings.default_product` = **`calder-clm-01-6x135-p30-87-1mm-gloss-black-lip-black-bolts-wheels`** (universal CLM-01 6x135 variant product), pushed to the live theme with `--only` (no other files touched). Verified live @375:
- EmptyDrop → `window._calderProductData[]` SyntaxError **gone** (0 page errors)
- `window._calderDesignCode = 'CLM-01'` resolves; embedded `_calderProductComponents` boots (6 products, components populated)
- Center swatches: **0 broken** (previously 3 × 404 at every viewport); preview center layer loads and **swaps src on finish change** (compositing verified: `…center-bk.png` → `…center-bkuti.png`)
- Finish data now comes from **embedded product data**, not the external dev API (no more "Satin Silver" leak); "In Stock" badges render
- Regression: 25/26 pass (single failure = pre-existing P1-V2 landscape overflow, unchanged)

> **Why the variant product, not `calder-clm-01-wheel`**: the design products carry `custom.design_code` **without a hyphen** (`CLM01`), which misses `configurator-product-data.liquid`’s hyphenated case mapping (`'clm-01'`) → empty design number → empty artwork. The variant products carry the hyphenated `CLM-01` metafield and resolve to design 201 artwork natively. Data-debt note: design-product metafield spelling should be normalized (or the case list extended) in Tier B — post-event.

#### §4b — A2 result (blocked; probe evidence)
The mobile drawer composes `main-menu-0` + `settings.menu` + `main-menu-2` + `settings.menu_mobile`. Live probes (`settings_data.json` pushes + live drawer renders) confirmed existing menus: **only `main-menu` (Home/Wheels/Gallery — current drawer) and `footer`** (flat 4 items: All Wheels/By Vehicle/By Style/Accessories, **placeholder hrefs `/`**). Probed and absent: `footer-1…footer-4`, `mobile-menu`, `main-menu-1`, `menu`, `tools`, `explore`, `resources`, `support`, `quick-links`. The three useful footer-column menus (Fitment Tool / Build Your Wheel / Vehicle+Wheel Gallery; Contact/FAQs…) exist as **store data but their handles are not discoverable without admin access**, and menus cannot be created via theme CLI. `menu_mobile` was restored to `""` (original value; client’s settings preserved byte-for-byte otherwise).
**Required admin action (5 min)**: Online Store → Navigation → *Add menu*, handle `mobile-menu`, items: Fitment (`/pages/fitment`), Wheels (`/collections/wheels`), Build Your Wheel (`/pages/build-your-wheel`), Wheel Gallery (`/pages/wheel-gallery`), Vehicle Gallery (`/pages/vehicle-gallery`), Contact, Find a Dealer. Then either set **Theme settings → “Only Mobile Navigation”** in the theme editor to it, or one command: `shopify theme push --only config/settings_data.json --allow-live` (prepare the file first). Harness re-verification: render `/?section_id=async-header-navigation-mobile` and expect the new items.

### Tier B — small code fixes (low-risk, additive; each needs explicit approval + theme push + regression pass)
| # | Action | Fixes | Risk |
|---|--------|-------|------|
| B1 | `build-your-wheel-page.liquid`: change `{% if seed_product %}` → `{% if seed_product != blank %}` | hardens the EmptyDrop guard | minimal, additive |
| B2 | `calder-product-card.css` media `≤749px`: stack `.list-options-in-row` option groups vertically + `min-width: 0` + allow price row wrap | P1-V1 | small; visual regression pass needed on collection cards |
| B3 | `.calder-recommendations__grid` → `repeat(2, minmax(0, 1fr))` at phone widths (verified live: 486→375 px) — pair with B2 content-wrap or 1 column ≤400 px | P1-V2 | small |
| B4 | `calder-universal-cta.js` click handler: recompute `qbAvailability(tokens, readQuantity())` **before** dispatching `/cart/add.js`; disable + notice if short; fix the “combination vs quantity” notice copy | F-T2 (+P3-V9) | small but touches purchase logic — full CTA regression suite (69 tests) must pass |

### Tier C — post-event
- **B5 (new):** normalize `custom.design_code` metafields on the six design products (`CLM01` → `CLM-01`) or extend `configurator-product-data.liquid` case list with non-hyphenated aliases — currently BYW only works with variant-product seeds.
- WOFF2 fonts (562 KB → ~250 KB), self-hosted Ionicons, WebP/AVIF photography pipeline (3.6 MB PDP), BYW external-API removal (embedded-only), generic-artwork fallback in `buildFinishImageUrl`.

**Regression protocol for any approved fix**: `npm test` (69 unit suites) → `npx playwright test 01-smoke 04-functional` in `qa-harness/` → `node lib/diff-baselines.mjs` (screenshots vs baseline; changed shots need human approval) → manual 5-min device script.

## 4. Verdict — CONDITIONAL GO

**CONDITIONAL GO for the event**, contingent on:

1. ~~**A1 executed + verified**~~ **DONE (2026-11-03)** — verified live @375: BYW configurator hydrates, composites, and gates with zero broken imagery and zero page errors; regression 25/26 (sole failure = pre-existing P1-V2). Demo the **universal PDP configurator** as the primary flow; BYW is now also demo-safe.
2. ~~**Demo route guidance** (mitigates P1-V1/V2 until B2/B3)~~ **STILL ACTIVE**: collections/PDP have slight horizontal play on phones — keep the phone portrait, scroll vertically (or approve B2/B3).
3. **Homepage-first navigation (mitigates F-T1)**: A2 is blocked on a 5-minute admin action (§4b); until the mobile menu exists, all critical routes are one tap from the homepage — don’t rely on the drawer.

**NO-GO triggers**: if verification of A1 fails, or if the client wants BYW perfect and no settings access is available before the event, the event demo should stick to the universal PDP (which is fully green) and skip BYW — which would return the overall status to GO for that reduced scope.

*(Update 2026-11-03: A1 verification PASSED — BYW is demo-safe. Remaining NO-GO triggers do not apply. The reduced-scope GO (universal PDP only) remains the fallback if any on-device check fails.)*

GO requires zero P0/P1 in critical flows; of the five P1s, **P1-V3/F-T3 is now fixed by A1**, and F-T2 is not reachable at demo quantities. The remaining layout P1s (P1-V1, P1-V2) are visible but non-blocking at human demo pace and have settings-tier or one-line-CSS paths. Full gates and the manual verification script: **EVENT_LAUNCH_CHECKLIST.md**.

## 5. Test coverage summary

| Suite | Tests | Result |
|-------|-------|--------|
| Smoke (9 routes @375, Chromium) | 9 | 9 pass (2 defects recorded, not gated) |
| Visual baselines Chromium (9 viewports × 9 routes) | 81 | 79 pass + 2 rate-limit losses re-captured in layout pass |
| Visual baselines WebKit (5 viewports × 4 routes) | 20 | 20 pass |
| Layout audit (9 viewports × 6 routes) | 54 | 54 pass — data drives P1-V1/V2/V3 |
| Functional 12-area suite @375 Chromium | 17 | 16 pass, 1 known-defect fail (12.1 t-768 landscape = P1-V2) |
| WebKit functional spot checks | 2 | 2 pass |
| Throttled perf pass | 4 | 4 pass |
| Lighthouse (4 routes) | 4 | 54–76 perf, CLS ≈ 0 |

> **Emulation disclaimer**: Playwright Chromium/WebKit on macOS 12 approximates but does not replace physical iOS/Android testing (touch latency, momentum scroll, iOS input zoom, safe areas). The **manual 5-minute device script in EVENT_LAUNCH_CHECKLIST.md is mandatory** on at least one real iPhone and one real iPad before the event.