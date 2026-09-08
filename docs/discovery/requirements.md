# Requirements & Architecture — Calder Wheels

> **Status**: Draft — evolving from discovery. See `inspiration-analysis.md` for the source-material review that informs these requirements.
> **Related**: `AGENTS.md` (role/constraints), `llm-continuity.md` (state).

---

## 1. Product Model

### Finished SKU = Component BOM
```
WHEEL-20-GLOSSBLACK-POLISHED-CHROME
  ├── Center (×1)   — the wheel face/design
  ├── Barrel/Lip (×1) — the rim outer
  └── Hardware (×N) — rivets, bolts, fasteners
```
- **Available-to-build** = `min(component availability)` across the BOM
- If any single component is at zero, the finished wheel is out of stock
- **Single source of truth** for inventory (Shopify and QuickBooks must not independently decide existence)

### Construction Series (from Vossen's taxonomy)
Different construction = different BOM. Adopt a **series taxonomy**:
- **Forged** (monoblock) — highest price tier
- **Flow-Formed / Hybrid Forged** — mid tier
- **3-Piece** — configurable center/barrel, the richest configurator surface

Each series maps to its own component set and build rules.

---

## 2. Storefront Requirements

### Catalog
- Design-level browsing (nickname + code, e.g. `BR01 · MOB` style)
- Series filter (forged / flow-formed / 3-piece) as deep-linkable URL params
- Construction + lug metadata on every product (`3-piece`, `8-lug`, `5-lug`)
- Finish matrix — every finish photographed/rendered on every design (feeds configurator)

### Fitment Finder (differentiator)
- Year → Make → Model → Generation/Trim → compatible wheels
- Never surface incompatible products
- Data structure to map: `Vehicle ↔ Bolt pattern / offset / diameter / width / hub bore`

### Configurator (differentiator)
- Center finish × Barrel/Lip finish × Rivet/Hardware finish
- Live visual preview (composed render, not static swatches)
- Backed by component availability — a config is only orderable if its BOM is in stock

### Gallery (dual taxonomy, from Vossen)
- **Vehicle Gallery** — browse by car (fitment-first)
- **Wheel Gallery** — browse by design/finish (design-first)
- Customer-build submissions (from BespokeRev's "Tag Your Build" loop)

### Retail Funnel
- Quote-first for configurable/made-to-order items (BespokeRev model)
- Standard checkout only after config confirmation
- Financing + accelerated checkout as extensions

---

## 3. Dealer / B2B Portal (differentiator, first-class)

- Approved dealer accounts (application + approval flow)
- Tiered pricing (per-dealer price levels)
- Dealer-only products (hidden from retail)
- Wholesale checkout + payment terms (NET-30, etc.)
- Minimum order quantities
- **Note**: Vossen only has a dealer *locator*; our tiered *portal* is the competitive moat.

---

## 4. Integrations

| System | Role |
|--------|------|
| Shopify | Commerce, storefront, theme |
| QuickBooks | Accounting, COGS, vendor transactions, **inventory source of truth (candidate)** |
| ShipStation | Labels, tracking, carrier selection |
| Integration layer | TBD (n8n or equivalent) — connects Shopify ↔ Inventory ↔ QB ↔ ShipStation |

### Open Architecture Decision (blocking)
- **Inventory source of truth**: QuickBooks vs middleware vs Shopify — resolve before build.
- Recommendation direction: middleware/QuickBooks holds component truth; Shopify reflects derived finished-SKU availability only.

---

## 5. Non-Functional

- **Premium, photography-led, dark/luxury aesthetic** (BespokeRev design language)
- **Mobile-first** UX across catalog, fitment, configurator
- **Human-in-the-loop** order exception review (never auto-ship a BOM mismatch)
- **Performance**: configurator preview must feel instant (pre-rendered finish layers, not on-the-fly 3D)

---

## 6. Open Questions / Scope Decisions
1. Finish preview approach: pre-rendered 2D layer composites vs full 3D viewer
2. Dealer portal: native Shopify B2B vs headless custom app
3. Fitment data source: ACES/PIES vs manual curated DB
4. Configurator as Shopify variant vs line-item property vs custom product
5. Newsletter/drop cadence ("The List") — in scope for launch?
