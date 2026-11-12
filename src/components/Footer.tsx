import { collectionOf, entries } from "../data/entries";
import { withBase } from "../lib/base";
import { ArrowUpRightIcon } from "./Icons";

const footerLinkClass =
  "text-sm text-ink-content/65 transition-colors hover:text-ink-content";

const missCount = entries.filter((entry) => collectionOf(entry) === "miss").length;
const hitCount = entries.length - missCount;

export function Footer() {
  return (
    <footer className="bg-ink text-ink-content border-t border-line-default">
      <div className="container-7xl py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <a href="#top" className="inline-flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="grid size-6 place-items-center rounded-[5px] bg-ink-content font-mono text-[9px] font-medium tracking-[-0.03em] text-ink"
              >
                TE
              </span>
              <span className="text-lg font-medium tracking-tight">Too Early</span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-content/60 text-pretty">
              A field guide to confidence, 2007&ndash;2026. Some products won.
              Some didn&rsquo;t. The comments are still here.
            </p>
            <p className="mt-6 font-mono text-[10px] text-ink-content/60">
              {entries.length} receipts &middot; {missCount} wrong &middot; {hitCount} right
            </p>
          </div>

          <div className="lg:col-span-3">
            <p className="font-mono text-[10px] text-ink-content/60">Browse</p>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="#archive" className={footerLinkClass}>
                  The archive
                </a>
              </li>
              <li>
                <a href="#method" className={footerLinkClass}>
                  The method
                </a>
              </li>
              <li>
                <a href="#top" className={footerLinkClass}>
                  Back to top
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="font-mono text-[10px] text-ink-content/60">Elsewhere</p>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="https://news.ycombinator.com/"
                  target="_blank"
                  rel="noreferrer"
                  className={`${footerLinkClass} inline-flex items-center gap-1`}
                >
                  Hacker News
                  <ArrowUpRightIcon className="size-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/ibelick/ui-skills"
                  target="_blank"
                  rel="noreferrer"
                  className={`${footerLinkClass} inline-flex items-center gap-1`}
                >
                  ui-skills
                  <ArrowUpRightIcon className="size-3" />
                </a>
              </li>
              <li>
                <a
                  href={withBase("corpus.json")}
                  download="too-early-corpus.json"
                  className={`${footerLinkClass} inline-flex items-center gap-1`}
                >
                  Curated corpus (JSON)
                  <ArrowUpRightIcon className="size-3" />
                </a>
              </li>
              <li>
                <a
                  href={withBase("corpus-raw.json")}
                  download="too-early-raw-candidates.json"
                  className={`${footerLinkClass} inline-flex items-center gap-1`}
                >
                  Raw candidates (JSON)
                  <ArrowUpRightIcon className="size-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/HackerNews/API"
                  target="_blank"
                  rel="noreferrer"
                  className={`${footerLinkClass} inline-flex items-center gap-1`}
                >
                  HN API
                  <ArrowUpRightIcon className="size-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink-content/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-xs leading-relaxed text-ink-content/60 text-pretty">
            Quotes belong to their authors. Hacker News is a Y Combinator
            project; this archive is not affiliated. Corrections welcome&mdash;the
            original thread is one click away.
          </p>
          <p className="font-mono text-[10px] text-ink-content/60">
            Designed with ui-skills
          </p>
        </div>
      </div>
    </footer>
  );
}
