# Calder Wheels — Configurator Code Audit

**Date:** 2026-10-14
**Task:** CW-CFG-1014 — Calder PDP & Wheel Configurator Functional Repair
**Auditor:** OpenCode (DeepSeek V4 Flash)
**Theme root:** `docs/design/Shopify Themes/Working Theme-via-CLI/`
**Governing documents:** `CALDER_OPENCODE_MANDATORY_GUARDRAILS.md`, `AGENTS.md`

---

## A. Scope of Inspection

| File | Lines | Role | Classification |
|------|-------|------|----------------|
| `templates/product.calder.json` | 481 | Template (calder-product + wheel-configurator + fitment sections) | READ_ONLY / PROTECTED |
| `layout/theme.liquid` | 327 | Global scripts; already loads `calder-demo-inventory.js` + `wheel-configurator.css` on configurable products | READ_ONLY / PROTECTED |
| `sections/calder-product.liquid` | 3798 | PDP: native picker, hardware select, fallback form, inline sync script | AUTHORIZED_EDIT (bounded) |
| `sections/wheel-configurator.liquid` | 1076 | Configurator section used on PDP | AUTHORIZED_EDIT |
| `sections/build-your-wheel-page.liquid` | 791 | Standalone builder | AUTHORIZED_EDIT |
| `snippets/configurator-data.liquid` | 84 | Emitted product/component data contract | AUTHORIZED_EDIT |
| `snippets/configurator-image.liquid` | 49 | Finish image filename resolver | CONDITIONAL (verified no change needed) |
| `snippets/variant_picker.liquid` | 443 | Lumia native picker (dropdown) | READ_ONLY_REFERENCE |
| `snippets/product-buy-buttons.liquid` | 191 | Lumia buy button snippet (not active on this PDP — no buy_buttons block) | READ_ONLY_REFERENCE |
| `snippets/price.liquid` | 161 | Lumia price render (variant-aware) | READ_ONLY_REFERENCE |
| `assets/configurator-app.js` | 982 | Configurator state machine | AUTHORIZED_EDIT |
| `assets/configurator-api.js` | 357 | Variant resolution + availability + cart | AUTHORIZED_EDIT |
| `assets/calder-builder-page.js` | 194 | Standalone design switch | AUTHORIZED_EDIT |
| `assets/calder-demo-inventory.js` | 224 | Demo component inventory | CONDITIONAL (see §G-4) |
| `assets/global.js` | 1412 | Lumia VariantSelects / price / media / AJAX | READ_ONLY / PROTECTED |
| `assets/product-form.js` | 410 | Lumia product-form AJAX | READ_ONLY / PROTECTED |

---

## B. Authoritative Business Model (Injected Contract)

Four configuration dimensions per product:
1. **Diameter** — native Shopify **Option 1**: `22"`, `24"`, `26"`
2. **Center Finish** — native **Option 2**: `Gloss Black`, `Black Tint`, `Titanium Tint`
3. **Barrel & Lip Finish** — native **Option 3**: `Black`, `Chrome`
4. **Hardware & Rivet Finish** — non-native: `Black Bolts`, `Chrome Bolts` (metafield `product.metafields.custom.hardware_rivet_finish_options`, single-line text `Black Bolts, Chrome Bolts`)

Hardware has **no price effect**. Cart line-item property must be customer-visible `Hardware & Rivet Finish: <value>`. Expected full matrix = 18 native variants × 2 hardware = 36 finished configurations (when all exist).

---

## C. Current Event Sequence (as deployed)

### C.1 PDP native-variant path (native products — the real case)
```
user changes <select name="options[...]"> inside <variant-selects>
  → 'change' bubbles to VariantSelects handler (global.js:313)
  → onVariantChange()  global.js:321
      guards: if window._calderSuspendVariantChange return  (global.js:322 — PRESENT)
      → renderSection() global.js:327
          updateMasterId / disableUnavailable / updateMedia / updateURL / updateVariantInput / renderProductInfo ...
          updateVariantInput (global.js:793) sets input[name="id"] on section forms + dispatches 'change'
          renderProductInfo (global.js:825) re-renders [data-render] blocks (price) via ?variant=&section_id= fetch
  → calder-product.liquid MutationObserver on input[name="id"] fires (calder-product.liquid:2081-2093)
      → dispatchPdpVariantChange() → CustomEvent 'calder:pdp-variant-change' (calder-product.liquid:2067-2077)
  → configurator-app.js listenForPdpChanges (configurator-app.js:568-601)
      reads detail.center/barrel/hardware and clicks matching option chips (diameter NOT handled)
  → PDP hardware select change → dispatch ✓
```

