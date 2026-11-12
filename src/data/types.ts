export const categories = [
  "All",
  "AI",
  "Consumer",
  "Crypto & fintech",
  "Developer tools",
  "Infrastructure",
  "Marketplaces",
  "Productivity",
  "Social",
] as const;

export type Category = (typeof categories)[number];

export type Collection = "miss" | "hit";

export type Verdict =
  | "Clean miss"
  | "Wrong on the outcome"
  | "Right about the risk"
  | "A little too early"
  | "Right call";

export type Entry = {
  id: number;
  project: string;
  year: number;
  date: string;
  author: string;
  category: Exclude<Category, "All">;
  verdict: Verdict;
  collection?: Collection;
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

export const collectionOf = (entry: Entry): Collection =>
  entry.collection ?? "miss";
