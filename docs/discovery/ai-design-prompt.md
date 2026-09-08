# AI Design Tool Prompt — Calder Wheels

> **Purpose**: Copy-paste this prompt into AI design tools (Relay, Framer AI, v0.dev, Midjourney, etc.) to generate consistent page layouts and design components for the Calder Wheels project.
> **Source Material**: `docs/discovery/inspiration-analysis.md`, `docs/discovery/requirements.md`, `brand/brand.md`

---

## Master Prompt (use as base for all generations)

```
Brand: Calder Wheels — premium build-to-order wheel manufacturer.
Tone: Ultra-premium, dark, editorial, photography-led. Minimal copy. Confident.
Target customer: Enthusiast with luxury SUV or European vehicle (20–26" wheels).
Design references: bespokerev.com (dark boutique luxury) + vossenwheels.com (enterprise catalog discipline).

Color palette:
- Background: #0A0A0A (near-black)
- Surface: #1A1A1A (card/panel backgrounds)
- Text primary: #FFFFFF
- Text secondary: #888888
- Accent: #C0A060 (warm metallic gold) OR #FFFFFF (white)
- Borders/divider: #2A2A2A
- Error/stockout: #8B0000 (dark red, for component unavailability)

Typography:
- Headings: Tight tracking (-0.02em), uppercase for section numbers (§ 01), sentence case for titles
- Body: Light weight (300), generous line height (1.6)
- Scale: 14px body → 64px hero heading

Imagery:
- Full-bleed vehicle photography (dark/concealed lighting, dramatic shadows)
- Wheel finish photography on white or dark gradient background
- Every finish photographed on every wheel (finish matrix discipline from Vossen)
- Customer-build gallery as social proof (unedited real-world car shots)

Layout principles:
- Section-per-feature storytelling (one idea per scroll)
- Numbered sections (§ 01 … § N) for editorial catalog feel
- Massive photography; copy is terse
- Full-bleed hero with dual CTAs
```

---

## Page-Specific Prompts

### 1. Homepage Hero

```
Generate a full-bleed hero section for Calder Wheels, a premium wheel company.

Layout: Full-viewport-height dark background with dramatic vehicle photography (luxury SUV, low lighting, wheel visible). Overlay text:

Heading: "CUSTOM. BY DESIGN." (large, tight tracking)
Subheading: "Build-to-order forged wheels. Configure your set." (14px, light weight, letter-spaced)

Two CTAs side by side:
- Primary: "Configure Your Wheels" (gold accent #C0A060 border, transparent fill)
- Secondary: "See Fitted" (white text, no border)

Bottom-left: Three quick-spec trust markers in a row — "20–26" SIZES" · "FORGED & FLOW-FORMED" · "COMPONENT INVENTORY"

Bottom-right: Section indicator "§ 01" in small gold text.

References: bespokerev.com hero layout (full-bleed, dark, dual CTA) + Vossen utility bar at top.
```

### 2. Catalog / Series Grid

```
Generate a product catalog grid for Calder Wheels wheel designs.

Layout: Dark background (#0A0A0A). Section header: "§ 02 · THE CATALOG" (white, small, letter-spaced) followed by heading "Our Designs" (large, tight tracking).

Grid: 3 columns, 2 rows (6 designs total). Each card contains:
- Large wheel photograph on dark gradient
- Design nickname (e.g., "MOB", "ENVY", "NEXUS") in bold white caps
- Size range below (e.g., "20–24″")
- Series badge (e.g., "FORGED · 3-PIECE") in small gold text
- "New" badge (top-right corner of image, gold fill, black text) on applicable cards

Cards have subtle border (#2A2A2A), rounded corners (4px), hover lift effect (slight translateY -4px with shadow).

References: bespokerev.com 6-design catalog + Vossen series taxonomy (Forged / Hybrid Forged / 3-piece).
```

### 3. Vehicle Fitment Finder

```
Generate a vehicle fitment finder / selector widget for Calder Wheels.

Layout: Dark panel (#1A1A1A) with subtle border on a black background. Title: "Find Your Fit" (white, large). Subtitle: "See which wheels fit your vehicle" (gray #888888, small).

Selector: Four dropdowns in a horizontal row, visually connected by arrows between them:
1. Year (2020–2026)
2. Make
3. Model
4. Generation / Trim

Below the dropdowns: "Show Results" button (gold #C0A060 background, black text, uppercase).

Results area (shown after selection): Displays compatible wheel designs as small cards with wheel image, name, sizes available. Incompatible designs are not shown (never show "does not fit").

Bottom annotation: "Fitment data verified for all configurations" in small gray text.

References: No direct reference (neither BespokeRev nor Vossen has this) — this is a Calder differentiator. UI pattern borrowed from automotive parts finders (e.g., TireRack, ECS Tuning) but styled in dark luxury.
```

