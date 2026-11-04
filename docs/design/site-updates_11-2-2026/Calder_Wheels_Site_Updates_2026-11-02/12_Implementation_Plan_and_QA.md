# Implementation Plan and Regression QA

## Baseline
Identify theme, branch, build scripts, affected Liquid/JS/CSS, metaobjects/metafields, existing tests and current preview. Capture baseline screenshots, key navigation paths, product IDs/handles, and expected wheel configurations. Record existing inventory behavior without changing it.

## Safe change process
- Create a feature branch/checkpoint and a reversible diff.
- Make small, scoped changes; prefer existing utilities and component contracts.
- Use feature flags/settings only if consistent with current theme patterns.
- Avoid global CSS, duplicate event listeners, conflicting state stores and new heavyweight dependencies.
- Validate on desktop and iPhone viewport after each phase.
- Run lint/build/tests if available; do not hide failures.

## Regression matrix
1. Vehicle selection -> matching products -> PDP -> correct vehicle context.
2. Style filtering -> PDP -> preserved diameter/bolt pattern and no stale vehicle.
3. Switch browse tabs -> reset rules -> no stale filters.
4. Change all builder components -> accurate image/part number -> gallery slide resets.
5. Cross-design navigation -> correct design layers, options, handles and links.
6. Product cards -> authoritative spec, filter compatibility and links.
7. Gallery zoom -> mobile gestures, close/keyboard, image fidelity.
8. CLM-06/07 -> handles, URLs, redirects, metafields, configurator, cart and share links.
9. Inventory -> unchanged UI states, thresholds, support number and purchase/inquiry behavior.
10. Mobile -> every issue from referenced mobile audit addressed or reported.

## Deliverables
File-by-file change log, tests executed and results, screenshots where possible, known limitations, client-dependent tasks, rollback instructions and explicit confirmation that inventory and homepage were not touched before their authorized phases.
