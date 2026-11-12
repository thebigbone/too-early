import { useState } from "react";
import { categories, collectionOf, entries, type Entry } from "../data/entries";
import { ArrowUpRightIcon } from "../components/Icons";
import { ThemeButton } from "../components/ThemeButton";
import { withBase, baseUrl } from "../lib/base";
import { cn } from "../lib/cn";
import { useTheme } from "../lib/useTheme";

type Metric = "all" | "miss" | "hit";
type Selection =
  | { kind: "year"; value: number }
  | { kind: "category"; value: string }
  | null;

const base = baseUrl;
const categoryList = categories.filter((category) => category !== "All");

const isWrong = (entry: Entry) => collectionOf(entry) === "miss";

const years = [...new Set(entries.map((entry) => entry.year))].sort(
  (a, b) => a - b,
);

const yearStats = years.map((year) => {
  const items = entries.filter((entry) => entry.year === year);
  const wrong = items.filter(isWrong).length;
  const right = items.length - wrong;
  return { year, items, wrong, right, total: items.length };
});

const categoryStats = categoryList
  .map((category) => {
    const items = entries.filter((entry) => entry.category === category);
    const wrong = items.filter(isWrong).length;
    const right = items.length - wrong;
    return { category, items, wrong, right, total: items.length };
  })
  .sort((a, b) => b.total - a.total);

const totalCount = entries.length;
const wrongCount = entries.filter(isWrong).length;
const rightCount = totalCount - wrongCount;
const hitRate = ((rightCount / totalCount) * 100).toFixed(1);
const defaultYear = yearStats.reduce(
  (best, current) => (current.total > best.total ? current : best),
  yearStats[0]!,
).year;

const metricCount = (wrong: number, right: number, total: number, metric: Metric) =>
  metric === "all" ? total : metric === "miss" ? wrong : right;

const metricLabel = (metric: Metric) =>
  metric === "all" ? "All calls" : metric === "miss" ? "Wrong calls" : "Right calls";

const isSameSelection = (a: Selection, b: Selection) =>
  Boolean(a && b && a.kind === b.kind && a.value === b.value);

function SelectionChart({
  metric,
  selected,
  onSelect,
}: {
  metric: Metric;
  selected: Selection;
  onSelect: (selection: Selection) => void;
}) {
  const maxYear = Math.max(
    ...yearStats.map(({ wrong, right, total }) =>
      metricCount(wrong, right, total, metric),
    ),
    1,
  );

  return (
    <div
      role="group"
      aria-label="Receipts by year"
      className="relative mt-7 border-b border-line-default"
    >
      <div
        className="grid h-56 items-end gap-0.5 sm:h-64 sm:gap-1.5"
        style={{ gridTemplateColumns: `repeat(${years.length}, minmax(0, 1fr))` }}
      >
        {yearStats.map(({ year, wrong, right, total }) => {
          const isSelected = selected?.kind === "year" && selected.value === year;
          const isActive = isSelected;
          const wrongPct = metric === "hit" ? 0 : (wrong / maxYear) * 100;
          const rightPct = metric === "miss" ? 0 : (right / maxYear) * 100;

          return (
            <button
              key={year}
              type="button"
              aria-label={`${year}: ${wrong} wrong calls, ${right} right calls`}
              aria-pressed={isSelected}
              onClick={() => onSelect({ kind: "year", value: year })}
              className={cn(
                "group relative flex h-full min-w-0 flex-col justify-end rounded-sm bg-fill-subtle/70 transition-colors hover:bg-fill-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-content-primary",
                isSelected && "outline outline-1 outline-offset-2 outline-content-primary",
              )}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-1 hidden font-mono text-[9px] tabular-nums text-content-secondary group-hover:block"
              >
                {metricCount(wrong, right, total, metric)}
              </span>
              {wrongPct > 0 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "w-full bg-fill-inverse",
                    rightPct === 0 && "rounded-t-sm",
                    isActive && "opacity-80",
                  )}
                  style={{ height: `${wrongPct}%` }}
                />
              ) : null}
              {rightPct > 0 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "w-full rounded-t-sm bg-content-accent",
                    wrongPct === 0 && "rounded-b-sm",
                    isActive && "opacity-80",
                  )}
                  style={{ height: `${rightPct}%` }}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <div
        className="mt-2 grid gap-0.5 sm:gap-1.5"
        style={{ gridTemplateColumns: `repeat(${years.length}, minmax(0, 1fr))` }}
      >
        {years.map((year, index) => (
          <span
            key={year}
            className={cn(
              "text-center font-mono text-[8px] tabular-nums text-content-secondary sm:text-[9px]",
              index % 5 !== 0 &&
                index !== years.length - 1 &&
                "invisible sm:visible",
            )}
          >
            {year}
          </span>
        ))}
      </div>
    </div>
  );
}

