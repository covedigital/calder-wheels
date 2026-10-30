# CALDER WHEELS — WORKSTREAM COMPLETION ASSESSMENT

**Date:** October 9, 2026
**Type:** Read-Only Code Audit
**Auditor:** OpenCode
**Repository base:** `docs/design/Shopify Themes/Working Theme-via-CLI/`
**Proposal document:** `docs/proposal/calder-wheels-proposal.md`

---

## 1. ORIGINAL PROPOSAL SCOPE

The proposal defines three workstreams:

| Workstream | Scope | Price |
|------------|-------|-------|
| **WS1 — Commerce & Dealer Platform** | Storefront, configurator, wholesale, BOM | $11,750 |
| **WS2 — Systems Integration & Automation** | QuickBooks, ShipStation, n8n orchestration | $4,250 |
| **WS3 — Production & Fulfillment System** | Quickbase application, QR tracking, workflows | $5,000 |
| **Complete bundled project** | WS1 + WS2 + WS3 | **$19,500** |

Proposal milestone weights (used for percentage calculation):
- Kickoff: 30%
- Design and system approval: 30%
- Functional beta: 25%
- Before production launch: 15%

**Methodology note:** No explicit deliverable-level weights exist in the proposal. I use an equal-weighted deliverable model within each workstream, then weight workstreams by their proposal price ratio ($11,750 / $4,250 / $5,000).

---

## 2. WS1 — COMMERCE & DEALER PLATFORM ($11,750 — 125-155 hrs)

### 2.1 Shopify Storefront Foundation — Sub-deliverables

| Deliverable | Status | Completion % | Evidence | Remaining |
|-------------|--------|:-----------:|----------|-----------|
| Homepage layout (dark/luxury aesthetic) | PARTIALLY COMPLETE | 75% | `templates/index.json` references home-hero, home-fitment, home-gallery, home-engineering, home-customize-band, home-newsletter, index-brands-carousel sections. Hero section renders with placeholder image. | Hero image is placeholder. Primary/secondary CTA URLs are empty. Social links use `#`. Contact phone is placeholder. |
| Wheel catalog — series taxonomy | PARTIALLY COMPLETE | 70% | `templates/collection.json` uses collection-hero, collection-category-nav, main-collection-product-grid, home-fitment sections. 5 products created. Series badges on cards via `calder-card-badges.liquid`. | No faceted filters. Product images all use same photo. Spec table hardcoded. |
| Product pages (PDP) | PARTIALLY COMPLETE | 70% | `templates/product.calder.json` references calder-product section (3584 lines). Has fitment-finder, wheel-configurator, calder-specs, calder-finishes, calder-recommendations sections. Design code/nickname badges work. | Configurator shows "Loading preview..." (API unverified). Fitment API unverified. Spec table may be static. Single product photo reused. |
| Finish matrix photography | COMPLETE | 95% | 35 composite PNGs uploaded across 5 designs (7 layers each). Wired via metafields. `shopify/assets/composites/` confirmed. | Minor: 60 configurator combinations, 35 layer files exist — composite generation scripts present. |
| Dual gallery (Vehicle + Wheel) | PARTIALLY COMPLETE | 40% | `templates/page.gallery.json` exists with dual-gallery structure. `page.vehicle-gallery.json`, `page.wheel-gallery.json`, `page.gallery-build.json` templates exist. | All gallery images are empty strings (color_placeholders only). All `link` fields are empty. No gallery detail pages with content. Page not created in Shopify Admin (returns 404). |
| Mobile-responsive layout | COMPLETE | 95% | Lumia 7.0.1 native responsive. Calder sections inherit responsive framework. | Responsive behavior unverified beyond code inspection. |
| SEO/AEO foundation | NOT STARTED | 0% | No OG image handling, no structured data additions, no meta description optimization found in audit. | Full SEO scope not addressed. |
| Customer accounts | COMPLETE | 90% | Standard Shopify accounts. Dealer context detection via customer tags. | Standard implementation — no customization beyond dealer detection. |
| Checkout | COMPLETE | 90% | Standard Shopify checkout. | No Calder-specific customizations per proposal scope (financing/accelerated checkout extensions noted as Phase 2). |

