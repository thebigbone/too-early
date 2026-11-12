import type { RefObject } from "react";
import {
  categories,
  decadeFilters,
  type Category,
  type Collection,
  type Entry,
} from "../data/entries";
import { cn } from "../lib/cn";
import { ChevronDownIcon, SearchIcon } from "./Icons";
import { EntryCard } from "./EntryCard";

export type SortKey = "newest" | "oldest" | "az";
export type CollectionFilter = "all" | Collection;

type ArchiveProps = {
  query: string;
  onQueryChange: (value: string) => void;
  category: Category;
  onCategoryChange: (value: Category) => void;
  era: string;
  onEraChange: (value: string) => void;
  sort: SortKey;
  onSortChange: (value: SortKey) => void;
  collection: CollectionFilter;
  onCollectionChange: (value: CollectionFilter) => void;
  missCount: number;
  hitCount: number;
  filtered: Entry[];
  visible: number;
  onShowMore: () => void;
  onClear: () => void;
  onOpen: (entry: Entry) => void;
  searchRef: RefObject<HTMLInputElement | null>;
  hasFilters: boolean;
};

const selectClass =
  "h-9 w-full appearance-none rounded-lg border border-line-default bg-fill-default pl-3 pr-8 text-xs font-medium text-content-primary outline-none transition-colors hover:bg-fill-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-content-primary sm:w-auto";

export function Archive({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  era,
  onEraChange,
  sort,
  onSortChange,
  collection,
  onCollectionChange,
  missCount,
  hitCount,
  filtered,
  visible,
  onShowMore,
  onClear,
  onOpen,
  searchRef,
  hasFilters,
}: ArchiveProps) {
  const shown = filtered.slice(0, visible);
  const remaining = filtered.length - shown.length;

  return (
    <section id="archive" className="container-7xl scroll-mt-16 py-14 sm:py-20">
      <div className="max-w-2xl">
        <p className="font-mono text-[11px] text-content-secondary">The archive</p>
        <h2 className="mt-3 text-3xl font-[450] tracking-tight text-balance sm:text-4xl">
          Pick a receipt.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-content-secondary text-pretty">
          Search by company, author, or the exact words that aged badly&mdash;or
          well. Every entry links back to the original Hacker News thread.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <div className="relative">
          <label htmlFor="archive-search" className="sr-only">
            Search receipts
          </label>
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-content-muted" />
          <input
            ref={searchRef}
            id="archive-search"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search a company, author, or quote..."
            autoComplete="off"
            className="h-11 w-full rounded-xl border border-line-default bg-fill-subtle pl-10 pr-12 text-sm text-content-primary outline-none transition-colors placeholder:text-content-secondary hover:bg-fill-default focus:border-content-primary focus:bg-surface-default"
          />
          <kbd
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-line-default bg-fill-default px-1.5 py-0.5 font-mono text-[10px] text-content-muted sm:block"
          >
            /
          </kbd>
        </div>

        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-line-default bg-fill-default p-1">
          {(
            [
              { value: "all", label: "All receipts", count: missCount + hitCount },
              { value: "miss", label: "Wrong calls", count: missCount },
              { value: "hit", label: "Right calls", count: hitCount },
            ] as const
          ).map((item) => {
            const active = collection === item.value;
            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={active}
                onClick={() => onCollectionChange(item.value)}
                className={cn(
                  "inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-fill-inverse text-content-inverse"
                    : "text-content-secondary hover:bg-fill-strong hover:text-content-primary",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "font-mono text-[10px] tabular-nums",
                    active ? "opacity-60" : "text-content-secondary",
                  )}
                >
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((item) => {
            const active = category === item;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => onCategoryChange(item)}
                className={cn(
                  "inline-flex h-8 items-center rounded-lg px-3 text-xs font-medium transition-colors",
                  active
                    ? "bg-fill-inverse text-content-inverse"
                    : "border border-line-default bg-fill-default text-content-secondary hover:bg-fill-subtle hover:text-content-primary",
                )}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <label htmlFor="era-filter" className="sr-only">
                Filter by era
              </label>
              <select
                id="era-filter"
                value={era}
                onChange={(event) => onEraChange(event.target.value)}
                className={selectClass}
              >
                {decadeFilters.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-content-muted" />
            </div>

            <div className="relative">
              <label htmlFor="sort-order" className="sr-only">
                Sort receipts
              </label>
              <select
                id="sort-order"
                value={sort}
                onChange={(event) => onSortChange(event.target.value as SortKey)}
                className={selectClass}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="az">Project A&ndash;Z</option>
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-content-muted" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <p
              aria-live="polite"
              className="font-mono text-[10px] text-content-secondary"
            >
              Showing {shown.length} of {filtered.length}
            </p>
            {hasFilters ? (
              <button
                type="button"
                onClick={onClear}
                className="inline-flex h-7 items-center rounded-lg px-2 text-xs font-medium text-content-secondary transition-colors hover:bg-fill-strong hover:text-content-primary"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {shown.length > 0 ? (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {shown.map((entry, index) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                index={index}
                onOpen={onOpen}
              />
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            {remaining > 0 ? (
              <button
                type="button"
                onClick={onShowMore}
                className="inline-flex h-10 items-center rounded-xl border border-line-default bg-fill-default px-5 text-sm font-medium text-content-primary transition-colors hover:bg-fill-subtle"
              >
                Show {Math.min(12, remaining)} more
              </button>
            ) : (
              <p className="font-mono text-[10px] text-content-secondary">
                That&rsquo;s all {filtered.length}. The future is undefeated.
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="mt-8 rounded-xl border border-line-default bg-fill-subtle px-6 py-16 text-center">
          <p className="text-lg font-medium tracking-tight">
            {collection === "hit"
              ? "No right calls match that."
              : collection === "miss"
                ? "No wrong calls match that."
                : "No receipts match that."}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-content-secondary text-pretty">
            Try a different company, a shorter search, or clear the filters. The
            archive only contains real comments, so some searches come up empty.
          </p>
          <button
            type="button"
            onClick={onClear}
            className="mt-5 inline-flex h-9 items-center rounded-lg bg-fill-inverse px-4 text-sm font-medium text-content-inverse transition-colors hover:bg-fill-inverse/90"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
