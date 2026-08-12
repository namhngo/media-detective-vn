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
import { Check, Flame } from "lucide-react";

import { TierBadge } from "@/components/tier-badge";
import type { Tier } from "@/lib/schema";
import { cn } from "@/lib/utils";

/**
 * The hero centerpiece — "hold a light into the darkness." Posts sit as dim
 * silhouettes in a dark field; holding the torch floods the field with warm
 * light and every post is revealed with its tier. Patterns only, no real
 * names or events (see AGENTS.md sensitive-content rule).
 */
type FieldPost = {
  kind: string;
  text: string;
  tier: Tier;
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
    tier: "caution",
    x: 3, y: 10, z: -120, rotate: -3, width: "w-44",
    mobileHidden: true,
  },
  {
    kind: "Investment group",
    text: "“Easy job, high pay” — the group asks for a deposit first.",
    tier: "warning",
    x: 36, y: 6, z: 40, rotate: 2, width: "w-52",
  },
  {
    kind: "Official weather notice",
    text: "Tidal surge expected this weekend — national forecast center.",
    tier: "watch",
    x: 72, y: 3, z: -60, rotate: 1.5, width: "w-48",
  },
  {
    kind: "Fake document",
    text: "Screenshot of an “official announcement” with no source link.",
    tier: "warning",
    x: 22, y: 28, z: 0, rotate: -1.5, width: "w-52",
  },
  {
    kind: "Prize call",
    text: "You won a free holiday — attend our hotel event today to claim it.",
    tier: "warning",
    x: 4, y: 46, z: 60, rotate: 2.5, width: "w-56",
  },
  {
    kind: "Video-call impersonation",
    text: "A familiar face on video asking for money right now.",
    tier: "warning",
    x: 64, y: 24, z: 100, rotate: -2, width: "w-56",
  },
  {
    kind: "Bank text message",
    text: "“Your account has been locked. Tap here to verify.”",
    tier: "warning",
    x: 74, y: 52, z: 20, rotate: 1, width: "w-48",
  },
  {
    kind: "Viral accusation",
    text: "“Everyone is sharing this — pass it on before it gets deleted.”",
    tier: "warning",
    x: 38, y: 62, z: -40, rotate: -2.5, width: "w-56",
  },
  {
    kind: "Supermarket promo",
    text: "Weekend discount at a local supermarket chain.",
    tier: "watch",
    x: 8, y: 78, z: -80, rotate: 2, width: "w-44",
    mobileHidden: true,
  },
  {
    kind: "Loan app",
    text: "“0% interest, approved in 5 minutes — just pay a fee upfront.”",
    tier: "warning",
    x: 30, y: 84, z: 0, rotate: -1, width: "w-52",
  },
  {
    kind: "Public-health advisory",
    text: "New helmet regulation takes effect January 1 — ministry portal.",
    tier: "watch",
    x: 76, y: 80, z: -100, rotate: 2.5, width: "w-48",
    mobileHidden: true,
  },
  {
    kind: "Charity message",
    text: "A sad story asking for donations to a personal account.",
    tier: "caution",
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
      `conic-gradient(#fbbf24 ${v * 360}deg, rgba(251,191,36,0.15) ${v * 360}deg)`,
  );

  function handlePointer(event: React.PointerEvent<HTMLDivElement>) {
    if (reduce || !fieldRef.current) return;
    const rect = fieldRef.current.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function startScan() {
    if (scanned) return;
    setHolding(true);
    controlsRef.current = animate(progress, 1, {
      duration: SCAN_MS / 1000,
      ease: "linear",
      onComplete: () => setScanned(true),
    });
  }

  function stopScan() {
    setHolding(false);
    if (scanned) return;
    controlsRef.current?.stop();
    animate(progress, 0, { duration: 0.25, ease: "easeOut" });
  }

  function resetScan() {
    setScanned(false);
    setHolding(false);
    animate(progress, 0, { duration: 0.3, ease: "easeOut" });
  }

  return (
    <div
      ref={fieldRef}
      onPointerMove={handlePointer}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative h-[480px] overflow-hidden rounded-3xl border border-white/10 bg-[#0B1120] shadow-[inset_0_2px_30px_rgba(0,0,0,0.5)] [perspective:1200px] sm:h-[560px]"
    >
      {/* Faint warm glow that lives in the dark before the torch is lit */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl"
      />

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
              opacity: scanned ? 1 : post.z < -60 ? 0.35 : post.z < 0 ? 0.55 : 0.8,
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
              style={{
                rotate: post.rotate,
                transitionDelay: scanned ? `${i * 55}ms` : "0ms",
              }}
              className={cn(
                "rounded-xl border p-3 transition-all duration-700",
                post.width,
                scanned
                  ? "border-white/40 bg-white text-foreground shadow-[0_10px_40px_-10px_rgba(251,191,36,0.25)]"
                  : "border-white/10 bg-white/[0.05] text-white/60 shadow-none",
              )}
            >
              <p
                className={cn(
                  "text-[11px] font-medium transition-colors duration-700",
                  scanned ? "text-muted-foreground" : "text-white/40",
                )}
              >
                {post.kind}
              </p>
              <p className="mt-1 text-sm leading-snug">{post.text}</p>
              <div
                className={cn(
                  "mt-1.5 h-2 w-16 rounded-full transition-colors duration-700",
                  scanned ? "bg-muted" : "bg-white/10",
                )}
              />

              <div className="mt-2">
                <motion.span
                  initial={false}
                  animate={
                    scanned
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.7 }
                  }
                  transition={{
                    duration: 0.25,
                    delay: scanned
                      ? Math.hypot(post.x - 46, post.y - 46) * 0.012
                      : 0,
                  }}
                  className="inline-flex"
                >
                  <TierBadge tier={post.tier} />
                </motion.span>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* The light wave — warm rings flooding outward from the torch */}
      {scanned && !reduce && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          {[0, 1].map((i) => (
            <motion.span
              key={i}
              initial={{ scale: 0.04, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{ duration: 1.1, delay: i * 0.16, ease: "easeOut" }}
              className="absolute size-[1400px] rounded-full border-2 border-amber-400/50"
            />
          ))}
        </div>
      )}

      {/* The torch */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          {scanned ? (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.25 }}
              onClick={resetScan}
              className="rounded-full border border-white/25 bg-[#0B1120]/80 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur transition-colors hover:bg-[#0B1120] hover:text-white"
            >
              Back to the dark
            </motion.button>
          ) : (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#0B1120]">
              Press and hold the light
            </span>
          )}
          <motion.div
            style={{ background: ring }}
            className={cn(
              "rounded-full p-1",
              !scanned && "animate-torch-glow",
            )}
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
                "flex size-24 touch-none flex-col items-center justify-center gap-1 rounded-full text-sm font-semibold select-none sm:size-28",
                "transition-all focus-visible:ring-3 focus-visible:ring-amber-300/60 focus-visible:outline-none active:scale-95",
                scanned
                  ? "bg-amber-300 text-[#0B1120]"
                  : "bg-gradient-to-b from-amber-300 to-amber-500 text-[#0B1120]",
              )}
            >
              {scanned ? (
                <>
                  <Check className="size-5" />
                  Revealed
                </>
              ) : (
                <>
                  <Flame
                    className={cn(
                      "size-5 transition-transform",
                      holding && "scale-125",
                    )}
                  />
                  {holding ? "Lighting" : "Hold the light"}
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
