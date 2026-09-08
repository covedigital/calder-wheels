# CALDER WHEELS — WEBSITE UI/UX DESIGN BRIEF

## ROLE

Act as a senior automotive ecommerce UX/UI designer and digital art director.

Design a cohesive premium ecommerce experience for **Calder Wheels**, a high-end custom wheel manufacturer.

This is not a generic automotive parts store. The experience should combine:

- Boutique automotive luxury
- High-end editorial design
- Precision engineering
- Modern ecommerce usability
- Made-to-order customization
- Professional dealer/B2B functionality

The website must feel like a premium automotive brand first and an ecommerce application second.

---

# 1. CREATIVE DIRECTION

Create a visual system influenced by two types of automotive experiences:

### Boutique luxury / editorial
Use:
- Large cinematic automotive photography
- Dark, minimal layouts
- Generous negative space
- Oversized typography
- Short, confident copy
- Numbered editorial sections
- Strong art direction
- One primary concept per scroll section

### Enterprise wheel catalog
Use:
- Clearly structured product families
- Wheel series taxonomy
- Construction metadata
- Finish options
- Vehicle-based browsing
- Wheel-based browsing
- Engineering/manufacturing storytelling
- Strong product discovery UX

Do NOT visually clone any existing wheel manufacturer.

Develop an original Calder Wheels design language using these principles.

---

# 2. BRAND POSITIONING

Calder Wheels occupies the space between boutique custom-wheel craftsmanship and sophisticated automotive engineering.

Core positioning:

**BUILT TO YOUR SPEC.**

Calder specializes in configurable, made-to-order wheels.

The experience should communicate:

PRECISION  
CUSTOMIZATION  
CRAFTSMANSHIP  
PERFORMANCE  
EXCLUSIVITY  
ENGINEERING

Avoid the visual language of discount automotive ecommerce.

Calder should feel appropriate beside premium automotive brands such as Porsche, BMW M, Mercedes-AMG, Range Rover, Lamborghini, Ferrari, McLaren, and Bentley.

---

# 3. VISUAL LANGUAGE

Use a premium dark automotive aesthetic.

### Palette

Primary canvas:
- Near-black / charcoal

Secondary surfaces:
- Slightly lighter graphite
- Dark metallic gray

Primary text:
- Warm white / off-white

Secondary text:
- Muted gray

Accent:
- Use metallic or restrained brand accents sparingly.

Do NOT introduce bright ecommerce colors without functional justification.

### Typography

Use:

**Display typography**
- Large
- Bold
- Modern
- Editorial
- Condensed or premium grotesk where appropriate

**UI typography**
- Highly legible sans-serif
- Neutral
- Technical
- Clean

Create dramatic scale differences.

Example hierarchy:

CALDER WHEELS

BUILT TO  
YOUR SPEC.

CW03  
FORGED SERIES  
21 × 10.5

Small technical labels should contrast against very large editorial headlines.

### Layout

Favor:
- Full-width sections
- Strong grids
- Edge-to-edge imagery
- Large whitespace
- Asymmetrical editorial layouts
- Thin rules/dividers
- Technical annotations
- Controlled overlapping of text and imagery when readability is preserved

Avoid excessive:
- Rounded cards
- Pills
- Gradients
- Glassmorphism
- SaaS-style dashboards on customer-facing pages
- Generic Shopify layouts
- Crowded product grids

Use square or subtly softened geometry rather than heavily rounded UI.

---

# 4. DESIGN SYSTEM

Create reusable components and variants before constructing the complete pages.

Establish:

## Foundations

Create reusable:
- Color tokens
- Typography styles
- Spacing scale
- Grid system
- Container widths
- Border styles
- Image ratios
- Icon style
- Interaction states
- Motion principles

Use an approximately 8px-based spacing system.

Desktop should use a structured 12-column grid.

Create responsive behavior for:
- Desktop
- Tablet
- Mobile

Design mobile intentionally rather than simply stacking desktop components.

---

# 5. GLOBAL COMPONENTS

Create reusable components for:

### Navigation

Desktop header:
CALDER logo

WHEELS  
FITMENT  
BUILDS  
ENGINEERING  
DEALERS

Utility actions:
SEARCH  
ACCOUNT  
CART / QUOTE

