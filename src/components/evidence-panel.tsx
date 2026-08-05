import {
  ExternalLink,
  SearchCheck,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import type { AnalysisResult, ExternalEvidence } from "@/lib/schema";

function verificationActions(analysis: AnalysisResult) {
  const actions = [
    "Open the original source, then check who published it and when.",
  ];

  if (analysis.category === "misinformation") {
    actions.push(
      "Compare the claim with a primary source or credible independent reporting.",
    );
  }
  if (analysis.techniques.includes("decontextualization")) {
    actions.push(
      "Find the original image or video before trusting its caption or date.",
    );
  }
  if (analysis.techniques.includes("character_attack")) {
    actions.push(
      "Do not share an accusation about a private person before verified evidence exists.",
    );
  }
  if (analysis.category === "deepfake_impersonation") {
    actions.push(
      "Use a known phone number or another trusted channel to verify the person.",
    );
  }

  return actions.slice(0, 3);
}

/** Contextual evidence and follow-up checks. Neither can change the AI tier. */
export function EvidencePanel({
  analysis,
  evidence,
}: {
  analysis: AnalysisResult;
  evidence: ExternalEvidence;
}) {
  const actions = verificationActions(analysis);
  const factChecksRequested = evidence.factChecks.status !== "not_requested";
  const urlSafetyRequested = evidence.urlSafety.status !== "not_requested";

  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <SearchCheck className="size-4.5" />
        </span>
        <div>
          <h2 className="font-semibold">What to check next</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            These steps and sources add context. They do not change the AI signal
            above.
          </p>
        </div>
      </div>

      <ol className="mt-4 space-y-2 text-sm">
        {actions.map((action, index) => (
          <li key={action} className="flex gap-2.5">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-muted-foreground">
              {index + 1}
            </span>
            <span>{action}</span>
          </li>
        ))}
      </ol>

      {(factChecksRequested || urlSafetyRequested) && (
        <div className="mt-5 space-y-4 border-t border-border/70 pt-5">
          {factChecksRequested && <FactChecks evidence={evidence} />}
          {urlSafetyRequested && <UrlSafety evidence={evidence} />}
        </div>
      )}
    </section>
  );
}

function FactChecks({ evidence }: { evidence: ExternalEvidence }) {
  const { factChecks } = evidence;
  if (factChecks.status === "not_configured") {
    return (
      <EvidenceNote>
        Published fact-check search is not configured for this deployment.
      </EvidenceNote>
    );
  }
  if (factChecks.status === "unavailable") {
    return (
      <EvidenceNote>
        Published fact-check search is temporarily unavailable. Check the original
        source manually.
      </EvidenceNote>
    );
  }
  if (factChecks.status === "available" && factChecks.results.length === 0) {
    return (
      <EvidenceNote>
        No matching published fact check was found. This does not confirm the
        claim.
      </EvidenceNote>
    );
  }
  if (factChecks.status !== "available") return null;

  return (
    <div>
      <p className="text-sm font-medium">Published fact checks</p>
      <div className="mt-2 space-y-2">
        {factChecks.results.map((result) => (
          <a
            key={result.url}
            href={result.url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl bg-secondary/60 p-3 text-sm transition-colors hover:bg-secondary"
          >
            <span className="flex items-center gap-1.5 font-medium">
              {result.publisher}
              <ExternalLink className="size-3.5" />
            </span>
            <span className="mt-1 block text-muted-foreground">
              {result.title}
            </span>
            {result.verdict && (
              <span className="mt-1 block text-xs text-muted-foreground">
                Verdict: {result.verdict}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

function UrlSafety({ evidence }: { evidence: ExternalEvidence }) {
  const { urlSafety } = evidence;
  if (urlSafety.status === "not_configured") {
    return (
      <EvidenceNote>
        Public-link safety lookup is not configured for this deployment.
      </EvidenceNote>
    );
  }
  if (urlSafety.status === "unavailable") {
    return (
      <EvidenceNote>
        Public-link safety lookup is temporarily unavailable. Do not open an
        unfamiliar link.
      </EvidenceNote>
    );
  }
  if (!urlSafety.result) return null;

  const flagged =
    urlSafety.result.maliciousCount + urlSafety.result.suspiciousCount > 0;
  const Icon = flagged ? ShieldAlert : ShieldCheck;
  return (
    <div className="rounded-xl bg-secondary/60 p-3 text-sm">
      <p className="flex items-center gap-1.5 font-medium">
        <Icon
          className={flagged ? "size-4 text-destructive" : "size-4 text-primary"}
        />
        Public-link security signals
      </p>
      <p className="mt-1 text-muted-foreground">
        {flagged
          ? `${urlSafety.result.maliciousCount} malicious and ${urlSafety.result.suspiciousCount} suspicious provider flags were returned.`
          : "No provider flags were returned. This is not proof that the link is safe."}
      </p>
    </div>
  );
}

function EvidenceNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl bg-secondary/60 p-3 text-sm text-muted-foreground">
      {children}
    </p>
  );
}
