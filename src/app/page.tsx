import Link from "next/link";
import {
  ArrowRight,
  Lock,
  ScanSearch,
  ShieldQuestion,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { TierBadge } from "@/components/tier-badge";
import { RedactedLine } from "@/components/redacted-line";
import { HeroIntro } from "@/components/hero-intro";
import { HomeStats } from "@/components/home-stats";
import { HomeSignalPreview } from "@/components/home-signal-preview";
import { tierMeta } from "@/lib/tier";
import type { Tier } from "@/lib/schema";

const tiers: Tier[] = ["watch", "caution", "warning"];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* The product story, not just product copy: an urgent message becomes a pause. */}
      <section className="grid items-center gap-10 py-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,0.78fr)] lg:py-20">
        <HeroIntro>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-muted-foreground">
            <ScanSearch className="size-3.5" />
            Media literacy, one case at a time
          </span>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Pause before you act on it.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            An urgent call, a too-good offer, a viral accusation — Media
            Detective helps you see what is happening before money moves or a
            post spreads. {" "}
            <span className="text-foreground">AI assists, you decide.</span>
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              render={<Link href="/detect" />}
              nativeButton={false}
              size="lg"
              className="rounded-full"
            >
              Check content
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              render={<Link href="/report" />}
              nativeButton={false}
              variant="outline"
              size="lg"
              className="rounded-full"
            >
              Report a case
            </Button>
          </div>
          <HomeStats />
        </HeroIntro>
        <HomeSignalPreview />
      </section>

      {/* Confidence tiers */}
      <section className="border-t border-border/70 py-12 lg:py-16">
        <p className="flex items-center gap-2 text-sm font-medium">
          <ShieldQuestion className="size-4 text-muted-foreground" />
          How confident is the AI? Never a bare number.
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
          Even the lowest tier never means &ldquo;safe&rdquo; — only that
          nothing was flagged yet. No result is ever 100% accurate.
        </p>
      </section>

      {/* Privacy by design */}
      <section className="border-t border-border/70 py-12">
        <p className="flex items-center gap-2 text-sm font-medium">
          <Lock className="size-4 text-muted-foreground" />
          We never keep your message
        </p>
        <RedactedLine className="mt-4" />
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Raw messages and screenshots are analyzed in the moment and{" "}
          <span className="text-foreground">never stored</span> — only the
          structured assessment is kept: techniques, tier, and explanation.
          Names, phone numbers, and personal details never end up on a public
          page.
        </p>
      </section>
    </div>
  );
}
