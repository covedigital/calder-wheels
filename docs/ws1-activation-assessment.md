# Calder Wheels — WS1 Activation Assessment

> **Date:** 2026-10-02
> **Live site:** `https://wvpnpr-t7.myshopify.com`
> **Branch:** `presentation-polish`
> **Context:** Reviewed against `docs/ws1-activation-guide.md`

---

## 1. Theme Code vs. Live Site — The Gap

The activation guide reports tasks as ✅ complete based on **code existing in the repository**. The live site tells a different story:

| Page | Code Exists? | Live Status | Gap |
|------|-------------|-------------|-----|
| Gallery | `page.gallery.json` | **404** | Page not created in Shopify Admin |
| Build Your Wheel | `page.configurator-api.liquid` | **404** | Page not created in Shopify Admin |
| Fitment Finder | Template exists in sections | **404** | Page not created in Shopify Admin |
| Dealer Program | `page.dealer-program.json` | **404** | Page not created in Shopify Admin |
| Dealer Apply | `page.dealer-apply.json` | **404** | Page not created in Shopify Admin |

**Root cause:** The theme templates are uploaded but the corresponding Shopify pages (Online Store → Pages) have not been created with matching handles. All homepage CTAs ("Build Yours" → `/pages/configurator`, "Find Your Fit" → `/pages/fitment`) are dead links.

---

## 2. Live Site Audit — What's Working vs. What Isn't

### 2.1 Homepage

| Element | Status | Notes |
|---------|--------|-------|
| Dark/luxury theme | ✅ | Lumia dark preset, Calder SVG logo, cream/gold accents |
| Hero section | 🟡 | "MADE WITH PRECISION" text renders; **hero image is a blank base64 SVG** |
| "Build Yours" CTA | ❌ | Links to `/pages/configurator` → 404 |
| "Find Your Fit" CTA | ❌ | Links to `/pages/fitment` → 404 |
| Gallery nav link | ❌ | No URL assigned |
| Fitment finder (homepage) | 🟡 | Dual tabs render; API likely disconnected (no vehicle data populates) |
| Social links | ❌ | All `#` — Instagram, Facebook, TikTok, YouTube unlinked |
| Contact phone | ❌ | Placeholder `+1-202-555-0158` |
| Newsletter signup | ✅ | Form present |
| "Most searched for today" | ❌ | Shows `PRODUCT` × 8 (Liquid placeholder text leaking) |
| Footer | ✅ | Branding, links, payment icons |

### 2.2 Collection Page (`/collections/frontpage`)

| Element | Status | Notes |
|---------|--------|-------|
| 5 products displayed | ✅ | Apex, Vertex, Striker, Turbine, Vortex all present |
| Series badges | ✅ | "3-PIECE FORGED WHEEL" badge on each |
| Price ranges | ✅ | MSRP + sale pricing shown |
| Product images | ❌ | **All 5 products use the same photo** (`201-2410_BK_Center_Polish_Barrel`) |
| Category cards | 🟡 | Rows show but use placeholder images (`wheel-mock-placeholder-1.png`, etc.) |
| Sort dropdown | ✅ | Featured, price, alphabetical, date |
| Faceted filters | ❌ | No bolt pattern, series, finish, or price range filter sidebar |
| Fitment finder | 🟡 | Tabs render; need API connection + richer Size search |
| Mobile responsive | ✅ | Lumia native |

### 2.3 PDP — Apex 201 (`/products/apex-201`)

| Element | Status | Notes |
|---------|--------|-------|
| Design nickname/code | ✅ | "201 · Apex" badge visible |
| Size selector | ✅ | 18×8.5, 20×9.5, 22×10.5 — 3 variants |
| Finish selector | ✅ | Gloss Black, Satin Silver, Brushed Titanium — 3 options |
| Spec table | 🟡 | Hardcoded — only shows 5×112 bolt pattern. Products likely support multiple patterns |
| Configurator section | ❌ | Renders shell but shows **"Loading preview..."** — API not connected |
| Configurator finish selectors | 🟡 | Dropdowns appear but show `—` (no defaults populated) |
| Fitment finder on PDP | ❌ | "Check Vehicle Fitment" UI present but selects don't populate (no API) |
| "See It in the Real World" | ❌ | Placeholder images with Lorem ipsum text |
| "Build Your Wheel" CTA | ❌ | "Request a Quote" and "Add Configured Wheel" are present but non-functional without API |
| Price calculation | ❌ | "Starting at $899 / wheel" renders but configured price never updates |
| Add to cart | 🟡 | Base variant add-to-cart works; configured wheel add-to-cart untested |
| Product photos | ❌ | Single photo reused — no angle shots, finish comparison, or hero imagery |
| Wishlist | ✅ | Present and functional |
| Share | 🟡 | Share button present but shows generic social sharing |

---

## 3. Activation Guide Claims — Verified vs. Overstated

### 3.1 True Positives (Code verified, matches reality)

