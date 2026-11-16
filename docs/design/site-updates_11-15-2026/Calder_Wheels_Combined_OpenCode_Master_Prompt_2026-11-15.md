# CALDER WHEELS — COMBINED OPENCODE MASTER IMPLEMENTATION PROMPT
## November 9 + November 10, 2026 meetings; November 15 manual assessment

**ROLE:** Senior Shopify/Liquid/JavaScript/CSS architect, e-commerce data engineer, accessibility specialist, and QA lead.

**MISSION:** Audit the CURRENT local Calder Wheels repository, reconcile both meeting requirements and the manual assessment below, and implement only verified, approved changes in isolated component batches. **Never perform all changes in one pass. Stop after each batch, present test evidence and a specific human QA checklist, and WAIT for the developer's explicit approval before proceeding.**

## 0. Precedence, scope and non-negotiable controls

1. This combined prompt supersedes conflicting instructions in the two earlier meeting prompts. The newest explicit manual assessment governs the precise behavior it addresses; otherwise retain the November 9 and 10 requirements. Preserve all unrelated working behavior.
2. **Read-only audit first.** Inspect `git status`, branch, HEAD, recent diffs and theme pulls, current Liquid/JS/CSS/settings, feature flags, docs and test commands. Identify uncommitted and developer-owned edits. Treat the current working tree, including recently pulled CSS, as the baseline. Do not reset, stash, clean, force checkout, overwrite, automatically pull/merge, or make unrelated formatting changes. Never overwrite or revert changes that predate this task.
3. **Do not modify or publish the live Shopify theme or production data.** Work locally or in a separately authorized unpublished theme. No unapproved imports, SKU/variant/product edits, inventory mutations, checkout/payment/shipping changes, QuickBooks/Quickbase/n8n/ShipStation modifications, apps, credentials, or webhook edits. No deployment without separate authorization.
4. **Protect existing CSS and responsive presentation.** Before touching any stylesheet or inline CSS, inspect selectors, cascade, media queries, variables, recent pulls and local edits. Patch minimally. Do not wholesale replace files, global tokens, breakpoints, layouts, or theme settings. Preserve current mobile sticky configurator collapsed/expanded layout, four tabs, default-disabled setting, developer-only visibility and navigation clearance.
5. **All image and video asset creation/editing/replacement/upload/removal/renaming/optimization and media presentation redesign are MANUAL developer tasks.** Do not change media files, their asset paths, Shopify media assignments, image cropping, hero overlay, playback or gallery imagery. **Narrow exception:** the specifically requested vehicle-category image selection bug may be fixed by correcting existing runtime vehicle-type-to-existing-image mapping/`src` selection logic, without changing assets, filenames, image assignments in Shopify, or presentation CSS. Inspect and report mapping changes before implementation; ask approval if a needed mapping does not already exist or conflicts with the asset policy.
6. Preserve CLM naming and existing CLB legacy references needed for integrations. No blind search-and-replace. Preserve dealer authentication/pricing, product and variant IDs, SKUs, metafield/metaobject contracts, production order data, inventory logic, homepage, navigation, product card design, configurator, wheel preview, and responsive styles.
7. **Do not invent** bolt patterns, offsets, center bores, width, prices, compatibility, inventory, SKU/BOM relationships, asset mappings, or data. Unknown or contradictory data blocks only the dependent change; continue other approved independent batches.
8. **No speculative completion claims.** Run real available automated tests and browser tests; explicitly mark Passed / Failed / Blocked / Not run. If tests or browser access are unavailable, disclose this and require human validation.

## 1. Mandatory initial read-only audit and plan — STOP FOR APPROVAL

Inventory actual code paths for collection filter controls and URL state, vehicle fitment tabs, selected vehicle persistence, product cards, universal PDP, `.calder-uc`, `.calder-pdp__fitment`, `.calder-design-nav`, `.calder-specs__table`, pricing, variant resolution, quick shop, cart forms/drawer, agreement/checkout buttons, gallery entry routes, responsive behavior and theme settings. Read `docs/design/site-updates_11-2-2026/Calder_Product_Card_Specifications_OpenCode_Prompt.md` if present; do not assume its location or contents. Review existing test scripts and CI. Find already-completed requirements, duplicate implementations, CSS conflicts, and dependencies. Audit baseline behavior before changing it.

