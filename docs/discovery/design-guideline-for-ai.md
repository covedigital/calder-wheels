# Calder Wheels — Design Guideline for AI Design Tool

> **Purpose**: Design guideline document to feed into AI design tools (Google Stitch, Relay, Framer AI, v0.dev) for generating design layouts and components consistent with the Calder Wheels brand.
> **Source**: `brand/assets/` (logos, fonts, color palette), `brand/brand.md`, `docs/discovery/inspiration-analysis.md`
> **Note**: Two PDFs (`Calder Brand Guidelines.pdf`, `Calder Color Palette.pdf`) exist in `brand/assets/` but could not be read — extract hex values and typography specs from those if more precise than what's below.

---

## Brand Identity

| Attribute | Value |
|-----------|-------|
| Name | Calder Wheels |
| Tagline | TBD |
| Positioning | Build-to-order forged/aftermarket wheels — configurable center × barrel × hardware finishes |
| Voice | Premium, performance-oriented, confident, terse |
| Target | Enthusiasts + dealer/B2B accounts, luxury SUV & European vehicles (20–26" wheels) |

---

## Logo System

Three tiers of logo lockups exist as SVGs (Adobe Illustrator originals):

| Tier | Description | File Pattern |
|------|-------------|--------------|
| **Primary** | Circular mark (720×720) — stylized "C" / wheel-form outer ring with C-A-L-D-E-R letterforms built into the interior shape | `Calder-Primary-Final_Primary - *` |
| **Secondary** | Horizontal layout (720×232) — compact mark + wordmark side by side | `Calder-Primary-Final_Secondary - *` |
| **Tertiary** | Stacked layout (720×280) — mark above "CALDER WHEELS" typeset in Medium Blue | `Calder-Primary-Final_Tertiary - *` |

### Color Variants (apply across all three tiers)

| Suffix | Colors Used | Best On |
|--------|------------|---------|
| `-K` | Black `#231F20` + White `#FFFFFF` text | Light/white backgrounds |
| `-W` | White `#FFFFFF` + Cream `#F2EFE9` text | Dark/black backgrounds |
| `-N` | (Night — likely black/white inverted) | Dark backgrounds |
| `-S` | (Slate — single color) | Monochrome applications |
| `2C - Blues` | Navy `#0E2A3E` + Medium Blue `#1E4C68` | Light backgrounds, corporate |
| `2C - Gold Cream` | Gold `#C2A48A` + Cream `#F2EFE9` | Dark/luxury backgrounds |
| `2C - Slate Gold` | Slate `#876E5A` + Gold `#C2A48A` | Warm/earthy backgrounds |
| `2C - Cream Gold` | Cream `#F2EFE9` + Gold `#C2A48A` | Dark backgrounds |

### Logo Usage Rules
- On dark backgrounds: use **-W** (white) or **2C - Gold Cream**
- On light backgrounds: use **-K** (black) or **2C - Blues**
- Never distort, recolor, or add effects to logo
- Minimum clear space: 10% of logo width on all sides
- Use **Primary** for app icons, favicons, square spaces
- Use **Secondary** for navigation bars, footers, horizontal spaces
- Use **Tertiary** for hero sections, landing pages, splash screens

---

## Color Palette

Extracted from SVG class definitions across all logo files:

| Color Name | Hex | Role | Usage |
|-----------|-----|------|-------|
| **Navy** | `#0E2A3E` | Primary brand color | Headers, buttons, key UI, dark backgrounds |
| **Medium Blue** | `#1E4C68` | Secondary brand color | Accents, secondary buttons, hover states |
| **Gold** | `#C2A48A` | Accent/warm metallic | CTAs, highlights, badges, premium indicators |
| **Slate** | `#876E5A` | Warm neutral | Secondary text, borders, muted UI |
| **Cream** | `#F2EFE9` | Light neutral | Cards, surfaces on dark, alt backgrounds |
| **Near Black** | `#231F20` | Darkest tone | Primary text, page backgrounds |
| **White** | `#FFFFFF` | Pure light | Text on dark, overlays |

### Extended Palette (for web implementation)

| Role | Hex | Notes |
|------|-----|-------|
| Page background | `#0A0A0A` | Near-black (from inspiration analysis) |
| Surface/cards | `#1A1A1A` | Panel backgrounds |
| Text primary | `#FFFFFF` | On dark backgrounds |
| Text secondary | `#888888` | Muted copy |
| Divider/border | `#2A2A2A` | Subtle separation |
| Error/stockout | `#8B0000` | Dark red for unavailability states |
| Success | `#2D6A4F` | Green for "in stock / available to build" |

### Color Application Rules
- **Dark mode is default**: page bg `#0A0A0A` → surfaces `#1A1A1A` → borders `#2A2A2A`
- Gold (`#C2A48A`) is the premium accent — use sparingly on CTAs, section numbers, badges
- Navy (`#0E2A3E`) and Medium Blue (`#1E4C68`) are the corporate anchor — use for header backgrounds, primary buttons
- Cream (`#F2EFE9`) works as an alternative light surface for high-contrast photography sections
- Never use pure black (`#000000`) — always use `#0A0A0A` or `#231F20`

---

## Typography

### Font Files (in `brand/assets/fonts/`)

| Font | File | Weight | Likely Role |
|------|------|--------|-------------|
| **Facundo** | `Facundo-SemiBold.otf` | SemiBold (650) | Display headings, hero titles, section numbers — serif, premium editorial feel |
| **Garet** | `Garet-Book.otf` | Book (350) | Body text, product descriptions — clean sans-serif |
| **Garet** | `garet-bold.otf` | Bold (700) | Subheadings, navigation, buttons — clean sans-serif |
| **Poppins** | `Poppins-Light.ttf` | Light (300) | Supplementary UI, fine print — geometric sans |
| **Poppins** | `Poppins-Bold.ttf` | Bold (700) | Supplementary headings, badges — geometric sans |

### Recommended Typography System

| Element | Font | Weight | Size | Letter Spacing | Case |
|---------|------|--------|------|----------------|------|
| Hero heading | Facundo | SemiBold | 64px+ | -0.02em | Sentence |
| Section number (§ 01) | Facundo | SemiBold | 14px | +0.04em | Uppercase |
| Section heading | Facundo or Garet Bold | Bold | 36–48px | -0.02em | Sentence |
| Subheading | Garet Bold | Bold | 18–24px | +0.01em | Sentence |
| Body text | Garet Book | Book | 14–16px | 0em | Normal |
| Navigation / buttons | Garet Bold | Bold | 12–14px | +0.02em | Uppercase |
| Product name / nickname | Garet Bold | Bold | 20px | 0em | Uppercase |
| Caption / fine print | Poppins Light | Light | 11–12px | +0.01em | Normal |
| Badges / tags | Garet Bold | Bold | 10px | +0.03em | Uppercase |
| Price | Garet Bold | Bold | 18px | 0em | Normal |

### Font Loading Priority
1. **Garet** (primary UI — body, nav, buttons) — load from font files
2. **Facundo** (editorial/display — hero, section headings) — load from font files
3. **Poppins** (fallback — fine print, supplementary) — Google Fonts CDN

---

## Logo Placement Per Page

| Page/Layout | Logo Tier | Color Variant | Position |
|-------------|-----------|--------------|----------|
| Homepage hero | Tertiary | 2C - Gold Cream (gold + cream on dark) | Top-left, large |
| Navigation bar | Secondary | W (white on dark nav bg) | Left, medium |
| Footer | Secondary | W or Gold Cream | Center or left, medium |
| Configurator | Primary | W or Gold Cream | Top-left, small |
| Fitment finder | Primary | W | Top of widget |
| Dealer portal login | Tertiary | 2C - Blues (navy + blue on light) | Center above form |
| Mobile app icon | Primary | 2C - Gold Cream | Single-color square |
| Favicon | Primary | W or K (depending on theme) | 16×16 / 32×32 cropped |

---

## Component Design System

| Component | Visual | Styling |
|-----------|--------|---------|
| **Primary Button** | Gold bg, dark text | `background: #C2A48A; color: #231F20; font: Garet Bold 14px uppercase; border-radius: 2px; padding: 14px 36px;` |
| **Secondary Button** | Outlined, white text | `background: transparent; color: #FFFFFF; border: 1px solid #FFFFFF; font: Garet Bold 14px uppercase; border-radius: 2px; padding: 14px 36px;` |
| **Tertiary Button** | Ghost, gold text | `background: transparent; color: #C2A48A; font: Garet Bold 12px uppercase; border: none;` |
| **Card** | Dark surface | `background: #1A1A1A; border: 1px solid #2A2A2A; border-radius: 4px; padding: 24px;` |
| **Input Field** | Dark input | `background: #0A0A0A; border: 1px solid #2A2A2A; color: #FFFFFF; placeholder: #888888; border-radius: 2px; padding: 12px 16px;` |
| **Dropdown / Select** | Dark input + caret | Same as input field, with gold custom dropdown arrow |
| **Badge / Tag** | Small uppercase | `background: #C2A48A or #1A1A1A; color: #231F20 or #FFFFFF; font: Garet Bold 10px uppercase; padding: 4px 8px; border-radius: 2px;` |
| **Section Number** | Editorial numeral | `color: #C2A48A; font: Facundo SemiBold 14px; letter-spacing: 0.04em;` style: "§ 01" |
| **Divider** | Subtle rule | `height: 1px; background: #2A2A2A;` |
| **Swatch (configurator)** | Circular color chip | `width: 25px; height: 25px; border-radius: 50%; border: 2px solid transparent;` Selected: `border-color: #C2A48A;` |
| **Trust Marker** | Inline spec | `color: #888888; font: Poppins Light 12px; letter-spaced;` separated by `·` |
| **Gold Accent / Highlight** | Warm metallic | Always `#C2A48A` — used for CTAs, section numbers, selected states, premium indicators |
| **Availability Indicator** | Dot + text | Green: `#2D6A4F` + "In Stock — Ready to Build" / Red: `#8B0000` + "Configure Differently" |

---

## Photography Direction

| Type | Style | Background |
|------|-------|------------|
| Hero vehicle shot | Full-bleed, dramatic low lighting, luxury SUV, wheel visible | Dark/black, edge-lit |
| Wheel solo shot | Product photography, studio quality | Dark gradient (#0A0A0A → #1A1A1A) or white (#F2EFE9) |
| Finish matrix | Every finish photographed on every wheel | White or light cream gradient |
| Customer builds | Unedited real-world, natural lighting, various angles | Real-world settings |
| Manufacturing / factory | Editorial, machinery, raw materials, CNC, craftspeople | Industrial lighting |
| Component detail | Macro/close-up, single edge light | Near-black background |

---

## Layout Patterns

| Pattern | Description |
|---------|-------------|
| Full-bleed hero | 100vh, vehicle imagery full-width, text overlay centered or bottom-aligned |
| Section-per-feature | One scroll = one idea. Full viewport or near-full sections. |
| Numbered editorial | "§ 01" through "§ N" gold numerals above each section heading |
| Two-panel split | 50/50 horizontal split: image left / text right (or reverse) |
| Product grid | 3-column grid, 2 rows for 6 designs, cards with image + nickname + spec |
| Masonry gallery | Uneven grid for customer-build photography |
| Horizontal scroll | Multi-panel scrolling for manufacturing authority content |
| Dashboard panels | Dark cards with metric values and data tables (dealer portal only) |

---

## Page-Specific Layout Compositions

See `docs/discovery/ai-design-prompt.md` for detailed per-page layout prompts including:
1. Homepage Hero
2. Catalog / Series Grid
3. Vehicle Fitment Finder
4. Wheel Configurator
5. Feature Spotlight Section
6. Customer Build Gallery
7. Newsletter / "The List"
8. Manufacturing Authority Section
9. Dealer Portal (B2B)
10. Footer

---

## Design Tool Setup Instructions

### Google Stitch (or equivalent AI design tool)

**Step 1 — Brand setup:**
- Upload logos from `brand/assets/logos/SVGs/`:
  - Primary: `Calder-Primary-Final_Primary - 2C - Gold Cream.svg` (dark bg use)
  - Primary: `Calder-Primary-Final_Primary -K.svg` (light bg use)
  - Secondary: `Calder-Primary-Final_Secondary - W.svg`
  - Tertiary: `Calder-Primary-Final_Tertiary - 2C - Gold Blue.svg`
- Upload fonts from `brand/assets/fonts/`:
  - `Facundo-SemiBold.otf`
  - `Garet-Book.otf`
  - `garet-bold.otf`
  - `Poppins-Light.ttf`
  - `Poppins-Bold.ttf`

**Step 2 — Color palette input:**
```
Primary brand: #0E2A3E (Navy)
Secondary brand: #1E4C68 (Medium Blue)  
Accent: #C2A48A (Gold)
Warm neutral: #876E5A (Slate)
Light neutral: #F2EFE9 (Cream)
Near black: #231F20
White: #FFFFFF
Page background: #0A0A0A
Surface: #1A1A1A
Border: #2A2A2A
Text secondary: #888888
Error: #8B0000
Success: #2D6A4F
```

**Step 3 — Typography map:**
```
Display (h1): Facundo SemiBold, 64px, -0.02em tracking
Heading (h2): Facundo SemiBold or Garet Bold, 36-48px, -0.02em tracking
Subheading (h3): Garet Bold, 18-24px, +0.01em tracking
Body: Garet Book, 14-16px, 0em
Navigation: Garet Bold, 12-14px uppercase, +0.02em tracking
Fine print: Poppins Light, 11-12px, +0.01em
```

**Step 4 — Reference URLs:**
- `bespokerev.com` — design inspiration (dark, editorial, photography-led)
- `vossenwheels.com` — catalog structure, series taxonomy, finish matrix

**Step 5 — Generate page by page:**
Start with Homepage Hero → Catalog Grid → Fitment Finder → Configurator → Feature Spots → Gallery → Newsletter → Manufacturing → Dealer Portal → Footer