| Claim | Status |
|-------|--------|
| 117 passing backend tests | ✅ Confirmed — 77 configurator + 40 fitment |
| 5 products created | ✅ Confirmed on live site |
| Metafields seeded | ✅ `calder-metafields.csv` verified (5 products, design_code, BOM, dealer pricing, etc.) |
| 35 composite PNGs | ✅ 70 PNGs (35 layered + 35 flat) in `shopify/assets/` |
| 40k+ NHTSA model-years | ✅ 40,341 rows in `fitment.db` |
| 1,958 fitment specs | ✅ Confirmed in database |
| 25 bolt patterns | ✅ Confirmed |
| Fitment engine tests | ✅ 40/40 passing |
| Configurator model tests | ✅ 77/77 passing |
| Dealer portal code | ✅ All sections, snippets, templates, assets exist |

### 3.2 Overstated or Unverified

| Claim | Reality |
|-------|---------|
| "Homepage layout" ✅ | ❌ Hero image is blank SVG. Multiple placeholder elements |
| "Dual gallery" ✅ | ❌ Gallery page returns 404. Code exists, not published |
| "Configurator PDP section" ✅ | 🟡 Shell renders. API disconnected — shows "Loading preview..." |
| "Fitment API server deployed" ✅ | ❌ Cannot verify. Live site shows no connected API |
| "API URLs set in theme" ✅ | ❌ Configurator + fitment both fail to load data |
| "Dealer landing page" ✅ | ❌ 404 — page not created in Admin |
| "Multi-step application form" ✅ | ❌ 404 — page not created in Admin |
| "PDP integration" for fitment | 🟡 Code exists but API not responding |
| "Finish matrix photography wired" | 🟡 PNGs uploaded but configurator can't reach API to serve them |

---

## 4. Your Specific Concerns — Assessment

### 4.1 Placeholder images and premium icons

**Confirmed.** Nearly every visual on the site is a placeholder:
- Hero image: Blank base64 SVG
- Product photos: Single image reused across all 5 products
- Category cards: `wheel-mock-placeholder-1/2/3.png`, `luxury-cars-mock-placeholder.png`
- PDP gallery: "See It in the Real World" uses `luxury-cars-mock-placeholder-4.png` with Lorem ipsum
- Cinematic banner on collection: `cinematic_automotive_editorial_photograph_of_a_high_end_matte_grey_sports.png`
- All scenic/lifestyle sections: `scenic-placeholder-01.jpg`, `scenic-cars-placeholder-01.jpg`

**What's needed per product:**
- Hero shot (hero product photo)
- Angle / ¾ view (shows depth and design)
- Detail close-up (finish texture, hardware, machining)
- Vehicle-mounted lifestyle (wheel on a car)
- Finish comparison strip (all finishes side-by-side)

15–20 photos minimum. The 35 composite layer PNGs serve the configurator preview, not the product gallery.

### 4.2 Product details / metafields / variants

**Metafields** are seeded with design codes, BOM, dealer pricing, MOQ, lead time — this is solid.

**Variants** need attention:
- Currently each product has 3 variants (18×8.5 / 20×9.5 / 22×10.5) × 3 finishes (Gloss Black / Satin Silver / Brushed Titanium) = 9 variants
- The configurator supports BK / BKUTI / SU / POLISH / CHROME (5 finishes) — but only 3 are set up as Shopify variants
- Bolt pattern is hardcoded to 5×112 in the spec table, but `fitment_manifest.py` defines 25 patterns

**What's needed:**
- Expand Shopify variants to match the 5 configurator finishes
- Make spec table dynamic (read from metafields or variant properties)
- Add bolt pattern as a variant option or dynamic metafield display

### 4.3 Premium product image gallery

**Not live.** `/pages/gallery` returns 404. Template `page.gallery.json` exists in the theme with a dual-gallery structure (Vehicle Gallery + Design Gallery). It needs:
1. Page created in Shopify Admin with handle `gallery`
2. Template `page.gallery` assigned
3. Real gallery images uploaded to replace the placeholder structure
4. The JSON template uses `section: 'index-gallery'` — verify the section renders correctly with real images

### 4.4 Standalone "Build Your Wheel" page

**Not live.** `/pages/configurator` returns 404. Template `page.configurator-api.liquid` exists. The homepage "Build Yours" CTA points here.

### 4.5 Standalone "Fitment Finder" page

**Not live.** `/pages/fitment` returns 404. The homepage "Find Your Fit" CTA and the nav "Find Your Fit" link both point here.

### 4.6 Collection page filters

**Not implemented.** The collection has a sort dropdown but no faceted filter sidebar. Shopify offers native filter configuration via:
- Online Store → Navigation → Filter configuration
- Product metafields (series, bolt pattern, finish type) can be registered as filterable options

**What's needed:**
- Register `custom.series`, `custom.bolt_pattern`, `custom.finish_type`, and price as filterable
- Style the filter sidebar to match the dark theme
- Enable multi-select filters (e.g., select both 5×112 and 5×114.3)

### 4.7 "Shop by Wheel Style" — TireRack-style search

