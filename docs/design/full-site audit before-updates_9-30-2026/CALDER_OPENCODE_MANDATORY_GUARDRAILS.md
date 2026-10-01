# CALDER WHEELS — OPENCODE MANDATORY GUARDRAILS

**Document:** `CALDER_OPENCODE_MANDATORY_GUARDRAILS.md`  
**Status:** MANDATORY / GOVERNING  
**Applies to:** Every OpenCode implementation, correction, refactor, and visual-fidelity prompt until the presentation is complete.  
**Project:** Calder Wheels — Shopify / Lumia Theme  
**Primary objective:** Reach presentation quality with minimum regression risk and minimum unnecessary correction cycles.

---

## 0. MANDATORY INSTRUCTION — READ BEFORE EXECUTION

This document is a **governing constraint file** and MUST be applied in conjunction with every OpenCode prompt.

OpenCode MUST treat the instructions in this file as persistent project-level constraints, even when the accompanying task prompt does not repeat them.

### Precedence

If an accompanying OpenCode prompt conflicts with this document:

1. **STOP before executing the conflicting instruction.**
2. Identify the conflict explicitly.
3. Preserve protected functionality and locked pages/components.
4. Do not infer permission to override a protection.
5. Require an explicit instruction that names the protected file/component/functionality and explicitly authorizes the exception.

Silence is **not** authorization.

A request to "match the mockup," "make it pixel perfect," "clean up the page," "refactor," or "fix the layout" does **not** authorize functional rewrites or edits outside the stated scope.

---

# 1. CORE OPERATING PRINCIPLE

## VISUAL CORRECTION ≠ FUNCTIONAL REWRITE

The Calder Wheels presentation sprint is a **controlled visual-alignment exercise**, not a general architecture rewrite.

OpenCode MUST prefer the smallest safe change that satisfies the stated visual acceptance criteria.

### Required priority order

1. Preserve working functionality.
2. Preserve existing data bindings and Shopify behavior.
3. Preserve shared/global consistency.
4. Correct presentation-blocking visual discrepancies.
5. Stop when presentation acceptance is reached.

Do **not** perform opportunistic refactors, abstractions, cleanup, dependency replacement, DOM reconstruction, or unrelated code modernization unless explicitly requested.

---

# 2. PROTECTED FUNCTIONALITY — DO NOT TOUCH

The following functionality is protected by default.

## DO NOT rewrite, replace, remove, bypass, rename, or re-architect:

- Fitment API integration
- `fitment-finder.js`
- `CALDER_FITMENT_API`
- `window.__fitmentData`
- localStorage vehicle / fitment state
- Existing vehicle-selection persistence
- Existing fitment data flow
- Build Your Wheel behavior
- Build Your Wheel configuration state
- Shopify variant selection logic
- Shopify product data bindings
- Shopify product-form submission behavior
- Shopify cart behavior
- Shopify cart line-item behavior
- Shopify quantity behavior
- Lumia product form
- Lumia product-form JavaScript behavior
- Header navigation behavior
- Mobile navigation behavior
- Existing working Shopify routes and URLs
- Existing working Liquid data bindings
- Existing functional event listeners unless the task explicitly targets that behavior

### Visual modifications are permitted only where explicitly requested.

Examples of permitted visual changes when in scope:

- typography
- colors
- spacing
- borders
- backgrounds
- visual hierarchy
- width / max-width
- grid/flex presentation
- responsive visual layout
- image sizing / positioning
- button appearance
- component proportions

### Functional rewrites are prohibited unless explicitly authorized.

If a visual requirement appears to require a functional rewrite, OpenCode MUST stop and report the dependency instead of silently rewriting the functionality.

---

# 3. PROTECTED FILES / COMPONENTS RULE

Every implementation prompt MUST identify the files and components it is allowed to modify.

Anything outside that declared scope is **read-only by default**.

Before modifying a file, OpenCode MUST classify it as one of:

- `AUTHORIZED_EDIT`
- `AUTHORIZED_VISUAL_ONLY`
- `READ_ONLY_REFERENCE`
- `PROTECTED_FUNCTIONAL`
- `PRESENTATION_LOCKED`
- `USER_MANAGED`
- `DEFERRED`

