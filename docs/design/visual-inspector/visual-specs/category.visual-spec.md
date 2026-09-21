# Calder Visual Specification — Category

## Source

- File: `Calder - 2 - Category.png`
- Source dimensions: `1024 × 1536`
- Page type: `collection_listing`
- Inspector: GPT-5.6 Sol
- Schema version: 1.0

## Page Summary

Forged Wheels collection page with shallow branded hero, persistent fitment finder, category-mode tiles, left filter rail, three-column product grid, specialist CTA, newsletter and footer.

## Global Layout

- **Content width:** ~934px — confidence 0.90 (ESTIMATED)
- **Horizontal gutters:** ~44-46px — confidence 0.92 (ESTIMATED)
- **Primary alignment:** Centered wide content container; product main column aligns consistently from toolbar through CTA.
- **Page background:** #FFFFFF — confidence 0.96

---

## Section 1 — Global header

**ID:** `category-header`

### Bounds

- Pixel bbox: `[0, 0, 1024, 52]`
- Normalized bbox: `[0.0, 0.0, 1.0, 0.0339]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: full-width row
- Additional layout: `{}`

### Components

#### global-header

- Classification: **GLOBAL**
- Type: `header`
- Pixel bbox: `[0, 0, 1024, 52]`
- Normalized bbox: `[0.0, 0.0, 1.0, 0.0339]`
- Description: Consumer global header variant matching the established dark navy Calder navigation.
- Confidence: 0.96
- Evidence: OBSERVED

---

## Section 2 — Collection hero

**ID:** `category-hero`

### Bounds

- Pixel bbox: `[0, 52, 1024, 216]`
- Normalized bbox: `[0.0, 0.0339, 1.0, 0.1406]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: full-width shallow hero
- Additional layout: `{"columns": "copy left / imagery right"}`

### Components

#### category-hero-copy

- Classification: **PAGE_SPECIFIC**
- Type: `hero_copy`
- Pixel bbox: `[46, 82, 494, 181]`
- Normalized bbox: `[0.0449, 0.0534, 0.4824, 0.1178]`
- Description: Gold eyebrow OUR COLLECTION, large FORGED WHEELS title with gold emphasis on WHEELS, two-line description.
- Confidence: 0.93
- Evidence: OBSERVED

#### category-hero-wheel

- Classification: **PAGE_SPECIFIC**
- Type: `hero_image`
- Pixel bbox: `[520, 52, 1024, 216]`
- Normalized bbox: `[0.5078, 0.0339, 1.0, 0.1406]`
- Description: Wheel/car crop against mountain road; wheel occupies upper-right center.
- Confidence: 0.94
- Evidence: OBSERVED
- Imagery: `{"fit": "cover", "focal_point": "wheel at ~690,105", "crop": "wide banner"}`

---

## Section 3 — Vehicle fitment finder

**ID:** `category-fitment`

### Bounds

- Pixel bbox: `[43, 201, 982, 304]`
- Normalized bbox: `[0.042, 0.1309, 0.959, 0.1979]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: floating contained white card
- Additional layout: `{}`

### Components

#### category-fitment-form

- Classification: **SHARED**
- Type: `form`
- Pixel bbox: `[58, 235, 971, 292]`
- Normalized bbox: `[0.0566, 0.153, 0.9482, 0.1901]`
- Description: White fitment bar with title/status row and four selectors plus dark CTA.
- Confidence: 0.95
- Evidence: OBSERVED

---

## Section 4 — Collection mode navigation

**ID:** `category-nav`

### Bounds

- Pixel bbox: `[46, 324, 979, 387]`
- Normalized bbox: `[0.0449, 0.2109, 0.9561, 0.252]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: five-column tile navigation
- Additional layout: `{}`

### Components

#### category-mode-cards

- Classification: **PAGE_SPECIFIC**
- Type: `nav_cards`
- Pixel bbox: `[46, 324, 979, 387]`
- Normalized bbox: `[0.0449, 0.2109, 0.9561, 0.252]`
- Description: Five dark photographic category tiles: All Wheels, Forged Monoblock, Forged 3-Piece, By Vehicle, By Style.
- Confidence: 0.95
- Evidence: OBSERVED
- Layout: `{"grid": "5 equal columns", "gap": "~14px"}`

---

## Section 5 — Filters and product grid

**ID:** `category-products`

### Bounds

- Pixel bbox: `[45, 408, 982, 1074]`
- Normalized bbox: `[0.0439, 0.2656, 0.959, 0.6992]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: sidebar + main content
- Additional layout: `{"columns": "~19/81"}`

### Components

#### category-filters

- Classification: **PAGE_SPECIFIC**
- Type: `filter_sidebar`
- Pixel bbox: `[45, 410, 225, 1046]`
- Normalized bbox: `[0.0439, 0.2669, 0.2197, 0.681]`
- Description: Left sidebar with collapsible filter groups and checkbox options for wheel type, diameter, width, bolt pattern, finish, fitment and collection.
- Confidence: 0.96
- Evidence: OBSERVED
- Layout: `{"width": "~180px"}`

#### category-toolbar

- Classification: **SHARED**
- Type: `toolbar`
- Pixel bbox: `[242, 408, 980, 449]`
- Normalized bbox: `[0.2363, 0.2656, 0.957, 0.2923]`
- Description: Results count, selected vehicle chip, sort selector and grid/list view controls.
- Confidence: 0.94
- Evidence: OBSERVED

#### category-product-grid

- Classification: **SHARED**
- Type: `product_grid`
- Pixel bbox: `[241, 454, 979, 1039]`
- Normalized bbox: `[0.2354, 0.2956, 0.9561, 0.6764]`
- Description: Two rows of three bordered product cards with fitment badge, wheel render, favorite icon, model/type/finish/sizes/price and full-width View Details button.
- Confidence: 0.97
- Evidence: OBSERVED
- Layout: `{"grid": "3 columns x 2 rows", "gap": "~12px"}`

#### category-pagination

- Classification: **SHARED**
- Type: `pagination`
- Pixel bbox: `[517, 1046, 665, 1072]`
- Normalized bbox: `[0.5049, 0.681, 0.6494, 0.6979]`
- Description: Centered compact pagination with active dark first page.
- Confidence: 0.90
- Evidence: OBSERVED

---

## Section 6 — Wheel specialist CTA

**ID:** `category-help`

### Bounds

- Pixel bbox: `[242, 1089, 981, 1201]`
- Normalized bbox: `[0.2363, 0.709, 0.958, 0.7819]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: main-column CTA aligned with product grid
- Additional layout: `{}`

