import type { Entry } from "../data/entries";
import { ArrowUpRightIcon } from "./Icons";

type EntryCardProps = {
  entry: Entry;
  index: number;
  onOpen: (entry: Entry) => void;
};

export function EntryCard({ entry, index, onOpen }: EntryCardProps) {
  return (
    <a
      href={`#c-${entry.id}`}
      onClick={(event) => {
        event.preventDefault();
        onOpen(entry);
      }}
      aria-haspopup="dialog"
      className="group flex h-full flex-col rounded-xl bg-surface-default p-5 ring-1 ring-line-default transition-colors hover:bg-fill-subtle focus-visible:outline-offset-4 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-medium tracking-tight">{entry.project}</h3>
          <p className="mt-0.5 font-mono text-[10px] text-content-secondary">
            {entry.date}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-line-default px-2 py-0.5 font-mono text-[10px] text-content-secondary">
          {entry.category}
        </span>
      </div>

      <blockquote className="mt-5 text-lg leading-snug text-pretty text-content-primary">
        <span aria-hidden="true" className="text-content-muted">
          &ldquo;
        </span>
        {entry.cardQuote}
        <span aria-hidden="true" className="text-content-muted">
          &rdquo;
        </span>
      </blockquote>

      <p className="mt-4 font-mono text-[10px] text-content-secondary">
        {entry.author} &middot; comment #{entry.id}
      </p>

      <div className="mt-auto border-t border-line-default pt-4">
        <p className="font-mono text-[10px] text-content-secondary">Reality check</p>
        <p className="mt-1 text-sm leading-snug text-content-primary">{entry.outcome}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-content-secondary transition-colors group-hover:text-content-primary">
          Read the receipt
          <ArrowUpRightIcon className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
      <span className="sr-only">Open receipt {index + 1}</span>
    </a>
  );
}
