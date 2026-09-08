# Dealer Portal — Complete Design (Lumia Theme)

> **Status**: Design draft — covers every screen, state, component, and flow
> **Theme**: Shopify Lumia 7.0.1 (Platform Theme) — all designs use the Lumia design system natively
> **Architecture**: See `docs/architecture/architecture.md` §8 (Dealer Identity → Tiers → Pricing → Gating)
> **Requirements**: See `docs/discovery/requirements.md` §3

---

## 1. Information Architecture

```
DEALER JOURNEY MAP
═══════════════════════════════════════════════════════════════════

PUBLIC (no login required)
├── /pages/dealer-program         — Dealer landing/info page (marketing)
└── /pages/dealer-apply           — Dealer application form

AUTHENTICATED — DEALER (customer.tags contains "dealer-approved")
│
├── /account                      — DEALER DASHBOARD (main hub)
│   └── Tabs/Views within the dashboard:
│       ├── Overview              — Quick stats, recent orders, quick actions
│       ├── Order History         — All orders with dealer columns (PO#, terms, tier price)
│       ├── My Quotes             — Quote requests + status tracking
│       ├── Quick Order           — SKU-based fast order entry form
│       │
├── /account/orders/{hash}        — Single order detail (enhanced for dealers)
├── /account/addresses            — Address management (shipping + billing)
├── /account?view=payment-terms   — Payment terms summary + outstanding invoices
│
├── /collections/dealer-only      — Dealer-exclusive catalog (hidden from retail)
│   └── Tiered pricing visible on every product card + PDP
│
├── /pages/order-guide            — Downloadable PDF price list / order form
│
└── CART + CHECKOUT
    ├── MOQ enforcement in cart (existing dealer-cart-moq)
    ├── Dealer pricing applied at line-item level (existing dealer-price)
    └── NET-30 payment option at checkout (Shopify Functions / Checkout UI ext.)

AUTHENTICATED — PENDING APPROVAL (customer.tags contains "dealer-applied")
└── /account                      — "Application Under Review" interstitial
    └── Blocks access to dealer content until approved

AUTHENTICATED — RETAIL (no dealer tags)
└── /account                      — Standard customer account (unchanged)
    └── Upsell banner: "Interested in wholesale? Apply as a dealer →"

PUBLIC — APPLICATION FLOW
├── /pages/dealer-apply           — Multi-step application form
│   ├── Step 1: Business details (name, tax ID, website, years in business)
│   ├── Step 2: Contact (name, email, phone, role)
│   ├── Step 3: Shipping address
│   └── Step 4: Agreement (terms checkbox, submit)
└── Application submitted → tag "dealer-applied" → admin reviews → approve → tag changes to "dealer-approved" + "dealer-tier-X"
```

---

## 2. Visual Design Language Within Lumia

### 2.1 Design System Adherence

The dealer portal inherits the Lumia theme's design system **completely** — no custom design language. Every component uses:

| Concern | Source |
|---------|--------|
| **Colors** | `var(--body-bg)`, `var(--body-bg-secondary)`, `var(--text-color)`, `var(--heading-color)`, `var(--custom-color)`, `var(--decor-border-color)` |
| **Typography** | `--heading-md-size` (23px), `--heading-sm-size` (18px), `--content-font-size` (15px), `--heading-sub-size` (12px) |
| **Spacing** | Lumia custom classes: `.mt-5` (25px), `.mt-15` (15px), `.mt-md-6` (30px md+), Bootstrap gap utilities |
| **Radius** | `var(--radius-md)` (16px cards), `var(--radius-sm)` (8px), `var(--radius-4)` (4px badges) |
| **Buttons** | `.btn` (40px pill), `.btn--sm`, `.btn--grey`, `.btn--invert`, `.btn-link.btn-link--md` |
| **Cards** | `.custom-card.bg-alt > .custom-card-inside` (16px radius, 36px/40px padding) |
| **Tables** | `.table.table-rounded-corners.table-striped.table-borderless` in `.table-responsive` |
| **Badges** | `.text-badge.tb--color1` (green), `.tb--color2` (red), `.tb--color3` (amber), `.tb--color4` (grey) |
| **Forms** | `.form-group > label + .form-control-wrap > .form-control` |
| **Grid** | Bootstrap 5: `.row > .col-lg-8 + .col-lg-4` |
| **Sections** | `render 'section-class'` + `render 'section-container-class'` wrappers |
| **Conditional CSS** | `dealer-portal.css` already loaded in `theme.liquid` for dealer-tagged customers |

### 2.2 Dealer-Specific Accent Color

While the theme's `--custom-color` is the global accent (default blue `#4970F8`), the dealer portal **uses the same accent** — but can optionally be distinguished via a dealer-specific CSS custom property:

```css
:root {
  --dealer-accent: var(--custom-color);           /* inherits theme accent by default */
  --dealer-accent-subtle: rgba(73, 112, 248, 0.1); /* 10% opacity of accent */
  --dealer-success: #22c55e;
  --dealer-warning: #eab308;
  --dealer-danger: #ef4444;
  --dealer-info: #3b82f6;
}
```

### 2.3 Dealer Portal Color Palette (Dark/Luxury Variant)

For the projected bespokerev.com dark aesthetic (see `brand/brand.md`), the dealer portal renders on:

| Element | Dark Mode Value | CSS Variable |
|---------|----------------|--------------|
| Page background | `#070909` | `--body-bg` |
| Card background | `#0d0f10` | `--body-bg-secondary` |
| Text | `#bbbbbb` | `--text-color` |
| Headings | `#ffffff` | `--heading-color` |
| Accent | `#c9a96e` (gold) | `--custom-color` |
| Borders | `rgba(255,255,255,0.06)` | `--decor-border-color` |
| Card border | `rgba(255,255,255,0.08)` | `--decor-border-dark-color` |

All designs below work with **both** the default light theme and the dark/luxury variant because they reference CSS variables exclusively.

---

## 3. Screen-by-Screen Design

---

