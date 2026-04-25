# Phase 3 — Synthesis

**Repository:** next-upload  
**Date:** 2026-04-25  
**Input:** 10 Phase 2 agent reports  

---

## Technical Health Score

### Dimension Scores

| Dimension | Weight | Raw Score | Weighted |
|-----------|--------|-----------|---------|
| Security | 20% | 52 | 10.4 |
| Code Quality | 15% | 55 | 8.25 |
| Architecture | 15% | 68 | 10.2 |
| Business Logic | 15% | 62 | 9.3 |
| API Design | 10% | 60 | 6.0 |
| Data | 10% | 60 | 6.0 |
| Dependencies | 5% | 58 | 2.9 |
| Infrastructure | 5% | 62 | 3.1 |
| Performance | 3% | 65 | 1.95 |
| Team | 2% | 45 | 0.9 |

**Technical Health Score: 59 / 100 — Concerning**

> **40–59: Concerning** — Multiple systemic issues. Safe to use with caution if issues are tracked and addressed. Not ready for high-scale production. Consumer risk is moderate.

---

## Executive Summary

`next-upload` is a small, well-intentioned open-source library built by a capable solo developer. The core concept — wrapping S3 presigned POST policies behind a Next.js handler — is sound, and the architecture's separation of server, client, and React concerns is correctly executed.

However, the library has **not yet reached the quality bar required for production use at scale** without modification. Three systemic risk areas compound each other: the error handling strategy (silent swallowing throughout the stack) makes the upload flow opaque to consumers; the asset lifecycle management (`pruneAssets`) has multiple correctness bugs that become meaningful at scale; and security defaults delegate all responsibility to the consumer without providing guard rails.

The codebase is at `v0.0.30` with explicitly declared breaking-change risk. It shows signs of rapid iteration without hardening passes — dead code, commented-out API calls, `@ts-ignore` suppressions, and a single integration test file are consistent with active pre-alpha development rather than a library ready for production adoption.

---

## Top 5 Risks

### Risk 1 — No content-type enforcement in presigned POST policy [CRITICAL]
**Cross-references:** Security S2, Business Logic B8  
**Cause:** The presigned POST policy `Conditions` array contains only a `content-length-range` check. The `Content-Type` binding was commented out and never restored.  
**Effect:** Any file type can be uploaded regardless of what the consumer's config declares. A consumer configured for `image/*` uploads can receive `.php`, `.html`, or `.exe` files. This is a direct injection vector if the S3 bucket serves files publicly.  
**Fix effort:** Low — one line: add `['starts-with', '$Content-Type', fileType.split('/')[0]]` to Conditions.

---

### Risk 2 — Silent error swallowing across the upload stack [HIGH]
**Cross-references:** Code Quality Q3, Q5, API A3, Business Logic B3  
**Cause:** Four independent locations discard errors silently:
1. `generatePresignedPostPolicy` — nested try/catch with empty catch blocks around existence check
2. `useNextUpload.upload()` — `catch (error) { // }` discards all upload errors
3. S3 HeadObject errors are treated as "object not found" (permission denied = false existence)
4. `deleteObjects` in `pruneAssets` uses `Quiet: true`  

**Effect:** Consumers have no visibility into upload failures. Network errors, permission errors, and configuration errors are all silently ignored. The React hook exposes no `error` state. This is the primary reason the library is hard to debug and integrate safely.  
**Fix effort:** Low-Medium — add `error` state to hook; distinguish S3 error codes; remove empty catch blocks.

---

### Risk 3 — `pruneAssets` is broken at production scale [HIGH]
**Cross-references:** Architecture F7, Performance P4, Business Logic B2/B1, Data DA3  
**Cause:** Four compounding issues:
1. `listObjects` (v1 API) paginates at 1000 objects — objects beyond page 1 are silently skipped
2. `store.all()` loads every asset record into Node.js memory regardless of count
3. Assets with `verified === false` are deleted even if the TTL hasn't expired (race with upload in progress)
4. No database index on `expires`, making store-side TTL queries a full table scan  

**Effect:** On a bucket with >1000 objects, pruning silently misses most of the bucket. On a system with thousands of asset records, the memory load could cause OOM. Actively-uploading users can have their in-progress uploads deleted mid-flight.  
**Fix effort:** Medium — requires replacing `listObjects` with paginated `listObjectsV2`; fixing prune predicate; adding DB index.

---

