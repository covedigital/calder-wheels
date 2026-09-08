# Calder Wheels — Project Tasks

> **Source**: Synthesized from `docs/architecture/architecture.md`, `docs/design/dealer-portal-design.md`, `docs/discovery/requirements.md`, `docs/proposal/calder-wheels-proposal.md`
> **Status**: Working task list — maps to the three workstream proposal (WS1/WS2/WS3)
> **Timeline**: 10–12 weeks from kickoff

---

## Phase 0 — Foundation & Architecture (Week 1–2)

### 0.1 Final Architecture Decisions
- [ ] Lock integration layer stack: n8n + custom ledger service vs fully custom middleware
- [ ] Confirm dealer portal approach: native Shopify B2B vs headless
- [ ] Confirm fitment data source: manual curated DB for launch (ACES/PIES deferred)
- [ ] Confirm configurator delivery: Shopify app extension vs embedded custom SPA
- [ ] Confirm finish preview approach: pre-rendered 2D layer composites for v1

### 0.2 Environment & Setup
- [ ] Provision Shopify partner/dev store
- [ ] Install/configure Lumia 7.0.1 theme
- [ ] Set up n8n instance (or integration layer)
- [ ] Verify QuickBooks Desktop Enterprise 24.0 environment access (Windows)
- [ ] Provision Quickbase account (client-paid, separate from build fee)
- [ ] Set up ShipStation account + API keys
- [ ] Configure git repo + branch strategy

---

## WS1 — Commerce & Dealer Platform ($11,750)

### 1.1 Shopify Storefront Foundation
- [ ] Homepage layout (dark/luxury aesthetic, photography-led hero)
- [ ] Wheel catalog — series taxonomy (Forged / Flow-Formed / 3-Piece) with faceted URL-param filtering
- [ ] Product pages (PDP) with design nickname + code naming (`BR01 · MOB`)
- [ ] Finish matrix photography integration on PDP
- [ ] Vehicle + Wheel dual gallery (vehicle-first + design-first browsing)
- [ ] Mobile-responsive layout across all catalog pages
- [ ] SEO/AEO foundation + analytics setup
- [ ] Customer accounts (standard Shopify)
- [ ] Checkout (Shopify native, with financing/accelerated checkout as extensions)

### 1.2 Wheel Configurator
- [ ] Component model: center finish × barrel/lip finish × hardware finish
- [ ] Pre-rendered 2D layer composite system (up to 5 designs × ~60 finish combos)
- [ ] Price calculation from component pricing
- [ ] Realtime availability gate — queries `availableToBuild(SKU)` from ledger
- [ ] Invalid/out-of-stock combinations disabled in UI
- [ ] Configurator integration on PDP (Shopify app extension or embedded SPA)
- [ ] Config → resolved SKU → add to cart flow

### 1.3 Vehicle Fitment Finder
- [ ] Manual curated fitment database structure (Year → Make → Model → Generation/Trim)
- [ ] Fitment API/service (queries eligible SKUs by vehicle)
- [ ] Frontend fitment finder component on storefront
- [ ] Integration with PDP — only show compatible wheels
- [ ] Never-surface-incompatible rule enforced at DB + API level

### 1.4 Dealer/B2B Portal — Phase 1 (Core)
- [ ] Dealer landing page (`/pages/dealer-program`)
- [ ] Multi-step dealer application form (`/pages/dealer-apply`)
  - [ ] Step 1: Business Information
  - [ ] Step 2: Contact Information
  - [ ] Step 3: Shipping Address
  - [ ] Step 4: Review & Submit
