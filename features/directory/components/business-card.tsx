"use client";

import { useState } from "react";
import type { Business } from "@/lib/types";

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
  const digits = business.wa.replace(/\D/g, "");
  const phone = digits.startsWith("0") ? `62${digits.slice(1)}` : digits.startsWith("8") ? `62${digits}` : digits;
  const whatsappMessage = encodeURIComponent(`Halo ${business.nama}, saya melihat usaha Anda di Pasar UMKM.`);

  return (
    <article className={`group relative flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl active:scale-[.995] sm:p-6 ${featured ? "md:flex-row md:items-center md:gap-9 md:p-8 ring-2 ring-blue-100" : ""}`}>
      {featured && <div className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1 text-[10px] font-bold text-white shadow-md">⭐ UNGGULAN</div>}
      <div className={`flex min-w-0 flex-1 flex-col ${featured ? "md:flex-row md:items-center md:gap-7" : ""}`}>
        <div className={`mb-5 flex items-start justify-between gap-4 ${featured ? "md:mb-0 md:items-center" : ""}`}>
          <div className="flex min-w-0 items-center gap-3.5">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-[23px] shadow-sm sm:size-14 sm:text-2xl transition-transform group-hover:scale-110" aria-hidden="true">{business.ikon || "🏪"}</span>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold uppercase tracking-[.1em] text-blue-600">{business.kategori}</p>
              <h3 className="mt-1 truncate text-lg font-bold tracking-[-.035em] text-gray-900">{business.nama}</h3>
              <p className="mt-1 flex items-center gap-1 text-xs text-gray-600"><PinIcon />{business.kota || "Indonesia"}</p>
            </div>
          </div>
          <button type="button" onClick={() => onToggleFavorite(business.id)} aria-label={favorite ? `Hapus ${business.nama} dari favorit` : `Tambahkan ${business.nama} ke favorit`} aria-pressed={favorite} className={`grid size-10 shrink-0 place-items-center rounded-xl border transition-all duration-200 ease-out hover:scale-110 active:scale-95 ${favorite ? "border-pink-200 bg-pink-50 text-pink-600" : "border-gray-200 bg-white text-gray-400 hover:border-pink-200 hover:text-pink-500"}`}>
            <span className="text-lg leading-none" aria-hidden="true">{favorite ? "♥" : "♡"}</span>
          </button>
        </div>
        <p className={`max-w-2xl text-sm leading-6 text-gray-600 ${featured ? "md:max-w-[34rem]" : "line-clamp-3"}`}>{business.deskripsi}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {business.harga && <span className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 px-2.5 py-1.5 text-[11px] font-semibold text-amber-700">💰 {business.harga}</span>}
          {business.jamBuka && <span className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 px-2.5 py-1.5 text-[11px] font-semibold text-green-700">🕐 {business.jamBuka}</span>}
          {typeof business.rating === "number" && business.rating > 0 && <span className="rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 px-2.5 py-1.5 text-[11px] font-semibold text-amber-700">★ {business.rating.toLocaleString("id-ID")}</span>}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
          <button type="button" onClick={() => onViewDetails(business)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-blue-600 transition-all duration-200 ease-out hover:bg-blue-50 hover:text-blue-700 active:scale-[.98]">Lihat Detail <span aria-hidden="true">→</span></button>
          <span className="text-[10px] text-gray-500">{business.ulasan?.length ? `${business.ulasan.length} ulasan` : "Belum ada ulasan"}</span>
        </div>
      </div>
      <div className={`mt-5 flex items-center gap-2 border-t border-gray-100 pt-4 ${featured ? "md:mt-0 md:w-48 md:shrink-0 md:flex-col md:items-stretch md:border-l md:border-t-0 md:pl-8 md:pt-0" : ""}`}>
        <a href={`https://wa.me/${phone}?text=${whatsappMessage}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 text-xs font-semibold text-white shadow-md transition-all duration-200 ease-out hover:-translate-y-0.5 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg active:scale-[.98]">
          <WhatsAppIcon /> Chat WhatsApp
        </a>
        {onDelete && (confirmingDelete ? <div className="flex items-center gap-1.5"><span className="mr-1 text-[10px] font-medium text-red-700">Yakin?</span><button type="button" disabled={deleting} onClick={() => void onDelete(business)} className="min-h-10 rounded-lg bg-red-600 px-3 text-[11px] font-semibold text-white transition-all duration-200 ease-out hover:bg-red-700 disabled:opacity-60">{deleting ? "Menghapus…" : "Ya, hapus"}</button><button type="button" onClick={() => setConfirmingDelete(false)} className="grid size-9 place-items-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50" aria-label="Batalkan penghapusan">×</button></div> : <button type="button" disabled={deleting} onClick={() => setConfirmingDelete(true)} className="min-h-11 rounded-xl border border-gray-200 px-4 text-xs font-semibold text-gray-600 transition-all duration-200 ease-out hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-wait disabled:opacity-60">Hapus</button>)}
      </div>
    </article>
  );
}

function PinIcon() { return <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M13 6.7c0 3.2-5 7.7-5 7.7S3 9.9 3 6.7a5 5 0 1 1 10 0Z"/><circle cx="8" cy="6.5" r="1.5"/></svg>; }
function WhatsAppIcon() { return <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16.8 9.7a6.8 6.8 0 0 1-10.1 5.9L3 16.5l.9-3.5A6.8 6.8 0 1 1 16.8 9.7Z"/><path d="M7.2 7.1c.4 2.1 1.7 3.4 3.8 4.2l.8-.8 1.4.7c.3.2.3.7 0 .9-.6.5-1.2.7-2 .5-2.4-.6-4.8-2.6-5.3-4.8-.2-.7.1-1.3.5-1.8.3-.3.8-.2.9.2l.6 1.4-.7.8Z"/></svg>; }