### C.2 Configurator → PDP path
```
click finish chip (configurator-app.js bindOptionClicks:167-188)
  → self.selected[t]=..., updatePreview, updateSummary, checkAvailability, syncToPdpOption(t)
  → syncToPdpOption (configurator-app.js:486-548)
      sets window._calderSuspendVariantChange (WRONG: suppresses Lumia update)
      updates PDP finish chips (only non-native fallback chips)
      directly overwrites input[name="id"] WITHOUT dispatching native change
      → PRICE/PDP selected controls NOT updated; hardware select NOT updated
```

### C.3 Purchase paths
- **PDP ATC** = native `<form action="/cart/add">` (fallback form, calder-product.liquid:1288-1354) — posts `input[name=id]`, quantity, and `properties[_hardware_rivet_finish]`. No `<product-form>` wrapper → plain form POST (Lumia-native behavior preserved, no AJAX drawer).
- **Configurator ATC** = `ConfiguratorAPI.addToCart()` (`/cart/add.js` XHR, configurator-api.js:301-318) from `WheelConfigurator.addToCart` (configurator-app.js:673-734); on error → `submitViaPdpForm` fallback (unsafe, see F-9).

---

## D. Exact Function Index (current line numbers)

### `assets/configurator-api.js`
| Line | Symbol | Purpose |
|------|--------|---------|
| 16 | `componentsPopulated()` | Short-circuit loadComponents |
| 70 | `loadComponents()` | Returns embedded components or fetches |
| 111 | `resolveAllOptionVariant()` | **Broken matching (F-2)** |
| 118 | `tokenMatch()` | **Substring/token bug — fails multi-word labels (F-2)** |
| 158 | `listContainsComponent()` | Combo support check (exact, OK) |
| 172 | `isComboSupported()` | Uses components lists |
| 179 | `loadProduct()` | `/products/{handle}.js`, TTL 30s |
| 204 | `checkAvailability()` | **Passes diameter but app passes null; unsafe fallbacks (F-3/F-5)** |
| 301 | `addToCart()` | XHR `/cart/add.js` (OK) |
| 335 | `buildComponentsFromProduct()` | option2/3/4 → center/barrel/hardware (legacy) |

### `assets/configurator-app.js`
| Line | Symbol | Purpose |
|------|--------|---------|
| 8 | `WheelConfigurator` | Constructor: `selected = {center,barrel,hardware}` — **no diameter (F-1)** |
| 46 | `init()` | Hide UI, loadComponents |
| 56 | `loadComponents()` | via API |
| 90 | `handleComponentsData()` | render options, preload defaults, listen |
| 108 | `renderOptionsFromDom()` | legacy |
| 137 | `renderOptions(type)` | rebuild chip groups |
| 167 | `bindOptionClicks()` | chip select → sync chain |
| 190 | `preloadDefaultImages()` | selects first available finish — **ignores PDP active variant (F-6)** |
| 222 | `updateSummary()` | center/barrel/hardware only — **no diameter row (F-1)** |
| 238 | `checkAvailability()` | **passes null diameter (F-3)** |
| 264 | `checkAvailabilityFallback()` | **tokenMatch again; no diameter (F-2/F-3)** |
| 370 | `handleAvailabilityData()` | **no stale-response guard; network error → "checking" (F-5)** |
| 473 | `configSummaryText()` | no diameter |
| 486 | `syncToPdpOption()` | **sets suspend flag + direct input overwrite; no native change (F-6)** |
| 550 | `updatePdpFinishChips()` | chips only (non-native path) — no hardware select |
| 568 | `listenForPdpChanges()` | reads only center/barrel/hardware, **no diameter (F-6)** |
| 673 | `addToCart()` | **no 4-dim validation, hardcoded qty=1, fallback on error, no repeat guard (F-9)** |
| 736 | `submitViaPdpForm()` | unsafe fallback (F-9) |
| 775 | `buildComponentsFromProduct()` | legacy |
| 807 | `CalderConfigurator` | selections/selectionIds/saveBuild/shareBuild/buildPdf — **no diameter (F-1/F-10)** |
| 970 | `init()` | instantiate all `.wheel-configurator` |

