# Calder Wheels — Cross-Page / Shared-Component Assessment

## Scope

This assessment was produced after sequential inspection of the six client-approved desktop mockups. Page-specific observations remain page-specific; measurements were not averaged across pages.

## Visual System

The consumer system is built around deep navy, white/off-white, and warm gold. Headings are predominantly uppercase, heavy, geometric sans-serif forms; supporting text is compact and restrained. Buttons are rectangular with very low radius, uppercase tracked labels, and either dark navy, gold fill, or outlined treatments. The system favors crisp dividers, light-gray card borders, modest shadows, and disciplined alignment rather than rounded SaaS styling.

The imagery system alternates between cinematic automotive lifestyle photography, clean wheel renders, close-up wheel/engineering imagery, and manufacturing proof. Gold is used as emphasis rather than as a dominant page background.

## Global / Shared Component Matrix

| Component | Home | Category | Product | Cart | Checkout | Dealer |
|---|---:|---:|---:|---:|---:|---:|
| Consumer global header | ✓ | ✓ | ✓ | ✓ | — | — |
| Consumer global footer | ✓ | ✓ | ✓ | ✓ | — | — |
| Minimal checkout header/footer | — | — | — | — | ✓ | — |
| Dealer portal shell | — | — | — | — | — | ✓ |
| Find Your Fit / fitment language | ✓ | ✓ | ✓ | ✓ context | ✓ context | — |
| Gold uppercase eyebrow | ✓ | ✓ | ✓ | ✓ | limited | ✓ |
| Navy / gold CTA system | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fitment-confirmed green state | — | product cards | ✓ | ✓ | ✓ | — |
| Product card family | ✓ editorial | ✓ commerce | ✓ recommendations | — | summary item | ✓ dealer variant |
| Specialist/contact CTA | — | ✓ | ✓ | ✓ | support only | dealer support |
| Newsletter band | ✓ | ✓ | — | — | — | — |
| Progress indicator | — | — | — | 3-step | 5-step | production tracker variant |

## Shared Geometry Rules

Consumer pages use a centered content container with consistent internal left/right edges, but the exact container width is page- and screenshot-specific. Home/Product use approximately 38–40 px gutters at an 824 px source width; Category uses approximately 45 px at 1024 px; Cart uses approximately 62 px at 1374 px; Checkout uses approximately 48 px at 1222 px. These are page observations, not a token average.

Full-bleed dark or photographic bands intentionally break the container on Home and Product. Category keeps its primary commerce content inside a wide container after the hero. Cart is intentionally sparse and contained. Checkout is a separate minimal shell. Dealer uses a fixed ~207 px left application sidebar plus an independent portal content canvas.

## Shared Typography

The strongest invariant is hierarchy rather than an exact font token: uppercase heavy navy/white display headings; small gold uppercase eyebrows with expanded tracking; compact uppercase navigation and CTA labels; regular sans-serif body copy; muted blue-gray secondary text. Exact font family remains UNKNOWN until verified against brand/theme assets.

## Shared Buttons and Controls

Primary gold CTAs use warm metallic/tan gold with dark navy text or white text depending context. Dark primary CTAs use deep navy with white uppercase labels. Secondary CTAs are typically thin navy/gold outlines. Controls are mostly square/low-radius with thin light-gray borders. Avoid pill-shaped general controls; rounded pills are reserved for compact statuses/badges.

## Shared Commerce States

Fitment confirmation is a cross-page state: green icon/check + green uppercase label + selected vehicle. It appears in Category product cards, Product purchase panel, Cart line items, and Checkout order summary. This should be governed as one semantic visual state with controlled size variants.

Product imagery is generally isolated cleanly against white in commerce contexts, while marketing contexts use installed/lifestyle photography. Do not substitute one treatment for the other.

## Page Shell Variants

**Consumer shell:** Home, Category, Product, Cart use the full dark global header and full marketing footer.

**Checkout shell:** Checkout intentionally removes full navigation and marketing footer, replacing them with a white secure header and compact dark support footer.

**Dealer shell:** Dealer Dashboard is an authenticated application shell with fixed dark sidebar and white top utility bar. It shares Calder brand tokens, not consumer information architecture.

These three shells should be treated as controlled variants rather than duplicated unrelated systems.

## Reusable Component Recommendations for Implementation Mapping

- `global-header` — GLOBAL consumer shell component; preserve page-specific nav label differences only if authoritative.
- `global-footer` — GLOBAL consumer shell component; footer column copy varies slightly across references and should be reconciled against project content authority before implementation.
- `fitment-finder` — SHARED with Home/Category layout variants and product/cart/checkout state variants.
- `fitment-status` — SHARED semantic status component.
- `product-card` — SHARED family with collection, recommendation, editorial, and dealer variants.
- `cta-banner-specialist` — SHARED across Category/Product/Cart with controlled background/image/content variants.
- `newsletter-band` — SHARED Home/Category.
- `commerce-progress` — SHARED conceptual component with Cart 3-step and Checkout 5-step variants.
- `order-summary` — SHARED Cart/Checkout family.
- `dealer-card-shell` and `dealer-status-pill` — SHARED inside portal scope only.

## Cross-Page Invariants to Protect

1. Deep navy remains the dominant structural color; gold remains accent/action emphasis.
2. Major headings stay visually dense, uppercase, and high contrast.
3. Containers align deliberately; avoid arbitrary per-section horizontal drift.
4. Wheel imagery must remain the focal product element and must not be regenerated when approved/supplied product renders exist.
5. Fitment context should persist visibly through browse → product → cart → checkout.
6. Low-radius rectangular controls are the default.
7. Shared-component corrections must be regression-checked on every page already accepted.
8. Checkout and Dealer must not inherit the consumer shell merely for code reuse.

## Responsive Assumptions

No responsive mockups were supplied. Any mobile/tablet behavior remains ASSUMPTION. Likely transformations include collapsed consumer navigation, drawer-based collection filters, reduced product-grid columns, stacked PDP/cart/checkout columns, swipeable media/variant strips, and a collapsible dealer sidebar. These should not be treated as approved responsive designs.

## Uncertainties Requiring Project-Side Verification

- Exact approved font family and weight mapping.
- Exact brand HEX tokens versus screenshot-derived approximations.
- Final authoritative footer/nav copy where references differ slightly.
- Sticky behavior for headers, filters, order summaries, or dealer navigation.
- Existing Shopify fitment/filter/gallery/cart behavior that should be preserved.
- Shopify checkout customization limits for the active store/plan.
- Exact source image assets and object-position values.

## Handoff Rule

The six page JSON artifacts are the primary machine contracts. This cross-page assessment governs reuse and regression awareness, but it must not override a clear page-specific observation in an individual visual specification.
