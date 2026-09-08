---
## [2026-08-15] — Project Scaffold from Ray Shadravan Discovery Meeting

### [STATE] Current Status
Project initialized. This is **Project B** — the new wheel company's e-commerce + component inventory platform — split out from the Ray Shadravan meeting notes (2026-08-14). No development begun; Requirements and architecture are the next steps.

### [ACTIVITY] Session Mode
BUILD

### [COMPLETED] What Was Done
- Project directory scaffolded (Calder Wheels)
- AGENTS.md created with e-commerce implementation role, model routing, and key document references
- Continuity file created (this file)
- Brand directory scaffolded with placeholder brand.md
- Separated from two sibling engagements: `Ray Shadravan - AI Coaching` and `E5 Wheels Automation`

### [IN-PROGRESS] What's Partially Done
Nothing — project is ready for requirements gathering.

### [BLOCKED] What's Waiting
- New company name / brand identity
- Inventory source-of-truth decision (Shopify vs QuickBooks vs middleware)
- Final product catalog and fitment data

### [NEXT] Recommended Next Steps
1. Lock the inventory source-of-truth architecture (hardest problem)
2. Define the wheel configurator component model (center / barrel / hardware)
3. Scope the dealer/B2B portal requirements in detail
4. Map vehicle fitment data structure (Year → Make → Model → Generation/Trim)
5. Select Shopify theme approach + QuickBooks/ShipStation integration apps

### [DECISION] Decisions Made This Session
- Separated into three distinct projects: AI Coaching, E5 Wheels Automation, Calder Wheels
- Commerce = Shopify; Accounting = QuickBooks; Shipping = ShipStation
- Build-to-order / component-inventory model with single source of truth

### [WARNING] Known Pitfalls & Cautions
- Inventory is the hardest technical problem — resolve source of truth first
- The configurator is a product configurator, not simple Shopify variants
- Dealer functionality is first-class, not just "customer login"

### [FILES] Files Modified This Session
- `AGENTS.md` — Created
- `docs/0 - DO NOT DELETE/llm-continuity.md` — Created (this file)
- `brand/brand.md` — Created (placeholder)
- `.gitignore` — Created

### [BRANCH] Git Context
- Branch: main
- Last commit: N/A (repo not yet initialized)
- Uncommitted changes: all files uncommitted

### [AGENT] Session Metadata
- Agent: OpenCode (build)
- Model: DeepSeek V4 Pro

---

## [2026-08-15 #2] — Inspiration Analysis & Documentation Build-out

### [ACTIVITY] Session Mode
BROWSE → BUILD

### [COMPLETED] What Was Done
- Reviewed `bespokerev.com` — extracted design language, catalog structure, feature-spotlight pattern, build-to-order messaging, newsletter drop cadence
- Reviewed `vossenwheels.com` — extracted series taxonomy, finish photography discipline, dual gallery system, faceted filtering, manufacturing authority content, dealer locator gaps
- Created `docs/discovery/inspiration-analysis.md` — full competitive breakdown with synthesis and implications for our requirements
- Updated `brand/brand.md` — added competitive landscape section, refined positioning (middle ground: boutique feel + enterprise catalog + three differentiators neither has)
- Updated `AGENTS.md` — added Design Inspiration table, updated key document paths to match actual structure, added granularity to core requirements
- Updated `AGENTS.md` — corrected SOP paths from `0 - SOPs/` to `sops/`
- Created `docs/discovery/requirements.md` — formal requirements doc (product model, storefront, dealer portal, integrations, non-functional, open questions)
- Created `sops/SOP-Index.md` — 10 SOP stubs + 2 meta SOPs with quick-route table
- Created `sops/META/Activity-Modes.md` — THINK / BUILD / BROWSE / EXECUTE / REMEMBER modes
- Created `sops/META/PRIME-Prompting.md` — pre-prompt checklist for ambiguous/high-risk tasks

### [CHANGED] Updated Requirements
- Finish matrix photography requirement (from Vossen) — feeds configurator visual preview
- Dual gallery taxonomy (vehicle-first + wheel-first) — added to requirements
- Series taxonomy (forged/flow-formed/3-piece) — maps to distinct BOM families
- Quote-first retail funnel (from BespokeRev) — suited to configurable/made-to-order
- Nickname + code naming convention for designs — humanises configurable SKUs
- Faceted URL-param filtering — supports dealer-shareable links

### [DECISION] Decisions Made
- Calder Wheels operates between BespokeRev (boutique) and Vossen (enterprise): boutique feel + enterprise catalog discipline
- Three differentiators neither reference has: fitment finder, live configurator, dealer B2B portal

### [NEXT] Unchanged — still waiting on
1. Inventory source-of-truth architecture
2. Wheel configurator component model
3. Dealer portal scope
4. Fitment data structure
5. Shopify theme approach + integration apps

### [FILES] Files Modified/Created This Session
- `docs/discovery/inspiration-analysis.md` — Created
- `docs/discovery/requirements.md` — Created
- `brand/brand.md` — Updated (competitive landscape, positioning)
- `AGENTS.md` — Updated (inspiration table, corrected SOP paths, expanded requirements)
- `sops/SOP-Index.md` — Created
- `sops/META/Activity-Modes.md` — Created
- `sops/META/PRIME-Prompting.md` — Created
- `docs/0 - DO NOT DELETE/llm-continuity.md` — Updated (this entry)

