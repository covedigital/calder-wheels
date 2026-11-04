# 2E. Product Gallery and Zoom

## Approved behavior to preserve
When a builder component changes while a shopper views a secondary image, the product gallery returns to the first slide containing the interactive builder.

## Refinements
- Add an accessible enlarged/full-width product image zoom/lightbox, using existing theme capabilities where possible.
- Correct image sizing, aspect ratios, and layout without causing cumulative layout shift or harming performance.
- Keep each product's supplemental images relevant to that **same wheel design**; finish differences in lifestyle photos can be acceptable.
- Flag unrelated or hallucinated assets for admin replacement; do not invent assets or mass-delete content without approval.
- Keep PDP media gallery separate from dedicated vehicle/wheel gallery pages.

## Acceptance
Switching components reliably returns to builder slide; zoom works with keyboard, touch, escape/close and focus management; gallery controls and rendering stay fast and correct.