The homepage fitment tool has two tabs:
- **By Vehicle** — Year → Make → Model → Generation (basic cascading, needs API)
- **By Wheel Style** — Currently has: Diameter, Width, Bolt Pattern, Finish dropdowns

TireRack's modal (`tirerack.com/modalPopups/changeSearchLayer.jsp?tab=size`) offers:
- Width dropdown (6.5"–14" in 0.5" increments)
- Aspect ratio dropdown (25–85)
- Diameter dropdown (13"–28")
- A rear tire size option for staggered fitments
- ZIP code input for local installer availability

**What's needed for parity:**
- Front/rear size option (staggered fitments are common in the performance market)
- Visual size reference (TireRack's tire dimension diagram)
- ZIP code → dealer locator integration (future)
- Real-time match count as selections change (JS-driven, no page reload)

---

## 5. New Feature: Save Build + Share Build

### 5.1 Why This Matters

The configurator is currently a dead-end interaction: the user selects finishes, sees a price, then adds to cart or leaves. **Save Build** and **Share Build** introduce retention loops and viral mechanics that drive sales:

| Feature | Mechanism | Sales Impact |
|---------|-----------|-------------|
| Save Build | Stored to customer account | User returns to complete purchase later. Reduces abandonment. |
| Share Build | Email / social link with rendered preview | Friend sees a configured wheel → clicks → enters configurator with that build pre-loaded |

### 5.2 Save Build — Requirements

**Storage:** Use Shopify customer metafields (`custom.saved_builds`) or a dedicated metafield namespace.

**Data payload per saved build:**
```json
{
  "id": "uuid-v4",
  "design_code": "201",
  "series": "three_piece",
  "center_finish": "BK",
  "barrel_finish": "POLISH",
  "hardware_finish": "CHROME",
  "diameter": 20,
  "width": 9.5,
  "bolt_pattern": "5x114.3",
  "sku": "WHEEL-20-GLOSSBLACK-POLISHED-CHROME",
  "price": 1299.00,
  "saved_at": "2026-10-02T14:30:00Z",
  "nickname": "My Dream Setup",
  "notes": "For the Mustang"
}
```

**UI elements:**
- "Save This Build" button below the configurator preview
- If user is not logged in → prompt to create account / log in
- "My Saved Builds" section in the customer account (`/account`)
- Load saved build → re-populates configurator selectors
- Delete / rename saved builds

**Implementation approach:**
- **Tier 1 (immediate):** `custom.saved_builds` JSON metafield on customer resource. Max ~50 builds per customer (metafield value limit). JS reads/writes via Shopify Storefront API or Cart API attributes.
- **Tier 2 (future):** Configurator API extended with `POST /api/configurator/builds/save` and `GET /api/configurator/builds/:customer_id` — stores in middleware DB. Enables analytics (most-saved builds, finish popularity).

### 5.3 Share Build — Requirements

**Shareable link format:**
```
https://wvpnpr-t7.myshopify.com/products/apex-201?build=201|BK|POLISH|CHROME|20|9.5|5x114.3
```

**Data flow:**
1. User clicks "Share This Build"
2. Modal opens with options: **Copy Link**, **Email**, **Facebook**, **X/Twitter**, **Pinterest**
3. Link encodes the full configuration state
4. Recipient opens the link → configurator JS parses URL params → pre-selects all finishes → renders preview

**URL encoding options:**

| Method | Example | Pros | Cons |
|--------|---------|------|------|
| Query params | `?design=201&center=BK&barrel=POLISH&hardware=CHROME` | Human-readable | Long URLs |
| Pipe-delimited | `?build=201|BK|POLISH|CHROME|20|9.5|5x114.3` | Compact | Opaque |
| Base64 JSON | `?config=eyJkZXIi...` | Full fidelity | Not editable |

**Recommended:** Use query params for v1. JS reads `URLSearchParams` on page load. If all required params present, auto-populate the configurator and trigger the preview render.

**Email share:**
- Opens `mailto:` with pre-populated body containing the build link and a text description:
  ```
  Check out this Calder wheel build I put together:
  Design: Apex 201
  Center: Gloss Black
  Barrel: Polished
  Hardware: Chrome
  Size: 20×9.5
  Link: [URL]
  ```
- Future: Dedicated `/api/share/email` endpoint on the configurator server for transactional email via Shopify or SendGrid

**Social share:**
- Use the platform's share intents:
  ```
  https://twitter.com/intent/tweet?text=...&url=...
  https://www.facebook.com/sharer/sharer.php?u=...
  https://pinterest.com/pin/create/button/?url=...&description=...
  ```
- **Critical:** Generate an OG image for social previews. The share link should render a server-side OG meta tag on the PDP that shows the configured wheel preview. This means the PDP Liquid template must read the build params and set `og:image` dynamically.

**OG image generation (for social previews):**
- `GET /api/configurator/preview?center=BK&barrel=POLISH&hardware=CHROME&design=201` → returns a PNG composite (server-side render of the 3 layers)
- Configure the PDP to use this as the `og:image` when build params are present
- This gives Facebook/Twitter/Pinterest a rendered wheel image in the share card

### 5.4 Implementation Order

| Phase | Scope | Time est. |
|-------|-------|-----------|
| Phase 1 | Save Build via customer metafields + account UI | 3–4 hrs |
| Phase 2 | Share Build URL with query param pre-population | 2–3 hrs |
| Phase 3 | Social share intents + OG image endpoint | 4–5 hrs |
| Phase 4 | Email share with formatted body | 1 hr |
| Phase 5 | Analytics tracking (most-saved, most-shared) | 2–3 hrs |

### 5.5 Required Code Changes

| File | Change |
|------|--------|
| `sections/wheel-configurator.liquid` | Add "Save Build" and "Share Build" buttons + modal markup |
| `assets/configurator-app.js` | Add save/load/share functions, URL param parser, OG image redirect |
| `assets/configurator-api.js` | Add `POST /api/configurator/builds/save` and `GET /api/configurator/builds/:id` endpoints |
| `snippets/configurator-data.liquid` | Expose customer metafield save/load |
| `sections/main-product.liquid` | Read `?build=` query params, set `og:image` for social preview |
| `sections/main-account.liquid` | Add "My Saved Builds" tab |
| `configurator/api_server.py` | Add preview composite endpoint (`GET /preview`), save/load build endpoints |
| `configurator/composite_preview.py` | Expose a server-side preview render function (already exists for local generation) |

---

## 6. Recommended Next Steps — Prioritized

### Phase 0: Fix the 404s (immediate — 1 hour)
| # | Task | Detail |
|---|------|--------|
| 1 | Create 5 Shopify pages | Admin → Pages → Create with handles: `gallery`, `configurator`, `fitment`, `dealer-program`, `dealer-apply` |
| 2 | Assign templates | Each page uses its corresponding `.json` or `.liquid` template |
| 3 | Add nav links | Assign Gallery URL in nav, ensure "Build Yours" and "Find Your Fit" CTAs work |

### Phase 1: Get the API connected (urgent — 2 hours)
| # | Task | Detail |
|---|------|--------|
| 4 | Verify Cove Digital servers | SSH into server, confirm both API processes are running on ports 8080/8081 |
| 5 | Verify nginx routing | Test `curl https://[domain]/api/configurator/health` and `/api/fitment/health` |
| 6 | Set theme API URLs | If already set, verify they resolve. The "Loading preview..." means the JS can't reach the API |
| 7 | Update fitment_data.liquid | If API URLs changed, update the snippet and re-publish theme |

### Phase 2: Real imagery (critical — ongoing)
| # | Task | Detail |
|---|------|--------|
| 8 | Commission product photography | 15–20 photos: hero, angle, detail, lifestyle, finish comparison per design |
| 9 | Replace all placeholder images | Upload new Shopify Files, update theme section settings |
| 10 | Replace hero image | The base64 SVG blank needs a real hero photo |
| 11 | Replace PDP gallery images | Remove Lorem ipsum — wire real vehicle-mounted wheel photos |

### Phase 3: Configurator + Fitment polish
| # | Task | Detail |
|---|------|--------|
| 12 | Fix configurator API connection | Debug why JS shows "Loading preview." Check CORS, endpoint URL, JS error console |
| 13 | Save Build (Phase 1) | Customer metafields + account UI |
| 14 | Share Build (Phase 2) | Query-param pre-population + social intents |
| 15 | Expand variants | Match the 5 configurator finishes in Shopify variants |
| 16 | Dynamic spec table | Read from metafields instead of hardcoded HTML |
| 17 | Expand Size search | TireRack-style cascading diameter/width/bolt pattern with Front/Rear option |
| 18 | Add collection filters | Register metafields as filterable in Shopify Admin |

### Phase 4: Dealer Dashboard (your stated next milestone)
| # | Task | Detail |
|---|------|--------|
| 19 | Dashboard | Stats, orders table, pending quotes — code exists, needs page to go live |
| 20 | Quick Order | SKU search, line items, PO#, submit — exists, needs page live |
| 21 | Invoices | Credit limit, outstanding, payment methods — exists, needs page live |
| 22 | Dealer gating | Exists but requires `dealer-approved` tag on customer accounts |
| 23 | Create real dealer accounts | For actual dealer onboarding, not just the test account |
| 24 | Wire application to backend | Currently client-side only. Needs email notification to admin |

---

## 7. Project Status Summary

| Area | Code Complete | Live & Working | Gap |
|------|:------------:|:--------------:|:---:|
| Theme framework (Lumia 7.0.1) | 100% | 95% | Hero image, social links |
| Wheel catalog + collection | 100% | 70% | Photos, filters, specs |
| Configurator | 95% | 20% | API disconnected, save/share missing |
| Fitment finder | 95% | 10% | API disconnected, pages 404 |
| Gallery | 100% | 0% | Page 404, needs real images |
| Dealer Portal Phase 1 | 100% | 0% | Pages 404, no live dealer accounts |
| Dealer Portal Phase 2 | 70% | 0% | Blocked by Phase 1 |
| Dealer Portal Phase 3 | 50% | 0% | Blocked by Phase 1 + WS2 (QuickBooks) |
| SEO / AEO | 0% | 0% | Not started |
| Save Build / Share Build | 0% | 0% | New requirement |
| Real photography | 0% | 0% | Not commissioned |

The activation guide is a valuable code inventory but overstates the live deployment state. The codebase is well-structured — the next development work is primarily wiring, imagery, and the Save/Share Build feature before moving to the Dealer Dashboard milestone.

---

## 8. Gallery Architecture — Vossen Analysis + Calder Implementation

### 8.1 Vossen Gallery System — Reference Architecture

Vossen runs two parallel gallery indexes on WordPress:

```
/wheel-galleries/   →  Wheel Gallery (warehouse/product photography)
/vehicle-galleries/ →  Vehicle Gallery (on-car lifestyle photography)
```

Each gallery item is a WordPress custom post under `/galleries/{series}-{design}-{variant}/`. The taxonomy is Series → Design → Finish Variant, with multiple photo sets per design across different finishes.

**Gallery index page structure:**

```
┌─────────────────────────────────────────┐
│  WHEEL GALLERY         Filter [▼]       │
│                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐│
│  │ VPS-1   │  │ GEN-22  │  │ G2-14   ││
│  │ Patina  │  │ Dark    │  │ Gloss   ││
│  │ Gold    │  │ Smoke   │  │ Clear   ││
│  │ 📷      │  │ 📷      │  │ 📷      ││
│  │ Forged: │  │ Forged: │  │ Forged: ││
│  │ VPS     │  │ GEN     │  │ G2      ││
│  └─────────┘  └─────────┘  └─────────┘│
└─────────────────────────────────────────┘
```

Each card shows:
- Thumbnail (620×415, 300×200 for grid)
- Camera icon overlay ("has photos" indicator)
- Design name link
- Series name badge (e.g. "Forged: VPS Series")
- Finish name label

**Individual gallery page structure:**

```
┌─────────────────────────────────────────────┐
│  Hero image (2000×1333, full-width)          │
├─────────────────────────────────────────────┤
│  ◀ ◼ ◼ ◼ ◼ ◼ ◼ ◼ ◼ ◼ ◼ ◼ ◼ ▶  (thumbnail) │
├─────────────────────────────────────────────┤
│  VPS Series: VPS-1                           │
│  # VPS-1                                     │
│  [Expand gallery]  [Wheel specs →]           │
├─────────────────────────────────────────────┤
│  Wheel Model VPS-1                           │
│  [Request a Quote]  [Wheel Details]          │
├─────────────────────────────────────────────┤
│  Finish Options                              │
│  [swatch]  Patina Gold — Transparent Brushed │
├─────────────────────────────────────────────┤
│  VPS-1 Galleries (related finishes/variants) │
│  [thumb] [thumb] [thumb] [thumb] [thumb]    │
├─────────────────────────────────────────────┤
│  [View VPS-1 Vehicle Gallery]               │
│  [View VPS-1 Wheel Gallery]                 │
├─────────────────────────────────────────────┤
│  Request A Quote (form with vehicle picker)  │
└─────────────────────────────────────────────┘
```

**Key structural patterns to replicate:**

| Pattern | Vossen Implementation | Notes |
|---------|----------------------|-------|
| Two gallery types | Vehicle + Wheel (separate indexes) | Vossen photographs every build in their warehouse and every customer car on location |
| Series → Design → Finish taxonomy | Wordpress custom post type with categories | Each gallery item is one design in one finish |
| Multiple photos per set | 8–16 photos per gallery (2000×1333 full + 620×415 thumb + 300×200 tiny thumb) | Shows wheel from every angle |
| Cross-linking | "View X Vehicle Gallery" links filter the other index by series | Keeps vehicle + wheel galleries connected |
| Finish swatch + name | Image swatch + finish description below hero | Lets users compare finishes visually |
| Related galleries | "VPS-1 Galleries" strip shows same design in other finishes | Exit pathway to keep browsing |
| Quote form at bottom | Embedded Gravity Form with vehicle make/year/model picker | Conversion touchpoint on every gallery |
| Camera icon overlay | Small SVG on each card thumbnail | Signals "this has photos" without clicking |

### 8.2 Existing Calder Gallery Code

The current `page.gallery.json` template already has a dual-gallery structure:

- **Vehicle Gallery section** — 5 placeholder entries (BMW M3, Porsche 911, Toyota Supra, Mercedes C63, Ford Mustang)
- **Design Gallery section** — 5 entries for Calder designs (201 Apex through 207 Vortex)

Both use the `index-gallery.liquid` section — a masonry/grid layout with heading, column settings, and image blocks. Each block has: `image`, `title`, `description`, `link`, and `color_placeholder` (fallback background if no image).

**What exists (code, not live):**
- `page.gallery.json` — dual-gallery template structure
- `index-gallery.liquid` — masonry grid section (1124 lines, fully featured)
- `gallery.css` — grid styling
- `gallery-rtl.css` — RTL support
- `gallery.js` — JavaScript for masonry layout

**What's missing vs. Vossen:**
1. No individual gallery detail pages (per-design photo sets)
2. No filtering by series, finish, or vehicle type
3. No camera icon overlays
4. No related gallery cross-linking
5. No finish swatches in the gallery
6. No quote form integration at gallery level
7. All links are empty (`""`) — no navigation anywhere
8. No real images uploaded — all use `color_placeholder` fallbacks

### 8.3 Calder Gallery Implementation Plan

#### Phase 1 — Gallery Index Pages (Wheel Gallery + Vehicle Gallery)

**Goal:** Get `page.gallery.json` live with real images and working navigation.

**Changes needed:**

| File | Change |
|------|--------|
| `templates/page.gallery.json` | Replace placeholder images with real uploaded Shopify file URLs. Fill `link` fields pointing to new gallery detail pages (Phase 2). Add series/finish badge overlays in the image alt text or description |
| `sections/index-gallery.liquid` | Add optional "series badge" and "finish label" overlay render block. Add camera icon overlay when images are present. Add filter strip at top when `filter_enabled` setting is on |
| `assets/gallery.css` | Add overlay styles (badge, series label, camera icon). Add filter bar styles |
| `assets/gallery.js` | Add filter-by-series logic (hide/show masonry items based on data attributes) |
| Shopify Admin | Create page with handle `gallery` using template `page.gallery` |
| Navigation | Assign Gallery URL in nav (currently has no URL) |

**Data attribute approach for filtering:**
```liquid
{% for block in section.blocks %}
  <div class="gallery-item"
       data-series="{{ block.settings.series }}"
       data-finish="{{ block.settings.finish }}"
       data-vehicle="{{ block.settings.vehicle_make }}">
    <!-- image, title, overlay -->
  </div>
{% endfor %}
```

**Filter bar UI:**
```
┌──────────────────────────────────────┐
│  All  │  Forged  │  3-Piece  │  …  │
├──────────────────────────────────────┤
│  All Finishes  │  Gloss Black  │  …  │
└──────────────────────────────────────┘
```

**Setting additions to `index-gallery.liquid`:**
```json
{
  "type": "checkbox",
  "id": "enable_filter",
  "label": "Show filter bar",
  "default": false
},
{
  "type": "select",
  "id": "gallery_type",
  "label": "Gallery type",
  "options": [
    {"value": "mixed", "label": "Mixed"},
    {"value": "vehicle", "label": "Vehicle Gallery"},
    {"value": "wheel", "label": "Design Gallery"}
  ],
  "default": "mixed"
}
```

**Time estimate:** 2–3 hours

#### Phase 2 — Gallery Detail Pages

**Goal:** Individual pages per design/finish showing a full photo set, product link, and related galleries.

**Architecture decision:** Shopify doesn't have WordPress-style custom post types. Options:

| Approach | Pros | Cons | Recommendation |
|----------|------|------|---------------|
| Shopify blog articles | Built-in pagination, tags for filtering, JSON template | Blog URL prefix `/blogs/news/` not ideal | ❌ — URL structure is wrong |
| Shopify pages with per-design templates | Clean URLs `/pages/designs/apex-201` | Need 1 page per gallery × 5 designs × N finishes = dozens of pages | 🟡 — High maintenance |
| **Metafield-driven dynamic page** | Single template `page.gallery-detail` reads `?design=201&finish=BK` from URL and renders photos from metafields | Fully data-driven, zero page creation needed | ✅ **Recommended** |

**Recommended approach — query-param driven detail page:**

URL format: `/pages/gallery?design=201&finish=BK`

The template reads the params and:
1. Looks up the design from the metafields or a Liquid data object
2. Renders the hero image, thumbnail strip, spec summary, and related galleries
3. Provides "Add to cart" / "Request Quote" CTAs

**Required files:**

| File | Action |
|------|--------|
| `templates/page.gallery-detail.liquid` | New template — reads `?design=` and `?finish=` params, renders full gallery detail page |
| `snippets/gallery-detail-hero.liquid` | Hero image + thumbnail strip |
| `snippets/gallery-detail-meta.liquid` | Design name, series, finish, spec summary |
| `snippets/gallery-detail-related.liquid` | Related galleries (same design, different finishes) |
| `snippets/gallery-detail-quote.liquid` | Embedded quote form for this build |
| `assets/gallery-detail.css` | Styling for the detail page |
| `assets/gallery-detail.js` | Thumbnail navigation, lightbox, finish switcher |
| Shopify Admin | Create single page with handle `gallery` (same page, different view) |

**Data source for gallery images:**

Store gallery photos as product metafields. Each product already has metafields — add a new namespace:

```json
{
  "custom.gallery_images": [
    {"src": "design-201-glory-shot.jpg", "alt": "Apex 201 — hero"},
    {"src": "design-201-angle.jpg", "alt": "Apex 201 — angle view"},
    {"src": "design-201-detail.jpg", "alt": "Apex 201 — finish close-up"}
  ],
  "custom.gallery_vehicle_images": [
    {"src": "bmw-m3-apex-201-1.jpg", "alt": "BMW M3 on Apex 201"},
    {"src": "porsche-911-apex-201-1.jpg", "alt": "Porsche 911 on Apex 201"}
  ]
}
```

Alternatively, store the photo sets as a Shopify JSON page template with blocks — but that becomes unmanageable at scale. Metafields keep the data with the product where it belongs.

**Time estimate:** 4–6 hours

#### Phase 3 — Vossen-Parity Gallery Polish

| Feature | Detail | Time est. |
|---------|--------|-----------|
| Camera icon overlay on grid cards | Small SVG when `gallery_images` metafield has entries | 0.5 hr |
| Series/finish badge on card | Overlay text in the bottom-left corner of thumbnails | 0.5 hr |
| Filter bar with live JS filtering | Hide/show masonry items by series/finish/vehicle | 1 hr |
| Finish swatch in gallery meta | Render the finish swatch image (already exists in composite set) next to the finish name | 0.5 hr |
| Related galleries at bottom of detail | "Also available in Gloss Black / Satin Silver" with thumbnails | 1 hr |
| Quote form embedding | Reuse the existing dealer-quote snippet or add a simple email form | 1 hr |
| Lightbox for full-size images | Click thumbnail → full-size overlay with prev/next navigation | 2 hr |
| Cross-link to fitment finder | "See this wheel on your vehicle" button → fitment finder with design pre-selected | 0.5 hr |

**Time estimate (Phase 3 total):** 6–8 hours

### 8.4 Gallery Page — Template Detail Structure

```
┌──────────────────────────────────────────────────┐
│  Navigation breadcrumb: Home / Gallery / Apex    │
├──────────────────────────────────────────────────┤
│                                                    │
│  ┌──────────────────────────────────────────┐     │
│  │                                          │     │
│  │        HERO IMAGE (2000×1333)            │     │
│  │                                          │     │
│  └──────────────────────────────────────────┘     │
│                                                    │
│  ◻ ◻ ◻ ◻ ◻ ◻ ◻ ◻  (thumbnail strip)              │
│                                                    │
│  ┌──────────────┐  ┌──────────────────────────┐   │
│  │  201 · APEX  │  │  3-PIECE FORGED          │   │
│  │              │  │  Gloss Black + Polished   │   │
│  │  [swatch]    │  │  Chrome Hardware          │   │
│  │              │  │                          │   │
│  │  $1,299/wheel│  │  [Add to Cart] [Quote]   │   │
│  └──────────────┘  └──────────────────────────┘   │
│                                                    │
│  ┌──────────────────────────────────────────┐     │
│  │  SPECIFICATIONS                          │     │
│  │  Diameter: 20"  Width: 9.5"             │     │
│  │  Bolt Pattern: 5×114.3  Offset: +35     │     │
│  │  Construction: 3-Piece Forged 6061-T6    │     │
│  │  Load Rating: 1,600 lbs  Weight: 24.5   │     │
│  └──────────────────────────────────────────┘     │
│                                                    │
│  ┌──────────────────────────────────────────┐     │
│  │  Also available in:                      │     │
│  │  [Gloss Black] [Satin Silver] [Titanium] │     │
│  └──────────────────────────────────────────┘     │
│                                                    │
│  ┌──────────────────────────────────────────┐     │
│  │  See It on Your Vehicle                  │     │
│  │  [Open Fitment Finder →]                │     │
│  └──────────────────────────────────────────┘     │
│                                                    │
│  ┌──────────────────────────────────────────┐     │
│  │  Related Galleries                       │     │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐    │     │
│  │  │Vtx │ │Str │ │Tur │ │Vtx │ │Apx │    │     │
│  │  │202 │ │203 │ │205 │ │207 │ │201 │    │     │
│  │  └────┘ └────┘ └────┘ └────┘ └────┘    │     │
│  └──────────────────────────────────────────┘     │
│                                                    │
│  ┌──────────────────────────────────────────┐     │
│  │  [View Vehicle Gallery] [View All Wheels]│     │
│  └──────────────────────────────────────────┘     │
│                                                    │
└──────────────────────────────────────────────────┘
```

### 8.5 Photography Requirements for Gallery Launch

To match Vossen's production quality, Calder needs:

| Shot Type | Per Design | Total (5 designs) | Use Case |
|-----------|-----------|------------------|----------|
| Hero / hero product | 1 | 5 | Gallery hero, PDP main image |
| Angle / ¾ view | 2–3 | 10–15 | Gallery thumbnails, collection cards |
| Detail close-up | 2 | 10 | Finish texture, CNC machining, hardware |
| Wheel on vehicle (lifestyle) | 3–5 per popular vehicle | 15–25 | Vehicle gallery, PDP "See It in the Real World" |
| Finish comparison strip | 1 per finish × 5 finishes | 5 composites or 25 individual | Gallery finish selector, PDP finish picker |
| Process / manufacturing | 3–5 | 3–5 | Engineering page, social content |

**Total:** ~60–85 photos for a launch-quality gallery. Vossen has 10,000+ — Calder launches with a curated set and grows organically.

**File naming convention (matching Vossen's discipline):**
```
calder-{design}-{finish}-{shot-type}-{sequence}.{ext}
```
Examples:
```
calder-201-bk-hero-01.jpg
calder-201-bk-angle-01.jpg
calder-201-bk-detail-01.jpg
calder-201-bk-bmw-m3-lifestyle-01.jpg
```

### 8.6 Gallery Implementation — Updated Phase Plan

| Phase | Scope | Time est. | Depends on |
|-------|-------|-----------|------------|
| 3a | Create gallery page in Shopify Admin + assign template | 0.5 hr | Admin access |
| 3b | Upload real gallery images as Shopify Files | 1 hr | Photography completed |
| 3c | Update `page.gallery.json` with real URLs + navigation links | 1 hr | Images uploaded |
| 3d | Add filter bar to `index-gallery.liquid` (series/finish filtering) | 2 hr | — |
| 3e | Build `page.gallery-detail.liquid` with query-param rendering | 4 hr | — |
| 3f | Add `custom.gallery_images` metafield definitions + seed data | 1 hr | — |
| 3g | Build gallery detail page: hero, thumbnails, specs, related | 3 hr | Phase 3e |
| 3h | Add camera icon overlay + series badge to grid cards | 1 hr | — |
| 3i | Add lightbox for full-size image viewing | 2 hr | Phase 3e |
| 3j | Wire quote form to gallery detail pages | 1 hr | Phase 3e |
| 3k | Cross-link gallery ↔ fitment finder ↔ configurator | 1 hr | API connected |

**Total gallery work:** ~16–18 hours across all phases. Photography is the gating dependency — without real images, the gallery structure is invisible.

---

## 9. Updated Project Status Summary

| Area | Code Complete | Live & Working | Gap |
|------|:------------:|:--------------:|:---:|
| Theme framework (Lumia 7.0.1) | 100% | 95% | Hero image, social links |
| Wheel catalog + collection | 100% | 70% | Photos, filters, specs |
| Configurator | 95% | 20% | API disconnected, save/share missing |
| Fitment finder | 95% | 10% | API disconnected, pages 404 |
| Gallery (grid index) | 100% | 0% | Page 404, needs real images |
| Gallery (detail pages) | 0% | 0% | Needs Phase 2 buildout |
| Gallery (filtering, lightbox, swatches) | 0% | 0% | Needs Phase 3 polish |
| Save Build + Share Build | 0% | 0% | New requirement |
| Dealer Portal Phase 1 | 100% | 0% | Pages 404, no live dealer accounts |
| Dealer Portal Phase 2 | 70% | 0% | Blocked by Phase 1 |
| Dealer Portal Phase 3 | 50% | 0% | Blocked by Phase 1 + WS2 (QuickBooks) |
| SEO / AEO | 0% | 0% | Not started |
| Real photography | 0% | 0% | Not commissioned |

## 10. Complete Recommended Build Order

| Order | Milestone | Est. Time | Key Tasks |
|:-----:|-----------|:---------:|-----------|
| 1 | **Fix 404s** | 1 hr | Create 5 Shopify pages for gallery, configurator, fitment, dealer-program, dealer-apply |
| 2 | **Wire APIs** | 2 hr | Verify Cove Digital servers, fix "Loading preview...", confirm fitment API responds |
| 3 | **Commission photography** | Ongoing | 60–85 photos across 5 designs (hero, angle, detail, lifestyle, finish comparison) |
| 4 | **Replace all placeholders** | 2 hr | Hero, category cards, social links, contact info, Lorem ipsum sections |
| 5 | **Gallery Phase 1** | 2 hr | Index page live with real images, filter bar, navigation links |
| 6 | **Save Build + Share Build** | 5 hr | Customer metafields, account UI, URL pre-population, social intents |
| 7 | **Gallery Phase 2** | 5 hr | Gallery detail pages with query-param rendering, thumbnails, specs, related galleries |
| 8 | **PDP polish** | 3 hr | Dynamic spec table from metafields, expand variants to match configurator finishes |
| 9 | **Collection filters** | 2 hr | Register metafields as filterable, style filter sidebar |
| 10 | **Size search (TireRack parity)** | 3 hr | Cascading diameter/width/bolt pattern with front/rear option |
| 11 | **Gallery Phase 3** | 6 hr | Camera icon overlay, lightbox, finish swatches, quote form, cross-links |
| 12 | **Dealer Dashboard** | 8 hr | Dashboard, Quick Order, Invoices — all code exists, needs pages live, accounts created, application wired |

**Total remaining work (excluding photography):** ~30–35 hours. Photography is the critical path — it blocks Phase 4 (gallery imagery), Phase 8 (PDP product photos), and Phase 11 (gallery detail). Starting photography earliest is recommended even if other Phase 0–1 work begins in parallel.