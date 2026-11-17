# CALDER WHEELS — DEVELOPMENT STATUS AUDIT
**Date:** 2026-11-17
**Type:** Read-only audit → status sync (Notion + git + admin-action ledger)
**Sources:** `docs/0 - DO NOT DELETE/llm-continuity.md` (all sessions), `docs/design/site-updates_11-15-2026/` (master prompt + batch regression report), `docs/qa/mobile-event-readiness/`, `audits/` (Oct-9/12 assessments), Notion project + tasks DB, git history, live-store verification attempts
**Test state at audit:** `node --test docs/architecture/tests/*.test.mjs` → **175/175 PASS** (8 suites)

---

## 1. Executive Summary

The **retail storefront (WS1) is substantially built, tested, and developer-approved** through the 2026-11-17 cart-redesign close-out. The project's "hardest problem" — the **production inventory/integration layer (WS2, ~3%) and production system (WS3, ~2%) — remain essentially unstarted**. Dozens of content/data tasks sit on the **client's** critical path. The Notion tracker was stale (all 86 tasks "Not Started", untouched since 2026-08-25) — **synced to reality this session**. The approved Nov 15–17 change set (~50 files) was uncommitted — **committed + pushed this session**.

| Area | Status |
|---|---|
| Retail storefront (collections/PDP/configurator/cart/galleries/fitment) | ✅ Built, regression-green (175/175), developer-approved |
| Test suite | ✅ 175/175 (e2e 'Part Number' label assertion now passing) |
| Component inventory + BOM live integration (WS2) | ❌ ~3% — demo stand-in only |
| Production system (WS3/Quickbase) | ❌ ~2% |
| Dealer/B2B portal | 🟡 Code complete (25+ files); live activation unverified since Oct-12 audit; wholesale audit-only |
| Notion project tracker | ✅ Synced 2026-11-17 (was: all 86 tasks "Not Started" since Aug-25) |
| Git | ✅ Nov 15–17 approved change set committed + pushed 2026-11-17 |

**Completion by workstream (reality-adjusted):**

| Workstream | Oct-9 estimate | Nov-17 actual (code-evidence) | Notes |
|---|---|---|---|
| WS1 — Commerce & Dealer | 69.5% | **~85%** | Retail core done; remainder = SEO, financing extensions, dealer activation, content |
| WS2 — Systems Integration | 3% | **~3%** | I1 assessment done; I2 imports blocked pending 5 client files |
| WS3 — Production & Fulfillment | 2% | **~2%** | Status-translation snippet only |
| **Overall (price-weighted)** | ~43% | **~55%** | Deadline risk = WS2/WS3 build + client content pipeline |

---

## 2. Notion State — SYNCED THIS SESSION

- **Before:** All 86 tasks `Not Started`; project page last edited 2026-08-25 ("Major Sept–Oct build; planning now").
- **After (2026-11-17):** every task re-statused with evidence notes (see §8 ledger). Summary: **~24 Completed, ~20 In Progress, ~42 Not Started** across WS0–WS3. Project page Agent Summary / Waiting On / Next Milestone / Last Activity updated.

---

## 3. COMPLETED (evidence-backed, developer-approved)

### Nov-15 combined master prompt (Nov 9+10 meetings + Nov-15 manual assessment) — ALL 10 batches closed
- **C1–C7 (collection):** chip gating, Clear Filters/Clear Vehicle, vehicle-type images, Bolts filter data, product-card config accuracy (registry showcase variant), bolt-pattern constraint, 26" per-vehicle truth
- **P1–P8 (PDP):** design-nav bolt-pattern filtering, verify icon, Black-Bolts-first order, diameter gating + Size labels, **vehicle-required purchase gate**, live size-tiered pricing, exact width/offset/bore specs, Lexus/26"/suspension audit (suspension: **no data exists — documented-blocked**)
- **K1–K4 (cart):** full line-property snapshot, per-line confirmation checkboxes → checkout gate, bypass audit (theme-side accepted), summary untouched
- **G1 (gallery):** metaobject details pages live (deprecated `shop.metaobjects` → canonical `metaobjects` migration; design+pattern pairing rules; 404 guards; live-verified)
- **I1 (inventory):** 912-PN SKU master validated; 864 live ⊆ master; ownership map documented

