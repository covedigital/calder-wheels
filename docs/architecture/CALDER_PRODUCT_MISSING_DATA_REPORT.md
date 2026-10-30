# CALDER WHEELS — PRODUCT MISSING DATA REPORT

**File:** `CALDER_PRODUCT_MISSING_DATA_REPORT.md`
**Task:** CW-109-001
**Last Updated:** 2026-10-07 (after client clarification)

---

## P0 — REQUIRED BEFORE RELIABLE PRODUCT IMPORT

| # | Issue | Detail | Impact |
|---|-------|--------|--------|
| 1 | **Product Grouping Strategy** | 756 SKUs across 4 finish families × 5 vehicle groups × 5 designs. Group by Design Code + Finish Family (84 products, 9 variants each). Shopify variant limit: 100 options per product — 9 variants is well within limits. | Resolved — architecture confirmed. |
| 2 | **Product Images** | No final product imagery supplied. Using `via.placeholder.com/1200x1200` URLs in staging. 1200×1200 square recommended. | Awaiting client imagery. |

---

## P1 — REQUIRED BEFORE LAUNCH

| # | Issue | Detail | Status |
|---|-------|--------|--------|
| 1 | **Product Titles / Marketing Names** | Client confirmed: design code IS the wheel name (e.g., "201 Calder", "202 Calder"). Marketing titles need finalization. | CLIENT CONFIRMED — design code = wheel name. |
| 2 | **Product Descriptions** | No marketing descriptions provided. Source descriptions are technical part-number expansions. | Needs marketing copy. |
| 3 | **Construction** | Client confirmed: "Spun Forged" (for 2pc series). | **RESOLVED** — CLIENT CONFIRMED. |
| 4 | **Weight** | Client: "We will have weights for each size once samples arrive. If we need to guess I can try to calculate from the E5 wheels but they are smaller." | PENDING — awaiting sample arrival. |
| 5 | **Load Rating** | Client confirmed: **2,650 lbs** (≈1,200 kg per wheel). | **RESOLVED** — CLIENT CONFIRMED. |
| 6 | **Inventory Quantities** | Not present in source. Shopify `Inventory tracker` set to `shopify` but quantity left blank. | Needs inventory counts. |
| 7 | **Barcodes / UPC** | Not present in source. Left blank in staging CSV. | Needs barcodes. |
| 8 | **SEO Title / Description** | Not provided. Left blank in staging CSV. | Needs SEO copy. |
| 9 | **Variant Images** | Not provided. Same placeholder strategy as product images. | Awaiting imagery. |
| 10 | **Cost per item / COGS** | Not provided. Left blank. | Needs cost data. |
| 11 | **MSRP = Selling Price** | Client confirmed: pricing at MSRP. Dealer discounts via login/profile once dealer system is built. | **RESOLVED** — CLIENT CONFIRMED. |

---

## P2 — OPTIONAL ENRICHMENT

| # | Issue | Detail |
|---|-------|--------|
| 1 | **Marketing copy / lifestyle imagery** | Not supplied. Use photography-led dark/luxury aesthetic per brand docs. |
| 2 | **Detailed engineering content** | CAD drawings, cutaway diagrams, material specs — none supplied. |
| 3 | **Extended SEO metadata** | Meta keywords, structured data (Product schema) — not in scope. |
| 4 | **Google Shopping attributes** | Gender, Age group, Condition — not applicable to wheels; left at defaults. |
| 5 | **Packing dimensions (length/width/height)** | Not supplied. Left blank. |
| 6 | **Tire size as product attribute** | Tire recommendations are per-vehicle in fitment guide, not per-SKU. Useful enrichment. |

---

## CLIENT CLARIFICATION SUMMARY

| Gap | Client Response | Status |
|-----|----------------|--------|
| MSRP = selling price? | "We want to list pricing at MSRP. Once we have dealer login working, we can build a discount for each customer's profile." | **CLIENT CONFIRMED** |
| Load rating? | "Load rating for our wheels is 2,650 lbs." | **CLIENT CONFIRMED** |
| Weight? | "We will have weights for each size once samples arrive. If we need to guess I can try to calculate from the E5 wheels but they are smaller." | **PENDING** |
| Wheel name? | "The design code is the wheel name we will be using." | **CLIENT CONFIRMED** |
| Construction type? | "Our current 2pc series is flow formed but we would like to use the term Spun Forged." | **CLIENT CONFIRMED — Spun Forged** |
| Green vs Red tabs? | "Green tabs are current fitments / Red tab was for future fitments." | Applied — green=confirmed, red=pending |

## DATA QUALITY ISSUES FOUND

| # | Issue | Location | Detail | Resolution |
|---|-------|----------|--------|-----------|
| 1 | **Section heading `Lexus GX / Infiniti QX`** | Data Sheet (all sheets) | Groups unrelated manufacturers under one heading. | Accepted — source data convention. |
| 2 | **`G-WAGON` sheet heading** | Data Sheet | Trailing space in vehicle name. | Normalized to "G-Class" per NHTSA. |
| 3 | **`Expedition /F150` heading** | Data Sheet | Missing space: `"Expedition /F150"`. | Normalized to "Expedition" and "F-150". |
| 4 | **Missing year ranges in Data Sheet** | Data Sheet | Year ranges appear only in Fitment Guide. | Cross-referenced from Fitment Guide. |
| 5 | **No exposed/covered lug data in Data Sheet** | Data Sheet | Lug compatibility only in Fitment Guide. | Preserved from Fitment Guide. |
| 6 | **No front/rear distinction in Data Sheet** | Data Sheet | Inventory doesn't differentiate front vs rear. | Staggered sizing handled in fitment specs; inventory is position-agnostic. |

## PLACEHOLDER IMAGE STRATEGY

| Field | Value |
|-------|-------|
| URL | `https://via.placeholder.com/1200x1200/333333/ffffff?text=CALDER+WHEEL+PLACEHOLDER` |
| Dimensions | 1200 × 1200 px (square) |
| Background | Dark gray (#333333) on dark luxury theme |
| Text | "CALDER WHEEL PLACEHOLDER" in white |
| Status | `PLACEHOLDER` — NOT final product imagery |
| Replacement | Straightforward find-and-replace on `IMAGE_STATUS = PLACEHOLDER` fields |

## PLACEHOLDER VERSUS PREVIOUS SPECS

| Attribute | Previous Spec | Source-Verified | Status |
|-----------|--------------|-----------------|--------|
| Diameter: 18"–22" | Proposed range | **VERIFIED: 22", 24", 26"** — wider than previous spec. |
| Width: 8.5"–11" | Proposed range | **PARTIAL: 10" only** — narrower than proposed. 22x9 for future. |
| Bolt Pattern: 5x112 | Proposed | **NOT FOUND** — actual patterns: 5x120, 5x130, 6x135, 6x139 |
| Construction: 3-Piece Forged | Proposed | **REPLACED: Spun Forged** per client. |
| Weight: 24.5 lbs | Proposed | **NOT VERIFIED** — pending sample arrival. |
| Load Rating: 1,600 lbs | Proposed | **REPLACED: 2,650 lbs** per client. |

---

**End of Report**