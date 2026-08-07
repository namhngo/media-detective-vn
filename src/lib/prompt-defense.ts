import { createPromptDefense } from "@stackone/defender";

import type { AnalysisResult } from "@/lib/schema";

const defense = createPromptDefense({
  blockHighRisk: true,
  // Tier 2's optional runtime dependencies currently carry unresolved advisories.
  enableTier2: false,
});

function reportBlock(toolName: string, detections: string[], fields: string[]) {
  console.warn("Prompt injection blocked", {
    toolName,
    detections,
    fields,
  });
}

export async function defendExternalResult<T>(
  value: T,
  toolName: string,
): Promise<T | null> {
  const result = await defense.defendToolResult(value, toolName);
  if (!result.allowed) {
    reportBlock(toolName, result.detections, result.fieldsSanitized);
    return null;
  }

  return result.sanitized as T;
}

export async function assertSafeAnalysis(analysis: AnalysisResult) {
  const result = await defense.defendToolResult(
    { content: JSON.stringify(analysis) },
    "eve_analysis",
  );
  if (!result.allowed) {
    reportBlock("eve_analysis", result.detections, result.fieldsSanitized);
    throw new Error("Eve assessment failed the prompt-injection safety check.");
  }
}
