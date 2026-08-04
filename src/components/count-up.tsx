"use client";

import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "motion/react";

/**
 * Counts up to `value` once, on mount — used for real numbers that just
 * arrived (dashboard/home stats), not as decoration. Respects reduced motion.
 */
export function CountUp({
  value,
  duration = 1,
}: {
  value: number;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const controls = animate(0, value, {
      duration: reduce ? 0 : duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, duration, reduce]);

  return <>{display.toLocaleString("en-US")}</>;
}
