# 08 — Implementation Roadmap

> Paths are relative to `docs/design/Shopify Themes/Working Theme-via-CLI/`. **V** = VERIFIED existing file; **P** = PROPOSED new file. Guardrails apply: protected functionality (resolver, state, registries, fitment, cart, forms) is NOT modified; all changes are additive or CSS-scoped.

## Phase A — Data & architecture (Admin, not code)
- **Objective:** make gallery content exist and routes resolvable.
- **Tasks:**
  1. Create/confirm `gallery_build` metaobject definition in Shopify Admin matching 05-schema (add missing fields: `design_code`, `diameter`, `bolt_pattern`, `weight`, `load_rating`, `wheel_style` — resolve BUG-09 drift).
  2. Enable **metaobject web pages** (`/metaobjects/gallery_build/<handle>`); template `templates/metaobject.gallery_build.liquid` (V) already renders.
  3. Author ≥1 vehicle entry + 6 wheel-design entries (content from client — see 10).
  4. Verify live theme version vs repo HEAD (BUG-07) before any deploy.
- **Files changed:** none in theme. **Admin config:** metaobject definition + entries. **Dependencies:** client photos/data. **Risk:** Low. **Complexity:** Low (schema) / content-dependent.
- **Acceptance:** `shop.metaobjects.gallery_build.values` non-empty; metaobject URL renders detail.
- **Rollback:** unpublish entries.

## Phase B — Shared gallery foundation (code)
- **Objective:** fix the broken visibility/empty-state core; de-dupe payload.
- **Tasks:**
  1. BUG-01: add `[hidden]{display:none!important}` guard for `.calder-gallery-grid__item` — `assets/calder-gallery-v2.css` (V).
  2. BUG-02: remove v1 stylesheet loads — `layout/theme.liquid:93,98-99` (V).
  3. Distinct empty states (no-content vs filtered-empty) — `sections/calder-vehicle-gallery.liquid` (V), `sections/calder-wheel-gallery.liquid` (V), copy via schema settings.
  4. BUG-05: robust `?build=` parsing + canonical to metaobject URL — `sections/calder-gallery-detail.liquid` (V).
  5. Server-side sort honoring `featured` + `sort_order` before JS sort — both listing sections (V).
  6. A11y labels on filter selects (fix doubled label text) — `snippets/calder-gallery-filters.liquid` (V).
  7. Delete dead assets + backups: `assets/calder-gallery.js`, `assets/calder-gallery-detail.js`, `calder-gallery-detail.css` load, `*.backup-102226*` (V×8), `page.gallery.json` legacy page + invalid JSON (BUG-08) — **after** confirming live parity.
- **New files:** none required (optionally `snippets/calder-gallery-empty.liquid` (P) if empty-state markup is shared).
- **Dependencies:** Phase A content for verifying empty-vs-populated states. **Risk:** Medium (CSS cascade, theme.liquid edit — global file; regression-check locked pages). **Complexity:** Low–Medium.
- **Acceptance:** filters/search/pagination visibly hide+show cards; both empty states behave; no v1 CSS on gallery routes; zero console errors.
- **Rollback:** git revert; [hidden] fix is independently revertible.

## Phase C — Vehicle gallery
- **Objective:** vehicle-specific correctness.
- **Tasks:** vehicle filter keys (keep `make,model,wheel,size,finish,bolt,series,style`); make→model dependent filtering options in `assets/calder-gallery-v2.js` (V); fill `style_filter_values` (BUG-06) in `templates/page.vehicle-gallery.json` (V); card shows year+make+model + design code + diameter.
- **Files:** `calder-vehicle-gallery.liquid`, `calder-gallery-card.liquid`, `calder-gallery-v2.js`, `calder-gallery-v2.css` (all V). **Dependencies:** Phase A fields populated. **Risk:** Low. **Complexity:** Medium (dependent filters in minified JS — consider un-minifying with comment header discipline).
- **Acceptance:** make selection scopes model options; reset works; URL untouched.
- **Rollback:** revert JS/CSS.

## Phase D — Wheel gallery
- **Objective:** design-first browsing for 6 designs.
- **Tasks:** one-card-per-design rendering (group `gallery_type='wheel'` entries by `design_code`); finish-swatch preview row on cards; "View Design" CTA → `calder-{design}-wheel` default config; replace legacy `apex-201` block (BUG-04) — `templates/page.wheel-gallery.json` (V).
- **Files:** `calder-wheel-gallery.liquid`, `calder-gallery-card.liquid` (V). **Dependencies:** Phase A entries. **Risk:** Low. **Complexity:** Medium.
- **Acceptance:** 6 design cards; no legacy product links.
- **Rollback:** revert.

## Phase E — Gallery detail pages
- **Objective:** complete, SEO-ready detail experience.
- **Tasks:** lightbox on hero slider (`calder-gallery-v2.js/css`, V); emit `seo_title`/`seo_description` to `<head>` (`layout/theme.liquid` meta block (V) conditional on gallery routes); breadcrumbs; related scoping by make/design (`sections/calder-gallery-detail.liquid` (V) — current loops re-read all values); social copy-link (P2).
- **New files:** `snippets/calder-gallery-seo.liquid` (P) optional. **Dependencies:** metaobject web pages enabled (Phase A2). **Risk:** Medium (theme.liquid again global). **Complexity:** Medium.
- **Acceptance:** unique titles/descriptions per entry; canonical correct; lightbox keyboard-operable.
- **Rollback:** revert.

## Phase F — Product integration
- **Objective:** gallery → PDP preselection (G-1/G-2 in doc 07).
- **Tasks:** reuse `snippets/calder-design-url.liquid` (V) in `calder-gallery-card.liquid` (V) + detail CTA; finish-label→registry-token Liquid mapping (`snippets/calder-finish-tokens.liquid` (P)); required microcopy; degrade-graceful links when finish unmapped.
- **Protected files touched: NONE** (resolver/state/registries untouched; they receive standard params). **Dependencies:** Phase A `design_code`/finish fields. **Risk:** Low. **Complexity:** Medium.
- **Acceptance:** black-center/polished-lip build on a BMW → CTA opens correct design PDP with `center=gloss-black&barrel=polished` preselected; no stock claim anywhere in gallery; PDP state matrix intact (5 states).
- **Rollback:** revert card/CTA link emission.

## Phase G — QA
- Doc 09 matrix executed; regression gates per guardrails §12 (fitment, configurator, variant selection, add-to-cart, cart, navigation) on **locked** pages before/after every global-file change (theme.liquid, v2 CSS/JS).

## Sequencing & effort
A → B → C ∥ D → E → F → G. Estimated complexity overall: **Medium** (the architecture already exists; the work is content, CSS bug fixes, links, and SEO — not a rebuild). Nothing in this plan introduces a second gallery system or competes with the universal product interface.