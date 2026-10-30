"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Business, ReviewInput } from "@/lib/types";

interface BusinessDetailDialogProps {
  business: Business | null;
  onClose: () => void;
  onSubmitReview: (review: ReviewInput) => Promise<void>;
}

export function BusinessDetailDialog({ business, onClose, onSubmitReview }: BusinessDetailDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (business && !dialog.open) dialog.showModal();
    if (!business && dialog.open) dialog.close();
  }, [business]);

  useEffect(() => {
    setName("");
    setMessage("");
    setRating(5);
    setError("");
    setSuccess("");
  }, [business?.id]);

  if (!business) return null;

  const businessId = business.id;
  const reviews = business.ulasan ?? [];
  const average = business.rating || (reviews.length ? reviews.reduce((sum, review) => sum + review.bintang, 0) / reviews.length : 0);
  const digits = business.wa.replace(/\D/g, "");
  const phone = digits.startsWith("0") ? `62${digits.slice(1)}` : digits.startsWith("8") ? `62${digits}` : digits;
  const chatLink = `https://wa.me/${phone}?text=${encodeURIComponent(`Halo ${business.nama}, saya melihat usaha Anda di Pasar UMKM.`)}`;

  async function handleReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (message.trim().length < 3) {
      setError("Ulasan minimal 3 karakter.");
      return;
    }
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await onSubmitReview({ id: businessId, nama: name.trim() || "Pengunjung", pesan: message.trim(), bintang: rating });
      setMessage("");
      setSuccess("Terima kasih. Ulasan Anda sudah tercatat.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Ulasan belum dapat dikirim. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="business-dialog-title"
      onCancel={onClose}
      onClose={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-[var(--text-primary)] backdrop:bg-[#14121f]/70 backdrop:backdrop-blur-sm"
    >
      <div className="grid min-h-dvh place-items-center p-3 sm:p-6">
        <article className="relative max-h-[94dvh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-[var(--border-subtle)] bg-[radial-gradient(1200px_circle_at_50%_0,rgba(196,181,253,0.12),transparent),var(--bg-base)] shadow-[var(--shadow-card)]">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--bg-base)_92%,transparent)] px-5 py-4 backdrop-blur sm:px-7">
            <p className="text-xs font-semibold text-[var(--text-tertiary)]">Detail usaha</p>
            <button type="button" autoFocus onClick={onClose} aria-label="Tutup detail usaha" className="grid size-10 place-items-center rounded-xl border border-[var(--border-subtle)] text-lg text-[var(--text-tertiary)] transition-all duration-200 ease-out hover:border-violet-200/60 hover:bg-violet-200/10 hover:text-[var(--text-primary)] active:scale-95">×</button>
          </div>

          <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[1.05fr_.95fr] lg:gap-10">
            <section>
              <div className="flex items-start gap-4">
                <span className="grid size-16 shrink-0 place-items-center rounded-2xl border border-violet-200/30 bg-gradient-to-br from-violet-300/15 to-fuchsia-200/10 text-3xl" aria-hidden="true">{business.ikon || "🏪"}</span>
                <div className="min-w-0 pt-1">
                  <p className="text-[11px] font-bold uppercase tracking-[.12em] text-fuchsia-200">{business.kategori}</p>
                  <h2 id="business-dialog-title" className="mt-1 text-2xl font-semibold tracking-[-.05em] text-[var(--text-primary)]">{business.nama}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--text-tertiary)]"><PinIcon />{business.kota || "Indonesia"}</p>
                </div>
              </div>

              <p className="mt-6 whitespace-pre-line text-sm leading-7 text-[var(--text-secondary)]">{business.deskripsi}</p>
              <div className="mt-5 grid gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-xs leading-5 text-[var(--text-secondary)] sm:grid-cols-2">
                {business.alamat && <p><span className="block font-semibold text-[var(--text-primary)]">Alamat</span>{business.alamat}</p>}
                {business.jamBuka && <p><span className="block font-semibold text-[var(--text-primary)]">Jam buka</span>{business.jamBuka}</p>}
                {business.harga && <p><span className="block font-semibold text-[var(--text-primary)]">Kisaran harga</span>{business.harga}</p>}
                {business.ig && <p><span className="block font-semibold text-[var(--text-primary)]">Instagram</span><a href={`https://instagram.com/${encodeURIComponent(business.ig.replace(/^@+/, ""))}`} target="_blank" rel="noreferrer" className="text-fuchsia-200 underline decoration-transparent underline-offset-2 hover:decoration-current">@{business.ig.replace(/^@+/, "")}</a></p>}
              </div>
              <a href={chatLink} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-300 to-teal-200 px-5 text-sm font-semibold text-[#14121f] shadow-md transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg active:scale-[.98]"><WhatsAppIcon /> Hubungi via WhatsApp</a>

              <div className="mt-8 border-t border-[var(--border-subtle)] pt-6">
                <div className="flex items-end justify-between gap-4">
                  <div><p className="text-[11px] font-bold uppercase tracking-[.12em] text-fuchsia-200">Cerita pelanggan</p><h3 className="mt-1 text-lg font-semibold tracking-[-.04em] text-[var(--text-primary)]">Ulasan pembeli</h3></div>
                  {reviews.length > 0 && <div className="text-right"><p className="text-xl font-semibold tracking-[-.04em] text-[var(--text-primary)]">{average.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} <span className="text-amber-200">★</span></p><p className="text-[11px] text-[var(--text-tertiary)]">{reviews.length} ulasan</p></div>}
                </div>
                {reviews.length ? <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">{reviews.map((review) => <li key={review.id} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5"><div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold text-[var(--text-primary)]">{review.nama || "Pengunjung"}</p><p className="text-xs tracking-[.08em] text-amber-200" aria-label={`${review.bintang} dari 5 bintang`}>{"★".repeat(Math.max(0, Math.min(5, review.bintang)))}</p></div><p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">{review.pesan}</p></li>)}</ul> : <p className="mt-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 text-xs leading-5 text-[var(--text-secondary)]">Belum ada ulasan. Jadilah yang pertama berbagi pengalaman.</p>}
              </div>
            </section>

            <section className="lg:border-l lg:border-[var(--border-subtle)] lg:pl-8">
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-5">
                <p className="text-[11px] font-bold uppercase tracking-[.12em] text-fuchsia-200">Bagikan pengalaman</p>
                <h3 className="mt-1 text-lg font-semibold tracking-[-.04em] text-[var(--text-primary)]">Tulis ulasan</h3>
                <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">Ulasan yang jujur membantu pembeli lain dan pemilik usaha.</p>

                {success && <p className="mt-4 rounded-xl border border-emerald-300/40 bg-emerald-300/10 px-3 py-2.5 text-xs text-emerald-200" role="status">✓ {success}</p>}
                {error && <p className="mt-4 rounded-xl border border-red-300/40 bg-red-300/10 px-3 py-2.5 text-xs text-red-200" role="alert">{error}</p>}
                <form onSubmit={handleReview} className="mt-5 space-y-4">
                  <fieldset>
                    <legend className="text-xs font-semibold text-[var(--text-primary)]">Penilaian Anda</legend>
                    <div className="mt-2 flex gap-1" role="group" aria-label="Pilih nilai bintang">
                      {[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" onClick={() => setRating(star)} aria-label={`${star} bintang`} aria-pressed={rating === star} className={`grid size-10 place-items-center rounded-lg text-xl transition-all duration-200 ease-out hover:scale-125 active:scale-95 ${star <= rating ? "text-amber-200 drop-shadow" : "text-slate-500 hover:text-amber-200"}`}>★</button>)}
                    </div>
                  </fieldset>
                  <label className="block text-xs font-semibold text-[var(--text-primary)]">Nama <span className="font-normal text-[var(--text-tertiary)]">(opsional)</span><input value={name} onChange={(event) => setName(event.target.value)} maxLength={40} placeholder="Nama Anda" className={fieldClass} /></label>
                  <label className="block text-xs font-semibold text-[var(--text-primary)]">Ulasan<input value={message} onChange={(event) => setMessage(event.target.value)} maxLength={200} minLength={3} required placeholder="Ceritakan pengalaman Anda..." className={fieldClass} /></label>
                  <div className="flex items-center justify-between gap-4"><span className="text-[11px] text-[var(--text-tertiary)]">{message.length}/200</span><button type="submit" disabled={busy} className="min-h-11 rounded-xl bg-gradient-to-r from-violet-300 to-fuchsia-200 px-4 text-xs font-semibold text-[#14121f] transition-all duration-200 ease-out hover:-translate-y-0.5 active:scale-[.98] disabled:cursor-wait disabled:opacity-60">{busy ? "Mengirim…" : "Kirim ulasan"}</button></div>
                </form>
              </div>
              <p className="mt-4 text-[11px] leading-5 text-[var(--text-tertiary)]">Jaga ulasan tetap sopan, relevan, dan berdasarkan pengalaman nyata.</p>
            </section>
          </div>
        </article>
      </div>
    </dialog>
  );
}

const fieldClass = "mt-2 min-h-11 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2.5 text-sm font-normal text-[var(--text-primary)] outline-none transition-all duration-200 placeholder:text-[var(--text-tertiary)] focus:border-violet-200/60 focus:ring-4 focus:ring-violet-200/10";
function PinIcon() { return <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M13 6.7c0 3.2-5 7.7-5 7.7S3 9.9 3 6.7a5 5 0 1 1 10 0Z"/><circle cx="8" cy="6.5" r="1.5"/></svg>; }
function WhatsAppIcon() { return <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16.8 9.7a6.8 6.8 0 0 1-10.1 5.9L3 16.5l.9-3.5A6.8 6.8 0 1 1 16.8 9.7Z"/><path d="M7.2 7.1c.4 2.1 1.7 3.4 3.8 4.2l.8-.8 1.4.7c.3.2.3.7 0 .9-.6.5-1.2.7-2 .5-2.4-.6-4.8-2.6-5.3-4.8-.2-.7.1-1.3.5-1.8.3-.3.8-.2.9.2l.6 1.4-.7.8Z"/></svg>; }
