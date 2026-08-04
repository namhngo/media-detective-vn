---
name: Media Detective Vietnam
description: A media-literacy "case-file" tool — calm civic-tech, not cyber-security theater. Light-first, high-trust, legible to older adults and hackathon judges alike.
---

# Design language

**Design read:** public-interest web app for Vietnamese users (incl. older adults) and English-speaking judges, with a calm civic-tech language — GOV.UK legibility crossed with modern fintech polish — plus one distinctive motif: **the case file**.

## The case-file motif (the one real aesthetic risk)

Analysis results and gallery entries render like a detective's evidence card:

- Mono-spaced metadata header: `CASE #0042 · SEED · ZALO · 2026-01-18`
- Structured fields with small mono uppercase labels (`CLAIMS`, `TECHNIQUES`, `ASSESSMENT`)
- **Redaction bars** (`██████`) wherever raw content would appear — the privacy rule ("we never store raw content") rendered as a visual feature, not a footnote
- Tier presented like a stamped verdict: solid filled badge, uppercase, letterspaced

The motif stays disciplined: one card per result, no novelty overflowing into forms or dashboards. Everything else is quiet.

## Color

Light-first. Tier colors are the **only saturated hues** in the product — everything else is warm-neutral, so a red/amber badge carries real weight.

| Token | Value | Use |
|---|---|---|
| `bg` | `#FAFAF8` | page background (warm paper) |
| `surface` | `#FFFFFF` | cards |
| `border` | `#E7E5E0` | card/hairline borders |
| `text` | `#1C1917` | stone-900 |
| `text-secondary` | `#57534E` | stone-600 |
| `text-muted` | `#A8A29E` | stone-400 |
| `accent` | `#1D4ED8` | blue-700 — primary actions only (civic blue, no gradients) |
| `accent-hover` | `#1E40AF` | blue-800 |
| `tier-watch` | `#64748B` | slate-500 — "Theo dõi" |
| `tier-caution` | `#B45309` | amber-700 (white-text contrast) — "Cẩn thận" |
| `tier-warning` | `#DC2626` | red-600 — "Cảnh báo" |
| `confirmed-user` | `#0F766E` | teal-700 — user-reported confirmation marks |

Chart palette = tier palette. Never introduce a fourth saturated color.

**Banned:** purple/blue gradients, glassmorphism, dark "hacker console" theme, neon. This is a literacy tool, not a SOC dashboard.

## Typography

- **UI / body:** Be Vietnam Pro (weights 400/500/600/700) — chosen for flawless Vietnamese diacritics when the vi toggle lands; clean grotesque in English
- **Evidence / metadata:** IBM Plex Mono (400/500) — case-file labels, reference numbers, redaction bars, stat card numerals

Scale: base 16px minimum (older-adult legibility). Display (page titles) 28–32px/600. Mono labels 11–12px, uppercase, tracking-wide. Never set body text below 14px.

## Layout & components

- Max content width 1120px; generous whitespace; single-column flows for Detect/Report (max 640px centered) — one thing per screen
- Cards: white, 1px `border`, radius 10px, **no shadows** except the result card (single soft shadow for emphasis)
- Buttons: solid `accent` fill for primary; outline for secondary; minimum 44px touch targets
- TierBadge: solid tier color, white uppercase text, letterspacing, radius 6px — reads like a stamp
- Technique chips: neutral outline chips — never color-coded (tier colors stay exclusive to tiers)
- Stat numerals: IBM Plex Mono, large; labels mono uppercase small

## Motion

Near-none. Result card fades/slides in once (200ms, ease-out). Loading = a quiet "Analyzing…" with an indeterminate bar or pulsing dot — **no** fake progress percentages, no typewriter theatrics. Honesty in motion matches honesty in copy.

## Copy tone

Plain, calm, declarative. Sentence case except mono labels. Never fear-mongering, never "100% accurate," never "safe" — the bottom tier says "nothing flagged yet," always with what-to-do-next guidance ("verify by calling your relative back on their usual number").
