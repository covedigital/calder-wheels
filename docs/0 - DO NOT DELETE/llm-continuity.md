---
## [2026-08-15] — Project Scaffold from Ray Shadravan Discovery Meeting

### [STATE] Current Status
Project initialized. This is **Project B** — the new wheel company's e-commerce + component inventory platform — split out from the Ray Shadravan meeting notes (2026-08-14). No development begun; Requirements and architecture are the next steps.

### [ACTIVITY] Session Mode
BUILD

### [COMPLETED] What Was Done
- Project directory scaffolded (Calder Wheels)
- AGENTS.md created with e-commerce implementation role, model routing, and key document references
- Continuity file created (this file)
- Brand directory scaffolded with placeholder brand.md
- Separated from two sibling engagements: `Ray Shadravan - AI Coaching` and `E5 Wheels Automation`

### [IN-PROGRESS] What's Partially Done
Nothing — project is ready for requirements gathering.

### [BLOCKED] What's Waiting
- New company name / brand identity
- Inventory source-of-truth decision (Shopify vs QuickBooks vs middleware)
- Final product catalog and fitment data

### [NEXT] Recommended Next Steps
1. Lock the inventory source-of-truth architecture (hardest problem)
2. Define the wheel configurator component model (center / barrel / hardware)
3. Scope the dealer/B2B portal requirements in detail
4. Map vehicle fitment data structure (Year → Make → Model → Generation/Trim)
5. Select Shopify theme approach + QuickBooks/ShipStation integration apps

### [DECISION] Decisions Made This Session
- Separated into three distinct projects: AI Coaching, E5 Wheels Automation, Calder Wheels
- Commerce = Shopify; Accounting = QuickBooks; Shipping = ShipStation
- Build-to-order / component-inventory model with single source of truth

### [WARNING] Known Pitfalls & Cautions
- Inventory is the hardest technical problem — resolve source of truth first
- The configurator is a product configurator, not simple Shopify variants
- Dealer functionality is first-class, not just "customer login"

### [FILES] Files Modified This Session
- `AGENTS.md` — Created
- `docs/0 - DO NOT DELETE/llm-continuity.md` — Created (this file)
- `brand/brand.md` — Created (placeholder)
- `.gitignore` — Created

### [BRANCH] Git Context
- Branch: main
- Last commit: N/A (repo not yet initialized)
- Uncommitted changes: all files uncommitted

### [AGENT] Session Metadata
- Agent: OpenCode (build)
- Model: DeepSeek V4 Pro

---

## [2026-08-15 #2] — Inspiration Analysis & Documentation Build-out

### [ACTIVITY] Session Mode
BROWSE → BUILD

### [COMPLETED] What Was Done
- Reviewed `bespokerev.com` — extracted design language, catalog structure, feature-spotlight pattern, build-to-order messaging, newsletter drop cadence
- Reviewed `vossenwheels.com` — extracted series taxonomy, finish photography discipline, dual gallery system, faceted filtering, manufacturing authority content, dealer locator gaps
- Created `docs/discovery/inspiration-analysis.md` — full competitive breakdown with synthesis and implications for our requirements
- Updated `brand/brand.md` — added competitive landscape section, refined positioning (middle ground: boutique feel + enterprise catalog + three differentiators neither has)
- Updated `AGENTS.md` — added Design Inspiration table, updated key document paths to match actual structure, added granularity to core requirements
- Updated `AGENTS.md` — corrected SOP paths from `0 - SOPs/` to `sops/`
- Created `docs/discovery/requirements.md` — formal requirements doc (product model, storefront, dealer portal, integrations, non-functional, open questions)
- Created `sops/SOP-Index.md` — 10 SOP stubs + 2 meta SOPs with quick-route table
- Created `sops/META/Activity-Modes.md` — THINK / BUILD / BROWSE / EXECUTE / REMEMBER modes
- Created `sops/META/PRIME-Prompting.md` — pre-prompt checklist for ambiguous/high-risk tasks

### [CHANGED] Updated Requirements
- Finish matrix photography requirement (from Vossen) — feeds configurator visual preview
- Dual gallery taxonomy (vehicle-first + wheel-first) — added to requirements
- Series taxonomy (forged/flow-formed/3-piece) — maps to distinct BOM families
- Quote-first retail funnel (from BespokeRev) — suited to configurable/made-to-order
- Nickname + code naming convention for designs — humanises configurable SKUs
- Faceted URL-param filtering — supports dealer-shareable links

### [DECISION] Decisions Made
- Calder Wheels operates between BespokeRev (boutique) and Vossen (enterprise): boutique feel + enterprise catalog discipline
- Three differentiators neither reference has: fitment finder, live configurator, dealer B2B portal

### [NEXT] Unchanged — still waiting on
1. Inventory source-of-truth architecture
2. Wheel configurator component model
3. Dealer portal scope
4. Fitment data structure
5. Shopify theme approach + integration apps

### [FILES] Files Modified/Created This Session
- `docs/discovery/inspiration-analysis.md` — Created
- `docs/discovery/requirements.md` — Created
- `brand/brand.md` — Updated (competitive landscape, positioning)
- `AGENTS.md` — Updated (inspiration table, corrected SOP paths, expanded requirements)
- `sops/SOP-Index.md` — Created
- `sops/META/Activity-Modes.md` — Created
- `sops/META/PRIME-Prompting.md` — Created
- `docs/0 - DO NOT DELETE/llm-continuity.md` — Updated (this entry)

### [AGENT] Session Metadata
- Agent: OpenCode (build)
- Model: DeepSeek V4 Pro

---

## [2026-08-16] — System Architecture Doc (Draft)

### [ACTIVITY] Session Mode
THINK

### [COMPLETED] What Was Done
- Created `docs/architecture/architecture.md` — full system architecture draft
- Resolved inventory source-of-truth decision: **custom ledger (middleware)** holds component truth; Shopify reflects derived finished-SKU availability; QuickBooks is the accounting sink
- Formalised the data model: Component, BOM, FinishedSKU, Design, Fitment, Vehicle, Dealer
- Documented the available-to-build invariant: `min(floor((on_hand - reserved) / qty))` across BOM
- Defined order lifecycle with human-gate state machine
- Established component-as-finish modeling (finish is identity, not attribute)
- Documented configurator, fitment, and dealer portal architectural skeletons
- Adopted working name "C Wheels" (brand name TBD per brand.md — architecture is name-agnostic)