**Storefront Foundation sub-weight:** ~40% of WS1 (effort estimate)
**Storefront Foundation completion:** ~62%

### 2.2 Wheel Configurator

| Deliverable | Status | Completion % | Evidence | Remaining |
|-------------|--------|:-----------:|----------|-----------|
| Component model (center × barrel/lip × hardware) | COMPLETE | 95% | `wheel-configurator.liquid` (1093 lines), `configurator-api.js`, `configurator-app.js` implement the 3-dimension model. | Minor: some finish options (CHROME, POLISH) exist in code but not in all Shopify variant sets. |
| Pre-rendered 2D layer composite system | COMPLETE | 90% | 35 PNGs, `composite_preview.py` generates 60 combos. `configurator-preview.liquid` (26 lines) renders preview. | Requires API server running to serve composites. |
| Price calculation | COMPLETE | 85% | Python + FastAPI + Liquid inline pricing. Configurator-data.liquid provides price data. | Price calculation only works when API is connected. |
| Realtime availability gate | PARTIALLY COMPLETE | 50% | API endpoint stub exists in `page.configurator-api.liquid`. `availableToBuild()` concept documented. | No live inventory ledger. Stub returns static values. |
| Configurator integration on PDP | PARTIALLY COMPLETE | 60% | `calder-product.liquid` includes wheel_configurator block type. Section referenced in product.calder.json. | "Loading preview..." on live site — API disconnect. |
| Config → resolved SKU → add to cart | PARTIALLY COMPLETE | 60% | `configurator-api.js` resolves SKU. Lumia product form handles add-to-cart. Cart properties preserved (`_center_finish` etc.). | End-to-end flow untested — API disconnect blocks resolution. |

**Configurator sub-weight:** ~30% of WS1
**Configurator completion:** ~73%

### 2.3 Vehicle Fitment Finder

| Deliverable | Status | Completion % | Evidence | Remaining |
|-------------|--------|:-----------:|----------|-----------|
| Curated fitment database structure | COMPLETE | 95% | SQLite DB with schema, 6-criteria matching, 1,958 fitment specs, 25 bolt patterns. Fitment engine tests pass (40/40). | 1,958 specs out of target 30-50 models in curated set. |
| Fitment API/service | PARTIALLY COMPLETE | 70% | FastAPI server on port 8081. Python backend exists (`fitment_api_server.py`). Deployed on Cove Digital per documentation. | API connectivity UNVERIFIED from live site. Live storefront fitment tool shows no data. |
| Frontend fitment finder | PARTIALLY COMPLETE | 75% | `home-fitment.liquid` (810 lines) on homepage. `fitment-page.liquid` (278 lines) for standalone page. `fitment-finder.liquid` (634 lines) for PDP. `fitment-finder.js` handles cascading. | API connectivity UNVERIFIED. Year/Make/Model selects don't populate on live site. |
| PDP integration | PARTIALLY COMPLETE | 60% | `fitment-finder` section referenced in `product.calder.json`. | API disconnect blocks functionality. |
| Never-surface-incompatible rule | COMPLETE | 95% | Enforced at DB + API level via 6-criteria matching engine. | Relies on populated fitment_specs data. |

**Fitment Finder sub-weight:** ~20% of WS1
**Fitment Finder completion:** ~79%

### 2.4 Dealer/B2B Portal

