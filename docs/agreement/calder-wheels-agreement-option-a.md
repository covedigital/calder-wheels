# Calder Wheels — Commerce & Integration Platform Agreement

**Option A — Calder Commerce & Integration Platform**

Prepared for: **Ray Shadravan** (Client / Calder Wheels)
Prepared by: **Cove Digital LLC** (Service Provider)
Date: August 2026

---

## 1. Parties

This Agreement is entered into by and between:

- **Cove Digital LLC** ("Provider")
- **Ray Shadravan** on behalf of **Calder Wheels** ("Client")

---

## 2. Scope of Work

The Provider will deliver a custom e-commerce and operations platform for Calder Wheels, a build-to-order wheel manufacturer. The scope comprises two workstreams:

### Workstream 1 — Commerce & Dealer Platform ($11,750)

**Shopify Storefront**
- Premium, photography-led, dark/luxury Calder-branded store
- Homepage, wheel catalog, product pages, galleries
- Responsive mobile layout
- Customer accounts
- Checkout
- SEO / AEO and analytics foundation

**Wheel Configurator**
- 2D layered-image configurator: center finish x barrel/lip finish x hardware finish
- Live visual preview (finish-layer composites)
- Realtime price updating
- Up to 5 initial wheel designs and 60 configuration combinations, provided Calder supplies properly standardized rendering assets
- Availability gate: a configuration is orderable only if its Bill-of-Materials resolves to in-stock components
- Vehicle-on-car visualizer excluded (Phase 2 opportunity)

**Retail Ordering**
- Standard direct-to-consumer flow: configure -> price -> cart -> payment -> order

**Vehicle Fitment Finder**
- Year -> Make -> Model -> Generation/Trim -> compatible wheels
- Never surface incompatible products
- Manual curated fitment database (ACES/PIES not included)

**Dealer / Wholesale Portal**
- Dealer login and approved accounts (application + approval flow)
- Tiered pricing and dealer-specific pricing
- Dealer-only products (hidden from retail)
- Minimum order quantities (MOQ) enforcement at checkout
- Payment terms support (Net-30, prepaid/card)
- Dealer order history, order status, and tracking
- Abstracted production status display (dealer-ready placeholder)
- Dashboard, Quick Order, Quote Management, Dealer Catalog, Application Form screens

**Explicit Phase 2 Exclusions**
- Vehicle-on-car visualizer
- Dealer salesperson commission/spiff engine
- Advanced loyalty and rewards
- Full CRM
- AI sales assistant
- Large-scale rendering production

### Workstream 2 — Systems Integration & Automation ($4,250)

**Environment**
Integration with Intuit QuickBooks Desktop Enterprise Solutions 24.0 running in Calder's Windows environment, via the QuickBooks Web Connector and qbXML SDK.

**Deliverables**
- QuickBooks integration service (Web Connector setup, qbXML communication, authentication, queue management)
- Customer synchronization (Shopify order -> search QuickBooks customer -> match or create, with duplicate protection)
- Accounting transaction creation (order -> QuickBooks invoice with customer, line items, SKU/item references, quantities, pricing, shipping, tax, and Shopify order reference)
- BOM/component mapping (customer configuration decomposed into component recipe; BOM drives component deduction in QuickBooks)
- ShipStation integration (eligible order -> ShipStation -> shipment, tracking number, carrier, service pushed back to Shopify)
- Integration reliability (idempotency, duplicate prevention, retry logic, integration logs, error reporting, failed-job queue, exception handling)

### Excluded — Not in Scope

The following are explicitly excluded from this Agreement and will be delivered only under a separate future agreement:

- **Production & Fulfillment System (Workstream 3):** Quickbase production application, QR/barcode tracking, production dashboards, shop-floor state management, QC/exception tracking, packing/ShipStation handoff automation, dealer production visibility
- **Full rework/MRP engine**
- **Advanced MRP or inventory planning**
- Any other items listed as Phase 2 or excluded above

---

## 3. Architecture & System Boundaries

The architecture defines clear system-of-record ownership. The integration layer (n8n + custom ledger service) acts as the single orchestrator:

| System | Role | Owns |
|--------|------|------|
| **Shopify** | Commerce system of record | Storefront, products, configurator, checkout, payments, customer/dealer portals |
| **QuickBooks Desktop Enterprise 24** | Financial/inventory system of record | Accounting customers, invoices, items, financial inventory, COGS, payments |
| **ShipStation** | Shipping system of record | Shipments, carriers, services, labels, tracking |
| **n8n / Cove integration layer** | Orchestration | Data movement, BOM logic, available-to-build engine, workflow triggers, status translation, retry, exception routing |

No system independently decides what another system owns. A custom component ledger (owned by the integration layer) is the single source of truth for component quantities. Shopify and QuickBooks reflect this ledger.

The architecture is designed so that a Production & Fulfillment System (Workstream 3) can be added later with zero redesign. The order pipeline includes a natural extension point between `approved` and `assembled` states, and the dealer portal already accounts for abstracted production status display.

---

## 4. Timeline

**Estimated: 10–12 weeks from kickoff and receipt of required product data and assets.**

| Weeks | Primary Work |
|-------|-------------|
| 1–2 | Final architecture, Shopify UX design, integration design |
| 3–4 | Shopify storefront + dealer portal foundation |
| 4–6 | Configurator + BOM implementation |
| 6–8 | QuickBooks Enterprise 24 integration |
| 7–8 | ShipStation + n8n workflows |
| 8–10 | Integration testing + exception handling |
| 10–12 | Beta testing, training, adjustments, launch |

Several streams can run concurrently. Configurator and QuickBooks integration, for example, do not depend on each other.

---

## 5. Payment Terms

### Fixed Price: $14,500

