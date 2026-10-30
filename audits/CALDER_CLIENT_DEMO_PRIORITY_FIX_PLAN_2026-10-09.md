# CALDER WHEELS — CLIENT DEMO PRIORITY FIX PLAN

**Date:** October 9, 2026
**Type:** Read-Only Audit — No Implementation
**Branch:** presentation-polish

---

## GROUP A — BEFORE SENDING DEMO LINK (Critical)

| # | Task ID | Description | Affected Files | Dependencies | Est. Effort | Acceptance Criteria |
|:-:|---------|-------------|----------------|:-----------:|:----------:|---------------------|
| A1 | CW-AUDIT-FIX-001 | Create missing Shopify pages in Admin: gallery, fitment-finder, build-your-wheel, dealer-program, dealer-apply, dealer-dashboard, dealer-portal, vehicle-gallery, wheel-gallery, gallery-build | Shopify Admin → Online Store → Pages | Admin access | 30 min | Each page resolves without 404, using the correct template |
| A2 | CW-AUDIT-FIX-002 | Verify Configurator API (port 8080) and Fitment API (port 8081) health endpoints on Cove Digital servers | `configurator/api_server.py`, `fitment/fitment_api_server.py` | SSH access to Cove Digital | 30 min | `curl /api/configurator/health` and `/api/fitment/health` return 200 |
| A3 | CW-AUDIT-FIX-003 | Confirm Shopify store is password-protected or in preview mode | Shopify Admin → Online Store → Preferences → Password | Admin access | 5 min | Storefront shows password gate, not live checkout |
| A4 | CW-AUDIT-FIX-004 | Set all navigation CTA URLs to resolve correctly — "Build Yours", "Find Your Fit", Gallery link, social links | Shopify Admin → Navigation + theme settings | Admin access | 30 min | All primary CTAs lead to existing pages (not 404) |
| A5 | CW-AUDIT-FIX-005 | Update `fitment-data.liquid` API URLs if they don't resolve to live endpoints | `snippets/fitment-data.liquid` | Known API URLs | 5 min | Fitment/fitment API base URLs are correct |
| A6 | CW-AUDIT-FIX-006 | Verify homepage hero section primary/secondary CTA URLs | `templates/index.json` — home-hero settings | Admin access | 5 min | "Explore Wheels" and "Build Yours" CTAs link to real pages |

---

## GROUP B — DURING CLIENT TESTING (Non-blocking improvements)

| # | Task ID | Description | Affected Files | Dependencies | Est. Effort | Acceptance Criteria |
|:-:|---------|-------------|----------------|:-----------:|:----------:|---------------------|
| B1 | CW-AUDIT-FIX-007 | Replace largest placeholder images with brand-appropriate visuals (hero image, category cards, gallery placeholders) | Theme settings, Shopify Files | Photography/design assets | 2 hrs | Hero, category cards, and gallery don't show blank SVGs or stock placeholders |
| B2 | CW-AUDIT-FIX-008 | Fix "Most searched for today" section showing literal `PRODUCT` text | `index.json` section settings or Liquid fix | Theme code access | 30 min | Section either shows real products or is hidden |
| B3 | CW-AUDIT-FIX-009 | Update placeholder contact phone number | Theme settings or section settings | Client input | 5 min | Footer shows real or removed phone number |
| B4 | CW-AUDIT-FIX-010 | Add client disclosure notes to the demo page (placeholder content, work in progress) | Shopify page content | — | 15 min | Client sees clear "in development" notation on placeholder sections |
| B5 | CW-AUDIT-FIX-011 | Set product images to at least differentiate the 5 products (even with minimal photography) | Shopify product media | Product photos | 1 hr | Each product has a unique primary image |
| B6 | CW-AUDIT-FIX-012 | Add "Per Wheel / Each" pricing clarity to cart and PDP | `sections/main-cart-items.liquid`, `sections/calder-product.liquid` | Visual spec | 1 hr | Cart and PDP clearly communicate per-wheel pricing |

---

## GROUP C — BEFORE RETAIL LAUNCH (Production readiness)

