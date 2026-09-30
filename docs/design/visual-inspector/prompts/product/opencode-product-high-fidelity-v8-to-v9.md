TASK: PRODUCT_HIGH_FIDELITY_CORRECTION_V8_TO_V9
PROJECT: Calder Wheels

READ FIRST:
- product.visual-correction.v8.json
- product.visual-correction.v8.md
- calder-visual-inspector-v1.1.md

MODEL LIMITATION:
You do not have vision. Do not inspect PNGs. The correction files above are the vision-capable inspector's authoritative comparison of `product.desktop.v8.png` against `Calder - 3 - Product(7).png`.

OBJECTIVE:
V8 has the correct broad page flow, so DO NOT rebuild the architecture again. Preserve Build Your Wheel and Find Your Perfect Fit. Correct the visually dominant fidelity failures.

IMPORTANT:
This pass must NOT be considered complete merely because CSS changed. Use the acceptance gate below.

==================================================
1. FIX FONT LOADING FIRST
==================================================
The V8 headings visually resemble a fallback serif rather than the approved Facundo.

Audit every @font-face declaration and actual theme asset filename.
Verify generated asset URLs.
Verify font-weight mappings.
Verify the computed font-family on:
- Apex 201 title
- Build Your Wheel
- Find Your Perfect Fit
- Specifications
- Engineered to Perform
- Choose Your Finish
- See It in the Real World
- You May Also Like
- Contact a Wheel Specialist

They must resolve to Facundo.

Verify body/UI resolves to Garet.

Do not continue assuming fonts are correct because CSS contains the font-family name.

If the current font asset fails to load, correct the @font-face source/format/weight.

Do not use a serif fallback.

==================================================
2. HERO MEDIA — BLOCKER
==================================================
Current V8 hero incorrectly renders forest/stream photography.

Hero must use actual Apex wheel/product media.

Trace the current image source and explain why the scenic image wins.

Correct the binding.

Preferred source:
product.media / product.featured_media containing actual wheel/product imagery.

If product.media contains mixed semantic media, do NOT blindly use the first media item. Use the existing product-gallery media classification/ordering, product featured media, or expose an explicit PDP hero media selector.

The large hero image must be a wheel/product image.

Thumbnails must also be wheel/product/detail media appropriate to the product.

NO scenic fallback.

==================================================
3. HERO VISUAL SCALE
==================================================
Keep:
1178px container
~57% gallery / 43% info
32–40px gap

Increase the right-side visual hierarchy toward the reference:
- larger Facundo product title
- stronger construction/series line
- larger readable body copy
- stronger price
- 44–50px controls
- 50–54px gold Add to Cart
- compact pale-green fitment status
- Save/Share
- compact trust row

Reduce dead space beneath the hero.

Do not add legacy Lumia badges/benefit boxes.

==================================================
4. BUILD YOUR WHEEL — PRESERVE + FIX IMAGE
==================================================
KEEP THE V8 COMPACT SIZE.

Do not substantially increase its height.

Preserve all configurator behavior.

Current preview incorrectly shows beach/coast photography.

Trace the preview source.

It must be:
1. actual configured wheel preview;
2. if not initialized, base Apex wheel product image.

Never:
- beach
- scenery
- generic theme image
- arbitrary product image

Keep:
Center Finish
Barrel/Lip Finish
Hardware/Rivet Finish
availability
configured Add to Cart
Request Quote
summary/state

Keep Calder navy/gold styling.

==================================================
5. FIND YOUR PERFECT FIT — PRESERVE SIZE
==================================================
KEEP this section.

KEEP current compact overall height.

Preserve Year/Make/Model/Generation and existing state/API logic.

Only improve:
- Facundo heading
- Garet labels/controls
- gold CTA
- control scale/readability

Do not expand this back into the oversized legacy section.

==================================================
6. ENGINEERING — BLOCKER
==================================================
Current V8 is not the approved composition.

Replace the current flat/gray visual with ONE image-backed panel.

Required:
- dedicated CNC/machining/manufacturing image
- image covers full panel
- dark navy/black gradient overlay
- ENGINEERED TO PERFORM over image, upper-left
- supporting copy beneath heading
- four capability icons/content across bottom:
  FORGED ALUMINUM
  CNC MACHINED
  STRENGTH TESTED
  REAL WORLD PROVEN

Do not place the heading outside the panel.
Do not duplicate the heading.
Do not render a blank/flat placeholder.

If manufacturing asset is not configured, add/reuse a Theme Editor image_picker and REPORT IT AS MISSING rather than using scenery.

==================================================
7. AVAILABLE FINISHES — BLOCKER
==================================================
Current V8 uses scenic/lifestyle photography.

