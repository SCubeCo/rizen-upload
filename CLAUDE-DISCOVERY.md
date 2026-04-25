# Claude Code Factory v3.0 — Discovery Mode

Codebase interrogation and technical assessment factory. Agents analyse. Humans calibrate. The codebase tells the truth.

## Core Discipline

**Orient first. Analyse in parallel. Synthesise into actionable intelligence.**

Every agent has one analytical concern. Every finding has a severity. Every recommendation is prioritised.

---

## The 5-Phase Discovery Chain

### Phase 1 — Orientation (Automated)

Map the codebase before analysing it. Understand structure, stack, and scale.

1. Map repository structure (mono/multi-repo, packages, workspaces)
2. Identify tech stack from config files (package.json, requirements.txt, Gemfile, go.mod, Cargo.toml, Dockerfile, etc.)
3. Read ALL configuration: CI/CD pipelines, Docker configs, env templates, infrastructure-as-code
4. Count: lines of code by language, file count, directory depth
5. Identify entry points: API routes, page routes, CLI commands, scheduled jobs
6. Map external service integrations from config and code imports
7. Read any existing architecture documentation

**Output:** `.discovery/phase1-codebase-profile.md`

**No human gate** — pure data gathering.

---

### Phase 2 — Parallel Analysis Swarm

Spawn 10 specialist agents. Each investigates their concern independently.

**Agents:**
1. **Architecture Analyst** — structure, coupling, layering, architecture-vs-reality
2. **Security Auditor** — OWASP, secrets, CVEs, auth, data exposure
3. **Code Quality Analyst** — complexity, duplication, coverage, dead code, consistency
4. **Dependency Analyst** — outdated packages, CVEs, licences, abandoned libs, lock files
5. **Infrastructure Analyst** — CI/CD, deployment, monitoring, containers, environments
6. **Data Analyst** — schema quality, migrations, indexes, queries, data integrity
7. **API Analyst** — endpoint inventory, consistency, documentation, error handling, integration resilience
8. **Performance Analyst** — bundle size, caching, query efficiency, memory patterns, optimisation
9. **Team Analyst** — git history, contributors, bus factor, velocity, hotspots, review patterns
10. **Business Logic Analyst** — domain logic location, testability, calculations, state machines, edge cases

Each agent outputs to: `.discovery/phase2-{agent-name}.md`

**Each finding must include:**
```markdown
### [FINDING-ID] Title

**Severity:** Critical | High | Medium | Low
**Category:** {agent concern}
**Location:** File paths and line numbers
**Evidence:** What was found (code snippets, metrics, patterns)
**Impact:** What this means for the business/team/product
**Recommendation:** What to do about it
**Effort:** S | M | L | XL
```

**No human gate** — agents work in parallel, findings are objective.

---

### Phase 3 — Synthesis

Lead agent consolidates all 10 reports into a unified assessment.

1. Deduplicate (same issue found by multiple agents)
2. Cross-reference (connect architecture problems to their performance consequences)
3. Cluster findings into themes (not 50 individual issues — "pervasive lack of error handling")
4. Calculate Technical Health Score (0-100, weighted across 10 dimensions)
5. Identify the top 5 risks (the things that keep a CTO up at night)
6. Identify the top 5 quick wins (high impact, low effort)

**Output:** `.discovery/phase3-synthesis.md`

**Human gate:** Review synthesis. Calibrate priorities against business context.

---

### Phase 4 — Roadmap Generation

Turn findings into a prioritised, actionable plan.

1. Generate work items from finding clusters
2. Group into 4 streams:
   - **Immediate Risk Reduction** — critical security, data integrity, operational risk
   - **Foundation Improvements** — CI/CD, testing, monitoring, developer experience
   - **Architecture Modernisation** — refactoring, decoupling, migration
   - **Quality of Life** — documentation, tooling, consistency
3. Sequence by: severity × impact × dependency order
4. Produce timeline: week 1 priorities, month 1 plan, quarter 1 roadmap
5. Produce Jira-importable format (CSV/JSON)

**Output:** `.discovery/phase4-roadmap.md` + `.discovery/phase4-jira-import.csv`

**Human gate:** Review and adjust priorities.

---

### Phase 5 — Deliverable Generation

Produce the outputs stakeholders need.

#### Deliverable 1: Technical State of Play Report
For leadership/investors. Non-technical language.

#### Deliverable 2: Prioritised Task Backlog
For the lead developer/engineering team. Technical language.

#### Deliverable 3: Agentic Workspace Foundation
For feeding into Factory Setup. Includes:
- Standing constraints derived from discovered tech stack
- Architecture standards derived from codebase analysis
- Design patterns derived from coding conventions
- Critical flow documentation
- Known issues catalogue

**Output:** `.discovery/deliverables/`

---

## Severity Framework

| Severity | Definition | Action Timeline |
|----------|-----------|-----------------|
| **Critical** | Production risk, security exposure, data integrity, regulatory | Fix this week |
| **High** | Significant tech debt, operational gaps, scalability blockers | Fix this quarter |
| **Medium** | Quality improvements, modernisation candidates | Plan for next quarter |
| **Low** | Polish, consistency, optimisation | When convenient |

---

## Technical Health Score

Weighted composite (0-100):

| Dimension | Weight | Agent Source |
|-----------|--------|-------------|
| Architecture | 15% | Architecture Analyst |
| Security | 15% | Security Auditor |
| Code Quality | 10% | Code Quality Analyst |
| Dependencies | 10% | Dependency Analyst |
| Infrastructure | 10% | Infrastructure Analyst |
| Data | 10% | Data Analyst |
| API Quality | 8% | API Analyst |
| Performance | 7% | Performance Analyst |
| Team Health | 8% | Team Analyst |
| Business Logic | 7% | Business Logic Analyst |

---

## Running Discovery

### First Time (Full Discovery)
```
/discover/orientation    → Phase 1
/discover/analyse        → Phase 2 (parallel swarm)
/discover/synthesise     → Phase 3
/discover/roadmap        → Phase 4
/discover/report         → Phase 5
```

### Follow-Up (Quarterly Health Check)
Re-run Phases 1-3, diff against previous synthesis to track improvement.
