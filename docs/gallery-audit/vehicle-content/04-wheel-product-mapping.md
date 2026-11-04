# 04 — Wheel Product Mapping Report (VERIFIED)

> Rule compliance: design IDs were **not** treated as product IDs; mapping is `design ID → design code → universal product handle`, verified against two sources plus the **live store**.

## Mapping chain (two-source + live verification)

| Design ID | Design code (`calder-demo-inventory.js:91-94`) | Universal product handle | Live store check (2026-11-01) |
|---|---|---|---|
| 201 | CLM-01 | `calder-clm-01-wheel` | ✅ 200 — product "CLM-01", tags incl. `201`, published 2026-10-28 |
| 202 | CLM-02 | `calder-clm-02-wheel` | ✅ 200 — product "CLM-02", tags incl. `202`, published 2026-10-28 |
| 203 | CLM-03 | `calder-clm-03-wheel` | ✅ 200 — product "CLM-03", tags incl. `203`, published 2026-10-28 |
| 207 | CLB-07 | `calder-clb-07-wheel` | ✅ 200 — product "CLB-07", tags incl. `207`, published 2026-10-28 |
| 204 / 206 | CLM-05 / CLB-06 | — | not used by the 12 entries (no client assignment) |
| — | none | **FORD F-150 RAPTOR: no product association** | n/a — unofficial design |

Secondary confirmation: product tag `201`/`202`/`203`/`207` on each live product JSON matches the client's design ID assignments — the numeric ID is a product *tag*, not a product ID.

## Entry → product assignment (manifest authoritative copy)

| Entry | Design ID | Product (CTA target) | "Explore This Wheel" |
|---|---|---|---|
| Cadillac Escalade M-07 | 207 | calder-clb-07-wheel | ✔ enabled |
| Cadillac Escalade V-01 | 201 | calder-clm-01-wheel | ✔ enabled |
| Cadillac Escalade M-01 | 201 | calder-clm-01-wheel | ✔ enabled |
| Cadillac Escalade-V White | 207 | calder-clb-07-wheel | ✔ enabled |
| Mercedes-Benz G63 M-07 | 207 | calder-clb-07-wheel | ✔ enabled |
| Range Rover M-07 | 207 | calder-clb-07-wheel | ✔ enabled |
| Chevrolet Silverado Black | 203 | calder-clm-03-wheel | ✔ enabled |
| Chevrolet Silverado Red | 201 | calder-clm-01-wheel | ✔ enabled |
| Chevrolet Tahoe Black | 201 | calder-clm-01-wheel | ✔ enabled |
| Chevrolet Tahoe M-2 | 202 | calder-clm-02-wheel | ✔ enabled |
| Chevrolet Tahoe White M-02 | 202 | calder-clm-02-wheel | ✔ enabled |
| **Ford F-150 Raptor** | **none** | **none** | **✘ disabled — unofficial design** |

## Safeguards enforced by this mapping
1. **No fabricated product URLs** — every association resolves to a verified live handle (fetched from the store, not constructed).
2. **Deep-link behavior** — detail CTAs open the design PDP (`/products/calder-clb-07-wheel` etc.) with configuration preselected only when finish tokens map; the CTA never asserts a verified diameter/finish for the photographed vehicle (microcopy rendered by `calder-gallery-detail.liquid`).
3. **No fitment claims** — the gallery is a showcase; fitment confirmation stays on the PDP/fitment finder.
4. **F-150 Raptor** — blank `design_code` leaves `pdp_link` blank in the existing Liquid (`calder-gallery-detail.liquid`), so the product CTA and configurator links are **structurally impossible**, not just hidden by content. Appears under vehicle filters (make/model) but never under a wheel-design filter (its `wheel` dataset key is empty).
5. **No new wheel products** — population adds 12 metaobject entries only; the product catalog is untouched.