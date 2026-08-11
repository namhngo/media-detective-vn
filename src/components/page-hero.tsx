import { AccentWord } from "@/components/accent-word";
import { FadeUp } from "@/components/fade-up";

/**
 * The shared page header for the app pages — eyebrow pill, display title with
 * one flourished accent word, lede, and a quiet ambient glow behind it.
 * Server component: icons render on the server, the entrance runs in FadeUp.
 */
export function PageHero({
  eyebrowIcon: Icon,
  eyebrow,
  title,
  accent,
  lede,
}: {
  eyebrowIcon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  /** A word that appears exactly once in `title`; rendered with the flourish. */
  accent?: string;
  lede: string;
}) {
  const parts = accent ? title.split(accent) : null;

  return (
    <div className="relative">
      <FadeUp>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-muted-foreground">
          <Icon className="size-3.5" />
          {eyebrow}
        </span>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          {parts ? (
            <>
              {parts[0]}
              <AccentWord>{accent}</AccentWord>
              {parts[1]}
            </>
          ) : (
            title
          )}
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          {lede}
        </p>
      </FadeUp>
    </div>
  );
}
