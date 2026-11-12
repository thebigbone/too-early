import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Archive, type SortKey } from "./components/Archive";
import { useTheme } from "./lib/useTheme";
import { EntryDialog } from "./components/EntryDialog";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Method } from "./components/Method";
import {
  categories,
  collectionOf,
  decadeFilters,
  entries,
  type Category,
  type Collection,
  type Entry,
} from "./data/entries";

const PAGE_SIZE = 12;

type CollectionFilter = "all" | Collection;

const isCategory = (value: string | null): value is Category =>
  categories.includes(value as Category);

const isEra = (value: string | null) =>
  Boolean(value) && decadeFilters.some((item) => item.value === value);

const isSort = (value: string | null): value is SortKey =>
  value === "newest" || value === "oldest" || value === "az";

export default function App() {
  const initial = useMemo(() => new URLSearchParams(window.location.search), []);
  const [query, setQuery] = useState(() => initial.get("q") ?? "");
  const [category, setCategory] = useState<Category>(() => {
    const value = initial.get("category");
    return isCategory(value) ? value : "All";
  });
  const [era, setEra] = useState(() => {
    const value = initial.get("era");
    return isEra(value) ? value! : "all";
  });
  const [sort, setSort] = useState<SortKey>(() => {
    const value = initial.get("sort");
    return isSort(value) ? value : "newest";
  });
  const [collection, setCollection] = useState<CollectionFilter>(() => {
    const value = initial.get("collection");
    return value === "miss" || value === "hit" ? value : "all";
  });
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<Entry | null>(null);
  const { theme, toggle: toggleTheme } = useTheme();
  const searchRef = useRef<HTMLInputElement>(null);

  const openFromHash = useCallback(() => {
    const match = window.location.hash.match(/^#c-(\d+)$/);
    if (!match) return;
    const entry = entries.find((item) => item.id === Number(match[1]));
    if (entry) setSelected(entry);
  }, []);

  useEffect(() => {
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [openFromHash]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category !== "All") params.set("category", category);
    if (era !== "all") params.set("era", era);
    if (sort !== "newest") params.set("sort", sort);
    if (collection !== "all") params.set("collection", collection);

    const search = params.toString();
    const hash = selected ? `#c-${selected.id}` : "";
    const next = `${window.location.pathname}${search ? `?${search}` : ""}${hash}`;
    window.history.replaceState(null, "", next);
  }, [query, category, era, sort, collection, selected]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query, category, era, sort, collection]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (document.querySelector('[role="dialog"]')) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      event.preventDefault();
      searchRef.current?.focus();
      searchRef.current?.scrollIntoView({ block: "center" });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    const range =
      decadeFilters.find((item) => item.value === era) ?? decadeFilters[0];

    return entries
      .filter((entry) => {
        if (collection !== "all" && collectionOf(entry) !== collection) return false;
        if (category !== "All" && entry.category !== category) return false;
        if (entry.year < range.start || entry.year > range.end) return false;
        if (!value) return true;

        return [
          entry.project,
          entry.author,
          entry.quote,
          entry.cardQuote,
          entry.outcome,
          entry.outcomeDetail,
          entry.note,
          entry.storyTitle,
          entry.category,
          String(entry.year),
        ]
          .join(" ")
          .toLowerCase()
          .includes(value);
      })
      .sort((a, b) => {
        if (sort === "az") return a.project.localeCompare(b.project);
        if (sort === "oldest") return a.year - b.year || a.id - b.id;
        return b.year - a.year || b.id - a.id;
      });
  }, [query, category, era, sort, collection]);

  const hasFilters =
    query.trim() !== "" ||
    category !== "All" ||
    era !== "all" ||
    sort !== "newest" ||
    collection !== "all";

  const clearFilters = useCallback(() => {
    setQuery("");
    setCategory("All");
    setEra("all");
    setSort("newest");
    setCollection("all");
    setVisible(PAGE_SIZE);
  }, []);

  const openEntry = useCallback((entry: Entry) => {
    setSelected(entry);
  }, []);

  const randomEntry = useCallback(() => {
    const pool = filtered.length > 0 ? filtered : entries;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setSelected(pick);
  }, [filtered]);

  const missCount = useMemo(
    () => entries.filter((entry) => collectionOf(entry) === "miss").length,
    [],
  );
  const hitCount = entries.length - missCount;

  const showCollection = useCallback((next: CollectionFilter) => {
    setCollection(next);
    setVisible(PAGE_SIZE);
    requestAnimationFrame(() => {
      document.getElementById("archive")?.scrollIntoView();
    });
  }, []);

  const showRightCalls = useCallback(() => {
    showCollection("hit");
  }, [showCollection]);

  const featured = entries.find((entry) => entry.id === 9224) ?? entries[0];

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#archive"
        className="sr-only z-50 rounded-lg bg-fill-inverse px-4 py-2 text-sm text-content-inverse focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to the archive
      </a>

      <Header
        onRandom={randomEntry}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1">
        <Hero
          featured={featured}
          missCount={missCount}
          hitCount={hitCount}
          onOpenFeatured={() => openEntry(featured)}
          onBrowseAll={() => showCollection("all")}
          onShowRightCalls={showRightCalls}
        />
        <Archive
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
          era={era}
          onEraChange={setEra}
          sort={sort}
          onSortChange={setSort}
          collection={collection}
          onCollectionChange={setCollection}
          missCount={missCount}
          hitCount={hitCount}
          filtered={filtered}
          visible={visible}
          onShowMore={() => setVisible((value) => value + PAGE_SIZE)}
          onClear={clearFilters}
          onOpen={openEntry}
          searchRef={searchRef}
          hasFilters={hasFilters}
        />
        <Method hitCount={hitCount} onShowRightCalls={showRightCalls} />
      </main>

      <Footer />
      <EntryDialog entry={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
