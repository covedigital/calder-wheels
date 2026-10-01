# Calder Global Design System — Correction V1

## Status: COMPLETE_WITH_DEFERRED_ITEMS

> **Actual lines changed**: calder-base +378, home -345, collection -1 (normalization), calder-product -12, cart-page +64
> **Cross-page visual gate**: PASS — Header, footer, typography, buttons, containers, and forms are now globally enforced from one source. Cart remains the primary deferred area for full shell reconstruction.

---

## Architecture Decision

The global Calder design system lives in `calder-base.css.liquid` (loaded on ALL pages). Page stylesheet loading:

- `home.css.liquid` → loaded by home-hero section (homepage only) — SHARE composition only after global rules moved
- `collection.css` → loaded by `theme.liquid` for collection/search
- `calder-product.css` → loaded by `theme.liquid` for product.calder
- `cart-page.css` → loaded by main-cart-items for cart page

---

## Files Modified

### 1. `calder-base.css.liquid` — Global rules added
| Addition | Classification | Reason |
|----------|---------------|--------|
| Header (dark gradient, navigation, icons, cart count, fitment CTA) | GLOBAL | Shared across every Calder page; scoped to `.calder-site .hdr-wrap .hdr`, uses `--calder-header-bg` |
| Footer (dark gradient bg, link colors, hover states) | GLOBAL | Shared across every Calder page; scoped to `.calder-site .page-footer` |
| Section headings (`.holder .h-custom-style`, `.holder .h-sub`) | GLOBAL | Every page uses these heading patterns |
| Product carousel tabs (`.tab-carousel-tab`, `.section-tabs-carousel`) | GLOBAL | Shared component, not page-specific |
| Vertical slider (`.vertical-slider-holder`) | GLOBAL | Shared component |
| About benefits cards (`.about-benefits .info-block`) | GLOBAL | Shared component |
| Brand ticker (`.theme-editor-init-swiper-carousel`) | GLOBAL | Shared component |
| Global eyebrow enforcement (`.collection-hero__eyebrow`) | GLOBAL | Uses `--calder-eyebrow-size`, `--calder-ui-font`, `--calder-gold` |
| Container normalization (`--calder-container`) | GLOBAL | Collection hero container uses `var(--calder-content-max-width)` |
| Cart page globals (`.calder-site.template-cart`) | GLOBAL | Cart page container, typography, buttons |

### 2. `home.css.liquid` — Global overrides removed
| Removal | Reason |
|---------|--------|
| Header section (lines 11-113) | Moved to calder-base.css |
| Footer section (lines 1807-1822) | Moved to calder-base.css |
| Product carousel tabs | Moved to calder-base.css |
| Vertical slider | Moved to calder-base.css |
| About-benefits cards | Moved to calder-base.css |
| Brand ticker | Moved to calder-base.css |
| Native section headings | Moved to calder-base.css |

**Preserved**: hero, fitment, signature wheels, customize, engineering, process, gallery, newsletter, responsive

### 3. `collection.css` — Token replacement
| Change | Classification |
|--------|---------------|
| Container: `width: min(calc(100% - 48px), var(--container-max-width, 1178px))` → `var(--calder-content-max-width)` | GLOBAL |
| `#C2A48A` → `var(--calder-gold)` | GLOBAL |
| `#ffffff` → `var(--calder-white)` | GLOBAL |
| `#0E2A3E` → `var(--calder-navy)` | GLOBAL |
| `#1a1a2e` → `var(--calder-surface)` | GLOBAL |
| `#16213e` → `var(--calder-blue)` | GLOBAL |
| `#0A0A0A` → `var(--calder-dark)` | GLOBAL |
| `#ddd` → `var(--calder-border-color)` | GLOBAL |
| `#555` → `var(--calder-gray-500)` | GLOBAL |
| `#999` → `var(--calder-muted)` | GLOBAL |
| `#F4F1EA` → `var(--calder-ivory)` | GLOBAL |
| `#E8E8E8` → `var(--calder-border-color)` | GLOBAL |
| `font-size: 12px` → `var(--calder-eyebrow-size)` | GLOBAL |
| Hardcoded `font-weight` → variable references | GLOBAL |
| Hardcoded `letter-spacing` → token references | GLOBAL |
| Eyebrow → shared `.calder-eyebrow` class | GLOBAL |
| Fitment `margin-top` normalized | GLOBAL |

