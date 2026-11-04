# 06 — Gallery UX/UI Specification (low fidelity)

> Design authority: existing Calder/Lumia dark-luxury system (navy/cream surfaces, gold eyebrows, Facundo headings, Garet UI — per guardrails §16). No new visual language invented. Wireframes are text-ASCII; no markup changed in this audit.

## Layout decisions

| Breakpoint | Grid | Card image ratio | Filters |
|---|---|---|---|
| Desktop ≥1024 | 4 columns (setting exists), 24px gutter | **3:2 landscape** (matches Vossen discipline; vehicle photography is landscape) | Horizontal row above grid |
| Tablet 768–1023 | 3 columns | 3:2 | Same row, wraps to 2 rows |
| Mobile <768 | 2 columns (setting exists) | 3:2 | Collapsed `<details>`-style "Filters" disclosure + sticky sort |

Image sizing: `image_url` at 2× card width, `srcset` 400/600/850, `loading="lazy"` except first row; explicit width/height attrs to prevent CLS. Hero/LCP image on detail page: `loading="eager"`, `fetchpriority="high"`.

## Vehicle Gallery — listing wireframe

```
┌──────────────────────────────────────────────────────┐
│ EYEBROW: GALLERY            (existing hero header)    │
│ H1: Vehicle Gallery                                  │
│ sub: Real-world builds…                                │
│ [VEHICLE GALLERY•] [WHEEL GALLERY]      ← tab links   │
├──────────────────────────────────────────────────────┤
│ [🔍 Search gallery____________]  Make▾ Model▾ Wheel▾   │
│ Diameter▾ Finish▾ Bolt▾ Series▾ Style▾  [RESET]      │
│                                    SORT BY ▾          │
├──────────────────────────────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐         │
│ │ photo  │ │ photo  │ │ photo  │ │ photo  │  3:2     │
│ │ ▣ 7    │ │ ▣ 5    │ │        │ │        │  photo-  │
│ ├────────┤ ├────────┤ │        │ │        │  count    │
│ │2024 Cadillac│ …  │ ├────────┤ ├────────┤           │
│ │CLM-01 · 24" │     │ │        │ │        │           │
│ └────────┘ └────────┘ └────────┘ └────────┘          │
│         [1] [2] [3] …  numbered pagination           │
├──────────────────────────────────────────────────────┤
│ Find Your Perfect Fitment  [Find Your Fit →]        │
└──────────────────────────────────────────────────────┘
```
Hover: image scale 1→1.04 (600ms ease), overlay title brightens, gold "→" slides. `@media (prefers-reduced-motion: reduce)` disables transforms.

Card text: **year+make+model** (title), **design code · diameter · finish** (meta line), series eyebrow. All from metaobject fields.

## Wheel Gallery — listing wireframe

```
┌──────────────────────────────────────────────────────┐
│ H1: Wheel Gallery · tabs (same header system)         │
│ [🔍 Search]  Design▾ Diameter▾ Finish▾ Bolt▾ Series▾  │
│ Construction▾ Style▾ [RESET]  SORT ▾                 │
│ ┌──────────────┬──────────────┬───────────────────┐ │
│ │   photo      │    photo      │     photo         │ │
│ │ (studio)     │               │                   │ │
│ ├──────────────┼──────────────┼───────────────────┤ │
│ │ CLM-01       │ CLB-06        │ CLB-07            │ │
│ │ Forged Series│ Monoblock    │ …                 │ │
│ │ ●●●●● 5 finishes (swatch dots)                  │ │
│ │ [View Design →]                               │ │
│ └──────────────┴──────────────┴───────────────────┘ │
```
**One card per design (6)**, with finish swatch dots + "5 finishes" count. Click → gallery detail for that design OR direct "View Design" → PDP with default (or previewed) configuration preselected.

## Detail page (shared framework, `gallery_type`-aware)

```
┌──────────────────────────────────────────────────────┐
│ [ ◀ ] ┌────────────────────────────────┐ [ ▶ ]       │  ← 16:9 hero slider,
│       │        hero image 560px         │             │    LCP eager
│       └────────────────────────────────┘             │
│ thumbnails ▭ ▭ ▭ ▭ ▭   [⤢ Expand]  1/7               │
├──────────────────────────┬───────────────────────────┤
│ H1: 2024 Cadillac        │ WHEEL                      │
│ Escalade Premium Luxury  │ Design CLM-01 · 24"        │
│ breadcrumbs: Home /      │ Center: Gloss Black        │
│ Gallery / Vehicle / …    │ Barrel/Lip: Polished       │
│                          │ Hardware: Chrome           │
│                          │ Bolt: 5x120                │
├──────────────────────────┴───────────────────────────┤
│ [View This Configuration →]  ← PDP deep link,         │
│   preselected, NO stock/fitment implication +        │
│   microcopy: "Configuration shown for reference.     │
│   Availability and vehicle fitment confirmed at      │
│   checkout."                                          │
│ [Find Your Fit →]  [Speak With a Rep →]              │
├──────────────────────────────────────────────────────┤
│ SPECIFICATIONS (vehicle fields · wheel fields · tires)│
├──────────────────────────────────────────────────────┤
│ RELATED BUILDS (same make)  · OTHER DESIGNS (row of 4)│
└──────────────────────────────────────────────────────┘
```

- **Shared detail framework** for both types (already one section) — fields shown conditionally by `gallery_type`. No separate templates needed.
- Lightbox: fullscreen overlay, focus-trapped, `Esc` closes, arrow keys navigate, `aria-modal="dialog"`, returns focus to trigger.
- Video (optional P2): last slider slide, lazy poster + iframe.

## States
- **Loading skeletons:** not needed — all server-rendered Liquid (advantage of current architecture; do not add fetch spinners).
- **Empty — no content yet (new):** editorial empty state: "New builds are being photographed now. See every design in the Wheel Gallery →" (distinguishes from filter-empty; fixes BUG-03).
- **Empty — filtered:** "No builds match those filters. [Clear filters]" (keep current message + add working RESET link).
- **Error/not found:** existing `.cg-not-found` — keep, improve copy after BUG-05 fix.
- **CTA hierarchy:** 1) View This Configuration (primary, gold) 2) Find Your Fit 3) Speak With a Rep. On PDP itself, the existing 5-state inventory matrix (Add to Cart / Out of Stock–Inquiry / Request This Configuration / Request Build Availability / Check Availability) governs — gallery never asserts sellability.

## Accessibility requirements (implementation contract)
- Filter selects: one visible `<label>` per select (current rendered output shows doubled label text — "MakeMake" — fix source); RESET is a real `<button>`.
- Slider: `role="region"` + `aria-roledescription="carousel"`, `aria-live="polite"` counter, buttons with `aria-label`s.
- Focus states: visible gold outline (`outline: 2px`) on all interactive elements; never `outline: none`.
- Cards: single `<a>` wrapping the card; image `alt` from metaobject title.
- Contrast: overlay text on photos — scrim gradient to meet 4.5:1 (existing navy overlay pattern at 55% setting).