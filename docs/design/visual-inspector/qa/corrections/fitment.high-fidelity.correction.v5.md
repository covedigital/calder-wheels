# Calder Find Your Fit — High-Fidelity Correction v5

## Scope
This correction exists only because `HF4-001` remains materially unresolved in High-Fidelity v4. No resolved historical item is reopened and no optional polish is added.

## HF5-001
**SOURCE ID:** `HF4-001`  
**SEVERITY:** HIGH  
**CATEGORY:** DECORATIVE / ARTWORK  
**AFFECTED STATE:** `DESKTOP_BY_VEHICLE`, `DESKTOP_BY_WHEEL_STYLE`  
**SOURCE:** correction.v4 + approved reference + `fitment.visual-spec.v2`

### Reference requirement
The center-right technical artwork must use the approved recognizable **large cropped Calder wheel/spoke technical line drawing**, with subordinate flowing/contour line treatment.

### Reference measurement
Established wheel-art region at the 2048 × 682 reference scale:
- X: ≈1000–1518
- Y: ≈207–500
- Evidence: **ESTIMATED**

### HF v4 measurement
- Implementation capture: **2048 × 682**
- The center-right artwork remains a concentric radar/target motif with rings, crosshair axes and radial arrows.
- It is not a recognizable multi-spoke Calder wheel technical drawing.
- Evidence: **OBSERVED**

### Delta
The primary artwork subject remains materially different from the approved reference. The v4 motif is still radar/target geometry rather than the approved wheel/spoke line-art.

### Evidence classification
**OBSERVED**

### Why material
The difference is clearly visible at normal side-by-side scale, changes the approved center-right artwork composition and visual identity, and directly fails `HF4-001`'s explicit acceptance condition.

### Why another implementation pass is required
`HF4-001` is HIGH severity and remains materially unresolved. The frozen QA contract requires every HIGH correction.v4 item to be resolved before PASS.

### Recommended correction
Replace the radar/target motif with the approved recognizable cropped Calder wheel/spoke technical line-art.

Retain the subordinate contour/flow lines and match the established:
- artwork region;
- crop;
- scale;
- placement;
- opacity/fade;
- clipping;
- relationship to the form controls; and
- relationship to the vehicle divider.

Do not alter protected accepted geometry or styling.

### Acceptance condition
At **2048 × 682**, both desktop states visibly show the approved recognizable **large cropped Calder multi-spoke wheel technical line drawing** in the center-right artwork region, with reference-like crop, scale, placement, fade/opacity and clipping.

Radar/target geometry must not remain the primary artwork.

Previously accepted areas must remain materially unchanged.

## Protected resolved areas
Keep closed:
- hero/light boundary and hero → fitment relationship;
- tab overlap and slanted tab geometry;
- shell position, width, height and radius;
- `FIND YOUR FIT` hierarchy and bronze `FIT`;
- description;
- form baseline, differentiated control widths, control height and gaps;
- Find Wheels CTA;
- selected vehicle region;
- panel surface;
- By Wheel Style shared geometry; and
- mobile responsive adaptation.

## Completion gate
Implement `HF5-001` only, then return to `READY_FOR_VISUAL_QA`.

Do not reopen protected resolved areas without material regression evidence.
