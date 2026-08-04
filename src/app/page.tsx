import Link from "next/link";
import { Lock, MessageSquareText, ScanSearch, Search, ShieldQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TierBadge } from "@/components/tier-badge";
import { RedactedLine } from "@/components/redacted-line";
import { HeroIntro } from "@/components/hero-intro";
import { HomeStats } from "@/components/home-stats";
import { tierMeta } from "@/lib/tier";
import type { Tier } from "@/lib/schema";

const tiers: Tier[] = ["watch", "caution", "warning"];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      {/* Hero — the two actions are the thesis. One motion cue, nothing else moves. */}
      <section className="py-16 sm:py-24">
        <HeroIntro>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-muted-foreground">
            <ScanSearch className="size-3.5" />
            Media literacy, one case at a time
          </span>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Check it before you trust it.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Media Detective investigates suspicious messages, calls, posts, and
            screenshots — and explains the manipulation techniques it finds in
            plain language, across scams, deepfakes, and fake news, so you spot
            the next one yourself.{" "}
            <span className="text-foreground">AI assists, you decide.</span>
          </p>
          <HomeStats />
        </HeroIntro>
      </section>

      {/* The two entry actions — a simple 2-way choice reads best as a plain
          pair, not a grid: research on bento layouts is explicit that forcing
          a hierarchy grid onto a 2-3 item proposition hurts comprehension. */}
      <section className="grid gap-4 pb-16 sm:grid-cols-2">
        <div className="group rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Search className="size-5" />
          </span>
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            When you&rsquo;re unsure
          </p>
          <h2 className="mt-1 text-xl font-semibold">Check content</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Paste a message, describe a call, or upload a screenshot — a scam
            attempt, a deepfake, or a viral claim you&rsquo;re not sure about.
            You get a confidence tier, the manipulation techniques found, and a
            plain-language explanation. Private by default — shared only if
            you choose to.
          </p>
          <Button
            render={<Link href="/detect" />}
            nativeButton={false}
            className="mt-5 rounded-full"
          >
            Check content
          </Button>
        </div>

        <div className="group rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-confirmed-user/10 text-confirmed-user">
            <MessageSquareText className="size-5" />
          </span>
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            When you already know
          </p>
          <h2 className="mt-1 text-xl font-semibold">Report a case</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            It already happened to you — a scam, or a viral lie that targeted
            you? Your account is the warning. Publish a structured case file —
            never the raw content — so others recognize the same playbook
            sooner.
          </p>
          <Button
            render={<Link href="/report" />}
            nativeButton={false}
            variant="outline"
            className="mt-5 rounded-full"
          >
            Report a case
          </Button>
        </div>
      </section>

      {/* Confidence tiers */}
      <section className="border-t border-border/70 py-12">
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
