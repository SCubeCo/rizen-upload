---
description: "Phase 1 — Brief Planning. Enter Plan Mode. Read and understand the product brief. Identify risks and unknowns. Confirm understanding with human."
---

# Phase 1: Brief Planning

You are entering Phase 1 of the factory chain. Switch to Plan Mode immediately.

## Instructions

1. Read the product brief provided (or referenced by $ARGUMENTS)
2. Use Explore subagent to understand the relevant parts of the codebase
3. Identify:
   - Technical risks and unknowns
   - Dependencies on external systems or data
   - Areas of ambiguity in the brief
   - Integration points with existing code
4. Ask clarifying questions via AskUserQuestion for anything ambiguous
5. Produce a brief summary confirming your understanding:
   - What we're building (in your own words)
   - Key technical decisions needed
   - Risks identified
   - Open questions resolved

## Jira

Transition the Jira ticket to "In Planning" status.

## Output

Write understanding summary to `.claude/plans/{jira-key}-phase1-brief-understanding.md`

## Gate

Present your understanding for human approval before proceeding.
