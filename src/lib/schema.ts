import { z } from "zod";

/**
 * The single source of truth shared by the UI, the API routes, and the eve
 * agent (via `outputSchema`). Change it here, in one place — nowhere else.
 *
 * Naming: JSON/TS is camelCase; the Postgres table (backend phase) maps these
 * to the snake_case columns from the project brief.
 */

export const sourceSchema = z.enum(["screenshot", "text", "described_call"]);

export const platformSchema = z.enum([
  "zalo",
  "facebook",
  "phone_call",
  "email",
  "website",
  "other",
]);

export const categorySchema = z.enum([
  "deepfake_impersonation",
  "timeshare_contract",
  "fake_prize",
  "investment_scam",
  "misinformation",
  "other",
]);

export const techniqueSchema = z.enum([
  // Scam playbook
  "urgency",
  "fear",
  "authority",
  "scarcity",
  "social_proof",
  "secrecy",
  // Misinformation playbook
  "emotional_bait",
  "decontextualization",
  "fabricated_evidence",
  "bandwagon",
  "character_attack",
]);

export const tierSchema = z.enum(["watch", "caution", "warning"]);

export const confirmationSourceSchema = z.enum(["ai_detected", "user_reported"]);

/**
 * What the model produces in the single extract+analyze call.
 * This is the agent's `outputSchema` — schema-guaranteed, never a bare number.
 */
export const analysisResultSchema = z.object({
  claims: z.array(z.string()).describe("The specific claims the content makes"),
  techniques: z
    .array(techniqueSchema)
    .describe("Manipulation techniques detected, from the taxonomy"),
  category: categorySchema,
  platform: platformSchema.describe("Best-effort platform inference"),
  tier: tierSchema.describe(
    "The confidence tier the model can justify — displayed to the user and read by the Share gate",
  ),
  riskScore: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe("Internal score for sorting/aggregates; never shown as the verdict"),
  explanationEn: z
    .string()
    .describe("Plain-language explanation of the reasoning, calm and jargon-free"),
  moneyRequested: z.boolean(),
  amountVnd: z.number().int().nullable(),
});

/** A confirmed case surfaced as context for a Detect result. */
export const similarCaseSchema = z.object({
  id: z.string(),
  category: categorySchema,
  techniques: z.array(techniqueSchema),
  tier: tierSchema,
  explanationEn: z.string(),
  similarity: z.number().min(0).max(1),
  confirmationSource: confirmationSourceSchema.nullable(),
  sourceCitation: z.string().nullable(),
});

/* ------------------------------- API shapes ------------------------------ */

export const detectRequestSchema = z
  .object({
    source: sourceSchema,
    /** Raw text or call description. Transient — never persisted. */
    text: z.string().min(1).optional(),
    /** Base64 data URL for screenshots. Transient — never persisted. */
    imageBase64: z.string().optional(),
  })
  .refine((v) => v.text || v.imageBase64, {
    message: "Either text or imageBase64 is required",
  });

export const detectResponseSchema = z.object({
  reportId: z.string(),
  analysis: analysisResultSchema,
  /** May legitimately be empty — the similarity floor forces honesty. */
  similarCases: z.array(similarCaseSchema),
  /** True when analysis.tier === "warning" — the UI must visibly prompt Share. */
  sharePrompted: z.boolean(),
});

export const shareRequestSchema = z.object({
  reportId: z.string(),
});

export const shareResponseSchema = z.object({
  ok: z.boolean(),
});

/** Report runs the same analysis, but publishes on user attestation. */
export const reportRequestSchema = detectRequestSchema.and(
  z.object({ location: z.string().nullable().optional() }),
);

export const reportResponseSchema = z.object({
  reportId: z.string(),
  analysis: analysisResultSchema,
  similarCases: z.array(similarCaseSchema),
  published: z.boolean(),
});

export const galleryEntrySchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  source: sourceSchema,
  platform: platformSchema,
  category: categorySchema,
  claims: z.array(z.string()),
  techniques: z.array(techniqueSchema),
  tier: tierSchema,
  explanationEn: z.string(),
  moneyRequested: z.boolean(),
  amountVnd: z.number().int().nullable(),
  location: z.string().nullable(),
  isSeed: z.boolean(),
  confirmationSource: confirmationSourceSchema.nullable(),
  sourceCitation: z.string().nullable(),
});

export const dashboardResponseSchema = z.object({
  stats: z.object({
    totalChecks: z.number().int(),
    confirmedCases: z.number().int(),
    topCategoryThisWeek: categorySchema.nullable(),
  }),
  /** Check volume over time, by tier. date is an ISO yyyy-mm-dd string. */
  trend: z.array(
    z.object({
      date: z.string(),
      watch: z.number().int(),
      caution: z.number().int(),
      warning: z.number().int(),
    }),
  ),
  techniqueCounts: z.array(
    z.object({ technique: techniqueSchema, count: z.number().int() }),
  ),
  confirmationSplit: z.object({
    aiDetected: z.number().int(),
    userReported: z.number().int(),
  }),
  /** Only is_seed or is_shared rows are ever shown individually. */
  gallery: z.array(galleryEntrySchema),
});

/* --------------------------------- Types --------------------------------- */

export type Source = z.infer<typeof sourceSchema>;
export type Platform = z.infer<typeof platformSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Technique = z.infer<typeof techniqueSchema>;
export type Tier = z.infer<typeof tierSchema>;
export type ConfirmationSource = z.infer<typeof confirmationSourceSchema>;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;
export type SimilarCase = z.infer<typeof similarCaseSchema>;
export type DetectRequest = z.infer<typeof detectRequestSchema>;
export type DetectResponse = z.infer<typeof detectResponseSchema>;
export type ShareRequest = z.infer<typeof shareRequestSchema>;
export type ShareResponse = z.infer<typeof shareResponseSchema>;
export type ReportRequest = z.infer<typeof reportRequestSchema>;
export type ReportResponse = z.infer<typeof reportResponseSchema>;
export type GalleryEntry = z.infer<typeof galleryEntrySchema>;
export type DashboardResponse = z.infer<typeof dashboardResponseSchema>;
