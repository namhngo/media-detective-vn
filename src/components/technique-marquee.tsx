"use client";

import { useI18n } from "@/components/i18n-provider";
import { techniqueLabel } from "@/lib/tier";

/**
 * A quiet vocabulary strip: the full manipulation taxonomy drifting past once.
 * One marquee on the page, slow enough to read, paused on hover.
 */
export function TechniqueMarquee() {
  const { language, t } = useI18n();
  const items = [
    "urgency", "fear", "authority", "scarcity", "social_proof", "secrecy",
    "emotional_bait", "decontextualization", "fabricated_evidence", "bandwagon", "character_attack",
  ].map((key) => techniqueLabel(key, language));

  return (
    <div
      aria-label={t("scanAriaLabel")}
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-white/10 bg-[#0b1220]/70 py-3.5"
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
                className="flex items-center gap-10 text-sm font-medium text-white/55"
              >
                {label}
                <span className="size-1.5 rounded-full bg-amber-300/55" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