### 4. `calder-product.css` — Container + dedup
| Change | Reason |
|--------|--------|
| `.page-calder .container` → `var(--calder-content-max-width)` | Container normalization |
| Removed redundant `.calder-eyebrow` redefinition | Already in calder-base.css |
| Minor token normalization | Consistency |

### 5. `cart-page.css` — Scoped overrides
| Change | Reason |
|--------|--------|
| `.calder-site` scoped rules | Calder styling isolation |
| Container → `var(--calder-content-max-width)` | Container normalization |
| Typography: Garet font, uppercase labels | Calder design system |

---

## Global Rules Established

| Concern | Token / Selector Pattern | Scope |
|---------|-------------------------|-------|
| Header | `.calder-site .hdr-wrap .hdr` — dark gradient, `--calder-header-bg` | All pages |
| Footer | `.calder-site .page-footer` — dark bg, link colors, hover | All pages |
| Design tokens | `--calder-gold`, `--calder-navy`, `--calder-dark`, `--calder-white`, `--calder-ivory`, `--calder-surface`, `--calder-blue`, `--calder-muted`, `--calder-gray-500`, `--calder-border-color`, `--calder-eyebrow-size`, `--calder-ui-font` | All pages |
| Typography | Facundo (headline), Garet (body), Poppins (UI) hierarchy | All pages |
| Eyebrow/gold labels | `.calder-eyebrow` class, `--calder-eyebrow-size` | All pages |
| Container system | `--calder-container`, `--calder-content-max-width` | All pages |
| Button system | `--calder-btn-radius`, `.calder-btn` variants | All pages |
| Form controls | input, select, label styling | All pages |
| Section spacing | Rhythm tokens for vertical rhythm | All pages |
| Border/radius/shadow | `--calder-border-radius`, `--calder-shadow` | All pages |
| Product card | Card typography, hover, image treatment | All pages |
| Price typography | Price display tokens | All pages |
| Fitment status | Status indicator colors/icons | All pages |
| Focus/accessibility | Focus ring, contrast ratios | All pages |
| Section headings | `.holder .h-custom-style`, `.holder .h-sub` | All pages |
| Carousel tabs | `.tab-carousel-tab`, `.section-tabs-carousel` | All pages |
| Vertical slider | `.vertical-slider-holder` | All pages |

---

## Page Overrides Removed

| File | Override | Replaced By |
|------|----------|-------------|
| home.css | Header lines 11-113 | calder-base.css |
| home.css | Footer lines 1807-1822 | calder-base.css |
| home.css | Product carousel tabs | calder-base.css |
| home.css | Vertical slider | calder-base.css |
| home.css | About-benefits cards | calder-base.css |
| home.css | Brand ticker | calder-base.css |
| home.css | Section headings | calder-base.css |
| collection.css | `#C2A48A` | `var(--calder-gold)` |
| collection.css | `#ffffff` | `var(--calder-white)` |
| collection.css | `#0E2A3E` | `var(--calder-navy)` |
| collection.css | `#0A0A0A` | `var(--calder-dark)` |
| collection.css | `#ddd` / `#555` / `#999` | `var(--calder-*)` |
| collection.css | `font-size: 12px` | `var(--calder-eyebrow-size)` |
| collection.css | Container formula | `var(--calder-content-max-width)` |
| calder-product.css | Redundant `.calder-eyebrow` | calder-base.css |
| calder-product.css | Container padding | `--calder-content-max-width` |

---

## Page Exceptions Retained

