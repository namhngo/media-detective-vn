"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Forward, Megaphone, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  FacebookIcon,
  LinkedInIcon,
  WhatsAppIcon,
  XIcon,
} from "@/components/brand-icons";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n-provider";

const APP_URL = "https://media-detective-vn.vercel.app";

function buildCaption(url: string, language: "en" | "vi") {
  if (language === "vi") {
    return `Hãy kiểm tra bài đăng đáng ngờ trước khi chia sẻ.

Media Detective giúp bạn nhận ra thủ đoạn lừa đảo và thông tin sai lệch, xác minh tuyên bố và tự quyết định.

Thử ngay: ${url}

#MediaLiteracy #UNESCO #AIandMIL #Vietnam`;
  }
  return `Check suspicious posts before sharing.

Media Detective helps you spot scam and misinformation patterns, verify claims, and decide for yourself.

Try it: ${url}

#MediaLiteracy #UNESCO #AIandMIL #Vietnam`;
}

/**
 * Promotes the app itself — never a specific case. Shares only the public app
 * URL and a prebuilt caption; nothing the user ever checked is included.
 */
export function ShareApp({
  variant = "outline",
  size = "lg",
  className,
  floating = false,
}: {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "xs" | "sm" | "lg";
  className?: string;
  /** Round fixed button in the bottom-right corner of every page. */
  floating?: boolean;
}) {
  const { language, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"caption" | "link" | null>(null);

  // The dialog only opens after client interaction, so this never diverges
  // between server render and hydration.
  const canNativeShare =
    open && typeof navigator !== "undefined" && "share" in navigator;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const url = APP_URL;
  const caption = buildCaption(url, language);

  const platforms = [
    {
      name: "Facebook",
      icon: FacebookIcon,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: "WhatsApp",
      icon: WhatsAppIcon,
      href: `https://wa.me/?text=${encodeURIComponent(caption)}`,
    },
    {
      name: "X",
      icon: XIcon,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}`,
    },
    {
      name: "LinkedIn",
      icon: LinkedInIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ];

  async function copy(text: string, kind: "caption" | "link") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      toast.success(kind === "caption" ? t("shareCaptionCopied") : t("shareLinkCopied"));
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error(t("shareCopyFailed"));
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({
        title: "Media Detective Vietnam",
        text: caption,
        url,
      });
    } catch {
      // User dismissed the share sheet — nothing to do.
    }
  }

  return (
    <>
      {floating ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
           aria-label={t("shareAppAria")}
          className="fixed right-5 bottom-5 z-40 flex size-12 items-center justify-center rounded-full bg-amber-400 text-[#0A0E1A] shadow-[0_0_28px_rgba(251,191,36,0.28)] transition-transform hover:scale-105 hover:bg-amber-300 focus-visible:ring-3 focus-visible:ring-amber-300/50 focus-visible:outline-none"
        >
          <Forward className="size-5" />
        </button>
      ) : (
        <Button
          variant={variant}
          size={size}
          className={cn("rounded-full", className)}
          onClick={() => setOpen(true)}
        >
          <Megaphone data-icon="inline-start" />
           {t("shareApp")}
        </Button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
             aria-label={t("shareAppAria")}
            className="torch-overlay torch-panel w-full max-w-md rounded-2xl p-5 sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">
                  {t("shareAppTitle")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("shareAppBody")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                 aria-label={language === "vi" ? "Đóng" : "Close"}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {platforms.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2.5 rounded-xl bg-secondary/60 px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  <platform.icon className="size-4 text-muted-foreground" />
                  {platform.name}
                </a>
              ))}
            </div>

            <div className="mt-4 rounded-xl bg-secondary/60 p-3.5">
              <p className="text-xs font-medium text-muted-foreground">
                 {t("sharePrebuilt")}
              </p>
              <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed">
                {caption}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="rounded-full"
                onClick={() => copy(caption, "caption")}
              >
                {copied === "caption" ? (
                  <Check data-icon="inline-start" />
                ) : (
                  <Copy data-icon="inline-start" />
                )}
                 {t("shareCopyCaption")}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="rounded-full"
                onClick={() => copy(url, "link")}
              >
                {copied === "link" ? (
                  <Check data-icon="inline-start" />
                ) : (
                  <Copy data-icon="inline-start" />
                )}
                 {t("shareCopyLink")}
              </Button>
              {canNativeShare && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  onClick={nativeShare}
                >
                  <Forward data-icon="inline-start" />
                   {t("shareMore")}
                </Button>
              )}
            </div>

            <p className="mt-4 border-t border-border/70 pt-3 text-xs text-muted-foreground">
               {t("shareAppNote")}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
