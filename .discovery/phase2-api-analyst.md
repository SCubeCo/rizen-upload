# Phase 2 — API Analyst

**Agent:** API Analyst  
**Concern:** Endpoints, consistency, documentation, resilience  
**Date:** 2026-04-25

---

## Summary

The library's API surface — both HTTP handler actions and the TypeScript public API — is small and reasonably consistent. The main concerns are: action dispatch via a single POST endpoint conflates multiple operations with different HTTP semantics; the client-side API has no error contract; bulk operations have inconsistent response shapes; and the public API exports are not fully documented.

**API Score: 60/100**

---

## Findings

### A1 — All actions use POST to a single endpoint [Medium Risk]

All 5 handler actions (generatePresignedPostPolicy, getAsset, deleteAsset, verifyAsset, pruneAssets) are dispatched via a single `POST /upload` endpoint with `action` in the body. This is an RPC-over-HTTP pattern:

```ts
body: JSON.stringify({
  action: NextUploadAction.generatePresignedPostPolicy,
  input: options.args,
})
```

This conflates what should semantically be:
- `POST /upload` — generatePresignedPostPolicy
- `GET /upload/:id` — getAsset
- `DELETE /upload/:id` — deleteAsset
- `PUT /upload/:id/verify` — verifyAsset
- `DELETE /upload` — pruneAssets

The current approach works but is incompatible with REST conventions, makes it harder to apply different auth/rate-limit rules per action in middleware, and won't work with HTTP caching for `getAsset`.

This is a design choice that works for the library's goal (minimal integration), but should be a documented trade-off.

### A2 — Response shape is inconsistent for single vs bulk operations [Medium Risk]

`getAsset` and `verifyAsset` both accept `args | args[]` (single or array) and return:
```ts
{ asset: Asset; assets: Asset[] }
```

`deleteAsset`, by contrast, accepts `args | args[]` and returns `boolean`.

For `generatePresignedPostPolicy`, it only accepts a single arg and returns `{ postPolicy: SignedPostPolicy }`.

The inconsistency:
- Some actions return `{ asset, assets }`, others return a flat type, others return `boolean`
- `deleteAsset` returns `true` but never `false` (always throws on error) — the `boolean` return type is misleading
- `assets` is always populated but `asset` is `assets[0]` — the dual return adds complexity for no benefit

### A3 — Client API has no standardised error contract [High Risk]

`generatePresignedPostPolicy` (client-side) throws `new Error(json.error)` if `!res.ok`. But:
- No status code is surfaced to the caller
- No error type hierarchy — all errors are plain `Error` instances
- The `upload()` function in `useNextUpload` silently swallows all errors (see Code Quality finding Q5)
- No retry or timeout handling on the fetch call

Consumers have no reliable way to distinguish: network error, auth error, duplicate ID error, or configuration error.

### A4 — `getAsset` presigned URL regeneration is opaque [Medium Risk]

`getAsset` has a caching mechanism for presigned GET URLs — it checks the store for a cached URL and only regenerates if expired. This behaviour is invisible to the caller and not documented in the type signature. The caller receives only `{ asset, assets }` with no indication of whether the URL was fresh or cached, or when it expires.

### A5 — No OpenAPI / JSON Schema definition [Low Risk]

The HTTP handler has no schema documentation. Consumers integrating from non-TypeScript environments (e.g., mobile apps, server-side languages) have no machine-readable contract. The TypeScript types serve as the only API documentation.

### A6 — `pruneAssets` has no response payload [Low Risk]

`pruneAssets` returns `boolean` (always `true`). It gives no information about what was pruned, how many objects were deleted, or whether any errors occurred on individual deletions. The `deleteObjects` call uses `Quiet: true`, suppressing per-object error reporting.

### A7 — `NextUploadClientConfig.api` defaults are good [Pass]

```ts
const api = config.api || `/upload`;
```

The default endpoint is sensible and overridable. The `requestInit` passthrough on fetch allows consumers to add auth headers — a correct pattern.

### A8 — Public TypeScript API is well-typed [Pass]

`types.ts` exports a clean set of types: `NextUploadConfig`, `NextUploadStore` interface, `Asset`, `UploadTypeConfig`, action enums. The `UploadTypeConfigFn` type for async config functions is a good design that enables dynamic per-request configuration (auth-based upload paths, etc.).

---

## Risk Summary

| Finding | Severity | Effort to Fix |
|---------|----------|---------------|
| No error contract client-side | High | Medium |
| Inconsistent response shapes | Medium | Medium |
| Single RPC endpoint | Medium | High (breaking) |
| `pruneAssets` no deletion report | Low | Low |
| No OpenAPI schema | Low | Medium |

---

## Recommendations

1. Define a typed `NextUploadError` class with a `code` field for structured error handling
2. Standardise response shapes — either always return `{ data, errors }` or separate single/bulk variants
3. Surface error codes (not just messages) to the client
4. Document the RPC-over-HTTP pattern as an explicit design decision
5. Add `pruneAssets` response with count of pruned objects
6. Add JSDoc/TSDoc to all public types and methods (tsdoc-markdown is already configured)
