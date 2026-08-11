"use client";

import { useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type AnimationPlaybackControls,
} from "motion/react";
import { ScanSearch } from "lucide-react";

import { techniqueLabels } from "@/lib/tier";
import type { Technique } from "@/lib/schema";
import { cn } from "@/lib/utils";

/**
 * The landing-page centerpiece: a field of everyday posts. Holding the center
 * button "scans" the field and reveals the manipulation techniques hidden in
 * each post — clean posts surface a "No clear flags" note. Patterns only, no
 * real names or events (see AGENTS.md sensitive-content rule).
 */
type FieldPost = {
  kind: string;
  text: string;
  flags: Technique[];
  /** Position as % of the field, plus depth for the 3D parallax layer. */
  x: number;
  y: number;
  z: number;
  rotate: number;
  width: string;
  mobileHidden?: boolean;
};

const POSTS: FieldPost[] = [
  {
    kind: "Flood photo",
    text: "Shared as if it happened today.",
    flags: ["decontextualization", "emotional_bait"],
    x: 3, y: 10, z: -120, rotate: -3, width: "w-44",
    mobileHidden: true,
  },
  {
    kind: "Investment group",
    text: "“Easy job, high pay” — the group asks for a deposit first.",
    flags: ["social_proof", "scarcity"],
    x: 36, y: 6, z: 40, rotate: 2, width: "w-52",
  },
  {
    kind: "Official weather notice",
    text: "Tidal surge expected this weekend — national forecast center.",
    flags: [],
    x: 72, y: 3, z: -60, rotate: 1.5, width: "w-48",
  },
  {
    kind: "Fake document",
    text: "Screenshot of an “official announcement” with no source link.",
    flags: ["fabricated_evidence", "authority"],
    x: 22, y: 28, z: 0, rotate: -1.5, width: "w-52",
  },
  {
    kind: "Prize call",
    text: "You won a free holiday — attend our hotel event today to claim it.",
    flags: ["scarcity", "urgency"],
    x: 4, y: 46, z: 60, rotate: 2.5, width: "w-56",
  },
  {
    kind: "Deepfake video call",
    text: "A familiar face on video asking for money right now.",
    flags: ["authority", "secrecy"],
    x: 64, y: 24, z: 100, rotate: -2, width: "w-56",
  },
  {
    kind: "Bank text message",
    text: "“Your account has been locked. Tap here to verify.”",
    flags: ["fear", "authority"],
    x: 74, y: 52, z: 20, rotate: 1, width: "w-48",
  },
  {
    kind: "Viral accusation",
    text: "“Everyone is sharing this — pass it on before it gets deleted.”",
    flags: ["bandwagon", "emotional_bait"],
    x: 38, y: 62, z: -40, rotate: -2.5, width: "w-56",
  },
  {
    kind: "Supermarket promo",
    text: "Weekend discount at a local supermarket chain.",
    flags: [],
    x: 8, y: 78, z: -80, rotate: 2, width: "w-44",
    mobileHidden: true,
  },
  {
    kind: "Loan app",
    text: "“0% interest, approved in 5 minutes — just pay a fee upfront.”",
    flags: ["urgency", "scarcity"],
    x: 30, y: 84, z: 0, rotate: -1, width: "w-52",
  },
  {
    kind: "Public-health advisory",
    text: "New helmet regulation takes effect January 1 — ministry portal.",
    flags: [],
    x: 76, y: 80, z: -100, rotate: 2.5, width: "w-48",
    mobileHidden: true,
  },
  {
    kind: "Charity message",
    text: "A sad story asking for donations to a personal account.",
    flags: ["emotional_bait"],
    x: 54, y: 88, z: 60, rotate: -2, width: "w-44",
    mobileHidden: true,
  },
];

const SCAN_MS = 700;

