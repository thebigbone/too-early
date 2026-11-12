import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ArrowDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 4v16" />
      <path d="m6 14 6 6 6-6" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

export function ShuffleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4 7h2.5c4.5 0 6.5 10 11 10H20" />
      <path d="m17 14 3 3-3 3" />
      <path d="M4 17h2.5c1.4 0 2.6-.9 3.7-2.4" />
      <path d="M13.6 9.3C14.6 8 15.6 7 17.5 7H20" />
      <path d="m17 4 3 3-3 3" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

export function LinkIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M10 13.5a4 4 0 0 0 5.7.1l2-2a4 4 0 0 0-5.7-5.7l-1.1 1.1" />
      <path d="M14 10.5a4 4 0 0 0-5.7-.1l-2 2a4 4 0 0 0 5.7 5.7l1.1-1.1" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function QuoteMarkIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M9.4 5.5c-3 1.4-5 4-5 7.4 0 3.4 1.8 5.6 4.3 5.6 2.1 0 3.6-1.5 3.6-3.5 0-1.9-1.3-3.2-3.1-3.2-.3 0-.7 0-1 .1.3-1.7 1.6-3.1 3.4-4l-2.2-2.4Zm9 0c-3 1.4-5 4-5 7.4 0 3.4 1.8 5.6 4.3 5.6 2.1 0 3.6-1.5 3.6-3.5 0-1.9-1.3-3.2-3.1-3.2-.3 0-.7 0-1 .1.3-1.7 1.6-3.1 3.4-4l-2.2-2.4Z" />
    </svg>
  );
}
