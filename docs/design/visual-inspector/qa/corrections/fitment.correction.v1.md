# Calder Find Your Fit — Visual QA Correction v1

## Final Status

**REVISION_REQUIRED**

The implementation is recognizable, and the mobile ordering is broadly sound, but desktop materially diverges from the approved component. The main problem is **under-scaling/compression**, not excessive dominance: the fitment utility does **not** compete with the hero.

By Wheel Style also contains two visible defects: an empty/broken-looking technical-art region and duplicated selected-vehicle text.

## Severity Summary

- CRITICAL: 0
- HIGH: 6
- MEDIUM: 5
- LOW: 1

## Hero Hierarchy

The intended `HERO → PREMIUM FITMENT UTILITY → PRODUCT DISCOVERY` hierarchy remains intact. Preserve the restrained bronze/green treatment while restoring the approved desktop scale.

## Corrections

### FIT-QA-001 — HIGH
**States:** DESKTOP_BY_VEHICLE, DESKTOP_BY_WHEEL_STYLE  
**Evidence:** ESTIMATED

**Baseline:** Desktop shell approximately 92–93% of 2048px reference / ~1904px, aligned to established Calder container.

**Observed:** Shell is roughly 1440px / ~70% viewport.

**Discrepancy:** Desktop component is ~450–470px too narrow, compressing all internal proportions.

**Correction:** Restore established Calder container relationship; at 2048px QA width target ~1900px shell / ~74px gutters unless verified accepted container token differs. Do not create a new global container.

### FIT-QA-002 — HIGH
**States:** DESKTOP_BY_VEHICLE, DESKTOP_BY_WHEEL_STYLE  
**Evidence:** ESTIMATED

**Baseline:** Tabs approximately 90–94px high with substantial attached premium cap geometry.

**Observed:** Tabs are approximately 43–45px high and compact.

**Discrepancy:** Tabs are materially underscaled.

**Correction:** Increase desktop tabs toward 88–94px height and restore proportional horizontal padding/width; preserve active bronze indicator and inactive cool-gray state.

### FIT-QA-003 — HIGH
**States:** DESKTOP_BY_VEHICLE, DESKTOP_BY_WHEEL_STYLE  
**Evidence:** ESTIMATED

**Baseline:** Main shell approximately 370–372px excluding tabs; ~462px including tabs.

**Observed:** Main shell approximately 275–300px.

**Discrepancy:** Vertical composition is compressed and loses intentional negative space.

**Correction:** Increase shell toward ~370px excluding tabs; restore top/bottom padding and header-to-control breathing room rather than merely stretching controls.

### FIT-QA-004 — HIGH
**States:** ALL  
**Evidence:** VISUAL_OBSERVATION + ESTIMATED

**Baseline:** FIND YOUR FIT uses approved Calder typography, ~52–58px desktop, 700–800 visual weight; supporting UI uses approved supporting typography.

**Observed:** Heading and much UI appear in a different high-contrast serif/display treatment; desktop heading ~47–50px.

**Discrepancy:** Typography materially changes the approved premium technical character.

**Correction:** Use approved Calder/theme font tokens; target ~52–58px desktop heading with tight ~1.0 line height, white FIND YOUR and bronze FIT; correct labels/selects/status/actions to approved supporting typography.

### FIT-QA-005 — HIGH
**States:** DESKTOP_BY_VEHICLE, DESKTOP_BY_WHEEL_STYLE  
**Evidence:** OBSERVED + ESTIMATED

**Baseline:** Shared low-contrast wheel technical drawing plus contour/flow detail at ~8–22% effective opacity.

**Observed:** By Vehicle artwork is barely visible; By Wheel Style shows a large empty/broken-looking rectangular image region.

**Discrepancy:** Approved technical artwork is not reproduced consistently and Wheel Style exposes an apparent asset/container failure.

**Correction:** Restore one shared decorative technical-art layer in both modes; remove visible empty/broken image box; position wheel upper-middle/right with subdued contour detail and navy fade.

### FIT-QA-006 — MEDIUM
**States:** DESKTOP_BY_VEHICLE, DESKTOP_BY_WHEEL_STYLE  
**Evidence:** ESTIMATED

**Baseline:** Desktop selects approximately 70–72px high with consistent labels, values, borders and alignment.

**Observed:** Controls approximately 55–57px high.

**Discrepancy:** Selectors are materially smaller/denser than baseline.

**Correction:** Increase desktop selects to ~70–72px and scale padding/value typography accordingly; use same dimensions for Wheel Type/Diameter/Finish/Style.

