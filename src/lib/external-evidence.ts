import type { AnalysisResult, ExternalEvidence } from "@/lib/schema";

const FACT_CHECK_ENDPOINT =
  "https://factchecktools.googleapis.com/v1alpha1/claims:search";
const VIRUSTOTAL_ENDPOINT = "https://www.virustotal.com/api/v3/urls";
const REQUEST_TIMEOUT_MS = 5_000;

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

type VirusTotalApiResponse = {
  data?: {
    attributes?: {
      last_analysis_stats?: { malicious?: number; suspicious?: number };
    };
  };
};

function noExternalEvidence(): ExternalEvidence {
  return {
    factChecks: { status: "not_requested", results: [] },
    urlSafety: { status: "not_requested", result: null },
  };
}

function publicUrlFromText(text: string | undefined) {
  const match = text?.match(/https?:\/\/[^\s<>"]+/i)?.[0];
  if (!match) return null;

  try {
    const parsed = new URL(match);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    // Do not share query parameters, fragments, or credentials with VirusTotal.
    return `${parsed.protocol}//${parsed.host}${parsed.pathname}`;
  } catch {
    return null;
  }
}

async function findFactChecks(claims: string[]): Promise<ExternalEvidence["factChecks"]> {
  const apiKey = process.env.GOOGLE_FACT_CHECK_API_KEY;
  if (!apiKey) return { status: "not_configured", results: [] };

  const query = claims.filter(Boolean).slice(0, 3).join(" ").slice(0, 500);
  if (!query) return { status: "not_applicable", results: [] };

  try {
    const params = new URLSearchParams({ query, key: apiKey, pageSize: "3" });
    const response = await fetch(`${FACT_CHECK_ENDPOINT}?${params}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) return { status: "unavailable", results: [] };

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

    return { status: "available", results };
  } catch {
    return { status: "unavailable", results: [] };
  }
}

async function checkPublicUrl(url: string | null): Promise<ExternalEvidence["urlSafety"]> {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!url) return { status: "not_applicable", result: null };
  if (!apiKey) return { status: "not_configured", result: null };

  try {
    const id = Buffer.from(url).toString("base64url");
    const response = await fetch(`${VIRUSTOTAL_ENDPOINT}/${id}`, {
      cache: "no-store",
      headers: { "x-apikey": apiKey },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) return { status: "unavailable", result: null };

    const body = (await response.json()) as VirusTotalApiResponse;
    const stats = body.data?.attributes?.last_analysis_stats;
    if (!stats) return { status: "unavailable", result: null };

    return {
      status: "available",
      result: {
        url,
        maliciousCount: stats.malicious ?? 0,
        suspiciousCount: stats.suspicious ?? 0,
      },
    };
  } catch {
    return { status: "unavailable", result: null };
  }
}

/**
 * Assembly-only enrichment. The model's tier and structured analysis are
 * already fixed before this runs, and no returned value is persisted.
 */
export async function collectExternalEvidence({
  analysis,
  rawText,
  enabled,
}: {
  analysis: AnalysisResult;
  rawText?: string;
  enabled: boolean;
}): Promise<ExternalEvidence> {
  if (!enabled) return noExternalEvidence();

  const [factChecks, urlSafety] = await Promise.all([
    findFactChecks(analysis.claims),
    checkPublicUrl(publicUrlFromText(rawText)),
  ]);

  return { factChecks, urlSafety };
}
