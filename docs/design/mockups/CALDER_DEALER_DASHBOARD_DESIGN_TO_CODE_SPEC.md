# CALDER DEALER DASHBOARD — DESIGN-TO-CODE SPECIFICATION

**Reference:** `Calder - 6 - Dealer Dashboard(4).png`  
**Reference canvas:** 1536 × 1024 px, desktop  
**Purpose:** Text-only, image-independent implementation contract for OpenCode / DeepSeek.  
**Status:** Screenshot-derived measurements are target approximations (±4 px unless otherwise specified), not DOM measurements. Verify in browser.  
**Important:** Actual theme source files are not supplied with this companion-file request. File names below are known from the project handoff, but selectors marked **PROPOSED** must be reconciled with the actual Liquid markup before implementation. Do not blindly rename existing hooks.

## 1. Global desktop geometry

Coordinate origin is top-left of the 1536 × 1024 reference. All coordinates below are screenshot pixels, not device-independent browser guarantees.

| Region | Target bounds (x, y, width, height) | Notes |
|---|---|---|
| Left sidebar | 0, 0, 207, 1024 | Fixed-looking full-height navy rail; content may scroll on shorter viewports |
| Main application | 207, 0, 1329, 1024 | Light gray-white background |
| Topbar | 207, 0, 1329, 55 | White, subtle lower border |
| Hero | 207, 55, 1329, 215 | Photographic background; copy left |
| KPI overlay | 237, 233, 1270, 101 | White elevated card overlaps hero lower edge |
| Quick actions header | 239, 355, 1267, 19 | Heading left, support link right |
| Quick actions cards | 239, 381, 1268, 69 | Four equal columns, ~13 px gaps |
| Main content row | 228, 469, 1287, 272 | Recent orders left ~830 px; tracker right ~445 px; ~11 px gap |
| Bottom content row | 228, 750, 1287, 233 | Recent activity left ~578 px; featured wheels right ~699 px; ~10 px gap |

**Content grid:** Main cards use ~21–32 px horizontal insets from application edge. Cards have white backgrounds, very subtle shadow, and 2–4 px corners. At the reference width, preserve two-column rows rather than collapsing.

**Stacking:** sidebar 20; topbar 15; hero 1; KPI card 5; content normal. Avoid sticky topbar obscuring hero content.

## 2. Color and typography tokens

Use existing Calder global tokens if present; add scoped aliases only when necessary. Screenshot color sampling is approximate.

| Token | Target | Usage |
|---|---|---|
| `--dealer-navy` | `#081D2D` | Sidebar base, primary CTA |
| `--dealer-ink` | `#071936` | Main headings, text |
| `--dealer-blue` | `#0E2A3E` | Brand navy and links |
| `--dealer-gold` | `#C2A48A` | Active rail, badges, warm accents |
| `--dealer-copper` | `#8B4D29` | Arrow links, icons, headings |
| `--dealer-canvas` | `#F6F8FA` | Main background |
| `--dealer-white` | `#FFFFFF` | Cards |
| `--dealer-border` | `#E0E6ED` | Hairline borders |
| `--dealer-muted` | `#52617A` | Secondary text |
| `--dealer-green` | `#16783B` | Good standing |

**Fonts:** Use Calder's existing Garet for UI and Facundo for headings when available; use Poppins or system sans fallback. Do not fetch or replace fonts globally. Topbar organization name ~13 px bold uppercase. Hero title ~38–40 px bold, tight line-height (~0.98), uppercase. Section headings ~13 px bold uppercase with 1.3 px tracking. Standard table text ~10–11 px. Sidebar labels ~12 px. Large KPI values ~28 px bold.

## 3. Sidebar: `sections/dealer-sidebar.liquid`

**Bounds:** 207 px wide, viewport-height minimum. Background dark navy with subtle photographic mountain/forest treatment in bottom ~260 px. Logo centered in top 0–114 px: white circular Calder monogram ~48 px, CALDER wordmark ~116 px wide, WHEELS tracking beneath. `DEALER PORTAL` gold label centered near y=132.

**Navigation:** Active Dashboard row y=158–198, height 40 px, dark translucent highlight and 5 px gold left indicator. Subsequent rows ~39–40 px: Catalog, Quick Order, Orders, Quotes, Invoices, Returns, Marketing Assets. Account divider/title at y~500; rows Account, Users, Notifications. Second divider around y=664; Dealer Support and Log Out near y=700 and y=741. Icons ~17–19 px, white outline; active icon gold.

