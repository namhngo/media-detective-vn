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
  type MotionValue,
} from "motion/react";
import { Check } from "lucide-react";

import { FlashlightIcon } from "@/components/flashlight-icon";
import { TierBadge } from "@/components/tier-badge";
import { useI18n } from "@/components/i18n-provider";
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
  kindVi: string;
  textVi: string;
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
    kindVi: "Ảnh lũ lụt",
    textVi: "Được chia sẻ như thể vừa xảy ra hôm nay.",
    tier: "caution",
    x: 3, y: 10, z: -120, rotate: -3, width: "w-44",
    mobileHidden: true,
  },
  {
    kind: "Investment group",
    text: "“Easy job, high pay” — the group asks for a deposit first.",
    kindVi: "Nhóm đầu tư",
    textVi: "“Việc nhẹ, lương cao” — nhóm yêu cầu đặt cọc trước.",
    tier: "warning",
    x: 36, y: 6, z: 40, rotate: 2, width: "w-52",
  },
  {
    kind: "Official weather notice",
    text: "Tidal surge expected this weekend — national forecast center.",
    kindVi: "Thông báo thời tiết chính thức",
    textVi: "Dự báo triều cường cuối tuần — trung tâm dự báo quốc gia.",
    tier: "watch",
    x: 72, y: 3, z: -60, rotate: 1.5, width: "w-48",
  },
  {
    kind: "Fake document",
    text: "Screenshot of an “official announcement” with no source link.",
    kindVi: "Văn bản giả",
    textVi: "Ảnh chụp “thông báo chính thức” nhưng không có liên kết nguồn.",
    tier: "warning",
    x: 22, y: 28, z: 0, rotate: -1.5, width: "w-52",
  },
  {
    kind: "Prize call",
    text: "You won a free holiday — attend our hotel event today to claim it.",
    kindVi: "Cuộc gọi báo trúng thưởng",
    textVi: "Bạn trúng chuyến du lịch miễn phí — hãy đến sự kiện tại khách sạn hôm nay để nhận.",
    tier: "warning",
    x: 4, y: 46, z: 60, rotate: 2.5, width: "w-56",
  },
  {
    kind: "Video-call impersonation",
    text: "A familiar face on video asking for money right now.",
    kindVi: "Mạo danh qua cuộc gọi video",
    textVi: "Một gương mặt quen thuộc trên video đang yêu cầu chuyển tiền ngay.",
    tier: "warning",
    x: 64, y: 24, z: 100, rotate: -2, width: "w-56",
  },
  {
    kind: "Bank text message",
    text: "“Your account has been locked. Tap here to verify.”",
    kindVi: "Tin nhắn ngân hàng",
    textVi: "“Tài khoản của bạn đã bị khóa. Nhấn vào đây để xác minh.”",
    tier: "warning",
    x: 74, y: 52, z: 20, rotate: 1, width: "w-48",
  },
  {
    kind: "Viral accusation",
    text: "“Everyone is sharing this — pass it on before it gets deleted.”",
    kindVi: "Cáo buộc lan truyền",
    textVi: "“Ai cũng đang chia sẻ — hãy chuyển tiếp trước khi bài bị xóa.”",
    tier: "warning",
    x: 38, y: 62, z: -40, rotate: -2.5, width: "w-56",
  },
  {
    kind: "Supermarket promo",
    text: "Weekend discount at a local supermarket chain.",
    kindVi: "Khuyến mãi siêu thị",
    textVi: "Chương trình giảm giá cuối tuần tại một chuỗi siêu thị địa phương.",
    tier: "watch",
    x: 8, y: 78, z: -80, rotate: 2, width: "w-44",
    mobileHidden: true,
  },
  {
    kind: "Loan app",
    text: "“0% interest, approved in 5 minutes — just pay a fee upfront.”",
    kindVi: "Ứng dụng vay tiền",
    textVi: "“Lãi suất 0%, duyệt trong 5 phút — chỉ cần trả phí trước.”",
    tier: "warning",
    x: 30, y: 84, z: 0, rotate: -1, width: "w-52",
  },
  {
    kind: "Public-health advisory",
    text: "New helmet regulation takes effect January 1 — ministry portal.",
    kindVi: "Khuyến cáo y tế công cộng",
    textVi: "Quy định mới về mũ bảo hiểm có hiệu lực từ ngày 1 tháng 1 — cổng thông tin bộ.",
    tier: "watch",
    x: 76, y: 80, z: -100, rotate: 2.5, width: "w-48",
    mobileHidden: true,
  },
  {
    kind: "Charity message",
    text: "A sad story asking for donations to a personal account.",
    kindVi: "Tin nhắn kêu gọi từ thiện",
    textVi: "Một câu chuyện buồn kêu gọi quyên góp vào tài khoản cá nhân.",
    tier: "caution",
    x: 54, y: 88, z: 60, rotate: -2, width: "w-44",
    mobileHidden: true,
  },
];