### Risk 4 — Presigned URLs stored in the database [HIGH]
**Cross-references:** Security S1 (adjacent), Data DA2  
**Cause:** `presignedUrl` and `presignedUrlExpires` are stored as columns in the `next_upload_assets` Postgres table and persisted by the Drizzle store.  
**Effect:** Presigned S3 GET URLs embed AWS credentials (access key ID + signature) in the URL itself. Any database dump, replica, backup, or read replica exposes active S3 access tokens. Database read access becomes equivalent to S3 read access until all cached URLs expire.  
**Fix effort:** Medium — requires removing the columns, migrating the schema, and switching to an in-memory or Redis cache for URL caching.

---

### Risk 5 — `next-tool` base class is an unaudited opaque dependency [MEDIUM]
**Cross-references:** Architecture F2, Dependency D1  
**Cause:** The entire handler routing and store lifecycle is delegated to `next-tool@0.0.6`, a pre-release package by the same author with no documentation in this repository. The action dispatch (`action` field in POST body) validation is done by `next-tool` — whether it validates against the enabled actions allowlist is unknown without inspecting its source.  
**Effect:** If `next-tool` doesn't validate that only enabled actions are dispatched, a client can call `deleteAsset` or `pruneAssets` even if they're not in `config.actions`. Additionally, `next-tool` is a single-author pre-release package — its abandonment or breaking changes directly break `next-upload`.  
**Fix effort:** Medium — audit `next-tool` source; add explicit enabled-action validation in `NextUpload` itself; consider vendoring.

---

## Top 5 Quick Wins

### Win 1 — Add error state to `useNextUpload` hook [IMPACT: HIGH / Effort: LOW]
The `catch (error) { // }` in `useNextUpload.upload()` takes one line to fix with high user-facing impact. Add `error` state and an optional `onError` callback. All consumers benefit immediately.

### Win 2 — Add Content-Type condition to presigned POST policy [IMPACT: HIGH / Effort: LOW]
One line to re-add the `Content-Type` condition that was commented out. Fixes the file type bypass vulnerability. Can be implemented with a semver-minor release.

### Win 3 — Fix `pruneAssets` prune predicate [IMPACT: HIGH / Effort: LOW]
Change one condition: `asset.verified === false` → `asset.verified === false && NextUpload.isExpired(asset.expires)`. Eliminates the race condition with active uploads. Two-line fix.

### Win 4 — Remove commented-out dead code [IMPACT: LOW / Effort: LOW]
Remove ~40 lines of commented-out code in `NextUpload.ts` (old Minio streams, unused postPolicy methods). Makes the file significantly more readable. Zero functional risk.

### Win 5 — Parallelize existence checks in `generatePresignedPostPolicy` [IMPACT: MEDIUM / Effort: LOW]
Replace nested try/catch with `Promise.all([store.find(id), s3HeadObject()])`. Reduces per-upload latency by one network round-trip. Straightforward refactor.

---

## Findings Map (Deduplicated & Clustered)

### Cluster A — Upload Security (S2, S3, B8)
- No MIME type enforcement in post policy conditions
- User-supplied `name`/`uploadType` unsanitized in S3 path construction
- No auth hook in config

### Cluster B — Error Handling (Q3, Q5, A3, B3)
- Silent swallowing in existence check
- Hook discards upload errors
- No typed error contract client-side
- S3 errors not distinguished by code

### Cluster C — Asset Lifecycle (B1, B2, A7, F7, P4, DA3)
- Prune race condition with active uploads
- Wrong prune predicate (`verified === false` vs expired+unverified)
- `listObjects` v1 pagination limit
- Full memory load in `pruneAssets`
- No DB index on `expires`

### Cluster D — Data Storage (DA2, DA1, DA6)
- Presigned URLs stored in Postgres
- Asset payload in `jsonb` blob (not queryable)
- `createdAt`/`updatedAt` dead code in schema

### Cluster E — Edge Runtime (F4, S5)
- `bucketExists()` self-documented as "TOTAL HACK"
- `@ts-ignore` on EdgeRuntime detection
- FileReader polyfill at global scope

### Cluster F — API Consistency (A1, A2, A6)
- Single RPC POST endpoint for all actions
- Inconsistent response shapes (`{asset,assets}` vs `boolean`)
- `pruneAssets` returns no deletion report

### Cluster G — Dependency Risk (D1, D8)
- `next-tool@0.0.6` opaque + pre-release
- `nanoid@5` ESM-only CJS bundle risk

