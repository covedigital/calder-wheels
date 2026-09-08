---
name: Calder Atelier
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d0c5b5'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#998f80'
  outline-variant: '#4d4639'
  surface-tint: '#e5c27f'
  primary: '#e5c27f'
  on-primary: '#402d00'
  primary-container: '#c0a060'
  on-primary-container: '#4c3700'
  inverse-primary: '#745a22'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#ffb4a8'
  on-tertiary: '#690000'
  tertiary-container: '#ff7e6b'
  on-tertiary-container: '#7c0000'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdea1'
  primary-fixed-dim: '#e5c27f'
  on-primary-fixed: '#261900'
  on-primary-fixed-variant: '#5a430b'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#ffdad4'
  tertiary-fixed-dim: '#ffb4a8'
  on-tertiary-fixed: '#410000'
  on-tertiary-fixed-variant: '#920703'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-hero:
    fontFamily: Space Grotesk
    fontSize: 64px
    fontWeight: '600'
    lineHeight: 72px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '500'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.01em
  title-code:
    fontFamily: Space Grotesk
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.12em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '300'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '300'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.15em
  spec-numeral:
    fontFamily: Space Grotesk
    fontSize: 15px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4.5rem
  space-4xl: 6rem
  gutter: 1.5rem
  margin-mobile: 1.25rem
  margin-desktop: 3rem
  max-width: 1440px
---

## Brand & Style

This design system embodies bespoke luxury automotive engineering. The personality is uncompromising, disciplined, and mechanical—tailored for ultra-high-net-worth automotive connoisseurs and performance specialists. The interface reflects the precision of CNC billet machining and high-end automotive atelier aesthetics, prioritizing ultra-crisp technical data, stark negative space, and metallic warmth.

The aesthetic leans on **Editorial Dark Minimalism** anchored by **Precision Technical Brutalism**:
- Deep void-like canvases that let metallic surfaces, wheel offsets, and carbon-forged textures command attention.
- Architectural typographic rhythm punctuated by micro-index labeling (e.g., `§ 01`, `REV.04`, `ET+35`).
- Structural containment relying on disciplined hairlines, razor-sharp alignment grids, and zero-distraction atmospheric controls.

## Colors

The palette operates under a strict, near-monochrome mechanical hierarchy illuminated by warm metallic accents:

- **Canvas Background (`#0A0A0A`)**: Ground level of the application. An absolute dark environment designed to simulate deep studio lighting and low-reflective carbon environments.
- **Surface Elevation (`#141414` & `#1A1A1A`)**: Contextual containers and interactive panels. Used for modular vehicle configuration cards, technical data readouts, and tier separations.
- **Accent Gold (`#C0A060`)**: Warm metallic alloy tone reserved for primary calls to action, active spec states, vehicle clearance tolerances, and high-value status badges. Must not be overused; it acts as the master jeweler's mark.
- **Structural Borders (`#2A2A2A`)**: Hairline definition across every surface. No container blends directly into its neighbor without an explicit structural seam.
- **Typography Matrix**: Pure high-grade `#FFFFFF` for primary nomenclature and spec values; muted slate `#888888` for architectural metadata, captions, and dimensional callouts.
- **Alert / Restricted (`#8B0000`)**: Deep arterial red reserved for bespoke allocation sell-outs, engineering load warnings, and dimensional conflict markers.

## Typography

The typographic hierarchy pairs the geometric, technical edge of **Space Grotesk** with the refined, neutral balance of **Inter**.

- **Display & Headings**: Set in Space Grotesk with negative letter spacing (`-0.02em` to `-0.03em`) for a confident, monolithic presence. Titles use sentence case or confident title case.
- **Section Markers & Metadata**: Section headers and schematic indices (`title-code`, `label-caps`) are strictly uppercase Space Grotesk with expanded tracking (`+0.12em` to `+0.15em`), evoking engineering blueprints and atelier batch numbers.
- **Body Copy**: Standard reading passages use Inter at Light (`300`) or Regular (`400`) weight with a generous line-height of `1.6` for an airy, editorial feel that counterbalances the dense technical specs.
- **Numerals & Metrics**: Offsets, bolt patterns, and PCD measurements utilize Space Grotesk tabular figures for clean vertical alignment in spec sheets.

## Layout & Spacing

The layout is disciplined by a **12-column structural grid** referencing architectural floorplans and high-precision technical blueprints:

- **Desktop (≥ 1280px)**: 12 columns, 24px gutters, 48px outer page margin, constrained to a maximum width of `1440px` for consistent viewing on ultrawide automotive studio displays.
- **Tablet (768px - 1279px)**: 8 columns, 16px gutters, 32px outer page margin.
- **Mobile (< 768px)**: 4 columns, 12px gutters, 20px outer margin. Side-by-side spec layouts stack vertically into sequential build stages.
- **Vertical Rhythm**: Micro spacings (`4px` to `16px`) cluster technical values with their respective labels. Generous macro gaps (`48px` to `96px`) bracket configuration modules, engineering diagrams, and showcase photometrics.

