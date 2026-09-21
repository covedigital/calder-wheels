# Calder Visual Specification — Dealer Dashboard

## Source

- File: `Calder - 6 - Dealer Dashboard.png`
- Source dimensions: `1536 × 1024`
- Page type: `dealer_portal_dashboard`
- Inspector: GPT-5.6 Sol
- Schema version: 1.0

## Page Summary

Authenticated B2B dashboard using a fixed dark sidebar, white account utility bar, branded welcome hero, overlapping KPI cards, quick actions, order table, production tracker, activity feed and dealer product cards.

## Global Layout

- **Content width:** ~1329px portal canvas excluding 207px sidebar — confidence 0.96 (OBSERVED)
- **Horizontal gutters:** ~30-32px inside portal content — confidence 0.90 (ESTIMATED)
- **Primary alignment:** Portal content begins after a fixed ~207px sidebar; dashboard cards align to a consistent x≈238 content edge.
- **Page background:** #F7F8F8 — confidence 0.90

---

## Section 1 — Dealer portal sidebar

**ID:** `dealer-sidebar`

### Bounds

- Pixel bbox: `[0, 0, 207, 1024]`
- Normalized bbox: `[0.0, 0.0, 0.1348, 1.0]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: fixed-width full-height sidebar
- Additional layout: `{"width": "~207px"}`

### Components

#### dealer-brand

- Classification: **PAGE_SPECIFIC**
- Type: `portal_brand`
- Pixel bbox: `[0, 0, 207, 158]`
- Normalized bbox: `[0.0, 0.0, 0.1348, 0.1543]`
- Description: Dark sidebar top with Calder emblem/wordmark and DEALER PORTAL label.
- Confidence: 0.96
- Evidence: OBSERVED

#### dealer-nav

- Classification: **PAGE_SPECIFIC**
- Type: `portal_navigation`
- Pixel bbox: `[0, 158, 207, 777]`
- Normalized bbox: `[0.0, 0.1543, 0.1348, 0.7588]`
- Description: Vertical icon navigation; Dashboard active with gold accent strip; Account subsection divider and support/logout near bottom.
- Confidence: 0.98
- Evidence: OBSERVED

#### dealer-sidebar-image

- Classification: **PAGE_SPECIFIC**
- Type: `sidebar_brand_image`
- Pixel bbox: `[0, 777, 207, 1024]`
- Normalized bbox: `[0.0, 0.7588, 0.1348, 1.0]`
- Description: Mountain image and brand statement at bottom of sidebar.
- Confidence: 0.94
- Evidence: OBSERVED
- Imagery: `{"fit": "cover", "overlay": "dark navy"}`

---

## Section 2 — Dealer account top bar

**ID:** `dealer-topbar`

### Bounds

- Pixel bbox: `[207, 0, 1536, 54]`
- Normalized bbox: `[0.1348, 0.0, 1.0, 0.0527]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: horizontal account utility bar
- Additional layout: `{}`

### Components

#### dealer-account-bar

- Classification: **PAGE_SPECIFIC**
- Type: `portal_topbar`
- Pixel bbox: `[207, 0, 1536, 54]`
- Normalized bbox: `[0.1348, 0.0, 1.0, 0.0527]`
- Description: White top bar with dealer selector, tier badge, Net-30 badge, account-standing status, notification icon and user/account menu.
- Confidence: 0.97
- Evidence: OBSERVED

---

## Section 3 — Dealer dashboard hero

**ID:** `dealer-hero`

### Bounds

- Pixel bbox: `[207, 54, 1536, 268]`
- Normalized bbox: `[0.1348, 0.0527, 1.0, 0.2617]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: full-width portal hero with overlapping KPI row
- Additional layout: `{}`

### Components

#### dealer-welcome

- Classification: **PAGE_SPECIFIC**
- Type: `hero_copy`
- Pixel bbox: `[242, 84, 690, 205]`
- Normalized bbox: `[0.1576, 0.082, 0.4492, 0.2002]`
- Description: Gold DEALER PORTAL eyebrow, large two-line welcome heading and supporting sentence.
- Confidence: 0.95
- Evidence: OBSERVED

#### dealer-hero-image

- Classification: **PAGE_SPECIFIC**
- Type: `hero_image`
- Pixel bbox: `[613, 54, 1536, 235]`
- Normalized bbox: `[0.3991, 0.0527, 1.0, 0.2295]`
- Description: Mountain road/wheel image with dark right brand panel and statement.
- Confidence: 0.95
- Evidence: OBSERVED
- Imagery: `{"fit": "cover", "focal_point": "wheel near x=1080"}`

#### dealer-metrics

- Classification: **PAGE_SPECIFIC**
- Type: `metric_cards`
- Pixel bbox: `[236, 234, 1507, 334]`
- Normalized bbox: `[0.1536, 0.2285, 0.9811, 0.3262]`
- Description: Four white KPI cards spanning dashboard: Open Orders, In Production, Pending Quotes, Available Credit.
- Confidence: 0.98
- Evidence: OBSERVED
- Layout: `{"grid": "4 columns"}`

---

## Section 4 — Quick actions

**ID:** `dealer-actions`

### Bounds

- Pixel bbox: `[238, 349, 1508, 450]`
- Normalized bbox: `[0.1549, 0.3408, 0.9818, 0.4395]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: heading plus four-card action row
- Additional layout: `{}`

### Components

#### dealer-action-cards