### [AGENT] Session Metadata
- Agent: OpenCode (build)
- Model: DeepSeek V4 Pro

---

## [2026-08-16] — System Architecture Doc (Draft)

### [ACTIVITY] Session Mode
THINK

### [COMPLETED] What Was Done
- Created `docs/architecture/architecture.md` — full system architecture draft
- Resolved inventory source-of-truth decision: **custom ledger (middleware)** holds component truth; Shopify reflects derived finished-SKU availability; QuickBooks is the accounting sink
- Formalised the data model: Component, BOM, FinishedSKU, Design, Fitment, Vehicle, Dealer
- Documented the available-to-build invariant: `min(floor((on_hand - reserved) / qty))` across BOM
- Defined order lifecycle with human-gate state machine
- Established component-as-finish modeling (finish is identity, not attribute)
- Documented configurator, fitment, and dealer portal architectural skeletons
- Adopted working name "C Wheels" (brand name TBD per brand.md — architecture is name-agnostic)

### [DECISION] Decisions Made
- **Inventory source of truth** = custom component ledger (SOP-002 resolved at architecture level)
- Inventory is the "hardest problem" called out in AGENTS.md — resolved with split: custom ledger (realtime build truth) + QuickBooks (accounting truth)
- Component = type(center|barrel|hardware) × finish (finish is the component's identity)
- Available-to-build is a deterministic function, unit-testable (Tier 1)

### [IN-PROGRESS] What's Partially Done
- Architecture doc is v0.1 — 5 open decisions remain (see §10)
- Configurator, fitment, and dealer portal sections are architectural skeletons; need detail SOPs

### [BLOCKED] What's Waiting
- Integration layer stack confirmation (n8n + ledger vs fully custom)
- Dealer portal: native Shopify B2B vs headless decision
- Configurator delivery mechanism (Shopify app extension vs embedded SPA)

### [NEXT] Recommended Next Steps
1. Confirm integration stack (n8n + custom ledger vs fully custom middleware)
2. Detail the dealer portal scope (native B2B vs headless)
3. Define fitment data schema and curation approach
4. Model the configurator finish matrix + preview pipeline
5. Begin component catalog definition

### [FILES] Files Modified/Created This Session
- `docs/architecture/architecture.md` — Created (System Architecture v0.1)

### [BRANCH] Git Context
- Branch: main
- Last commit: a1bd3e7 ("Initial commit")
- Uncommitted changes: 10 files (all from prior sessions + this)

### [AGENT] Session Metadata
- Agent: OpenCode (think)
- Model: DeepSeek V4 Pro

---

## [2026-08-19] — Dealer Portal Complete Design (Lumia Theme)

### [ACTIVITY] Session Mode
THINK

### [COMPLETED] What Was Done
- Comprehensive dealer portal design document created at `docs/design/dealer-portal-design.md`
- Mapped the complete Lumia theme v7.0.1 design system: CSS variables, component patterns (buttons, cards, tables, badges, forms, grids), section structure, customer account architecture, JS patterns
- Designed **10 screens**: Dashboard, Quick Order, Quote Management, Dealer Catalog (collection + PDP), Application Form (4-step), Application Pending Status, Order Detail (enhanced), Payment Terms & Invoices, Dealer Landing Page
- Defined **full state matrix** (loading, empty, error, edge case) for every component
- Documented information architecture: all URLs, routes, templates, sections, snippets
- Mapped implementation file structure (new files + modified files)
- Defined responsive behavior across all 5 breakpoints
- Established CSS architecture with ~14 sections in dealer-portal.css
- Documented JS architecture for Quick Order, Application Form, Dashboard, and Quotes
- Defined 3-phase implementation priority (Core → Self-Service → Financial)
- All designs exclusively use Lumia's native design system — CSS variables, BEM, section patterns, component patterns — no custom design language

### [DECISION] Design Decisions Made
- **Tabs over subdomain**: CSS-only tabs within `/account` (all content pre-rendered, no JS dependency for v1)
- **Same PDP for dealers and retail**: One product template with conditional dealer pricing block + dual CTA
- **Native Shopify B2B approach**: Customer accounts + tags + metafields — no headless for v1
- **Separate CSS/JS assets**: dealer-portal.css + dealer-portal.js loaded conditionally for dealer-tagged customers only (zero payload for retail)
- **Lumia design system adherence**: Every component references `var(--body-bg)`, `var(--custom-color)`, `.custom-card.bg-alt`, `.btn`, `.table-rounded-corners` etc. — no custom design language
- **Dark/luxury ready**: All CSS references variables, so the dark preset (`#070909` bg, `#c9a96e` gold accent) works without modification

### [NEXT] Recommended Next Steps
1. Implement Phase 1 dealer components (dashboard rewrite, dealer pricing on PDP, dealer-only gating, application form)
2. Wire application form to backend (customer metafields + admin notification)
3. Implement Phase 2 (Quick Order, enhanced quotes)
4. Confirm payment terms integration with QuickBooks middleware before Phase 3

### [FILES] Files Modified/Created This Session
- `docs/design/dealer-portal-design.md` — Created (complete dealer portal design, ~500 lines)
- `docs/0 - DO NOT DELETE/llm-continuity.md` — Updated (this entry)

### [AGENT] Session Metadata
- Agent: OpenCode (think)
- Model: DeepSeek V4 Pro
