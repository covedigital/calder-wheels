# Calder Wheels — Mobile & Tablet Functional Test Results (Pre-Event QA)

**Storefront**: https://wvpnpr-t7.myshopify.com · **Theme**: `calder-theme` (live, t/6)
**Harness**: Playwright 1.48.2 · Chromium 130 + WebKit 18 (mac12 builds) · 375px iPhone profile (primary) + WebKit spot checks
**Artifacts**: `qa-harness/artifacts/functional-375.json`, `qa-harness/artifacts/results.json`, `qa-harness/artifacts/perf-throttled.json`, `qa-harness/artifacts/lighthouse/`

**Suite result (final run)**: 16 passed / 1 failed — the single failure is the documented P1-V2 layout defect (PDP recommendations grid overflow at 1024 landscape), not a broken interaction.

---

## Area results (12 areas from the QA brief)

### 1. Homepage and navigation — ⚠️ P1 finding (drawer content)
| Test | Result |
|------|--------|
| Burger opens navigation drawer | **PASS** — `menu-popup .dropdn-link` opens `#dropdnMenuTabPopup` (AJAX `?section_id=async-header-navigation-mobile` content loads in ~2 s) |
| Drawer link navigates | **PASS** — tapped link navigates to target route |

**F-T1 (P1) — Mobile drawer menu is nearly empty.** Drawer content: `Home (/)`, `Wheels (/collections/wheels)`, `Gallery` (**no href, no submenu — dead item**), “View all” (`#`), and social links (`#`). Compare desktop nav: Home, Wheels, Gallery → *All Wheels, By Vehicle, By Style, Accessories, Our Story, Engineering, Find a Dealer, Fitment Tool, Build Your Wheel, Vehicle Gallery, Wheel Gallery, Contact, FAQs, Shipping, Returns*. **On phones, Fitment, dealer, contact, both galleries, and Build-Your-Wheel are unreachable from the menu.**
- Root cause: `async-header-navigation-mobile.liquid` composes `linklists['main-menu-0'] + settings.menu + linklists['main-menu-2'] + settings.menu_mobile`; live `config/settings_data.json` has **no `menu` value and empty `menu_mobile`** → only the sparse linklists survive. (“Gallery” exists in drawer text but has no anchor.) This matches the deferred “mobile menu data” audit item from 2026-10-14.
- Fix (store-side, no theme push): populate the store navigation menu the section reads (and/or set `menu_mobile`), with the mobile-relevant top level: Fitment, Wheels, Build Your Wheel, Wheel Gallery, Vehicle Gallery, Dealer, Contact.
- Mitigation until fixed: demo from the homepage CTAs (all critical routes are reachable there).

### 2. Product listing cards — PASS (interaction) / ⚠ P1 layout (see VISUAL_ISSUES P1-V1)
Cards render with price, tap-through to PDP works (16 cards @375). **Horizontal page scroll** on this route at every phone width — see VISUAL_ISSUES.md P1-V1 (`list-options-in-row` card min-content 412 px).

### 3. Wheel gallery — PASS
`.cg-v2` renders; items + tabs present; first gallery card tap-through works. No console/page errors.

### 4. Vehicle gallery — PASS
Items render (`.cg-v2` a[href]/img counts > 0); tap-through works.

### 5. Universal wheel configurator — PASS (interactions)
- Center-finish click updates `[data-calder-uc-selected="center"]` label (Gloss Black → Black Titanium) and the SKU cell reacts. **PASS @375 Chromium + @393 WebKit** (cross-engine).
- Diameter option click updates the selected label. **PASS**
- **Design nav (recent 404 fix): all 6 design links resolve `< 400`.** PASS — the paginate-lookup fix from 2026-11-03 is verified live on mobile.
- **5.3 Build-Your-Wheel page: interactions work but visuals broken — see F-T3.** Options hydrate (7), option click updates selection; **but** center swatches are broken images and the preview center layer is empty.

### 6. Wheel component image compositing — PASS (universal PDP)
- `[data-calder-uc-stack]` has all 3 layers (barrel/center/hardware).
- Center finish swap changes the center layer `src` (Gloss Black → Titanium Tint). **PASS**
- Barrel/lip swap changes the barrel layer `src`. **PASS**
- Zero unloaded layer images in either stack after selection changes. **PASS**

### 7. Vehicle fitment finder — PASS
- Selects populate from the catalog JS (`option` count > 3) @375 Chromium and @768 WebKit (cross-engine PASS).
- Cascading make → model selection works; submit produces result imagery (before/after counts recorded).

