---
version: alpha
name: Too Early
description: Editorial archive of Hacker News' most confident wrong calls.
colors:
  page-default: "#FFFFFF"
  surface-default: "#FFFFFF"
  surface-subtle: "#F5F5F5"
  fill-subtle: "#FAFAFA"
  fill-strong: "#F5F5F5"
  fill-inverse: "#151515"
  fill-accent: "#E5F0FF"
  content-primary: "#151515"
  content-secondary: "#6E6E6E"
  content-muted: "#A5A5A5"
  content-inverse: "#FFFFFF"
  content-accent: "#1F78FF"
  line-default: "#EDEDED"
typography:
  sans:
    fontFamily: Inter Variable
  mono:
    fontFamily: JetBrains Mono
  h1:
    className: type-h1
    fontSize: text-5xl
    fontWeight: 450
    lineHeight: leading-tight
    letterSpacing: tracking-tight
  h2:
    className: type-h2
    fontSize: text-3xl
    fontWeight: 450
    lineHeight: leading-tight
    letterSpacing: tracking-tight
  body:
    className: type-body-md
    fontSize: text-base
    fontWeight: 400
    lineHeight: leading-relaxed
  meta:
    className: type-code
    fontFamily: JetBrains Mono
    fontSize: text-xs
    fontWeight: 400
---

## Overview

Too Early is a quiet, editorial reading surface for a loud archive. It should feel like a well-made index card box, not a news site: generous white space, thin rules, compact metadata, and one strong quote per card.

## Themes

- Light is the default. Dark mode is a true low-light surface, not an inverted afterthought.
- Theme is applied through `data-theme` on `<html>`; an inline head script prevents the flash.
- The system preference is the default; the header toggle stores an explicit light/dark preference in local storage.
- Dark tokens: page `#0B0B0B`, surface `#111111`, subtle `#161616`, line `#262626`, primary content `#F5F5F5`, secondary `#A3A3A3`, accent `#8AB4FF`.
- The hero card and footer use a fixed ink surface (`#151515` / `#FFFFFF`) in both themes, so the editorial black endcap stays intentional.
- Use `color-scheme` so native controls follow the theme.

## Two-sided archive

- The archive holds two kinds of receipts: **wrong calls** (the product won) and **right calls** (the product failed).
- The collection switcher sits above the category filters: All receipts, Wrong calls, Right calls.
- Right-call cards carry a neutral inverted `Right call` badge; the card footer switches from “Reality check” to “What happened.”
- The dialog switches its note label from “Why it aged badly” to “Why the critic was right.”
- The hero keeps the canonical Dropbox miss, but exposes the right-call collection as a first-class action with its count.
- Counts are always visible in the hero, the collection tabs, the method section, and the footer.

## Colors

- Use `page-default` for the page and `surface-default` for cards and the dialog.
- Use `surface-subtle` and `fill-subtle` for section bands, inset outcome blocks, and hover states.
- Use `fill-inverse` / `content-inverse` for the canonical-miss card and the footer.
- Use `content-primary` for quotes and headings; `content-secondary` for metadata and supporting copy.
- Use `content-muted` only for decorative marks and dividers, never for required information.
- Use `content-accent` once per view as a punctuation mark: the dot in the eyebrow and the final word of the hero headline.

## Typography

- Inter Variable for interface copy and quotes.
- JetBrains Mono for dates, comment ids, labels, and the corpus register.
- Hero: 450 weight, tight tracking, generous line height.
- Card quotes: 18px, 1.375 line height; the quote is the primary visual object.
- Metadata is deliberately small but kept at accessible contrast.

## Layout

- `container-7xl` for the page; a 12-column hero grid that collapses to one column.
- Two-column archive from `md` upward; one column on phones.
- Cards use `mt-auto` footers so the "Read the receipt" affordance lines up at the bottom of each row.
- Filters wrap instead of scrolling horizontally; every control stays reachable at 320px.
- The dialog is a centered sheet on desktop and a near-full-width sheet on mobile, scrollable inside `100dvh`.

## Components

- Cards are anchors with `aria-haspopup="dialog"` and a whole-card hit area.
- The receipt dialog uses Base UI for focus management, Escape handling, and focus return.
- The outcome block is inset with `fill-subtle` and a thin ring; the verdict badge is neutral, not celebratory.
- Search is a single input with `/` focus; native selects handle era and sort.
- Buttons: primary inverse, secondary bordered, ghost for low-emphasis actions.

## Do's and don'ts

- Link every quote to its original HN comment.
- Keep the author note visible; this is not a dogpile.
- Do not use gradients, glow, purple, or decorative color.
- Do not animate layout properties; hover feedback is limited to color and small transforms.
- Respect reduced motion; every interaction remains usable with a keyboard.
- Never paraphrase a quote; ellipses mark elided text.
