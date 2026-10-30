# Calder Wheels — Dealer Dashboard Handoff

**Generated:** 2026-10-09  
**Task:** CW-109-040 — Dealer Dashboard & Portal Foundation  
**Repository base:** `docs/design/Shopify Themes/Working Theme-via-CLI/`

---

## Architecture Overview

```
/pages/dealer-dashboard
  └── sections/dealer-dashboard.liquid  (orchestrator + seed data)
        ├── dealer-context              (auth/detection — PROTECTED)
        ├── dealer-topbar               (identity bar)
        ├── dealer-sidebar              (242px dark navy nav)
        ├── dealer-hero                 (welcome + imagery)
        ├── dealer-stat-card ×4         (KPI row)
        ├── dealer-action-card ×4       (quick actions)
        ├── dealer-status-badge         (order status pills)
        ├── dealer-production-tracker   (6-stage timeline)
        ├── dealer-activity-list        (event feed)
        └── dealer-featured-wheels      (Shopify products)
```

**Data flow:**

```
section.settings.dealer_demo_mode
       │
       ├── true  → seed_* variables populate all components
       │
       └── false → falls through to live Shopify data or empty states
```

---

## Files That Must Be Uploaded to GPT (attachments)

For GPT to analyze the full dashboard, attach these **10 files**:

### Primary (must include)

| # | File | Purpose |
|---|------|---------|
| 1 | `sections/dealer-dashboard.liquid` | Main dashboard section — orchestrator, seed data, all KPI/order/action logic |
| 2 | `snippets/dealer-sidebar.liquid` | Dark navy sidebar — nav routing, active state, icons |
| 3 | `snippets/dealer-topbar.liquid` | Account bar — dealer identity, badges, notification icon, user menu |
| 4 | `snippets/dealer-hero.liquid` | Dashboard hero — welcome copy, configurable image |
| 5 | `snippets/dealer-production-tracker.liquid` | 6-stage production timeline component |
| 6 | `snippets/dealer-featured-wheels.liquid` | Featured wheels from Shopify products |
| 7 | `assets/dealer-portal.css` | Full stylesheet (~1400 lines — navy/gold/cream palette) |
| 8 | `assets/dealer-portal.js` | Mobile sidebar toggle, user dropdown, notif panel |
| 9 | `templates/page.dealer-dashboard.json` | Page template routing dashboard section |
| 10 | `layout/theme.liquid` | Modified to load dealer assets on all dealer routes |

### Secondary (supporting, include if context is needed)

| # | File | Purpose |
|---|------|---------|
| 11 | `snippets/dealer-context.liquid` | Dealer state detection (customer tags → variables) |
| 12 | `snippets/dealer-credit.liquid` | Credit engine (metafields → available/tiers) |
| 13 | `snippets/dealer-stat-card.liquid` | Reusable KPI card component |
| 14 | `snippets/dealer-action-card.liquid` | Reusable quick action card component |
| 15 | `snippets/dealer-status-badge.liquid` | Status badge (6 manufacturing states) |
| 16 | `snippets/dealer-activity-list.liquid` | Recent activity feed component |
| 17 | `snippets/dealer-empty-state.liquid` | Empty/fallback state component |
| 18 | `snippets/dealer-gating.liquid` | Dealer-only product gating |
| 19 | `snippets/dealer-price.liquid` | Tiered pricing display |
| 20 | `snippets/dealer-pending.liquid` | Pending application interstitial |
| 21 | `snippets/dealer-invoice.liquid` | Invoice list/single-view component |
| 22 | `snippets/dealer-cart-moq.liquid` | MOQ enforcement in cart |
| 23 | `assets/dealer-backend.js` | Order submission, MOQ validation, credit check |
| 24 | `sections/dealer-quick-order.liquid` | SKU-based order entry (functional) |
| 25 | `sections/dealer-invoices.liquid` | Invoice management page |

### Design Reference (visual spec)

| # | File | Purpose |
|---|------|---------|
| 26 | `docs/design/visual-inspector/visual-specs/dealer-dashboard.visual-spec.md` | Visual spec derived from approved mockup |
| 27 | `docs/design/mockups/dealer-portal-dashboard-mockup.png` | Approved dashboard screenshot |

---

## Current State

### What Works (Functional)

- Dashboard route `/pages/dealer-dashboard` loads and renders portal shell
- `dealer-context` detects `dealer-approved` tag, `dealer-tier-X`, `dealer-net-30`
- Seed data mode fills all dashboard components when `dealer_demo_mode` is ON
- Featured Wheels reads from Shopify products (collection or product_list setting)
- Sidebar navigation with active-state detection (routes: collections, account, portal)
- Mobile sidebar collapses → overlay + JS toggle at 900px
- Topbar identity, badges, notification icon, user menu
- Hero with configurable image + fallback SVG placeholder
- KPI cards, action cards, orders table, production tracker, activity, featured wheels
- Status badges (6 manufacturing lifecycle states)
- Quick Order / Invoices tabs via existing `page.dealer-portal`
- Logout uses `/account/logout` with `routes.account_logout_url` fallback
- Protected consumer pages remain untouched

### What Uses Live Data

