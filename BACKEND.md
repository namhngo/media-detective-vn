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
to the `reports` table, Neon vector index, dashboard, gallery, or public case
library. Only structured analysis is persisted in Neon.

## Why one `reports` table is enough

This product deliberately does not mirror Discovery Pipeline's
`User -> Analysis -> Insight` model. Discovery stores per-user transcripts and
long-lived insight records; Media Detective must not store raw user content.
Clerk owns user identity, Eve owns durable agent session state, and Upstash owns
rate-limit state. `reports` is the single business table for structured analysis
and publication state. Its internal `is_demo` marker supports Watch/Caution
calibration rows in development/demo dashboards without placing them in the
public gallery.

`report_events` is the one supporting table. It is an immutable lifecycle log
linked to a report (`analysis_created`, `shared`, `user_reported`, or `seeded`)
and contains only event type, timestamp, and an optional Clerk actor ID. It
never contains raw content or a duplicate report payload.

## Local prerequisites

Copy `.env.example` to `.env.local` when credentials are ready. The UI can
continue to run on mock APIs before Neon and Clerk are configured.

## Neon branch workflow

There are two connection URLs for the same Neon database branch:

| URL | Purpose |
|---|---|
| `DATABASE_URL` (pooled, `-pooler`) | Next.js, Eve tools, and normal Prisma runtime queries |
| `DIRECT_URL` (non-pooler) | Prisma migrations and TablePlus |

Local development should point both URLs at a Neon branch such as
`backend-dev`. Vercel Production should point at a separate Neon production
branch. `npm run db:deploy` applies committed migrations to whichever branch
`DIRECT_URL` targets.

## Prisma and pgvector

The Prisma schema models `embedding` as `Unsupported("vector(1536)")`.
Prisma handles normal CRUD. Vector reads/writes use parameterized
`$queryRaw` / `$executeRaw` because pgvector distance operators such as `<=>`
are database-specific.
