# Media Detective Vietnam — Project Plan

## Current state (August 2026)

Media Detective Vietnam is an **AI-powered Media and Information Literacy tool** built for the UNESCO Youth Hackathon 2026 (track: AI and MIL). It helps everyday users in Vietnam identify scams, verify suspicious claims, and resist misinformation — without requiring any technical skill.

### Core product surface

Three actions, not a feed:

| Action | User story |
|---|---|
| **Detect** | Paste a message, link, or screenshot. The AI checks it, explains what is suspicious, and shows how to verify. |
| **Share** | One-click sharing only when the AI reaches the highest confidence tier AND the user opts in. |
| **Report** | For people who already experienced a scam. Same engine, but the user attests — the AI provides a transparency badge. |

Plus a public dashboard showing aggregated data from confirmed cases.

### Architecture overview

```text
Three steps, one agent:
  1. Eve (gpt-5) extracts claims, techniques, and tier → structured output
  2. pgvector finds similar confirmed cases (context only, never a tier input)
  3. Next.js assembles the case file, persists structured fields, discards raw content
```

No LangChain, CrewAI, subagents, or orchestration frameworks. One contract file (`src/lib/schema.ts`) shared by Eve, the API routes, and the UI.

### What we have today

| Component | Status |
|---|---|
| Eve agent with 6 investigation skills, 2 external tools | Live in dev |
| Input boundary classification (assessable / not_media / insufficient) | Enforced in schema, API, UI, and evals |
| Google Fact Check (mandatory for assessable public claims) | Configured + Defender-guarded |
| Exa MCP semantic search (allowlisted, credit-disabled by default) | Connected + guarded |
| StackOne Defender (Tier 1 prompt-injection scan on external results + final output) | Enforced at persistence boundary |
| Person-targeting policy (public-role vs private-person with query redaction) | Enforced in instructions, tools, and evals |
| Zero-externalization for private identifiers (URLs, emails, handles, phone-like values) | Redacted in-fact-check queries |
| Langfuse OpenTelemetry tracing (always-on, spans stripped of prompt/output payload) | Live |
| Similar-case vector retrieval (pgvector, 0.78 floor, max 3, context-only) | Live |
| Evidence-source card (tool-returned HTTPS URLs displayed alongside verdict) | Live |
| URL security lookup (VirusTotal, Defender-guarded) | Live |
| Clerk-protected routes + signed ticket sharing | Live |
| Upstash rate limits | Configured |
| 11 deterministic eval gates | 33/33 passing |
| Playwright MCP config (browser smoke testing) | Ready at restart |

### Key design decisions

**Similar cases never set the tier.** Vector retrieval runs after Eve. A `warning` case with 90% similarity to a new submission does not make the new submission `warning`. The two signals are displayed separately. This prevents a recursive feedback loop where one AI judgment inflates future judgments.

**Person-targeting posts are investigated, not ignored.** We replaced the earlier blanket "never search a claim that names a person" rule with a proportional approach:

- Public figures in public roles: search with the minimum public identity needed.
- Private people: search a minimally identifying, redacted allegation. Never export contact details, home locations, schools, workplaces, medical information, or intimate imagery.
- Exa is only used after responsible public reporting already exists; it never creates a new searchable identity trail.

## What we can build next

### Phase 1 — detection quality

1. **Exact artifact matching** — phone numbers, bank accounts, known scam URLs, image perceptual hashes. Currently similar cases use only semantic embedding similarity. Exact matching would give definitive signals for known-bad artifacts without depending on the model.

2. **Browser automation (Playwright MCP)** — the `opencode.json` config is already in the repo. After restarting opencode, we can write automated end-to-end smoke tests that sign in via Clerk, submit posts to Detect and Report, and verify every UI state.

3. **Tier calibration suite** — semantic similarity-based eval that measures whether the model reasons consistently across equivalent paraphrases of the same scam playbook. Not for gatekeeping, but for monitoring drift.

4. **Background re-evaluation** — when new confirmed patterns enter the library, re-compute similarity for previously stored reports to surface missed matches.

