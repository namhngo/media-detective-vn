import { defineTool } from "eve/tools";
import { z } from "zod";

import {
  categorySchema,
  platformSchema,
  techniqueSchema,
  tierSchema,
} from "../../src/lib/schema";

export default defineTool({
  description:
    "Persist the structured assessment as a reports row (is_shared = false). Raw user content (original text or screenshot) is never stored — pass only the structured fields from the analysis.",
  inputSchema: z.object({
    source: z.enum(["screenshot", "text", "described_call"]),
    platform: platformSchema,
    category: categorySchema,
    claims: z.array(z.string()),
    techniques: z.array(techniqueSchema),
    tier: tierSchema,
    riskScore: z.number().int().min(0).max(100),
    explanationEn: z.string(),
    moneyRequested: z.boolean(),
    amountVnd: z.number().int().nullable(),
  }),
  async execute() {
    // TODO(backend phase): insert into Supabase `reports` and return the row id.
    // Every Detect call writes a row — that's what makes the dashboard real.
    return { reportId: "stub-report-id" };
  },
});
