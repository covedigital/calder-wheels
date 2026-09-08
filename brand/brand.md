# Calder Wheels — Brand Guide

## Brand Identity
- **Brand Name**: Calder Wheels
- **Parent Company**: Cove Digital LLC (service provider)
- **Website/URL**: TBD
- **Tagline/Slogan**: TBD

## Positioning
- **Model**: Build-to-order forged/aftermarket wheels — configurable center × barrel × hardware finishes
- **Space**: Between boutique luxury (BespokeRev) and enterprise catalog (Vossen)
- **Differentiators** (neither reference brand has these):
  1. Vehicle fitment finder (Year → Make → Model → Generation/Trim)
  2. Live wheel configurator (finish composition, live preview)
  3. Dealer/B2B portal (tiered pricing, wholesale checkout)
- **Foundation**: Component inventory + BOM — the configurator is truthful because availability is computed from components

## Competitive Landscape (2026-08-15)

| Brand | Strength | Weakness |
|-------|----------|----------|
| **BespokeRev** | Ultra-minimal luxury, nicknamed designs, build-to-order messaging | No fitment finder, no configurator, no dealer portal, quote-only |
| **Vossen** | Series taxonomy, finish photography, dual galleries, dealer locator, engineering authority | No B2B portal, no fitment finder, no configurator, finished-stock model |

## Visual Identity

### Logo

Three logo tiers, each with multiple color variants (source: `brand/assets/logos/SVGs/`):

| Tier | Format | Description | File Pattern |
|------|--------|-------------|-------------|
| **Primary** | 720×720 square | Circular mark with stylized "C" / wheel-form outer ring, letterforms built into interior | `Calder-Primary-Final_Primary - *` |
| **Secondary** | 720×232 horizontal | Compact mark + wordmark side by side | `Calder-Primary-Final_Secondary - *` |
| **Tertiary** | 720×280 stacked | Mark above "CALDER WHEELS" typeset | `Calder-Primary-Final_Tertiary - *` |

**Color Variants:**

| Suffix | Colors | Best On |
|--------|--------|---------|
| `-K` | Black `#231F20` + White text | Light/white backgrounds |
| `-W` | White `#FFFFFF` + Cream `#F2EFE9` text | Dark/black backgrounds |
| `-S` | Single color slate | Monochrome |
| `2C - Blues` | Navy `#0E2A3E` + Medium Blue `#1E4C68` | Light backgrounds, corporate |
| `2C - Gold Cream` | Gold `#C2A48A` + Cream `#F2EFE9` | Dark/luxury backgrounds |
| `2C - Slate Gold` | Slate `#876E5A` + Gold `#C2A48A` | Warm/earthy backgrounds |
| `2C - Cream Gold` | Cream `#F2EFE9` + Gold `#C2A48A` | Dark backgrounds |

**Logo Usage Rules:**
- Dark backgrounds → use **-W** (white) or **2C - Gold Cream**
- Light backgrounds → use **-K** (black) or **2C - Blues**
- Never distort, recolor, or add effects
- Clear space: 10% of logo width on all sides
- Primary → favicons, app icons, square spaces
- Secondary → nav bars, footers, horizontal layout
- Tertiary → hero sections, splash screens

### Color Palette

| Color | Hex | Role | Usage |
|-------|-----|------|-------|
| Navy | `#0E2A3E` | Primary brand | Headers, buttons, key UI, dark backgrounds |
| Medium Blue | `#1E4C68` | Secondary brand | Accents, secondary buttons, hover states |
| Gold | `#C2A48A` | Accent/metallic | CTAs, highlights, badges, premium indicators |
| Slate | `#876E5A` | Warm neutral | Secondary text, borders, muted UI |
| Cream | `#F2EFE9` | Light neutral | Cards on dark, alt surfaces |
| Near Black | `#231F20` | Darkest brand tone | Primary text, page backgrounds |
| White | `#FFFFFF` | Pure light | Text on dark, overlays |

**Extended Web Palette:**

| Role | Hex | Notes |
|------|-----|-------|
| Page background | `#0A0A0A` | Near-black — dark mode default |
| Surface | `#1A1A1A` | Card/panel backgrounds |
| Text secondary | `#888888` | Muted copy |
| Border/divider | `#2A2A2A` | Subtle separation |
| Success/available | `#2D6A4F` | "In Stock — Ready to Build" |
| Error/stockout | `#8B0000` | Component unavailability |