### `sections/calder-product.liquid` (inline script)
| Line | Symbol | Purpose |
|------|--------|---------|
| 2045 | `getPdpSelections()` | **reads only non-native `[data-calder-diameter]` + finish chips — EMPTY for native products (F-6)** |
| 2067 | `dispatchPdpVariantChange()` | described above |
| 2080 | native id MutationObserver | dispatches pdp event on input mutation ✓ |
| 2095 | hardware select → hidden property | syncs `properties[_hardware_rivet_finish]` ✓ (wrong key, F-7) |
| 843-903 | hardware metafield select | **placeholder preselected, no default (F-8)** |
| 1288-1354 | fallback product form | posts id/qty/hardware-property |

### `assets/global.js` (protected — verified, not edited)
| Line | Symbol | Status |
|------|--------|--------|
| 322 | `_calderSuspendVariantChange` guard | PRESENT |
| 696-697 | `productContainer` null guard in updateMedia | PRESENT (prior CW-CFG-004 repair persisted) |
| 793 | `updateVariantInput()` | sets id on all section forms + change event |
| 825 | `renderProductInfo()` | re-renders price via section fetch |

---

## E. Current Product/Variant Data Sources

1. **`window._calderProductComponents`** (configurator-data.liquid:29-76): `product_id`, `base_price`, `lead_time_days`, `design_code`, `variant_map`, `components{center,barrel,hardware}` from **BOM metafield**. No native `variants` array, no `hardware_options`, no canonical option values. **Global overwrite risk** (single global).
2. **`data-calder-product-json="{section.id}"`** (calder-product.liquid:1587-1597): `product.variants | json` — the only full native variant data, PDP-only.
3. **`/products/{handle}.js`** (configurator-api.js `loadProduct`): network fallback used when embedded data "not populated".
4. **`window._bywProductData`** (build-your-wheel-page.liquid:76-128): per-design component data (no variants), used by builder design switch.

**Defect:** the frontend cannot currently resolve the exact selected variant from `_calderProductComponents` alone; it must fetch `/products/{handle}.js`, which fails catastrophically on the builder when `productHandle` is stale (see F-11).

---

## F. Confirmed Defects (bounded corrections proposed)

### F-1 (CFG-001) — Diameter absent from configurator state
`this.selected` has no `diameter` (configurator-app.js:14). No diameter control exists in `wheel-configurator.liquid` or `build-your-wheel-page.liquid` (verified: no `configurator-diameter` / `data-component="diameter"` markup anywhere). Summary renders 3 rows (wheel-configurator.liquid:185-195). Save/Share/localStorage/hash omit diameter. CSS **already provides** `.wheel-configurator__diameter-select` (wheel-configurator.css:113-142) — markup pattern exists, unused.

### F-2 (CFG-002) — `resolveAllOptionVariant()` breaks exact matching
`tokenMatch()` (configurator-api.js:118-122) splits the variant option on whitespace and tests `tokens.indexOf(searchLabel)`. `"Gloss Black"` search → tokens `[gloss, black]`, `indexOf("gloss black") === -1` → **multi-word center options never match**. Same defect in:
- configurator-app.js `syncToPdpOption` (526-530)
- configurator-app.js `checkAvailabilityFallback` (278-282)
- configurator-api.js `checkAvailability` diameter fallback (267)
Unsafe fallbacks remain after no-exact-match: current PDP variant, first available, first variant (configurator-api.js:147-155); and diameter-only BTO fallback assigning a *different* variant id (configurator-api.js:260-296). Violates "never substitute a different available variant".

### F-3 (CFG-003) — Diameter not passed into availability
`configurator-app.js:255` passes literal `null` for diameter to `checkAvailability`. Demo inventory receives `diameter` but returns no status/unknown semantics (calder-demo-inventory.js:135). Missing demo SKU ⇒ `qty 0` ⇒ reported "out of stock" instead of "unknown/demo-only" (calder-demo-inventory.js:146-152). No stale-response guard: rapid selection + async `/products/{handle}.js` callback can apply an older result (configurator-app.js:370).

### F-4 (CFG-004) — Data contract incomplete
`configurator-data.liquid` emits BOM component labels ("Black Titanium", "Satin Silver", "Polished" per `fitment/calder-metafields.json`) as the *selectable finish options* — these do **not** match native option values (`Black Tint`, `Titanium Tint`, `Chrome`). No native `variants` array, no `hardware_options`, no `default_hardware`, no `product_handle`. Diameter `available` reflects only the first encountered variant (line 46). Hardware hardcoded `available:true` (lines 55/63/71) — acceptable as data-side since runtime demo inventory is unavailable at render time, but must be gated at runtime (F-3).

### F-5 (CFG-003/005) — Stale/non-distinct availability states
`handleAvailabilityData` (configurator-app.js:370-422): `data === null` (network/load error) renders "Checking availability…" (line 419-421). No sequence token. Build-to-order branch (397-407) enables Add with possibly `variant_id:null`.

