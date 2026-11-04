# 05 — Implementation Plan (vehicle gallery content population)

> **No theme code has been modified for this task.** The 2026-11-01 gallery implementation (Phases B–F, approved & complete) already supports everything except three small items below (VGC-1/2/3), which **await your approval**. Content creation also awaits approval (doc 06).

## Phase A — Shopify Admin schema (VGC-2) · APPROVAL REQUIRED
- **Objective:** extend the existing `gallery_build` metaobject definition to cover the client schema.
- **Tasks:** in Shopify Admin → Content → Metaobject definitions → Gallery Build, **add** (existing fields unchanged):
  - `vehicle_color` — single line text (optional)
  - `wheel_design_id` — single line text (optional; values 201/202/203/207)
  - `official_calder_design` — boolean (default true)
  - Publication status: use Shopify's native metaobject **Draft/Active** statuses (Liquid only exposes Active → satisfies "unpublished entries not exposed publicly").
- **Theme files:** none. **Dependencies:** none. **Risk:** Low. **Rollback:** remove fields.
- **Acceptance:** Admin editor shows the new fields; existing fallback block unaffected.

## Phase B — Image upload (no code)
- Upload the **40 unique PNGs** (exclude `Tahoe-M-2_2.png` duplicate — 41 files on disk, 40 unique) from `docs/design/mockups/vehicles/Photo Shoot/` to Settings → Content → Files, preserving folder prefixes in filenames (already prefixed). Originals preserved; Shopify CDN handles delivery formats.
- **Acceptance:** 40 files uploaded; failed uploads logged and retried (import procedure doc 06 §3).

## Phase C — Content population (12 entries) · APPROVAL REQUIRED
- **Objective:** create the 12 `gallery_build` entries per `03-content-manifest.json`, **as Draft**, from the manifest (idempotent by `handle`).
- **Procedure:** doc 06 (Admin manual or Admin API if credentials provided).
- **Fields per entry:** title, gallery_type=`vehicle`, vehicle make/model/color, wheel_model=design code (CLM-01…), wheel_series=`Spun Forged`, wheel_design_id, official_calder_design, wheel_product (product reference to the verified handle), featured_image (cover), gallery_images (ordered list), featured, sort_order.
- **F-150 Raptor:** `official_calder_design=false`, **no wheel_product, no design fields**, `publication_status` stays **Draft pending separate client approval** — never published with the other 11.
- **Dependencies:** Phase A fields + Phase B files. **Risk:** Low (draft-only). **Acceptance:** 12 draft entries; `gallery_build[handle]` resolves each; no duplicates on re-import.

## Phase D — Theme tweaks (VGC-1, VGC-3) · APPROVAL REQUIRED — the only code changes
| ID | File (VERIFIED paths) | Change | Acceptance |
|---|---|---|---|
| VGC-1a | `sections/calder-vehicle-gallery.liquid` + `calder-wheel-gallery.liquid` | Add `<p class="cg-count" data-gallery-count></p>` near filters | Count visible |
| VGC-1b | `assets/calder-gallery-v2.js` | In `render()`: `count.textContent = `${visible.length} of ${cards.length} builds`` | Count updates on filter/search/sort |
| VGC-3 | `sections/calder-gallery-detail.liquid` | Wrap specs block + wheel CTA in `{% if entry.official_calder_design.value != false %}` (mirrors existing `pdp_link != blank` gating) | F-150 detail shows editorial content only, no spec rows, no "Explore This Wheel" |

- **Protected functionality:** untouched (fitment, configurator, cart, PDP stack). **Risk:** Low. **Rollback:** git revert (one commit).
- **VGC-3 note:** current `pdp_link` logic already blanks the CTA for F-150 (no design code) — VGC-3 additionally hides the spec labels so nothing renders empty.

## Phase E — Publish (after QA + approvals)
- Publish the 11 official entries (set Active) **only after**: client confirms covers (contact sheets), VGC changes pass QA (doc 07), F-150 approval decision received. F-150 stays Draft unless separately approved.
- Listing/detail pages pick entries up automatically — **no further theme edits ever needed for future vehicles** (upload → create entry → assign product → publish).

## Sequencing
A (schema) ∥ B (upload) → C (draft entries) → D (code tweaks) → QA (doc 07) → client approvals → E (publish).

## Estimated complexity
**Low–Medium.** 12 content entries + 40 uploads + 3 small code touches. The heavy architecture (listing, filtering, detail, deep links, empty states, lightbox, a11y) shipped 2026-11-01.