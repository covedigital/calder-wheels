# 2D. Product Listing Cards

## Authoritative implementation specification
Read this local file **in full** before making any product-card changes:

`/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels/docs/design/site-updates_11-2-2026/Calder_Product_Card_Specifications_OpenCode_Prompt.md`

That file governs the product card UI, configuration labels, presentation, interaction, and any specific implementation requirements. **Do not replace its specifications with the illustrative examples from the meeting summary.**

## Meeting intent
Customers must distinguish combinations of the same wheel design without opening each product. Relevant distinctions may include center, barrel, bolt finish, diameter and other fields, **subject to the authoritative card specification**.

## Guardrails
- First audit current product card templates/snippets and collection filtering.
- Use real mapped product/variant/metafield data; do not hardcode examples.
- Preserve click destinations, card layout behavior, performance, accessibility and mobile responsiveness.
- Resolve any conflicts by reporting them rather than silently overriding the authoritative specification.

## Acceptance
All card changes meet the referenced specification, with no regression in filters, links, collection rendering or universal product navigation.
