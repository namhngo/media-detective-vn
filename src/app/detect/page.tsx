import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

import { DarkBand } from "@/components/dark-band";
import { DetectFlow } from "@/components/detect-flow";
import { PageHero } from "@/components/page-hero";
import { WorkspaceBackdrop } from "@/components/workspace-backdrop";
import { getServerLanguage } from "@/lib/server-i18n";

export const metadata: Metadata = {
  title: "Check content — Media Detective Vietnam",
};

export default async function DetectPage() {
  await auth.protect();
  const language = await getServerLanguage();
  const vi = language === "vi";

  return (
    <div className="torch-workspace">
      <DarkBand>
        <PageHero
          dark
          eyebrowIcon={Lock}
          eyebrow={vi ? "Riêng tư mặc định" : "Private by default"}
          title={vi ? "Điều gì khiến bạn dừng lại?" : "What made you pause?"}
          accent={vi ? undefined : "pause"}
          lede={
            vi
              ? "Dán tin nhắn hoặc tải ảnh chụp màn hình. Nội dung gốc được phân tích ngay lúc đó và không bao giờ được lưu — chỉ bản đánh giá có cấu trúc được giữ lại."
              : "Paste a message or upload a screenshot. The raw content is analyzed in the moment and never stored — only the structured assessment counts."
          }
        />
      </DarkBand>
      <section className="relative isolate min-h-[calc(100svh-16rem)] overflow-hidden bg-background/70 py-10 sm:py-14">
        <WorkspaceBackdrop />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <DetectFlow />
        </div>
      </section>
    </div>
  );
}
