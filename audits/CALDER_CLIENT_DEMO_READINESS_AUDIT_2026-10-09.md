# CALDER WHEELS — CLIENT DEMO READINESS AUDIT

**Date:** October 9, 2026
**Type:** Read-Only Code Audit
**Branch:** presentation-polish
**Last Commit:** 10fbd51 — Fix index-gallery masonry container height

---

## 1. CLIENT DEMO READINESS GATE CLASSIFICATION

| Priority | Classification |
|:--------:|---------------|
| **P0** | Demo blocker — critical journey fails, page inaccessible, risk of real transactions |
| **P1** | Fix before demo if possible — prominent functionality incomplete or visibly defective |
| **P2** | Acceptable with disclosure — secondary issues |
| **P3** | Polish — minor improvements |
| **DEFERRED** | Explicitly deprioritized (dealer portal) |

---

## 2. RETAIL STOREFRONT COMPONENT AUDIT

### A. HOMEPAGE

| Element | Status | Files | Evidence | Demo Impact | Priority |
|---------|--------|-------|----------|:----------:|:--------:|
| Header + navigation | CODE-VERIFIED | `sections/header.liquid`, `theme.liquid` | Nav renders via Lumia header. Calder SVG logo loaded. | ✅ OK | — |
| Hero section | CODE-VERIFIED | `sections/home-hero.liquid`, `templates/index.json` | Hero renders with "MADE WITH PRECISION" heading. Hero image is a placeholder (`shopify://shop_images/hero-placeholder.png`). Caption box present. YouTube video URL set. | ⚠️ Placeholder image is evident. | P2 |
| Fitment tool | CODE-VERIFIED | `sections/home-fitment.liquid` | Dual-tab fitment finder (By Vehicle / By Wheel Style) renders. CSS files loaded. | ⚠️ API connectivity UNVERIFIED — selects may not populate. | P1 |
| Featured products / collection links | CODE-VERIFIED | `index.json` sections | Homepage has home-gallery, home-engineering, home-customize-band, home-signature-wheels sections. All CTA URLs need verification. | ⚠️ CTA links may be empty or 404. | P1 |
| Footer | CODE-VERIFIED | `sections/footer.liquid` | Brand links, payment icons present. Social links use `#`. Contact phone is placeholder `+1-202-555-0158`. | ⚠️ Social links and contact info are placeholders. | P2 |
| "Most searched for today" | CODE-VERIFIED | Placeholder section | Shows `PRODUCT` × 8 — Liquid placeholder text leaking. | ❌ Noticeably broken. | P1 |
| Newsletter signup | CODE-VERIFIED | Present in footer | Functional. | ✅ OK | — |
| Responsive behavior | CODE-VERIFIED | Lumia native | Responsive framework present. | UNVERIFIED without browser. | P2 |

**Homepage Findings: P0=0, P1=3, P2=3**

### B. COLLECTION PAGES

| Element | Status | Files | Evidence | Demo Impact | Priority |
|---------|--------|-------|----------|:----------:|:--------:|
| Collection hero | CODE-VERIFIED | `sections/collection-hero.liquid` | Banner with collection title, description. Dark placeholder background. | ✅ OK | — |
| Category navigation | CODE-VERIFIED | `sections/collection-category-nav.liquid` | Present. | UNVERIFIED | P2 |
| Product cards | CODE-VERIFIED | `snippets/calder-card-badges.liquid`, `snippets/calder-card-dealer-price.liquid` | 5 products render with series badges, price ranges. | ⚠️ All 5 products use the same photo. | P1 |
| Filtering + sorting | CODE-VERIFIED | Sort dropdown present. `async-facets.liquid` exists. | ❌ No faceted filter sidebar configured. | P2 |
| Empty states | CODE-VERIFIED | Lumia default. | ✅ OK | — |
| Pagination / load more | CODE-VERIFIED | Lumia default. | ✅ OK | — |
| Responsive grid | CODE-VERIFIED | Lumia native. | UNVERIFIED | P2 |

**Collection Findings: P0=0, P1=1, P2=3**

### C. PRODUCT DETAIL PAGE

