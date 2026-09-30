# Calder Wheels — Find Your Fit
## High-Fidelity Correction v6

**Project:** Calder Wheels  
**Component:** Calder Find Your Fit / Fitment Finder  
**Correction iteration:** 6  
**Source implementation:** HIGH-FIDELITY v5  
**Source state:** READY_FOR_VISUAL_QA  
**Recommended state:** READY_FOR_HIGH_FIDELITY_CORRECTION

## Authority

The original approved Calder Find Your Fit reference remains the **PRIMARY visual authority**.

Stable high-fidelity baseline:

- `docs/design/visual-inspector/component-specs/fitment/fitment.visual-spec.v2.json`
- `docs/design/visual-inspector/component-specs/fitment/fitment.visual-spec.v2.md`

Source correction authority:

- `docs/design/visual-inspector/qa/corrections/fitment.high-fidelity.correction.v5.json`
- `docs/design/visual-inspector/qa/corrections/fitment.high-fidelity.correction.v5.md`

This v6 artifact contains **only the materially unresolved v5 artwork correction**. It does not reopen previously resolved areas, rebaseline the component, or introduce new aesthetic preferences.

---

# HF6-001

**ORIGIN:** `UNRESOLVED_V5`  
**SOURCE CORRECTION ID:** `HF5-001`  
**SEVERITY:** HIGH  
**CATEGORY:** DECORATIVE / ARTWORK  
**AFFECTED STATE:** DESKTOP_BY_VEHICLE; DESKTOP_BY_WHEEL_STYLE

## SOURCE

Approved Calder Find Your Fit reference; `fitment.visual-spec.v2`; High-Fidelity v5 desktop renders.

## REFERENCE REQUIREMENT

The center-right artwork must reproduce the approved recognizable large cropped **Calder multi-spoke wheel technical drawing**.

The wheel—not a radar/target construction—must be the primary readable artwork while preserving the established crop, scale, placement, fade/opacity, color, clipping, relationship to the controls, and relationship to the vehicle divider.

## REFERENCE MEASUREMENT

Reference capture: `2048 × 682px`

Established technical wheel region:

- **X:** approximately `1000–1518`
- **Y:** approximately `207–500`

These are frozen contextual measurements. Do not derive a new target.

## HF v5 MEASUREMENT

The v5 artwork occupies the established center-right region, but its dominant visible structure remains **concentric circular/radar geometry with sparse radial segments** rather than the approved dense, recognizable multi-spoke Calder wheel.

## DELTA

The artwork's region and broad placement are substantially retained, but its defining visual identity remains incorrect.

**Approved reference:** immediately recognizable multi-spoke wheel technical illustration.

**HF v5:** predominantly concentric/radial technical or radar construction.

This is not a negligible raster or anti-aliasing difference.

## EVIDENCE CLASSIFICATION

**OBSERVED**

## MATERIALITY EVIDENCE

The discrepancy is clearly visible in a normal side-by-side comparison without measurement overlays. The artwork is a principal center-right visual feature. The reference's dense spoke and rim construction produces an unmistakable wheel silhouette and technical-wheel identity. HF v5 instead presents concentric circles and sparse radial geometry as the dominant read.

## WHY MATERIAL

Artwork is an explicit high-fidelity property. The reference's recognizable multi-spoke wheel materially contributes to composition, artwork identity, visual weight, and Calder-specific product character.

## WHY ANOTHER IMPLEMENTATION PASS IS REQUIRED

`HF5-001` is a **HIGH-severity** active correction and its explicit artwork acceptance condition remains unsatisfied. This is a materially unresolved v5 item—not a newly discovered preference, optional polish item, or tightened tolerance.

## RECOMMENDED CORRECTION

Replace the current center-right concentric/radar construction with the **recognizable multi-spoke Calder wheel technical artwork shown in the approved reference**.

The next implementation must:

1. Make the multi-spoke wheel unmistakably readable as the primary artwork.
2. Preserve the established wheel-art region at approximately `x 1000–1518 / y 207–500` at the 2048px reference scale.
3. Match the reference-like wheel crop and scale.
4. Preserve the subdued technical-line treatment, fade/opacity, color, and clipping.
5. Preserve the established relationship between the artwork, form controls, CTA, and vehicle divider.
6. Apply the same artwork treatment to Desktop By Vehicle and Desktop By Wheel Style.
7. Leave all protected resolved geometry and responsive behavior unchanged.

**Do not perform another incremental modification of the radar motif.** The rendered result must visibly read as the approved multi-spoke wheel.

## ACCEPTANCE CONDITION

At the `2048 × 682px` desktop capture:

- Desktop By Vehicle visibly shows a recognizable large cropped multi-spoke Calder wheel technical drawing.
- Desktop By Wheel Style uses the same materially conformant artwork treatment.
- The wheel occupies the established center-right artwork region.
- The spoke/rim structure is immediately identifiable as a wheel in a normal side-by-side comparison with the approved reference.
- Concentric radar/target geometry is **not** the dominant visual read.
- Scale, crop, placement, fade/opacity, color, clipping, and relationships to the controls and vehicle divider remain materially conformant.
- No protected resolved area is materially regressed.

When these conditions are met, classify `HF6-001` as **RESOLVED**.

---

## Protected Resolved Areas

The following remain closed unless the v6 implementation introduces a genuine material regression:

- hero → fitment relationship
- hero/light boundary
- tab overlap
- shell X/Y
- shell width
- shell height
- shell radius
- angled tab geometry
- heading
- description
- contour artwork outside the active wheel correction
- form baseline
- differentiated control widths
- control heights
- CTA
- selected vehicle region
- panel colors
- borders
- By Wheel Style shared geometry
- mobile responsive adaptation

## Regressions Carried Into v6

**NONE**

## Qualifying New Issues

**NONE**

## Implementation Constraints

Do not redesign, rebaseline, modify `fitment.visual-spec.v2`, change fitment functionality, modify unrelated sections, reopen protected resolved areas without material regression evidence, add optional polish, introduce new target measurements, or progressively tighten previously accepted tolerances.

## v6 Completion Gate

The next visual-QA pass should verify only:

1. `HF6-001` is **RESOLVED**.
2. No material regression has been introduced.
3. Desktop By Vehicle passes.
4. Desktop By Wheel Style passes.
5. Mobile remains materially unchanged and passes.

If all five conditions are satisfied:

`READY_FOR_VISUAL_QA → ACCEPTED`

No further correction artifact should be created merely because additional refinement is theoretically possible.
