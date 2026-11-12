import { Dialog } from "@base-ui/react/dialog";
import { useEffect, useState } from "react";
import type { Entry } from "../data/entries";
import { CheckIcon, CloseIcon, LinkIcon, ArrowUpRightIcon } from "./Icons";

type EntryDialogProps = {
  entry: Entry | null;
  onClose: () => void;
};

export function EntryDialog({ entry, onClose }: EntryDialogProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [entry?.id]);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  if (!entry) return null;

  const shareUrl = `${window.location.origin}${window.location.pathname}#c-${entry.id}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch {
      window.prompt("Copy this link", shareUrl);
    }
  };

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-fill-inverse/40" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-surface-default shadow-xl outline-none ring-1 ring-line-default">
          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line-default bg-surface-default px-5 py-4 sm:px-7">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-line-default bg-fill-subtle px-2 py-0.5 font-mono text-[10px] text-content-secondary">
                  {entry.verdict}
                </span>
                <span className="font-mono text-[10px] text-content-secondary">
                  {entry.category}
                </span>
              </div>
              <Dialog.Title className="mt-2 text-xl font-[450] tracking-tight text-balance sm:text-2xl">
                {entry.project}, {entry.year}
              </Dialog.Title>
              <Dialog.Description className="sr-only">
                A skeptical Hacker News comment about {entry.project} from{" "}
                {entry.date}, and what happened next.
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Close receipt"
              className="grid size-8 shrink-0 place-items-center rounded-lg text-content-secondary transition-colors hover:bg-fill-strong hover:text-content-primary"
            >
              <CloseIcon className="size-4" />
            </Dialog.Close>
          </div>

          <div className="px-5 pb-7 pt-6 sm:px-7">
            <blockquote className="whitespace-pre-line break-words text-[17px] leading-relaxed text-pretty text-content-primary">
              &ldquo;{entry.quote}&rdquo;
            </blockquote>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[10px] text-content-secondary">
              <span>{entry.author}</span>
              <span aria-hidden="true" className="hidden text-content-muted sm:inline">
                /
              </span>
              <span>{entry.date}</span>
              <span aria-hidden="true" className="hidden text-content-muted sm:inline">
                /
              </span>
              <a
                href={entry.hnUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 underline decoration-line-default underline-offset-4 transition-colors hover:text-content-primary hover:decoration-content-primary"
              >
                View on Hacker News
                <ArrowUpRightIcon className="size-3" />
              </a>
            </div>

            <div className="mt-7 rounded-xl bg-fill-subtle p-5 ring-1 ring-line-default sm:p-6">
              <p className="font-mono text-[10px] text-content-secondary">
                What happened
              </p>
              <p className="mt-2 text-base font-medium leading-snug tracking-tight text-balance">
                {entry.outcome}
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-content-secondary text-pretty">
                {entry.outcomeDetail}
              </p>
              <a
                href={entry.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-content-secondary underline decoration-line-default underline-offset-4 transition-colors hover:text-content-primary hover:decoration-content-primary"
              >
                {entry.sourceLabel}
                <ArrowUpRightIcon className="size-3" />
              </a>
            </div>

            <div className="mt-6">
              <p className="font-mono text-[10px] text-content-secondary">
                Why it aged badly
              </p>
              <p className="mt-2 text-sm leading-relaxed text-content-secondary text-pretty">
                {entry.note}
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-line-default pt-4">
              <p className="font-mono text-[10px] text-content-secondary">
                Comment #{entry.id} &middot; {entry.storyTitle}
              </p>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line-default bg-fill-default px-3 text-xs font-medium text-content-primary transition-colors hover:bg-fill-subtle"
              >
                {copied ? (
                  <>
                    <CheckIcon className="size-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <LinkIcon className="size-3.5" />
                    Copy link
                  </>
                )}
              </button>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
