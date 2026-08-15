---
## [2026-08-15] — Project Scaffold from Ray Shadravan Discovery Meeting

### [STATE] Current Status
Project initialized. This is **Project B** — the new wheel company's e-commerce + component inventory platform — split out from the Ray Shadravan meeting notes (2026-08-14). No development begun; requirements and architecture are the next steps.

### [ACTIVITY] Session Mode
BUILD

### [COMPLETED] What Was Done
- Project directory scaffolded (Ray Shadravan - New Wheel Co)
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
- Separated into three distinct projects: AI Coaching, E5 Wheels Automation, New Wheel Co
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
