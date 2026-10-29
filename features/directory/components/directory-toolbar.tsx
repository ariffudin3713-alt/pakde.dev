"use client";

import { CATEGORIES, type Category, type SortOrder } from "@/lib/types";
import type { ReactNode } from "react";
import { useI18n } from "@/lib/i18n";

interface DirectoryToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  category: Category | "Semua";
  onCategoryChange: (category: Category | "Semua") => void;
  city: string;
  onCityChange: (city: string) => void;
  cities: string[];
  categoryCounts: Record<Category, number>;
  sort: SortOrder;
  onSortChange: (sort: SortOrder) => void;
  favoritesOnly: boolean;
  onFavoritesChange: () => void;
  onClearAll: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export function DirectoryToolbar(props: DirectoryToolbarProps) {
  const { t } = useI18n();
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-[var(--shadow-soft)] sm:p-5 dark:border-white/10 dark:bg-white/5">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <label className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200/70 bg-slate-50/60 px-3.5 transition-all duration-200 ease-out focus-within:border-violet-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-500/10 dark:border-white/10 dark:bg-white/5 dark:focus-within:bg-transparent">
          <span className="text-violet-500" aria-hidden="true"><SearchIcon /></span>
          <span className="sr-only">{t("toolbar.search")}</span>
          <input id="directory-query" value={props.query} onChange={(event) => props.onQueryChange(event.target.value)} placeholder={t("toolbar.searchPlaceholder")} className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white" />
          {props.query && <button type="button" onClick={() => props.onQueryChange("")} className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-white" aria-label="Hapus pencarian">×</button>}
          {!props.query && <kbd className="hidden rounded-md border border-slate-200/70 bg-white px-2 py-1 text-[10px] text-slate-400 sm:inline dark:border-white/10 dark:bg-white/5">/</kbd>}
        </label>
        <button type="button" onClick={props.onRefresh} disabled={props.refreshing} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200/70 px-4 text-xs font-semibold text-slate-700 transition-all duration-200 ease-out hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 active:scale-[.98] disabled:opacity-60 dark:border-white/10 dark:text-slate-200 dark:hover:border-fuchsia-400 dark:hover:bg-fuchsia-400/10 dark:hover:text-fuchsia-200">
          <span className={props.refreshing ? "animate-spin" : ""} aria-hidden="true">↻</span>{props.refreshing ? t("toolbar.refreshing") : t("toolbar.refresh")}
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label="Filter kategori">
          <CategoryPill active={props.category === "Semua"} onClick={() => props.onCategoryChange("Semua")}>{t("toolbar.allCat")} <span className={props.category === "Semua" ? "text-white/70" : "text-slate-400 dark:text-slate-400"}>{Object.values(props.categoryCounts).reduce((sum, count) => sum + count, 0)}</span></CategoryPill>
          {CATEGORIES.map((category) => <CategoryPill key={category} active={props.category === category} onClick={() => props.onCategoryChange(category)}>{category} <span className={props.category === category ? "text-white/70" : "text-slate-400 dark:text-slate-400"}>{props.categoryCounts[category]}</span></CategoryPill>)}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="city-filter">Filter kota</label>
          <select id="city-filter" value={props.city} onChange={(event) => props.onCityChange(event.target.value)} className="min-h-10 rounded-xl border border-slate-200/70 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 dark:border-white/10 dark:bg-transparent dark:text-slate-200">
            <option value="Semua">{t("toolbar.allCity")}</option>{props.cities.map((city) => <option value={city} key={city}>{city}</option>)}
          </select>
          <label className="sr-only" htmlFor="sort-filter">Urutkan usaha</label>
          <select id="sort-filter" value={props.sort} onChange={(event) => props.onSortChange(event.target.value as SortOrder)} className="min-h-10 rounded-xl border border-slate-200/70 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 dark:border-white/10 dark:bg-transparent dark:text-slate-200">
            <option value="terbaru">{t("toolbar.newest")}</option><option value="terlama">{t("toolbar.oldest")}</option><option value="az">{t("toolbar.az")}</option><option value="za">{t("toolbar.za")}</option>
          </select>
          <button type="button" onClick={props.onFavoritesChange} aria-pressed={props.favoritesOnly} className={`min-h-10 rounded-xl border px-3 text-xs font-semibold transition-all duration-200 ${props.favoritesOnly ? "border-pink-500 bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md" : "border-slate-200/70 bg-white text-slate-700 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600 dark:border-white/10 dark:bg-transparent dark:text-slate-200 dark:hover:border-pink-400 dark:hover:bg-pink-400/10 dark:hover:text-pink-200"}`}><span aria-hidden="true">♥ </span>{t("toolbar.fav")}</button>
        </div>
      </div>

      {(props.query || props.category !== "Semua" || props.city !== "Semua" || props.favoritesOnly) && <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200/70 pt-4 dark:border-white/10" role="status" aria-label="Filter aktif">
        <span className="mr-1 text-[10px] font-semibold uppercase tracking-[.1em] text-slate-500 dark:text-slate-400">{t("toolbar.activeFilter")}</span>
        {props.query && <FilterTag label={`${t("toolbar.searchLabel")} ${props.query}`} onRemove={() => props.onQueryChange("")} />}
        {props.category !== "Semua" && <FilterTag label={props.category} onRemove={() => props.onCategoryChange("Semua")} />}
        {props.city !== "Semua" && <FilterTag label={props.city} onRemove={() => props.onCityChange("Semua")} />}
        {props.favoritesOnly && <FilterTag label={t("toolbar.fav")} onRemove={props.onFavoritesChange} />}
        <button type="button" onClick={props.onClearAll} className="ml-auto min-h-8 rounded-lg px-2 text-[11px] font-semibold text-slate-500 underline decoration-transparent underline-offset-2 transition-all hover:text-violet-600 hover:decoration-current dark:text-slate-400 dark:hover:text-fuchsia-400">{t("toolbar.clearAll")}</button>
      </div>}
    </div>
  );
}

function CategoryPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return <button type="button" onClick={onClick} aria-pressed={active} className={`min-h-9 shrink-0 rounded-full border px-3.5 text-[11px] font-semibold transition-all duration-200 ease-out active:scale-[.97] ${active ? "border-violet-600 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md" : "border-slate-200/70 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:hover:border-fuchsia-400 dark:hover:bg-fuchsia-400/10 dark:hover:text-fuchsia-200"}`}>{children}</button>;
}
function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return <button type="button" onClick={onRemove} aria-label={`Hapus filter ${label}`} className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 text-[11px] font-medium text-violet-700 transition-all duration-200 hover:border-violet-400 hover:bg-violet-100 dark:border-fuchsia-400/40 dark:bg-fuchsia-400/10 dark:text-fuchsia-200 dark:hover:border-fuchsia-300 dark:hover:bg-fuchsia-400/20">{label}<span aria-hidden="true">×</span></button>;
}
function SearchIcon() { return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>; }
