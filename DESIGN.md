---
name: Media Detective Vietnam
description: A warm, friendly literacy companion — not an audit console. Approachable for everyday users, including older adults, in both Vietnamese and English.
---

# Design language — v2 "Warm companion"

**Why this revision:** v1 ("case-file / calm civic-tech") leaned on the same
structural habit as an unrelated audit-tool project — heavy monospace for
every label, uppercase tracking-wide eyebrows everywhere, bordered
"evidence" framing. Different colors, same cold template. This product is a
*literacy companion*, not an investigator's console, and a meaningful share
of its real users are older adults who need warmth and plain language more
than they need a dossier aesthetic.

**Design read:** a friendly, trustworthy companion that explains what it
found in plain language — closer to a knowledgeable friend than a case
file. Calm, never alarmist; warm, never twee.

## What changed from v1

- Monospace (IBM Plex Mono) is now used sparingly — only for numerals
  (stat cards, small reference tags) — not for section headings, eyebrows,
  or nav labels. Those are all Be Vietnam Pro now.
- Every section gets a small **icon + label** instead of an uppercase mono
  eyebrow. The icon carries the "structure" cue instead of tracked capitals.
- Cards are rounder (radius bumped) and rely more on soft shadow than hard
  borders — lifted and friendly, not boxed and official.
- The verdict is a foregrounded, icon-led, tier-tinted callout — not a small
  stamp buried under a mono meta row.
- The redaction motif becomes rounded pill blocks, not literal
  block-character "censored document" bars.

## Color

Unchanged hues, warmer application. Tier colors are still the only
saturated hues used as solid fills — but they now also appear as **soft
10% tints** behind the verdict callout, so the emotional read is instant.

| Token | Value | Use |
|---|---|---|
| `bg` | `#FAFAF8` | page background |
| `surface` | `#FFFFFF` | cards |
| `border` | `#EDEBE6` | soft hairlines (lighter than v1) |
| `text` | `#1C1917` | stone-900 |
| `text-secondary` | `#57534E` | stone-600 |
| `text-muted` | `#A8A29E` | stone-400 |
| `accent` | `#1D4ED8` | blue-700 — primary actions |
| `tier-watch` | `#64748B` | slate-500 — "Watch" |
| `tier-caution` | `#B45309` | amber-700 (white-text contrast) — "Caution" |
| `tier-warning` | `#DC2626` | red-600 — "Warning" |
| `confirmed-user` | `#0F766E` | teal-700 |

Banned, still: purple/blue gradients, glassmorphism, dark "hacker console"
theme, neon, and — new — literal redaction-bar typography as decoration.

## Typography

- **Everything**: Be Vietnam Pro (400/500/600/700) — display, body, labels,
  nav. One typeface, used with a clear scale, carries the whole product.
- **Numerals only**: IBM Plex Mono — stat cards and small reference tags.
  Never for section headings or eyebrows.

Base 16px minimum. Section labels are `text-sm font-medium` with an icon,
sentence case — not uppercase mono.

## Signature element

The **verdict callout**: a rounded, tier-tinted card with a colored icon
circle (Eye / TriangleAlert / OctagonAlert), the tier name as real heading
type (not just a small stamp), one human sentence, then the explanation as
a friendly paragraph. This is the one place the product is allowed to feel
emotionally direct — everywhere else stays quiet.

## Icons (lucide-react)

Brand mark `ScanSearch` · Watch `Eye` · Caution `TriangleAlert` · Warning
`OctagonAlert` · Claims `Quote` · Techniques `Puzzle` · Similar cases
`Users` · Privacy `Lock` · Share `Megaphone` · Attestation `MessageSquareText`
· Footer `HeartHandshake` · Stats: `Activity` / `CheckCircle2` / `TrendingUp`

## Layout & components

- Radius bumped: `--radius: 0.85rem` — friendlier corners flow through
  cards, buttons, inputs automatically via the existing token chain.
- Cards: white, soft border, `shadow-sm` (not just a hairline) — lifted.
- Primary buttons: same rounded-lg as before but slightly larger padding;
  reserve pill shape (`rounded-full`) for the single most important CTA per
  page (hero actions), not every button — a friendly accent, not a pattern.