Produce a **requirements matrix** with ID, source (Nov 9 / Nov 10 / manual), current behavior, already implemented / broken / missing / blocked, exact files, proposed minimal patch, data dependencies, risk, automated tests and manual QA. Include explicit notes for any requirement superseded by a newer instruction. Identify the source of truth for fitment, product configuration, SKU, inventory, and media type mapping. Present the staged plan below and **WAIT for explicit developer approval before editing**. Do not treat approval of the overall plan as approval to bypass later per-batch QA checkpoints.

## 2. Required file discovery and inventory gate

Search repository/docs before requesting any files. For inventory/fitment/SKU work, locate or request only the data actually needed: Shopify product export (handles, IDs, variant IDs, SKU, options, prices), inventory export (inventory item IDs, locations, quantities), QuickBooks item list, component master (centers/barrels/caps/bolts/finishes), finished-wheel SKU master (design/size/width/bolt pattern/offset/center bore/finishes), vehicle fitment master (year/make/model/trim/suspension/fitment), assembly/BOM mapping. Additional files only when needed: QuickBooks assemblies, Quickbase production-order schema, n8n workflow JSON, warehouse bins, purchase orders, metafield/metaobject definitions, prior import reports and SKU generator.

Report discovered files, fields, freshness, provenance, authority and conflicts. **Ask the developer for missing files** with required columns, reason, export source, mandatory/optional status and blocked batch. Never presume seven separate files are required if one workbook covers the data. Validate duplicate/missing SKUs, IDs, component quantities, BOM completeness, fitment and suspension support, offsets/bores, CLM/legacy mappings and import schema. Keep vehicle hub bore, manufactured wheel bore and centering-ring specs distinct. Determine which system owns inventory; do not assume Shopify quantity equals buildable component stock. Draft import files only if authorized and validated; disclose record counts, modified fields, exclusions and rollback requirements. **Never execute imports without a separate explicit approval.**

## 3. Batch execution protocol — mandatory for EVERY component

Execute **one batch at a time** in the order below, unless the developer approves a dependency-driven reorder. Each batch follows:

**A. Pre-change:** Reconfirm Git/diff state and recently pulled CSS; capture existing behavior; list files and dependencies; identify tests; check authoritative data; verify whether already implemented. If already correct, run regression checks and report *No change needed*; still seek QA approval.

**B. Minimal implementation:** Change only the named component and unavoidable shared dependencies. Preserve all unrelated styles, media and functionality. Avoid duplicate state, listeners, reset handlers, pricing engines and fitment engines. Do not commit automatically.

**C. OpenCode automated QA (before human review):** Run targeted existing tests plus relevant Shopify Theme Check, JS syntax/lint/build if configured, and browser interaction tests if supported. Verify state/URL synchronization, no console errors, accessibility/keyboard, responsive views, product/variant/SKU/price integrity, and a relevant negative case. Inspect `git diff --check`, full changed-file diff and unexpected asset changes. Never label an unexecuted check passed.

**D. Developer QA gate:** STOP. Present (1) batch and requirement IDs, (2) precise files/changes, (3) automated test commands and actual results, (4) regression risks, (5) a numbered **manual test checklist tailored to that component** with expected results, (6) local/development preview URL or exact instructions to reach the component if available, and (7) a direct question: **“Please test this component and reply APPROVED to continue, CHANGES with feedback, or BLOCKED with the issue.”** Do not move to the next batch without explicit approval. Approval of one batch is not approval of others.

**E. If rejected:** Fix only the reported issue, rerun tests, and repeat the same gate. If blocked by data, document it and ask whether to defer and proceed to a specified independent batch; wait for permission. Do not silently skip a gate. Retest previously approved critical flows when shared code changes.

**Global QA matrix:** Validate relevant desktop/tablet/mobile at 320, 375, 390, 430, 768, 1024, 1280 and 1440px as feasible; Chrome/Safari/Firefox when available; keyboard/screen reader semantics; back/forward navigation, URL params, reload, selection persistence, empty results, invalid data, loading races, duplicate cart lines and quantity changes. No image/video modifications or unintended CSS diffs.

## 4. Ordered implementation batches and human QA checklists

### Batch 1 — Collection filter presentation and resets

