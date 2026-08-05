import { defineAgent } from "eve";
import { openai } from "@ai-sdk/openai";

import { analysisResultSchema } from "../src/lib/schema";

export default defineAgent({
  model: openai("gpt-5"),
  // Task-mode callers receive this schema; interactive callers pass it per turn.
  outputSchema: analysisResultSchema,
});
