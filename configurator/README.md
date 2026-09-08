# Calder Wheels — Wheel Configurator

## Overview

The configurator is the core product experience: a customer selects center finish × barrel finish × bolt finish to define their wheel, sees a live visual preview (3 layered PNGs composited client-side), and gets an instant price + availability check.

**Architecture principle (§5):** Finishes are component identity, not attributes. Each finish × component type is a distinct stockable SKU.

## Client Design Catalog (5 designs — all 3-piece forged)

| Design | Nickname | Series | Center | Barrel | Bolts |
|--------|----------|--------|--------|--------|-------|
| 201 | Apex | 3-Piece Forged | ✓ | ✓ | 20 pcs |
| 202 | Vertex | 3-Piece Forged | ✓ | ✓ | 20 pcs |
| 203 | Striker | 3-Piece Forged | ✓ | ✓ | 20 pcs |
| 205 | Turbine | 3-Piece Forged | ✓ | ✓ | 20 pcs |
| 207 | Vortex | 3-Piece Forged | ✓ | ✓ | 20 pcs |

## Finish Catalogs (client-rendered)

| Component | Finish Code | Display Name | Category |
|-----------|-------------|--------------|----------|
| Center | BK | Gloss Black | standard |
| Center | BKUTI | Black Titanium | premium |
| Center | SU | Satin Silver | standard |
| Barrel | BK | Black | standard |
| Barrel | POLISH | Polished | premium |
| Bolt | BK | Black Bolts | standard |
| Bolt | CHROME | Chrome Bolts | chrome |

## Layer File Organization

```
shopify/assets/composites/
├── design-201/
│   ├── center-bk.png          (z=0)
│   ├── center-bkuti.png
│   ├── center-su.png
│   ├── barrel-bk.png          (z=1)
│   ├── barrel-polish.png
│   ├── bolt-bk.png            (z=2)
│   └── bolt-chrome.png
├── design-202/
├── design-203/
├── design-205/
└── design-207/
    └── ... (same 7 files)
```

**35 PNGs total** (5 designs × 7 layers), all 1920×1564 RGBA with transparent backgrounds.

Barrel and bolt layers are identical across designs (shared rendering) but stored per design folder for simple theme asset referencing.

## Size-Specific Expansion (post-launch)

When the client produces renders for additional wheel sizes (e.g. 22×9"), add a subdirectory:

```
shopify/assets/composites/design-201/22x9/
  center-bk.png       (22" specific center)
  barrel-polish.png   (22" specific barrel/rim)
  bolt-chrome.png     (shared bolts, or size-specific)
```

Pass `size_suffix="22x9"` to `ConfiguratorState` and the layer paths auto-resolve to the subdirectory. If no size suffix is set, it falls back to the generic (24×10") renders.

## How It Works

```
Customer selects:
  1. Design (201-207)
  2. Center finish (BK / BKUTI / SU)
  3. Barrel finish (BK / POLISH)
  4. Bolt finish (BK / CHROME)
  5. Size + bolt pattern

  ↓

ConfiguratorState → resolve_finished_sku()
  → "201-24-BK-POLISH-CHROME"

  ↓

generate_bom() → [
    { sku: "201-C-BK",          qty: 1,  retail: 400.00 },
    { sku: "201-B-POLISH",      qty: 1,  retail: 350.00 },
    { sku: "HWARE-CHROME",      qty: 20, retail:  35.00 },
  ]                                   total: 1450.00

  ↓

get_composite_layers() → [
    "composites/design-201/center-bk.png"     (z=0),
    "composites/design-201/barrel-polish.png" (z=1),
    "composites/design-201/bolt-chrome.png"   (z=2),
  ]
```

## Files

| File | Purpose |
|------|---------|
| `configurator_model.py` | Domain model: finishes, designs, state, SKU resolution, BOM, pricing, composites |
| `test_configurator.py` | 58 tests — catalog, layers, resolution, BOM, pricing, composites, size suffix |
| `composite_preview.py` | CLI to verify/regenerate composite JPGs from PNG layers |
| `previews/` | Generated composite previews (60 JPGs, 1 per config combo) |
| `../shopify/assets/composites/` | 35 organized layer PNGs ready for theme upload |
| `api_server.py` | FastAPI REST API wrapping the domain model |
| `test_api_server.py` | 19 tests — all API endpoints, error cases |
| `requirements-api.txt` | FastAPI + uvicorn + pydantic |

## Configurator API (Middleware)

The API server wraps the domain model as REST endpoints for the Shopify theme.

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/configurator/designs` | All wheel designs with configurable components |
| GET | `/api/configurator/finishes` | Finish catalogs grouped by component type |
| POST | `/api/configurator/resolve` | Resolve a config to SKU + BOM + price + composite layers |
| POST | `/api/configurator/available` | Check if a config is orderable (availability gate) |
| POST | `/api/configurator/price` | Full pricing breakdown (retail, dealer, cost) |
| GET | `/api/configurator/health` | Health check |

### Run

```bash
pip install -r requirements-api.txt
uvicorn api_server:app --reload --port 8080
```

### Data sourcing chain (configurator-api.js)

```
1. Middleware API  →  /api/configurator/*         (primary, 3s timeout)
2. Embedded JSON   →  #configurator-data-{id}     (fallback, from Liquid)
3. Shopify AJAX    →  /products/{id}.js           (last resort)
```

### Shopify App Proxy

`page.configurator-api.json` serves as a Shopify App Proxy fallback at `/pages/configurator-api?view=json&action=finishes`. It returns the same finish catalog structure without needing the middleware API deployed.

### Shopify Theme Files Updated

| File | Changes |
|------|---------|
| `assets/configurator-api.js` | Added middleware API as primary data source with 3-tier fallback |
| `templates/page.configurator-api.json` | Fixed `break` bugs, added `action=finishes` endpoint, removed theme layout wrapper |
| `templates/product.json` | Added `wheel-configurator` and `fitment-finder` sections to PDP |
| `sections/wheel-configurator.liquid` | Fixed `break` outside loop → `{% if is_configurable %}` wrapper |
| `sections/dealer-dashboard.liquid` | Fixed `break` outside loop |
| `sections/dealer-quick-order.liquid` | Fixed `break` outside loop |
| `sections/dealer-invoices.liquid` | Fixed `break` outside loop |
| `snippets/dealer-credit.liquid` | Fixed `break` outside loop |
| `layout/theme.liquid` | Already loading configurator/dealer assets conditionally |