### Phase 2 — user trust signals

5. **Pending-review state for low-confidence reports** — a `watch` user-submitted Report should go into moderation queue, not straight to publish. Today, any authenticated user can publish any Report regardless of Eve's tier. A review gate would match the product's honesty principle.

6. **Account-bound trust score** — users who submit verified, high-quality reports earn reputation. Newcomers' low-confidence Reports need review; trusted submitters' Reports can publish faster.

7. **Corroboration signals** — when multiple users independently report the same pattern (phone, URL, structure), surface that as a confidence signal separate from the AI tier.

### Phase 3 — distribution

8. **Vietnamese-first UI** — the product was designed Vietnamese-first but demoed in English for judges. Internationalize all interface strings.

9. **Eve channels for Zalo, Facebook Messenger, WhatsApp** — the same agent surfaced where scams actually happen. No separate app to install; no new platform to learn. Zalo is where most Vietnamese scam traffic flows.

10. **WhatsApp / SMS input** — allow users to forward a suspicious message to a number and receive a Detect result back.

11. **Browser extension** — one-click check of any post, ad, or message visible in the browser.

### Phase 4 — platform

12. **MCP server distribution** — package the detection engine as an MCP server so other AI tools, coding assistants, and productivity products can call it directly. This is a natural fit because:

    - The input is a simple text or image blob.
    - The output is a structured, machine-readable assessment.
    - The privacy boundary is already hardened (raw content is never stored).
    - The single-call architecture works well over MCP's request-response model.
    - Langfuse tracing is already set up, so MCP-call telemetry is covered.

    An MCP server at `@media-detective-vn/mcp` could expose:

    ```text
    media_detective_detect(text: string, source: "text" | "screenshot") → AnalysisResult
    media_detective_list_techniques() → Technique[]
    media_detective_categories() → Category[]
    ```

    This would let any MCP-capable client (Claude Desktop, Cursor, VS Code, opencode) run detection inline without the user leaving their tool. The web UI remains the primary human interface; the MCP server is the integration surface for machines and developer tools.

13. **API key for external callers** — alongside or instead of MCP, a simple REST endpoint with API-key auth for NGOs, government dashboards, and newsroom tools to integrate.

14. **Government / NGO dashboard** — aggregated data exports and trends for public-interest organizations tracking scam epidemiology.

## Architecture notes for the MCP server path

Building `@media-detective-vn/mcp` requires minimal new code because:

- The analysis pipeline is already a single function: `analyzeWithEve({ request, source, text }) → AnalysisResult`.
- Privacy is already enforced: raw input is transient, only structured output leaves the boundary.
- The structured output schema is already the product contract.
- Langfuse tracing is already set up and would automatically cover MCP call traces.
- Defender injection scanning is already enforced at the external-result and final-output boundaries.

What would need to be built:

1. An MCP server wrapper (using `@modelcontextprotocol/sdk`) that wraps `analyzeWithEve`.
2. API key generation and validation for non-Clerk callers.
3. Per-API-key rate limiting (extending the existing Upstash setup).
4. Optional: a tool that returns the technique taxonomy and category list for MCP client discovery.

The web UI remains for human users. The MCP server is for tooling, developer workflows, and platform integrations.

## Infrastructure

| Service | Purpose |
|---|---|
| Vercel | Next.js hosting, Eve agent runtime |
| Neon PostgreSQL + pgvector | Reports, vector similarity |
| Clerk | User authentication |
| Upstash Redis | Rate limiting |
| Langfuse | Agent telemetry (always-on, zero content export) |
| Google Fact ClaimSearch | Fact-check lookups |
| VirusTotal | URL security signals |
| Exa (disabled by default) | Optional semantic public-source search |
| Playwright MCP (configured) | Browser smoke testing |

## Success metrics

- Detection accuracy not measured as "true/false" but as tier calibration accuracy and user verification behavior.
- Users complete a verification action after receiving a result (not just read and leave).
- Reports submitted by users match confirmed scam patterns in the library.
- Zero raw-content leaks (auditable via Langfuse traces where input/output are permanently null).
