---
description: "Discovery Phase 1 — Orientation. Map the codebase structure, tech stack, dependencies, and scale before analysis."
---

# Phase 1: Orientation

You are beginning a codebase discovery. Before analysing anything, understand what you're looking at.

## Instructions

1. **Repository structure:** Map the full directory tree (top 3 levels). Identify monorepo/multi-repo/workspace structure. Count packages/services/apps.

2. **Tech stack identification:** Read all config files:
   - package.json / requirements.txt / Gemfile / go.mod / Cargo.toml / pom.xml
   - Dockerfile / docker-compose.yml
   - CI/CD configs (.github/workflows, .gitlab-ci.yml, Jenkinsfile, etc.)
   - Infrastructure configs (terraform, CDK, serverless.yml, etc.)
   - Environment templates (.env.example, .env.template)

3. **Scale metrics:**
   - Lines of code by language (use `cloc` or `find + wc`)
   - File count by type
   - Directory depth
   - Total dependencies (direct and transitive)

4. **Entry points:** Identify all:
   - API route definitions
   - Page/view routes (frontend)
   - CLI commands
   - Scheduled jobs / cron
   - Queue consumers / event handlers
   - Webhook endpoints

5. **External integrations:** From config files and import statements, list all external services (databases, APIs, SaaS tools, payment providers, etc.)

6. **Existing documentation:** Read any README, ARCHITECTURE.md, docs/ folder, ADRs, wiki references.

## Output

Write the Codebase Profile to `.discovery/phase1-codebase-profile.md` with sections:
- Repository Overview
- Tech Stack Summary
- Scale Metrics
- Entry Point Inventory
- External Integration Map
- Existing Documentation Summary
- Initial Observations (anything notable spotted during orientation)

## Next

Proceed directly to Phase 2 (Parallel Analysis Swarm) — no human gate needed.
