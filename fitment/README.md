# Calder Wheels — Vehicle Fitment System

## Overview

The fitment system answers the core question: **"What wheels fit my vehicle?"** It powers the Year → Make → Model → compatible wheels finder across both the retail storefront and dealer portal.

**Architecture principle (§7):** Never surface incompatible products. The engine does exact matching only — no "suggest nearby" logic.

## Data Sources

### Primary: NHTSA vPIC API (free, no key)

The [NHTSA Product Information Catalog](https://vpic.nhtsa.dot.gov/api/) provides the authoritative vehicle taxonomy:

| Endpoint | Data | Use |
|----------|------|-----|
| `GetAllMakes` | All vehicle makes | Year dropdown top-level |
| `GetModelsForMakeIdYear` | Models by Make ID + Year | Year → Make → Model |
| `GetCanadianVehicleSpecifications` | Track width, wheelbase (not bolt pattern) | Validation reference |

NHTSA data is public domain, API rate-limited (~5 req/s). The seeder script respects this.

### Curated: Wheel fitment profiles

NHTSA does **not** provide bolt patterns, offsets, or hub bores. These are curated manually in `fitment_manifest.py` and seeded into the fitment_specs table.

### Future: ACES/PIES

For post-launch scale, the industry-standard [ACES/PIES](https://www.autocare.org/standards/) format can replace the curated bolt pattern data. Reserved for WS2/WS3.

## Activation Pipeline

To activate the fitment system end-to-end in the Shopify theme, follow these steps:

### Step 1: Seed the NHTSA vehicle database

```bash
cd fitment
pip install requests
python nhtsa_seeder.py --db fitment.db --years 2010-2026
```

This populates `makes`, `models`, and `model_years` tables from the NHTSA API. Expect ~35k+ model-year records.

### Step 2: Populate fitment specs (curated)

With the vehicle taxonomy seeded, add bolt pattern, offset, and hub bore data per vehicle into the `fitment_specs` table. This is the manual curation step — no automated source exists for wheel fitment specs.

### Step 3: Export vehicle data to JSON

```bash
python export_fitment_data.py --db fitment.db --output fitment-data.json
```

This generates a JSON file that can be:
- Uploaded to Shopify as an asset
- Imported into the middleware API
- Used to regenerate the Liquid snippet

### Step 4: Generate the Liquid snippet

```bash
python export_fitment_data.py --db fitment.db --liquid ../shopify/snippets/fitment-data.liquid
```

This regenerates `snippets/fitment-data.liquid` with the actual vehicle data embedded as inline JSON. The snippet is auto-included by the `fitment-finder` section.

### Step 5: Seed product metafields

```bash
python seed_metafields.py --json metafields.json --csv metafields.csv
```

Generates metafield data for all 5 products:
- `custom.is_configurable` — enables the configurator
- `custom.design_code` / `custom.design_nickname` — PDP badge
- `custom.series` — series badge on cards
- `custom.dealer_tier_1/2/3_price` — dealer pricing
- `custom.bom` — full BOM for the configurator
- `custom.dealer_moq` — minimum order quantity

Use the CSV for Shopify Admin bulk import, or the JSON for Admin API.

### Step 6: Upload composite images

```bash
python seed_composites.py --manifest upload_manifest.json
```

Upload the 35 PNGs from `shopify/assets/composites/` to Shopify at:
```
assets/composites/design-{201,202,203,205,207}/{layer}.png
```

## How the data flows in the theme

```
NHTSA API
    │
    ▼
nhtsa_seeder.py → fitment.db (SQLite)
    │
    ▼
export_fitment_data.py → fitment-data.json
    │
    ▼
fitment-data.liquid (snippet)
    │
    ▼
fitment-finder.js (loads from DOM → #fitment-data-json)
    │
    ▼
Customer selects Year → Make → Model → compatible wheels
```

### Data source priority in fitment-finder.js

1. **DOM element** `#fitment-data-json` (from Liquid snippet) — fastest, no network request
2. **`window.__fitmentData`** (set by the snippet) — immediate fallback
3. **Async section endpoint** `?section_id=async-fitment-data` — last resort

## Database Schema

```
makes ──1:N── models ──1:N── model_years ──1:N── fitment_specs
                                                     │
                                              bolt_patterns (lookup)

wheel_designs ──1:N── wheel_fitments ──N:1── bolt_patterns
```

See `schema.sql` for full DDL.

## Matching Criteria

A wheel fits a vehicle **iff all** of the following match:

1. **Bolt pattern** — exact match (e.g. `5x114.3`)
2. **Diameter** — wheel ∈ [vehicle_min, vehicle_max]
3. **Width** — wheel ∈ [vehicle_min, vehicle_max]
4. **Offset** — wheel ∈ [vehicle_min, vehicle_max]
5. **Hub bore** — wheel >= vehicle hub (centering rings adapt larger bores)
6. **Load rating** — wheel >= vehicle minimum

## Files

| File | Purpose |
|------|---------|
| `schema.sql` | SQLite DDL with indexes and view |
| `nhtsa_seeder.py` | Seeds vehicle makes/models from NHTSA API |
| `export_fitment_data.py` | Exports SQLite DB to JSON for Shopify theme |
| `seed_metafields.py` | Generates product metafield data (JSON + CSV) |
| `seed_composites.py` | Verifies and generates upload manifest for 35 PNGs |
| `fitment_manifest.py` | Curated wheel catalog (designs, sizes, bolt patterns) |
| `engine.py` | Matching engine — `find_matches(year, make, model)` |
| `test_engine.py` | Comprehensive test suite (40 tests) |
| `requirements.txt` | Python deps |

## Theme Files

| File | Purpose |
|------|---------|
| `sections/fitment-finder.liquid` | Fitment finder section with Year→Make→Model selects |
| `snippets/fitment-data.liquid` | Auto-generated vehicle data (regenerate after seeding) |
| `snippets/fitment-results.liquid` | Results grid partial |
| `assets/fitment-finder.js` | JS: loads data, cascading selects, submits query |
| `assets/fitment-finder.css` | Fitment finder styling |

## Tests

```bash
cd fitment
python -m pytest test_engine.py -v
```

Covers: bolt patterns, catalog integrity, matching criteria, integration, edge cases, fallbacks, schema.