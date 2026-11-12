import { ArrowUpRightIcon } from "./Icons";

const rules = [
  {
    number: "01",
    title: "Start with a real launch.",
    body: "We pull from launch threads and the first wave of coverage, from 2007 through 2026. No invented comments, no anonymous paraphrases.",
  },
  {
    number: "02",
    title: "Require a real outcome.",
    body: "Every product has a verifiable success marker: an IPO, an acquisition, durable scale, or category dominance. The link is in every entry. Outcomes are current as of 2026.",
  },
  {
    number: "03",
    title: "Quote, don't paraphrase.",
    body: "Quotes are verbatim. Typos, hedges, and strong language stay in. Authors are credited and linked to the original thread.",
  },
  {
    number: "04",
    title: "Leave room for nuance.",
    body: "Some critics were right about the risk and wrong about the outcome. The verdict badge says which. Hindsight is the bit, not the whole argument.",
  },
];

export function Method() {
  return (
    <section
      id="method"
      className="scroll-mt-16 border-y border-line-default bg-fill-subtle"
    >
      <div className="container-7xl py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="font-mono text-[11px] text-content-secondary">The method</p>
            <h2 className="mt-3 text-3xl font-[450] tracking-tight text-balance">
              Hindsight is a receipt, not a personality.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-content-secondary text-pretty">
              This is not a claim that Hacker News is dumb. HN is where a lot of
              these products were first seen, argued about, and pushed forward.
              That is the joke.
            </p>

            <div className="mt-8 rounded-xl border border-line-default bg-surface-default p-5">
              <p className="font-mono text-[10px] text-content-secondary">
                A note on the authors
              </p>
              <p className="mt-2 text-sm leading-relaxed text-content-secondary text-pretty">
                These are real people, not characters. Don&rsquo;t message someone
                about a comment they left in 2009. The archive is about the
                pattern, not the person.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <figure className="border-l-2 border-content-primary pl-5 sm:pl-6">
              <blockquote className="text-xl leading-snug tracking-tight text-balance sm:text-2xl">
                &ldquo;Airbnb is a good example of how the best startup ideas tend
                to seem crazy at first. When we first met the Airbnbs, we loved
                the founders, but we had a hard time believing this would be
                popular. In fact it is massively popular.&rdquo;
              </blockquote>
              <figcaption className="mt-4 font-mono text-[10px] text-content-secondary">
                pg &middot; Hacker News &middot; 2009 &middot;{" "}
                <a
                  href="https://news.ycombinator.com/item?id=722359"
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-content-extra-muted underline-offset-4 transition-colors hover:text-content-primary hover:decoration-content-primary"
                >
                  the thread
                </a>
              </figcaption>
            </figure>

            <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {rules.map((rule) => (
                <div key={rule.number} className="border-t border-line-default pt-4">
                  <p className="font-mono text-[10px] text-content-secondary">{rule.number}</p>
                  <h3 className="mt-2 text-base font-medium tracking-tight">
                    {rule.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-content-secondary text-pretty">
                    {rule.body}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-8 flex flex-wrap items-center gap-2 font-mono text-[10px] text-content-secondary">
              The full dataset is available as JSON.
              <a
                href={`${import.meta.env.BASE_URL}corpus.json`}
                download="too-early-corpus.json"
                className="inline-flex items-center gap-1 underline decoration-content-extra-muted underline-offset-4 transition-colors hover:text-content-primary hover:decoration-content-primary"
              >
                Download the corpus
                <ArrowUpRightIcon className="size-3" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