| Element | Status | Files | Evidence | Demo Impact | Priority |
|---------|--------|-------|----------|:----------:|:--------:|
| Product gallery + thumbnails | CODE-VERIFIED | `calder-product.liquid` | Gallery renders. `product-media-thumbs.liquid` manages thumbnails. | ⚠️ Single photo reused across all products. No angle shots. | P1 |
| Product info (title/code/badge) | CODE-VERIFIED | `calder-product.liquid` | Design code + nickname badge renders (`custom.design_code`, `custom.design_nickname`). | ✅ OK | — |
| Size / Finish selection | CODE-VERIFIED | Variant picker in calder-product | 3 variants × 3 finishes exist in Shopify. | ⚠️ Configurator supports 5 finishes, variants only have 3. | P2 |
| Shopify variant sync | CODE-VERIFIED | Product metafields | Variant map in metafields. | UNVERIFIED sync with configurator. | P1 |
| Pricing | CODE-VERIFIED | | "Starting at $899 / wheel" renders. | ⚠️ Configured price may not update without API. | P1 |
| Availability | CODE-VERIFIED | | Shopify inventory tracking active. | ✅ OK | — |
| Add to cart | CODE-VERIFIED | Base variant add-to-cart via Lumia form. | ✅ Base variant works. Configured wheel ATC untested. | P1 |
| Configurator section | BROWSER-VERIFIED (per Oct 2 audit) | `wheel-configurator` block type in `calder-product.liquid` | ❌ Shows "Loading preview..." — API not connected. | P0 |
| Fitment finder on PDP | CODE-VERIFIED | `fitment-finder` section in `product.calder.json` | ❌ Selects don't populate — API not connected. | P0 |
| Spec table | CODE-VERIFIED | `calder-specs.liquid` | ⚠️ May be hardcoded (shows only 5×112). Products support multiple bolt patterns. | P1 |
| Save / Share controls | CODE-VERIFIED | Share button present in calder-product settings | ⚠️ Save Build NOT implemented. Share is generic social sharing. | P1 |
| Mobile layout | CODE-VERIFIED | Responsive | UNVERIFIED. | P2 |

**PDP Findings: P0=2, P1=6, P2=2**

### D. STANDALONE FITMENT PAGE

| Element | Status | Files | Evidence | Demo Impact | Priority |
|---------|--------|-------|----------|:----------:|:--------:|
| Template existence | CODE-VERIFIED | `templates/page.fitment-finder.json` exists. `sections/fitment-page.liquid` (278 lines). | ✅ Template and section exist. | ❌ Page returns 404 — not created in Shopify Admin. | P0 |
| Year/Make/Model/Trim selection | CODE-VERIFIED | `fitment-page.liquid` renders 4 dropdowns. | ⚠️ Cannot populate without API connection. | P0 |
| Vehicle data sources | CODE-VERIFIED | `fitment-data.liquid` sets empty fallback. API URL from theme settings. | ⚠️ API URL points to Cove Digital — UNVERIFIED reachable. | P0 |
| Fitment API | CODE-VERIFIED | `fitment_api_server.py` on port 8081. 40k+ model-years seeded. | ⚠️ UNVERIFIED running. | P0 |
| Compatibility results | CODE-VERIFIED | `fitment-results.liquid` (31 lines). | UNVERIFIED. | P1 |
| Navigation to compatible products | CODE-VERIFIED | Results should link to PDPs. | UNVERIFIED. | P1 |
| Unsupported vehicle handling | CODE-VERIFIED | Empty state logic. | UNVERIFIED. | P2 |

**Standalone Fitment Findings: P0=4, P1=2, P2=1**

### E. STANDALONE WHEEL BUILDER

| Element | Status | Files | Evidence | Demo Impact | Priority |
|---------|--------|-------|----------|:----------:|:--------:|
| Template existence | CODE-VERIFIED | `templates/page.build-your-wheel.json` exists. `sections/build-your-wheel-page.liquid` (765 lines). | ✅ Template and section exist. | ❌ Page returns 404 — not created in Shopify Admin. | P0 |
| Configurator initialization | CODE-VERIFIED | `wheel-configurator.liquid` included. CSS loaded. | UNVERIFIED without page live. API dependency. | P0 |
| Finish/option updates | CODE-VERIFIED | 3-dimension configurator model. | UNVERIFIED. | P0 |
| Pricing | CODE-VERIFIED | Configurator price calculation. | UNVERIFIED. | P1 |
| Add to cart behavior | CODE-VERIFIED | Cart property logic. | UNVERIFIED. | P1 |
| Save Build | CODE-VERIFIED | **NOT IMPLEMENTED.** | ❌ Missing entirely. | P1 |
| Share Build | CODE-VERIFIED | **NOT IMPLEMENTED.** | ❌ Missing entirely. | P1 |
| Responsive layout | CODE-VERIFIED | `build-your-wheel.css` present. | UNVERIFIED. | P2 |

**Standalone Builder Findings: P0=3, P1=3, P2=1**

### F. GALLERY

