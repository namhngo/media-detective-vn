"use client";

import { motion } from "motion/react";

import { fadeUp } from "@/lib/motion";

/** Shared entrance wrapper — children render on the server, motion runs client-side. */
export function FadeUp({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} {...fadeUp}>
      {children}
    </motion.div>
  );
}
