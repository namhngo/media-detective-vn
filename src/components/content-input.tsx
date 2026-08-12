"use client";

import { useRef, useState } from "react";
import { ImagePlus, Lock, MessageSquareText, ScanSearch, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { DetectRequest, Source } from "@/lib/schema";
import { useI18n } from "@/components/i18n-provider";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // keeps browser OCR responsive on common devices

/**
 * The shared input UI for Detect and Report. Screenshot bytes stay in the
 * browser; only locally extracted OCR text is sent for analysis.
 */
export function ContentInput({
  busy,
  submitLabel,
  onSubmit,
  mode = "detect",
}: {
  busy: boolean;
  submitLabel: string;
  onSubmit: (payload: DetectRequest) => void;
  mode?: "detect" | "report";
}) {
  const { t } = useI18n();
  const [source, setSource] = useState<Source>("text");
  const [text, setText] = useState("");
  const [image, setImage] = useState<{ dataUrl: string; name: string } | null>(
    null,
  );
  const [ocrBusy, setOcrBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const canSubmit =
    !busy &&
    !ocrBusy &&
    (source === "screenshot" ? image !== null : text.trim().length > 0);
  const IntakeIcon = mode === "detect" ? ScanSearch : MessageSquareText;
  const intakeCopy =
    mode === "detect"
      ? {
          overline: t("inputSignal"),
          title: t("inputSignalTitle"),
          step: "01",
        }
      : {
          overline: t("inputReport"),
          title: t("inputReportTitle"),
          step: "01",
        };

  function pickImage(file: File | undefined) {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError(t("inputNotImage"));
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError(t("inputTooLarge"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setImage({ dataUrl: String(reader.result), name: file.name });
    reader.readAsDataURL(file);
  }

  async function submit() {
    setError(null);
    if (source === "screenshot") {
      if (!image) return;
      setOcrBusy(true);
      try {
        const { createWorker } = await import("tesseract.js");
        const worker = await createWorker("eng+vie");
        let extractedText = "";
        try {
          const { data } = await worker.recognize(image.dataUrl);
          extractedText = data.text.trim();
        } finally {
          await worker.terminate();
        }
        if (!extractedText) {
          setError(
            t("inputNoText"),
          );
          return;
        }
        onSubmit({ source: "screenshot", text: extractedText });
      } catch {
        setError(t("inputOcrFailed"));
      } finally {
        setOcrBusy(false);
      }
    } else {
      const trimmed = text.trim();
      if (!trimmed) return;
      onSubmit({ source, text: trimmed });
    }
  }

  return (
    <div className="torch-panel rounded-3xl p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary ring-1 ring-primary/20">
            <IntakeIcon className="size-4" />
          </span>
          <div>
            <p className="torch-overline">{intakeCopy.overline}</p>
            <p className="mt-1 text-sm font-medium">{intakeCopy.title}</p>
          </div>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {intakeCopy.step}
        </span>
      </div>
      <Tabs
        value={source}
        onValueChange={(v) => {
          setSource(v as Source);
          setError(null);
        }}
      >
        <TabsList className="w-full bg-background/75 ring-1 ring-white/5">
          <TabsTrigger value="text" className="flex-1">
            {t("inputPaste")}
          </TabsTrigger>
          <TabsTrigger value="screenshot" className="flex-1">
            {t("inputScreenshot")}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4">
        {source === "screenshot" ? (
          image ? (
            <div className="torch-inset relative overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element -- transient local preview, never uploaded elsewhere */}
              <img
                src={image.dataUrl}
                alt={t("inputScreenshotAlt")}
                className="max-h-72 w-full object-contain bg-background"
              />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 rounded-full border border-white/10 bg-background/90 p-1.5 shadow-sm"
                aria-label={t("inputRemove")}
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                pickImage(e.dataTransfer.files?.[0]);
              }}
              className="torch-inset flex min-h-44 w-full flex-col items-center justify-center gap-2 rounded-2xl border-dashed text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ImagePlus className="size-5" />
              </span>
              <span className="text-sm">
                {t("inputDrop")}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Lock className="size-3" />
                {t("inputLocalOcr")}
              </span>
            </button>
          )
        ) : (
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={source === "text" ? t("inputPlaceholder") : ""}
            className="min-h-44 resize-y rounded-2xl border-white/10 bg-background/70 p-4 text-base"
          />
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => pickImage(e.target.files?.[0])}
        />
      </div>

      {error && (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/[0.08] pt-4">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3" />
          {t("inputPrivate")}
        </p>
        <Button
          onClick={submit}
          disabled={!canSubmit}
          size="lg"
          className="rounded-full shadow-[0_0_28px_rgba(251,191,36,0.16)]"
        >
          {ocrBusy ? t("inputReading") : busy ? t("inputAnalyzing") : submitLabel}
        </Button>
      </div>
    </div>
  );
}
