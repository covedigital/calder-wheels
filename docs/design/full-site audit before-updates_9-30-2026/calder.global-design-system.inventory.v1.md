# Calder Global Design System — Inventory Report V1

> **Purpose**: Identify every CSS rule that duplicates, conflicts with, or bypasses the Calder design tokens defined in `calder-base.css.liquid`, and classify each for correction.
> **Scope**: `docs/design/Shopify Themes/Working Theme-via-CLI/assets/`
> **Authority**: `calder-base.css.liquid` is the single source of truth for all design tokens, typography, and primitive components.

---

## 1. Existing Sources

### 1.1 Header

| Field | Value |
|---|---|
| **Concern** | Dark header styling is only loaded on the homepage |
| **Current file(s)** | `home.css.liquid` lines 11–113 (`.calder-site .hdr-wrap .hdr`) |
| **Current selector(s)** | `.calder-site .hdr-wrap .hdr`, `.calder-site .hdr-wrap .hdr .mmenu`, `.calder-site .hdr-wrap .hdr .hdr-inline-link`, `.calder-site .hdr-wrap .fitment-cta` |
| **Conflict** | Header transparent logic in `header.liquid` sets `.hdr-transparent` only when `request.page_type == 'index'`. All non-homepage pages use Lumia white header (no Calder theming). Collection/product/cart pages show the Lumia default header, not the dark Calder header. |
| **Affected pages** | Collection, product, cart, search, 404, blog, page — all non-index templates |
| **Chosen authority** | **GLOBAL** — header dark styling should live in `calder-base.css.liquid` so it applies site-wide. The `.hdr-transparent` class can remain for the homepage glow-up, but a default dark header should render on all Calder pages. |

### 1.2 Footer

| Field | Value |
|---|---|
| **Concern** | Dark footer styling is only loaded on the homepage |
| **Current file(s)** | `home.css.liquid` lines 1807–1822 (`.calder-site .page-footer`) |
| **Current selector(s)** | `.calder-site .page-footer`, `.calder-site .page-footer a` |
| **Conflict** | Footer dark gradient (`--calder-gradient-dark-vertical`), white text, gold hover only apply when `home.css.liquid` is loaded — i.e. homepage only. Other pages get Lumia default footer (white/light). |
| **Affected pages** | Collection, product, cart, search, 404, blog, page |
| **Chosen authority** | **GLOBAL** — move to `calder-base.css.liquid` |

### 1.3 Typography

| Field | Value |
|---|---|
| **Concern** | Heading/body font assignments and primitive sizes defined globally, but pages use hardcoded values |
| **Current file(s)** | `calder-base.css.liquid` lines 253–305 (`.calder-h1`, `.calder-h2`, `.calder-h3`, `.calder-body`, `.calder-body-sm`) |
| **Current selector(s)** | `.calder-h1`, `.calder-h2`, `.calder-h3`, `.calder-body`, `.calder-body-sm` |
| **Conflict** | `calder-base.css.liquid` provides `.calder-h1/h2/h3` and `.calder-body` primitives, but `collection.css` hardcodes `font-size`, `font-weight`, `letter-spacing`, `color` in `.collection-hero__heading`, `.collection-hero__body`, `.collection-hero__eyebrow`. Homepage hero uses custom `.home-hero__heading`, `.home-hero__body` with hardcoded values. Product CSS mostly uses `var(--calder-*)` correctly but redeclares `.calder-eyebrow` (lines 69–77). |
| **Affected pages** | Homepage hero, collection hero, product page (partial redeclaration) |
| **Chosen authority** | **GLOBAL** for primitives; **PAGE** for hero composition that needs unique sizing |

### 1.4 Buttons

