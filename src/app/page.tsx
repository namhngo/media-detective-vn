import {
  ArrowDown,
  ArrowRight,
  Flame,
  Lock,
  MessageSquareText,
  ScanSearch,
} from "lucide-react";
import { Show, SignInButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { AccentWord } from "@/components/accent-word";
import { HeroIntro, HeroItem } from "@/components/hero-intro";
import { ScanField } from "@/components/scan-field";
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
      {/* ── The dark: every day, hundreds of voices in the dark ─────────── */}
      <section className="relative overflow-hidden bg-[#0A0E1A] text-white">
        {/* Ambient embers — warm light living inside the dark */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-[8%] size-[30rem] rounded-full bg-amber-500/12 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-[4%] size-[24rem] rounded-full bg-primary/15 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:py-20">
          <HeroIntro>
            <HeroItem>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/75">
                <ScanSearch className="size-3.5" />
                {t("homeEyebrow")}
              </span>
            </HeroItem>
            <HeroItem>
              <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight sm:text-6xl">
                {vi ? (
                  t("homeTitle")
                ) : (
                  <>
                    Pause before you <AccentWord>act</AccentWord> on it.
                  </>
                )}
              </h1>
            </HeroItem>
            <HeroItem>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/70">
                {vi
                  ? "Bóng tối đầy những giọng nói khẩn cấp. Hãy cầm ánh sáng lên — nhìn rõ điều thật sự đang ở đó trước khi tiền được chuyển hay bài viết lan rộng."
                  : "The dark is full of urgent voices. Hold the light up — see what is really there before money moves or a post spreads."}
              </p>
            </HeroItem>
            <HeroItem>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  render={<a href="#detect" />}
                  nativeButton={false}
                  size="lg"
                  className="rounded-full bg-amber-400 text-[#0A0E1A] hover:bg-amber-300"
                >
                  {vi ? "Thử với tin nhắn của bạn" : "Try your own"}
                  <ArrowRight data-icon="inline-end" />
                </Button>
                <Button
                  render={<a href="#report" />}
                  nativeButton={false}
                  variant="outline"
                  size="lg"
                  className="rounded-full border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  {vi ? "Chia sẻ câu chuyện của bạn" : "Share your story"}
                </Button>
              </div>
            </HeroItem>
          </HeroIntro>

          <HeroItem className="lg:pl-4">
            <ScanField />
          </HeroItem>
        </div>

        <div className="relative flex justify-center pb-6">
          <a
            href="#detect"
            aria-label={vi ? "Cuộn xuống để thử" : "Scroll to try it"}
            className="flex flex-col items-center gap-1 text-xs text-white/50 transition-colors hover:text-white"
          >
            {vi ? "Cuộn xuống để thử" : "Scroll to try it"}
            <ArrowDown className="size-4 animate-bounce" />
          </a>
        </div>
      </section>

      <TechniqueMarquee />

      <div className="relative isolate overflow-hidden">
        <WorkspaceBackdrop />

        {/* ── The light: try it yourself ────────────────────────────────── */}
        <section id="detect" className="scroll-mt-20 border-t border-white/10 py-14 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="torch-label mb-4">
              <span className="torch-label-num">01</span>
              {vi ? "ĐƯA RA ÁNH SÁNG" : "BRING IT INTO THE LIGHT"}
            </p>
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
            <p className="torch-label mb-4">
              <span className="torch-label-num">02</span>
              {vi ? "ĐỂ LẠI TRONG ÁNH SÁNG" : "LEAVE IT IN THE LIGHT"}
            </p>
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
