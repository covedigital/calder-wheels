# Calder Visual Specification — Home

## Source

- File: `Calder - 1 - Home.png`
- Source dimensions: `824 × 1908`
- Page type: `marketing_home`
- Inspector: GPT-5.6 Sol
- Schema version: 1.0

## Page Summary

Long-form consumer homepage establishing the Calder visual language: cinematic automotive hero, floating fitment finder, editorial product cards, engineering proof, lifestyle gallery, newsletter and global footer.

## Global Layout

- **Content width:** ~748px at 824px source width — confidence 0.90 (ESTIMATED)
- **Horizontal gutters:** ~38-40px — confidence 0.91 (ESTIMATED)
- **Primary alignment:** Centered desktop content container with full-bleed image bands and strong left-edge alignment across contained sections.
- **Page background:** #FFFFFF — confidence 0.94

---

## Section 1 — Global header

**ID:** `home-header`

### Bounds

- Pixel bbox: `[0, 0, 824, 44]`
- Normalized bbox: `[0.0, 0.0, 1.0, 0.0231]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: full-width single-row navigation
- Additional layout: `{"alignment": "vertically centered"}`

### Components

#### global-header

- Classification: **GLOBAL**
- Type: `header`
- Pixel bbox: `[0, 0, 824, 44]`
- Normalized bbox: `[0.0, 0.0, 1.0, 0.0231]`
- Description: Dark navy horizontal header with Calder wordmark at left, centered primary navigation, utility icons, and outlined gold FIND YOUR FIT CTA.
- Confidence: 0.96
- Evidence: OBSERVED
- Layout: `{"height": "~44px", "logo_region": "~18% width", "nav": "centered compact links", "utilities": "right aligned"}`
- Relationships: Spans full viewport width. Hero begins immediately beneath header.

---

## Section 2 — Hero

**ID:** `home-hero`

### Bounds

- Pixel bbox: `[0, 44, 824, 353]`
- Normalized bbox: `[0.0, 0.0231, 1.0, 0.185]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: full-bleed cinematic image with left copy and right dominant product
- Additional layout: `{"columns": "approx 43/57 visual split"}`

### Background

- `{"image": "mountain-road vehicle lifestyle image", "overlay": "dark navy/black gradient strongest at left and right edges"}`

### Components

#### home-hero-copy

- Classification: **PAGE_SPECIFIC**
- Type: `hero_copy`
- Pixel bbox: `[48, 106, 303, 304]`
- Normalized bbox: `[0.0583, 0.0556, 0.3677, 0.1593]`
- Description: Left-aligned gold eyebrow, large two-line white headline MADE WITH PRECISION, supporting copy, two CTAs and three proof points.
- Confidence: 0.91
- Evidence: OBSERVED
- Layout: `{"width": "~255px", "vertical_alignment": "upper-middle", "cta_row": "two buttons"}`
- Relationships: Copy is anchored to left safe area and does not cross the wheel focal region.

#### home-hero-wheel

- Classification: **PAGE_SPECIFIC**
- Type: `hero_imagery`
- Pixel bbox: `[382, 44, 824, 353]`
- Normalized bbox: `[0.4636, 0.0231, 1.0, 0.185]`
- Description: Dominant close-up wheel/car image occupying the right half and crossing visually into the center; warm mountain sunset environment.
- Confidence: 0.95
- Evidence: OBSERVED
- Imagery: `{"fit": "cover", "focal_point": "wheel center near x=530,y=190", "crop": "tight wheel and fender crop", "overlay": "darkened edges/left-side contrast support"}`
- Relationships: Wheel is the dominant visual anchor. Copy remains readable over darker left image region.

---

## Section 3 — Vehicle fitment finder

**ID:** `home-fitment`

### Bounds