OpenCode MUST NOT edit a file classified as `READ_ONLY_REFERENCE`, `PROTECTED_FUNCTIONAL`, `PRESENTATION_LOCKED`, `USER_MANAGED`, or `DEFERRED` unless the current task explicitly changes that classification.

### Existing protected implementation examples

Treat these as protected unless the task explicitly grants scoped permission:

- `fitment-finder.js`
- fitment API/data initialization code
- Build Your Wheel functional JavaScript
- Shopify/Lumia product-form logic
- cart functional logic
- variant-selection logic
- navigation behavior

CSS associated with a protected component may be edited **only when the task explicitly requests a visual correction to that component** and the change does not alter behavior.

---

# 4. GLOBAL VS PAGE VS COMPONENT CHANGES

Before applying any correction, determine the proper ownership level.

Classify each discrepancy as:

- `GLOBAL`
- `PAGE`
- `COMPONENT`
- `CONTENT`
- `FUNCTIONAL`
- `USER_MANAGED`
- `DEFERRED`

### Rule

If the same discrepancy exists across multiple pages, OpenCode MUST first determine whether the cause is a global/shared rule.

Do **not** patch a global problem independently on multiple pages.

Examples of likely global/shared concerns:

- container width
- Facundo heading system
- Garet UI typography
- brand colors
- gold labels / eyebrows
- button styling
- form-field styling
- section spacing conventions
- header appearance
- footer appearance
- navy / cream surface system

If a global rule is responsible, correct the global/shared source once rather than introducing page-local overrides.

### Anti-fragmentation rule

OpenCode MUST NOT create a new page-specific override merely because it is faster if an existing shared rule is the actual source of the discrepancy.

Conversely, OpenCode MUST NOT modify a global rule to solve a discrepancy that belongs only to one page/component.

---

# 5. REQUIRED CORRECTION FORMAT

OpenCode corrections MUST be machine-like, bounded, and individually testable.

Broad instructions such as:

> "Make this page pixel perfect."

are insufficient by themselves and MUST be decomposed into bounded corrections before implementation.

Every correction item SHOULD contain the following fields:

```text
ID:

CLASSIFICATION:
GLOBAL | PAGE | COMPONENT | CONTENT | FUNCTIONAL | USER_MANAGED | DEFERRED

SEVERITY:
P0 | P1 | P2 | P3

FILE:
Exact file path.

SELECTOR / COMPONENT:
Exact CSS selector, Liquid block, section, snippet, or JS component.

CURRENT PROBLEM:
Objective description of the current discrepancy.

EXPECTED RESULT:
Objective description of the desired state.

CHANGE TYPE:
Typography | Color | Spacing | Layout | Sizing | Imagery | Content | Responsive | Other

TARGET / SPECIFICATION:
Concrete values or bounded implementation direction where known.

REFERENCE:
Approved mockup, governing design-system file, homepage authority, screenshot, or audit item.

DO NOT MODIFY:
Explicitly list DOM, Liquid, JS, data bindings, adjacent components, or functionality that must remain unchanged.

ACCEPTANCE TEST:
Observable condition that determines whether this correction passes.
```

### Example

```text
ID:
PDP-TYPE-001

CLASSIFICATION:
PAGE

SEVERITY:
P1

FILE:
assets/calder-product.css

SELECTOR / COMPONENT:
.calder-product__title

CURRENT PROBLEM:
Product heading renders approximately 48px and uses Garet.

EXPECTED RESULT:
Product title matches the approved PDP heading hierarchy.

CHANGE TYPE:
Typography only.

TARGET / SPECIFICATION:
Font family: Facundo
Desktop size: 36px
Text transform: uppercase
Line-height: 1.05

REFERENCE:
Approved Product Page mockup + Calder cross-page heading system.

DO NOT MODIFY:
DOM structure
Product title Liquid
Product data binding
Product-form logic
Variant logic

ACCEPTANCE TEST:
Product heading visually aligns with the approved mockup and the product remains fully data-bound and functional.
```

---

# 6. CHANGE MINIMIZATION RULE