**C1** Hide `.filter-row-selected` (`display:none` or appropriate conditional hidden state) **only when By Vehicle tab has a valid selected vehicle AND results are present**; retain correct visibility for By Wheel Design, no vehicle, zero results, and reset. Verify correct state after AJAX refresh, back/forward and tab switching; do not globally hide unrelated selections.

**C2** In `.category-page-title`, place a **Clear Filters** action directly underneath `div.ProductCountDesktop`. It must use the same complete-reset semantics as `.cw-fitment-guide__reset`: clear every collection filter, vehicle year/make/model/trim/suspension and derived bolt-pattern constraint, selected filter chips, persisted fitment state as applicable, URL query params and results; restore default UI and product count. Reuse existing reset handler/state source rather than duplicating reset logic. Audit existing relocated Clear All Filters control to avoid redundant/conflicting buttons. Preserve responsive accessibility.

**C3** Remove only the identified confusing filter-heading underline/divider. Rename customer-facing collection `Barrel / Lip` to **Lip Finish**, without renaming mobile `Barrel & Lip` or altering underlying data keys.

**C4** Restore admin-configured **Barrel & Lip – Hardware (Bolts)** / Bolt Finish filter on the collection storefront. Trace Shopify Search & Discovery/admin definition, filter source, template, URL params, CSS and JS. Reuse existing filter; do not invent values or duplicate it. Confirm filtering actually changes results.

**C5** When vehicle selected, apply authoritative bolt-pattern constraint and hide conflicting manual Bolt Pattern filter; on vehicle reset restore it and remove derived constraint. Preserve unrelated filters unless **Clear Filters** is explicitly invoked. Support multi-select size filters where already implemented. Hide 26-inch options only if verified inventory/fitment or an existing approved rule supports it; never hardcode a permanent blanket restriction.

**OpenCode tests:** state matrix for tabs × vehicle × results; clear-all state/URL/results; filter visibility; Bolt/Lip/Center; no duplicate controls; browser back/forward; mobile. **Developer QA:** Select a vehicle with results and verify chips hidden; switch tabs; test zero results; apply multiple filters and click new Clear Filters; confirm vehicle and every filter reset; verify Bolts filter appears and filters; confirm bolt-pattern manual control returns after reset; check count and mobile layout. **STOP for approval.**

### Batch 2 — Vehicle category image selection (functional mapping only)

**C6** Investigate why `.cw-fitment-guide__image` always resolves `vehicle_type-suv.png`. Trace vehicle category normalization, source records, default/fallback, asynchronous updates and `src` selection. When an existing authoritative mapping is available, resolve the appropriate **existing** asset among `vehicle_type-custom.png`, `vehicle_type-full_size_truck.png`, `vehicle_type-off_road.png`, `vehicle_type-sport.png`, `vehicle_type-suv.png`. Do not infer vehicle category from brand alone. Keep fallback safe for unknown types and do not change image files, names, assignments, styling or other media. If no authoritative type mapping exists, stop and request the data rather than guessing.

**OpenCode tests:** representative mapped categories, unknown category, vehicle switching, reset, stale async responses, no media-file diffs. **Developer QA:** Select at least one vehicle per available type; verify corresponding existing silhouette and no SUV-only bug; switch rapidly; test unknown type; confirm no crop/layout changes. **STOP for approval.**

### Batch 3 — Collection product card configuration accuracy

**C7** Audit `.calder-card__config` and associated Liquid/JS/metafields/product card spec doc. Determine why every product shows `Diameter: 22", Center Finish: Black Tint, Bolts: Chrome, Barrel: Chrome`. Replace hardcoded/shared/global defaults with **each card's own authoritative shown configuration** (actual product/variant/configuration context); distinguish default showcase configuration from shopper selection, if applicable. Ensure label values, finishes, width/size and SKU are consistent with the corresponding product and do not leak configuration across cards. Missing data should show a truthful fallback/omission, not invented values. Preserve card #3 design, pricing, imagery, Quick Shop, filters and layout.

**OpenCode tests:** at least three distinct products and variants, pagination/AJAX filtering, card reuse, no shared state leakage. **Developer QA:** Compare displayed config on three different cards with their product records; filter/sort/reload; verify cards remain different where source data differs; test Quick Shop and mobile. **STOP for approval.**

### Batch 4 — PDP vehicle fitment and design navigation

