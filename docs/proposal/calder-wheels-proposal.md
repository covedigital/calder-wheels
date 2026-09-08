# Calder Wheels — Commerce & Operations Platform
### Revised proposal — August 2026

Prepared for: Ray Shadravan
From: Cove Digital
Date: August 2026

---

## What changed since the last proposal

The original August 17 proposal described the Calder commerce platform, the wheel configurator, wholesale ordering, and the systems architecture that keeps everything running behind the scenes. Since then, I've continued working through the technical details, and two important decisions have been made that sharpen the scope considerably:

- **QuickBooks Desktop Enterprise Solutions 24.0** is confirmed as Calder's accounting and inventory system.
- **Quickbase** has been identified as the recommended platform for production and fulfillment operations.

These decisions remove uncertainty — but they also confirm that the project is more involved than the original $14,500 estimate assumed. The original proposal priced the operations architecture as a determination of *what each system owns.* The follow-on technical review confirmed it also requires *building the systems themselves* — a QuickBooks Desktop Web Connector/SDK integration service that bridges Calder's Windows environment to the cloud, and a Quickbase production application that gives the shop floor structure.

**The original commerce scope has not changed or been repriced.** What changed is that the operations layer is now understood to be a build, not just an architecture document.

This revised proposal reflects that.

---

## The three workstreams

| Workstream | Scope | Price |
|---|---|---|
| **WS1 — Commerce & Dealer Platform** | Storefront, configurator, wholesale, BOM | $11,750 |
| **WS2 — Systems Integration & Automation** | QuickBooks, ShipStation, n8n orchestration | $4,250 |
| **WS3 — Production & Fulfillment System** | Quickbase application, QR tracking, workflows | $5,000 |
| Separate total | | $21,000 |
| **Complete bundled project** | WS1 + WS2 + WS3 | **$19,500** |

I recommend the bundled option. It's the complete system Calder needs, and it saves $1,500 versus commissioning the pieces separately.

---

## Where the $5,000 difference comes from

If you're comparing this to the original $14,500 proposal, here's the breakdown:

| | |
|---|---|
| Original proposal (commerce + dealer + integrations/architecture) | $14,500 |
| Additional: **Production & Fulfillment Operations System** | $5,000 |
| — Quickbase application design and build | |
| — Production data structure and workflow | |
| — Production dashboards and status management | |
| — QR/barcode production tracking workflow | |
| — QC and exception tracking | |
| — Packing and ShipStation handoff | |
| — Dealer production visibility (Shopify-side) | |
| — n8n/Quickbase integrations | |
| — Training and testing | |
| **Revised total** | **$19,500** |

The $14,500 for the commerce platform and integrations hasn't gone up. During discovery I identified an additional operational system Calder needs to support production at the planned scale, and the additional $5,000 implements that system.

---

## Workstream 1 — Commerce & Dealer Platform

### $11,750 | Estimated: 125–155 hours

Everything your customers and dealers interact with.

### Shopify storefront

A premium, photography-led Calder-branded store: homepage, wheel catalog, product pages, galleries, responsive mobile layout, customer accounts, checkout, and the SEO/AEO and analytics foundation.

### Wheel configurator

The configurator remains the centerpiece. A customer picks a wheel, selects the **face finish**, the **lip/barrel**, and the **hardware** — and sees the wheel update on screen in real time, with the price updating.

- **2D layered-image approach** for version one — I take Calder's renderings and build a configurator that swaps layers for each finish. Practical and reliable, as long as the renderings are consistent in angle, lighting, and transparency.
- **Vehicle-on-car visualizer is excluded** from Phase 1. That's a strong Phase 2 opportunity, but I'm not burying it in the initial price.

The original proposal assumed roughly one wheel design at launch. The latest conversation indicates approximately **five initial designs and roughly 60 visual combinations**. This price explicitly includes **up to 5 initial wheel designs and 60 configuration combinations**, provided Calder supplies properly standardized rendering assets. Additional wheel models follow the post-launch pricing schedule.

### Retail ordering

Standard direct-to-consumer: configure → price → cart → payment → order.

### Dealer / wholesale portal

Dealer accounts get first-class treatment, not an afterthought. Includes:

