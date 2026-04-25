---
description: "Phase 2 — Slice Recommendation. In Plan Mode. Recommend how to slice the brief for delivery. Map dependencies. Recommend sequence."
---

# Phase 2: Slice Recommendation

You are entering Phase 2 of the factory chain. Stay in Plan Mode.

## Prerequisites

Phase 1 brief understanding must be approved.

## Instructions

1. Based on the approved brief understanding, recommend vertical delivery slices
2. Each slice should:
   - Deliver user-visible value independently
   - Be deployable on its own
   - Have clear boundaries (files, components, APIs)
3. For each slice, provide:
   - **Name:** Brief descriptive name
   - **Objective:** What this slice delivers
   - **Scope:** Files/components/APIs involved
   - **Complexity:** S / M / L
   - **Dependencies:** What must be done before this slice
4. Map the dependency graph between slices
5. Recommend a delivery sequence (which slice first, which can parallelise)
6. Identify which slices could be assigned to parallel agent teams

## Jira

Create one Jira sub-task per slice for Plandek cycle time tracking:
- Naming: `{PROJ-KEY}: Slice N — {slice name}`
- Initial status: To Do

## Output

Write slicing strategy to `.claude/plans/{jira-key}-phase2-slice-strategy.md`

## Gate

Present slicing strategy for human approval before proceeding to Phase 3.
