# Database migrations

`20260804183146_init_reports` is the reviewed baseline schema. It enables
pgvector before creating `reports.embedding vector(1536)`, so do not recreate
or edit it through Prisma after it has been applied to any branch.

Apply the committed migration to the Neon branch currently selected by
`DIRECT_URL`:

```bash
npm run db:deploy
```

Use `npm run db:migrate -- --name <change>` only for later schema changes.

Exact vector search is sufficient for the 9 initial seed cases. The HNSW
similarity index belongs in a later reviewed migration after there is enough
confirmed data to justify it.
