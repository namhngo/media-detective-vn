"use client";

import { Flashlight } from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/components/i18n-provider";
import type { Tier } from "@/lib/schema";
import { tierLabel } from "@/lib/tier";
import { cn } from "@/lib/utils";

type Signal = {
  text: string;
  textVi: string;
  meta: string;
  metaVi: string;
  tier?: Tier;
};

/** Fictional pattern cards for the homepage interaction; never real victims. */
const SIGNALS: Signal[] = [
  {
    text: '"It\'s me. I need money right now. Don\'t tell anyone."',
    textVi: '"Là con đây. Con cần tiền ngay. Đừng nói với ai."',
    meta: "Message · relative",
    metaVi: "Tin nhắn · người thân",
    tier: "warning",
  },
  {
    text: '"Your account will be locked in 24h — verify now."',
    textVi: '"Tài khoản sẽ bị khóa trong 24 giờ — hãy xác minh ngay."',
    meta: "SMS · bank",
    metaVi: "SMS · ngân hàng",
    tier: "warning",
  },
  {
    text: '"Everyone is sharing this before it gets deleted."',
    textVi: '"Ai cũng đang chia sẻ trước khi bài bị xóa."',
    meta: "Post · viral",
    metaVi: "Bài đăng · lan truyền",
    tier: "caution",
  },
  {
    text: '"0% interest, approved in 5 minutes — pay a fee first."',
    textVi: '"Lãi suất 0%, duyệt trong 5 phút — hãy nộp phí trước."',
    meta: "DM · loan app",
    metaVi: "Tin nhắn · ứng dụng vay",
    tier: "warning",
  },
  {
    text: '"Tidal surge expected this weekend — official forecast."',
    textVi: '"Dự báo triều cường cuối tuần — nguồn dự báo chính thức."',
    meta: "Notice · weather service",
    metaVi: "Thông báo · dịch vụ thời tiết",
  },
  {
    text: 'Screenshot of an "announcement" with no source link.',
    textVi: 'Ảnh chụp "thông báo" nhưng không có liên kết nguồn.',
    meta: "Image · unverified",
    metaVi: "Hình ảnh · chưa xác minh",
    tier: "caution",
  },
];

/** The flat, editorial flashlight moment for the public landing page. */
export function HeroLightboard() {
  const { language } = useI18n();
  const [lit, setLit] = useState(false);
  const vi = language === "vi";

  return (
    <div className="relative overflow-hidden border-y border-white/[0.06]">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-1000 ease-out",
          lit ? "opacity-100" : "opacity-0",
        )}
        style={{
          backgroundImage:
            "radial-gradient(ellipse 76% 62% at 50% 100%, rgba(247,201,72,0.46) 0%, rgba(247,201,72,0.19) 32%, rgba(247,201,72,0.06) 54%, transparent 76%)",
        }}
      />

      <div className="relative z-10">
        {SIGNALS.map((signal, index) => (
          <article
            key={signal.text}
            className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-t border-white/[0.06] py-4 first:border-t-0 sm:py-5"
          >
            <div className="min-w-0">
              <p
                className={cn(
                  "text-[0.94rem] leading-relaxed text-white transition-[filter,opacity] duration-500 sm:text-[1rem]",
                  lit ? "blur-0 opacity-100" : "blur-[4px] opacity-60",
                )}
                style={lit ? { transitionDelay: `${150 + index * 95}ms` } : undefined}
              >
                {vi ? signal.textVi : signal.text}
              </p>
              {signal.tier && (
                <div
                  className={cn(
                    "mt-2 transition-opacity duration-300",
                    lit ? "opacity-100" : "opacity-0",
                  )}
                  style={lit ? { transitionDelay: `${360 + index * 95}ms` } : undefined}
                >
                  <span className="inline-flex border border-[#f7c948] px-2 py-0.5 font-mono text-[0.62rem] font-bold tracking-[0.08em] text-[#f7c948] uppercase">
                    {tierLabel(signal.tier, language)}
                  </span>
                </div>
              )}
            </div>
            <p className="pt-0.5 font-mono text-[0.62rem] tracking-wide text-white/45 sm:text-[0.68rem]">
              {vi ? signal.metaVi : signal.meta}
            </p>
          </article>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3 py-8">
        <button
          type="button"
          onClick={() => setLit((current) => !current)}
          aria-pressed={lit}
          className="group flex flex-col items-center gap-2 text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7c948] focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          <span
            className={cn(
              "flex size-16 items-center justify-center rounded-2xl border transition-all duration-500",
              lit
                ? "border-[#f7c948] bg-[#f7c948] text-[#1c1400] shadow-[0_0_28px_rgba(247,201,72,0.75)]"
                : "border-white/25 bg-transparent text-white/70 group-hover:border-white/60",
            )}
          >
            <Flashlight className={cn("size-5 transition-transform duration-500", lit && "rotate-[-12deg] scale-110")} />
          </span>
          <span className="font-mono text-[0.68rem] tracking-wide">
            {lit
              ? vi
                ? "Tắt ánh sáng"
                : "Back to the dark"
              : vi
                ? "Bấm để bật ánh sáng"
                : "Click to turn on the light"}
          </span>
        </button>
      </div>
    </div>
  );
}
