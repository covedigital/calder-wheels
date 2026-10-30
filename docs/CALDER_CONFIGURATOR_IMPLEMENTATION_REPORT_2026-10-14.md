# Calder Wheels — Configurator Implementation Report

**Task:** CW-CFG-1014 — Calder PDP & Wheel Configurator Functional Repair
**Date:** 2026-10-14
**Implementer:** OpenCode (DeepSeek V4 Flash)
**Contexts:** `CALDER_OPENCODE_MANDATORY_GUARDRAILS.md`, `docs/CALDER_CONFIGURATOR_CODE_AUDIT_2026-10-14.md` (audit baseline)
**Theme root:** `docs/design/Shopify Themes/Working Theme-via-CLI/`

---

## Corrections

### CFG-001 — Four-Dimension Configuration State (P0)
- **File / range:** `assets/configurator-app.js:14` (`selected`), `:102-172` (data), `:174-199` (diameter control), `:222-247` (summary), `:460-481` (summary text); `sections/wheel-configurator.liquid:128-141, 193-213`; `sections/build-your-wheel-page.liquid:202-214, 262-268`
- **Original defect:** `selected` had no `diameter`; no diameter control existed anywhere in the configurator UI; summary/save/share/PDF omitted diameter.
- **Exact correction:** Added `diameter` to `selected`, added a Diameter `<select>` (`.wheel-configurator__diameter-select`, pre-existing styling) bound via `renderDiameterOptions`/`bindDiameter`/`setSelected('diameter')`, populated from the product's native `option1` values; diameter included in `updateSummary`, `configSummaryText`, `CalderConfigurator.selections/selectionIds/saveBuild/shareBuild/buildPdf`, and restore/reset paths in both configurator UI scripts. Initialization prefers the URL-selected native variant (see CFG-005).
- **Tests executed:** QA harness T1a–T1j, T5, T7, T12b, T14.
- **Test result:** PASS (44/44 overall).
- **Remaining risk:** Diameter rows re-badge finish groups 1→4 (markup-only, same component styles). No deliberate visual change otherwise.

### CFG-002 — Exact Shopify Variant Resolution (P0)
- **File / range:** `assets/configurator-api.js:16-20` (normalize), `:144-181` (`resolveAllOptionVariant`), `:325-328` (`resolveExact`); consumers `configurator-app.js:718-765`
- **Original defect:** `tokenMatch()` split on whitespace so `"Gloss Black"` never matched (failed all multi-word center/barrel combos); unsafe fallbacks (current PDP variant, first available, first variant, diameter-only BTO) could substitute a different variant id.
- **Exact correction:** Exact normalized equality per slot — `option1 === diameter`, `option2 === center`, `option3 === barrel`. Hardware never participates. All fallbacks removed; non-matches return `{status:'unsupported', variant_id:null}`; existing-but-unavailable variants return `{status:'unavailable', variant}` (distinct from missing). Exposed as the single shared resolver `ConfiguratorAPI.resolveExact`.
- **Tests executed:** Harness T2a (`18/18` exact ids + availability), T2b (unsupported → null id), T2c (unavailable distinct), T3c, T4b, T5a, T8a, T11a.
- **Test result:** PASS.
- **Remaining risk:** Depends on store `option1/2/3` values matching the authoritative catalog labels exactly (case handled via normalization; `Black` cannot match `Black Tint`).

### CFG-003 — Availability & Demo Inventory Gating (P0/P1)
- **File / range:** `assets/configurator-api.js:241-310` (`checkAvailability`), `configurator-app.js:502-604` (`checkAvailability` + sequence guard), `:605-690` (`handleAvailabilityData`), `assets/calder-demo-inventory.js:156-228` (`getAvailabilityStatus`)
- **Original defect:** Diameter passed as `null`; missing demo SKU reported as confirmed `0` (out-of-stock); no stale-response guard; network/data-load error rendered as "Checking availability…".
- **Exact correction:** Diameter now threaded into every availability check. Primary gate = exact Shopify variant existence + `available`. Demo inventory (`getAvailabilityStatus`) is an ADDITIONAL constraint: all components known → min available-to-build; any missing mapping/SKU → `known:false` (demo-unknown), never treated as confirmed stock. Availability response sequence token (`_availSeq`) drops stale async results. Distinct states: available / no-stock / unsupported / demo-unknown / error.
- **Tests executed:** Harness T3a–T3f, T10a/T10b, T11a, T14a/T14b.
- **Test result:** PASS.
- **Remaining risk:** Demo dataset lacks mappings for `Black Tint`/`Titanium Tint`/some combos → those resolve as demo-unknown (purchase still permitted; labeled via availability text). Acceptable per CFG-003; QuickBooks integration will replace the demo layer.

