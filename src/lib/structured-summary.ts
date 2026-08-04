import type { Category, Platform, Technique } from "@/lib/schema";

export type StructuredSummaryInput = {
  category: Category;
  platform: Platform;
  claims: string[];
  techniques: Technique[];
  explanationEn: string;
};

/**
 * The only content that reaches pgvector. Names, screenshots, phone numbers,
 * and other raw input are deliberately absent from this canonical summary.
 */
export function createStructuredSummary({
  category,
  platform,
  claims,
  techniques,
  explanationEn,
}: StructuredSummaryInput) {
  return [
    `Category: ${category}`,
    `Platform: ${platform}`,
    "Claims:",
    ...claims.map((claim) => `- ${claim}`),
    "Techniques:",
    ...(techniques.length > 0 ? techniques.map((technique) => `- ${technique}`) : ["- none"]),
    "Explanation:",
    explanationEn,
  ].join("\n");
}
