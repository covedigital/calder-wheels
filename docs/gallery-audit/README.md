# Calder Wheels — Gallery System Audit: Executive Summary

> Audit date: 2026-11-01 · Mode: READ-ONLY (no theme files modified) · Guardrails: `CALDER_OPENCODE_MANDATORY_GUARDRAILS.md` located and applied (`docs/design/full-site audit before-updates_9-30-2026/`). Reports in this folder supersede nothing and change nothing — they await approval.

## Existing system assessment
A complete, well-designed gallery system **already exists in the theme**: metaobject-driven listings (`shop.metaobjects.gallery_build`), twin vehicle/wheel listing sections, a shared detail section with two routes (`/pages/gallery-build?build=` and `templates/metaobject.gallery_build.liquid`), client-side filter/search/sort/pagination (`calder-gallery-v2.js`), and a card-dataset filter contract. It integrates cleanly alongside the protected universal PDP/configurator stack (registry → resolver → state → CTA). The architecture is right; it is not a competing product system.

## Most critical issues
1. **The galleries are empty because no `gallery_build` metaobjects exist in Shopify Admin** — the setup doc (`docs/gallery-metaobject-setup.md`) frames Admin creation as a still-pending manual step. Vehicle Gallery has zero fallback blocks → real empty state; Wheel Gallery's single fallback card links to a **legacy `apex-201` product** that predates the 6-design registry naming. *(Verified root cause — not JS errors, not filtering bugs, not stale references.)*
2. **CSS bug (P0):** `.calder-gallery-grid__item{display:block}` in `calder-gallery-v2.css:2` defeats `[hidden]` — filter/pagination hiding can never work once content exists.
3. **Deployed-version skew risk:** `.backup-102226` section copies with different markup may be what's live — must verify live theme version before fixing.
4. v1 gallery CSS/JS (`calder-gallery.css` via `theme.liquid:93,98`) loads dead stylesheets on the v2 pages; `page.gallery.json` legacy page contains invalid JSON + placeholder content.

## Recommended architecture
Keep the current **hybrid metaobject model** (`gallery_build` content records → registry design refs → optional sellable product refs). Enable metaobject web pages for indexable detail URLs; keep `?build=` as compat route with canonical. One card per design in the Wheel Gallery (6 cards + finish swatches), one per installation in the Vehicle Gallery.

## Top 10 feature recommendations
1. Create + populate `gallery_build` metaobjects (Admin) — P0
2. Fix `[hidden]` CSS bug (one line) — P0
3. Gallery → PDP deep links with configuration preselected (reuse `calder-design-url.liquid` + existing `calder-pdp-state.js` URL contract — **the preselection API already exists**) — P0
4. Replace the legacy `apex-201` block — P0
5. Distinct empty states (no-content vs filtered) — P0
6. SEO: metaobject web pages, per-entry title/description, canonical, breadcrumbs — P0
7. Unify the twin listing sections (95% duplicated) — P1
8. Filter URL-param persistence (shareable facets) — P1
9. Related-galleries scoped by make/design — P1
10. Lightbox + accessibility pass (labels, focus, reduced-motion) — P1

## P0 launch requirements
Client content (photos, vehicle/spec data, style vocabulary) + Shopify Admin metaobject setup + the four code fixes above. Full list: `10-client-questions-and-launch-dependencies.md`.

## Estimated implementation complexity
**Medium overall** — no rebuild; the phases are Admin content, one-line CSS, link emission, SEO wiring, and cleanup. Protected functionality (fitment, resolver, registries, cart, forms) is untouched by the plan.

## Major risks
- Shipping code fixes against a stale live theme (version skew) — verify first.
- Global-file edits (`theme.liquid`, `calder-gallery-v2.css`) can affect PRESENTATION_LOCKED pages — regression-gate per guardrails §8/§12.
- Minified `calder-gallery-v2.js` edits (dependent filtering) — source-management discipline needed.
- Gallery implying stock/fitment — mitigated by design (state matrix resolves only on PDP; microcopy mandated).

## Recommended next action
Approve the roadmap in `08-implementation-roadmap.md`, starting with **Phase A (Admin metaobject creation + live-version verification)**, then **Phase B (CSS/empty-state fixes + cleanup)**. Review the file inventory (`02`), bug list (`03`), data schema (`05`), and integration contract (`07`) before authorizing code.

## Report index
| File | Contents |
|---|---|
| `01-reference-gallery-analysis.md` | Vossen (verified) / E5 (JS-rendered — limitation recorded) |
| `02-existing-theme-file-inventory.md` | Routes, files, actions (KEEP/REUSE/REFACTOR/REPLACE/REMOVE), risk |
| `03-functional-audit-and-bugs.md` | Empty-gallery root cause + BUG-01…09 + 24-point checklist |
| `04-feature-gap-matrix.md` | Vossen/E5/Calder/Recommended comparison, priorities |
| `05-shopify-data-architecture.md` | Options A–D, hybrid recommendation, full field schema |
| `06-gallery-ux-ui-specification.md` | Layouts, wireframes, states, a11y, image strategy |
| `07-product-configurator-integration.md` | Verified contracts, G-1…G-4, 5 inventory states preserved |
| `08-implementation-roadmap.md` | Phases A–G with files, risks, acceptance, rollback |
| `09-qa-acceptance-checklist.md` | 44-row QA matrix with pass criteria |
| `10-client-questions-and-launch-dependencies.md` | 8 launch blockers, 6 decisions, 7 optional |

---
**Final output summary (per brief):**

1. **What currently works:** all gallery chrome — heroes, tabs, search, filter selects, sort, pagination controls, detail section, metaobject template, card/filter snippets, and the entire protected PDP/configurator/fitment stack.
2. **Broken/incomplete:** zero gallery content (no Admin metaobjects); one stale legacy product card; `[hidden]` CSS breaks card hiding; v1 CSS loaded on v2 pages; hand-rolled query parsing; unfilled style vocabulary; legacy `page.gallery.json`.
3. **Retain:** the v2 metaobject-driven architecture, card dataset contract, shared detail section, deep-link/state/resolver/CTA stack (protected).
4. **Redesign:** empty-state strategy, wheel-gallery organization (per-design cards), related-galleries scoping, SEO emission, a11y labels.
5. **Data model:** hybrid — `gallery_build` metaobjects with `design_code`/`wheel_product` refs to registry designs and sellable products (schema in doc 05).
6. **New functionality:** finish-token deep links from gallery, no-content empty state, lightbox, SEO meta, URL-param filter persistence.
7. **Launch-critical:** metaobject creation + content, BUG-01/04 fixes, deep links, empty states, SEO routes.
8. **Shopify data dependencies:** metaobject definition + entries + web pages enablement, `style_filter_values` vocabulary, inventory source decision.
9. **PDP/configurator dependencies:** none modified; gallery consumes the existing `?diameter&center&barrel&hardware` preselection contract and defers all sellability to the 5-state PDP matrix.
10. **Client decisions:** 8 launch blockers + 6 important decisions listed in doc 10 (photography, Admin ownership, canonical route, wheel-gallery organization, content workflow).

**Architectural considerations (per brief §5):** metaobjects confirmed as the right vehicle-installer/content layer (theme already codes it); gallery→configurator relationship made explicit and non-committal via deep links + microcopy; the two listings already share one component system and will stay visually consistent while emphasizing vehicle-spec vs wheel-spec filters.

Audit complete. Awaiting approval before implementation.