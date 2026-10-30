# CALDER WHEELS — FITMENT IMPACT REPORT (Updated with Client Clarification)

**File:** `CALDER_FITMENT_IMPACT_REPORT.md`
**Task:** CW-109-001 / CW-109-002
**Last Updated:** 2026-10-07 (client feedback applied)

---

## 1. CLIENT-CONFIRMED VEHICLE LIST

### Active (is_active=1, shown in fitment finder, 13 makes, 23 models)

| Make | Models | Year Range | PCD | Hub | Status |
|------|--------|-----------|-----|-----|--------|
| CADILLAC | Escalade | 2021-2026 | 6x139 | 78.1 | CONFIRMED |
| CHEVROLET | Tahoe | 2021-2026 | 6x139 | 78.1 | CONFIRMED |
| GMC | Yukon | 2021-2026 | 6x139 | 78.1 | CONFIRMED |
| FORD | Expedition, F-150 | 2018-2026 | 6x135 | 87.1 | CONFIRMED |
| MERCEDES-BENZ | G-Class | 2019-2026 | 5x130 | 84.1 | CONFIRMED |
| LAND ROVER | Range Rover Sport, New Range Rover | 2022-2026 | 5x120 | 72.6 | CONFIRMED |
| LEXUS | GX (2010-2023) | 2010-2023 | 6x139 | 106.1 | CONFIRMED |
| LEXUS | RX, TX, GX (2024+), LX | 2004-2026 | Various | Various | FUTURE FITMENT |
| NISSAN | Armada | 2004-2026 | 6x139 | 77.8 | FUTURE FITMENT |
| INFINITI | QX80 | 2014-2026 | 6x139 | 77.8 | FUTURE FITMENT |
| BMW | X5, X7 | 2019-2026 | 5x112 | 66.6 | FUTURE FITMENT |
| MERCEDES-BENZ | GLE-Class, GLS-Class | 2020-2026 | 5x112 | 66.6 | FUTURE FITMENT |
| LAMBORGHINI | URUS | 2018-2026 | 5x130 | 71.6 | FUTURE FITMENT |
| AUDI | Q7, Q8 | 2015-2026 | 5x112 | 66.6 | FUTURE FITMENT |
| ROLLS-ROYCE | Cullinan | 2019-2026 | 5x112 | 66.6 | FUTURE FITMENT |

### Excluded (removed from fitment, not in fitment finder)

| Vehicle | Reason | Client Instruction |
|---------|--------|-------------------|
| Dodge Durango | 5x127 — no inventory | "Exclude" |
| Jeep Grand Cherokee | 5x127 — no inventory | "Exclude" |
| Range Rover Evoque | 5x108 — no inventory | "Exclude" |
| Range Rover Velar | 5x108 — no inventory | "Exclude" |
| BMW X3 | 20" only — no inventory | "Exclude" |
| Mercedes-Benz GLC | 20" only — no inventory | "Exclude" |
| Audi Q5 | 20" only — no inventory | "Exclude" |

---

## 2. CLIENT-CONFIRMED SPECIFICATIONS

| Spec | Value | Client Says |
|------|-------|-------------|
| Construction | **Spun Forged** | "Our current 2pc series is flow formed but we would like to use the term Spun Forged" |
| Load Rating | **2,650 lbs** (1,200 kg) | "Load rating for our wheels is 2,650 lbs" |
| Pricing | **MSRP** | "We want to list pricing at MSRP. Once we have dealer login working, we can build a discount for each customer's profile" |
| Design Code | **Is the wheel name** | "The design code is the wheel name we will be using" |
| Weight | **TBD — pending samples** | "We will have weights for each size once samples arrive" |

---

## 3. HUB CONFIRMATIONS

| Vehicle | Previously | Client Confirmed | Action |
|---------|-----------|------------------|--------|
| Lexus GX 2024+ | 95.1 (pending) | "95.1 is Correct" | Confirmed — kept in DB |
| Lexus LX 2022+ | 95.1 (pending) | "95.1 is Correct" | Confirmed — kept in DB |
| Armada / QX80 | 77.8 vs 78.1 | "77.8 is correct" | Confirmed — kept in DB |
| Lamborghini Urus | 71.5 vs 84.1 | "71.6 is the correct size" | Updated from 71.5 to 71.6 |

---

## 4. INVENTORY COVERAGE GAPS (Post-Client Feedback)

| Gap | Vehicles Affected | Resolution | Status |
|-----|------------------|------------|--------|
| No 5x112 pattern | BMW, Mercedes, Audi, Rolls Royce | Future fitment per client | PENDING |
| No 5x108 pattern | Range Rover Evoque/Velar | Excluded per client | **RESOLVED** |
| No 5x127 pattern | Durango, Grand Cherokee | Excluded per client | **RESOLVED** |
| No 5x114 pattern | Lexus RX | Future fitment per client | PENDING |
| No 5x150 pattern | Lexus LX | Future fitment per client | PENDING |
| No 20" diameter | X3, GLC, Q5 | Excluded per client | **RESOLVED** |
| Hub 95.1 missing | Lexus GX 2024+, LX 2022+ | Confirmed correct value | **RESOLVED** |
| Hub 77.8 vs 78.1 | Armada / QX | Confirmed 77.8 is correct | **RESOLVED** |
| Hub 71.5 vs 84.1 | Urus | Confirmed 71.6 is correct | **RESOLVED** |
| Rear width 12" | X5 M-Sport, GLS, Urus | Future fitment per client | PENDING |
| 22x9 / 22x9.5 widths | BMW, Mercedes, Range Rover | "22x9 for now" per client | PENDING |

---

## 5. PROTECTED FUNCTIONALITY STATUS

All protected functionality remains **UNCHANGED**:
- `fitment-finder.js` — not modified
- `CALDER_FITMENT_API` — not modified
- `window.__fitmentData` — data content updated, structure unchanged
- localStorage keys — unchanged
- Build Your Wheel — unchanged
- All Liquid templates/sections — unchanged
- All CSS — unchanged

---

**End of Report**