- Pixel bbox: `[39, 354, 762, 500]`
- Normalized bbox: `[0.0473, 0.1855, 0.9248, 0.2621]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: floating white card
- Additional layout: `{"width": "~88% viewport", "columns": "fitment controls in one desktop row"}`

### Background

- `{"color": "#FFFFFF", "shadow": "soft large drop shadow"}`

### Components

#### home-fitment-tabs

- Classification: **SHARED**
- Type: `tabs`
- Pixel bbox: `[52, 354, 333, 388]`
- Normalized bbox: `[0.0631, 0.1855, 0.4041, 0.2034]`
- Description: Two-tab control: Shop by Vehicle active; Shop by Wheel Style inactive.
- Confidence: 0.92
- Evidence: OBSERVED

#### home-fitment-form

- Classification: **SHARED**
- Type: `form`
- Pixel bbox: `[51, 390, 750, 466]`
- Normalized bbox: `[0.0619, 0.2044, 0.9102, 0.2442]`
- Description: Four equal selectors for Year, Make, Model, Trim with dark FIND WHEELS button aligned at right.
- Confidence: 0.95
- Evidence: OBSERVED
- Layout: `{"grid": "4 selectors + CTA", "gap": "~14px", "input_height": "~28px"}`

#### home-popular-searches

- Classification: **PAGE_SPECIFIC**
- Type: `link_row`
- Pixel bbox: `[52, 470, 530, 493]`
- Normalized bbox: `[0.0631, 0.2463, 0.6432, 0.2584]`
- Description: Compact popular-search links beneath fitment controls.
- Confidence: 0.88
- Evidence: OBSERVED

### Section Relationships

- Card overlaps transition from hero to white content area.

---

## Section 4 — Signature wheels

**ID:** `home-signature`

### Bounds

- Pixel bbox: `[38, 516, 762, 811]`
- Normalized bbox: `[0.0461, 0.2704, 0.9248, 0.4251]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: contained white section
- Additional layout: `{"grid": "three-column card grid"}`

### Components

#### home-signature-heading

- Classification: **SHARED**
- Type: `section_heading`
- Pixel bbox: `[39, 523, 759, 568]`
- Normalized bbox: `[0.0473, 0.2741, 0.9211, 0.2977]`
- Description: Gold eyebrow and navy SIGNATURE WHEELS heading with View All Wheels link at far right.
- Confidence: 0.92
- Evidence: OBSERVED

#### home-wheel-cards

- Classification: **SHARED**
- Type: `product_card_group`
- Pixel bbox: `[39, 577, 761, 798]`
- Normalized bbox: `[0.0473, 0.3024, 0.9235, 0.4182]`
- Description: Three equal editorial product cards with lifestyle wheel imagery, C1/C2/C3 labels, construction type, short descriptors and View Details links.
- Confidence: 0.95
- Evidence: OBSERVED
- Layout: `{"grid": "3 columns", "gap": "~28px", "card_width": "~220px"}`

---

## Section 5 — Customize without limits

**ID:** `home-customize`

### Bounds

- Pixel bbox: `[0, 812, 824, 1031]`
- Normalized bbox: `[0.0, 0.4256, 1.0, 0.5404]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: full-width split band
- Additional layout: `{"columns": "~43/57"}`

### Background

- `{"color": "#062333"}`

### Components

#### home-customize-image

- Classification: **PAGE_SPECIFIC**
- Type: `split_image`
- Pixel bbox: `[0, 812, 356, 1031]`
- Normalized bbox: `[0.0, 0.4256, 0.432, 0.5404]`
- Description: Large close-up Calder wheel image cropped on left half.
- Confidence: 0.95
- Evidence: OBSERVED
- Imagery: `{"fit": "cover", "crop": "tight center-cap and spokes"}`

#### home-customize-copy

- Classification: **PAGE_SPECIFIC**
- Type: `split_copy`
- Pixel bbox: `[360, 812, 824, 1031]`
- Normalized bbox: `[0.4369, 0.4256, 1.0, 0.5404]`
- Description: Dark navy panel with gold eyebrow, large white heading, body copy, gold Build Yours CTA and four-step process labels.
- Confidence: 0.94
- Evidence: OBSERVED
- Layout: `{"padding": "~42px left", "content_width": "~390px"}`

---

## Section 6 — Engineering difference

**ID:** `home-engineering`

### Bounds

- Pixel bbox: `[38, 1031, 780, 1194]`
- Normalized bbox: `[0.0461, 0.5404, 0.9466, 0.6258]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: contained three-part editorial row
- Additional layout: `{"columns": "~35/34/31"}`

