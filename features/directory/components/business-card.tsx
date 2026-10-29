"use client";

import { useState } from "react";
import type { Business } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

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
  const whatsappMessage = encodeURIComponent(`${t("card.chatMsg")} ${business.nama}, ...`);

  return (
    <article className={`group relative flex h-full flex-col rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 active:scale-[.995] sm:p-6 dark:border-white/10 dark:bg-white/5 ${featured ? "md:flex-row md:items-center md:gap-9 md:p-8" : ""}`}>
      {featured && <div className="absolute -top-3 left-6 rounded-full bg-[var(--color-accent)] px-3 py-1 text-[10px] font-semibold text-white">{t("card.featured")}</div>}
      <div className={`flex min-w-0 flex-1 flex-col ${featured ? "md:flex-row md:items-center md:gap-7" : ""}`}>
        <div className={`mb-5 flex items-start justify-between gap-4 ${featured ? "md:mb-0 md:items-center" : ""}`}>
          <div className="flex min-w-0 items-center gap-3.5">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-slate-100 text-[23px] sm:size-14 sm:text-2xl dark:bg-white/10" aria-hidden="true">{business.ikon || "🏪"}</span>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold uppercase tracking-[.12em] text-[var(--color-accent)]">{business.kategori}</p>
              <h3 className="mt-1 truncate text-lg font-semibold tracking-[-.02em] text-slate-900 dark:text-white">{business.nama}</h3>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300"><PinIcon />{business.kota || "Indonesia"}</p>
            </div>
          </div>
          <button type="button" onClick={() => onToggleFavorite(business.id)} aria-label={favorite ? `${t("card.remFav")} ${business.nama}` : `${t("card.addFav")} ${business.nama}`} aria-pressed={favorite} className={`grid size-10 shrink-0 place-items-center rounded-lg border transition-all duration-200 ${favorite ? "border-[var(--color-accent)] text-[var(--color-accent)]" : "border-slate-200/70 text-slate-400 hover:text-slate-600 dark:border-white/10 dark:text-slate-400 dark:hover:text-slate-200"}`}>
            <span className="text-lg leading-none" aria-hidden="true">{favorite ? "♥" : "♡"}</span>
          </button>
        </div>
        <p className={`max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 ${featured ? "md:max-w-[34rem]" : "line-clamp-3"}`}>{business.deskripsi}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {business.harga && <span className="rounded-lg border border-slate-200/70 px-2.5 py-1.5 text-[11px] font-medium text-slate-700 dark:border-white/10 dark:text-slate-200">{t("card.price")} {business.harga}</span>}
          {business.jamBuka && <span className="rounded-lg border border-slate-200/70 px-2.5 py-1.5 text-[11px] font-medium text-slate-700 dark:border-white/10 dark:text-slate-200">{t("card.hours")} {business.jamBuka}</span>}
          {typeof business.rating === "number" && business.rating > 0 && <span className="rounded-lg border border-slate-200/70 px-2.5 py-1.5 text-[11px] font-medium text-slate-700 dark:border-white/10 dark:text-slate-200">★ {business.rating.toLocaleString(locale === "id" ? "id-ID" : "en-US")}</span>}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-white/10">
          <button type="button" onClick={() => onViewDetails(business)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-[var(--color-accent)] transition-all duration-200 hover:underline">{t("card.view")} <span aria-hidden="true">→</span></button>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">{business.ulasan?.length ? `${business.ulasan.length} ${t("card.review")}` : t("card.noReview")}</span>
        </div>
      </div>
      <div className={`mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-white/10 ${featured ? "md:mt-0 md:w-48 md:shrink-0 md:flex-col md:items-stretch md:border-l md:border-t-0 md:pl-8 md:pt-0" : ""}`}>
        <a href={`https://wa.me/${phone}?text=${whatsappMessage}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-emerald-700">
          <WhatsAppIcon /> {t("card.chat")}
        </a>
        {onDelete && (confirmingDelete ? <div className="flex items-center gap-1.5"><span className="mr-1 text-[10px] font-medium text-red-700 dark:text-red-300">{t("card.sure")}</span><button type="button" disabled={deleting} onClick={() => void onDelete(business)} className="min-h-10 rounded-lg bg-red-600 px-3 text-[11px] font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60">{deleting ? t("card.deleting") : t("card.yesDelete")}</button><button type="button" onClick={() => setConfirmingDelete(false)} className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5" aria-label={t("card.cancel")}>×</button></div> : <button type="button" disabled={deleting} onClick={() => setConfirmingDelete(true)} className="min-h-11 rounded-xl border border-slate-200/70 px-4 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5">{t("card.delete")}</button>)}
      </div>
    </article>
  );
}

function PinIcon() { return <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M13 6.7c0 3.2-5 7.7-5 7.7S3 9.9 3 6.7a5 5 0 1 1 10 0Z"/><circle cx="8" cy="6.5" r="1.5"/></svg>; }
function WhatsAppIcon() { return <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16.8 9.7a6.8 6.8 0 0 1-10.1 5.9L3 16.5l.9-3.5A6.8 6.8 0 1 1 16.8 9.7Z"/><path d="M7.2 7.1c.4 2.1 1.7 3.4 3.8 4.2l.8-.8 1.4.7c.3.2.3.7 0 .9-.6.5-1.2.7-2 .5-2.4-.6-4.8-2.6-5.3-4.8-.2-.7.1-1.3.5-1.8.3-.3.8-.2.9.2l.6 1.4-.7.8Z"/></svg>; }