### 4. Wheel Configurator

```
Generate a live wheel configurator interface for Calder Wheels.

Layout: Two-panel split screen.
- Left (60%): Live wheel preview — 3D-rendered or high-fidelity wheel visualization on dark gradient. Wheel rotates slowly. Three view buttons below: "Full" · "Angle" · "Detail"
- Right (40%): Configuration panel on #1A1A1A surface.

Configuration panel (top to bottom):
- Wheel name: "MOB · 22″" (large, white)
- Price range: "From $1,200" (gold accent)

Three finish selectors, each as a horizontal swatch row:

Section 1 — "Center Finish": 6 circular swatches (25px) — Gloss Black, Brushed Titanium, Matte Gunmetal, Gloss White, Brushed Gold, Raw Clear. Selected swatch has gold ring border.

Section 2 — "Barrel / Lip Finish": 6 swatches — Polished Chrome, Black Chrome, Brushed Silver, Gloss Black, Matte Bronze, Candy Red.

Section 3 — "Hardware / Rivet Finish": 5 swatches — Polished Stainless, Black, Gold, Titanium, Chrome.

Below swatches: "Check Availability" primary button (gold #C0A060 bg, black text, full-width). Then "View on Your Vehicle" secondary link.

Below the button: A visual availability indicator — green dot + "In Stock — Ready to Build" or red dot + "Configure Differently" (linked to component inventory).

References: Vossen finish matrix photography (every finish on every wheel) + BespokeRev quote-first funnel. The live preview + component-backed availability check is unique.
```

### 5. Feature Spotlight Section

```
Generate a feature spotlight section for Calder Wheels (e.g., "Floating Center Caps").

Layout: Full-viewport-height, split horizontally.
- Left (50%): Dramatic close-up photograph of the featured component (floating cap, rivet detail, barrel profile) on black background. The component is illuminated with a single edge light.
- Right (50%): Text content, vertically centered.

Content:
- Section number: "§ 04" (gold, small)
- Heading: "Gravity-Weighted Floating Caps" (large, white, tight tracking)
- Description: "Self-leveling. Always upright. The Calder floating center cap uses a precision-weighted mechanism that keeps your brand emblem oriented correctly — even when the wheel is in motion. Every configuration includes floating caps." (300-weight, gray #cccccc, generous line height)
- Visual cue: Small animated indicator showing the cap staying upright while the wheel rotates (or static representation)

References: bespokerev.com floating cap feature spotlight (one idea per scroll, full-bleed photography, confident copy).
```

### 6. Customer Build Gallery

```
Generate a customer build gallery section for Calder Wheels.

Layout: Full-width, dark background. Section header: "§ 05 · FITTED" (gold, small) + "Customer Builds" (white, large).

Grid: Masonry or 3-column grid of real customer vehicles with Calder wheels fitted. Images are unedited real-world shots (various lighting, various angles). Each image has a subtle overlay on hover showing wheel design name + vehicle model + @instagram_handle.

Bottom: "Tag Your Build" CTA with #CalderWheels hashtag (gold text, large). Instagram-style icon next to it.

No text block descriptions — purely photography-led social proof.

References: bespokerev.com customer builds section (unedited real-world gallery, #bespokerev hashtag loop).
```

### 7. Newsletter / Drop Cadence ("The List")

```
Generate a newsletter signup section for Calder Wheels.

Layout: Full-width, centered content. Background: #1A1A1A with subtle noise texture or dark gradient.

Content stacked vertically:
- "THE LIST" (gold #C0A060, large, tight tracking, uppercase)
- "New series. New fitments. Limited runs. Be the first." (white, light weight)
- Email input field: Dark input (#0A0A0A border, white text, placeholder "your@email.com") + "Subscribe" button (gold bg, black text)
- Below: "No spam. Only drops. Unsubscribe anytime." (gray, 12px)

Optional: Add a "Last Drop" counter showing days since last announcement (e.g., "14 days since our last drop").

References: bespokerev.com newsletter section ("The List", drop cadence model).
```

### 8. Manufacturing Authority Section

