import { cn } from "@/lib/utils";

/** One emphasized word: italic brand blue with a hand-drawn underline stroke. */
export function AccentWord({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-block text-primary italic", className)}>
      {children}
      <svg
        aria-hidden
        viewBox="0 0 120 12"
        preserveAspectRatio="none"
        className="absolute -bottom-1 left-0 h-2.5 w-full text-primary/50"
      >
        <path
          d="M2 8 C 30 2, 60 11, 118 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