## Elevation & Depth

This system intentionally rejects ambient blur shadows and soft drop shadows in favor of **Structural Tonal Layers** bounded by **Precision Hairlines**:

1. **Floor Level (`#0A0A0A`)**: The infinite dark void; base background for 3D visualizers and large photographic spreads.
2. **Elevated Stage (`#141414`)**: Secondary utility panels, configuration sidebars, and spec matrices. Separated from the base solely via `1px solid #2A2A2A`.
3. **Interactive Surface (`#1A1A1A`)**: Active cards, selected finishes, and input containers.
4. **Focused State / Selection Layer**: When a surface is actively targeted (e.g., chosen wheel profile or custom forging alloy), it gains a `1px solid #C0A060` stroke with a localized inner glow of `inset 0 0 12px rgba(192, 160, 96, 0.08)`.
5. **Modal & Floating Overlays**: Modals use an elevated background of `#141414` backed by `backdrop-filter: blur(12px)` and a crisp `#2A2A2A` outer border.

## Shapes

The geometric signature uses a **Precision Micro-Radius (Level 1)**:

- Base interface elements (cards, containers, input fields, image viewports) maintain a strict `2px` to `4px` corner radius. This conveys machined metal components rather than generic web components.
- Buttons and segmented controllers strictly use `2px` outer radiuses.
- Badges, technical pill tags, and spec markers never exceed `4px`. Full circular or pill shapes (`9999px`) are prohibited, preserving an uncompromising, hand-machined mechanical identity.

## Components

### Buttons
- **Primary CTA**: Solid warm gold (`#C0A060`) background, pure black text (`#0A0A0A`), Space Grotesk 11px uppercase bold (`label-caps`), 2px radius. Height: 44px. Hover state: Lightens to `#CCA86E` with subtle micro-scale expansion (`scale: 1.01`).
- **Secondary CTA**: Transparent background, 1px hairline border (`#2A2A2A`), white text (`#FFFFFF`), Space Grotesk 11px uppercase. Hover: Border color transitions to `#C0A060` with background shifting to `rgba(192, 160, 96, 0.04)`.
- **Tertiary / Blueprint Ghost**: Text-only Space Grotesk with prefix indicator (e.g., `[ SPECIFY FORGING ]`), gold underline appearing on hover.

### Configuration Chips & Finish Swatches
- **Finish Selector**: 48x48px square chip with 2px radius. Contains raw material preview (e.g., Brushed Liquid Bronze, Satin Black Billet). Default state has 1px `#2A2A2A` border. Active state gains a double stroke: 1px outer `#C0A060` with a 2px interior spacer gap.
- **Spec Chip (Diameter / Width)**: Background `#141414`, border `#2A2A2A`, text `#888888`. Active state: Background `#1A1A1A`, border `#C0A060`, text `#FFFFFF`.

### Cards & Spec Panels
- Base card uses `#1A1A1A` background with `#2A2A2A` 1px border.
- Headers are marked by technical metadata in the top corner (e.g., `FIG. 04 — MONOBLOCK SERIES`).
- Internal divider lines are hairline `#2A2A2A`.
- Hover interactions avoid vertical translation; instead, the container's border softly transitions to `#444444`.

### Form Controls & Technical Inputs
- **Text Inputs (Vehicle VIN / Wheel Dimensions)**: Height 48px, background `#141414`, border 1px `#2A2A2A`, text `#FFFFFF` in Space Grotesk. Focused state: 1px `#C0A060`. Placeholder text in `#555555`.
- **Checkboxes & Radios**: 16x16px square with 1px radius. Dark fill (`#0A0A0A`), border `#2A2A2A`. Checked state displays a solid `#C0A060` inner square fill (inset 3px).

### Data Lists & Specification Tables
- Alternating subtle rows (`#0A0A0A` and `#141414`) divided by hairline borders (`#2A2A2A`).
- Left column: Metric nomenclature in Inter 12px `#888888`. Right column: Engineering tolerance or dimension in Space Grotesk 14px `#FFFFFF`.

### Atelier Status Indicators
- **Allocation Exhausted**: Micro-tag with background `rgba(139, 0, 0, 0.15)`, border `1px solid #8B0000`, text `#FF6B6B` in `label-caps`.
- **Bespoke Order Confirmed**: Micro-tag with background `rgba(192, 160, 96, 0.12)`, border `1px solid #C0A060`, text `#C0A060`.