# 2A. Universal Wheel Builder

## Existing behavior to preserve
- Each of the six wheel designs has a design-specific universal builder.
- Center, barrel and bolt selections update the composite wheel and part number/SKU correctly.
- Component changes are fast, and valid selections remain consistent with the design.
- Builder gallery returns to the configurator slide on component changes.

## Immediate requirement
Add an obvious, accessible **Explore Other Designs** selector/navigation on every universal design product page. It should allow fast switching between available designs without navigating back to listings. Prefer a minimal, theme-consistent UI and avoid duplicating builders or inventing a new product data model.

## State rules
- Never transfer incompatible component options or bolts across designs.
- Resolve each destination design's valid defaults and options from existing data.
- Preserve compatible user preferences only when confirmed by existing mappings; otherwise reset gracefully and communicate selection changes.
- Design-specific hardware/bolt visual alignment must be correct.

## Deferred enhancement
A truly seamless cross-design builder with shared compatible configuration state is a separate scoped phase, **not** a prerequisite to the immediate navigation.

## Acceptance
All six design links resolve correctly; component layers and part numbers match the destination; no JavaScript errors or broken history/navigation; existing builder interactions pass regression tests.
