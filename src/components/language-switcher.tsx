"use client";

import { Languages } from "lucide-react";

import { useI18n } from "@/components/i18n-provider";
import type { Language } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();
  const next: Language = language === "en" ? "vi" : "en";

  return (
    <button
      type="button"
      onClick={() => setLanguage(next)}
      aria-label={`${t("language")}: ${next === "vi" ? t("vietnamese") : t("english")}`}
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:px-3 sm:text-sm"
    >
      <Languages className="size-3.5" />
      {language === "en" ? "VI" : "EN"}
    </button>
  );
}
