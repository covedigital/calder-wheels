# Calder Visual Specification — Find Your Fit / Fitment Finder

## Source

- File: `calder-fitment-section-reference.png`
- Source dimensions: `2048 × 682`
- Component type: `SHARED / PREMIUM COMMERCE TOOL`
- Inspector: GPT-5.6 Sol
- Schema version: 1.0
- Governing contract: `calder-visual-inspector-v1.1.md`

## Component Summary

The approved component is a premium functional bridge between the cinematic homepage hero and product discovery. It is not a second hero. The desktop composition uses two attached search-method tabs above a single deep-navy technical shell. The shell is approximately a 76/24 finder/status split: the larger left region contains the FIND YOUR FIT heading, supporting copy, dependent selectors, CTA, and subtle engineering artwork; the right region holds persistent selected-vehicle context.

The reference preserves a restrained hierarchy: white and cool-gray typography dominate, bronze is limited to intentional emphasis and active/primary utility accents, and green appears only for positive fitment confirmation.

## Global / Context Layout

### Content Width
- Estimate: shell spans approximately `1904px` in the `2048px` reference.
- Relative width: approximately `92–93%` of the source viewport.
- Evidence: ESTIMATED
- Confidence: 0.84
- Constraint: align to the established Calder primary content container. Do **not** widen the global site container to fit this component.

### Horizontal Gutters
- Estimate: approximately `74px` each side.
- Tolerance: approximately `±8px`.
- Evidence: ESTIMATED
- Confidence: 0.90

### Hero Relationship
- The tab/navigation cap begins in the lower cinematic hero region and the dark panel bridges into the light content below.
- The fitment utility must remain visually subordinate to the hero through smaller headline scale, lower-contrast imagery, restrained bronze, and absence of a competing lifestyle photograph.
- Evidence: OBSERVED / VERIFIED_PROJECT_CONTEXT

### Elevation / Transition
- Main shell uses a thin muted outline, rounded outer corners, and a broad soft shadow over the light section below.
- Estimated outer radius: `16–18px`.
- Estimated shadow: approximately `0 18–32px 35–55px rgba(0,0,0,0.14–0.22)`.
- Evidence: ESTIMATED

---

## Component Bounds

**ID:** `calder-fitment-finder`

- Pixel bbox: `[74, 118, 1978, 580]`
- Normalized bbox: `[0.0361, 0.1730, 0.9658, 0.8504]`
- Includes tabs and main shell.
- Evidence: OBSERVED / ESTIMATED
- Confidence: 0.91

### Desktop Structure
- Tabs: attached above the shell.
- Main shell: finder region + selected-vehicle region.
- Finder/status split: approximately `76/24`.
- Main shell height excluding tabs: approximately `370–372px`.
- Total component height including tabs: approximately `462px`.
- Controls share a common bottom-row baseline.
- Technical artwork occupies otherwise empty upper-middle/right finder space without competing with text or controls.

---

## 1. Tab Navigation

**ID:** `fitment-tab-nav`

- Pixel bbox: `[74, 118, 798, 210]`
- Normalized bbox: `[0.0361, 0.1730, 0.3896, 0.3079]`
- Height: approximately `90–94px`
- Tabs: `By Vehicle`, `By Wheel Style`
- Evidence: OBSERVED / ESTIMATED
- Confidence: 0.90

### Active — By Vehicle
- Near-black/deep-navy surface.
- Bronze vehicle icon and bronze label.
- Restrained bronze lower indicator, approximately `2–3px`.
- Stronger contrast than inactive state.
- Rounded upper-left treatment and integrated lower edge.

### Inactive — By Wheel Style
- Slightly lighter/softer navy surface.
- Cool-gray wheel icon and label.
- No bronze lower indicator.

### Hover
- Increase text/icon contrast modestly.
- Do not add a large glow, unrelated color, or elaborate animation.
- Evidence: ASSUMPTION.

### Focus
- Provide a clearly visible keyboard focus indicator that does not rely on color alone.
- Preserve the active/inactive visual hierarchy.
- Evidence: ASSUMPTION / accessibility requirement.

### Relationship
Both tabs switch the search methodology inside one shared component. The shell, heading, technical artwork, CTA treatment, selected-vehicle region, and overall visual system remain consistent.

---

## 2. Find Your Fit Header

**ID:** `fitment-heading-group`

- Pixel bbox: `[128, 258, 690, 409]`
- Normalized bbox: `[0.0625, 0.3783, 0.3369, 0.5997]`
- Evidence: OBSERVED / ESTIMATED
- Confidence: 0.92