### CFG-004 — Product Data Normalization (P1)
- **File / range:** `snippets/configurator-product-data.liquid` (new, shared object literal), `snippets/configurator-data.liquid:1-52`, `sections/build-your-wheel-page.liquid:65-75`
- **Original defect:** Emitted BOM component labels (`Black Titanium`, `Polished`…) instead of canonical native option values; no native `variants` array, no `hardware_options`/`default_hardware`, no `product_handle`; single global `window._calderProductComponents` could be clobbered across products.
- **Exact correction:** New snippet emits canonical option lists derived from the product's native variants (option1/2/3), full `variants` array, `hardware_options` + `default_hardware` from `hardware_rivet_finish_options`, `product_handle`, and BOM-mapped preview images (matched by exact label). Emitted arrays use JS-legal trailing commas. Data stored per-product in `window._calderProductData[<id>]` (no global overwrites); `_calderProductComponents` retained as the current product alias.
- **Tests executed:** liquidjs render harness `scripts/configurator-qa/_liquid-render.js` (12 assertions, all OK); Liquid balance check.
- **Test result:** PASS (also caught + fixed a non-Shopify-valid parenthesized `assign` expression).
- **Remaining risk:** Option values with `\n` or quotes would need extra escaping; authoritative options are single-line labels.

### CFG-005 — Two-Way PDP Synchronization (P0)
- **File / range:** `sections/calder-product.liquid:2046-2103` (`getPdpSelections`), `assets/configurator-app.js:307-501` (init-from-URL-variant), `:718-811` (`syncToPdpOption`/`setNativePicker`/`syncHardwareToPdp`), `:852-891` (`listenForPdpChanges`/`applyExternalSelections`)
- **Original defect:** `getPdpSelections` read only non-native fallback controls (empty for native products); configurator→PDP silently overwrote `input[name=id]` without driving Lumia's render (price/media/controls stale) and suppressed renders via `_calderSuspendVariantChange`.
- **Exact correction:** `getPdpSelections` now reads the native `variant-selects`/`variant-radios` controls (by option name) plus hardware select. Init derives diameter/center/barrel/hardware from the active native variant. Configurator→PDP resolves the exact native variant and drives Lumia's supported path: set native selects, then `dispatchEvent('change')` on the `variant-selects` element (price/media/id input/URL re-render). Hardware pushed to the PDP hardware select + hidden property. A `_lastPushedVariantId` guard and `syncPdpVariant` flag prevent echo loops; listener bound once (`_pdpListenerBound`).
- **Tests executed:** Harness T4a–T4c, T5a–T5c, T6a, T7a/T7b, T15a. Static review of `global.js:321-346, 691-697` (protected, unmodified; existing `_calderSuspendVariantChange` guard and `productContainer` null guard verified present).
- **Test result:** PASS.
- **Remaining risk:** `productContainer` null error (broad JS crash) — the deployed `global.js` already contains the null guard; browser validation on the live store (`NOT VERIFIED`) is the only remaining check (CFG-010).

### CFG-006 — Configurator Add to Cart (P0)
- **File / range:** `assets/configurator-app.js:893-994` (`addToCart`), `assets/configurator-api.js:312-324` (`resolveConfiguration`), `:330-352` (`addToCart`)
- **Original defect:** No 4-dimension validation; quantity hardcoded `1`; unsafe `submitViaPdpForm` fallback; no repeat guard; missing customer-visible `Hardware & Rivet Finish` property.
- **Exact correction:** `addToCart` validates all four dimensions + current availability (`status === 'available'`) + hardware allowed, captures quantity (PDP qty input else 1), disables the button during the request, re-resolves the exact variant via `resolveConfiguration` immediately before submit (no silent substitution), and sends a single authoritative payload with `properties['Hardware & Rivet Finish']`, `_diameter`, `_center_finish`, `_barrel_finish`, `_hardware_finish`, `_design_code`, `_source`, `_configurator`, `_variant_id`. The `submitViaPdpForm` fallback was removed entirely. Errors alert and re-enable the button (no duplicate additions).
- **Tests executed:** Harness T8a–T8e (exact id, qty 5, property, metadata, single call), T9a (hardware-only change keeps same variant id), T10a/T10b.
- **Test result:** PASS.
- **Remaining risk:** Real `/cart/add.js` response handling verified only against a stubbed 200 response; live store cart test `NOT VERIFIED`.

