---
description: "Phase 5 — Build. Execute the approved plan. Functional correctness only. No hardening. After each slice: update architecture visualisation."
---

# Phase 5: Build

You are entering the build phase. Execute the approved plan with precision.

## Pre-Flight Checks

1. **Read phase state:** `.claude/metrics/phase-state-{jira-key}.json`
2. **Verify confidence gate passed:** `.claude/metrics/confidence-{jira-key}.json` must exist and be approved
3. **Read the approved plan:** `.claude/plans/{jira-key}-phase3-*.md` or `.claude/plans/{jira-key}-phase4-*.md`
4. **Read standing constraints:** `CLAUDE.md` → standing constraints tables
5. **Read architecture standards:** `.claude/rules/architecture-standards.md` (auto-loaded but re-read for focus)

If any pre-flight check fails, STOP and report what's missing.

## Build Rules

1. **Functional correctness ONLY** — make it work, nothing more
2. Do NOT add: error handling, logging, tests, security hardening, documentation
3. Those are Phase 6 (Harden) concerns — separation is structural, not optional
4. Follow patterns in `.claude/rules/design-patterns.md`
5. Follow architecture in `.claude/rules/architecture-standards.md`
6. Commit frequently — small, atomic commits with Jira key

## Execution

For each task group in the plan:
1. Implement the task group
2. Verify: code compiles, feature works, acceptance criteria met
3. Commit: `{JIRA-KEY}: {description}`

## Post-Build: Architecture Review (MANDATORY — GATE ENFORCED)

After completing this slice, you MUST run the architecture review before doing anything else. The next-slice gate will block if this hasn't been done.

1. **Run `/update-architecture`** to refresh the architecture visualisation
2. Review the output — does the architecture still make sense?
3. Check the Data Reality view — has data source coverage regressed?
4. Record the result (see metrics below)
5. If structural issues found → STOP and surface to human
6. If `refactor_needed` → complete refactoring, re-run `/update-architecture`, then proceed

This is a structural gate, not a suggestion. The factory will not proceed to the next slice until the architecture review is recorded in the execution outcome metric.

## Post-Build: Record Outcome

Write execution outcome to `.claude/metrics/execution-outcome-{jira-key}-{slice}.json`:

```json
{
  "event": "execution_outcome",
  "jira_key": "PROJ-123",
  "slice": "slice-name",
  "confidence_rating": "green",
  "outcome": "success|partial|failure",
  "one_shot": true,
  "replan_count": 0,
  "architecture_review": "pass|refactor_needed|refactor_completed|blocked",
  "data_reality_coverage": 0.85,
  "timestamp": "ISO-8601"
}
```

**The `architecture_review` field is required.** If it is missing or null, the next-slice gate will treat the review as not completed and block progression.

## Next Steps

- If more slices remain → return to Phase 3 (`/plan-slice`) for next slice
- If ALL slices built → proceed to Phase 6 (`/harden`)
- **Do NOT start Phase 6 until ALL slices from Phase 2 are built and verified**