**Bottom tagline:** `A HIGHER STANDARD TOGETHER.` three lines, white uppercase tracking, x~36, y~903; short gold line beneath. Preserve legibility over photography.

**Suggested hooks (PROPOSED):** `.dealer-sidebar`, `.dealer-sidebar__brand`, `.dealer-sidebar__nav`, `.dealer-sidebar__link`, `.dealer-sidebar__link.is-active`, `.dealer-sidebar__account-heading`, `.dealer-sidebar__footer`. Reuse existing classes/data attributes and route destinations where already present. Active link must be derived from the current route, not permanently hard-coded.

## 4. Topbar: `sections/dealer-topbar.liquid`

55 px tall, white. Organization selector at x~241 with `DOWNTOWN MOTORWORKS` and down-chevron. Vertical separator x~500. Tier badge x~513–638: `TIER 2 DEALER`, tan fill. Payment badge x~651–725: `NET-30`, pale gray. Status badge x~736–936: green dot + `ACCOUNT IN GOOD STANDING`.

Right controls: bell around x=1243 with small gold notification dot; separator x~1288; circular dark avatar ~36 px at x=1312, initials `DM`; adjacent user `John Carter`, smaller organization `Downtown Motorworks`; down-chevron x~1508. Flex spacing must prevent collision. Badges are informational unless actual corresponding workflows exist.

**Suggested hooks (PROPOSED):** `.dealer-topbar`, `.dealer-topbar__organization`, `.dealer-topbar__tier`, `.dealer-topbar__terms`, `.dealer-topbar__standing`, `.dealer-topbar__notifications`, `.dealer-topbar__profile`.

## 5. Hero: `sections/dealer-hero.liquid`

Hero y=55–270, full main width. Background image: luxury black vehicle with prominent bronze/gold multi-spoke wheel on RIGHT, mountainous lake backdrop center, brighter white/gray left for readable copy. Use a real licensed/client-approved asset; do not fake the exact photograph with CSS. Background cover, center/right focal positioning. Add gradient overlay left to right from translucent off-white to transparent. Avoid text over the wheel.

Text x~242, y~86: gold eyebrow `DEALER PORTAL` (~13 px uppercase, 2 px tracking); headline `WELCOME BACK,` then `DOWNTOWN MOTORWORKS` in two lines, x~242 y~111, ~39 px bold; subtitle `Your Calder account, orders, and dealer activity at a glance.` x~242 y~194, ~17 px. Right edge over dark vehicle: three-line uppercase brand statement `BUILT / FOR THOSE / WHO MOVE / THE INDUSTRY / FORWARD.` around x=1385, y=112; short gold rule below. At narrow desktop widths, hide this decorative slogan before allowing overlap with the title.

**Suggested hooks (PROPOSED):** `.dealer-hero`, `.dealer-hero__eyebrow`, `.dealer-hero__title`, `.dealer-hero__subtitle`, `.dealer-hero__tagline`.

## 6. KPI strip: dashboard template or dashboard summary section

Single white card x=237 y=233 w=1270 h=101, light shadow; four equal KPI cells with vertical dividers. Cell left padding ~16 px. Each has light-gray 65×68 px icon tile and text stack. Icons ~28 px copper/navy.

1. `OPEN ORDERS` / `5` / `$18,746` / right arrow.
2. `IN PRODUCTION` / `3` / `View Production` with arrow.
3. `PENDING QUOTES` / `3` / `$9,350`.
4. `AVAILABLE CREDIT` / `$34,250` / `of $75,000` / progress bar and `46%`.

Credit percentage is rounded from 34,250 / 75,000 (~45.7%). When connected to actual data, calculate rather than hard-code. These numbers are **visual seed data**, never claimed as actual dealer account data. Seed-data presentation must be clearly distinguished in development/staging and never shown as real financial/account records to production users.

**Suggested hooks (PROPOSED):** `.dealer-kpis`, `.dealer-kpi`, `.dealer-kpi__icon`, `.dealer-kpi__label`, `.dealer-kpi__value`, `.dealer-kpi__detail`, `.dealer-kpi__progress`.

## 7. Quick actions: dashboard template / `sections/dealer-quick-order.liquid` where applicable