### Components

#### category-help-banner

- Classification: **SHARED**
- Type: `cta_banner`
- Pixel bbox: `[242, 1089, 981, 1201]`
- Normalized bbox: `[0.2363, 0.709, 0.958, 0.7819]`
- Description: Dark navy help banner with large white question, gold Find Your Fit button, outlined Contact button and wheel crop at right.
- Confidence: 0.93
- Evidence: OBSERVED

---

## Section 7 — Newsletter

**ID:** `category-newsletter`

### Bounds

- Pixel bbox: `[0, 1218, 1024, 1345]`
- Normalized bbox: `[0.0, 0.793, 1.0, 0.8757]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: full-width image band
- Additional layout: `{}`

### Components

#### category-newsletter-form

- Classification: **SHARED**
- Type: `newsletter_form`
- Pixel bbox: `[45, 1246, 980, 1302]`
- Normalized bbox: `[0.0439, 0.8112, 0.957, 0.8477]`
- Description: Full-width mountain newsletter band with email and subscribe controls.
- Confidence: 0.93
- Evidence: OBSERVED

---

## Section 8 — Global footer

**ID:** `category-footer`

### Bounds

- Pixel bbox: `[0, 1345, 1024, 1536]`
- Normalized bbox: `[0.0, 0.8757, 1.0, 1.0]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: full-width footer
- Additional layout: `{}`

### Components

#### global-footer

- Classification: **GLOBAL**
- Type: `footer`
- Pixel bbox: `[0, 1345, 1024, 1536]`
- Normalized bbox: `[0.0, 0.8757, 1.0, 1.0]`
- Description: Dark navy multi-column consumer footer.
- Confidence: 0.97
- Evidence: OBSERVED

---

## Shared Components

### Primary site header
- ID: `global-header`
- Classification: GLOBAL
- Reuse rationale: Repeated on Home, Category, Product and Cart with dark navy bar, Calder logo, nav, utility icons and outlined gold fitment CTA.

### Primary site footer
- ID: `global-footer`
- Classification: GLOBAL
- Reuse rationale: Repeated on consumer-facing pages with dark navy multi-column footer, Calder mark, social icons and legal row.

### Find Your Fit CTA
- ID: `fitment-cta`
- Classification: SHARED
- Reuse rationale: Repeated high-priority gold/outlined action in consumer header and fitment workflows.

### Gold uppercase eyebrow
- ID: `gold-eyebrow`
- Classification: SHARED
- Reuse rationale: Repeated section-label pattern across marketing, collection, cart and portal compositions.

### Navy / gold button system
- ID: `navy-gold-button-system`
- Classification: SHARED
- Reuse rationale: Repeated rectangular CTAs with low radius, uppercase tracked labels and arrow affordances.

### Wheel product card
- ID: `product-card`
- Classification: SHARED
- Reuse rationale: Reusable commerce card pattern also echoed in Product recommendations and dealer featured wheels.

## Page-Specific Components

### Collection filter sidebar
- ID: `category-filters`
- Purpose / rationale: Collection discovery control unique to listing context.

### Collection mode tiles
- ID: `category-mode-cards`
- Purpose / rationale: Collection navigation band specific to wheel browsing.

## Responsive Assumptions

> All items in this section are assumptions because no approved responsive screenshots were supplied.

### category-filters
- Assumption: Filter sidebar likely collapses into a drawer/filter button on tablet/mobile.
- Confidence: 0.83
- Evidence: ASSUMPTION

### category-product-grid
- Assumption: Three-column grid likely reduces to two then one column as width decreases.
- Confidence: 0.80
- Evidence: ASSUMPTION

### category-mode-cards
- Assumption: Five navigation tiles likely become horizontally scrollable or wrap.
- Confidence: 0.64
- Evidence: ASSUMPTION

## Visual Relationships

- Contained sections preserve consistent left/right edges; full-bleed bands intentionally break the container.

## Uncertainties

### filter accordion behavior
- Unknown: Open/closed interaction states beyond the shown desktop state are not visible.
- Evidence needed to resolve: Verify existing theme filter behavior and preserve it where functional.

## Implementation Notes

- Keep filter rail visually independent from the product-grid card borders.
- Toolbar, grid and specialist CTA share the same main-column left/right edges.
- Selected vehicle context is visually persistent above products.

## Inspection Summary

- Highest-confidence findings: major section order, full-width versus contained regions, dominant column structures, and repeated shared-component patterns.
- Lower-confidence findings: exact font family, source design tokens, interactive/sticky behavior, and responsive behavior not shown in the approved desktop references.
- Critical relationships to preserve: repeated content edges, hero/product focal hierarchy, fitment continuity, navy/white/gold contrast system, and page-specific shell variants.
- Items requiring implementation-side verification: existing Shopify component behavior, asset filenames/crops, theme typography tokens, and platform-specific checkout constraints.