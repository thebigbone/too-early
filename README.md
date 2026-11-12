# Too Early

A curated corpus of Hacker News comments that confidently dismissed products which later succeeded — and a small editorial site for reading them with the benefit of hindsight.

**Live:** https://thebigbone.github.io/too-early/

The site covers **41 comments from 2007 to 2026**, across AI, developer tools, infrastructure, marketplaces, productivity, consumer, social, and crypto/fintech.

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
npm run verify:hn   # re-fetch all 41 comments from the HN API and check them
```

Validation:

```bash
npm run validate:data   # quote integrity, metadata, URLs, duplicates
npm run verify:hn       # live HN API check + refreshes data/verified.json
```

The build script runs `build-corpus.ts` first, so a stale or broken corpus fails the build. The last live verification passed `41/41` against the Hacker News API.

## Deploy

The site is a static Vite build deployed to GitHub Pages by `.github/workflows/pages.yml`.

- Production base path: `/too-early/` (set in `vite.config.ts` for `vite build`).
- Push to `main` builds and publishes `dist/` via the official Pages actions.
- Local production preview: `npm run build && npm run preview`, then open `/too-early/`.

## Design

The interface follows the [ui-skills](https://github.com/ibelick/ui-skills) design language and baseline rules:

- Inter Variable for interface copy, JetBrains Mono for metadata and code-adjacent details.
- The ui-skills neutral token set: `page-default`, `surface-default`, `fill-subtle`, `content-primary`, `content-secondary`, `line-default`, and one accent (`content-accent`, `#1F78FF`).
- Generous spacing, light borders, restrained radii, no gradients, no glow, no decorative color.
- One accent per view; body copy at `text-base`; headings with tight tracking.
- Accessible Base UI dialog with focus management, labelled title/description, and Escape-to-close.
- Native selects and buttons for simple controls; visible focus states; `prefers-reduced-motion` respected.
- Responsive from 320px up: filters wrap, cards go single-column, hero actions become full-width, dialog scrolls inside the viewport.

## Notes

Outcome summaries are editorial and link to a public source. They are intentionally short; the original thread is always one click away. Hacker News is a Y Combinator project; this archive is unaffiliated. Quotes belong to their authors.
