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
    <section className="relative border-t border-white/[0.06] bg-[#0b0b0c] text-white">
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
