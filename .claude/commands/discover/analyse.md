---
description: "Discovery Phase 2 — Parallel Analysis Swarm. Spawn 10 specialist agents to interrogate the codebase simultaneously."
---

# Phase 2: Parallel Analysis Swarm

Spawn an agent team with 10 specialist analysts. Each works independently on their concern.

## Prerequisites

Phase 1 codebase profile must exist at `.discovery/phase1-codebase-profile.md`

## Instructions

Create an agent team with these teammates. Share the Phase 1 codebase profile with each.

```
Spawn an analysis team to interrogate this codebase. Each teammate investigates their specific concern and produces a structured findings report.

Share the codebase profile from .discovery/phase1-codebase-profile.md with all teammates.

Teammates:
1. Architecture Analyst — dependency graph, coupling, layering violations, architecture-vs-reality, module boundaries
2. Security Auditor — secrets in code, dependency CVEs, OWASP patterns, auth quality, data exposure, input validation
3. Code Quality Analyst — complexity metrics, duplication, dead code, test coverage, linting, naming, pattern consistency
4. Dependency Analyst — outdated packages, abandoned libs, CVE scan, licence audit, pinning strategy, lock file health
5. Infrastructure Analyst — CI/CD pipeline quality, deployment strategy, Dockerfiles, monitoring, environments, backups
6. Data Analyst — schema quality, migrations, indexes, N+1 queries, data validation, referential integrity, sensitive data storage
7. API Analyst — endpoint inventory, response consistency, error handling, documentation, versioning, rate limiting, integration resilience
8. Performance Analyst — bundle sizes, caching, query efficiency, memory patterns, code splitting, asset optimisation
9. Team Analyst — git history, contributors, bus factor, velocity trends, hotspot analysis, PR review patterns, commit patterns
10. Business Logic Analyst — domain logic location, test coverage on business rules, hardcoded values, state machines, calculation accuracy

IMPORTANT: Each finding must include: severity (Critical/High/Medium/Low), location (file paths), evidence, impact, recommendation, and effort estimate (S/M/L/XL).
```

## Output

Each agent writes to `.discovery/phase2-{agent-name}.md`:
- `.discovery/phase2-architecture.md`
- `.discovery/phase2-security.md`
- `.discovery/phase2-code-quality.md`
- `.discovery/phase2-dependencies.md`
- `.discovery/phase2-infrastructure.md`
- `.discovery/phase2-data.md`
- `.discovery/phase2-api.md`
- `.discovery/phase2-performance.md`
- `.discovery/phase2-team.md`
- `.discovery/phase2-business-logic.md`

## Next

When all agents complete, proceed to Phase 3 (Synthesis).
