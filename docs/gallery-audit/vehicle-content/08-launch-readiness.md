# 08 — Launch Readiness Report

> Date: 2026-11-01 · Content NOT yet created (approval-gated). This report covers readiness state and the mandatory publication gate (§11 of the brief).

## Confirmed vehicle-to-wheel mapping (client-authoritative)
201 → Escalade V-01, Escalade M-01, Silverado Red, Tahoe Black · 202 → Tahoe M-2, Tahoe White M-02 · 203 → Silverado Black · 207 → Escalade M-07, Escalade-V White, G63 M-07, Range Rover M-07 · **No design: Ford F-150 Raptor.**
Full table: `03-content-manifest.json` / `04-wheel-product-mapping.md`.

## Verified Shopify product references ✅
All four targets fetched **live** (200, correct tags `201/202/203/207`, published 2026-10-28): `calder-clm-01-wheel`, `calder-clm-02-wheel`, `calder-clm-03-wheel`, `calder-clb-07-wheel`. F-150: deliberately **zero** product association (structurally impossible CTA).

## Image completeness ✅ (with flags)
12/12 folders · **40 unique images of 41 files on disk** (1 exact duplicate excluded) · covers defaulted to `_1.png` per folder.
⚠ **Outstanding:** client visual confirmation of covers/composition via `contact-sheets/*.html` (this agent cannot view images — flagged, not guessed).

## Unofficial Ford F-150 Raptor approval status ⚠ **PENDING — PUBLICATION BLOCKER (for that entry only)**
Wheels are not an official Calder design. Entry ships as **Draft with no product/design association**; requires explicit client approval before activation, and if approved: editorial presentation only, optional general inquiry CTA, never "Shop This Wheel".

## Broken-link checks
- Pre-import: all references validated against manifest + live store ✅.
- Post-import: QA #17 (doc 07) gates publication.

## Outstanding publication blockers (the go/no-go list)
| # | Blocker | Owner | State |
|---|---|---|---|
| 1 | `gallery_build` schema fields (Phase A) + web pages enabled | Client/Admin or approved agent | ⏳ approval to proceed |
| 2 | 40-image upload | Client/Admin or approved agent | ⏳ |
| 3 | 12 draft entries per manifest | " | ⏳ approval required (doc 06 §0) |
| 4 | VGC-1/3 theme tweaks (result count, unofficial-spec gating) | OpenCode | ✅ **IMPLEMENTED 2026-11-01** (approved) — verified JS/Liquid; runtime QA pending deploy |
| 5 | Client cover confirmations (12 contact sheets) | Client | ⏳ |
| 6 | **F-150 Raptor publication decision** | Client | ⏳ mandatory |
| 7 | QA run (doc 07) after 1–4 | OpenCode + client | ⏳ |
| 8 | Reconfirm exact design on each vehicle at publish time (§11 gate) | Client | ⏳ mandatory sign-off |

## Final go/no-go recommendation
**NO-GO today — by design.** Everything code-side is complete and verified (architecture shipped 2026-11-01; mapping live-verified; manifest idempotent). The remaining work is Admin content + three small approved-gated code touches + two mandatory client confirmations (covers, F-150). Once items 1–7 close with the §11 sign-off, publication is a low-risk activation of 11 Draft entries (F-150 held back unless separately approved).

## Deliverables index (this folder)
`01-theme-audit.md` · `02-image-inventory.md` (+ `03-content-manifest.json`) · `04-wheel-product-mapping.md` · `05-implementation-plan.md` · `06-import-procedure.md` · `07-qa-checklist.md` · `08-launch-readiness.md` · `contact-sheets/*.html` (12)

---
**Update 2026-11-01 (approval received):** VGC-1/VGC-3 code tweaks are IMPLEMENTED and verified (JS syntax + Liquid balance pass; runtime QA pending deploy). Phase A (Admin schema), Phase B/C (40-image upload + 12 draft entries) remain Admin-side — **no store credentials exist in the repo** (`shopify.theme.toml`/`config.yml` absent; Shopify CLI installed). Publish remains gated on: F-150 decision + client cover confirmations + §11 sign-off + post-import QA (doc 07).