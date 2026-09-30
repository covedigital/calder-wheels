TASK: PRODUCT_DESKTOP_FIDELITY_RECONSTRUCTION_V10

PROJECT: Calder Wheels
TARGET: Shopify PDP — Apex 201

PRIMARY GOAL
Perform a deterministic desktop-first reconstruction so the current PDP converges on the approved Calder product-page mockup. This is NOT another broad visual-interpretation pass. OpenCode/DeepSeek is not expected to inspect the mockup; GPT-5.6 Sol has translated it into the implementation contract below.

GOVERNING AUTHORITY
1. Visual presentation: this V10 specification (translated from the approved mockup by Sol).
2. Product/data: live Shopify Apex 201. Never hardcode C1/mockup product data.
3. Functional: existing Shopify product/cart/variant behavior, Wheel Configurator, Fitment Finder.
4. Shared components: sections/header.liquid, sections/footer.liquid, snippets/calder-product-card.liquid (approved B1). Do not create PDP-local replacements.

BASELINE FILES
- product.development-manifest.v9.json
- assets/calder-product.css
- sections/calder-product.liquid
- sections/wheel-configurator.liquid
- existing fitment-finder implementation/CSS
- existing Calder font declarations

OPERATING RULE
Do not ask for the PNG or state that you cannot inspect images. Implement this specification literally. First inspect current selectors/DOM and preserve functional IDs/classes/data attributes. Determine whether each mismatch requires Liquid/DOM or CSS changes. Fix root structure/cascade instead of stacking overrides. Refactor obsolete/contradictory Calder rules where safe.

DESIGN SYSTEM
Colors: navy #0E2A3E; blue #1E4C68; gold #C2A48A; slate #876E5A; cream #F2EFE9; near-black #231F20; white #FFFFFF. Alternate section #F7F7F5/#F8F8F8. Borders #E8E8E8/#F0F0F0.
Fonts: Facundo 700 for product H1, major editorial H2s, large CTA headings. Garet 400/700 for construction eyebrow, body, metadata, labels, controls, buttons, fitment, configurator, specs and finish labels. Poppins fallback. Resolve the current .calder-pdp__construction conflict to Garet. No theme-default serif/Arial appearance inside .page-calder.
Desktop type: H1 50–54px/1.00–1.06; major H2 34–40px; secondary H3 24–30px; eyebrow 11–13px uppercase Garet 700 with .14–.18em tracking; body 15–16px/1.55–1.65; labels 11–12px; buttons 11–13px.

GLOBAL GEOMETRY
Desktop QA viewport 1440px; max container 1178px centered. Premium/light/editorial/automotive. Remove excessive rounded cards, shadows, pills, Bootstrap/Lumia styling and dead space. Most PDP radii 0–4px; 6px only where functionally useful. Do not use 16px generic card rounding on hero media.

HERO
Desktop 57% media / 43% info, gap 32–38px, align-start.
Left: actual Apex product.media / selected variant media. Remove gray generic card framing, heavy border, 16px radius and 20px internal image padding. Product wheel should dominate. Preserve contain behavior where needed to avoid crop. Compact thumbnails below; selected = thin gold indicator. Never substitute people/scenery/bokeh. If actual Apex media itself is wrong, report BLOCKED_BY_PRODUCT_MEDIA rather than fabricating imagery.
Right order:
1 construction/series eyebrow
2 Apex 201 H1
3 description
4 reviews + SKU + Made to Order
5 compact fitment status
6 Diameter + Width
7 Finish
8 Application/Vehicle Fitment
9 Quantity + current/starting price
10 gold Add to Cart
11 Save + Share
12 compact trust row
Controls 44–48px, white, thin border, 0–4px radius. Add to Cart 50–54px gold. Price 30–36px navy. Avoid uniform generic 16px stacked-form spacing; cluster related elements.

