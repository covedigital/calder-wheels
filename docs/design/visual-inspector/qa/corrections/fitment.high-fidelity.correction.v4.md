# Calder Find Your Fit — High-Fidelity Correction v4

## Correction Context

**Project:** Calder Wheels  
**Component:** Calder Find Your Fit / Fitment Finder  
**Correction iteration:** 4  
**Implementation source:** HIGH-FIDELITY v3  
**Next implementation state:** `READY_FOR_HIGH_FIDELITY_CORRECTION`

### Stable authority

- `docs/design/visual-inspector/component-specs/fitment/fitment.visual-spec.v2.json`
- `docs/design/visual-inspector/component-specs/fitment/fitment.visual-spec.v2.md`
- Approved Calder Find Your Fit reference

### Scope

This artifact carries forward **only the one material unresolved item from correction.v3**.

The following correction.v3 items are closed and MUST NOT be modified merely as part of this correction:

- `HF3-001`
- `HF3-002`
- `HF3-003`
- `HF3-005`
- `HF3-006`

No new issue is introduced in correction.v4.

---

## HF4-001

**SOURCE ID:** `HF3-004`  
**SEVERITY:** HIGH  
**CATEGORY:** DECORATIVE / ARTWORK  
**AFFECTED STATE:** `DESKTOP_BY_VEHICLE`, `DESKTOP_BY_WHEEL_STYLE`  
**SOURCE:** correction.v3 + approved reference + `fitment.visual-spec.v2`

### Reference requirement

Preserve the approved center-right technical artwork composition: a **large, recognizable cropped Calder wheel/spoke technical line drawing**, accompanied by subordinate flowing/contour line treatment.

### Reference measurement

Established approximate wheel-art region at the 2048 × 682 reference scale:

- **X:** ≈1000–1518
- **Y:** ≈207–500
- **Evidence:** ESTIMATED

These coordinates describe the established reference context; they are not a mandate for meaningless pixel-level identity.

### HF v3 condition

The current desktop renders still show a **concentric/radar-like circular technical motif** with crosshairs/nodes and diagonal contour strokes.

The artwork does **not** reproduce the recognizable multi-spoke Calder wheel technical drawing present in the approved reference.

**Evidence:** OBSERVED

### Delta

A material asset/content mismatch remains.

The illustrated object itself is different from the approved reference. This is not merely a difference in:

- opacity;
- crop;
- scale;
- anti-aliasing;
- compression; or
- browser rasterization.

### Why material

The mismatch is clearly visible in side-by-side comparison and materially changes the center-right composition and visual weight.

It also directly fails the unresolved HIGH-severity `HF3-004` acceptance condition.

### Recommended correction

Replace the current radar/concentric motif with the approved **recognizable large cropped Calder wheel/spoke technical line-art**.

Preserve the subordinate contour/flow-line treatment and integrate the wheel artwork into the established center-right region.

Match the approved reference sufficiently in:

- recognizable wheel/spoke subject;
- scale;
- X/Y placement;
- crop;
- opacity/fade;
- color treatment;
- clipping;
- relationship to the form controls; and
- relationship to the selected-vehicle divider.

### Protected accepted areas

Do **not** change the already accepted:

- hero → fitment composition;
- shell geometry;
- tab geometry or treatment;
- `FIND YOUR FIT` typography;
- bronze `FIT` treatment;
- description;
- control geometry;
- control spacing/rhythm;
- Find Wheels CTA;
- selected-vehicle region;
- typography;
- overall spacing; or
- mobile responsive structure.

This correction is intentionally narrow.

### Acceptance condition

At the **2048 × 682 desktop reference scale**, both desktop states must visibly reproduce the same recognizable **large cropped Calder wheel/spoke technical drawing** in the center-right artwork region.

The resulting artwork must have reference-like:

- crop;
- scale;
- placement;
- opacity/fade;
- clipping; and
- relationship to the controls and vehicle divider.

The current radar/concentric motif must no longer serve as the primary wheel artwork.

No material regression may be introduced in any previously accepted area.

**Evidence classification:** OBSERVED

**NEW ISSUE:** NO

---

## Implementation Priority

1. `HF4-001` — replace/correct the center-right technical wheel artwork.
2. Leave all previously accepted geometry and styling unchanged.
3. Capture new desktop By Vehicle and By Wheel Style renders.
4. Return to `READY_FOR_VISUAL_QA`.

Mobile requires no correction from this artifact unless implementation of `HF4-001` causes an actual responsive regression.

---

## Completion Gate

Correction v4 is complete when `HF4-001` satisfies its acceptance condition in both desktop states without materially regressing any closed correction.

After implementation:

`READY_FOR_HIGH_FIDELITY_CORRECTION` → `READY_FOR_VISUAL_QA`

The next QA pass should verify `HF4-001`; it should **not** perform a new component inspection or reopen resolved items without material regression evidence.
