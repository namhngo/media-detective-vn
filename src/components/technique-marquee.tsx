import { techniqueLabels } from "@/lib/tier";

/**
 * A quiet vocabulary strip: the full manipulation taxonomy drifting past once.
 * One marquee on the page, slow enough to read, paused on hover.
 */
export function TechniqueMarquee() {
  const items = Object.values(techniqueLabels);

  return (
    <div
      aria-label="Manipulation techniques the AI looks for"
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-border/70 bg-card/50 py-3.5"
    >
      <div className="animate-marquee flex w-max items-center gap-10">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex items-center gap-10"
          >
            {items.map((label) => (
              <span
                key={label}
                className="flex items-center gap-10 text-sm font-medium text-muted-foreground"
              >
                {label}
                <span className="size-1.5 rounded-full bg-tier-caution/50" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
