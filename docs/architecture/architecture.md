# C Wheels — System Architecture

> **Status**: Working draft — v0.1
> **Related**: `docs/discovery/requirements.md` (product model), `AGENTS.md` (constraints), `llm-continuity.md` (state).
> **Naming note**: Referred to as "C Wheels" in working docs; brand name remains TBD (`brand/brand.md`). The architecture is name-agnostic.

---

## 1. Executive Summary

C Wheels is a **build-to-order** wheel company. It does not stock finished wheels; it stocks **components** (centers, barrels/lips, hardware) and assembles to order. A finished wheel is not an inventory item — it is a **Bill of Materials (BOM)** whose sellability is derived from component availability at order time.

This has one architectural consequence that dominates everything else:

> **Inventory is not "how many finished wheels do we have." It is "how many finished wheels can we build right now."**

That single fact forces a specific inventory architecture (Section 3), a specific data model (Section 4), and a specific integration topology (Section 6). Everything else — configurator, fitment finder, dealer portal — sits on top of it.

### Guiding principles
1. **One source of truth for inventory.** Shopify and QuickBooks never independently decide what exists. They *reflect* a single authoritative component ledger.
2. **The configurator must be truthful.** A configuration is orderable only if its BOM resolves to in-stock components. No selling what we cannot assemble.
3. **Human-in-the-loop on exceptions.** Any order whose BOM cannot be cleanly resolved flags for review; it is never auto-shipped.
4. **Dealer functionality is first-class**, not a login bolt-on.
5. **Component-level truth, finished-SKU projection.** Systems that need "finished wheel" numbers (Shopify storefront) get a *derived* projection, not an authoritative count.

---

## 2. System Context

```
                          ┌─────────────────────────────┐
                          │        STOREFRONT           │
                          │  Shopify (theme + apps)     │
                          │  catalog · fitment · config │
                          │  retail + dealer checkout   │
                          └──────────────┬──────────────┘
                                         │ orders / catalog / projections
                                         ▼
┌──────────────────────┐     ┌───────────────────────────┐     ┌──────────────────────┐
│    INVENTORY          │◄───►│   INTEGRATION / MIDDLEWARE │◄───►│   ACCOUNTING          │
│  (source of truth)    │     │  orchestration, BOM logic, │     │  QuickBooks           │
│  component ledger +   │     │  fitment service, dealer   │     │  COGS · vendors ·     │
│  BOM + available-to-  │     │  tiers, exception queue    │     │  inventory valuation  │
│  build engine         │     └──────────────┬─────────────┘     └──────────────────────┘
└──────────────────────┘                    │
                                            ▼
                                 ┌──────────────────────┐
                                 │   SHIPPING            │
                                 │  ShipStation          │
                                 │  labels · tracking ·  │
                                 │  carrier selection    │
                                 └──────────────────────┘
```

**Four systems, one orchestrator.** Shopify, QuickBooks, and ShipStation are off-the-shelf and each does one job well. The **integration layer** is the custom code that owns the build-to-order logic — the thing that makes C Wheels different from a drop-in Shopify store.

---

## 3. Inventory Architecture (the source-of-truth decision)

### 3.1 The decision

| Option | Verdict | Why |
|--------|---------|-----|
| **Shopify as source of truth** | ✗ Rejected | Shopify has no native BOM/assembly concept. It cannot compute `available-to-build = min(components)`. Bundling apps model finished stock, not build-to-order component reservation. |
| **QuickBooks (Desktop Inventory Assembly) as source of truth** | ✗ Rejected (as *realtime* truth) | QB Desktop *has* inventory assembly items, but it is batch-synced, file-based, and a poor realtime source for the configurator's instant availability checks. Also being sunset toward QB Online. |
| **Middleware/own ledger as source of truth** | ✓ **Chosen** | A custom component ledger (DB + BOM engine) owns component quantities, BOM definitions, and the available-to-build computation. It is API-first, realtime, and small enough to be correct. |

**Decision:** A custom **inventory ledger** (owned by the integration layer) is the single source of truth for **components**. It exposes:
- component stock levels (on-hand, reserved, on-order)
- BOM definitions (which components make a finished SKU)
- `availableToBuild(sku, config)` → integer, computed in realtime
- reservation/deduction of components on order

