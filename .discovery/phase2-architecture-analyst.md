# Phase 2 — Architecture Analyst

**Agent:** Architecture Analyst  
**Concern:** Structure, coupling, cohesion, layering  
**Date:** 2026-04-25

---

## Summary

The library has a clean, well-layered architecture for its size. The separation between server-side core, client-side helpers, React integration, and store adapters is intentional and mostly well-executed. The main structural risks are: an opaque base class (`next-tool`) that owns handler routing; progressive edge runtime support that is incomplete; and a file-level duplication pattern in the store adapters.

**Architecture Score: 68/100**

---

## Findings

### F1 — Layering is correct and well-separated [Low Risk]

The library cleanly separates:
- `src/` (server) — `NextUpload` class, exposed only on Node/Edge server
- `src/client/` — browser-safe functions (no AWS SDK imports)
- `src/react/` — React hook, wraps client helpers
- `src/store/` — pluggable adapters, not imported by the client layer

The tsup `entry` config enforces this split at the bundle level — consumers can import `next-upload/client` and get no server-side code. Good.

### F2 — `next-tool` base class is an opaque dependency [Medium Risk]

`NextUpload` extends `NextTool<NextUploadConfig, NextUploadStore>` from `next-tool@0.0.6`. This base class owns:
- Handler routing (HTTP action dispatch)
- Store lifecycle (`getStore()`, `init()`)
- Config merging

The library cannot be meaningfully understood without understanding `next-tool`, yet `next-tool` is at version `0.0.6`, is authored by the same person, and has no documentation in this repo. If `next-tool` introduces breaking changes or is abandoned, this library is directly impacted. The coupling is tight and non-obvious.

**Recommendation:** Vendor or inline the `next-tool` logic, or at minimum document the contract clearly.

### F3 — Store adapter pattern: good design, poor DRY [Medium Risk]

There are 4 store adapters:
- `keyv/store.ts`
- `drizzle/pg-core/store.ts` (shared Drizzle logic)
- `drizzle/postgres-js/` — thin wrapper + driver init
- `drizzle/node-postgres/` — thin wrapper + driver init
- `drizzle/neon/` — thin wrapper + driver init

The `pg-core/store.ts` pattern is good — shared Drizzle logic, driver-specific entry points just inject a db instance. However, each driver folder (`postgres-js`, `node-postgres`, `neon`) contains nearly identical `index.ts` and boilerplate. A factory function pattern would reduce duplication.

The `NextUploadStore` interface (defined in `types.ts`) is the correct abstraction point — any new adapter just needs to implement it. That's good.

### F4 — Edge runtime support is partial and hack-acknowledged [High Risk]

`bucketExists()` contains this comment:
```
// THIS IS A TOTAL HACK!!!
// AWS SDK v3 HeadBucketCommand does not support Edge runtime.
```

The `@ts-ignore` is used twice alongside a runtime `globalThis.FileReader` polyfill. The `src/polyfills/FileReader.ts` also self-identifies as a hack. This means the `init()` → `bucketExists()` path is brittle on edge runtimes. The examples include an `edge/` and `edge-with-drizzle-neon/` route, suggesting edge is an advertised use case — but the implementation is held together with workarounds.

### F5 — Commented-out dead code in core class [Low Risk]

`NextUpload.ts` contains several blocks of commented-out code:
- The old Minio `listObjectsV2` stream-based implementation in `pruneAssets()`
- Commented-out post policy conditions (fileType, metadata, content-disposition)
- Large commented-out `makeDefaultPostPolicy` method body

These leave the code harder to read and suggest in-progress migration from a previous S3 client. Should be removed.

### F6 — `getAsset` presigned URL caching via store — subtle coupling [Medium Risk]

The `getAsset` implementation caches presigned GET URLs in the store (via `savePresignedUrl` / `getPresignedUrl` / `deletePresignedUrl`). This makes the store responsible for two logically separate concerns: asset metadata persistence and URL caching. These should ideally be separated, but given the library's size, it's acceptable if properly documented.

### F7 — `pruneAssets` uses `listObjects` (v1 API) not `listObjectsV2` [Medium Risk]

The code migrated from MinIO streams to `listObjects` (S3 ListObjects v1), not `listObjectsV2`. ListObjects v1 is paginated at 1000 objects and is deprecated by AWS in favour of v2. If a bucket contains >1000 objects, `pruneAssets` will silently miss objects beyond the first page.

---

## Risk Summary

| Finding | Severity | Effort to Fix |
|---------|----------|---------------|
| `next-tool` coupling | Medium | Medium |
| Store adapter boilerplate duplication | Low | Low |
| Edge runtime hacks | High | High |
| Commented-out dead code | Low | Low |
| `listObjects` v1 pagination limit | Medium | Low |

---

## Recommendations

1. Replace `listObjects` with paginated `listObjectsV2` in `pruneAssets` — straightforward fix
2. Remove commented-out dead code  
3. Document the `next-tool` contract or consider vendoring it
4. Track edge runtime limitations explicitly in docs until properly resolved