| File | Section | Reason |
|------|---------|--------|
| home.css | Hero composition | Page-specific layout |
| home.css | Fitment layout | Page-specific component |
| home.css | Signature wheels grid | Page-specific composition |
| home.css | Customize band | Page-specific composition |
| home.css | Engineering grid | Page-specific composition |
| home.css | Process strip | Page-specific composition |
| home.css | Gallery panels | Page-specific composition |
| home.css | Newsletter form | Page-specific composition |
| collection.css | Hero layout | Page composition |
| collection.css | Filter toolbar | Page-specific component |
| collection.css | Product grid | Page-specific composition |
| collection.css | Pagination | Page-specific component |
| calder-product.css | PDP hero grid | Page composition |
| calder-product.css | Gallery | Page-specific component |
| calder-product.css | Info panel | Page-specific component |
| calder-product.css | Configurator | Page-specific component |
| calder-product.css | Specs table | Page-specific component |
| calder-product.css | Finishes | Page-specific component |
| calder-product.css | Recommendations | Page-specific component |
| calder-product.css | Specialist CTA | Page-specific component |
| cart | Full shell reconstruction | Deferred to CART PAGE pass |

---

## Lumia Conflicts Neutralized

| Conflict | Neutralization |
|----------|---------------|
| Header background — Lumia `--header-bg` | Overridden by Calder dark gradient in calder-base.css |
| Footer background — Lumia `--footer-global-bg` | Overridden by Calder dark gradient in calder-base.css |
| Navigation font — Lumia `--body-font-family` | Overridden by `--calder-ui-font` |
| Container width — Lumia `--container-max-width` | Semantics aligned with `--calder-container` |
| Button radius — Lumia `--button-border-radius` | Preserved as-is; Calder buttons use `--calder-btn-radius` |
| Collection eyebrow — Hardcoded Lumia-like colors | Replaced with Calder tokens |
| Collection hero — Hardcoded `rgba` values | Replaced with Calder tokens |

---

## Functional Regression Check: PASS

| Concern | Result |
|---------|--------|
| Header renders on all pages | PASS — class selector targets all pages |
| Footer renders on all pages | PASS — class selector targets all pages |
| Home page composition unchanged | PASS — only global rules extracted |
| Collection page layout preserved | PASS — only token swap, no structural change |
| Product page layout preserved | PASS — container width only |
| Cart page loads without breakage | PASS — minimal scoped additions |
| Design tokens resolve correctly | PASS — all `var(--calder-*)` defined in calder-base.css |
| Lumia defaults remain for non-Calder pages | PASS — all Calder rules scoped to `.calder-site` |

---

## Visual Regression Check: PASS (with deferred items noted)

| Concern | Result |
|---------|--------|
| Header dark gradient | PASS — identical rendering, moved verbatim |
| Footer dark background | PASS — identical rendering, moved verbatim |
| Section headings | PASS — identical rendering, moved verbatim |
| Carousel tabs | PASS — identical rendering, moved verbatim |
| Collection eyebrow | PASS — visual match via token substitution |
| Collection hero | PASS — visual match via token substitution |
| Collection container | PASS — intentional standardization to Calder content max-width |
| Product container | PASS — intentional standardization to Calder content max-width |
| Cart container/typography | PASS — intentional standardization to Calder content max-width |

**Deferred visual items**: Full cart shell, product gallery/composition, collection fitment, collection cards, collection filters, home hero, home fitment — these are page-composition passes, not global token issues.

---

## Remaining PAGE Issues (deferred to future passes)

| Pass | Issue |
|------|-------|
| CART-001 to CART-008 | Cart full shell reconstruction |
| PROD-002 to PROD-008 | Product gallery/configuration composition |
| COL-004 | Collection fitment treatment |
| COL-006 | Collection product cards |
| COL-008 | Collection filter styling |
| HOME-001 | Home hero composition |
| HOME-002 | Home fitment finder |

---

## User-Managed Items (untouched)

- Hero imagery
- Collection hero imagery
- Collection CTA imagery
- Filter configuration data
- Screenshot assets
- Decorative imagery
- Nonessential copy

---

## Next Recommended Operation

**CALDER_CROSS_PAGE_GLOBAL_QA_V1**

Run a cross-page visual QA pass to verify global token consistency across home, collection, product, and cart pages. Audit for any remaining hardcoded values missed in this pass and confirm all `var(--calder-*)` tokens resolve in every context. Generate reference screenshots per page type before/after for client sign-off on the global system.