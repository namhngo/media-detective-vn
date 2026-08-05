---
description: Use when content contains factual claims that could be checked against a source, including dates, numbers, events, quotes, policies, or alleged evidence.
---

# Claim verification

## Procedure

1. Extract only factual, checkable claims. Keep material qualifiers such as who,
   what, when, where, how much, and the claimed source. Do not turn an opinion,
   prediction, joke, or personal experience into a fact claim.
2. Reduce a compound post into separate claims. For example, split an alleged
   event, its date, its location, and an alleged official response; each may have
   different evidence.
3. Identify the earliest attributable source. A repost, quote card, screenshot,
   follower count, and AI summary are leads, not independent evidence.
4. Prefer the relevant primary record: an original statement, official document,
   complete interview, public data, or the source's original media. Explain when
   the original source cannot be located.
5. Use `search_fact_checks` for concise, redacted claims when it could surface a
   published investigation. Read the linked publisher and its sources before
   treating a match as useful context.
6. Keep three categories distinct in the explanation: what is supported by a
   named source, what is an inference, and what remains unverified.

## Output rules

- Say "not independently verifiable from this material" rather than calling a
  claim false merely because proof is absent.
- Preserve uncertainty about timing, attribution, and scope. A correct fact can
  still be misleading when paired with the wrong date, place, or conclusion.
- Give one concrete next action: open the original statement, compare dates,
  locate the primary document, or read the full published fact check.
- The tier measures manipulation and verification risk. It does not decide
  whether the claim is true.

## Reference principles

- Google Fact Check Explorer: <https://toolbox.google.com/factcheck/explorer>
- Google ClaimReview guidance: <https://developers.google.com/search/docs/appearance/structured-data/factcheck>
- IFCN commitments: <https://ifcncodeofprinciples.poynter.org/know-more/the-commitments-of-the-code-of-principles>
- UNESCO MIL: <https://www.unesco.org/en/media-information-literacy>