| Field | Value |
|---|---|
| **Concern** | Multiple button implementations exist with identical visual intent |
| **Current file(s)** | `calder-base.css.liquid` lines 312–390 (`.calder-btn`, `--primary`, `--secondary`, `--outline`, `--sm`, `--lg`) |
| **Current selector(s)** | `.calder-btn`, `.calder-btn--primary`, `.calder-btn--secondary`, `.calder-btn--outline`, `.calder-btn--sm`, `.calder-btn--lg` |
| **Conflict** | Homepage hero uses `.home-hero__btn-primary` and `.home-hero__btn-secondary` (home.css.liquid lines 218–278) — pixel-for-pixel duplicates of `.calder-btn--primary` and `.calder-btn--outline`. Collection uses `.collection-help-cta__btn-primary` and `.collection-help-cta__btn-secondary` (collection.css lines 726–770) with hardcoded `#C2A48A` background. Homepage fitment results use `.btn--primary` (home.css.liquid line 903, 1027) with inline styling. Product uses `.calder-pdp__add-btn` (calder-product.css lines 500–528) with hardcoded `var(--calder-gold)` background. Cart uses `card-total` buttons (Lumia default). |
| **Affected pages** | Homepage hero, homepage fitment, collection help CTA, product page, cart |
| **Chosen authority** | **GLOBAL** — all buttons should use `.calder-btn` system |

### 1.5 Forms

| Field | Value |
|---|---|
| **Concern** | Form controls defined globally but not consistently used |
| **Current file(s)** | `calder-base.css.liquid` lines 397–464 (`.calder-select`, `.calder-input`, `.calder-label`) |
| **Current selector(s)** | `.calder-select`, `.calder-input`, `.calder-label` |
| **Conflict** | Homepage fitment uses `.hf-fitment__select` (home.css.liquid lines 707–743) — inline duplicate of `.calder-select` with `var(--hf-control-bg)` instead of `var(--calder-control-bg)`. Collection uses `.form-select-wrap select` (collection.css lines 528–545) with Lumia defaults (`#f9f9f9` background, `#ddd` border). Newsletter uses `.home-newsletter__input` (home.css.liquid lines 1758–1777) — inline duplicate of `.calder-input`. |
| **Affected pages** | Homepage fitment, collection toolbar, newsletter section |
| **Chosen authority** | **GLOBAL** — use `.calder-select`/`.calder-input`/`.calder-label` everywhere |

### 1.6 Containers

| Field | Value |
|---|---|
| **Concern** | Container width logic duplicated across files |
| **Current file(s)** | `calder-base.css.liquid` lines 657–664 (`.calder-container`) |
| **Current selector(s)** | `.calder-container` |
| **Conflict** | Collection uses `width: min(calc(100% - 48px), var(--container-max-width, 1178px))` in three places (`.collection-hero__container` line 66, `.section--hf-fitment .hf-fitment__shell` line 194, `.collection-category-nav__container` line 211) instead of the global `var(--calder-content-max-width)`. Product uses `.page-calder .container` (calder-product.css lines 60–66) with hardcoded `padding-left: 15px; padding-right: 15px` instead of `var(--calder-gutter)`. |
| **Affected pages** | Collection (hero, fitment wrapper, category nav), product page |
| **Chosen authority** | **GLOBAL** — use `.calder-container` and `var(--calder-content-max-width)` |

### 1.7 Product Cards

| Field | Value |
|---|---|
| **Concern** | Product cards not using `.calder-card` system |
| **Current file(s)** | `calder-base.css.liquid` lines 471–590 (`.calder-card` and children) |
| **Current selector(s)** | `.calder-card`, `.calder-card__media`, `.calder-card__title`, `.calder-card__price`, `.calder-card__action` |
| **Conflict** | Collection grid uses `.prd-grid .col > calder-product-card` (or `.prd`) — Lumia product card structure, not `.calder-card`. Homepage signature section uses custom `.home-signature__card` (home.css.liquid lines 1150–1231) which is a unique non-reusable implementation. Cart uses Lumia `.card-total` and `.cart-table-*` selectors (entirely Lumia). |
| **Affected pages** | Collection grid, homepage signature wheels, cart |
| **Chosen authority** | **GLOBAL** for `.calder-card`; **PAGE** for homepage-unique card layouts |

### 1.8 Eyebrow / Labels

