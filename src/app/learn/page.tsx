import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";

import { SignalRun } from "@/components/signal-run";
import { getPrisma } from "@/lib/db";
import { milFactPublicSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Mini game — Media Detective Vietnam",
};

export default async function LearnPage() {
  await auth.protect();
  const prisma = getPrisma();
  const facts = await prisma.milFact.findMany({
    where: { reviewed: true },
    orderBy: { id: "asc" },
    select: { id: true, category: true, fact: true, source: true },
  });

  return (
    <div className="torch-workspace min-h-[calc(100svh-8rem)]">
      <section className="relative overflow-hidden bg-[#0b0b0c] text-white">
        <div className="pointer-events-none absolute -right-40 -top-56 size-[34rem] rounded-full bg-amber-300/10 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <SignalRun facts={facts.map((fact) => milFactPublicSchema.parse(fact))} />
        </div>
      </section>
    </div>
  );
}
