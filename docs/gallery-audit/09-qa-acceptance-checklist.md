# 09 — QA & Acceptance Checklist

Pass criterion = every row PASS. Retest after each phase (08), not only at the end. P0 rows are launch gates.

## Listing pages (vehicle + wheel)
| # | Test | Pass criteria | Pri |
|---|---|---|---|
| 1 | Vehicle gallery renders entries | ≥1 card per published vehicle entry; hero/tabs/search/filters render | P0 |
| 2 | Wheel gallery renders 6 design cards | One card per design; correct design codes | P0 |
| 3 | Card image ratio | All cards uniform 3:2; no layout shift on load | P0 |
| 4 | Broken images | Placeholder (`CALDER` block) renders, no raw broken icon | P1 |
| 5 | Search | Matches title + dataset values; clears results when emptied | P1 |
| 6 | Single filter | Selecting a filter hides non-matching cards — **cards actually disappear** (BUG-01 regression gate) | P0 |
| 7 | Multiple simultaneous filters | AND logic across selects | P0 |
| 8 | Filter reset | RESET restores all cards AND re-derives option lists | P0 |
| 9 | Sort | Featured honors `featured`/`sort_order` server order; A–Z/Z–A reorders | P1 |
| 10 | Pagination | `per_page` honored; page switches show only that page's cards | P0 |
| 11 | Empty state — no content | Editorial "being photographed" state (distinct copy) | P0 |
| 12 | Empty state — filtered | "No builds match" + working Clear Filters action | P0 |
| 13 | URL params for filters (if implemented) | Shareable URL reproduces filter state; back/forward restores | P1 |

## Detail pages (both routes)
| # | Test | Pass criteria | Pri |
|---|---|---|---|
| 14 | Metaobject URL renders | `/metaobjects/gallery_build/<handle>` shows full entry | P0 |
| 15 | `?build=` route renders | Same entry; robust to extra params/encoding (BUG-05) | P0 |
| 16 | Not-found | Unknown/unpublished handle → clean not-found, no Liquid error | P1 |
| 17 | Canonical | `?build=` page canonical → metaobject URL; unique title/description per entry | P0 |
| 18 | Slider | Prev/next/thumbs/counter; optional autoplay respects reduced-motion | P1 |
| 19 | Lightbox | Opens/closes, Esc + arrow keys, focus trap + focus return | P1 |
| 20 | Specs render | All populated metaobject fields display; missing fields omit rows cleanly | P0 |
| 21 | Related builds | Scoped by make (vehicle) / other designs (wheel), not "all entries" | P1 |

## Product/configurator integration (protected regression zone)
| # | Test | Pass criteria | Pri |
|---|---|---|---|
| 22 | Card → PDP deep link | Opens correct `calder-{design}-wheel` with `?diameter&center&barrel&hardware` **preselected** (controls visibly reflect params) | P0 |
| 23 | Finish not in registry | Link degrades to default config, never `INVALID` dead-end | P0 |
| 24 | No sellability implication | Gallery/detail shows required microcopy; **no stock/inventory claims** | P0 |
| 25 | PDP 5-state matrix intact | On PDP: in-stock→Add to Cart; zero→Out of Stock/Inquiry; valid-no-variant→Request This Configuration; stock-needs-approval→Request Build Availability; unverifiable→Check Availability/Speak With a Rep | P0 |
| 26 | Resolver states | `LEGACY_UNVERIFIED`/`AMBIGUOUS` surfaced, not suppressed; `known:false` never in-stock | P0 |
| 27 | Existing PDP functionality | Variant selection, quantity, add-to-cart, cart line items, universal gallery preview all unchanged | P0 |
| 28 | Configurator | Build Your Wheel + fitment finder behave identically pre/post change | P0 |
| 29 | Fitment CTA | Gallery fitment CTA routes to finder; (P2) vehicle param preselected | P1 |

## Responsive / device
| # | Test | Pass criteria | Pri |
|---|---|---|---|
| 30 | Mobile (<768) | 2-col grid; filters collapsed disclosure; slider swipeable; no horizontal scroll | P0 |
| 31 | Tablet | 3-col; filter row wraps cleanly | P1 |
| 32 | Desktop | 4-col; hover states; pagination visible | P0 |

## Robustness
| # | Test | Pass criteria | Pri |
|---|---|---|---|
| 33 | Slow connection | Lazy images don't shift layout; no JS reliance for initial content (server-rendered) | P1 |
| 34 | Large collection (simulate 100 entries) | Initial HTML size acceptable; client filter/pagination time <300ms | P1 |
| 35 | Invalid references | `wheel_product` pointing at deleted product → card still renders, CTA degrades | P0 |
| 36 | Browser history | Back/forward from detail → listing preserves scroll/filters (URL-param feature) | P1 |
| 37 | JS errors | Zero console errors on all four routes | P0 |
| 38 | Liquid errors | No "Liquid error" strings in rendered HTML | P0 |

## Accessibility & SEO
| # | Test | Pass criteria | Pri |
|---|---|---|---|
| 39 | Keyboard | Full gallery flow (filters → card → detail → lightbox) operable by keyboard; visible focus | P0 |
| 40 | Labels/ARIA | One label per select; slider `aria-roledescription`; buttons labeled | P0 |
| 41 | Contrast | Card overlays ≥4.5:1 text; filter chrome ≥4.5:1 | P0 |
| 42 | Reduced motion | Transforms/autoplay disabled under `prefers-reduced-motion` | P1 |
| 43 | Alt text | Every gallery image has meaningful alt (title-based) | P0 |
| 44 | Sitemap/indexability | Metaobject URLs crawlable; not accidentally noindexed; filter URLs (if any) don't create duplicate-index noise (canonical or `noindex` on filtered variants) | P0 |

**Sign-off:** P0 rows all PASS + guardrails §18 post-implementation report → READY_FOR_VISUAL_QA.