| Field | Value |
|---|---|
| **Concern** | Eyebrow style duplicated with hardcoded values |
| **Current file(s)** | `calder-base.css.liquid` lines 238–246 (`.calder-eyebrow`) |
| **Current selector(s)** | `.calder-eyebrow` |
| **Conflict** | Collection hero has `.collection-hero__eyebrow` (collection.css lines 81–89) with hardcoded `#C2A48A`, `12px`, `0.22em`. Homepage has multiple eyebrow implementations: `.home-hero__eyebrow` (line 174), `.home-signature__eyebrow` (line 1068), `.home-customize__eyebrow` (line 1278), `.home-engineering__eyebrow` (line 1376), `.home-process__eyebrow` (line 1485), `.home-gallery__eyebrow` (line 1559) — all using identical values but as separate selectors. Product CSS redeclares `.calder-eyebrow` (calder-product.css lines 69–77) with `letter-spacing: 1.8px` (differs from base's `2.5px`). |
| **Affected pages** | Collection hero, all homepage sections, product page |
| **Chosen authority** | **GLOBAL** — use `.calder-eyebrow` class; remove per-section eyebrow selectors |

### 1.9 Section Spacing

| Field | Value |
|---|---|
| **Concern** | Section padding/margin values not using variables |
| **Current file(s)** | `calder-base.css.liquid` lines 171–173 (`--calder-section-py`, `--calder-section-mb`, `--calder-section-gap`) |
| **Current selector(s)** | `.calder-section`, CSS variables |
| **Conflict** | Homepage sections use hardcoded padding: `.home-signature` uses `padding: 40px 0 60px`, `.home-engineering` uses `padding: 40px 0`, `.home-process` uses `padding: 40px 0 50px`, `.home-gallery` uses `padding: 40px 0`. None use `var(--calder-section-py)`. Collection sections use values like `padding: 28px 0 36px`, `padding: 28px 0 8px`. |
| **Affected pages** | All homepage sections, all collection sections |
| **Chosen authority** | **PAGE** — each page defines its own section composition, but should reference the variables for consistency |

### 1.10 Colors / Tokens

| Field | Value |
|---|---|
| **Concern** | Hardcoded color values instead of CSS variables |
| **Current file(s)** | `calder-base.css.liquid` lines 11–218 (complete token system) |
| **Current selector(s)** | `:root { --calder-* }` |
| **Conflict** | `collection.css` uses `#C2A48A` (gold), `#ffffff` (white), `#0E2A3E` (navy), `#555`, `#999`, `#ccc`, `#ddd`, `#f9f9f9`, `#22292F`, `#666`, `#e8e8e8`, `#1a1a2e`, `#b39175` — all hardcoded. Homepage fitment uses `--hf-*` variables (home.css.liquid lines 923–933) that duplicate `--calder-*` values (e.g., `--hf-panel-navy: #001C2A` duplicates `--calder-midnight: #031A27`). |
| **Affected pages** | Collection, homepage fitment |
| **Chosen authority** | **GLOBAL** — all colors must use `var(--calder-*)` tokens |

### 1.11 Borders / Radii / Shadows

| Field | Value |
|---|---|
| **Concern** | Hardcoded border/radius/shadow values |
| **Current file(s)** | `calder-base.css.liquid` lines 175–183 (`--calder-radius-*`, `--calder-border-*`), lines 145–158 (`--calder-shadow-*`) |
| **Current selector(s)** | CSS variables |
| **Conflict** | Collection uses `border-radius: 8px`, `4px`, `2px` instead of `var(--calder-radius-*)`. Product uses `border-radius: 4px` (calder-product.css line 133) instead of `var(--calder-radius-sm)` at least once. Collection uses hardcoded `box-shadow: 0 4px 16px rgba(...)` and `box-shadow: 0 0 0 1px #C2A48A`. |
| **Affected pages** | Collection (category nav tiles, help CTA, pagination), product (gallery image) |
| **Chosen authority** | **GLOBAL** — use `var(--calder-radius-*)` and `var(--calder-shadow-*)` |

---

## 2. Duplicate Rules

| # | Rule | File A | File B | Notes |
|---|---|---|---|---|
| 1 | Dark header (`.hdr-wrap .hdr`) | `home.css.liquid` L11–55 | — | No duplicate itself, but should be global |
| 2 | Dark footer (`.page-footer`) | `home.css.liquid` L1807–1822 | — | No duplicate itself, but should be global |
| 3 | Button primary | `calder-base.css.liquid` L335–346 (`.calder-btn--primary`) | `home.css.liquid` L218–245 (`.home-hero__btn-primary`) | Same gradient, same radius, same hover effect |
| 4 | Button outline | `calder-base.css.liquid` L359–371 (`.calder-btn--outline`) | `home.css.liquid` L250–278 (`.home-hero__btn-secondary`) | Same glassmorphism, same hover |
| 5 | Eyebrow | `calder-base.css.liquid` L238–246 | `home.css.liquid` L174–182, L1068–1076, L1278–1286, L1376–1384, L1485–1493, L1559–1567; `collection.css` L81–89; `calder-product.css` L69–77 | 9 copies of the same 6-rule block |
| 6 | Select control | `calder-base.css.liquid` L397–417 (`.calder-select`) | `home.css.liquid` L707–727 (`.hf-fitment__select`) | Same appearance, same SVG arrow, different variable names |
| 7 | Input control | `calder-base.css.liquid` L435–453 (`.calder-input`) | `home.css.liquid` L1758–1777 (`.home-newsletter__input`) | Nearly identical styling |
| 8 | Container width | `calder-base.css.liquid` L162–167 (`--calder-content-max-width`) | `collection.css` L66, L194, L211 (`width: min(calc(100% - 48px), ...)`) | Same intent, three inline copies |
| 9 | CTA btn (gold bg) | `home.css.liquid` L1309–1336 (`.home-customize__cta`), L1650–1675 (`.home-gallery__cta-btn`), L1779–1800 (`.home-newsletter__submit`) | `calder-base.css.liquid` L335–346 (`.calder-btn--primary`) | Each homepage section duplicates the gold-gradient button |
| 10 | Price font/size/color | `calder-base.css.liquid` L531–552 (`.calder-card__price .price`) | `home.css.liquid` L867–874 (`.hf-fitment .fitment-finder__result-price`) | Hardcoded font assignments in fitment results |
| 11 | Border color `#e8e8e8` | `calder-base.css.liquid` L181 (`--calder-border-color`) | `collection.css` L382 (`.sidebar-block` border-bottom) | Collection hardcodes instead of using the variable |
| 12 | Font vars (`--calder-ui-font`, etc.) | `calder-base.css.liquid` L225–231 | `home.css.liquid` L36, L44, L52, L70, et al. | Homepage uses the vars correctly; collection does not |
| 13 | `.btn--primary` in fitment results | `home.css.liquid` L903–919 (`.hf-fitment .fitment-finder__results-action .btn--primary`) | `home.css.liquid` L1027–1043 (`.home-fitment .fitment-finder__results-action .btn--primary`) | Two different `.btn--primary` overrides for fitment results (one `--hf-*`, one `--calder-*`) |
| 14| Section container max-width | Multiple homepage sections each have their own `max-width: var(--calder-content-max-width); margin: 0 auto; padding: 0 var(--calder-gutter)` | `home.css.liquid` L1055–1059, L1366–1370, L1474–1478, L1546–1550 | Block repeated 4x (signature, engineering, process, gallery) |

---

## 3. Lumia Inheritance

These Lumia default CSS rules leak into Calder pages and must be overridden or suppressed:

| # | Selector | File | Leak Description |
|---|---|---|---|
| 1 | `.hdr-wrap .hdr` (all children) | `header.css` (2131 lines) | White background, dark text, Lumia button styling — visible on non-homepage Calder pages |
| 2 | `.page-footer` (all children) | `footer.css` | Light footer with dark text — visible on non-homepage Calder pages |
| 3 | `.prd-grid .col > .prd` | `style.css` | Lumia product cards in collection grid instead of `.calder-card` |
| 4 | `.form-select-wrap select` | `style.css` | Light Lumia select dropdown in collection sort toolbar |
| 5 | `.pagination` (all children) | `style.css` | Lumia pagination instead of Calder-styled |
| 6 | `.card-total`, `.cart-table-*`, `.block-accordion` | `style.css` (cart rules) | Entire cart uses Lumia default styling — no Calder theming |
| 7 | `.btn`, `btn--*` | `style.css` | Lumia button classes used in fitment results and collection |
| 8 | `#filterColumn`, `.sidebar-block`, `.filter-col-content` | `style.css` | Lumia filter rail structure — collection.css overrides some but Lumia color/font leaks remain |
| 9 | `.breadcrumbs` | `style.css` | Product page overrides; collection may show Lumia breadcrumbs |
| 10 | `.holder`, `.h1-style`, `.title-wrap` | `style.css` | Lumia section heading wrappers — homepage overrides but other pages may not |

---

## 4. Global vs Local Matrix

| ID | Rule / Discrepancy | Current Source | Pages Affected | Classification | Target Source | Action |
|---|---|---|---|---|---|---|
| G-001 | Header dark background | `home.css.liquid` L11–22 | All non-homepage | **GLOBAL** | `calder-base.css.liquid` | Move `.calder-site .hdr-wrap .hdr` gradient, border, height, backdrop-filter |
| G-002 | Header nav font/color | `home.css.liquid` L35–55 | All non-homepage | **GLOBAL** | `calder-base.css.liquid` | Move `.mmenu`, `.mmenu a`, hover state |
| G-003 | Header inline links | `home.css.liquid` L57–81 | All non-homepage | **GLOBAL** | `calder-base.css.liquid` | Move `.hdr-inline-link`, cart count, icons |
| G-004 | Header fitment CTA | `home.css.liquid` L85–113 | All non-homepage | **GLOBAL** | `calder-base.css.liquid` | Move `.fitment-cta` button |
| G-005 | Footer dark background | `home.css.liquid` L1807–1822 | All non-homepage | **GLOBAL** | `calder-base.css.liquid` | Move `.page-footer` gradient, text color, link hover |
| G-006 | Hero button (primary) | `home.css.liquid` L218–245 | Homepage hero only | **COMPONENT** | `calder-base.css.liquid` | Replace `.home-hero__btn-primary` HTML with `.calder-btn.calder-btn--primary`; delete custom CSS |
| G-007 | Hero button (outline) | `home.css.liquid` L250–278 | Homepage hero only | **COMPONENT** | `calder-base.css.liquid` | Replace with `.calder-btn.calder-btn--outline`; delete custom CSS |
| G-008 | Collection button (primary) | `collection.css` L726–747 | Collection help CTA | **COMPONENT** | `calder-base.css.liquid` | Replace with `.calder-btn.calder-btn--primary`; delete custom CSS |
| G-009 | Collection button (secondary) | `collection.css` L749–770 | Collection help CTA | **COMPONENT** | `calder-base.css.liquid` | Replace with `.calder-btn.calder-btn--outline`; delete custom CSS |
| G-010 | Product add-to-cart | `calder-product.css` L500–528 | Product page | **COMPONENT** | `calder-base.css.liquid` | Replace with `.calder-btn.calder-btn--primary`; delete custom CSS |
| G-011 | Product secondary actions | `calder-product.css` L537–558 | Product page | **COMPONENT** | `calder-base.css.liquid` | Replace with `.calder-btn.calder-btn--sm` or text link |
| G-012 | Container width (collection hero) | `collection.css` L66 | Collection | **GLOBAL** | `calder-base.css.liquid` | Use `.calder-container` class |
| G-013 | Container width (collection fitment) | `collection.css` L194 | Collection | **GLOBAL** | `calder-base.css.liquid` | Use `.calder-container` class |
| G-014 | Container width (category nav) | `collection.css` L211 | Collection | **GLOBAL** | `calder-base.css.liquid` | Use `.calder-container` class |
| G-015 | Product container | `calder-product.css` L60–66 | Product page | **GLOBAL** | `calder-base.css.liquid` | Use `.calder-container` class |
| G-016 | Collection eyebrow | `collection.css` L81–89 | Collection hero | **GLOBAL** | `calder-base.css.liquid` | Apply `.calder-eyebrow` class in HTML; delete CSS |
| G-017 | Homepage section eyebrows (×6) | `home.css.liquid` L174, L1068, L1278, L1376, L1485, L1559 | Homepage sections | **GLOBAL** | `calder-base.css.liquid` | Change HTML class to `.calder-eyebrow`; delete 6× duplicate CSS |
| G-018 | Product eyebrow redeclaration | `calder-product.css` L69–77 | Product page | **GLOBAL** | Remove from product CSS | Conflicts with base's `.calder-eyebrow` (`letter-spacing` differs: 1.8px vs 2.5px) |
| G-019 | Collection heading font/color | `collection.css` L91–99 | Collection hero | **GLOBAL** | `calder-base.css.liquid` | Apply `.calder-h1` or use `var(--calder-*)`; replace hardcoded `#ffffff` |
| G-020 | Collection body font/color | `collection.css` L105–112 | Collection hero | **GLOBAL** | `calder-base.css.liquid` | Apply `.calder-body` or use `var(--calder-*)` |
| G-021 | Fitment select control | `home.css.liquid` L707–743 | Homepage fitment | **GLOBAL** | `calder-base.css.liquid` | Replace HTML with `<select class="calder-select">`; delete duplicate CSS |
| G-022 | Newsletter input | `home.css.liquid` L1758–1777 | Newsletter | **GLOBAL** | `calder-base.css.liquid` | Replace HTML with `<input class="calder-input">`; delete duplicate CSS |
| G-023 | Collection sort select | `collection.css` L528–545 | Collection toolbar | **GLOBAL** | `calder-base.css.liquid` | Replace HTML with `<select class="calder-select">`; delete Lumia overrides |
| G-024 | Hardcoded `#C2A48A` in collection | `collection.css` multiple lines | Collection | **GLOBAL** | `calder-base.css.liquid` | Replace with `var(--calder-gold)` |
| G-025 | Hardcoded `#ffffff` in collection | `collection.css` multiple lines | Collection | **GLOBAL** | `calder-base.css.liquid` | Replace with `var(--calder-white)` |
| G-026 | Hardcoded `#0E2A3E` in collection | `collection.css` multiple lines | Collection | **GLOBAL** | `calder-base.css.liquid` | Replace with `var(--calder-navy)` |
| G-027 | Hardcoded `#e8e8e8` border in collection | `collection.css` L382 | Collection | **GLOBAL** | `calder-base.css.liquid` | Replace with `var(--calder-border-color)` |
| G-028 | Hardcoded `#ddd` `#ccc` `#f9f9f9` in collection | `collection.css` multiple lines | Collection | **GLOBAL** | `calder-base.css.liquid` | Replace with appropriate `--calder-*` variables |
| G-029 | Hardcoded `#555` `#666` `#999` in collection | `collection.css` multiple lines | Collection filter rail | **GLOBAL** | `calder-base.css.liquid` | Replace with `--calder-muted` or `--calder-gray-*` |
| G-030 | Collection border-radius hardcoded | `collection.css` multiple lines | Collection | **GLOBAL** | `calder-base.css.liquid` | Replace with `var(--calder-radius-*)` |
| G-031 | Collection box-shadow hardcoded | `collection.css` L237, L243 | Collection | **GLOBAL** | `calder-base.css.liquid` | Replace with `var(--calder-shadow-*)` |
| G-032 | `--hf-*` variables | `home.css.liquid` L923–933 | Homepage fitment | **PAGE** | `home.css.liquid` | Replace `--hf-*` fallbacks with direct `--calder-*` usage; delete `:root { --hf-* }` block |
| G-033 | Fitment CTA button | `home.css.liquid` L751–792 | Homepage fitment | **COMPONENT** | `calder-base.css.liquid` | Replace with `.calder-btn--secondary` or outline variant |
| G-034 | Section padding values | `home.css.liquid` L1050, L1362, L1469, L1541 | Homepage sections | **PAGE** | `home.css.liquid` | Use `var(--calder-section-py)` but allow unique composition values |
| G-035 | Collection hero button bg hardcoded | `collection.css` L733, L744 | Collection help CTA | **GLOBAL** | `calder-base.css.liquid` | Use `var(--calder-gold)` and `var(--calder-slate)` instead of `#C2A48A` and `#b39175` |
| G-036 | Pagination hardcoded colors | `collection.css` L589–642 | Collection | **GLOBAL** | `calder-base.css.liquid` | Use `--calder-*` variables |
| G-037 | Filter sidebar border/color hardcoded | `collection.css` L381–460 | Collection | **GLOBAL** | `calder-base.css.liquid` | Use `--calder-*` variables |
| G-038 | Cart — zero Calder styling | `cart-page.css` entire file | Cart | **DEFERRED** | `calder-base.css.liquid` or `cart.css` | Cart needs full redesign using Calder tokens; requires template changes |
| G-039 | Nav font globally | `home.css.liquid` L35–41 | All pages | **GLOBAL** | `calder-base.css.liquid` | Move `.mmenu` font-family/size/weight/transform/letter-spacing |
| G-040 | Homepage customize CTA button | `home.css.liquid` L1309–1336 | Homepage | **COMPONENT** | `calder-base.css.liquid` | Replace with `.calder-btn--primary` |
| G-041 | Homepage gallery CTA button | `home.css.liquid` L1650–1675 | Homepage | **COMPONENT** | `calder-base.css.liquid` | Replace with `.calder-btn--secondary` |
| G-042 | Newsletter submit | `home.css.liquid` L1779–1800 | Homepage | **COMPONENT** | `calder-base.css.liquid` | Replace with `.calder-btn--primary` |
| G-043 | Product card in collection grid | `collection.css` L350–367 | Collection | **CONTENT** | Liquid template | The `<calder-product-card>` component should use `.calder-card` class structure |
| G-044 | Product page price font | `calder-product.css` L431–437 | Product page | **GLOBAL** | `calder-base.css.liquid` | Use `.calder-price--lg` or `--md` class |
| G-045 | Product UPC/sku badges | `calder-product.css` L239–250 | Product page | **PAGE** | Keep in product CSS | This is product-page-specific composition |
| G-046 | Engineering stats cards | `home.css.liquid` L1892–1933 | Homepage | **PAGE** | Keep in `home.css.liquid` | Section-specific composition |
| G-047 | Tab carousel standard | `home.css.liquid` L1843–1885 | Homepage | **PAGE** | Keep in `home.css.liquid` | Lumia component override specific to homepage |
| G-048 | Vertical slider standard | `home.css.liquid` L1939–1980 | Homepage | **PAGE** | Keep in `home.css.liquid` | Lumia component override specific to homepage |
| G-049 | Brand ticker | `home.css.liquid` L1829–1836 | Homepage | **PAGE** | Keep in `home.css.liquid` | Lumia component override specific to homepage |
| G-050 | Collection help CTA decorative | `collection.css` L772–791 | Collection | **PAGE** | Keep in `collection.css` | Composition-specific |
| G-051 | Filter checkbox input | `collection.css` L446–454 | Collection | **GLOBAL** | `calder-base.css.liquid` | Move canonical checkbox styling to base |
| G-052 | Filter rail toggle/clear buttons | `collection.css` L462–477, L503–514 | Collection | **COMPONENT** | `calder-base.css.liquid` | Replace with `.calder-btn` variants |
| G-053 | View mode toggles | `collection.css` L553–581 | Collection | **PAGE** | Keep in `collection.css` | Collection-specific UI pattern |
| G-054 | Homepage fitment results `.btn--primary` | `home.css.liquid` L903, L1027 | Homepage fitment | **COMPONENT** | `calder-base.css.liquid` | Replace with `.calder-btn--secondary` |
| G-055 | Product breadcrumbs | `calder-product.css` L80–99 | Product page | **PAGE** | Keep in product CSS | Composition-specific |
| G-056 | Qty selector | `calder-product.css` L447–497 | Product page | **PAGE** | Keep in product CSS (consider moving to base as `.calder-qty`) | May become a Calder primitive |

---

## Summary

### Immediate GLOBAL candidates (move to calder-base.css.liquid)
Header (G-001–004), Footer (G-005), Container (G-012–015), Eyebrow unification (G-016–018), Fitment select (G-021), Newsletter input (G-022), Collection sort select (G-023), Nav font (G-039)

### Immediate COMPONENT candidates (use existing `.calder-btn` primitives in HTML)
G-006, G-007, G-008, G-009, G-010, G-011, G-040, G-041, G-042, G-052, G-054

### DEFERRED
Cart CSS (G-038) — requires template restructuring and cannot be fixed via CSS-only changes