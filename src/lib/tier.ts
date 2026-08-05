import type { Tier } from "@/lib/schema";

export const tierMeta: Record<
  Tier,
  { label: string; guidance: string }
> = {
  watch: {
    label: "Watch",
    guidance: "Nothing flagged yet — keep the verification habit.",
  },
  caution: {
    label: "Caution",
    guidance: "Some manipulation signals — verify before acting or sharing.",
  },
  warning: {
    label: "Warning",
    guidance:
      "Strong manipulation signals — do not send money, sign, or share this.",
  },
};

/** Human-readable labels for the manipulation-technique taxonomy. */
export const techniqueLabels: Record<string, string> = {
  urgency: "Urgency",
  fear: "Fear",
  authority: "Authority",
  scarcity: "Scarcity",
  social_proof: "Social proof",
  secrecy: "Secrecy",
  emotional_bait: "Emotional bait",
  decontextualization: "Decontextualization",
  fabricated_evidence: "Fabricated evidence",
  bandwagon: "Bandwagon",
  character_attack: "Character attack",
};

export const categoryLabels: Record<string, string> = {
  deepfake_impersonation: "Deepfake impersonation",
  timeshare_contract: "Timeshare contract",
  fake_prize: "Fake prize",
  investment_scam: "Investment scam",
  misinformation: "Misinformation",
  other: "Other",
};

export const platformLabels: Record<string, string> = {
  zalo: "Zalo",
  facebook: "Facebook",
  phone_call: "Phone / video call",
  email: "Email",
  website: "Website",
  other: "Other",
};
