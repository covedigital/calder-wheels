# Mobile-Friendliness Audit — Calder Wheels Working Theme

> **Audit date:** 2026-11-02
> **Target:** `docs/design/Shopify Themes/Working Theme-via-CLI/` (Lumia 7.0.1 + Calder customization)
> **Method:** Static code review + `shopify theme check` (CLI v3.93.1)
> **Scope:** `layout/theme.liquid`, `snippets/head.liquid`, `config/settings_data.json`, 9 custom Calder CSS files (~15K lines), key sections/snippets (configurator, builder, fitment finder, dealer portal, galleries, PDP)
> **Test results:** 648 files inspected — 13 errors, 403 warnings (71 files). Key results triaged in §12.
> **No file changes were made.** This is an assessment only.

---

## Verdict

The foundation is genuinely mobile-capable, but there are **3 critical defects** that directly hurt the mobile money-funnel (fitment finder → configurator → quote).

### What's already right (keep)

| Strength | Evidence |
|---|---|
| Viewport meta correct, `maximum-scale=5` (allows pinch zoom) | `snippets/head.liquid:16` |
| Mobile bottom nav fully enabled (home / catalog / account / wishlist / cart) | `settings_data.json` → `mobile_bottom_navigation_*` |
| Sticky header always visible | `header_sticky_always_visible = true` |
| Minicart opens as **bottom sheet** on mobile | `header_cart_opened_bottom_mobile = true` |
| Sticky add-to-cart on PDP | `product_sticky = true` |
| Homepage sections AJAX-load on scroll | `use_ajax_scroll = true` |
| Base design tokens scale responsively (H1 52→38→30px; control height 48→**52px** on mobile) | `assets/calder-base.css.liquid` `@media (max-width: 768px/480px)` |
| `prefers-reduced-motion` respected in base, product, and feature-showcase CSS | calder-base.css.liquid, calder-product.css, calder-feature-showcase.css |
| Fitment finder (home): 2-col select grid, full-width 56px CTA, 52px selects, shell padding 72→16px | `assets/home.css.liquid:2550+` |
| Builder page: horizontally-scrolling design chips, carousel arrows hidden on mobile, full-width CTAs, sticky summary disabled ≤1279px | `assets/build-your-wheel.css:1199–1332` |
| Dealer portal: off-canvas sidebar + overlay ≤900px, KPI grids collapse 4→2→1, dashboard tables in `overflow-x` scroll wrapper | `assets/dealer-portal.css:1503–1622` |
| Gallery cards use proper `srcset`/`sizes` | `snippets/calder-gallery-card.liquid:4` |
| Universal-controls finish chips ≈54px touch targets | `assets/calder-universal-controls.css` |

---

## CRITICAL — fix first

### 1. iOS auto-zoom on every form control (the #1 mobile funnel)

iOS Safari zooms the page when a `<select>`/`<input>`/`<textarea>` has font-size < 16px. Offenders:

| Control | Font size | Where |
|---|---|---|
| Home fitment selects | **0.65rem (10.4px!)** | `assets/home.css.liquid:659` |
| `.calder-select` | 13px | `assets/calder-base.css.liquid` (~line 503) |
| `.calder-input` | 14px | `assets/calder-base.css.liquid` (~line 541) |
| Configurator diameter select | 14px | `assets/wheel-configurator.css:121, 342` |
| Standalone fitment select | 0.95rem (15.2px) | `assets/fitment-finder.css:53` |
| Dealer quick-order `.dp-input` | **no CSS definition at all** | `sections/dealer-quick-order.liquid:288` |
| Quote modal inputs (`.form-control`) | ~14px (Bootstrap) | `snippets/calder-quote-modal.liquid` |

Every Year→Make→Model→Trim tap and every finish selection will jerk-zoom the page on iPhone.

**Fix:** one global rule at ≤768px (or unconditional):

```css
.calder-site select,
.calder-site input,
.calder-site textarea {
  font-size: 16px;
}
```

…plus fixing each definition. The 52px mobile control heights are already right — only the font-size is wrong.

### 2. ~1MB PNGs used for 44px swatches and every finish change

