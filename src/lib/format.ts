/** Small display helpers shared across flows. */

/** 181000000000 → "₫181 billion"; 4,000,000,000 → "₫4 billion" */
export function formatVnd(amount: number): string {
  if (amount >= 1_000_000_000) {
    const billions = amount / 1_000_000_000;
    return `₫${Number(billions.toFixed(1))} billion`;
  }
  if (amount >= 1_000_000) {
    return `₫${Number((amount / 1_000_000).toFixed(1))} million`;
  }
  return `₫${amount.toLocaleString("en-US")}`;
}

/** "mock-1785817001246" → "#1246"; "seed-001" → "#SEED-001" */
export function shortCaseRef(id: string): string {
  if (id.startsWith("seed-")) return `#${id.toUpperCase()}`;
  const tail = id.replace(/\D/g, "").slice(-4);
  return `#${tail || id.slice(0, 8).toUpperCase()}`;
}

/** ISO string → "JAN 20 2026" (case-file meta style) */
export function formatCaseDate(iso: string): string {
  const d = new Date(iso);
  return d
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .toUpperCase();
}