### CFG-007 — PDP Add to Cart (P0)
- **File / range:** `sections/calder-product.liquid:111-117` (top-level hardware metafield assign), `:883-906` (hardware select default), `:1310-1315` (fallback form property)
- **Original defect:** PDP form posted `properties[_hardware_rivet_finish]` (non-matching key) and the hardware select defaulted to "Select Hardware", so PDP & configurator payloads were not equivalent and hardware could be missing.
- **Exact correction:** Native PDP product form (untouched `product-form.js`) now posts `properties[Hardware & Rivet Finish]` with the metafield's first hardware value as the explicit default; the hardware select and hidden property stay in sync via the existing change handler (calder-product.liquid:2129-2141) plus configurator `syncHardwareToPdp`. No duplicate forms or conflicting hidden id inputs. `product-buy-buttons.liquid`/`variant_picker.liquid`/`price.liquid` were not edited (buy_buttons block not present on this template).
- **Tests executed:** Static; harness property equivalence verified through the configurator payload (T8c/T9a). Live PDP form POST `NOT VERIFIED`.
- **Test result:** PASS (static) / NOT VERIFIED (live form).
- **Remaining risk:** The fallback PDP form is a plain Shopify POST (Lumia `<product-form>` element is not wrapped here) — this matches existing behavior and is preserved; AJAX drawer feedback is not added.

### CFG-008 — Price & Summary (P1)
- **File / range:** `assets/configurator-app.js:691-707` (`updatePrice`), `:718-730`, `wheel-configurator.liquid` & `build-your-wheel-page.liquid` summary rows
- **Original defect:** Configurator price preferred stale PDP DOM text; summary lacked diameter.
- **Exact correction:** Authoritative configurator price = resolved Shopify variant's minor-unit price, formatted via `window.Shopify.formatMoney` (fallback `$x.xx`); hardware contributes `$0`; component `retail_price`s are never summed into the price. Summary shows Diameter, Center Finish, Barrel & Lip Finish, Hardware & Rivet Finish, price, and availability/build status using existing summary styling.
- **Tests executed:** Harness T3c, T5c, T8a (payload price), T1j/T7b (summary).
- **Test result:** PASS.

### CFG-009 — Standalone Builder Parity (P1)
- **File / range:** `sections/build-your-wheel-page.liquid:65-75` (data), `:157` (handle attr), `:202-214` (diameter), `:262-268` (summary); `assets/calder-builder-page.js` (rewritten), `assets/configurator-app.js:153-171` (`configure`)
- **Original defect:** Design switch kept a stale `data-product-handle`, reused a new instance without resetting state, never refreshed `_calderDesignCode`, and could resolve/add a variant from the previously selected product.
- **Exact correction:** The builder emits the shared canonical product data and sets `data-product-handle`. Design chips now call `wc.configure(data)` (single instance): swaps `product_id`/`product_handle`/`design_code`/variants/components/hardware options, resets all four selections and stale `currentVariantId`, reloads controls/defaults, and re-checks availability. Single shared resolver (`ConfiguratorAPI.resolveExact`) used everywhere. The 20-product collection limit is retained (curated catalog) and documented in the audit.
- **Tests executed:** Harness T12a–T12d, T13a.
- **Test result:** PASS.

### CFG-003b / CONDITIONAL — calder-demo-inventory.js
- **File / range:** `assets/calder-demo-inventory.js:79-124` (`resolveDesignCode` now product-aware), `:156-228` (`getAvailabilityStatus`), backward-compat `getAvailableToBuild`
- **Original defect (documented in audit §F-3):** Missing demo data reported as confirmed 0 stock; design code always resolved from the global.
- **Exact correction:** Added `getAvailabilityStatus` returning `{known, available_to_build, design_code, codes}`; unknown data is `known:false`; design code prefers the current product's dataset. Required as a conditional edit because requirement CFG-003 cannot be satisfied safely without the distinct "unknown" state.
- **Tests executed:** Harness T3b (known = 25, min(components)), T3d (missing mapping → demo_unknown).
- **Test result:** PASS.