Shopify and QuickBooks both *reflect* this ledger:
- **Shopify** gets a derived `finished_sku_available` number (for display + as a hard order gate).
- **QuickBooks** gets component-level quantities for accounting/COGS valuation, and finished-wheel assembly journal entries when an order ships.

### 3.2 Why not let QuickBooks stay the truth for accounting?

Accounting truth (COGS, valuation, vendor bills) is separate from **realtime build truth**. QuickBooks remains the accounting system of record, but it is a *sink* — it receives component movements and assembly events, it does not *decide* whether a wheel is orderable. This split (realtime ledger = custom; accounting ledger = QuickBooks) is the standard resolution to the "hardest problem" called out in `AGENTS.md`.

### 3.3 Realtime vs. batch

- **Realtime (ledger → configurator/checkout):** availability checks, reservation, and deduction must be synchronous with order intent, otherwise the configurator lies.
- **Batch (ledger ↔ QuickBooks):** component movements, assembly journals, and valuations sync on a schedule (e.g. every 15 min or on ship event). Acceptable because accounting lags reality by design.

---

## 4. Data Model

### 4.1 Entities

```
Component          (id, type, sku, name, finish, on_hand, reserved, on_order, unit_cost)
   type ∈ { center, barrel, hardware }
   finish is the key dimension (see §5.3)

BillOfMaterials   (finished_sku, component_id, quantity, construction)
   finished_sku e.g. WHEEL-20-GLOSSBLACK-POLISHED-CHROME
   construction ∈ { forged, flow_formed, three_piece }

FinishedSKU        (sku, design_id, series, size, bolt_pattern, offset, price, dealer_price)
   -- a "product" for Shopify; its stock is DERIVED, never stored

Design             (design_id, nickname, code, series, images[], fitment_profile)
Fitment            (vehicle_id, wheel_id/sku, bolt_pattern, offset, diameter, width, hub_bore)
Vehicle            (year, make, model, generation, trim)
Dealer             (dealer_id, tier, payment_terms, moq, price_level)
```

### 4.2 The core invariant

```
available_to_build(finished_sku) =
    min over components in BOM( floor((on_hand - reserved) / quantity) )
```

If any component is at zero (or insufficient for the BOM quantity), the finished SKU is **not orderable**. This is the single function the whole business runs on. It lives in exactly one place (the ledger engine) so it cannot drift.

### 4.3 Derived projection to Shopify

Shopify never stores the authoritative number. The integration layer pushes `finished_sku_available` as a **metafield/variant inventory** value, refreshed on any component movement. A Shopify checkout is additionally gated by a realtime check (webhook/app extension) so a stale cached number can never oversell.

---

## 5. Configurator & Component Model

### 5.1 What the customer configures
- **Center finish** (the wheel face/design)
- **Barrel/Lip finish** (the rim outer)
- **Rivet/Hardware finish** (fasteners)

### 5.2 Component families by construction
Different construction = different BOM = different rules:

| Series | Center | Barrel/Lip | Hardware | Configurator surface |
|--------|--------|-----------|----------|---------------------|
| Forged (monoblock) | 1 | (integrated) | n/a or minimal | center finish only |
| Flow-Formed / Hybrid | 1 | 1 | N | center + barrel |
| 3-Piece | 1 | 1 | N | center + barrel + hardware (richest) |

### 5.3 The "finish" dimension is the key modeling decision

A `center` component in "gloss black" and the same center in "polished" are **two distinct components** (distinct stock, distinct SKU). Finishes are not attributes on a component — they are the component's identity, because each finish combination has its own stock. This is what makes the configurator truthful: the finish matrix *is* the component catalog.

### 5.4 Configurator technical approach
- **Preview:** pre-rendered finish-layer composites (2D layered images per finish × per design), not on-the-fly 3D (see `requirements.md` §5). Instant, cheap, photography-driven (Vossen finish-matrix discipline).
- **Availability gate:** each finish selection queries `availableToBuild` for the resulting SKU in realtime; invalid combinations are disabled with "unavailable" state.
- **Orderable only if BOM resolves.** Config → resolved SKU → BOM → component check → orderable flag.

---

## 6. Integration Layer & Order Lifecycle