### Heading
- Content: `FIND YOUR FIT`
- Case: uppercase.
- Weight: approximately `700–800`.
- Estimated size: `52–58px`.
- Estimated line height: `0.98–1.08`.
- Primary color: near-white.
- `FIT`: restrained bronze, approximately `#D9A467`.
- Alignment: left.

### Supporting Copy
`Select your vehicle to see compatible wheels, real builds, and fitment details.`

- Cool-gray secondary text.
- Two-line wrap in reference.
- Maximum text width approximately `560–600px`.
- Heading-to-copy gap approximately `14–20px`.

### Hierarchy
The title is dominant inside the utility but must remain materially subordinate to the homepage `MADE WITH PRECISION` hero headline.

---

## 3. Technical Background Artwork

**ID:** `fitment-technical-art`

- Approximate bbox: `[655, 209, 1515, 478]`
- Normalized bbox: `[0.3198, 0.3065, 0.7397, 0.7009]`
- Evidence: OBSERVED / ESTIMATED
- Confidence: 0.86

### Treatment
- Technical wheel line-art centered in the upper-middle/right finder area.
- Contour/flow lines extend through the otherwise empty heading-side space.
- Small geometric/engineering details are intentionally sparse.
- Estimated effective opacity: approximately `8–22%`, varying by local line density.
- Dark navy fading suppresses the artwork behind text and controls.

### Invariant
This is background support, not a primary image. Do not substitute a large photographic vehicle image. It may be reduced, repositioned, or hidden at narrow widths when readability requires it.

---

## 4. By Vehicle State

The observed control sequence is:

`YEAR → MAKE → MODEL → TRIM → FIND WHEELS`

The dependency behavior is a functional requirement, but its technical implementation is not defined by this visual specification.

### Control System

Common styling:
- Label above each control.
- Label: uppercase, approximately `16–18px`, `600–700`, letter spacing roughly `0.08–0.12em`.
- Value: near-white, approximately `20–22px`, `600–700`.
- Control height: approximately `70–72px`.
- Background: softened deep navy/slate, approximately `#102431`.
- Border: approximately `2px` muted blue-gray, around `#4B606C`.
- Radius: approximately `8–10px`.
- Chevron aligned right.
- No prominent independent shadow.

Observed approximate control bounds:
- Year: `[128, 449, 331, 546]`
- Make: `[357, 449, 574, 546]`
- Model: `[599, 449, 817, 546]`
- Trim: `[843, 449, 1094, 546]`

The apparent widths vary slightly, with Trim wider to accommodate longer values.

### Disabled / Loading
Not directly shown. **ASSUMPTION:** preserve the same dimensions and label positions while visibly reducing interactivity/emphasis. Do not collapse dependent controls while data loads.

### Error
Not directly shown. **ASSUMPTION:** error treatment should remain within the Calder control system, retain adequate contrast, and avoid shifting the overall row unexpectedly.

---

## 5. By Wheel Style State

The expanded By Wheel Style state is not shown in the approved reference. All state-specific geometry below is therefore **ASSUMPTION** unless inherited directly from the observed control system.

Preserve the same:
- shell;
- title and supporting copy;
- technical artwork;
- form-control visual language;
- spacing rhythm;
- FIND WHEELS CTA;
- selected-vehicle region;
- visual hierarchy.

Conceptual criteria:
- `WHEEL TYPE`
- `DIAMETER`
- `FINISH`
- `STYLE`

Representative placeholders such as `All Types`, `All Diameters`, `All Finishes`, and `All Styles` are UX examples only and **must not** be treated as final production taxonomy.

### UNKNOWN_IMPLEMENTATION_DEPENDENCY
OpenCode/DeepSeek must determine the authoritative production source for each criterion. Potential sources include existing Shopify options, variants, metafields, metaobjects, tags, collection filters, Search & Discovery filters, Lumia filtering, or custom wheel data. This specification does not select among them.

The same unknown-dependency status applies separately to Wheel Type, Diameter, Finish, and Style.

---

## 6. FIND WHEELS CTA

**ID:** `fitment-find-wheels`

- Pixel bbox: `[1120, 465, 1487, 546]`
- Normalized bbox: `[0.5469, 0.6818, 0.7261, 0.8006]`
- Width: approximately `360–370px`
- Height: approximately `78–82px`
- Evidence: OBSERVED / ESTIMATED
- Confidence: 0.92

### Styling
- Near-black fill.
- Approximately `2px` restrained bronze border.
- Radius approximately `8–10px`.
- Uppercase `FIND WHEELS`.
- Typography approximately `18–21px`, weight `700`, tracking around `0.08–0.12em`.
- Near-white label.
- Right-facing arrow.
- Only a subtle warm edge lift; no dominant glow.

