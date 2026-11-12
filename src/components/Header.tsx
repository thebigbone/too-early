import { withBase } from "../lib/base";
import { cn } from "../lib/cn";
import { ShuffleIcon } from "./Icons";
import { ThemeButton } from "./ThemeButton";

type HeaderProps = {
  onRandom: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

const navLinkClass =
  "inline-flex h-8 items-center rounded-lg px-3 text-sm text-content-secondary transition-colors hover:bg-fill-strong hover:text-content-primary";

export function Header({ onRandom, theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-line-default bg-page-default">
      <div className="container-7xl flex h-14 items-center justify-between gap-4">
        <a
          href="#top"
          className="flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-offset-4"
        >
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
            HN / 2007&ndash;2026
          </span>
        </a>

        <nav aria-label="Primary" className="flex items-center gap-0.5">
          <a href="#archive" className={navLinkClass}>
            Archive
          </a>
          <a
            href={withBase("charts/")}
            className={navLinkClass}
          >
            Charts
          </a>
          <a href="#method" className={cn(navLinkClass, "hidden sm:inline-flex")}>
            Method
          </a>
          <ThemeButton
            theme={theme}
            onToggle={onToggleTheme}
            className="w-8 justify-center px-0"
          />
          <button
            type="button"
            onClick={onRandom}
            className={cn(navLinkClass, "gap-1.5 pl-2.5")}
            aria-label="Open a random receipt"
            aria-haspopup="dialog"
          >
            <ShuffleIcon className="size-4" />
            <span className="hidden sm:inline">Random</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
