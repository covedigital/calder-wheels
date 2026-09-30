# Calder Find Your Fit — Correction Verification Pass v2

## Final Status

**REVISION_REQUIRED**

**State transition:** `READY_FOR_VISUAL_QA → IMPLEMENTATION` using `fitment.correction.v2`.

Iteration 2 contains meaningful improvements, especially the tabs, heading treatment, shadow/elevation, and mobile control layout. It is not yet acceptable because the desktop By Vehicle state has materially regressed: its shell is excessively tall and its selected-vehicle region is missing. The two desktop tabs therefore no longer behave visually as two modes of one stable premium tool.

## Previous Correction Verification

### FIT-QA-001 — PARTIALLY_RESOLVED
Desktop shell is wider than v1, but still reads materially narrower than the approved reference relationship; By Vehicle and By Wheel Style also do not share identical shell geometry.

### FIT-QA-002 — RESOLVED
Desktop tabs are substantially taller and more substantial, with clear active bronze underline/icon treatment and consistent attached-cap behavior.

### FIT-QA-003 — REGRESSED
By Wheel Style shell height is now close to the intended compact premium utility, but By Vehicle expands to roughly 670px tall with a very large empty lower field. The two modes no longer preserve a stable shell.

### FIT-QA-004 — PARTIALLY_RESOLVED
FIND YOUR FIT now uses a much closer modern sans treatment, but supporting copy, select values/labels, CTA and selected-vehicle text still visibly mix in serif typography inconsistent with the approved unified Calder UI system.

### FIT-QA-005 — NOT_RESOLVED
Technical artwork is absent in By Vehicle and the By Wheel Style state still shows a large empty/broken-looking rectangular artwork region.

### FIT-QA-006 — PARTIALLY_RESOLVED
Controls are larger and more substantial than v1, but remain around the low-60px range and Wheel Style controls are noticeably narrower/denser than the By Vehicle control system.

### FIT-QA-007 — PARTIALLY_RESOLVED
CTA is significantly larger and more prominent than v1, but its dimensions/relationship differ between states and remain shorter than the approved ~78–82px desktop relationship.

### FIT-QA-008 — REGRESSED
Duplicate vehicle text remains in By Wheel Style. More importantly, the selected-vehicle panel is completely absent from the desktop By Vehicle render, breaking the persistent right-side context requirement.

### FIT-QA-009 — RESOLVED
Desktop shell now has a clear broad, soft elevation into the light section without a hard glow.

### FIT-QA-010 — NOT_RESOLVED
Popular Searches remains visible in the By Wheel Style desktop render. It is absent from the visible By Vehicle/mobile v2 renders, so resolution is inconsistent across states.

### FIT-QA-011 — PARTIALLY_RESOLVED
Mobile tabs, 2×2 controls, touch targets, CTA and no-overflow behavior remain strong. However, the captured v2 viewport does not show the selected-vehicle status/actions, so full responsive conformance cannot be verified; mixed serif/sans UI typography also remains.

### FIT-QA-012 — RESOLVED
Bronze remains restrained, green is confirmation-only where shown, and the fitment utility remains subordinate to the hero.

## New / Remaining Material Corrections

### FIT-QA2-001 — CRITICAL
**Affected:** DESKTOP_BY_VEHICLE  
**Evidence:** ESTIMATED from 1920×1080 render

**Baseline:** The desktop shell is a unified finder/status component with an approximately 76/24 split; selected-vehicle context remains dedicated and available when vehicle context exists. Main shell height is approximately 370–372px excluding tabs.

**Observed:** By Vehicle renders as a very tall single finder field with no visible selected-vehicle panel or divider. The shell extends from approximately y=340 to y=1012 in the 1080px render, leaving roughly 400+ px of empty lower space.

**Discrepancy:** The primary desktop state has lost the approved two-region structure and is roughly ~300px taller than the intended shell relationship.

**Correction:** Restore the desktop By Vehicle shell to the same stable geometry used by the By Wheel Style mode: approximately 370px main-shell height excluding tabs, with the persistent selected-vehicle region occupying roughly the rightmost 23–24% when vehicle context exists. Remove the large empty lower field.

### FIT-QA2-002 — HIGH
**Affected:** DESKTOP_BY_VEHICLE, DESKTOP_BY_WHEEL_STYLE  
**Evidence:** OBSERVED

**Baseline:** Both tabs are modes of one shared component; shell, technical artwork, CTA treatment, selected-vehicle region and overall visual system remain consistent.

**Observed:** By Vehicle and By Wheel Style currently produce materially different shell heights, internal splits and content regions.

**Discrepancy:** Tab switching appears to change the component structure rather than only the search methodology.

