# Calder Wheels — Product Visual QA v5

## Result: REVISION_REQUIRED

I compared `product.desktop.v5.png`, `product.tablet.v5.png`, and `product.mobile.v5.png` directly against `Calder - 3 - Product(5).png`.

V5 contains most expected components, but it is **not visually converged**. The primary problem is not a handful of pixel offsets. The render is using the wrong classes of imagery, underscaled typography/components, and several section compositions that are structurally different from the approved mockup.

## Measured reference geometry

The approved reference canvas is 824×1908. Its main desktop content runs approximately x=38→762 (724px, ~87.9% of the reference width). The hero begins around y=77.

Hero reference:
- gallery ≈404px wide;
- right information/configuration ≈295px;
- gap ≈25px;
- effective split ≈57/43;
- main media ≈404×320;
- hero ends around y=592.

Specifications/Engineering:
- starts ≈y616;
- specs ≈328px wide;
- engineering ≈372px;
- gap ≈24px;
- ends ≈y862.

Remaining reference bands:
- finishes ≈883–1085, 6 wheel renders visible;
- Real World ≈1100–1282, 4 automotive images;
- recommendations ≈1296–1530, 4 wheel cards;
- specialist CTA ≈1534–1650;
- global footer ≈1650–1908.

These reference pixels are for proportional reverse-engineering, not literal CSS pixels. At the project's 1178px desktop container, preserve the same relationships.

## Blocking differences

### Media system
Current hero = black-and-white feet. Configurator = bokeh. Finishes = landscape photos. Recommendations = landscapes/people. Real World = empty boxes.

Approved hero/configuration/recommendations/finishes are **wheel-centric**. Real World is **automotive lifestyle**. Engineering is **CNC/manufacturing**.

This is the largest visual-fidelity failure. CSS cannot compensate for the wrong asset class.

### Hero
Current hero is too small and sparse. The approved hero is a dense premium merchandising block with a large gallery and a substantial right configuration panel. Target approximately 57/43 gallery-to-info with a 32–40px desktop gap at the 1178px container.

### Build Your Wheel
This section is functionally necessary but absent from the approved mockup. Preserve it, but treat it as a Calder extension rather than allowing it to dominate the approved page language. It needs a real wheel preview, not generic bokeh imagery.

### Fitment
The approved design makes the compact pale-green hero fitment confirmation primary. The full finder can remain as secondary workflow, but its current broad centered band should have lower visual weight.

### Engineering
Current V5 is split into a flat blue placeholder area and a separate lower dark content area. Approved is one continuous image-backed CNC panel with overlay text and four capabilities across the bottom.

### Available Finishes
Current landscape cards are fundamentally wrong. Approved is six isolated wheel renders on white with labels below and a restrained gold selected outline.

### Real World
Current empty gray boxes are not acceptable fidelity output. Approved is four automotive lifestyle photographs.

### Recommendations
Current generic photo + Quick Add cards are not B1. Approved cards are wheel-image dominant with model/construction/price and a restrained arrow action.

### Specialist CTA / Footer
CTA must be image-backed and much more visually substantial. Footer should reuse the approved homepage global footer instead of a reduced PDP-local interpretation.

## Responsive
Do not tune tablet/mobile independently until the desktop visual system is corrected. Then reflow the same wheel-centric assets and hierarchy at 768 and 390 without miniaturizing type and controls.

## QA state
**REVISION_REQUIRED**
