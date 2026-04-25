---
description: "Phase 6 — Harden. Spawn 7+1 agent team for parallel hardening. 7 core agents always run. Optional 8th (Data Integration Hardener) activates for mock-to-real transitions. Runs ONCE after ALL slices built."
---

# Phase 6: Harden

You are entering Phase 6 of the factory chain.

## ALL-SLICES GATE CHECK (MANDATORY)

Before proceeding, verify:
- [ ] **ALL slices** defined in Phase 2 have been built (not just the current one)
- [ ] Each slice has its own execution outcome metric in `.claude/metrics/`
- [ ] **Architecture review completed** (`/update-architecture` run after final slice)
- [ ] Code compiles without errors in ALL projects
- [ ] Application starts and acceptance criteria pass for ALL slices

**Do NOT start hardening until every slice is built and verified. This is structural, not optional.**

## Step 1: Determine 8th Agent Activation

Check if the Data Integration Hardener should activate:

1. Read `HARDENING_DATA_INTEGRATION` from FACTORY_CONFIG in CLAUDE.md
2. If `true` → activate the 8th agent
3. If `false` → scan for mock patterns anyway (the 6 types: mock data files, stubbed APIs, placeholder credentials, fake generators, commented-out real calls, environment-conditional mocks)
4. If mock patterns found → recommend activation to human, wait for confirmation

## Step 2: Launch Hardening Swarm

1. Transition Jira ticket to "In Hardening"
2. Create an agent team with specialist teammates:

```
Spawn an agent team to harden the code built across all slices.
Each teammate should work in their own git worktree.

Core Teammates (always run):
1. Security reviewer — review for OWASP, auth, secrets, injection
2. Test writer — write unit, integration, contract tests to 80% coverage
3. Resilience hardener — add error handling, retries, circuit breakers, timeouts
4. Observability agent — add structured logging, monitoring, health checks
5. Accessibility agent — WCAG compliance, ARIA, keyboard nav (frontend only)
6. Code standards agent — run linter/formatter, fix naming, clean dead code
7. Documentation agent — update API docs, README, changelog

Optional Teammate (when activated):
8. Data Integration Hardener — STEP 1 ONLY: audit mock patterns, produce migration plan

IMPORTANT: Each teammate works ONLY on their concern. They must not overlap.
EXECUTION ORDER: Let Code Standards agent run last (it reformats others' output).
Security agent typically takes longest — let others finish first.
Data Integration Hardener Step 1 runs in parallel with the swarm.
```

3. Wait for all teammates to complete

## Step 3: Data Integration Gate (if 8th agent activated)

If the Data Integration Hardener produced a plan at `.claude/hardening/data-integration-plan.md`:

1. **Present the migration plan to the human**
2. **Wait for explicit approval** — this is judgment work:
   - Which mocks to migrate?
   - What credentials/endpoints are available?
   - What's the priority order?
   - Are any mocks intentionally staying as mocks?
3. If approved → run Data Integration Hardener Step 2 (mock-to-real migration)
4. If not approved → record as `skipped` and proceed

## Step 4: Reconcile

1. Review all outputs from all agents
2. Resolve any conflicts between agents
3. If Data Integration Step 2 ran, reconcile its changes too
4. Run full test suite on reconciled code
5. Verify build still works

## Metrics

Write swarm completion to `.claude/metrics/swarm-{jira-key}.json`:
```json
{
  "event": "swarm_completion",
  "jira_key": "",
  "agents": {
    "security": "complete|partial|failed",
    "test": "complete|partial|failed",
    "resilience": "complete|partial|failed",
    "observability": "complete|partial|failed",
    "accessibility": "complete|partial|failed",
    "code_standards": "complete|partial|failed",
    "documentation": "complete|partial|failed",
    "data_integration": "complete|partial|failed|skipped"
  },
  "data_integration_step1_approved": false,
  "reconciliation_conflicts": 0,
  "timestamp": ""
}
```

## Next

When hardening is complete and verified, proceed to Phase 7 (`/ship`).