**Rules:** Dark mode is default. Gold (`#C2A48A`) is the premium accent — use sparingly. Never use pure `#000000`.

## Typography

| Font | File | Weight | Role |
|------|------|--------|------|
| **Facundo** | `Facundo-SemiBold.otf` | SemiBold (650) | Display/headings — serif, premium editorial feel |
| **Garet** | `Garet-Book.otf` | Book (350) | Body text — clean sans-serif |
| **Garet** | `garet-bold.otf` | Bold (700) | Subheadings, nav, buttons |
| **Poppins** | `Poppins-Light.ttf` | Light (300) | Supplementary UI, fine print |
| **Poppins** | `Poppins-Bold.ttf` | Bold (700) | Supplementary headings, badges |

**Type Scale:**

| Element | Font | Weight | Size | Letter Spacing | Case |
|---------|------|--------|------|----------------|------|
| Hero heading | Facundo | SemiBold | 64px+ | -0.02em | Sentence |
| Section number (§ 01) | Facundo | SemiBold | 14px | +0.04em | Uppercase |
| Section heading | Facundo / Garet Bold | Bold | 36–48px | -0.02em | Sentence |
| Subheading | Garet Bold | Bold | 18–24px | +0.01em | Sentence |
| Body | Garet Book | Book | 14–16px | 0em | Normal |
| Nav / buttons | Garet Bold | Bold | 12–14px | +0.02em | Uppercase |
| Product nickname | Garet Bold | Bold | 20px | 0em | Uppercase |
| Caption / fine print | Poppins Light | Light | 11–12px | +0.01em | Normal |
| Badges / tags | Garet Bold | Bold | 10px | +0.03em | Uppercase |

**Load order:** Garet (primary UI) → Facundo (display) → Poppins (fallback, Google Fonts CDN).

## Brand Voice & Tone
- **Tone**: Premium, performance-oriented, confident, terse (BespokeRev model)
- **Key Attributes**: Build-to-order forged/aftermarket wheels, configurable finishes
- **Target Audience**: Enthusiasts + dealer/B2B accounts
- **Naming Convention**: Design nickname + code (e.g. `BR01 · MOB` style) humanizes configurable SKUs

## Brand Assets (File Paths)
- **Logos**: `brand/assets/logos/SVGs/` (primary source) and `brand/assets/logos/PNGs/` (raster fallback)
  - Primary: circular mark, 7 color variants
  - Secondary: horizontal lockup, 7 color variants
  - Tertiary: stacked wordmark, 6 color variants
- **Fonts**: `brand/assets/fonts/` — Facundo SemiBold, Garet Book + Bold, Poppins Light + Bold
- **Images**: `brand/assets/images/` — empty (pending)
- **Icons**: `brand/assets/icons/` — empty (pending)
- **Templates**: `brand/assets/templates/` — empty (pending)
- **Competitors**: `brand/assets/competitors/` — empty (pending)

## Usage Guidelines
- **Dark mode is default.** Page background `#0A0A0A`, surfaces `#1A1A1A`, text `#FFFFFF`.
- **Gold is the premium accent** — use on CTAs, section numbers, selected states, and badges only.
- **Logo on dark:** use white variant (-W) or gold/cream (2C - Gold Cream).
- **Logo on light:** use black variant (-K) or blues (2C - Blues).
- **Facundo for editorial impact** — hero headings, section markers, feature spotlights.
- **Garet for all UI** — navigation, buttons, body copy, product names, forms.
- **Poppins for fallback** — fine print, legal text, supplementary captions.
- **Photography-led layouts** — full-bleed vehicle shots, dramatic lighting, dark backgrounds.
- **Component design system** documented in `docs/discovery/design-guideline-for-ai.md`.
- **Page-by-page layout prompts** documented in `docs/discovery/ai-design-prompt.md`.

---

*Last updated: 2026-09-08 — Replaced all PENDING placeholders with actual brand assets data from SVG logos, font files, and color palette. Added logo system, color roles, typography scale, and usage guidelines.*
