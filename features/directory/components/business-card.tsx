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
    <article className={`group relative flex h-full flex-col rounded-[1.6rem] border border-slate-200/70 bg-white/95 p-5 shadow-[var(--shadow-soft)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_80px_140px_-90px_rgba(139,92,246,0.5)] active:scale-[.995] sm:p-6 dark:border-white/10 dark:bg-white/5 dark:hover:border-fuchsia-400/60 ${featured ? "md:flex-row md:items-center md:gap-9 md:p-8 ring-1 ring-violet-200/60 dark:ring-fuchsia-400/30" : ""}`}>
      {featured && <div className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 px-3 py-1 text-[10px] font-bold text-white shadow-md">{t("card.featured")}</div>}
      <div className={`flex min-w-0 flex-1 flex-col ${featured ? "md:flex-row md:items-center md:gap-7" : ""}`}>
        <div className={`mb-5 flex items-start justify-between gap-4 ${featured ? "md:mb-0 md:items-center" : ""}`}>
          <div className="flex min-w-0 items-center gap-3.5">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-100 text-[23px] shadow-sm sm:size-14 sm:text-2xl transition-transform group-hover:scale-110 dark:from-violet-400/10 dark:to-fuchsia-400/10 dark:border-violet-400/30" aria-hidden="true">{business.ikon || "🏪"}</span>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold uppercase tracking-[.1em] text-violet-600 dark:text-fuchsia-300">{business.kategori}</p>
              <h3 className="mt-1 truncate text-lg font-bold tracking-[-.035em] text-slate-900 dark:text-white">{business.nama}</h3>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300"><PinIcon />{business.kota || "Indonesia"}</p>
            </div>
          </div>
          <button type="button" onClick={() => onToggleFavorite(business.id)} aria-label={favorite ? `${t("card.remFav")} ${business.nama}` : `${t("card.addFav")} ${business.nama}`} aria-pressed={favorite} className={`grid size-10 shrink-0 place-items-center rounded-xl border transition-all duration-200 ease-out hover:scale-110 active:scale-95 ${favorite ? "border-pink-200 bg-pink-50 text-pink-600 dark:border-pink-400/40 dark:bg-pink-400/10 dark:text-pink-300" : "border-slate-200/70 bg-white text-slate-400 hover:border-pink-200 hover:text-pink-500 dark:border-white/10 dark:bg-transparent dark:text-slate-400 dark:hover:border-pink-400/40 dark:hover:text-pink-300"}`}>
            <span className="text-lg leading-none" aria-hidden="true">{favorite ? "♥" : "♡"}</span>
          </button>
        </div>
        <p className={`max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 ${featured ? "md:max-w-[34rem]" : "line-clamp-3"}`}>{business.deskripsi}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {business.harga && <span className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 px-2.5 py-1.5 text-[11px] font-semibold text-amber-700 dark:from-amber-400/10 dark:to-orange-400/10 dark:border-amber-400/30 dark:text-amber-200">{t("card.price")} {business.harga}</span>}
          {business.jamBuka && <span className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 px-2.5 py-1.5 text-[11px] font-semibold text-green-700 dark:from-emerald-400/10 dark:to-green-400/10 dark:border-emerald-400/30 dark:text-emerald-200">{t("card.hours")} {business.jamBuka}</span>}
          {typeof business.rating === "number" && business.rating > 0 && <span className="rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 px-2.5 py-1.5 text-[11px] font-semibold text-amber-700 dark:from-yellow-400/10 dark:to-amber-400/10 dark:border-yellow-400/30 dark:text-yellow-200">★ {business.rating.toLocaleString(locale === "id" ? "id-ID" : "en-US")}</span>}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-white/10">
          <button type="button" onClick={() => onViewDetails(business)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-violet-600 transition-all duration-200 ease-out hover:bg-violet-50 hover:text-violet-700 active:scale-[.98] dark:text-fuchsia-300 dark:hover:bg-fuchsia-400/10 dark:hover:text-fuchsia-200">{t("card.view")} <span aria-hidden="true">→</span></button>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">{business.ulasan?.length ? `${business.ulasan.length} ${t("card.review")}` : t("card.noReview")}</span>
        </div>
      </div>
      <div className={`mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-white/10 ${featured ? "md:mt-0 md:w-48 md:shrink-0 md:flex-col md:items-stretch md:border-l md:border-t-0 md:pl-8 md:pt-0" : ""}`}>
        <a href={`https://wa.me/${phone}?text=${whatsappMessage}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 text-xs font-semibold text-white shadow-md transition-all duration-200 ease-out hover:-translate-y-0.5 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg active:scale-[.98]">
          <WhatsAppIcon /> {t("card.chat")}
        </a>
        {onDelete && (confirmingDelete ? <div className="flex items-center gap-1.5"><span className="mr-1 text-[10px] font-medium text-red-700 dark:text-red-300">{t("card.sure")}</span><button type="button" disabled={deleting} onClick={() => void onDelete(business)} className="min-h-10 rounded-lg bg-red-600 px-3 text-[11px] font-semibold text-white transition-all duration-200 ease-out hover:bg-red-700 disabled:opacity-60">{deleting ? t("card.deleting") : t("card.yesDelete")}</button><button type="button" onClick={() => setConfirmingDelete(false)} className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5" aria-label={t("card.cancel")}>×</button></div> : <button type="button" disabled={deleting} onClick={() => setConfirmingDelete(true)} className="min-h-11 rounded-xl border border-slate-200/70 px-4 text-xs font-semibold text-slate-600 transition-all duration-200 ease-out hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-wait disabled:opacity-60 dark:border-white/10 dark:text-slate-300 dark:hover:border-red-400/40 dark:hover:bg-red-400/10 dark:hover:text-red-300">{t("card.delete")}</button>)}
      </div>
    </article>
  );
}

function PinIcon() { return <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M13 6.7c0 3.2-5 7.7-5 7.7S3 9.9 3 6.7a5 5 0 1 1 10 0Z"/><circle cx="8" cy="6.5" r="1.5"/></svg>; }
function WhatsAppIcon() { return <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16.8 9.7a6.8 6.8 0 0 1-10.1 5.9L3 16.5l.9-3.5A6.8 6.8 0 1 1 16.8 9.7Z"/><path d="M7.2 7.1c.4 2.1 1.7 3.4 3.8 4.2l.8-.8 1.4.7c.3.2.3.7 0 .9-.6.5-1.2.7-2 .5-2.4-.6-4.8-2.6-5.3-4.8-.2-.7.1-1.3.5-1.8.3-.3.8-.2.9.2l.6 1.4-.7.8Z"/></svg>; }
