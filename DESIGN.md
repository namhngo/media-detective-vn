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
| `tier-watch` | `#64748B` | slate-500 — "Theo dõi" |
| `tier-caution` | `#B45309` | amber-700 (white-text contrast) — "Cẩn thận" |
| `tier-warning` | `#DC2626` | red-600 — "Cảnh báo" |
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

Unchanged — near-none, plain and calm. Still never "100% accurate," still
never "safe," across both playbooks.
