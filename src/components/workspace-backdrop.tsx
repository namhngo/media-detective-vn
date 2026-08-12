/** The persistent night field behind product workspaces. */
export function WorkspaceBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-background"
      />
      <div
        className="absolute -top-72 right-[-14rem] size-[58rem] rounded-full bg-amber-300/10 blur-3xl"
      />
      <div
        className="absolute left-[-20rem] top-[24rem] size-[48rem] rounded-full bg-sky-500/10 blur-3xl"
      />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in oklch, white 5%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklch, white 5%, transparent) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "linear-gradient(to bottom, black, transparent 76%)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 76%)",
        }}
      />
      <div
        className="absolute left-[68%] top-[-18rem] h-[52rem] w-[20rem] -rotate-[18deg] bg-gradient-to-b from-amber-200/10 via-amber-200/[0.03] to-transparent blur-2xl"
        style={{
          transformOrigin: "top center",
        }}
      />
    </div>
  );
}