- Dealer login and approved accounts
- Tiered pricing and dealer-specific pricing
- Dealer-only information and products where applicable
- Minimum order quantities
- Payment terms — open account, Net-30 designation, prepaid/card accounts
- Dealer order history, order status, and tracking
- Production status (abstracted — dealers see progress without Calder's internal operational detail)

### Explicit Phase 2 exclusions

Not in the $11,750: vehicle-on-car visualizer, dealer salesperson commission/spiff engine, advanced loyalty and rewards, full CRM, AI sales assistant, or large-scale rendering production.

---

## Workstream 2 — Systems Integration & Automation

### $4,250 | Estimated: 45–60 hours

The bridge between Calder's cloud systems and its on-premises accounting environment.

### Confirmed environment

**Intuit QuickBooks Desktop Enterprise Solutions 24.0** — running in Calder's Windows environment. The technical review confirmed that automation is feasible through the QuickBooks Desktop SDK (qbXML) and the QuickBooks Web Connector, rather than attempting to automate the QuickBooks GUI over Remote Desktop.

That means the integration layer looks like this:

**Cloud side (Calder cloud systems):** Shopify → n8n middleware → Quickbase, ShipStation, and a QB queue that holds transactions until the Windows side picks them up.

**Windows side (Calder local environment):** The QuickBooks Web Connector polls the queue, feeds transactions through the QB SDK/qbXML layer, and posts them into QuickBooks Enterprise 24.0. Remote Desktop stays available for Calder staff and my troubleshooting — it's just not the automation mechanism.

### Deliverables

- **QuickBooks integration service** — Web Connector setup, qbXML communication, authentication, unattended processing where supported, secure communication, queue management.
- **Customer synchronization** — Shopify order → search QuickBooks customer → match existing or create new, with duplicate protection.
- **Accounting transaction creation** — order → QuickBooks invoice with customer, line items, SKU/item references, quantities, pricing, shipping, tax data, and the Shopify order reference.
- **BOM/component mapping** — Calder doesn't stock "Calder Wheel X — Qty 25." The actual inventory is face SKUs, lip SKUs, hardware SKUs, and center caps. The customer's configuration gets decomposed into its component recipe, and that BOM drives what gets deducted in QuickBooks. QuickBooks stays the financial/inventory source of truth; Shopify calculates sellability from available components.
- **ShipStation integration** — eligible order → ShipStation → shipment, tracking number, carrier, and service pushed back to Shopify and Quickbase.
- **Integration reliability** — idempotency, duplicate prevention, retry logic, integration logs, error reporting, failed-job queue, and exception handling. These are financial transactions, so this isn't optional.

---

## Workstream 3 — Production & Fulfillment Operations

### $5,000 | Estimated: 55–75 hours

This is the biggest addition since the original proposal.

### Recommended platform: Quickbase

Calder doesn't need a conventional ERP or MRP system. It needs a customizable operational application built around its specific wheel-production process. Quickbase is the strongest current fit.

The contract will read:

> *Recommended platform: Quickbase, subject to final technical validation and client approval of third-party licensing.*

That gives me an exit if the final Quickbase quote or technical validation produces an unexpected issue. Quickbase licensing is client-paid, separate from my fee.

### Calder Production Command Center

The application covers six core areas:

| Area | Purpose |
|---|---|
| Orders | Master order record |
| Customers/Dealers | Customer reference data |
| Production Orders | Manufacturing job tracking |
| Wheel Specifications | Exact wheel and configuration details |
| Fulfillment | Packing and shipping coordination |
| Activity & Exceptions | Delays, rework, notes, errors |

QuickBooks is not duplicated inside Quickbase. Only operationally necessary information is synchronized.

### Production workflow

The pipeline mirrors Calder's actual shop-floor process:

**Order Received → Production Order → Components/wheel pulled → Machining → Drilling/customization → Finish/paint → Wash/prep → Assembly → Quality Control → Ready to pack → Packed → ShipStation → Shipped → Complete**

Exact stations can be adjusted during implementation without changing the overall architecture.

### QR/barcode production tracking

Each production order gets an identifier (e.g., CW-1057). Staff scan it when responsibility changes at each station — moving it from Machining to Finish/Paint, for example, with employee and time recorded. Quickbase updates, n8n picks up the event, and relevant systems are notified.

### Internal vs. dealer-facing statuses

Calder's full manufacturing process is not exposed to dealers. Quickbase tracks the granular detail (Parts Pulled, Machining, Drilling, Custom Finish, Assembly, QC, Packing), while the dealer portal and Shopify display a cleaner, higher-level view: Order Received → In Production → Finishing → Quality Check → Preparing to Ship → Shipped. The automation layer translates between the two.

### Exception workflow

Production doesn't always follow the happy path. Version one includes basic exception handling: On Hold, Rework Required, Component Issue, QC Failed, Cancelled, and Manual Review. A full rework/MRP engine is not included at $5,000 — but the structure is designed to accommodate it later.

---

## System-of-record architecture

This is one of the most important decisions in the entire project. When the build is complete, here is what each system definitively owns:

| System | Role | Owns |
|---|---|---|
| **Shopify** | Commerce system of record | E-commerce orders, customer-facing products, configurations, checkout, online payments, customer and dealer portals |
| **QuickBooks Enterprise Desktop 24** | Financial/inventory system of record | Accounting customers, invoices, accounting items, financial inventory, payments, financial reporting |
| **Quickbase** | Production/operations system of record | Production orders, production stage, manufacturing activity, assignment, QC, production exceptions, packing readiness |
| **ShipStation** | Shipping system of record | Shipments, carriers, services, labels, tracking |
| **n8n / Cove integration layer** | Orchestration | Data movement, transformations, workflow triggers, status translation, retry logic, exception routing, logging, cross-platform automation |

No system independently decides what another system owns. The integration layer is the single conductor — nothing writes to two places at once without a defined source of truth.

---

## End-to-end workflow

When all three workstreams are complete, a Calder order will flow like this:

**Customer or dealer places order in Shopify** → n8n validates the order → a Production Order is created in Quickbase, and the transaction is queued for QuickBooks → the QuickBooks Web Connector picks it up and posts the customer and invoice into QuickBooks Enterprise 24 → production begins on the shop floor → QR/barcode events update Quickbase as the wheel moves through stations → once QC is complete, n8n triggers the ShipStation handoff → the label is created, tracking flows back to Quickbase and Shopify → the dealer or customer sees the updated status and tracking information.

That's a full build-to-order system, not just a website with some integrations.

---

## Timeline

**Estimated implementation: 10–12 weeks from kickoff and receipt of required product data and assets.**

| Weeks | Primary work |
|---|---|
| 1–2 | Final architecture, Shopify UX, Quickbase workflow design |
| 3–4 | Shopify storefront + dealer foundation |
| 4–6 | Configurator + BOM |
| 5–7 | Quickbase production application |
| 6–8 | QB Enterprise 24 integration |
| 7–8 | ShipStation + n8n workflows |
| 8–9 | Production scanning / status integration |
| 9–10 | End-to-end QA |
| 10–11 | Staff and dealer beta |
| 11–12 | Corrections, training, launch |

Several streams can run concurrently — configurator and Quickbase, for example, don't depend on each other.

---

## How payment works

Same structure as before: payment tracks the milestones where real value is delivered.

| Milestone | Amount |
|---|---|
| Kickoff — discovery, final architecture, mockups | $5,850 (30%) |
| Design and system approval | $5,850 (30%) |
| Functional beta — site, configurator, integrations, Quickbase live in staging | $4,875 (25%) |
| Before production launch | $2,925 (15%) |

The kickoff payment is non-refundable once discovery and design work begins. A lighter cash-flow schedule (25% deposit + $2,437.50 every two weeks for six payments) is also available.

---

## Scope protections

Three explicit boundaries to keep the project honest:

1. **Quickbase licensing is separate.** The proposal already states that third-party subscriptions are client-paid. Quickbase licensing and any platform minimums are explicitly yours, not absorbed into my fee.

2. **QuickBooks environment assumption.** The quoted integration assumes Calder provides administrative access to a properly licensed and operational QuickBooks Desktop Enterprise Solutions 24.0 Windows environment and company file. Windows server or hosting migration, QuickBooks repair, company-file remediation, unsupported third-party connector replacement, network remediation, and accounting-data cleanup are outside scope.

3. **Rendering allowance.** Calder supplies approved standardized product renderings. I prepare and configure an agreed initial set for the configurator. Creation of extensive photorealistic rendering libraries is separately scoped — otherwise it could quietly consume dozens of hours.

---

## After launch

A platform this size needs ongoing care. I recommend the following maintenance tier, updated from the original proposal to reflect the full scope:

| Plan | Monthly | Hours | Best for |
|---|---|---|---|
| Care | $350 | 3 | Basic website |
| Commerce | $650 | 7 | Shopify and catalog |
| **Commerce + Operations** | **$950** | **11** | Full Calder platform |
| Additional time | $85/hr | — | Beyond monthly allowance |

I recommend **Commerce + Operations at $950/month** — Shopify, the configurator, the dealer portal, BOM, n8n, the QuickBooks bridge, Quickbase, and ShipStation integrations all need ongoing maintenance.

**30 days of post-launch stabilization is included at no charge** — meaning I fix anything in the approved scope that isn't working right. Not 30 days of free new features. After that, the monthly plan begins.

**New wheel models** — component mapping, SKU, BOM, pricing, finishes, images, config layers, fitment, copy, SEO, and gallery relationships — are roughly $250–$400 for a standard wheel and $400–$650 for a highly configurable one, or deducted from maintenance hours.

---

## Two options

**Option A — Calder Commerce & Integration Platform — $14,500**
Workstreams 1 and 2: the storefront, configurator, dealer portal, BOM inventory architecture, QuickBooks Enterprise 24 integration, ShipStation, and automation. No production-management application.

**Option B — Complete Calder Commerce + Operations Platform — $19,500** *(recommended)*
Everything above, plus the Quickbase Production & Fulfillment Command Center — production tracking, QR/barcode workflow, dealer production visibility, and the full order-to-production-to-shipping automation.

I recommend **Option B**.

---

## The short version

| What | Details |
|---|---|
| Deliverable | Commerce platform + configurator + dealer portal + QuickBooks Enterprise integration + Quickbase production system + ShipStation + n8n orchestration |
| Not included | Vehicle visualizer (Phase 2), Quickbase licensing, third-party app subscriptions, large rendering production, advanced MRP/rework engine |
| Price | $19,500 bundled (vs. $21,000 separately) |
| Timeline | 10–12 weeks |
| Payment | 30% / 30% / 25% / 15% |
| After launch | 30-day stabilization, then $950/mo recommended |