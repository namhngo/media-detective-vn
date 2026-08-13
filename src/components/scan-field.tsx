"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Check } from "lucide-react";

import { FlashlightIcon } from "@/components/flashlight-icon";
import { TierBadge } from "@/components/tier-badge";
import { useI18n } from "@/components/i18n-provider";
import type { Tier } from "@/lib/schema";
import { cn } from "@/lib/utils";

/**
 * The hero centerpiece — click the flashlight, the field floods with light,
 * every post reveals its tier in sequence. Patterns only, no real names or
 * events (see AGENTS.md sensitive-content rule).
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

export function ScanField() {
  const { language, t } = useI18n();
  const reduce = useReducedMotion();
  const fieldRef = useRef<HTMLDivElement>(null);
  const [scanned, setScanned] = useState(false);

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

  function handlePointer(event: React.PointerEvent<HTMLDivElement>) {
    if (reduce || !fieldRef.current) return;
    const rect = fieldRef.current.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function activate() {
    if (scanned) return;
    setScanned(true);
  }

  function reset() {
    setScanned(false);
  }

  return (
    <div
      ref={fieldRef}
      onPointerMove={handlePointer}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative h-[480px] overflow-hidden border border-white/10 bg-[#0b0b0c] shadow-[inset_0_2px_30px_rgba(0,0,0,0.5)] [perspective:1200px] sm:h-[560px]"
    >
      {/* Faint warm glow that lives in the dark before the torch is lit */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl"
      />

      {/* The flood — a single burst when the light turns on */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300 blur-[48px] transition-all duration-[1300ms] ease-out",
          scanned ? "scale-[14] opacity-50" : "scale-50 opacity-0",
        )}
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
              onClick={reset}
              className="rounded-full border border-white/25 bg-[#0b0b0c]/80 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur transition-colors hover:bg-[#0b0b0c] hover:text-white"
            >
              {t("scanBack")}
            </motion.button>
          ) : (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#0b0b0c]">
              {t("scanPrompt")}
            </span>
          )}
          <div
            className={cn("rounded-full p-1", !scanned && "animate-torch-glow")}
          >
            <button
              type="button"
              aria-label={t("scanAria")}
              onClick={activate}
              className={cn(
                "flex size-24 flex-col items-center justify-center gap-1 rounded-full text-sm font-semibold select-none sm:size-28",
                "transition-all focus-visible:ring-3 focus-visible:ring-amber-300/60 focus-visible:outline-none active:scale-95",
                scanned
                  ? "bg-amber-300 text-[#0b0b0c]"
                  : "bg-gradient-to-b from-amber-300 to-amber-500 text-[#0b0b0c]",
              )}
            >
              {scanned ? (
                <>
                  <Check className="size-5" />
                  {t("scanRevealed")}
                </>
              ) : (
                <>
                  <FlashlightIcon on={scanned} />
                  {t("scanHold")}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** One post in the field. A plain class-driven reveal, staggered by index —
 * matches the "click, then cascade" prototype behavior with no live motion
 * values in the style chain, so there's nothing for SSR/hydration to diverge on. */
function FieldPostCard({
  post,
  index,
  scanned,
  reduce,
  language,
}: {
  post: FieldPost;
  index: number;
  scanned: boolean;
  reduce: boolean | null;
  language: "en" | "vi";
}) {
  const dimOpacity = post.z < -60 ? 0.35 : post.z < 0 ? 0.55 : 0.8;

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
        opacity: scanned ? 1 : dimOpacity,
        transitionDelay: scanned ? `${index * 55}ms` : "0ms",
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
        style={{ rotate: post.rotate, transitionDelay: scanned ? `${index * 55}ms` : "0ms" }}
        className={cn(
          "border p-3 transition-all duration-700",
          post.width,
          scanned
            ? "border-white/40 bg-white text-[#0b0b0c] shadow-[0_10px_40px_-10px_rgba(251,191,36,0.25)]"
            : "border-white/10 bg-white/[0.05] text-white/60 shadow-none",
        )}
      >
        <p
          className={cn(
            "text-[11px] font-medium transition-colors duration-700",
            scanned ? "text-[#526074]" : "text-white/40",
          )}
        >
          {language === "vi" ? post.kindVi : post.kind}
        </p>
        <p className="mt-1 text-sm leading-snug">
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
