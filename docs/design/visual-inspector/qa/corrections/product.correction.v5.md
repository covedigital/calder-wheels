# Calder Wheels — Product Correction v5

## Purpose
This is a **vision-to-code handoff**. OpenCode/DeepSeek is assumed to have **no image access**. Do not tell it to “look at the mockup.” Implement the explicit targets below.

## Global
Use the approved shared homepage header/footer. Main PDP surface is white. Primary typography is Calder navy `#0E2A3E`; gold actions/selections use `#C2A48A`. Reserve dark navy for header, Engineering, specialist CTA and footer.

Desktop container: **1178px**.

## Hero
Target desktop grid: **57% gallery / 43% information**, gap **32–40px**.

Gallery should have a large visual footprint (roughly 500–560px tall including thumbnails at the 1178px container). Use **actual wheel product.media only**.

Right panel:
- product title: ~48–58px desktop;
- construction line: ~18–22px;
- body: ~15–17px;
- controls: ~44–50px high;
- primary gold Add to Cart: ~48–54px high;
- compact pale-green fitment confirmation;
- Save/Share paired below CTA;
- trust row below.

Do not use arbitrary fallback images.

## Build Your Wheel
Keep all behavior. Use the **actual configured-wheel preview**. Never show bokeh/generic imagery. Use a balanced two-column desktop layout and Calder light/navy/gold styling. Because this functionality is not present in the approved mockup, keep it visually disciplined and do not let it overpower the hero or merchandising bands.

## Fitment
Hero fitment confirmation is primary. The full finder is secondary and should use a quieter light surface and compact controls while retaining the existing dependency chain.

## Specifications / Engineering
Desktop grid approximately **47% / 53%**, gap **28–36px**.

Engineering target height approximately **360–400px**. It must be ONE continuous manufacturing/CNC image-backed panel with dark gradient overlay. Put heading/copy upper-left and four capability items along the bottom. Remove the current flat-blue “Manufacturing Image” placeholder + separate-card split.

## Available Finishes
Desktop: **6 visible wheel renders**. Target wheel image footprint roughly **145–180px** each depending on available width. Minimal/no card chrome. Label beneath. Selected item gets a **1–2px gold outline**. This section accepts wheel/finish media only.

## Real World
Desktop: **4 columns**, approximately 1.55:1 landscape images, 4–8px gaps. Bind to automotive lifestyle section settings/metafields. Do not show empty gray boxes in fidelity captures.

## Recommendations
Desktop: **4 columns**. Reuse the actual shared B1 card. Wheel image must dominate. Show model, construction and price with restrained arrow/detail action. Quick Add must not be the dominant visual action.

## Specialist CTA
Target ~170–210px desktop height. Dark navy plus wheel-detail/background image. Large heading left. Gold Get in Touch CTA right with Call/Live Chat/Email beneath.

## Footer
Reuse the approved homepage footer component exactly where possible. Do not maintain a reduced PDP-specific approximation.

## Asset binding rules
- hero → product wheel/product media;
- configurator → configured wheel preview;
- finishes → wheel/finish renders;
- Engineering → CNC/forging/manufacturing;
- Real World → automotive lifestyle;
- recommendations → recommended wheel product media;
- CTA → approved wheel-detail/background.

If an asset is absent, expose/use a Theme Editor setting or documented metafield. **Do not substitute unrelated generic photography.**

## Source cleanup
Search all PDP files for `{#`. Remove or convert to valid Liquid `{% comment %}...{% endcomment %}`. Rendered storefront must contain zero `{#` markers.

## Sequence
1. semantic media bindings;
2. shared header/footer;
3. hero scale/composition;
4. Engineering;
5. finishes;
6. Real World;
7. B1 recommendations;
8. specialist CTA;
9. Build Your Wheel styling;
10. fitment styling;
11. responsive reflow;
12. micro-spacing.

## Output
Capture:
- `product.desktop.v6.png`
- `product.tablet.v6.png`
- `product.mobile.v6.png`

Final state: **READY_FOR_VISUAL_QA_ITERATION_6**, not ACCEPTED.
