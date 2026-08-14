import type { Metadata } from "next";
import { Gift } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

import { DarkBand } from "@/components/dark-band";
import { LightBox } from "@/components/light-box";
import { PageHero } from "@/components/page-hero";
import { WorkspaceBackdrop } from "@/components/workspace-backdrop";
import { getUserActivity } from "@/lib/activity";
import { getServerLanguage, serverT } from "@/lib/server-i18n";

export const metadata: Metadata = {
  title: "Prize box — Media Detective Vietnam",
};

export default async function LearnPage() {
  const { userId } = await auth.protect();
  const language = await getServerLanguage();
  const vi = language === "vi";
  const activity = await getUserActivity(userId).catch((error) => {
    console.error("Prize activity lookup failed", error);
    return null;
  });

  return (
    <div className="torch-workspace">
      <DarkBand className="max-w-5xl">
        <PageHero
          dark
          eyebrowIcon={Gift}
          eyebrow={serverT(language, "lightEyebrow")}
          title={serverT(language, "navLearn")}
          accent={vi ? undefined : "prize"}
          lede={
            vi
              ? "Mỗi lượt kiểm tra hoặc báo cáo hoàn tất giúp bạn tích sao. Dùng năm sao để mở một sự thật MIL đã được xem xét."
              : "Every completed check or report earns a star. Spend five stars to open one reviewed MIL fact."
          }
        />
      </DarkBand>

      <section className="relative isolate min-h-[calc(100svh-16rem)] overflow-hidden bg-background/70 py-10 sm:py-14">
        <WorkspaceBackdrop />
        <div className="mx-auto max-w-5xl space-y-5 px-4 sm:px-6">
          {activity ? (
            <LightBox light={activity.light} />
          ) : (
            <section className="torch-panel rounded-2xl p-5 text-sm text-muted-foreground sm:p-6">
              {vi ? "Không thể tải phần thưởng lúc này." : "Your prize balance is unavailable right now."}
            </section>
          )}
        </div>
      </section>
    </div>
  );
}
