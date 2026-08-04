<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Media Detective Vietnam — project conventions

UNESCO Youth Hackathon 2026 (AI and MIL track). Full context: `README.md`. Design tokens: `DESIGN.md`.

## Commands

- `npm run dev` / `npm run build` / `npm run lint`
- Node **>= 24** required (`.nvmrc`) — `nvm use` before working. eve needs it; Next.js itself runs on 20.9+.
- No test suite yet — verify changes with `npm run build` (must stay clean).

## Architecture invariants (do not violate)

- **3-step pipeline only**: extract+analyze (one structured-output call) → find similar cases (embedding search) → assemble. No more steps for the MVP.
- **One eve agent, no orchestration**: no LangChain/CrewAI/AutoGen/LangGraph, no subagents. The agent's only job is detect-scam analysis; publishing, auth, rate limiting, and the dashboard live in Next.js API routes.
- **Privacy rule**: raw user content (screenshots, pasted text) is NEVER persisted — only the structured analysis is stored. Similar-case embeddings are computed from structured summaries only.
- **Tier rule**: the model outputs the tier directly; the UI displays it and the Share gate reads the same value. `risk_score` is for sorting/aggregates. Never claim "100% accurate" in any copy.
- **Vector search rule**: retrieval for context only — it never influences the tier. Enforce a similarity floor; returning zero similar cases is correct when nothing clears it.
- **Contract rule**: `src/lib/schema.ts` is the single source of truth shared by UI, API routes, and the agent (`outputSchema`). Change it in one place.

## Repo map

- `agent/` — eve agent (instructions.md, skills/, tools/). Skeleton until the backend phase.
- `src/lib/schema.ts`, `src/lib/mock.ts` — shared Zod contract + seed-shaped mocks. Frontend runs on mocks; API stubs must stay contract-valid.
- `.claude/skills/` — dev-side design skills. Read the relevant `SKILL.md` before major UI work.

## Commit style

Conventional-ish, concise: `feat:`, `chore:`, `docs:`, `fix:`. One logical unit per commit.
