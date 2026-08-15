"use client";

import { Flashlight, Sparkles, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";
import type {
  ActivityResponse,
  LightRevealResponse,
  MilFactPublic,
} from "@/lib/schema";

/**
 * The flashlight prize box. Completed checks and reports widen the beam; a full
 * cone can be spent to reveal one previously unseen reviewed MIL fact.
 */
export function LightBox({ light: initialLight }: { light: ActivityResponse["light"] }) {
  const { t } = useI18n();
  const [light, setLight] = useState(initialLight);
  const [fact, setFact] = useState<MilFactPublic | null>(null);
  const [opening, setOpening] = useState(false);
  const [flash, setFlash] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prizeOpened = useRef(false);

  useEffect(
    () => () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();

    async function refreshLight() {
      try {
        const response = await fetch("/api/activity", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok || controller.signal.aborted) return;
        const activity: ActivityResponse = await response.json();
        if (!prizeOpened.current) setLight(activity.light);
      } catch {
        // The server-rendered balance remains usable if a refresh is interrupted.
      }
    }

    void refreshLight();
    return () => controller.abort();
  }, []);

  const cost = light.revealCost;
  const ratio = Math.min(light.stars, cost) / cost;
  // 10% -> 50% half-width, matching the flashlight reference behaviour.
  const halfWidth = 10 + ratio * 40;
  const canOpen = light.stars >= cost && !opening;

  async function openPrize() {
    prizeOpened.current = true;
    setOpening(true);
    setError(null);
    try {
      const response = await fetch("/api/dashboard/light/reveal", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Light reveal failed");
      const result: LightRevealResponse = await response.json();
      setLight((current) => ({
        ...current,
        stars: result.stars,
        factsRevealed: result.factsRevealed,
      }));

      if (result.ok && result.fact) {
        setFact(result.fact);
        setFlash(true);
        if (flashTimer.current) clearTimeout(flashTimer.current);
        flashTimer.current = setTimeout(() => setFlash(false), 450);
      } else if (result.reason === "insufficient_stars") {
        setError(t("lightNoStars"));
      } else {
        setError(t("lightNoFacts"));
      }
    } catch {
      setError(t("lightError"));
    } finally {
      setOpening(false);
    }
  }

  return (
    <section className="torch-panel relative overflow-hidden rounded-2xl p-5 sm:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative flex justify-end">
        <p className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 font-mono text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Star className="size-3 text-primary" />
            <b className="font-medium text-foreground">{light.stars}</b>
            {t("lightStarsAvailable")}
          </span>
          <span>
            <b className="font-medium text-foreground">{light.earned}</b>{" "}
            {t("lightStarsEarned")}
          </span>
          <span>
            <b className="font-medium text-foreground">{light.factsRevealed}</b>{" "}
            {t("lightFactsRevealed")}
          </span>
        </p>
      </div>

      <div className="relative mt-3 grid items-center gap-5 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
        <div className="relative h-56 overflow-hidden rounded-xl border border-border bg-[#0c1120] md:h-64">
          <div
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 transition-[clip-path,opacity] duration-500 ease-out"
            style={{
              clipPath: `polygon(50% 100%, ${50 - halfWidth}% 0%, ${50 + halfWidth}% 0%)`,
              background:
                "linear-gradient(0deg, rgba(247,201,72,.55), rgba(247,201,72,0) 85%)",
              opacity: 0.3 + ratio * 0.6,
            }}
          />
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 transition-opacity duration-300",
              flash ? "opacity-100" : "opacity-0",
            )}
            style={{
              background:
                "radial-gradient(ellipse at 50% 100%, rgba(255,238,180,.9), transparent 70%)",
            }}
          />
          <button
            type="button"
            onClick={openPrize}
            disabled={!canOpen}
            className={cn(
              "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-all duration-500",
              canOpen
                ? "border-primary bg-primary text-primary-foreground shadow-[0_0_28px_rgba(247,201,72,0.6)] hover:opacity-90"
                : "cursor-not-allowed border-white/20 bg-card/70 text-white/65",
            )}
          >
            {canOpen ? <Sparkles className="size-4" /> : <Flashlight className="size-4" />}
            {opening ? t("lightOpening") : t("lightOpen")}
          </button>
          <p className="absolute bottom-2.5 left-3 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
            {t("lightPrizeCost")}
          </p>
        </div>

        <div>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

          {fact && (
            <article className="mt-4 rounded-xl border border-primary/25 border-l-2 border-l-primary bg-primary/[0.08] p-4">
              <p className="torch-overline">{t("lightFactTag")}</p>
              <p className="mt-2 text-sm leading-relaxed">{fact.fact}</p>
              <p className="mt-2.5 font-mono text-[11px] text-muted-foreground">
                {t("learnSource")}: {fact.source}
              </p>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