| # | Task ID | Description | Affected Files | Dependencies | Est. Effort | Acceptance Criteria |
|:-:|---------|-------------|----------------|:-----------:|:----------:|---------------------|
| C1 | CW-AUDIT-FIX-013 | Commission and upload real product photography (15-20 photos per design: hero, angle, detail, lifestyle, finish comp) | Shopify Files | Photography shoot | Ongoing | Each product has hero, angle, detail, and at least one lifestyle image |
| C2 | CW-AUDIT-FIX-014 | Add Save Build functionality to configurator | `configurator-app.js`, `wheel-configurator.liquid`, customer metafields | Configurator API working | 3-4 hrs | Customer can save build to account and reload it |
| C3 | CW-AUDIT-FIX-015 | Add Share Build functionality with URL pre-population | `configurator-app.js`, `wheel-configurator.liquid` | Save Build working | 2-3 hrs | Share URL reproduces configuration |
| C4 | CW-AUDIT-FIX-016 | Expand Shopify variants to match all 5 configurator finishes | Shopify Admin → Products → Variants | Product data decisions | 1 hr | All 5 configurator finishes selectable as variants |
| C5 | CW-AUDIT-FIX-017 | Make PDP spec table dynamic (read from metafields) | `calder-specs.liquid`, product metafields | Metafield schema decisions | 1 hr | Spec table shows correct bolt patterns, offsets for each product |
| C6 | CW-AUDIT-FIX-018 | Add faceted collection filters | Shopify Admin → Navigation → Filter setup + `async-facets.liquid` styling | Metafields registered as filterable | 2 hrs | Collection page has working series, finish, bolt-pattern, price filters |
| C7 | CW-AUDIT-FIX-019 | Wire dealer application form to backend notification | `dealer-apply-form.liquid`, n8n or email service | n8n or email API | 1-2 hrs | Dealer application submission admin notification |
| C8 | CW-AUDIT-FIX-020 | SEO foundation — OG images, meta descriptions, structured data | Theme settings, `snippets/meta-tags.liquid` | — | 2 hrs | Pages render correct OG meta tags |
| C9 | CW-AUDIT-FIX-021 | Populate gallery with real imagery and working navigation | `templates/page.gallery.json`, Shopify Files | Photography completed | 2-3 hrs | Gallery has real images, links lead to products |
| C10 | CW-AUDIT-FIX-022 | Create gallery detail pages for individual builds | `calder-gallery-detail.liquid`, metafields | Gallery imagery | 4-6 hrs | Each gallery build has a detail page with hero, thumbnails, specs, CTAs |

---

## GROUP D — DEFERRED DEALER PORTAL

| # | Task ID | Description | Current Status | Remaining Work | Dependency |
|:-:|---------|-------------|:--------------:|:--------------:|:----------:|
| D1 | CW-DEFER-001 | Create dealer program page and dealer apply page in Shopify Admin | Code exists, pages return 404 | Create pages, assign templates | None — can be done anytime |
| D2 | CW-DEFER-002 | Create real dealer customer accounts with `dealer-approved` tags | Test account exists | Create dealer accounts in Admin | Client action |
| D3 | CW-DEFER-003 | Wire Quick Order submission to Shopify Draft Order API | Frontend exists, backend endpoint needed | Develop Shopify Admin API integration | n8n middleware |
| D4 | CW-DEFER-004 | Full dealer dashboard with live data (stats, orders, production) | Dashboard exists with seed data mode | Requires Quickbase + n8n integration | WS2 completion |
| D5 | CW-DEFER-005 | Invoice download from QuickBooks | Not started | Requires QuickBooks Web Connector | WS2 completion |
| D6 | CW-DEFER-006 | Dealer credit management and payment terms UI | Dashboard credit display exists | Live data from QuickBooks | WS2 completion |

---

## GROUP E — WS2 / WS3 REMAINING DELIVERABLES

