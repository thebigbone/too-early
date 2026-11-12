import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import type { Entry } from "../src/data/types";

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

const agentsDir = new URL("../data/agents/", import.meta.url);
const files = readdirSync(agentsDir)
  .filter((file) => file.endsWith(".json") && file !== "broad-raw.json")
  .sort();

const coreSource = readFileSync(new URL("../src/data/entries.ts", import.meta.url), "utf8");
const coreIds = new Set(
  [...coreSource.matchAll(/^\s*id:\s*(\d+),/gm)].map((match) => Number(match[1])),
);

const excludedIds = new Set([
  45018163, // Character.AI — acquired/pivoted, not a clear failure
  26145173, // Clubhouse — faded, but did not clearly fail
  28798579, // FTX USDT take — superseded by a sharper, earlier FTX warning
]);

// pass2-worst-critic.json replaces milder sibling comments already present in
// the agent pool. Exclude the old picks so the archive only shows the sharpest
// version of each critique.
const supersededAgentIds = new Set([
  3231298, // WhatsApp — replaced by 3230753
  957926, // Node.js — replaced by 958870
  934289, // Go — replaced by 934401
  19127123, // SWC — replaced by 19126214
  15494354, // Zig — replaced by 15494222
  7835959, // Swift — replaced by 7864247
  43163319, // Claude Code — replaced by 43165259
  11784782, // Twilio — replaced by 11779729
  37249300, // Hugging Face — replaced by 37251447
  34492323, // Perplexity — replaced by 34492825
  2546207, // Mailgun — replaced by 2545814
  37891693, // Cursor — replaced by 37888706
  5117350, // Segment — replaced by 5117108
  27203095, // PlanetScale — replaced by 27198540
  12719936, // Caddy — replaced by 12723650
  29313315, // Remix — replaced by 29313453
  11707524, // The DAO — replaced by 11711094
  23324061, // Supabase — replaced by 23324936
]);
const merged: Entry[] = [];
const seen = new Set<number>(coreIds);
const errors: string[] = [];
const perFile: string[] = [];

for (const file of files) {
  const raw = JSON.parse(readFileSync(new URL(file, agentsDir), "utf8")) as
    | Entry[]
    | { entries: Entry[] };
  const entries = Array.isArray(raw) ? raw : raw.entries;
  if (!Array.isArray(entries)) {
    errors.push(`${file}: expected an array or { entries: [...] }`);
    continue;
  }

  let added = 0;
  for (const entry of entries) {
    const label = `${file} #${entry.id}`;
    if (!entry || typeof entry.id !== "number") {
      errors.push(`${label}: missing numeric id`);
      continue;
    }
    if (seen.has(entry.id)) {
      perFile.push(`${file}: skipped duplicate ${entry.id}`);
      continue;
    }
    if (excludedIds.has(entry.id)) {
      perFile.push(`${file}: excluded ${entry.id}`);
      continue;
    }
    if (supersededAgentIds.has(entry.id)) {
      perFile.push(`${file}: superseded ${entry.id}`);
      continue;
    }
    for (const field of [
      "project",
      "date",
      "author",
      "category",
      "verdict",
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
    if (!categories.has(entry.category)) {
      errors.push(`${label}: bad category ${entry.category}`);
    }
    if (!verdicts.has(entry.verdict)) {
      errors.push(`${label}: bad verdict ${entry.verdict}`);
    }
    const collection = entry.collection ?? "miss";
    if (collection !== "miss" && collection !== "hit") {
      errors.push(`${label}: bad collection ${entry.collection}`);
    }
    if (entry.hnUrl !== `https://news.ycombinator.com/item?id=${entry.id}`) {
      errors.push(`${label}: bad hnUrl`);
    }
    if (!entry.sourceUrl?.startsWith("https://")) {
      errors.push(`${label}: sourceUrl must be https`);
    }
    if (!entry.quote || entry.quote.length < 80) errors.push(`${label}: quote too short`);
    if (!entry.cardQuote || entry.cardQuote.length < 40) {
      errors.push(`${label}: cardQuote too short`);
    }

    seen.add(entry.id);
    merged.push({
      ...entry,
      category:
        file === "hardtech.json" || file.startsWith("pass2-hardtech")
          ? "Infrastructure"
          : entry.category,
      collection,
      verdict: collection === "hit" ? "Right call" : entry.verdict,
    });
    added += 1;
  }
  perFile.push(`${file}: ${added} entries`);
}

if (errors.length > 0) {
  console.error(`Agent merge failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

merged.sort(
  (a, b) =>
    a.year - b.year ||
    new Date(a.date).getTime() - new Date(b.date).getTime() ||
    a.id - b.id,
);

const output = `import type { Entry } from "./types";

// Generated by scripts/merge-agents.ts from data/agents/*.json.
// Do not edit by hand. Add or edit agent JSON and rebuild instead.
export const generatedEntries: Entry[] = ${JSON.stringify(merged, null, 2)};
`;

writeFileSync(new URL("../src/data/generated-entries.ts", import.meta.url), output);

const miss = merged.filter((entry) => (entry.collection ?? "miss") === "miss").length;
const hit = merged.length - miss;
console.log(`Merged ${merged.length} generated entries (${miss} wrong / ${hit} right).`);
for (const line of perFile) console.log(`- ${line}`);

const broadPath = new URL("../data/agents/broad-raw.json", import.meta.url);
if (existsSync(broadPath)) {
  const broad = JSON.parse(readFileSync(broadPath, "utf8")) as {
    count?: number;
    comments?: unknown[];
  };
  const comments = Array.isArray(broad.comments) ? broad.comments : [];
  writeFileSync(
    new URL("../public/corpus-raw.json", import.meta.url),
    `${JSON.stringify(
      {
        name: "Too Early — raw candidate corpus",
        description:
          "A broad, uncurated pool of negative Hacker News comments about products that later succeeded. Useful for further curation.",
        count: comments.length,
        comments,
      },
      null,
      2,
    )}\n`,
  );
  console.log(`Wrote public/corpus-raw.json (${comments.length} candidate comments).`);
}