---

## Test Matrix (36-configuration model)

| Requirement | Status |
|---|---|
| Exact variant resolution, 18 native combos | PASS (harness T2a, 18/18) |
| Hardware property (both finishes) | PASS (T8c, T9a) |
| Correct price | PASS (T3c, T5c) |
| Correct availability (available/no-stock/unsupported/demo-unknown/error) | PASS (T3a–f, T10, T11) |
| Correct cart ID + no substitution | PASS (T8a, T4b, T5a, T11a) |
| Correct quantity | PASS (T8b) |
| No duplicate cart additions / no unsafe fallback | PASS (T8e, T10b) |
| No stale state after rapid selections | PASS (T14) |
| PDP → configurator sync | PASS (T6, T7) |
| Configurator → PDP sync (native picker, price, id input) | PASS (T4, T5) |
| Standalone builder design switching | PASS (T12, T13) |
| Saved-configuration restoration (diameter included) | Static + restore paths (harness T1j; hash/localStorage restore covered by helper logic; live reload NOT VERIFIED) |
| Mobile interaction | NOT VERIFIED (browser viewport not exercised) |
| No uncaught JS exceptions | PASS (T15a, PAGEERRORS=0 after `window.Shopify` hardening) |
| Live Shopify cart / store render / visual parity | NOT VERIFIED (no store access) |

---

## IMPLEMENTATION STATUS: COMPLETE

**FILES MODIFIED:**
- `docs/CALDER_CONFIGURATOR_CODE_AUDIT_2026-10-14.md` (created — audit baseline)
- `docs/CALDER_CONFIGURATOR_IMPLEMENTATION_REPORT_2026-10-14.md` (this file)
- `docs/design/Shopify Themes/Working Theme-via-CLI/snippets/configurator-product-data.liquid` (new)
- `docs/design/Shopify Themes/Working Theme-via-CLI/snippets/configurator-data.liquid`
- `docs/design/Shopify Themes/Working Theme-via-CLI/assets/configurator-api.js`
- `docs/design/Shopify Themes/Working Theme-via-CLI/assets/configurator-app.js`
- `docs/design/Shopify Themes/Working Theme-via-CLI/assets/calder-builder-page.js`
- `docs/design/Shopify Themes/Working Theme-via-CLI/assets/calder-demo-inventory.js`
- `docs/design/Shopify Themes/Working Theme-via-CLI/sections/wheel-configurator.liquid`
- `docs/design/Shopify Themes/Working Theme-via-CLI/sections/build-your-wheel-page.liquid`
- `docs/design/Shopify Themes/Working Theme-via-CLI/sections/calder-product.liquid`

**FITMENT FINDER REPAIR (authorized follow-up; see Addendum 3):**
- `docs/design/Shopify Themes/Working Theme-via-CLI/snippets/fitment-catalog.liquid` (rewritten)
- `docs/design/Shopify Themes/Working Theme-via-CLI/sections/async-fitment-results.liquid` (rewritten)
- `docs/design/Shopify Themes/Working Theme-via-CLI/assets/fitment-finder.js`

**QA HARNESS (not theme):**
- `scripts/configurator-qa/fixture.html`, `scripts/configurator-qa/qa-harness.js`, `scripts/configurator-qa/_liquid-render.js`, `scripts/configurator-qa/_fitment-catalog-render.js`

**FUNCTIONAL FILES MODIFIED:** the 7 authorized configurator files above + conditional `calder-demo-inventory.js` (decision documented in audit §F-3) + 3 fitment-finder files (explicit user authorization, scope limited to the finder results flow). `npm i --no-save liquidjs` added a dev-only node module for Liquid render validation (not committed to package.json).

**PROTECTED FUNCTIONALITY STATUS:**
- `assets/global.js`, `assets/product-form.js`, `layout/theme.liquid`, `templates/product.calder.json`, `variant_picker.liquid`, `product-buy-buttons.liquid`, `price.liquid`, cart/dealer/header/navigation/collection templates, and the fitment data backend (`fitment/*`): **UNCHANGED**
- Fitment BROWSER files (`fitment-finder.js`, `fitment-catalog.liquid`, `async-fitment-results.liquid`) were modified **only** for the results-flow repair per explicit user request; vehicle data, persistence keys, and the fitment API were left intact.
- Existing `_calderSuspendVariantChange` guard (global.js:322) and `productContainer` null guard (global.js:696) verified present; Lumia's variant-selects pipeline used as the supported sync path.