### States
- **Hover — ASSUMPTION:** modest bronze/contrast lift only.
- **Focus — ASSUMPTION:** clearly visible keyboard focus.
- **Disabled — ASSUMPTION:** preserve dimensions, reduce emphasis, clearly communicate unavailability.

The CTA completes either search path and remains primary inside the utility, but it should not become brighter/more dominant than the homepage's primary hero CTA system.

---

## 7. Selected Vehicle Panel

**ID:** `fitment-selected-vehicle`

- Pixel bbox: `[1520, 232, 1931, 556]`
- Normalized bbox: `[0.7422, 0.3402, 0.9429, 0.8152]`
- Approximate width: `400–420px`
- Evidence: OBSERVED / ESTIMATED
- Confidence: 0.93

### Structure
- Left vertical divider, approximately `1–2px`.
- Left inner padding approximately `54–58px`.
- `YOUR VEHICLE` eyebrow.
- `2026 BMW M4 Competition` as the primary vehicle value.
- Green check/status: `Fitment enabled across the site`.
- Muted horizontal separator.
- Lower action row: `Change Vehicle` and `Reset`, separated visually.

### Typography / Color
- Eyebrow: uppercase, approximately `16–18px`, cool gray.
- Vehicle name: approximately `25–29px`, weight `700`, near-white.
- Status/actions: approximately `18–20px`.
- Positive status green: approximately `#38E778`.
- Green is reserved for positive fitment confirmation.

### Image Rule
No vehicle photograph belongs in this region. Persistent vehicle context is communicated through typography and status.

### Change Vehicle
- Secondary action with refresh/change icon.
- Hover/focus may increase contrast.
- Exact behavioral effect is an `UNKNOWN_IMPLEMENTATION_DEPENDENCY`.

### Reset
- Secondary/tertiary action with trash/reset icon.
- Visually separated from Change Vehicle.
- Must not compete with FIND WHEELS.
- Exact reset scope is an `UNKNOWN_IMPLEMENTATION_DEPENDENCY`.

---

## 8. Persistent Vehicle Context

The phrase `Fitment enabled across the site` communicates persistent vehicle context.

### Requirement
When appropriate, the selected vehicle panel should remain available even when the customer changes from `By Vehicle` to `By Wheel Style`.

### UNKNOWN_IMPLEMENTATION_DEPENDENCY
The visual specification does not prescribe local storage, cookies, theme state, app state, session state, URL state, or any other persistence mechanism. OpenCode/DeepSeek must inspect the existing fitment architecture and preserve working behavior where possible.

---

## 9. Responsive Assumptions

> No approved dedicated tablet/mobile reference is supplied. Every item below is an **ASSUMPTION**.

### Tablet
- Finder/status columns may reorganize.
- Preserve hierarchy and avoid compressing four selects into unusably narrow controls.
- Selected vehicle may move beneath the finder if necessary.
- Confidence: 0.68.

### Mobile
Priority order:
1. Tabs
2. Find Your Fit heading/supporting copy
3. Inputs
4. Find Wheels
5. Selected vehicle status/actions

- Stack controls to full/near-full width.
- Avoid horizontal overflow.
- Preserve visible labels.
- Maintain practical touch targets, roughly `44px` minimum target size.
- Keep FIND WHEELS prominent.
- Keep Change Vehicle and Reset available.
- Reduce/reposition/hide decorative technical art when required for readability.
- Confidence: 0.82.

---

## 10. Accessibility / Interaction Requirements

- Semantic active/inactive tab state.
- Visible keyboard focus on tabs, controls, CTA, Change Vehicle, and Reset.
- Persistent visible form labels.
- Adequate text/control contrast.
- Disabled and loading states that remain legible.
- Selected states that do not rely solely on subtle color differences.
- Error states that are identifiable and do not destroy the layout.
- Practical touch targets on narrow screens.
- No decorative artwork may interfere with pointer or keyboard interaction.

---

## 11. Visual Invariants

These are implementation-preservation requirements:

- Premium Calder appearance.
- Dark navy/near-black technical shell.
- `FIND YOUR FIT` title.
- Bronze emphasis restricted to `FIT` and other intentional accents.
- `By Vehicle / By Wheel Style` navigation.
- Consistent form-control system across both search methods.
- Dark FIND WHEELS CTA with restrained bronze accent.
- Subtle technical wheel/engineering artwork.
- Dedicated selected-vehicle context.
- Green positive fitment confirmation only.
- Clear Change Vehicle / Reset actions.
- No redundant vehicle photograph in selected-vehicle state.
- Visual subordination to the homepage hero.
- Component alignment to the existing site container.
- Unified component shell rather than two unrelated tab components.

