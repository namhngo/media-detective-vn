import {
  ArrowRight,
  Flame,
  Lock,
  MessageSquareText,
} from "lucide-react";
import { Show, SignInButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { AccentWord } from "@/components/accent-word";
import { HeroLightboard } from "@/components/hero-lightboard";
import { TechniqueMarquee } from "@/components/technique-marquee";
import { DetectFlow } from "@/components/detect-flow";
import { ReportFlow } from "@/components/report-flow";
import { WorkspaceBackdrop } from "@/components/workspace-backdrop";
import { getServerLanguage } from "@/lib/server-i18n";
import { translate } from "@/lib/i18n";

/** A sign-in gate for the inline flows — the tool is free, accounts keep it accountable. */
function SignInGate({ language }: { language: "en" | "vi" }) {
  const vi = language === "vi";
  return (
    <div className="torch-panel mx-auto max-w-md rounded-3xl p-8 text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-400/15 text-amber-600">
        <Flame className="size-6" />
      </span>
      <p className="mt-4 text-lg font-semibold">
        {vi ? "Đăng nhập để cầm lửa" : "Sign in to hold the light"}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {vi
          ? "Miễn phí. Tài khoản giúp mỗi lượt kiểm tra và báo cáo có trách nhiệm — không ai ẩn danh phía sau một cảnh báo."
          : "Free to use. An account keeps every check and report accountable — nobody hides behind a warning."}
      </p>
      <SignInButton>
        <Button size="lg" className="mt-5 rounded-full">
          {vi ? "Đăng nhập để tiếp tục" : "Sign in to continue"}
          <ArrowRight data-icon="inline-end" />
        </Button>
      </SignInButton>
    </div>
  );
}

export default async function Home() {
  const language = await getServerLanguage();
  const vi = language === "vi";
  const t = <K extends keyof typeof import("@/lib/i18n").messages.en>(key: K) =>
    translate(language, key);

  return (
    <div className="torch-workspace">
      <section className="border-b border-white/[0.06] bg-background text-white">
        <div className="mx-auto grid min-h-[calc(100svh-7.5rem)] max-w-6xl items-center gap-14 px-6 py-20 sm:px-8 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] lg:gap-20 lg:py-28">
          <div className="max-w-md">
            <p className="font-mono text-xs tracking-[0.12em] text-white/50">
              <span className="text-[#f7c948]">000</span> / MEDIA DETECTIVE VN
            </p>
            <h1 className="mt-8 text-[clamp(3.3rem,6.4vw,5.4rem)] font-bold leading-[0.98] tracking-[-0.055em] text-[#f0ede6]">
              {vi ? (
                <>
                  Dừng lại.<br />Rọi ánh sáng.
                </>
              ) : (
                <>
                  Pause.<br />Shine a light.
                </>
              )}
            </h1>
            <p className="mt-7 text-xl leading-relaxed text-white/55">
              {vi ? "Nhìn rõ điều thật sự đang ở đó." : "See what is really there."}
            </p>
            <p className="mt-7 max-w-sm text-[0.98rem] leading-7 text-white/50">
              {vi
                ? "Một tin nhắn có thể trông khẩn cấp, thuyết phục hoặc vô hại lúc đầu. Rọi ánh sáng vào nó trước khi bạn tin, chia sẻ hoặc để nó lan rộng."
                : "A message can look urgent, convincing, or harmless at first glance. Shine a light on it before you believe it, share it, or let it spread."}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Button
                render={<a href="#detect" />}
                nativeButton={false}
                size="lg"
                className="h-14 rounded-full bg-[#f7c948] px-6 font-mono text-sm font-bold tracking-wide text-[#1c1400] hover:bg-[#ffe08a]"
              >
                {vi ? "Rọi ánh sáng" : "Shine a light"}
                <ArrowRight data-icon="inline-end" />
              </Button>
              <a
                href="#report"
                className="border-b border-white/20 pb-1 font-mono text-xs tracking-[0.06em] text-white/55 transition-colors hover:border-white hover:text-white"
              >
                {vi ? "Báo cáo điều gì đó" : "Report something"} →
              </a>
            </div>
          </div>

          <HeroLightboard />
        </div>
      </section>

      <TechniqueMarquee />

      <div className="relative isolate overflow-hidden">
        <WorkspaceBackdrop />

        {/* ── The light: try it yourself ────────────────────────────────── */}
        <section id="detect" className="scroll-mt-20 border-t border-white/10 py-14 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] px-3 py-1 text-sm font-medium text-white/65 ring-1 ring-white/10">
              <Lock className="size-3.5" />
              {t("privateDefault")}
            </span>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              {vi ? (
                "Điều gì khiến bạn dừng lại?"
              ) : (
                <>
                  What made you <AccentWord>pause</AccentWord>?
                </>
              )}
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
              {t("detectLead")}
            </p>
            <div className="mt-8">
              <Show when="signed-out">
                <SignInGate language={language} />
              </Show>
              <Show when="signed-in">
                <DetectFlow />
              </Show>
            </div>
          </div>
        </section>

        {/* ── Share your story ──────────────────────────────────────────── */}
        <section id="report" className="scroll-mt-20 border-y border-white/10 bg-[#0b1221]/55 py-14 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] px-3 py-1 text-sm font-medium text-white/65 ring-1 ring-white/10">
              <MessageSquareText className="size-3.5" />
              {t("accountWarning")}
            </span>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              {vi ? (
                "Câu chuyện của bạn là ngọn lửa cho người tiếp theo."
              ) : (
                <>
                  Your story is someone else&rsquo;s <AccentWord>light</AccentWord>.
                </>
              )}
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
              {t("reportLead")}
            </p>
            <div className="mt-8">
              <Show when="signed-out">
                <SignInGate language={language} />
              </Show>
              <Show when="signed-in">
                <ReportFlow />
              </Show>
            </div>
          </div>
        </section>

        {/* ── Closing trust line ────────────────────────────────────────── */}
        <section className="border-t border-white/10 py-10">
          <p className="mx-auto max-w-xl px-4 text-center text-sm leading-relaxed text-muted-foreground sm:px-6">
            {vi
              ? "Tin nhắn và ảnh chụp được phân tích ngay lúc đó và không bao giờ được lưu — chỉ bản đánh giá có cấu trúc được giữ lại. Không kết quả nào chính xác 100%."
              : "Messages and screenshots are analyzed in the moment and never stored — only the structured assessment is kept. No result is ever 100% accurate."}
          </p>
        </section>
      </div>
    </div>
  );
}
