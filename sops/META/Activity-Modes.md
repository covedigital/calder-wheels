# Activity Modes — Calder Wheels SOP (META-01)

> **Purpose**: Declare operating mode at session start so all agents operate with the same intent.

---

## Modes

### THINK
**Purpose**: Research, design, architecture, scoping — no code committed.

**Triggers**:
- Designing the configurator or inventory model
- Scoping architecture decisions
- Researching integration options
- Requirements gathering

**Output**: Decision records, scoped requirements, architecture notes in `docs/discovery/`.

**Constraints**: Do not build. Do not commit. Write findings to discovery docs.

---

### BUILD
**Purpose**: Implementation — code written, tested, committed.

**Triggers**:
- Implementing Shopify theme
- Building components, features, integrations
- Writing tests, fixing bugs

**Output**: Committed code, updated tests, deployed artifacts.

**Constraints**: Complete THINK phase first for any feature that lacks a design. Do not deploy without testing.

---

### BROWSE
**Purpose**: Research external tools, apps, APIs — Shopify App Store, integration docs, competitor sites.

**Triggers**:
- Evaluating Shopify apps for fitment/configurator
- Researching QuickBooks ↔ Shopify sync options
- Competitor analysis

**Output**: Findings in `docs/discovery/` or `reports/`.

**Constraints**: No implementation — just research and documentation.

---

### EXECUTE
**Purpose**: Production operations — deploy, publish, configure live systems.

**Triggers**:
- Publishing a store
- Enabling live checkout
- Configuring production integrations

**Output**: Live, operational systems.

**Constraints**: Requires human approval. Always verify pre-deploy checklist. Never EXECUTE without confirming with the client/project lead.

---

### REMEMBER
**Purpose**: Review progress, update continuity docs, verify state.

**Triggers**:
- Session start (read `llm-continuity.md`)
- Session end (write to `llm-continuity.md`)
- After completing a milestone

**Output**: Updated `llm-continuity.md`.

**Constraints**: Always run REMEMBER at session start and end. Never skip continuity updates.
