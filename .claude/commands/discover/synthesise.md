---
description: "Discovery Phase 3 — Synthesis. Consolidate 10 agent reports into a unified technical assessment with health score."
---

# Phase 3: Synthesis

Consolidate all analysis reports into a unified assessment.

## Prerequisites

All 10 Phase 2 analysis reports must exist in `.discovery/phase2-*.md`

## Instructions

1. **Read all 10 agent reports** from `.discovery/phase2-*.md`

2. **Deduplicate findings** — if security and dependency agents both flagged the same CVE, merge into one finding citing both sources

3. **Cross-reference findings** — connect cause and effect:
   - Architecture coupling → test difficulty → low coverage
   - Missing indexes → slow queries → performance problems
   - No CI/CD → manual deployments → high change failure rate

4. **Cluster findings into themes** — group related issues:
   - "Pervasive lack of error handling" not 50 individual missing try/catch
   - "Infrastructure maturity gap" not 15 individual DevOps issues

5. **Calculate Technical Health Score** (0-100):

| Dimension | Weight |
|-----------|--------|
| Architecture | 15% |
| Security | 15% |
| Code Quality | 10% |
| Dependencies | 10% |
| Infrastructure | 10% |
| Data | 10% |
| API Quality | 8% |
| Performance | 7% |
| Team Health | 8% |
| Business Logic | 7% |

Score each dimension 0-100 based on finding severity and density. Multiply by weight. Sum for overall score.

6. **Identify top 5 risks** — the findings that represent the greatest threat to the business, product, or team

7. **Identify top 5 quick wins** — high impact, low effort improvements that build momentum

## Output

Write to `.discovery/phase3-synthesis.md`:
- Technical Health Score (overall + per dimension)
- Finding Summary (counts by severity)
- Themed Finding Clusters (each with consolidated severity, evidence, impact)
- Top 5 Risks
- Top 5 Quick Wins
- Cross-Reference Map (how findings connect)

## Gate

Present synthesis for human review. The human calibrates priorities against business context that the agents cannot know.