- [ ] Application submission → customer tag `dealer-applied`
- [ ] Admin approval workflow (manual tag change to `dealer-approved` + `dealer-tier-X`)
- [ ] Pending status interstitial (`dealer-pending.liquid`)
- [ ] Dealer dashboard — unified account hub at `/account`
  - [ ] Quick stats (orders, volume, quotes, tier)
  - [ ] Recent orders table with dealer columns (PO#, tier price)
  - [ ] Quick actions panel
  - [ ] Account summary (status, tier, credit)
  - [ ] Pending quotes list
- [ ] CSS-only tab navigation (Dashboard / Quick Order / Quotes / Payments)
- [ ] Dealer pricing on PDP — `dealer-price.liquid` with tier pricing + MOQ
- [ ] Dealer pricing on collection product cards
- [ ] Dealer-only product gating (filter from retail catalog + search)
- [ ] MOQ enforcement in cart (`dealer-cart-moq.liquid`)

### 1.5 Dealer/B2B Portal — Phase 2 (Self-Service)
- [ ] Quick Order form (`dealer-quick-order.liquid`)
  - [ ] SKU autocomplete with predictive search
  - [ ] Line item management (add/remove rows)
  - [ ] Size + finish selectors
  - [ ] Running order summary with tier pricing
  - [ ] PO# field
  - [ ] Submit Order (creates draft order via Shopify Admin API)
  - [ ] Save as Draft
- [ ] Enhanced quote management (filters, inline expansion, quote-to-order)
- [ ] Enhanced order detail — PO# display, NET-30 indicator, invoice link
- [ ] Re-order functionality (duplicate previous order into Quick Order)

### 1.6 Dealer/B2B Portal — Phase 3 (Financial)
- [ ] Payment terms summary page (`/account?view=payment-terms`)
  - [ ] Account status card (credit limit, outstanding, available)
  - [ ] Outstanding invoices table
  - [ ] Payment history table
  - [ ] Overdue warning banner
- [ ] Dealer order guide — downloadable PDF price list
- [ ] Invoice download from QuickBooks

---

## WS2 — Systems Integration & Automation ($4,250)

### 2.1 n8n Integration Layer
- [ ] n8n workflow engine setup + deployment
- [ ] Shopify webhook receiver (order created/updated)
- [ ] QuickBooks Web Connector + qbXML communication setup (Windows)
- [ ] Secure queue management (cloud queue → Windows polling)
- [ ] Customer sync: Shopify → QuickBooks (match existing or create)
- [ ] Order → QuickBooks invoice: line items, SKUs, pricing, shipping, tax, order reference
- [ ] BOM/component mapping: configured wheel → component decomposition → QB inventory deduction
- [ ] ShipStation integration: eligible order → label → tracking → push back to Shopify + Quickbase
- [ ] Idempotency + duplicate prevention on all transactions
- [ ] Retry logic + failed-job queue + error reporting
- [ ] Integration logs + audit trail

### 2.2 Inventory Ledger Service
- [ ] Custom component ledger database (component quantities on-hand, reserved, on-order)
- [ ] BOM definitions CRUD (which components make which finished SKU)
- [ ] `availableToBuild(SKU)` function — `min(floor((on_hand - reserved) / qty))`
- [ ] Component reservation on order placement
- [ ] Component deduction on order fulfillment
- [ ] API exposed to Shopify configurator (realtime availability check)
- [ ] Derived finished-SKU availability projection → Shopify metafields
- [ ] Realtime checkout gate (webhook/app extension to prevent oversell)

### 2.3 Order Lifecycle Automation
- [ ] Order state machine: `pending_availability → pending_review → approved → assembled → shipped`
- [ ] Component reservation trigger on order creation
- [ ] Exception review queue (human gate for BOM mismatches)
- [ ] ShopStation label generation on approval
- [ ] QuickBooks assembly journal entry on ship
- [ ] Tracking number pushback to Shopify order

---

## WS3 — Production & Fulfillment Operations ($5,000)

### 3.1 Quickbase Application — Calder Production Command Center
- [ ] Quickbase application design + build
- [ ] Data tables:
  - [ ] Orders (master order record, synced from Shopify)
  - [ ] Customers/Dealers (reference data)
  - [ ] Production Orders (manufacturing job tracking)
  - [ ] Wheel Specifications (exact config details)
  - [ ] Fulfillment (packing/shipping coordination)
  - [ ] Activity & Exceptions (delays, rework, notes, errors)

### 3.2 Production Workflow
- [ ] Pipeline stages: Order Received → Production Order → Parts Pulled → Machining → Drilling/Custom → Finish/Paint → Wash/Prep → Assembly → QC → Ready to Pack → Packed → ShipStation → Shipped → Complete
- [ ] Stage transitions with employee + timestamp capture
- [ ] QR/barcode production tracking — scan at each station handoff

### 3.3 Dealer-Facing Status Translation
- [ ] Internal (Quickbase) → external (Shopify/Dealer) status mapping
- [ ] Dealer sees: Order Received → In Production → Finishing → QC → Preparing to Ship → Shipped
- [ ] Auto-update via n8n on Quickbase stage changes

### 3.4 Exception Handling
- [ ] On Hold, Rework Required, Component Issue, QC Failed, Cancelled, Manual Review states
- [ ] Exception notification to admin
- [ ] Production order can be flagged without blocking pipeline

### 3.5 Packing & ShipStation Handoff
- [ ] QC complete → n8n triggers ShipStation label creation
- [ ] Packing confirmation + tracking link recorded in Quickbase
- [ ] Tracking pushed to Shopify + dealer portal

---

## Open Decisions (tracked from architecture doc §10)

1. **Integration layer stack** — n8n + custom ledger vs fully custom middleware
2. **Dealer portal** — native Shopify B2B vs headless
3. **Configurator delivery** — Shopify app extension vs embedded custom SPA
4. **Fitment data source** — manual curated DB for launch (ACES/PIES later)
5. **Finish preview** — pre-rendered 2D layer composites (v1 confirmed direction)

---

## Task Convention

| Status | Meaning |
|--------|---------|
| `[ ]` | Not started |
| `[~]` | In progress |
| `[x]` | Completed |
| `[-]` | Blocked / deferred |

---

*Created: 2026-08-24 — Synthesized from architecture, dealer-portal-design, requirements, and proposal docs*