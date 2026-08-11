"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import {
  CircleAlert,
  LockKeyhole,
  MessageCircle,
  ScanSearch,
} from "lucide-react";

/**
 * A concrete preview of the product's value: an urgent message becomes
 * recognizable signals and a calm next step. Subtle pointer tilt gives the
 * panel physical presence; reduced motion keeps it perfectly still.
 */
export function HomeSignalPreview() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [3, -3]), {
    stiffness: 140,
    damping: 16,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), {
    stiffness: 140,
    damping: 16,
  });

  return (
    <motion.aside
      onPointerMove={(event) => {
        if (reduce) return;
        const rect = event.currentTarget.getBoundingClientRect();
        mx.set((event.clientX - rect.left) / rect.width - 0.5);
        my.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="relative overflow-hidden rounded-[2rem] bg-[#12345a] p-5 text-white shadow-2xl shadow-primary/20 ring-1 ring-white/10 sm:p-7"
    >
      <div className="absolute right-8 top-2 size-32 rounded-full border border-white/15" />
      <div className="absolute right-4 top-20 size-20 rounded-full border border-white/10" />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-medium text-white/80">
            <ScanSearch className="size-4" />
            A moment before you act
          </p>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/80">
            Example
          </span>
        </div>

        <div
          className="mt-8 rounded-2xl bg-white p-4 text-foreground shadow-lg"
          style={{ transform: "translateZ(18px)" }}
        >
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MessageCircle className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">An urgent message arrives</p>
              <p className="text-xs text-muted-foreground">Message · 2 min ago</p>
            </div>
          </div>
          <p className="mt-4 rounded-2xl rounded-tl-sm bg-secondary px-3.5 py-3 text-sm leading-relaxed">
            “It&rsquo;s me. I need ₫50 million right now. Please don&rsquo;t tell anyone.”
          </p>
        </div>

        <div
          className="relative z-10 mx-4 -mt-3 rounded-2xl bg-white p-4 text-foreground shadow-xl"
          style={{ transform: "translateZ(42px)" }}
        >
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-tier-warning/10 text-tier-warning">
              <CircleAlert className="size-4" />
            </span>
            <p className="text-sm font-semibold">What made you pause?</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-tier-caution/10 px-2.5 py-1 text-xs font-medium text-tier-caution">
              Urgency
            </span>
            <span className="rounded-full bg-tier-warning/10 px-2.5 py-1 text-xs font-medium text-tier-warning">
              Secrecy
            </span>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary/8 px-3 py-2.5 text-sm font-medium text-primary">
            Pause. Verify through a contact method you already know.
          </div>
        </div>

        <p className="mt-6 flex items-center gap-2 text-xs leading-relaxed text-white/75">
          <LockKeyhole className="size-3.5 shrink-0" />
          Your original message is analyzed in the moment, never published.
        </p>
      </div>
    </motion.aside>
  );
}
