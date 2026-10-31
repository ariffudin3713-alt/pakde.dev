"use client";

import { useI18n } from "@/lib/i18n";
import { HeartIcon, SearchIcon } from "./icons";

export function BusinessSkeletons() {
  return (
    <>
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="bg-bone" aria-hidden="true">
          <div className="skeleton aspect-[16/10] w-full" />
          <div className="p-5">
            <div className="skeleton h-3 w-28" />
            <div className="skeleton mt-3 h-6 w-2/3" />
            <div className="skeleton mt-3 h-3 w-full" />
            <div className="skeleton mt-2 h-3 w-4/5" />
            <div className="skeleton mt-5 h-10 w-full" />
          </div>
        </div>
      ))}
    </>
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
    <div className="grid gap-6 bg-paper px-6 py-14 sm:px-10 sm:py-16 lg:grid-cols-[.42fr_.58fr] lg:items-center">
      <div>
        <span className="grid size-14 place-items-center bg-blood text-bone" aria-hidden="true">
          {favoritesOnly ? <HeartIcon size={24} /> : <SearchIcon size={24} />}
        </span>
        <h3 className="mt-6 max-w-[18ch] text-[clamp(1.9rem,3.6vw,3.4rem)] leading-[1.05]">{title}</h3>
      </div>
      <div>
        <p className="max-w-[42ch] text-[20px] leading-[1.55] text-ink/80">{description}</p>
        {!hasListings && !favoritesOnly ? (
          <a href="#daftar" className="btn mt-7">{t("nav.list")}</a>
        ) : (
          <button type="button" onClick={onReset} className="btn btn-quiet mt-7">
            {favoritesOnly ? t("empty.explore") : t("empty.reset")}
          </button>
        )}
      </div>
    </div>
  );
}
