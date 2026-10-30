"use client";

import { useState } from "react";
import type { Business } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { ArrowIcon, CategoryMark, ClockIcon, HeartIcon, PinIcon, StarIcon, WhatsAppIcon } from "./icons";

interface BusinessCardProps {
  business: Business;
  favorite: boolean;
  featured?: boolean;
  onToggleFavorite: (id: string) => void;
  onViewDetails: (business: Business) => void;
  onDelete?: (business: Business) => void;
  deleting?: boolean;
}

export function BusinessCard({ business, favorite, featured = false, onToggleFavorite, onViewDetails, onDelete, deleting = false }: BusinessCardProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const { t, locale } = useI18n();
  const digits = business.wa.replace(/\D/g, "");
  const phone = digits.startsWith("0") ? `62${digits.slice(1)}` : digits.startsWith("8") ? `62${digits}` : digits;
  const whatsappMessage = encodeURIComponent(`${t("card.chatMsg")} ${business.nama}.`);
  const reviews = business.ulasan?.length ?? 0;
  const meta = featured ? "text-bone/80" : "text-muted";

  return (
    <article className={`group relative ${featured ? "bg-blood text-bone" : "text-ink focus-within:bg-bone/60"}`}>
      <div className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:gap-6 ${featured ? "sm:p-7" : ""}`}>
        <span className={`grid size-12 shrink-0 place-items-center sm:size-14 ${featured ? "bg-bone text-blood" : "bg-blood text-bone"}`}>
          <CategoryMark category={business.kategori} tone={featured ? "blood" : "bone"} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className={`max-w-[26ch] text-[clamp(1.45rem,2.2vw,1.95rem)] leading-[1.02] ${featured ? "text-bone" : "text-ink"}`}>
                {business.nama}
              </h3>
              <p className={`mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] ${meta}`}>
                <span className="font-display font-semibold">
                  {business.kategori}
                  {featured && ` · ${t("card.featured")}`}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <PinIcon size={14} />
                  {business.kota || "Indonesia"}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => onToggleFavorite(business.id)}
              aria-label={favorite ? `${t("card.remFav")} ${business.nama}` : `${t("card.addFav")} ${business.nama}`}
              aria-pressed={favorite}
              className={`grid size-11 shrink-0 place-items-center transition-colors duration-150 active:translate-y-px ${
                favorite
                  ? featured
                    ? "bg-bone text-blood"
                    : "bg-blood text-bone"
                  : featured
                    ? "bg-bone/15 text-bone hover:bg-bone/25"
                    : "bg-paper text-ink hover:text-blood"
              }`}
            >
              <HeartIcon size={19} filled={favorite} />
            </button>
          </div>

          <p className={`mt-3 max-w-[62ch] text-[16px] leading-[1.55] ${featured ? "text-bone/85" : "text-ink/85"} ${featured ? "" : "line-clamp-3"}`}>
            {business.deskripsi}
          </p>

          <div className={`mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[16px] ${featured ? "text-bone/85" : "text-ink/80"}`}>
            {business.harga && (
              <span>
                <span className={meta}>{t("card.price")} </span>
                {business.harga}
              </span>
            )}
            {business.jamBuka && (
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon size={14} />
                {business.jamBuka}
              </span>
            )}
            {typeof business.rating === "number" && business.rating > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <StarIcon size={14} />
                {business.rating.toLocaleString(locale === "id" ? "id-ID" : "en-US", { maximumFractionDigits: 1 })}
              </span>
            )}
            <span className={meta}>{reviews ? `${reviews} ${t("card.review")}` : t("card.noReview")}</span>
          </div>
        </div>
      </div>

      <div className={`flex flex-col gap-2 px-5 pb-5 sm:flex-row sm:items-center sm:gap-4 ${featured ? "sm:px-7 sm:pb-7" : ""}`}>
        <a
          href={`https://wa.me/${phone}?text=${whatsappMessage}`}
          target="_blank"
          rel="noreferrer"
          className={`btn min-h-11 sm:w-auto ${featured ? "btn-bone" : ""}`}
        >
          <WhatsAppIcon size={17} />
          {t("card.chat")}
        </a>

        <button
          type="button"
          onClick={() => onViewDetails(business)}
          className={`inline-flex min-h-11 w-fit items-center gap-2 font-display text-[16px] font-semibold underline decoration-2 underline-offset-4 transition-colors duration-150 ${
            featured ? "text-bone decoration-bone/40 hover:decoration-bone" : "text-ink decoration-blood/40 hover:text-blood hover:decoration-blood"
          }`}
        >
          {t("card.view")}
          <ArrowIcon size={15} />
        </button>

        {onDelete && (
          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            {confirmingDelete ? (
              <>
                <span className={`text-[13px] ${meta}`}>{t("card.sure")}</span>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => void onDelete(business)}
                  className={`inline-flex min-h-10 items-center px-3 font-display text-[13px] font-semibold transition-colors duration-150 disabled:cursor-wait disabled:opacity-60 ${featured ? "bg-bone text-blood hover:opacity-90" : "bg-blood text-bone hover:opacity-90"}`}
                >
                  {deleting ? t("card.deleting") : t("card.yesDelete")}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className={`inline-flex min-h-10 items-center px-3 font-display text-[13px] font-semibold transition-colors duration-150 ${featured ? "bg-bone/15 text-bone hover:bg-bone/25" : "bg-paper text-ink hover:opacity-85"}`}
                >
                  {t("card.cancel")}
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={deleting}
                onClick={() => setConfirmingDelete(true)}
                className={`inline-flex min-h-10 items-center px-1 font-display text-[13px] font-semibold underline decoration-transparent underline-offset-4 transition-colors duration-150 disabled:cursor-wait disabled:opacity-60 ${featured ? "text-bone/70 hover:text-bone hover:decoration-bone" : "text-muted hover:text-blood hover:decoration-blood"}`}
              >
                {t("card.delete")}
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
