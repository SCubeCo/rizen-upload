# Code Factory Memory

> This file persists across Claude Code sessions. Keep it under 200 lines.
> Store factory-generic learnings here. Store project-specific tech notes
> in separate files and link from here.

## Factory Run Log

| Run | Jira Key | Status | PR | Architecture Review |
|-----|----------|--------|----|---------------------|
| FACTORY-001 | _key_ | _status_ | _link_ | _pass/refactor_ |

## Factory Process Learnings

### Chain Phase Enforcement
- NEVER skip Phase 4 (Confidence Gate) even when user says "implement" or "build"
- Before writing ANY code, run confidence assessment for each task group
- Save to `.claude/metrics/confidence-{jira-key}.json` BEFORE building
- If PHASE_4_AUTO_APPROVE is false (current default), present confidence to human and wait for approval
- Phase sequence: 1→2→3→4→5→6→7. No skipping. No combining.

### Architecture Review (v3.0 addition)
- Run `/update-architecture` after EVERY slice in Phase 5
- Visual architecture review catches structural drift before it compounds
- If refactoring needed, better per-slice than after all slices complete
- Learned from Mean Machine crypto build: significant refactoring was needed once architecture was visible

### PostToolUse Hooks (v3.1 addition)
- Every Edit/Write triggers two hooks: architecture smell review (Sonnet 4.6) and ESLint/Prettier check
- The architecture reviewer checks design smells, behavioural violations, and principle violations
- ESLint/Prettier hook only fires on .ts/.tsx files — other file types pass through
- If the reviewer rejects a change, address the violation before proceeding
- The hook runs automatically — no manual invocation needed

### Agentic Safety (v3.1 — Opus 4.6 Patch)
- 5 standing safety rules in `.claude/rules/agentic-safety.md` — apply to ALL agents at ALL times
- Rule 1: Credential scope — never scan for or reuse credentials not explicitly provided
- Rule 2: Minimal footprint — only the permissions needed for the immediate task
- Rule 3: Irreversibility gate — human confirmation before destructive actions
- Rule 4: Explicit failure reporting — no silent workarounds
- Rule 5: Purpose over objective — when task and purpose conflict, purpose wins
- AGENTIC_SAFETY_LEVEL in FACTORY_CONFIG controls Rule 3 strictness (standard/elevated)
- Use `elevated` for production/customer data builds

### Agent Purpose Statements (v3.1)
- All agent definitions now require a purpose statement (distinct from the task description)
- Purpose = WHY the work matters to the organisation (not what to do)
- Addresses Opus 4.6 multi-agent manipulation risk: narrow-objective agents are more willing to game task metrics
- New agents must follow AGENT-TEMPLATE.md — existing agents updated in this release

### Plan File Location (v3.0 bug fix)
- Architecture review per slice catches structural drift early
- All plan references use `.claude/plans/filename.md`

### All-Slices-Before-Hardening Rule
- Build ALL slices (Phase 3→4→5 loop) before starting Phase 6 (Harden)
- Hardening runs ONCE across the full codebase, not per-slice
- Rationale: later slices modify files from earlier slices, invalidating per-slice hardening

### CLAUDE.md Discipline (v3.0 addition)
- CLAUDE.md stays under 100 lines — standing constraints, key paths, factory config only
- Architecture standards, design patterns, build methodology live in `.claude/rules/`
- Rules files auto-load — no `@` references needed in CLAUDE.md
- Document coherence specialist runs post-setup to eliminate duplication

### Session Boundaries
- Design for session boundaries — context window will blow out on a full 7-phase chain
- Each phase (or slice within Phase 5) is a natural session boundary
- Read phase-state file at start of every session to restore context

### Hardening Agent Order
- Code Standards agent should run effectively last (reformats output from other agents)
- Security agent typically takes longest — let others finish first

### Key Decisions
- Git init in Slice 1, not Phase 7
- Resolve real Jira key before Phase 1 starts
- Create one Jira sub-task per slice for Plandek cycle time data

## Tech Stack Notes

> Create a separate file per stack and link here as you accumulate learnings.
