---
description: "Discovery Phase 5 — Report Generation. Produce the Technical State of Play report, task backlog, and agentic workspace foundation."
---

# Phase 5: Deliverable Generation

Produce the final deliverables from the discovery process.

## Prerequisites

Phase 4 roadmap must be approved by human.

## Instructions

### Deliverable 1: Technical State of Play Report

Create a professional report for leadership/investors. Non-technical language.

**Structure:**
1. **Executive Summary** (1 page max)
   - Overall technical health score and what it means
   - Top 3 risks in business language
   - Top 3 recommendations with expected impact
   - Overall assessment: confidence level in the platform

2. **Technical Health Dashboard**
   - Overall score with RAG indicator
   - Radar chart data (10 dimensions with scores)
   - Comparison to industry benchmarks where possible

3. **Architecture Assessment**
   - What was documented vs what was found
   - Architecture diagram (from code, not from docs)
   - Key structural risks

4. **Risk Register**
   - Prioritised by business impact
   - Each risk: description, likelihood, impact, mitigation, effort
   - Written for non-technical stakeholders

5. **Team & Capability Assessment**
   - Contributor analysis (bus factor, velocity, coverage)
   - Capability gaps identified
   - Hiring/team recommendations

6. **Recommendations**
   - 4 streams with effort/impact positioning
   - Timeline: immediate, short-term, medium-term
   - Investment estimate (effort-days by stream)

7. **Appendix**
   - Detailed findings by category
   - Methodology (how discovery was conducted)
   - Glossary of technical terms

**Output:** `.discovery/deliverables/technical-state-of-play.md`

---

### Deliverable 2: Prioritised Task Backlog

Copy from Phase 4 roadmap, formatted for engineering consumption.

**Output:** `.discovery/deliverables/task-backlog.md` + `.discovery/phase4-jira-import.csv`

---

### Deliverable 3: Agentic Workspace Foundation

Create the CLAUDE.md and supporting files that feed into the Build Factory.

**Contents:**
- `CLAUDE.md` — populated with:
  - Codebase architecture overview (from Phase 1 + Architecture Analyst)
  - Tech stack and conventions (from Phase 1 + Code Quality Analyst)
  - Standing constraints (derived from discovered patterns)
  - Known issues catalogue (from Phase 2 findings)
  - Critical flow documentation (entry points, happy paths, error paths)
  - Pattern guide ("in this codebase, we do X this way")
- `docs/architecture.md` — architecture as it actually is (not as documented)
- `docs/known-issues.md` — prioritised issues with context
- `docs/critical-flows.md` — the paths that matter most

**Output:** `.discovery/deliverables/agentic-workspace/`

> **BRIDGE TO BUILD FACTORY:** The standing constraints and codebase context from this
> deliverable are designed to be copied directly into `CLAUDE-BUILD.md`'s Standing
> Constraints section. See `docs/discovery-to-build-bridge.md` for the full handoff process.

## Completion

Write discovery metrics to `.discovery/metrics/discovery-complete.json`:
```json
{
  "event": "discovery_complete",
  "timestamp": "ISO-8601",
  "codebase": "repo-name",
  "health_score": 0,
  "dimension_scores": {},
  "finding_counts": { "critical": 0, "high": 0, "medium": 0, "low": 0 },
  "agents_completed": 10,
  "work_items_generated": 0,
  "streams": { "risk_reduction": 0, "foundation": 0, "modernisation": 0, "quality_of_life": 0 }
}
```