Create:
- transparent-over-hero state
- solid/scrolled state
- mobile navigation

---

### Buttons

Create variants:

PRIMARY  
SECONDARY  
TEXT / ARROW  
DARK  
LIGHT

Examples:

EXPLORE WHEELS →

BUILD YOUR WHEEL →

FIND YOUR FITMENT →

REQUEST QUOTE →

APPLY FOR DEALER ACCESS →

Buttons should feel architectural and premium rather than playful.

---

### Section labels

Develop reusable editorial numbering:

01 / COLLECTION  
02 / FITMENT  
03 / CONFIGURE  
04 / ENGINEERING  
05 / BUILDS

Use small technical typography paired with large section headlines.

---

### Product cards

Create a reusable premium wheel product card.

Display:

Wheel image

CW01  
PRODUCT NICKNAME

FORGED

20"–24"

Available finish preview indicators

Optional:
NEW

Avoid traditional cluttered ecommerce cards.

Product photography should dominate.

---

### Metadata chips / technical attributes

Create restrained technical metadata for:

FORGED  
FLOW-FORMED  
3-PIECE

5-LUG  
6-LUG  
8-LUG

19"  
20"  
21"  
22"  
23"  
24"

Do not make these look like colorful SaaS tags.

---

### Finish selector

Create premium material/finish selectors for:

Gloss Black  
Satin Black  
Brushed Aluminum  
Polished  
Satin Bronze  
Chrome  
Titanium

Use realistic material swatches where appropriate.

Create:
default
hover
selected
unavailable

states.

---

### Vehicle selector

Create a reusable fitment component:

YEAR  
MAKE  
MODEL  
GENERATION / TRIM

→ FIND COMPATIBLE WHEELS

The interaction should feel more like configuring a premium vehicle than filling out a generic web form.

---

### Gallery cards

Create reusable cards for customer vehicles.

Include:

Vehicle photography

2026 BMW M4 COMPETITION

CW03

20×10 / 20×11

SATIN TITANIUM

VIEW BUILD →

---

# 6. HOMEPAGE

Design the complete Calder Wheels homepage.

## 01 — HERO

Full viewport cinematic vehicle/wheel photography.

Minimal navigation overlay.

Primary headline:

BUILT TO  
YOUR SPEC.

Supporting statement communicating made-to-order wheel craftsmanship.

Primary CTA:

BUILD YOUR WHEEL →

Secondary CTA:

EXPLORE WHEELS →

Photography should dominate the viewport.

---

## 02 — FITMENT FINDER

Introduce Calder's vehicle compatibility system immediately after or near the hero.

Headline:

FIND YOUR FITMENT.

Interactive:

YEAR → MAKE → MODEL → TRIM

CTA:

VIEW COMPATIBLE WHEELS →

Explain briefly that Calder only surfaces wheels compatible with the selected vehicle.

Make this feel like a core product capability rather than a utility form.

---

## 03 — THE COLLECTION

Headline:

THE COLLECTION.

Present wheel designs using large editorial cards.

Example:

CW01  
[PRODUCT NICKNAME]

3-PIECE  
20"–24"

CW02  
[PRODUCT NICKNAME]

FORGED  
19"–23"

CW03  
[PRODUCT NICKNAME]

FLOW-FORMED  
19"–22"

Include:

VIEW ALL WHEELS →

Use strong product imagery and minimal copy.

---

## 04 — BUILD YOURS

Introduce Calder's configurator.

Use a large wheel visualization occupying approximately half or more of the section.

Configuration controls:

CENTER
[finish options]

BARREL / LIP
[finish options]

HARDWARE
[finish options]

Update the wheel preview visually as options change.

CTA:

CONFIGURE THIS WHEEL →

Include subtle availability messaging.

Configurations should ultimately be tied to real component availability.

Do NOT design this like a standard Shopify variant picker.

Make it feel like a premium automotive configurator.

---

## 05 — CONSTRUCTION SERIES

Present three manufacturing families:

FORGED

Maximum strength. Minimum mass.

FLOW-FORMED

Performance without compromise.

3-PIECE

Built around you.

Use photography/detail imagery showing wheel construction, machining, barrels, centers, hardware, or manufacturing.