### 8. Product availability states — ⚠️ F-T2 (P1, order-integrity)
- Default in-stock config: CTA enabled, label “Add to Cart”. **PASS**
- Quantity-beyond-stock behavior: see F-T2 below.
- Qty reset to 1 restores availability. **PASS**

**F-T2 (P1) — Component gate does not block an over-quantity add at click time.** At qty 99 (demo BOM max build = 10 for 22″ blanks), clicking Add to Cart:
1. POST `/cart/add.js` goes out **`{"id":…,"quantity":99}`** — captured by network watcher;
2. Shopify clamps to the variant’s Shopify inventory → **cart item_count 0 → 50**;
3. only *afterwards* does the async recheck flip the CTA to `NO_STOCK` (disabled) with the notice “This exact combination isn’t in stock — please speak with a support representative to confirm availability.”

Root cause (`calder-universal-cta.js` click path ~line 425): the pre-add staleness check reuses the **last rendered outcome** (computed at qty 1, state `AVAILABLE`, same config seq — quantity is not part of the staleness key) instead of recomputing `qbAvailability(tokens, readQuantity())` before dispatching the add. Net effect: the QuickBooks-BOM availability model is bypassed whenever the quantity changes after the last render.
- Event impact: low (reps demo qty 1); data-integrity impact: real. Post-event fix (needs approval): recompute the QB availability for the *current* quantity synchronously in the click handler before the fetch, disable + notice if short.
- Related copy defect P3: the notice blames the *combination*; it’s the *quantity* that isn’t buildable.

### 9. Add to Cart and inquiry behavior — PASS (with F-T2 caveat)
- Add to cart at qty 1: cart count increments; **cart cleared after test** (`/cart/clear.js` — no orders placed, no checkout touched). **PASS**
- Unlisted combination (26″ + titanium + polished + black bolts): CTA disabled, request-custom-configuration notice shown, no add. **PASS — inquiry path works.**

### 10. Responsive forms and buttons — PASS
- All visible form controls ≥ 16 px font @375 (iOS zoom guard) on fitment page. **PASS (0 violations)**
- CTA ≥ 44 px tall. **PASS**
- See VISUAL_ISSUES P2-V5 for small header tap targets.

### 11. Sticky and floating UI — PASS
Fixed/sticky inventory @scroll 1200 on PDP: **no overlapping fixed elements** (overlap check passed); 4-element sticky stack at 1024 landscape without conflicts (P2-V6 notes density).

### 12. Portrait ↔ landscape transitions — ⚠ PASS on phone / FAIL at tablet-landscape
- 375 portrait → 667 landscape: no overflow (≤ 2 px). **PASS**
- 768 portrait → 1024 landscape: **+50 px horizontal overflow** — the PDP recommendations grid (P1-V2, `repeat(4, 1fr)` × 222 px min-content cards). Reproduction: rotate an iPad to landscape on any universal PDP and swipe sideways near the bottom. Same root cause + fix as P1-V2.

---

## Cross-engine (WebKit) spot checks — PASS
- Configurator option click updates label @393 (WebKit/iOS Safari profile). **PASS**
- Fitment selects populate @768 (WebKit). **PASS**

## Pre-existing / platform (not counted against the theme)
- `big-skins.com` telemetry XHR (CORS-blocked) and `POST /sf_private_access_tokens → 401` — see DEVICE_TEST_MATRIX.md §platform noise.

## BYW page — F-T3 (P1) — **RESOLVED by A1 (2026-11-03)**

The EmptyDrop → SyntaxError → 404-swatch chain is fixed settings-only: BYW `default_product` now seeds with the universal CLM-01 **variant** product (`calder-clm-01-6x135-…-wheels`), whose `custom.design_code` metafield is hyphenated (`CLM-01`) and resolves through `configurator-product-data.liquid`’s case mapping to design 201 artwork. Live-verified @375: 0 page errors, 0 broken swatches at all widths, embedded components boot, center preview layer loads and swaps on finish change, finish data comes from embedded product data (external dev API no longer consulted, “Satin Silver” gone), “In Stock” badges render.

**Remaining data debt (Tier B, post-event)**: the six *design* products (`calder-clm-XX-wheel`) carry **non-hyphenated** `design_code` metafields (`CLM01`), which miss the snippet’s case mapping — so only variant-product seeds currently resolve BYW artwork. Normalize the metafields or extend the case list (B5).