# Pass 2 agent guide — Too Early

Project: `/root/too-early`

Goal: add verified Hacker News receipts to a new agent file. Every entry must be a real HN comment on a real early thread, and must clearly concern the assigned product.

## Use the HN API, not memory

Discover the launch/early thread:

```bash
curl -sG 'https://hn.algolia.com/api/v1/search' \
  --data-urlencode 'query=PRODUCT' \
  --data-urlencode 'tags=story' \
  --data-urlencode 'hitsPerPage=20'
```

Prefer the original launch, Show HN, Launch HN, funding, or first major product thread from the product's early years. Read the story's comments:

```bash
curl -s 'https://hn.algolia.com/api/v1/items/STORY_ID'
```

Verify the selected comment exactly with the official API:

```bash
curl -s 'https://hacker-news.firebaseio.com/v0/item/COMMENT_ID.json'
```

Then walk the `parent` chain to get the exact story title. Do not paraphrase, do not invent dates, authors, or outcomes.

## What counts

- A real, dated HN comment that is confident, dismissive, snarky, or a clear failure prediction.
- It should be from the launch/early thread or the first wave of coverage, before the outcome was obvious.
- For `"collection": "miss"`: the product later succeeded. Use a verifiable success marker (IPO, acquisition, named valuation/funding, durable scale, category leadership).
- For `"collection": "hit"`: the product later failed/shut down/bankrupt, and the comment predates the failure. No retrospective “I told you so” comments.
- Prefer the harshest, most specific critic. Avoid mild feature requests, pricing nitpicks, or generic “I don’t get it” unless the wording is genuinely sharp.
- Do not include comments that are primarily about a different product.
- No slurs, harassment, or personal attacks. Mild profanity in a verbatim quote is acceptable but prefer cleaner quotes.
- Do not reuse an HN comment ID already in `data/agents/existing-ids.txt`, and do not duplicate IDs within your file. Projects may repeat if the comment is new.

## Output schema

Write ONLY your assigned file, as a JSON array (or `{"entries":[...]}`):

```json
[
  {
    "id": 123456,
    "project": "Docker",
    "year": 2013,
    "date": "Mar 26, 2013",
    "author": "hnuser",
    "category": "Infrastructure",
    "verdict": "Clean miss",
    "collection": "miss",
    "cardQuote": "contiguous verbatim excerpt, 40-300 chars",
    "quote": "full verbatim comment text",
    "storyTitle": "exact parent story title",
    "hnUrl": "https://news.ycombinator.com/item?id=123456",
    "outcome": "one short sentence with a verifiable outcome",
    "outcomeDetail": "2-4 sentences of context",
    "note": "1-2 sentences on why it aged badly or why the critic was right",
    "sourceLabel": "Wikipedia / official company page / credible report",
    "sourceUrl": "https://..."
  }
]
```

Allowed categories: `AI`, `Consumer`, `Crypto & fintech`, `Developer tools`, `Infrastructure`, `Marketplaces`, `Productivity`, `Social`.

Allowed verdicts: `Clean miss`, `Wrong on the outcome`, `Right about the risk`, `A little too early`, `Right call`.

For `collection: "hit"`, use `verdict: "Right call"`.
Date format: `Mon D, YYYY`, e.g. `Mar 26, 2013`.

## Verify before finishing

```bash
cd /root/too-early
npx tsx scripts/validate-agent-file.ts data/agents/YOUR_FILE.json
```

Fix every error until it prints `OK: N entries verified against the HN API.` Do not modify site source, build files, git state, or other agents' files. Only write your assigned JSON file.

Report: file path, count, validator output, 3-5 standout quotes, and any notable misses you had to skip because HN had no qualifying early comment.
