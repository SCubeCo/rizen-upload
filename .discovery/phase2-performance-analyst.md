# Phase 2 — Performance Analyst

**Agent:** Performance Analyst  
**Concern:** Bundle size, caching, query efficiency, memory  
**Date:** 2026-04-25

---

## Summary

For a library, performance concerns are primarily about: bundle size (what consumers pay), runtime efficiency (what happens per upload request), and query efficiency (database operations). The bundle split is correct, tree-shaking is configured, but the AWS SDK v3 modular imports may not tree-shake optimally. Runtime performance is adequate — the critical path (generatePresignedPostPolicy) does 2-3 async operations. The main performance risk is `pruneAssets` which loads all assets into memory and uses deprecated pagination.

**Performance Score: 65/100**

---

## Findings

### P1 — Bundle split is correct: server/client/react separated [Pass]

tsup correctly outputs separate entries:
- `next-upload` — server-only (AWS SDK, no browser)
- `next-upload/client` — browser-safe, no AWS SDK
- `next-upload/react` — hook only

This means a consumer using only `next-upload/client` does NOT bundle AWS SDK v3 — correct and important. The `treeshake: true` setting in tsup config reinforces this.

### P2 — AWS SDK v3 modular imports are correct [Pass]

The code imports from specific packages (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `@aws-sdk/s3-presigned-post`) rather than a monolithic `aws-sdk`. AWS SDK v3 supports modular imports, so only used S3 commands are bundled. Good.

### P3 — `generatePresignedPostPolicy` does 2-3 serial async operations [Medium Risk]

On each upload request:
1. `store.find(id)` — DB query (if store configured)
2. `client.send(HeadObjectCommand)` — S3 round-trip
3. `createPresignedPost()` — S3 credential signing (local, fast)
4. `store.upsert()` — DB write

Steps 1 and 2 are sequential when they could be parallel (both are checking existence). Steps 1+2 are currently in nested try/catch blocks rather than `Promise.all()`.

**Impact:** Each upload request incurs 2 sequential network round-trips before the presigned URL is returned, adding unnecessary latency.

**Fix:**
```ts
const [storeExists, s3Exists] = await Promise.all([
  this.store?.find(id),
  this.client.send(headObjectCommand).then(() => true).catch(() => false),
]);
```

### P4 — `pruneAssets` loads ALL assets into memory [High Risk]

```ts
const assets: Asset[] = await this.store.all();
```

`store.all()` fetches every asset record, then cross-references with S3 `listObjects`. For a production system with thousands of uploads, this could:
- Load large amounts of data into Node.js heap
- Cause timeouts on the HTTP handler if called via HTTP
- Hit S3 `listObjects` 1000-object pagination limit (see Architecture finding F7)

This is the most significant runtime performance risk.

### P5 — Presigned URL caching reduces S3 calls [Pass]

The `getAsset` presigned URL caching in the store (check cache → return if valid, regenerate if expired) is a good performance optimisation. Presigned GET URL generation requires an AWS SDK round-trip; caching valid URLs avoids repeated generation for frequently accessed assets.

### P6 — `deleteObjects` batched correctly [Pass]

`pruneAssets` correctly batches S3 object deletions using `deleteObjects` (multi-object delete) rather than individual `deleteObject` calls. This is the correct pattern.

### P7 — `minify: true` in tsup config [Pass]

Published library output is minified. Good for consumer bundle sizes.

### P8 — `splitting: false` in tsup config [Low Risk]

Code splitting is disabled. For a library with multiple entry points sharing significant code (e.g., `NextUpload` class is imported by store drivers but not by browser client), this may result in some duplication in the output bundles. With `splitting: false`, the server bundle and each store adapter bundle may each include their own copy of shared utilities. Not critical at this codebase size, but worth monitoring.

### P9 — `sourceMap: 'inline'` in production bundle [Low Risk]

Inline source maps are included in the published package. This increases bundle size for consumers. External source maps (`.js.map` files) would be more appropriate for a published library.

---

## Risk Summary

| Finding | Severity | Effort to Fix |
|---------|----------|---------------|
| `pruneAssets` full memory load | High | Medium |
| Serial existence checks (steps 1+2) | Medium | Low |
| Inline source maps in published output | Low | Low |
| `splitting: false` | Low | Low |

---

## Recommendations

1. Refactor `generatePresignedPostPolicy` existence checks to use `Promise.all()`
2. Rewrite `pruneAssets` to use paginated `listObjectsV2` and batch-reconcile with store
3. Switch source maps to `sourcemap: true` (external) instead of `'inline'`
4. Consider enabling `splitting: true` in tsup to share common chunks across entry points
