import type { Metadata } from "next";
import { MessageSquareText } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

import { DarkBand } from "@/components/dark-band";
import { ReportFlow } from "@/components/report-flow";
import { PageHero } from "@/components/page-hero";
import { WorkspaceBackdrop } from "@/components/workspace-backdrop";
import { getServerLanguage, serverT } from "@/lib/server-i18n";

export const metadata: Metadata = {
  title: "Report a case — Media Detective Vietnam",
};

export default async function ReportPage() {
  await auth.protect();
  const language = await getServerLanguage();
  const vi = language === "vi";

  return (
    <div className="torch-workspace">
      <DarkBand>
        <PageHero
          dark
          eyebrowIcon={MessageSquareText}
          eyebrow={serverT(language, "accountWarning")}
          title={serverT(language, "reportTitle")}
          accent={vi ? undefined : "light"}
          lede={serverT(language, "reportLead")}
        />
      </DarkBand>
      <section className="relative isolate min-h-[calc(100svh-16rem)] overflow-hidden bg-background/70 py-10 sm:py-14">
        <WorkspaceBackdrop />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ReportFlow />
        </div>
      </section>
    </div>
  );
}
