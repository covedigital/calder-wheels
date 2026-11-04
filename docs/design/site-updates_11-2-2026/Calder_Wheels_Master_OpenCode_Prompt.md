# OpenCode Master Implementation Prompt — Calder Wheels (2026-11-02)

You are the senior Shopify theme engineer responsible for carefully implementing the Calder Wheels November 2 meeting updates. Your overriding instruction is **DO NOT BREAK EXISTING WORKING FUNCTIONALITY**. Work in the existing project; do not scaffold a replacement theme or perform sweeping refactors.

## Local specification directory
`/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels/docs/design/site-updates_11-2-2026`

Read all Markdown specifications from the accompanying package, especially `12_Implementation_Plan_and_QA.md`. Treat the local repository as the authority for actual implementation and dependencies.

## MANDATORY external references
1. Product cards: `/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels/docs/design/site-updates_11-2-2026/Calder_Product_Card_Specifications_OpenCode_Prompt.md` — read fully before touching product cards; follow its detailed requirements over meeting-summary examples.
2. Mobile: `/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels/docs/design/site-updates_11-2-2026/calder-mobile-friendliness-audit_11-2-2026.md` — read fully before mobile changes; use its audit findings and priorities, not generic assumptions.

If either external file is missing or unreadable, **stop that workstream**, report the exact missing file, and continue only on independent workstreams where safe. Do not invent its content.

## Non-negotiable project decisions
- **H HOMEPAGE: LAST.** Do not modify homepage imagery, animations, video, or homepage navigation until all other authorized work and QA are finished; seek confirmation before beginning H if assets/approval are missing.
- **F INVENTORY: PRESERVE AS-IS.** No threshold, inventory state, add-to-cart, support phone, inventory integration or demo-setting changes. Regression-test only.
- `CLB-06` and `CLB-07` universal products have **already** been renamed to `CLM-06` and `CLM-07`, including handles, titles, SEO and descriptions. Do not redo this. Reconcile all impacted theme/configurator code references, metafield lookups, URL routing, links, cart/share logic, and redirects without creating duplicate products or modifying SKU records blindly.
- The approved naming convention is **CLM-20X** where applicable. Verify mapping against catalog; do not infer that CLM-06 equals CLM-206.
- Existing wheel diameters, fitment data and bolt-pattern compatibility are approved per supplied data sheet. **Do not alter data.**
- Manufacturing descriptions are deferred until a team meeting.
- Admin manually updates final product/lifestyle images. Do not replace their content without authorization.
- Support contact and inventory threshold settings remain unchanged.
- Mobile demo approval will be requested after mobile fixes.
- Keep development on existing Shopify environment; do not publish, deploy to production, change domain assignment or expose access without approval.

## Phase 0 — READ / AUDIT / PLAN (before edits)
1. Inspect repository structure, git status, current theme version, build/test commands, Shopify Liquid sections/snippets/templates, JS modules, CSS, metafields/metaobjects and product lookup logic.
2. Read both mandatory external specifications. Map each requirement to real source files and existing behavior.
3. Trace end-to-end state flow: vehicle/style browsing -> filters -> cards -> PDP -> universal builder -> gallery -> cart/share; identify all references to old CLB-06/07 handles.
4. Capture a regression baseline and a precise file-by-file change plan. Note uncommitted work; do not overwrite it.
5. Identify risks, missing data, conflicting requirements and tasks requiring client action. Do not guess.

## Phase 1 — CORE FUNCTIONALITY (small reversible changes)
**A. Builder:** Add prominent Explore Other Designs navigation for all six design-specific builders. Retain correct design-specific component layers, bolt alignment, valid defaults, part number and performant updates. A fully seamless cross-design builder is a separate future phase, not part of this quick implementation.

**B. Fitment:** Preserve approved fitment dataset. Vehicle choice is locked until Reset (remove individual chip-dismiss action). Switching to wheel style clears stale vehicle context. Add barrel and bolt filters in both browse modes using real option data. Improve selected-tab clarity and accessibility.

**C. State persistence:** Carry relevant listing filters into PDP. Vehicle entry retains correct vehicle; style entry retains explicitly chosen diameter/bolt pattern/component filters but no stale vehicle. Validate all transferred values against destination options. Handle refresh, back/forward and Reset.

**E. Gallery:** Preserve automatic return to first builder slide on component change. Add accessible zoom/fullscreen behavior; correct media sizing. Do not introduce unrelated images or overwrite admin-managed assets.

## Phase 2 — CARDS AND NAMING INTEGRATIONS
**D. Product cards:** Implement strictly against `/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels/docs/design/site-updates_11-2-2026/Calder_Product_Card_Specifications_OpenCode_Prompt.md`. Preserve filter behavior, links and performance. Report conflicts rather than overriding that specification.

**G. Naming:** Audit old `CLB-06`/`CLB-07` references, replace only confirmed stale integration references with the existing `CLM-06`/`CLM-07` products/handles, validate variant/part number mapping, product links, metaobjects/metafields, search, share, cart and fallback redirects. Preserve already updated product content and valid historical references. Apply CLM-20X display conventions only where supported by catalog mappings. Do not edit manufacturing descriptions.

**F. Inventory:** NO IMPLEMENTATION CHANGES. Run a before/after behavior comparison; report deviations without changing inventory logic.

## Phase 3 — MOBILE AND DEMO READINESS
Use `/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels/docs/design/site-updates_11-2-2026/calder-mobile-friendliness-audit_11-2-2026.md` as the controlling audit. Resolve identified issues with minimal changes, test on iPhone-sized viewports and actual iPhone if available, and verify builder, filtering, zoom, card navigation and cart/inquiry UI. Never claim actual-device testing if only browser emulation was used. Keep preview controlled and obtain client approval before sharing/publishing.

## Phase 4 — HOMEPAGE (STRICTLY LAST)
Only after all preceding work passes regression QA, address H in `09_H_Homepage_Imagery_Animation_Navigation_LAST.md`. Confirm approved assets and Higgsfield access first. Do not fabricate product renderings or alter admin-managed final imagery. Verify design-to-banner links, including 202 vs 201 mismatch. If assets or approvals are absent, defer and report rather than block completion of earlier phases.

## Verification and rollback
Run existing lint/build/tests, add focused tests where feasible, and execute the complete regression matrix in `12_Implementation_Plan_and_QA.md`. Check console errors, network failures, mobile responsiveness, performance, accessibility, invalid combinations and CLM-06/07 deep links. Confirm that inventory behavior, settings and support details are unchanged. Keep changes isolated and reversible; do not deploy or publish without explicit authorization.

## Required final report
Return: (1) baseline findings; (2) changed files and reasons; (3) completed vs deferred requirements by section A-H; (4) tests run and results, with screenshots where possible; (5) verified CLB-to-CLM dependency fixes; (6) mobile audit coverage; (7) unchanged inventory confirmation; (8) remaining client approvals; (9) rollback instructions. Be explicit about anything untested or inaccessible.

**Begin with Phase 0 audit and plan. Do not start editing until you have mapped dependencies and checked for uncommitted work.**
