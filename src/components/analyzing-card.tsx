"use client";

import { motion } from "motion/react";

/**
 * The shared "analysis in flight" card — a scan sweep passing over the card
 * while the model works. Motion communicates state, not decoration.
 */
export function AnalyzingCard({ label }: { label: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card px-5 py-8 shadow-sm sm:px-6">
      <motion.div
        aria-hidden
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
        animate={{ x: ["-120%", "320%"] }}
        transition={{ repeat: Infinity, duration: 1.7, ease: "easeInOut" }}
      />
      <div className="relative flex items-center gap-3">
        <span className="size-2 animate-pulse rounded-full bg-primary" />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <div className="relative mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full w-1/3 rounded-full bg-primary/60"
          animate={{ x: ["-30%", "220%"] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
