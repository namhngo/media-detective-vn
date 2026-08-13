"use client";

import { useState } from "react";
import { Check, Lock, Megaphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RedactedLine } from "@/components/redacted-line";
import { useI18n } from "@/components/i18n-provider";

type ShareState = "prompt" | "sharing" | "shared" | "dismissed";

/**
 * The Share gate — rendered only at warning tier. An active prompt with a
 * reason, never a passively-available button. Publishes the structured case
 * file only; the raw content is never stored, let alone shared.
 */
export function SharePrompt({ reportId }: { reportId: string }) {
  const { t } = useI18n();
  const [state, setState] = useState<ShareState>("prompt");

  async function share() {
    setState("sharing");
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reportId }),
      });
      if (!res.ok) throw new Error();
      setState("shared");
    } catch {
      setState("prompt");
    }
  }

  if (state === "shared") {
    return (
      <div className="border-t border-border/70 px-5 py-4 sm:px-6">
        <p className="flex items-center gap-2 text-sm">
          <Check className="size-4 text-confirmed-user" />
          {t("shareSuccess")}
        </p>
      </div>
    );
  }

  if (state === "dismissed") {
    return (
      <div className="border-t border-border/70 px-5 py-4 sm:px-6">
        <p className="text-sm text-muted-foreground">
          {t("sharePrivate")}
        </p>
      </div>
    );
  }

  return (
    <div className="m-5 mt-0 rounded-2xl bg-tier-warning/8 p-5 sm:m-6 sm:mt-0">
      <p className="flex items-center gap-2 text-sm font-medium">
        <Megaphone className="size-4 text-tier-warning" />
        {t("shareQuestion")}
      </p>
      <p className="mt-2 text-sm leading-relaxed">
        {t("shareBody")}
      </p>
      <div className="mt-3 flex flex-col gap-1.5 text-xs text-muted-foreground">
        <p>{t("shareFields")}</p>
        <p className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <Lock className="size-3 shrink-0" />
            {t("shareNever")}
          </span>
          <RedactedLine />
          <span>{t("shareRaw")}</span>
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={share} disabled={state === "sharing"} className="rounded-full">
          {state === "sharing" ? t("shareLoading") : t("shareAnonymous")}
        </Button>
        <Button
          variant="ghost"
          onClick={() => setState("dismissed")}
          disabled={state === "sharing"}
          className="rounded-full"
        >
          {t("shareKeepPrivate")}
        </Button>
      </div>
    </div>
  );
}
