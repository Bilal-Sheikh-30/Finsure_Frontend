const CATEGORY_BADGE_PALETTE = [
  "border-sky-500/25 bg-sky-500/10 text-sky-300",
  "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  "border-amber-500/25 bg-amber-500/10 text-amber-300",
  "border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-300",
  "border-cyan-500/25 bg-cyan-500/10 text-cyan-300",
  "border-lime-500/25 bg-lime-500/10 text-lime-300",
  "border-orange-500/25 bg-orange-500/10 text-orange-300",
  "border-violet-500/25 bg-violet-500/10 text-violet-300",
] as const;

const UNCATEGORIZED_STYLE =
  "border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)]";

const hashCategory = (value: string) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
};

export const getCategoryBadgeClassName = (category?: string | null) => {
  const normalized = (category || "Uncategorized").trim();
  if (!normalized || normalized.toLowerCase() === "uncategorized") {
    return UNCATEGORIZED_STYLE;
  }

  return CATEGORY_BADGE_PALETTE[
    hashCategory(normalized.toLowerCase()) % CATEGORY_BADGE_PALETTE.length
  ];
};
