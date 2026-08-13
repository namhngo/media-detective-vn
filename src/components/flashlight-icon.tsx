"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * A literal flashlight — body, hood, and lens — instead of an abstract spark.
 * The lens glow and halo track `progress` continuously, so the icon itself
 * communicates "the light is building" while the button is held.
 */
export function FlashlightIcon({
  progress,
  className,
}: {
  /** 0 (off) to 1 (fully held) — drives the glow every frame. */
  progress: MotionValue<number>;
  className?: string;
}) {
  const haloScale = useTransform(progress, [0, 1], [0.5, 1.8]);
  const haloOpacity = useTransform(progress, [0, 0.15, 1], [0, 0.3, 0.7]);
  const lensOpacity = useTransform(progress, [0, 1], [0.2, 1]);
  const bodyOpacity = useTransform(progress, [0, 1], [0.55, 1]);

  return (
    <svg viewBox="0 0 60 90" className={cn("size-7 overflow-visible", className)} aria-hidden>
      <motion.circle
        cx={30}
        cy={18}
        r={9}
        className="fill-amber-300"
        style={{
          scale: haloScale,
          opacity: haloOpacity,
          filter: "blur(5px)",
          transformOrigin: "30px 18px",
        }}
      />
      <motion.g style={{ opacity: bodyOpacity }} className="stroke-white/70" fill="none" strokeWidth={2}>
        <rect x={20} y={40} width={20} height={42} rx={4} />
        <line x1={20} y1={58} x2={40} y2={58} opacity={0.5} />
        <path d="M14 40 L46 40 L38 18 L22 18 Z" strokeLinejoin="round" />
      </motion.g>
      <motion.circle
        cx={30}
        cy={18}
        r={9}
        className="fill-amber-300 stroke-amber-300"
        strokeWidth={2}
        style={{ opacity: lensOpacity }}
      />
    </svg>
  );
}
