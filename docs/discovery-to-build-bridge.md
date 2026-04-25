# Discovery → Factory Setup → Build Bridge

How Discovery Factory outputs feed into Factory Setup, which generates the Build Factory configuration.

---

## The Three-Stage Workflow

```
┌─────────────────────────────────────────────┐
│           DISCOVERY FACTORY                  │
│                                              │
│  Phase 1: Orientation  ──→ Codebase Profile  │
│  Phase 2: Analyse      ──→ 10 Agent Reports  │
│  Phase 3: Synthesise   ──→ Health Score       │
│  Phase 4: Roadmap      ──→ Prioritised Plan   │
│  Phase 5: Report       ──→ 3 Deliverables     │
│                              │                │
└──────────────────────────────┼────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   FACTORY SETUP     │
                    │   /factory-setup    │
                    │   discovery         │
                    └──────────┬──────────┘
                               │ Generates:
                               ├─ CLAUDE.md (<100 lines)
                               ├─ .claude/rules/architecture-standards.md
                               ├─ .claude/rules/design-patterns.md
                               ├─ .claude/rules/build-methodology.md
                               ├─ architecture.html
                               │
┌──────────────────────────────┼────────────────┐
│           BUILD FACTORY      │                │
│                              ▼                │
│  Standing Constraints ◄── CLAUDE.md           │
│  Architecture Rules   ◄── rules/arch-*.md     │
│  Design Patterns      ◄── rules/design-*.md   │
│  Phase methodology    ◄── rules/build-*.md    │
│                                                │
│  /plan-brief  → Phase 1                        │
│  /slice       → Phase 2                        │
│  /plan-slice  → Phase 3                        │
│  /build       → Phase 5 + /update-architecture │
│  /harden      → Phase 6                        │
│  /ship        → Phase 7                        │
└────────────────────────────────────────────────┘
```

---

## What Factory Setup Does

1. **Reads** all discovery outputs from `.discovery/`
2. **Distils** into lean CLAUDE.md (standing constraints, key paths, factory config)
3. **Generates** architecture-standards.md from Phase 2 architecture analysis
4. **Generates** design-patterns.md from Phase 2 code quality analysis
5. **Copies** build-methodology.md from factory template (standard for all projects)
6. **Creates** initial architecture.html from architecture analysis
7. **Archives** discovery outputs to `docs/discovery-archive/`
8. **Runs** document coherence specialist to verify consistency

---

## What Discovery Delivers TO Factory Setup

| Discovery Output | Factory Setup Generates | Where It Lives |
|-----------------|------------------------|----------------|
| Tech Stack Summary (Phase 1) | Standing Constraints tables | `CLAUDE.md` |
| Architecture Assessment (Phase 2) | Architecture standards | `.claude/rules/architecture-standards.md` |
| Code Quality Analysis (Phase 2) | Design patterns | `.claude/rules/design-patterns.md` |
| Health Score (Phase 3) | Risk calibration config | `CLAUDE.md` FACTORY_CONFIG |
| Known Issues (Phase 2-3) | Anti-patterns section | `.claude/rules/architecture-standards.md` |
| Pattern Guide (Phase 2) | Coding conventions | `.claude/rules/design-patterns.md` |
| Critical Flows (Phase 5) | Key file locations | `CLAUDE.md` |
| Full Architecture (Phase 2) | Initial visualisation | `architecture.html` |

---

## Key Design Decision: Why Rules Files?

In v2.1, all architecture detail, build methodology, and design patterns lived in CLAUDE.md. This caused problems:

1. **CLAUDE.md grew too large** — 200+ lines, consuming context window
2. **Mixed concerns** — standing constraints tangled with methodology
3. **No auto-loading** — everything had to be in one file
4. **Duplication** — same information in CLAUDE.md and discovery outputs

v3.0 separates concerns:
- **CLAUDE.md** — what constraints exist (100 lines max)
- **`.claude/rules/`** — how to work within them (auto-loaded, unlimited)
- **`architecture.html`** — what the architecture looks like (visual, data-driven)
