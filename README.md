# Media Detective Vietnam

An AI-powered **Media & Information Literacy (MIL)** tool — built for the **UNESCO Youth Hackathon 2026** (track: *AI and MIL*, theme "Play Your Part: Youth Designing the Future of MIL").

Not a scam detector. Not a social feed. A **dashboard-first literacy tool**: the AI investigates suspicious content and *explains its reasoning* — it doesn't replace human judgment, it strengthens it. Users leave every interaction better at spotting the next one themselves.

**Deadline:** August 16, 2026 · **Deliverables:** proposal doc + 3-minute pitch video (English)

## The problem

Three connected patterns are hitting Vietnam right now — isolation + fabricated trust + manufactured urgency:

- **AI deepfake impersonation** *(hero case)* — scammers scrape photos/audio from social media, generate a face-and-voice clone, and run live video calls impersonating relatives to request urgent money. A convincing deepfake call reportedly takes under a minute to produce. Vietnam's National Cyber Security Association names deepfake sophistication the top emerging risk for 2026.
- **Timeshare fraud** *(supporting case)* — Hanoi's Economic Police opened 21 criminal cases, charged 187 people: 493 confirmed victims, ~181 billion VND stolen in that investigation alone. Playbook: prize call → hotel "seminar" → manufactured urgency → sign and pay same-day.
- **Viral misinformation targeting individuals** — fabricated "evidence" and emotional bait turn an unverified accusation into a pile-on before anyone checks the facts. In 2026, a false cheating accusation against a Vietnamese student went viral and the harm proved irreversible. The same trust-calibration skills — check the source, don't share before verifying, virality is not evidence — apply here as much as to financial scams.

Nationally, Vietnam's Ministry of Public Security logged **6,000+ billion VND (~USD 230M+)** in online fraud losses in the first 11 months of 2025. Targets are overwhelmingly older adults, isolated by the shift from multi-generational to nuclear households — and, for misinformation, anyone who can be turned into a viral villain overnight.

## The product — three actions, not a feed

| Action | What it does |
|---|---|
| **Detect** | Paste a message or upload a screenshot. The AI returns a confidence tier, the manipulation techniques found, and a plain-language explanation. Private by default. Users can also opt in to search published fact checks and check a public link without changing the tier. At the top tier, the app *actively prompts* the user to share. |
| **Share** | Publishes only when the AI's top tier **and** the user's explicit opt-in agree. Only the structured summary publishes — never raw screenshots or message text. |
| **Report** | For people who *already know* — a scam, or a viral lie that targeted them. Same analysis engine, but publishes on the user's attestation; the AI's independent tier is shown as a transparency badge. Requires sign-in (anonymous auth) so submissions are accountable, not anonymous on the backend. |

Detect, Share, Report, and the dashboard require Clerk sign-in. The public home page explains the product and provides the sign-in entry point.

### Confidence tiers

Borrowing vocabulary Vietnamese police warnings already use — even the bottom tier never implies "safe," only "nothing flagged yet."

| Tier | Meaning | Internal score |
|---|---|---|
| Watch | Nothing flagged yet | 0–39 |
| Caution | Verify before acting | 40–74 |
| Warning | Strong manipulation signals | 75–100 |

Never "100% accurate" — no classifier can honestly promise that. The `warning` gate (Share) and user attestation (Report) are what earn the trust.

## Architecture

Deliberately simple — three steps, no agent orchestration:

```
Input (screenshot or text)
  → 1. Extract + analyze   (ONE structured-output call: claims, techniques, tier, explanation)
  → 2. Find similar cases  (embedding search over confirmed cases — the "case-file library")
  → 3. Assemble report   (optional external evidence cards; never changes the tier)
```

Raw uploaded content is used transiently for step 1 and **never persisted** — only the structured output is stored. The vector DB retrieves context ("others reported this pattern"); it never votes on the tier.

The technique taxonomy spans two playbooks — scam (`urgency`, `fear`, `authority`, `scarcity`, `social_proof`, `secrecy`) and misinformation (`emotional_bait`, `decontextualization`, `fabricated_evidence`, `bandwagon`, `character_attack`) — because both are ultimately the same skill: calibrating trust before acting. When content targets an identifiable private person, the agent never repeats identifying details — it describes the pattern, not the person.

The AI backend is a single **[eve](https://vercel.com/eve) agent** (`agent/`): markdown instructions + skills, TypeScript tools. No LangChain/CrewAI/subagents.

## Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · recharts · Vercel AI SDK + **gpt-5** · **text-embedding-3-small** · [eve](https://eve.dev) agent framework · Supabase (Postgres + pgvector + Auth, backend phase) · Vercel

## Project structure

```
agent/               eve agent — the AI detective (instructions, skills, tools)
  instructions.md      persona + standing rules + core technique taxonomy
  skills/              category playbooks loaded on demand (deepfake, timeshare, ...)
  tools/               find_similar_cases.ts, save_report.ts
src/
  app/               home · detect · report · dashboard · api routes
  components/        shadcn/ui + feature components
  lib/
    schema.ts          shared Zod contract (UI, API routes, and agent all use it)
    mock.ts            seed-shaped mock data (frontend runs on mocks until backend lands)
.claude/skills/      dev-side design skills (frontend-design, design-taste-frontend)
DESIGN.md            design tokens + visual language
```

## Getting started

```bash
nvm use              # switch this shell to Node >= 24 (required by eve)
npm install
npm run dev          # http://localhost:3000
```

If `npm run dev` says Eve is running Node 22 or older, run `nvm use` in the
same terminal first. The project has a `.nvmrc` file with the required version.

No API keys are needed for the core mock-backed flow. `GOOGLE_FACT_CHECK_API_KEY` and `VIRUSTOTAL_API_KEY` are optional: the user must explicitly opt in before the app sends derived claims or a public link to those services. Neither integration affects the tier or persists raw content.

## Roadmap (explicitly out of MVP scope)

Vietnamese-first UI toggle (designed Vietnamese-first; demoed in English for judges) · voice/audio deepfake detection · browser extension · mobile app · eve **channels** for Zalo/WhatsApp (the same agent surfaced where scams actually happen) · artifact matching across reports (phone numbers, bank accounts — relational, not semantic) · government/NGO dashboard

---

*Judged on: consistency with theme · clarity · innovation & creativity · feasibility & sustainability · impact & inclusion.*
