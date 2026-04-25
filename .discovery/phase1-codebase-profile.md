# Phase 1 — Codebase Profile

**Generated:** 2026-04-25  
**Repository:** next-upload  
**Discovery Phase:** 1 — Orientation

---

## 1. Repository Identity

| Field | Value |
|-------|-------|
| Package name | `next-upload` |
| Version | `0.0.30` |
| Author | Tim Mikeladze |
| License | MIT |
| Status | Pre-1.0 — under active development, breaking changes expected |
| Repo type | Single-repo library (not a monorepo, but contains an `examples/` sub-app) |
| Primary language | TypeScript |

**Purpose:** A turn-key library for integrating Next.js with signed & secure file-uploads to any S3-compatible storage service (AWS S3, Cloudflare R2, Minio). Generates presigned POST policies and optionally stores asset metadata via pluggable database adapters.

---

## 2. Repository Structure

```
/
├── src/                    # Library source (published to npm)
│   ├── index.ts            # Public barrel export
│   ├── NextUpload.ts       # Core class — main entry point
│   ├── types.ts            # Shared types & enums
│   ├── client/             # Browser-side helpers (presigned post, upload, getAsset)
│   ├── react/              # React hook (useNextUpload)
│   ├── polyfills/          # FileReader polyfill (edge runtime compat)
│   └── store/              # Pluggable store adapters
│       ├── keyv/           # Keyv (generic key-value, incl. @keyv/postgres)
│       └── drizzle/        # Drizzle ORM adapters
│           ├── pg-core/    # Shared Drizzle schema + store logic
│           ├── postgres-js/ # postgres.js driver
│           ├── node-postgres/ # pg driver
│           └── neon/       # Neon serverless driver
├── tests/                  # Vitest test suite + DB migration fixtures
├── examples/               # Standalone Next.js demo app (excluded from tsconfig)
├── docs/                   # Factory methodology docs (not library docs)
└── docker-compose.yml      # Local Postgres for tests
```

---

## 3. Tech Stack

### Core Runtime
| Concern | Technology |
|---------|-----------|
| Language | TypeScript 5.4 |
| Target framework | Next.js ≥13 (App Router + Pages Router supported) |
| S3 SDK | `@aws-sdk/client-s3` v3, `@aws-sdk/s3-presigned-post`, `@aws-sdk/s3-request-presigner` |
| ID generation | `nanoid` v5 |
| Byte parsing | `bytes` |
| Base class | `next-tool` v0.0.6 (internal abstraction layer) |

### Store Adapters (all optional / peer deps)
| Adapter | Driver |
|---------|--------|
| Keyv | `keyv` ≥4 + `@keyv/postgres` |
| Drizzle + postgres.js | `postgres` |
| Drizzle + node-postgres | (pg) |
| Drizzle + Neon serverless | drizzle-orm |

### Build & Tooling
| Tool | Purpose |
|------|---------|
| `tsup` | Library bundler (ESM + CJS, tree-shaking, inline sourcemaps, `.d.ts`) |
| `vitest` + `jsdom` | Unit / integration tests |
| `drizzle-kit` | Schema migration generation for tests |
| `eslint` (airbnb config) | Linting |
| `prettier` | Formatting |
| `husky` + `lint-staged` | Pre-commit hooks |
| `release-it` | Release automation |
| `tsdoc-markdown` | API docs from TSDoc comments |
| `yalc` | Local package linking during development |
| Storybook 8 | Component stories (configured but minimal usage expected) |

---

## 4. Entry Points

### Published Package Exports (tsup `entry`)
| Export path | File |
|-------------|------|
| `next-upload` | `src/index.ts` → re-exports `NextUpload` class + all types |
| `next-upload/client` | `src/client/index.ts` → browser-safe helpers |
| `next-upload/react` | `src/react/index.ts` → `useNextUpload` hook |
| `next-upload/store/keyv` | Keyv store adapter |
| `next-upload/store/drizzle/postgres-js` | Drizzle adapter (postgres.js) |
| `next-upload/store/drizzle/neon` | Drizzle adapter (Neon) |
| `next-upload/store/drizzle/node-postgres` | Drizzle adapter (node-postgres) |

