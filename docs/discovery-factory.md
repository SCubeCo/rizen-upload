# Discovery Factory — Codebase Interrogation & Technical Assessment

**Factory Mode:** Discovery (vs Build)
**Input:** Codebase access + business context
**Output:** Technical State of Play report + prioritised roadmap + agentic workspace foundation

---

## 1. Why This Exists

When you walk into a codebase as a fractional CTO, interim tech lead, or acquirer doing due diligence, you need answers fast. Today that means weeks of manual code reading, architecture whiteboarding, and gut-feel prioritisation.

The Discovery Factory automates the interrogation, parallelises the analysis, and structures the output — so the human can focus on judgment: "given what the factory found, what matters most for THIS business?"

---

## 2. The Discovery Chain

### Phase 1 — Orientation (Automated)

**Purpose:** Understand what you're looking at before analysing it.

**Agent actions:**
- Map the repository structure (monorepo? multi-repo? packages?)
- Identify the tech stack (languages, frameworks, databases, infrastructure)
- Read all config files (package.json, Dockerfile, docker-compose, CI/CD pipelines, env templates)
- Map the dependency graph (what depends on what)
- Identify entry points (API routes, page routes, CLI commands)
- Count: lines of code, files, languages, contributors
- Produce a **Codebase Profile** document

**Output:** `.discovery/phase1-codebase-profile.md`

**No human gate needed** — this is pure data gathering.

---

### Phase 2 — Parallel Analysis Swarm

**Purpose:** 10 specialist agents interrogate the codebase simultaneously, each with their own concern.

| Agent | Concern |
|-------|---------|
| Architecture Analyst | Structure, coupling, cohesion, layering |
| Security Auditor | Vulnerabilities, secrets, auth, data exposure |
| Code Quality Analyst | Complexity, duplication, coverage, consistency |
| Dependency Analyst | Outdated packages, CVEs, licences, abandoned libs |
| Infrastructure Analyst | CI/CD, deployment, monitoring, environments |
| Data Analyst | Schema quality, migrations, indexes, queries |
| API Analyst | Endpoints, consistency, documentation, resilience |
| Performance Analyst | Bundle size, caching, query efficiency, memory |
| Team Analyst | Git history, bus factor, velocity, hotspots |
| Business Logic Analyst | Domain logic, testability, calculations, edge cases |

**Output:** 10 separate `.discovery/phase2-{agent-name}.md` files

---

### Phase 3 — Synthesis

**Purpose:** Consolidate 10 reports into a unified assessment.

1. Deduplicate findings
2. Cross-reference cause and effect
3. Cluster into themes
4. Calculate Technical Health Score (0-100)
5. Identify top 5 risks and top 5 quick wins

**Output:** `.discovery/phase3-synthesis.md`

**Human gate:** Review, calibrate, add business context.

---

### Phase 4 — Roadmap Generation

**Purpose:** Turn findings into actionable work items.

- 4 streams: Risk Reduction, Foundation, Modernisation, Quality of Life
- Sequenced by severity x impact x dependency
- Timeline: week 1, month 1, quarter 1
- Jira-importable CSV

**Output:** `.discovery/phase4-roadmap.md` + `.discovery/phase4-jira-import.csv`

---

### Phase 5 — Deliverable Generation

3 deliverables:
1. **Technical State of Play Report** — for leadership (non-technical)
2. **Prioritised Task Backlog** — for engineers (technical)
3. **Agentic Workspace Foundation** — for the Build Factory (standing constraints, patterns, known issues)

---

## 3. Technical Health Score

Weighted composite (0-100) across 10 dimensions. See CLAUDE-DISCOVERY.md for full weighting table.

**80-100:** Healthy | **60-79:** Fair | **40-59:** Concerning | **20-39:** Poor | **0-19:** Critical

---

## 4. Discovery vs Build Factory

| Aspect | Build Factory | Discovery Factory |
|--------|---------------|-------------------|
| Input | Product brief | Codebase + access |
| Phases | 7 (plan→build→harden→ship) | 5 (orient→analyse→synthesise→roadmap→deliver) |
| Parallel swarm | 7 hardening agents | 10 analysis agents |
| Human gates | Plan approval, confidence gate | Synthesis review, roadmap calibration |
| Output | Working software + metrics | Report + roadmap + workspace |
| Duration | Hours to days per slice | 1-3 days for full discovery |
| Reuse | Runs per ticket | Runs once per codebase (re-run quarterly) |

---

## 5. Adapting for Different Contexts

### Fractional CTO Discovery
- Full 10-agent swarm, all 3 deliverables
- Agentic workspace is key output (two-for-one value)

### M&A Due Diligence
- Emphasis on Security, Dependencies, Team, Infrastructure agents
- Technical State of Play report is primary output
- Score maps to deal risk assessment

### Quarterly Health Check
- Re-run the full swarm, diff against previous findings
- Track health score over time

### Pre-Transformation Assessment
- Baseline health score becomes "before" in before/after measurement
- Task backlog feeds directly into transformation roadmap

### New Team Member Onboarding
- Lighter version: Agents 1, 3, 7, 10 only (Architecture, Code Quality, API, Business Logic)
- Agentic workspace is primary output
