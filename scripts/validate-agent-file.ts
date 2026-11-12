import { readFileSync } from "node:fs";

type AgentEntry = {
  id: number;
  project: string;
  year: number;
  date: string;
  author: string;
  category: string;
  verdict: string;
  collection: "miss" | "hit";
  cardQuote: string;
  quote: string;
  storyTitle: string;
  hnUrl: string;
  outcome: string;
  outcomeDetail: string;
  note: string;
  sourceLabel: string;
  sourceUrl: string;
};

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

const categories = new Set([
  "AI",
  "Consumer",
  "Crypto & fintech",
  "Developer tools",
  "Infrastructure",
  "Marketplaces",
  "Productivity",
  "Social",
]);

const verdicts = new Set([
  "Clean miss",
  "Wrong on the outcome",
  "Right about the risk",
  "A little too early",
  "Right call",
]);

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

const isVerbatimExcerpt = (verifiedText: string, excerpt: string) => {
  const haystack = tokenize(verifiedText);
  const parts = excerpt
    .split(/\.{3,}|…/)
    .map((fragment) => tokenize(fragment))
    .filter((fragment) => fragment.length >= 3);
  if (parts.length === 0) return containsSequence(haystack, tokenize(excerpt));
  return parts.every((part) => containsSequence(haystack, part));
};

const formatDate = (seconds: number) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(seconds * 1000));

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getItem = async (id: number): Promise<HnItem> => {
  let lastError: unknown;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const response = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const item = (await response.json()) as HnItem | null;
      if (!item) throw new Error("not found");
      return item;
    } catch (error) {
      lastError = error;
      await sleep(400 * (attempt + 1));
    }
  }
  throw new Error(`HN item ${id}: ${lastError}`);
};

const path = process.argv[2];
if (!path) {
  console.error("Usage: npx tsx scripts/validate-agent-file.ts <file.json>");
  process.exit(2);
}

const raw = JSON.parse(readFileSync(path, "utf8")) as AgentEntry[] | { entries: AgentEntry[] };
const entries = Array.isArray(raw) ? raw : raw.entries;
if (!Array.isArray(entries)) {
  console.error("Expected a JSON array or { entries: [...] }");
  process.exit(2);
}

const errors: string[] = [];
const seen = new Set<number>();

for (const entry of entries) {
  const label = `#${entry.id} ${entry.project ?? "?"}`;
  for (const field of [
    "project",
    "date",
    "author",
    "category",
    "verdict",
    "collection",
    "cardQuote",
    "quote",
    "storyTitle",
    "hnUrl",
    "outcome",
    "outcomeDetail",
    "note",
    "sourceLabel",
    "sourceUrl",
  ] as const) {
    if (!entry[field]) errors.push(`${label}: missing ${field}`);
  }

  if (seen.has(entry.id)) errors.push(`${label}: duplicate id in file`);
  seen.add(entry.id);

  if (!categories.has(entry.category)) errors.push(`${label}: bad category "${entry.category}"`);
  if (!verdicts.has(entry.verdict)) errors.push(`${label}: bad verdict "${entry.verdict}"`);
  if (entry.collection !== "miss" && entry.collection !== "hit") {
    errors.push(`${label}: collection must be miss or hit`);
  }
  if (entry.hnUrl !== `https://news.ycombinator.com/item?id=${entry.id}`) {
    errors.push(`${label}: bad hnUrl`);
  }
  if (!entry.sourceUrl?.startsWith("https://")) errors.push(`${label}: sourceUrl must be https`);
  if (!entry.cardQuote || entry.cardQuote.length < 40) errors.push(`${label}: cardQuote too short`);
  if (!entry.quote || entry.quote.length < 80) errors.push(`${label}: quote too short`);

  try {
    const comment = await getItem(entry.id);
    if (comment.type !== "comment" || !comment.text || !comment.by || !comment.time) {
      errors.push(`${label}: not a comment with text/author/time`);
      continue;
    }
    if (comment.by !== entry.author) {
      errors.push(`${label}: author ${comment.by} != ${entry.author}`);
    }
    const date = formatDate(comment.time);
    if (date !== entry.date) errors.push(`${label}: date ${date} != ${entry.date}`);
    if (new Date(comment.time * 1000).getUTCFullYear() !== entry.year) {
      errors.push(`${label}: year mismatch`);
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
      errors.push(`${label}: parent story not found`);
    } else {
      if (story.title !== entry.storyTitle) {
        errors.push(`${label}: story "${story.title}" != "${entry.storyTitle}"`);
      }
    }

    const text = comment.text
      .replace(/<p>/g, "\n\n")
      .replace(/<\/p>/g, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&#x27;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#x2F;/g, "/")
      .replace(/\s+/g, " ")
      .trim();

    if (!isVerbatimExcerpt(text, entry.quote)) {
      errors.push(`${label}: full quote is not verbatim`);
    }
    if (!isVerbatimExcerpt(text, entry.cardQuote)) {
      errors.push(`${label}: cardQuote is not verbatim`);
    }
  } catch (error) {
    errors.push(`${label}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (errors.length > 0) {
  console.error(`FAILED: ${errors.length} issue(s) across ${entries.length} entries`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`OK: ${entries.length} entries verified against the HN API.`);
