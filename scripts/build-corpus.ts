import { readFileSync, writeFileSync } from "node:fs";
import { entries, categories } from "../src/data/entries";

type VerifiedComment = {
  id: number;
  author: string;
  date: string;
  year: number;
  text: string;
  storyId: number;
  storyTitle: string;
  storyUrl: string | null;
  hnUrl: string;
  storyHnUrl: string;
};

const verified = JSON.parse(
  readFileSync(new URL("../data/verified.json", import.meta.url), "utf8"),
) as VerifiedComment[];

const byId = new Map(verified.map((comment) => [comment.id, comment]));
const errors: string[] = [];

const tokenize = (value: string) =>
  value
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

const containsSequence = (haystack: string[], needle: string[]) => {
  if (needle.length === 0) return false;
  for (let start = 0; start <= haystack.length - needle.length; start += 1) {
    let match = true;
    for (let offset = 0; offset < needle.length; offset += 1) {
      if (haystack[start + offset] !== needle[offset]) {
        match = false;
        break;
      }
    }
    if (match) return true;
  }
  return false;
};

const fragments = (value: string) =>
  value
    .split(/\.{3,}|…/)
    .map((fragment) => tokenize(fragment))
    .filter((fragment) => fragment.length >= 3);

const isVerbatimExcerpt = (verifiedText: string, excerpt: string) => {
  const haystack = tokenize(verifiedText);
  const parts = fragments(excerpt);
  if (parts.length === 0) return containsSequence(haystack, tokenize(excerpt));
  return parts.every((part) => containsSequence(haystack, part));
};

const seen = new Set<number>();

for (const entry of entries) {
  if (seen.has(entry.id)) errors.push(`Duplicate comment id: ${entry.id}`);
  seen.add(entry.id);

  const comment = byId.get(entry.id);
  if (!comment) {
    errors.push(`Comment ${entry.id} is missing from data/verified.json`);
    continue;
  }

  if (comment.author !== entry.author) {
    errors.push(`Author mismatch for ${entry.id}: ${comment.author} != ${entry.author}`);
  }
  if (comment.date !== entry.date) {
    errors.push(`Date mismatch for ${entry.id}: ${comment.date} != ${entry.date}`);
  }
  if (comment.year !== entry.year) {
    errors.push(`Year mismatch for ${entry.id}: ${comment.year} != ${entry.year}`);
  }
  if (comment.storyTitle !== entry.storyTitle) {
    errors.push(`Story mismatch for ${entry.id}`);
  }
  if (entry.hnUrl !== `https://news.ycombinator.com/item?id=${entry.id}`) {
    errors.push(`HN URL mismatch for ${entry.id}: ${entry.hnUrl}`);
  }
  if (!isVerbatimExcerpt(comment.text, entry.quote)) {
    errors.push(`Full quote is not verbatim for ${entry.id}`);
  }
  if (!isVerbatimExcerpt(comment.text, entry.cardQuote)) {
    errors.push(`Card quote contains a non-verbatim fragment for ${entry.id}`);
  }
  if (!categories.includes(entry.category)) {
    errors.push(`Unknown category for ${entry.id}: ${entry.category}`);
  }
  if (!entry.sourceUrl.startsWith("https://")) {
    errors.push(`Source URL is not HTTPS for ${entry.id}`);
  }
}

if (errors.length > 0) {
  console.error(`Corpus validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const corpus = {
  name: "Too Early",
  description:
    "A curated corpus of Hacker News comments that confidently dismissed products which later succeeded.",
  source:
    "Hacker News. Comment text and metadata retrieved from the official Hacker News Firebase API. Each entry links to its comment permalink.",
  years: `${Math.min(...entries.map((entry) => entry.year))}-${Math.max(...entries.map((entry) => entry.year))}`,
  count: entries.length,
  categories: categories.filter((category) => category !== "All"),
  entries: entries
    .slice()
    .sort((a, b) => a.year - b.year || a.id - b.id)
    .map((entry) => {
      const comment = byId.get(entry.id)!;
      return {
        ...entry,
        verified: {
          author: comment.author,
          date: comment.date,
          storyId: comment.storyId,
          storyHnUrl: comment.storyHnUrl,
          storyUrl: comment.storyUrl,
          text: comment.text,
        },
      };
    }),
};

writeFileSync(
  new URL("../public/corpus.json", import.meta.url),
  `${JSON.stringify(corpus, null, 2)}\n`,
);

const years = new Map<number, number>();
for (const entry of entries) years.set(entry.year, (years.get(entry.year) ?? 0) + 1);
const yearSummary = [...years.entries()]
  .sort(([a], [b]) => a - b)
  .map(([year, count]) => `${year}:${count}`)
  .join(" ");

console.log(`Corpus valid: ${entries.length} entries, ${categories.length - 1} categories.`);
console.log(`Years: ${yearSummary}`);
console.log(`Wrote public/corpus.json (${(JSON.stringify(corpus).length / 1024).toFixed(0)} KB).`);
