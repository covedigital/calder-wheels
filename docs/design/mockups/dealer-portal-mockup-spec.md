# Calder Wheels Dealer Portal Mockup Spec

This spec maps the image mockups into implementation-ready text for a local agent that cannot inspect the PNGs.

## Source files

- `docs/design/mockups/dealer-portal-mockups.html`
- `docs/design/mockups/dealer-portal-dashboard-mockup.png`
- `docs/design/mockups/dealer-portal-quick-order-mockup.png`
- `docs/design/mockups/dealer-portal-quotes-payment-terms-mockup.png`
- `docs/design/mockups/dealer-portal-pending-landing-mockup.png`

## Shared design language

- Dark luxury palette
- Gold accent for dealer states and primary actions
- Premium editorial typography
- Soft borders, matte cards, subtle glow
- Shopify customer-account style layout
- One canonical dealer portal for approved accounts

## Screen 1: Dealer Dashboard

### Goal
Provide the dealer a high-level account hub with activity and shortcuts.

### Layout
- Left sidebar navigation
- Top header with tier badge, NET-30 badge, and account status
- 3 or 4 quick stat cards
- Recent orders table
- Quick actions panel
- Pending quotes list
- Account summary card

### Required elements
- `Dealer Dashboard`
- `Tier 2`
- `NET-30`
- `Recent Orders`
- `Quick Actions`
- `Pending Quotes`
- `Account Summary`

## Screen 2: Quick Order

### Goal
Allow dealers to place a wholesale order by SKU with PO reference.

### Layout
- PO # field
- Shipping address field
- Line items table
- Order summary sidebar
- Submit and draft actions

### Required elements
- `Quick Order`
- `PO #`
- `Line Items`
- `SKU / Search`
- `Size`
- `Finish`
- `Qty`
- `Order Summary`
- `Submit Order`
- `Save as Draft`

## Screen 3: Quotes / Payment Terms

### Goal
Combine quote management with dealer account finance status.

### Layout
- Quote filter/search controls
- Quote list table
- Payment terms summary
- Outstanding invoices table
- Payment history table

### Required elements
- `My Quotes`
- `Payment Terms`
- `NET-30`
- `Credit Limit`
- `Outstanding Balance`
- `Available Credit`
- `Outstanding Invoices`
- `View Invoice`
- `Pay Now`

## Screen 4: Dealer Landing / Pending Approval

### Goal
Present the dealer program and the pending application state.

### Layout
- Hero marketing block
- Three benefit cards
- Call-to-action buttons
- Application status card
- Review timeline
- ETA and status notes

### Required elements
- `Become a Dealer`
- `Wholesale Access`
- `Tiered Pricing`
- `Dealer-Only Catalog`
- `Apply Now`
- `Application Under Review`
- `Pending Approval`
- `1-2 Business Days`

## Shopify implementation mapping

- Dashboard -> `sections/dealer-dashboard.liquid`
- Quick Order -> `sections/dealer-quick-order.liquid`
- Quotes / Payment Terms -> `sections/dealer-quotes.liquid` and `sections/dealer-payment-terms.liquid`
- Dealer Landing -> `sections/dealer-landing.liquid`
- Pending state -> `sections/dealer-pending.liquid`

## Notes for the local agent

- Use the HTML file as the structural source if image inspection is unavailable.
- The PNGs are visual references only.
- Keep the portal aligned with the Lumia theme patterns and the existing dealer portal requirements.
