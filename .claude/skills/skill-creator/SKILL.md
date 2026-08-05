---
name: skill-creator
description: Create, revise, and evaluate Eve Agent Skills for Media Detective Vietnam. Use whenever changing files under agent/skills/, deciding whether a proposed skill belongs in the production agent, improving skill trigger descriptions, or testing a skill procedure against realistic misinformation and scam cases.
---

# Eve Skill Creator

Use this development-only skill to improve the production skills under
`agent/skills/`. Do not place this file or other meta-authoring instructions in
the Eve agent itself: production skills must help users investigate content, not
help the agent author prompts.

## Product constraints

Every proposed Eve skill must preserve these project rules:

- One Eve agent only. Do not create subagents or orchestration.
- The three-stage flow remains extract and analyze, find similar cases, then
  assemble the result.
- Raw text and screenshots are transient. Skills and tools receive only the
  minimum structured, redacted information they need.
- The model emits the tier. Similar-case retrieval is context only and never
  votes on the tier.
- Never name or amplify allegations about a private person.
- Do not promise truth, safety, accuracy, legal outcomes, or removal outcomes.

## Decide whether a skill is needed

Create a production skill only when all of these are true:

1. The task is a recurring, recognizable investigation pattern rather than a
   one-off fact.
2. It changes the agent's procedure or safety boundary beyond the always-on
   instructions.
3. The current taxonomy, output schema, and available tools can represent its
   result responsibly.
4. It has a clear user benefit and a source-backed procedure.

Do not create a production skill for a broad domain without a matching category,
evidence source, or safe next action. Add it to the roadmap instead. Prefer one
well-scoped skill over overlapping skills that fight for the same trigger.

## Research before drafting

Use primary sources first: official public authorities, standards bodies,
peer-reviewed research, and the documented APIs the project actually uses.

For fact checking and source evaluation, start with Google Fact Check, IFCN, and
UNESCO MIL. For provenance, start with C2PA. For scam prevention, start with the
relevant consumer-protection or public-safety authority. Do not turn a source
into a claim of certainty. Record source URLs in a short `## Reference
principles` section in the production skill.

Never install a marketplace skill into `agent/skills/` without reviewing its
source, license, dependencies, data handling, and fit with the product rules.

## Draft the production skill

Create a directory named with a precise lowercase kebab-case capability:

```text
agent/skills/<capability>/SKILL.md
```

Eve discovers that exact packaged-skill path. The frontmatter must include a
description. Make the description a strong routing hint: state the user content
or request that should activate the skill, not only its title.

Keep the body under 500 lines and use this structure when applicable:

```md
---
description: Use when ...
---

# <Capability>

## Procedure
1. ...

## Safety and uncertainty boundaries
- ...

## Tool discipline
- ...

## Reference principles
- <authoritative URL>
```

Explain why a procedure matters. Prefer clear procedures over long background
essays, absolute language, or instructions that the model cannot verify.

## Review the trigger description

Write at least three should-trigger examples and three close non-trigger cases.
Check that the proposed skill wins against existing skills only when it adds a
distinct procedure. Examples should resemble real inputs, such as a viral
screenshot, an impersonation request, or an alleged official announcement.

Review these questions:

- Does the description identify the input pattern and the action to take?
- Would it activate for a simple case that needs no special procedure?
- Does it overlap with `misinformation-playbook`, `source-and-context`, or
  `claim-verification`?
- Does it introduce a claim, tool, or evidence source that the app does not
  actually support?

## Validate changes

After changing production skills:

1. Run `npx eve info` under Node 24. It must report zero diagnostics and the
   expected skill count.
2. Run `npm run lint` and `npm run build`.
3. Read the changed skill as if it were the only context the agent loaded. Verify
   it identifies safe actions, uncertainty, and privacy boundaries.
4. Add or revise test prompts before declaring a skill production-ready. Test a
   positive case, a near miss, and a harmful/private-person case when relevant.

## Sources

- Anthropic Agent Skills examples and authoring guidance:
  <https://github.com/anthropics/skills>
- Eve packaged skill discovery:
  `node_modules/eve/docs/skills.mdx`
- Eve project structure:
  `node_modules/eve/docs/project-structure.mdx`