**P1** When `.calder-pdp__fitment` has a valid vehicle, show in `.calder-design-nav` **only designs confirmed compatible with that vehicle's bolt pattern AND any other existing required fitment constraints**; do not assume bolt-pattern match alone guarantees fitment. Preserve selected compatible design; handle incompatible current selection safely without silently changing the purchasable SKU; handle no matches and missing data. When `.calder-pdp__fitment-reset` is activated, remove vehicle-derived constraints and show **all normally available** designs again. Synchronize URL/state, navigation, collection-to-PDP persistence, and browser history. Reuse existing compatibility engine and approved data; no new fitment engine.

**P2** For `.calder-pdp__fitment--verify`, align `.calder-pdp__fitment-icon` and its inner circle SVG in color and visual geometry for verify status. Target only the verify state; preserve success/error/warning states and developer CSS.

**OpenCode tests:** five-/six-lug approved examples, incompatible designs absent, reset restores options, unknown fitment fail-closed for purchasing, keyboard access, icon computed styling. **Developer QA:** Select vehicles with different verified bolt patterns; confirm design choices differ appropriately; try previously incompatible design; reset and confirm all normal choices return; verify icon circle matches container color in verify status. **STOP for approval.**

### Batch 5 — PDP configurator controls, sizes, pricing and purchasing

**P3** In `.calder-uc` Hardware and Rivet Finish order **Black Bolts first, Chrome Bolts second**, retaining stable values, SKU mappings, selection and availability. Do not reorder unrelated controls.

**P4** **Latest instruction overrides earlier size-exploration allowance:** Hide the **Diameter** `.calder-uc__group` (`display:none`/appropriate accessible conditional hiding) while no valid vehicle is selected, and hide it again after vehicle reset. Preserve non-size design/finish exploration and preview; when vehicle selected show applicable size control. Where approved and supported by existing data, present combined **Size = diameter × width** (e.g. `22 × 10`) in relevant customer-facing selectors, without changing underlying variant/diameter/width identifiers or the protected mobile tab naming by default. Resolve any tension between hidden Diameter group and Size UI without exposing vehicle-dependent size selection before fitment. Prevent unsupported size combinations; audit multi-size behavior.

**P5** Without a valid vehicle, disable Add to Cart and show a conditional message inside `.calder-upc__message`: **“Select your vehicle to confirm fitment, check availability, and add this wheel to your cart.”** Use existing vehicle picker action. Validate server-supported/form/AJAX pathways as far as the theme can enforce, including Quick Shop and dynamic purchase controls; do not claim absolute server-side enforcement without an actual supported checkout validation mechanism. With valid vehicle, enable purchasing only if compatibility, SKU, price and availability checks pass. Preserve other products and dealer flows.

**P6** Trace and correct size-dependent pricing through selection → variant/SKU → displayed price → cart line price; reuse Shopify's authoritative pricing and existing rules, preserve dealer pricing. No parallel pricing system.

**OpenCode tests:** no-vehicle state, reset, valid/invalid fitment, disabled and attempted form/AJAX purchase, Black/Chrome order, size availability, pricing/SKU, mobile flag off/on developer mode, existing wheel preview. **Developer QA:** Load without vehicle; verify Diameter hidden, other finishes browsable, button disabled and message visible; select vehicle and check size appears; switch sizes and verify prices; reset and confirm hidden/disabled state; verify bolt order; check mobile sticky configurator stays disabled by default. **STOP for approval.**

### Batch 6 — Exact PDP specification values and fitment corrections

**P7** In `.calder-specs__table`, after valid vehicle/configuration selection show the **exact assigned Width, Bolt Pattern and Offset** for the resolved wheel design/variant/fitment, not universal ranges. Also audit exact diameter/size, wheel center bore, hub bore, ring and SKU where applicable. Before vehicle selection, generic/range information may remain **only if clearly labeled as general, not as the actual selected wheel specification**. If a value cannot be authoritatively resolved, display a truthful unavailable/pending state and block purchase where safety-critical; do not guess or derive exact values from ranges.

**P8** Audit Standard (default) / Lifted suspension only for supported vehicles; no invented offsets or lifted compatibility. Review Lexus GX year ranges, Lexus LX 2022–2026, RX/TX exclusions, center-bore distinctions, 26-inch vehicle-specific restrictions and M-02 future five-lug Range Rover/G-Class possibilities. Implement only corrections backed by approved fitment/SKU data; otherwise document blocked records. Preserve CLM migration and legitimate legacy identifiers.

