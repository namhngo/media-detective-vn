"use client";

import { HeartHandshake } from "lucide-react";

import { useI18n } from "@/components/i18n-provider";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <HeartHandshake className="size-4 text-primary" />
          {t("footerTagline")}
        </p>
        <p className="text-xs text-muted-foreground">
          {t("footerPrivacy")}
        </p>
        <p className="text-xs text-muted-foreground">
          {t("footerEvent")}
        </p>
      </div>
    </footer>
  );
}