### FIT-QA-007 — MEDIUM
**States:** DESKTOP_BY_VEHICLE, DESKTOP_BY_WHEEL_STYLE  
**Evidence:** ESTIMATED

**Baseline:** FIND WHEELS approximately 360–370px × 78–82px at reference desktop scale.

**Observed:** CTA approximately 190px × 55px.

**Discrepancy:** Primary action is significantly undersized.

**Correction:** Increase CTA toward 360–370px × 78–82px at reference scale, preserving near-black fill, restrained ~2px bronze border, 8–10px radius and arrow.

### FIT-QA-008 — HIGH
**States:** DESKTOP_BY_VEHICLE, DESKTOP_BY_WHEEL_STYLE  
**Evidence:** OBSERVED + ESTIMATED

**Baseline:** Selected-vehicle region roughly rightmost 23–24%, ~400–420px at reference scale, with generous padding, strong vehicle typography, status and separated lower actions.

**Observed:** Region is ~230px wide and compressed; Wheel Style visibly duplicates/concatenates the vehicle name.

**Discrepancy:** Status panel proportions diverge and Wheel Style has a content-rendering defect.

**Correction:** Restore ~76/24 finder/status relationship as shell expands, targeting ~400–420px status width at 2048px reference scale; restore padding/typography and fix duplicate vehicle name so it appears once.

### FIT-QA-009 — MEDIUM
**States:** DESKTOP_BY_VEHICLE, DESKTOP_BY_WHEEL_STYLE  
**Evidence:** ESTIMATED

**Baseline:** Thin outline, ~16–18px radius and broad soft shadow into light content.

**Observed:** Radius/outline present but elevation is weak.

**Discrepancy:** Bottom transition reads flatter than approved.

**Correction:** Preserve border/radius and strengthen only broad soft bottom elevation toward ~18–32px offset / 35–55px blur / low-opacity black; no hard/glowing shadow.

### FIT-QA-010 — MEDIUM
**States:** ALL  
**Evidence:** OBSERVED

**Baseline:** Approved composition contains intentional negative space and no Popular Searches row.

**Observed:** Popular Searches links appear beneath controls.

**Discrepancy:** Unapproved visual element consumes approved spacing.

**Correction:** Remove Popular Searches from this component for visual conformance unless independently approved as a required feature.

### FIT-QA-011 — MEDIUM
**States:** MOBILE  
**Evidence:** OBSERVED + ASSUMPTION

**Baseline:** Mobile priority: tabs → heading/copy → inputs → CTA → selected vehicle; near/full-width practical controls, no overflow, ~44px+ touch targets; artwork may be hidden.

**Observed:** Ordering, 2×2 controls, CTA and no-overflow behavior are broadly sound; artwork is suppressed. Typography remains mismatched and selected-vehicle area is dense.

**Discrepancy:** Core mobile structure conforms to assumptions; shared typography/status spacing still diverge.

**Correction:** Retain mobile structural approach and 2×2 grid. Correct typography, preserve ~44px+ targets, and add sufficient selected-vehicle padding/readability. Do not restore art if it harms readability.

### FIT-QA-012 — LOW
**States:** ALL  
**Evidence:** OBSERVED

**Baseline:** Bronze restrained, green confirmation-only, fitment visually subordinate to hero.

**Observed:** Color hierarchy is broadly compliant and fitment does not overpower hero.

**Discrepancy:** No major hierarchy failure; desktop is under-scaled rather than over-dominant.

**Correction:** Preserve restrained colors while correcting dimensions; do not add brightness, glow or decorative dominance.

## OpenCode Priority

1. Restore desktop shell/container width (`FIT-QA-001`).
2. Restore shell height/negative space (`FIT-QA-003`).
3. Restore tab scale (`FIT-QA-002`).
4. Correct component typography (`FIT-QA-004`).
5. Restore technical artwork/remove broken artwork region (`FIT-QA-005`).
6. Restore selected-vehicle proportions and fix duplicated Wheel Style vehicle text (`FIT-QA-008`).
7. Normalize selector dimensions (`FIT-QA-006`).
8. Restore CTA dimensions (`FIT-QA-007`).
9. Remove unapproved Popular Searches row for conformance (`FIT-QA-010`).
10. Refine elevation (`FIT-QA-009`).
11. Retain mobile structure while correcting typography/status spacing (`FIT-QA-011`).
12. Preserve restrained color/hero hierarchy (`FIT-QA-012`).

## Implementation Boundary

No Shopify code, CSS, taxonomy, data-source, fitment-architecture, or persistence changes are prescribed here. Preserve working functionality and continue using `REUSE → RESTYLE → EXTEND → CREATE`.

# REVISION_REQUIRED