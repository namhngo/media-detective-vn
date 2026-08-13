"use client";

import { HeartHandshake } from "lucide-react";

import { useI18n } from "@/components/i18n-provider";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-white/10 bg-[#0b0b0c] text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="flex items-center gap-2 text-sm font-medium text-white/70">
          <HeartHandshake className="size-4 text-amber-300" />
          {t("footerTagline")}
        </p>
        <p className="text-xs text-white/50">
          {t("footerPrivacy")}
        </p>
        <p className="text-xs text-white/50">
          {t("footerEvent")}
        </p>
      </div>
    </footer>
  );
}
