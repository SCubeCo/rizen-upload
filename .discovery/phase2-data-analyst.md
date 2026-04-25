# Phase 2 — Data Analyst

**Agent:** Data Analyst  
**Concern:** Schema quality, migrations, indexes, queries  
**Date:** 2026-04-25

---

## Summary

The data layer is simple and appropriate for the library's purpose. The Drizzle schema for asset storage is minimal. There are notable concerns: asset payload is stored as `jsonb` (opaque, not typed), a `presignedUrl` is persisted to the database (a security anti-pattern), no indexes beyond the primary key, and the Keyv store serialises the entire `Asset` as a single key-value blob (no querying capability). The migration history is clean with 3 incremental steps.

**Data Score: 60/100**

---

## Findings

### DA1 — Asset data stored as `jsonb` blob [Medium Risk]

The Drizzle schema (`pg-core/schema.ts`):
```ts
export const nextUploadAssetsTable = pgTable(`next_upload_assets`, {
  id: varchar(`id`).primaryKey(),
  data: jsonb(`data`).notNull(),
  expires: bigint(`expires`, { mode: 'number' }),
  presignedUrl: varchar(`presignedUrl`),
  presignedUrlExpires: bigint(`presignedUrlExpires`, { mode: 'number' }),
});
```

The actual `Asset` payload (bucket, path, name, fileType, uploadType, metadata, verified, createdAt, updatedAt) is stored in the `data: jsonb` column — not as typed columns. This means:
- No ability to query by `uploadType`, `bucket`, `verified`, `fileType` without JSON operators
- No typed constraints on data integrity
- Schema migrations can't enforce Asset field presence
- The `all()` store method returns everything unmapped

The `expires` and `presignedUrl*` fields ARE top-level columns (correctly, since they're used for TTL filtering), which suggests a hybrid approach that evolved organically.

### DA2 — Presigned URL stored in database [High Risk]

```ts
presignedUrl: varchar(`presignedUrl`),
presignedUrlExpires: bigint(`presignedUrlExpires`, { mode: 'number' }),
```

Presigned S3 URLs contain embedded credentials (access key, signature, expiry) in the URL itself. Storing these in a database column means:
- Any database dump or backup exposes active S3 access tokens
- Database read access = ability to download private files (until expiry)
- Logs that capture SQL queries expose credentials

**Recommendation:** Never persist presigned URLs. Cache them in memory or re-generate on demand. If caching is needed, use a short-TTL in-memory store (Redis/Memcached), not Postgres.

### DA3 — No indexes beyond primary key [Medium Risk]

The table has only a primary key index on `id`. Common query patterns that will be slow at scale:
- `pruneAssets` → needs to find all unverified assets — queries `data->>'verified'` in the `jsonb` blob (no index)
- Assets by bucket or uploadType — no index
- Finding expired assets — `expires < now()` — no index on `expires`

**Recommendation:** Add a partial index on `expires` for TTL queries, and add `verified` as a top-level column with an index.

### DA4 — Migration history is clean [Pass]

3 migration files in `tests/db/migrations/`:
- `0000_careful_scorpion.sql` — initial table creation
- `0001_sticky_thunderbolt_ross.sql` — additive change
- `0002_brave_argent.sql` — additive change

The migration journal confirms sequential, non-destructive migrations. The migration tooling (`drizzle-kit generate:pg`) is correctly configured. No squashed or missing migrations.

### DA5 — Keyv store has no query capability [Medium Risk]

The `NextUploadKeyvStore` stores each asset as a key-value blob. The `all()` method iterates the Keyv iterator:
```ts
for await (const [, asset] of this.keyv.iterator()) {
  assets.push(asset);
}
```

`pruneAssets` calls `store.all()` and then filters in-memory. On large datasets this would load all assets into memory. Keyv has no native filtering — this is an inherent limitation of the adapter choice but should be documented.

### DA6 — `createdAt`/`updatedAt` not in Drizzle table top-level [Low Risk]

The timestamps are inside the `data: jsonb` column, not as dedicated columns. This means:
- Cannot use Postgres default `NOW()` for `createdAt`
- Cannot sort by creation date
- Cannot use Postgres triggers for `updatedAt`

The top-level schema does define `createdAt`/`updatedAt` helpers but only uses them in the comment-visible column block — checking the actual schema shows they ARE defined as top-level columns in the helpers but then never referenced in `nextUploadAssetsTable`. Looking at the schema, `createdAt` and `updatedAt` are defined as `const` outside the table definition but NOT included in the table. This is dead code.

---

## Risk Summary

| Finding | Severity | Effort to Fix |
|---------|----------|---------------|
| Presigned URL in database | High | Medium |
| No index on `expires` | Medium | Low |
| Asset payload in `jsonb` | Medium | Medium |
| `createdAt`/`updatedAt` not in table | Low | Low |
| Keyv in-memory `all()` at scale | Low | Low (documented limitation) |

---

## Recommendations

1. Remove `presignedUrl`/`presignedUrlExpires` from the Drizzle table — use in-memory or Redis cache
2. Add a GIN index on the `data` jsonb column + top-level `expires` index
3. Consider flattening key Asset fields (`verified`, `uploadType`, `bucket`) to top-level columns to enable typed queries
4. Document the Keyv adapter's scale limitations
5. Add `createdAt`/`updatedAt` as proper top-level Drizzle columns with `defaultNow()`