- Tier badges: pill-shaped, icon + label, larger than v1's small stamp.
- Redaction motif: a short row of rounded pill blocks (muted, varied
  width) — a visual footnote, not a censored-document effect.

## Motion & copy

Near-none by default, but no longer zero — see the v3 addendum below for
where motion earned its place. Copy is unchanged: plain and calm, still
never "100% accurate," still never "safe," across both playbooks.

---

## v3 addendum — structural pass, not a reskin

v2 changed tokens (fonts, colors, radii, icons) but kept v1's exact layout
skeleton underneath — every page was still a uniform stack of full-width
sections. That's a reskin, not a redesign. v3 researched current (2026)
practice and made three *structural* decisions, each backed by a specific
finding rather than taste alone:

1. **Bento grid — dashboard only.** Current research on bento layouts is
   explicit that the pattern helps data-dense, non-sequential content
   ("features at a glance") and *hurts* simple 2-3 item propositions and
   sequential flows. So: the dashboard is now a real bento — the trend
   chart is a hero cell (`lg:col-span-3`) beside a stacked stat column —
   but the home page's two action cards and the linear Detect/Report flow
   deliberately stay as plain, non-grid layouts. Using bento everywhere
   would have been the same mistake as v1's mono-everywhere habit: a
   pattern applied because it's current, not because the content calls
   for it.
2. **Micro-interactions that direct attention, not decorate.** Real
   numbers (checks run, confirmed cases) count up once on arrival — a
   signal that the data is live, not a static mock. The verdict callout
   animates in as a unit when analysis completes (marks "the investigation
   is done"); the Share prompt arrives ~150ms after it (verdict is read
   before the ask). No hover gimmicks, no scrolljacking, no cursor
   libraries — 2026 sources are consistent that those read as dated now.
3. **Performance/restraint as the premium signal, not animation richness.**
   Deliberately did *not* add a custom hero illustration or scene — current
   guidance is that "a static hero with one subtle motion cue" now reads as
   higher-end than an animated illustration, which reads as a template.
   The hero gets exactly one entrance cue (`fadeUp`, ~350ms); nothing else
   on the page moves on load.

Implementation: `motion` (motion.dev). `MotionConfig reducedMotion="user"`
wraps the whole app once in the root layout — reduced-motion is handled
globally, not per-component. `src/lib/motion.ts` holds the one shared
entrance variant so choreography stays consistent instead of ad hoc.

One real bug this pass caught, worth remembering: shadcn's `ChartContainer`
bakes in `aspect-video`. Inside a CSS grid item, that can force a chart to
compute its width from its height instead of filling the container —
override with `aspect-auto` on any chart placed in a grid/flex context, and
add `min-w-0` to the grid item itself as a second line of defense.

---

## v4 addendum — guided investigation, not a prettier dashboard

v3 gave the dashboard a real information architecture, but the highest-value
surfaces still began as a headline above a form. That meant the product was
visually cleaner but still did not *teach before it evaluated*. This pass
changes the entry architecture:

1. **Home is now an asymmetric product moment.** The hero's right side is a
   static, self-contained preview: urgent message → signals (`Urgency`,
   `Secrecy`) → calm next step. It is not a decorative illustration; it
   explains the product without requiring anyone to read the feature copy.
   The deep navy is used once, as a focused canvas for this preview — not as
   a system-wide "cyber" theme.
2. **Detect and Report are workspaces.** Desktop layout is now input on the
   left and a sticky companion rail on the right. The Detect rail teaches a
   30-second verification habit (known channel, slow urgency, virality is
   not proof) before an answer appears. The Report rail explains the user's
   attestation, privacy boundary, and review step. On mobile, the rail becomes
   the next readable section instead of being compressed beside the form.
3. **Results stay narrow and sequential.** After analysis, the result is
   constrained to `max-w-3xl` below the workspace. This protects readable
   line length and preserves the natural order: read verdict → evidence →
   similar cases → decide to share. A wide, bento-style result would make a
   serious explanation harder to follow.

The home hero still gets only one entrance animation. The new preview is
static by design: the page should make its point before JavaScript has to do
anything.
