import { cn } from "@/lib/utils";

const widths = ["w-16", "w-10", "w-14", "w-8", "w-20", "w-12"];

/**
 * A row of soft rounded placeholder blocks — the "nothing to see here"
 * motif for content that is never stored. A visual footnote, not a
 * censored-document effect.
 */
export function RedactedLine({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      aria-hidden="true"
    >
      {widths.map((w, i) => (
        <span
          key={i}
          className={cn("h-2.5 rounded-full bg-muted-foreground/25", w)}
        />
      ))}
    </span>
  );
}
