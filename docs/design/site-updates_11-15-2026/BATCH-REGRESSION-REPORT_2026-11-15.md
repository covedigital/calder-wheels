# CALDER WHEELS — BATCH REGRESSION REPORT & FINAL DELIVERABLES
## Combined 11-15 Master Prompt — 2026-11-15

> Scope: the combined Nov 9/10/15 master prompt, executed as 10 gated batches per the
> batch execution protocol. **Not claimed production-ready by virtue of local tests** —
> see §10 for deployment readiness and outstanding decisions.

---

## 1. Requirement reconciliation matrix

| ID | Source | Delivered in | Superseded instructions / notes |
|---|---|---|---|
| C1 chips hidden (vehicle+results) | Nov 15 | Batch 1 | Nov-2 hiding code existed but matched zero elements (wrong selector scope); corrected + zero-results gate added |
| C2 Clear Filters under count | Nov 15 | Batch 1 + QA fixes | One shared `performCollectionReset` with the guide RESET; no redundant duplicate of the sidebar facet-clear controls |
| C3 underline removal + Lip Finish rename | Nov 15 | Batch 1 (verify) | Underline removal was the developer's own uncommitted CSS (verified preserved); the rename is a Search & Discovery ADMIN label change — theme renders `filter.label` (not done by theme; admin action pending) |
| C4 Bolts filter on storefront | Nov 15 | Batch 1 (verify) | **Blocked on admin**: enable the `hardware_rivet_finish_options` metafield as a S&D storefront filter; export-verified the metafield data exists on all 107 Calder products |
| C5 bolt-pattern constraint; 26" | Nov 15 | Batch 1 (verify) | Constraint already worked (Nov-2 code); 26" NOT blanket-hidden — the fitment sheet supports 26x10 for 8+ vehicles |
| C6 vehicle-type image src | Nov 15 | Batch 2 | Engine was correct; sparse mapping (10/11 makes → SUV). G-Wagon → off-road added per interactive developer decision; Escalade V / GX / LX / Range Rovers explicitly kept SUV |
| C7 card Shown Configuration | Nov 15 | Batch 3 | Root causes: first-variant showcase + Option3 carrying bolt values under a barrel-named option. Developer chose source (b) registry default-config variant; lip from the documented SKU tail digit |
| P1 design-nav filtering | Nov 15 | Batch 4 | Data-pcds stamped from design-product metafields (developer-endorsed); CTA fail-closes purchase on arrival |
| P2 verify icon | Nov 15 | Batch 4 + CHANGES | Verify-scoped: gold circular badge; svg color = container color |
| P3 Black Bolts first | Nov 15 | Batch 5 | Desktop Liquid swapped; Chrome keeps the registry default selection; mobile already registry-ordered (black first) — test-locked |
| P4 Diameter gating + Size labels | Nov 15 | Batch 4 CHANGES + Batch 5 | Developer pulled the gating forward into the Batch 4 CHANGES round; combined "22 × 10" labels from vehicle fitment records; unsupported sizes disabled + CTA backstop |
| P5 vehicle-required gate | Nov 15 | Batch 5 | Exact client wording; **supersedes the Nov-2 pcd-param purchase scoping** (pcd still validates for navigation); server-side enforcement honestly NOT possible theme-side |
| P6 size-dependent price | Nov 15 | Batch 5 | Resolver's authoritative Shopify price wired to the PDP display; formatting mirrors the captured Liquid rendering; no parallel pricing system |
| P7 exact Width/Bolt/Offset/Bore | Nov 15 | Batch 6 | Exact values from vehicle cf records + registry fitment group ids; general values clearly tagged; staggered pairs shown truthfully |
| P8 Lexus/suspension/26"/legacy audit | Nov 9/10 | Batch 6 | GX/LX boundaries verified vs the xlsx; **RX/TX retained per developer decision**; 26" per-vehicle; **suspension: NO data exists anywhere → documented-blocked, nothing invented**; CLB legacy handles preserved |
| K1 cart line properties | Nov 15 | Batch 7 | Complete config snapshot at add time; `_`-prefixed internals hidden; FITMENT CONFIRMED badge now live |
| K2 per-line confirmations | Nov 15 | Batch 7 | One checkbox per displayed spec; item.key-keyed; structural invalidation on every cart re-render; existing agreement preserved as an additional AND |
| K3 checkout bypass audit | Nov 15 | Batch 7 | **Honest assessment: theme-side gating only** — bypasses documented (devtools, direct /checkout); Checkout UI Extension strategy proposed, decision pending |
| K4 summary untouched | Nov 15 | Batch 7 | Programmatically verified byte-identical + zero protected-marker diff lines |
| G1 gallery entries → details pages | Nov 15 | Batch 8 (+4 revision rounds) | Nov-2 PDP deep-links from the LISTING superseded (the product CTA lives once, on the details page); developer gallery model implemented (pairing rule, PDP-inline intake, create-one-first hints, browse-across-designs); **deprecated `shop.metaobjects` API found broken live → canonical `metaobjects` global migration**; 404 guard; static block removed by the developer via Theme Editor |
| I1/I2 inventory assessment | Nov 15 | Batch 9 | I1 complete (912-SKU master validated, 864 live ⊆ master, ownership map); I2 blocked pending 5 requested files |

