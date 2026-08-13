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
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-white/10 bg-[#111113]/70 py-3.5"
    >
      <div className="animate-marquee flex w-max items-center gap-8 font-mono text-xs tracking-[0.08em] uppercase">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex items-center gap-8">
            {items.map((label, i) => (
              <span key={label} className="flex items-center gap-8">
                <span
                  className={
                    i % 3 === 0 ? "font-semibold text-amber-300" : "text-white/50"
                  }
                >
                  {label}
                </span>
                <span className="text-white/25">/</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
