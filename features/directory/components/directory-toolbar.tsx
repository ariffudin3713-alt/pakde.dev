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
  loading: boolean;
  resultCount: number;
}

export function DirectoryToolbar(props: DirectoryToolbarProps) {
  const { t } = useI18n();
  const total = Object.values(props.categoryCounts).reduce((sum, count) => sum + count, 0);
  const hasFilters =
    Boolean(props.query) || props.category !== "Semua" || props.city !== "Semua" || props.favoritesOnly || props.openOnly;

  return (
    <div className="z-30 lg:sticky lg:top-[88px]">
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
              <button
                type="button"
                onClick={() => props.onQueryChange("")}
                aria-label="Hapus pencarian"
                className="grid size-9 shrink-0 place-items-center text-[20px] leading-none text-muted transition-colors duration-150 hover:text-blood"
              >
                ×
              </button>
            ) : (
              <kbd className="hidden shrink-0 font-display text-[13px] font-semibold text-muted sm:block" aria-hidden="true">
                /
              </kbd>
            )}
          </label>

          <button
            type="button"
            onClick={props.onRefresh}
            disabled={props.refreshing}
            className="grid size-12 place-items-center bg-bone text-ink transition-colors duration-150 hover:text-blood disabled:cursor-wait disabled:text-muted"
            aria-label={props.refreshing ? t("toolbar.refreshing") : t("toolbar.refresh")}
            title={props.refreshing ? t("toolbar.refreshing") : t("toolbar.refresh")}
          >
            <RefreshIcon size={18} className={props.refreshing ? "spin-slow" : ""} />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Filter kategori">
          <CategoryChip active={props.category === "Semua"} onClick={() => props.onCategoryChange("Semua")} count={total}>
            {t("toolbar.allCat")}
          </CategoryChip>
          {CATEGORIES.map((category) => (
            <CategoryChip
              key={category}
              active={props.category === category}
              onClick={() => props.onCategoryChange(category)}
              count={props.categoryCounts[category]}
            >
              {category}
            </CategoryChip>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="city-filter">
            Filter kota
          </label>
          <select
            id="city-filter"
            value={props.city}
            onChange={(event) => props.onCityChange(event.target.value)}
            className="field field-auto min-h-10 py-2 text-[16px]"
          >
            <option value="Semua">{t("toolbar.allCity")}</option>
            {props.cities.map((city) => (
              <option value={city} key={city}>
                {city}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="sort-filter">
            Urutkan usaha
          </label>
          <select
            id="sort-filter"
            value={props.sort}
            onChange={(event) => props.onSortChange(event.target.value as SortOrder)}
            className="field field-auto min-h-10 py-2 text-[16px]"
          >
            <option value="terbaru">{t("toolbar.newest")}</option>
            <option value="terlama">{t("toolbar.oldest")}</option>
            <option value="az">{t("toolbar.az")}</option>
            <option value="za">{t("toolbar.za")}</option>
          </select>

          <button
            type="button"
            onClick={props.onOpenChange}
            aria-pressed={props.openOnly}
            className={`inline-flex min-h-10 items-center gap-2 px-3 font-display text-[16px] font-semibold transition-colors duration-150 ${
              props.openOnly ? "bg-leaf text-bone" : "bg-bone text-ink hover:text-leaf"
            }`}
          >
            <ClockIcon size={14} />
            {t("toolbar.openNow")}
          </button>

          <button
            type="button"
            onClick={props.onFavoritesChange}
            aria-pressed={props.favoritesOnly}
            className={`inline-flex min-h-10 items-center gap-2 px-3 font-display text-[16px] font-semibold transition-colors duration-150 ${
              props.favoritesOnly ? "bg-blood text-bone" : "bg-bone text-ink hover:text-blood"
            }`}
          >
            <HeartIcon size={14} filled={props.favoritesOnly} />
            {t("toolbar.fav")}
          </button>

          {hasFilters && (
            <button
              type="button"
              onClick={props.onClearAll}
              className="ml-auto min-h-10 font-display text-[16px] font-semibold text-ink underline decoration-blood decoration-2 underline-offset-4 transition-colors duration-150 hover:text-blood"
            >
              {t("toolbar.clearAll")}
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2" role="status" aria-live="polite">
          <p className="font-display text-[16px] font-bold text-ink">
            {props.loading ? t("explore.loading") : props.resultCount}
            <span className="ml-1.5 font-normal text-muted">{props.loading ? "" : t("explore.found")}</span>
          </p>

          {hasFilters && (
            <span className="ml-auto flex flex-wrap items-center gap-2" aria-label={t("toolbar.activeFilter")}>
              {props.query && <FilterTag label={`${t("toolbar.searchLabel")} ${props.query}`} onRemove={() => props.onQueryChange("")} />}
              {props.category !== "Semua" && <FilterTag label={props.category} onRemove={() => props.onCategoryChange("Semua")} />}
              {props.city !== "Semua" && <FilterTag label={props.city} onRemove={() => props.onCityChange("Semua")} />}
              {props.openOnly && <FilterTag label={t("toolbar.openNow")} onRemove={props.onOpenChange} />}
              {props.favoritesOnly && <FilterTag label={t("toolbar.fav")} onRemove={props.onFavoritesChange} />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryChip({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-10 shrink-0 items-center gap-2 px-3 font-display text-[16px] font-semibold transition-colors duration-150 ${
        active ? "bg-blood text-bone" : "bg-bone text-ink hover:text-blood"
      }`}
    >
      {children}
      <span className={`text-[13px] font-normal ${active ? "text-bone/70" : "text-muted"}`}>{count}</span>
    </button>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Hapus filter ${label}`}
      className="inline-flex min-h-8 items-center gap-1.5 bg-bone px-2.5 font-display text-[13px] font-semibold text-ink transition-colors duration-150 hover:text-blood"
    >
      {label}
      <span className="text-[16px] leading-none" aria-hidden="true">
        ×
      </span>
    </button>
  );
}
