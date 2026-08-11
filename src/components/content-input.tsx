"use client";

import { useRef, useState } from "react";
import { ImagePlus, Lock, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { DetectRequest, Source } from "@/lib/schema";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // keeps browser OCR responsive on common devices

const placeholders: Record<Source, string> = {
  text: "Paste the message here — from Zalo, Facebook, SMS, anywhere…",
  screenshot: "",
};

/**
 * The shared input UI for Detect and Report. Screenshot bytes stay in the
 * browser; only locally extracted OCR text is sent for analysis.
 */
export function ContentInput({
  busy,
  submitLabel,
  onSubmit,
}: {
  busy: boolean;
  submitLabel: string;
  onSubmit: (payload: DetectRequest) => void;
}) {
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

  function pickImage(file: File | undefined) {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That file is not an image — choose a screenshot.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("That image is over 4 MB — crop or compress it first.");
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
            "No readable text was found. Try a sharper screenshot or paste the message instead.",
          );
          return;
        }
        onSubmit({ source: "screenshot", text: extractedText });
      } catch {
        setError("Text could not be read from that screenshot. Try pasting the message instead.");
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
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7)] sm:p-6">
      <Tabs
        value={source}
        onValueChange={(v) => {
          setSource(v as Source);
          setError(null);
        }}
      >
        <TabsList className="w-full">
          <TabsTrigger value="text" className="flex-1">
            Paste text
          </TabsTrigger>
          <TabsTrigger value="screenshot" className="flex-1">
            Screenshot
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4">
        {source === "screenshot" ? (
          image ? (
            <div className="relative overflow-hidden rounded-md border">
              {/* eslint-disable-next-line @next/next/no-img-element -- transient local preview, never uploaded elsewhere */}
              <img
                src={image.dataUrl}
                alt="Screenshot to analyze"
                className="max-h-72 w-full object-contain bg-muted"
              />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 rounded-full bg-background/90 p-1.5 shadow-sm border"
                aria-label="Remove screenshot"
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
              className="flex min-h-36 w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              <ImagePlus className="size-5" />
              <span className="text-sm">
                Drop a screenshot here, or click to browse
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Lock className="size-3" />
                Text is read in this browser — the image never leaves your device
              </span>
            </button>
          )
        ) : (
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholders[source]}
            className="min-h-36 resize-y text-base"
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

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3" />
          Raw content is never stored
        </p>
        <Button onClick={submit} disabled={!canSubmit} size="lg" className="rounded-full">
          {ocrBusy ? "Reading screenshot…" : busy ? "Analyzing…" : submitLabel}
        </Button>
      </div>
    </div>
  );
}