Heading `QUICK ACTIONS` at x~239 y~357; right support link `NEED HELP? Contact Dealer Support →`. Four action cards y=381–450, each ~299–300 px wide, 69 px high, ~13 px gap. First is navy with thin gold border: cart icon, `QUICK ORDER`, `Add products by SKU or search`, gold arrow. Remaining white with subtle border: wheel icon `BROWSE CATALOG`, `Find wheels for your customers`; document icon `CREATE QUOTE`, `Build and send a custom quote`; list icon `VIEW ORDERS`, `Track and manage your orders`. Each icon ~30 px, left inset ~18 px; title ~12 px bold uppercase, supporting line ~11 px; arrow at right.

All four cards must be full keyboard-accessible links/buttons to real routes/actions. Disabled or unavailable functions must not look like functioning links.

**Suggested hooks (PROPOSED):** `.dealer-quick-actions`, `.dealer-action-card`, `.dealer-action-card--primary`, `.dealer-action-card__icon`, `.dealer-action-card__copy`, `.dealer-action-card__arrow`.

## 8. Recent orders: dashboard section / order-related Liquid file

White card x=228 y=469 w~830 h=272. Heading x~241 y~484 `RECENT ORDERS`; right link `View All Orders →`. Table top ~504, columns `Order #`, `PO #`, `Order Date`, `Vehicle / Application`, `Items`, `Total`, `Status`, `Action`. Light gray header row ~34 px; five data rows ~35 px each, subtle separators.

| Order | PO | Date | Vehicle | Items | Total | Status |
|---|---|---|---|---:|---:|---|
| CW-1057 | DMX-5125 | Sep 12, 2026 | 2025 BMW M4 Competition | 4 | $8,760 | IN PRODUCTION |
| CW-1054 | DMX-5119 | Sep 10, 2026 | Porsche 911 | 2 | $4,250 | FINISHING |
| CW-1052 | DMX-5108 | Sep 08, 2026 | Audi RS6 | 4 | $7,980 | QUALITY CHECK |
| CW-1049 | DMX-5097 | Sep 05, 2026 | Mercedes-AMG C63 | 2 | $3,920 | PREPARING TO SHIP |
| CW-1045 | DMX-5081 | Sep 01, 2026 | BMW X5 | 4 | $6,540 | SHIPPED |

Status pill colors: production light blue, finishing pale gold, quality light slate, preparing lilac, shipped mint. Action label `View →` per row. Values are **staging seed data**. Table must support horizontal scroll on small widths, without truncating identifiers or dropping columns silently. Link each row only to an existing valid order-detail route; no fabricated order endpoint.

**Suggested hooks (PROPOSED):** `.dealer-recent-orders`, `.dealer-orders-table`, `.dealer-order-status`, `.dealer-order-status--production`, `--finishing`, `--quality`, `--preparing`, `--shipped`.

## 9. Production tracker: `sections/dealer-production-tracker.liquid`

White card x~1069 y=469 w~446 h=272. Heading `PRODUCTION TRACKER`, top right `View Order →`. Order line `ORDER CW-1057`, `PO: DMX-5125`, blue pill `IN PRODUCTION`.

Five-step horizontal timeline across x~1116–1467 y~566: `ORDER RECEIVED`, `IN PRODUCTION`, `FINISHING`, `QUALITY CHECK`, `PREPARING TO SHIP`, `SHIPPED` **Note:** screenshot depicts six circles, not five; implement **six** stages. First two completed with dark filled circles and checkmarks; third current dark circle; last three outlined light circles. Connecting rail completed gold through current, future slate. Labels underneath in compact uppercase; dates `Sep 12`, `Sep 14`, `Current` under first three respectively. Remaining dates blank. Status semantics must come from real fulfillment/production data when available; otherwise staging fixture only.

Bottom inset line-item card x~1086 y~648 w~413 h~78, border: wheel thumbnail ~68×68 px, `C1`, `Forged Monoblock`, `20” / Satin Bronze`, `2025 BMW M4 Competition`, right divider with `Qty: 4`, `$2,190 ea`.

**Suggested hooks (PROPOSED):** `.dealer-production-tracker`, `.dealer-production-tracker__stages`, `.dealer-production-step`, `.dealer-production-step.is-complete`, `.is-current`, `.is-upcoming`, `.dealer-production-tracker__item`.

## 10. Recent activity: dashboard template

