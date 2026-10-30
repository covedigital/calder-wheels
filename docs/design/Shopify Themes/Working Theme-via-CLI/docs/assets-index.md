# Calder Wheels — Theme Asset Index (`assets/`)

> Shopify theme `assets/` must stay **flat** — subdirectories are not supported,
> and `{{ 'sub/folder/file' | asset_url }}` will not resolve. These groups are
> naming conventions within the single flat folder.

## Naming groups

| Prefix | Group | Examples | Notes |
|--------|-------|----------|-------|
| `calder-` | Custom Calder code/brand assets | `calder-product.css`, `calder-builder-page.js`, `calder-badge-*.png` | Everything built for this project, first-party |
| `calder-{logo,emblem,badge,text}-*` | Brand deliverables | `calder-logo-header.svg`, `calder-emblem-gold-cream.png` | Color variants, svg + png pairs |
| `wheel-component-*` | **Shared BOM-declared configurator render set** (e.g. `center-spun-*`, `barrel-spun-*`, `hardware-*`) | Named via code from each product's BOM `image` field; used by the new CLM/CLB line |
| `finish-*` | **Shared configurator finish layers (GLOBAL)** | `finish-barrel-bk.png`, `finish-bolt-chrome.png` | Identical pixels across all wheel designs; never design-scoped |
| `design-{code}-center-*` | **Design-scoped configurator center layers** | `design-201-center-bk.png` | One set per wheel design; only the center face differs per design |
| `{bootstrap,gallery,cart,menu,main-product,...}-*` | Lumia theme (vendor) styles/scripts | `bootstrap-lumia.css`, `cart-page.js` | Stock theme files — do not rename |

## Configurator finish image rules

Resolution (see `snippets/configurator-image.liquid`) prefers, in order:

1. The component's own flat `image` field from the BOM metafield:
   - `design-*-center-*.png` → used as-is (design-scoped; files per design)
   - legacy `design-*-barrel-*` / `design-*-bolt-*` → remapped to the global `finish-barrel-*` / `finish-bolt-*`
   - shared render set (`center-spun-*`, `barrel-spun-*`, `hardware-*`) → namespaced `wheel-component-*`
2. Generated convention:
   - **Center (per-design):** `design-{design_code}-center-{finish}.png`
   - **Barrel (global):** `finish-barrel-{finish}.png`
   - **Hardware (global):** `finish-bolt-{finish}.png`

Legacy path-style BOM values (e.g. `composites/design-201/bk_center.png`) are skipped automatically.

`ConfiguratorAPI.loadComponents` prefers each product's own embedded BOM data
(`window._calderProductComponents`) when populated; products without a BOM
metafield (legacy sample designs) fall through to the backend
`/api/configurator/finishes` catalog so their options still render.

### Onboarding a new wheel design

- **Barrel + bolt layers:** none needed — the 4 shared `finish-*` files are reused for every design.
- **Center layers:** supply one `design-{code}-center-{finish}.png` per available center finish (3 currently: `bk` Gloss Black, `bkuti` Black Titanium, `su` Satin Silver).
- If the design's BOM metafield already carries explicit flat `image` values, upload those files instead and no `design-{code}-center-*` naming is required.

### Current CLM/CLB line (store products)

The imported CLM01–03 / CLB06–07 BOMs reference a **shared** render set (they reuse
one spun center face across designs). Until the client supplies these files, the
configurator images will 404. Files carry a `wheel-component-` prefix:

| File (upload to assets/) | Component |
|------|-----------|
| `wheel-component-center-spun-gloss-black.png` | Center — Gloss Black |
| `wheel-component-center-spun-black-tint.png` | Center — Black Tint |
| `wheel-component-center-spun-titanium-tint.png` | Center — Titanium Tint |
| `wheel-component-barrel-spun-gloss-black.png` | Barrel/Lip — Gloss Black |
| `wheel-component-barrel-spun-polished.png` | Barrel/Lip — Polished |
| `wheel-component-hardware-black-bolts.png` | Hardware — Black Bolts |
| `wheel-component-hardware-chrome-bolts.png` | Hardware — Chrome Bolts |

## Assets removed (dedupe)

The 20 files `design-{201,202,203,205,207}-{barrel,bolt}-*.png` were byte-identical
across designs and were consolidated into the 4 `finish-*` globals on
2026-10-13. Keep finish layers global going forward.