For every correction, OpenCode MUST implement the **smallest viable change**.

Preferred order:

1. Modify an existing appropriate rule.
2. Correct the shared source if the issue is truly global.
3. Add a narrowly scoped rule only when necessary.
4. Avoid `!important` unless required to resolve a verified cascade conflict and there is no cleaner safe option during the presentation sprint.
5. Avoid DOM changes for problems solvable with CSS.
6. Avoid JavaScript changes for problems solvable with CSS/Liquid presentation.
7. Avoid Liquid changes for problems solvable with CSS.

Do not duplicate styles unnecessarily.

Do not create parallel implementations of existing components.

Do not replace working components solely to make visual correction easier.

---

# 7. VISUAL QA IS A GATE — NOT AN ENDLESS DEVELOPMENT LOOP

The required presentation pipeline is:

```text
APPROVED MOCKUPS
      │
      ▼
CROSS-PAGE AUDIT
      │
      ▼
DESIGN-SYSTEM FIXES
      │
      ▼
PAGE CORRECTIONS
      │
      ▼
OPENCODE
      │
      ▼
SHOPIFY RENDER
      │
      ▼
SOL VISUAL QA
      │
      ├── PASS
      │
      └── BLOCKERS ONLY
```

Visual QA is intended to answer:

> Is this page presentation-ready without visible blockers or functional regressions?

It is **not** permission to restart broad development or repeatedly polish inconsequential differences.

After initial correction, subsequent iterations MUST address only:

- unresolved P0 issues
- unresolved P1 issues that materially affect presentation fidelity
- regressions introduced by the previous correction
- explicit user-requested changes

P2/P3 items should not automatically trigger another correction cycle during the presentation sprint.

---

# 8. PAGE STATE MACHINE

Use the following states:

```text
NOT_INSPECTED
SPEC_CREATED
READY_FOR_IMPLEMENTATION
IMPLEMENTING
READY_FOR_VISUAL_QA
REVISION_REQUIRED
READY_FOR_HIGH_FIDELITY_CORRECTION
ACCEPTED
PRESENTATION_LOCKED
```

## PRESENTATION_LOCKED

Once a page reaches presentation quality and is approved:

```text
ACCEPTED
   ↓
PRESENTATION_LOCKED
```

A `PRESENTATION_LOCKED` page MUST NOT be modified by OpenCode unless:

1. a regression is discovered that affects presentation or functionality, or
2. the user explicitly unlocks that page/component for a named change.

### Cross-page work must respect locks

A global/shared change that could affect a `PRESENTATION_LOCKED` page MUST be treated as regression-sensitive.

Before making such a change, OpenCode MUST:

- identify the locked pages potentially affected;
- minimize the blast radius;
- avoid the global change if a safer architecture-consistent solution exists; and
- require regression verification on affected locked pages.

Do not casually reopen completed pages for polish.

---

# 9. PRESENTATION ACCEPTANCE — DEFINITION OF "PIXEL PERFECT"

For this sprint, "pixel perfect" means **high visual fidelity at presentation level**, not literal screenshot equality at every pixel.

## MUST MATCH

The implementation must substantially match the approved design in:

- overall composition
- brand color system
- typography hierarchy
- major spacing rhythm
- container alignment
- primary imagery
- header
- footer
- component proportions
- CTA styling
- section order
- dominant page silhouette
- major desktop layout
- major responsive behavior visible during presentation

## ACCEPTABLE TOLERANCE

The following do **not** automatically block presentation acceptance:

- approximately 2–8px spacing differences
- tiny line-height differences
- minor icon differences
- small responsive deviations that do not break composition
- subtle anti-aliasing / browser rendering differences
- non-visible implementation differences
- insignificant text wrapping differences caused by browser/font rendering

## NOT ACCEPTABLE

The following are presentation blockers or high-priority discrepancies:

- wrong brand colors
- wrong heading/UI fonts
- missing major sections
- obviously incorrect component proportions
- broken grids
- overflowing or clipped major components
- broken fitment
- broken Build Your Wheel/configurator
- broken Shopify product form
- broken variant selection
- broken cart behavior
- inconsistent header/footer across presentation pages
- visibly different product-page composition
- major container misalignment
- incorrect section order
- major imagery mismatch when imagery is part of the approved presentation design
- desktop/mobile layout failure visible in the presentation viewport