Card x~228 y=750 w~578 h=233. Heading `RECENT ACTIVITY`; link `View All Activity →`. Five ~36 px activity rows with left copper icons, center descriptions, timestamp right and chevron far right:

- `Order CW-1057 moved to Finishing` — `Today at 10:24 AM`
- `Quote Q-0521 created` — `Yesterday at 3:18 PM`
- `Order CW-1049 shipped` — `Sep 14, 2026`
- `Tracking number available for CW-1049` — `Sep 14, 2026`
- `Invoice INV-1423 posted` — `Sep 12, 2026`

These are illustrative fixtures, including relative timestamps. Never calculate or display `Today` / `Yesterday` for static historical fixtures in a live account. For live data, derive localized timestamps from actual event dates.

**Suggested hooks (PROPOSED):** `.dealer-recent-activity`, `.dealer-activity-list`, `.dealer-activity-item`, `.dealer-activity-item__time`.

## 11. Featured wheels: `sections/dealer-featured-wheels.liquid`

Card x~816 y=750 w~699 h=233. Heading `FEATURED WHEELS`; right link `Browse Catalog →`. Three equal product tiles ~211 px wide, 173 px high starting x~830 y~788, 10 px gaps. Each top area contains ~104 px wheel cutout image left, model name and product description/prices right; outlined copper `VIEW / CONFIGURE →` button across bottom ~191×33 px.

- `C1` / `Forged Monoblock` / `From $875` / `MSRP $1,250` — bronze/gold multi-spoke wheel.
- `C2` / `Forged Monoblock` / `From $910` / `MSRP $1,300` — black multi-spoke wheel.
- `C3` / `Forged 3-Piece` / `From $1,420` / `MSRP $1,950` — silver multi-spoke wheel.

Do not fabricate product prices or inventory in production. Prefer Shopify product objects, metafields, and existing configurator URLs; seed fixtures only in explicit demo mode. Use real client-approved product imagery, not mismatched generic wheels.

**Suggested hooks (PROPOSED):** `.dealer-featured-wheels`, `.dealer-wheel-card`, `.dealer-wheel-card__image`, `.dealer-wheel-card__details`, `.dealer-wheel-card__cta`.

## 12. File ownership and selector reconciliation

The following is a **file-to-component map**, not proof that any particular selector already exists:

| File | Component / responsibility | Allowed modification |
|---|---|---|
| `layout/theme.liquid` | Existing scripts/styles inclusion and page shell | Only add necessary guarded assets; avoid global structural rewrites |
| `templates/page.dealer-dashboard.json` | Section order/composition | Reorder existing dealer sections, add schema-valid sections only |
| `sections/dealer-dashboard.liquid` | Main dashboard container, KPI/actions/orders/activity if implemented here | Layout and accessible markup; preserve data hooks |
| `sections/dealer-sidebar.liquid` | Rail/navigation | Styling, labels, accessible route links |
| `sections/dealer-topbar.liquid` | Dealer identity/status | Styling, real data binding, dropdown semantics |
| `sections/dealer-hero.liquid` | Hero text/image | Layout, responsive image setting |
| `sections/dealer-production-tracker.liquid` | Stage timeline/item summary | Visual state mapping, no invented backend |
| `sections/dealer-featured-wheels.liquid` | Product cards | Prefer actual product objects |
| `sections/dealer-quick-order.liquid` | Quick-order workflow, possibly quick action | Preserve input, cart and order behavior |
| `sections/dealer-invoices.liquid` | Invoices view | Do not modify for dashboard visuals unless necessary |
| `assets/dealer-portal.js` | Dealer interaction logic | Preserve existing event handlers, APIs and data contracts |

**Before coding:** inspect actual paths, classes, IDs, section schema, event listeners, data attributes, Liquid variables and JSON section IDs. Build a selector inventory: `FILE | EXISTING SELECTOR | PROPOSED SELECTOR | PURPOSE | KEEP/ADD`. Prefer adding `.calder-dealer-dashboard` page-root namespace and descendant classes without removing old hooks. Scope dashboard CSS to its root. Do not introduce broad `header`, `nav`, `button`, `.card`, `table`, or `body` overrides.

## 13. Asset requirements