| Component | Data Source | Status |
|-----------|-------------|--------|
| Customer identity | `customer` object | LIVE |
| Dealer tags/tier | `customer.tags` | LIVE (set in Shopify admin) |
| Credit data | `customer.metafields.custom.*` | LIVE (if populated) |
| Orders | `customer.orders` | LIVE (if dealer has orders) |
| Featured Wheels | Shopify products from section settings | LIVE |

### What Uses Seed Data (demo mode ON)

| Component | Values |
|-----------|--------|
| Dealer name | Downtown Motorworks |
| Contact | John Carter |
| Tier | Tier 2 |
| Terms | NET-30 |
| Account standing | In Good Standing |
| Open orders | 5 / $18,746 |
| In production | 3 |
| Pending quotes | 3 / $9,350 |
| Available credit | $34,250 of $75,000 (46%) |
| Recent orders | 5 mock records in table |
| Production tracker | CW-1057 / C1 Forged Monoblock |
| Recent activity | 5 event records |
| Notification count | 3 badge |

---

## Identified Risks & Blockers

### Architecture Issues (Fixed during CW-109-040)

| Risk | Fix Applied |
|------|-------------|
| `section.settings` unavailable in `{% render %} ` snippets | Restructured to pass resolved values as render parameters |
| Seed data never rendered to page | Inlined seed data initialization in section file |
| `dealer-context` not called in dashboard | Added as first Liquid in section |
| Dead sidebar routes (404s) | Redirected to existing pages (`/account`, `/pages/dealer-portal#tab`) |
| Money values in dollars instead of cents | All seed values multiplied by 100 |
| `| default: 'x'` pipe in render param | Pre-assigned with `assign` before render |

### Still Outstanding (Requires Future Backend)

| Blocker | Component | Required For |
|---------|-----------|--------------|
| Live order data | Orders table, KPI | Quickbase / n8n integration |
| Live production status | Production tracker, "In Production" KPI | Quickbase integration |
| Quote system | Quotes page, Pending Quotes KPI | n8n middleware |
| Invoice system | Invoices page, credit data | QuickBooks Enterprise |
| Credit management | Credit KPI, topbar badges | Dealer ERP integration |
| Multi-user dealer org | Users page | Custom middleware |
| Notification system | Notification icon, panel | n8n / webhook integration |
| Returns / RMA | Returns page | Custom middleware |
| Marketing Assets | Dedicated download center | Asset management |
| Full Quick Order submission | Order submission JS → Shopify Draft Order API | Backend service |

---

## Data Contract Principle

All dashboard components are built against **stable data contracts**. The UI does not care whether data comes from seed variables or live backends. Relevant code:

### Stat card contract
```
icon, label, value, sub_value, progress, link
```

### Status badge contract
```
status (string) → one of: IN PRODUCTION, FINISHING, QUALITY CHECK, PREPARING TO SHIP, SHIPPED, DELIVERED, CANCELLED
```

### Orders table contract (seed)
```
order_number, po_number, order_date, vehicle_application, item_count, total, status
```

### Production tracker contract
```
order_number, po_number, status, wheel, type, size, finish, vehicle, quantity, price, current_stage, stages[{label, status}]
```

### Activity feed contract
```
type, message, timestamp
```

### Featured wheels contract
Uses standard Shopify `product` object fields.

---

## Recommended GPT Prompt

When you paste files into GPT, use this opening prompt:

> "You are analyzing the Calder Wheels Shopify theme's Dealer Portal. I've attached the core dashboard files. The theme root is `docs/design/Shopify Themes/Working Theme-via-CLI/`. The dealer dashboard route is `/pages/dealer-dashboard` using template `page.dealer-dashboard.json` which renders section `dealer-dashboard.liquid`. 
> 
> Dashboard uses `dealer-context` snippet for auth detection (customer tags: `dealer-approved`, `dealer-tier-X`, `dealer-net-30`). Seed data mode is enabled via `section.settings.dealer_demo_mode`. 
> 
> I need you to [your specific task — audit, fix, extend, refactor, etc.]."

---

## Design Tokens

```
--dp-navy:     #0B1628
--dp-navy2:    #0F1F35
--dp-navy3:    #132A42
--dp-gold:     #C9A96E
--dp-gold2:    #D4B05C
--dp-cream:    #F7F8F8
--dp-cream2:   #F2F3F4
--dp-white:    #FFFFFF
--dp-text:     #1A1A2E
--dp-border:   #E2E5E8
--dp-good:     #2E9B5E
--dp-warn:     #C9953A
--dp-bad:      #C94A4A
--dp-blue:     #4A82C9
Sidebar width:  207px
Topbar height:  54px
Card radius:    12px
Content max:    1329px
```

---

## Backend Integration Boundaries

```
Shopify                        (customer accounts, products, orders)
  │
  └── n8n / middleware         (quote creation, order enrichment)
        │
        ├── Quickbase          (production tracking, BOM, inventory)
        │
        ├── QuickBooks Enterprise (accounting, invoicing, credit)
        │
        └── ShipStation        (labels, tracking, carrier selection)
```

| System | Dashboard Dependency | Priority |
|--------|---------------------|----------|
| Quickbase | Production Tracker, In Production KPI | P0 |
| n8n | Quote system, order data enrichment | P0 |
| QuickBooks | Invoices, Credit KPI, Available Credit | P1 |
| ShipStation | Order tracking activity events | P2 |

---

*End of handoff.*