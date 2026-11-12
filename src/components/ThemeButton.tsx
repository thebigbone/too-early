import { cn } from "../lib/cn";
import { MoonIcon, SunIcon } from "./Icons";

type ThemeButtonProps = {
  theme: "light" | "dark";
  onToggle: () => void;
  className?: string;
};

export function ThemeButton({ theme, onToggle, className }: ThemeButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-lg text-content-secondary transition-colors hover:bg-fill-strong hover:text-content-primary",
        className,
      )}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <SunIcon className="size-4" />
      ) : (
        <MoonIcon className="size-4" />
      )}
    </button>
  );
}
