---
description: "Discovery Phase 4 — Roadmap Generation. Turn findings into a prioritised, actionable plan with Jira-importable work items."
---

# Phase 4: Roadmap Generation

Turn the synthesised findings into actionable work items.

## Prerequisites

Phase 3 synthesis must be approved by human at `.discovery/phase3-synthesis.md`

## Instructions

1. **Generate work items** from each finding cluster:
   - Title (clear, actionable)
   - Description (what's wrong, why it matters, what to do)
   - Severity (from synthesis)
   - Effort (S/M/L/XL)
   - Dependencies (what needs to happen first)
   - Acceptance criteria (how you know it's done)
   - Recommended approach (specific technical guidance)

2. **Group into 4 streams:**
   - **Stream 1: Immediate Risk Reduction** — critical security, data integrity, operational
   - **Stream 2: Foundation Improvements** — CI/CD, testing, monitoring, DX
   - **Stream 3: Architecture Modernisation** — refactoring, decoupling, migration
   - **Stream 4: Quality of Life** — documentation, tooling, consistency

3. **Sequence** by severity x impact x dependency order within each stream

4. **Produce timeline:**
   - **Week 1 priorities** — critical fixes, quick wins, must-do-first items
   - **Month 1 plan** — foundation stream, risk reduction completion
   - **Quarter 1 roadmap** — architecture work, modernisation starts

5. **Produce Jira-importable CSV** with columns:
   Summary, Description, Issue Type, Priority, Labels, Story Points, Epic Link

## Output

- `.discovery/phase4-roadmap.md` — human-readable roadmap
- `.discovery/phase4-jira-import.csv` — Jira bulk import file

## Gate

Present roadmap for human review. Human adjusts priorities based on business context, budget, team capacity, and strategic direction.