- Component layer PNGs are **0.8–1.3MB each** (`wheel-component-*-titanium-tint.png` 1.1MB, `finish-barrel-polished.png` 808KB, `design-*-center-su.png` 1.1–1.3MB per design)
- `snippets/calder-universal-controls.liquid:45–65` renders **44×44 swatches using the same full-size PNGs** (lazy-loaded — but lazy only defers, it doesn't shrink)
- The configurator preview swaps in a full-size PNG **on every finish change**; gallery slides load 3 layers each with `loading="eager"` (`snippets/calder-universal-gallery-slide.liquid:12–14`)
- Theme `asset_url` files cannot use Shopify's `image_url` resizing — no CDN shrink available for these

A mobile configurator session can realistically transfer **5–10MB**.

**Fix:** generate dedicated swatch assets (~8–16KB, e.g. 88px), mid-size preview layers (~600–800px, 60–120KB), and only load the full composite on explicit zoom/3D. This is the single largest mobile-performance lever in the theme.

### 3. Configurator preview composite: centering defect + CSS specificity war

- `assets/wheel-configurator.css:467–481` positions layers with `top:100% !important; left:50% !important; right:0; height:100%; aspect-ratio:1920/1564; margin:auto`. For a **square** canvas (`.wheel-configurator__canvas { aspect-ratio: 1 }`) with a 1.2276-ratio layer, the abspos constraint math centers the composite at **~75% of canvas width** — right-shifted and clipped by the canvas's `overflow:hidden` at every screen size, worst on mobile. **[verify visually]**
- Its `max-width:none !important` defeats the mobile size caps in `assets/calder-product.css:5045/5167/5305` (`width/height: min(100%, 430–450px)`) — the two files are actively fighting
- The correct pattern already exists in this codebase: the universal gallery stacks layers with `display:grid; place-items:center; grid-area:1/1` (`assets/calder-universal-controls.css:142–180`)

**Fix:** delete the `!important` hack and unify the configurator on the grid-stack approach.

---

## HIGH

### 4. Dealer quick-order table has no scroll container

Dashboard tables correctly use `.dp-table-responsive` (`overflow-x:auto`), but quick-order wraps its table in `.dp-table-wrap` (`sections/dealer-quick-order.liquid:62`) — **a class with no CSS anywhere** — combined with `table-layout:fixed` + 11px font → cramped/clipped SKU inputs on phones. Also `.dp-input` has no CSS definition.

**Fix:** add the `dp-table-responsive` wrapper (or give `dp-table-wrap` the same overflow rule) and define `.dp-input`.

### 5. Fonts: 560KB of raw OTF/TTF, no WOFF2

`assets/font.css.liquid` loads Facundo 108KB, Garet 138KB, Poppins 314KB on every page. Inter is the primary in both font stacks — Poppins is likely dead weight.

**Fix:** convert to subset WOFF2 (~60–70% smaller), drop unused faces.

### 6. Ionicons loaded from `esm.sh` third-party CDN

`layout/theme.liquid:322–332` — every icon on the site depends on an extra DNS+TLS handshake and a third party's uptime; if it's slow, icons render as empty boxes.

**Fix:** self-host the loader.

### 7. Touch targets below 44px (Apple/Google minimum)

| Element | Size | Where |
|---|---|---|
| `.dp-featured__card-btn` | 26px height | `assets/dealer-portal.css:1337` |
| `.cbp-popular__dot` | 8×8px — and the *only* carousel control on mobile since arrows are hidden | `assets/build-your-wheel.css:1303` |
| `.cbp-config__reset-btn` | ~22px @ 10px font | `assets/build-your-wheel.css:420` |
| Quote-modal close button | unstyled `&times;` | `snippets/calder-quote-modal.liquid:17` |
| `.dp-topbar__notif` / mobile toggle | 36px | `assets/dealer-portal.css:105–160` |
| Dealer table "View" links | 12px | `.dp-table__action` |

---

## MEDIUM

### 8. Breakpoint drift across custom CSS

749 / 767 / 768 / 769 all appear as the "mobile" line in different files (universal-controls uses 749; builder 767; base/dealer 768; tablet 991 vs 992). Mostly cosmetic today, but it creates 1px jump windows and makes future maintenance error-prone. **Standardize** (e.g. fix tokens: 749 mobile, 991 tablet — or a lint rule).

### 9. Fixed-px typography without mobile override in a few spots

`.calder-site .holder .title-wrap .h1-style` 36px, `.vertical-slider-title` 48px, `.calder-price--lg` 36px. Most page CSS compensates; audit these three. **[verify]**

### 10. Quote modal has zero CSS

`.calder-quote-modal` is styled only by inline attributes + a fancybox dependency; the no-fancybox fallback (`display:block`) renders uncentered. Give it real styles + 16px inputs.

### 11. Mobile drawer menu depends on store data

`settings.menu` is undefined and `menu_mobile=""` in `settings_data.json`; the drawer only populates if `main-menu-0` / `main-menu-2` linklists exist in the store admin (`sections/async-header-navigation-mobile.liquid:8,15`). Verify, or set a menu explicitly.

### 12. Theme Check triage (13 errors, 403 warnings)

| Item | Verdict |
|---|---|
| `push` / `parse_json` "UnknownFilter" (dealer sections, configurator-api template) | **False positives** — valid modern Shopify filters. Suppress via `.theme-check.yml` |
| `LiquidHTMLSyntaxError` — calder-specialist-cta.liquid:187, index-brands-carousel.liquid:351 | Likely conditional-branch false positives, but confirm nothing shifts on render |
| `MissingAsset: custom.css` (head.liquid:77) | Only fires if `settings.demo` toggled on (currently false) — safe |
| `home.css.liquid:2742` "section" error | Checker misparsing the CSS attribute selector `section[id*=...]` — false positive |
| Undefined objects (`dealer_tier`, `dealer_net_terms`, `is_dealer`) + hardcoded routes in dealer sections | Not mobile-specific; worth a cleanup pass |

---

## LOW / polish

13. Demo leftover: `predictive_search_quick_tags = "Trousers, Jacket, Lumia, Gift card"`.
14. `//`-style fake comments in CSS (`dealer-portal.css:302`, `home.css`, `fitment-finder.css:34`) — invalid CSS that silently drops properties.
15. `bundle-head.js.map` (2MB) sits in assets — unreferenced; repo hygiene.
16. Dealer routes intentionally skip retail header/bottom-nav/footer (`layout/theme.liquid:44–51`) — self-consistent with the portal topbar/sidebar, but confirm dealers have an obvious "back to store" path.

---

## Recommended action plan

### P0 — this week (direct revenue impact)

1. **16px font-size floor on all form controls** (item 1) — small change, fixes tap-zoom on the core funnel
2. **Configurator layer unification** on the grid-stack pattern + remove the `!important` war (item 3)
3. **Swatch/preview image diet** (item 2) — biggest effort, biggest mobile win

### P1 — next sprint

4. Dealer quick-order scroll container + define `.dp-input` (item 4)
5. WOFF2 fonts (item 5)
6. Self-host Ionicons (item 6)
7. Touch-target sweep (item 7)

### P2

8. Breakpoint standardization (item 8)
9. Quote modal styling (item 10)
10. Mobile menu verification (item 11)
11. Theme Check error triage + `.theme-check.yml` suppression for false positives (item 12)

---

## Verification checklist (run before/after fixes)

Run `shopify theme dev`, then on a real iPhone (Safari) + Android (Chrome):

- [ ] Home fitment finder: tap each select — **watch for iOS auto-zoom** (should not zoom after fix)
- [ ] Configurator: change finishes — watch composite centering + Network tab (transfer size per change)
- [ ] Builder page (build-your-wheel): full flow on 375px width
- [ ] PDP (calder template): gallery swipes, sticky ATC, configurator composite
- [ ] Dealer dashboard + quick order: tables scroll horizontally, inputs tappable
- [ ] Lighthouse mobile on home / PDP / builder / dealer dashboard (target: LCP < 2.5s, CLS < 0.1, total transfer per page)
- [ ] Mobile drawer menu: content populates from `main-menu-0` / `main-menu-2`
- [ ] Carousel dots on builder "Popular Configurations" tappable on mobile

**Open item requiring visual confirmation:** the composite centering math in §3 was derived from the CSS constraint equations — confirm the right-shift/clipping on device before rewriting.
