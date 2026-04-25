# Phase 2 — Infrastructure Analyst

**Agent:** Infrastructure Analyst  
**Concern:** CI/CD, deployment, monitoring, environments  
**Date:** 2026-04-25

---

## Summary

This is a library, not a deployed service — so the infrastructure surface is limited to: build pipeline, CI, local development setup, and release process. The CI pipeline is functional but fragile (single job, no parallelisation, no caching beyond yarn). The release process uses `release-it` which is solid. No deployment concerns (consumers deploy the library in their apps). Local dev requires Docker (Minio + Postgres) which is a barrier to contribution.

**Infrastructure Score: 62/100**

---

## Findings

### I1 — CI pipeline is functional but single-job [Medium Risk]

The GitHub Actions workflow (`.github/workflows/*.yml`) has a single job `run-ci` that:
1. Sets up PostgreSQL via `harmon758/postgresql-action@v1`
2. Starts MinIO via `docker run` 
3. Checks types
4. Lints
5. Runs tests
6. Builds
7. Builds example app

**Issues:**
- Single job means a lint failure wastes full test/build time — no fail-fast on cheap steps
- No matrix testing across Node versions
- No caching for `examples/` yarn install (separate from root)
- `harmon758/postgresql-action@v1` is a community action at an unpinned major tag — should be pinned to a SHA for security
- `docker run` for MinIO is started without a `--wait` or health check — tests may start before MinIO is ready

### I2 — `release-it` is properly configured [Pass]

The `release` script (`yarn build && yarn release-it`) follows the correct pattern: build first, then release. `release-it` handles changelog generation, git tagging, and npm publish.

### I3 — Local development requires Docker [Medium Risk]

Running tests locally requires:
1. Docker Desktop running
2. `docker-compose up` (Postgres + MinIO)
3. Correct `.env` with `S3_*` and `PG_*` vars

There is no mock/in-memory mode for tests, no `jest.setup.ts` that stubs AWS calls. This is a barrier to quick contribution and means tests cannot run in environments without Docker (e.g., some CI runners, local machines without Docker).

### I4 — `yalc` used for local package linking [Low Risk]

The build script runs `yalc publish` after `tsup`. `yalc` is a local package manager bypass tool — useful for testing the package locally in the example app, but it's an unusual dependency. The `yarn link` that follows may conflict with `yalc`. This is fine for development but documents a complexity in the local dev workflow.

### I5 — No environment variable validation at startup [Medium Risk]

The library reads `process.env.S3_REGION`, `S3_ENDPOINT`, etc. loosely. If a consumer forgets to set required env vars, errors will manifest at runtime during the first upload attempt rather than at startup. There is no validation in `init()` that required env configuration is present.

### I6 — `FUNDING.yml` present [Info]

Confirms this is a public open-source project with the author seeking sponsorship. Not a risk, but relevant context.

### I7 — Docker compose services for test infrastructure [Pass]

`docker-compose.yml` provides Postgres and MinIO — appropriate for integration testing. Credentials (`root`/`password`) are test-only and are not in library source.

### I8 — No observability or health check mechanism [Low Risk]

As a library, there is no built-in observability. The handler has no request logging, no error reporting hooks, no health endpoint. Consumers get no visibility into upload activity unless they wrap the handler. An `onAction` callback hook in config would address this.

---

## Risk Summary

| Finding | Severity | Effort to Fix |
|---------|----------|---------------|
| CI action unpinned + no MinIO health check | Medium | Low |
| No mock mode for unit tests | Medium | Medium |
| No env var validation at startup | Medium | Low |
| Single CI job, no matrix | Low | Low |

---

## Recommendations

1. Pin `postgresql-action` to a specific SHA in CI
2. Add a MinIO health check/wait step in CI before running tests
3. Add an `init()` guard that validates required config is present
4. Consider a mock/stub mode for the S3 client to enable unit testing without Docker
5. Split CI into separate jobs: type-check → lint → test → build (parallel where possible)