### Components

#### home-engineering-copy

- Classification: **PAGE_SPECIFIC**
- Type: `content_block`
- Pixel bbox: `[39, 1047, 297, 1180]`
- Normalized bbox: `[0.0473, 0.5487, 0.3604, 0.6184]`
- Description: Left text block with ENGINEERED TO PERFORM and engineering CTA.
- Confidence: 0.90
- Evidence: OBSERVED

#### home-engineering-image

- Classification: **SHARED**
- Type: `editorial_image`
- Pixel bbox: `[314, 1047, 565, 1186]`
- Normalized bbox: `[0.3811, 0.5487, 0.6857, 0.6216]`
- Description: CNC/manufacturing image centered.
- Confidence: 0.93
- Evidence: OBSERVED

#### home-engineering-points

- Classification: **SHARED**
- Type: `feature_list`
- Pixel bbox: `[584, 1048, 775, 1184]`
- Normalized bbox: `[0.7087, 0.5493, 0.9405, 0.6205]`
- Description: Four icon/text proof points: forged aluminum, CNC machined, strength tested, real world proven.
- Confidence: 0.92
- Evidence: OBSERVED

---

## Section 7 — Concept to reality

**ID:** `home-process`

### Bounds

- Pixel bbox: `[38, 1194, 762, 1382]`
- Normalized bbox: `[0.0461, 0.6258, 0.9248, 0.7243]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: contained heading plus four-image strip
- Additional layout: `{}`

### Components

#### home-process-strip

- Classification: **PAGE_SPECIFIC**
- Type: `image_strip`
- Pixel bbox: `[39, 1249, 761, 1363]`
- Normalized bbox: `[0.0473, 0.6546, 0.9235, 0.7144]`
- Description: Four equal automotive/manufacturing images in a horizontal strip.
- Confidence: 0.94
- Evidence: OBSERVED
- Layout: `{"grid": "4 columns", "gap": "~10px"}`

---

## Section 8 — Fitted gallery / vehicle CTA

**ID:** `home-gallery`

### Bounds

- Pixel bbox: `[38, 1382, 762, 1563]`
- Normalized bbox: `[0.0461, 0.7243, 0.9248, 0.8192]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: contained two-panel promotional composition
- Additional layout: `{"columns": "~64/36"}`

### Components

#### home-gallery-cta

- Classification: **PAGE_SPECIFIC**
- Type: `promotional_panel`
- Pixel bbox: `[39, 1430, 503, 1556]`
- Normalized bbox: `[0.0473, 0.7495, 0.6104, 0.8155]`
- Description: Light panel with Built For Your Vehicle copy and exploded wheel assembly image.
- Confidence: 0.91
- Evidence: OBSERVED

#### home-gallery-image

- Classification: **PAGE_SPECIFIC**
- Type: `lifestyle_image`
- Pixel bbox: `[503, 1430, 762, 1556]`
- Normalized bbox: `[0.6104, 0.7495, 0.9248, 0.8155]`
- Description: Blue sports car image with overlaid slogan.
- Confidence: 0.93
- Evidence: OBSERVED

---

## Section 9 — Newsletter

**ID:** `home-newsletter`

### Bounds

