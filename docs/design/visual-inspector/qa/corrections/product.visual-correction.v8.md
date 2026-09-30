# Calder Wheels — Visual Correction v8 → v9

## QA result
**REVISION_REQUIRED**

V8 is meaningfully closer in overall palette and section order, but it still does not match the approved mockup because the remaining errors are visually dominant.

### What improved
The dark navy/gold direction is present, Build Your Wheel and Fitment are now compact enough to coexist with the approved PDP flow, the section order is appropriate, and the page no longer resembles the original Lumia PDP as strongly.

### P0 failures
**Hero media:** current = forest/stream; approved = wheel mounted on vehicle/brake assembly.  
**Build preview:** current = beach/coast; required = configured wheel.  
**Engineering:** current = mostly flat gray/blue panel; approved = full CNC manufacturing photograph with overlay content.  
**Finishes:** current = six scenic/lifestyle photographs; approved = six isolated wheel renders.  
**Real World:** current = four blank gray boxes; approved = four automotive lifestyle images.  
**Recommendations:** current = generic lifestyle photography; approved = wheel-render product cards/B1.  
**Fonts:** current headings visibly read as a serif-like fallback; approved uses Calder Facundo. Font loading must be verified, not merely declared.

### Hero
Keep approximately 57/43 media/info at the 1178px container, but increase the visual scale of the right panel. The approved hero has a much larger title/construction hierarchy, larger controls, stronger price and CTA, and less dead space beneath the hero.

### Build Your Wheel
**Preserve this section and all behavior.** Its V8 size is broadly acceptable. Do not make it substantially taller. Replace the beach preview with the actual configured wheel preview. If initialization is unavailable, use the base Apex wheel image.

### Find Your Perfect Fit
**Preserve this section and all behavior.** Its compact height is broadly acceptable. Improve typography/control weight only; do not expand it back to the old oversized version.

### Engineering
One continuous image-backed panel. CNC/manufacturing image covers the panel. `ENGINEERED TO PERFORM` and copy sit over the image. Four capability icons sit across the lower portion. Do not split heading/content outside the image.

### Finishes
Six isolated wheel renders desktop. No scenic photography. Finish name below; selected item gets Calder-gold outline.

### Real World
Four actual automotive lifestyle images. No empty boxes in the fidelity render.

### Recommendations
Use the shared approved B1 card and actual recommended product wheel media. No generic photo fallback.

### CTA / global chrome
Specialist CTA needs the wheel-detail background and larger reference-scale typography. Header/footer must use exact shared homepage components and real Calder logo assets.

## Acceptance gate
Do not produce V9 fidelity screenshots until:
- hero is wheel imagery;
- Build preview is wheel imagery;
- finishes are wheel renders;
- Engineering has manufacturing imagery;
- Real World has four automotive images;
- recommendations have wheel imagery;
- computed heading font is Facundo;
- computed UI font is Garet.

Final state after implementation: **READY_FOR_VISUAL_QA_V9**.
