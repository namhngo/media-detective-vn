import { cn } from "@/lib/utils";

/** The opening horizon for every product page. */
export function DarkBand({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[#0A0E1A] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[10%] size-96 rounded-full bg-amber-500/12 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-[6%] size-72 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(to bottom, transparent, black 34%, transparent 94%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 34%, transparent 94%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent"
      />
      <div
        className={cn(
          "relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16",
          className,
        )}
      >
        {children}
      </div>
    </section>
  );
}
