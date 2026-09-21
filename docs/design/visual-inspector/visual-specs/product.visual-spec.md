# Calder Visual Specification — Product

## Source

- File: `Calder - 3 - Product.png`
- Source dimensions: `824 × 1908`
- Page type: `product_detail`
- Inspector: GPT-5.6 Sol
- Schema version: 1.0

## Page Summary

Two-column wheel PDP centered on gallery and configuration/purchase controls, followed by specifications, engineering proof, finish variants, real-world imagery, recommendations, specialist CTA and footer.

## Global Layout

- **Content width:** ~724px — confidence 0.91 (ESTIMATED)
- **Horizontal gutters:** ~38px — confidence 0.94 (ESTIMATED)
- **Primary alignment:** Contained PDP with repeated left/right edges at x≈38 and x≈761; full-width contact/footer bands.
- **Page background:** #FFFFFF — confidence 0.97

---

## Section 1 — Global header

**ID:** `product-header`

### Bounds

- Pixel bbox: `[0, 0, 824, 44]`
- Normalized bbox: `[0.0, 0.0, 1.0, 0.0231]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: full-width row
- Additional layout: `{}`

### Components

#### global-header

- Classification: **GLOBAL**
- Type: `header`
- Pixel bbox: `[0, 0, 824, 44]`
- Normalized bbox: `[0.0, 0.0, 1.0, 0.0231]`
- Description: Consumer global header.
- Confidence: 0.97
- Evidence: OBSERVED

---

## Section 2 — Product purchase area

**ID:** `product-main`

### Bounds

- Pixel bbox: `[38, 51, 762, 589]`
- Normalized bbox: `[0.0461, 0.0267, 0.9248, 0.3087]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: contained two-column PDP
- Additional layout: `{"columns": "~56/44", "gap": "~25px"}`

### Components

#### product-gallery

- Classification: **PAGE_SPECIFIC**
- Type: `product_gallery`
- Pixel bbox: `[38, 76, 441, 489]`
- Normalized bbox: `[0.0461, 0.0398, 0.5352, 0.2563]`
- Description: Large square-ish installed wheel image with thumbnail strip below and carousel arrows.
- Confidence: 0.97
- Evidence: OBSERVED
- Layout: `{"main_image": "~403x320", "thumbnails": "5 visible"}`

#### product-info

- Classification: **PAGE_SPECIFIC**
- Type: `product_info`
- Pixel bbox: `[467, 75, 761, 559]`
- Normalized bbox: `[0.5667, 0.0393, 0.9235, 0.293]`
- Description: C1 title, construction label, description, rating/SKU, fitment confirmation, selectors, finish swatches, quantity, price, Add to Cart, Save/Share and reassurance row.
- Confidence: 0.98
- Evidence: OBSERVED
- Layout: `{"width": "~294px", "stack": "vertical form"}`

### Section Relationships

- Gallery and product info start at nearly the same y-position.
- Purchase controls form a light-gray panel inside the right column.

---

## Section 3 — Specifications and engineering proof

**ID:** `product-specs`

### Bounds

- Pixel bbox: `[38, 613, 761, 862]`
- Normalized bbox: `[0.0461, 0.3213, 0.9235, 0.4518]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: two-column section
- Additional layout: `{"columns": "~45/55"}`

### Components

#### product-spec-table

- Classification: **PAGE_SPECIFIC**
- Type: `spec_table`
- Pixel bbox: `[38, 616, 365, 852]`
- Normalized bbox: `[0.0461, 0.3229, 0.443, 0.4465]`
- Description: Left specifications table with alternating pale rows.
- Confidence: 0.94
- Evidence: OBSERVED

#### product-engineering-card

- Classification: **SHARED**
- Type: `editorial_card`
- Pixel bbox: `[390, 616, 761, 861]`
- Normalized bbox: `[0.4733, 0.3229, 0.9235, 0.4513]`
- Description: Dark manufacturing image card with ENGINEERED TO PERFORM copy and four icon proof points.
- Confidence: 0.95
- Evidence: OBSERVED

---

## Section 4 — Available finishes

**ID:** `product-finishes`

### Bounds

- Pixel bbox: `[38, 875, 761, 1087]`
- Normalized bbox: `[0.0461, 0.4586, 0.9235, 0.5697]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: heading plus horizontal variant carousel
- Additional layout: `{}`

### Components

#### product-finish-carousel

- Classification: **PAGE_SPECIFIC**
- Type: `product_variant_carousel`
- Pixel bbox: `[39, 926, 761, 1070]`
- Normalized bbox: `[0.0473, 0.4853, 0.9235, 0.5608]`
- Description: Six wheel finish renders in a horizontal carousel; Brushed Bronze selected with thin gold outline.
- Confidence: 0.96
- Evidence: OBSERVED
- Layout: `{"visible_items": 6, "selected_state": "gold border"}`