**§5 preserve/assess items:** homepage media = manual-only (untouched); desktop PDP whitespace = not addressed (no separate approval received); wholesale = audit-only (untouched); staggered fitments, PDF build sheet, wheel-on-vehicle viz, SKU-generation template, 3-month lead-time forecasting, component reorder planning = **documented future-only, not implemented**; Shopify→n8n→Quickbase→QuickBooks→ShipStation contracts untouched.

---

## 2. Batch-by-batch status and approvals

| Batch | Requirements | Result | Developer action |
|---|---|---|---|
| 0 Audit + plan | §1 | Matrix + plan approved per-requirement | Approved (with per-item decisions: C7=(b), RX/TX keep, gallery wire-now) |
| 1 | C1–C5 | Implemented (C4 admin-blocked; C3/C5 verified) | Approved |
| 2 | C6 | 3 mapping rows (G-Wagon) | Approved (interactive) |
| 3 | C7 | Showcase variant + bolt/lip attribution | Approved |
| 4 | P1, P2 | Nav filter + icon; 404-era CHANGES round fixed reset color + added Diameter gating | Approved (after CHANGES) |
| 5 | P3–P6 | Order, labels, gate, price | Approved |
| 6 | P7, P8 | Exact specs + audit lock-ins | Approved |
| 7 | K1–K4 | Properties, confirmations, bypass audit, summary-proof | Approved (K3 theme-side gating accepted) |
| 8 | G1 | 5 rounds (404 → data model → Liquid parser error → deprecated API → self-exclusion + browse-across-designs) | Approved |
| 9 | I1, I2 | I1 report; I2 blocked | Approved |
| 10 | Regression + deliverables | This report | **PENDING — final developer QA** |

---

## 3. Exact modified file paths and diff summaries

**32 files changed, +1278 / −105** (working tree vs the pre-batch backup commit `7556dab`; all uncommitted for review):

