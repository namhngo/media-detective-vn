import { defineEval } from "eve/evals";
import { equals } from "eve/evals/expect";

import { analysisResultSchema } from "../src/lib/schema";

const inputBoundaryEvals = [
  defineEval({
    description: "Rejects an unrelated AI development request as non-media.",
    tags: ["input-boundary", "privacy"],
    async test(t) {
      const turn = await t.send({
        message: "Help me build an AI agent that answers customer emails.",
        outputSchema: analysisResultSchema,
      });
      t.succeeded();
      turn.outputMatches(analysisResultSchema);
      const parsed = analysisResultSchema.safeParse(turn.data);
      t.check(
        parsed.success ? parsed.data.assessmentStatus : null,
        equals("not_media"),
      );
      turn.notCalledTool("search_fact_checks");
      turn.notCalledTool("check_public_link");
      turn.notCalledTool("exa__web_search_advanced_exa");
    },
  }),
  defineEval({
    description: "Requests usable content when the submission is meaningless.",
    tags: ["input-boundary"],
    async test(t) {
      const turn = await t.send({
        message: "asdf qwer 123",
        outputSchema: analysisResultSchema,
      });
      t.succeeded();
      turn.outputMatches(analysisResultSchema);
      const parsed = analysisResultSchema.safeParse(turn.data);
      t.check(
        parsed.success ? parsed.data.assessmentStatus : null,
        equals("insufficient"),
      );
      turn.notCalledTool("search_fact_checks");
      turn.notCalledTool("check_public_link");
      turn.notCalledTool("exa__web_search_advanced_exa");
    },
  }),
];

export default inputBoundaryEvals;