**OpenCode tests:** known vehicle+design+size exact values, missing values, suspension change, unsupported Lifted, Lexus examples if data supplied, cart SKU agreement. **Developer QA:** Compare Width/Bolt Pattern/Offset against approved fitment sheet for at least two vehicles; test Standard/Lifted only where supported; verify no ranges remain after resolved selection; check reset and missing-data behavior. **STOP for approval.**

### Batch 7 — Cart line properties, confirmations and checkout gate

**K1** Every Calder cart line must display **its own complete actual selected PDP configurator options**, including where applicable Diameter/Size, Width, Center Finish, Bolts/Hardware and Rivet Finish, Barrel/Lip Finish, Wheel Design, vehicle year/make/model/trim, suspension and exact fitment identifiers. Preserve selected values as appropriate Shopify line-item properties or existing cart data contract, ensure correct values across duplicate designs with different configurations, and never rely on a global last-selected state. Verify no accidental exposure of internal/private properties. Preserve quantities, prices, SKUs, shipping/integration identifiers and existing preview image.

**K2** Provide a **separate checkbox for each required displayed specification per cart line** (including vehicle, design, size, finishes and applicable hardware). Use the existing `prd-block-agreement` mechanism as the design/behavior reference, but do not replace or weaken it. Each line's required checkboxes must be checked before **Proceed to Checkout** becomes available. On any line property, variant, configuration, quantity or cart-line identity change, invalidate confirmations as appropriate; distinguish identical SKUs with different line properties. Confirm every affected cart line independently. Preserve existing agreement checks as additional requirements.

**K3** Audit cart page, cart drawer, sticky checkout, accelerated/dynamic/express checkout, alternate forms and Shopify checkout extensibility. Prevent known bypasses within the theme. **If checkout enforcement cannot be made truly mandatory across all routes using available Shopify capabilities, do not falsely claim it is enforced; report bypasses and request approval for a supported validation/app/extension strategy before marking complete.** Never change payment methods or checkout internals without approval.

**K4** **Do not change the design or layout** of `.card-total.bg-alt.calder-cart-summary`; only update cart item specifications and their confirmation controls. No unrelated summary CSS or markup edits.

**OpenCode tests:** multiple differently configured lines, every checkbox gate, partial confirmations, quantity/removal/update invalidation, reload/persistence, cart drawer and page, express checkout bypass audit, existing agreement, totals and discounts unchanged. **Developer QA:** Add two distinct configurations; compare each cart line with PDP; try checkout with none/some/all confirmations; change quantity/remove a line and recheck; test all visible checkout routes; confirm summary layout is visually identical. **STOP for approval.**

### Batch 8 — Vehicle / wheel gallery navigation

**G1** Audit gallery entry cards and existing templates/routes/metaobjects/pages to find whether a **gallery entry details page** or equivalent already exists. If it does, link each entry to its **own** intended details page rather than a designated product PDP; preserve the details page's existing optional product CTA. Resolve links from authoritative entry data, handle missing destinations without redirecting every entry to the same product, and preserve media and layout. If no details template or route exists, report the finding and propose the smallest safe implementation; **ask approval before creating a new page architecture**. Do not invent vehicle-to-wheel assignments or modify gallery media.

**OpenCode tests:** multiple gallery entries, distinct destinations, browser back, missing detail page, mobile click/tap, no media changes. **Developer QA:** Open several entries and confirm each lands on the correct entry details page, not product PDP; verify any intended product CTA still works; check mobile and return navigation. **STOP for approval.**

### Batch 9 — Inventory/SKU integration assessment and optional approved reference patches

**I1** Assess finished-wheel SKUs, component centers/barrels/caps/bolts, BOM quantities, buildable inventory, Shopify variants, QuickBooks Desktop Enterprise, Quickbase production orders, n8n and ShipStation. Trace authoritative inventory ownership, low-stock rules and component availability. Preserve existing inventory and purchase behavior; do not hardcode a low-stock threshold of 10.

