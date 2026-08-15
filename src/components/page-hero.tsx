import { AccentWord } from "@/components/accent-word";
import { FadeUp } from "@/components/fade-up";
import { cn } from "@/lib/utils";

/**
 * The shared page header for the app pages — eyebrow pill, display title with
 * one flourished accent word, and lede. `dark` renders it for the torch theme's
 * darkness band: white type, amber accent.
 */
export function PageHero({
  eyebrowIcon: Icon,
  eyebrow,
  title,
  accent,
  lede,
  dark = false,
  compact = false,
}: {
  eyebrowIcon?: React.ComponentType<{ className?: string }>;
  eyebrow?: string;
  title?: string;
  /** A word that appears exactly once in `title`; rendered with the flourish. */
  accent?: string;
  lede?: string;
  dark?: boolean;
  compact?: boolean;
}) {
  const parts = accent && title ? title.split(accent) : null;

  return (
    <div className="relative">
      <FadeUp>
        {eyebrow && (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
              dark ? "bg-white/10 text-white/75" : "bg-secondary text-muted-foreground",
            )}
          >
            {Icon && <Icon className="size-3.5" />}
            {eyebrow}
          </span>
        )}
        {title && (
          <h1
            className={cn(
              "mt-4 max-w-2xl font-semibold tracking-tight",
              compact ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl",
              dark && "text-white",
            )}
          >
            {parts ? (
              <>
                {parts[0]}
                <AccentWord className={dark ? "text-amber-300" : undefined}>
                  {accent}
                </AccentWord>
                {parts[1]}
              </>
            ) : (
              title
            )}
          </h1>
        )}
        {lede && (
          <p
            className={cn(
              "mt-3 max-w-2xl leading-relaxed",
              dark ? "text-white/70" : "text-muted-foreground",
            )}
          >
            {lede}
          </p>
        )}
      </FadeUp>
    </div>
  );
}
