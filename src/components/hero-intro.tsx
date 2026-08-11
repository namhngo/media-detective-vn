"use client";

import { motion } from "motion/react";

const container = {
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

/**
 * The hero's entrance: a short stagger, badge to buttons. The page's one
 * choreography moment — MotionConfig collapses it under reduced motion.
 */
export function HeroIntro({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial="hidden" animate="show" variants={container}>
      {children}
    </motion.div>
  );
}

export function HeroItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}
