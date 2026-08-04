"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";

type ShareState = "prompt" | "sharing" | "shared" | "dismissed";

/**
 * The Share gate — rendered only at warning tier. An active prompt with a
 * reason, never a passively-available button. Publishes the structured case
 * file only; the raw content is never stored, let alone shared.
 */
export function SharePrompt({ reportId }: { reportId: string }) {
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
      <div className="border-t px-5 py-4 sm:px-6">
        <p className="flex items-center gap-2 text-sm">
          <Check className="size-4 text-confirmed-user" />
          Shared. This case file is now in the library — it may surface the next
          time someone checks a similar pattern.
        </p>
      </div>
    );
  }

  if (state === "dismissed") {
    return (
      <div className="border-t px-5 py-4 sm:px-6">
        <p className="text-sm text-muted-foreground">
          Kept private — nothing was published.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-tier-warning/30 bg-tier-warning/5 px-5 py-5 sm:px-6">
      <p className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
        Share this case?
      </p>
      <p className="mt-2 text-sm leading-relaxed">
        This matches known scam patterns. Sharing the structured case file
        helps others spot the same playbook sooner — that decision is yours,
        not ours.
      </p>
      <div className="mt-3 space-y-1 font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
        <p>Shared: category · techniques · tier · explanation</p>
        <p>
          Never shared:{" "}
          <span className="text-redacted" aria-hidden="true">
            ████ ███████ █████
          </span>{" "}
          raw content, names, numbers
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={share} disabled={state === "sharing"}>
          {state === "sharing" ? "Sharing…" : "Share anonymously"}
        </Button>
        <Button
          variant="ghost"
          onClick={() => setState("dismissed")}
          disabled={state === "sharing"}
        >
          Keep private
        </Button>
      </div>
    </div>
  );
}
