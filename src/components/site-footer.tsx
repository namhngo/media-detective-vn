import { HeartHandshake } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <HeartHandshake className="size-4 text-primary" />
          AI assists — you decide
        </p>
        <p className="text-xs text-muted-foreground">
          No result is ever 100% accurate. Nothing you paste here is stored.
        </p>
        <p className="text-xs text-muted-foreground">
          UNESCO Youth Hackathon 2026 · AI &amp; MIL
        </p>
      </div>
    </footer>
  );
}
