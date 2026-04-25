# Claude Code Factory v3.0 — Installation Guide

**Version:** 3.0.0
**For:** Chain Engineers installing the factory on a new or existing repo

---

## What's in the pack

```
claude-code-factory-v3/
├── CLAUDE-DISCOVERY.md                # Discovery methodology — use during discovery phases
├── CLAUDE-TEMPLATE.md                 # Template for generated CLAUDE.md (lean, <100 lines)
├── MEMORY-TEMPLATE.md                 # Session memory template
├── README.md                          # This pack's overview
├── .claude/
│   ├── settings.json                  # Claude Code config (agent teams enabled)
│   ├── commands/
│   │   ├── factory-setup.md          # /factory-setup — generates CLAUDE.md + rules (NEW)
│   │   ├── update-architecture.md    # /update-architecture — refresh arch viz (NEW)
│   │   ├── discover/                  # Discovery phase commands
│   │   │   ├── orientation.md        # /discover/orientation  → Phase 1
│   │   │   ├── analyse.md           # /discover/analyse      → Phase 2
│   │   │   ├── synthesise.md        # /discover/synthesise   → Phase 3
│   │   │   ├── roadmap.md           # /discover/roadmap      → Phase 4
│   │   │   └── report.md            # /discover/report       → Phase 5
│   │   ├── plan-brief.md            # /plan-brief  → Build Phase 1
│   │   ├── slice.md                 # /slice        → Build Phase 2
│   │   ├── plan-slice.md            # /plan-slice   → Build Phase 3
│   │   ├── build.md                 # /build        → Build Phase 5 (+ arch review)
│   │   ├── harden.md                # /harden       → Build Phase 6
│   │   └── ship.md                  # /ship         → Build Phase 7
│   ├── agents/                       # 7 hardening subagents (Build Phase 6)
│   ├── rules/                        # Auto-loading rules (NEW location)
│   │   └── build-methodology.md     # Factory 7-phase chain
│   ├── skills/
│   │   └── document-coherence/      # Doc consistency specialist (NEW)
│   │       └── SKILL.md
│   ├── plans/
│   ├── metrics/
│   └── hardening/
└── docs/
    ├── INSTALL.md                     # This file
    ├── discovery-factory.md           # Discovery methodology deep-dive
    └── discovery-to-build-bridge.md   # How discovery feeds factory-setup
```

---

## Installation: Existing Codebase (Discovery → Build)

### 1. Copy the pack into the existing repo

```bash
cp -r /path/to/claude-code-factory-v3/.claude .
cp /path/to/claude-code-factory-v3/CLAUDE-DISCOVERY.md .
cp /path/to/claude-code-factory-v3/CLAUDE-TEMPLATE.md .
cp /path/to/claude-code-factory-v3/MEMORY-TEMPLATE.md .
cp -r /path/to/claude-code-factory-v3/docs .
```

### 2. Start with Discovery

```bash
cp CLAUDE-DISCOVERY.md CLAUDE.md
```

### 3. Run Discovery (5 phases)

```
/discover/orientation
/discover/analyse
/discover/synthesise     ← human reviews
/discover/roadmap        ← human reviews
/discover/report
```

### 4. Run Factory Setup

```
/factory-setup discovery
```

This generates:
- `CLAUDE.md` — lean agent guidance (<100 lines) from discovery outputs
- `.claude/rules/architecture-standards.md` — from Phase 2 architecture analysis
- `.claude/rules/design-patterns.md` — from Phase 2 code quality analysis
- `architecture.html` — initial architecture visualisation
- Archives discovery outputs to `docs/discovery-archive/`
- Runs document coherence check

### 5. Start Building

```
/plan-brief
```

---

## Installation: Greenfield Project

### 1. Copy the pack

```bash
cp -r /path/to/claude-code-factory-v3/.claude .
cp /path/to/claude-code-factory-v3/CLAUDE-TEMPLATE.md .
cp /path/to/claude-code-factory-v3/MEMORY-TEMPLATE.md .
cp -r /path/to/claude-code-factory-v3/docs .
```

### 2. Run Factory Setup

```
/factory-setup greenfield
```

Answer the tech stack questions. This generates:
- `CLAUDE.md` — from your answers
- `.claude/rules/architecture-standards.md` — skeleton from declared stack
- `.claude/rules/design-patterns.md` — language/framework defaults
- `architecture.html` — skeleton (populated after first build phase)

### 3. Start Building

```
/plan-brief
```

---

## Key Changes from v2.1

| Feature | v2.1 | v3.0 |
|---------|------|------|
| Entry modes | Discovery then manual swap | `/factory-setup discovery` or `greenfield` |
| CLAUDE.md size | Unbounded (grew large) | <100 lines (strict) |
| Architecture detail | In CLAUDE.md | In `.claude/rules/` (auto-loads) |
| Build methodology | In CLAUDE.md | In `.claude/rules/` (auto-loads) |
| Architecture viz | Not included | `architecture.html` + `/update-architecture` |
| Doc coherence | Not included | `.claude/skills/document-coherence/` |
| Data Reality | Not included | Full lifecycle: plan → build → visualise → harden |
| Post-build review | Optional | Mandatory architecture review per slice |

---

## Troubleshooting

**Agent teams not spawning:** Check `.claude/settings.json` has `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS: "1"`.

**Architecture review not running between slices:** Check `ARCHITECTURE_REVIEW_MODE` in FACTORY_CONFIG. Default is `mandatory`. The slice-to-slice gate enforces this.

**CLAUDE.md getting too long:** Run the document coherence specialist. Push detail to `.claude/rules/` files. CLAUDE.md should only contain standing constraints, key paths, and factory config.

**Architecture.html empty after setup:** Run `/update-architecture` after your first build phase. The skeleton is populated on first real scan.

**Rules not auto-loading:** Ensure files are in `.claude/rules/` directory (not `.claude/rules` as a file). Claude Code auto-loads all `.md` files from this directory.
