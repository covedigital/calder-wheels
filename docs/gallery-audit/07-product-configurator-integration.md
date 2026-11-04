# 07 — Product & Configurator Integration

> Protected stack (per guardrails §2): `calder-config-resolver.js`, `calder-pdp-state.js`, `calder-design-registry-*.js`, `calder-universal-pdp/cta.js`, `calder-demo-inventory.js`, fitment system. This audit changes none of them; it specifies how gallery content **feeds** them.

## Verified existing contracts

### 1. Design/code mapping (VERIFIED)
- 6 designs: `CLM-01, CLM-02, CLM-03, CLM-05, CLB-06, CLB-07` → design numbers 201–207 subset (`calder-demo-inventory.js:91-94`).
- Sellable handles: `calder-{design}-wheel` (e.g. `calder-clm-01-wheel`), rendered via `templates/product.calder.json` → `sections/calder-product.liquid`.

### 2. PDP preselection API — **already exists** (VERIFIED)
- URL contract: `/products/calder-{design}-wheel?diameter={22|24|26}&center={token}&barrel={token}&hardware={token}` (registry header, `calder-design-registry.js:3`).
- `calder-pdp-state.js`: `init()` parses `location.search` → applies to controls → `replaceState` canonical URL when complete; pushState/replaceState on user changes; popstate handled. **So opening the PDP with query params preselected the configuration is already supported.** No new preselection API is required — only that **gallery cards and detail CTAs emit these links** (currently they don't — the gap).
- `snippets/calder-design-url.liquid` already builds such deep links for collection/PDP cards; **REUSE** it in `calder-gallery-card.liquid` and the detail CTA.

### 3. Configuration → inventory states (VERIFIED, protected)
`calder-config-resolver.js` outcomes: `AVAILABLE, SOLD_OUT, NO_CATALOG_PART, NO_SELLABLE_RECORD, AMBIGUOUS, LEGACY_UNVERIFIED, INVALID, VEHICLE_REQUIRED, LOADING, ERROR`; `calder-universal-cta.js` adds `NO_STOCK`, `VEHICLE_INCOMPATIBLE`; `calder-demo-inventory.js` computes `available_to_build = min(on-hand components)`, hardware ÷ 20, `known:false` → never fail-open. `settings_data.json:479` → `calder_inventory_source: "demo"`.

## The 5 inventory states to preserve on the PDP (from gallery links)

| # | Condition | PDP behavior |
|---|---|---|
| 1 | Verified sellable variant, sufficient stock | Add to Cart (enabled) |
| 2 | Confirmed zero quantity | Out of Stock / Inquiry |
| 3 | Valid config, no sellable variant | Request This Configuration |
| 4 | Component stock supports assembly but needs approval | Request Build Availability |
| 5 | Missing/stale/failed verification | Check Availability / Speak With a Rep |

**Gallery NEVER pre-computes or displays these states.** Gallery CTAs are informational deep links; the state matrix resolves on the PDP at load. No gallery demo data may be used to establish sellability.

## Implementation contract (missing functionality to build)

### G-1: Gallery card → preselected PDP
Card emits: `calder-design-url.liquid`-style URL built from metaobject fields:
```
{{
  design: build.design_code (e.g. CLM-01),
  diameter: build.diameter (22|24|26),
  center/barrel/hardware: finish-field → registry token mapping
}}
```
- Finish-label→token mapping must come from the **registry's** finish vocabulary (gloss-black, black-titanium, titanium-tint; polished; chrome, black) — never guessed. If a build's finish label doesn't map, emit the PDP link **without** finish params (state defaults apply) — degrade gracefully, don't 404 the resolver into `INVALID`.
- Wheel-design cards (gallery_type='wheel'): link straight to design PDP default config.

### G-2: Detail-page CTA → preselected PDP
`calder-gallery-detail.liquid` CTA "View This Configuration" emits the same contract. **Microcopy required:** "Configuration shown for reference — availability and vehicle fitment are confirmed on the product page." (No stock/fitment implication from gallery.)

### G-3: Fitment integration
- Listing pages already have fitment CTAs (`builder_url`, `fitment_url` settings on the detail section — VERIFIED).
- Optional P2: vehicle-gallery card filter deep link → fitment finder with vehicle preselected, reusing fitment URL-param patterns (`filter.p.m.custom.bolt_pattern`, `filter.v.option.diameter` — VERIFIED in `calder-fitment-finder-guide.js`). Requires explicit authorization since fitment is protected functionality.

### G-4: Resolver safety from gallery context
- Gallery-sourced params must pass through the same `resolve()` path; `strict` mode unchanged; `VEHICLE_REQUIRED` (bolt+offset+hub → fitment group) remains PDP-side, not gallery-side.
- `LEGACY_UNVERIFIED` must be surfaced, not suppressed (human-in-the-loop per AGENTS.md).

## Dependency summary
| Needed by gallery | Exists? | Action |
|---|---|---|
| Deep-link URL builder | Yes (`calder-design-url.liquid`) | REUSE in card snippet + detail CTA |
| PDP param ingestion | Yes (`calder-pdp-state.js`) | No change |
| Config→availability | Yes (resolver + CTA JS) | No change |
| Component stock truth | Yes, demo source (`calder-demo-inventory.js`) | Client decision: switch `calder_inventory_source` when QuickBooks feed is real |
| Finish vocabulary mapping in Liquid | **No** — registry is JS-only | Add small Liquid mapping (or metafield-driven) for card deep links |

**PDP/configurator regression rule:** any gallery change that touches a protected file requires explicit authorization per guardrails §3; the plan below (08) avoids touching all protected files.