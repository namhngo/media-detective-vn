import { defineTool } from "eve/tools";
import { z } from "zod";

import { categorySchema, techniqueSchema } from "../../src/lib/schema";

export default defineTool({
  description:
    "Search the confirmed-case library (seed cases + user-confirmed reports) for patterns similar to the analyzed content. Returns up to 3 cases with similarity scores; may legitimately return none when nothing clears the similarity floor. Retrieval is context for the user — it never influences the tier.",
  inputSchema: z.object({
    category: categorySchema,
    claims: z.array(z.string()),
    techniques: z.array(techniqueSchema),
  }),
  async execute() {
    // TODO(backend phase): embed claims+techniques with text-embedding-3-small,
    // pgvector cosine search over reports WHERE is_seed OR is_shared,
    // similarity floor ~0.78, return top 3 as SimilarCase[].
    return { similarCases: [] };
  },
});