### Cluster H — Developer Experience (Q1, T5, Q7, I3)
- No unit tests (integration-only)
- No CONTRIBUTING.md or `.env.example`
- `name` not persisted despite being in `Asset` type
- Local dev requires Docker

---

## What's Working Well

These are genuine strengths that should be preserved and built on:

1. **Bundle split is correct** — server/client/react separation enforced at tsup level; AWS SDK never reaches browser bundles
2. **Pluggable store interface** — `NextUploadStore` is a clean contract; adding new adapters is straightforward
3. **`UploadTypeConfigFn` pattern** — async per-request config (dynamic paths, auth-based upload types) is a powerful and well-designed feature
4. **S3 size enforcement via post policy conditions** — delegating max size to S3 is the correct approach; no server-side file parsing
5. **Integration tests are well-structured** — parameterised `runTests` pattern covers multiple store backends in one pass
6. **Engineering hygiene** — conventional commits, pre-commit hooks, renovate, CI, release automation — above-average for solo OSS
7. **Presigned GET URL caching** — correctly checks expiry before regenerating; good pattern

---

## Technical Debt Register

| ID | Description | Cluster | Severity | Est. Effort |
|----|-------------|---------|----------|-------------|
| TD-01 | No MIME type in post policy conditions | A | Critical | 1h |
| TD-02 | Silent error swallow in `useNextUpload` | B | High | 2h |
| TD-03 | Silent error swallow in existence check | B | High | 2h |
| TD-04 | `pruneAssets` race condition (prune predicate) | C | High | 1h |
| TD-05 | Presigned URLs in Postgres | D | High | 4h + migration |
| TD-06 | `listObjects` v1 → paginated `listObjectsV2` | C | High | 3h |
| TD-07 | No typed error contract client-side | B | Medium | 4h |
| TD-08 | `next-tool` audit + action allowlist validation | G | Medium | 4h |
| TD-09 | Path traversal: sanitize `name`/`uploadType` | A | Medium | 1h |
| TD-10 | Error message information disclosure | B | Medium | 1h |
| TD-11 | `pruneAssets` full memory load | C | Medium | 4h |
| TD-12 | Edge runtime: `bucketExists` hack | E | Medium | 8h |
| TD-13 | `name` not persisted in store | H | Low | 1h |
| TD-14 | Commented-out dead code | — | Low | 1h |
| TD-15 | No unit tests | H | High | 8h |
| TD-16 | No CONTRIBUTING.md + `.env.example` | H | Low | 1h |
| TD-17 | `nanoid` ESM/CJS bundle test | G | Medium | 2h |
| TD-18 | DB indexes: `expires`, `verified` | C/D | Medium | 1h + migration |
| TD-19 | Parallelize existence checks | — | Low | 1h |
| TD-20 | Storybook removal | H | Low | 30m |

---

## Health Score Calibration Notes

The 59/100 score should be read in context:
- This is a **pre-1.0 library** — the author has explicitly declared it unstable
- The architecture is **fundamentally sound** — the issues are implementation gaps, not structural rot
- Most of the high-severity findings are **individually small fixes** (1-4h each)
- The score would reach **~72/100** after addressing TD-01 through TD-10 alone

For a consumer evaluating adoption:
- ✅ Safe to adopt for non-sensitive file uploads with custom auth wrapper
- ⚠️ Add MIME type validation at application layer until TD-01 is fixed
- ⚠️ Do not rely on `pruneAssets` in production until TD-04/TD-06/TD-11 are addressed
- ⚠️ Do not use the Drizzle store in production until TD-05 (presigned URL in DB) is resolved

---

## Human Review Gate

**Before proceeding to Phase 4 (Roadmap), please review and calibrate:**

1. **Business context:** Is this library being assessed for adoption, for contribution, or for fork? This affects roadmap prioritisation.
2. **Scale target:** Expected upload volume? Determines whether `pruneAssets` memory issues are urgent or theoretical.
3. **Edge runtime priority:** Is Vercel Edge a hard requirement? If yes, Cluster E moves to Critical.
4. **Store choice:** Will the Drizzle store be used? If yes, TD-05 is blocking. If Keyv-only, deprioritise.
5. **Auth model:** Is auth being added at the framework layer (e.g., Next-Auth middleware) or does the library need an `onBeforeAction` hook?

> Ready for `/discover/roadmap` once context above is confirmed.
