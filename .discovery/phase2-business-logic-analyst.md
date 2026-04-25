# Phase 2 — Business Logic Analyst

**Agent:** Business Logic Analyst  
**Concern:** Domain logic, testability, calculations, edge cases  
**Date:** 2026-04-25

---

## Summary

The core business logic — presigned POST policy generation, asset lifecycle (verify, delete, prune), and asset retrieval — is generally correct for the happy path. Several edge cases in the upload flow are unhandled or silently ignored. The `verifyAssets` feature (confirming uploads via S3 HEAD check) is the most complex logic area and has a potential race condition. The expiry calculation logic is correct but spread across multiple locations.

**Business Logic Score: 62/100**

---

## Findings

### B1 — Upload verification flow has a race condition [High Risk]

When `verifyAssets: true` is configured:
1. `generatePresignedPostPolicy` stores the asset with `verified: false` and a TTL
2. The client uploads to S3
3. The client explicitly calls `verifyAsset` to mark it as verified

Between steps 2 and 3, if `pruneAssets` runs, it will find the asset with `verified: false` and delete it from both S3 and the store — even if the upload just completed. The TTL window is the only protection, and it defaults to the same expiry as the presigned URL (5 minutes). A slow upload + early prune run = silently lost file.

**Recommendation:** `pruneAssets` should check if the asset's post policy has expired before treating an unverified asset as stale.

### B2 — `pruneAssets` logic conflates "unverified" with "stale" [Medium Risk]

```ts
if (!asset || asset.verified === false) {
  pathsToRemove.push(object.Key);
}
```

This removes any S3 object that either: has no asset record, OR has `verified === false`. The intent is to clean up uploads that were never verified (i.e., the browser started an upload but never completed or verified it). However, it also removes:
- Objects that were just uploaded but not yet verified (race condition above)
- Objects with `verified === null` (no verification configured) — these should NOT be pruned

Actually: `verified === null` means verification isn't required, `verified === false` means pending verification, `verified === true` means verified. The prune logic should only target `verified === false AND expires < now()` — not all `verified === false` objects.

### B3 — Existence check uses nested try/catch — fragile [Medium Risk]

The existence check in `generatePresignedPostPolicy` uses nested try/catch to detect whether an asset exists. The logic:
1. Try to find in store → if found, exists = true
2. Try to HeadObject in S3 → if found, exists = true
3. Both silently swallow errors

If the S3 HeadObject check fails for reasons OTHER than "not found" (e.g., permission denied, network timeout), `exists` stays `false` and the upload proceeds as if the object doesn't exist. This could overwrite an existing file silently.

### B4 — `bucketFromEnv` auto-naming is clever but risky [Medium Risk]

```ts
public static bucketFromEnv(project?: string) {
  if (process.env.VERCEL) {
    return NextUpload.bucketFromVercel();
  }
  return [`localhost`, project, process.env.NODE_ENV].filter(Boolean).join('-').toLowerCase();
}
```

On Vercel: `{owner}-{repo}-{env}` (production/preview/development)
On non-Vercel: `localhost-{project}-{node_env}`

This means:
- On local dev with `NODE_ENV=test`: bucket name is `localhost-test`
- A developer who accidentally points at production S3 with `NODE_ENV=test` will use bucket `localhost-test` which may exist
- Renaming the project or repo on Vercel silently changes the bucket name, breaking existing assets

### B5 — `calculateExpires` returns null for TTL=0 [Low Risk]

```ts
public static calculateExpires(ttl: number) {
  if (!ttl) { return null; }
  return new Date(Date.now() + ttl).getTime();
}
```

`!ttl` is falsy for both `0` and `undefined`. Passing `ttl=0` intentionally (meaning "expires immediately") returns `null` (meaning "never expires"). This may be intentional but is not documented and is counter-intuitive. The `upsert` call passes `0` for non-verifying assets, which maps to TTL=0 in Keyv (no expiry) — so this is consistent with Keyv behaviour but could trip up future store implementations.

### B6 — `getAsset` correctly handles presigned URL expiry [Pass]

```ts
if (presignedUrlCache?.presignedUrlExpires && 
    !NextUpload.isExpired(presignedUrlCache.presignedUrlExpires)) {
  // return cached URL
}
```

Presigned GET URL caching logic correctly checks expiry before returning a cached URL. New URL generated and cached on miss or expiry. Correct.

### B7 — `verifyAsset` accepts array but returns first element as primary [Low Risk]

```ts
return { asset: assets?.[0], assets };
```

For batch verify operations, `asset` is always the first element of `assets`. There's no clear use case for the dual return — callers verifying a batch should use `assets`, not `asset`. This is an inconsistent API pattern (see API finding A2).

### B8 — File size enforcement relies entirely on S3 post policy [Pass]

`maxSize` enforcement is delegated to the S3 `content-length-range` condition in the presigned POST policy. S3 enforces this server-side — uploads exceeding the limit are rejected by S3 directly, not by the library. This is the correct approach for a direct-to-S3 upload pattern.

---

## Risk Summary

| Finding | Severity | Effort to Fix |
|---------|----------|---------------|
| Verify/prune race condition | High | Medium |
| `pruneAssets` prunes non-expired unverified | Medium | Low |
| Existence check swallows S3 errors | Medium | Low |
| `bucketFromEnv` fragile naming | Medium | Low |
| `calculateExpires(0)` returns null | Low | Low |

---

## Recommendations

1. Fix `pruneAssets` to only remove assets where `verified === false AND expires < now()`
2. Add explicit error handling in S3 HeadObject existence check — distinguish "not found" from other errors
3. Document `bucketFromEnv` behaviour and recommend explicit `bucket` config in production
4. Add JSDoc contract for `calculateExpires(0)` behaviour
