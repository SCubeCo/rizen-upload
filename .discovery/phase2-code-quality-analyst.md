# Phase 2 — Code Quality Analyst

**Agent:** Code Quality Analyst  
**Concern:** Complexity, duplication, coverage, consistency  
**Date:** 2026-04-25

---

## Summary

The codebase is small and mostly consistent. The primary quality concerns are: very thin test coverage (one test file, integration-only, no unit tests), liberal use of `any` types in the core class, a meaningful amount of commented-out dead code, and silent error swallowing in critical paths. Naming is consistent, formatting appears enforced by Prettier, and ESLint rules are comprehensive (airbnb config).

**Code Quality Score: 55/100**

---

## Findings

### Q1 — Thin test coverage: one integration test file [High Risk]

The entire test suite is a single file: `tests/NextUpload.test.ts`. All tests require a live Minio + Postgres connection (see `docker-compose.yml`). There are:
- **Zero unit tests** — no tests for pure logic functions (`calculateExpires`, `isExpired`, `getIdFromPath`, `bucketFromEnv`)
- **Zero edge case tests** — no tests for error paths, invalid config, expired assets
- **No component tests** — `useNextUpload` hook has no tests
- **No client-side tests** — `upload.ts`, `generatePresignedPostPolicy.ts` untested

The integration tests that exist are well-structured (parameterised `runTests` pattern covering Keyv and Drizzle stores) but they only test the happy path.

**Impact:** High. Breaking changes in business logic would not be caught without a full live environment.

### Q2 — `any` types in core class [Medium Risk]

In `NextUpload.ts`:
```ts
const getConfig = async (valueOrFn: any): Promise<UploadTypeConfig> => {
```
```ts
const postPolicyFn = typeof uploadTypeConfig.postPolicy === 'function'
  ? uploadTypeConfig.postPolicy
  : (x: any) => x;
```

`any` is used where proper generics or union types could be used. With `strict: true` in `tsconfig.json`, these `any` usages are deliberate suppressions of type safety. `UploadTypeConfigFn` type exists but isn't used in the `getConfig` helper.

### Q3 — Silent error swallowing in existence checks [High Risk]

In `generatePresignedPostPolicy`, duplicated existence checks swallow errors silently:
```ts
try {
  if (await this.store?.find(id)) { exists = true; }
  try {
    await this.client.send(headObjectCommand);
    exists = true;
  } catch (error) {
    // console.log(error);
  }
} catch (error) {
  // console.log(error);
}
```

Both catch blocks are empty (with commented-out `console.log`). Any network error, permission error, or unexpected exception during the existence check will silently result in `exists = false`, potentially causing duplicate uploads or overwritten assets.

### Q4 — Commented-out dead code [Low Risk]

Significant commented-out blocks in `NextUpload.ts`:
1. Old Minio stream-based `listObjectsV2` implementation in `pruneAssets` (~15 lines)
2. Commented-out `postPolicy.set*()` calls in `makeDefaultPostPolicy` (~8 lines)
3. Commented-out parameter destructuring with inline comments explaining why they're unused

This adds noise and suggests in-progress migration work never cleaned up.

### Q5 — `useNextUpload` hook silently swallows upload errors [High Risk]

```ts
try {
  const res = await _upload(options, config);
  await setSignedPostPolicies((prev) => [...prev, ...res]);
} catch (error) {
  //
}
```

All upload errors are silently discarded. There is no error state exposed in the hook return value. Consumers cannot surface upload errors to users.

**This is a significant UX defect masquerading as a code quality issue.** The hook should expose an `error` state.

### Q6 — Duplicate `fileType` check [Low Risk]

In `generatePresignedPostPolicy`:
```ts
if (!fileType) {
  throw new Error(`fileType is required`);  // Line ~200
}
// ... 60 lines later ...
if (!args?.fileType) {
  throw new Error(`fileType is required`);  // Line ~260
}
```

The same validation is performed twice. The second check uses `args?.fileType` after `fileType` has already been destructured from `args`. The second check is logically unreachable given the first.

### Q7 — `name` field stored as empty string [Low Risk]

In `generatePresignedPostPolicy`:
```ts
await this.store?.upsert?.({
  ...
  name: '',  // hardcoded empty string
  ...
})
```

The `name` from the client args is accepted and used in path construction but never persisted to the store. The `Asset` type has a `name` field. This is either a bug or an incomplete implementation.

### Q8 — ESLint config is comprehensive [Pass]

The ESLint setup uses: `airbnb`, `typescript-sort-keys`, `sort-class-members`, `unused-imports`, `prefer-arrow`. This suggests the author values consistency. The presence of `eslint-plugin-storybook` confirms Storybook is intentionally configured.

### Q9 — Naming is consistent [Pass]

`camelCase` for variables/methods, `PascalCase` for classes/types, `SCREAMING_SNAKE` not used (no constants needing it). Enum values use `camelCase` keys consistently. File naming follows a clear pattern.

---

## Risk Summary

| Finding | Severity | Effort to Fix |
|---------|----------|---------------|
| No unit tests | High | Medium |
| Silent upload error in hook | High | Low |
| Silent error swallowing in existence check | High | Low |
| `any` types | Medium | Low |
| `name` not persisted | Low | Low |
| Duplicate validation | Low | Low |
| Dead code | Low | Low |

---

## Recommendations

1. Expose `error` and `onError` in `useNextUpload` hook return value
2. Add unit tests for pure functions (`calculateExpires`, `isExpired`, `getIdFromPath`, `bucketFromEnv`)
3. Replace empty catch blocks with proper error logging/rethrowing
4. Remove all commented-out dead code
5. Either persist `name` from args or remove the field from `Asset` type
