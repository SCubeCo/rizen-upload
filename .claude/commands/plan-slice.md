---
description: "Phase 3 — Slice Planning. In Plan Mode. Deep plan for an individual slice with data touchpoint mapping. Output executable task groups with acceptance criteria."
---

# Phase 3: Slice Planning

You are entering Phase 3 of the factory chain. Stay in Plan Mode.

## Prerequisites

Phase 2 slice strategy must be approved. Specify which slice: $ARGUMENTS

## Instructions

### 1. Identify Data Touchpoints

Before planning task groups, scan the slice requirements for every external data dependency:
- APIs to call (internal or external)
- Databases to read/write
- File systems, message queues, third-party services
- Credentials, tokens, or keys required
- Data feeds (real-time or batch)

### 2. Data Touchpoint Map (MANDATORY)

For each data touchpoint, produce a map showing the synthetic approach for build and the eventual real integration path:

```markdown
## Data Touchpoint Map

| Data Source | Build Mode | Synthetic Approach | Real Integration (Phase 6) | Fallback Behaviour |
|-------------|------------|--------------------|-----------------------------|-------------------|
| Payment API | synthetic | In-memory stub returning success | Stripe sandbox → production | Error — no silent fallback |
| User DB | synthetic | SQLite with seed data | PostgreSQL (existing) | Error — no silent fallback |
| Email service | synthetic | Log to console | SendGrid API | Queue + retry |
| Analytics feed | synthetic | CSV fixture data | Mixpanel API | Cache last-known, flag stale |
```

**Build mode is ALWAYS `synthetic` for new features.** The factory builds working software on synthetic data first. Real data integration is a Phase 6 hardening concern handled by the Data Integration Hardener.

**Exception — changes to existing real integrations:** When a slice modifies or extends a feature that already runs on real data in production, the Data Touchpoint Map must flag this:

```markdown
| Data Source | Build Mode | Notes |
|-------------|------------|-------|
| Payment API (existing) | real (existing) | Slice extends existing real integration — adding refund endpoint |
| New reporting DB | synthetic | New dependency — build with synthetic, transition in Phase 6 |
```

For existing real integrations being modified, the human must confirm the approach:
- Build against the real integration (if safe and credentials available)?
- Build a synthetic version of the new behaviour and integrate in Phase 6?

**This table is part of the plan approval.** The human reviews and confirms the data approach for each touchpoint.

### 3. Break Into Task Groups

For each task group:
- **Tasks:** Specific work items
- **Acceptance Criteria:** How we know each task is done
- **Files:** Exact files to create/modify
- **Integration Points:** How this connects to existing code
- **Verification:** How Claude will verify the work
- **Data Touchpoints:** Which data sources this group uses, all synthetic unless flagged as existing real

### 4. Data Reality Implementation Requirements

For every data touchpoint in this slice:
- Implement the DataReality contract reporting `configuredMode: "synthetic"`
- Build the synthetic implementation (stub, fixture, generator)
- Document the real integration path in the contract metadata
- Ensure synthetic mode is clearly identifiable — no silent synthetic data that could be mistaken for real

### 5. Order Task Groups

Order by dependency. Flag any task groups that depend on credentials or external access — these may need human action before the agent can build.

## Jira

Transition the slice sub-task to "In Progress".

## Output

Write slice plan to `.claude/plans/{jira-key}-phase3-{slice-name}.md`

The plan MUST include:
1. Data Touchpoint Map
2. Task groups with acceptance criteria
3. For each task group: which data touchpoints it uses

## Gate

Present to human for approval:
1. **Data Touchpoint Map** — is the synthetic approach right? Any existing real integrations to flag?
2. **Task groups and acceptance criteria** — is the work correctly decomposed?
3. **Prerequisite blocklist** — does the human need to provision anything before build starts?
