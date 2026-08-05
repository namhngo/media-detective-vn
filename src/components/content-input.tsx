"use client";

import { useRef, useState } from "react";
import { ImagePlus, Lock, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { DetectRequest, Source } from "@/lib/schema";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // stays under the serverless body limit

const placeholders: Record<Source, string> = {
  text: "Paste the message here — from Zalo, Facebook, SMS, anywhere…",
  screenshot: "",
};

/**
 * The shared input UI for Detect and Report — tabs for text and screenshots.
 * Raw content lives here only; it is sent for analysis and never stored.
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
  const [externalEvidence, setExternalEvidence] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const canSubmit =
    !busy && (source === "screenshot" ? image !== null : text.trim().length > 0);

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

  function submit() {
    setError(null);
    if (source === "screenshot") {
      if (!image) return;
      onSubmit({
        source: "screenshot",
        imageBase64: image.dataUrl,
        externalEvidence,
      });
    } else {
      const trimmed = text.trim();
      if (!trimmed) return;
      onSubmit({ source, text: trimmed, externalEvidence });
    }
  }

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
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
                Analyzed in the moment — never stored
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

      <label className="mt-4 flex cursor-pointer items-start gap-2.5 rounded-xl bg-secondary/60 p-3 text-xs leading-relaxed text-muted-foreground">
        <input
          type="checkbox"
          checked={externalEvidence}
          onChange={(event) => setExternalEvidence(event.target.checked)}
          className="mt-0.5 size-3.5 accent-primary"
        />
        <span>
          Search published fact checks and check any public link. We send only
          derived claims and a link without its query parameters to external
          services; your original content is never stored.
        </span>
      </label>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3" />
          Raw content is never stored
        </p>
        <Button onClick={submit} disabled={!canSubmit} size="lg" className="rounded-full">
          {busy ? "Analyzing…" : submitLabel}
        </Button>
      </div>
    </div>
  );
}
