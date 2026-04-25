# {PROJECT_NAME} — Agent Guidance

{ONE_LINE_DESCRIPTION}

Architecture, design patterns, and build methodology auto-load from `.claude/rules/` — no manual references needed.

## Standing Constraints (Code-Verified)

### Application Stack

| Decision | Choice |
|----------|--------|
| Language | {LANGUAGE} |
| Framework | {FRAMEWORK} |
| Database | {DATABASE} |
| Testing | {TESTING} |

### Infrastructure

| Decision | Choice |
|----------|--------|
| Cloud Provider | {CLOUD} |
| CI/CD Platform | {CICD} |
| IaC Tooling | {IAC} |

## Design Principles

- {PRINCIPLE_1}
- {PRINCIPLE_2}
- {PRINCIPLE_3}

## Key File Locations

| Purpose | Path |
|---------|------|
| {PURPOSE_1} | {PATH_1} |
| {PURPOSE_2} | {PATH_2} |

## FACTORY_CONFIG

```
PHASE_4_AUTO_APPROVE: false
PHASE_4_AUTO_APPROVE_GREENS: false
PHASE_4_GREEN_ACCURACY_THRESHOLD: 0.95
PHASE_4_MIN_SAMPLE_SIZE: 20
PHASE_4_CURRENT_GREEN_ACCURACY: 0.00
PHASE_4_TOTAL_SAMPLES: 0
ARCHITECTURE_REVIEW_MODE: mandatory
ARCHITECTURE_REVIEW_PASS_COUNT: 0
ARCHITECTURE_REVIEW_AUTO_THRESHOLD: 20
HARDENING_DATA_INTEGRATION: false
DATA_REALITY_COVERAGE_THRESHOLD: 0.90
DATA_REALITY_BLOCK_ON_UNKNOWN: true
AGENTIC_SAFETY_LEVEL: standard
RESTRICT_EXTENDED_THINKING_BROWSER: true
```
