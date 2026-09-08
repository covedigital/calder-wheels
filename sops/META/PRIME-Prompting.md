# PRIME Prompting — Calder Wheels SOP (META-02)

> **Purpose**: Pre-prompt checklist for ambiguous, high-risk, or architecture-critical tasks. Apply before any decision that has downstream consequences.

---

## When to PRIME

- Any architecture or data-model decision
- Any integration between systems (Shopify ↔ QB ↔ ShipStation)
- Any security, auth, or billing task
- Any task where a wrong decision is expensive to reverse
- Any task flagged as "ambiguous" or "high-risk" in the SOP index

---

## The PRIME Checklist

Before executing, pause and answer:

1. **Problem** — What exactly are we solving? Restate in one sentence.
2. **Risk** — What breaks if we get this wrong? What's the blast radius?
3. **Informs** — Who depends on this decision? What work-block does it unblock?
4. **Model** — What data is involved? What entities, relationships, invariants?
5. **Edge** — What are the boundary cases? (zero stock, missing fitment data, deleted dealer?)

---

## Output Format

```
### PRIME — [Decision Title]

**Problem**: [One sentence]
**Risk**: [Blast radius if wrong]
**Informs**: [Downstream dependencies]
**Model**: [Entities, relationships, invariants]
**Edge**: [Boundary cases]

**Options**:
1. [Option A] — [tradeoffs]
2. [Option B] — [tradeoffs]

**Recommendation**: [Chosen option + rationale]
```

---

## Meta

- If the recommendation requires escalation (Tier 3/4), flag it.
- If multiple systems are involved, always run PRIME before writing code.
- PRIME output goes in `docs/discovery/` decisions folder.
