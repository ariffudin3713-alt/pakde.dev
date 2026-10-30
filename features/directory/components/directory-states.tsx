"use client";

import { useI18n } from "@/lib/i18n";
import { HeartIcon, SearchIcon } from "./icons";

export function BusinessSkeletons() {
  return (
    <div className="grid gap-2" aria-label="Memuat daftar usaha" aria-busy="true">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="flex gap-4 bg-paper p-5">
          <div className="skeleton size-12 shrink-0 sm:size-14" />
          <div className="min-w-0 flex-1">
            <div className="skeleton h-3 w-24" />
            <div className="skeleton mt-3 h-5 w-2/3" />
            <div className="skeleton mt-3 h-3 w-full" />
            <div className="skeleton mt-2 h-3 w-4/5" />
            <div className="skeleton mt-4 h-4 w-40" />
          </div>
        </div>
      ))}
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
  const description = favoritesOnly ? t("empty.noFavDesc") : hasListings ? t("empty.noResultDesc") : t("empty.noFavDesc");

  return (
    <div className="bg-paper px-6 py-16 sm:px-10 sm:py-20">
      <span className="grid size-14 place-items-center bg-blood text-bone" aria-hidden="true">
        {favoritesOnly ? <HeartIcon size={24} /> : <SearchIcon size={24} />}
      </span>
      <h3 className="mt-6 max-w-[22ch] text-[clamp(1.9rem,3.6vw,3.4rem)] leading-[1.05]">{title}</h3>
      <p className="mt-3 max-w-[42ch] text-[16px] leading-[1.55] text-ink/80">{description}</p>
      {!hasListings && !favoritesOnly ? (
        <a href="#daftar" className="btn mt-7">{t("nav.list")}</a>
      ) : (
        <button type="button" onClick={onReset} className="btn btn-quiet mt-7">
          {favoritesOnly ? t("empty.explore") : t("empty.reset")}
        </button>
      )}
    </div>
  );
}
