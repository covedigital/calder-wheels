# 04 — Feature Gap Matrix

> Legend — V = Vossen (verified), E = E5 (largely unverified; JS-rendered), C = current Calder (verified), R = recommended Calder. Priority: P0 launch-critical, P1 important, P2 optional. Complexity: S/M/L.

| Feature | Vossen | E5 | Current Calder | Recommended Calder | Pri | Cmplx | Dependencies | Files affected |
|---|---|---|---|---|---|---|---|---|
| Gallery grid | Multi-col, 620×415 (~3:2) | Unverified | CSS grid exists, correct columns settings | Keep grid; enforce uniform ~3:2 card ratio | P0 | S | Content exists | `calder-gallery-v2.css` |
| Card content | Image→vehicle→series→wheel model | Unverified | Image→title→series→finish overlay | Keep; add design code + diameter/finish line | P0 | S | Metaobject fields | `calder-gallery-card.liquid` |
| Dual galleries (vehicle/wheel) | Yes, header+footer links | Yes (by vehicle) | Yes, tab cross-links | Keep tabs; unify sections | P0 | M | — | `calder-{vehicle,wheel}-gallery.liquid` |
| Search | Not observed | Unverified | Client-side text+dataset match | Keep | P1 | S | — | `calder-gallery-v2.js` |
| Vehicle filters | URL facets (`fwp_gallery_make`) | Unverified | Client-side selects: make/model/wheel/size/finish/bolt/series/style | Keep + URL-param persistence (shareable) | P0 (filters) / P1 (URL) | M | BUG-01 fix | listings, `calder-gallery-v2.js` |
| Wheel filters | URL facets (series) | Unverified | wheel/size/finish/bolt/series/construction/style | Keep; fill `style_filter_values` vocabulary | P0 | S | Setting values from client | `page.wheel-gallery.json`, section schema |
| Filter dependencies | Make→Model implied | Unverified | None — model list not scoped by make | Dependent option filtering (make→model) | P1 | M | JS work | `calder-gallery-v2.js` |
| Sort | Not observed | Unverified | Featured/A–Z/Z–A | Keep; "Featured" should honor `featured` + `sort_order` metafields server-side | P1 | S | Metaobject fields used in Liquid | listing sections |
| Pagination | "Load more" (unverified) | Unverified | Numbered buttons, `per_page` | Keep client pagination; add "Load more" only if collections grow | P2 | M | — | `calder-gallery-v2.js` |
| Empty states | n/a (10k entries) | Unverified | Message exists, conflates "no content" with "no match" | Two states: setup/none-yet vs filtered-empty | P0 | S | Content exists | listing sections |
| Detail page | Full-bleed slider + specs + related | Unverified | Exists (`?build=` + metaobject route) | Keep; SEO polish | P0 | S | Metaobjects | `calder-gallery-detail.liquid` |
| Lightbox / expand | Yes ("Expand gallery") | Unverified | v1 dead; v2 slider only | Fullscreen lightbox on detail slider | P1 | M | A11y (focus trap) | `calder-gallery-v2.js/css` |
| Mobile behavior | Responsive grid | Unverified | Column settings exist | 2-col mobile grid, swipe slider | P0 | S | — | CSS |
| Product links | Wheel-model card → product page | Unverified | **Missing** from gallery cards (links to detail or legacy product) | Deep link with config preselected via existing `?diameter&center&barrel&hardware` contract | P0 | M | `calder-design-url.liquid`, `calder-pdp-state.js` (already built) | `calder-gallery-card.liquid`, detail section |
| Configurator integration | None (quote form instead) | Unverified | None from gallery | CTA → PDP preselected; explicit non-endorsement of stock/fitment | P0 | S–M | Protected resolver/state stack | card snippet, detail section |
| Fitment integration | None | Unverified | None from gallery | "See what fits your car" CTA → fitment finder; optional vehicle-filter deep link | P1 | S | Fitment URL params exist (`filter.p.m.custom.bolt_pattern`) | listing CTA settings |
| Related galleries | By make + by wheel model | Unverified | Both loops exist (all entries, unfiltered) | Scope related loops by make (vehicle) / design (wheel) | P1 | S | Metaobjects | `calder-gallery-detail.liquid` |
| SEO | Keyword slugs, unique titles | Unverified | `seo_title/description` fields coded but unused; metaobject route not confirmed enabled | Enable metaobject web pages; emit meta title/desc; breadcrumbs | P0 | M | Shopify Admin | `layout/theme.liquid` meta block, detail section |
| Performance | 2000px slider images | Unverified | Unknown image sizing discipline | `image_url` widths + `srcset`, lazy below fold, explicit dims | P1 | S | — | card snippet, detail section |
| Accessibility | Not assessed | Unverified | Semantic selects; duplicated label text observed | Fix labels, ARIA slider, focus mgmt, reduced-motion | P0/P1 | M | — | filters snippet, v2 JS/CSS |
| Shopify content mgmt | WP custom (n/a) | Unverified | Metaobject-driven, Admin-authored | Keep; document client workflow | P0 | S | Admin setup | `docs/gallery-metaobject-setup.md` |
| Video in gallery | "many with videos" | Unverified | Not supported | Optional video field on detail (P2) | P2 | M | Schema change | metaobject definition, detail section |
| Social sharing | Not observed | Unverified | None | Copy-link + og tags on detail | P2 | S | SEO fields | detail section, theme.liquid |

## Top 10 recommendations (rolled up)
1. Create + populate `gallery_build` metaobjects (Admin) — P0.
2. Fix `[hidden]` CSS bug — P0, one line.
3. Gallery→PDP deep links with configuration preselected (reuse `calder-design-url.liquid` contract) — P0.
4. Replace legacy `apex-201` block; adopt registry naming — P0.
5. Enable metaobject web pages for SEO detail URLs; wire `seo_*` fields — P0.
6. Unify the two listing sections into one shared framework (visual consistency, functional distinction) — P1.
7. Distinct empty states (no-content vs no-match) — P0.
8. Filter URL-param persistence — P1.
9. Related-galleries scoping (by make / by design) — P1.
10. Lightbox + a11y pass (labels, focus, reduced-motion) — P1.

Nothing here copies a reference verbatim; card anatomy and detail structure are adapted to Calder's existing dark/luxury Lumia design system.