| Milestone | Amount | Trigger |
|-----------|--------|---------|
| Kickoff | $4,350 (30%) | Agreement signed, discovery begins |
| Design & System Approval | $4,350 (30%) | Architecture, UX mockups, and system design approved |
| Functional Beta | $3,625 (25%) | Site, configurator, integrations live in staging |
| Before Production Launch | $2,175 (15%) | Final delivery, deployment, and training complete |

The kickoff payment is non-refundable once discovery and design work begins.

### Alternative Installment Plan
A lighter cash-flow schedule is available upon request: 25% deposit + $2,416.67 every two weeks for six payments ($14,500 total).

### Payment Method
Invoices are due within 15 days of receipt. Late payments may result in work suspension until cleared.

---

## 6. Post-Launch

### Stabilization Period
**30 days of post-launch stabilization included at no charge.** The Provider will fix any functionality within the approved scope that is not working correctly. This is not 30 days of free new features or scope additions.

### Maintenance Options
After the stabilization period, the following maintenance tiers are available:

| Plan | Monthly | Hours | Best For |
|------|---------|-------|----------|
| Care | $350 | 3 | Basic website |
| Commerce | $650 | 7 | Shopify and catalog |
| Additional time | $85/hr | — | Beyond monthly allowance |

The Provider recommends the **Commerce plan at $650/month** for ongoing maintenance of Shopify, configurator, dealer portal, BOM, and integrations.

### New Wheel Models
Adding new wheel models — component mapping, SKU, BOM, pricing, finishes, images, configurator layers, fitment, copy, SEO, and gallery relationships — is approximately $250–$650 depending on complexity, or deductible from maintenance hours.

---

## 7. Client Responsibilities

The Client agrees to provide or arrange the following:

1. **Product Renderings:** Calder supplies approved, standardized product renderings (consistent angle, lighting, and transparency) for up to 5 initial wheel designs. The Provider will prepare and configure these for the configurator. Creation of extensive photorealistic rendering libraries is separately scoped.
2. **QuickBooks Environment:** Calder provides administrative access to a properly licensed and operational QuickBooks Desktop Enterprise Solutions 24.0 Windows environment and company file.
3. **Third-Party Subscriptions:** Calder is responsible for all third-party licensing and subscription fees:
   - Shopify plan (Shopify Plus or Advanced recommended for dealer portal)
   - QuickBooks Desktop Enterprise Solutions 24.0 license
   - ShipStation account
   - n8n self-hosted or cloud plan
   - Any apps, themes, or services required for the platform
4. **Product Data:** Calder provides complete product data: wheel designs, finishes, SKUs, pricing (retail and dealer tier), fitment specifications, and component inventory data.
5. **Brand Assets:** Calder provides logo, brand colors, fonts, and any existing brand guidelines.
6. **Access:** Calder provides appropriate access to Shopify admin, QuickBooks environment, domain/DNS management, and any other relevant systems.
7. **Timely Review:** Calder provides timely feedback and approvals on deliverables to keep the project on schedule.

---

## 8. Scope Protections

1. **QuickBooks Environment Assumption.** The quoted integration assumes Calder provides administrative access to a properly licensed and operational QuickBooks Desktop Enterprise Solutions 24.0 Windows environment and company file. Windows server or hosting migration, QuickBooks repair, company-file remediation, unsupported third-party connector replacement, network remediation, and accounting-data cleanup are outside scope.

2. **Rendering Allowance.** Calder supplies approved standardized product renderings. The Provider prepares and configures an agreed initial set for the configurator (up to 5 designs, 60 combinations). Creation of extensive photorealistic rendering libraries is separately scoped.

3. **Third-Party Platform Changes.** If Shopify, QuickBooks, ShipStation, or n8n significantly change their APIs, pricing, or platform capabilities during the project, the scope and timeline may need adjustment. The Provider will notify the Client promptly of any such impacts.

4. **Fitment Data.** The fitment finder uses a manual curated database. ACES/PIES data licensing and integration is not included.

---

## 9. Intellectual Property

Upon full payment, the Client owns all custom code, configurations, designs, and deliverables created specifically for this project by the Provider. The Provider retains the right to:

- Reuse general-purpose code, libraries, and patterns (not unique to Calder Wheels) in other projects
- Display the completed work in portfolios and case studies (excluding confidential financial data)

---

## 10. Confidentiality

Both parties agree to keep confidential all proprietary business information, financial data, system credentials, and trade secrets shared during the engagement. This obligation survives termination of the Agreement.

---

## 11. Limitation of Liability

The Provider's total liability under this Agreement is limited to the total fees paid by the Client. The Provider is not liable for:

- Damages arising from third-party platform failures (Shopify, QuickBooks, ShipStation, n8n outages)
- Losses from incorrect product data, renderings, or fitment information supplied by the Client
- Consequential, indirect, or incidental damages
- Data loss where the Client has not maintained adequate backups

---

## 12. Termination

Either party may terminate this Agreement with 14 days written notice. In the event of termination:

- The Client pays for all work completed up to the termination date, based on the milestone payment schedule
- The Provider delivers all work product completed to date upon payment
- The kickoff payment is non-refundable

---

## 13. Relationship Disclosure

This project (Calder Wheels) is a separate engagement from the E5 Wheels Automation project. The two are independent engagements with independent scopes, timelines, and deliverables.

---

## 14. Acceptance

By signing below, both parties acknowledge they have read, understood, and agree to the terms of this Agreement.

**Client — Calder Wheels**

Signature: ________________________
Name: Ray Shadravan
Title: Owner
Date: ________________________

**Service Provider — Cove Digital LLC**

Signature: ________________________
Name: ________________________
Title: ________________________
Date: ________________________