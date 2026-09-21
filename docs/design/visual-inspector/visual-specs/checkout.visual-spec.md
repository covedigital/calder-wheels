# Calder Visual Specification — Checkout

## Source

- File: `Calder - 5 - Checkout.png`
- Source dimensions: `1222 × 1287`
- Page type: `checkout`
- Inspector: GPT-5.6 Sol
- Schema version: 1.0

## Page Summary

Distraction-minimized checkout using a white secure header, five-step progress, left information/shipping/delivery/payment form, right order summary and compact support footer.

## Global Layout

- **Content width:** ~1126px — confidence 0.92 (ESTIMATED)
- **Horizontal gutters:** ~48px — confidence 0.94 (ESTIMATED)
- **Primary alignment:** Centered checkout container with form and summary columns; marketing navigation is intentionally removed.
- **Page background:** #FFFFFF — confidence 0.98

---

## Section 1 — Checkout header

**ID:** `checkout-header`

### Bounds

- Pixel bbox: `[0, 0, 1222, 62]`
- Normalized bbox: `[0.0, 0.0, 1.0, 0.0482]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: minimal white checkout header
- Additional layout: `{"alignment": "logo left / reassurance right / return far right"}`

### Components

#### checkout-logo

- Classification: **GLOBAL**
- Type: `brand_header`
- Pixel bbox: `[49, 10, 223, 51]`
- Normalized bbox: `[0.0401, 0.0078, 0.1825, 0.0396]`
- Description: Calder logo at left on white background.
- Confidence: 0.96
- Evidence: OBSERVED

#### checkout-security

- Classification: **SHARED**
- Type: `security_message`
- Pixel bbox: `[806, 16, 987, 48]`
- Normalized bbox: `[0.6596, 0.0124, 0.8077, 0.0373]`
- Description: Lock icon with Secure Checkout reassurance centered-right.
- Confidence: 0.94
- Evidence: OBSERVED

#### checkout-return

- Classification: **PAGE_SPECIFIC**
- Type: `return_link`
- Pixel bbox: `[1072, 22, 1170, 43]`
- Normalized bbox: `[0.8773, 0.0171, 0.9574, 0.0334]`
- Description: Return to Cart link at far right.
- Confidence: 0.93
- Evidence: OBSERVED

---

## Section 2 — Checkout progress

**ID:** `checkout-progress`

### Bounds

- Pixel bbox: `[285, 64, 955, 130]`
- Normalized bbox: `[0.2332, 0.0497, 0.7815, 0.101]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: centered five-step progress
- Additional layout: `{}`

### Components

#### checkout-stepper

- Classification: **SHARED**
- Type: `progress_indicator`
- Pixel bbox: `[285, 78, 955, 127]`
- Normalized bbox: `[0.2332, 0.0606, 0.7815, 0.0987]`
- Description: Five-step horizontal stepper: Cart completed/gold, Information active/navy, Shipping, Payment, Confirmation inactive.
- Confidence: 0.96
- Evidence: OBSERVED

---

## Section 3 — Checkout form and summary

**ID:** `checkout-main`

### Bounds

- Pixel bbox: `[48, 145, 1174, 1215]`
- Normalized bbox: `[0.0393, 0.1127, 0.9607, 0.9441]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: two-column checkout layout
- Additional layout: `{"columns": "~60/40", "gap": "~32px"}`

### Components

#### checkout-form

- Classification: **PAGE_SPECIFIC**
- Type: `checkout_form`
- Pixel bbox: `[48, 145, 716, 1210]`
- Normalized bbox: `[0.0393, 0.1127, 0.5859, 0.9402]`
- Description: Left multi-section form with numbered Customer Information, Shipping Address, Delivery and Payment sections; inputs use thin gray borders and generous vertical spacing.
- Confidence: 0.98
- Evidence: OBSERVED
- Layout: `{"width": "~668px", "sections": 4}`

#### checkout-summary

- Classification: **SHARED**
- Type: `order_summary`
- Pixel bbox: `[748, 158, 1174, 823]`
- Normalized bbox: `[0.6121, 0.1228, 0.9607, 0.6395]`
- Description: Right bordered order summary with wheel thumbnail, fitment status, totals, gold Place Order CTA, legal copy and three reassurance icons.
- Confidence: 0.98
- Evidence: OBSERVED
- Layout: `{"width": "~426px"}`

### Section Relationships

- Order summary starts near top of form and ends before the form's payment section.
- A second Place Order CTA appears at bottom of the form column.

---

## Section 4 — Checkout support footer

**ID:** `checkout-footer`

### Bounds

- Pixel bbox: `[0, 1219, 1222, 1287]`
- Normalized bbox: `[0.0, 0.9472, 1.0, 1.0]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: minimal checkout-only footer
- Additional layout: `{}`

### Components

#### checkout-footer-bar

- Classification: **PAGE_SPECIFIC**
- Type: `footer_bar`
- Pixel bbox: `[0, 1219, 1222, 1287]`
- Normalized bbox: `[0.0, 0.9472, 1.0, 1.0]`
- Description: Compact dark navy footer with Calder mark, centered brand phrase and support contact methods.
- Confidence: 0.96
- Evidence: OBSERVED

---

## Shared Components

### Commerce progress indicator
- ID: `checkout-progress`
- Classification: SHARED
- Reuse rationale: Related to cart progress pattern while expanded to five checkout stages.

### Order summary
- ID: `order-summary`
- Classification: SHARED
- Reuse rationale: Continuation of cart summary language with checkout-specific detail.

### Fitment confirmation state
- ID: `fitment-status`
- Classification: SHARED
- Reuse rationale: Green confirmation treatment persists through product, cart and checkout.

## Page-Specific Components

### Checkout form
- ID: `checkout-form`
- Purpose / rationale: Checkout-only customer/shipping/delivery/payment workflow.

### Minimal support footer
- ID: `checkout-footer-bar`
- Purpose / rationale: Checkout intentionally replaces full marketing footer with compact support bar.

## Responsive Assumptions

> All items in this section are assumptions because no approved responsive screenshots were supplied.

### checkout-main
- Assumption: Two columns likely stack into a single checkout flow; summary may collapse or move above/below payment depending platform behavior.
- Confidence: 0.77
- Evidence: ASSUMPTION

### checkout-progress
- Assumption: Five-step labels likely compress or become a simplified progress representation on mobile.
- Confidence: 0.68
- Evidence: ASSUMPTION

## Visual Relationships

- Order summary starts near top of form and ends before the form's payment section.
- A second Place Order CTA appears at bottom of the form column.

## Uncertainties

### platform checkout extensibility
- Unknown: The screenshot does not establish which checkout areas are editable under the active Shopify plan/runtime.
- Evidence needed to resolve: Implementation agent must verify Shopify checkout customization constraints before mapping visual requirements.

## Implementation Notes

- Checkout is a deliberate global-header/footer variant; do not reuse the full consumer navigation here.
- Preserve the repeated numbered section markers as strong scanning anchors.
- Keep payment method tabs and Place Order action visually dominant but restrained.

## Inspection Summary

- Highest-confidence findings: major section order, full-width versus contained regions, dominant column structures, and repeated shared-component patterns.
- Lower-confidence findings: exact font family, source design tokens, interactive/sticky behavior, and responsive behavior not shown in the approved desktop references.
- Critical relationships to preserve: repeated content edges, hero/product focal hierarchy, fitment continuity, navy/white/gold contrast system, and page-specific shell variants.
- Items requiring implementation-side verification: existing Shopify component behavior, asset filenames/crops, theme typography tokens, and platform-specific checkout constraints.