| Deliverable | Status | Completion % | Evidence | Remaining |
|-------------|--------|:-----------:|----------|-----------|
| Dealer landing page (`/pages/dealer-program`) | PARTIALLY COMPLETE | 60% | `templates/page.dealer-program.json` exists. | Page not created in Shopify Admin (404). |
| Multi-step dealer application form | PARTIALLY COMPLETE | 70% | `dealer-apply-form.liquid` snippet. `page.dealer-apply.json` template. 4-step form code complete. | Page not created in Shopify Admin (404). No backend email notification wired. |
| Dealer dashboard | PARTIALLY COMPLETE | 75% | `dealer-dashboard.liquid` (317 lines) with seed data mode. `page.dealer-dashboard.json` template. All visual components exist (stat cards, orders table, production tracker, activity feed, featured wheels). | Page not created in Shopify Admin (404). Full functionality blocked by WS2 dependencies. |
| Dealer pricing & gating | COMPLETE | 90% | `dealer-price.liquid`, `dealer-gating.liquid`, `dealer-cart-moq.liquid` all functional. Tier detected via customer tags. | Requires dealer-approved customer tag. |
| Quick Order | PARTIALLY COMPLETE | 60% | `dealer-quick-order.liquid` section exists. `dealer-backend.js` for submission. | Page not live. SKU search and draft order creation untested end-to-end. |
| Invoices | PARTIALLY COMPLETE | 50% | `dealer-invoices.liquid` section. `dealer-invoice.liquid` snippet. Credit limit display. | Live data requires QuickBooks integration (WS2). |
| Order Guide PDF | COMPLETE | 90% | `page.dealer-order-guide.liquid` template. | Unverified render quality. |

**Dealer Portal sub-weight:** ~10% of WS1
**Dealer Portal completion:** ~70%

### 2.5 WS1 Overall Completion

| Component | Sub-weight | Completion |
|-----------|:---------:|:---------:|
| Storefront Foundation | 40% | 62% |
| Wheel Configurator | 30% | 73% |
| Vehicle Fitment Finder | 20% | 79% |
| Dealer/B2B Portal | 10% | 70% |

**WS1 Completion = (0.40 × 62) + (0.30 × 73) + (0.20 × 79) + (0.10 × 70) = 24.8 + 21.9 + 15.8 + 7.0 = 69.5%**

**Confidence:** Medium — Several components have code presence but unverified API connectivity. If APIs are disconnected, effective completion is significantly lower (~45%).

---

## 3. WS2 — SYSTEMS INTEGRATION & AUTOMATION ($4,250 — 45-60 hrs)

| Deliverable | Status | Completion % | Evidence | Remaining |
|-------------|--------|:-----------:|----------|-----------|
| n8n workflow engine setup + deployment | NOT STARTED | 0% | No n8n configuration or deployment found in repository. | Full setup required. |
| Shopify webhook receiver | NOT STARTED | 0% | No webhook configuration found. | Requires setup in Shopify Admin + n8n. |
| QuickBooks Web Connector + qbXML | NOT STARTED | 0% | No QuickBooks integration code found. | Requires Windows environment + QuickBooks Desktop Enterprise 24.0. |
| Customer sync: Shopify → QuickBooks | NOT STARTED | 0% | Not implemented. | Requires n8n workflow + QuickBooks SDK. |
| Order → QuickBooks invoice | NOT STARTED | 0% | Not implemented. | Requires n8n workflow + QuickBooks SDK. |
| BOM/component mapping for inventory deduction | PARTIALLY COMPLETE | 25% | BOM metafields exist on products (`custom.bom`). Configurator model decomposes wheel into components. | No integration with QuickBooks inventory. Component data in Shopify metafields only. |
| ShipStation integration | NOT STARTED | 0% | No ShipStation code or configuration found. | Requires n8n workflow. |
| Idempotency/retry/error handling | NOT STARTED | 0% | Not implemented. | Part of n8n workflow design. |
| Integration logs + audit trail | NOT STARTED | 0% | Not implemented. | Part of n8n workflow design. |

**Critical note:** The proposal states these systems need to be *built*, not just architected. The BOM data structure is seeded in Shopify metafields, which represents architecture work, but no operational integration code exists.

**WS2 Completion = ~3%**

**Confidence:** High — Codebase has no QuickBooks, n8n, or ShipStation integration code.

---

## 4. WS3 — PRODUCTION & FULFILLMENT OPERATIONS ($5,000 — 55-75 hrs)