| Element | Status | Files | Evidence | Demo Impact | Priority |
|---------|--------|-------|----------|:----------:|:--------:|
| Vehicle gallery index | CODE-VERIFIED | `templates/page.vehicle-gallery.json`. `calder-vehicle-gallery.liquid`. | ✅ Code exists. | ❌ Page returns 404. | P0 |
| Wheel gallery index | CODE-VERIFIED | `templates/page.wheel-gallery.json`. `calder-wheel-gallery.liquid`. | ✅ Code exists. | ❌ Page returns 404. | P0 |
| Gallery detail | CODE-VERIFIED | `templates/page.gallery-build.json`. `calder-gallery-detail.liquid`. `metaobject.gallery_build.liquid`. | ✅ Code exists. | ❌ Page returns 404. | P0 |
| Vehicle/wheel information | CODE-VERIFIED | Gallery JSON templates have placeholder entries. | ⚠️ All images are empty. All links are empty. Content is placeholder only. | P2 |
| Shop This Fitment | CODE-VERIFIED | Not wired — gallery detail page not live. | ❌ Missing. | P1 |
| Customize This Wheel | CODE-VERIFIED | Not wired — gallery detail page not live. | ❌ Missing. | P1 |
| Specifications | CODE-VERIFIED | Not wired. | ❌ Missing. | P2 |

**Gallery Findings: P0=3, P1=2, P2=2**

### G. CART AND CHECKOUT

| Element | Status | Files | Evidence | Demo Impact | Priority |
|---------|--------|-------|----------|:----------:|:--------:|
| Cart page | CODE-VERIFIED | `templates/cart.json` with `main-cart-items.liquid` (469 lines). | ✅ Cart renders with line items, quantity controls, removal, subtotal, checkout button. | ✅ OK. Per-wheel pricing needs verification. | — |
| Cart drawer | CODE-VERIFIED | `sections/header-cart.liquid` present. | ✅ Header cart dropdown exists. | ✅ OK. | — |
| Add-to-cart functionality | CODE-VERIFIED | Lumia product form. | ✅ Base variant ATC works. | UNVERIFIED for configured wheel. | P1 |
| Quantity updates | CODE-VERIFIED | Lumia JS. | ✅ Standard behavior. | ✅ OK. | — |
| Pricing and totals | CODE-VERIFIED | `main-cart-items.liquid` renders correctly. | ⚠️ "Per Wheel / Each" pricing clarity requested by client — needs verification. | P2 |
| Checkout routing | CODE-VERIFIED | Standard Shopify. | ⚠️ **DEMO SAFETY CONCERN:** Checkout processes real payments. Must ensure test mode or password protection. | P0 |
| Empty cart | CODE-VERIFIED | Empty state with icon and continue shopping link. | ✅ OK. | — |
| Safe demo behavior | CODE-VERIFIED | Shopify password protection assumed. | ⚠️ UNVERIFIED. Must confirm store is password-protected. | P0 |

**Cart/Checkout Findings: P0=2, P1=1, P2=1**

### H. SHARED DESIGN SYSTEM

| Element | Status | Files | Evidence | Demo Impact | Priority |
|---------|--------|-------|----------|:----------:|:--------:|
| Header + footer consistency | CODE-VERIFIED | Lumia theme framework. | ✅ Consistent across templates. | P2 |
| Brand typography | CODE-VERIFIED | `_css-variables-root.css.liquid`, `calder-base.css.liquid`, `style.css` | Calder design tokens for typography, colors, spacing. | ✅ Visual-verification-required. | P2 |
| Colors and buttons | CODE-VERIFIED | Brand system. | ✅ Consistent. | P2 |
| Section spacing | CODE-VERIFIED | Global spacing settings. | ✅ OK. | P3 |
| Mobile navigation | CODE-VERIFIED | Lumia mobile nav. | UNVERIFIED. | P2 |
| Responsive breakpoints | CODE-VERIFIED | Lumia responsive framework. | UNVERIFIED. | P3 |
| Global CSS regressions | CODE-VERIFIED | Multiple modified CSS files. | RISK from recent changes. | P2 |

**Design System Findings: P0=0, P1=0, P2=4, P3=2**

### I. PRODUCT CATALOG

| Element | Status | Evidence | Demo Impact | Priority |
|---------|--------|----------|:----------:|:--------:|
| Demo products | CODE-VERIFIED | 5 products created: Apex 201, Vertex 202, Striker 203, Turbine 205, Vortex 207. | ✅ Products exist. | — |
| Product variants | CODE-VERIFIED | 3 sizes × 3 finishes = 9 variants each. | ⚠️ Configurator supports 5 finishes — mismatch. | P1 |
| Product images | CODE-VERIFIED | Single photo reused across all 5 products. | ❌ Noticeably broken. | P1 |
| Pricing | CODE-VERIFIED | MSRP + sale pricing set. | ✅ OK. | — |
| Inventory | CODE-VERIFIED | Shopify inventory tracking. | ⚠️ No BOM-based availability. | P2 |
| Vehicle compatibility | CODE-VERIFIED | Fitment specs in DB. | UNVERIFIED matching. | P1 |
| Incomplete product attributes | CODE-VERIFIED | Spec table may be hardcoded. | ⚠️ May show incorrect bolt pattern. | P1 |

