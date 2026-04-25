# Phase 2 — Security Auditor

**Agent:** Security Auditor  
**Concern:** Vulnerabilities, secrets, auth, data exposure  
**Date:** 2026-04-25

---

## Summary

For a library that exists to handle file uploads via presigned URLs, the security posture is reasonable at the protocol level (S3 presigned posts are a well-proven pattern). However, there are several significant gaps: no authentication layer in the handler, liberal error message exposure, a content-type bypass vulnerability in post policies, unrestricted file path construction from user input, and a `@ts-ignore` suppression that may mask a runtime security assumption. No secrets are hard-coded.

**Security Score: 52/100**

---

## Findings

### S1 — NO AUTHENTICATION on upload handler [Critical Risk / Out-of-Scope by Design]

The `NextUpload` HTTP handler (`nup.handler(request)`) performs no authentication or authorization. The README acknowledges this:

> "🔒 This a good place to add authentication to your upload route"

This is by design — auth is delegated to the consumer. However, the library provides no helpers, middleware hooks, or examples that show auth integration. The `generatePresignedPostPolicy` action is enabled by default. Any unauthenticated caller can obtain a presigned POST policy and upload arbitrary files to the configured S3 bucket.

**Severity:** Critical in production if the consumer does not add auth. The library must more prominently warn about this in docs and ideally provide an auth callback hook in config.

### S2 — Content-Type bypass: no MIME type enforcement in post policy [High Risk]

`makeDefaultPostPolicy` generates the presigned POST conditions as:
```ts
Conditions: [['content-length-range', 0, maxSizeBytes]],
```

There is no `Content-Type` condition. A caller can specify `fileType: 'image/png'` in the request, but the presigned POST policy itself does not bind the `Content-Type` field — meaning the browser can upload any file type regardless of what `fileType` was declared. Malicious actors could upload executable files (`.exe`, `.php`, `.html`) even when the config intends images only.

The commented-out code shows this was considered:
```ts
// postPolicy.setContentType(fileType);
```
It was removed at some point. This should be re-added.

### S3 — S3 object path constructed from user input without sanitization [High Risk]

In `generatePresignedPostPolicy`:
```ts
path = [uploadType, id, name].filter(Boolean).join('/');
```

Both `uploadType` and `name` come from the client request body (via `args`). If a consumer passes a `UploadTypeConfigFn` that uses `args.name` in a path, a user could inject path traversal sequences (`../../`) into the S3 key. S3 does not interpret `..` as directories in the same way filesystems do, but it can lead to unexpected key structures and bypass upload-type isolation.

**Recommendation:** Strip `/` and `..` from user-supplied `name` and `uploadType` values.

### S4 — Error messages expose internal state [Medium Risk]

Several error throws expose exact IDs and internal state:
```ts
throw new Error(`${id} already exists`);
throw new Error(`Upload type "${uploadType}" not configured`);
throw new Error(`Asset not found`);
```

These flow through the HTTP handler to the client as JSON `{ error: "..." }`. The `id already exists` message confirms to an attacker that a specific asset ID exists in the system, enabling enumeration attacks.

**Recommendation:** Return generic 404/409 HTTP errors without leaking IDs.

### S5 — `@ts-ignore` suppresses EdgeRuntime type check [Medium Risk]

In `bucketExists()`:
```ts
// @ts-ignore
if (typeof EdgeRuntime === 'string') {
```

The `@ts-ignore` suppresses a legitimate type error. If `EdgeRuntime` is not what's expected at runtime, the condition silently fails in an unexpected environment, and the `globalThis.FileReader` polyfill may or may not be assigned. Incorrect edge runtime detection on a new platform (e.g., Workers, Deno) could cause silent failures or unexpected behaviour.

### S6 — Client sends action type explicitly in request body [Low Risk]

```ts
body: JSON.stringify({
  action: NextUploadAction.generatePresignedPostPolicy,
  input: options.args,
  ...options.requestInit?.body,
}),
```

The `action` field is user-controlled. The `next-tool` base class routes actions based on this field. If `next-tool` doesn't strictly validate that only enabled actions are dispatched, a client could invoke `deleteAsset` or `pruneAssets` even if not explicitly enabled. This needs verification in `next-tool`.

**Recommendation:** Validate that `action` is in the `config.actions` allowlist server-side before dispatching.

### S7 — No secrets in source [Pass]

No hard-coded credentials, API keys, or tokens found in `src/`. `.env` values are properly referenced via `process.env.*`. The CI workflow uses `${{ secrets.GITHUB_TOKEN }}` correctly. Test credentials (`root`/`password`) are only in `docker-compose.yml` and the CI workflow — not in library source.

### S8 — Presigned URL expiration correctly enforced [Pass]

Presigned URLs have configurable expiration (`presignedUrlExpirationSeconds`). The store caches them and re-generates on expiry. The `calculateExpires` / `isExpired` logic is correct.

### S9 — `pruneAssets` can leak storage data via deleted objects logic [Low Risk]

`pruneAssets` deletes S3 objects where `verified === false`. If this action is exposed via the HTTP handler, a caller could trigger mass deletion. The action is not in `defaultEnabledHandlerActions`, so this requires explicit opt-in — acceptable, but should be documented.

---

## Risk Summary

| Finding | OWASP Category | Severity | Effort |
|---------|---------------|----------|--------|
| No auth on handler | A01 Broken Access Control | Critical | Medium |
| No content-type enforcement | A03 Injection | High | Low |
| Path traversal from user input | A03 Injection | High | Low |
| Error message information disclosure | A05 Security Misconfiguration | Medium | Low |
| Action field not validated server-side | A01 Broken Access Control | Medium | Low |

---

## Recommendations (Priority Order)

1. Add `Content-Type` condition to presigned POST policy matching declared `fileType`
2. Sanitize `name` and `uploadType` path components — strip `..` and leading `/`
3. Return generic HTTP status codes (409, 404) without exposing internal IDs in error messages
4. Verify `next-tool` validates `action` against the enabled actions allowlist
5. Add auth callback hook to config (e.g., `onBeforeAction?: (action, args, request) => Promise<void>`) so consumers can inject auth without wrapping the entire handler
6. Add a prominent security warning in README showing minimal auth example