1. **Calder logo:** approved white monogram/wordmark asset, preferably SVG; never substitute a plain typed C. Keep intrinsic aspect ratio and accessible alternative text.
2. **Hero:** approved wide luxury automotive/mountain image, minimum 1920×600 source pixels for crisp desktop crop. Wheel/vehicle on right, bright negative space on left. Set `object-position` / `background-position` to protect wheel visibility.
3. **Sidebar bottom:** approved dark mountains/forest image, at least 500×650; apply navy overlay and bottom anchoring. If absent, retain solid navy rather than invent an asset.
4. **Featured wheels:** three transparent or clean-background product images corresponding to C1 bronze, C2 black, C3 silver; recommended 600×600 or larger, `object-fit: contain`.
5. **Tracker:** matching C1 bronze thumbnail, ideally reuse actual C1 product media.
6. **Icons:** use existing Ionicons or theme icon library consistently. Avoid emojis, mismatched stroke weights, remote icon-font dependencies, and fake logos.
7. **Image loading:** hero may be eager; below-fold wheel images lazy. Provide `width`, `height`, `alt`, and responsive `srcset` where applicable.

If assets cannot be located, output an `ASSET_REQUIRED` report with exact missing roles and do not silently swap unrelated images.

## 14. Responsive behavior

| Viewport | Required behavior |
|---|---|
| ≥1440 px | Match 1536 reference proportions: 207 px sidebar, 55 px topbar, 4 KPIs, 4 actions, 830/445 main columns, 578/699 bottom columns |
| 1200–1439 px | Sidebar 190–207 px; content min-width 0; preserve two-column rows where legible; reduce gaps to 10–12 px and card padding to 12–14 px |
| 992–1199 px | Sidebar may compact to 72 px icon rail with accessible labels/tooltips; topbar badges wrap/hide secondary metadata; KPIs 2×2; actions 2×2; main content rows stack when table/tracker cannot fit |
| 768–991 px | Sidebar becomes off-canvas drawer; visible menu toggle; content full width; hero title 30–34 px; KPIs/actions 2 columns; recent orders scroll horizontally; tracker full width |
| 480–767 px | 16 px page padding; hero ~240–280 px; title ~27–30 px; KPIs 2 columns if minimum 160 px per card, otherwise stack; quick actions 1 column; featured wheel cards stack or horizontally scroll with explicit affordance |
| <480 px | Topbar organization name ellipsized, avatar/menu remain reachable; KPI and actions single column if needed; tracker stages horizontally scroll with visible labels; no clipped primary controls |

Use breakpoints at 1440, 1200, 992, 768, 480 px as starting points. Never reduce text below 10 px to force desktop density on mobile. Preserve focus indicators, 44×44 px touch targets where practical, and reduced-motion preference. Avoid horizontal page overflow; contained table/timeline overflow is allowed.

## 15. Functional requirements and protected boundaries

**Functional:** sidebar navigation routes correctly; topbar dropdowns operate only when supported; notification bell opens a real supported destination or is clearly non-interactive; quick action cards navigate to working catalog/quick-order/quote/orders routes; order links resolve to authorized order detail; production tracker stages reflect actual status; activity rows open actual relevant resources; featured wheels open actual product/configurator destinations; support link resolves to a valid support channel; keyboard Tab order follows visual order; ARIA labels and `aria-current="page"` for active navigation.

**Protected:** Shopify customer/dealer authentication, account authorization and dealer gating; pricing/tier/credit/payment-terms logic; customer identity and organization context; product/variant logic; cart/checkout and quick order; API integrations and existing dealer-portal.js events; fitment and configurator integration; theme header navigation outside the portal; Shopify section schema compatibility. Do not replace data fetches with static fixtures, remove handlers, hard-code authenticated names in production, or expose private dealer information client-side to unauthorized users.

**Seed data contract:** explicit `demo_mode` or development-only fixture switch; seed records scoped to staging; all actions either resolve to valid sample/demo routes or are visibly disabled. In production, show real authorized data or honest empty/loading/error states. Never imply sample credit, invoice, order, quote, or pricing values are real.

**Data states:** loading skeleton; empty state with appropriate CTA; permission-denied state; recoverable API error; unavailable credit/terms; missing product image fallback; long dealer organization name; 0, 1, and 100+ orders. Avoid fixed height clipping when content changes.

## 16. Visual acceptance checklist — no image interpretation needed