Each series should link into the corresponding catalog.

---

## 06 — ENGINEERED / MADE TO ORDER

Tell Calder's manufacturing story.

Use macro photography and technical details.

Possible process visualization:

01 CONFIGURE

02 CONFIRM

03 MACHINE

04 FINISH

05 ASSEMBLE

06 DELIVER

Keep copy concise.

Emphasize precision and build-to-order craftsmanship.

---

## 07 — FITTED / CUSTOMER BUILDS

Headline:

FITTED.

Create a highly visual customer-build gallery.

Allow vehicle-family filtering such as:

PORSCHE  
BMW  
MERCEDES  
AUDI  
LAMBORGHINI  
RANGE ROVER

Each build should identify:

Vehicle  
Wheel  
Wheel size  
Finish

CTA:

EXPLORE BUILDS →

---

## 08 — DEALERS

Give the dealer program a major homepage section.

Headline:

BUILT FOR YOUR CUSTOMERS.  
BUILT FOR YOUR BUSINESS.

Communicate:

Dealer pricing  
Exclusive products  
Wholesale ordering  
Payment terms  
Build status  
Order management

CTA:

APPLY FOR DEALER ACCESS →

Secondary:

DEALER LOGIN →

The dealer program should feel like an important Calder capability, not a footer link.

---

## 09 — THE LIST

Minimal newsletter/drop section.

Headline:

THE LIST.

Supporting copy:

New designs. New finishes. Limited releases.

Email field.

JOIN THE LIST →

---

## 10 — FOOTER

Create a sophisticated large-format footer.

Navigation groups:

WHEELS  
COLLECTION
FORGED
FLOW-FORMED
3-PIECE

DISCOVER
FITMENT
BUILDS
ENGINEERING
FINISHES

DEALERS
APPLY
LOGIN

COMPANY
ABOUT
CONTACT

Include:
social links
legal links
newsletter
copyright

---

# 7. WHEEL CATALOG PAGE

Create `/wheels`.

The catalog should support sophisticated discovery without looking like a commodity ecommerce category page.

Include:

Headline:
THE COLLECTION.

Filtering:

SERIES
Forged
Flow-Formed
3-Piece

DIAMETER

LUG CONFIGURATION

FINISH

NEW RELEASES

Filters should generate/share deep-linkable states conceptually.

Product cards must emphasize:
- Wheel design
- Code + nickname
- Construction
- Size range
- Finish availability

Create desktop filtering and a mobile filter experience.

---

# 8. PRODUCT / CONFIGURATOR PAGE

Create the most important commerce interface.

Example:

CW03  
[PRODUCT NICKNAME]

3-PIECE

Large wheel render.

Allow configuration of:

CENTER FINISH

BARREL / LIP FINISH

HARDWARE FINISH

SIZE

FITMENT

Show selected vehicle.

Show compatibility status.

Show configuration availability.

Provide:

REQUEST QUOTE →

and, when appropriate:

CONTINUE TO ORDER →

Also include:

Specifications  
Construction  
Available sizes  
Fitment  
Finish information  
Gallery  
Related customer builds

Make the configurator visually immersive.

The wheel itself should remain the dominant visual object.

---

# 9. FITMENT EXPERIENCE

Create a dedicated fitment finder.

Flow:

SELECT YOUR VEHICLE

YEAR  
↓

MAKE  
↓

MODEL  
↓

GENERATION / TRIM  
↓

COMPATIBLE WHEELS

After selection display:

YOUR VEHICLE

2026 BMW M4 Competition

and compatible products only.

Allow the selected vehicle to persist conceptually while browsing the catalog.

Show:

FITS YOUR BMW M4 ✓

on relevant products.

Never show incompatible wheels as valid purchase options.

---

# 10. BUILDS / GALLERY

Create dual discovery modes:

VEHICLE GALLERY

and

WHEEL GALLERY

Vehicle Gallery:
Browse builds based on vehicle.

Wheel Gallery:
Browse installations based on wheel design and finish.

Use photography-first layouts.

Include filters without overwhelming the imagery.

Each build detail page should connect:

VEHICLE ↔ WHEEL ↔ FINISH ↔ FITMENT

so visitors can move directly from inspiration into configuration.

---

# 11. DEALER PORTAL

