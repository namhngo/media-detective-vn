"use client";

import { MotionConfig } from "motion/react";

/** Respects prefers-reduced-motion globally — the quality-floor requirement, handled once. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
