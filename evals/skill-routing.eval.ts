import { defineEval } from "eve/evals";
import { loadJson } from "eve/evals/loaders";

import { analysisResultSchema } from "../src/lib/schema";

type SkillRoutingCase = {
  skill: string;
  shouldTrigger: string[];
  nearMisses: string[];
};

const cases = (await loadJson(
  "evals/data/skill-routing.json",
)) as SkillRoutingCase[];

export default cases.map((testCase) =>
  defineEval({
    description: `Routes ${testCase.skill} for its primary investigation pattern.`,
    tags: ["skill-routing"],
    async test(t) {
      const turn = await t.send({
        message: testCase.shouldTrigger[0]!,
        outputSchema: analysisResultSchema,
      });
      t.succeeded();
      turn.outputMatches(analysisResultSchema);
      t.loadedSkill(testCase.skill).soft();
    },
  }),
);
