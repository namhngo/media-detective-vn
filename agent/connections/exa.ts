import { defineMcpClientConnection } from "eve/connections";

const apiKey = process.env.EXA_API_KEY;
const enabled = process.env.EXA_ENABLED === "true" && Boolean(apiKey);
const headers = enabled && apiKey ? { "x-api-key": apiKey } : undefined;

/**
 * Semantic public-source search. When disabled, no Exa tools are discoverable,
 * which makes the feature flag a hard credit-spend boundary.
 */
export default defineMcpClientConnection({
  url: "https://mcp.exa.ai/mcp?tools=web_search_advanced_exa",
  description: enabled
    ? "Search current public reporting about a redacted public claim when no published fact check answers it. Results are cited context, never a verdict."
    : "Exa public-source search is disabled for this deployment.",
  ...(headers ? { headers } : {}),
  tools: { allow: enabled ? ["web_search_advanced_exa"] : [] },
});
