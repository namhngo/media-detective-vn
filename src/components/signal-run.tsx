"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  Cpu,
  HeartPulse,
  RotateCcw,
  SearchCheck,
  Share2,
  X,
} from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/components/i18n-provider";
import type { MilFactPublic } from "@/lib/schema";

type LensId = MilFactPublic["category"];

const LENSES: Array<{
  id: LensId;
  labelKey:
    | "signalSource"
    | "signalEmotion"
    | "signalSystem"
    | "signalShare";
  hintKey:
    | "signalSourceHint"
    | "signalEmotionHint"
    | "signalSystemHint"
    | "signalShareHint";
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: "source-verification",
    labelKey: "signalSource",
    hintKey: "signalSourceHint",
    icon: SearchCheck,
  },
  {
    id: "emotional-manipulation",
    labelKey: "signalEmotion",
    hintKey: "signalEmotionHint",
    icon: HeartPulse,
  },
  {
    id: "technical-ai-literacy",
    labelKey: "signalSystem",
    hintKey: "signalSystemHint",
    icon: Cpu,
  },
  {
    id: "sharing-responsibility",
    labelKey: "signalShare",
    hintKey: "signalShareHint",
    icon: Share2,
  },
];

function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [next[index], next[swap]] = [next[swap]!, next[index]!];
  }
  return next;
}

/** A short, fact-driven routing game for active MIL practice. */
export function SignalRun({ facts }: { facts: MilFactPublic[] }) {
  const { t } = useI18n();
  const [started, setStarted] = useState(false);
  const [roundFacts, setRoundFacts] = useState(() => facts.slice(0, 5));
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedLens, setSelectedLens] = useState<LensId | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [finished, setFinished] = useState(false);

  const round = roundFacts[roundIndex];

  function startRun() {
    setRoundFacts(shuffle(facts).slice(0, 5));
    setRoundIndex(0);
    setSelectedLens(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setFinished(false);
    setStarted(true);
  }

  function chooseLens(lensId: LensId) {
    if (!round || selectedLens !== null) return;
    setSelectedLens(lensId);
    if (lensId === round.category) {
      setScore((current) => current + 1);
      setStreak((current) => {
        const next = current + 1;
        setBestStreak((best) => Math.max(best, next));
        return next;
      });
    } else {
      setStreak(0);
    }
  }

  function nextRound() {
    if (roundIndex >= roundFacts.length - 1) {
      setFinished(true);
      return;
    }
    setRoundIndex((current) => current + 1);
    setSelectedLens(null);
  }

  if (facts.length === 0) {
    return <p className="text-white/70">{t("signalNoFacts")}</p>;
  }

  if (!started) {
    return (
      <div className="max-w-3xl">
        <p className="torch-overline">{t("signalEyebrow")}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
          {t("signalTitle")}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/65">
          {t("signalLead")}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={startRun}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-amber-300 px-5 text-sm font-semibold text-[#0b0b0c] hover:bg-amber-200"
          >
            <ArrowRight className="size-4" />
            {t("signalStart")}
          </button>
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-medium text-white/80 hover:bg-white/10"
          >
            {t("learnBackDashboard")}
          </Link>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="max-w-3xl">
        <p className="torch-overline">{t("signalEyebrow")}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
          {t("signalNotebook")}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/65">
          {t("signalScore")}: {score}/{roundFacts.length} · {t("signalStreak")}: {bestStreak}
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/50">
          {t("signalNotebookLead")}
        </p>

        <div className="mt-8 grid gap-3">
          {roundFacts.map((fact) => {
            const lens = LENSES.find((item) => item.id === fact.category)!;
            const Icon = lens.icon;
            return (
              <article key={fact.id} className="rounded-2xl border border-white/10 bg-[#111113] p-5">
                <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-amber-300">
                  <Icon className="size-3.5" />
                  {t(lens.labelKey)}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/85">{fact.fact}</p>
                <p className="mt-3 text-xs text-white/40">{t("learnSource")}: {fact.source}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={startRun}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-amber-300 px-5 text-sm font-semibold text-[#0b0b0c] hover:bg-amber-200"
          >
            <RotateCcw className="size-4" />
            {t("signalRunAgain")}
          </button>
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-medium text-white/80 hover:bg-white/10"
          >
            {t("learnBackDashboard")}
          </Link>
        </div>
      </div>
    );
  }

  if (!round) return null;

  const correctLens = LENSES.find((lens) => lens.id === round.category)!;
  const correct = selectedLens === correctLens.id;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <p className="torch-overline">
          {t("signalRound")} {roundIndex + 1} {t("signalOf")} {roundFacts.length}
        </p>
        <p className="font-mono text-xs text-white/50">
          {t("signalStreak")}: {streak}
        </p>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-amber-300 transition-all duration-500"
          style={{ width: `${((roundIndex + 1) / roundFacts.length) * 100}%` }}
        />
      </div>

      <article className="mt-8 rounded-[2rem] border border-white/10 bg-[#111113] p-6 shadow-2xl sm:p-8">
        <p className="torch-overline">{t("signalFactTag")}</p>
        <p className="mt-5 text-2xl font-medium leading-snug text-white sm:text-3xl">
          {round.fact}
        </p>
        <p className="mt-4 text-xs text-white/40">
          {t("learnSource")}: {round.source}
        </p>

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-sm font-medium text-white/75">{t("signalPrompt")}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {LENSES.map((lens) => {
              const Icon = lens.icon;
              const selected = lens.id === selectedLens;
              const isCorrect = lens.id === correctLens.id;
              const className =
                selectedLens === null
                  ? "border-white/10 text-white/75 hover:border-amber-300/50 hover:bg-amber-300/10"
                  : isCorrect
                    ? "border-emerald-300/45 bg-emerald-300/10 text-emerald-50"
                    : selected
                      ? "border-rose-300/45 bg-rose-300/10 text-rose-100"
                      : "border-white/5 text-white/35";

              return (
                <button
                  key={lens.id}
                  type="button"
                  onClick={() => chooseLens(lens.id)}
                  className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${className}`}
                >
                  <Icon className="mt-0.5 size-5 shrink-0" />
                  <span>
                    <span className="block text-sm font-semibold">{t(lens.labelKey)}</span>
                    <span className="mt-1 block text-xs leading-relaxed opacity-70">{t(lens.hintKey)}</span>
                  </span>
                  {selectedLens !== null && isCorrect && <Check className="ml-auto size-4 shrink-0" />}
                  {selectedLens !== null && selected && !isCorrect && <X className="ml-auto size-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {selectedLens !== null && (
          <div
            className={`mt-6 rounded-xl border p-4 text-sm leading-relaxed ${
              correct
                ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-50"
                : "border-amber-300/25 bg-amber-300/10 text-white/80"
            }`}
          >
            <p className="font-semibold">{correct ? t("signalCorrect") : t("signalDifferent")}</p>
            <p className="mt-2">
              <span className="font-medium">{t("signalWhy")}:</span> {t(correctLens.hintKey)}
            </p>
          </div>
        )}

        {selectedLens !== null && (
          <button
            type="button"
            onClick={nextRound}
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-amber-300 px-5 text-sm font-semibold text-[#0b0b0c] hover:bg-amber-200"
          >
            {roundIndex === roundFacts.length - 1 ? t("learnFinish") : t("learnNext")}
            <ArrowRight className="size-4" />
          </button>
        )}
      </article>
    </div>
  );
}