The dealer experience may use a more functional interface while retaining Calder's design system.

Create:

### Dealer login

### Dealer dashboard

Show:

Recent orders  
Order status  
Build status  
Quotes  
Invoices  
Account information

### Dealer catalog

Show dealer-specific pricing.

Support:

Tiered pricing  
Dealer-only products  
Minimum quantities  
Payment terms

### Dealer order detail

Visual production status:

ORDER CONFIRMED

↓

COMPONENTS ALLOCATED

↓

PRODUCTION

↓

FINISHING

↓

QC

↓

READY TO SHIP

↓

SHIPPED

Display tracking information after shipment.

Dealer UX should prioritize speed and clarity while maintaining premium Calder branding.

---

# 12. RESPONSIVE DESIGN

Produce desktop and mobile layouts for all critical experiences.

Prioritize mobile UX for:

Navigation  
Catalog filters  
Vehicle fitment  
Wheel configuration  
Finish selection  
Quote requests  
Dealer order status

On mobile, maintain the premium editorial feel while reducing unnecessary decorative complexity.

For the configurator, keep the wheel visualization visible as users change finishes whenever practical.

---

# 13. INTERACTION & MOTION

Use restrained premium motion.

Examples:

Slow image reveals

Subtle wheel-image transitions

Typography reveal

Navigation transition from transparent to solid

Smooth finish changes

Configurator material transitions

Gallery hover reveals

Technical metadata appearing on hover

Avoid excessive parallax and novelty animations.

Performance is more important than visual gimmicks.

The configurator should feel immediate.

---

# 14. UX REQUIREMENTS

The design must visibly accommodate these underlying capabilities:

Vehicle fitment:
Year → Make → Model → Generation/Trim

Wheel taxonomy:
Forged / Flow-Formed / 3-Piece

Wheel configuration:
Center × Barrel/Lip × Hardware

Component availability

Quote-first made-to-order purchasing

Customer builds

Dealer-specific pricing

Dealer-only products

Wholesale checkout

NET-30/payment terms

Production status

Shipping/tracking

Do not simplify the project into a conventional product catalog.

---

# 15. IMAGE DIRECTION

Use image placeholders or high-end automotive photography appropriate for layout exploration.

Photography direction:

Luxury/performance vehicles  
Wheel closeups  
Machining  
Forging  
Metal finishes  
Wheel barrels  
Hardware  
Vehicle stance  
Detail photography  
Manufacturing

Favor:
dramatic lighting
dark environments
architectural settings
studio detail shots
premium automotive editorial photography

Avoid:
generic stock dealership photography
cartoon imagery
AI-looking concept cars
busy race-themed graphics
cheap automotive ecommerce imagery

---

# 16. CONSISTENCY REQUIREMENT

Every page must look like part of the same Calder Wheels product ecosystem.

Reuse the established:

Grid  
Typography  
Colors  
Spacing  
Buttons  
Product cards  
Filters  
Forms  
Finish selectors  
Vehicle selectors  
Technical metadata  
Image treatment  
Section numbering  
Navigation  
Footer

Do not redesign the visual language from page to page.

When a new component is required, extend the established design system instead of creating an unrelated pattern.

---

# 17. REQUIRED PAGE SET

Create layouts for:

1. Homepage
2. Wheel catalog
3. Wheel product/configurator
4. Vehicle fitment finder
5. Compatible-wheel results
6. Vehicle gallery
7. Wheel gallery
8. Customer build detail
9. Engineering/manufacturing
10. Finishes
11. Dealer application
12. Dealer login
13. Dealer dashboard
14. Dealer catalog
15. Dealer order detail
16. Quote request
17. Mobile versions of critical customer journeys

Also create a dedicated **Design System / UI Kit** containing all reusable foundations and components.

---

# FINAL DESIGN OBJECTIVE

The final experience should communicate:

**Boutique craftsmanship + engineering authority + modern configuration technology.**

A visitor should immediately understand that Calder Wheels does not simply sell wheels from inventory.

Calder enables customers and dealers to find the correct fitment, configure a wheel around their vehicle and preferences, have that configuration built to specification, and follow the resulting order through fulfillment.

The design should make this sophisticated system feel simple, premium, visual, and desirable.