**Catalog Findings: P0=0, P1=4, P2=1**

---

## 3. CRITICAL USER JOURNEYS

### Journey 1 — Retail Shopping
**Homepage → Collection → Product → Select Variant → Add to Cart → Cart**
- **Status:** PARTIAL
- **Broken step:** Product selection — variant picker works but product images are identical placeholder photos. Configurator shows "Loading preview..."
- **Demo classification:** P1 — visible but non-blocking for exploration
- **Files:** `calder-product.liquid`, `product.calder.json`, `templates/cart.json`

### Journey 2 — Vehicle Fitment
**Homepage → Fitment Finder → Select Vehicle → Compatible Products → Product**
- **Status:** FAIL (code) / UNVERIFIED (live)
- **Broken step:** Fitment finder API connectivity unverified. If API is down, the fitment tool shows empty selects. Standalone fitment page returns 404.
- **Demo classification:** P0 if 404 persists
- **Files:** `home-fitment.liquid`, `fitment-page.liquid`, `fitment-finder.js`, `fitment-data.liquid`

### Journey 3 — Product Configurator
**Product → Build Your Wheel → Configure → Add to Cart**
- **Status:** FAIL
- **Broken step:** Configurator shows "Loading preview..." — API not connected. Add to cart for configured wheel untested.
- **Demo classification:** P0
- **Files:** `wheel-configurator.liquid`, `configurator-api.js`, `configurator-app.js`

### Journey 4 — Standalone Builder
**Standalone Builder → Configure → Save/Share → Cart**
- **Status:** FAIL
- **Broken step:** Page returns 404. Builder not created in Shopify Admin. Save/Share not implemented.
- **Demo classification:** P0
- **Files:** `page.build-your-wheel.json`, `build-your-wheel-page.liquid`

### Journey 5 — Gallery
**Gallery Index → Gallery Detail → Shop/Customize**
- **Status:** FAIL
- **Broken step:** Gallery pages return 404. No images uploaded. No links anywhere.
- **Demo classification:** P0
- **Files:** `page.gallery.json`, `calder-gallery*.liquid`

---

## 4. RELEASE RECOMMENDATION: YELLOW (PROVISIONAL)

### Recommendation: YELLOW — Share with Disclosures

**Reasoning:** The core retail browsing experience (homepage → collection → product → cart) exists and is usable for exploration. Multiple pages return 404, but if the Shopify pages are created in Admin and templates assigned, the journeys improve significantly. The critical API dependency is unknown — if the Cove Digital servers are running, the configurator and fitment tools may work.

**However, the recommendation is PROVISIONAL because:**
- Live browser testing was not performed
- API connectivity to Cove Digital servers is unverified
- Shopify Admin page creation status is unverified

### Required Verification Before Sharing
1. Create all missing Shopify pages (gallery, fitment-finder, build-your-wheel, dealer pages)
2. Verify API health endpoints respond
3. Confirm Shopify password protection is active
4. Verify navigation CTA URLs resolve correctly
5. Add placeholder disclosure to client

### Critical Limitations to Disclose
- Product photos are placeholders — real photography not yet commissioned
- "Loading preview..." on configurator is an open issue
- Gallery has no real images yet
- Save/Share Build not implemented
- Social media links not configured
- Contact information is placeholder
- Several CTAs may lead to empty destinations

---

## 5. SUMMARY OF FINDINGS BY PRIORITY

| Priority | Count |
|:--------:|:-----:|
| **P0 — Demo Blocker** | **11** |
| **P1 — Fix Before Demo** | **20** |
| **P2 — Acceptable with Disclosure** | **20** |
| **P3 — Polish** | **5** |
| **DEFERRED (Dealer Portal)** | Multiple items |

### Top 5 Demo Blockers (P0)
1. **Missing Shopify pages** — 8+ page templates not created in Admin (404 errors)
2. **API connectivity unverified** — Configurator shows "Loading preview...", fitment selects don't populate
3. **Checkout safety** — Must confirm password protection prevents real transactions
4. **Gallery pages 404** — All gallery index/detail pages return 404
5. **Standalone builder 404** — Build Your Wheel page returns 404

---

*End of demo readiness audit.*