- Pixel bbox: `[0, 1574, 824, 1687]`
- Normalized bbox: `[0.0, 0.8249, 1.0, 0.8842]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: full-width background image band with horizontal form
- Additional layout: `{}`

### Background

- `{"image": "mountain valley", "overlay": "dark navy translucent overlay"}`

### Components

#### home-newsletter-form

- Classification: **SHARED**
- Type: `newsletter_form`
- Pixel bbox: `[38, 1597, 787, 1646]`
- Normalized bbox: `[0.0461, 0.837, 0.9551, 0.8627]`
- Description: Mountain-image newsletter band with left title/copy and right email field plus gold Subscribe button.
- Confidence: 0.93
- Evidence: OBSERVED

---

## Section 10 — Global footer

**ID:** `home-footer`

### Bounds

- Pixel bbox: `[0, 1687, 824, 1908]`
- Normalized bbox: `[0.0, 0.8842, 1.0, 1.0]`
- Confidence: 0.90
- Evidence: OBSERVED

### Layout

- Structure: full-width multi-column footer
- Additional layout: `{}`

### Components

#### global-footer

- Classification: **GLOBAL**
- Type: `footer`
- Pixel bbox: `[0, 1687, 824, 1908]`
- Normalized bbox: `[0.0, 0.8842, 1.0, 1.0]`
- Description: Dark navy footer with logo/about/social area, three navigation columns, brand statement, divider and legal/country row.
- Confidence: 0.97
- Evidence: OBSERVED

---

## Shared Components

### Primary site header
- ID: `global-header`
- Classification: GLOBAL
- Reuse rationale: Repeated on Home, Category, Product and Cart with dark navy bar, Calder logo, nav, utility icons and outlined gold fitment CTA.

### Primary site footer
- ID: `global-footer`
- Classification: GLOBAL
- Reuse rationale: Repeated on consumer-facing pages with dark navy multi-column footer, Calder mark, social icons and legal row.

### Find Your Fit CTA
- ID: `fitment-cta`
- Classification: SHARED
- Reuse rationale: Repeated high-priority gold/outlined action in consumer header and fitment workflows.

### Gold uppercase eyebrow
- ID: `gold-eyebrow`
- Classification: SHARED
- Reuse rationale: Repeated section-label pattern across marketing, collection, cart and portal compositions.

### Navy / gold button system
- ID: `navy-gold-button-system`
- Classification: SHARED
- Reuse rationale: Repeated rectangular CTAs with low radius, uppercase tracked labels and arrow affordances.

## Page-Specific Components

### Cinematic precision hero
- ID: `home-hero`
- Purpose / rationale: Homepage-only large brand statement and wheel hero composition.

### Customize without limits split band
- ID: `home-customize`
- Purpose / rationale: Homepage storytelling section combining wheel macro image and four-step customization flow.

## Responsive Assumptions

> All items in this section are assumptions because no approved responsive screenshots were supplied.

### global-header
- Assumption: Primary navigation likely collapses to a compact mobile menu while retaining logo and fitment access.
- Confidence: 0.74
- Evidence: ASSUMPTION

### home-wheel-cards
- Assumption: Three-card row likely becomes a swipeable or stacked card layout on narrow viewports.
- Confidence: 0.68
- Evidence: ASSUMPTION

### home-customize
- Assumption: Split image/copy composition likely stacks vertically, with image above copy.
- Confidence: 0.72
- Evidence: ASSUMPTION

## Visual Relationships

- Card overlaps transition from hero to white content area.

## Uncertainties

### exact typeface
- Unknown: Exact font family cannot be verified from screenshots alone.
- Evidence needed to resolve: Confirm approved Calder brand font files or theme typography tokens.

### hero source asset crop
- Unknown: Exact original image dimensions and object-position are unknown.
- Evidence needed to resolve: Inspect supplied approved hero asset and compare crop at 824px reference width.

## Implementation Notes

- Preserve the floating fitment card overlap at the hero/content transition.
- Use relationship-first layout; full-bleed sections alternate with a consistent contained content edge.
- Maintain navy/white/gold hierarchy and restrained square/low-radius controls.

## Inspection Summary

- Highest-confidence findings: major section order, full-width versus contained regions, dominant column structures, and repeated shared-component patterns.
- Lower-confidence findings: exact font family, source design tokens, interactive/sticky behavior, and responsive behavior not shown in the approved desktop references.
- Critical relationships to preserve: repeated content edges, hero/product focal hierarchy, fitment continuity, navy/white/gold contrast system, and page-specific shell variants.
- Items requiring implementation-side verification: existing Shopify component behavior, asset filenames/crops, theme typography tokens, and platform-specific checkout constraints.