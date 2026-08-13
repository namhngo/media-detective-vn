import { cn } from "@/lib/utils";

/**
 * A literal flashlight — body, hood, and lens — instead of an abstract
 * spark. Two states only (off/on), matching the click-to-reveal prototype:
 * plain conditional classes, no live motion values, nothing for SSR and
 * client hydration to disagree about.
 */
export function FlashlightIcon({ on, className }: { on: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 60 90" className={cn("size-7 overflow-visible", className)} aria-hidden>
      {on && (
        <circle
          cx={30}
          cy={18}
          r={13}
          className="fill-amber-300/50"
          style={{ filter: "blur(6px)" }}
        />
      )}
      <g
        className={cn("transition-colors duration-300", on ? "stroke-white" : "stroke-white/60")}
        fill="none"
        strokeWidth={2}
      >
        <rect x={20} y={40} width={20} height={42} rx={4} />
        <line x1={20} y1={58} x2={40} y2={58} opacity={0.5} />
        <path d="M14 40 L46 40 L38 18 L22 18 Z" strokeLinejoin="round" />
      </g>
      <circle
        cx={30}
        cy={18}
        r={9}
        strokeWidth={2}
        className={cn(
          "transition-all duration-300",
          on ? "fill-amber-300 stroke-amber-300" : "fill-none stroke-white/60",
        )}
        style={on ? { filter: "drop-shadow(0 0 10px rgba(247,201,72,0.9))" } : undefined}
      />
    </svg>
  );
}