This is categorically wrong.

Every finish tile must render a WHEEL.

For each finish, source:
1. finish-specific wheel render;
2. finish metafield/metaobject image;
3. Theme Editor finish block image;
4. base Apex wheel image as temporary fallback.

Never use generic lifestyle/scenery.

Desktop:
6 visible items.
Large isolated wheel render.
Minimal white background.
Finish name below.
Gold outline on selected item.

==================================================
8. REAL WORLD — BLOCKER
==================================================
Current V8 has four blank gray boxes.

Populate four automotive lifestyle images from:
- section blocks/image_picker settings;
- documented product metafields/metaobjects;
- existing Calder automotive assets.

They must show vehicles / wheels in real-world context.

Do not use blank placeholders in the final V9 capture.

If assets are not configured, explicitly list the required Theme Editor settings in the report and DO NOT claim READY_FOR_VISUAL_QA_V9.

==================================================
9. RECOMMENDATIONS — BLOCKER
==================================================
Current V8 uses generic lifestyle images.

Use the ACTUAL shared B1 product card.

Do not maintain a PDP-local approximation.

Each recommendation receives its Shopify product object and uses that product's wheel media.

Desktop:
4 cards.
Wheel render dominates.
Model.
Construction.
Price.
Restrained detail arrow/action.

No generic image fallback.
No Quick Add-dominant design.

==================================================
10. HEADER / LOGO
==================================================
V8 is directionally correct but appears underscaled and the logo treatment is not the approved global presentation.

Reuse the exact approved homepage header component and actual Calder logo asset.

Do not approximate the logo with text/placeholder markup.

Preserve:
Wheels
Our Collection
By Vehicle
Gallery
Engineering
Dealers
Search
Account
Cart
Find Your Fit

==================================================
11. SPECIALIST CTA
==================================================
Keep the V8 location.

Upgrade presentation:
- dedicated wheel-detail/automotive background
- dark overlay
- larger Facundo Contact a Wheel Specialist heading
- gold Get in Touch CTA
- Call / Live Chat / Email
- reference-comparable vertical scale

Do not leave it as a flat navy band.

==================================================
12. FOOTER
==================================================
Reuse exact approved homepage footer.

Use actual Calder logo asset.

Do not approximate logo or global footer locally.

==================================================
13. ASSET MAP
==================================================
Create:
product.asset-map.v9.json

Record exact source for:

hero
hero thumbnails
Build Your Wheel preview
Engineering
each Available Finish
each Real World image
each recommendation product image
specialist CTA background
header logo
footer logo

For each record include:
- Liquid variable
- section/snippet
- Theme Editor setting ID or metafield
- fallback
- actual resolved source type

This is mandatory.

==================================================
14. ACCEPTANCE GATE — DO NOT SKIP
==================================================
Before capturing V9 screenshots verify:

[ ] Hero is actual wheel/product imagery.
[ ] Hero thumbnails are appropriate product/detail imagery.
[ ] Build Your Wheel preview is an actual wheel.
[ ] Engineering visibly contains CNC/manufacturing photography.
[ ] All six finish tiles are wheel renders.
[ ] Real World contains four automotive images.
[ ] Recommendation cards contain wheel product imagery.
[ ] Specialist CTA contains wheel/automotive background.
[ ] Header/footer use real Calder logo/shared components.
[ ] Computed major heading font is Facundo.
[ ] Computed UI/body font is Garet.
[ ] Build Your Wheel still functions.
[ ] Fitment still functions.

IF ANY P0 IMAGE/FONT CHECK FAILS:
Do not report READY_FOR_VISUAL_QA_V9.
Report BLOCKED_ASSET_OR_FONT_CONFIGURATION and state exactly what is missing.

==================================================
15. VALIDATION
==================================================
Run Theme Check.

Smoke-test:
- product gallery
- variants
- quantity
- Add to Cart
- Build Your Wheel controls/preview/configured cart/quote
- Fitment Year→Make→Model→Generation/change vehicle
- recommendations
- header/cart/navigation
- footer

==================================================
16. OUTPUT
==================================================
Only after acceptance gate passes capture:

product.desktop.v9.png
product.tablet.v9.png
product.mobile.v9.png

Return:
1. status
2. files changed
3. font verification
4. hero image source
5. Build preview source
6. Engineering source
7. finish image sources
8. Real World sources
9. recommendation component/media source
10. CTA background
11. header/footer reuse
12. product.asset-map.v9.json
13. Theme Check
14. smoke tests
15. remaining deviations
16. screenshot paths

FINAL STATE:
READY_FOR_VISUAL_QA_V9

Do not self-mark ACCEPTED.