---

## 12. Optional / Conditional Elements

### Optional
- Decorative technical artwork may be simplified or hidden at narrow widths when needed for legibility.

### Conditional
- Selected-vehicle content is populated only when a vehicle context exists.
- Empty/no-vehicle state is not shown in the reference and must not fabricate vehicle data.
- Disabled/loading/error visual states are required when functionality produces those conditions, but their exact appearance is not directly observed.

---

## 13. Shopify / Data Dependencies

All items below are `UNKNOWN_IMPLEMENTATION_DEPENDENCY` until OpenCode/DeepSeek audits the working theme:

- Existing fitment implementation/provider.
- Year/Make/Model/Trim dependency mechanism.
- Wheel Type authoritative data source.
- Diameter authoritative data source.
- Finish authoritative data source.
- Style authoritative data source.
- Shopify product option/variant/metafield/metaobject/tag/filter architecture.
- Search & Discovery/Lumia filtering relationship.
- Existing custom wheel data.
- Selected vehicle persistence/storage mechanism.
- Change Vehicle workflow.
- Reset behavior/scope.
- Existing section/snippet architecture.
- JavaScript framework or theme behavior.
- App integrations.

Do not hard-code conceptual wheel-style examples as Calder's final taxonomy.

---

## 14. Implementation Boundary

The Visual Inspector defines **what** the component should look like. OpenCode/DeepSeek determines **how** it integrates into Shopify.

Required implementation-side priority:

`REUSE → RESTYLE → EXTEND → CREATE`

Before creating or replacing anything, the implementation agent must audit the existing equivalent, verify whether it works, preserve existing data bindings/behavior where practical, and avoid unrelated refactors.

Visual mismatch alone is not permission to replace working functionality.

---

## 15. Implementation-Agent Verification Requirements

OpenCode/DeepSeek must verify:

- the existing fitment component(s) and their files/dependencies;
- current Year/Make/Model/Trim data flow;
- whether selected vehicle context already persists site-wide;
- the actual store taxonomy/data backing By Wheel Style;
- whether current Lumia controls can be restyled or extended;
- Change Vehicle and Reset behavior before changing either;
- existing theme/container width and spacing tokens;
- approved Calder font/color tokens rather than treating screenshot estimates as exact tokens;
- responsive behavior against established Lumia/Calder patterns;
- that the fitment implementation does not create regressions in accepted shared components.

For each requirement, classify the implementation action as `REUSE`, `RESTYLE`, `EXTEND`, or `CREATE`.

---

## 16. Uncertainties

### By Wheel Style Geometry
- Unknown: expanded state is not visible.
- Resolution: inherit the observed control system; treat criterion-specific widths/options as assumptions until implementation/render QA.

### Exact Font Tokens
- Unknown: screenshot does not prove exact source font family/token.
- Resolution: use approved Calder brand/theme assets and reproduce the observed hierarchy.

### Exact Color Tokens
- Unknown: screenshot-derived HEX values are estimates.
- Resolution: prefer approved Calder brand/theme tokens when they reproduce the observed relationships.

### Responsive Breakpoints
- Unknown: no approved mobile/tablet screenshots.
- Resolution: follow established theme/Calder patterns and validate at project test widths.

### Persistence Architecture
- Unknown: not visible.
- Resolution: inspect existing fitment architecture before implementation.

### Full Homepage Context
- Unknown in this inspection package: the supplied image includes the lower hero relationship but not a separately inspectable full homepage screenshot.
- Resolution: implementation should cross-check the accepted homepage visual spec/current approved homepage before finalizing overlap and section spacing.

---

## Inspection Summary

### Highest-confidence findings
- Unified tab + dark-shell structure.
- Approximate desktop shell bounds and finder/status proportions.
- Restrained bronze usage.
- Four By Vehicle selectors and dark bronze-accent CTA.
- Low-contrast technical wheel artwork.
- Dedicated selected-vehicle region with green confirmation.
- No second vehicle photograph.
- Functional visual subordination to the hero.

### Lower-confidence findings
- Exact color/font source tokens.
- Hover/focus/disabled/error styling.
- By Wheel Style state-specific control widths.
- Tablet/mobile restructuring.
- Exact live-page overlap with the full homepage.

### Critical relationships to preserve
- Hero → premium utility → product discovery hierarchy.
- Tabs and panel read as one component.
- Technical artwork remains background support.
- FIND WHEELS remains primary within the utility.
- Selected vehicle context remains visually distinct but not dominant.
- Bronze remains restrained; green remains confirmation-only.
- Existing working fitment behavior is preserved wherever practical.
