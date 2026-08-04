# Database migrations

Do not generate the first migration until Neon is configured locally.

When `DIRECT_URL` is available, create the baseline migration with:

```bash
npm run db:migrate -- --name init_reports
```

Before applying it, edit the generated SQL so `vector` is enabled before the
`reports.embedding vector(1536)` column is created:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

The pgvector similarity query and any HNSW index will live in a later,
reviewed migration. Exact search is sufficient for the 9 initial seed cases.