- Classification: **PAGE_SPECIFIC**
- Type: `action_cards`
- Pixel bbox: `[239, 381, 1508, 449]`
- Normalized bbox: `[0.1556, 0.3721, 0.9818, 0.4385]`
- Description: Four horizontal quick-action cards; Quick Order active/dark, remaining cards white.
- Confidence: 0.97
- Evidence: OBSERVED
- Layout: `{"grid": "4 columns", "gap": "~14px"}`

---

## Section 5 — Orders and production tracker

**ID:** `dealer-orders`

### Bounds

- Pixel bbox: `[238, 469, 1508, 742]`
- Normalized bbox: `[0.1549, 0.458, 0.9818, 0.7246]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: two-column operational dashboard
- Additional layout: `{"columns": "~65/35"}`

### Components

#### dealer-recent-orders

- Classification: **PAGE_SPECIFIC**
- Type: `data_table`
- Pixel bbox: `[239, 469, 1058, 741]`
- Normalized bbox: `[0.1556, 0.458, 0.6888, 0.7236]`
- Description: Recent Orders table with five rows, status pills and View actions.
- Confidence: 0.98
- Evidence: OBSERVED

#### dealer-production

- Classification: **PAGE_SPECIFIC**
- Type: `production_tracker`
- Pixel bbox: `[1068, 469, 1508, 741]`
- Normalized bbox: `[0.6953, 0.458, 0.9818, 0.7236]`
- Description: Production tracker card with order metadata, six-stage timeline and compact wheel/order item.
- Confidence: 0.98
- Evidence: OBSERVED

---

## Section 6 — Recent activity and featured wheels

**ID:** `dealer-lower`

### Bounds

- Pixel bbox: `[238, 752, 1508, 984]`
- Normalized bbox: `[0.1549, 0.7344, 0.9818, 0.9609]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: two-column lower dashboard
- Additional layout: `{"columns": "~45/55"}`

### Components

#### dealer-activity

- Classification: **PAGE_SPECIFIC**
- Type: `activity_list`
- Pixel bbox: `[239, 752, 807, 984]`
- Normalized bbox: `[0.1556, 0.7344, 0.5254, 0.9609]`
- Description: Recent Activity list with icons, event descriptions and timestamps.
- Confidence: 0.97
- Evidence: OBSERVED

#### dealer-featured

- Classification: **PAGE_SPECIFIC**
- Type: `dealer_product_cards`
- Pixel bbox: `[817, 752, 1508, 984]`
- Normalized bbox: `[0.5319, 0.7344, 0.9818, 0.9609]`
- Description: Three dealer-priced wheel cards with MSRP comparison and View/Configure buttons.
- Confidence: 0.97
- Evidence: OBSERVED
- Layout: `{"grid": "3 columns"}`

---

## Shared Components

### Dealer portal card shell
- ID: `dealer-card-shell`
- Classification: SHARED
- Reuse rationale: Repeated white card surfaces with thin borders/shadows across metrics, actions, tables and product modules.

### Dealer status pill
- ID: `dealer-status-pill`
- Classification: SHARED
- Reuse rationale: Repeated compact rounded state indicators across account standing and order statuses.

### Navy / gold action system
- ID: `navy-gold-button-system`
- Classification: SHARED
- Reuse rationale: Portal adapts consumer brand navy/gold hierarchy to operational cards and CTAs.

## Page-Specific Components

### Dealer portal sidebar
- ID: `dealer-sidebar`
- Purpose / rationale: Authenticated portal navigation architecture not used by consumer pages.

### Production tracker
- ID: `dealer-production`
- Purpose / rationale: B2B manufacturing/order-status visualization.

## Responsive Assumptions

> All items in this section are assumptions because no approved responsive screenshots were supplied.

### dealer-sidebar
- Assumption: Sidebar likely collapses to an off-canvas or compact navigation on smaller viewports.
- Confidence: 0.80
- Evidence: ASSUMPTION

### dealer-orders
- Assumption: Table and production tracker likely stack; wide table may require horizontal scrolling.
- Confidence: 0.77
- Evidence: ASSUMPTION

### dealer-metrics
- Assumption: Four KPI cards likely wrap to 2x2 then single-column.
- Confidence: 0.79
- Evidence: ASSUMPTION

## Visual Relationships

- Contained sections preserve consistent left/right edges; full-bleed bands intentionally break the container.

## Uncertainties

### sidebar persistence
- Unknown: Static screenshot cannot prove fixed/sticky scroll behavior.
- Evidence needed to resolve: Inspect portal functional requirements and existing implementation.

## Implementation Notes

- Dealer portal is visually the same Calder brand but a distinct authenticated application shell; do not force consumer header/footer into it.
- Preserve dense information hierarchy while keeping white card surfaces and navy typography consistent.
- KPI row visibly overlaps the hero lower boundary; this relationship is a key portal signature.

## Inspection Summary

- Highest-confidence findings: major section order, full-width versus contained regions, dominant column structures, and repeated shared-component patterns.
- Lower-confidence findings: exact font family, source design tokens, interactive/sticky behavior, and responsive behavior not shown in the approved desktop references.
- Critical relationships to preserve: repeated content edges, hero/product focal hierarchy, fitment continuity, navy/white/gold contrast system, and page-specific shell variants.
- Items requiring implementation-side verification: existing Shopify component behavior, asset filenames/crops, theme typography tokens, and platform-specific checkout constraints.