function CategoryChart({
  metric,
  selected,
  onSelect,
}: {
  metric: Metric;
  selected: Selection;
  onSelect: (selection: Selection) => void;
}) {
  const maxCategory = Math.max(
    ...categoryStats.map(({ wrong, right, total }) =>
      metricCount(wrong, right, total, metric),
    ),
    1,
  );

  return (
    <div role="group" aria-label="Receipts by category" className="mt-6 space-y-1">
      {categoryStats.map(({ category, wrong, right, total }) => {
        const isSelected =
          selected?.kind === "category" && selected.value === category;
        const isActive = isSelected;
        const value = metricCount(wrong, right, total, metric);
        const width = (value / maxCategory) * 100;
        const wrongShare = total > 0 ? (wrong / total) * 100 : 0;
        const rightShare = total > 0 ? (right / total) * 100 : 0;

        return (
          <button
            key={category}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect({ kind: "category", value: category })}
            className={cn(
              "group -mx-2 flex w-[calc(100%+1rem)] items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-fill-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-content-primary",
              isSelected && "bg-fill-subtle outline outline-1 outline-line-default",
            )}
          >
            <span className="w-28 shrink-0 truncate text-[11px] font-medium text-content-primary sm:text-xs">
              {category}
            </span>
            <span className="relative h-3 min-w-0 flex-1 overflow-hidden rounded-sm bg-fill-subtle">
              <span
                className="absolute inset-y-0 left-0 flex"
                style={{ width: `${width}%` }}
              >
                {metric !== "hit" ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-full bg-fill-inverse",
                      isActive && "opacity-80",
                    )}
                    style={{ width: `${wrongShare}%` }}
                  />
                ) : null}
                {metric !== "miss" ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-full bg-content-accent",
                      isActive && "opacity-80",
                    )}
                    style={{ width: `${rightShare}%` }}
                  />
                ) : null}
              </span>
            </span>
            <span className="w-8 shrink-0 text-right font-mono text-[10px] tabular-nums text-content-secondary">
              {value}
            </span>
            <span className="sr-only">
              {wrong} wrong calls, {right} right calls. Select this category.
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Inspector({
  selection,
  metric,
  onClear,
}: {
  selection: Selection;
  metric: Metric;
  onClear: () => void;
}) {
  if (!selection) {
    return (
      <aside
        aria-label="Receipt inspector"
        className="rounded-xl bg-surface-default p-5 ring-1 ring-line-default sm:p-6"
      >
        <p className="font-mono text-[10px] text-content-secondary">Inspector</p>
        <p className="mt-3 text-xl font-[450] tracking-tight">Select a slice.</p>
        <p className="mt-2 text-sm leading-relaxed text-content-secondary text-pretty">
          Click a year or category to inspect its receipts here. Use the metric
          toggle to narrow the chart to wrong or right calls.
        </p>
      </aside>
    );
  }

  const items = selection.kind === "year"
    ? entries.filter((entry) => entry.year === selection.value)
    : entries.filter((entry) => entry.category === selection.value);
  const wrong = items.filter(isWrong).length;
  const right = items.length - wrong;
  const filtered = items
    .filter((entry) => metric === "all" || collectionOf(entry) === metric)
    .sort((a, b) => b.year - a.year || b.id - a.id);
  const shown = filtered.slice(0, 4);
  const label =
    selection.kind === "year" ? `Year ${selection.value}` : selection.value;

  return (
    <aside
      aria-label="Receipt inspector"
      className="rounded-xl bg-surface-default p-5 ring-1 ring-line-default sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] text-content-secondary">
            {selection.kind === "year" ? "Selected year" : "Selected category"}
          </p>
          <p className="mt-1 text-xl font-[450] tracking-tight">{label}</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-7 items-center rounded-lg px-2 text-[10px] font-medium text-content-secondary transition-colors hover:bg-fill-strong hover:text-content-primary"
        >
          Clear
        </button>
      </div>

      <div className="mt-5 flex items-end gap-6 border-y border-line-default py-4">
        <div>
          <p className="font-[450] text-3xl tabular-nums">{filtered.length}</p>
          <p className="mt-1 font-mono text-[10px] text-content-secondary">
            {metricLabel(metric).toLowerCase()}
          </p>
        </div>
        <div className="ml-auto flex gap-4 text-right">
          <div>
            <p className="font-[450] text-lg tabular-nums">{wrong}</p>
            <p className="font-mono text-[10px] text-content-secondary">wrong</p>
          </div>
          <div>
            <p className="font-[450] text-lg tabular-nums">{right}</p>
            <p className="font-mono text-[10px] text-content-secondary">right</p>
          </div>
        </div>
      </div>

      <div className="mt-2 divide-y divide-line-default">
        {shown.length > 0 ? (
          shown.map((entry) => (
            <a
              key={entry.id}
              href={`${base}#c-${entry.id}`}
              className="group block py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-content-primary"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-sm font-medium tracking-tight">
                  {entry.project}
                </span>
                <span className="shrink-0 font-mono text-[10px] text-content-secondary">
                  {entry.year}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-content-secondary text-pretty">
                {entry.cardQuote}
              </p>
            </a>
          ))
        ) : (
          <p className="py-6 text-sm text-content-secondary">
            No receipts in this slice.
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <a
          href={`${base}#archive`}
          className="inline-flex items-center gap-1 text-xs font-medium text-content-secondary underline decoration-line-default underline-offset-4 transition-colors hover:text-content-primary hover:decoration-content-primary"
        >
          Open the archive
          <ArrowUpRightIcon className="size-3" />
        </a>
        {filtered.length > shown.length ? (
          <span className="font-mono text-[10px] text-content-secondary">
            +{filtered.length - shown.length} more
          </span>
        ) : null}
      </div>
    </aside>
  );
}

export function ChartsPage() {
  const { theme, toggle } = useTheme();
  const [metric, setMetric] = useState<Metric>("all");
  const [selected, setSelected] = useState<Selection>({
    kind: "year",
    value: defaultYear,
  });
  const active = selected;

  const select = (next: Selection) => {
    setSelected((current) => (isSameSelection(current, next) ? null : next));
  };

  return (
    <div className="min-h-dvh bg-page-default">
      <header className="sticky top-0 z-40 border-b border-line-default bg-page-default">
        <div className="container-7xl flex h-14 items-center justify-between gap-4">
          <a href={base} className="flex min-w-0 items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid size-6 shrink-0 place-items-center rounded-[5px] bg-fill-inverse font-mono text-[9px] font-medium tracking-[-0.03em] text-content-inverse"
            >
              TE
            </span>
            <span className="truncate text-[15px] font-medium tracking-tight">
              Too Early
            </span>
            <span className="hidden font-mono text-[10px] text-content-secondary sm:inline">
              / charts
            </span>
          </a>
          <nav aria-label="Primary" className="flex items-center gap-0.5">
            <a
              href={base}
              className="inline-flex h-8 items-center rounded-lg px-3 text-sm text-content-secondary transition-colors hover:bg-fill-strong hover:text-content-primary"
            >
              Archive
            </a>
            <a
              href={withBase("charts/")}
              aria-current="page"
              className="inline-flex h-8 items-center rounded-lg bg-fill-strong px-3 text-sm font-medium text-content-primary"
            >
              Charts
            </a>
            <a
              href={withBase("#method")}
              className="hidden h-8 items-center rounded-lg px-3 text-sm text-content-secondary transition-colors hover:bg-fill-strong hover:text-content-primary sm:inline-flex"
            >
              Method
            </a>
            <ThemeButton theme={theme} onToggle={toggle} />
          </nav>
        </div>
      </header>

      <main className="container-7xl pb-16 pt-12 sm:pt-16">
        <p className="font-mono text-[11px] text-content-secondary">
          The corpus, visualized
        </p>
        <h1 className="mt-4 max-w-[13ch] text-5xl font-[450] leading-[1.02] tracking-[-0.045em] text-balance sm:text-6xl">
          The shape of <span className="text-content-accent">hindsight.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-content-secondary text-pretty sm:text-lg">
          Every receipt in the archive, mapped by year and category. Click or
          tap a bar to inspect the calls inside it.
        </p>

        <dl className="mt-10 grid grid-cols-2 border-y border-line-default sm:grid-cols-4">
          {[
            ["receipts", totalCount],
            ["wrong calls", wrongCount],
            ["right calls", rightCount],
            ["right-call rate", `${hitRate}%`],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-col-reverse py-5 pr-5">
              <dt className="mt-1 font-mono text-[10px] text-content-secondary">
                {label}
              </dt>
              <dd className="font-[450] text-2xl tabular-nums tracking-tight">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 grid items-start gap-4 lg:grid-cols-[1.55fr_0.85fr]">
          <section className="rounded-xl bg-surface-default p-5 ring-1 ring-line-default sm:p-6">
            <div className="flex flex-col gap-4 border-b border-line-default pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[10px] text-content-secondary">
                  By year
                </p>
                <h2 className="mt-1 text-2xl font-[450] tracking-tight">
                  Receipts over time
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-content-secondary text-pretty">
                  The archive is not evenly distributed. Some years were simply
                  more confident than others.
                </p>
              </div>
              <div className="flex shrink-0 rounded-lg border border-line-default bg-fill-default p-0.5">
                {(["all", "miss", "hit"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={metric === value}
                    onClick={() => setMetric(value)}
                    className={cn(
                      "inline-flex h-7 items-center rounded-md px-2 text-[10px] font-medium transition-colors",
                      metric === value
                        ? "bg-fill-inverse text-content-inverse"
                        : "text-content-secondary hover:bg-fill-strong hover:text-content-primary",
                    )}
                  >
                    {value === "all" ? "All" : value === "miss" ? "Wrong" : "Right"}
                  </button>
                ))}
              </div>
            </div>

            <SelectionChart
              metric={metric}
              selected={selected}
              onSelect={select}
            />

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] text-content-secondary">
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" className="size-2 rounded-[2px] bg-fill-inverse" />
                wrong calls
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" className="size-2 rounded-[2px] bg-content-accent" />
                right calls
              </span>
              <span className="ml-auto">click a bar to inspect it</span>
            </div>
          </section>

          <Inspector selection={active} metric={metric} onClear={() => setSelected(null)} />
        </div>

        <div className="mt-4 grid items-start gap-4 lg:grid-cols-[1.55fr_0.85fr]">
          <section className="rounded-xl bg-surface-default p-5 ring-1 ring-line-default sm:p-6">
            <div className="border-b border-line-default pb-5">
              <p className="font-mono text-[10px] text-content-secondary">
                By category
              </p>
              <h2 className="mt-1 text-2xl font-[450] tracking-tight">
                Where the confidence lives
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-content-secondary text-pretty">
                Developer tools dominate the archive. Marketplaces are still
                catching up.
              </p>
            </div>
            <CategoryChart
              metric={metric}
              selected={selected}
              onSelect={select}
            />
          </section>

          <aside
            aria-label="How to read this chart"
            className="rounded-xl bg-ink p-5 text-ink-content ring-1 ring-line-default sm:p-6"
          >
            <p className="font-mono text-[10px] text-ink-content/60">
              How to read it
            </p>
            <p className="mt-3 text-xl font-[450] tracking-tight text-balance">
              A bar is not a verdict. It is a place to start.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-content/65 text-pretty">
              The chart counts comments, not companies. A single project can have
              several receipts. Click a year or category to inspect it, then
              open any quote as a full card in the archive.
            </p>
            <a
              href={`${base}#archive`}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-content underline decoration-ink-content/30 underline-offset-4 transition-colors hover:decoration-ink-content"
            >
              Back to the archive
              <ArrowUpRightIcon className="size-4" />
            </a>
          </aside>
        </div>
      </main>

      <footer className="border-t border-line-default">
        <div className="container-7xl flex flex-col gap-2 py-6 text-[10px] text-content-secondary sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono">
            {totalCount} receipts &middot; {wrongCount} wrong &middot; {rightCount} right
          </p>
          <a
            href={withBase("corpus.json")}
            download="too-early-corpus.json"
            className="inline-flex items-center gap-1 underline decoration-line-default underline-offset-4 transition-colors hover:text-content-primary hover:decoration-content-primary"
          >
            Download the corpus
            <ArrowUpRightIcon className="size-3" />
          </a>
        </div>
      </footer>
    </div>
  );
}
