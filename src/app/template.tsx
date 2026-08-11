"use client";

import { motion } from "motion/react";

/**
 * Route-change transition. template.tsx re-mounts on every navigation, so each
 * page gets one quiet entrance — the same shared fade as the rest of the app.
 * MotionConfig (reducedMotion="user") collapses this automatically.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
