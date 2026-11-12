# Too Early

A two-sided corpus of Hacker News confidence: comments that dismissed products which later succeeded, and comments that correctly predicted products which later failed. The site reads both sides with the benefit of hindsight.

**Live:** https://thebigbone.github.io/too-early/

The site covers **468 comments from 2007 to 2026**: **379 wrong calls** (the product won) and **89 right calls** (the product failed), across AI, developer tools, infrastructure, marketplaces, productivity, consumer, social, and crypto/fintech. An interactive [charts page](https://thebigbone.github.io/too-early/charts/) maps the same corpus by year and category.

## The corpus

- **Canonical example:** BrandonM on Dropbox, 2007 — “It does not seem very ‘viral’ or income-generating.”
- **Source:** the official Hacker News Firebase API, with comment permalinks.
- **Fields per entry:** HN comment id, project, author, date, year, category, verdict, verbatim quote, story title, HN permalink, outcome summary, outcome detail, editorial note, source link.
- **Files:**
  - `public/corpus.json` — the published corpus, including the verified raw comment text and story metadata.
  - `data/verified.json` — the raw fetched comments used for verification.
  - `src/data/entries.ts` — the curated entries rendered by the site.
- **Quote integrity:** each card quote is checked against the fetched HN comment as a sequence of verbatim fragments; author, date, year, and story title are checked too. Run `npm run validate:data`.

The corpus is curated, not exhaustive. A comment is included only when:

1. it is a real comment on a real Hacker News thread;
2. it confidently predicts or asserts that the product will not work, will not scale, or is not a real business;
3. the product has a verifiable success marker (IPO, acquisition, durable scale, or category dominance);
4. the original comment can be linked and read in context.

Some critics were right about the risk and wrong about the outcome. The `verdict` field says which; the archive is about the pattern, not the person.

## Run it

```bash
npm install
npm run dev         # http://localhost:5173
npm run build       # validates the corpus, typechecks, and builds
npm run preview
npm run verify:hn   # re-fetch all 468 comments from the HN API and check them
```

Validation:

```bash
npm run validate:data   # quote integrity, metadata, URLs, duplicates
npm run verify:hn       # live HN API check + refreshes data/verified.json
```

The build script merges `data/agents/*.json`, runs `build-corpus.ts`, and validates every quote against the fetched HN data. The last live verification passed `468/468` against the Hacker News API.

A separate **raw candidate pool** of 137 verified comments across 64 projects (2010–2026) is published at `public/corpus-raw.json`. It is deliberately uncurated and is not rendered as cards; it exists for further expansion.

The archive is curated in two collections:

- **Wrong calls** — confident dismissals of products that won.
- **Right calls** — early predictions of failure that were correct. These require the failure to be unambiguous and the comment to predate the shutdown.

The `worst-critic` passes replaced 16 milder original picks and 18 milder agent picks with sharper comments from the same stories. The core replacements live in `src/data/entries.ts`; the agent-pool replacements live in `scripts/merge-agents.ts` so the curation decisions are explicit.

## Deploy

The site is a two-page static Vite build (archive + charts) deployed to GitHub Pages by `.github/workflows/pages.yml`.

- Production base path: `/too-early/` (set in `vite.config.ts` for `vite build`).
- The charts page is a separate Vite entry at `charts/index.html`, linked from the archive header.
- Push to `main` builds and publishes `dist/` via the official Pages actions.
- Local production preview: `npm run build && npm run preview`, then open `/too-early/`.

## Design

The interface follows the [ui-skills](https://github.com/ibelick/ui-skills) design language and baseline rules:

- Light and dark themes, driven by `data-theme`, the system preference, and a localStorage override.
- A two-sided archive: filter by all receipts, wrong calls, or right calls. Each card carries the verdict.
- A separate interactive charts page with click-to-inspect bars, year/category filters, and a light/dark theme.
- Inter Variable for interface copy, JetBrains Mono for metadata and code-adjacent details.
- The ui-skills neutral token set: `page-default`, `surface-default`, `fill-subtle`, `content-primary`, `content-secondary`, `line-default`, and one accent (`content-accent`, `#1F78FF`).
- Generous spacing, light borders, restrained radii, no gradients, no glow, no decorative color.
- One accent per view; body copy at `text-base`; headings with tight tracking.
- Accessible Base UI dialog with focus management, labelled title/description, and Escape-to-close.
- Native selects and buttons for simple controls; visible focus states; `prefers-reduced-motion` respected.
- Responsive from 320px up: filters wrap, cards go single-column, hero actions become full-width, dialog scrolls inside the viewport.

## Notes

Outcome summaries are editorial and link to a public source. They are intentionally short; the original thread is always one click away. Hacker News is a Y Combinator project; this archive is unaffiliated. Quotes belong to their authors.
