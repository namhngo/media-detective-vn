import { BadgeKind } from "@prisma/client";

/**
 * Badge definitions live in code so thresholds and copy stay versioned and
 * reviewable. The database records only the award (which badge, when), which is
 * the one fact a recomputation could never reconstruct.
 */
export type BadgeMetric =
  | "totalChecks"
  | "totalReports"
  | "publicContributions"
  | "currentStreak"
  | "categoriesSeen";

export type BadgeDefinition = {
  kind: BadgeKind;
  label: string;
  description: string;
  metric: BadgeMetric;
  target: number;
};

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    kind: BadgeKind.first_check,
    label: "First check",
    description: "Ran your first content check.",
    metric: "totalChecks",
    target: 1,
  },
  {
    kind: BadgeKind.watchful_10,
    label: "Watchful",
    description: "Checked 10 pieces of content.",
    metric: "totalChecks",
    target: 10,
  },
  {
    kind: BadgeKind.watchful_50,
    label: "Vigilant",
    description: "Checked 50 pieces of content.",
    metric: "totalChecks",
    target: 50,
  },
  {
    kind: BadgeKind.first_report,
    label: "First report",
    description: "Reported a case from your own experience.",
    metric: "totalReports",
    target: 1,
  },
  {
    kind: BadgeKind.guardian_5,
    label: "Community guardian",
    description: "Added 5 cases to the public library.",
    metric: "publicContributions",
    target: 5,
  },
  {
    kind: BadgeKind.streak_7,
    label: "Streak keeper",
    description: "Stayed active 7 days in a row.",
    metric: "currentStreak",
    target: 7,
  },
  {
    kind: BadgeKind.pattern_spotter,
    label: "Pattern spotter",
    description: "Encountered 5 different scam categories.",
    metric: "categoriesSeen",
    target: 5,
  },
];

export const BADGE_BY_KIND = new Map(
  BADGE_DEFINITIONS.map((definition) => [definition.kind, definition]),
);

/** Which badges the given metrics qualify for, regardless of prior awards. */
export function qualifyingBadges(metrics: Record<BadgeMetric, number>) {
  return BADGE_DEFINITIONS.filter(
    (definition) => metrics[definition.metric] >= definition.target,
  ).map((definition) => definition.kind);
}