**PRESENTATION-LOCKED AREAS TOUCHED:** NONE (no CSS files modified; reused existing `.wheel-configurator__diameter-select`, `.cbp-config__finish-group`, and fitment-finder classes).

**REGRESSION CHECK:**
- 46/46 functional configurator QA assertions pass; no uncaught page errors; Liquid balance verified for all edited Liquid files; liquidjs render of the configurator data contract passes 12 assertions; fitment catalog liquidjs render passes 9 assertions (diameter/width/label/bolt-pattern extraction across `22"`, `22in`, `23`, `26 x 9.5"`, metafield + curated merge); PDP gallery/quantity/fitment/wishlist/share handlers left intact; no changes to Lumia product-form/cart behavior.
- Theme uploaded with a Liquid syntax error on `async-fitment-results.liquid` (unclosed `comment` inside a `{% liquid %}` block) — corrected (see Addendum 3) and statically re-validated.

**REMAINING P0/P1 ITEMS:**
- None known in code. Broker-verified only after live-store browser QA: PDP↔configurator on the deployed Shopify product, live `/cart/add.js`, By Vehicle / By Wheel Style results on the live store, and visual parity of the added Diameter control/rows.

**UNVERIFIED BROWSER TESTS:**
- Live Shopify store cart submission/drawer; real Lumia price/media render across variant change on the deployed theme; mobile viewport interaction; saved-config reload + shared `#cfg=` restore in a live tab; visual parity of the new Diameter control and summary row (no image interpretation available — validated against existing CSS/markup instead); live fitment finder result + collection-filter behavior (store schema dependent).

**NEXT STATE:** READY_FOR_VISUAL_QA (do not mark the PDP `ACCEPTED`/`PRESENTATION_LOCKED` until live store runtime tests, visual QA, and fitment store verification pass).

---

*Report ends.*

---

## Addendum (2026-10-14, follow-up) — Barrel & Lip images alias

**Question:** Why are Barrel & Lip Finish images not showing in the configurator?

**Root cause (verified):** The canonical native barrel finish is `Black` / `Chrome`, but the product BOM metafields define barrel components `Black` (bk) and `Polished` (polish) only, and the theme ships barrel art only for `finish-barrel-bk.png` / `finish-barrel-polish.png`. The image lookup (`configurator-product-data.liquid`) maps canonical option labels to BOM component images by exact name, so the `Chrome` barrel resolved to an empty image → text-only chip + no preview layer (the `src=""` CSS fallback in `wheel-configurator.css:245-259` renders a clean label, not a broken glyph).

**Correction (owner-approved alias):** `snippets/configurator-product-data.liquid` — when a canonical barrel label has no exact BOM match, it now falls back to the existing polished barrel asset (`finish-barrel-polish.png`) as a visual placeholder. Exact BOM-name matches always win, so adding a real `Chrome` barrel component/asset later supersedes the alias automatically. Applied to `barrel` only; validated by `_liquid-render.js` (`barrel Chrome alias → polished placeholder image` PASS).

**Same gap exists for center chips:** canonical center finishes `Black Tint` / `Titanium Tint` have no BOM-name match (BOM has `Black Titanium` / `Satin Silver`), so they still render text-only. Not changed pending explicit approval of an analogous alias.

**IMPLEMENTATION STATUS (unchanged): COMPLETE** — with the barrel alias applied, all four-dimension controls resolve images where the store ships art; `Chrome` barrel now displays a preview layer.

---

## Addendum 2 (2026-10-14, follow-up) — Configurator cart feedback

**Issue:** Configurator "Add to Cart" succeeded silently — no drawer, no "Added" banner. Root cause: the configurator posted to `/cart/add.js` but never ran Lumia's post-add pipeline that `product-form.js` executes (it navigates via plain form POST on the PDP, so the native AJAX path never fired for the configurator).

