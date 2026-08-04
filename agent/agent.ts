import { defineAgent } from "eve";

import { analysisResultSchema } from "../src/lib/schema";

export default defineAgent({
  model: "openai/gpt-5",
  // Schema-guaranteed structured output: the tier can never be a bare number.
  outputSchema: analysisResultSchema,
});
