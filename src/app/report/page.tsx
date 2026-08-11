import type { Metadata } from "next";
import { MessageSquareText } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

import { ReportFlow } from "@/components/report-flow";
import { PageHero } from "@/components/page-hero";
import { WorkspaceBackdrop } from "@/components/workspace-backdrop";
import { getServerLanguage } from "@/lib/server-i18n";

export const metadata: Metadata = {
  title: "Report a case — Media Detective Vietnam",
};

export default async function ReportPage() {
  await auth.protect();
  const language = await getServerLanguage();
  const vi = language === "vi";

  return (
    <div className="relative isolate mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <WorkspaceBackdrop />
      <PageHero
        eyebrowIcon={MessageSquareText}
        eyebrow={vi ? "Câu chuyện của bạn là cảnh báo" : "Your account is the warning"}
        title={vi ? "Giúp người khác biết dừng lại." : "Help someone else pause."}
        accent={vi ? undefined : "pause"}
        lede={vi ? "Điều đó đã xảy ra với bạn — một vụ lừa đảo, cuộc gọi giả mạo hoặc tin dối nhắm vào bạn hay người quen. Hãy mô tả điều đã xảy ra để hệ thống chuyển thành một hồ sơ vụ việc. Việc công khai dựa trên lời xác nhận của bạn, không phải cấp độ AI." : "It already happened to you — a scam, a fake video call, or a viral lie that targeted you or someone you know. Describe what happened and the same engine structures it into a case file. Publishing depends on your word, not the AI's tier."}
      />
      <div className="mt-10">
        <ReportFlow />
      </div>
    </div>
  );
}