### HTTP Handler Actions (server-side)
| Action | Description |
|--------|-------------|
| `generatePresignedPostPolicy` | Returns presigned POST fields for direct browser→S3 upload |
| `getAsset` | Returns asset metadata + presigned GET URL |
| `deleteAsset` | Hard-deletes asset from S3 + store |
| `verifyAsset` | Confirms upload completed via S3 HEAD check |
| `pruneAssets` | Removes expired unverified assets |

Handlers exposed via: `nup.handler(request)` (App Router), `nup.pagesApiHandler`, `nup.rawHandler`.

---

## 5. Dependency Graph (High Level)

```
Consumer App
  └── next-upload (server)
        ├── NextUpload (core class)
        │     ├── next-tool (base class — handler routing)
        │     ├── @aws-sdk/* (S3 operations)
        │     └── store adapter (optional)
        │           ├── keyv / @keyv/postgres
        │           └── drizzle-orm + driver (pg-core schema shared)
        └── next-upload/client (browser)
              └── next-upload/react → useNextUpload hook
```

---

## 6. Code Metrics

| Metric | Value |
|--------|-------|
| Source files (`src/`) | 21 `.ts`/`.tsx` files |
| Source lines (`src/`) | ~1,327 |
| Test files | 1 main test file (`NextUpload.test.ts`) |
| Store adapters | 4 (keyv, postgres-js, node-postgres, neon) |
| Example routes | 6 (basic, edge, drizzle×3, keyv) |

---

## 7. Configuration Files

| File | Purpose |
|------|---------|
| `tsconfig.json` | Strict mode, ESNext modules, no emit, excludes `examples/` |
| `vitest.config.js` | jsdom environment, setup file, plugin-react |
| `docker-compose.yml` | Postgres container for integration tests |
| `renovate.json` | Dependency update automation |
| `environment.d.ts` | Typed process.env declarations |
| `.github/` | (not visible — likely CI via GitHub Actions based on `release-it`) |

---

## 8. Key Observations for Subsequent Analysis

1. **Pre-1.0 instability signal** — README explicitly warns of breaking changes before v1.0.0. Version is `0.0.30` — high churn rate likely.
2. **`next-tool` dependency** — a low-version (`0.0.6`) internal abstraction. Its health/maintenance is a dependency risk.
3. **Peer deps are wide ranges** — `next >=13`, `react >=17`, `drizzle-orm >=0.27`, `keyv >=4` — good for adoption, but may hide incompatibilities.
4. **Edge runtime support** — `src/polyfills/FileReader.ts` and an `edge/` example route indicate edge runtime is a target but likely partial.
5. **Single test file** — `tests/NextUpload.test.ts` is the only test file. Coverage likely thin.
6. **No CI config visible** — no `.github/workflows/` in workspace view; CI posture unknown.
7. **Storybook configured** — has Storybook scripts and dev dependencies, but no story files are visible in `src/`. May be vestigial.
8. **Store adapter pattern** — clean separation via pluggable stores with a shared Drizzle `pg-core` schema. Good extensibility.
9. **`docs/` contains factory methodology only** — not user-facing library documentation. Real docs live in README.

---

## 9. Phase 2 Readiness

All 10 analysis agents can proceed. Recommended prioritisation:

| Priority | Agent | Reason |
|----------|-------|--------|
| High | Security Auditor | File upload + signed URLs = high-value attack surface |
| High | Dependency Analyst | `next-tool` is tiny/opaque; AWS SDK v3; peer dep range breadth |
| High | Code Quality Analyst | Single test file, pre-1.0, thin coverage expected |
| Medium | API Analyst | 5 handler actions, needs consistency + resilience review |
| Medium | Architecture Analyst | Store adapter pattern quality; edge runtime completeness |
| Lower | Infrastructure Analyst | No CI visible; build pipeline via tsup |
| Lower | Performance Analyst | Library bundle size, tree-shaking, client/server split |
| Lower | Data Analyst | Drizzle schema is simple; 3 migrations in tests |
| Lower | Business Logic Analyst | Upload flow + verification logic correctness |
| Lower | Team Analyst | Single author; git history needed |
