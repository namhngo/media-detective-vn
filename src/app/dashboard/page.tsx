import type { Metadata } from "next";
import { Activity } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

import { DarkBand } from "@/components/dark-band";
import { DashboardView } from "@/components/dashboard-view";
import { PageHero } from "@/components/page-hero";
import { WorkspaceBackdrop } from "@/components/workspace-backdrop";
import { getUserActivity } from "@/lib/activity";
import { getDashboardData } from "@/lib/dashboard";
import { getServerLanguage } from "@/lib/server-i18n";

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
    <div className="torch-workspace">
      <DarkBand className="max-w-5xl">
        <PageHero
          dark
          eyebrowIcon={Activity}
          eyebrow={vi ? "Mọi hoạt động đều ẩn danh" : "All activity anonymous"}
          title={vi ? "Bức tranh hiện tại" : "The picture so far"}
          accent={vi ? undefined : "picture"}
          lede={
            vi
              ? "Tổng hợp từ các lượt kiểm tra trong thư viện. Chỉ các vụ việc đã xác nhận mới được hiển thị riêng — mọi thứ khác chỉ đóng góp vào số liệu, không có tên người."
              : "Aggregates from every check run against the library. Individual cases are only ever shown when confirmed — everything else contributes to counts, never to names."
          }
        />
      </DarkBand>
      <section className="relative isolate min-h-[calc(100svh-16rem)] overflow-hidden bg-background/70 py-10 sm:py-14">
        <WorkspaceBackdrop />
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <DashboardView data={data} activity={activity} />
        </div>
      </section>
    </div>
  );
}
