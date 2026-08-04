"use client";

import { motion } from "motion/react";

import { fadeUp } from "@/lib/motion";

/** The hero's one subtle motion cue — everything else on the page is static. */
export function HeroIntro({ children }: { children: React.ReactNode }) {
  return <motion.div {...fadeUp}>{children}</motion.div>;
}
