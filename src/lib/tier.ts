import type { Tier } from "@/lib/schema";
import type { Language } from "@/lib/i18n";

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

const viTierLabels: Record<Tier, string> = {
  watch: "Theo dõi",
  caution: "Thận trọng",
  warning: "Cảnh báo",
};
const viTierGuidance: Record<Tier, string> = {
  watch: "Chưa có tín hiệu đáng ngờ — hãy tiếp tục thói quen xác minh.",
  caution: "Có một số tín hiệu thao túng — hãy xác minh trước khi hành động hoặc chia sẻ.",
  warning: "Có tín hiệu thao túng mạnh — không chuyển tiền, ký tên hoặc chia sẻ nội dung này.",
};

const viTechniqueLabels: Record<string, string> = {
  urgency: "Tạo sự khẩn cấp",
  fear: "Gây sợ hãi",
  authority: "Mượn uy quyền",
  scarcity: "Khan hiếm giả",
  social_proof: "Bằng chứng xã hội giả",
  secrecy: "Yêu cầu giữ bí mật",
  emotional_bait: "Mồi cảm xúc",
  decontextualization: "Tước ngữ cảnh",
  fabricated_evidence: "Bằng chứng ngụy tạo",
  bandwagon: "Tâm lý đám đông",
  character_attack: "Công kích nhân thân",
};

const viCategoryLabels: Record<string, string> = {
  deepfake_impersonation: "Mạo danh bằng deepfake",
  timeshare_contract: "Hợp đồng kỳ nghỉ",
  fake_prize: "Giải thưởng giả",
  investment_scam: "Lừa đảo đầu tư",
  misinformation: "Thông tin sai lệch",
  other: "Khác",
};

const viPlatformLabels: Record<string, string> = {
  ...platformLabels,
  phone_call: "Cuộc gọi / video call",
  email: "Email",
  website: "Trang web",
  other: "Khác",
};

export function tierLabel(tier: Tier, language: Language) {
  return language === "vi" ? viTierLabels[tier] : tierMeta[tier].label;
}

export function tierGuidance(tier: Tier, language: Language) {
  return language === "vi" ? viTierGuidance[tier] : tierMeta[tier].guidance;
}

export function techniqueLabel(technique: string, language: Language) {
  return language === "vi"
    ? viTechniqueLabels[technique] ?? technique
    : techniqueLabels[technique] ?? technique;
}

export function categoryLabel(category: string, language: Language) {
  return language === "vi"
    ? viCategoryLabels[category] ?? category
    : categoryLabels[category] ?? category;
}

export function platformLabel(platform: string, language: Language) {
  return language === "vi"
    ? viPlatformLabels[platform] ?? platform
    : platformLabels[platform] ?? platform;
}
