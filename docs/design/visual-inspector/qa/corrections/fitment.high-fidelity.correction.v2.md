# Calder Find Your Fit --- High-Fidelity Correction v2

**Result: REVISION_REQUIRED**

This artifact contains only material discrepancies remaining after
high-fidelity correction v1.

## HF2-001 --- HIGH / STRUCTURAL --- Desktop all

The direct hero→fitment relationship is restored, but the local overlap
geometry remains off. Reference: hero/light boundary ≈188, tabs top≈118
(≈70 px overlap), panel top≈207 (≈19 px below transition). Current:
boundary≈380, tabs top≈290 (≈90 px overlap), panel top≈364 (≈16 px above
transition). Re-align the panel so it starts just below the transition
while retaining the tab overlap.

## HF2-002 --- HIGH / GEOMETRY --- Desktop all

At 1920 px capture width, the 2048 reference shell normalizes to ≈1785
px wide at x≈69--1854. Current shell is approximately x≈46--1874, ≈1828
px wide. Reduce width ≈43 px and restore the reference-derived inset.

## HF2-003 --- HIGH / DECORATIVE --- Desktop all

The approved reference's signature large technical wheel line-art
remains materially unmatched. Current artwork is a smaller
concentric/radar motif concentrated around the selected-vehicle region.
Restore the large cropped wheel drawing in the center-right finder area
(reference x≈1000--1518) and keep the contour lines as a separate subtle
system.

## HF2-004 --- MEDIUM / GEOMETRY --- Desktop all

The angled tab seam is now correctly introduced, but the tab footprints
are too small. Normalized 1920 targets are approximately 327×86 and
363×86 px; current tabs are roughly 193×74 and 232×74 px. Increase them
toward reference proportions.

## HF2-005 --- MEDIUM / GEOMETRY --- Desktop finder states

Normalize control geometry to the 1920 capture. Approximate normalized
targets are 188/203/204/233×66 px, with CTA≈342×75 px. Current fields
remain close to the original unscaled 2048 measurements and the CTA is
not visibly taller than the controls.

## HF2-006 --- MEDIUM / GEOMETRY --- Selected vehicle

The divider is near its normalized target, but the selected-vehicle
composition is materially affected by the incorrect artwork placement
and tighter visual treatment. Preserve the divider while restoring
reference-like whitespace, artwork boundary, hierarchy, horizontal
divider, and action separation.

## Acceptance

Do not alter `fitment.visual-spec.v2`. Re-render both desktop states
after these material corrections. Desktop acceptance requires the hero
transition, shell inset, tab footprint, wheel artwork, form/CTA
proportions, and selected-vehicle composition to closely reproduce the
approved reference.
