import { defineTool } from "eve/tools";
import { z } from "zod";

const VIRUSTOTAL_ENDPOINT = "https://www.virustotal.com/api/v3/urls";

type VirusTotalApiResponse = {
  data?: {
    attributes?: {
      last_analysis_stats?: { malicious?: number; suspicious?: number };
    };
  };
};

function sanitizePublicUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only HTTP and HTTPS URLs can be checked");
  }
  return `${url.protocol}//${url.host}${url.pathname}`;
}

export default defineTool({
  description:
    "Look up public URL security signals in VirusTotal. Use only for a URL already present in analyzed content. The tool removes query parameters, fragments, and credentials before the lookup. A result without flags never proves a URL is safe.",
  inputSchema: z.object({
    url: z.string().url().max(2_000),
  }),
  async execute({ url }) {
    const apiKey = process.env.VIRUSTOTAL_API_KEY;
    if (!apiKey) return { status: "not_configured" as const, result: null };

    try {
      const publicUrl = sanitizePublicUrl(url);
      const id = Buffer.from(publicUrl).toString("base64url");
      const response = await fetch(`${VIRUSTOTAL_ENDPOINT}/${id}`, {
        headers: { "x-apikey": apiKey },
        signal: AbortSignal.timeout(5_000),
      });
      if (!response.ok) return { status: "unavailable" as const, result: null };

      const body = (await response.json()) as VirusTotalApiResponse;
      const stats = body.data?.attributes?.last_analysis_stats;
      if (!stats) return { status: "unavailable" as const, result: null };

      return {
        status: "available" as const,
        result: {
          url: publicUrl,
          maliciousCount: stats.malicious ?? 0,
          suspiciousCount: stats.suspicious ?? 0,
        },
      };
    } catch {
      return { status: "unavailable" as const, result: null };
    }
  },
});
