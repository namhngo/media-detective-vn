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
    text: "Hey, I'm in a bit of trouble right now. Can you send me $200 immediately?",
    textVi: "Hey, mình đang gặp chút rắc rối. Bạn gửi ngay cho mình $200 được không?",
    meta: "Message · relative",
    metaVi: "Tin nhắn · người thân",
    tier: "warning",
  },
  {
    text: "Your online banking service will be temporarily suspended. Please verify your information to avoid interruption: bit.ly/verify-account",
    textVi: "Dịch vụ ngân hàng trực tuyến của bạn sẽ tạm ngừng. Hãy xác minh thông tin để tránh gián đoạn: bit.ly/verify-account",
    meta: "SMS · bank",
    metaVi: "SMS · ngân hàng",
    tier: "warning",
  },
  {
    text: "Official: Tidal surge expected this weekend",
    textVi: "Chính thức: Dự kiến triều cường vào cuối tuần này",
    meta: "Notice · public",
    metaVi: "Thông báo · công chúng",
  },
  {
    text: "!!! Hanoi, be prepared for a major power outage tonight. Please stock up on essentials immediately.",
    textVi: "!!! Hà Nội, hãy chuẩn bị cho một đợt mất điện lớn tối nay. Hãy mua ngay các nhu yếu phẩm.",
    meta: "Post · viral",
    metaVi: "Bài đăng · lan truyền",
    tier: "caution",
  },
  {
    text: "Need money urgently? Get up to 50,000,000đ today! No collateral, no meeting required.",
    textVi: "Cần tiền gấp? Nhận đến 50.000.000đ hôm nay! Không cần tài sản đảm bảo, không cần gặp mặt.",
    meta: "DM · loan",
    metaVi: "Tin nhắn · khoản vay",
    tier: "warning",
  },
  {
    text: "All students are required to complete the new identity verification process before accessing the student portal next month.",
    textVi: "Tất cả sinh viên phải hoàn tất quy trình xác minh danh tính mới trước khi truy cập cổng thông tin sinh viên vào tháng tới.",
    meta: "Notice · university",
    metaVi: "Thông báo · trường đại học",
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