---

# 10. SEVERITY RULES

Use the following presentation severity model:

### P0 — PRESENTATION BLOCKER

Examples:

- functionality broken
- page unusable
- critical section missing
- major layout collapse
- fitment/configurator/cart/product form broken
- major JavaScript error affecting the page

P0 MUST be corrected before presentation lock.

### P1 — HIGHLY VISIBLE DISCREPANCY

Examples:

- wrong color system
- wrong typography system
- major spacing/proportion error
- incorrect header/footer presentation
- visibly incorrect page composition
- large grid/alignment discrepancy

P1 SHOULD be corrected before presentation lock when materially visible.

### P2 — POLISH ISSUE

Examples:

- small spacing discrepancy
- minor border/radius difference
- minor icon discrepancy
- small line-height mismatch

P2 does not automatically justify another correction cycle.

### P3 — POST-PRESENTATION IMPROVEMENT

Examples:

- code cleanup
- low-visibility responsive refinement
- architecture improvement
- minor consistency improvement
- non-presentation optimization

P3 MUST be deferred unless explicitly requested.

---

# 11. USER-MANAGED AND DEFERRED ITEMS

If an item has been classified as `USER_MANAGED`, OpenCode MUST NOT modify it.

If an item has been classified as `DEFERRED`, OpenCode MUST NOT spend implementation time or LLM effort on it during the presentation sprint.

Do not repeatedly report a known `USER_MANAGED` or `DEFERRED` item as a new blocker unless it causes a new functional regression.

---

# 12. FUNCTIONAL REGRESSION POLICY

After any visual correction, verify that the touched area has not broken relevant existing functionality.

At minimum, where applicable, preserve:

- fitment interaction
- fitment state
- vehicle persistence
- Build Your Wheel interaction
- variant selection
- quantity controls
- add-to-cart
- cart line items
- product-form submission
- navigation
- responsive menu behavior
- Shopify dynamic data output

A visual improvement that breaks functionality is a failed correction.

If a correction creates a regression, restore the functional behavior before declaring the task complete.

---

# 13. NO UNREQUESTED REFACTORING

Until the presentation is complete, OpenCode MUST NOT perform unrelated refactors.

Prohibited without explicit authorization:

- renaming classes across the theme
- reorganizing unrelated CSS
- replacing existing JavaScript architecture
- replacing existing Liquid component architecture
- changing Shopify schema unnecessarily
- changing working IDs/data attributes used by JavaScript
- consolidating files merely for cleanliness
- changing API contracts
- changing storage keys
- changing global selectors unrelated to the task
- removing code because it appears unused without proving it is safe
- introducing a new framework/library
- redesigning working components beyond the approved mockup

Presentation stability has priority over architectural elegance.

---

# 14. DOM / LIQUID / JS SAFETY

When a correction is visual-only:

### DOM

Preserve DOM structure unless the correction explicitly requires structural change.

### Liquid

Preserve:

- variables
- product objects
- variant objects
- form bindings
- section settings
- block settings
- routes
- dynamic output

### JavaScript

Do not alter JavaScript for visual-only corrections unless absolutely required and explicitly authorized.

Never rename/remove selectors, IDs, data attributes, globals, or events used by working functionality without explicit permission.

---

# 15. CSS SAFETY

Before adding CSS, inspect existing ownership and cascade.

OpenCode SHOULD:

- reuse Calder design tokens where available;
- reuse existing shared typography and spacing systems;
- keep selectors scoped appropriately;
- avoid unnecessarily high specificity;
- avoid global element selectors for page-specific fixes;
- avoid duplicate conflicting definitions;
- preserve responsive behavior outside the target viewport;
- distinguish global corrections from page-local corrections.

A page-specific visual correction MUST NOT silently change unrelated pages.

---

# 16. APPROVED DESIGN AUTHORITY

When determining the expected visual result, use this authority order unless the task explicitly specifies otherwise:

1. Explicit instruction in the current task
2. Approved page mockup for the target page
3. Calder cross-page design-system audit / approved design-system rules
4. Approved Homepage as cross-page brand authority
5. Existing approved shared Calder components
6. Current implementation where no approved visual reference exists
7. Lumia defaults only where Calder has not established a replacement

Do not invent a new visual language when an approved Calder pattern already exists.

---

# 17. REQUIRED PRE-EDIT CHECK

Before editing, OpenCode MUST internally determine:

```text
TARGET PAGE / COMPONENT:

CURRENT STATE:

REQUESTED CHANGE:

AUTHORIZED FILES:

PROTECTED FILES / FUNCTIONALITY:

PRESENTATION_LOCKED AREAS:

USER_MANAGED ITEMS:

GLOBAL IMPACT RISK:

FUNCTIONAL REGRESSION RISK:

SMALLEST SAFE IMPLEMENTATION:
```

If the requested change cannot be completed without touching a protected area, stop and report that dependency.

---

# 18. REQUIRED POST-EDIT REPORT

Every OpenCode implementation/correction response MUST conclude with a concise report containing:

```text
IMPLEMENTATION STATUS:
COMPLETE | PARTIAL | BLOCKED

FILES MODIFIED:
- exact paths

CORRECTIONS COMPLETED:
- IDs

FUNCTIONAL FILES MODIFIED:
- NONE
or explicit authorized files

PROTECTED FUNCTIONALITY STATUS:
- UNCHANGED
or explain authorized exception

PRESENTATION_LOCKED AREAS TOUCHED:
- NONE
or explicit authorized exception

REGRESSION CHECK:
- relevant checks performed

REMAINING P0/P1 ITEMS:
- list only presentation-relevant blockers

P2/P3 ITEMS:
- DEFERRED unless explicitly requested

NEXT STATE:
READY_FOR_VISUAL_QA | REVISION_REQUIRED | ACCEPTED | PRESENTATION_LOCKED
```

Do not claim `ACCEPTED` or `PRESENTATION_LOCKED` solely because code was changed. Those states require the appropriate visual QA/approval gate.

---

# 19. STOP CONDITIONS

OpenCode MUST stop instead of improvising when:

- the requested change conflicts with protected functionality;
- the task would require modifying a `PRESENTATION_LOCKED` page without explicit authorization;
- the approved mockup and current task directly conflict in a way that changes architecture/functionality;
- required reference material is missing and guessing would create significant visual or functional risk;
- a global change could regress locked pages and the impact cannot be safely bounded;
- the correction requires replacing working fitment, configurator, Shopify product, cart, or navigation behavior;
- the requested visual result cannot be achieved safely within the authorized files.

When blocked, identify the exact dependency and the minimum authorization/information required to proceed.

---

# 20. PRESENTATION SPRINT OPTIMIZATION

The goal is not maximum code activity. The goal is maximum visible presentation improvement per correction while preserving stability.

During this sprint:

### Prioritize

- P0 blockers
- highly visible P1 discrepancies
- global fixes that safely correct multiple unlocked pages
- Product Page presentation fidelity
- consistent cross-page header/footer/design system
- stable Home / Collection / Product / Cart presentation flow

### Deprioritize

- invisible code differences
- P2 micro-polish after acceptance
- P3 refactors
- speculative improvements
- features not required for the presentation
- repeated corrections to already acceptable components

Once a page is presentation-ready: **LOCK IT AND MOVE ON.**

---

# 21. MANDATORY EXECUTION DIRECTIVE

For every OpenCode task executed with this file:

> **Preserve functionality. Respect scope. Make bounded corrections. Fix global causes globally and page causes locally. Do not modify protected or locked areas. Use approved mockups and the Calder design system as visual authority. Stop iterating once presentation acceptance is achieved.**

The success criterion is not literal screenshot equality.

The success criterion is a **cohesive, stable, presentation-ready Calder Wheels experience across Home, Collection, Product, and Cart without introducing regressions.**

---

## END OF MANDATORY GUARDRAILS

**This file must remain attached/referenced for all OpenCode prompts through the presentation sprint.**
