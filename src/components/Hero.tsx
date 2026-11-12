import { entries, type Entry, yearRange } from "../data/entries";
import { ArrowDownIcon, ArrowUpRightIcon, CheckIcon, QuoteMarkIcon } from "./Icons";

type HeroProps = {
  featured: Entry;
  missCount: number;
  hitCount: number;
  onOpenFeatured: () => void;
  onBrowseAll: () => void;
  onShowRightCalls: () => void;
};

const statClass = "font-[450] text-2xl tabular-nums tracking-tight";
const statLabelClass = "mt-1 font-mono text-[10px] leading-snug text-content-secondary";

export function Hero({
  featured,
  missCount,
  hitCount,
  onOpenFeatured,
  onBrowseAll,
  onShowRightCalls,
}: HeroProps) {
  const years = Number(yearRange.split("\u2013")[1]) - Number(yearRange.split("\u2013")[0]) + 1;

  return (
    <section id="top" className="border-b border-line-default">
      <div className="container-7xl pb-10 pt-12 sm:pb-14 sm:pt-16 lg:pb-16 lg:pt-20">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="flex items-start gap-2.5 font-mono text-[11px] text-content-secondary">
              <span
                aria-hidden="true"
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-content-accent"
              />
              A Hacker News receipt archive, 2007&ndash;2026
            </p>

            <h1 className="mt-5 max-w-[12ch] text-5xl font-[450] leading-[1.02] tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl">
              They said it{" "}
              <span className="whitespace-nowrap">
                wouldn&rsquo;t <span className="text-content-accent">work.</span>
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-content-secondary text-pretty sm:text-lg">
              Confident Hacker News predictions about products that won,
              products that lost, and the critics who called it. Real comments,
              linked receipts, and the luxury of knowing how it ended.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={onBrowseAll}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-fill-inverse px-5 text-sm font-medium text-content-inverse transition-colors hover:bg-fill-inverse/90 sm:w-auto"
              >
                Browse {entries.length} receipts
                <ArrowDownIcon className="size-4" />
              </button>
              <button
                type="button"
                onClick={onShowRightCalls}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-line-default bg-fill-default px-5 text-sm font-medium text-content-primary transition-colors hover:bg-fill-subtle sm:w-auto"
              >
                <CheckIcon className="size-4" />
                Right calls ({hitCount})
              </button>
            </div>

            <p className="mt-4 font-mono text-[10px] text-content-secondary">
              {entries.length} quotes &middot; {years} years &middot; 0 invented
            </p>
          </div>

          <div className="lg:col-span-5">
            <article className="relative overflow-hidden rounded-2xl bg-ink p-6 text-ink-content shadow-2xs ring-1 ring-line-default sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[10px] text-ink-content/55">
                  The canonical miss
                </p>
                <p className="font-mono text-[10px] text-ink-content/55">{featured.year}</p>
              </div>

              <QuoteMarkIcon className="mt-8 size-6 text-ink-content/20" />

              <blockquote className="mt-3 text-xl leading-snug tracking-tight text-balance sm:text-2xl">
                &ldquo;{featured.cardQuote}&rdquo;
              </blockquote>

              <p className="mt-5 font-mono text-[10px] text-ink-content/55">
                {featured.author} &middot; {featured.project} &middot; {featured.date}
              </p>

              <div className="mt-8 border-t border-ink-content/15 pt-5">
                <p className="font-mono text-[10px] text-ink-content/60">Reality</p>
                <p className="mt-1.5 text-sm leading-snug text-ink-content/90">
                  {featured.outcome}
                </p>
                <button
                  type="button"
                  onClick={onOpenFeatured}
                  aria-haspopup="dialog"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-content underline decoration-ink-content/30 underline-offset-4 transition-colors hover:decoration-ink-content"
                >
                  Read the receipt
                  <ArrowUpRightIcon className="size-4" />
                </button>
              </div>
            </article>
          </div>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line-default pt-6 sm:grid-cols-4">
          <div className="flex flex-col-reverse">
            <dt className={statLabelClass}>receipts collected</dt>
            <dd className={statClass}>{entries.length}</dd>
          </div>
          <div className="flex flex-col-reverse">
            <dt className={statLabelClass}>years of certainty</dt>
            <dd className={statClass}>{years}</dd>
          </div>
          <div className="flex flex-col-reverse">
            <dt className={statLabelClass}>wrong calls</dt>
            <dd className={statClass}>{missCount}</dd>
          </div>
          <div className="flex flex-col-reverse">
            <dt className={statLabelClass}>right calls</dt>
            <dd className={statClass}>{hitCount}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