/** Long enough that the beam's growth and the field's reveal both read as gradual, not a snap. */
const SCAN_MS = 1400;

export function ScanField() {
  const { language, t } = useI18n();
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
  const beamScale = useTransform(progress, [0, 1], [0.5, 14]);
  const beamOpacity = useTransform(progress, [0, 0.1, 1], [0, 0.22, 0.5]);

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

      {/* The beam itself — grows from the torch as it's held, ahead of any card flipping */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300"
        style={{ scale: beamScale, opacity: beamOpacity, filter: "blur(48px)" }}
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="absolute inset-0"
      >
        {POSTS.map((post, i) => (
          <FieldPostCard
            key={post.kind}
            post={post}
            index={i}
            total={POSTS.length}
            progress={progress}
            scanned={scanned}
            reduce={reduce}
            language={language}
          />
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
              {t("scanBack")}
            </motion.button>
          ) : (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#0B1120]">
              {t("scanPrompt")}
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
              aria-label={t("scanAria")}
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
                  {t("scanRevealed")}
                </>
              ) : (
                <>
                  <FlashlightIcon
                    progress={progress}
                    className={cn("transition-transform", holding && "scale-110")}
                  />
                  {holding ? t("scanLighting") : t("scanHold")}
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/**
 * One post in the field. Reveal is tied directly to `progress` — each card
 * has its own threshold along the hold, so cards flip in sequence as the
 * beam grows rather than all at once when the hold completes. Releasing
 * early lets `progress` fall back and the reveal follows it back down.
 */
function FieldPostCard({
  post,
  index,
  total,
  progress,
  scanned,
  reduce,
  language,
}: {
  post: FieldPost;
  index: number;
  total: number;
  progress: MotionValue<number>;
  scanned: boolean;
  reduce: boolean | null;
  language: "en" | "vi";
}) {
  const threshold = 0.06 + (index / Math.max(total - 1, 1)) * 0.7;
  const dimOpacity = post.z < -60 ? 0.35 : post.z < 0 ? 0.55 : 0.8;
  const revealOpacity = useTransform(
    progress,
    [threshold, threshold + 0.14],
    [dimOpacity, 1],
  );
  const revealBg = useTransform(
    progress,
    [threshold, threshold + 0.14],
    ["rgba(255,255,255,0.05)", "rgba(255,255,255,1)"],
  );
  const revealBorder = useTransform(
    progress,
    [threshold, threshold + 0.14],
    ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.4)"],
  );
  const revealText = useTransform(
    progress,
    [threshold, threshold + 0.14],
    ["rgba(255,255,255,0.4)", "#526074"],
  );
  const revealBodyText = useTransform(
    progress,
    [threshold, threshold + 0.14],
    ["rgba(255,255,255,0.6)", "#0A0E1A"],
  );
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: 0.05 * index }}
      className={cn("absolute", post.mobileHidden && "hidden md:block")}
      style={{
        left: `${post.x}%`,
        top: `${post.y}%`,
        z: post.z,
        opacity: scanned ? 1 : revealOpacity,
      }}
    >
      <motion.div
        animate={reduce || scanned ? undefined : { y: [0, -6, 0], rotate: post.rotate }}
        transition={{
          duration: 4.5 + (index % 3),
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.35,
        }}
        style={{
          rotate: post.rotate,
          backgroundColor: scanned ? "#ffffff" : revealBg,
          borderColor: scanned ? "rgba(255,255,255,0.4)" : revealBorder,
          boxShadow: scanned ? "0 10px 40px -10px rgba(251,191,36,0.25)" : "none",
          color: scanned ? "#0A0E1A" : revealBodyText,
        }}
        className={cn("rounded-xl border p-3", post.width)}
      >
        <motion.p
          className="text-[11px] font-medium"
          style={{ color: scanned ? "#526074" : revealText }}
        >
          {language === "vi" ? post.kindVi : post.kind}
        </motion.p>
        <p className="mt-1 text-sm leading-snug text-inherit">
          {language === "vi" ? post.textVi : post.text}
        </p>
        <div
          className={cn(
            "mt-1.5 h-2 w-16 rounded-full transition-colors duration-700",
            scanned ? "bg-muted" : "bg-white/10",
          )}
        />

        <div className="mt-2 inline-flex">
          <TierBadge tier={post.tier} />
        </div>
      </motion.div>
    </motion.div>
  );
}