---

## Section 5 — Real world gallery

**ID:** `product-real-world`

### Bounds

- Pixel bbox: `[38, 1099, 761, 1278]`
- Normalized bbox: `[0.0461, 0.576, 0.9235, 0.6698]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: heading plus four-image strip
- Additional layout: `{}`

### Components

#### product-lifestyle-gallery

- Classification: **SHARED**
- Type: `image_carousel`
- Pixel bbox: `[38, 1149, 761, 1268]`
- Normalized bbox: `[0.0461, 0.6022, 0.9235, 0.6646]`
- Description: Four equal vehicle images showing the wheel on different cars, with side arrows.
- Confidence: 0.96
- Evidence: OBSERVED
- Layout: `{"grid": "4 images"}`

---

## Section 6 — You may also like

**ID:** `product-recommendations`

### Bounds

- Pixel bbox: `[38, 1288, 761, 1514]`
- Normalized bbox: `[0.0461, 0.6751, 0.9235, 0.7935]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: four-column recommendation grid
- Additional layout: `{}`

### Components

#### product-recommendation-cards

- Classification: **SHARED**
- Type: `product_card_group`
- Pixel bbox: `[38, 1335, 761, 1507]`
- Normalized bbox: `[0.0461, 0.6997, 0.9235, 0.7898]`
- Description: Four compact wheel recommendation cards with render, model/type and starting price.
- Confidence: 0.95
- Evidence: OBSERVED
- Layout: `{"grid": "4 columns"}`

---

## Section 7 — Fitment specialist CTA

**ID:** `product-contact`

### Bounds

- Pixel bbox: `[0, 1534, 824, 1651]`
- Normalized bbox: `[0.0, 0.804, 1.0, 0.8653]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: full-width CTA band
- Additional layout: `{}`

### Components

#### product-contact-banner

- Classification: **SHARED**
- Type: `cta_banner`
- Pixel bbox: `[0, 1534, 824, 1651]`
- Normalized bbox: `[0.0, 0.804, 1.0, 0.8653]`
- Description: Full-width dark wheel-texture contact banner with large specialist message and gold Get in Touch CTA.
- Confidence: 0.95
- Evidence: OBSERVED

---

## Section 8 — Global footer

**ID:** `product-footer`

### Bounds

- Pixel bbox: `[0, 1651, 824, 1908]`
- Normalized bbox: `[0.0, 0.8653, 1.0, 1.0]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: full-width footer
- Additional layout: `{}`

### Components

#### global-footer

- Classification: **GLOBAL**
- Type: `footer`
- Pixel bbox: `[0, 1651, 824, 1908]`
- Normalized bbox: `[0.0, 0.8653, 1.0, 1.0]`
- Description: Dark navy consumer footer.
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

## Page-Specific Components

### PDP media gallery
- ID: `product-gallery`
- Purpose / rationale: Primary product-detail media interaction.

### PDP configuration and purchase panel
- ID: `product-info`
- Purpose / rationale: Product-specific fitment, variant, quantity and purchase controls.

## Responsive Assumptions

> All items in this section are assumptions because no approved responsive screenshots were supplied.

### product-main
- Assumption: Gallery and product-info columns likely stack, gallery first, on narrow screens.
- Confidence: 0.84
- Evidence: ASSUMPTION

### product-finish-carousel
- Assumption: Finish options likely become horizontally swipeable rather than wrapping all items.
- Confidence: 0.74
- Evidence: ASSUMPTION

## Visual Relationships

- Gallery and product info start at nearly the same y-position.
- Purchase controls form a light-gray panel inside the right column.

## Uncertainties

### gallery zoom behavior
- Unknown: Zoom/modal behavior is not inferable from static reference.
- Evidence needed to resolve: Preserve existing functional gallery/zoom if present and style to reference.

## Implementation Notes

- Preserve strong top alignment between gallery and product-information columns.
- Maintain selected finish as a clear gold-outline state without changing wheel-render scale.
- Reassurance icons remain subordinate to the primary Add to Cart action.

## Inspection Summary

- Highest-confidence findings: major section order, full-width versus contained regions, dominant column structures, and repeated shared-component patterns.
- Lower-confidence findings: exact font family, source design tokens, interactive/sticky behavior, and responsive behavior not shown in the approved desktop references.
- Critical relationships to preserve: repeated content edges, hero/product focal hierarchy, fitment continuity, navy/white/gold contrast system, and page-specific shell variants.
- Items requiring implementation-side verification: existing Shopify component behavior, asset filenames/crops, theme typography tokens, and platform-specific checkout constraints.