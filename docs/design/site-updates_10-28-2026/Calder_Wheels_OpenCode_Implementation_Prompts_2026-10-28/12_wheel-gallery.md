# OpenCode Prompt 12 — Wheel gallery

**Project:** Calder Wheels Shopify theme  
**Priority:** P1 — launch if feasible / stage safely  
**Context:** Client meeting October 28, 2026; conditional SEMA target November 3, 2026.

## Assignment

Build an exploration gallery that routes each photographed/preset combination into its universal design PDP.

## Detailed implementation instructions

Audit existing gallery v2 and actual image metadata; show all images by default; filter by wheel design, center finish, barrel/lip finish; hide Series for future use; remove diameter, bolt pattern, construction and excessive sorting; preserve distinct finish imagery; link each item to the correct design-level PDP with available preset parameters.

## Boundaries and acceptance criteria

Do not claim an image depicts a finish unless metadata verifies it; do not invent missing photos.

**Definition of done:**
1. Inspect the current implementation and list exact files to change before coding.
2. Confirm any required source data and stop safely if unavailable.
3. Implement the narrowest complete solution, including empty/loading/error states.
4. Test on desktop and mobile, including keyboard interaction and relevant Shopify edge cases.
5. Demonstrate that the feature preserves existing unrelated behavior and meets its stated purpose.
6. Provide a concise report of files changed, tests performed, blockers, and rollback notes.

## Required deliverables

Gallery filters, card links, responsive QA.

## Mandatory execution guardrails

- Inspect the actual Shopify theme repository, current Liquid/JS/CSS, settings, metafields, product data, and relevant existing guardrails before editing. Do not assume filenames, schemas, APIs, or inventory mappings exist.
- First produce a concise audit: affected files, data sources, current behavior, implementation plan, risks, and verification steps. Then implement only the scoped changes.
- Preserve the approved Calder visual design, existing unrelated functionality, theme editor settings, responsive behavior, accessibility, and Shopify compatibility. No unrelated refactors, dependency additions, or broad global CSS.
- Use the existing project's mandatory OpenCode guardrails if present; where they are stricter, follow them. Never silently overwrite or delete existing code.
- Do not fabricate wheel designs, inventory, fitment, pricing, vehicle images, SKU mappings, or asset filenames. Mark missing dependencies clearly and fail safely.
- Keep code modular, scoped, and progressively enhanced. Avoid duplicate event handlers, global namespace pollution, stale state, and unnecessary network requests.
- Never submit a cart line unless the exact resolved, available Shopify variant matches the full selected configuration. Server-side Shopify inventory and checkout remain authoritative.
- Report changed files, why each changed, validation performed, remaining issues, and any required client decisions. If a prerequisite is absent, stop the affected functionality safely and document it.
- Do not claim a feature is complete without tests; do not deploy to production or change live inventory without explicit approval.

