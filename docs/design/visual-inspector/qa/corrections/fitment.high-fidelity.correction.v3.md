# Calder Find Your Fit --- High-Fidelity Correction v3

**Result: REVISION_REQUIRED**

Desktop reference and current v2 renders are both **2048×682**, so this
pass uses direct 1:1 comparison. The previous 1920 normalization must
not be carried into these new captures.

## HF3-001 --- HIGH / STRUCTURAL

Restore the desktop vertical composition. Reference hero/light
boundary≈188, tabs top≈118, panel top≈207. Current v2≈379, ≈310, ≈386
respectively. The tab overlap itself is now close (\~69px), but the
entire finder is displaced downward by roughly 180--190px.

## HF3-002 --- HIGH / GEOMETRY

Restore shell footprint. Reference x≈74--1978, width≈1904px. Current
x≈168--1880, width≈1712px. Current shell is ≈192px too narrow.

## HF3-003 --- MEDIUM / GEOMETRY

Keep the corrected slanted tab silhouette, but enlarge tabs from roughly
291×77 / 331×77 to the established ≈349×92 / 387×92 reference
footprints.

## HF3-004 --- HIGH / DECORATIVE

The approved large technical wheel/spoke line-art remains unresolved.
Current v2 still uses a concentric/radar target motif. Replace it with
the reference's large cropped wheel drawing in the center-right finder
plus its separate contour-line treatment.

## HF3-005 --- MEDIUM / GEOMETRY

Current controls/CTA appear approximately 6--8% undersized, consistent
with the prior 1920 normalization. These captures are 2048 wide,
matching the reference exactly. Restore the native reference dimensions:
controls≈201/217/218/249×70px; CTA≈365×80px.

## HF3-006 --- MEDIUM / GEOMETRY

Restore selected-vehicle region proportion after widening the shell.
Reference divider≈x1521 and region≈457px (\~24% shell). Current
divider≈1495 and right region≈385px.

## Preserve

Do not reopen the already-converged typography, colors, border language,
success-state styling, desktop state consistency, or mobile responsive
adaptation. Do not modify `fitment.visual-spec.v2`.
