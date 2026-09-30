# OpenCode — Product V5 → V6 High-Fidelity Correction

TASK: PRODUCT_HIGH_FIDELITY_CORRECTION_V5

IMPORTANT MODEL CONSTRAINT:
You do NOT have vision access. Do not attempt to inspect PNG files and do not claim visual verification.

READ AND IMPLEMENT THESE AS THE AUTHORITATIVE HANDOFF:
1. `product.correction.v5.json`
2. `product.correction.v5.md`
3. `product.visual-qa.v5.json`
4. `product.visual-qa.v5.md`
5. `calder-visual-inspector-v1.1.md`

The numeric and structural targets in `product.correction.v5.*` were produced by the vision-capable Visual Inspector after directly comparing the approved mockup against V5.

Do not substitute your own interpretation of the PNG.

OBJECTIVE:
Keep the working PDP architecture and behavior, but materially change the V5 presentation so it follows the supplied correction targets.

CRITICAL DIAGNOSIS:
V5 is not failing because of 4–8px spacing differences. It is failing because the wrong semantic media are being rendered and multiple sections use the wrong composition.

Current unacceptable examples:
- feet photography in hero;
- bokeh in Build Your Wheel;
- landscapes in Available Finishes;
- blank gray Real World cells;
- landscapes/people in recommendation product cards;
- flat-blue placeholder in Engineering;
- reduced/approximate global chrome.

These are blockers.

IMPLEMENTATION ORDER:

P0-A — MEDIA BINDINGS
Trace the source of every image rendered by the PDP.
Do not use a generic shared placeholder array for semantically different sections.

Bind:
- hero = actual `product.media`;
- Build Your Wheel = configured wheel preview;
- finishes = wheel/finish render media;
- Engineering = manufacturing/CNC asset;
- Real World = automotive lifestyle settings/metafields;
- recommendations = recommended products' wheel media;
- specialist CTA = approved/configured wheel-detail background.

If a semantic asset is not available, add/reuse a Theme Editor image setting or documented metafield. Do NOT silently substitute unrelated photography.

P0-B — SHARED GLOBAL COMPONENTS
Reuse the approved homepage header and footer components. Remove PDP-local approximations unless required only as wrappers.

P0-C — HERO
At the 1178px desktop container:
- grid ≈57% gallery / 43% information;
- gap 32–40px;
- gallery total visual height ~500–560px including thumbnails;
- actual wheel media;
- title 48–58px desktop;
- construction 18–22px;
- body 15–17px;
- controls 44–50px;
- primary CTA 48–54px;
- compact pale-green fitment confirmation;
- paired Save/Share;
- trust row.

Preserve all dynamic Apex data and Shopify bindings.

P0-D — ENGINEERING
Replace the current split placeholder construction with one continuous image-backed panel:
- desktop target height 360–400px;
- manufacturing/CNC image covers panel;
- dark overlay for readability;
- heading/copy upper-left;
- four capabilities distributed along bottom.

P0-E — FINISHES
Replace generic photo cards.
Render six wheel finish items across desktop where data permits.
Wheel render target 145–180px.
Minimal white presentation.
Labels below.
Selected item 1–2px Calder gold outline.
Preserve configurator/finish state bindings.

P0-F — REAL WORLD
Populate four desktop automotive landscape images from section settings/metafields.
Use ~1.55:1 landscape ratio and 4–8px gaps.
Do not render empty gray fidelity placeholders.

P0-G — RECOMMENDATIONS
Use the actual shared B1 card implementation.
Four columns desktop.
Actual recommended wheel product media.
Wheel image dominant.
Model/construction/price.
Restrained arrow/detail action.
Quick Add must not visually dominate.

P0-H — SPECIALIST CTA
Target 170–210px desktop height.
Dark navy + configured wheel-detail image.
Large heading left.
Gold Get in Touch right.
Call / Live Chat / Email below.

P1 — BUILD YOUR WHEEL
Preserve ALL existing logic/state/cart/quote behavior.
Use actual configured wheel preview.
Remove bokeh/generic image fallback.
Two-column desktop composition.
Light surface, navy labels, gold selected states.
Do not make this extra functional section visually more dominant than the approved merchandising sections.

P1 — FITMENT
Preserve engine.
Hero status is primary.
Full finder is secondary and visually quieter.

SOURCE HYGIENE:
Search all PDP files for `{#`.
Convert/remove every occurrence.
Only valid Liquid comments may remain.
Rendered source must contain zero `{#`.

RESPONSIVE:
After desktop is corrected, reflow at 768 and 390.
Do not solve responsiveness by shrinking all typography.
Preserve semantic media.
No page-level horizontal overflow.

NON-REGRESSION:
Do not break product forms, variants, prices, quantity, Add to Cart, Save/Share, Build Your Wheel, configured cart/quote, Fitment dependencies/state, recommendations or Theme Editor schema.

VALIDATE:
- Theme Check;
- product/variant/cart smoke test;
- Build Your Wheel smoke test;
- Fitment dependency/change-vehicle smoke test;
- rendered-source `{#` check;
- verify each section's image source is semantically correct.

CAPTURE:
- `product.desktop.v6.png` at 1440
- `product.tablet.v6.png` at 768
- `product.mobile.v6.png` at 390

REPORT:
files changed; image-source mapping by section; shared header/footer reuse; hero; configurator; fitment; specs/Engineering; finishes; Real World; B1 recommendations; specialist CTA; source cleanup; responsive; Theme Check; smoke tests; remaining deviations; screenshot paths.

FINAL STATE:
READY_FOR_VISUAL_QA_ITERATION_6

Do not self-mark ACCEPTED.
