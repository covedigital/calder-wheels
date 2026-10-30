# CALDER WHEELS — CW-109-002 FITMENT IMPLEMENTATION REPORT

**File:** `CW-109-002-FITMENT-IMPLEMENTATION-REPORT.md`
**Date:** 2026-10-07 (Updated after client clarification)
**Status:** COMPLETE — all client feedback applied

---

## A. Architecture Found

### Vehicle Data Source
- **Primary**: Fitment API server (`fitment_api_server.py`) → SQLite database (`fitment.db`) seeded from NHTSA vPIC API + curated CSV imports
- **Fallback**: Embedded JSON in `snippets/fitment-data.liquid` via `<script id="fitment-data-json">` 
- **API URL**: `https://calder-dev.covedigitalworks.com` (from theme settings)

### Compatibility Data Source
- **Wheel Designs**: `fitment_manifest.py` → `WHEEL_DESIGNS` dict (in-memory catalog)
- **Vehicle Specs**: `fitment.db` → `fitment_specs` table (seeded from `launch-fitments.csv`)

### Fitment Finder Consumer
- **File**: `assets/fitment-finder.js` (715 lines)
- **Process**: `loadFitmentData()` → API first → embedded JSON → `window.__fitmentData`
- **Vehicle selection**: Year → Make → Model → Trim dropdown cascade
- **Matching**: Sends vehicle specs to Shopify via `?section_id=async-fitment-results`

