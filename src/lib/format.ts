/** Small display helpers shared across flows. */

/** 181000000000 → "₫181 billion"; 4,000,000,000 → "₫4 billion" */
export function formatVnd(amount: number, language: Language = "en"): string {
  if (amount >= 1_000_000_000) {
    const billions = amount / 1_000_000_000;
    return language === "vi"
      ? `₫${Number(billions.toFixed(1))} tỷ`
      : `₫${Number(billions.toFixed(1))} billion`;
  }
  if (amount >= 1_000_000) {
    return language === "vi"
      ? `₫${Number((amount / 1_000_000).toFixed(1))} triệu`
      : `₫${Number((amount / 1_000_000).toFixed(1))} million`;
  }
  return `₫${amount.toLocaleString(language === "vi" ? "vi-VN" : "en-US")}`;
}

/** "mock-1785817001246" → "#1246"; internal public case id → "#CASE-001" */
export function shortCaseRef(id: string): string {
  if (id.startsWith("seed-")) return `#CASE-${id.slice("seed-".length).toUpperCase()}`;
  const tail = id.replace(/\D/g, "").slice(-4);
  return `#${tail || id.slice(0, 8).toUpperCase()}`;
}

/** ISO string → "JAN 20 2026" (case-file meta style) */
export function formatCaseDate(iso: string, language: Language = "en"): string {
  const d = new Date(iso);
  return d
    .toLocaleDateString(language === "vi" ? "vi-VN" : "en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .toUpperCase();
}
import type { Language } from "@/lib/i18n";