### F-6 (CFG-005) — Two-way sync broken for native products
`getPdpSelections` reads only non-native `[data-calder-diameter]` and `[data-calder-finishes]` chips (calder-product.liquid:2045-2064); for native products (the store's real case) these elements don't exist → dispatched `detail` lacks diameter/center/barrel. `listenForPdpChanges` ignores diameter. `syncToPdpOption` (configurator-app.js:486-548) sets `_calderSuspendVariantChange` (killing Lumia's render) and overwrites `input[name=id]` directly — PDP price/media/controls do NOT update. Hardware select never synced.

### F-7 (CFG-006/007) — Cart payload
Configurator ATC:
- no all-four-dimensions validation
- quantity hardcoded `1` (configurator-app.js:697)
- no repeat-submission guard
- internal-only properties (`_center_finish` etc.) — missing customer-visible `Hardware & Rivet Finish`; missing diameter property
- on error → `submitViaPdpForm` (configurator-app.js:701, 736-747): silently submits PDP form, can add a different/duplicate line
PDP fallback form posts `properties[_hardware_rivet_finish]` (calder-product.liquid:1309-1314) — key differs from the required `Hardware & Rivet Finish`, so PDP & configurator payloads are **not equivalent**.

### F-8 (CFG-005) — Hardware default
`data-calder-hardware-rivet` select preselects placeholder "Select Hardware" (calder-product.liquid:887-888). No explicit default; empty property on PDP add if untouched.

### F-9 (CFG-009) — Standalone design switch stale identity
`calder-builder-page.js:156-192`: sets `_calderProductComponents`, updates only `data-product-id` (never `data-product-handle`), creates `new WheelConfigurator(wcEl)` with `productHandle = dataset.productHandle || productId` (stale numeric id from builder markup — `data-product-handle` attribute absent at line 208-211 of build-your-wheel-page.liquid). `window._calderDesignCode` never updated → demo inventory resolves wrong design (calder-demo-inventory.js:78). Availability then loads `/products/{stale-handle}.js` → **could add a variant from the previously selected product.**

### F-10 (CFG-001/008) — Summary & price
Summary rows/`configSummaryText`/`CalderConfigurator.*` omit diameter. `updatePrice` (configurator-app.js:448) prefers PDP DOM text (stale when PDP not synced) over the resolved variant price; requirement is the resolved variant price is authoritative. `priceEl` id `configurator-summary-price` lacks section suffix (P2, deferred).

### F-11 (CFG-009) — Builder 20-product collection limit
`build-your-wheel-page.liquid:69,187` `limit: 20`. Calder curates a small configurable catalog; the section is a single section, one page. Bounded decision: keep limit 20 (matches approved layout); no pagination required for target catalog. Documented, not a defect.

---

## G. Verified-OK Behaviors (no action)

- G-1. Lumia `VariantSelects` change pipeline (global.js:321-346) is the correct native path; `updateVariantInput` propagates `input[name=id]`; `renderProductInfo` updates price.
- G-2. `_calderSuspendVariantChange` guard present (global.js:322); `productContainer` null guard present (global.js:696-697). The CW-CFG-004 crash path is guarded in the deployed asset.
- G-3. `ConfiguratorAPI.addToCart` XHR (`/cart/add.js`) is sound (no parseInt coercion, configurator-api.js:301-318).
- G-4. `configurator-image.liquid` resolves flat asset names correctly; no change needed.
- G-5. `calder-demo-inventory.js` min-component available-to-build logic correct for known components (`getAvailableToBuild`).
- G-6. PDP gallery sync + quantity sync (calder-product.liquid) intact and preserved.
- G-7. `disableUnavailable()` in Lumia keeps native option combos truthful at the PDP level.
- G-8. `data-section-render` present on the calder-pdp section (calder-product.liquid:402) so `VariantSelects.section` traversal works.

---

## H. Runtime Dependencies (must remain intact)

- `Shopify.*`, `window.Shopify.routes` (theme.liquid global config)
- `variant-selects` custom element (global.js) + per-section `<script type="application/json">` variant payload
- `cart-items`/`cart-drawer` render pipeline (cart.js) — configurator refresh events (`cart:updated`) must remain
- `window._calderDesignCode`, `window.CALDER_ASSET_BASE`, `window.CALDER_API_BASE`
- `calder-demo-inventory.js` global load on product pages (theme.liquid:76) and builder page (build-your-wheel-page.liquid:496)

---

## I. Proposed Bounded Corrections

| ID | File(s) | Change |
|----|---------|--------|
| CFG-001 | wheel-configurator.liquid, build-your-wheel-page.liquid, configurator-app.js | Add diameter `<select>` control (existing `.wheel-configurator__diameter-select` styling), add diameter to state/summary/save/share/restore. No deliberate visual change. |
| CFG-002 | configurator-api.js, configurator-app.js | Exact normalized equality per option slot (option1/2/3); hardware excluded from native matching; remove all fallback variant substitution; structured `{status, variant_id}` result. |
| CFG-003 | configurator-api.js, configurator-app.js, calder-demo-inventory.js | Pass diameter; Shopify variant availability = primary gate; demo inventory = additional constraint with explicit unknown when data missing; sequence token to drop stale responses; distinct error state. |
| CFG-004 | configurator-data.liquid, build-your-wheel-page.liquid | Emit canonical native option values, full `variants` array, `hardware_options`, `default_hardware`, `product_handle`; key product data store to avoid global overwrites. |
| CFG-005 | calder-product.liquid, configurator-app.js | getPdpSelections reads native picker; init-from-URL-variant; drive Lumia via `variant-selects` change event; sync hardware select + property; single origin guard; no recursion. |
| CFG-006 | configurator-app.js | Validate 4 dims, resolve exact, confirm availability/hardware, capture quantity, disable repeat submit, single authoritative payload incl. `Hardware & Rivet Finish` property; remove form-fallback. |
| CFG-007 | calder-product.liquid | Rename hidden property to `properties[Hardware & Rivet Finish]`; preselect explicit hardware default; keep native form/Native submit; no duplicate forms/ids. |
| CFG-008 | configurator-app.js | Variant price authoritative; hardware +$0; summary adds Diameter row; keep summary styling. |
| CFG-009 | build-your-wheel-page.liquid, calder-builder-page.js, configurator-app.js, configurator-api.js | Set `data-product-handle`, update `_calderDesignCode`, reuse single instance via `configure()`; reset stale variant id; never reuse previous product's variants. |
| CFG-010 | (none edited) | Report verified guards in global.js; `productContainer` null error investigated against deployed asset — guard present; browser-verify pending. |

---

## J. File Classification Register (per mandatory guardrails)

| File | Classification | Edit? |
|------|----------------|-------|
| `snippets/configurator-data.liquid` | AUTHORIZED_EDIT | Yes |
| `assets/configurator-api.js` | AUTHORIZED_EDIT | Yes |
| `assets/configurator-app.js` | AUTHORIZED_EDIT | Yes |
| `assets/calder-builder-page.js` | AUTHORIZED_EDIT | Yes |
| `sections/wheel-configurator.liquid` | AUTHORIZED_EDIT | Yes |
| `sections/build-your-wheel-page.liquid` | AUTHORIZED_EDIT | Yes |
| `sections/calder-product.liquid` | AUTHORIZED_EDIT | Yes (bounded) |
| `assets/calder-demo-inventory.js` | CONDITIONAL_EDIT | Yes — requires `getAvailabilityStatus` + alias maps; reason documented in §F-3 |
| `snippets/configurator-image.liquid` | CONDITIONAL_EDIT | No — verified sufficient |
| `snippets/variant_picker.liquid` | READ_ONLY_REFERENCE | No |
| `snippets/product-buy-buttons.liquid` | READ_ONLY_REFERENCE | No (inactive on this PDP) |
| `snippets/price.liquid` | READ_ONLY_REFERENCE | No |
| `assets/global.js` | READ_ONLY / PROTECTED | No |
| `assets/product-form.js` | READ_ONLY / PROTECTED | No |
| `layout/theme.liquid` | READ_ONLY / PROTECTED | No |
| `templates/product.calder.json` | READ_ONLY / PROTECTED | No |
| Fitment files, header, collections, dealer, cart snippets | PROTECTED | No |
| `assets/wheel-configurator.css`, `assets/build-your-wheel.css`, `assets/calder-product.css` | PRESENTATION-LOCKED (visual) | No — reuse existing classes only |

---

## K. Test Baseline & Constraints

- Browser automation: **puppeteer is available** (package.json) → a local harness will exercise the real `configurator-api.js`/`configurator-app.js` for variant resolution, four-dimension state, cart payload construction, and stale-response gating.
- Live Shopify cart / store domain: **NOT AVAILABLE** → cart submission, price media, and URL-state tests marked `NOT VERIFIED` in the report.
- Static review + Node-based unit harness + Liquid syntax `shopify/theme check` if available.

*End of audit.*