### 6.1 The order pipeline (the critical path)

```
1. Customer configures wheel + fitment → configurator resolves SKU
2. Realtime availability check (ledger) — gate
3. Order created in Shopify (retail) OR dealer checkout (wholesale)
4. Ledger RESERVES components (prevent double-sell)
5. Order exception review (human) if BOM mismatch / edge case
6. On approval: ledger DEDUCTS components, posts Assembly to QuickBooks
7. ShipStation generates label; tracking posted back
8. QuickBooks receives COGS + revenue journal
```

### 6.2 Order states & the human gate

- `pending_availability` → reserved components
- `pending_review` → flagged exception (insufficient stock discovered post-order, dealer terms override, custom finish)
- `approved` → build begins
- `assembled` → components deducted
- `shipped` → ShipStation + QuickBooks sync complete

**Never auto-ship a BOM mismatch.** The `pending_review` state is mandatory whenever the resolved BOM can't be satisfied exactly at deduction time.

### 6.3 Integration layer choice (TBD)

Candidate: **n8n** (workflow orchestration) + a small custom **ledger service** (API + DB). Rationale:
- n8n handles the glue (Shopify ↔ QuickBooks ↔ ShipStation webhooks/API).
- The ledger is too important and too simple to hide inside a workflow graph; it should be a tiny, well-tested service (deterministic BOM math — Tier 1, no LLM).

Alternative to revisit: fully custom middleware if n8n's QuickBooks Desktop connector proves insufficient.

---

## 7. Fitment Finder Architecture

- Data: **manual curated DB** to start (ACES/PIES is overkill for launch and licensing-heavy — flagged in `requirements.md` §6.3).
- Structure: `Vehicle (year → make → model → generation → trim) → Fitment (bolt_pattern, offset, diameter, width, hub_bore) → eligible SKUs`.
- Rule: **never surface incompatible products.** The finder filters by exact fitment match; it does not "suggest nearby" wheels.
- Served from the ledger/middleware as a query API so both retail and dealer portals share one fitment truth.

---

## 8. Dealer / B2B Portal Architecture

- **Identity:** dealer accounts are a distinct entity (`Dealer`) from retail customers, with approval state.
- **Pricing:** `price_level` per dealer tier; `dealer_price` on FinishedSKU. Wholesale checkout applies tier price, not retail price.
- **Gating:** dealer-only products hidden from retail; dealer catalog is a filtered projection of the same FinishedSKU table.
- **Terms/MOQ:** `payment_terms` (NET-30 etc.) and `moq` enforced at checkout; these override standard checkout flow.
- **Scope decision (open):** native Shopify B2B (Shopify Plus) vs headless custom portal. Lean **native Shopify B2B** if it covers tiers + terms; go headless only if tiered-pricing/MOQ rules exceed Shopify B2B limits.

---

## 9. Non-Functional & Operational

- **Correctness first:** the BOM/available-to-build math is deterministic and unit-tested (Tier 1, no LLM in the loop).
- **Realtime where it matters:** availability gate at config/checkout must be synchronous and fast (<200ms).
- **Batch where it doesn't:** QuickBooks sync, catalog projection refresh.
- **Single writer:** only the ledger writes component quantities. No direct Shopify/QuickBooks stock edits.
- **Audit trail:** every component movement is an append-only event (received, reserved, deducted, adjusted) so inventory can be reconciled to QuickBooks and to physical count.

---

## 10. Open Decisions (for next session)

1. **Integration layer stack** — n8n + custom ledger vs fully custom middleware (confirm QB Desktop connector capability). *(blocking)*
2. **Dealer portal** — native Shopify B2B vs headless. *(blocking, after B2B feature confirmation)*
3. **Configurator delivery** — Shopify app extension vs embedded custom SPA. *(depends on #2)*
4. **Fitment data source** — confirm manual curated DB for launch, ACES/PIES later.
5. **Finish preview** — confirm pre-rendered 2D layer composites over 3D viewer for v1.

---

*Created: 2026-08-16 — Resolves inventory source-of-truth (SOP-002) and establishes the component/BOM model (SOP-003), configurator (SOP-006), fitment (SOP-004), dealer (SOP-005) architectural skeletons.*