OpenCode must execute the following in browser/devtools at **1536×1024**, then at **1280×800, 1024×768, 768×1024, 390×844**. Capture numerical measurements and report PASS/FAIL for each; screenshots are optional evidence for a human, not a prerequisite for DeepSeek interpretation.

- [ ] At 1536, sidebar left=0 and width=207±4 px; main begins at x=207±4 px.
- [ ] Topbar height=55±4 px; no badge/avatar collisions.
- [ ] Hero top=55±4 px and height=215±8 px; headline and subtitle fit without overlapping wheel or tagline.
- [ ] KPI container x=237±8, y=233±8, width=1270±12, height=101±8; 4 equal cells with visible dividers.
- [ ] Quick actions row y=381±8; four cards each 69±6 px tall; equal widths within 3 px; gaps 10–16 px.
- [ ] Recent orders and production tracker begin at y=469±10; left panel ~830±20 px, right panel ~445±20 px.
- [ ] Recent activity and featured wheels begin at y=750±12; 3 featured wheel tiles present.
- [ ] Sidebar has exactly 8 primary nav links, 3 account links, support and logout; Dashboard active state visible.
- [ ] Topbar displays organization, tier, terms, good-standing label, notification, avatar, user identity in demo state.
- [ ] KPI demo values match `5`, `$18,746`, `3`, `3`, `$9,350`, `$34,250`, `$75,000`, `46%`.
- [ ] Quick action headings/copy match section 7 exactly.
- [ ] Recent orders table has 8 headers and 5 fixture rows with section 8 values and distinct status pills.
- [ ] Tracker has **6** stages; first 2 completed, third current, final 3 pending; C1 item details match section 9.
- [ ] Recent activity has exactly 5 fixture events in the section 10 order.
- [ ] Featured wheels show C1/C2/C3, correct model descriptions and fixture prices; each has CTA.
- [ ] No text overflow, overlap, missing assets, console errors, failed Liquid render, or unexpected horizontal document scrolling.
- [ ] All visible actionable controls have actual destination/handler or explicitly disabled styling.
- [ ] Keyboard-only navigation reaches every action, has visible focus, and closes the mobile drawer.
- [ ] At 390 px, no sidebar permanently consumes content width; order table scrolls inside its own container; buttons remain tappable.
- [ ] `dealer-portal.js`, quick order, cart, Shopify product/variant and existing authentication flows pass regression checks.
- [ ] Production data never displays demo credit/order/identity as genuine account information.

### Recommended measurement script (paste into browser DevTools)

```js
const selectors = [
  '.dealer-sidebar', '.dealer-topbar', '.dealer-hero',
  '.dealer-kpis', '.dealer-quick-actions',
  '.dealer-recent-orders', '.dealer-production-tracker',
  '.dealer-recent-activity', '.dealer-featured-wheels'
];
console.table(selectors.map(selector => {
  const el = document.querySelector(selector);
  if (!el) return { selector, found: false };
  const r = el.getBoundingClientRect();
  return { selector, found: true, x: Math.round(r.x), y: Math.round(r.y),
    width: Math.round(r.width), height: Math.round(r.height) };
}));
console.log('horizontal overflow:', document.documentElement.scrollWidth > innerWidth);
```

**Adapt selectors to the inspected DOM first.** A missing proposed selector is not automatically a failure if the same semantic component exists under an established theme selector.

## 17. Implementation sequence and handoff report

1. Audit actual Liquid/JSON/JS files and report existing classes, data sources, hooks, schemas, and assets.
2. Add namespaced layout CSS and semantic classes without deleting functional hooks.
3. Match desktop geometry, typography, copy, badges, table and timeline.
4. Bind approved assets and real Shopify data where available; isolate demo fixtures.
5. Implement responsive behavior and keyboard accessibility.
6. Run browser measurement checklist and protected-function regression tests.
7. Deliver `FILES_CHANGED`, `SELECTOR_MAPPING`, `ASSETS_USED/MISSING`, `DATA_SOURCE_PER_WIDGET`, `DESKTOP_MEASUREMENTS`, `RESPONSIVE_RESULTS`, `FUNCTIONAL_TESTS`, `KNOWN_GAPS`.

**Change discipline:** Only touch dashboard-related files unless a narrowly justified dependency requires another edit. Do not rewrite theme-wide CSS, customer authentication, checkout, fitment, builder, or existing dealer integrations to chase screenshot fidelity. If a necessary integration is missing, report it instead of fabricating a working backend.
