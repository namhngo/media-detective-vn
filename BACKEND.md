# Backend Architecture

## Chosen stack

```text
Next.js + Eve + gpt-5
  -> Prisma 7 + @prisma/adapter-pg
  -> Neon PostgreSQL + pgvector
  -> Clerk for authenticated Report publishing
  -> Upstash Redis for rate limits
```

PostgreSQL and pgvector are one database. pgvector is a Neon Postgres
extension that adds `vector(1536)` storage and cosine-similarity operators;

## Responsibility split

| Layer | Owns |
|---|---|
| Eve agent | Reads raw input, loads skills, calls deterministic tools, returns structured output |
| Next.js | Share and Report publication gates, Clerk auth, public API responses |
| Prisma | Standard report CRUD and ordinary dashboard queries |
| pgvector raw SQL | Embedding writes and similarity retrieval |
| Neon | One managed Postgres database |
| Upstash | Public session and publish rate limits |

## Privacy boundary

Raw input may be processed in Eve's durable agent session. It is never written

## Local prerequisites

Copy `.env.example` to `.env.local` when credentials are ready. The UI can
continue to run on mock APIs before Neon and Clerk are configured.

## Prisma and pgvector

The Prisma schema models `embedding` as `Unsupported("vector(1536)")`.
Prisma handles normal CRUD. Vector reads/writes use parameterized
`$queryRaw` / `$executeRaw` because pgvector distance operators such as `<=>`
are database-specific.