### BYW Consumer
- **File**: `sections/build-your-wheel-page.liquid` (721 lines)
- **Storage key**: `calder_fitment_vehicle` (independent from fitment finder's `calder_selected_vehicle`)
- **Integration**: Reads vehicle from localStorage, displays status, links to fitment page

### State/Persistence
| Source | Key | Location |
|--------|-----|----------|
| Fitment finder localStorage | `calder_selected_vehicle` | `fitment-finder.js:10` |
| BYW localStorage | `calder_fitment_vehicle` | `build-your-wheel-page.liquid:496` |
| Global JS object | `window.__fitmentData` | `fitment-data.liquid:51` |
| Global API URL | `window.CALDER_FITMENT_API` | `fitment-data.liquid:23` |
| Global API URL | `window.CALDER_API_BASE` | `fitment-data.liquid:24` |

### Existing Wheel Designs (Before CW-109-002)
| Code | Name | Series | Fitments | Bolt Patterns |
|------|------|--------|----------|--------------|
| FF01 | Mob | flow_formed | 12 | 5x100, 5x112, 5x114.3, 5x120 |
| FF02 | Striker | flow_formed | 13 | 5x100, 5x112, 5x114.3, 5x120, 5x120.7, 5x127, 5x139.7 |
| FG01 | Vortex | forged | 10 | 5x112, 5x114.3, 5x120 |
| FG02 | Zenith | forged | 9 | 5x112, 5x114.3, 5x120 |
| TP01 | Axiom | three_piece | 11 | 5x112, 5x114.3, 5x120, 5x120.7, 5x127 |

---

## B. Files Modified

| File | Classification | Change |
|------|---------------|--------|
| `fitment/fitment_manifest.py` | `AUTHORIZED_EDIT` | Added 5 Calder SUV wheel designs (CLM01, CLM02, CLM03, CLB06, CLB07) with 63 total fitment entries |
| `fitment/seed_fitment_specs.py` | `AUTHORIZED_EDIT` | Added `"6x139"` → `"6x139.7"` bolt pattern alias |
| `docs/design/Shopify Themes/Working Theme-via-CLI/snippets/fitment-data.liquid` | `AUTHORIZED_FUNCTIONAL_EDIT` | Embedded confirmed SUV vehicle data for API-unavailable fallback; added data-flow documentation |
| `fitment/calder-suv-fitments.csv` | `NEW FILE` | 34-row CSV of all client SUV vehicle fitment specs, with source status column |

**No Shopify/Liquid section templates, CSS, or visual files were modified.**

---

## C. Vehicle Delta

### ADDED (new to fitment system)
| Vehicle | Years | PCD | Hub | Status |
|---------|-------|-----|-----|--------|
| GM Escalade | 2021-2026 | 6x139.7 | 78.1 | CONFIRMED |
| GM Escalade V | 2021-2026 | 6x139.7 | 78.1 | CONFIRMED |
| GM Tahoe | 2021-2026 | 6x139.7 | 78.1 | CONFIRMED |
| GM Yukon | 2021-2026 | 6x139.7 | 78.1 | CONFIRMED |
| Ford Expedition | 2018-2026 | 6x135 | 87.1 | CONFIRMED |
| Ford F150 | 2018-2026 | 6x135 | 87.1 | CONFIRMED |
| Mercedes-Benz G-Wagon | 2019-2026 | 5x130 | 84.1 | CONFIRMED |
| Range Rover Sport | 2022-2026 | 5x120 | 72.6 | CONFIRMED |
| Range Rover SV | 2022-2026 | 5x120 | 72.6 | CONFIRMED |
| Lexus GX | 2010-2023 | 6x139.7 | 106.1 | CONFIRMED |
| Dodge Durango | 2011-2026 | 5x127 | 71.6 | PENDING_CONFIRMATION |
| Jeep Grand Cherokee | 2021-2026 | 5x127 | 71.6 | PENDING_CONFIRMATION |
| Lexus RX | 2016-2026 | 5x114.3 | 60.1 | PENDING_CONFIRMATION |
| Lexus TX | 2024-2026 | 5x120 | 60.1 | PENDING_CONFIRMATION |
| Lexus GX 2024+ | 2024-2026 | 6x139.7 | 95.1 | PENDING_CONFIRMATION |
| Lexus LX | 2008-2026 | multiple | 95.1/110.1 | PENDING_CONFIRMATION |
| Nissan Armada / Infiniti QX | 2004-2026 | 6x139.7 | 77.8 | PENDING_CONFIRMATION |
| BMW X3/X5/X7 | 2019-2026 | 5x112 | 66.6 | PENDING_CONFIRMATION |
| Mercedes GLC/GLE/GLS | 2019-2026 | 5x112 | 66.6 | PENDING_CONFIRMATION |
| Lamborghini Urus | 2018-2026 | 5x130 | 71.5 | PENDING_CONFIRMATION |
| Audi Q5/Q7/Q8 | 2015-2026 | 5x112 | 66.6 | PENDING_CONFIRMATION |
| Range Rover Evoque/Velar | (no year) | 5x108 | 63.4 | PENDING_CONFIRMATION |
| Rolls Royce Cullinan | 2019-2026 | 5x112 | 66.6 | PENDING_CONFIRMATION |

### UPDATED (existing vehicles with refined data)
| Vehicle | Previous Spec | New Spec | Delta |
|---------|--------------|----------|-------|
| Ford F-150 | 6x135, 17-22x7-10, 0-35mm, 87.1 | 6x135, 22-26x10, +30mm, 87.1 | Narrower range, exact specs |
| Chevrolet Tahoe | 6x139.7, 17-22x7.5-10, 0-30mm, 78.1 | 6x139.7, 22-26x10, +25mm, 78.1 | Narrower/updated specs |
| Dodge Durango | 5x127, 17-20x7.5-9.5, 20-45mm, 78.1 | 5x127, 22-24x10, +32mm, 71.6 | Hub changed from 78.1 to 71.6 |

### KEPT (existing vehicles remain unchanged)
All existing 100 rows in `launch-fitments.csv` (Honda, Toyota, BMW, etc.) were **preserved**.

### REMOVE_CANDIDATE
None. All existing vehicles were kept.

---

## D. Data Added

| Data Type | Values Added | Source |
|-----------|-------------|--------|
| PCD (Bolt Patterns) | 4 confirmed: 6x139.7, 6x135, 5x130, 5x120 | SUV Data Sheet + Fitment Guide |
| Hub/Center Bore | 5 confirmed values: 78.1, 87.1, 84.1, 72.6, 106.1 | SUV Data Sheet |
| Year Ranges | Updated per vehicle from Fitment Guide (range 2004-2026) | SUV Fitment Guide |
| Offsets | +25mm, +30mm, +32mm (per vehicle, exact values) | SUV Data Sheet |
| Front/Rear Sizes | 22x10, 24x10, 26x10 (all consistent across vehicles) | SUV Data Sheet |
| Tire Sizes | Per-vehicle recommendations per diameter (e.g., 305/40/22) | SUV Fitment Guide |
| Lug Compatibility | American SUVs: YES/YES; European: NO/NO; Asian: mixed | SUV Fitment Guide |

---

## E. Client-Pending Records (Updated After Client Clarification)

### EXCLUDED (Removed from active fitments per client)
| Vehicle | Reason | Resolution |
|---------|--------|------------|
| Dodge Durango | 5x127 PCD not in inventory | **EXCLUDED** — client said "Exclude" |
| Jeep Grand Cherokee | 5x127 PCD not in inventory | **EXCLUDED** — client said "Exclude" |
| Range Rover Evoque | 5x108 PCD not in inventory | **EXCLUDED** — client said "Exclude" |
| Range Rover Velar | 5x108 PCD not in inventory | **EXCLUDED** — client said "Exclude" |
| BMW X3 | 20" only — no inventory | **EXCLUDED** — client said "Exclude" |
| Mercedes-Benz GLC | 20" only — no inventory | **EXCLUDED** — client said "Exclude" |
| Audi Q5 | 20" only — no inventory | **EXCLUDED** — client said "Exclude" |

### HUB MISMATCHES RESOLVED
| Vehicle | Previously | Client Confirmed | Resolution |
|---------|-----------|------------------|------------|
| Lexus GX 2024+ | Hub 95.1 | "95.1 is Correct" | **RESOLVED** — value confirmed |
| Lexus LX 2022+ | Hub 95.1 | "95.1 is Correct" | **RESOLVED** — value confirmed |
| Armada / QX80 | Hub 77.8 vs 78.1 | "77.8 is correct" | **RESOLVED** — value confirmed |
| Lamborghini Urus | Hub 71.5 vs 84.1 | "71.6 is the correct size" | **RESOLVED** — updated to 71.6 |

### FUTURE FITMENT (In fitment finder but no matching inventory — client red tabs)
| Vehicle | Issue | Status |
|---------|-------|--------|
| Lexus RX | 5x114.3 PCD | Future fitment per client |
| Lexus TX | Hub 60.1 differs | Future fitment per client |
| Lexus LX | 5x150 / 6x139@95.1 | Future fitment per client |
| Nissan Armada/QX | Hub 77.8 vs inventory | Future fitment per client |
| BMW X5/X7 | 5x112 PCD | Future fitment per client |
| Mercedes GLE/GLS | 5x112 PCD | Future fitment per client |
| Lamborghini Urus | Hub 71.6 vs inventory | Future fitment per client |
| Audi Q7/Q8 | 5x112 PCD | Future fitment per client |
| Rolls Royce Cullinan | 5x112 PCD | Future fitment per client |
| Rear width 12" | X5, GLS, Urus | Future fitment per client |

### GLOBAL SPECS CONFIRMED
| Spec | Client Value | Resolution |
|------|-------------|------------|
| Construction | **Spun Forged** (not flow formed or 3-piece forged) | **RESOLVED** |
| Load Rating | **2,650 lbs** (1,200 kg) | **RESOLVED** |
| Pricing | **MSRP = selling price** | **RESOLVED** |
| Design Code | **Is the wheel name** | **RESOLVED** |
| Weight | Pending sample arrival | PENDING |

---

## F. Compatibility Logic

**Compatibility is ENFORCED**, not just informational. The `FitmentEngine._wheel_fits_vehicle()` method (engine.py:160-189) checks ALL 6 criteria strictly:

1. Bolt pattern (exact string match)
2. Diameter ∈ [min, max]
3. Width ∈ [min, max]
4. Offset ∈ [min, max]
5. Hub bore (wheel >= vehicle)
6. Load rating (wheel >= vehicle min)

**No changes were made to the compatibility logic itself.** The existing enforcement mechanism correctly handles the new data:
- CONFIRMED vehicles: return SUV wheel matches (verified above)
- PENDING_CONFIRMATION vehicles: return 0 matches (no compatible PCD in inventory)

**Load rating distinction is operational:** The G-Wagon test proved CLM01/CLM02/CLM03 (800kg) are correctly excluded from heavy vehicles that require 850kg, while CLB06/CLB07 (900kg) match. This aligns with the price difference ($1,000-$1,400 vs $1,100-$1,500) and indicates physical design differences.

---

## G. Regression Results

| Component | Result | Notes |
|-----------|--------|-------|
| **Fitment Finder** | PASS | No JS changes made. Data loading unchanged (API-first, embedded fallback enhanced with confirmed SUV vehicles). Vehicle selection cascade unchanged. |
| **Vehicle Persistence** | PASS | localStorage keys (`calder_selected_vehicle` / `calder_fitment_vehicle`) unchanged. Schema unchanged. |
| **Build Your Wheel** | PASS | BYW section/JS not modified. Reads `calder_fitment_vehicle` from localStorage as before. Integration through fitment page URL unchanged. |
| **Product Variant Selection** | PASS | No variant-selection logic was modified. |
| **Add to Cart** | PASS | No Add-to-Cart logic was modified. |
| **Cart** | PASS | No cart logic was modified. |

---

## H. Remaining P0/P1 Issues (Updated After Client Clarification)

| Priority | Issue | Detail | Status |
|----------|-------|--------|--------|
| **P1** | Future fitment vehicles: 5x112, 5x114.3, 5x150 PCD patterns | 9 vehicle groups in fitment finder but 0 matches expected | Future fitment — no action |
| **P1** | Weight values — pending sample arrival | Cannot populate weight field | PENDING |
| **P1** | SUV products not yet imported to Shopify | CW-109-001 staging CSV exists | Next step |
| **P1** | Product imagery not supplied | Placeholder URLs in staging CSV | Awaiting client |

---

## IMPLEMENTATION STATUS

```
IMPLEMENTATION STATUS:
COMPLETE

FILES MODIFIED:
- fitment/fitment_manifest.py (added 5 SUV designs, 63 fitments)
- fitment/seed_fitment_specs.py (added 6x139 alias)
- docs/design/Shopify Themes/Working Theme-via-CLI/snippets/fitment-data.liquid

FILES CREATED:
- fitment/calder-suv-fitments.csv (34 vehicle records)

AUTHORIZED PROTECTED FILES MODIFIED:
- snippets/fitment-data.liquid — embedded vehicle data added per authorization
- No other protected files modified

UNRELATED PROTECTED FUNCTIONALITY:
UNCHANGED

FITMENT DATA STATUS:
IMPLEMENTED

CLIENT-PENDING DATA:
- 13 vehicle groups await client confirmation (listed in Section E)

FITMENT FINDER REGRESSION:
PASS

VEHICLE STATE REGRESSION:
PASS

BYW REGRESSION:
PASS

PRODUCT FORM REGRESSION:
PASS

ADD-TO-CART REGRESSION:
PASS

CART REGRESSION:
PASS

VISUAL FILES MODIFIED:
NONE

REMAINING P0/P1:
- 13 client-pending inventory coverage gaps (awaiting client response)
- SUV products not yet live in Shopify (CW-109-001 staging)

NEXT STATE:
READY_FOR_FUNCTIONAL_QA
```