| Deliverable | Status | Completion % | Evidence | Remaining |
|-------------|--------|:-----------:|----------|-----------|
| Quickbase application design + build | NOT STARTED | 0% | No Quickbase application code or configuration found. | Full design and build required. Client-paid licensing not yet procured per proposal. |
| Production workflow pipeline | NOT STARTED | 0% | Not implemented. | Requires Quickbase application. |
| QR/barcode production tracking | NOT STARTED | 0% | No QR/barcode code found. | Requires Quickbase + label generation. |
| Dealer-facing status translation | PARTIALLY COMPLETE | 10% | `production-status.liquid` snippet exists with 6 manufacturing lifecycle states. Dealer portal shows production tracker with seed data. | Data contract defined but no live integration with Quickbase. |
| Exception handling | NOT STARTED | 0% | Not implemented. | Requires Quickbase application. |
| Packing & ShipStation handoff | NOT STARTED | 0% | Not implemented. | Requires n8n + ShipStation integration (WS2 dependency). |

**WS3 Completion = ~2%**

**Confidence:** High — No Quickbase application code exists in the repository.

---

## 5. OVERALL PROJECT COMPLETION

### Weighting by Proposal Price

| Workstream | Price | Weight | Completion | Weighted |
|------------|:----:|:-----:|:---------:|:-------:|
| WS1 | $11,750 | 60.3% | 69.5% | 41.9% |
| WS2 | $4,250 | 21.8% | 3% | 0.7% |
| WS3 | $5,000 | 25.6% | 2% | 0.5% |
| **Total** | **$19,500** | **100%** | | **~43%** |

### Alternative: Weighting by Workstream Hours

| Workstream | Hours | Weight | Completion | Weighted |
|------------|:----:|:-----:|:---------:|:-------:|
| WS1 | 125-155 | 52.7% | 69.5% | 36.6% |
| WS2 | 45-60 | 21.3% | 3% | 0.6% |
| WS3 | 55-75 | 26.0% | 2% | 0.5% |
| **Total** | **225-290** | **100%** | | **~38%** |

### Additional Measures

| Measure | Percentage | Confidence | Notes |
|---------|:---------:|:---------:|-------|
| **Retail Storefront Implementation** | **68%** | Medium | Code presence strong, but API connectivity, placeholder images, missing pages reduce effective completion. |
| **Retail Demo Readiness** | **55%** | Medium-Low | Core pages exist but several return 404. APIs unverified. Product images are placeholders. |
| **Retail Production Readiness** | **25%** | Low | Requires API verification, real photography, SEO, cart refinement, navigation fixes, and product data completion. |

### Missing Document Note

The proposal is located at `docs/proposal/calder-wheels-proposal.md`. WS1/WS2/WS3 definitions are extracted from this document. No supplemental deliverable weight document exists — weights are estimated using proposal price ratios and documented effort estimates.

---

## 6. KEY FINDINGS

### Code-Rich, Live-Poor Gap

The theme codebase is comprehensive (109+ sections, 385+ snippets, 258+ assets in the "copy" theme; the "Working Theme-via-CLI" has even more Calder-specific additions). However, the WS1 activation assessment (Oct 2) confirmed several critical features return 404 because Shopify pages were not created:

| Template Exists | Shopify Page Created | Live Status |
|:---------------:|:-------------------:|:----------:|
| `page.gallery.json` | ❌ | 404 |
| `page.configurator-api.liquid` | ❌ | 404 |
| `page.fitment-finder.json` | ❌ | 404 |
| `page.dealer-program.json` | ❌ | 404 |
| `page.dealer-apply.json` | ❌ | 404 |
| `page.dealer-dashboard.json` | ❌ | 404 |
| `page.dealer-portal.json` | ❌ | 404 |
| `page.build-your-wheel.json` | ❌ | 404 |

### API Connectivity Unverified

Both the Configurator API (port 8080) and Fitment API (port 8081) are claimed to be deployed on Cove Digital servers. However:
- `fitment-data.liquid` sets `window.__fitmentData = {"vehicles": []}` — empty fallback
- Live site fitment selects don't populate
- Configurator shows "Loading preview..."
- API health endpoints cannot be verified without server access

### No Save/Share Build

This was identified as a client requirement but is not implemented. The `configurator-app.js` handles configuration state but has no save or share functions.

---

*End of workstream completion assessment.*