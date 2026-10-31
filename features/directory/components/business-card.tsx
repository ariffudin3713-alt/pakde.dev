"use client";

import { useState } from "react";
import type { Business } from "@/lib/types";
import { isOpenNow } from "@/lib/hours";
import { useI18n } from "@/lib/i18n";
import { getIllustration } from "@/features/directory/local-photo";
import { ArrowIcon, ClockIcon, HeartIcon, PinIcon, StarIcon, WhatsAppIcon } from "./icons";

interface BusinessCardProps {
  business: Business;
  favorite: boolean;
  featured?: boolean;
  nowMinutes?: number | null;
  onToggleFavorite: (id: string) => void;
  onViewDetails: (business: Business) => void;
  onDelete?: (business: Business) => void;
  deleting?: boolean;
}

export function BusinessCard({
  business,
  favorite,
  featured = false,
  nowMinutes = null,
  onToggleFavorite,
  onViewDetails,
  onDelete,
  deleting = false,
}: BusinessCardProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const { t, locale } = useI18n();
  const digits = business.wa.replace(/\D/g, "");
  const phone = digits.startsWith("0") ? `62${digits.slice(1)}` : digits.startsWith("8") ? `62${digits}` : digits;
  const whatsappMessage = encodeURIComponent(`${t("card.chatMsg")} ${business.nama}.`);
  const reviews = business.ulasan?.length ?? 0;
  const illustration = getIllustration(business);
  const openState = nowMinutes === null || !business.jamBuka ? null : isOpenNow(business.jamBuka, nowMinutes);
  const initial = business.nama.trim().charAt(0).toUpperCase() || "?";
  const meta = "text-muted";

  return (
    <article className={`group relative ${featured ? "md:col-span-2" : ""}`}>
      <div className={`flex h-full flex-col bg-bone ${featured ? "md:flex-row" : ""}`}>
        <div
          className={`card-media relative shrink-0 overflow-hidden bg-paper ${
            featured ? "aspect-[16/10] md:aspect-auto md:w-[46%]" : "aspect-[16/10]"
          }`}
        >
          {illustration ? (
            <img
              src={illustration.src}
              width={illustration.width}
              height={illustration.height}
              alt={illustration.alt}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-blood text-bone">
              <div className="flex flex-col items-center gap-2">
                <span className="font-heading text-[clamp(2.6rem,4vw,3.4rem)] leading-none">{initial}</span>
                <span className="font-display text-[13px] font-semibold">{business.kategori}</span>
              </div>
            </div>
          )}

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {openState !== null && (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 font-display text-[13px] font-bold ${
                  openState ? "bg-leaf text-bone" : "bg-ink/85 text-bone"
                }`}
              >
                <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                {openState ? t("card.open") : t("card.closed")}
              </span>
            )}
            {featured && (
              <span className="inline-flex items-center bg-blood px-2.5 py-1.5 font-display text-[13px] font-bold text-bone">
                {t("card.featured")}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onToggleFavorite(business.id)}
            aria-label={favorite ? `${t("card.remFav")} ${business.nama}` : `${t("card.addFav")} ${business.nama}`}
            aria-pressed={favorite}
            className={`absolute right-3 top-3 grid size-10 place-items-center transition-colors duration-150 active:translate-y-px ${
              favorite ? "bg-blood text-bone" : "bg-bone text-ink hover:text-blood"
            }`}
          >
            <HeartIcon size={19} filled={favorite} />
          </button>
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
          <h3 className="max-w-[26ch] text-[clamp(1.25rem,2.2vw,1.95rem)] leading-[1.04]">{business.nama}</h3>

          <p className={`mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-display text-[13px] font-semibold ${meta}`}>
            <span>{business.kategori}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <PinIcon size={13} />
              {business.kota || "Indonesia"}
            </span>
            <span aria-hidden="true">·</span>
            <span>{reviews ? `${reviews} ${t("card.review")}` : t("card.noReview")}</span>
          </p>

          <p className="mt-2.5 line-clamp-3 max-w-[58ch] text-[16px] leading-[1.55] text-ink/80">{business.deskripsi}</p>

          <dl className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[16px] leading-none">
            {business.harga && (
              <div className="inline-flex items-baseline gap-1.5">
                <dt className={meta}>{t("card.price")}</dt>
                <dd className="font-display font-semibold text-ink">{business.harga}</dd>
              </div>
            )}
            {business.jamBuka && (
              <div className="inline-flex items-center gap-1.5 text-ink/80">
                <dt className="grid place-items-center" aria-hidden="true">
                  <ClockIcon size={14} />
                </dt>
                <dd>{business.jamBuka}</dd>
              </div>
            )}
            {typeof business.rating === "number" && business.rating > 0 && (
              <div className="inline-flex items-center gap-1.5 text-ink/85">
                <dt className="grid place-items-center text-blood" aria-hidden="true">
                  <StarIcon size={14} />
                </dt>
                <dd className="font-display font-semibold">
                  {business.rating.toLocaleString(locale === "id" ? "id-ID" : "en-US", { maximumFractionDigits: 1 })}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-5">
            <a
              href={`https://wa.me/${phone}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="btn min-h-11 w-full sm:w-auto"
            >
              <WhatsAppIcon size={17} />
              {t("card.chat")}
            </a>

            <button
              type="button"
              onClick={() => onViewDetails(business)}
              className="inline-flex min-h-11 items-center gap-2 font-display text-[16px] font-semibold text-ink underline decoration-blood/40 decoration-2 underline-offset-4 transition-colors duration-150 hover:text-blood hover:decoration-blood"
            >
              {t("card.view")}
              <ArrowIcon size={15} />
            </button>

            {onDelete && (
              <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                {confirmingDelete ? (
                  <>
                    <span className="text-[13px] text-muted">{t("card.sure")}</span>
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={() => void onDelete(business)}
                      className="inline-flex min-h-10 items-center bg-blood px-3 font-display text-[13px] font-semibold text-bone transition-opacity duration-150 hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
                    >
                      {deleting ? t("card.deleting") : t("card.yesDelete")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingDelete(false)}
                      className="inline-flex min-h-10 items-center bg-paper px-3 font-display text-[13px] font-semibold text-ink transition-opacity duration-150 hover:opacity-85"
                    >
                      {t("card.cancel")}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={() => setConfirmingDelete(true)}
                    className="inline-flex min-h-10 items-center px-1 font-display text-[13px] font-semibold text-muted underline decoration-transparent underline-offset-4 transition-colors duration-150 hover:text-blood hover:decoration-blood disabled:cursor-wait disabled:opacity-60"
                  >
                    {t("card.delete")}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
