"use client";

import { useI18n } from "@/lib/i18n";

export function BusinessSkeletons() {
  return (
    <div className="grid gap-4 md:grid-cols-2" aria-label="Memuat daftar usaha" aria-busy="true">
      {[0, 1, 2, 3].map((item) => <div key={item} className={`animate-pulse rounded-[1.6rem] border border-slate-200/70 bg-white/80 p-6 dark:border-white/10 dark:bg-white/5 ${item === 0 ? "md:col-span-2" : ""}`}><div className="flex items-center gap-3"><div className="size-12 rounded-2xl bg-slate-200/70 dark:bg-white/10"/><div className="flex-1"><div className="h-3 w-20 rounded bg-slate-200/70 dark:bg-white/10"/><div className="mt-2 h-4 w-40 rounded bg-slate-200/70 dark:bg-white/10"/></div></div><div className="mt-6 h-3 w-full rounded bg-slate-200/60 dark:bg-white/10"/><div className="mt-2 h-3 w-4/5 rounded bg-slate-200/60 dark:bg-white/10"/><div className="mt-6 h-10 w-36 rounded-xl bg-slate-200/70 dark:bg-white/10"/></div>)}
    </div>
  );
}
interface EmptyStateProps {
  favoritesOnly: boolean;
  hasListings: boolean;
  onReset: () => void;
}

export function EmptyState({ favoritesOnly, hasListings, onReset }: EmptyStateProps) {
  const { t } = useI18n();
  const title = favoritesOnly ? t("empty.noFav") : hasListings ? t("empty.noResult") : t("empty.noFav");
  const description = favoritesOnly
    ? t("empty.noFavDesc")
    : hasListings
      ? t("empty.noResultDesc")
      : t("empty.noFavDesc");
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-300/80 bg-white/80 px-6 py-14 text-center sm:py-20 dark:border-white/15 dark:bg-white/5">
      <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 text-3xl shadow-sm dark:from-violet-400/10 dark:to-fuchsia-400/10" aria-hidden="true">{favoritesOnly ? "♥" : hasListings ? "🔍" : "✨"}</span>
      <h3 className="mt-5 text-xl font-bold tracking-[-.03em] text-slate-900 dark:text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
      {!hasListings && !favoritesOnly ? <a href="#daftar" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 px-5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-30px_rgba(236,72,153,0.9)]">{t("nav.list")}</a> : <button type="button" onClick={onReset} className="mt-6 rounded-xl border border-slate-200/70 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-white/10 dark:text-slate-200 dark:hover:border-fuchsia-400 dark:hover:bg-fuchsia-400/10 dark:hover:text-fuchsia-200">{favoritesOnly ? t("mobile.explore") : t("empty.reset")}</button>}
    </div>
  );
}
