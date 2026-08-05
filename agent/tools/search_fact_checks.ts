import { defineTool } from "eve/tools";
import { z } from "zod";

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

export default defineTool({
  description:
    "Search published fact checks for redacted, structured claims. Use after extracting claims, never with raw user content. Results are evidence context, not a verdict engine.",
  inputSchema: z.object({
    claims: z.array(z.string().max(500)).min(1).max(3),
  }),
  async execute({ claims }) {
    const apiKey = process.env.GOOGLE_FACT_CHECK_API_KEY;
    if (!apiKey) return { status: "not_configured" as const, results: [] };

    const query = claims.filter(Boolean).join(" ").slice(0, 500);
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
        .filter((review) => review.url.startsWith("http"))
        .slice(0, 3);

      return { status: "available" as const, results };
    } catch {
      return { status: "unavailable" as const, results: [] };
    }
  },
});