| # | Task ID | Description | Proposal Workstream | Est. Effort | Priority | Dependency |
|:-:|---------|-------------|:------------------:|:----------:|:--------:|:----------:|
| E1 | CW-WS2-001 | n8n workflow engine setup + deployment | WS2 | 4-8 hrs | P0 (blocks 2.1-2.10) | Server access |
| E2 | CW-WS2-002 | Shopify webhook receiver (order created/updated) | WS2 | 2-3 hrs | P0 | n8n running |
| E3 | CW-WS2-003 | QuickBooks Web Connector + qbXML setup | WS2 | 8-12 hrs | P0 | Windows environment, QB Enterprise 24.0 |
| E4 | CW-WS2-004 | Customer sync: Shopify → QuickBooks | WS2 | 3-4 hrs | P0 | E3 complete |
| E5 | CW-WS2-005 | Order → QuickBooks invoice creation | WS2 | 4-6 hrs | P0 | E4 complete |
| E6 | CW-WS2-006 | BOM/component mapping → QuickBooks inventory deduction | WS2 | 4-6 hrs | P0 | E5 complete, BOM metafields exist |
| E7 | CW-WS2-007 | ShipStation integration (label, tracking, pushback) | WS2 | 4-6 hrs | P1 | n8n running |
| E8 | CW-WS2-008 | Integration reliability (idempotency, retry, error handling) | WS2 | 4-6 hrs | P0 | E1-E7 architecture |
| E9 | CW-WS3-001 | Quickbase application design + build | WS3 | 16-24 hrs | P0 | Client licenses Quickbase |
| E10 | CW-WS3-002 | Production workflow pipeline (13 stages) | WS3 | 8-12 hrs | P0 | E9 complete |
| E11 | CW-WS3-003 | QR/barcode production tracking | WS3 | 6-8 hrs | P1 | E10 complete |
| E12 | CW-WS3-004 | Dealer-facing status translation (6 simplified states) | WS3 | 3-4 hrs | P1 | E10 complete |
| E13 | CW-WS3-005 | Exception handling (6 exception states) | WS3 | 4-6 hrs | P2 | E10 complete |
| E14 | CW-WS3-006 | Packing & ShipStation handoff | WS3 | 4-6 hrs | P1 | E7 + E10 complete |

---

## DEPENDENCY GRAPH

```
GROUP A (Before Demo)
  A1 (Create missing pages) → no deps
  A2 (Verify API) → no deps
  A3 (Password protection) → no deps
  A4 (Fix CTAs) → no deps
  A5 (API URLs) → A2
  A6 (Hero CTAs) → no deps

GROUP B (During Testing)
  B1 (Replace placeholders) → Photography/design assets
  B2 (Fix PRODUCT text) → no deps
  B3 (Update phone) → Client input
  B4 (Disclosure notes) → no deps
  B5 (Differentiate product images) → Product photos
  B6 (Per-wheel pricing) → no deps

GROUP C (Pre-Launch)
  C1 (Photography) → No dependency (parallel track)
  C2 (Save Build) → Configurator API working (A2)
  C3 (Share Build) → C2
  C4 (Expand variants) → Product data decisions
  C5 (Dynamic spec table) → Metafield decisions
  C6 (Collection filters) → no deps
  C7 (Dealer application backend) → no deps
  C8 (SEO foundation) → no deps
  C9 (Gallery imagery) → C1 (photography)
  C10 (Gallery detail pages) → C9

GROUP D (Deferred Dealer)
  D1 (Create dealer pages) → A1 (pages exist pattern)
  D2 (Dealer accounts) → Client action
  D3 (Quick Order API) → WS2 middleware
  D4 (Live dashboard) → WS2/WS3
  D5 (Invoice download) → WS2
  D6 (Credit management) → WS2

GROUP E (WS2/WS3)
  E1 (n8n setup) → Server access
  E2 (Webhooks) → E1
  E3 (QB Web Connector) → Windows/QB environment
  E4 (Customer sync) → E3
  E5 (QB invoices) → E4
  E6 (BOM deduction) → E5
  E7 (ShipStation) → E1
  E8 (Reliability) → E1-E7
  E9 (Quickbase design) → Client licenses Quickbase
  E10 (Production workflow) → E9
  E11 (QR tracking) → E10
  E12 (Status translation) → E10
  E13 (Exceptions) → E10
  E14 (Packing handoff) → E7 + E10
```

---

## ESTIMATED REMAINING EFFORT

| Group | Estimated Hours |
|-------|:--------------:|
| **A — Before Demo Link** | **1.5 hrs** (mostly admin work) |
| **B — During Client Testing** | **4-5 hrs** (plus photography timeline) |
| **C — Before Retail Launch** | **25-30 hrs** (excluding photography timeline) |
| **D — Deferred Dealer Portal** | **15-20 hrs** (excluding WS2 dependencies) |
| **E — WS2/WS3** | **100-140 hrs** (includes Quickbase, QuickBooks, n8n, ShipStation) |
| **Total Remaining** | **~145-200 hrs** |

Photography is the critical external dependency — 60-85 photos across 5 designs required for production quality. This timeline is not included in the above estimates as it depends on client commissioning.

---

*End of priority fix plan.*