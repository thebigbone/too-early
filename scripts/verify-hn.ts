import { readFileSync, writeFileSync } from "node:fs";
import { entries } from "../src/data/entries";

type HnItem = {
  id: number;
  type?: string;
  by?: string;
  time?: number;
  text?: string;
  parent?: number;
  title?: string;
  url?: string;
};

const strip = (value: string) => {
  let text = value.replace(/<p>/g, "\n\n").replace(/<\/p>/g, "");
  text = text.replace(/<pre><code>/g, "\n```\n").replace(/<\/code><\/pre>/g, "\n```\n");
  text = text.replace(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g, "$2 ($1)");
  text = text.replace(/<[^>]+>/g, "");
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x2F;/g, "/")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const getItem = async (id: number): Promise<HnItem> => {
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
  if (!response.ok) throw new Error(`HN API ${response.status} for ${id}`);
  const item = (await response.json()) as HnItem | null;
  if (!item) throw new Error(`HN item ${id} not found`);
  return item;
};

const formatDate = (seconds: number) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(seconds * 1000));

const tokenize = (value: string) =>
  value
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

const containsSequence = (haystack: string[], needle: string[]) => {
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

const isVerbatimExcerpt = (verifiedText: string, excerpt: string) => {
  const haystack = tokenize(verifiedText);
  const parts = excerpt
    .split(/\.{3,}|…/)
    .map((fragment) => tokenize(fragment))
    .filter((fragment) => fragment.length >= 3);
  if (parts.length === 0) return containsSequence(haystack, tokenize(excerpt));
  return parts.every((part) => containsSequence(haystack, part));
};

const verified = [];
const failures: string[] = [];

for (const entry of entries) {
  try {
    const comment = await getItem(entry.id);
    if (comment.type !== "comment" || !comment.text || !comment.by || !comment.time) {
      failures.push(`#${entry.id}: not a comment with text/author/time`);
      continue;
    }

    let parentId = comment.parent;
    let story: HnItem | null = null;
    for (let depth = 0; depth < 10 && parentId; depth += 1) {
      const parent = await getItem(parentId);
      if (parent.type === "story") {
        story = parent;
        break;
      }
      parentId = parent.parent;
    }
    if (!story) {
      failures.push(`#${entry.id}: could not find the parent story`);
      continue;
    }

    const text = strip(comment.text);
    const date = formatDate(comment.time);

    if (comment.by !== entry.author) failures.push(`#${entry.id}: author mismatch`);
    if (date !== entry.date) failures.push(`#${entry.id}: date ${date} != ${entry.date}`);
    if (story.title !== entry.storyTitle) {
      failures.push(`#${entry.id}: story "${story.title}" != "${entry.storyTitle}"`);
    }
    if (!isVerbatimExcerpt(text, entry.quote)) {
      failures.push(`#${entry.id}: full quote is not verbatim`);
    }
    if (!isVerbatimExcerpt(text, entry.cardQuote)) {
      failures.push(`#${entry.id}: card quote is not verbatim`);
    }

    verified.push({
      id: entry.id,
      author: comment.by,
      time: comment.time,
      date,
      year: new Date(comment.time * 1000).getUTCFullYear(),
      raw: comment.text,
      text,
      storyId: story.id,
      storyTitle: story.title,
      storyUrl: story.url ?? null,
      hnUrl: `https://news.ycombinator.com/item?id=${entry.id}`,
      storyHnUrl: `https://news.ycombinator.com/item?id=${story.id}`,
    });
  } catch (error) {
    failures.push(`#${entry.id}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (failures.length > 0) {
  console.error(`HN verification failed with ${failures.length} problem(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

verified.sort((a, b) => a.time - b.time);
writeFileSync(
  new URL("../data/verified.json", import.meta.url),
  `${JSON.stringify(verified, null, 2)}\n`,
);

console.log(`Verified ${verified.length}/${entries.length} comments against the Hacker News API.`);
console.log("Wrote data/verified.json.");
