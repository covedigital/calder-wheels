# Calder Product Card — Specifications Snapshot
## OpenCode implementation prompt

Implement a targeted addition to the existing Calder product card.

Read and follow the project’s current CALDER_OPENCODE_MANDATORY_GUARDRAILS.md before editing.

## Goal

Add these three sections immediately above `.calder-card__price`:

1. Available Sizes
2. Available Finishes
3. Shown Configuration

Everything else must remain unchanged: imagery, title, eyebrow, pricing, quantity controls, purchase button, customization CTA, wishlist, card styling, and existing functionality.

Inspect the CURRENT implementation before editing. Do not replace it with an older version or recreate the card from the mockup.

## Authorized scope

- `snippets/calder-product-card.liquid`: Add the requested presentation markup and dynamic data output.
- `assets/calder-product-card.css`: Add only narrowly scoped styles for the new sections.
- Existing card JavaScript: Only if necessary, add a small card-scoped synchronization handler using the existing variant-selection events. Identify the exact file before editing. Do not rewrite variant selection or product-form logic.

All other files are read-only.
Apply to the existing Calder Light and Dark premium layouts only.
Preserve legacy layouts.

## Placement

Place the new sections inside `.calder-card__content`, directly before the existing price output.

If sizes, finish swatches, or the selected finish already render elsewhere in this card, reuse/move those existing elements into the requested sections. Do not duplicate them.

Do not move the price, purchase controls, or other card elements relative to each other.

## Section 1 — Available Sizes

Example:

Available Sizes  
22″ · 24″ · 26″

- Read actual values from the product’s Diameter option.
- Find the option by name, not a hardcoded option position.
- Use the project’s existing option-name conventions.
- Show unique values separated by “ · ”.
- Preserve existing inch units without duplicating quote marks.
- Do not hardcode sizes from the mockup.
- Omit this section if there is no reliable diameter data.
- This is an informational list, not a new diameter picker.

## Section 2 — Available Finishes

Example: Three compact swatches labeled Gloss Black, Black Tint, and Titanium Tint.

- Reuse the existing functional swatches / variation picker.
- Target the Center Finish option, not Barrel & Lip Finish.
- Identify options by name rather than assuming option2.
- Display the actual available finish values.
- Preserve picker inputs, IDs, names, form associations, data attributes, availability indicators, selected state, and event listeners.
- Keep the existing theme setting controlling swatch visibility.
- If swatches are disabled, show a simple text list of actual finishes without adding replacement interactive controls.
- Use compact swatches with visible finish names and wrapping labels.
- Do not fabricate finish colors or image assets when no mapping exists; retain the theme’s existing fallback.
- Do not show duplicate pickers.

## Section 3 — Shown Configuration

Use a compact panel with a small heading:

**SHOWN CONFIGURATION**

| Diameter | Center Finish |
| --- | --- |
| 22″ | Titanium Tint |
| **Bolts** | **Barrel** |
| Chrome | Black |

- Use a two-column grid at normal card widths.
- Use a subtle background appropriate to the existing Light/Dark theme.
- Small muted labels; readable values in the existing card text color.
- Keep spacing compact and avoid heavy borders or shadows.
- Collapse to one column only when needed at narrow card widths.

### Data rules

Shown Configuration must represent the configuration actually shown or selected on THIS card, not an arbitrary combination of defaults.

Source values from the existing resolved card configuration:

- Diameter: selected Diameter option.
- Center Finish: selected Center Finish option.
- Bolts: actual selected/fixed hardware finish.
- Barrel: actual selected Barrel & Lip Finish or dedicated barrel value.

Inspect current product, variant, metafield, and configuration mappings before choosing sources. Prefer existing normalized/resolved values.

A metafield listing allowed hardware finishes is NOT evidence that a specific finish is selected.

Do not use arbitrary values such as:

- always Chrome bolts;
- always Black barrel;
- always the first Center Finish;
- current_variant.option2 without checking the option position.

Do not parse SKUs, handles, or descriptive titles unless the current project already has a documented reliable mapping for that source.

When a value cannot be resolved reliably, omit that field rather than inventing a selected value.

If no configuration can be resolved, omit the panel.

## Synchronization

- Initial server-rendered values must match the card’s existing resolved selection.
- When the existing picker changes a selection, update the snapshot through the existing card/variant event flow.
- Scope updates to the affected card instance, including when the same product appears more than once.
- Preserve current variant IDs, pricing updates, media behavior, availability, quantity rules, and cart submissions.
- Use textContent for text updates.
- Handle dynamically rendered cards through the existing lifecycle; avoid duplicate listeners and global DOM queries.
- Do not introduce a separate configuration state or variant resolver.
- If a change creates an unresolved combination, do not keep displaying stale values as if they describe a valid selection.

Do not add a “Change options” link, dropdown, modal, or accordion in this task. The requested sections and existing picker are sufficient.

## Preserve everything else

Do not change:

- product images or image-selection logic;
- titles, eyebrow wording, or construction labels;
- price markup, compare-at prices, From, or / wheel;
- dealer visibility or pricing;
- quantity / Quick Shop / Add to Cart behavior;
- customization CTA or its URL;
- card borders, shadows, padding, typography outside the new sections;
- collection grids, carousel layout, header, footer, fitment, configurator, or global styles.

Use existing Calder tokens and inherit the current font system.
Do not hardcode example product information.

## Validation

Verify:

1. The three sections appear immediately above .calder-card__price.
2. Available Sizes lists actual diameter options.
3. Available Finishes reuses the existing picker without duplication.
4. Shown Configuration matches the resolved card selection.
5. Changing a finish updates only that card’s snapshot and preserves existing price/media/cart behavior.
6. Unknown bolts/barrel values are omitted rather than fabricated.
7. Light and Dark layouts remain readable.
8. Narrow cards have no horizontal overflow or clipped finish names.
9. Collection and carousel cards work after dynamic rendering.
10. Existing controls, links, and legacy layouts remain unchanged.

## Deliverable

Return:

- exact files modified and minimal diff;
- data source used for each snapshot field;
- checks actually performed;
- any unresolved data or event dependencies;
- the mandatory guardrails post-edit report.

Do not claim browser verification unless performed.
Do not push or publish the theme.

