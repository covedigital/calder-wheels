# Calder Find Your Fit — Correction Verification Pass v3

## 1. ITERATION

**3**

## 2. CORRECTION.V2 VERIFICATION

| Correction | State | Status | Current v3 evidence |
|---|---|---|---|
| FIT-QA2-001 | DESKTOP_BY_VEHICLE | **RESOLVED** | Compact ~368px shell restored; right-side selected-vehicle region/divider restored; excessive empty lower field removed. |
| FIT-QA2-002 | DESKTOP_BY_VEHICLE / DESKTOP_BY_WHEEL_STYLE | **RESOLVED** | Both desktop modes now share the same outer shell, heading origin, divider/status region, control baseline, CTA treatment, and overall dimensions. |
| FIT-QA2-003 | DESKTOP_BY_VEHICLE / DESKTOP_BY_WHEEL_STYLE | **PARTIALLY_RESOLVED** | Broken artwork rectangle is gone and both modes share the same faint wheel/ring decoration. Full contour/engineering treatment remains reduced, but this residual difference is decorative and non-material. |
| FIT-QA2-004 | DESKTOP_BY_WHEEL_STYLE | **RESOLVED** | Vehicle value appears once: `2026 BMW M4 Competition`. |
| FIT-QA2-005 | ALL | **PARTIALLY_RESOLVED** | Main heading is corrected, but supporting copy, labels/values, CTA, and selected-vehicle content still use a visibly contrasting serif face. |
| FIT-QA2-006 | DESKTOP_BY_WHEEL_STYLE | **RESOLVED** | Popular Searches/default blue links are removed. |
| FIT-QA2-007 | MOBILE | **RESOLVED** | Mobile now visibly continues into the separated YOUR VEHICLE region; controls/CTA remain usable and there is no visible horizontal overflow. Lower actions can continue below the viewport via normal vertical scroll. |

## 3. REGRESSION CHECK

**Material regressions found: NONE.**

The v3 correction pass substantially converged the two desktop states. Hero → fitment → product-discovery hierarchy remains intact; shell proportions are stable; tabs, controls, CTA, divider, selected-vehicle region, border/elevation, and responsive flow show no new material degradation.

## 4. STATE REVIEW

**DESKTOP_BY_VEHICLE: REVISION_REQUIRED**

Structurally conformant. One remaining material issue is the supporting UI typography.

**DESKTOP_BY_WHEEL_STYLE: REVISION_REQUIRED**

Structurally conformant and now clearly the same component as By Vehicle. Duplicate vehicle text, Popular Searches, and broken artwork container are resolved. Supporting UI typography remains material.

**MOBILE: REVISION_REQUIRED**

Responsive structure is conformant: tabs are usable, 2×2 controls fit without overflow, CTA is prominent, and selected-vehicle content follows the CTA. Supporting UI typography remains the same cross-state issue.

## 5. OVERALL VISUAL QA

# REVISION_REQUIRED

Iteration 3 is close to acceptance. Only **one material correction** is carried into correction.v3. The remaining simplified technical artwork is treated as a non-material decorative tolerance and is **not** being used to perpetuate the QA loop.

### FIT-QA3-001 — Supporting UI typography

**Affected:** ALL  
**Severity:** MEDIUM  
**Evidence:** OBSERVED

**Baseline requirement:** The approved component uses a coherent modern Calder supporting UI typography system across supporting copy, form labels/values, CTA, and selected-vehicle information.

**Observed v3:** `FIND YOUR FIT` now uses the correct modern/sans direction, but the description, labels, select values, `FIND WHEELS`, and selected-vehicle content still render in a visibly contrasting serif face.

**Discrepancy:** The mixed serif/sans system remains visible across primary interactive UI and materially affects brand fidelity and component cohesion.

**Measurable correction:** Keep the current v3 `FIND YOUR FIT` heading unchanged. Apply the approved Calder supporting sans/UI font token to:
- supporting description;
- selector labels;
- selector values;
- CTA label;
- `YOUR VEHICLE` eyebrow and vehicle value;
- fitment confirmation;
- `Change Vehicle`;
- `Reset`.

Preserve the current v3 sizes, weights, control dimensions, shell dimensions, spacing, and hierarchy. Only minor optical adjustment required by the font substitution is acceptable.

**Acceptance condition:** All three states use the approved coherent supporting UI type system without reintroducing geometry, wrapping, overflow, or alignment regressions.

## Non-material tolerance

The technical artwork is still substantially simpler/fainter than the approved reference, but the actual v2 defect—the broken/empty artwork container—is resolved. Because the remaining difference is decorative, low-contrast, and does not materially affect hierarchy, readability, interaction clarity, responsive usability, or the hero relationship, it does **not** justify another correction by itself.

Minor measurement differences in tabs, controls, and CTA are likewise within implementation tolerance.

## 6. NEXT STATE

**READY_FOR_IMPLEMENTATION_CORRECTION**

Use:

`docs/design/visual-inspector/qa/corrections/fitment/fitment.correction.v3.json`

`docs/design/visual-inspector/qa/corrections/fitment/fitment.correction.v3.md`

Preserve the successfully corrected v3 geometry. Do not reopen resolved v1/v2 items or redesign the component.
