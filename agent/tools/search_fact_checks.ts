import { defineTool } from "eve/tools";
import { z } from "zod";

import { defendExternalResult } from "../../src/lib/prompt-defense";

const FACT_CHECK_ENDPOINT =
  "https://factchecktools.googleapis.com/v1alpha1/claims:search";

type FactCheckApiResponse = {
  claims?: Array<{
    text?: string;
    claimReview?: Array<{
      publisher?: { name?: string };
      title?: string;
      url?: string;
      textualRating?: string;
      reviewDate?: string;
    }>;
  }>;
};

function redactSensitiveQueryText(value: string) {
  return value
    .replace(/https?:\/\/\S+/gi, "[link]")
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, "[email]")
    .replace(/@[A-Za-z0-9_.-]+/g, "[handle]")
    .replace(/(?:\+?\d[\d .()-]{7,}\d)/g, "[number]")
    .replace(/\b\d{8,}\b/g, "[number]");
}

export default defineTool({
  description:
    "Mandatory once before finalizing any assessable public factual claim, including person-targeting claims. Search a concise claim even when details are missing. Public figures may be named only when their public role is material; private-person queries must omit nonessential identifiers and all contact, school, workplace, precise-location, medical, or intimate information. Never send raw user content. Results are evidence context, not a verdict engine.",
  inputSchema: z.object({
    claims: z.array(z.string().max(500)).min(1).max(3),
  }),
  async execute({ claims }) {
    const apiKey = process.env.GOOGLE_FACT_CHECK_API_KEY;
    if (!apiKey) return { status: "not_configured" as const, results: [] };

    const query = claims
      .filter(Boolean)
      .map(redactSensitiveQueryText)
      .join(" ")
      .slice(0, 500);
    if (!query.trim()) return { status: "blocked" as const, results: [] };
    try {
      const params = new URLSearchParams({ query, key: apiKey, pageSize: "3" });
      const response = await fetch(`${FACT_CHECK_ENDPOINT}?${params}`, {
        signal: AbortSignal.timeout(5_000),
      });
      if (!response.ok) return { status: "unavailable" as const, results: [] };

      const body = (await response.json()) as FactCheckApiResponse;
      const results = (body.claims ?? [])
        .flatMap((claim) =>
          (claim.claimReview ?? []).map((review) => ({
            claim: claim.text ?? "Published fact check",
            publisher: review.publisher?.name ?? "Unknown publisher",
            title: review.title ?? "Published fact check",
            url: review.url ?? "",
            verdict: review.textualRating ?? null,
            reviewDate: review.reviewDate ?? null,
          })),
        )
        .filter((review) => review.url.startsWith("https://"))
        .slice(0, 3);

      const safeResults = await defendExternalResult(results, "search_fact_checks");
      if (!safeResults) {
        return { status: "blocked" as const, results: [] };
      }

      return { status: "available" as const, results: safeResults };
    } catch {
      return { status: "unavailable" as const, results: [] };
    }
  },
});