### 3.1 DEALER DASHBOARD (`/account` — dealer only)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  DEALER DASHBOARD                                           Tier 2  NET-30  ║
║  ───────────────────────────────────────────────────────────────────────────║
║                                                                              ║
║  ┌─────────────────────────────┐  ┌─────────────────────────────┐           ║
║  │  QUICK STATS                │  │  QUICK ACTIONS              │           ║
║  │                             │  │                             │           ║
║  │  ┌──────────┐ ┌──────────┐ │  │  [Browse Catalog]  primary   │           ║
║  │  │ 12       │ │ 3        │ │  │  [Quick Order]     grey      │           ║
║  │  │  Orders  │ │  Pending │ │  │  [Request Quote]   grey      │           ║
║  │  │  This Mo │ │  Quotes  │ │  │  [Download Guide]  link      │           ║
║  │  └──────────┘ └──────────┘ │  │                             │           ║
║  │  ┌──────────┐ ┌──────────┐ │  │                             │           ║
║  │  │ $24.5k   │ │ Tier 2   │ │  │                             │           ║
║  │  │ Volume   │ │ Pricing  │ │  │                             │           ║
║  │  │ This Mo  │ │ Active   │ │  │                             │           ║
║  │  └──────────┘ └──────────┘ │  │                             │           ║
║  └─────────────────────────────┘  └─────────────────────────────┘           ║
║                                                                              ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │  RECENT ORDERS                                    [View All Orders →] │   ║
║  │  ─────────────────────────────────────────────────────────────────── │   ║
║  │  Order #    │ Date       │ PO #      │ Items │ Total     │ Status    │   ║
║  │  ───────────┼────────────┼───────────┼───────┼───────────┼───────────│   ║
║  │  #1042      │ Aug 18 26  │ PO-8821   │ 4     │ $3,200.00 │ Shipped ✓ │   ║
║  │  #1041      │ Aug 15 26  │ PO-8810   │ 8     │ $6,400.00 │ Processing│   ║
║  │  #1040      │ Aug 12 26  │ PO-8802   │ 2     │ $1,600.00 │ Delivered │   ║
║  │  #1039      │ Aug 08 26  │ PO-8795   │ 12    │ $9,600.00 │ Shipped ✓ │   ║
║  └──────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
║  ┌─────────────────────────────────────┐ ┌──────────────────────────────┐   ║
║  │  PENDING QUOTES      [View All →]  │ │  ACCOUNT SUMMARY             │   ║
║  │  ───────────────────────────────── │ │  ─────────────────────────── │   ║
║  │  Q-0047 │ BR01 Custom │ Aug 17     │ │  Status        Active   ●    │   ║
║  │  Q-0046 │ HR02 Set    │ Aug 14     │ │  Tier          Tier 2        │   ║
║  │  Q-0045 │ FR05 Spec   │ Aug 10     │ │  Payment       NET-30        │   ║
║  │                                    │ │  Tax           Exempt        │   ║
║  │  No quotes pending               … │ │  Credit Limit  $50,000       │   ║
║  │        [Request a Quote]           │ │  Outstanding   $12,400       │   ║
║  └─────────────────────────────────────┘ │  Available     $37,600       │   ║
║                                          └──────────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

#### COMPONENT BREAKDOWN

**Header Bar**
- Title: "Dealer Dashboard" (`.h1-style`, `var(--heading-color)`)
- Tier badge: `.text-badge` using `var(--custom-color)` bg with "Tier 2" text
- NET-30 badge (if applicable): `.text-badge.tb--color1` (green outline)
- Tax exempt badge (if applicable): `.text-badge.tb--color1`

**Quick Stats** — `.custom-card.bg-alt` containing a 2×2 grid of stat cells
- Each stat cell: large number (`.h1-style`, `var(--custom-color)`) + label (12px, `var(--text-color-secondary)`)
- Implemented as an inline `<style>` grid or four `.custom-card-inside > div` in a 2-column flex wrap

**Quick Actions** — `.custom-card.bg-alt`
- Button stack: primary `.btn.w-100` ("Browse Catalog"), `.btn--grey.w-100` ("Quick Order", "Request Quote")
- Link: `.btn-link.btn-link--md` ("Download Order Guide →")
- Spacing: `.mt-3` (15px) between each action

**Recent Orders** — `.custom-card.bg-alt` `.custom-card-inside`
- Card header: flex row — `<h3>` ("Recent Orders") + `.btn-link.btn-link--md` ("View All")
- Table: `.table.table-rounded-corners.table-striped.table-borderless.order-history` in `.table-responsive`
- Dealer-specific columns: **PO #** (customer-generated purchase order reference)
- Status badges use `.text-badge`: shipped = `.tb--color1`, processing = `.tb--color3`, delivered = `.tb--color1`

**Pending Quotes** — `.custom-card.bg-alt`
- Compact list: `.quote-list__row` style rows (see existing quote-list snippet)
- Empty state: centered text + "Request a Quote" `.btn--grey` CTA

**Account Summary** — `.custom-card.bg-alt`
- Style: `.dealer-dashboard__status-row` pattern (flex justify-between, bottom border dividers)
- Each row: label (left, `var(--text-color)`, 14px) + value (right, `var(--heading-color)`, 14px, weight 600)
- Status dot: green circle (`#22c55e`, 8px, border-radius 50%) inline before "Active"
- Credit limit section: shows limit, outstanding, available (available = limit - outstanding)

#### IMPLEMENTATION NOTES
- Combines current `dealer-dashboard.liquid` + `main-account.liquid` into one unified dashboard
- Stats data from dealer metafields: `customer.metafields.custom.dealer_stats` (JSON: monthly_orders, pending_quotes, monthly_volume, credit_limit, outstanding)
- Recent orders: Shopify customer orders API, filtered to last 5
- Credit info optionally pulled from middleware/dealer ledger

---

### 3.2 DEALER ORDER HISTORY (`/account` tab or filter on dashboard)

