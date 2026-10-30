"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Business, ReviewInput } from "@/lib/types";
import { CategoryMark, CloseIcon, PinIcon, StarIcon, WhatsAppIcon } from "./icons";

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
      className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-ink backdrop:bg-ink/70"
    >
      <div className="grid min-h-dvh place-items-center sm:p-6">
        <article className="relative max-h-dvh w-full max-w-4xl overflow-y-auto bg-ground sm:max-h-[92dvh]">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-ground px-5 py-4 sm:px-8">
            <p className="font-display text-[16px] font-semibold text-muted">Detail usaha</p>
            <button type="button" autoFocus onClick={onClose} aria-label="Tutup detail usaha" className="grid size-11 place-items-center bg-paper text-ink transition-colors duration-150 hover:text-blood">
              <CloseIcon size={20} />
            </button>
          </div>

          <div className="grid gap-8 px-5 pb-8 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-12 lg:pb-10">
            <section>
              <div className="flex items-start gap-4">
                <span className="grid size-16 shrink-0 place-items-center bg-blood text-bone" aria-hidden="true">
                  <CategoryMark category={business.kategori} tone="bone" />
                </span>
                <div className="min-w-0 pt-1">
                  <p className="font-display text-[13px] font-semibold text-muted">{business.kategori}</p>
                  <h2 id="business-dialog-title" className="mt-1 text-[clamp(1.9rem,3.6vw,3.4rem)] leading-[1.02]">{business.nama}</h2>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[16px] text-muted">
                    <PinIcon size={14} />
                    {business.kota || "Indonesia"}
                  </p>
                </div>
              </div>

              <p className="mt-6 whitespace-pre-line text-[16px] leading-[1.6] text-ink/85">{business.deskripsi}</p>

              <dl className="mt-6 grid gap-4 bg-paper p-4 text-[16px] leading-5 sm:grid-cols-2">
                {business.alamat && (
                  <div>
                    <dt className="font-display font-bold">Alamat</dt>
                    <dd className="mt-1 text-ink/80">{business.alamat}</dd>
                  </div>
                )}
                {business.jamBuka && (
                  <div>
                    <dt className="font-display font-bold">Jam buka</dt>
                    <dd className="mt-1 text-ink/80">{business.jamBuka}</dd>
                  </div>
                )}
                {business.harga && (
                  <div>
                    <dt className="font-display font-bold">Kisaran harga</dt>
                    <dd className="mt-1 text-ink/80">{business.harga}</dd>
                  </div>
                )}
                {business.ig && (
                  <div>
                    <dt className="font-display font-bold">Instagram</dt>
                    <dd className="mt-1">
                      <a href={`https://instagram.com/${encodeURIComponent(business.ig.replace(/^@+/, ""))}`} target="_blank" rel="noreferrer" className="text-blood underline decoration-2 underline-offset-2">
                        @{business.ig.replace(/^@+/, "")}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>

              <a href={chatLink} target="_blank" rel="noreferrer" className="btn mt-5 w-full">
                <WhatsAppIcon size={17} />
                Hubungi via WhatsApp
              </a>

              <div className="mt-8">
                <div className="flex items-end justify-between gap-4">
                  <h3 className="text-[clamp(1.45rem,2.2vw,1.95rem)]">Ulasan pembeli</h3>
                  {reviews.length > 0 && (
                    <p className="flex items-center gap-1.5 font-display text-[20px] font-bold">
                      {average.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                      <StarIcon size={16} className="text-blood" />
                    </p>
                  )}
                </div>
                {reviews.length ? (
                  <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto pr-1">
                    {reviews.map((review) => (
                      <li key={review.id} className="bg-paper p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-display text-[16px] font-semibold">{review.nama || "Pengunjung"}</p>
                          <p className="flex items-center gap-0.5 text-blood" aria-label={`${review.bintang} dari 5 bintang`}>
                            {[1, 2, 3, 4, 5].map((star) => <StarIcon key={star} size={13} filled={star <= review.bintang} />)}
                          </p>
                        </div>
                        <p className="mt-2 text-[16px] leading-5 text-ink/80">{review.pesan}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 bg-paper px-4 py-5 text-[16px] leading-5 text-ink/75">
                    Belum ada ulasan. Jadilah yang pertama berbagi pengalaman.
                  </p>
                )}
              </div>
            </section>

            <section className="bg-paper p-4 sm:p-6 lg:self-start">
              <h3 className="text-[clamp(1.45rem,2.2vw,1.95rem)]">Tulis ulasan</h3>
              <p className="mt-2 text-[16px] leading-5 text-ink/75">Ulasan yang jujur membantu pembeli lain dan pemilik usaha.</p>

              {success && <p className="mt-4 bg-leaf px-3 py-2.5 font-display text-[13px] font-semibold text-bone" role="status">{success}</p>}
              {error && <p className="mt-4 bg-blood px-3 py-2.5 font-display text-[13px] font-semibold text-bone" role="alert">{error}</p>}

              <form onSubmit={handleReview} className="mt-5 space-y-4">
                <fieldset>
                  <legend className="font-display text-[16px] font-semibold">Penilaian Anda</legend>
                  <div className="mt-2 flex gap-1" role="group" aria-label="Pilih nilai bintang">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        aria-label={`${star} bintang`}
                        aria-pressed={rating === star}
                        className={`grid size-10 place-items-center transition-colors duration-150 ${star <= rating ? "text-blood" : "text-muted hover:text-blood"}`}
                      >
                        <StarIcon size={22} filled={star <= rating} />
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label className="block font-display text-[16px] font-semibold text-ink">
                  Nama <span className="font-normal text-muted">(opsional)</span>
                  <input value={name} onChange={(event) => setName(event.target.value)} maxLength={40} placeholder="Nama Anda" className={fieldClass} />
                </label>

                <label className="block font-display text-[16px] font-semibold text-ink">
                  Ulasan
                  <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={200} minLength={3} required rows={4} placeholder="Ceritakan pengalaman Anda..." className={`${fieldClass} resize-y`} />
                </label>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-[13px] text-muted">{message.length}/200</span>
                  <button type="submit" disabled={busy} className="btn min-h-11 disabled:cursor-wait disabled:opacity-60">
                    {busy ? "Mengirim…" : "Kirim ulasan"}
                  </button>
                </div>
              </form>
              <p className="mt-4 text-[13px] leading-5 text-muted">Jaga ulasan tetap sopan, relevan, dan berdasarkan pengalaman nyata.</p>
            </section>
          </div>
        </article>
      </div>
    </dialog>
  );
}

const fieldClass = "field mt-2";