HERO FITMENT STATUS
Full finder must NOT appear in hero. Unset = compact neutral status + Select Vehicle. Confirmed = pale green (#F2F7F1/#F6F8F4), subtle green border/check, strong “FITS YOUR VEHICLE”, vehicle string, Change Vehicle right. Preserve existing state/event integration.

BUILD YOUR WHEEL
Preserve BOM/configurator-data, configurator-api.js, configurator-app.js, preview layer hooks, Center/Barrel/Hardware, price, availability, configured cart, quote and 2D/3D hooks. Recompose presentation only.
Desktop: white/light; ~52% preview / 48% controls; gap 32–40px; H2 34–38px Facundo; subtitle 15–16px. Preview must be configured wheel composite; pre-init fallback may be actual product wheel media. Never bokeh/scenery/people/furniture. Minimal framing, max useful preview height 400–430px. Keep functional circular finish controls where required; selected = restrained gold. This section is visually secondary to the approved PDP composition.

FULL FITMENT FINDER
Preserve Year→Make→Model→Generation and result logic. Secondary light utility band; 1178px inner; H2 30–34px Facundo; copy 15–16px; four desktop controls when width permits; controls 46–48px; gold submit. Reduce current 80px vertical padding to ~48–56px.

SPECIFICATIONS + ENGINEERING
1178px section; ~47% specs / 53% engineering; gap 28–36px.
Specs: white; H2 34–38px; table 14–15px; thin rules; restrained alternating white/#F7F7F5 rows; no rounded card.
Engineering requires DOM/structural correction. Do NOT retain heading + image + separate navy body/card + duplicate heading + rounded capability cards. Target ONE continuous 360–400px image-backed manufacturing/CNC panel with dark gradient overlay and integrated content. Heading/body white; capabilities integrated along lower portion, not four app cards; radius 0–4px. Use dedicated engineering image setting. If missing, controlled navy fallback and report ASSET_REQUIRED: engineering_image. Remove duplicate “Engineered to Perform”.

AVAILABLE FINISHES
Not a generic card carousel. White/light; H2 34–38px; target six visible on desktop when six exist. Wheel render dominant ~145–175px; minimal/no card chrome; no 260px square generic cards, no 10px radius, no scenery. Label below. Selected = 1–2px gold indicator.
Image priority: finish-specific configured render → finish metafield/metaobject image → explicit Theme Editor image → actual base product wheel as intentional temporary fallback. Never landscape/people/unrelated imagery. Report missing finish assets rather than faking them.

REAL WORLD
White/light; H2 34–38px; body + View Gallery action; four automotive lifestyle images in one row; aspect ~1.50–1.60:1; gap 4–8px; radius 0–2px; no card border/shadow. If absent, retain deterministic settings/placeholders and report gallery_image_1…4. No random photography.

RECOMMENDATIONS
Use exact snippets/calder-product-card.liquid B1 component. Do not design another card. Desktop 4 columns, light/white, centered H2 34–38px, actual recommended product media, wheel dominant. No PDP-specific dominant Quick Add. If product media is bad, report product-data/media issue; do not replace with scenery/people.

SPECIALIST CTA
Image-backed navy wheel/automotive-detail banner when configured; height ~180–210px; restrained overlay; eyebrow + large Facundo heading + copy; gold CTA; Call/Live Chat/Email. Radius 0–4px. Source section.settings.background_image. If missing, solid navy is acceptable and report ASSET_REQUIRED: specialist_cta_background.

HEADER / FOOTER
Do not rebuild. Use globally rendered sections/header.liquid and sections/footer.liquid. No duplicate local header/footer/newsletter. If shared logo missing, report ASSET_REQUIRED: header_logo.

CSS ARCHITECTURE
Refactor assets/calder-product.css instead of appending another override dump. Scope appropriately under .page-calder. Remove contradictory declarations and stale v2 values. Existing geometry variables may remain but must drive actual rules. Avoid !important unless a verified theme selector requires it.
Audit radius, heading sizes, image ratios, gaps, section padding, inherited .btn/select/input, wheel-configurator conflicts and duplicate selectors.
Known bug: desktop hero is display:grid but tablet breakpoint uses flex-direction:column. Fix with grid-template-columns:1fr or another valid grid declaration.
Known bug: mobile H1 has a 32px rule followed by 22px. Remove the 22px override; target 32–36px.

RESPONSIVE
Desktop fidelity first.
768px: valid stacked/compact hero; gallery then info; specs/engineering stack; configurator stacks; fitment may be 2x2; no horizontal overflow.
390px: single column; H1 32–36px; major H2 28–32px; body 15–16px; controls >=44px; logical stacked purchase flow; finishes may horizontal-scroll; B1 recommendations remain readable; zero page overflow.

MEDIA / ASSET GATE
Create product.asset-manifest.v10.json. For hero, configurator, engineering, finishes, Real World 1–4, recommendations, specialist CTA and header logo record:
region; Liquid section/snippet; actual source; fallback; setting/metafield; availability PRESENT/MISSING/PRODUCT_DATA_BLOCKED; semantic validation.
Semantics: hero=wheel; configurator=wheel composite; engineering=manufacturing/CNC; finishes=wheel renders; Real World=automotive lifestyle; recommendations=wheel product media; specialist=wheel/automotive detail. No generic fallback image pool.

FUNCTIONAL NON-REGRESSION
Preserve product variants/form, quantity, cart, price updates, gallery thumbs, fitment state/finder, configurator selections/layers/price/availability/cart/quote, recommendations and Theme Editor schema. Do not rename JS-critical hooks without updating/testing every consumer.

SOURCE CLEANUP
Search Calder PDP files for {# and #}; final count zero. Use valid Liquid comments. No debug text in storefront.

BLOCKING ACCEPTANCE GATE
Do NOT declare complete if implementation still has: theme-default fonts; wrong Facundo/Garet mapping; rounded generic hero card; unrelated hero/configurator imagery; split Engineering image+card; duplicate Engineering heading; 260px generic/scenic finish cards; rounded 4:3 Real World cards; non-B1 recommendations; configured specialist background ignored; duplicate local header/footer; tablet grid bug; 22px mobile H1; Jinja markers; functional configurator/fitment/cart regressions.
Missing merchant assets are not a reason to fake imagery; report them.

VALIDATION
Run available Shopify Theme Check; verify zero Jinja markers; audit duplicate/conflicting selectors; verify calder-product.css remains final PDP presentation stylesheet; verify font-face mapping Facundo 700/Garet 400+700; verify shared header/footer and B1 invocation; verify JS-critical hooks. If browser/computed-style tooling exists, verify H1 Facundo, UI Garet, hero grid and no overflow. Never claim browser verification if unavailable.

OUTPUTS
Create:
- product.v10.implementation-report.md
- product.asset-manifest.v10.json
- product.v10.state.json
State schema:
{"iteration":10,"state":"READY_FOR_VISUAL_QA_ITERATION_10","desktop_fidelity_pass":true,"functional_regression_check":"...","missing_assets":[],"blockers":[]}
If reliable viewport capture exists, create product.desktop.v10.png (1440), product.tablet.v10.png (768), product.mobile.v10.png (390). Otherwise state CAPTURE_UNAVAILABLE; never fabricate screenshots.

FINAL RESPONSE FORMAT
V10 STATUS
FILES CHANGED
STRUCTURAL CORRECTIONS
VISUAL CORRECTIONS
FUNCTIONAL NON-REGRESSION
ASSET STATUS
VALIDATION
OUTPUT FILES
BLOCKERS
NEXT STATE

NEXT STATE must be exactly one of:
READY_FOR_VISUAL_QA_ITERATION_10
BLOCKED_BY_IMPLEMENTATION
BLOCKED_BY_PRODUCT_MEDIA
Do not declare READY merely because code was written; the blocking gate must pass.
