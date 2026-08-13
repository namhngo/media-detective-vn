---
description: Extract media-literacy facts from source documents in content/source/ into content/mil-facts.json for human review
---

Read every file in `content/source/`. Process them **one at a time** — never batch multiple files into a single pass — so no single file's content gets dropped from an oversized context window.

For each file, extract facts. Target **at least 50 total facts** across all files combined for a full run — but that total is not an even per-file split: pull more from denser documents, less from thinner ones. When this command runs on a partial or incremental set of source files (e.g. only a few new documents added since the last run), scale the target down proportionally rather than forcing 50 out of a handful of files.

Each fact must:

- Be understandable on its own, with no surrounding context needed.
- Be under 30 words.
- Be a faithful paraphrase of the source — never a verbatim quote.
- Include the source filename and page/section it came from, for citation.
- Not duplicate the underlying point of a fact already extracted — check against every fact pulled from earlier files in this same run too, since related documents (e.g. UNESCO MIL modules) tend to overlap in theme.

Sort each fact into exactly one category:

- `source-verification`
- `emotional-manipulation`
- `technical-ai-literacy`
- `sharing-responsibility`

## Output

Write results to `content/mil-facts.json` as a JSON array of objects shaped like:

```json
{
  "id": "mil-fact-013",
  "category": "source-verification",
  "fact": "A reverse image search can reveal a photo's real date and location in seconds.",
  "source": "unesco-mil-curriculum.pdf, p.44",
  "reviewed": false
}
```

- If `content/mil-facts.json` already has entries, **append** to them with incrementing `id`s rather than overwriting the file. Read the existing file first to find the highest existing id number.
- Set `"reviewed": false` on every new entry, without exception. Never flip this flag yourself — a human reviews and approves each fact before it becomes eligible for `/api/dashboard/play` to serve. This rule applies regardless of how confident the extraction seems.
- Do not run `scripts/seed-mil-facts.ts` as part of this command. Seeding the database is a separate, manual, human-run step — this command only ever produces the JSON file for review.

## Report back

When done, report:

1. Total facts extracted this run, broken down by category.
2. Which source files contributed the most and least facts, so the user knows if any file needs a closer manual look (a thin count may mean a thin source, or may mean something was missed).
3. Any candidates dropped for being too similar to another fact already extracted, and why — specific enough that the user could go verify the call.