Same table structure as Recent Orders but:
- Full pagination (Lumia's `pagination` snippet)
- Filters: date range, status, PO # search
- Sortable columns: date, total, status
- Each row clickable → `/account/orders/{hash}`

**Dealer-specific table columns vs retail**:

| Column | Retail | Dealer |
|--------|--------|--------|
| Order # | ✓ | ✓ |
| PO # | ✗ | ✓ (dealer's internal reference) |
| Date | ✓ | ✓ |
| Payment Status | ✓ | ✓ |
| Fulfillment Status | ✓ | ✓ |
| Items | ✗ | ✓ (dealer column) |
| Tier Price | ✗ | ✓ (shows wholesale, not retail) |
| Total | ✓ (retail) | ✓ (wholesale) |

---

### 3.3 DEALER QUICK ORDER (`/account?view=quick-order` or section on dashboard)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  QUICK ORDER                                                       Tier 2   ║
║  ───────────────────────────────────────────────────────────────────────────║
║                                                                              ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │  ORDER ENTRY                                                         │   ║
║  │                                                                      │   ║
║  │  PO #   [________________]  (your internal reference)                 │   ║
║  │                                                                      │   ║
║  │  ┌──────────────────────────────────────────────────────────────┐   │   ║
║  │  │  LINE ITEMS                                          [Add +] │   │   ║
║  │  │  ─────────────────────────────────────────────────────────── │   │   ║
║  │  │  # │ SKU / Search        │ Size │ Finish          │ Qty │ $ │   │   ║
║  │  │  ──┼─────────────────────┼──────┼─────────────────┼─────┼───│   │   ║
║  │  │  1 │ BR01-20-GB-PO-…     │ 20"  │ Gloss Black / … │  4  │ … │   │   ║
║  │  │    │ [________________]  │ [v]  │ configurator    │ [-] [+]│   │   ║
║  │  │  2 │ [________________]  │ [v]  │                 │     │   │   │   ║
║  │  └──────────────────────────────────────────────────────────────┘   │   ║
║  │                                                                      │   ║
║  │  Shipping Address  [v Use default]  or  [+ Add new]                  │   ║
║  │                                                                      │   ║
║  │  Notes  [________________________________________________________]  │   ║
║  │                                                                      │   ║
║  │  ┌──────────────────────┐                                           │   ║
║  │  │ ORDER SUMMARY        │                                           │   ║
║  │  │ 4 items              │                                           │   ║
║  │  │ Subtotal  $3,200.00  │    [Submit Order]  (primary, full width)  │   ║
║  │  │ Shipping  Calculated │    [Save as Draft]  (grey)                │   ║
║  │  │ Tax       Exempt     │                                           │   ║
║  │  │ ──────────────────── │                                           │   ║
║  │  │ Total     $3,200.00  │                                           │   ║
║  │  │ Terms     NET-30     │                                           │   ║
║  │  └──────────────────────┘                                           │   ║
║  └──────────────────────────────────────────────────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

#### COMPONENT BREAKDOWN

**PO # field**: `.form-group > .form-control` (38px height, bottom-border-only style). Optional — for dealer's internal system reference.

**Line item rows**: Dynamic list, each row contains:
- Row number (auto-incremented)
- **SKU input**: `.form-control` with autocomplete via Shopify predictive search API. As user types, a dropdown appears showing matching products with their tier price
- **Size selector**: `.form-select` (populated from available sizes for the selected product's variants)
- **Finish selector**: Opens a mini configurator modal or inline dropdown. For 3-piece wheels, shows center/barrel/hardware selects
- **Quantity**: Number input with ± stepper (Lumia's `quantity-input` pattern) — enforces MOQ minimum
- **Price per unit**: Auto-populates from tier pricing metafield
- **Remove button**: Small × icon (uses `.btn-link` style)

**Add row button**: `[+ Add Line]` — `.btn-link.btn-link--md` with plus icon. Appends a new empty row.

**Shipping address**: `.form-select` listing saved addresses + "Add new" option. Uses `customer.addresses`.

**Order summary sidebar**: `.custom-card.bg-alt` positioned right/floating. Shows running total. "Submit Order" creates a draft order via Shopify Admin API (or creates a quote if payment terms are involved). "Save as Draft" stores in customer metafields.

**MOQ enforcement**: If quantity < product MOQ, the row highlights with `var(--dealer-danger)` border and shows inline warning (like existing `dealer-cart-moq`).

#### IMPLEMENTATION NOTES
- This is the highest-value dealer feature — replaces "email us your order" with self-service
- Line-item autocomplete: uses `/search/suggest?q=` endpoint, filtered to dealer-visible products
- Pricing: reads `product.metafields.custom.dealer_tier_X_price` per the existing dealer-price snippet
- Stock validation: checks `product.variants[].inventory_quantity` (or realtime ledger API) before allowing submit
- Draft order creation via Shopify Admin API (requires a backend service/app)

---

### 3.4 DEALER QUOTE MANAGEMENT (`/account` — quote-list section)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  MY QUOTES                                               [Request New Quote] ║
║  ───────────────────────────────────────────────────────────────────────────║
║                                                                              ║
║  FILTERS:  [All v]  [Pending]  [Approved]  [Converted]  [Expired]           ║
║                                                                              ║
║  ┌────────────────────────────────────────────────────────────────────────┐ ║
║  │ Quote #  │ Product            │ Date       │ Status    │ Total  │      │ ║
║  │ ─────────┼────────────────────┼────────────┼───────────┼────────┼──────│ ║
║  │ Q-0047   │ BR01 · Mob         │ Aug 17 26  │ Pending   │ $3,200 │ View │ ║
║  │          │ 20" GB / PO / CH   │            │  Review   │        │      │ ║
║  │ ─────────┼────────────────────┼────────────┼───────────┼────────┼──────│ ║
║  │ Q-0046   │ HR02 · Viper       │ Aug 14 26  │ Approved  │ $6,400 │ [Buy]│ ║
║  │          │ 22" MB / SB / BK   │            │           │        │      │ ║
║  │ ─────────┼────────────────────┼────────────┼───────────┼────────┼──────│ ║
║  │ Q-0045   │ FR05 · Phantom     │ Aug 10 26  │ Converted │ $1,600 │ #1039│ ║
║  │          │ 19" CU / PO / TI   │            │           │        │      │ ║
║  │ ─────────┼────────────────────┼────────────┼───────────┼────────┼──────│ ║
║  │ Q-0044   │ BR02 · Sovereign   │ Aug 02 26  │ Expired   │ $4,800 │ —    │ ║
║  │          │ 21" MG / PO / GO   │            │           │        │      │ ║
║  └────────────────────────────────────────────────────────────────────────┘ ║
║                                                                              ║
║  EMPTY STATE:                                                                ║
║  ┌────────────────────────────────────────────────────────────────────────┐ ║
║  │                         No quotes yet                                   │ ║
║  │        When you configure a wheel and request a quote, it will          │ ║
║  │        appear here for you to review, approve, and order.               │ ║
║  │                                                                         │ ║
║  │                    [Configure a Wheel]    [Browse Catalog]              │ ║
║  └────────────────────────────────────────────────────────────────────────┘ ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

#### COMPONENT BREAKDOWN

**Filter bar**: `.btn` group or pill-style tabs above the table. Uses `.btn--sm` sized buttons:
- "All" (active/pill style)
- "Pending", "Approved", "Converted", "Expired" (`.btn--grey` or `.btn--invert`)

Each filter state shows/hides rows client-side (using List.js which Lumia already bundles).

**Quote row expansion**: Each row has a "View" link that expands inline to show:
- Full configuration details (center, barrel, hardware finishes)
- Vehicle fitment (if provided with quote)
- Notes from dealer
- Original quote PDF (if generated)
- "Cancel Quote" action (for pending quotes)

**Approved quote actions**: Shows "[Complete Order]" `.btn--sm` primary button that converts the quote to a Shopify order (via Draft Order API or direct checkout URL).

**Converted quote**: Shows order number as a link → `/account/orders/{hash}`.

**Expired quote**: Shows "—" no action available. Optional "Re-quote" link.

#### IMPLEMENTATION NOTES
- Quote data source: `customer.metafields.custom.quotes.value` (JSON array) — existing pattern in quote-list snippet
- Filters: client-side JS using List.js (already bundled in Lumia) or simple class toggling
- Quote-to-order: POST to middleware/app that creates a Shopify Draft Order with the quote's line items at tier pricing
- Expiry: quotes auto-expire after 7 days (configurable). Server-side flag flips `status: "expired"` on the metafield

---

### 3.5 DEALER CATALOG (`/collections/dealer-only` + all products)

The dealer catalog **is the same storefront** — not a separate interface. The difference is what dealers SEE on the same pages:

#### 3.5.1 Collection Page — Dealer View

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  FORGED SERIES                                                              ║
║  ───────────────────────────────────────────────────────────────────────────║
║  [Filters: Series v] [Size v] [Finish v] [Bolt Pattern v]  Dealer Mode: ON  ║
║                                                                              ║
║  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                ║
║  │    [Image]      │  │    [Image]      │  │    [Image]      │                ║
║  │                 │  │                 │  │                 │                ║
║  │  BR01 · Mob     │  │  BR02 · Sov.    │  │  FR05 · Phantom │                ║
║  │  Forged Mono    │  │  Forged Mono    │  │  Flow Formed    │                ║
║  │                 │  │                 │  │                 │                ║
║  │  DEALER: $680   │  │  DEALER: $720   │  │  DEALER: $520   │                ║
║  │  MSRP:  $850    │  │  MSRP:  $900    │  │  MSRP:  $650    │                ║
║  │  You save 20%   │  │  You save 20%   │  │  You save 20%   │                ║
║  │  MOQ: 4         │  │  MOQ: 4         │  │  MOQ: 4         │                ║
║  └────────────────┘  └────────────────┘  └────────────────┘                ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

#### 3.5.2 Product Detail Page — Dealer View

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  BR01 · MOB — Forged Monoblock                                     Tier 2   ║
║  ───────────────────────────────────────────────────────────────────────────║
║                                                                              ║
║  ┌─────────────────────┐                                                     ║
║  │                     │   ┌─────────────────────────────────────────────┐   ║
║  │    [Image Gallery]  │   │  DEALER PRICING                             │   ║
║  │                     │   │                                             │   ║
║  │                     │   │  Your Price (Tier 2)         $680.00        │   ║
║  │                     │   │  MSRP                        $850.00        │   ║
║  │                     │   │  You save 20% ($170.00)                     │   ║
║  │                     │   │                                             │   ║
║  │                     │   │  Min. Order Quantity: 4 units               │   ║
║  │                     │   │                                             │   ║
║  │                     │   │  IN STOCK — Ready to build                  │   ║
║  │                     │   │                                             │   ║
║  │                     │   │  ┌──────────────────────────────────┐       │   ║
║  │                     │   │  │ Size:  [20" v]  Qty: [-] 4 [+] │       │   ║
║  │                     │   │  │ Finish:  [Configure →]         │       │   ║
║  │                     │   │  └──────────────────────────────────┘       │   ║
║  │                     │   │                                             │   ║
║  │                     │   │  [Add to Cart]    [Request Quote]           │   ║
║  │                     │   │   (primary)         (grey)                  │   ║
║  │                     │   └─────────────────────────────────────────────┘   ║
║  └─────────────────────┘                                                     ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

#### COMPONENT BREAKDOWN

**Dealer Mode indicator** (collection page): Subtle banner or badge showing "Dealer Mode: ON — Tier 2 Pricing" with a link to switch back to retail view (useful for previewing what customers see).

**Product card dealer overlay** (collection): 
- Below product title/price: dealer price in `var(--custom-color)` + MSRP in strikethrough + savings % in green
- MOQ badge: small `var(--decor-border-dark-color)` border badge showing "MOQ: 4"
- Uses existing `dealer-price.liquid` snippet logic

**PDP dealer pricing block** (replaces retail price block):
- `.dealer-price` custom card (already styled in `dealer-portal.css`):
  - Your Price: `var(--custom-color)`, 1.3rem, weight 700
  - MSRP: strikethrough, `var(--text-color)` at 50% opacity
  - Savings: green, 0.85rem, weight 600
  - MOQ: italic, 0.8rem, 60% opacity
- This is the existing `dealer-price.liquid` snippet — fully implemented

**Dealer-only products**: Products tagged `dealer-only` are:
- Hidden from standard collections (Liquid conditional: `unless product.tags contains 'dealer-only' or is_dealer`)
- Visible in dealer catalog at `/collections/dealer-only` (auto-filtered collection)
- Search results exclude dealer-only for retail customers

**Dual CTA on PDP**: "Add to Cart" (primary) + "Request Quote" (grey) — gives dealers the choice to order now or get a formal quote first.

#### IMPLEMENTATION NOTES
- Dealer catalog is NOT a separate store — it's the same Liquid templates with conditional rendering
- Product cards: modify `product-card.liquid` snippet to call `render 'dealer-price'` when `is_dealer`
- PDP: modify `main-product.liquid` to replace the price block with dealer pricing when `is_dealer`
- Dealer-only gating: add a Liquid conditional in `main-collection-product-grid.liquid` to filter out dealer-only products for non-dealers
- Search gating: modify predictive search results to exclude dealer-only for non-dealers

---

### 3.6 DEALER APPLICATION PAGE (`/pages/dealer-apply`)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  BECOME A DEALER                                                            ║
║  ───────────────────────────────────────────────────────────────────────────║
║  Join our wholesale program. Fill out the application below and our team     ║
║  will review within 1-2 business days.                                       ║
║                                                                              ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │  STEP 1 OF 4: BUSINESS INFORMATION                                    │   ║
║  │  ─────────────────────────────────────────────────────────────────── │   ║
║  │                                                                      │   ║
║  │  STEP INDICATOR:  ● Business Info  ○ Contact  ○ Address  ○ Review    │   ║
║  │                                                                      │   ║
║  │  Business Name *          [________________________________]         │   ║
║  │  Tax ID / EIN *           [________________________________]         │   ║
║  │  Business Website         [________________________________]         │   ║
║  │  Years in Business        [v Select]                               │   ║
║  │  Business Type            [v Select] (Shop / Online / Distributor)   │   ║
║  │  Annual Revenue (est.)    [v Select]                               │   ║
║  │  Resale Certificate       [ Upload PDF ]  (optional)                │   ║
║  │                                                                      │   ║
║  │                                              [Next: Contact Info →]   │   ║
║  └──────────────────────────────────────────────────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

#### MULTI-STEP FORM — All 4 Steps

**Step 1: Business Information** (shown above)
- Fields: Business Name*, Tax ID/EIN*, Website, Years in Business (select), Business Type (select: Shop/Online/Distributor/Other), Annual Revenue range (select), Resale Certificate upload
- Button: "Next: Contact Info →"

**Step 2: Contact Information**
- Fields: First Name*, Last Name*, Title/Role, Email*, Phone*, Preferred Contact Method (radio: Email/Phone)

**Step 3: Shipping Address**
- Fields: Address Line 1*, Address Line 2, City*, State/Province*, ZIP/Postal Code*, Country* (select)
- Checkbox: "Same as billing address"

**Step 4: Review & Submit**
- Summary of all entered data (read-only, in card format)
- Terms checkbox*: "I certify that the information provided is accurate and agree to the Wholesale Terms & Conditions"
- Submit button: "Submit Application" (.btn, full width)
- Note: "Applications are typically reviewed within 1-2 business days. You will receive an email notification when your application is approved."

#### FORM COMPONENT PATTERNS

All inputs use Lumia's form system:
- `.form-group > label.form-label + .form-control-wrap > .form-control`
- Selects: `.form-control-wrap--select > .form-select`
- File upload: `.form-control[type=file]` styled as Lumia button
- Step indicator: `.text-center` row of circles connected by lines, active step filled with `var(--custom-color)`
- Navigation: "← Back" (`.btn-link.btn-link--md` left) + "Next →" (`.btn` right)
- Review step: `.custom-card.bg-alt` sections grouping data by step

#### VALIDATION
- Client-side: HTML5 validation (`required`, `type="email"`) on each step before advancing
- Server-side: Form submits to Shopify's customer form or a custom app endpoint
- On submit: creates/locates customer account, adds tag `dealer-applied`, stores application data in customer metafields, sends admin notification email

#### IMPLEMENTATION NOTES
- Multi-step form: pure CSS/JS (no framework needed) — show/hide `.form-step` divs
- Progress: simple JS state machine tracking `currentStep(1-4)`
- File upload for resale cert: Shopify file upload via AJAX or store as base64 in metafields (limit 512KB)
- Backend: app/webhook that watches for `dealer-applied` tags and notifies admin
- Admin approval workflow: manual in Shopify admin (change tags from `dealer-applied` → `dealer-approved` + `dealer-tier-X`)



---

### 3.7 APPLICATION STATUS — PENDING APPROVAL

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  MY ACCOUNT                                                                  ║
║  ───────────────────────────────────────────────────────────────────────────║
║                                                                              ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │                                                                      │   ║
║  │                           ⏳                                          │   ║
║  │                   Application Under Review                            │   ║
║  │                                                                      │   ║
║  │     Thank you for applying to become a dealer! Your application      │   ║
║  │     is being reviewed by our team. This typically takes 1-2          │   ║
║  │     business days.                                                   │   ║
║  │                                                                      │   ║
║  │     You'll receive an email at jane@dealershop.com when your         │   ║
║  │     application is approved.                                         │   ║
║  │                                                                      │   ║
║  │     In the meantime, you can browse our retail catalog:              │   ║
║  │                        [Browse Wheels]                                │   ║
║  │                                                                      │   ║
║  └──────────────────────────────────────────────────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

#### COMPONENT BREAKDOWN
- Centered `.custom-card.bg-alt` with generous padding
- Status icon: large clock/hourglass SVG or emoji (60px)
- Heading: `.h2-style` "Application Under Review"
- Body text: `var(--text-color)`, 15px
- Email hint: displays customer's email from `{{ customer.email }}`
- CTA: `.btn--grey` "Browse Wheels" linking to `/collections/all`

#### IMPLEMENTATION NOTES
- Detection: `customer.tags contains 'dealer-applied'` AND NOT `customer.tags contains 'dealer-approved'`
- This replaces the `dealer-dashboard` section in the account.json template when in pending state
- Can be a separate section (`dealer-pending.liquid`) or conditional rendering within dealer-dashboard

---

### 3.8 DEALER ORDER DETAIL (`/account/orders/{hash}` — enhanced)

The existing `main-order.liquid` already handles order detail. Dealer enhancements:

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  ← Back to Orders                                                           ║
║                                                                              ║
║  ORDER #1042                                                    Tier 2      ║
║  Placed on Aug 18, 2026  ·  PO # PO-8821  ·  NET-30 (due Sep 17, 2026)     ║
║  ───────────────────────────────────────────────────────────────────────────║
║                                                                              ║
║  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐   ║
║  │ ITEMS                           │  │ ORDER SUMMARY                   │   ║
║  │ ─────────────────────────────── │  │ ─────────────────────────────── │   ║
║  │ Product        │ Qty │ Price    │  │ Subtotal (4 items)   $3,200.00  │   ║
║  │ ───────────────┼─────┼───────── │  │ Shipping              $120.00   │   ║
║  │ BR01 · Mob     │  4  │ $680.00  │  │ Tax (Exempt)            $0.00   │   ║
║  │ 20" GB/PO/CH   │     │          │  │ ──────────────────────────────  │   ║
║  │ SKU: WH-BR01-… │     │ $2,720   │  │ Total               $3,320.00  │   ║
║  └─────────────────────────────────┘  │                                 │   ║
║                                        │ Payment: NET-30 (invoice)       │   ║
║  ┌─────────────────────────────────┐  │ Status: Awaiting Payment        │   ║
║  │ SHIPPING                        │  └─────────────────────────────────┘   ║
║  │ ─────────────────────────────── │                                         ║
║  │ Dealer Shop Inc.                │  ┌─────────────────────────────────┐   ║
║  │ 123 Auto Blvd, Suite 100        │  │ BILLING                         │   ║
║  │ Los Angeles, CA 90001           │  │ ─────────────────────────────── │   ║
║  │                                 │  │ Dealer Shop Inc.                │   ║
║  │ Fulfillment: Partially Shipped  │  │ 123 Auto Blvd                   │   ║
║  │ Tracking: 1Z999AA10123456784    │  │ Los Angeles, CA 90001           │   ║
║  │   [Track Package →]             │  │                                 │   ║
║  └─────────────────────────────────┘  │ Payment: NET-30                 │   ║
║                                        └─────────────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

#### DEALER-SPECIFIC ADDITIONS
- **PO # display**: Shows in order header next to date
- **NET-30 indicator**: Badge showing payment terms + due date
- **Tier pricing** in line items: Shows dealer price, not retail
- **Payment status**: "Awaiting Payment" for NET-30 orders (with due date), "Paid" for settled
- **Invoice link**: "Download Invoice" `.btn-link.btn-link--md` if QuickBooks invoice available
- **Re-order button**: "Order Again" `.btn--grey` that pre-fills Quick Order with same line items

#### IMPLEMENTATION NOTES
- PO # stored in order metafields: `order.metafields.custom.po_number`
- Payment status: order tag `net-30-pending` / `net-30-paid` or order metafield
- Invoice PDF: generated by QuickBooks, linked via middleware API
- Re-order: redirects to `/account?view=quick-order&duplicate={order_id}` with pre-filled line items

---

### 3.9 PAYMENT TERMS & INVOICES (`/account?view=payment-terms`)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  PAYMENT TERMS                                                              ║
║  ───────────────────────────────────────────────────────────────────────────║
║                                                                              ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │  ACCOUNT STATUS                                                       │   ║
║  │  Credit Limit: $50,000.00                                            │   ║
║  │  Outstanding:  $12,400.00                                            │   ║
║  │  Available:    $37,600.00                                            │   ║
║  │  Terms:        NET-30                                                │   ║
║  │  Status:       In Good Standing  ●                                   │   ║
║  └──────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
║  OUTSTANDING INVOICES                                                        ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │ Invoice #   │ Order #  │ Date       │ Due Date   │ Amount  │ Status  │   ║
║  │ ────────────┼──────────┼────────────┼────────────┼─────────┼─────────│   ║
║  │ INV-0892    │ #1042    │ Aug 18 26  │ Sep 17 26  │ $3,320  │ Unpaid  │   ║
║  │ INV-0885    │ #1041    │ Aug 15 26  │ Sep 14 26  │ $6,400  │ Unpaid  │   ║
║  │ INV-0870    │ #1035    │ Jul 28 26  │ Aug 27 26  │ $2,680  │ Paid    │   ║
║  │ INV-0862    │ #1030    │ Jul 15 26  │ Aug 14 26  │ $4,800  │ Paid    │   ║
║  └──────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
║  PAYMENT HISTORY                                                  [Export]   ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │ (same table as above, filtered to 'Paid' status, last 12 months)     │   ║
║  └──────────────────────────────────────────────────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

#### COMPONENT BREAKDOWN
- **Account Status card**: `.custom-card.bg-alt` with key metrics in `.dealer-dashboard__status-row` style
- **Outstanding Invoices table**: `.table.table-rounded-corners.table-striped.table-borderless` with `Unpaid`/`Paid`/`Overdue` badges
- **Overdue indicator**: If any invoice is past due date and unpaid → red warning banner at top (`.dealer-moq-warnings` style container with `var(--dealer-danger)` border)
- **Payment History**: Same table, sorted by date desc, limited to paid invoices
- **Export button**: `.btn--sm.btn--grey` "Export CSV" (generates download from metafield data)

#### IMPLEMENTATION NOTES
- Invoice data from QuickBooks via middleware API or stored in customer/order metafields
- Credit limit + outstanding from dealer ledger (middleware)
- Status badge colors: Unpaid = `.tb--color3` (amber), Paid = `.tb--color1` (green), Overdue = `.tb--color2` (red)
- Due date calculation: order date + 30 days for NET-30

---

### 3.10 DEALER LANDING PAGE (`/pages/dealer-program`)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                          [Hero Image — wheel photography]                    ║
║                                                                              ║
║                    BECOME A C WHEELS DEALER                                  ║
║          Premium forged wheels for your most discerning clients              ║
║                                                                              ║
║                    [Apply Now]    [Learn More ↓]                             ║
║                                                                              ║
║  ───────────────────────────────────────────────────────────────────────────║
║                                                                              ║
║  WHY PARTNER WITH US                                                         ║
║  ─────────────────                                                           ║
║                                                                              ║
║  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     ║
║  │   [icon]      │  │   [icon]      │  │   [icon]      │  │   [icon]      │     ║
║  │              │  │              │  │              │  │              │     ║
║  │  Tiered      │  │  Dealer-Only │  │  NET-30      │  │  Dedicated   │     ║
║  │  Pricing     │  │  Products    │  │  Terms       │  │  Support     │     ║
║  │              │  │              │  │              │  │              │     ║
║  │  Up to 25%   │  │  Exclusive   │  │  Wholesale   │  │  Account     │     ║
║  │  off MSRP    │  │  designs not │  │  payment     │  │  manager +   │     ║
║  │  with volume │  │  in retail   │  │  terms for   │  │  priority    │     ║
║  │  discounts   │  │  catalog     │  │  qualified   │  │  fulfillment │     ║
║  │              │  │              │  │  accounts    │  │              │     ║
║  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘     ║
║                                                                              ║
║  ───────────────────────────────────────────────────────────────────────────║
║                                                                              ║
║  HOW IT WORKS                                                                ║
║  ─────────────                                                               ║
║                                                                              ║
║     1. Apply  ───→  2. Get Approved  ───→  3. Start Ordering                ║
║     Fill out        Team reviews          Browse dealer catalog,             ║
║     application     within 1-2 days       place orders online,               ║
║                                           access tiered pricing              ║
║                                                                              ║
║  ───────────────────────────────────────────────────────────────────────────║
║                                                                              ║
║  FAQ                                                                         ║
║  ───                                                                         ║
║                                                                              ║
║  ┌─ Who can apply? ─────────────────────────────────────────────────────┐   ║
║  │  Registered businesses with a valid tax ID/resale certificate.        │   ║
║  │  We serve wheel/tire shops, automotive dealers, performance shops.    │   ║
║  └──────────────────────────────────────────────────────────────────────┘   ║
║  ┌─ What are the minimum order quantities? ─────────────────────────────┐   ║
║  │  MOQs vary by product and tier. Most designs require a minimum of     │   ║
║  │  4 wheels per SKU. Higher tiers may have reduced MOQs.                │   ║
║  └──────────────────────────────────────────────────────────────────────┘   ║
║  ┌─ How does pricing work? ─────────────────────────────────────────────┐   ║
║  │  Our tiered pricing gives you increasing discounts based on volume.   │   ║
║  │  Tier 1: 15% off MSRP | Tier 2: 20% off | Tier 3: 25% off             │   ║
║  └──────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
║                    [Apply to Become a Dealer]                                ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

#### COMPONENT BREAKDOWN

**Hero Section**: Uses Lumia's existing hero/banner patterns. Dark overlay image, large `.h1-style` heading, subtitle, dual CTAs.

**Value Props Grid**: 4-column icon grid. Lumia already has `index-icons.liquid` — reuses the same component pattern. Each cell: icon (SVG from theme's icon library or custom) → heading → description text.

**How It Works**: 3-step horizontal flow with arrows. Uses a flex row: step number circle (`var(--custom-color)` filled) → line → circle → line → circle. Each step has heading + description below.

**FAQ**: Lumia's existing accordion pattern from `index-faq.liquid`. Uses `<details>/<summary>` or custom accordion with `.faq-item` class. Chevron icon toggles.

**CTA Section**: Full-width band with `.btn` CTA, centered.

This page is a standard Shopify page (`page.dealer-program.liquid` template) — uses Lumia's page builder sections.

#### IMPLEMENTATION NOTES
- Build using Lumia's existing page sections: `index-icons` for value props, custom HTML for how-it-works, `index-faq` for FAQ
- This is primarily a content/marketing page — minimal custom dev needed
- The "Apply Now" CTA links to `/pages/dealer-apply` or opens a section on the same page

---

## 4. Section/Template File Map

### 4.1 New Files Needed

| File | Type | Purpose |
|------|------|---------|
| `sections/dealer-dashboard.liquid` | Section | **Rewrite** — Unified dashboard with stats, recent orders, account summary (replaces current basic version) |
| `sections/dealer-quick-order.liquid` | Section | **New** — Quick Order form with SKU autocomplete, line items, PO#, order summary |
| `sections/dealer-application.liquid` | Section | **New** — Multi-step dealer application form (Steps 1-4) |
| `sections/dealer-payment-terms.liquid` | Section | **New** — Payment terms summary + outstanding invoices table |
| `sections/dealer-pending.liquid` | Section | **New** — "Application Under Review" interstitial |
| `snippets/dealer-order-table.liquid` | Snippet | **New** — Reusable order table with dealer columns (PO#, tier price) |
| `snippets/dealer-quick-stats.liquid` | Snippet | **New** — Quick stats card (orders, volume, quotes, tier) |
| `snippets/dealer-account-summary.liquid` | Snippet | **New** — Account summary card (status, tier, terms, credit) |
| `snippets/dealer-sku-autocomplete.liquid` | Snippet | **New** — SKU search input with predictive results dropdown |
| `snippets/dealer-product-card.liquid` | Snippet | **New** — Product card with dealer pricing overlay |
| `snippets/dealer-application-form.liquid` | Snippet | **New** — Reusable application form field groups |
| `assets/dealer-portal.css` | CSS | **Expand** — Add all new dealer-specific styles |
| `assets/dealer-portal.js` | JS | **New** — Quick Order logic, application form state, autocomplete |

### 4.2 Modified Files

| File | Change |
|------|--------|
| `templates/customers/account.json` | Add `dealer-quick-order` and `dealer-payment-terms` as optional sections; add `dealer-pending` for pending state |
| `templates/customers/order.json` | Add PO# display, NET-30 indicator, invoice download link |
| `templates/page.dealer-apply.json` | **New template** — contains `dealer-application` section |
| `templates/page.dealer-program.json` | **New template** — standard page with hero, icons, FAQ sections |
| `sections/main-account.liquid` | Add dealer up-sell banner for retail customers |
| `sections/main-product.liquid` | Add `render 'dealer-price'` conditional block |
| `snippets/product-card.liquid` | Add `render 'dealer-price'` conditional block |
| `snippets/dealer-context.liquid` | Add `dealer-pending` state detection |
| `snippets/dealer-cart-moq.liquid` | Already exists — minor polish |
| `snippets/dealer-price.liquid` | Already exists — minor polish |
| `snippets/quote-list.liquid` | Expand with filters, inline expansion, empty state |
| `layout/theme.liquid` | Add `dealer-portal.js` conditional loading for dealer-tagged customers |

### 4.3 URL/Route Map

| URL | Template | Sections |
|-----|----------|----------|
| `/account` | `customers/account.json` | `main-account`, `dealer-dashboard`, `dealer-quick-order`, `quote-list`, `dealer-payment-terms` |
| `/account?section=quick-order` | AJAX section render | `dealer-quick-order` |
| `/account?section=payment-terms` | AJAX section render | `dealer-payment-terms` |
| `/account?section=dashboard` | AJAX section render | `dealer-dashboard` |
| `/account/orders/{hash}` | `customers/order.json` | `main-order` (enhanced) |
| `/account/addresses` | `customers/addresses.json` | `main-addresses` |
| `/pages/dealer-apply` | `page.dealer-apply.json` | `dealer-application` |
| `/pages/dealer-program` | `page.dealer-program.json` | Standard page sections |
| `/collections/dealer-only` | Standard collection | Collection grid + dealer pricing conditional |
| `/collections/*` (any) | Standard collection | Collection grid + dealer pricing conditional + dealer-only filter |
| `/products/*` (any) | Standard product | PDP + dealer pricing conditional |

---

## 5. Dashboard Tab Navigation Strategy

Since Shopify customer accounts render the entire `account.json` template, all dealer sections appear stacked on one long page. To create a tabbed experience:

### Option A: CSS-only tabs

Use radio inputs + CSS to show/hide sections:

```html
<div class="dealer-tabs">
  <input type="radio" name="dealer-tab" id="tab-dashboard" checked>
  <label for="tab-dashboard">Dashboard</label>

  <input type="radio" name="dealer-tab" id="tab-quick-order">
  <label for="tab-quick-order">Quick Order</label>

  <input type="radio" name="dealer-tab" id="tab-quotes">
  <label for="tab-quotes">Quotes</label>

  <input type="radio" name="dealer-tab" id="tab-payments">
  <label for="tab-payments">Payments</label>

  <div class="dealer-tab-content" id="content-dashboard">
    {% section 'dealer-dashboard' %}
  </div>
  <div class="dealer-tab-content" id="content-quick-order">
    {% section 'dealer-quick-order' %}
  </div>
  <!-- etc. -->
</div>
```

**Pros**: No JS dependency, all content pre-rendered, SEO-friendly.
**Cons**: All sections load on every page view (heavier initial payload).

### Option B: JS + AJAX section rendering

Each tab fetches its section via `/?section_id=dealer-quick-order` (Shopify Section Rendering API). Initial load shows dashboard only.

**Pros**: Lighter initial load, on-demand content.
**Cons**: Requires JS, slight latency on tab switch.

**Recommendation**: **Option A** for v1 — simpler, reliable, the payload is small enough (no images, just data tables). Can upgrade to Option B if dashboard data grows large.

---

## 6. CSS Architecture

### 6.1 Dealer Portal CSS File (`assets/dealer-portal.css` — expanded)

The existing `dealer-portal.css` (114 lines) gets expanded with these sections:

```
dealer-portal.css
├── 1. Dealer Tabs Navigation          (.dealer-tabs)
├── 2. Dashboard Layout                (.dealer-dashboard — existing, expanded)
├── 3. Quick Stats                     (.dealer-quick-stats)
├── 4. Account Summary                 (.dealer-account-summary)
├── 5. Quick Order                     (.dealer-quick-order)
│   ├── SKU Autocomplete               (.dealer-sku-search)
│   ├── Line Items Table               (.dealer-line-items)
│   └── Order Summary Sidebar          (.dealer-order-summary)
├── 6. Quote List                      (.quote-list — existing, expanded)
├── 7. Payment Terms                   (.dealer-payment-terms)
├── 8. Application Form                (.dealer-application)
│   ├── Step Indicator                 (.dealer-step-indicator)
│   └── Form Steps                     (.dealer-form-step)
├── 9. Pending Status                  (.dealer-pending)
├── 10. Product Card Dealer Overlay    (.dealer-product-card)
├── 11. Order Detail Enhancements      (.dealer-order-detail)
├── 12. MOQ Warnings                   (.dealer-moq-warnings — existing)
├── 13. Responsive Breakpoints         (@media queries)
│   ├── ≤ 768px: Stacked layout, full-width cards
│   └── ≤ 480px: Simplified tables, larger touch targets
└── 14. Dark Mode Compatibility        (all rules use CSS variables)
```

### 6.2 CSS Variable Usage

Every new class references CSS variables, never hardcoded values:

```css
.dealer-quick-stats__card {
  background: var(--body-bg-secondary);
  border: 1px solid var(--decor-border-color);
  border-radius: var(--radius-md);
  color: var(--text-color);
}

.dealer-quick-stats__value {
  font-size: var(--heading-lg-size);
  font-weight: var(--heading-global-weight);
  color: var(--custom-color);
}

.dealer-quick-stats__label {
  font-size: var(--heading-sub-size);
  color: var(--text-color-secondary);
  font-weight: var(--heading-sub-weight);
}
```

---

## 7. JavaScript Architecture

### 7.1 Dealer Portal JS (`assets/dealer-portal.js`)

```js
// Module pattern — attaches to window.ShopifyDealer or similar namespace
// Uses vanilla JS (no jQuery dependency, though jQuery is available via jq_lumia if needed)

const DealerPortal = {
  // Quick Order
  quickOrder: {
    init(container) { /* line item management, SKU autocomplete */ },
    addLine() { /* appends new empty line item row */ },
    removeLine(index) { /* removes line item */ },
    searchSKU(query) { /* fetches /search/suggest?q= */ },
    updateTotal() { /* recalculates running total */ },
    submitOrder() { /* POSTs to create draft order endpoint */ },
  },

  // Application Form
  application: {
    init(container) { /* step navigation, validation */ },
    nextStep() { /* validate current step, advance */ },
    prevStep() { /* go back */ },
    submit() { /* validate all, POST to endpoint */ },
  },

  // Dashboard
  dashboard: {
    init() { /* tab switching if using JS tabs */ },
  },

  // Quotes
  quotes: {
    filter(status) { /* show/hide rows by status */ },
    expandRow(rowId) { /* toggle inline quote detail */ },
  }
};

// Initialize based on page context
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.dealer-quick-order')) {
    DealerPortal.quickOrder.init(document.querySelector('.dealer-quick-order'));
  }
  if (document.querySelector('.dealer-application')) {
    DealerPortal.application.init(document.querySelector('.dealer-application'));
  }
  // etc.
});
```

### 7.2 Load Condition

In `theme.liquid`:
```liquid
{%- if customer and customer.tags contains 'dealer-approved' -%}
  {{ 'dealer-portal.css' | asset_url | stylesheet_tag }}
  {{ 'dealer-portal.js' | asset_url | script_tag }}
{%- endif -%}
```

---

## 8. Responsive Behaviour

### Breakpoints (Lumia's Bootstrap 5 grid breakpoints):

| Breakpoint | Layout Behaviour |
|------------|-----------------|
| **≥ 1400px** (xxl) | Full 2-3 column dashboard grid, sidebar summary cards |
| **≥ 1200px** (xl) | Same as xxl |
| **≥ 992px** (lg) | 2-column: main (8) + sidebar (4). Quick order: form full width, summary card floats right |
| **≥ 768px** (md) | 1-column stack. Cards full width. Tables scroll horizontally. Tab nav becomes compact |
| **< 768px** (sm) | Single column. All cards stacked. Order table shows 3 columns (Order#, Date, Status). Quick order: line items as cards instead of table rows. Tab nav: horizontal scroll or dropdown |
| **< 576px** | Same as sm but even tighter. MOQ warnings simplified. Buttons full width |

### Mobile-specific adaptations:

- **Dashboard stats**: 2×2 grid → 2×1 stack on mobile
- **Order tables**: Hide PO# and Items columns on small screens; show Order#, Date, Total, Status only
- **Quick Order**: Line items convert from table rows to stacked cards (SKU, size, qty per card)
- **Application form**: Full-width inputs, step indicator hidden (replace with "Step X of 4" text)
- **Tabs**: Horizontal scroll tabs with arrow indicators instead of wrapping

---

## 9. States Matrix

Every component has designed states:

| Component | Loading | Empty | Error | Edge Case |
|-----------|---------|-------|-------|-----------|
| Dashboard | Skeleton cards (pulsing `.custom-card` placeholders) | "Welcome to your dealer dashboard — start by browsing the catalog" | "Unable to load dashboard data. [Retry]" | First-time login after approval: welcome banner |
| Quick Order | Autocomplete spinner in SKU field | Empty line item table with "Add your first item" prompt | "SKU not found" inline message; "Order submission failed — please try again" | Product out of stock: row highlights red, "Unavailable" badge |
| Order History | Table with skeleton rows | "No orders yet — [Place your first order]" | "Unable to load orders — [Retry]" | Large order history: paginated (15/page) |
| Quotes | Table skeleton | "No quotes yet" with CTA (existing) | "Unable to load quotes" | Expired quote with "Re-quote" action |
| Payment Terms | Card skeleton | N/A (always shows account summary) | "Unable to load invoice data" | Overdue invoice: red warning banner |
| Application Form | Submit button shows spinner on submit | N/A (form always visible) | Field-level red error text + border; "Submission failed — please try again" | Already applied: redirect to pending status page |
| Pending Status | N/A | N/A | N/A | Re-application: "You already have an application under review" |
| Product Cards | Standard Lumia skeleton loader | N/A (always shows) | Dealer price unavailable: show MSRP only with "Contact for pricing" | Product tagged dealer-only but viewed by non-dealer: hidden entirely |

---

## 10. Implementation Priority & Phases

### Phase 1 — Core Dealer Experience (launch-critical)
1. **Dealer Dashboard** — unified dashboard with stats + recent orders + account summary
2. **Dealer Pricing on PDPs + Product Cards** — reuse existing `dealer-price.liquid`
3. **Dealer-only Product Gating** — collection filtering for dealer-only products
4. **MOQ Enforcement in Cart** — existing `dealer-cart-moq.liquid`
5. **Dealer Application Form** — multi-step form + pending status page
6. **Dealer Landing Page** — marketing page for dealer program

### Phase 2 — Self-Service (1-2 sprints after launch)
7. **Quick Order** — SKU-based fast order entry
8. **Enhanced Quote Management** — filters, inline expansion, quote-to-order
9. **Enhanced Order Detail** — PO#, NET-30 indicators, invoice links

### Phase 3 — Financial (post-stabilization)
10. **Payment Terms & Invoices** — outstanding invoices, payment history, credit limit
11. **Dealer Order Guide** — downloadable PDF price list
12. **Re-order functionality** — duplicate previous orders

---

## 11. Design Rationale — Key Decisions

### Why tabs and not a separate subdomain?
Shopify customer accounts live at `/account`. A separate subdomain (e.g., `dealers.cwheels.com`) fragments the experience and complicates auth — dealers would need two logins. Tabs keep everything under one authenticated session.

### Why CSS-only tabs for v1?
The entire dashboard data (stats, 5 recent orders, quote list) is small payload. No images, just structured data. Full-page load with CSS tabs is simpler and more reliable than AJAX lazy-loading for this data volume. Can migrate to JS lazy tabs if needed.

### Why the same PDP for dealers and retail?
Maintaining two PDP templates doubles maintenance. Dealers see the same experience plus a pricing block and dual CTA. The "Dealer Mode: ON" indicator lets them toggle to retail view to preview what their customers see.

### Why native Shopify B2B approach (not headless)?
Per the architecture doc (§8 open decision): "Lean native Shopify B2B if it covers tiers + terms; go headless only if tiered-pricing/MOQ rules exceed Shopify B2B limits." Our design uses Shopify's native customer accounts, tags, metafields, and existing theme patterns — no headless complexity needed for v1.

### Why `dealer-portal.css` + `dealer-portal.js` as separate assets?
Lumia already conditionally loads `dealer-portal.css` for dealer-tagged customers. Following the same pattern for JS keeps the payload zero for retail customers. Both files are small (~5-8KB combined).

---

*Created: 2026-08-19 — Complete dealer portal design mapped to Lumia theme v7.0.1 design system*