```
Generate a manufacturing / engineering authority section for Calder Wheels.

Layout: Full-bleed, horizontal scroll or multi-panel section.

Content is one of three panels:
Panel A — "Forged in [City]": Factory photograph (machinery, raw aluminum billets, CNC tools) on left, text on right describing TÜV-certified forged construction.
Panel B — "Finishing": Close-up of wheel finish being applied or inspected. Text on finishing process.
Panel C — "Engineering": Cutaway or cross-section view showing barrel construction, spoke engineering, load rating.

Each panel has a numbered badge (01/03, 02/03, 03/03) and navigation dots.

References: Vossen engineering/finishing section (manufacturing authority content as trust signal) + bespokerev.com "Series · Flow-Formed" manufacturing story.
```

### 9. Dealer Portal (B2B)

```
Generate a dealer/B2B portal login and dashboard interface for Calder Wheels.

Login page:
- Dark minimal layout, centered card (#1A1A1A, 480px max-width)
- Calder Wheels logo at top
- "Dealer Portal" heading
- Email + Password fields (dark style, no labels — placeholder text only)
- "Sign In" button (gold background)
- "Request Dealer Access" link below (small, gray)

Dashboard (after login):
- Top bar: "Calder Wheels Dealer Portal" + dealer name + notification bell + logout
- Main content: 3-column metric cards — "Pending Orders" · "My Inventory (Available-to-Build)" · "Recent Quotes"
- Below: Orders table with columns — Order # · Customer · Wheel Config · Qty · Total · Status · Action
- Sidebar: Quick links — "Catalog" · "Pricing Tiers" · "Build a Quote" · "Order History"

References: This is a Calder differentiator (Vossen has only a dealer locator, not a portal). Design adopts the dark luxury aesthetic but with dashboard-style data density.
```

### 10. Footer

```
Generate a footer section for Calder Wheels.

Layout: Dark background (#0A0A0A), top border (#2A2A2A). 4-column grid:

Column 1 — Brand: Calder Wheels logo + tagline "Build-to-order. Configure yours." + copyright "© 2026 Calder Wheels"

Column 2 — Products: "All Wheels" · "Series" · "Configurator" · "Finishes" · "Gallery"

Column 3 — Support: "Fitment Guide" · "Warranty" · "Shipping & Returns" · "Contact" · "Find a Dealer"

Column 4 — Connect: Social icons (Instagram, YouTube, Facebook) stacked vertically + "The List" newsletter link

Bottom bar: "Privacy" · "Terms" · "Accessibility" — small, gray, centered.
```

---

## Component Design System (for the AI to maintain consistently)

| Component | Style |
|-----------|-------|
| Buttons (primary) | Gold (#C0A060) background, black text, uppercase, 14px, 2px border-radius |
| Buttons (secondary) | Transparent, white text, 1px white border, same sizing |
| Cards | #1A1A1A surface, #2A2A2A 1px border, 4px border-radius |
| Section numbers | Gold "§ 01" format, 12px, letter-spaced, positioned above heading |
| Section headings | White, large (36–48px), tight tracking (-0.02em) |
| Body text | #888888 or #CCCCCC, 14–16px, 300 weight |
| Dividers | #2A2A2A, 1px |
| Input fields | #0A0A0A border, white text, dark style |
| Badges / tags | Gold fill or white fill, small uppercase text |
| Swatches (configurator) | 25px circles, selected state has gold ring |

---

## Tool-Specific Guidance

| Tool | How to Use This Prompt |
|------|------------------------|
| **Relay (relay.gs)** | Feed the Master Prompt + specific page prompts as text input. Reference bespokerev.com URL as visual style anchor. Use the component design system table as constraints. |
| **Framer AI** | Input Master Prompt as brand guidelines, then generate pages one by one using page-specific prompts. Set color palette manually in Framer's style panel to match #0A0A0A / #C0A060. |
| **v0.dev (Vercel)** | Use page-specific prompts as the natural language input. Provide the color palette as hex values. Generate one page at a time, then compose into a multi-page site. |
| **Midjourney / DALL-E** | Use page-specific prompts as image generation input. Add "--ar 16:9" for hero/full-bleed shots, "--ar 3:4" for mobile views. Add "editorial photography, studio lighting, ultra-premium" to the end of prompts for consistent quality. |
| **Webflow AI** | Input Master Prompt as brand guide, then build page by page. Use the component table as a design system reference for classes. |

---

> **Next Step**: Generate all 10 pages/layouts, review for visual consistency, then iterate on the configurator and fitment finder (the two most complex/interactive components) before moving to development.