**Correction:** Normalize both desktop modes to one invariant shell: same outer width/height, same heading origin, same artwork layer, same right-side selected-vehicle region, same divider position, and same control/CTA baseline. Only labels/options and active tab should change.

### FIT-QA2-003 — HIGH
**Affected:** DESKTOP_BY_VEHICLE, DESKTOP_BY_WHEEL_STYLE  
**Evidence:** OBSERVED + ESTIMATED

**Baseline:** Technical wheel/engineering artwork is subtle background support in the upper-middle/right finder area at approximately 8–22% effective opacity; no visible empty image container.

**Observed:** Artwork is absent in By Vehicle. By Wheel Style still displays a large empty/broken rectangular region approximately 400×240px.

**Discrepancy:** The technical-art correction from v1 was not implemented successfully.

**Correction:** Ensure the decorative asset actually resolves in both modes. Render it as a non-layout-breaking background/decorative layer; no image placeholder/border may remain if loading fails. Target approximately 8–22% effective opacity and the same position in both desktop modes.

### FIT-QA2-004 — HIGH
**Affected:** DESKTOP_BY_WHEEL_STYLE  
**Evidence:** OBSERVED

**Baseline:** Selected vehicle value appears once and the panel preserves clear readable hierarchy.

**Observed:** Vehicle value still reads as duplicated/concatenated: '2026 BMW M4 Competition2026 BMW M4 Competition'.

**Discrepancy:** Visible content-rendering defect remains from v1.

**Correction:** Render exactly one selected-vehicle value. Verify the same data is not output by both a static/template value and a dynamic fitment binding.

### FIT-QA2-005 — MEDIUM
**Affected:** ALL  
**Evidence:** VISUAL_OBSERVATION

**Baseline:** The component uses the approved Calder typography hierarchy consistently; UI labels, values, CTA, status and actions should belong to one coherent supporting type system.

**Observed:** Heading is substantially improved, but supporting copy, labels/select values, CTA and selected-vehicle text still visibly mix serif and sans treatments.

**Discrepancy:** Typography correction is incomplete and the component still reads as two typographic systems.

**Correction:** Keep the corrected modern FIND YOUR FIT treatment. Apply the approved Calder supporting UI font tokens consistently to description, labels, select values, CTA, selected-vehicle eyebrow/value/status/actions. Preserve weights/scale hierarchy rather than introducing another face.

### FIT-QA2-006 — MEDIUM
**Affected:** DESKTOP_BY_WHEEL_STYLE  
**Evidence:** OBSERVED

**Baseline:** No Popular Searches row exists in the approved component; both modes preserve the same intentional lower spacing.

**Observed:** Popular Searches remains visible beneath the Wheel Style controls and appears partially unstyled/default-link blue.

**Discrepancy:** Unapproved row remains and now creates an obvious styling regression.

**Correction:** Remove the Popular Searches row from the fitment visual component in both modes unless separately approved. Confirm no default browser link styling remains inside the shell.

### FIT-QA2-007 — MEDIUM
**Affected:** MOBILE  
**Evidence:** OBSERVED / VERIFICATION_INCOMPLETE

**Baseline:** Mobile priority continues through selected vehicle status/actions after the CTA, with Change Vehicle and Reset available and no horizontal overflow.

**Observed:** The 390×844 render shows tabs, heading/copy, 2×2 controls and CTA correctly, but no selected-vehicle status/actions are visible before the bottom of the captured component area.

**Discrepancy:** The required selected-vehicle portion cannot be visually verified in v2 and may be missing or pushed beyond the rendered capture by excessive vertical spacing.

**Correction:** Verify the complete mobile component at a full-page/capture height that includes the content following the CTA. If vehicle context is active, selected vehicle, fitment status, Change Vehicle and Reset must appear beneath the CTA with practical spacing and ~44px+ interactive targets. Do not add horizontal overflow or restore decorative art at the expense of readability.

## OpenCode Priority

1. Restore the By Vehicle shell height and selected-vehicle region (`FIT-QA2-001`).
2. Make both desktop modes use one invariant shell geometry (`FIT-QA2-002`).
3. Fix/restore the technical artwork in both modes (`FIT-QA2-003`).
4. Remove the duplicated selected-vehicle value (`FIT-QA2-004`).
5. Finish typography normalization (`FIT-QA2-005`).
6. Remove the remaining Popular Searches/default-link regression (`FIT-QA2-006`).
7. Verify the complete mobile selected-vehicle/status/action region (`FIT-QA2-007`).

## Improvements to Preserve

- Larger, more substantial tabs.
- Improved modern FIND YOUR FIT heading.
- Restrained bronze and confirmation green.
- Improved desktop elevation/shadow.
- Mobile 2×2 control layout and prominent CTA.
- No evident mobile horizontal overflow.

# REVISION_REQUIRED