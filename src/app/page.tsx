import Link from "next/link";

import { Button } from "@/components/ui/button";
import { TierBadge } from "@/components/tier-badge";
import { HomeStats } from "@/components/home-stats";
import { tierMeta } from "@/lib/tier";
import type { Tier } from "@/lib/schema";

const tiers: Tier[] = ["watch", "caution", "warning"];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      {/* Hero — the two actions are the thesis */}
      <section className="py-16 sm:py-24">
        <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
          Media literacy, one case at a time
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Check it before you trust it.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Media Detective investigates suspicious messages, calls, and
          screenshots — and explains the manipulation techniques it finds in
          plain language, so you spot the next one yourself.{" "}
          <span className="text-foreground">AI assists, you decide.</span>
        </p>
        <HomeStats />
      </section>

      {/* The two entry actions */}
      <section className="grid gap-4 pb-16 sm:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <p className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
            Action · when you&rsquo;re unsure
          </p>
          <h2 className="mt-2 text-xl font-semibold">Check content</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Paste a message, describe a call, or upload a screenshot. You get a
            confidence tier, the manipulation techniques found, and a
            plain-language explanation. Private by default — shared only if you
            choose to.
          </p>
          <Button asChild className="mt-5">
            <Link href="/detect">Check content</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <p className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
            Action · when you already know
          </p>
          <h2 className="mt-2 text-xl font-semibold">Report a scam</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            It already happened to you? Your account is the warning. Publish a
            structured case file — never the raw content — so others recognize
            the same playbook sooner.
          </p>
          <Button asChild variant="outline" className="mt-5">
            <Link href="/report">Report a scam</Link>
          </Button>
        </div>
      </section>

      {/* Confidence tiers */}
      <section className="border-t py-12">
        <p className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
          Confidence tiers — never a bare number
        </p>
        <div className="mt-5 grid gap-6 sm:grid-cols-3">
          {tiers.map((tier) => (
            <div key={tier}>
              <TierBadge tier={tier} />
              <p className="mt-2 text-sm text-muted-foreground">
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
      <section className="border-t py-12">
        <p className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
          Privacy by design
        </p>
        <p className="text-redacted mt-4 text-lg" aria-hidden="true">
          ████████████ ███ ████████ █████ ████████████████
        </p>
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