export function ScanField() {
  const reduce = useReducedMotion();
  const fieldRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<AnimationPlaybackControls | null>(null);
  const [scanned, setScanned] = useState(false);
  const [holding, setHolding] = useState(false);

  // Pointer parallax — motion values only, never React state (per-frame updates).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), {
    stiffness: 120,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), {
    stiffness: 120,
    damping: 18,
  });

  const progress = useMotionValue(0);
  const ring = useTransform(
    progress,
    (v) =>
      `conic-gradient(var(--primary) ${v * 360}deg, var(--border) ${v * 360}deg)`,
  );

  function handlePointer(event: React.PointerEvent<HTMLDivElement>) {
    if (reduce || !fieldRef.current) return;
    const rect = fieldRef.current.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function startScan() {
    setHolding(true);
    controlsRef.current = animate(progress, 1, {
      duration: SCAN_MS / 1000,
      ease: "linear",
      onComplete: () => setScanned(true),
    });
  }

  function stopScan() {
    setHolding(false);
    setScanned(false);
    controlsRef.current?.stop();
    animate(progress, 0, { duration: 0.25, ease: "easeOut" });
  }

  return (
    <div
      ref={fieldRef}
      onPointerMove={handlePointer}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative h-[480px] overflow-hidden rounded-3xl border border-border/70 bg-secondary/40 [perspective:1200px] sm:h-[560px]"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="absolute inset-0"
      >
        {POSTS.map((post, i) => (
          <motion.div
            key={post.kind}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.05 * i }}
            className={cn("absolute", post.mobileHidden && "hidden md:block")}
            style={{
              left: `${post.x}%`,
              top: `${post.y}%`,
              z: post.z,
              opacity: post.z < -60 ? 0.55 : post.z < 0 ? 0.75 : 1,
            }}
          >
            <motion.div
              animate={
                reduce || scanned
                  ? undefined
                  : { y: [0, -6, 0], rotate: post.rotate }
              }
              transition={{
                duration: 4.5 + (i % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.35,
              }}
              style={{ rotate: post.rotate }}
              className={cn(
                "rounded-xl border border-border/70 bg-card p-3 shadow-sm",
                post.width,
              )}
            >
              <p className="text-[11px] font-medium text-muted-foreground">
                {post.kind}
              </p>
              <p className="mt-1 text-sm leading-snug">{post.text}</p>
              <div className="mt-1.5 h-2 w-16 rounded-full bg-muted" />

              <div className="mt-2 flex flex-wrap gap-1">
                {post.flags.length > 0 ? (
                  post.flags.map((flag, j) => (
                    <motion.span
                      key={flag}
                      initial={false}
                      animate={
                        scanned
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 0.7 }
                      }
                      transition={{
                        duration: 0.25,
                        delay: scanned ? 0.05 * i + 0.04 * j : 0,
                      }}
                      className="rounded-full bg-tier-caution/15 px-2 py-0.5 text-[11px] font-medium text-tier-caution"
                    >
                      {techniqueLabels[flag]}
                    </motion.span>
                  ))
                ) : (
                  <motion.span
                    initial={false}
                    animate={
                      scanned
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.7 }
                    }
                    transition={{ duration: 0.25, delay: scanned ? 0.05 * i : 0 }}
                    className="rounded-full bg-tier-watch/15 px-2 py-0.5 text-[11px] font-medium text-tier-watch"
                  >
                    No clear flags
                  </motion.span>
                )}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Center scan control */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <motion.span
            animate={{ opacity: scanned ? 0 : 1 }}
            className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background"
          >
            Press and hold to scan
          </motion.span>
          <motion.div
            style={{ background: ring }}
            className="rounded-full p-1 shadow-lg"
          >
            <button
              type="button"
              aria-label="Hold to scan posts"
              onPointerDown={startScan}
              onPointerUp={stopScan}
              onPointerLeave={() => holding && stopScan()}
              onKeyDown={(event) => {
                if ((event.key === "Enter" || event.key === " ") && !holding) {
                  event.preventDefault();
                  startScan();
                }
              }}
              onKeyUp={(event) => {
                if (event.key === "Enter" || event.key === " ") stopScan();
              }}
              className={cn(
                "flex size-24 touch-none flex-col items-center justify-center gap-1 rounded-full bg-card text-sm font-semibold select-none sm:size-28",
                "transition-transform focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none active:scale-95",
              )}
            >
              <ScanSearch
                className={cn(
                  "size-5 text-primary transition-transform",
                  holding && "scale-110",
                )}
              />
              {scanned ? "Scanning" : "Hold to scan"}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
