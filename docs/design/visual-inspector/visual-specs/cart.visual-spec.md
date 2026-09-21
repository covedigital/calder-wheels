# Calder Visual Specification — Cart

## Source

- File: `Calder - 4 - Cart.png`
- Source dimensions: `1374 × 1145`
- Page type: `shopping_cart`
- Inspector: GPT-5.6 Sol
- Schema version: 1.0

## Page Summary

Simplified commerce cart with page title/progress, two-column cart-items/order-summary layout, specialist reassurance CTA and global footer.

## Global Layout

- **Content width:** ~1222px — confidence 0.92 (ESTIMATED)
- **Horizontal gutters:** ~62px — confidence 0.94 (ESTIMATED)
- **Primary alignment:** Centered wide container; title, cart panel and specialist banner share the same left edge.
- **Page background:** #FFFFFF — confidence 0.97

---

## Section 1 — Global header

**ID:** `cart-header`

### Bounds

- Pixel bbox: `[0, 0, 1374, 62]`
- Normalized bbox: `[0.0, 0.0, 1.0, 0.0541]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: full-width row
- Additional layout: `{}`

### Components

#### global-header

- Classification: **GLOBAL**
- Type: `header`
- Pixel bbox: `[0, 0, 1374, 62]`
- Normalized bbox: `[0.0, 0.0, 1.0, 0.0541]`
- Description: Wide consumer header with logo, nav, utility icons/cart count and fitment CTA.
- Confidence: 0.97
- Evidence: OBSERVED

---

## Section 2 — Cart title and progress

**ID:** `cart-title-progress`

### Bounds

- Pixel bbox: `[62, 87, 1282, 158]`
- Normalized bbox: `[0.0451, 0.076, 0.933, 0.138]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: two-ended header row
- Additional layout: `{"alignment": "title left / progress right"}`

### Components

#### cart-title

- Classification: **PAGE_SPECIFIC**
- Type: `page_heading`
- Pixel bbox: `[62, 91, 470, 151]`
- Normalized bbox: `[0.0451, 0.0795, 0.3421, 0.1319]`
- Description: Gold YOUR ORDER eyebrow above large navy SHOPPING CART title.
- Confidence: 0.96
- Evidence: OBSERVED

#### cart-progress

- Classification: **SHARED**
- Type: `progress_indicator`
- Pixel bbox: `[968, 98, 1262, 145]`
- Normalized bbox: `[0.7045, 0.0856, 0.9185, 0.1266]`
- Description: Three-step horizontal progress with Cart active, Checkout and Confirmation inactive.
- Confidence: 0.95
- Evidence: OBSERVED

---

## Section 3 — Cart items and order summary

**ID:** `cart-content`

### Bounds

- Pixel bbox: `[62, 181, 1283, 726]`
- Normalized bbox: `[0.0451, 0.1581, 0.9338, 0.6341]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: two-column checkout composition
- Additional layout: `{"columns": "~60/40", "gap": "~29px"}`

### Components

#### cart-items

- Classification: **PAGE_SPECIFIC**
- Type: `cart_item_list`
- Pixel bbox: `[62, 181, 796, 656]`
- Normalized bbox: `[0.0451, 0.1581, 0.5793, 0.5729]`
- Description: Large bordered left panel containing two cart line items, each with wheel render, model/specs, green fitment confirmation, price, quantity control and edit/remove actions.
- Confidence: 0.98
- Evidence: OBSERVED
- Layout: `{"rows": 2, "row_height": "~220px"}`

#### cart-summary

- Classification: **SHARED**
- Type: `order_summary`
- Pixel bbox: `[825, 181, 1283, 726]`
- Normalized bbox: `[0.6004, 0.1581, 0.9338, 0.6341]`
- Description: Right light-gray order summary card with subtotal/shipping/taxes, large estimated total, Affirm line, gold checkout CTA, outlined continue shopping and three trust items.
- Confidence: 0.98
- Evidence: OBSERVED
- Layout: `{"width": "~458px"}`

### Section Relationships

- Order summary begins level with top of cart-item panel.
- Primary checkout CTA spans most of summary width.

---

## Section 4 — Wheel specialist CTA

**ID:** `cart-specialist`

### Bounds

- Pixel bbox: `[62, 744, 1283, 881]`
- Normalized bbox: `[0.0451, 0.6498, 0.9338, 0.7694]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: contained full-width CTA
- Additional layout: `{}`

### Components

#### cart-specialist-banner

- Classification: **SHARED**
- Type: `cta_banner`
- Pixel bbox: `[62, 744, 1283, 881]`
- Normalized bbox: `[0.0451, 0.6498, 0.9338, 0.7694]`
- Description: Wide dark wheel-image banner with centered specialist copy and outlined Get in Touch button.
- Confidence: 0.94
- Evidence: OBSERVED

---

## Section 5 — Global footer

**ID:** `cart-footer`

### Bounds

- Pixel bbox: `[0, 893, 1374, 1145]`
- Normalized bbox: `[0.0, 0.7799, 1.0, 1.0]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: full-width footer
- Additional layout: `{}`

### Components

#### global-footer

- Classification: **GLOBAL**
- Type: `footer`
- Pixel bbox: `[0, 893, 1374, 1145]`
- Normalized bbox: `[0.0, 0.7799, 1.0, 1.0]`
- Description: Wide consumer footer with five content regions and legal row.
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

### Commerce progress indicator
- ID: `checkout-progress`
- Classification: SHARED
- Reuse rationale: Cart and Checkout both use staged progress, with different step counts/presentation.

### Order summary card
- ID: `order-summary`
- Classification: SHARED
- Reuse rationale: Cart and Checkout both present a right-side monetary summary and primary order action.

## Page-Specific Components

### Editable cart line-item list
- ID: `cart-items`
- Purpose / rationale: Cart-specific product review and quantity/edit/remove controls.

## Responsive Assumptions

> All items in this section are assumptions because no approved responsive screenshots were supplied.

### cart-content
- Assumption: Order summary likely moves below cart items on narrow screens.
- Confidence: 0.86
- Evidence: ASSUMPTION

### cart-progress
- Assumption: Progress labels may compress while preserving active-step state.
- Confidence: 0.62
- Evidence: ASSUMPTION

## Visual Relationships

- Order summary begins level with top of cart-item panel.
- Primary checkout CTA spans most of summary width.

## Uncertainties

### summary stickiness
- Unknown: Static screenshot cannot establish whether order summary is sticky during scroll.
- Evidence needed to resolve: Check existing cart behavior; preserve if functional unless it conflicts visually.

## Implementation Notes

- Keep the page materially simpler than marketing pages; whitespace is part of the design.
- Maintain green fitment confirmation close to each line item's vehicle metadata.
- Do not visually compete with the gold Proceed to Checkout CTA.

## Inspection Summary

- Highest-confidence findings: major section order, full-width versus contained regions, dominant column structures, and repeated shared-component patterns.
- Lower-confidence findings: exact font family, source design tokens, interactive/sticky behavior, and responsive behavior not shown in the approved desktop references.
- Critical relationships to preserve: repeated content edges, hero/product focal hierarchy, fitment continuity, navy/white/gold contrast system, and page-specific shell variants.
- Items requiring implementation-side verification: existing Shopify component behavior, asset filenames/crops, theme typography tokens, and platform-specific checkout constraints.