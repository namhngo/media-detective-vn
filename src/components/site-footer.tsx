export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
          AI assists — you decide
        </p>
        <p className="text-xs text-muted-foreground">
          No result is ever 100% accurate. Raw content is never stored.
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
          UNESCO Youth Hackathon 2026 · AI &amp; MIL
        </p>
      </div>
    </footer>
  );
}