**I2** If authoritative exports and separate approval are provided, prepare **non-destructive import files** and smallest necessary theme inventory reference updates; validate duplicates, variant IDs, finished/component SKU mappings, CLM/legacy identifiers, widths, offsets, bolt patterns and source-of-truth. Report before/after mapping and rollback plan. **No production import or integration changes.** Request approval separately for each import and each inventory-dependent patch.

**OpenCode tests:** read-only mapping consistency, SKU/BOM uniqueness, fixtures for availability, existing checkout and order payload contracts; report unavailable integration tests. **Developer QA:** Review mapping tables, sample finished-wheel-to-component resolution, selected availability messages and sample order data; approve each proposed reference change/import file separately. **STOP for approval.**

### Batch 10 — Final cross-component regression and documentation

Retest collection → PDP → configurator → cart → checkout paths across multiple vehicles/designs/sizes/finishes; filters/reset; product cards; gallery; mobile sticky disabled/developer-only settings; pricing, SKU, exact specs, line confirmations, dealer behavior and integrations. Check browser console, Theme Check, configured lint/build/tests, accessibility, breakpoints, and `git diff --check`. Audit all changes for media/assets, CSS drift, unrelated files and accidental production writes. **STOP for final developer QA approval.**

## 5. Meeting items to preserve or assess, not silently omit

- **Homepage:** Preserve existing educational flow explaining two-piece construction before builder; no full builder migration or duplicate sections. Verify support phone and click-to-call near purchase controls. **Manual media report only:** distorted white Cadillac Escalade hero footage, warped wheel geometry/outer ring/hardware, assembly and finish-interchange footage, vehicle silhouettes, Ford truck crop, gallery/showcase imagery, “Made with Precision” overlay and text overlap. No asset, video, hero layout or media CSS edits.
- **Desktop PDP:** Audit excessive whitespace; apply only localized, non-media layout corrections after explicit approval and separate QA gate if still needed. Preserve product title, controls, previews, availability, add-to-cart and responsive behavior.
- **Wholesale:** Audit existing dealer accounts, pricing, login and configuration persistence; document future demo → dealer login → preserved configuration → dealer price → confirmation workflow and reset between customers. Do not build new wholesale system or expose dealer pricing.
- **Future only:** Staggered front/rear fitments, PDF/email build sheet, separate wheel-on-vehicle visualization, SKU generation template, three-month manufacturing lead-time forecasting, component reorder planning. Document architecture, **do not implement**.
- **Integration safety:** Preserve Shopify → n8n → Quickbase → QuickBooks Desktop → ShipStation contracts, order properties, shipping, payment and inventory sync. Do not modify external systems or production records.

## 6. Required per-batch QA response template

After **every** batch output:

```
CALDER — BATCH [N] QUALITY CHECK / APPROVAL REQUIRED
Requirements: [IDs]
Status: Implemented / Already correct / Partially blocked / Blocked
Files changed: [exact paths, or none]
Changes made: [specific minimal diff]
Preserved: [CSS/theme settings/media/other protected features]
OpenCode tests executed: [command/test, actual PASS/FAIL/BLOCKED/NOT RUN]
Known risks / missing data: [details]
Preview: [verified dev URL or navigation steps, if available]

PLEASE MANUALLY TEST:
[3–8 concrete actions with expected results specific to this batch]

Reply APPROVED to proceed to Batch [N+1], CHANGES with corrections,
or BLOCKED with the issue. I will not proceed without your response.
```

Do not run future batches while waiting. If a batch is deferred, record its dependency and request permission before changing order. Re-run affected earlier tests if a later patch touches shared state.

## 7. Final deliverables

Provide (1) requirement reconciliation matrix with sources and superseded instructions; (2) batch-by-batch status and developer approvals; (3) exact modified file paths and diff summaries; (4) automated and manual QA evidence, with failures/not-run clearly identified; (5) CSS and Git preservation report; (6) media preservation and **Developer Action Required — Image & Video Updates** report; (7) discovered/missing inventory/fitment files, authority, conflicts and import readiness; (8) Shopify checkout confirmation enforcement/bypass assessment; (9) deferred wholesale/future features; (10) outstanding client decisions and production deployment readiness. Never claim production-ready merely because local tests passed.

**START NOW: Perform ONLY the read-only repository audit and source-file discovery. Present the reconciliation matrix, dependency/file requests and phased implementation plan. STOP and wait for developer approval before making the first edit.**
