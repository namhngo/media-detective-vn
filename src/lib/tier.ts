import type { Tier } from "@/lib/schema";

export const tierMeta: Record<
  Tier,
  { label: string; vi: string; guidance: string }
> = {
  watch: {
    label: "Watch",
    vi: "Theo dõi",
    guidance: "Nothing flagged yet — keep the verification habit.",
  },
  caution: {
    label: "Caution",
    vi: "Cẩn thận",
    guidance: "Some manipulation signals — verify before acting.",
  },
  warning: {
    label: "Warning",
    vi: "Cảnh báo",
    guidance: "Strong scam signals — do not send money, sign, or share codes.",
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
};

export const categoryLabels: Record<string, string> = {
  deepfake_impersonation: "Deepfake impersonation",
  timeshare_contract: "Timeshare contract",
  fake_prize: "Fake prize",
  investment_scam: "Investment scam",
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
