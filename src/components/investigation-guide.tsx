"use client";

import {
  BookOpenCheck,
  Clock3,
  Eye,
  LockKeyhole,
  MessageSquareText,
  Share2,
  ShieldCheck,
} from "lucide-react";

type GuideMode = "detect" | "report";

const guide = {
  detect: {
    title: "A 30-second habit",
    lead: "The model can help, but these checks are yours.",
    items: [
      {
        icon: ShieldCheck,
        title: "Use an official channel",
        body: "Open the organisation's known website or app instead of following an unexpected link.",
      },
      {
        icon: Clock3,
        title: "Slow down urgency",
        body: "No legitimate emergency needs a transfer before verification.",
      },
      {
        icon: Share2,
        title: "Virality is not proof",
        body: "For a post about a private person, do not share before checking the source.",
      },
    ],
    footer: "We will look for claims, pressure tactics, and familiar patterns.",
  },
  report: {
    title: "Your story matters",
    lead: "You decide what becomes public.",
    items: [
      {
        icon: MessageSquareText,
        title: "Describe what happened",
        body: "Write what you saw or experienced in your own words. Specific details help others learn.",
      },
      {
        icon: LockKeyhole,
        title: "Your raw content stays private",
        body: "The public case file only contains a structured summary, never your original message or screenshot.",
      },
      {
        icon: Eye,
        title: "Review before publishing",
        body: "Your report is your attestation. The AI signal remains visible separately for transparency.",
      },
    ],
    footer: "Your account and the AI analysis play different roles. Both stay visible.",
  },
} as const;

/** The companion rail that teaches a verification habit before an AI answer. */
export function InvestigationGuide({ mode }: { mode: GuideMode }) {
  const content = guide[mode];

  return (
    <aside className="torch-panel relative overflow-hidden rounded-3xl p-5 lg:sticky lg:top-24">
      {/* A faint coordinate field keeps the checklist part of the same workspace. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,color-mix(in_oklch,white_9%,transparent)_1px,transparent_1.5px)] bg-[size:20px_20px]"
      />
      <div className="relative">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <BookOpenCheck className="size-4 text-primary" />
          {content.title}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{content.lead}</p>

        <ol className="relative mt-5 space-y-4 before:absolute before:top-3 before:bottom-3 before:left-3.5 before:w-px before:bg-white/10">
          {content.items.map(({ icon: Icon, title, body }, index) => (
            <li key={title} className="flex gap-3">
              <span className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary ring-1 ring-primary/20">
                {index + 1}
              </span>
              <div>
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <Icon className="size-3.5 text-muted-foreground" />
                  {title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-5 border-t border-border/70 pt-4 text-xs leading-relaxed text-muted-foreground">
          {content.footer}
        </p>
      </div>
    </aside>
  );
}
