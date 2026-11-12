import { entries, yearRange } from "../data/entries";
import { ArrowUpRightIcon } from "./Icons";

const footerLinkClass =
  "text-sm text-content-inverse/65 transition-colors hover:text-content-inverse";

export function Footer() {
  return (
    <footer className="bg-fill-inverse text-content-inverse">
      <div className="container-7xl py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <a href="#top" className="inline-flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="grid size-6 place-items-center rounded-[5px] bg-content-inverse font-mono text-[9px] font-medium tracking-[-0.03em] text-fill-inverse"
              >
                TE
              </span>
              <span className="text-lg font-medium tracking-tight">Too Early</span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-content-inverse/60 text-pretty">
              A field guide to being confidently wrong, 2007&ndash;2026. The
              products won. The comments are still here.
            </p>
            <p className="mt-6 font-mono text-[10px] text-content-inverse/60">
              {entries.length} receipts &middot; {yearRange} &middot; 0 correct calls
            </p>
          </div>

          <div className="lg:col-span-3">
            <p className="font-mono text-[10px] text-content-inverse/60">Browse</p>
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
            <p className="font-mono text-[10px] text-content-inverse/60">Elsewhere</p>
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
                  href={`${import.meta.env.BASE_URL}corpus.json`}
                  download="too-early-corpus.json"
                  className={`${footerLinkClass} inline-flex items-center gap-1`}
                >
                  Corpus (JSON)
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

        <div className="mt-12 flex flex-col gap-3 border-t border-content-inverse/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-xs leading-relaxed text-content-inverse/60 text-pretty">
            Quotes belong to their authors. Hacker News is a Y Combinator
            project; this archive is not affiliated. Corrections welcome&mdash;the
            original thread is one click away.
          </p>
          <p className="font-mono text-[10px] text-content-inverse/60">
            Designed with ui-skills
          </p>
        </div>
      </div>
    </footer>
  );
}
