/**
 * The app-page backdrop: a fine graph-paper grid fading down the page plus a
 * colorless light lift at the top. Deliberately hue-free — workspaces read as
 * paper and structure, never as a tinted marketing surface.
 */
export function WorkspaceBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute inset-x-0 top-0 h-[34rem]"
        style={{
          backgroundImage:
            "radial-gradient(62rem 26rem at 50% -12%, color-mix(in oklch, var(--card) 85%, transparent), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in oklch, var(--foreground) 4%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklch, var(--foreground) 4%, transparent) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage: "linear-gradient(to bottom, black, transparent 72%)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 72%)",
        }}
      />
    </div>
  );
}