### [DECISION] Decisions Made
- **Inventory source of truth** = custom component ledger (SOP-002 resolved at architecture level)
- Inventory is the "hardest problem" called out in AGENTS.md — resolved with split: custom ledger (realtime build truth) + QuickBooks (accounting truth)
- Component = type(center|barrel|hardware) × finish (finish is the component's identity)
- Available-to-build is a deterministic function, unit-testable (Tier 1)

### [IN-PROGRESS] What's Partially Done
- Architecture doc is v0.1 — 5 open decisions remain (see §10)
- Configurator, fitment, and dealer portal sections are architectural skeletons; need detail SOPs

### [BLOCKED] What's Waiting
- Integration layer stack confirmation (n8n + ledger vs fully custom)
- Dealer portal: native Shopify B2B vs headless decision
- Configurator delivery mechanism (Shopify app extension vs embedded SPA)

### [NEXT] Recommended Next Steps
1. Confirm integration stack (n8n + custom ledger vs fully custom middleware)
2. Detail the dealer portal scope (native B2B vs headless)
3. Define fitment data schema and curation approach
4. Model the configurator finish matrix + preview pipeline
5. Begin component catalog definition

### [FILES] Files Modified/Created This Session
- `docs/architecture/architecture.md` — Created (System Architecture v0.1)

### [BRANCH] Git Context
- Branch: main
- Last commit: a1bd3e7 ("Initial commit")
- Uncommitted changes: 10 files (all from prior sessions + this)

### [AGENT] Session Metadata
- Agent: OpenCode (think)
- Model: DeepSeek V4 Pro

---

## [2026-08-19] — Dealer Portal Complete Design (Lumia Theme)

### [ACTIVITY] Session Mode
THINK

### [COMPLETED] What Was Done
- Comprehensive dealer portal design document created at `docs/design/dealer-portal-design.md`
- Mapped the complete Lumia theme v7.0.1 design system: CSS variables, component patterns (buttons, cards, tables, badges, forms, grids), section structure, customer account architecture, JS patterns
- Designed **10 screens**: Dashboard, Quick Order, Quote Management, Dealer Catalog (collection + PDP), Application Form (4-step), Application Pending Status, Order Detail (enhanced), Payment Terms & Invoices, Dealer Landing Page
- Defined **full state matrix** (loading, empty, error, edge case) for every component
- Documented information architecture: all URLs, routes, templates, sections, snippets
- Mapped implementation file structure (new files + modified files)
- Defined responsive behavior across all 5 breakpoints
- Established CSS architecture with ~14 sections in dealer-portal.css
- Documented JS architecture for Quick Order, Application Form, Dashboard, and Quotes
- Defined 3-phase implementation priority (Core → Self-Service → Financial)
- All designs exclusively use Lumia's native design system — CSS variables, BEM, section patterns, component patterns — no custom design language

### [DECISION] Design Decisions Made
- **Tabs over subdomain**: CSS-only tabs within `/account` (all content pre-rendered, no JS dependency for v1)
- **Same PDP for dealers and retail**: One product template with conditional dealer pricing block + dual CTA
- **Native Shopify B2B approach**: Customer accounts + tags + metafields — no headless for v1
- **Separate CSS/JS assets**: dealer-portal.css + dealer-portal.js loaded conditionally for dealer-tagged customers only (zero payload for retail)
- **Lumia design system adherence**: Every component references `var(--body-bg)`, `var(--custom-color)`, `.custom-card.bg-alt`, `.btn`, `.table-rounded-corners` etc. — no custom design language
- **Dark/luxury ready**: All CSS references variables, so the dark preset (`#070909` bg, `#c9a96e` gold accent) works without modification

### [NEXT] Recommended Next Steps
1. Implement Phase 1 dealer components (dashboard rewrite, dealer pricing on PDP, dealer-only gating, application form)
2. Wire application form to backend (customer metafields + admin notification)
3. Implement Phase 2 (Quick Order, enhanced quotes)
4. Confirm payment terms integration with QuickBooks middleware before Phase 3

### [FILES] Files Modified/Created This Session
- `docs/design/dealer-portal-design.md` — Created (complete dealer portal design, ~500 lines)
- `docs/0 - DO NOT DELETE/llm-continuity.md` — Updated (this entry)

### [AGENT] Session Metadata
- Agent: OpenCode (think)
- Model: DeepSeek V4 Pro

---

## [2026-09-30] — Presentation Baseline Checkpoint

### [ACTIVITY] Session Mode
EXECUTE

### [COMPLETED] What Was Done
- Created checkpoint branch `presentation-baseline-2026-09-30` from `design-to-code-home`
- Staged and committed all 106 uncommitted files (modified theme sections + untracked brand assets, fonts, SVG logos, visual inspector artifacts)
- Created annotated tag `presentation-baseline-2026-09-30` at commit 6b988a3
- Updated both continuity docs with session record
- Working tree is clean

### [BRANCH] Git Context
- Branch: presentation-baseline-2026-09-30 (active)
- Other branches: design-to-code-home, main
- Tags: presentation-baseline-2026-09-30
- Last commit: 6b988a3

### [AGENT] Session Metadata
- Agent: OpenCode
- Model: DeepSeek V4 Flash

---

## [2026-11-01] — Gallery System Audit & Implementation (Phases B–F)

### [ACTIVITY] Session Mode
BUILD (audit approved → implementation)

### [COMPLETED] What Was Done
- Full gallery-system audit (read-only) — 11 reports created under `docs/gallery-audit/` (README is the executive summary; root cause of empty galleries = zero `gallery_build` metaobjects in Shopify Admin + one stale legacy card, not code)
- BUG-01 (P0): `[hidden]` fix — `.calder-gallery-grid__item[hidden]{display:none!important}` in `calder-gallery-v2.css`
- BUG-02 (P1): removed v1 CSS loads from `theme.liquid` (gallery + metaobject blocks)
- BUG-03 (P0): split empty states — new server-rendered `[data-gallery-empty-none]` no-content message vs `[data-gallery-empty]` filtered-empty; JS updated to suppress filter message when grid has zero cards
- BUG-04 (P0): legacy `apex-201` block → registry-correct CLM-01 entry in `page.wheel-gallery.json` (also fixed pre-existing invalid JSON: unclosed `blocks` object)
- Phase C: Make→Model dependent filter options in rewritten (un-minified) `calder-gallery-v2.js`
- Phase E: fullscreen lightbox on detail hero (focus-managed, Esc/arrows) + `.cg-detail-note` microcopy style
- Phase F (doc 07 G-1/G-2): new `snippets/calder-finish-tokens.liquid` (finish labels → registry tokens, degrade-graceful); wheel-gallery design cards + gallery-detail CTA deep-link to `calder-{design}-wheel` PDP with config preselected; "VIEW THIS CONFIGURATION →" primary CTA with reference-only microcopy
- Deleted dead v1 assets (`calder-gallery.js/.css`, `calder-gallery-detail.js/.css`) + 12 gallery `.backup-102226` files

### [NOT DONE] Deliberately Out of Scope
- Phase A (Shopify Admin): create `gallery_build` metaobject definition/entries + enable web pages — **client/admin action, still the #1 blocker**
- `page.gallery.json` legacy page kept (needs live-nav parity check before removal)
- `style_filter_values` vocabulary — client decision pending
- theme.liquid meta/SEO emission for metaobject detail — deferred to Phase E remainder (needs metaobject web pages enabled first)

### [BLOCKED] What's Waiting
- Client: gallery photography/spec data, metaobject definition creation, style vocabulary (see `docs/gallery-audit/10-client-questions-and-launch-dependencies.md`)
- Deploy pipeline: verify live theme matches repo HEAD before `shopify theme push` (version-skew risk)

### [FILES] Modified/Created This Session
- Modified: `assets/calder-gallery-v2.css`, `assets/calder-gallery-v2.js`, `layout/theme.liquid`, `sections/calder-{vehicle,wheel}-gallery.liquid`, `sections/calder-gallery-detail.liquid`, `templates/page.wheel-gallery.json`
- Created: `snippets/calder-finish-tokens.liquid`, `docs/gallery-audit/*` (11 files)
- Deleted: 4 dead v1 assets + 12 gallery backup files

### [AGENT] Session Metadata
- Agent: OpenCode (build)
- Model: DeepSeek V4 Flash

---

## [2026-11-01 #2] — Vehicle Gallery Content Plan + VGC-1/VGC-3 Implementation

### [ACTIVITY] Session Mode
BUILD (approved)

### [COMPLETED] What Was Done
- 12-vehicle content plan: `docs/gallery-audit/vehicle-content/` (01–08 + `03-content-manifest.json` + 12 contact sheets). Design mapping client-authoritative; **live-verified** all 4 products (201→calder-clm-01-wheel, 202→calder-clm-02-wheel, 203→calder-clm-03-wheel, 207→calder-clb-07-wheel). 41 files on disk, 40 unique (Tahoe-M-2_2 ≡ _1 duplicate excluded; G63-M-07_4 is 940×482 low-res — thumb only). **No image-input support in agent — covers defaulted to _1.png pending client visual review via contact sheets.**
- **VGC-1 (approved, implemented):** `<p class="cg-count" data-gallery-count aria-live="polite">` in both listing sections (after sort) + JS `render()` updates "N of M builds"; `.cg-count` style added to calder-gallery-v2.css
- **VGC-3 (approved, implemented):** `official_design` assign (default true, backwards-compatible) in `calder-gallery-detail.liquid`; gates series eyebrow, FINISH SHOWN, VIEW WHEEL SPECS anchor + entire specs block. FIND YOUR FIT kept for unofficial entries. F-150 (official=false + blank design_code → pdp_link blank) can render no wheel-product content structurally
- Verified: node --check OK; Liquid if/for balance OK; JSON manifest valid (12 entries, 40 images, F-150 wheel_product="")

### [BLOCKED] What's Waiting (Admin-side — no store credentials in repo)
- **No `shopify.theme.toml`/config.yml anywhere in repo** → theme push + metaobject creation require client Admin action or credentials. Shopify CLI binary exists (`~/.nvm/.../bin/shopify`)
- Phase A: add `vehicle_color` / `wheel_design_id` / `official_calder_design` fields to `gallery_build` definition + enable web pages
- Phase B: upload 40 unique PNGs to Files · Phase C: create 12 draft entries per manifest (procedure: `vehicle-content/06-import-procedure.md`)
- F-150 Raptor publication decision (mandatory §11 gate) + client cover confirmations

### [FILES] Modified This Session
- `sections/calder-vehicle-gallery.liquid`, `sections/calder-wheel-gallery.liquid` (count element)
- `sections/calder-gallery-detail.liquid` (official_design gating)
- `assets/calder-gallery-v2.js` (count update), `assets/calder-gallery-v2.css` (.cg-count)

### [AGENT] Session Metadata
- Agent: OpenCode (build)
- Model: DeepSeek V4 Flash

---

## [2026-11-02] — Matrixify Product Image Import Batches (Render → Product Mapping)

### [ACTIVITY] Session Mode
BUILD

### [COMPLETED] What Was Done
- Generated **29 Matrixify import batch CSVs** in `docs/galleries/wheels/Image Updates/image-import-batches/` (`products_image-update-import_batch-01-of-29_11-2-2026.csv` … `_batch-29-of-29_…`): **max 10 data rows per file** (288 rows total, last file 8), 96 products × 3 image rows each (positions 1–3 = Black Tint / Gloss Black / Titanium Tint center variants of each product's fixed lip/bolt combo), covering all 72 CalderRender webp renders, zero unused
- **Image Src hosting moved** (client request, final): `https://www.dicovemaze.com/dev/calderwheels/image-import-batches/{filename}.webp` (was covedigitalworks.com, was Shopify CDN before that) — the 72 webp files were copied into `image-import-batches/` alongside the CSVs so the folder mirrors the hosted URL path 1:1; Shopify Files upload **no longer required** (imports pull from dicovemaze.com)
- **Minimal-column format** (client request: update ONLY image fields): `Handle, Command(MERGE), Image Src, Image Position, Image Alt Text` — no other product data touched. `Image Command` column omitted (default MERGE semantics update images in place by position rather than REPLACE-deleting)
- Established verified render→product mapping: CLM-01→201, CLM-02→202, CLM-03→203, CLM-05→205, CLB-06→206, CLB-07→207 (201/202/203/207 live-verified in prior session; 205/206 by elimination)
- **Verified barrel token semantics by pixel analysis** (radial luminance diff at r=500–650px): `barrel-gbl` = bright = **Polished Lip**; `barrel-gb` = dark = **Gloss Black Lip**. Center tokens: bt/gb/ti = Black Tint/Gloss Black/Titanium Tint (matches variant order BT→GB→TT, position 1 = default first variant)
- Image Src = `https://cdn.shopify.com/s/files/1/1017/6325/2533/files/{render-filename}.webp`; live-verified CDN serves that path **without** `?v=` param
- Validated: all 96 export handles covered exactly 3 rows, no duplicate (handle, position) pairs, all 72 URLs ↔ local webp files ↔ jobs.json manifest entries

### [DECISION] Decisions Made
- **"Max 10 records" = 10 data rows per file** (client clarified); Handle + Command(MERGE) kept as row identifiers — required for Matrixify to target products, not "product data"
- Alt text pattern: `Calder {code} {Cast Monoblock|Spun Forged} wheel - {center} center, {Polished|Gloss Black} Lip, {Chrome|Black} Bolts`

### [BLOCKED] What's Waiting (Client/Admin prerequisites before import)
1. **Host the `image-import-batches/` folder contents (72 webp) at `https://www.dicovemaze.com/dev/calderwheels/image-import-batches/`** — Image Src URLs won't resolve until the webp files are live at that path; verify one URL in a browser first
2. Spot-check rendered finishes (esp. polished vs gloss-black lip correctness) on a PDP before importing all 29 batches
3. Matrixify import: upload batches 01→29; verify placeholder at position 1 is replaced in place before continuing

### [FILES] Created This Session
- `docs/galleries/wheels/Image Updates/image-import-batches/products_image-update-import_batch-{01..29}-of-29_11-2-2026.csv` (29 files) + 72 webp renders copied alongside
- Generator script kept in temp (re-batch on request)

### [AGENT] Session Metadata
- Agent: OpenCode (build)
- Model: DeepSeek V4 Flash

---

## [2026-11-02 #2] — Universal PDP Switched to Per-Design Component Renders

### [ACTIVITY] Session Mode
BUILD (client-supplied images already in assets/)

### [COMPLETED] What Was Done
- Client delivered 42 per-design component renders (6 designs × 7 layers, 1920×1231 RGBA PNGs) directly into theme `assets/`: `{201|202|203|205|206|207}-disk-{bt|gb|ti}.png`, `-barrel-{gb|gbl}.png`, `-{24|30}pcs-{bk|ch}.png`. Universal PDP now uses the design's OWN layers everywhere instead of the generic `wheel-component-*` set:
  - `assets/calder-universal-pdp.js` — static `ASSET_MAP` replaced by `buildAssetMap(resolver.design.designNumber)` + `DESIGN_IMAGE_SETS` pcs table (203/205 = 30pcs, others = 24pcs); unknown designs fall back to the original generic images; 404 still trips the existing `data-calder-uc-missing` fallback UX
  - `snippets/calder-universal-gallery-slide.liquid` — server-rendered initial layers (preview slide + thumb) now `{n}-barrel-gb.png` / `{n}-disk-gb.png` / `{n}-{pcs}-ch.png` (all 6 registry default_configs are gloss-black lip / gloss-black center / chrome); width/height attrs corrected 480→1920/1231 for the new aspect ratio; generic fallback branch retained
  - `snippets/calder-universal-controls.liquid` — all 7 swatch images now design-specific via design_code→design_number Liquid mapping (CLM01→201, CLM02→202, CLM03→203, CLM05→205, CLB06→206, CLB07→207); generic fallback branch retained
- `docs/architecture/tests/calder-universal-controls.test.mjs` — image-mapping test rewritten: asserts all 42 design assets exist + naming scheme built from registry design_number + generic fallbacks intact; controller-behavior test now expects `206-barrel-gb.png` / `206-disk-gb.png` / `206-24pcs-ch.png` for CLB-06
- Verified: node --check OK; all 6 suites pass (67 tests); vm-boot simulation across ALL 6 designs confirms each design resolves its own render set with correct 24/30-bolt hardware

### [DECISION] Decisions Made
- Token→file mapping locked from prior pixel-verified session: disk gb/bt/ti = Gloss Black/Black Tint(=Black Titanium)/Titanium Tint; barrel gb = Gloss Black Lip, barrel gbl = Polished Lip; pcs-ch/bk = Chrome/Black Bolts
- Design-specific rendering kept in snippets (self-contained philosophy) — design_code→number mapping duplicated in the 2 Liquid snippets rather than threaded through section params
- Generic `wheel-component-*` / `finish-bolt-*` images KEPT as graceful fallback (registry gains a 7th universal design later → generic preview until renders are produced)

### [BLOCKED] What's Waiting
- Deploy: live theme may be behind repo HEAD — verify version skew before `shopify theme push`
- Client spot-check of rendered PDPs (esp. polished-lip `barrel-gbl` correctness per design)

### [FILES] Modified This Session
- `docs/design/Shopify Themes/Working Theme-via-CLI/assets/calder-universal-pdp.js`
- `docs/design/Shopify Themes/Working Theme-via-CLI/snippets/calder-universal-gallery-slide.liquid`
- `docs/design/Shopify Themes/Working Theme-via-CLI/snippets/calder-universal-controls.liquid`
- `docs/architecture/tests/calder-universal-controls.test.mjs`

### [AGENT] Session Metadata
- Agent: OpenCode (build)
- Model: DeepSeek V4 Flash

---

## [2026-11-02 #3] — November 2 Meeting Updates: A/B/C/D/E/G + Mobile (Master Prompt Implementation)

### [ACTIVITY] Session Mode
BUILD (Phases 0–3 of docs/design/site-updates_11-2-2026 master prompt)

### [COMPLETED] What Was Done
- **G (naming reconciliation)**: CLB-06/CLB-07 → CLM-06/CLM-07 alias support everywhere a design code is resolved — resolver (DESIGN_KEY_ALIASES clm06→clb06, clm07→clb07), registry slice assets calder-design-registry-clm06/clm07.js (generator emits rename aliases; all regenerated files byte-identical), calder-design-url (deep links → calder-clm-06-wheel for CLM06 codes), universal-controls + universal-gallery-slide + configurator-product-data + calder-product + calder-specs + calder-wheel-gallery + calder-gallery-detail key lists, demo-inventory DESIGN_CODE_TO_NUMBER keys (no stock values touched). FIXED confirmed bug: configurator-product-data.liquid mapped clm-05 → design number 204; registry + design-205-center-*.png assets prove 205. The demo-inventory 'clm-05':'204' row intentionally NOT changed (F freeze; documented discrepancy — STOCK has both 204 and 205 rows, 204 is the deliberate low-stock CLM-05 demo row per the file's own comment).
- **A (builder nav)**: new snippets/calder-design-nav.liquid rendered on all six universal PDPs after the controls — resolves each design's CURRENT product URL from collections.all (tag 'Universal Design') so the admin handle rename is followed automatically; falls back to calder-clm-06-wheel scheme then registry handles. calder-universal-pdp.js appends the live config (diameter/center/barrel/hardware + pcd) at click time; destination pdp-state validates and resets invalid cells. CSS in calder-universal-controls.css.
- **B (fitment)**: active tab now unmistakable (filled bg + accent underline via aria-selected CSS, roving tabindex + arrow keys). Style-tab switch clears the saved vehicle (localStorage + panel → glue resets card, restores title/bolt block) and strips vehicle-driven URL params on collections. Vehicle lock: verified NO per-chip vehicle dismiss exists (only Change Vehicle / Reset); while a vehicle is active the dismissible applied-filter chips (.filter-row-selected) are hidden so fitment can only be removed via Reset. Barrel & bolt finish filters added to BOTH browse modes in all three finder surfaces (fitment-finder, fitment-finder-guide, home-fitment style panels + vehicle-mode filters in plain finder results and guide wheels grid) using real option data from extended fitment-catalog (barrel_finishes from the Barrel option by name; bolt_finish from hardware_rivet_finish_options metafield).
- **C (state persistence)**: design deep links now carry the clicked product's bolt pattern as &pcd= (validated); calder-pdp-state.urlFor preserves pcd across push/replaceState; calder-universal-cta currentGroup uses pcd to scope the purchase lookup when no vehicle is selected (validated against fitment groups, ignored when unknown; never overrides a vehicle). Style entries no longer inherit vehicles (B's clearing).
- **E (gallery)**: return-to-builder-slide + zoom verified intact; gallery thumbs made keyboard-operable (role=button/tabindex + Enter/Space in calder-universal-pdp.js).
- **D (product cards)**: Available Sizes / Available Finishes / Shown Configuration now sit immediately above .calder-card__price on premium layouts per the authoritative card spec. Available Finishes re-uses the existing variant_picker via new optional card_option_filter param (Center Finish targeted BY NAME; non-target rows render hidden with inputs intact so native variant matching still sees the full tuple — quick-options quick path untouched for legacy layouts). Shown Configuration: server-rendered from the resolved variant (options by name; combined "… Lip - … Bolts" parsing; SKU bolt digit — live-verified 864/864: black-bolts→2, chrome-bolts→1; unresolvable fields omitted). New assets/calder-product-card.js syncs per card on the existing input[name=id] change events via each card's JSON map (delegated, no duplicate listeners). global.js updateMedia guarded for calder-product-card (native product-card unchanged).
- **F (inventory)**: regression-checked only — calder-universal-cta currentGroup change is additive (pcd fallback, identical behavior without pcd/with vehicle); demo-inventory alias keys only; thresholds/settings/support untouched; 69/69 tests pass including all CTA/inventory-state tests.
- **Mobile (Phase 3)**: audit items implemented — #1 16px form font floor (hf-fitment__select, calder-select, calder-input, fitment-finder__select, wheel-configurator diameter select, quote modal inputs, dealer dp-input) + global .calder-site select/input/textarea 16px rule ≤768px; #4 dealer quick-order .dp-table-wrap scroll container + .dp-input definition; #7 touch targets (dp-featured__card-btn 44px, carousel dots 8px visual in 28px hit area, reset button 44px, quote close 44px, dp-topbar toggle 44px, table View links padded to 44px); #10 quote modal real fallback overlay (centered fixed + dimmed, no fancybox needed) + Esc-a11y unchanged.

### [DECISION] Decisions Made
- CLM-06/CLM-07 handled as ALIASES of design keys CLB06/CLB07 (design identity, part numbers, SKUs, design numbers 206/207 unchanged) — works whether or not the admin renamed the design_code metafield; live handles NOT assumed — the design nav reads real URLs from the catalog
- clm-05 '204' in demo-inventory left as-is (F freeze, documented); clm-05 '204' in configurator-product-data FIXED to 205 (display-artwork bug, assets prove 205, no inventory impact)
- pcd param is namespaced, additive and validated at every consumer; unknown values ignored (spec C safeguards)
- Deferrals: audit P0-2 configurator composite rewrite (audit itself requires on-device visual confirmation first), P0-3 swatch/layer image diet (asset generation + admin imagery rules), P1-5 WOFF2, P1-6 Ionicons self-host, P2-8 breakpoints, P2-11 mobile menu data, H homepage (last, assets/approvals pending)

### [BLOCKED] What's Waiting (client-dependent)
1. Confirm the ACTUAL live handles of the renamed CLM-06/CLM-07 products (presumed calder-clm-06-wheel / calder-clm-07-wheel) and that Shopify rename redirects exist for /products/calder-clb-06-wheel?… (query strings preserved)
2. Confirm whether custom.design_code metafields on the renamed products now read CLM-06/CLM-07 (alias paths cover both states)
3. Confirm the collection facet param name for the "Barrel & Lip Finish" option (fitment-finder.js emits filter.v.option.barrel-lip-finish — if the store uses a different slug, adjust one constant)
4. Enable hardware_rivet_finish_options as a storefront filter in Search & Discovery (otherwise the bolt-finish filter silently no-ops)
5. Shopify push/preview + iPhone QA (no store credentials in this environment — browser verification NOT performed)
6. design-206-center-*.png configurator artwork missing (205/207 exist; 201-203,205,207 present) — admin to supply 206 artwork

### [FILES] Created This Session
- snippets/calder-design-nav.liquid, assets/calder-product-card.js, assets/calder-design-registry-clm06.js, assets/calder-design-registry-clm07.js
### [FILES] Modified This Session
- docs/architecture/build_theme_registry_asset.py, docs/architecture/tests/calder-config-resolver.test.mjs
- Theme: assets/{calder-config-resolver,calder-demo-inventory,calder-pdp-state,calder-universal-pdp,calder-universal-cta,fitment-finder,calder-fitment-finder-guide,calder-product-fitment-guide,global}.js, assets/{calder-universal-controls,calder-fitment-finder-guide,calder-product-card,fitment-finder,dealer-portal,build-your-wheel,wheel-configurator}.css, assets/{calder-base,home}.css.liquid, sections/{calder-product,calder-recommendations,calder-specs,calder-wheel-gallery,collection-product-cards-only,fitment-finder-guide,fitment-finder,home-fitment,index-product-carousel,index-product-grid,main-collection-product-grid}.liquid, snippets/{calder-design-url,calder-product-card,calder-quote-modal,calder-universal-controls,calder-universal-gallery-slide,collection-index-product-carousel-tabs,configurator-product-data,fitment-catalog,variant_picker}.liquid
### [AGENT] Session Metadata
- Agent: OpenCode (build) — Model: z-ai/glm-5.3
- Tests: 69/69 pass (67 baseline + 2 new); theme check 13 errors = pre-existing audit-known false positives; all JS node --check OK

---

## [2026-11-03] — Client Review Fixes: Style-Tab Reduction, Demo Data, Design Nav 404, Recs Card Style

### [ACTIVITY] Session Mode
BUILD — post-demo client review fixes on the freshly pulled store theme. CLIENT RULE REINFORCED: preserve the client's own uncommitted CSS + theme-settings edits (verified intact: calder-product.css :has(design-code) block, settings_data.json product_card_add_to_cart_popup=direct). Never revert their work when applying agent updates.

### [COMPLETED] What Was Done
1. **By Wheel Style tab reduced (fitment-finder-guide.liquid + mirrored home-fitment.liquid)**: WIDTH and BARREL FINISH selects removed (both rendered only "All …" placeholders); FINISH (center) also removed per the client's keep-list of three. Panel = DIAMETER, BOLT PATTERN, BOLT FINISH. fitment-finder.js/initStyleSubmit already null-guard every removed select; plain finder (fitment-finder.liquid) and fitment-finder-recent untouched.
2. **Diameter demo data**: initStyleTab now skips any diameter label containing "x" ("18 x 8.5", "20 x 9.5", "22 x 10.5" come from demo wheel products in the store catalog; real Calder labels are pure 'NN"' values).
3. **Bolt Pattern demo data**: options normalized to the store metafield notation (trailing decimals stripped, de-duplicated) — "6x139.7" (curated data-sheet form) merges into "6x139" and no longer appears; submitted filter values now match the metafield facet.
4. **Design nav 404 fixed (calder-design-nav.liquid)**: root cause — the catalog lookup iterated collections.all.products WITHOUT paginate, so Shopify served only the first 50 products; every universal product sits beyond the cap, every lookup missed, and the renamed CLM-06 product's fallback URL /products/calder-clm-06-wheel 404'd. Lookup now paginates by 250, matches universal products by tag OR '-wheel' handle suffix, and uses each design's REAL current URL. Fallbacks now use registry handles (calder-clb-06/07-wheel, redirect-covered). Leading "Calder " removed from the design name (live titles and fallback names both render "CLM-06").
5. **Recommendations cards match site-wide style**: calder-recommendations.liquid now loads calder-product-card.css (the premium card system was never loaded on the PDP — cards fell back to legacy overrides); removed the committed legacy .calder-recommendations card-appearance overrides from calder-product.css (section wrapper/heading/grid kept; client's uncommitted CSS untouched).

### [FILES] Modified This Session
- sections/fitment-finder-guide.liquid, sections/home-fitment.liquid (style panel reduction)
- assets/fitment-finder.js (diameter demo guard + bolt-pattern normalization)
- snippets/calder-design-nav.liquid (paginate lookup, match hardening, name prefix, fallback handles)
- sections/calder-recommendations.liquid (stylesheet include)
- assets/calder-product.css (legacy recs card overrides removed only)

### [VERIFY] QA Notes
- Tests 69/69; theme check unchanged (13 pre-existing known errors); JS syntax OK.
- Needs live QA: paginate lookup on a real PDP (all six design links → real URLs, no 404s), style panel layout after reduction, Diameter/Bolt options clean, recs cards visually matching collection-grid cards.
- Bolt-finish metafield filter still requires Search & Discovery enablement (unchanged from prior session).

### [AGENT] Session Metadata
- Agent: OpenCode (build) — Model: z-ai/glm-5.3

---

## [2026-11-03 #2] — Mobile & Tablet Pre-Event QA (Automated Audit + Reports)

### [ACTIVITY] Session Mode
BUILD (QA automation) — full 7-phase mobile/tablet audit of the live theme.

### [COMPLETED] What Was Done
- **Theme verification**: live `calder-theme` (#191023546677, t/6) pulled via Shopify CLI — byte-identical to local working theme on all 15 recently-modified files (configurator, fitment, design-nav, product-card, recs, product.css). No version skew. Storefront NOT password-protected.
- **QA harness built**: `docs/qa/mobile-event-readiness/qa-harness/` — Playwright **pinned 1.48.2** (1.64+ has no macOS 12 browser builds; mac12 chromium 130 + webkit 18 installed), 6 spec suites + lighthouse runner (system Chrome 150), rate-limit-aware navigation (`gotoPaced` — store returns literal `local_rate_limited` bodies under bursts), incremental JSON artifacts (worker-restart-safe after fixing record() to read-modify-write).
- **Coverage**: 9 viewports × 9 routes Chromium baselines (81) + WebKit subset (20) = **202 screenshots** (`screenshots/{chromium,webkit}/<device>/<route>--{full,fold}.png`); layout audit 54 cells (overflow, broken images, aspect flags, touch targets, sticky inventory); functional 17 tests (12 brief areas); WebKit spot checks; throttled perf (CDP slow-4G) ×4 routes; Lighthouse ×4.
- **Reports delivered** to `docs/qa/mobile-event-readiness/`: MOBILE_QA_REPORT.md, DEVICE_TEST_MATRIX.md, FUNCTIONAL_TEST_RESULTS.md, VISUAL_ISSUES.md, PERFORMANCE_RESULTS.md, EVENT_LAUNCH_CHECKLIST.md. **Verdict: CONDITIONAL GO** (report §4).
- **Defects found (P1)**: P1-V1 collections horizontal scroll at all phone widths (`.list-options-in-row` card min-content 412px; +74px @375); P1-V2 PDP recs-grid overflow (repeat(N,1fr) vs 222px card min-content; +111px @375, +50px @1024 landscape; **fix verified live**: `minmax(0,1fr)` → 486→375); P1-V3/F-T3 BYW chain (EmptyDrop seed → `window._calderProductData[]` parse error → `_calderDesignCode=''` → `design--center-{bk,bkuti,su}.png` 404s at all 9 viewports + center preview layer `src=""` + finish data from **external dev API calder-dev.covedigitalworks.com** leaking "Satin Silver"); F-T1 mobile drawer menu nearly empty (settings `menu` unset + `menu_mobile` empty → drawer = Home/Wheels/dead-Gallery; desktop nav has 15+ items); F-T2 qty-99 click POSTs cart/add before async recheck (cart 0→50 Shopify-clamped; quantity not in click-time staleness key).
- **Verified green**: universal configurator compositing (all layer srcs swap, zero unloaded), fitment cascade, both galleries, design-nav (all 6 design links 200 — Nov-3 fix verified), add-to-cart + inquiry paths, 16px form floor, CLS≈0, no page errors except BYW.

### [DECISION] Decisions Made
- Remediation NOT implemented (per brief Phase 7): Tier A settings-only fixes recommended pre-event — **A1: BYW section `default_product` = `calder-clm-01-wheel`** (fixes whole P1-V3 chain), **A2: populate mobile menu**. Tier B code fixes (B1 EmptyDrop guard, B2 list-options-in-row mobile stack, B3 recs minmax(0,1fr), B4 qty-aware click gate) documented with risk notes, pending approval.
- Platform noise classified not-defect: `sf_private_access_tokens` 401 probe, `big-skins.com` author telemetry (CORS-blocked), `local_rate_limited` throttling.
- WebKit "broken image" flags on gallery photography = transient rate-limit artifacts (files verified 200, ~380-420KB PNGs → P3 WebP lever).

### [BLOCKED] What's Waiting (client/admin)
1. Approve + apply A1/A2 settings fixes (theme editor, no code push) then re-verify via EVENT_LAUNCH_CHECKLIST §3 script step 5
2. Approve Tier B code fixes if pre-event (each needs theme push + 69-test suite + screenshot-diff regression)
3. Manual real-device 5-min script (EVENT_LAUNCH_CHECKLIST §3) on real iPhone + iPad — emulation ≠ device (this model also could not view screenshots; **baseline PNGs need one human visual pass**)
4. design-206 center artwork still missing (unchanged; BYW A1 sidesteps it)

### [FILES] Created This Session
- docs/qa/mobile-event-readiness/{MOBILE_QA_REPORT,DEVICE_TEST_MATRIX,FUNCTIONAL_TEST_RESULTS,VISUAL_ISSUES,PERFORMANCE_RESULTS,EVENT_LAUNCH_CHECKLIST}.md
- docs/qa/mobile-event-readiness/qa-harness/{playwright.config.mjs,package.json,.gitignore,lib/{devices,helpers,diff-baselines,promote-baselines,run-lighthouse}.mjs,tests/{01-smoke,02-visual-audit-chromium,03-visual-audit-webkit,04-functional,05-performance,06-layout-audit}.spec.mjs}
- 202 baseline screenshots + artifacts JSON (layout-audit, functional-375, perf-throttled, smoke-375, lighthouse, results)

### [AGENT] Session Metadata
- Agent: opencode (QA) — Model: z-ai/glm-5.3
- Suite status at write time: smoke 9/9, visual 79+20 pass (2 rate-limit cells re-captured), layout 54/54, functional 16/17 (fail = P1-V2 landscape), webkit spot 2/2, perf 4/4, Lighthouse 54-76/CLS≈0

---

## [2026-11-03 #3] — A1/A2 Applied: BYW Fixed Settings-Only; A2 Blocked on Admin

### [ACTIVITY] Session Mode
EXECUTE (approved settings-only remediation — "apply A1 + A2 (settings-only, zero theme-code risk)")

### [COMPLETED] What Was Done
- **A1 APPLIED & VERIFIED**: `templates/page.build-your-wheel.json` → `sections.build-your-wheel.settings.default_product` = **`calder-clm-01-6x135-p30-87-1mm-gloss-black-lip-black-bolts-wheels`** (universal CLM-01 **variant** product, NOT the design product), pushed live via `shopify theme push --only templates/page.build-your-wheel.json --allow-live`. Whole P1-V3/F-T3 chain resolved: EmptyDrop SyntaxError GONE (0 page errors), `_calderDesignCode='CLM-01'`, embedded components boot (6 products), 0 broken center swatches (was 3×404 at all 9 viewports), center preview layer loads + swaps src on finish change (compositing verified), finish options from embedded data (external dev API no longer consulted; "Satin Silver" gone), "In Stock" badges render.
- **KEY DISCOVERY (why variant product, not `calder-clm-01-wheel`)**: design products carry `custom.design_code` **non-hyphenated** (`CLM01`), which misses `configurator-product-data.liquid`'s hyphenated case list (`'clm-01'`→201) → empty design number → empty artwork. Variant products carry hyphenated `CLM-01` and resolve natively. First attempted seed `calder-clm-01-wheel` fixed the SyntaxError but left empty swatch srcs — live-probed, rejected, superseded.
- **A2 BLOCKED — needs 5-min admin action**: probed `settings.menu_mobile` handles via live settings pushes + drawer renders (`?section_id=async-header-navigation-mobile`). EXISTING menus: `main-menu` (Home/Wheels/Gallery = current drawer) and `footer` (flat: All Wheels/By Vehicle/By Style/Accessories, **placeholder hrefs / — rejected**). ABSENT: footer-1..footer-4, mobile-menu, main-menu-1, menu, tools, explore, resources, support, quick-links. The 3 useful footer-column menus exist as store data but handles are undiscoverable without admin (menus can't be created via theme CLI; dev-theme previews 302 to live for anonymous users; `--unpublished` prompt is interactive-only even via expect). `menu_mobile` restored to `""` — client settings preserved byte-for-byte (git diff: only their `product_card_add_to_cart_popup` + my 2 intended keys). Admin action documented in MOBILE_QA_REPORT §4b.
- **Cleanup**: qa-probe dev theme (#192945848629) deleted; probe template dir in /tmp discarded.
- **Regression (post-A1)**: 04-functional + 01-smoke = **25 passed / 1 failed** (failure = pre-existing P1-V2 t-768 landscape overflow, unchanged). BYW test PASS with 0 broken swatches / 0 page errors.
- **Reports updated**: MOBILE_QA_REPORT (§4a A1 result, §4b A2 blocked + admin steps, B5 data-debt, verdict refreshed), EVENT_LAUNCH_CHECKLIST (G1 done, G3 blocked steps), FUNCTIONAL_TEST_RESULTS (F-T3 resolved), VISUAL_ISSUES (P1-V3 resolved).

### [DECISION] Decisions Made
- A1 seed = universal variant product over design product (hyphenated metafield resolves; verified live both ways before settling)
- A2: do NOT ship `menu_mobile: "footer"` — placeholder-href links in a demo drawer confuse reps more than the sparse drawer
- Design-code metafield inconsistency (`CLM01` vs `CLM-01`) logged as Tier B item B5 — NOT fixed (product data + brief constraint)

### [BLOCKED] What's Waiting (client/admin)
1. **A2 admin action (5 min)**: create menu handle `mobile-menu` (Fitment/Wheels/Build Your Wheel/Wheel Gallery/Vehicle Gallery/Contact/Find a Dealer) → theme editor "Only Mobile Navigation" or ask agent to push settings
2. Tier B approvals (B1–B4) per MOBILE_QA_REPORT §3 — B2/B3 remove the remaining P1 layout overflow
3. Manual real-device 5-min script (EVENT_LAUNCH_CHECKLIST §3) — still mandatory on real iPhone + iPad
4. BYW baseline screenshots are stale vs pre-A1 captures (changed deliberately) — re-baseline after visual review

### [FILES] Modified This Session
- docs/design/Shopify Themes/Working Theme-via-CLI/templates/page.build-your-wheel.json (default_product — pushed live)
- docs/design/Shopify Themes/Working Theme-via-CLI/config/settings_data.json (menu_mobile probes; restored to "" — pushed live)
- docs/qa/mobile-event-readiness/{MOBILE_QA_REPORT,EVENT_LAUNCH_CHECKLIST,FUNCTIONAL_TEST_RESULTS,VISUAL_ISSUES}.md (updated)
- qa-harness artifacts: run-04-postA1.log, functional-375.json (refreshed)

### [AGENT] Session Metadata
- Agent: opencode (execute) — Model: z-ai/glm-5.3
- Verdict unchanged: CONDITIONAL GO (A1 done; A2 pending 5-min admin action)

---

## [2026-11-03 #4] — Mobile Special-Character Rendering Fix (Garet Bold Swap + \u Escape Fix)

### [ACTIVITY] Session Mode
BUILD — mobile typography defect investigation + minimal fixes.

### [COMPLETED] What Was Done
- **Investigation (both engines, live)**: no U+FFFD, no mojibake, all 852 theme files valid UTF-8, `<meta charset>` present (head.liquid:14). Root causes found:
  1. **`assets/garet-bold.otf` is a 96-glyph ASCII-only subset** (0x20–0x7E, zero non-ASCII) — all bold Garet text (600/700) fell back per-glyph to Poppins on devices without Inter. All 3 project copies byte-identical (theme, assets-backup, brand/assets/fonts) — no complete Garet Bold exists in the project. Inter is installed on the dev desktop (why it looked fine locally) but is never webfont-loaded.
  2. **Literal `\u2013` escapes in Liquid** (build-your-wheel-page.liquid:56 + schema default; wheel-configurator.liquid:244,291) — Liquid doesn't interpret `\u`, latent bug when settings blank.
- **Fixes applied (local theme files; live push done for BYW before the no-push instruction, then frozen)**:
  - `assets/font.css.liquid` — Garet **700 face** now serves `Poppins-Bold.ttf` (brand-sanctioned fallback per brand.md:107, complete coverage, zero new font bytes). Garet Book 400 + Facundo unchanged → branding preserved. garet-bold.otf remains in assets unused.
  - `sections/build-your-wheel-page.liquid` — 2 literal escapes → real en dash (U+2013). **Pushed to live pre-instruction.**
  - `sections/wheel-configurator.liquid` — **REVERTED to client's pulled version** at client request (schema default `5-10` ASCII hyphen masks its latent escapes). Pushed (client's own bytes). **Client wants this file excluded from agent pushes going forward.**
- **Empirical verification (chromium+webkit, fonts explicitly loaded via document.fonts.load)**: w400→Garet Book, w600≡w700→Poppins Bold for all 10 test chars (U+0022/0027/002D/2013/2014/2018/2019/201C/201D/2212) — zero system fallback. Earlier width-based tests unreliable (fonts 'loading' during measure) — superseded.
- **Client instruction: NO MORE LIVE THEME PUSHES by agent** — client pushes manually.

### [DECISION] Decisions Made
- Replace broken Garet Bold with Poppins Bold (NOT Inter): Poppins is brand.md-sanctioned fallback + already loaded; Inter would need a new webfont (and brand.md doesn't sanction Inter).
- wheel-configurator.liquid excluded from agent modifications (client's file).

### [BLOCKED] What's Waiting (client manual actions)
1. **Manual push**: `shopify theme push --store wvpnpr-t7.myshopify.com --theme 191023546677 --only assets/font.css.liquid --allow-live` (from Working Theme-via-CLI dir)
2. Optional: delete unused `assets/garet-bold.otf` via admin; obtain complete Garet Bold from brand source if the pure-Garet bold look is wanted later
3. Optional post-event: load Inter as a real webfont or drop it from stacks (currently cosmetic only on devices without Inter)

### [FILES] Modified This Session
- assets/font.css.liquid (Garet 700 → Poppins-Bold.ttf, local only — NOT pushed)
- sections/build-your-wheel-page.liquid (\u2013 fix — pushed before no-push instruction)
- sections/wheel-configurator.liquid (reverted to client version — pushed)

### [AGENT] Session Metadata
- Agent: opencode (build) — Model: z-ai/glm-5.3

---

## [2026-11-03 #5] — PDP Mobile Fixes: Fitment Reset Offscreen + Recommendations Grid

### [ACTIVITY] Session Mode
BUILD — mobile CSS defects on the product page, local theme only (no push, per client instruction).

### [COMPLETED] What Was Done
1. **Fitment reset button spilled offscreen on mobile** — root cause: at ≤767px both `.calder-pdp__fitment-action` and `.calder-pdp__fitment-reset` were `width:100%` inside `.calder-pdp__fitment-actions-row` (flex, gap 8px), and the action also carries `flex: 0 0 auto` from calder-product.css:867 → no shrink, pair = 200% of row. Fix in `assets/calder-pdp-fitment-form.css` ≤767px block: both buttons now `flex: 1 1 0; width: auto; min-width: 0` (equal share of the row); reset also gets `min-height: 44px` to match the action's touch target. Desktop/tablet authored styles untouched.
2. **Recommendations cards 2×2 with right column offscreen on mobile** — root cause: `.calder-recommendations__grid` was `repeat(2, 1fr)` at ≤991px (and ≤575px); `1fr` tracks have an `auto` minimum so card min-content (qty/CTA rows) blew the track past the viewport. Fix in `assets/calder-product.css`:
   - ≤991px rule (line ~7339): `repeat(2, minmax(0, 1fr))` — clamps tablet 2-col, layout unchanged.
   - ≤575px rule (line ~7415): `minmax(0, 1fr)` — 1 card per row.
   - New ≤767px block (line ~7448, placed after the 991px block so source order wins): 1 card per row, `min-width: 0` on grid children. Chose "1 card per row, stacked" over carousel (client offered either; simpler + robust).
   - Desktop 4-col unchanged.

### [DECISION] Decisions Made
- 1-card-per-row stacked (not carousel) for mobile recommendations — less JS risk, matches premium full-width card treatment.
- All edits additive/inside existing media queries; no existing client CSS edits or theme settings were reverted or touched (only the two mobile override blocks modified).

### [FILES] Modified This Session
- assets/calder-pdp-fitment-form.css (mobile actions-row share fix)
- assets/calder-product.css (rec grid track clamps + mobile single-column block)

### [BLOCKED] What's Waiting (client manual actions)
1. Manual push (local only, not pushed): `shopify theme push --store wvpnpr-t7.myshopify.com --theme 191023546677 --only assets/calder-pdp-fitment-form.css,assets/calder-product.css --allow-live`
2. Verify on a phone: fitment panel "Select/Change Vehicle + Reset" pair fits in one row; recommendations render as single stacked full-width cards.

### [AGENT] Session Metadata
- Agent: opencode (build) — Model: z-ai/glm-5.3

---
## [2026-11-03 #6] — Mobile Sticky Universal Configurator (isolated feature branch, default-disabled)

### [ACTIVITY] Session Mode
BUILD — two-state mobile sticky configurator for universal PDPs on isolated branch `feature/calder-mobile-sticky-configurator` (branched from presentation-polish with ALL client uncommitted work preserved; nothing pushed, live theme untouched).

### [COMPLETED] What Was Done
- Full Phase 0/1 audit: state API (CALDER_PDP_STATE: getState/setOption/subscribe/applyConfig/urlFor), resolver contract, mobile-bottom-sticky mechanics (header.js body.scroll-up/scroll-down + has-mobile-bottom; .hdr-mobile-bottom 62px z-1009, hidden via translateY(100%)), breakpoints (749px universal / 1024px header), brand tokens (--calder-navy #0E2A3E, --calder-champagne #E9B054).
- **Created 3 isolated files** (all namespaced `.calder-mobile-uc`): `snippets/calder-mobile-sticky-configurator.liquid` (markup skeleton + asset gating; display code normalized CLM05→CLM-05 incl. CLB→CLM rename), `assets/calder-mobile-sticky-configurator.css` (mobile-only ≤749px, dvh sheet, safe-area, reduced-motion), `assets/calder-mobile-sticky-configurator.js` (polls for CALDER_UNIVERSAL_PDP, builds 4 tabs/options from resolver.options + design per-dim lists, labels from resolver.labels).
- **State sync**: mobile option click → clicks the ORIGINAL [data-calder-uc-option] button (existing gallery-snap + setOption path stays authoritative; fallback state.setOption). state.subscribe updates bar/sheet summaries, aria states, thumbnails. No second state instance, no URL writes, no cart/analytics duplication.
- **Nav positioning without competing scroll listeners**: MutationObserver on body class changes + resize(rAF) → reads computed transform of .hdr-mobile-bottom (authoritative across header.js paths incl. alwaysVisible) → sets --calder-muc-nav-offset; z-index 1008 < nav 1009; transition matches nav's 0.35s.
- **Thumbnails/swatches reuse existing assets**: layer srcs copied from [data-calder-uc-stack] gallery stack; swatch srcs copied from original control swatches — zero new downloads.
- **Modified 2 existing files minimally**: sections/calder-product.liquid (+17-line conditional render inside is_universal_design block), config/settings_schema.json (new "Calder Wheels — Mobile Configurator" group appended, select `calder_mobile_configurator_mode` = disabled|developer|enabled, default disabled — zero deletions, purely additive).
- Cleanup/lifecycle: shopify:section:unload → destroy (unsubscribe/disconnect/remove listeners); section:load re-boot; Escape + grab tap + swipe-down (pointer, 44px threshold) close; tablist + radiogroup roving focus; sheet never auto-collapses after selection.
- **Verified**: node --check OK; 69/69 tests pass; theme check 13 errors = pre-existing baseline (my files: 0 offenses); settings_schema JSON valid; liquid if/endif balanced.

### [DECISION] Decisions Made
- Developer mode = `request.design_mode` only (Theme Editor previews) — Liquid cannot securely identify a developer any other way; full device testing should use 'enabled' on an UNPUBLISHED dev theme (documented in report).
- Sheet max-height 40dvh (40vh fallback) + internal overscroll-contain scroll; no scrim — gallery stays visible per client recommendation (see wheel change live).
- Repo ZIP comparison: repo is newer than the Nov-2 ZIP snapshot (sessions 11-02/11-03 all landed in repo) — repo took precedence per brief.

### [BLOCKED] What's Waiting (client/manual)
1. **No push performed** (client rule: NO agent live pushes). Client pushes branch to an UNPUBLISHED dev theme: `shopify theme push --store wvpnpr-t7.myshopify.com --unpublished` (or `--theme <dev-theme-id> --only` the 5 files), then enable mode in that theme's editor for device QA.
2. **Visual QA vs approved mockups NOT performed** — this model cannot view images (mockup PNGs uninspectable); side-by-side comparison needs a human or image-capable pass before sign-off.
3. Real-device regression (iPhone SE/13/14, Android, iPad) per brief Phase 14 once on a dev theme.
4. Default stays `disabled`; public activation is a post-event, post-approval settings flip only.

### [FILES] Created
- snippets/calder-mobile-sticky-configurator.liquid, assets/calder-mobile-sticky-configurator.{css,js}
### [FILES] Modified (minimal)
- sections/calder-product.liquid (+17-line gated render), config/settings_schema.json (additive group)

### [AGENT] Session Metadata
- Agent: opencode (build) — Model: z-ai/glm-5.3

---

---

## [2026-11-03 #7] — Mobile Configurator Client Updates (round 2, all client CSS edits preserved)

### [ACTIVITY] Session Mode
BUILD — client-requested updates to the mobile sticky configurator. CLIENT RULE REINFORCED: client had edited `calder-mobile-sticky-configurator.css` directly (bar 75px/15px padding, label 14px, tab padding 0.4rem 1rem, 4px radii, dia 13px/500, `//letter-spacing` commented out, option-swatch hidden) — ALL preserved; edits made around them, never reverted.

### [COMPLETED] What Was Done
1. **Default mode → `enabled`**: settings_schema default + option labels/info + section Liquid fallback updated. WARNING delivered to client: any theme with this code and NO stored value now renders the feature — including the live theme after a merge; flip to `disabled` in Theme Editor if the staged rollout needs the feature off.
2. **Tab renames**: new `TAB_LABELS` (Diameter/Center/Barrel & Lip/Bolts) for the tab chips only; `DIM_LABELS` full names retained for the active-category label + aria-labels.
3. **Bar "just above" nav**: `bottom: var(--calder-muc-nav-offset)` (nav offsetHeight, NO safe-area addition → no gap above the nav); safe-area applies ONLY when nav hidden via `[data-calder-muc-nav-hidden='true']`. updateNavOffset rewritten to read header.js INTENT classes (scroll-down / has-hdr_sticky_not_hiding / computed position) — stable at transition t=0, fixes the nav-reappear edge (computed-transform read was mid-transition on scroll-up).
4. **Summary clears body**: options got `flex:1 1 auto; min-height:0` (was min-height:auto → overflowed over the summary); body got `overflow:hidden`; summary got `position:relative; z-index:1`. Root cause was flex min-height:auto, not z-order.
5. **Sheet height on true mobile**: 40dvh→`calc(100svh - 84px)` (stable under iOS toolbar collapse — dvh was the shrink-on-scroll culprit); dropped `min-height:260px`; sheet is content-sized → auto-fits contained elements, internal scroll only if the svh cap is hit.
6. **Minimize indicator**: `.calder-mobile-uc__minimize` chevron-down button in the sheet head (44px hit area via negative margins, focus-visible, aria-label) — the bar's rotated chevron was invisible behind the open sheet. Click branch added to delegated handler.

### [VERIFY] QA Notes
- 69/69 tests pass; node --check OK; settings_schema JSON valid; client CSS edits verified intact (grep spot-checks).
- Needs device QA: svh cap on iPhone SE, minimize button, no-gap nav alignment, summary separation, no shrink on scroll-down.

### [FILES] Modified
- assets/calder-mobile-sticky-configurator.js (TAB_LABELS, updateNavOffset, minimize branch)
- assets/calder-mobile-sticky-configurator.css (bottom/nav-hidden rule, svh sheet, options min-height, head-right/minimize, summary containment)
- snippets/calder-mobile-sticky-configurator.liquid (head-right wrapper + minimize button)
- config/settings_schema.json (default enabled, labels/info — my group only)
- sections/calder-product.liquid (Liquid fallback line)

### [AGENT] Session Metadata
- Agent: opencode (build) — Model: z-ai/glm-5.3

---

## [2026-11-15] — Combined 11-15 Master Prompt: Phase-0 Audit + Batch 1 (C1–C5) IMPLEMENTED, AWAITING QA

### [ACTIVITY] Session Mode
THINK → BUILD (full plan approved per-requirement by developer)

### [COMPLETED] What Was Done
- **Backup (developer-requested)**: commit 7556dab on feature branch + tag + branch `backup/pre-11-15-updates-2026-11-15`, pushed to origin (GitHub). Captured developer WIP (3 CSS + 2 xlsx) + 11-15 docs + products_export_1.csv.
- **Phase-0 audit**: full reconciliation matrix presented (all C/P/K/G/I requirements, sources, files, data deps). Developer decisions received: C7=(b) registry-default-config variant; RX/TX KEEP; mobile-config default stays `enabled` (no objection); gallery wire-now.
- **Batch 1 implemented**: C1 — `.filter-row-selected` chip lock had NEVER engaged (Nov-2 selector targeted `facet-filters-form`/`filter-popup` but chips render inside `#product-grid`); selector fixed + hidden only while filtered grid HAS results (zero-results keeps chips visible) + grid container added to the re-render watcher (chips are recreated on every AJAX facet swap). C2 — "Clear Filters" button server-rendered inside `.category-page-title` after `div.ProductCountDesktop` (facets.liquid + facets-mobile-popup-container.liquid, gated on new `calder_clear_filters` param passed ONLY from main-collection-product-grid; search untouched), styled in calder-fitment-finder-guide.css (no underline per C3); both guide RESET + new button share ONE `performCollectionReset(section)` core (facets+vehicle+chips+title+URL bare reload); delegated document-level click handler survives asyncLoadSidebar/renderElements re-renders. C3 verified (dev's border-bottom:0 intact; media query clean). C5 verified (bolt-pattern constraint + block hiding preserved; 26" NOT hidden — xlsx supports 26x10 for Escalade/Tahoe/Expedition/F150/LX'22-26/G-Wagon/SV/Cullinan). C4 BLOCKED-admin: export confirms `hardware_rivet_finish_options` metafield has real values on ALL 107 calder products (Black Bolts/Chrome Bolts lists) — needs S&D storefront-filter enablement; export also ground-truths option sets (96 products "Barrel & Lip Finish", 6 design products combined "Barrel & Lip - Hardware").
- **Tests**: new `docs/architecture/tests/calder-collection-reset.test.mjs` (14 tests: selector/gate/watcher, button placement+gating+opt-in, shared reset, C3 underline guards, C4 CSV data check, C5 regressions, developer CSS baseline guard). Suite: **83/83 pass** (69 baseline + 14 new). node --check OK. Theme check: 13 errors = pre-existing baseline, 0 offenses in changed files. git diff --check clean. Changed files: exactly 5 theme files + 1 test file.
- **P1 data note**: design products carry `bolt_pattern` metafields (CLM-01 `6x135, 6x139`; CLM-07 `5x120, 5x130, 6x135, 6x139`) — the nav can stamp per-design PCDs server-side from the existing paginate lookup.

### [BLOCKED] What's Waiting
- Developer QA gate for Batch 1 (see session gate report). C4 needs 5-min admin action (Search & Discovery → enable `Barrel & Lip - Hardware (Bolts)` / hardware_rivet_finish_options metafield filter; optionally rename barrel filter label to "Lip Finish" per C3).
- No agent pushes (client rule) — client pushes the 5 files to dev/live theme.

### [AGENT] Session Metadata
- Agent: opencode (build) — Model: z-ai/glm-5.3
- Next: Batch 2 (C6 vehicle image mapping — G-Wagon/Escalade V table needs dev approval) on APPROVED

---

## [2026-11-15 #2] — Batch 1 APPROVED; Batch 2 (C6 vehicle image) IMPLEMENTED, AWAITING QA

### [ACTIVITY] Session Mode
BUILD (combined 11-15 master prompt batches)

### [COMPLETED] What Was Done
- **Batch 1 (C1–C5): developer APPROVED unchanged.**
- **Batch 2 (C6)**: root cause confirmed — the src engine was always correct; the "always SUV" impression came from sparse mapping data (10/11 makes → SUV + only F150 model-override) over a catalog that is nearly all luxury SUVs. Developer approved mapping decisions via interactive question: **G-Wagon (all 3 model keys 22/24/26) → "Off-road Vehicle"**; Escalade V, Lexus GX/LX, Range Rover Sport/SV-L460 explicitly KEPT SUV. Implementation = 3 added rows in `snippets/calder-fitment-guide-data.liquid` `vehicleModelImages` (no year-keys needed — engine's model-key fallback covers all years). No JS changes (engine verified: year-key precedence → model-key fallback → defaultImages lookup → safe SUV fallback for unknown makes; renderResults is one synchronous pass — no stale-async path exists).
- **New test file** `docs/architecture/tests/calder-vehicle-image.test.mjs` (8 tests): category→defaultImages key consistency (a mismatch = empty src), no-invented-keys check against calder-fitment-data.json vehicles, decision lock-in (kept-SUV models must never be overridden), G-Wagon-overrides-Mercedes-SUV default, engine contract, sync-render check, media-integrity (5 PNGs present + git shows zero vehicle_type changes).
- **QA**: 91/91 tests pass (83 + 8 new); theme check 13 errors = pre-existing baseline, data snippet 0 offenses; git diff --check clean. Liquid-in-JSON parsing handled in tests via {{ }} substitution.

### [FILES] Batch 2
- Modified: snippets/calder-fitment-guide-data.liquid (+3 vehicleModelImages rows)
- Created: docs/architecture/tests/calder-vehicle-image.test.mjs

### [AGENT] Session Metadata
- Agent: opencode (build) — Model: z-ai/glm-5.3
- Next: Batch 3 (C7 card config — registry default_configs variant source) on APPROVED

---

## [2026-11-15 #3] — Batch 2 APPROVED; Batch 3 (C7 card config) IMPLEMENTED, AWAITING QA

### [ACTIVITY] Session Mode
BUILD (combined 11-15 master prompt batches)

### [COMPLETED] What Was Done
- **Batch 2 (C6): developer APPROVED unchanged.**
- **Batch 3 (C7)**: export analysis overturned prior assumptions — live variant products carry 9 variants (3 diameters × 3 centers; prices tiered 22/24/26" = $1000/$1200/$1400); **Option3 "Barrel & Lip Finish" actually holds the product's fixed BOLT value (Chrome/Black)** — root cause of the "Barrel: Chrome" mislabel; the true lip finish (Polished/Gloss Black) lives in the SKU tail digit (…BT11, 864/864 handle-verified); images are alt-coded per center (pos 2 = "Gloss Black center" render); design products' first variant IS the registry default (22"/Gloss Black/"Gloss Black Lip - Chrome Bolts", CFG-…-22-GB-GBL-CH).
- **Implementation (chosen source (b))**: card resolves to the registry default_configuration "showcase" variant = 22" + Gloss Black (available only), with the alt-matched "Gloss Black center" render replacing featured media (showcase engages ONLY when the image exists — never a panel/image mismatch; design products have no alt → untouched, they already showcase). Overrides: current_variant, image, product_url_collection + calder-design-url deep link (now carries center=gloss-black, coherent with the PDP's own default). Price stays on the 22" tier (test-verified equal). Bolts cell now shows the ACTUAL Option3 hardware value; Barrel cell shows the lip from the documented SKU tail digit (1=Polished/2=Gloss Black); unparseable → omitted. Same routing applied to the per-variant JSON map so calder-product-card.js sync stays truthful for any shopper selection.
- **New tests** `calder-card-config.test.mjs` (10): registry default uniform across 6 designs; label↔token consistency; showcase variant exists+available+same price for all 96; alt-matched render exists for all 96 (pos 1-3); SKU lip/bolt ↔ handle 864/864; design first-variant == registry default; snippet structure (image guard, deep-link recompute, routing symmetry panel↔map, fallbacks preserved).
- **QA**: 101/101 tests pass (91 + 10 new); theme check 13 errors = baseline, card snippet 0 new offenses (3 pre-existing warnings verified at HEAD); git diff --check clean.

### [FILES] Batch 3
- Modified: snippets/calder-product-card.liquid (showcase block + bolt-vocabulary routing in panel + JSON map)
- Created: docs/architecture/tests/calder-card-config.test.mjs

### [AGENT] Session Metadata
- Agent: opencode (build) — Model: z-ai/glm-5.3
- Next: Batch 4 (P1 design-nav filtering + P2 verify icon) on APPROVED

---

## [2026-11-15 #4] — Batch 3 APPROVED; Batch 4 (P1 design-nav filter + P2 verify icon) IMPLEMENTED, AWAITING QA

### [ACTIVITY] Session Mode
BUILD (combined 11-15 master prompt batches)

### [COMPLETED] What Was Done
- **Batch 3 (C7): developer APPROVED unchanged.**
- **Batch 4 (P1)**: design-nav now filters by vehicle bolt pattern. Server side (calder-design-nav.liquid): each design product's `bolt_pattern` metafield is collected during the existing catalog paginate loop (capture-echo handles list/string metafields; ';' pair separator since values contain commas) and stamped `data-pcds` (escaped, conditional). Client side (calder-universal-pdp.js, new module beside the click handler): mirrors the CTA's vehiclePatterns normalization exactly (lowercase/whitespace/trailing-decimal stripped; both saved-vehicle shapes b + bolt_pattern), hides links via the accessible `hidden` attr on the LI, fail-open when data-pcds is missing, empty-state message (data-design-nav-empty, new style in calder-universal-controls.css spanning the grid) when NO design matches, listens to calder:vehicle-selected/cleared + cross-tab storage + initial state. Reset (calder:vehicle-cleared from .calder-pdp__fitment-reset) restores all designs. Current design still excluded; click-time pcd/config passthrough preserved; destination PDP fail-closes purchases (VEHICLE_INCOMPATIBLE) so pattern match ≠ fitment guarantee. Export-verified matrix: 6x139 → all designs visible; 5x112 (BMW) → empty state; 5x120 (RR/TX) → only the four-pattern designs (CLM-02/06/07).
- **Batch 4 (P2)**: verify-state icon now a gold CIRCULAR badge — existing `.calder-pdp__fitment--verify .calder-pdp__fitment-icon` rule (calder-pdp-fitment-form.css) gains `border-radius: 50%` (container geometry matches the svg circle) + `color: var(--calder-gold)` (svg currentColor matches the container color; white mark strokes stay legible). Verify-scoped only; success/unset rules untouched.
- **Tests** `calder-design-nav-filter.test.mjs` (7): export vocabulary check (all 6 designs, PCDs ⊆ fitment dataset), data-driven behavior matrix (6x139/5x112/5x120 expected visible counts), snippet stamping structure, JS module structure (listeners, mirror-CTA normalization, fail-open, accessible hiding, click passthrough preserved), P2 rule properties + identical gold token for bg/color, P2 scoping (success/unset intact), empty-state CSS guards.
- **QA**: 108/108 tests pass (101 + 7 new); node --check OK; theme check 13 errors = baseline, changed files 0 offenses; git diff --check clean.

### [FILES] Batch 4
- Modified: snippets/calder-design-nav.liquid, assets/calder-universal-pdp.js, assets/calder-pdp-fitment-form.css, assets/calder-universal-controls.css
- Created: docs/architecture/tests/calder-design-nav-filter.test.mjs

### [AGENT] Session Metadata
- Agent: opencode (build) — Model: z-ai/glm-5.3
- Next: Batch 5 (P3 hardware order + P4 diameter gating + P5 vehicle-required gate + P6 price trace) on APPROVED

### [2026-11-15 #4b] — Batch 4 CHANGES round (developer feedback) IMPLEMENTED, RE-GATE
- Fix 1 (Reset colors): clearVehicle() never removed `calder-pdp__fitment--verify` → gold label/icon persisted after Reset. Added the verify removal next to the --confirmed removal → panel returns to the unset navy state (check icon restored, warn hidden — both were already in clearVehicle).
- Fix 2 (P4 part 1 pulled forward): Diameter `.calder-uc__group` now vehicle-gated in calder-universal-pdp.js — hidden on load without a saved vehicle, revealed on calder:vehicle-selected, hidden again on calder:vehicle-cleared (Reset); cross-tab storage sync; valid-vehicle = carries b or bolt_pattern. Accessible hiding via hidden attr + new `.calder-uc__group[hidden] { display:none !important }` guard in calder-universal-controls.css (base rule is display:flex which defeats the UA default). Selection STATE untouched (URL/history/resolver default keep working). Shared readSavedVehicle() hoisted at boot scope; nav filter's dnReadVehicle delegates. Mobile sticky configurator's Diameter tab NOT yet gated — deferred to Batch 5 (P4) by design (protected tab naming area).
- Tests: +4 (clearVehicle verify removal; match/no-match verify regression guard; diameter gating module + server-rendered group; CSS hidden guard). 112/112 pass; node --check OK; theme check 13=baseline (calder-product.liquid 0 errors); git diff --check clean.

---

## [2026-11-15 #5] — Batch 4 CHANGES APPROVED; Batch 5 (P3+P4+P5+P6) IMPLEMENTED, AWAITING QA

### [ACTIVITY] Session Mode
BUILD (combined 11-15 master prompt batches)

### [COMPLETED] What Was Done
- **Batch 4 CHANGES: developer APPROVED.**
- **P3 (hardware order)**: desktop calder-universal-controls.liquid now renders Black Bolts FIRST, Chrome second; Chrome keeps the registry-default selection (is-selected/aria-checked) — tokens/SKU/availability untouched. Mobile sticky already renders registry order (hardware_finishes ['black','chrome']) — no change needed there; test-locked.
- **P4 (remaining)**: desktop diameter module enriched — with a vehicle, option labels show combined Size ("22 × 10") from the vehicle's own cf records (display-only; data-token/identifiers unchanged; staggered fz≠rz widths keep the plain label — no half-pairs shown); diameters absent from the vehicle's cf render DISABLED (btn.disabled + aria-disabled + CSS opacity). Mobile sticky parity: Diameter tab hidden without a vehicle (hidden attr + [hidden] CSS guard; active tab moves to Center), same Size labels via labelFor, same disabling in buildOptions, initial saved-vehicle state applied at init; protected tab naming ("Diameter") untouched.
- **P5 (vehicle-required gate)**: calder-universal-cta.js recheck() now fail-closes with VEHICLE_REQUIRED when no saved vehicle — CTA disabled + the exact client message ("Select your vehicle to confirm fitment, check availability, and add this wheel to your cart."); SKU cell stays live via the default-group peek. SUPERSEDES the Nov-2 C pcd-param purchase scoping (pcd still validates for navigation; can no longer enable purchase alone) and the old no-vehicle-default-group path. Server-side enforcement honestly NOT possible theme-side (no checkout validation mechanism) — disclosed. Backstop: P4 size guard — vehicle with cf + diameter outside cf → INVALID ("The selected size isn't offered for your vehicle — choose an available size.") instead of silently pricing against a different pattern's default group.
- **P6 (price trace)**: calder-universal-pdp.js calder:universal-resolved listener now updates `.calder-pdp__price .prd-price-regular` first text node with the resolver's authoritative Shopify price (Storefront priceCents; msrp fallback) — formatter mirrors the captured Liquid rendering (prefix/separator/suffix) so "$1,000"→"$1,200" never reformats; outcomes without a price (VEHICLE_REQUIRED/INVALID) leave the last-known price. Cart lines already price by resolved variantId — no parallel pricing.
- **Test updates**: existing CTA/e2e suites updated to the new P5 contract (no-vehicle → VEHICLE_REQUIRED + zero submissions; non-vehicle-subject tests now run with a selected vehicle; e2e step 1 + reset step assert the disabled state + exact message; no-cart-submission test restored to its ORIGINAL name-intent). New `calder-hardware-size-price.test.mjs` (10 tests) incl. a fitment-data-driven P4 matrix (Escalade all-sizes labels; Durango 26 disabled; X5 staggered no-label; LX uppercase-size parsing; no-vehicle = nothing enriched).
- **QA**: 122/122 tests pass (112 + 10 new); node --check × 3 OK; theme check 13 = baseline, all changed files 0 offenses; git diff --check clean.

### [FILES] Batch 5
- Modified: snippets/calder-universal-controls.liquid, assets/{calder-universal-pdp,calder-universal-cta,calder-mobile-sticky-configurator}.js, assets/{calder-universal-controls,calder-mobile-sticky-configurator}.css
- Created: docs/architecture/tests/calder-hardware-size-price.test.mjs
- Updated: docs/architecture/tests/{calder-universal-cta,calder-pdp-e2e,calder-design-nav-filter}.test.mjs (P5 contract + structure)

### [AGENT] Session Metadata
- Agent: opencode (build) — Model: z-ai/glm-5.3
- Next: Batch 6 (P7 exact specs + P8 fitment audit) on APPROVED

---

## [2026-11-15 #6] — Batch 5 APPROVED; Batch 6 (P7 exact specs + P8 audit) IMPLEMENTED, AWAITING QA

### [ACTIVITY] Session Mode
BUILD (combined 11-15 master prompt batches)

### [COMPLETED] What Was Done
- **Batch 5 (P3–P6): developer APPROVED unchanged.**
- **P7**: `.calder-specs__table` Width / Bolt Pattern / Offset rows + a NEW universal-design Center Bore else-branch now carry `data-calder-spec` hooks; server-side values stay as the GENERAL specification clearly tagged with a muted "general" badge (is_universal_design-gated; non-universal surfaces unchanged; design products have no center_bore metafield → truthful "—" pre-selection). calder-universal-pdp.js `applyVehicleSpecs(tokens)`: with vehicle + config, exact values come from the vehicle's own cf records (width from z/fz/rz — staggered pairs shown as 'Front 9" / Rear 10"'; offset from o normalized to sheet notation '+25mm') + the resolved registry fitment group id (bolt prefix '6x139', wheel center bore '78.1mm' — hub bore stays distinct in the fitment panel). Requires BOTH group AND cf to resolve — no partial guessing; unresolvable → pristine general cells + tags restored. Re-applies on every config change (updateSpecCells) + vehicle events + storage. Purchase-blocking for unresolvable configs was already delivered by Batch 5's P5/P4 gates.
- **P8 audit (lock-in tests, no data changes)**: GX 2010-23 bore 106.1 / 2024-26 95.1 ✓ matches sheet; LX 2008-21 5x150/110.1 → 2022-26 6x139/95.1 ✓; RX (5x114) + TX (5x120) RETAINED per developer decision; 26" verified per-vehicle (no blanket rule; Durango/GrandCherokee genuinely lack 26"); **suspension: NO Standard/Lifted data exists anywhere in the dataset or sheets → remains documented-blocked, nothing invented**; M-02 five-lug RR/G-Wagon = future-only; CLB legacy handles + CLM aliases untouched. DATA NOTE for admin cleanup: the 96 variant products' `center_bore` metafield values carry a stray leading apostrophe from import ("'78.1") — JS exact values overwrite it once a vehicle is selected, but the raw metafield renders `'78.1mm` pre-selection on variant PDPs → recommend admin fix.
- **New tests** `calder-specs-exact.test.mjs` (12): Liquid hooks + gating + truthful bore dash; CSS tag; data-driven exact values (Escalade 10"/+25mm; X5 Front 9"/Rear 10" +32mm); runtime contract (both-sources-required, pristine restore, group-id parsing); P8 lock-ins for all audited vehicles + no-suspension-data + legacy identifiers.
- **QA**: 134/134 tests pass (122 + 12 new); node --check OK; theme check 13 = baseline (calder-specs.liquid 0 errors; 1 pre-existing UnusedAssign warning verified at HEAD); git diff --check clean.

### [FILES] Batch 6
- Modified: sections/calder-specs.liquid, assets/calder-universal-pdp.js, assets/calder-product.css
- Created: docs/architecture/tests/calder-specs-exact.test.mjs

### [AGENT] Session Metadata
- Agent: opencode (build) — Model: z-ai/glm-5.3
- Next: Batch 7 (K1–K4 cart line properties + per-line confirmations + checkout gate) on APPROVED

---

## [2026-11-15 #7] — Batch 6 APPROVED; Batch 7 (K1–K4 cart) IMPLEMENTED, AWAITING QA

### [ACTIVITY] Session Mode
BUILD (combined 11-15 master prompt batches)

### [COMPLETED] What Was Done
- **Batch 6 (P7+P8): developer APPROVED unchanged.**
- **K1 (line properties)**: calder-universal-cta.js now snapshots the COMPLETE configuration into the /cart/add.js payload at add time (never a global last-selected value): Wheel Design, Diameter, Width (vehicle cf incl. staggered pairs), Center Finish, Barrel & Lip Finish, Hardware & Rivet Finish, Vehicle (display name), Bolt Pattern (resolved group prefix); blank values omitted, never invented. Underscore internals for integrations/K2: _configurator, _source, _design_code, _fitment_group, _config_tokens, _variant_id, _product_handle (both cart templates skip _-prefixed in display — verified). The previously dead FITMENT CONFIRMED badge is now live (Vehicle property). Quantities/prices/SKU/sections/preview untouched. NOTE: the developer-output panel payload preview still shows the pre-K1 shape (dev-only debug display; left unchanged).
- **K2 (per-line confirmations)**: main-cart-items.liquid + header-cart-line-item.liquid render a per-line "Confirm this configuration" block — one checkbox per DISPLAYED property (mirrors the display loop guard), keyed by item.key (identical SKUs w/ different properties confirm independently), gated to _configurator lines only (legacy products unaffected). New assets/calder-cart-confirm.js: all checkboxes across all Calder lines must be checked → gates button[name=checkout] (class + disabled attr) AND express/dynamic checkout wrappers (.calder-line-confirm-gate, same pointer-events technique as the theme's .shopify-payment-agree.disabled); MutationObservers on the cart.js swap containers (.js-contents-cart-items/buttons/subtotal) → every AJAX re-render recreates line markup = confirmations reset = invalidation by design; double-include boot guard; loads on cart page (main-cart-items) + all pages (header-cart). Existing prd-block-agreement + AgreementCheckbox + settings untouched and still apply in parallel (AND). CSS in calder-base.css.liquid (global — drawer styles on all pages).
- **K3 (honest bypass audit — reported, NOT claimed enforced)**: theme-side gates are CSS/attribute-based → devtools-removable; direct /checkout reachable; express wrappers pointer-events-gated only; sticky minicart snippet is empty (no button); IE form.submit fallback inert on disabled buttons. TRUE enforcement requires Checkout UI Extension / app-level validation (paid, needs client approval) — decision requested at this gate. No payment/checkout internals touched.
- **K4**: verified programmatically — the .card-total.bg-alt.calder-cart-summary opening structure is byte-identical to HEAD and ZERO diff lines touch protected markers (card-total/calder-cart-summary/prd-block-agreement/agreementCheckbox/shopify-payment-agree/calder-cart-trust/cart-errors/name="checkout").
- **Tests**: new calder-cart-confirm.test.mjs (15) + Batch 5 payload-contract test updated to the delivered K1 shape. 147/147 pass (134 + 13 net new); node --check OK; theme check 13 = baseline, changed cart files 0 offenses; git diff --check clean.

### [FILES] Batch 7
- Modified: assets/calder-universal-cta.js, sections/main-cart-items.liquid, snippets/header-cart.liquid, snippets/header-cart-line-item.liquid, assets/calder-base.css.liquid, docs/architecture/tests/calder-hardware-size-price.test.mjs
- Created: assets/calder-cart-confirm.js, docs/architecture/tests/calder-cart-confirm.test.mjs

### [AGENT] Session Metadata
- Agent: opencode (build) — Model: z-ai/glm-5.3
- Next: Batch 8 (G1 gallery entry → details page wiring) on APPROVED

---

## [2026-11-15 #8] — Batch 7 APPROVED (K3 theme-side gating accepted; Checkout UI Extension documented as future decision); Batch 8 (G1 gallery) IMPLEMENTED, AWAITING QA

### [ACTIVITY] Session Mode
BUILD (combined 11-15 master prompt batches)

### [COMPLETED] What Was Done
- **Batch 7 (K1–K4): developer APPROVED unchanged.**
- **Batch 8 (G1)**: details architecture confirmed pre-existing (page.gallery-build.json → calder-gallery-detail + metaobject.gallery_build.liquid route). Wheel-gallery metaobject entries no longer deep-link to the design PDP (Nov-2 Phase F behavior superseded by the 11-15 instruction) — every entry links to its OWN details page (build.system.url → /pages/gallery-build?build=HANDLE fallback), identical to the vehicle gallery. The product link now lives EXACTLY ONCE: the details page's "VIEW THIS CONFIGURATION" CTA (preserved untouched). The reported bug's root: legacy block wheel_build_DL76hM (wheel_model CLM-01) carried detail_url=shopify://products/calder-clm-01-wheel + empty gallery_handle — now gallery_handle="cadillac-escalade-m-01" (resolved from the authoritative content manifest: CLM-01 / design 201 / official), stale product URL cleared. Judgment call flagged at gate: 4 CLM-01 entries exist in the manifest (escalade-m-01 chosen — the M-01 flagship showcase; escalade-v-01 / silverado-red / tahoe-black are alternates). Vehicle gallery: 0 blocks, metaobject path already correct — no changes. No media/gallery imagery touched (test-enforced).
- **Tests** `calder-gallery-links.test.mjs` (8): details-route existence + CTA preservation; both galleries' link resolution (no /products/ deep links in entry loops; block path prefers gallery_handle); the legacy block handle cross-checked against the manifest (CLM-01/201/official); all manifest entries reference real registry designs; zero media git changes.
- **QA**: 155/155 tests pass (147 + 8 new); theme check 13 = baseline, changed gallery files 0 offenses; git diff --check clean.
- **Live-store note (unchanged blocker)**: gallery_build metaobjects still have ZERO entries — until the admin Phase A import runs (docs/gallery-audit/vehicle-content/06-import-procedure.md), the wired detail links land on the details page's empty state (accepted by developer: "Wire now → empty detail pages until entries exist").

### [FILES] Batch 8
- Modified: sections/calder-wheel-gallery.liquid, templates/page.wheel-gallery.json
- Created: docs/architecture/tests/calder-gallery-links.test.mjs

### [AGENT] Session Metadata
- Agent: opencode (build) — Model: z-ai/glm-5.3
- Next: Batch 9 (I1 inventory/SKU assessment — read-only report) on APPROVED

### [2026-11-15 #8b] — Batch 8 CHANGES round (live-QA 404) FIXED, RE-GATE
- **Developer live QA found**: /pages/wheel-gallery CLM-01 card → 404. **Root cause (live-verified via webfetch)**: the /pages/gallery-build PAGE was never created in Shopify admin — the theme template (page.gallery-build.json) exists, but a Shopify page template renders only when a published Page with handle 'gallery-build' exists. My Batch 8 wired links to the route without live-verifying the page existed.
- **Fix A (theme, shipped)**: both gallery sections now guard the query-param detail fallback with `pages['gallery-build'] != blank` (metaobject path + block path) — until the page exists, entries with no resolvable destination render as non-navigating cards (href '#'): never a 404, never a product-PDP fallback (G1 constraint). Once the page is created in admin, the details links activate automatically (render-time check, no further code change).
- **Fix B (ADMIN ACTION REQUIRED — 2 min)**: Online Store → Pages → Add page → Title "Gallery Build" (auto-handle 'gallery-build') → template picker → page.gallery-build → Visible/Published. Precondition: the tested theme contains templates/page.gallery-build.json (in repo since 11-01). This was a gap in the 11-01 launch checklist (it listed metaobject creation but not the details page).
- Tests: +1 guard test, 1 updated (156 total, all pass). Theme check baseline; changed gallery files 0 offenses; git diff --check clean.

### [2026-11-15 #8c] — Batch 8 revision 2 (developer-approved gallery model) IMPLEMENTED, RE-GATE
- **Approved model**: wheel gallery entries are wheel-centric (PDP-inline intake), pairing rule = design + bolt-pattern membership, create-one-first guidance, interim CLM-01 card INERT, data sheet drafted for review.
- **Theme changes**: (1) wheel_build block schema gains Center finish / Barrel & lip finish / Hardware & rivet finish / Wheel offset / Center bore intake settings (PDP vocabulary); (2) calder-gallery-detail related block REWRITTEN (previous rewrite had unbalanced Liquid nesting — caught by theme check LiquidHTMLSyntaxError, fixed with a programmatically tag-balance-verified rewrite): VEHICLES WITH THIS WHEEL = same design + vehicle's bolt_pattern ∈ wheel entry's bolt_pattern list (exact token match; fail-closed when the wheel entry is patterned and the vehicle entry is not; graceful design-only when the wheel entry is unpatterned); wheel mini now ALSO design-gated + mirrored pattern rule; related-link fallbacks carry the pages['gallery-build'] 404 guard; truthful empty notes + request.design_mode create-the-counterpart hints on BOTH sections (+.cg-mini-empty/.cg-mini-editor-note styles in calder-gallery-v2.css); (3) wheel details specs grid gains OFFSET + CENTER BORE rows (wheel-type gated, '—' fallback); (4) page.wheel-gallery.json block gallery_handle cleared → CLM-01 card INERT per decision (activates when the reviewed entry handle is set).
- **Docs**: docs/gallery-audit/wheel-content/{wheel-entry-data-sheet.json,README-wheel-entries.md} (six wheel-type entry drafts: registry-sourced design ids/series/construction/config defaults + export-verified bolt lists; wheel_offset/center_bore marked REVIEW with per-design fitment-group options; images SUPPLY per media policy; README has the 12-vehicle bolt_pattern backfill table + admin steps + pairing procedure); 06-import-procedure.md addendum (pairing rule + backfill + definition additions).
- **Admin prerequisites carried in the README**: add wheel_offset + center_bore definition fields; backfill the 12 vehicle entries' bolt_pattern (required for the match rule — the manifest never carried it).
- **QA**: 161/161 tests pass (155 + net 6 rev2 tests); theme check 13 = baseline (the intermediate nesting error fixed); git diff --check clean. Live verification this round: /pages/gallery-build now 200 (client created the page) — the "Gallery item not found" state was the correct empty-state until entries exist.

### [AGENT] Session Metadata (this entry)
- Agent: opencode (build) — Model: z-ai/glm-5.3
- Next: developer reviews the data sheet + fills REVIEW/SUPPLY fields; then Batch 9 (I1 read-only inventory/SKU assessment)

### [2026-11-15 #8d] — Batch 8 rev2 CHANGES round: Shopify upload Liquid syntax error FIXED, RE-GATE
- **Developer push rejected sections/calder-gallery-detail.liquid**: "Liquid syntax error (line 49): Expected end_of_string but found pipe in 'p | strip == cand_bp'" — Shopify's live parser FORBIDS filters inside {% if %} conditions; the local theme check parser (looser) passed it. My miss.
- **Fix (3 edits)**: pre-stripped comparison assigns — entry_bp_clean = entry_bp | strip (top); vehicle mini: cand_bp_clean + per-item p_clean, compare p_clean == cand_bp_clean; wheel mini: p_clean == entry_bp_clean. Semantics identical (exact membership, fail-closed, graceful fallback all preserved).
- **New regression test class**: "Shopify parser strictness: NO filters inside if/unless conditions" — sweeps ALL 14 session-changed Liquid files (regex {% if/unless ... |); zero tolerance; theme check cannot catch this class. Current sweep: CLEAN (no other file carries it — the developer's push of the other files stands; only the detail file needs re-upload).
- QA: 162/162 tests pass; theme check 13 = baseline; git diff --check clean.
- **Developer action: re-push sections/calder-gallery-detail.liquid only.**

### [2026-11-15 #8e] — Live gallery verification round 3: listings LIVE; native-route details gap found + FIXED
- **Live verification (webfetch)**: WHEEL gallery listing now renders the new metaobject wheel entry card (CLM-01 / SUV Wheel - Spun Forged / Gloss Black center · Gloss Black Lip · Chrome Bolts → /pages/gallery-build/clm-01-gloss-black) beside the inert static block ✓. VEHICLE gallery renders the Escalade entry card → /pages/gallery-build/cadillac-escalade-m-01 ✓. Definition recreation (type gallery_build) + web pages + gallery_type fixes all CONFIRMED WORKING.
- **Details pages: "Gallery item not found" on both native routes** — root cause: entries now link via system.url (native metaobject web-page route, /pages/gallery-build/<handle>) where NO ?build= query param exists; the detail section resolved entries ONLY from the query string → could not see the entry it was standing on.
- **Fix**: three-tier entry resolution in calder-gallery-detail.liquid — (1) ?build= query-param lookup; (2) NEW: native-route tier — when no handle and the Liquid `metaobject` global is present, entry = metaobject; (3) theme-editor fallback block. Covers all three routes with one section.
- Tests +1 (three-tier resolution), 163/163 pass; theme check 13 = baseline (detail file 0 errors); git diff --check clean.
- **Developer action**: push sections/calder-gallery-detail.liquid (the file their earlier push rejected — this push carries the syntax fix + rev2 pairing + the native-route tier together), then the two details pages render from their listing cards.

### [2026-11-15 #8f] — Root cause CONFIRMED in Shopify docs: shop.metaobjects is DEPRECATED; by-handle indexing fails live
- **Docs-verified (shopify.dev)**: `shop.metaobjects` is deprecated, replaced by the global `metaobjects` object; canonical by-handle lookup = `metaobjects['gallery_build'][handle]`. The deprecated object's `.values` iteration still works (listings rendered) but its by-handle indexing returned nil on the live storefront → "Gallery item not found" on BOTH details routes. This code path was never live-testable before today (zero entries existed).
- **Fix (all three gallery sections)**: tier-1 query-param lookup → `metaobjects['gallery_build'][handle]` (canonical); tier-2 native-route resolution keeps the template-scoped `metaobject` global PLUS a deterministic `request.path` handle-parse fallback (`/pages/gallery-build/<handle>` → last path segment → canonical lookup — bulletproof even if the global does not reach section scope); all `.values` loops (listings + related minis) migrated `shop.metaobjects.gallery_build.values` → `metaobjects.gallery_build.values`.
- **New regression class**: "ZERO usages of the deprecated shop.metaobjects object in any gallery file" — test-enforced.
- QA: 163/163 pass; theme check 13 = baseline; git diff --check clean.
- **Developer action**: re-push the three gallery files: sections/calder-gallery-detail.liquid, sections/calder-vehicle-gallery.liquid, sections/calder-wheel-gallery.liquid

### [2026-11-15 #8g] — Live re-verification: BOTH DETAILS PAGES FULLY LIVE; self-exclusion bug fixed
- **Live-verified after the canonical metaobjects migration**: wheel details page renders complete (breadcrumb, 10 slides, FINISH SHOWN, PDP CTA, full specs incl. OFFSET +25mm + CENTER BORE 78.1 + WEIGHT/LOAD); VEHICLES WITH THIS WHEEL **pulls the Escalade** (design CLM-01 + 6x139 ∈ 6x135, 6x139) — the pairing rule works end-to-end. Vehicle details page renders with vehicle-type spec rows (VEHICLE/TIRE BRAND/FITMENT NOTES, no offset/bore) and its wheel mini links back to the CLM-01 entry. The deprecated-API migration is confirmed working live.
- **Bug caught by the verification**: the current entry appeared in its OWN related sections (self-link) — the old exclusion compared against the query-string `handle`, which is EMPTY on the native web-page route. **Fix**: route-independent exclusion key `current_key = entry.system.handle | default: handle`, applied in both related loops. Tests +1 (route-independent self-exclusion), 165/165 pass; theme check baseline; git clean.
- Known behavior note (flagged at gate, not changed): the wheel page's OTHER CALDER WHEELS renders the truthful coming-soon note — the same-design + token-vs-list matching means other same-design wheel entries with multi-pattern lists won't pattern-match a multi-pattern current entry. Same-design gating on the wheel mini was the rev2 interpretation of "OTHER CALDER WHEELS" — developer may prefer any-design browsing there (one-line change when decided).
- **Developer action: re-push sections/calder-gallery-detail.liquid only.** Then the vehicle page's self-card disappears from its own VEHICLES WITH THIS WHEEL.

### [2026-11-15 #8h] — Wheel mini: browse-across-designs (client decision); multi-version support confirmed
- Client decisions: (1) a CLM-02 wheel entry must appear in the CLM-01 page's OTHER CALDER WHEELS — wheel mini on WHEEL pages now shows EVERY other wheel entry (no design gate; self-exclusion via current_key retained; multiple versions per design included up to the 5-card cap); vehicle pages keep the correlated design + pattern pairing rule. Empty note split by type ("More Calder wheels are coming soon." vs "More builds for this design are coming soon."). (2) Multiple versions per design/vehicle: CONFIRMED supported — unique handles per version; pairing matches by design+pattern so all versions surface.
- Tests updated: rev2 "wheel mini also design-gated" superseded by the rev3 browse-across-designs test (wheel-page no-design-gate + vehicle-page pairing retained + type-split empty notes). 166/166 pass; theme check 13 = baseline; git diff --check clean. Tag balance programmatically verified on the related block.
- Developer action: one more push of sections/calder-gallery-detail.liquid (carries the self-exclusion fix they already pushed + this wheel-mini change together), then final live verification.

---

## [2026-11-15 #9] — Batch 8 CLOSED (approved); Batch 9 (I1 inventory/SKU assessment) COMPLETE — read-only, AWAITING REVIEW

### [COMPLETED] I1 Assessment findings
- **SKU master (SUV Data Sheet revised 10-21-26.xlsx)**: 4 finish-combo sheets × 228 = **912 unique finished-wheel part numbers, zero duplicates**. Scheme decode verified: `CLB06|22|10|639|7825|GB11` = design|diameter|width|bolt|bore+offset-group|center+lip+bolt finishes. Design coverage: CLM01 132 · CLM02 180 · CLM03 108 · CLM05 132 · CLB06 180 · CLB07 180.
- **Live store reconciliation (products_export_1.csv)**: 864 live variant SKUs — **all 864 ⊆ the xlsx set** (live-only: 0). **48 xlsx-only PNs** (the CLM-01 +03mm/78.1 group etc.) exist in the master but were never imported to Shopify — import candidates ONLY (no action without separate approval).
- **Two part-number schemes = different entity classes, no collision**: finished SKUs (client CLM05… scheme, Shopify + xlsx) vs components (QB `CAL-<design>-{C,B,D}-<fin>` + `CAL-H-<fin>` scheme, QuickBooks/demo). The finished→component mapping is derived in the resolver's code tables (BK/BKUTI/SU centers, BK/POLISH barrels, 20 bolts/wheel — BOLTS_PER_WHEEL=20 consistent dataset↔CTA).
- **Inventory ownership today**: finished = Shopify variant inventory (qty 100/variant, tracker shopify, deny — consumed by the resolver native mode); components = QB Enterprise Desktop intended authority, currently the demo stand-in (calder-demo-inventory.js → window.CALDER_QUICKBOOKS_INVENTORY; production = n8n polls QB → publishes identical shape — code never changes on cutover); Quickbase production orders / n8n workflow JSON / ShipStation: **no exports exist in the repo** — contracts documented in docs only.
- **Low-stock threshold**: schema setting `calder_min_component_qty` (default 10, admin-configurable, read via data-calder-min-qty) — NOT hardcoded ✓ compliant.
- **Data notes**: demo dataset design '204' = deliberate CLM-05 low-stock demo row (documented 11-02 discrepancy, intentionally kept); demo blank sizes 18–26 incl. odd 19/21/23 = demo filler (real catalog 22/24/26); CLB06/07 legacy codes preserved via aliases everywhere.
- **Automated coverage verified**: CTA availability fixtures (AVAILABLE/SOLD_OUT/NO_STOCK/ERROR/native) + cart payload contract tests all green in the 166-test suite.
- **I2 BLOCKED** — no imports drafted; required files requested at the gate.

### [AGENT] Session Metadata
- Agent: opencode (build) — Model: z-ai/glm-5.3
- Batch 9 = read-only: zero file changes. Next: developer approves the report / supplies I2 files → Batch 10 (final cross-component regression + documentation).

---

## [2026-11-15 #10] — Batch 10 (final regression + deliverables) COMPLETE — FINAL GATE

### [COMPLETED]
- **Local battery**: 166/166 tests (8 suites, 97 new this engagement); node --check × 7 JS files OK; theme check 13 = baseline with 0 offenses in changed files; git diff --check clean; **0 media files** in the 32-file change set (+1278/−105 vs backup 7556dab).
- **Developer Theme Editor sync detected**: page.wheel-gallery.json now Shopify-auto-generated — the developer REMOVED the static wheel_build block (the duplicate/inert card is gone; live-verified: wheel gallery shows exactly ONE metaobject CLM-01 card). Obsolete inert-block test replaced with a rev4 removed-block test; all batch markers verified intact after the sync (spot-checked C1/C2/K1/P7/G1 markers).
- **Live smoke**: galleries + details verified (single card, pairing, specs); collection/PDP fetches rate-limited (429) — disclosed NOT RUN this round, evidenced by the developer's per-batch manual QA.
- **Final deliverables report written**: docs/design/site-updates_11-15-2026/BATCH-REGRESSION-REPORT_2026-11-15.md — all 10 required deliverables (reconciliation matrix w/ superseded instructions; batch statuses; file diffs; QA evidence w/ not-runs identified; CSS/Git preservation; media report; inventory/fitment discovery + import readiness; checkout bypass assessment; deferred features; outstanding decisions + deployment readiness).
- **Awaiting**: final developer QA approval of the whole engagement.

### [AGENT] Session Metadata
- Agent: opencode (build) — Model: z-ai/glm-5.3
- Engagement state: Batches 1–10 executed under the gated protocol with 4 CHANGES rounds; 427+ test assertions guarding the delivered behavior; backup tag/branch on GitHub.

---

## [2026-11-15 #11] — ENGAGEMENT CLOSED: final developer QA APPROVED

- **All 10 batches of the combined 11-15 master prompt approved.** 166/166 regression tests; theme check baseline; zero media changes; 32-file change set (+1278/−105) delivered in the working tree (uncommitted per the no-auto-commit rule).
- Final report: docs/design/site-updates_11-15-2026/BATCH-REGRESSION-REPORT_2026-11-15.md (all 10 deliverables incl. outstanding admin decisions + deployment readiness).
- **Not done by design (awaiting developer request):** committing the approved change set + pushing to GitHub; the admin data tasks (I2 files, S&D filter, SKU imports, entry content); the real-device QA pass; Checkout UI Extension decision.
- Standing protections: backup tag/branch `backup/pre-11-15-updates-2026-11-15` on GitHub (commit 7556dab); 8 test suites (166 assertions) guarding the delivered behavior; no agent live-push rule observed throughout.

### [AGENT] Session Metadata
- Agent: opencode (build) — Model: z-ai/glm-5.3
- Engagement complete. Next session should start from this entry + the final report's §10 checklist.

---

## [2026-11-16] — Client meeting feedback implementation: collection filters, product card v3, PDP updates, cart restructure, Universal Wheel Builder

### [ACTIVITY] Session Mode
BUILD (client meeting feedback — no batch protocol; developer asked for implementation + regression)

### [COMPLETED] What Was Done
**Collection page:**
- "Clear Filters" button renamed to "Clear Vehicle" (facets.liquid + popup)
- Diameter filter → "SIZE" title with combined values (22x10, 24x10, 26x10), standard checkbox design (not pill/tag list)
- Combined bolt pattern values (containing commas, e.g. "6x135, 6x139") hidden from the filter options
- Bolts filter (Barrel & Lip - Hardware) deduped from 4 combined lip-variant values to exactly 2 (Black Bolts, Chrome Bolts) — the bolt fragment extracted, dedup tracked in facets.liquid's forloop scope (render-isolation-safe)

**Calder Product Card:**
- "Available Sizes" section replaced with "Part#" (.calder-card__part_no) pulling the variant SKU (the universal part number)
- "Shown Configuration" heading → "Wheel Description"
- "Diameter" config cell → "Size" with combined diameter×width value (22x10) — width parsed from the variant SKU position 7-8, fallback to the catalog-wide x10
- Added 3rd config row: Offset (from handle -p<NN>- pattern) + Center Bore (from center_bore metafield, apostrophe cleaned, handle fallback)

**Standard PDP:**
- Vehicle-required message now renders red and prominent (font-weight 600, larger size) via [data-calder-uc-state="VEHICLE_REQUIRED"] CSS
- Design nav hidden on standard PDP (data-show-design-nav="false" + CSS display:none — snippet never deleted, just hidden; the Universal Wheel Builder overrides this)

**Cart (restructured per client):**
- Separate .calder-line-confirm block REMOVED; checkboxes now render INLINE inside each .cart-table-product-option row (both cart page + drawer)
- "Confirm Wheel Specs" heading above the option list on Calder lines
- Green "FITMENT CONFIRMED" badge appears at the end of each line's options when ALL that line's checkboxes are checked (data-calder-line-complete, toggled by calder-cart-confirm.js)
- calder-cart-confirm.js rewritten: per-line completion detection reveals the badge; the overall checkout gate (all lines → checkout enabled) unchanged

**Universal Wheel Builder:**
- NEW section `calder-universal-builder.liquid` + template `page.universal-builder.json`
- Renders the universal configurator controls + gallery preview for a selected design product (product picker in section settings)
- Design nav PROMINENT (overrides the PDP's hiding CSS; styled larger with a boxed container)
- "Choose This Design" CTA navigates to the design product page with the current config as URL params
- Free exploration: no vehicle requirement, no purchase restrictions — pure design browsing
- Does NOT replace the existing product page PDP configurator or the BYW page

**Files changed:** facets.liquid, facets-list.liquid, facets-mobile-popup-container.liquid, calder-product-card.liquid, calder-product-card.css, calder-universal-controls.css, calder-product.liquid, calder-base.css.liquid, calder-cart-confirm.js, main-cart-items.liquid, header-cart-line-item.liquid + NEW calder-universal-builder.liquid, page.universal-builder.json

**Test updates:** calder-cart-confirm.test.mjs (2 tests updated for inline structure), calder-collection-reset.test.mjs (Clear Vehicle label). 166/166 pass.

### [KNOWN NOTES]
- Bolts filter dedup: first occurrence wins (Gloss Black Lip variant's URL). Checking "Black Bolts" filters to that specific combined value — shoppers wanting the Polished Lip variant need the Size/Center Finish filters to narrow. An S&D-side hardware-only metafield filter would be the cleaner long-term fix.
- The builder section's JS is minimal (inline click handler for the CTA); the design nav links on the builder navigate to each design's PRODUCT PAGE (existing behavior) — switching designs within the builder requires navigating back. A future enhancement could re-seed the builder in-place via URL param.

### [AGENT] Session Metadata
- opencode (build) — Model: z-ai/glm-5.3
- Developer's pulled-file edits (wheel-gallery.json + 3 CSS files) verified preserved.

---

## [2026-11-17] — Cart Item Card Redesign: Phase 1 Audit APPROVED; Phase 2 (card + header) IMPLEMENTED, AWAITING QA

### [ACTIVITY] Session Mode
BUILD (phased protocol — approval gate per phase)

### [DECISION] Developer Clarifications (locked)
- Edit Specs = link to product page with the line's config as URL params (calder-pdp-state deep-link pattern, incl. pcd) — lands in Phase 5
- Drawer stays COMPACT (dedup only — legacy K2 block removal, keep inline confirms); no full card design in drawer
- Page shell (heading/progress/sidebar) stays as-is; white/light background
- Checkbox color = spec blue #0869DF
- No properties displayed beyond the 8 K1 fields (+ options loop skipped on configurator lines — resolves the Diameter/Center-Finish/Barrel duplicate-row problem found in audit)

### [COMPLETED] Phase 1 — Audit (approved unchanged)
Key findings recorded: two separate line-item surfaces (cart page main-cart-items.liquid vs drawer header-cart-line-item.liquid, NOT shared markup); K1/K2 confirmation contract (checkboxes per displayed row → checkout gate on all routes; structural invalidation via Section Rendering + MutationObservers; agreement checkbox AND-gate); drawer carries BOTH inline + legacy K2 block = duplicate checkboxes (pre-existing); drawer per-line badge dead (closest() selector '.header-cart-line-item' matches nothing — actual root .minicart-prd); cart page renders TWO possible FITMENT CONFIRMED elements; options_with_values duplicates K1 properties (Option3 'Barrel & Lip Finish' holds bolt value); section-render contract (.js-contents-* IDs, #CartItem-N, [data-node-*], updates[]/data-index, cart-remove-button); dealer-cart-moq.liquid is ORPHANED (rendered nowhere); no dealer pricing logic in cart prices; active settings (checkout_agreement on+default-checked, product_card_cover=true, inventory max on).

### [COMPLETED] Phase 2 — Main Card + Product Header (cart page ONLY)
- main-cart-items.liquid line restructured into card skeleton: `.calder-cart-item__main` (grid minmax(280px,34%) | 1fr) > image (`calder-cart-item__image`, square aspect-ratio 1, #F3F6F9 tile, 18px radius, object-fit contain) + `.calder-cart-item__details` > header (title clamp(30,3.4vw,48)/700 navy #0E2A3E | unit price clamp(26,2.6vw,38)/700 + "Per Wheel" label) + `.calder-cart-item__specs` (existing confirm/options markup verbatim) ; `.calder-cart-item__actions` row skeleton (left: remove icon-button; right: qty + line total; discount full-width via :has(li) guard); `.cart-table-prd-content-wrap` wrapper REMOVED from DOM. ALL functional hooks preserved verbatim (verified: #CartItem-N, data-node-desktop/mobile, updates[]+data-index, cart-remove-button, #Line-item-error-N, data-calder-line-confirm/complete, .calder-cart-item root for is-updating + confirm-JS closest()).
- cart-page.css: new appended layer "CALDER CART ITEM — APPROVED CARD REDESIGN (2026-11-17, Phase 2)" — component tokens --cwci-* (navy #0E2A3E, heading #081B32, secondary #687384, image-bg #F3F6F9, divider #E1E5EB, checkbox #0869DF, fitment #15803D/#EDF9EE, qty-border #D6DCE4 — consumed in later phases); .cart-table → transparent stack; .calder-cart-item → white card (24px radius, 0 8px 28px rgba(14,42,62,.08), padding 32px !important — !important ONLY to beat the 11-15/16 layers' own !important paddings); error region repositioned to normal flow. ZERO deletions of prior layers (all overridden by equal-specificity later source order).
- NOT touched: drawer, sidebar/summary CSS, page shell, quantity snippet, cart.js, K1 payload, all 11-15/11-16 work.

### [VERIFY] QA This Phase
- Liquid: if/endif 30/30, div 83/83, 0 filters-in-condition (Shopify strict parser rule); git diff --check clean; theme check 13 errors = baseline, main-cart-items.liquid 0 offenses; tests 165/166 — the 1 failure (calder-pdp-e2e) is PRE-EXISTING: asserts 'Universal Part#:' but calder-product.liquid:495 renders 'Part Number:' (11-16 label rename left the assertion stale; test reads neither changed file; NOT fixed here per no-unrelated-modification rule — flagged for developer).
- FLAGGED for Phase 6 (pre-existing, untouched): at ≤575px moveQtyNode moves qty DOM into .cart-table-mobile which is display:none!important → mobile cart qty selector likely invisible on phones (needs deliberate mobile-layout fix in Phase 6).

### [BLOCKED] What's Waiting
- Developer Phase 2 QC gate: card look, image tile, title/price scale, PER WHEEL, spacing, cart functionality (qty change, remove, totals, confirm gate) on dev theme.
- No agent pushes (client rule) — client pushes: sections/main-cart-items.liquid + assets/cart-page.css

### [FILES] Modified This Session (Phase 2)
- docs/design/Shopify Themes/Working Theme-via-CLI/sections/main-cart-items.liquid
- docs/design/Shopify Themes/Working Theme-via-CLI/assets/cart-page.css
- docs/0 - DO NOT DELETE/llm-continuity.md (this entry)

### [AGENT] Session Metadata
- opencode (build) — Model: z-ai/glm-5.3
- Next: Phase 3 (specification checklist grid + checkbox styling + drawer dedup) on APPROVED

---

## [2026-11-17 #2] — Cart Item Card Redesign: Phase 2 APPROVED; Phase 3 (spec checklist) IMPLEMENTED, AWAITING QA

### [ACTIVITY] Session Mode
BUILD (phased protocol)

### [COMPLETED] Phase 3 — Specification Checklist
- **Cart page (main-cart-items.liquid)**: configurator lines now render the approved 8-field spec grid — `<ul class="calder-cart-item__spec-grid">` with fixed display order (Diameter | Width | Center Finish | Barrel & Lip Finish | Wheel Design | Hardware & Rivet Finish | Vehicle | Bolt Pattern) read from K1 properties via `item.properties[spec_label]`; blank values omit the cell (never invented); each cell = label-wrapped REAL checkbox ([data-calder-line-confirm] + data-line) + stacked label (15px/600 uppercase #687384) / value (clamp 18→22px/700 navy); NO icons (checkbox is the only icon-like element). Variant-options loop no longer renders on configurator lines (fixes the Diameter/Center/Barrel duplicate-row problem); the original options+properties `<dl>` loop is kept VERBATIM in the else-branch for non-configurator lines (guards intact).
- **Drawer dedup (header-cart-line-item.liquid)**: legacy K2 block (`data-calder-line-confirm-block` "Confirm this configuration") REMOVED — inline per-option checkboxes are the drawer's only confirmation surface; drawer stays compact (no card design there). Per-line completion badge kept.
- **calder-cart-confirm.js**: closest() chain gains `.minicart-prd` (drawer line root — the per-line badge was DEAD in the drawer before: .header-cart-line-item matched nothing). Gate logic otherwise untouched.
- **cart-page.css**: new "Phase 3: SPECIFICATION CHECKLIST" section — heading clamp(18→23px)/700/uppercase/#687384/ls .04em, 28px above + 26px below; grid 2×minmax(0,1fr); row dividers (border-bottom #E1E5EB, 17px pad) + vertical divider (nth-child borders, 28px side padding); checkbox custom-rendered real input: 36×36, radius 7px, appearance:none, checked bg var(--cwci-checkbox) #0869DF + SVG white checkmark, focus-visible ring, hover border; 18px checkbox-to-text gap; value overflow-wrap anywhere (long vehicle names).
- **calder-base.css.liquid**: obsolete legacy-block styles REMOVED after grep-verified orphaning (.calder-line-confirm container, .calder-line-confirm__item rows + its input rule); __heading / .calder-option-confirm inline rules / .calder-spec-confirm / .calder-line-confirm-gate KEPT (drawer + heading still use them).

### [VERIFY] QA This Phase
- Tests: calder-cart-confirm.test.mjs rewritten to the Phase 3 contract — 17/17 pass (4 new tests: spec-grid markup + fixed order + no options dup; drawer dedup; drawer badge root; Phase 3 CSS layer). Suite total 169/170 — the 1 failure = the PRE-EXISTING calder-pdp-e2e 'Universal Part#:' label assertion (documented Phase 2, unrelated).
- Liquid balance OK (div/ul/li/label/dl all 0 delta; no filters inside if/unless — Shopify strict parser rule); git diff --check clean; node --check OK; theme check 13 errors = baseline, 0 offenses in all 5 changed files.

### [BLOCKED] What's Waiting
- Developer Phase 3 QC gate (below). No agent pushes — client pushes: sections/main-cart-items.liquid, snippets/header-cart-line-item.liquid, assets/cart-page.css, assets/calder-base.css.liquid, assets/calder-cart-confirm.js

### [FILES] Modified This Session (Phase 3)
- docs/design/Shopify Themes/Working Theme-via-CLI/sections/main-cart-items.liquid
- docs/design/Shopify Themes/Working Theme-via-CLI/snippets/header-cart-line-item.liquid
- docs/design/Shopify Themes/Working Theme-via-CLI/assets/cart-page.css
- docs/design/Shopify Themes/Working Theme-via-CLI/assets/calder-base.css.liquid
- docs/design/Shopify Themes/Working Theme-via-CLI/assets/calder-cart-confirm.js
- docs/architecture/tests/calder-cart-confirm.test.mjs (contract updated)
- docs/0 - DO NOT DELETE/llm-continuity.md (this entry)

### [AGENT] Session Metadata
- opencode (build) — Model: z-ai/glm-5.3
- Next: Phase 4 (fitment banner consolidation) on APPROVED

---

## [2026-11-17 #3] — Phase 3 CHANGES round (developer corrections) IMPLEMENTED, RE-GATE

### [COMPLETED] Developer corrections applied to the cart-page spec grid
1. **"Size" cell replaces Diameter + Width**: combined value "22x10" — `item.properties['Diameter'] | remove: '"'` × `item.properties['Width'] | remove: '"'` joined with 'x'; staggered Width ("Front 9 / Rear 10") renders truthfully as 22xFront 9 / Rear 10; one/both-blank → cell omitted (or single value shown alone if only one exists).
2. **Wheel Design excluded from display** (not a required spec; still stored on the line for production — K1 payload untouched).
3. **"Lip Finish"** = display label for stored `Barrel & Lip Finish`; **"Bolts"** = display label for stored `Hardware & Rivet Finish` (display-only mapping; stored keys unchanged).
- Grid now = 6 cells fixed order: Size | Center Finish / Lip Finish | Bolts / Vehicle | Bolt Pattern (3 rows × 2 cols). Explicit cells (no variable-indexed arrays — Shopify strict-parser safety).
- Drawer untouched (locked decision: compact, raw property display); K1 payload untouched.

### [VERIFY] QA
- Test updated to the corrected contract (order assertions, Size derivation, display-label mapping, Wheel Design exclusion, no options dup): calder-cart-confirm.test.mjs 17/17; suite 169/170 (1 = pre-existing e2e 'Universal Part#:' label failure, unrelated); Liquid balance OK; 0 filters-in-if; git diff --check clean; theme check 13 = baseline, 0 offenses in main-cart-items.liquid.

### [FILES] Modified (this round)
- sections/main-cart-items.liquid, docs/architecture/tests/calder-cart-confirm.test.mjs, llm-continuity.md

### [AGENT] Session Metadata
- opencode (build) — Model: z-ai/glm-5.3
- Re-gate: developer QC on the corrected 6-cell grid; then Phase 4 (fitment banner) on APPROVED

---

## [2026-11-17 #4] — Phase 3 round 2: "still missing Lip Finish and Bolts" — ROOT CAUSE + FIX, RE-GATE

### [ROOT CAUSE] The line under QA was added via the BYW configurator
`configurator-app.js` (Build-Your-Wheel add path) writes `_configurator: 'true'` but stores its config as UNDERSCORE internals only (`_diameter`, `_center_finish`, `_barrel_finish`, `_hardware_finish`, `_design_code`, `_variant_id`, `_product_handle`) + ONE visible property (`Hardware & Rivet Finish`). It never writes the visible `Barrel & Lip Finish`/`Diameter`/`Center Finish` keys — so the Phase 3 grid (reading visible keys only) correctly omitted those cells. The universal CTA (K1) path writes all 8 visible keys — grid was complete on those lines. Add-path inventory verified: universal-CTA (all 8 visible), BYW (1 visible + internals), standard PDP form (Hardware only, no _configurator → no grid), dealer quick-order (no _configurator).

### [FIX] Display-only underscore fallbacks in the grid (main-cart-items.liquid)
- Size: `Diameter` → fallback `_diameter` (| remove '"'); Width has no internal source (BYW collects none) — Size renders diameter alone on BYW lines, `22x10` on universal lines
- Center Finish: `Center Finish` → fallback `_center_finish`
- Lip Finish: `Barrel & Lip Finish` → fallback `_barrel_finish`
- Bolts: `Hardware & Rivet Finish` → fallback `_hardware_finish`
- Vehicle: `Vehicle` → fallback `Fitment Vehicle` (no BYW source — omits truthfully)
- Bolt Pattern: `Bolt Pattern` → fallback `_fitment_group` split '-' first
- Stored values NEVER modified; K1 lines render identically (visible keys win). BYW lines now confirm Size/Center/Lip/Bolts; Vehicle/Bolt Pattern omit truthfully (BYW collects neither).

### [RECOMMENDED FOLLOW-UP — needs developer approval, NOT implemented]
configurator-app.js's add payload could write the full visible K1 property set (Diameter/Center Finish/Barrel & Lip Finish + Vehicle/Bolt Pattern when a vehicle is active on BYW) so future BYW lines carry complete display data at the source. Left untouched here (configurator add-path = new behavior; the display fallback covers existing + future lines without touching it).

### [VERIFY] QA
- calder-cart-confirm.test.mjs updated to the fallback contract: 17/17; suite 169/170 (1 = pre-existing e2e label failure); balance OK; 0 filters-in-if; git diff --check clean; theme check 13 = baseline, 0 offenses in main-cart-items.liquid.

### [FILES] Modified (this round)
- sections/main-cart-items.liquid, docs/architecture/tests/calder-cart-confirm.test.mjs, llm-continuity.md

### [AGENT] Session Metadata
- opencode (build) — Model: z-ai/glm-5.3
- Re-gate: developer re-QC (esp. a BYW-added line vs a universal-PDP-added line); then Phase 4 on APPROVED

---

## [2026-11-17 #5] — Phase 3 round 3: Lip/Bolts source CASCADE + Vehicle full-width row, RE-GATE

### [COMPLETED] Developer re-verify feedback implemented
1. **Lip Finish / Bolts source cascade** (their QA line showed only Size/Center/Vehicle/Bolt Pattern — a line added under a mixed/stale live file set: working-tree CTA keys are byte-identical to the grid lookups (hex-verified), and the CTA guarantees non-blank barrel/hardware on full-K1 lines — so the line predates a complete push). Display derivation now, in order: (1) K1 visible property, (2) BYW underscore internal, (3) **_config_tokens JSON parse** (guaranteed on every universal add; token → registry label: gloss-black→Gloss Black Lip, polished→Polished Lip, chrome→Chrome Bolts, black→Black Bolts), (4) key-scan of the line's properties (contains 'Lip' / 'Rivet' / == 'Bolts' / == 'Bolt Finish'; never 'Bolt Pattern'), (5) Bolts last resort: variant Option3 value ('Barrel & Lip Finish' or 'Barrel & Lip - Hardware' named options — the fixed hardware value per Batch 3). Blank after the whole cascade → cell omits truthfully.
2. **Vehicle full-width row** (names vary in length — would distort a shared column): `calder-cart-item__spec--wide` (grid-column 1/-1); **Bolt Pattern also full-width** (keeps row dividers clean — a lone half-width cell would stop the divider mid-row). Divider strategy moved from nth-child to explicit `--lead`/`--trail`/`--wide` modifier classes (full-width rows break positional pairing).
3. Developer confirmed the FITMENT direction for Phase 4: `calder-cart-fitment calder-all-confirmed` ([data-calder-line-complete]) is the intended element; the following vehicle `calder-cart-fitment` render is redundant (removal lands in Phase 4).

### [DIAGNOSIS PASSED TO DEVELOPER]
Their line's property set (Diameter/Center/Vehicle/Bolt Pattern visible, NO barrel/hardware in visible or underscore form) cannot be produced by the current working-tree CTA (which always writes both, non-blank) — it was added when the live/dev theme ran an older calder-universal-cta.js or calder-pdp-state.js mix. RECOMMENDED: re-push calder-universal-cta.js + calder-pdp-state.js + calder-config-resolver.js to the dev theme so future adds carry the full visible set; the cascade covers existing lines regardless. (Live-store inspection was rate-limited (429) — CDN theme-asset URL 404s without a version hash.)

### [VERIFY] QA
- calder-cart-confirm.test.mjs: 17/17 (cascade assertions incl. _config_tokens parse, key-scan, variant-option fallback, wide-cell markup); suite 169/170 (1 = pre-existing e2e label failure); balance OK; 0 filters-in-if; git diff --check clean; theme check 13 = baseline, 0 offenses in main-cart-items.liquid.

### [FILES] Modified (this round)
- sections/main-cart-items.liquid, assets/cart-page.css, docs/architecture/tests/calder-cart-confirm.test.mjs, llm-continuity.md

### [AGENT] Session Metadata
- opencode (build) — Model: z-ai/glm-5.3
- Re-gate: developer re-QC on the SAME line (Lip/Bolts should now derive from _config_tokens); then Phase 4 (fitment banner: keep data-calder-line-complete, remove redundant vehicle badge, banner styling) on APPROVED

---

## [2026-11-17 #6] — Phase 4: FITMENT BANNER CONSOLIDATION IMPLEMENTED, AWAITING QA

### [COMPLETED] Phase 4
- **main-cart-items.liquid**: the separate unconditional vehicle badge (`<p class="calder-cart-fitment">` + strong/small) REMOVED — exactly ONE fitment element per line remains: the `[data-calder-line-complete]` badge, now the approved banner markup — 48px-circular-icon span (`calder-cart-fitment__icon`, ✓ white) + text span (`calder-cart-item__fitment-text`: "Fitment Confirmed" heading + vehicle detail `<small>` sourced `Vehicle | default: Fitment Vehicle`; blank vehicle omits the small). Same reveal logic: calder-cart-confirm.js un-hides when ALL the line's checkboxes are checked. Drawer verified: only the one badge already (no duplicate there — compact styling kept).
- **cart-page.css**: "Phase 4: FITMENT CONFIRMATION BANNER" layer — `#EDF9EE` bg (`--cwci-fitment-bg`), `#15803D` green (`--cwci-fitment`), 14px radius, 18px/24px padding, 18px icon gap, 48px circle icon, heading clamp(18→24px)/700/uppercase/.04em, vehicle 16px/400 ink. [hidden] display:none guard. Specificity verified: every new selector (0,4,0)/(0,5,0) beats every old `calder-cart-fitment` rule (0,3,x) — old layers left in place (dead but harmless). text-decoration:none guard on the strong (old layers styled strong).
- **JS untouched** — the badge/`data-calder-line-complete` contract was already correct.

### [VERIFY] QA
- calder-cart-confirm.test.mjs: 19/19 (+2 Phase 4 tests: single-badge markup + banner CSS + drawer stays compact); suite 171/172 (1 = pre-existing e2e label failure); balance OK; 0 filters-in-if; git diff --check clean; theme check 13 = baseline, 0 offenses in main-cart-items.liquid.

### [FILES] Modified (Phase 4)
- sections/main-cart-items.liquid, assets/cart-page.css, docs/architecture/tests/calder-cart-confirm.test.mjs, llm-continuity.md

### [AGENT] Session Metadata
- opencode (build) — Model: z-ai/glm-5.3
- Next: Phase 5 (Edit Specs link via calder-pdp-state deep-link w/ pcd, Remove/qty/total action-row styling) on APPROVED

---

## [2026-11-17 #7] — Phase 4 APPROVED; Phase 5 (bottom action row) IMPLEMENTED, AWAITING QA

### [COMPLETED] Phase 5 — Bottom Action Row (main-cart-items.liquid + cart-page.css)
1. **Edit Specs** (configurator lines ONLY — gated on is_calder_line): deep-link to `item.url` + the line's OWN config as calder-pdp-state URL params (`diameter/center/barrel/hardware` tokens + `&pcd=`). Tokens from K1 `_config_tokens` (JSON parse via split); BYW-era fallback to underscore internals with label→token mapping (diameter strip '"'s; center downcase/' '-→'-' + black-tint→black-titanium alias; barrel contains Polished→polished else gloss-black; hardware contains Chrome→chrome else black — same vocabulary as calder-finish-tokens.liquid); pcd from `_fitment_group` split '-' first (fallback `Bolt Pattern` property), downcased for the CTA's normalization. Blank → param OMITTED (never invented); all blank → plain product URL. **Separator-safe href**: `{% if item.url contains '?' %}&{% else %}?{% endif %}` (item.url may carry a query). Pencil inline SVG + 17px/600 navy label.
2. **Remove**: theme `cart-remove-button` element + `item.url_to_remove` + data-index + aria-label preserved verbatim; + text label `<span>Remove</span>`; reskinned from icon-circle to text button (44px min-height).
3. **Quantity selector**: CSS-ONLY reskin (Lumia quantity-input DOM + handlers untouched) — 180×54, 1px #D6DCE4 (--cwci-qty-border), 12px radius, white bg, input flex-centered 18px/600 navy, buttons 44px+ wide / 52px+ tall with #D6DCE4 separators, native spinner removed.
4. **Item Total**: new `calder-cart-item__total` wrapper — "Item Total" 15px/600 uppercase label + the preserved `main-cart-item-component-final-price` snippet; amount (0,6,0) override → clamp(24→30px)/700 navy; compare-at 15px/600 secondary.
5. **SPECIFICITY FIX discovered during Phase 5**: the fidelity layer's unit-price rule `.cart-table-prd-price .prd-price .prd-price-regular` (0,5,0) was silently beating my Phase 2 header rule (0,4,0) → unit price rendered 18px instead of the approved clamp(26→38px). Fixed with (0,6,0) selectors scoped to `.calder-cart-item__header .calder-cart-item__unit-price` — flagged to developer to re-verify price scale from Phase 2.

### [VERIFY] QA This Phase
- calder-cart-confirm.test.mjs: 22/22 (+3 Phase 5 tests: edit deep-link contract incl. token sources/pcd fallbacks/separator guard/gating, remove contract + label, total wrapper + qty CSS + specificity fix); suite 174/175 (1 = pre-existing e2e label failure); Liquid balance OK (a/svg too); 0 filters-in-if; git diff --check clean; theme check 13 = baseline, 0 offenses in main-cart-items.liquid.
- Carried flag (pre-existing, Phase 6): moveQtyNode moves qty into `.cart-table-mobile` (display:none!important) at ≤575px — mobile qty visibility deliberately deferred to Phase 6.

### [FILES] Modified (Phase 5)
- sections/main-cart-items.liquid, assets/cart-page.css, docs/architecture/tests/calder-cart-confirm.test.mjs, llm-continuity.md

### [AGENT] Session Metadata
- opencode (build) — Model: z-ai/glm-5.3
- Next: Phase 6 (responsive: tablet + mobile layout incl. the flagged mobile qty fix) on APPROVED

---

## [2026-11-17 #8] — SPACING REFINEMENT BRIEF: Phase 1 (diagnosis) APPROVED w/ locked decisions; Phase 2 (container/card/columns) IMPLEMENTED, AWAITING QA

### [DECISION] Developer-locked constraints
- Cart-section width STAYS 1178px (cart.json/theme-editor untouched)
- ORDER SUMMARY split 1.6fr/1fr STAYS as-is
→ All refinement happens WITHIN the items column (~669px outer).

### [COMPLETED] Refinement Phase 1 — Diagnosis (approved)
Root-cause chain measured from source: 1178 container → 1.6/1fr split → items col ≈711px → fidelity .cart-table side padding 20px + card 32px → inner ≈605px → image min 280px OVERRIDING the 34% intent (46% image) → details ≈293px → spec text ≈64px/cell. Padding increases alone would worsen (brief's warning confirmed). Full 8-row diagnosis table delivered.

### [COMPLETED] Refinement Phase 2 — Container + Card + Main Columns (cart-page.css refinement layer appended)
1. `.calder-cart-layout .cart-table { padding: 0 }` — the fidelity layer's 0-20px side padding (remnant of the retired bordered-table look) absorbed into the card → +40px content width.
2. Card padding 32px → **36px 40px !important** (edited IN PLACE in the Phase 2 layer rule — appended overrides can't beat an earlier !important; no duplicate rules).
3. `__main` grid → **minmax(240px, 32%) | minmax(0,1fr), column-gap 36px** (edited via later-source override): image min 240px (was 280) + gap 36 → details ≈355px (was 293) → spec text ≈+60px/cell after the fidelity-layer sweep. Image square/18px-radius/contain unchanged; % ceiling keeps proportion on wide viewports.
4. `__header { margin-bottom: 32px }` per spec §3.5.
Net: card inner ≈631px (was 607), details ≈355px (was 293) — spec grid headroom for refinement Phase 3. Container/split/summary untouched per locked decisions.

### [VERIFY] QA
- Suite 174/175 (1 = pre-existing e2e label failure); git diff --check clean; theme check 13 = baseline, 0 offenses in cart-page.css; no duplicate card rules (single source, edited in place).

### [FILES] Modified (refinement Phase 2)
- assets/cart-page.css (refinement layer + in-place card edit), llm-continuity.md

### [AGENT] Session Metadata
- opencode (build) — Model: z-ai/glm-5.3
- Next: refinement Phase 3 (spec grid spacing/typography: column-gap 28px real, cell hpad 12–18/vpad 20–22, checkbox 34px flex-shrink:0, label 13–15, value 19–21/1.4) on APPROVED

---

## [2026-11-17 #9] — Refinement Phase 2 CHANGES round: DESKTOP TYPOGRAPHY REDUCTION, RE-GATE

### [COMPLETED] Developer feedback: "font sizes are oversized on the desktop"
All 14 cart-item typography rules edited IN PLACE (no appended duplicates) — scaled to the real ~355px details column instead of the mockup's full-page assumptions:
- Title 48px → **clamp(22px, 2vw, 28px)/1.1**; unit price 38px → **clamp(19px, 1.5vw, 23px)** (both the Phase 2 rule and the (0,6,0) fix rule, kept in sync); PER WHEEL 16px → **12px**
- CONFIRM WHEEL SPECS heading 23px → **14px**; spec label 15px → **12px**; spec value 22px → **16px/700 lh1.35**
- Fitment heading 24px → **15px**; vehicle detail 16px → **13px**
- Edit Specs + Remove 17px → **14px**; qty input 18px → **15px**
- Item Total label 15px → **12px**; amount 30px → **clamp(18px, 1.4vw, 22px)**; compare-at 15px → **12px**
- Checkbox (36px), fitment icon (48px), all spacing/layout untouched — fonts only. Hierarchy preserved: label < value < title.

### [VERIFY] QA
- Suite 174/175 (1 = pre-existing e2e label failure; item-total-scale assertion updated to the new clamp); git diff --check clean; theme check 13/404 = baseline, 0 cart-page.css offenses.

### [FILES] Modified (this round)
- assets/cart-page.css (14 in-place rule edits), docs/architecture/tests/calder-cart-confirm.test.mjs (1 assertion), llm-continuity.md

### [AGENT] Session Metadata
- opencode (build) — Model: z-ai/glm-5.3
- Re-gate: developer re-QC on desktop font scale; then refinement Phase 3 (spec grid spacing) on APPROVED

---

## [2026-11-17 #10] — Refinement Phase 3 UPDATE round (developer specs) IMPLEMENTED, RE-GATE

### [COMPLETED] Developer-supplied exact adjustments (all edited in place, cart-page.css)
1. **Image → 100px**: `__main { grid-template-columns: minmax(100px, 12%) minmax(0,1fr); column-gap: 36px }` — developer's exact rule.
2. **Spec typography → Order Summary compact scale** (excluding .card-total-title): spec label 11px/600 uppercase muted; spec value 14px/600 ink (ui-font, not heading-font); CONFIRM WHEEL SPECS 12px/700, margins 22/10; PER WHEEL 11px; fitment heading 13px; banner compacted (gap 12, margin 22, padding 14×18); Edit Specs/Remove 13px; Item Total label 11px.
3. **Spec checkboxes 25×25** (radius 5px, check svg 15px), cell gap 18→12px.
4. **Fitment icon 25×25, font-size 16px** (developer's `.calder-cart-fitment__icon` spec).
- Qty selector compacted to match: 140×44 (buttons 36px wide/42 tall, input 15px). Title/price/unit-price clamps untouched (approved prior round).

### [VERIFY] QA
- calder-cart-confirm.test.mjs 22/22 (qty/checkbox/icon assertions updated to the new compact dimensions); suite 174/175 (1 = pre-existing e2e label failure); git diff --check clean; theme check 13/404 baseline, 0 cart-page.css offenses.

### [FILES] Modified (this round)
- assets/cart-page.css (17 in-place edits), docs/architecture/tests/calder-cart-confirm.test.mjs (4 assertions), llm-continuity.md

### [AGENT] Session Metadata
- opencode (build) — Model: z-ai/glm-5.3
- Re-gate: developer re-QC (image 100px, compact typography, 25px checkboxes/icon); then refinement Phase 5 (responsive tiers incl. flagged mobile qty) on APPROVED

---

## [2026-11-17 #11] — Refinement Phase 3 round 2 (4 developer issues) FIXED, RE-GATE

### [COMPLETED]
1. **Blurry image** → cart requested `sizes: '100px'` (≈300px file) stretched into the 250px tile. Fixed: `sizes: '250px'`, `width_times: 2` (≥500px file, sharp at 2× DPR). Developer's own grid edit (minmax(250px,12%) — they applied it themselves mid-round) PRESERVED.
2. **actions-right cramped** → `flex-wrap: wrap; justify-content: flex-end; gap: 12px 20px; flex: 0 1 auto`; Item Total `flex: 0 0 auto; margin-left: 8px`; amount `white-space: nowrap` (never squeezed).
3. **Qty +/- misalignment** → explicit geometry: container `height: 44px; overflow: hidden` (single authority), input `min-height: 0; padding 0 6px`, nav `align-self: stretch`, buttons `flex: 0 0 36px; min-height: 0` (stretch), DOM-first (+, visual RIGHT via row-reverse) gets `border-radius: 0 11px 11px 0`, svg `display: block; 13px` — one divider system, nothing floats.
4. **Edit-Specs raw code + "Preview unavailable" on PDP** → root cause: `calder-pdp-state.parseUrl` DROPS tokens absent from the target design's `resolver.options`; `syncSelection` then prints the RAW requested value in the labels and `syncPreview` hides layers + shows the fallback (exactly the reported pair). Fix (cart-side, display-only): every emitted token is VALIDATED server-side against the canonical registry vocabulary before the URL is built (diameter 22/24/26; center gloss-black/black-titanium/titanium-tint; barrel gloss-black/polished; hardware black/chrome; pcd must contain 'x') — invalid → param OMITTED, so the PDP either applies a token cleanly or never sees it. BYW label→token derivation retained but behind the same gate.
- Developer's own mid-round CSS edits verified preserved: checkbox 20×20 r4, fitment icon 20px, banner r5/padding .5rem 1rem/margin 10 — 3 stale test assertions synced to their values.

### [VERIFY] QA
- calder-cart-confirm.test.mjs 22/22; suite 174/175 (1 = pre-existing e2e label failure); Liquid balance OK; 0 filters-in-if; git diff --check clean; theme check 13/404 baseline, 0 offenses in changed files.

### [FILES] Modified (this round)
- sections/main-cart-items.liquid (image sizes + edit-token validation gate), assets/cart-page.css (actions-right/qty geometry; comment fixes), docs/architecture/tests/calder-cart-confirm.test.mjs (3 assertions synced), llm-continuity.md

### [AGENT] Session Metadata
- opencode (build) — Model: z-ai/glm-5.3
- Re-gate: developer re-QC on all four; NOTE residual: if the PDP still shows raw code with a VALIDATED token, the PDP-side resolver data (window._calderProductData / registry load) is incomplete on that theme — report it and we scope a PDP fix. Then refinement Phase 5 (responsive) on APPROVED

---

## [2026-11-17 #12] — QTY SELECTOR: dual-source geometry contest ELIMINATED (single authority), RE-GATE

### [ROOT CAUSE] Why .cart-table-prd-qty didn't render as expected
Two CSS blocks fought for the same nodes at ~equal specificity, winner = source order (fragile): (a) the committed "Calder final integration" block (cart-page.css:1330 — OLD overlay design: nav position:absolute right:0 width:54px, container padding-right:54px, 27px buttons, 112px width); (b) the Phase 5 __actions-scoped flex design (line ~2498). On desktop (b) won by position; after moveQtyNode() relocates the qty out of __actions (its ≤575px behavior), (b) stops matching and (a)'s absolute overlay takes over. Plus a duplicate svg rule (13px then 14px) from an edit collision.

### [FIX] Consolidation — ONE geometry authority
- The integration block was REWRITTEN IN PLACE to the flex design, scoped `.calder-site.template-cart .calder-cart-item .cart-table-prd-qty` (no __actions dependency → geometry holds in BOTH DOM locations incl. post-moveQtyNode): quantity-input 140px block; .prd-quantity flex/stretch height 44, border 1px --cwci-qty-border, radius 12, overflow hidden, padding 0 (54px dead zone gone); input flex 1 1 auto / padding 0 6px / 15px/600 centered; nav STATIC stretched flex item (absolute overlay gone); buttons 0 0 36px grid-centered with border-left dividers; DOM-first (+, visual RIGHT via row-reverse) keeps border-radius 0 11px 11px 0; svg display:block 13px (single rule).
- The duplicate __actions-scoped qty geometry rules were DELETED from the actions layer (actions-flex placement `flex: 0 0 auto` stays in the Phase 2 skeleton where it already existed — no duplicate).
- is-updating spinner rules + the ≤575px block untouched (mobile visibility = flagged refinement Phase 5).

### [VERIFY] QA
- calder-cart-confirm.test.mjs 22/22 (Phase 5 test rewritten to the single-authority contract: 140×44, fixed-basis 36px buttons, static/stretch nav, radius rule, zero absolute-nav overlays file-wide, no dup svg); suite 174/175 (1 = pre-existing e2e label failure); git diff --check clean; theme check 13/404 baseline.
- Static verification: 0 absolute-nav rules, 1 quantity-input rule, 0 duplicate svg rules remain in cart-page.css.

### [FILES] Modified
- assets/cart-page.css (integration block rewrite + actions duplicate removal), docs/architecture/tests/calder-cart-confirm.test.mjs (Phase 5 contract), llm-continuity.md

### [AGENT] Session Metadata
- opencode (build) — Model: z-ai/glm-5.3
- Re-gate: developer re-QC the qty selector ([input | − | +], aligned dividers, radius right, 140×44); then refinement Phase 5 (responsive) on APPROVED

---

## [2026-11-17 #13] — Refinement Phase 5 (RESPONSIVE TIERS) IMPLEMENTED, AWAITING QA

### [COMPLETED] Responsive tiers (cart-page.css, additive media layer)
Breakpoints aligned to the theme's own: **1199** (Lumia aside--content switch, style.css), **767** (theme mobile boundary; summary stacks there via fidelity 1fr), **575** (moveQtyNode threshold).
- **≥1440**: unchanged (36/40 card, 36px gap, 140×44 qty — already compliant).
- **≤1439 (standard desktop)**: card 32×36 !important; main gap 32.
- **≤1199 (narrow desktop/tablet-wide)**: `__main` → 1fr STACKED (image above details, max-width 320) — rationale: locked 1178px section → items column ≈600px below 1200 → 250px image beside details would starve the spec grid (~240px details → ~40px/cell text). Summary split untouched.
- **≤1023 (tablet)**: card 28×32.
- **≤767 (mobile)**: card 20px; image ≤260; header 20/16; spec GRID 1-COLUMN (vertical `--lead`/`--trail` dividers removed, side paddings 0); spec row padding 14; actions 20/16, actions-right gap 10/16; fitment padding 12×14. Checkbox stays the developer's 20px; type stays the developer's compact scale (title clamp min 22). No mobile-nav/sticky-configurator interference (cart page has none).
- **THE FLAGGED PRE-EXISTING BUG FIXED (≤575, in the integration block's own media query — edited in place, no !important contest)**: moveQtyNode() relocates the qty DOM from [data-node-desktop] into `.cart-table-mobile`'s [data-node-mobile] at ≤575 — the old `display:none!important` on the whole block made the MOVED qty invisible. Now the block renders `display:block!important`, only its duplicate price/total CLONES stay hidden, the moved qty shows below the actions row (margin 12), and the desktop qty container's `display:block!important` kept. Between 576–767 the qty stays in __actions (visible). Resize-back path (moveQtyNode moves children back when the desktop container is empty) untouched — zero JS changes.
- NOT touched: split/summary (locked), typography (developer-locked compact scale), checkbox 20px, `.calder-cart-item` block geometry.

### [VERIFY] QA
- Static width simulation: 375 → card inner ≈305 → stacked, spec text ≈260px/cell; 768 → inner ≈650, spec col ≈120px text; 1199 → stacked, col ≈250px; no min-content traps (all minmax(0,…) + min-width 0 + overflow-wrap anywhere). Suite 174/175 (1 = pre-existing e2e label failure); cart tests 22/22; git diff --check clean; theme check 13/404 baseline.
- NEEDS LIVE/BROWSER QA (cannot verify in this environment): real-device rendering at 375/390/768/1024/1280/1440/1920 incl. the ≤575 qty relocation round-trip on resize.

### [FILES] Modified (refinement Phase 5)
- assets/cart-page.css (≤575 block edited in place + responsive tier layer appended), llm-continuity.md

### [AGENT] Session Metadata
- opencode (build) — Model: z-ai/glm-5.3
- Re-gate: developer device QA across the 7 widths (esp. ≤575 qty now visible, 768–1199 stacked image); then refinement Phase 6 (final regression + deliverables report) on APPROVED

---

## [2026-11-17 #14] — Refinement Phase 6 (FINAL REGRESSION) COMPLETE — ENGAGEMENT CLOSING REPORT

### [COMPLETED] Final regression battery
- Functional-hook inventory sweep: 37/37 PASS (line ids, updates[]+data-index, cart-remove-button, error/success regions, all .js-contents-* swap containers (buttons = drawer file, verified), [data-node-desktop/mobile], K1/K2 confirmation attrs, drawer dedup intact, gate targets incl. express wrappers, MutationObserver invalidation, drawer root in closest(), edit-link gating + vocabulary gate + separator-safe href, price/qty snippet renders, 5 responsive tiers, K4 protected summary). One sweep-script false alarm (js-contents-buttons checked in wrong file — lives in header-cart.liquid by design).
- Tests: FULL SUITE 174/175 — the single failure = the PRE-EXISTING calder-pdp-e2e 'Universal Part#:' label assertion (calder-product.liquid:495 renders 'Part Number:' since 11-16; test reads no cart file; untouched per no-unrelated-modification rule — needs a one-line test fix with developer approval).
- Cart tests: 22/22. git diff --check clean. theme check 13 errors/404 warnings = documented baseline, 0 offenses in every changed file. No media files touched.

### [ENGAGEMENT DELIVERABLES — CART ITEM REDESIGN (original phases 1–7 + refinement phases 1–6)]
**Files modified (this engagement, 5 theme + 1 test + docs):**
1. sections/main-cart-items.liquid — card skeleton (main grid image|details, header title/unit-price/PER WHEEL, specs area, actions row); 6-cell validated spec grid (Size=Ø×W combined, Center, Lip Finish, Bolts, Vehicle wide, Bolt Pattern wide) with source cascade; single fitment banner ([data-calder-line-complete] + vehicle detail); Edit Specs deep-link (validated calder-pdp-state params + pcd); Remove label; Item Total wrapper; image 250px srcset.
2. snippets/header-cart-line-item.liquid — legacy K2 confirmation block REMOVED (dedup only; drawer stays compact per locked decision).
3. assets/calder-cart-confirm.js — .minicart-prd added to badge closest() (drawer badge was dead).
4. assets/cart-page.css — component layer (--cwci tokens), card, header, spec grid + 20px checkboxes, fitment banner, action row, qty SINGLE geometry authority (integration block rewritten; overlay contest eliminated), responsive tiers (1439/1199/1023/767/575) + the ≤575 MOBILE QTY FIX (qty was invisible).
5. assets/calder-base.css.liquid — orphaned legacy K2 block styles removed (heading/inline/gate kept).
6. docs/architecture/tests/calder-cart-confirm.test.mjs — 22 tests guarding the delivered contract (K1 payload untouched, grid sources/cascade/order, drawer dedup, gate logic, single banner, edit-link validation, qty single-authority, banner CSS).

**Preserved functionality (verified):** all Shopify cart data (ids/keys/properties incl. underscore internals — ZERO renames; display-only label mapping), K1 payload verbatim, checkout gating on all routes (checkboxes × agreement AND-gate), structural invalidation on AJAX re-render, qty AJAX/inventory-max/remove/error regions/section-rendering contract, prices = Shopify authoritative snippets (discounts/dealer unchanged — no dealer logic exists in cart), drawer compact behavior, empty cart, order summary/section settings/sidebar (locked 1178px + 1.6fr/1fr split per developer), no configurator/PDP/collection/gallery/nav files touched.

**Known limitations / outstanding:**
1. Live-device QA at 375/390/768/1024/1280/1440/1920 NOT performed (no browser in this environment) — mandatory before production.
2. Pre-existing e2e label assertion failure (Universal Part# → Part Number) — one-line test fix awaiting approval.
3. Mobile qty renders BELOW the actions row at ≤575 (DOM-order consequence of the theme's moveQtyNode relocation) — reorder possible if wanted.
4. K3 honesty: theme-side checkout gating is devtools-removable; true enforcement needs Checkout UI Extension (deferred decision).
5. Edit Specs on BYW-era lines without _config_tokens falls back to underscore internals; if both absent → plain product URL (no preselection) — truthful degradation.
6. Dealer MOQ snippet remains orphaned (rendered nowhere — pre-existing).
7. Deploy: client pushes (no-agent-push rule) — 5-file set above; verify dev theme parity first; real-device script per EVENT_LAUNCH_CHECKLIST pattern.

### [AGENT] Session Metadata
- opencode (build) — Model: z-ai/glm-5.3
- Engagement state: original phases 1–7 + refinement phases 1–6 all implemented and developer-approved through Phase 5; Phase 6 (this entry) = final regression + deliverables. Awaiting final developer sign-off.

---

## [2026-11-17 #15] — ENGAGEMENT CLOSED: final developer sign-off APPROVED

- Cart item redesign (original phases 1–7 + refinement phases 1–6) COMPLETE and approved.
- Final state: 174/175 tests (1 = pre-existing e2e label assertion, unrelated), 22/22 cart tests, theme check 13/404 baseline with 0 offenses in changed files, 37/37 functional-hook sweep, no media changes.
- Client pushes the 5-file set manually (no-agent-push rule): sections/main-cart-items.liquid, snippets/header-cart-line-item.liquid, assets/calder-cart-confirm.js, assets/cart-page.css, assets/calder-base.css.liquid.
- Still open (separate scoped rounds, on request): live-device QA pass; pre-existing e2e 'Part Number:' assertion fix; optional mobile ≤575 qty reorder above the actions row; Checkout UI Extension decision (K3); BYW payload full-visible-property extension.

### [AGENT] Session Metadata
- opencode (build) — Model: z-ai/glm-5.3
- Engagement complete. Next session starts from this entry.

---

## [2026-11-17 #16] — DEVELOPMENT STATUS AUDIT + Notion tracker sync + admin-action ledger + approved change set committed/pushed

### [ACTIVITY] Session Mode
REMEMBER → BUILD (audit, tracker sync, git preservation)

### [COMPLETED] What Was Done
- **Full development status audit** (sources: continuity doc, Nov-15 batch regression report, QA reports, Oct audits, 10-14/10-26/10-28 meetings + Nov 9/10/15/16/17 meeting follow-ups, Notion, git history, live-store spot-check) → written to **docs/audits/DEVELOPMENT_STATUS_AUDIT_2026-11-17.md**. Verdict: WS1 retail storefront ~85% built + developer-approved (full suite now **175/175 PASS** — the former e2e 'Part Number' label failure passes); WS2 integration ~3%; WS3 production ~2%. Deadline risk concentrated in client content/data pipeline + the unstarted integration workstreams, not storefront code.
- **Notion tracker synced** (was stale since 2026-08-25 — all 86 tasks "Not Started"): 44 task status updates with evidence notes — WS0: 7 Completed + 2 In Progress; WS1: 13 Completed + 20 In Progress; WS2: 1 In Progress; WS3: 1 In Progress; remaining 42 legitimately stay Not Started. Calder Wheels project page Agent Summary / Waiting On / Next Milestone / Next Action / Last Activity(2026-11-17) updated.
- **Admin actions recorded DONE (reported by developer 11-17):** C4 — `hardware_rivet_finish_options` enabled as S&D storefront filter; C3 — S&D "Barrel & Lip" label renamed to "Lip Finish". Live spot-check of the collection page was rate-limited (429) — verify filter rendering on the next storefront pass.
- **Git: approved Nov 15–17 change set committed + pushed** to origin on `feature/calder-mobile-sticky-configurator` (36 modified + 14 untracked files, +3184/−260 vs 7556dab, incl. the audit file + this entry). Secret scan of full diff: clean. No agent live-theme pushes (client rule unchanged).

### [BLOCKED] What's Waiting (per audit §4–§6)
- Last quick admin items: mobile-menu creation (G3), center_bore apostrophe cleanup (96 products)
- Real-device QA pass (EVENT_LAUNCH_CHECKLIST §3) + cart device QA at 7 widths
- I2 5-file export set; 48-SKU import + Checkout UI Extension decisions
- Client media (hero video, section images, gallery photography); wheel-entry REVIEW fields (offset/bore) + images; 11 vehicle entries + bolt_pattern backfill; suspension fitment data (none exists)
- Final manual push of sections/calder-gallery-detail.liquid (client rule)

### [FILES] Modified/Created This Session
- docs/audits/DEVELOPMENT_STATUS_AUDIT_2026-11-17.md — created
- docs/0 - DO NOT DELETE/llm-continuity.md — this entry
- Notion (external): 44 task pages + Calder Wheels project page
- Git: commit of the full Nov 15–17 approved change set (theme batches + 8 test suites + batch regression report + wheel-entry data sheet + audit)

### [AGENT] Session Metadata
- opencode (audit + sync) — Model: z-ai/glm-5.3
- Next session should start from this entry + docs/audits/DEVELOPMENT_STATUS_AUDIT_2026-11-17.md §9 priority list.
