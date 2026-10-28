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
      className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-ink backdrop:bg-[#101814]/55 backdrop:backdrop-blur-sm"
    >
      <div className="grid min-h-dvh place-items-center p-3 sm:p-6">
        <article className="relative max-h-[94dvh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-line bg-white shadow-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
            <p className="text-xs font-semibold text-muted">Detail usaha</p>
            <button type="button" autoFocus onClick={onClose} aria-label="Tutup detail usaha" className="grid size-10 place-items-center rounded-xl border border-line text-lg text-muted transition-all duration-[250ms] ease-out hover:border-[#cbd7ce] hover:bg-[#f5f7f5] hover:text-ink active:scale-95">×</button>
          </div>

          <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[1.05fr_.95fr] lg:gap-10">
            <section>
              <div className="flex items-start gap-4">
                <span className="grid size-16 shrink-0 place-items-center rounded-2xl border border-line bg-[#f5f6f4] text-3xl" aria-hidden="true">{business.ikon || "🏪"}</span>
                <div className="min-w-0 pt-1">
                  <p className="text-[11px] font-bold uppercase tracking-[.12em] text-accent">{business.kategori}</p>
                  <h2 id="business-dialog-title" className="mt-1 text-2xl font-semibold tracking-[-.05em] text-ink">{business.nama}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted"><PinIcon />{business.kota || "Indonesia"}</p>
                </div>
              </div>

              <p className="mt-6 whitespace-pre-line text-sm leading-7 text-muted">{business.deskripsi}</p>
              <div className="mt-5 grid gap-3 rounded-2xl bg-[#f5f6f4] p-4 text-xs leading-5 text-muted sm:grid-cols-2">
                {business.alamat && <p><span className="block font-semibold text-ink">Alamat</span>{business.alamat}</p>}
                {business.jamBuka && <p><span className="block font-semibold text-ink">Jam buka</span>{business.jamBuka}</p>}
                {business.harga && <p><span className="block font-semibold text-ink">Kisaran harga</span>{business.harga}</p>}
                {business.ig && <p><span className="block font-semibold text-ink">Instagram</span><a href={`https://instagram.com/${encodeURIComponent(business.ig.replace(/^@+/, ""))}`} target="_blank" rel="noreferrer" className="text-accent underline decoration-transparent underline-offset-2 hover:decoration-current">@{business.ig.replace(/^@+/, "")}</a></p>}
              </div>
              <a href={chatLink} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-white transition-all duration-[250ms] ease-out hover:-translate-y-0.5 hover:bg-accent-deep hover:shadow-md active:scale-[.98]"><WhatsAppIcon /> Hubungi lewat WhatsApp</a>

              <div className="mt-8 border-t border-line pt-6">
                <div className="flex items-end justify-between gap-4">
                  <div><p className="text-[11px] font-bold uppercase tracking-[.12em] text-accent">Cerita pelanggan</p><h3 className="mt-1 text-lg font-semibold tracking-[-.04em] text-ink">Ulasan pembeli</h3></div>
                  {reviews.length > 0 && <div className="text-right"><p className="text-xl font-semibold tracking-[-.04em] text-ink">{average.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} <span className="text-amber-500">★</span></p><p className="text-[11px] text-muted">{reviews.length} ulasan</p></div>}
                </div>
                {reviews.length ? <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">{reviews.map((review) => <li key={review.id} className="rounded-xl border border-line p-3.5"><div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold text-ink">{review.nama || "Pengunjung"}</p><p className="text-xs tracking-[.08em] text-amber-500" aria-label={`${review.bintang} dari 5 bintang`}>{"★".repeat(Math.max(0, Math.min(5, review.bintang)))}</p></div><p className="mt-2 text-xs leading-5 text-muted">{review.pesan}</p></li>)}</ul> : <p className="mt-4 rounded-xl bg-[#f5f6f4] px-4 py-3 text-xs leading-5 text-muted">Belum ada ulasan. Jadilah yang pertama berbagi pengalaman.</p>}
              </div>
            </section>

            <section className="lg:border-l lg:border-line lg:pl-8">
              <div className="rounded-2xl border border-line bg-[#fbfcfb] p-4 sm:p-5">
                <p className="text-[11px] font-bold uppercase tracking-[.12em] text-accent">Bagikan pengalaman</p>
                <h3 className="mt-1 text-lg font-semibold tracking-[-.04em] text-ink">Tulis ulasan</h3>
                <p className="mt-1 text-xs leading-5 text-muted">Ulasan yang jujur membantu pembeli lain dan pemilik usaha.</p>

                {success && <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-900" role="status">✓ {success}</p>}
                {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-900" role="alert">{error}</p>}
                <form onSubmit={handleReview} className="mt-5 space-y-4">
                  <fieldset>
                    <legend className="text-xs font-semibold text-ink">Penilaian Anda</legend>
                    <div className="mt-2 flex gap-1" role="group" aria-label="Pilih nilai bintang">
                      {[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" onClick={() => setRating(star)} aria-label={`${star} bintang`} aria-pressed={rating === star} className={`grid size-10 place-items-center rounded-lg text-xl transition-all duration-[250ms] ease-out hover:scale-110 active:scale-95 ${star <= rating ? "text-amber-500" : "text-[#cbd2cc] hover:text-amber-400"}`}>★</button>)}
                    </div>
                  </fieldset>
                  <label className="block text-xs font-semibold text-ink">Nama <span className="font-normal text-muted">(opsional)</span><input value={name} onChange={(event) => setName(event.target.value)} maxLength={40} placeholder="Nama Anda" className={fieldClass} /></label>
                  <label className="block text-xs font-semibold text-ink">Ulasan<input value={message} onChange={(event) => setMessage(event.target.value)} maxLength={200} minLength={3} required placeholder="Ceritakan pengalaman Anda..." className={fieldClass} /></label>
                  <div className="flex items-center justify-between gap-4"><span className="text-[11px] text-muted">{message.length}/200</span><button type="submit" disabled={busy} className="min-h-11 rounded-xl bg-[#17211b] px-4 text-xs font-semibold text-white transition-all duration-[250ms] ease-out hover:bg-accent active:scale-[.98] disabled:cursor-wait disabled:opacity-60">{busy ? "Mengirim…" : "Kirim ulasan"}</button></div>
                </form>
              </div>
              <p className="mt-4 text-[11px] leading-5 text-muted">Jaga ulasan tetap sopan, relevan, dan berdasarkan pengalaman nyata.</p>
            </section>
          </div>
        </article>
      </div>
    </dialog>
  );
}

const fieldClass = "mt-2 min-h-11 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm font-normal text-ink outline-none transition-all duration-[250ms] placeholder:text-[#929c94] focus:border-accent focus:ring-4 focus:ring-[#176344]/10";
function PinIcon() { return <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M13 6.7c0 3.2-5 7.7-5 7.7S3 9.9 3 6.7a5 5 0 1 1 10 0Z"/><circle cx="8" cy="6.5" r="1.5"/></svg>; }
function WhatsAppIcon() { return <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16.8 9.7a6.8 6.8 0 0 1-10.1 5.9L3 16.5l.9-3.5A6.8 6.8 0 1 1 16.8 9.7Z"/><path d="M7.2 7.1c.4 2.1 1.7 3.4 3.8 4.2l.8-.8 1.4.7c.3.2.3.7 0 .9-.6.5-1.2.7-2 .5-2.4-.6-4.8-2.6-5.3-4.8-.2-.7.1-1.3.5-1.8.3-.3.8-.2.9.2l.6 1.4-.7.8Z"/></svg>; }
