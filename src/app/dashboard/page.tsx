import type { Metadata } from "next";
import { Activity } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

import { DashboardView } from "@/components/dashboard-view";
import { PageHero } from "@/components/page-hero";
import { WorkspaceBackdrop } from "@/components/workspace-backdrop";
import { getServerLanguage } from "@/lib/server-i18n";
import { getUserActivity } from "@/lib/activity";
import { getDashboardData } from "@/lib/dashboard";

export const metadata: Metadata = {
  title: "Dashboard — Media Detective Vietnam",
};

export default async function DashboardPage() {
  const { userId } = await auth.protect();
  const language = await getServerLanguage();
  const vi = language === "vi";
  const [data, activity] = await Promise.all([
    getDashboardData(),
    getUserActivity(userId).catch((error) => {
      console.error("Dashboard activity lookup failed", error);
      return null;
    }),
  ]);

  return (
    <div className="relative isolate mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <WorkspaceBackdrop />
      <PageHero
        eyebrowIcon={Activity}
        eyebrow={vi ? "Mọi hoạt động đều ẩn danh" : "All activity anonymous"}
        title={vi ? "Bức tranh hiện tại" : "The picture so far"}
        accent={vi ? undefined : "picture"}
        lede={vi ? "Tổng hợp từ các lượt kiểm tra trong thư viện. Chỉ các vụ việc đã xác nhận mới được hiển thị riêng — mọi thứ khác chỉ đóng góp vào số liệu, không có tên người." : "Aggregates from every check run against the library. Individual cases are only ever shown when confirmed — everything else contributes to counts, never to names."}
      />
      <div className="mt-10">
        <DashboardView data={data} activity={activity} />
      </div>
    </div>
  );
}
