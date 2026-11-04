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
