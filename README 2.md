# Claude Code Factory v3.1 — Discovery + Build + Architecture + Safety

A portable, tech-stack-agnostic methodology for analysing **existing** codebases, building on them, and continuously validating architecture using Claude Code.

> For **greenfield** repos where you already know the tech stack, skip discovery and run the factory setup directly.

## What's New in v3.1

- **PostToolUse hooks:** Every Edit/Write triggers an architecture smell reviewer (Sonnet 4.6) and ESLint/Prettier linter — code quality enforced at write time, not review time
- **Agentic safety rules:** 5 standing rules derived from Anthropic's Opus 4.6 System Card — credential scope, minimal footprint, irreversibility gates, explicit failure reporting, purpose over objective
- **Agent purpose statements:** All agent definitions now include a purpose statement (why the work matters, not just what to do) — addresses multi-agent manipulation risk
- **Security reviewer extended:** 4 new checks — credential scope, irreversibility gates, calculated output verification, browser/extended-thinking prompt injection risk
- **Test writer extended:** Intermediate output verification for calculated/rule-derived functions — catches correct-reasoning/wrong-output failures
- **New FACTORY_CONFIG flags:** `AGENTIC_SAFETY_LEVEL` (standard/elevated) and `RESTRICT_EXTENDED_THINKING_BROWSER` (true/false)
- **Agent template updated:** New agents must include purpose statement, single-concern exclusions, minimal tool grants, and safety rule compliance

## What Was New in v3.0

- **Two entry modes:** Greenfield (no discovery) or Discovery → Build
- **Architecture-as-code:** Living `architecture.html` updated at every build phase
- **Document coherence specialist:** Post-setup cleanup removes discovery scaffolding from CLAUDE.md context
- **`.claude/rules/` auto-load:** Architecture standards, design patterns, and build methodology live in rules (not CLAUDE.md)
- **CLAUDE.md stays lean:** Under 100 lines — standing constraints, key paths, factory config only
- **Data Reality Framework:** Every data touchpoint mapped, visualised, and tracked through build→harden lifecycle
- **Continuous architecture review:** `/update-architecture` command after every structural change

## Three Factories, One Workflow

### Discovery Factory (5 phases) — for existing codebases
Interrogate an existing codebase with 10 specialist analysis agents.

```
/discover/orientation    → Map structure, stack, scale
/discover/analyse        → 10-agent parallel swarm
/discover/synthesise     → Unified assessment + health score
/discover/roadmap        → Prioritised work items
/discover/report         → 3 deliverables
```

### Factory Setup — generates CLAUDE.md + rules
Configures the repo for build mode. Two entry points:

```
# After discovery (existing codebase)
/factory-setup discovery

# Greenfield (new project, you provide the tech stack)
/factory-setup greenfield
```

### Build Factory (7 phases) — for building features
Build new features with confidence gates and parallel hardening agents.

```
/plan-brief          → Phase 1: Brief Planning
/slice               → Phase 2: Slice Recommendation
/plan-slice          → Phase 3: Slice Planning
                     → Phase 4: Confidence Gate
/build               → Phase 5: Build
/update-architecture → Refresh architecture visualisation
/harden              → Phase 6: Harden (7+1 agents)
/ship                → Phase 7: Ship
```

### The Bridge
Discovery outputs feed directly into factory setup. Factory setup generates:
- `CLAUDE.md` — lean agent guidance (<100 lines)
- `.claude/rules/architecture-standards.md` — code-verified architecture (auto-loads)
- `.claude/rules/design-patterns.md` — coding conventions (auto-loads)
- `.claude/rules/build-methodology.md` — factory phases (auto-loads)
- `.claude/rules/agentic-safety.md` — safety rules (auto-loads)
- `architecture.html` — living visual architecture document

## Quick Start

### Existing Codebase
1. Copy factory pack into your repo
2. `cp CLAUDE-DISCOVERY.md CLAUDE.md`
3. Run `/discover/orientation` through `/discover/report`
4. Run `/factory-setup discovery`
5. Run `/plan-brief` to start building

### Greenfield Project
1. Copy factory pack into your repo
2. Run `/factory-setup greenfield`
3. Answer the tech stack questions
4. Run `/plan-brief` to start building

See `docs/INSTALL.md` for the full installation guide.

## Safety Architecture (v3.1)

The factory enforces safety at three layers:

| Layer | Mechanism | What it catches |
|-------|-----------|-----------------|
| **Write-time** | PostToolUse hooks (architecture reviewer + linter) | Design smells, principle violations, formatting |
| **Rules** | `agentic-safety.md` (5 standing rules, auto-loaded) | Credential scope, destructive actions, silent failures |
| **Hardening** | Security reviewer (checks 8–11) | Agentic credential misuse, irreversibility gaps, output/reasoning divergence, extended-thinking injection risk |

### Agentic Safety Level

Set via `AGENTIC_SAFETY_LEVEL` in FACTORY_CONFIG:
- `standard` (default) — Irreversibility gate on destructive actions only
- `elevated` — Irreversibility gate on ALL external writes (use for production/customer data builds)

## Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| v3.1 | March 2026 | PostToolUse hooks, Opus 4.6 safety patch, agent purpose statements |
| v3.0 | February 2026 | Architecture-as-code, Data Reality Framework, document coherence, rules auto-load |