### Nov-16 client meeting feedback — implemented
Clear Vehicle rename · SIZE filter with combined values · bolt filter dedup · product card v3 (Part#, Wheel Description, Size, Offset/Bore) · red vehicle-required message · design-nav hidden on standard PDP · inline cart checkboxes + FITMENT CONFIRMED badge · **new Universal Wheel Builder page** (`calder-universal-builder.liquid` + template)

### Nov-17 cart item card redesign — ALL phases closed today
Approved card layout · 6-cell spec grid with source cascade (K1 visible → underscore internals → `_config_tokens` → key-scan → variant Option3) · fitment banner (single badge) · Edit Specs deep-link (validated tokens + pcd) · qty selector single-authority fix · responsive tiers (1439/1199/1023/767/575) · **≤575 mobile qty visibility fix**

### Earlier build (Oct–Nov 3)
Galleries v2 live · fitment finder + registry (864/864 live SKUs) · universal configurator (42 per-design layer renders) · mobile sticky configurator (default-enabled, client-round-2) · design nav (404 fixed, paginate lookup) · Matrixify image import batches (29 CSVs, 72 webp renders) · Garet bold font fix · Playwright mobile QA (**CONDITIONAL GO**; A1 BYW fix applied+verified; P1-V2 fixed live)

---

## 4. ADMIN-ACTION LEDGER (as of 2026-11-17)

| # | Action | Status |
|---|---|---|
| C4 | Enable `hardware_rivet_finish_options` as S&D storefront filter | ✅ **DONE (admin, 2026-11-17 — reported by developer)** |
| C3 | Rename S&D "Barrel & Lip" label → "Lip Finish" | ✅ **DONE (admin, 2026-11-17 — reported by developer)** |
| G3 | Create `mobile-menu` + assign "Only Mobile Navigation" | ❌ STILL PENDING (5-min admin; drawer still sparse) |
| — | `center_bore` apostrophe cleanup on 96 variant products ("'78.1") | ❌ STILL PENDING |

*Live spot-check of C3/C4 rendering was rate-limited (429) at audit time — verify on next storefront pass.*

---

## 5. PENDING — Client-Side Critical Path

**Quick admin wins:** mobile-menu creation (G3) · center_bore apostrophe cleanup

**Data/content deliverables:**
- Homepage media: hero video (distorted Escalade footage + the "highlight reel" build video agreed 10-28), 2-Piece Spun / 24hr / engineering / dissect images, Ford truck crop, "Made with Precision" overlay fixes
- Gallery content: 1 wheel + 1 vehicle entry live of 12 planned; 6 wheel-entry drafts need REVIEW fields (offset/bore) + images; **bolt_pattern backfill on 12 vehicle entries** (required for pairing)
- **Suspension fitment data (Standard/Lifted): none exists anywhere — feature blocked until supplied**
- 48 master-only SKU import decision (912 master vs 864 live)

**Decisions outstanding:**
- Checkout enforcement: theme-side gating (current, devtools-removable) vs fund **Checkout UI Extension** (K3)
- I2 inventory imports: blocked pending 5 files (QuickBooks item list, Shopify inventory export, Quickbase schema, n8n workflow JSON, ShipStation mapping — none in repo)
- BYW add-path payload full-visible-properties extension (recommended follow-up)

**QA gaps (human-only):**
- Real-device QA script (EVENT_LAUNCH_CHECKLIST §3, ~5 min iPhone + iPad) — never run
- Cart redesign device QA at 375/390/768/1024/1280/1440/1920 — not performed
- One human visual pass on baseline screenshots

**Deploy:** verify live theme == repo before any full push; several files await manual client pushes (no-agent-push rule) — final pending push: `sections/calder-gallery-detail.liquid` (self-exclusion + wheel-mini change set)

---

## 6. PENDING — Development Not Started

| Area | Status | Notes |
|---|---|---|
| **WS2 — Integration layer** | ~3% | n8n, QB Web Connector, ShipStation, component ledger, `availableToBuild`, order state machine — contracts documented only; `calder-demo-inventory.js` mimics n8n→QB payload 1:1 |
| **WS3 — Quickbase production** | ~2% | Quickbase app, 14-stage pipeline, QR tracking — not started; `production-status.liquid` + seed-data tracker exist |
| **Dealer/B2B portal** | Code done, live-unverified | Pages 404 as of Oct-12; Nov sessions audit-only; `dealer-cart-moq.liquid` orphaned; Quick Order/invoices/NET-30 need WS2 |
| **SEO/AEO foundation** | 0% | Per Oct-9 assessment; never revisited |
| **Future-documented** | Not implemented | Staggered fitment UI, PDF build sheet, wheel-on-vehicle viz, SKU-gen template, 3-month lead-time forecasting, component reorder planning |
| Minor | Flagged | Optional ≤575px qty reorder above actions row; stock-first sorting (10-28 meeting) |

---

## 7. MEETING-SUMMARY RECONCILIATION

| Meeting | Items | Status |
|---|---|---|
| 10-14 (configurator audit) | Configurator model fixes | ✅ Delivered (implementation report 10-14) |
| 10-26 / 10-28 (Ivan/Sergio) | Bolt-pattern lock on shop-by-vehicle, reset prominence, gallery filters (design+finish), vehicle-gallery columns, hero video, price-sort removal, 12-vehicle gallery | ✅ Most delivered Nov 2–15 · 🟡 hero video + gallery photography pending media · ❌ stock-first sorting not implemented |
| Nov 9/10 + Nov-15 assessment | Combined master prompt C/P/K/G/I | ✅ All 10 batches approved (BATCH-REGRESSION-REPORT_2026-11-15.md) |
| Nov 16 client review | Card v3, filters, cart restructure, Universal Builder | ✅ Implemented 11-16 |
| Nov 17 | Cart item card redesign | ✅ Closed 2026-11-17 — awaiting manual device QA |

---

## 8. NOTION TASK SYNC LEDGER (applied 2026-11-17)

**WS0 — Foundation:** Completed ×7 (dealer approach, configurator delivery, fitment source, finish preview, Shopify store, Lumia theme, git strategy) · In Progress ×2 (integration stack decision → paper only; end-to-end QA → storefront leg done) · Not Started ×6 (n8n, QB env, Quickbase, ShipStation, beta, launch)

**WS1 — Commerce & Dealer (37):** Completed ×13 (PDP naming, finish matrix, mobile-responsive, accounts, configurator model/layers/pricing/invalid-combos/PDP-integration, fitment DB/API/finder/PDP-integration) · In Progress ×20 (homepage, catalog taxonomy, dual gallery, availability gate, dealer landing/apply/tag/approval/pending/dashboard/pricing-PDP/pricing-cards/gating/MOQ/tabs/quick-order/quotes/order-detail/payment-terms/order-guide) · Not Started ×4 (SEO, financing extensions, re-order, QB invoice download)

**WS2 — Systems Integration:** In Progress ×1 (BOM/component mapping — resolver code tables + I1; QB-side deduction not built) · Not Started ×24

**WS3 — Production & Fulfillment:** In Progress ×1 (status translation snippet) · Not Started ×8

---

## 9. Recommended Priority Order (deadline-driven)

1. ✅ ~~Commit + push the approved change set~~ — **done this session**
2. **Mobile-menu + center_bore cleanup** (last quick admin items — unblock shipped code)
3. **Real-device QA script** (5 min) — the last gate before retail launch-ready
4. **I2 5-file export set + 48-SKU import / Checkout Extension decisions** — gates the inventory-truth problem (AGENTS.md risk #1)
5. **Client media/content pipeline** (hero video, gallery entries) — longest-lead items an agent cannot do
6. **WS2 kickoff** (n8n + ledger + QB + ShipStation) — the remaining ~40% of contracted scope
7. **Dealer portal live activation + verification** (pages, MOQ wiring) once WS2 data path exists

---

*Audit by opencode — model z-ai/glm-5.3. Companion docs: `docs/design/site-updates_11-15-2026/BATCH-REGRESSION-REPORT_2026-11-15.md`, `audits/CALDER_WORKSTREAM_COMPLETION_ASSESSMENT_2026-10-09.md`, `docs/qa/mobile-event-readiness/EVENT_LAUNCH_CHECKLIST.md`.*
