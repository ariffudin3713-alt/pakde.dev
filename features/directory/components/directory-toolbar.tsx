"use client";

import { CATEGORIES, type Category, type SortOrder } from "@/lib/types";
import type { ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import { ClockIcon, HeartIcon, RefreshIcon, SearchIcon } from "./icons";

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
  openOnly: boolean;
  onOpenChange: () => void;
  onClearAll: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export function DirectoryToolbar(props: DirectoryToolbarProps) {
  const { t } = useI18n();
  const total = Object.values(props.categoryCounts).reduce((sum, count) => sum + count, 0);
  const hasFilters = Boolean(props.query) || props.category !== "Semua" || props.city !== "Semua" || props.favoritesOnly || props.openOnly;

  return (
    <div className="bg-paper p-4 sm:p-5">
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
        <label className="flex items-center gap-3 bg-bone px-3">
          <SearchIcon size={18} className="shrink-0 text-muted" />
          <span className="sr-only">{t("toolbar.search")}</span>
          <input
            id="directory-query"
            value={props.query}
            onChange={(event) => props.onQueryChange(event.target.value)}
            placeholder={t("toolbar.searchPlaceholder")}
            className="min-h-12 w-full min-w-0 bg-transparent py-3 text-[16px] text-ink outline-none placeholder:text-[#8b8377]"
            autoComplete="off"
          />
          {props.query ? (
            <button type="button" onClick={() => props.onQueryChange("")} aria-label="Hapus pencarian" className="grid size-9 shrink-0 place-items-center text-[20px] leading-none text-muted transition-colors duration-150 hover:text-blood">
              ×
            </button>
          ) : (
            <kbd className="hidden shrink-0 font-display text-[13px] font-semibold text-muted sm:block" aria-hidden="true">/</kbd>
          )}
        </label>

        <button type="button" onClick={props.onRefresh} disabled={props.refreshing} className="btn min-h-12">
          <RefreshIcon size={16} />
          {props.refreshing ? t("toolbar.refreshing") : t("toolbar.refresh")}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2" role="group" aria-label="Filter kategori">
        <CategoryFilter active={props.category === "Semua"} onClick={() => props.onCategoryChange("Semua")} count={total}>
          {t("toolbar.allCat")}
        </CategoryFilter>
        {CATEGORIES.map((category) => (
          <CategoryFilter key={category} active={props.category === category} onClick={() => props.onCategoryChange(category)} count={props.categoryCounts[category]}>
            {category}
          </CategoryFilter>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="city-filter">Filter kota</label>
        <select id="city-filter" value={props.city} onChange={(event) => props.onCityChange(event.target.value)} className="field min-h-10 w-auto py-2 text-[16px]">
          <option value="Semua">{t("toolbar.allCity")}</option>
          {props.cities.map((city) => <option value={city} key={city}>{city}</option>)}
        </select>

        <label className="sr-only" htmlFor="sort-filter">Urutkan usaha</label>
        <select id="sort-filter" value={props.sort} onChange={(event) => props.onSortChange(event.target.value as SortOrder)} className="field min-h-10 w-auto py-2 text-[16px]">
          <option value="terbaru">{t("toolbar.newest")}</option>
          <option value="terlama">{t("toolbar.oldest")}</option>
          <option value="az">{t("toolbar.az")}</option>
          <option value="za">{t("toolbar.za")}</option>
        </select>

        <button
          type="button"
          onClick={props.onOpenChange}
          aria-pressed={props.openOnly}
          className={`inline-flex min-h-10 items-center gap-2 px-3 font-display text-[13px] font-semibold transition-colors duration-150 ${props.openOnly ? "bg-leaf text-bone" : "bg-bone text-ink hover:text-leaf"}`}
        >
          <ClockIcon size={14} />
          {t("toolbar.openNow")}
        </button>

        <button
          type="button"
          onClick={props.onFavoritesChange}
          aria-pressed={props.favoritesOnly}
          className={`inline-flex min-h-10 items-center gap-2 px-3 font-display text-[13px] font-semibold transition-colors duration-150 ${props.favoritesOnly ? "bg-blood text-bone" : "bg-bone text-ink hover:text-blood"}`}
        >
          <HeartIcon size={14} filled={props.favoritesOnly} />
          {t("toolbar.fav")}
        </button>
      </div>

      {hasFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2" role="status" aria-label="Filter aktif">
          <span className="font-display text-[13px] font-semibold text-muted">{t("toolbar.activeFilter")}</span>
          {props.query && <FilterTag label={`${t("toolbar.searchLabel")} ${props.query}`} onRemove={() => props.onQueryChange("")} />}
          {props.category !== "Semua" && <FilterTag label={props.category} onRemove={() => props.onCategoryChange("Semua")} />}
          {props.city !== "Semua" && <FilterTag label={props.city} onRemove={() => props.onCityChange("Semua")} />}
          {props.openOnly && <FilterTag label={t("toolbar.openNow")} onRemove={props.onOpenChange} />}
          {props.favoritesOnly && <FilterTag label={t("toolbar.fav")} onRemove={props.onFavoritesChange} />}
          <button type="button" onClick={props.onClearAll} className="ml-auto min-h-9 font-display text-[13px] font-semibold text-ink underline decoration-blood decoration-2 underline-offset-4 transition-colors duration-150 hover:text-blood">
            {t("toolbar.clearAll")}
          </button>
        </div>
      )}
    </div>
  );
}

function CategoryFilter({ active, onClick, count, children }: { active: boolean; onClick: () => void; count: number; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-9 items-baseline gap-1.5 font-display text-[16px] font-semibold transition-colors duration-150 ${active ? "text-blood" : "text-ink hover:text-blood"}`}
    >
      <span className={active ? "underline decoration-2 underline-offset-4" : ""}>{children}</span>
      <span className={`text-[13px] font-normal ${active ? "text-blood/70" : "text-muted"}`}>{count}</span>
    </button>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button type="button" onClick={onRemove} aria-label={`Hapus filter ${label}`} className="inline-flex min-h-9 items-center gap-2 bg-bone px-3 font-display text-[13px] font-semibold text-ink transition-colors duration-150 hover:text-blood">
      {label}
      <span className="text-[16px] leading-none" aria-hidden="true">×</span>
    </button>
  );
}
