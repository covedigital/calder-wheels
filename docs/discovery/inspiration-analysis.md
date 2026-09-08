# Inspiration Site Analysis

> **Purpose**: Distill what works from two reference brands and translate it into concrete requirements for Calder Wheels.
> **Reviewed**: 2026-08-15
> **Sources**:
> - `bespokerev.com` — design inspiration (boutique luxury)
> - `vossenwheels.com` — functionality + catalog structure (enterprise)

---

## 1. Bespoke Revolution (bespokerev.com)

### Positioning
Boutique luxury wheel maker. Texas/USA. Luxury SUV + European vehicles. 20–26". Build-to-order ("Custom, by design"). Small catalog of **6 designs** (BR01–BR06). Sells via **Request Quote**, not checkout.

### Site Structure
1. **Hero** — full-bleed vehicle shot + "CUSTOM, BY DESIGN." + dual CTAs (`Browse Wheels`, `See Fitted`)
2. **Vehicles / Sizes / Caps** — three quick-spec trust markers
3. **The Catalog** — six design cards, each with a nickname (Mob, Envy, Nexus, Legend…), size range, and "New" badge
4. **Series · Flow-Formed** — a manufacturing-story section (lighter / stronger / denser barrel / resists cracking)
5. **Floating Caps** — feature spotlight (gravity-weighted, self-leveling center cap)
6. **Fitted · Customer Builds** — social-proof gallery of customer cars
7. **Process** — "Made to your spec" build-to-order story
8. **Social · Tag Your Build** — Instagram community loop (`#bespokerev`)
9. **The List** — newsletter (new series/fitments/limited runs)

### Design Language
- Ultra-minimal, dark, editorial layout
- Numbered sections (§ 01 … § 07) — "catalog" feel
- Massive photography; copy is terse and confident
- Nicknames for designs (humanizes SKUs)
- Section-per-feature storytelling (one idea per scroll)

### What to Steal
- **Nickname + code naming** for designs (`BR01 · MOB`) — makes configurable SKUs feel like products
- **Feature spotlights** (floating caps) — each differentiator gets its own section
- **Customer-build gallery** as primary social proof
- **"Made to your spec"** messaging aligns perfectly with our build-to-order model
- **Request-quote funnel** for bespoke/configurable items (matches our B2B + configurator reality)
- Newsletter-driven drop cadence ("The List")

### Gaps (opportunities for us)
- No vehicle fitment finder
- No configurator with finish selection
- No dealer/B2B portal
- No transparent pricing (quote-only)

---

## 2. Vossen Wheels (vossenwheels.com)

### Positioning
Established Miami manufacturer (since 2006). TÜV Verified forged factory. Large catalog across series: **Forged**, **Hybrid Forged**, **Vossen x Work**. Transparent pricing ($525–$1,900/wheel). Dealer network + retail store (apparel/accessories).

### Site Structure
1. **Utility bar** — phone, store links, Find a Dealer
2. **Mega-menu** — Wheels / Gallery / Engineering / Finishing / Blog / Apparel / Accessories
3. **Hero** — "Handcrafted in Miami" + engineering CTA + two price-led category cards
4. **Galleries** — split into **Vehicle Gallery** (browse by car) and **Wheel Gallery** (browse by wheel, incl. all finishes photographed pre-ship)
5. **Engineering / Finishing** — manufacturing authority content (factory tour, TÜV, finishing options)
6. **Blog** — Features / Owner Spotlight / Dealer Spotlight / Events
7. **Find a Dealer** — dealer locator directory

### Catalog Structure (the important part)
- **Series hierarchy**: `Forged` → `Hybrid Forged` → `Vossen x Work`; within series, named models (GEN-05, EVO-2, HFX-1, LC3-13T, VPS-1)
- **Finish matrix**: every wheel photographed across standard + custom finishes (C04 Gloss Clear Brushed, C25, etc.)
- **Construction tags**: `3-piece`, `5-lug`, `6-lug`, `8-lug`, `Aerolip` — explicit fitment/construction metadata
- **Faceted filtering**: `?fwp_series=`, `?fwp_new_releases=new` — series + attributes as URL params
- **Dual gallery taxonomy**: vehicle-first AND wheel-first browsing

### What to Steal
- **Series taxonomy** — group designs into construction families (forged / hybrid / 3-piece). Maps to our **component/BOM model** (different construction = different components)
- **Finish matrix with photography** — every finish photographed on every wheel. This is the visual backbone of our **configurator**
- **Explicit construction/lug metadata** (`3-piece`, `8-lug`) — mirrors our fitment data requirements
- **Faceted filtering via URL params** — makes catalog shareable/deep-linkable (needed for dealer links)
- **Vehicle Gallery + Wheel Gallery** dual taxonomy — supports both "what fits my car" and "show me this design"
- **Manufacturing authority content** (engineering/finishing) — trust for a premium purchase

### Gaps (opportunities for us)
- No dealer **portal** (only a locator) — we build a first-class B2B portal
- No vehicle fitment finder (galleries only) — we build Year→Make→Model
- No configurator (static finish photos) — we build live finish-composition preview
- Inventory is finished-wheel stock; no build-to-order component model

---

## 3. Synthesis — Where Calder Wheels Differentiates

| Capability | BespokeRev | Vossen | Calder Wheels |
|-----------|:---:|:---:|:---:|
| Premium dark/luxury design | ✓ | ✓ | ✓ (adopt) |
| Nicknamed design catalog | ✓ | — | ✓ (adopt) |
| Series / construction taxonomy | partial | ✓ | ✓ (adopt → maps to BOM) |
| Finish matrix w/ photography | — | ✓ | ✓ (adopt → configurator) |
| Customer-build gallery | ✓ | ✓ | ✓ (adopt) |
| Manufacturing authority content | ✓ | ✓ | ✓ (adopt) |
| Vehicle fitment finder | — | — | **✓ (differentiator)** |
| Live wheel configurator | — | — | **✓ (differentiator)** |
| Dealer/B2B portal + tiers | — | locator only | **✓ (differentiator)** |
| Build-to-order component inventory | — | — | **✓ (differentiator)** |

### Position
Calder Wheels occupies the middle: **boutique feel (BespokeRev) + enterprise catalog discipline (Vossen) + three differentiators neither has** (fitment finder, live configurator, dealer portal). The build-to-order component model is invisible to customers but is the engineering foundation that makes the configurator truthful (a config is only sellable if its components are in stock).

### Direct Implications for Requirements
1. **Configurator = finish matrix, live.** Adopt Vossen's finish photography discipline, but render it as a live center × barrel × hardware composer backed by component inventory.
2. **Series taxonomy = BOM families.** Forged / flow-formed / 3-piece each map to a distinct component bill-of-materials.
3. **Dual gallery.** Vehicle-first (fitment) + wheel-first (design) browsing.
4. **Dealer portal is the wedge.** Vossen only has a locator; our tiered-pricing portal is the competitive moat.
5. **Quote-first retail.** BespokeRev's Request-Quote funnel fits configurable, made-to-order product — checkout happens after config confirmation, not as a simple add-to-cart.