**Correction:** `assets/configurator-api.js` (`addToCart` now appends Lumia `sections` + `sections_url` to the request body so the JSON response includes the section HTML) and `assets/configurator-app.js` (`renderCartSections` parses the response and drives `cart-items.renderContents` → `toggleEmptyClass` → `setCartJs` → `setStatus('new', …, true)`, which opens `mini-cart-popup` and displays the "added to cart" banner; a drawer fallback + `cart:updated` event backstop remain). Removed the old `showCartNotification`/`refreshCart` stubs.

**Tests:** QA harness expanded (+T8f invokes Lumia render pipeline, +T8g payload carries `sections`); **46/46 PASS**, no page errors.

---

## Addendum 3 (2026-10-14, authorized follow-up) — Fitment Finder results repair

**Scope:** Explicit user request to fix the fitment finder results only; no other sections changed. Files touched are limited to the fitment browser module.

### Symptoms
- **By Vehicle:** always returned "No wheels found."
- **By Wheel Style:** navigated to the collection page but the passed filters returned zero results.

### Root causes (verified)
1. **Catalog diameter parsing:** Both `fitment-catalog.liquid` and `async-fitment-results.liquid` only extracted diameters when `variant.option1 contains 'in'`. The store's Option 1 values are `22"`/`24"`/`26"`, so every product emitted `diameters: []` and the client `filterByVehicle` rejected all products → By Vehicle always 0 results.
2. **By Wheel Style filter values/keys:** `fitment-finder.js` sent `filter.v.option.diameter=…+'in'` (e.g. `22in`) and `filter.v.option.center_finish`. Shopify option facets must match the store's exact option value (`22"`) and the option-name handle; `22in` matched no facet → 0 results.
3. **Empty catalog:** the reworked catalog only included products that already had a `product.metafields.custom.bolt_pattern` value, which the metafield seeder never writes → the catalog could be empty before parsing even ran.

### Corrections
- `assets/fitment-finder.js`
  - `filterByVehicle` matches a vehicle's bolt pattern against the product's `bolt_patterns` set (normalized decimals), and requires a parsed diameter within the vehicle range.
  - `initStyleTab` builds the Diameter / Finish / Bolt selects from real store option labels (`diameter_labels`, raw `option2` values, `bolt_patterns`), so `select.value` is the exact facet value.
  - `initStyleSubmit` sends `filter.v.option.diameter=<raw label>` (no `in` suffix) and `filter.v.option.center-finish=<raw label>`; bolt pattern filter preserved.
  - By Vehicle "View All Compatible Wheels" URL uses raw `diameter_labels` (fallback `<n>"`).
- `snippets/fitment-catalog.liquid` + `sections/async-fitment-results.liquid` (rewritten)
  - Robust Option 1 parsing for `22"`, `22in`, `22 x 9.5"`, `23`, … → numeric `diameters` + raw `diameter_labels`.
  - `bolt_patterns`: product `bolt_pattern` metafield merged with the curated per-design bolt set (mirrors `fitment/fitment_manifest.py`: designs 201–207 → `6x139.7`/`6x135`, plus `5x130`/`5x120` for 202/206/207). Products without the metafield are still included.
  - Falls back to `collections.all` when `all-calder-wheels` is unavailable; clean JSON (no trailing commas) so the `#hf-results-json` JSON.parse path works.
- `scripts/configurator-qa/_fitment-catalog-render.js` (new QA artifact) — liquidjs render validation.

### Tests
- liquidjs fitment catalog render: 9/9 assertions PASS (diameter/width/label parsing across `22"`/`22in`/`23`/`26 x 9.5"`, curated + metafield bolt merge, raw labels, finishes).
- Liquid balance + `node --check` clean for all touched files.
- Full configurator harness still **46/46 PASS**, no page errors (no regression in configurator/cart).
- Theme upload initially failed on `async-fitment-results.liquid` ("'comment' tag was never closed") — a stale single-line `comment … endcomment` inside a `{% liquid %}` block; removed and re-validated.

### Residual (store-dependent, cannot verify from repo)
- Results require products to be reachable via `all-calder-wheels` or `All`.
- Vehicles whose bolt pattern no wheel design is produced in (e.g. Audi/BMW `5x112`) correctly yield 0 — the embedded SUV set (`6x139.7`/`6x135`) is the matching population.
- By Wheel Style with **only bolt pattern** selected still relies on a `bolt_pattern` metafield existing on live products (diameter/finish option filters now work regardless). Recommend a live-store browser pass on both tabs.