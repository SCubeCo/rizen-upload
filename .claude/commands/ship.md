---
description: "Phase 7 — Ship. Branch, CI/CD, feature flags, DB migrations, deploy. Create PR linked to Jira. Runs ONCE for all slices."
---

# Phase 7: Ship

You are entering Phase 7 of the factory chain. This runs ONCE — single PR for the complete feature.

## Prerequisites

Phase 6 hardening must be complete and reconciled.

## Gate Check (MANDATORY)

Before shipping, verify:
- [ ] All 7 hardening agents completed (check swarm_completion metric)
- [ ] Reconciliation resolved all conflicts
- [ ] Code still compiles after hardening
- [ ] Application still starts and acceptance criteria still pass

## Instructions

1. Transition Jira ticket to "In Review"
2. Ensure all changes are committed with proper messages (`PROJ-123: description`)
3. Create/verify branch follows convention: `feature/PROJ-123-description`
4. Check for any needed:
   - **Database migrations** — create migration scripts if schema changed
   - **Feature flags** — add flag config if feature should be gradually rolled out
   - **Environment config** — update env templates if new env vars needed
   - **CI/CD config** — ensure pipeline will run tests and deploy
5. Run final verification:
   - Full test suite passes
   - Build succeeds
   - Linter passes
   - No unresolved merge conflicts
6. Create PR with description including:
   - Jira ticket link
   - Slice objective
   - Files changed summary
   - Hardening agents that ran and their outcomes
   - Confidence rating from Phase 4
   - Test coverage summary
7. Transition Jira ticket to "Done" when PR merges and deploys

## Metrics

Write ship event to `.claude/metrics/shipped-{jira-key}.json`:
```json
{
  "event": "shipped",
  "jira_key": "",
  "slice": "",
  "pr_number": "",
  "files_changed": 0,
  "tests_added": 0,
  "coverage_percent": 0,
  "hardening_agents_complete": 7,
  "timestamp": ""
}
```
