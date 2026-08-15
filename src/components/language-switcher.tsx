"use client";

import { Languages } from "lucide-react";

import { useI18n } from "@/components/i18n-provider";
import { vietnameseEnabled, type Language } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();
  if (!vietnameseEnabled) return null;

  const next: Language = language === "en" ? "vi" : "en";

  return (
    <button
      type="button"
      onClick={() => setLanguage(next)}
      aria-label={`${t("language")}: ${next === "vi" ? t("vietnamese") : t("english")}`}
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[13px] font-medium text-white/65 transition-colors hover:bg-white/10 hover:text-white sm:px-3 sm:text-sm"
    >
      <Languages className="size-3.5" />
      {language === "en" ? "VI" : "EN"}
    </button>
  );
}
