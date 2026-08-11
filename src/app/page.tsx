import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Eye,
  FileText,
  Lock,
  LockKeyhole,
  Megaphone,
  MessageSquareText,
  ScanSearch,
  Share2,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { AccentWord } from "@/components/accent-word";
import { TierBadge } from "@/components/tier-badge";
import { RedactedLine } from "@/components/redacted-line";
import { HeroIntro, HeroItem } from "@/components/hero-intro";
import { HomeStats } from "@/components/home-stats";
import { HomeSignalPreview } from "@/components/home-signal-preview";
import { ScanField } from "@/components/scan-field";
import { TechniqueMarquee } from "@/components/technique-marquee";
import { tierMeta } from "@/lib/tier";
import type { Tier } from "@/lib/schema";
import { getServerLanguage } from "@/lib/server-i18n";
import { translate } from "@/lib/i18n";

const tiers: Tier[] = ["watch", "caution", "warning"];

export default async function Home() {
  const language = await getServerLanguage();
  const t = <K extends keyof typeof import("@/lib/i18n").messages.en>(key: K) =>
    translate(language, key);
  return (
    <div className="ambient-landing mx-auto max-w-6xl px-4 sm:px-6">
      {/* The product story, not just product copy: an urgent message becomes a pause. */}
      <section className="relative isolate grid items-center gap-10 py-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,0.78fr)] lg:py-20">
        {/* Ambient glow behind the preview — depth without a flat canvas */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 right-0 -z-10 size-[26rem] rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/3 -z-10 size-[22rem] rounded-full bg-tier-caution/10 blur-3xl"
        />
        <HeroIntro>
          <HeroItem>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-muted-foreground">
              <ScanSearch className="size-3.5" />
              {t("homeEyebrow")}
            </span>
          </HeroItem>
          <HeroItem>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight sm:text-6xl">
              {language === "vi" ? (
                t("homeTitle")
              ) : (
                <>Pause before you <AccentWord>act</AccentWord> on it.</>
              )}
            </h1>
          </HeroItem>
          <HeroItem>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              {t("homeLead")} <span className="text-foreground">{t("aiAssists")}</span>
            </p>
          </HeroItem>
          <HeroItem>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                render={<Link href="/detect" prefetch={false} />}
                nativeButton={false}
                size="lg"
                className="rounded-full"
              >
                {t("checkContent")}
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button
                render={<Link href="/report" prefetch={false} />}
                nativeButton={false}
                variant="outline"
                size="lg"
                className="rounded-full"
              >
                {t("reportCase")}
              </Button>
            </div>
          </HeroItem>
          <HeroItem>
            <HomeStats />
          </HeroItem>
        </HeroIntro>
        <HomeSignalPreview />
      </section>

      <TechniqueMarquee />

      {/* Why detect — the habit before the tool */}
      <section className="border-t border-border/70 py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="size-4 text-muted-foreground" />
              {t("whyCheck")}
            </p>
            <p className="mt-3 max-w-md text-2xl font-semibold tracking-tight">
              {t("whyCheckTitle")}
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              {t("whyCheckLead")}
            </p>
          </div>
          <ol className="space-y-4">
            {[
              {
                icon: ShieldCheck,
                title: t("officialChannel"),
                body: t("officialChannelBody"),
              },
              {
                icon: Clock3,
                title: t("slowUrgency"),
                body: t("slowUrgencyBody"),
              },
              {
                icon: Share2,
                title: t("virality"),
                body: t("viralityBody"),
              },
            ].map(({ icon: Icon, title, body }, index) => (
              <li key={title} className="flex gap-3.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-card text-sm font-semibold text-primary shadow-sm ring-1 ring-border/70">
                  {index + 1}
                </span>
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-medium">
                    <Icon className="size-3.5 text-muted-foreground" />
                    {title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Interactive scan field — hold to reveal what the AI looks for */}
      <section className="border-t border-border/70 py-12 lg:py-16">
        <p className="flex items-center gap-2 text-sm font-medium">
          <ScanSearch className="size-4 text-muted-foreground" />
          {language === "vi" ? "Mỗi ngày có hàng trăm tin nhắn. Một số là cái bẫy." : "Every day, hundreds of messages. Some are traps."}
        </p>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          {language === "vi" ? "Giữ nút để xem mỗi bài đăng được xếp cấp độ nào — Theo dõi, Cẩn trọng hay Cảnh báo." : "Hold the button to see how each post would be tiered — Watch, Caution, or Warning."}
        </p>
        <div className="mt-6">
          <ScanField />
        </div>
        <div className="mt-6 flex justify-center">
          <Button
            render={<Link href="/detect" prefetch={false} />}
            nativeButton={false}
            size="lg"
            className="rounded-full"
          >
            {language === "vi" ? "Kiểm tra tin nhắn của bạn" : "Check your own message"}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </section>

      {/* Confidence tiers */}
      <section className="border-t border-border/70 py-12 lg:py-16">
        <p className="flex items-center gap-2 text-sm font-medium">
          <ShieldQuestion className="size-4 text-muted-foreground" />
          {language === "vi" ? "AI tự tin đến đâu? Không chỉ là một con số." : "How confident is the AI? Never a bare number."}
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier}
              className={
                tier === "watch"
                  ? "rounded-2xl bg-tier-watch/8 p-4"
                  : tier === "caution"
                    ? "rounded-2xl bg-tier-caution/8 p-4"
                    : "rounded-2xl bg-tier-warning/8 p-4"
              }
            >
              <TierBadge tier={tier} />
              <p className="mt-2.5 text-sm text-muted-foreground">
                {tierMeta[tier].guidance}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          {language === "vi" ? "Cấp độ thấp nhất không có nghĩa là “an toàn” — chỉ là chưa phát hiện tín hiệu rõ ràng. Không kết quả nào chính xác 100%." : "Even the lowest tier never means “safe” — only that nothing was flagged yet. No result is ever 100% accurate."}
        </p>
      </section>

      {/* Why report — one story protects the next person */}
      <section className="border-t border-border/70 py-12 lg:py-16">
        <div className="rounded-3xl bg-secondary/60 p-6 sm:p-8">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium">
                <Megaphone className="size-4 text-muted-foreground" />
            {t("whyReport")}
              </p>
              <p className="mt-3 max-w-md text-2xl font-semibold tracking-tight">
            {t("whyReportTitle")}
              </p>
              <ol className="mt-6 space-y-4">
                {[
                  {
                    icon: MessageSquareText,
                title: t("describe"),
                body: t("describeBody"),
                  },
                  {
                    icon: LockKeyhole,
                title: t("rawPrivate"),
                body: t("rawPrivateBody"),
                  },
                  {
                    icon: Eye,
                title: t("reviewPublish"),
                body: t("reviewPublishBody"),
                  },
                ].map(({ icon: Icon, title, body }, index) => (
                  <li key={title} className="flex gap-3.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-card text-sm font-semibold text-primary shadow-sm ring-1 ring-border/70">
                      {index + 1}
                    </span>
                    <div>
                      <p className="flex items-center gap-1.5 text-sm font-medium">
                        <Icon className="size-3.5 text-muted-foreground" />
                        {title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-6">
                <Button
                  render={<Link href="/report" prefetch={false} />}
                  nativeButton={false}
                  variant="outline"
                  size="lg"
                  className="rounded-full bg-card"
                >
              {t("reportCase")}
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </div>
            </div>

            {/* What a report becomes — a pattern in the library, never raw content */}
            <div className="relative mx-auto w-full max-w-sm lg:rotate-2">
              <div
                aria-hidden
                className="absolute -inset-3 -z-10 rounded-[2rem] bg-primary/10 blur-2xl"
              />
              <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7)]">
                <div className="flex items-center justify-between gap-2">
                  <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <FileText className="size-3.5" />
                    Case file · public library
                  </p>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    Pattern only
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                    Timeshare contract
                  </span>
                  <TierBadge tier="warning" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-2.5 w-11/12 rounded-full bg-muted" />
                  <div className="h-2.5 w-3/4 rounded-full bg-muted" />
                  <div className="h-2.5 w-2/3 rounded-full bg-muted" />
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-full bg-confirmed-user/10 px-3 py-2 text-xs font-medium text-confirmed-user">
                  <MessageSquareText className="size-3.5" />
                  Reported by a user · AI signal: Warning
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Shared as a pattern others can match against — never your raw
                  message, name, or number.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy by design */}
      <section className="border-t border-border/70 py-12">
        <p className="flex items-center gap-2 text-sm font-medium">
          <Lock className="size-4 text-muted-foreground" />
          {language === "vi" ? "Chúng tôi không lưu tin nhắn của bạn" : "We never keep your message"}
        </p>
        <RedactedLine className="mt-4" />
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          {language === "vi" ? "Tin nhắn và ảnh chụp được phân tích ngay lúc đó và không bao giờ được lưu — chỉ bản đánh giá có cấu trúc được giữ lại. Tên, số điện thoại và thông tin cá nhân không xuất hiện trên trang công khai." : "Raw messages and screenshots are analyzed in the moment and never stored — only the structured assessment is kept: techniques, tier, and explanation. Names, phone numbers, and personal details never end up on a public page."}
        </p>
      </section>
    </div>
  );
}
