# Calder Collection — Visual QA Iteration 1

**QA result:** `REVISION_REQUIRED`  
**State:** `REVISION_REQUIRED`

## Evidence note
The approved reference is 1024×1536. The supplied implementation files measure **367×2048 (desktop)**, **293×2048 (tablet)** and **104×2048 (mobile)**. Because the files labeled desktop/tablet/mobile are not exported at their intended viewport widths, exact breakpoint geometry cannot be accepted from these captures. The corrections below include only discrepancies that remain materially visible despite that limitation.

## HIGH

### COL-V1-001 — Invalid QA capture geometry
Re-capture implementation screenshots at the project’s intended desktop/tablet/mobile viewport widths without horizontal post-scaling. Do not change page CSS merely to compensate for narrow exported screenshots.

### COL-V1-002 — Hero composition
The approved reference is strongly image-led: scenic mountain/road background, large right-side wheel/vehicle focal image, left title/copy, and the right-side “Driven by Higher Standards” treatment. V1 is predominantly a flat dark hero and does not reproduce that visual mass. Correct the Collection hero assets/settings/layout only.

### COL-V1-003 — Desktop results architecture
The approved desktop requires a persistent left filter rail and a right results area with toolbar + **three B1 card columns**. The supplied V1 render does not demonstrate this architecture. After correcting the capture width, fix Collection-specific grid/facet breakpoint CSS if the true desktop render still fails.

### COL-V1-004 — Footer / excessive blank region
The approved page flows directly from newsletter/benefits into the complete dark Calder footer. V1 shows extensive white space and no complete footer. Diagnose Collection-specific interference first; do not redesign the accepted shared footer.

## MEDIUM

### COL-V1-005 — Fitment presentation
At desktop, reproduce the approved heading/status row plus one horizontal row of Year / Make / Model / Trim and Find Wheels. Preserve the existing fitment engine.

### COL-V1-006 — Category tiles
Replace the visually weak pale tile presentation with the approved five image-backed tiles, including white line icons, dark photographic surfaces, active gold accent and reference-like height/gaps.

### COL-V1-007 — B1 integration
The current cards are visually dominated by oversized wheel imagery and legacy/Lumia controls. Verify that the accepted B1 component is actually being rendered and that Collection width/CSS is not forcing an incompatible presentation. Do not redesign B1.

### COL-V1-008 — Newsletter / benefits
Reuse the accepted Home scenic newsletter/benefits treatment and verify that Collection settings/CSS are not suppressing its background or desktop horizontal layout.

## Component assessments
- **Header:** exact desktop fidelity cannot be accepted until a valid desktop-width render is captured.
- **Hero:** fail; material composition mismatch.
- **Fitment:** revision required.
- **Category navigation:** revision required.
- **Filter / toolbar:** desktop structure not demonstrated; revision required after valid recapture.
- **Product grid:** approved three-column desktop geometry not demonstrated.
- **B1 integration:** revision required; distinguish grid-width problems from B1 internals.
- **Pagination:** cannot be reliably accepted from current narrow capture.
- **Help CTA:** present, but final geometry should be rechecked after desktop grid/sidebar correction.
- **Newsletter / benefits:** revision required.
- **Footer:** fail; complete shared footer is not visibly rendered.
- **Tablet/mobile:** usable fidelity cannot be accepted from files exported at 293 px and 104 px wide; re-capture at intended viewport widths before responsive acceptance.

## State update
Set:

`READY_FOR_VISUAL_QA → REVISION_REQUIRED`

Keep `current_iteration: 1`, set `latest_correction` to `docs/design/visual-inspector/qa/corrections/collection.correction.v1.json`, and keep `accepted_render: null`.

## Next action
OpenCode should receive the two correction artifacts only, apply the bounded fixes, produce valid `collection.implementation.v2.desktop.png` plus responsive renders where applicable, and return the page to Sol for **Collection Visual QA Iteration 2**.
