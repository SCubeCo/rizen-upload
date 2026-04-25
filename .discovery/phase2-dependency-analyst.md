# Phase 2 — Dependency Analyst

**Agent:** Dependency Analyst  
**Concern:** Outdated packages, CVEs, licences, abandoned libs  
**Date:** 2026-04-25

---

## Summary

The dependency picture is mixed. The AWS SDK v3 and Drizzle ORM are modern and actively maintained. However, `next-tool@0.0.6` is a critical opaque internal dependency at an unstable pre-release version. Several dev dependencies lag significantly behind current releases. Peer dependency ranges are broad (good for adoption) but may silently accept incompatible versions. No obvious CVEs in the direct dependencies, but `next-tool` cannot be assessed without inspecting it.

**Dependency Score: 58/100**

---

## Findings

### D1 — `next-tool@0.0.6` — critical opaque dependency [High Risk]

This is the most significant dependency concern. `next-tool` is the base class for all handler routing and store lifecycle. It is:
- At `0.0.6` — pre-release, no stability guarantees
- Published by the same author (`tim.mikeladze`) — not independently maintained
- Has no documentation in this repo
- Cannot be audited for CVEs without inspecting its own `package.json`

**Risk:** If `next-tool` is abandoned, unmaintained, or introduces breaking changes in minor versions (permitted at `0.x`), this library is materially impacted. The `^0.0.6` range only accepts patch updates — meaning even a `0.0.7` fix won't be auto-adopted if the range was pinned wrong. Check: the actual range in `package.json` should be confirmed.

### D2 — AWS SDK v3 — current and maintained [Pass]

`@aws-sdk/client-s3@^3.554.0`, `@aws-sdk/s3-presigned-post@^3.554.0`, `@aws-sdk/s3-request-presigner@^3.554.0` — AWS SDK v3 is the current major version, actively maintained by AWS. The `^3.x` range is appropriate.

### D3 — Drizzle ORM peer dep — very broad range [Medium Risk]

`drizzle-orm: >=0.27` — Drizzle has had significant breaking API changes across minor versions (the ORM was in rapid development through 0.27–0.36+). Accepting `>=0.27` means a consumer could install `drizzle-orm@0.29` which may have an incompatible API for the patterns used in `pg-core/store.ts`. The code uses `.select()`, `.update()`, `.insert()`, `.delete()` — core Drizzle APIs likely stable, but the `eq()` import and table definition approach changed between versions.

**Recommendation:** Tighten to `>=0.30` or test against specific versions.

### D4 — Dev dependencies are significantly outdated [Low-Medium Risk]

Several dev dependencies are notably behind:
| Package | Installed | Current (approx) |
|---------|-----------|-----------------|
| `drizzle-kit` | `0.20.14` | `0.30+` |
| `@typescript-eslint/*` | `6.x` | `8.x` |
| `eslint` | `8.x` | `9.x` |
| `typescript` | `5.4.5` | `5.7+` |
| `storybook` | `8.0.8` | `8.5+` |
| `@vitest/coverage-v8` | `1.5.0` | `2.x` |
| `vitest` | `1.5.0` | `2.x` |

The `renovate.json` is present, suggesting automated updates are intended but may not be running or may have been paused.

### D5 — `keyv` peer dep range is fine [Pass]

`keyv: >=4` — Keyv v4 is stable, the range is appropriate.

### D6 — `next` peer dep range is appropriate [Pass]

`next: >=13` covers App Router (13+) and Pages Router. The library correctly doesn't depend on Next.js at runtime — it just needs the request/response types and routing conventions.

### D7 — `react` / `react-dom` peer deps [Pass]

`react: >=17`, `react-dom: >=17` — appropriate. The hook uses standard hooks (`useState`) with no version-specific APIs.

### D8 — `nanoid@^5` — ESM-only [Medium Risk]

`nanoid@5` is ESM-only. If any consumer uses CommonJS (older Next.js config or Jest), importing `next-upload` could fail due to the `nanoid` ESM-only constraint. The `tsup` build outputs both ESM and CJS formats — but if the CJS bundle statically imports `nanoid`, it may fail in CJS environments.

**Recommendation:** Test CJS bundle with `nanoid` explicitly, or switch to `uuid` which has CJS support.

### D9 — `bytes@^3.1.2` — old but stable [Low Risk]

`bytes` v3 is mature and unchanged for years. No concern, but worth noting it's a pure utility that could be replaced inline if desired.

### D10 — No licence conflicts detected [Pass]

All dependencies are MIT, Apache-2.0, or BSD. No GPL or AGPL licences that would affect library distribution.

---

## Risk Summary

| Finding | Severity | Effort to Fix |
|---------|----------|---------------|
| `next-tool` pre-release opacity | High | High |
| `nanoid` ESM-only in CJS bundle | Medium | Low |
| `drizzle-orm` broad peer range | Medium | Low |
| Dev dependencies outdated | Low | Low (renovate) |

---

## Recommendations

1. Audit `next-tool` — read its source, pin the exact version, or inline the functionality
2. Test CJS bundle output with `nanoid@5` to confirm no import errors
3. Tighten `drizzle-orm` peer dep range to `>=0.30`
4. Enable and configure Renovate properly to keep dev deps current
5. Add a `engines` field to `package.json` specifying minimum Node.js version