**Theme (25 files):** `assets/{calder-fitment-finder-guide.js, calder-fitment-finder-guide.css, calder-universal-pdp.js, calder-universal-cta.js, calder-mobile-sticky-configurator.js, calder-mobile-sticky-configurator.css, calder-cart-confirm.js (new), calder-base.css.liquid, calder-gallery-v2.css, calder-pdp-fitment-form.css, calder-product.css, calder-universal-controls.css, calder-product-card.js}` · `sections/{calder-gallery-detail.liquid, calder-product.liquid, calder-specs.liquid, calder-vehicle-gallery.liquid, calder-wheel-gallery.liquid, main-cart-items.liquid, main-collection-product-grid.liquid}` · `snippets/{calder-design-nav.liquid, calder-fitment-guide-data.liquid, calder-product-card.liquid, calder-universal-controls.liquid, facets.liquid, facets-mobile-popup-container.liquid, header-cart.liquid, header-cart-line-item.liquid}` · `templates/page.wheel-gallery.json` (developer's Theme Editor block removal, synced)

**Tests/docs (7):** `docs/architecture/tests/{calder-collection-reset, calder-vehicle-image, calder-card-config, calder-design-nav-filter, calder-hardware-size-price, calder-specs-exact, calder-cart-confirm, calder-gallery-links}.test.mjs` (8 new suites, 97 new tests; 3 existing suites contract-updated) · `docs/gallery-audit/wheel-content/{wheel-entry-data-sheet.json, README-wheel-entries.md}` · `06-import-procedure.md` addendum · this report.

**Git:** backup commit `7556dab` + branch/tag `backup/pre-11-15-updates-2026-11-15` pushed to GitHub before Batch 1, per the developer's standing instruction.

---

## 4. Automated and manual QA evidence

| Check | Result |
|---|---|
| `node --test docs/architecture/tests/*.test.mjs` — **166 tests, 8 suites** | **PASS 166/166** |
| `node --check` × 7 session JS files | **PASS all** |
| `shopify theme check` | 13 errors = pre-existing documented baseline; **0 offenses in every changed file** |
| `git diff --check` | **CLEAN** |
| Media/asset integrity (git change-set scan + test-enforced) | **0 media files touched** |
| Live verification rounds (webfetch) | Galleries, both details pages, listings, pairing pull, specs grid, single-card state — **all verified live across Batch 8's rounds**; Batch 10 collection/PDP smoke — **NOT RUN (storefront 429 rate-limit); runtime states evidenced by the developer's per-batch manual QA** (chip hiding, clear-filters, diameter gating, vehicle-required gate, bolt order, price changes — all confirmed by you during CHANGES/approval rounds) |
| Browser console / breakpoints / screen-reader / real-device | **NOT RUN this session** — no browser tooling in this environment; structural accessibility (aria states, hidden-attr, roving focus, 44px targets) is test-asserted; real-device pass remains a human step |
| Per-batch manual QA by the developer | Batches 1–9 each passed your gate (with 4 CHANGES rounds driving fixes) |

---

## 5. CSS and Git preservation report

- The developer's 3 uncommitted CSS files (fitment-guide finish-filters hide, category sidebar underline, home hero) were committed in the pre-batch backup and **preserved byte-for-byte** — one test permanently guards the finish-filter override; all agent CSS edits are additive appends or verify-scoped rules.
- No global tokens, breakpoints, layouts, or theme settings altered. `wheel-configurator.liquid` (client-excluded file) untouched. No production data writes, no imports executed, no webhook/payment/shipping changes. All batch changes sit uncommitted on the feature branch for your review; the developer pushed to the live theme manually per the standing no-agent-push rule.

## 6. Media preservation + Developer Action Required — Image & Video Updates

**Zero media files were created, edited, replaced, renamed, or removed by the agent** (test-enforced across all batches). All gallery/test imagery was supplied/selected by the developer in admin. **Manual developer media tasks outstanding (from the Nov-15 assessment, unchanged):** homepage hero footage (distorted Escalade video, warped wheel geometry), 2-Piece Spun / 24hr / engineering / bottom-dissect images, Ford truck crop, "Made with Precision" overlay conflicts, gallery photography + cover confirmations (docs/gallery-audit/vehicle-content contact sheets), wheel-entry images for the six reviewed data-sheet entries.

## 7. Inventory/fitment files — discovery, authority, conflicts, import readiness

| Asset | Authority | Status |
|---|---|---|
| SUV Data Sheet revised 10-21-26.xlsx | Finished-SKU master | 912 PNs, 0 duplicates; 864 live ⊆ master; **48 master-only import candidates (not imported — needs separate approval)** |
| SUV Fitment Guide.xlsx | Vehicle fitment | Verified against theme JSON (GX/LX boundaries; 26" per-vehicle; RX/TX retained by decision) |
| calder-fitment-data.json | Theme fitment source | Export-consistent; suspension data absent → Standard/Lifted blocked |
| calder-demo-inventory.js | Demo stand-in | Mimics the n8n→QB payload 1:1; design-204 deliberate demo row; odd blank sizes = demo filler |
| QuickBooks item list / Shopify inventory export / Quickbase schema / n8n JSON / ShipStation mapping | Production integration | **NOT IN REPO — requested at the Batch 9 gate; I2 imports blocked until supplied + separately approved** |
| products_export_1.csv | Catalog (not quantities) | Supplied by developer; used for C7/I1 verification |

## 8. Checkout confirmation enforcement/bypass assessment

Theme-side per-line confirmations + vehicle-required gating are live on every visible route (cart page, drawer, express wrappers). **Bypasses that remain:** devtools class/attribute stripping; direct `/checkout` navigation; crafted cart/add posts. **True enforcement requires a Checkout UI Extension or app-level validation — scoped as a future decision (your K3 acceptance covered theme-side gating; the extension proposal is on file).**

## 9. Deferred wholesale/future features

Dealer portal: audit-only (existing accounts/pricing untouched). Future-only (documented, not implemented): staggered front/rear fitment UI, PDF/email build sheet, wheel-on-vehicle visualization, SKU-generation template, three-month manufacturing lead-time forecasting, component reorder planning, Checkout UI Extension, Search & Discovery bolt-finish filter enablement (admin), "Lip Finish" S&D label rename (admin), `center_bore` metafield apostrophe cleanup across the 96 variant products (admin data fix), mobile-menu A2 item (carried from the Nov-3 audit).

## 10. Outstanding client decisions + production deployment readiness

**Decisions outstanding:** (1) checkout enforcement strategy (accept theme-side vs fund the UI Extension); (2) the 48 master-only SKU import; (3) S&D filter enablement + label rename; (4) wheel-entry offset/bore pairs + image filenames per the reviewed data sheet (six drafts); (5) remaining 11 vehicle entries + bolt_pattern backfill per the README; (6) suspension fitment data (none exists — supply or the Standard/Lifted feature stays blocked); (7) real-device QA pass (checklist at docs/qa/mobile-event-readiness/EVENT_LAUNCH_CHECKLIST.md §3).

**Deployment readiness:** all batches approved and regression-green; the live theme already carries every pushed file (galleries verified live this session). **NOT declared production-ready**: remaining = your final manual QA below, the real-device pass, the admin data items above, and the deploy checklist (verify live theme == repo before any full push; the standing no-agent-push rule remains).
