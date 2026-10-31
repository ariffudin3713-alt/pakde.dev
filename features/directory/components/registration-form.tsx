"use client";

import { cloneElement, useState, type FormEvent, type ReactElement, type ReactNode } from "react";
import { CATEGORIES, type Business, type BusinessInput, type Category } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { getCategoryPreview } from "@/features/directory/local-photo";
import { ClockIcon, HeartIcon, PinIcon, WhatsAppIcon } from "./icons";

interface RegistrationFormProps {
  ownerId: string;
  onCreate: (input: BusinessInput) => Promise<Business>;
}

const INITIAL: Omit<BusinessInput, "ownerId"> = {
  nama: "", kategori: "Kuliner", kota: "", alamat: "", ikon: "", deskripsi: "", wa: "", ig: "", jamBuka: "", harga: "",
};

export function RegistrationForm({ ownerId, onCreate }: RegistrationFormProps) {
  const { t } = useI18n();
  const [values, setValues] = useState(INITIAL);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldError, setFieldError] = useState<Partial<Record<keyof BusinessInput, string>>>({});

  function update<K extends keyof typeof INITIAL>(key: K, value: (typeof INITIAL)[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setFieldError((current) => ({ ...current, [key]: undefined }));
    setError("");
  }

  function validate(): boolean {
    const next: Partial<Record<keyof BusinessInput, string>> = {};
    if (values.nama.trim().length < 2) next.nama = "Nama usaha minimal 2 karakter.";
    if (values.deskripsi.trim().length < 10) next.deskripsi = "Deskripsi minimal 10 karakter.";
    if (values.wa.replace(/\D/g, "").length < 9) next.wa = "Masukkan nomor WhatsApp yang valid.";
    if (values.ig && !/^[A-Za-z0-9._]{2,40}$/.test(values.ig.replace(/^@+/, ""))) next.ig = "Masukkan username Instagram tanpa @.";
    setFieldError(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess("");
    if (!validate()) return;
    setBusy(true);
    try {
      await onCreate({ ...values, nama: values.nama.trim(), deskripsi: values.deskripsi.trim(), wa: values.wa.trim(), ig: values.ig.replace(/^@+/, "").trim(), ownerId });
      setValues(INITIAL);
      setFieldError({});
      setSuccess(t("reg.success"));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Usaha belum dapat disimpan. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-bone p-5 sm:p-7 lg:p-8" noValidate>
      <div className="grid gap-10 lg:grid-cols-[1.08fr_.92fr] lg:gap-12">
        <div>
          <h3 className="text-[clamp(1.25rem,2.2vw,1.95rem)]">{t("reg.formTitle")}</h3>
          <p className="mt-2 max-w-[46ch] text-[16px] leading-[1.55] text-ink/80">{t("reg.formDesc")}</p>

          {success && <p className="mt-5 bg-leaf px-4 py-3 font-display text-[16px] font-semibold text-bone" role="status">{success}</p>}
          {error && <p className="mt-5 bg-blood px-4 py-3 font-display text-[16px] font-semibold text-bone" role="alert">{error}</p>}

          <div className="mt-6 grid gap-x-4 gap-y-5 sm:grid-cols-2">
            <Field label="Nama usaha" required error={fieldError.nama}>
              <input required maxLength={80} autoComplete="organization" value={values.nama} onChange={(event) => update("nama", event.target.value)} placeholder="Contoh: Warung Bu Sri" className={inputClass} />
            </Field>
            <Field label="Kategori" required>
              <select value={values.kategori} onChange={(event) => update("kategori", event.target.value as Category)} className={inputClass}>
                {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </Field>
            <Field label="Kota atau kabupaten">
              <input maxLength={80} autoComplete="address-level2" value={values.kota} onChange={(event) => update("kota", event.target.value)} placeholder="Contoh: Surakarta" className={inputClass} />
            </Field>
            <Field label="WhatsApp" required error={fieldError.wa}>
              <input required inputMode="tel" autoComplete="tel" maxLength={20} value={values.wa} onChange={(event) => update("wa", event.target.value)} placeholder="081234567890" className={inputClass} />
            </Field>
            <Field label="Instagram" error={fieldError.ig}>
              <input maxLength={40} value={values.ig} onChange={(event) => update("ig", event.target.value)} placeholder="namausaha" className={inputClass} />
            </Field>
            <Field label="Jam buka">
              <input maxLength={60} value={values.jamBuka} onChange={(event) => update("jamBuka", event.target.value)} placeholder="Senin–Sabtu, 08.00–17.00" className={inputClass} />
            </Field>
            <Field label="Alamat lengkap">
              <input maxLength={200} autoComplete="street-address" value={values.alamat} onChange={(event) => update("alamat", event.target.value)} placeholder="Nama jalan atau patokan" className={inputClass} />
            </Field>
            <Field label="Kisaran harga">
              <input maxLength={40} value={values.harga} onChange={(event) => update("harga", event.target.value)} placeholder="Rp 10.000–50.000" className={inputClass} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Deskripsi usaha" required error={fieldError.deskripsi}>
                <textarea required maxLength={500} rows={4} value={values.deskripsi} onChange={(event) => update("deskripsi", event.target.value)} placeholder="Ceritakan produk, jasa, dan keunggulan usaha Anda." className={`${inputClass} resize-y`} />
              </Field>
              <span className="mt-1 block text-right text-[13px] text-muted">{values.deskripsi.length}/500 karakter</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button type="submit" disabled={busy} className="btn w-full disabled:cursor-wait disabled:opacity-60 sm:w-auto">
              {busy ? t("reg.saving") : t("reg.submit")}
            </button>
            <p className="text-[13px] leading-5 text-muted">
              {t("reg.free")} · {t("reg.live")} · {t("hero.direct")}
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-[104px] lg:self-start" aria-live="polite">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-display text-[16px] font-bold text-blood">{t("reg.preview")}</p>
            <p className="text-[13px] text-muted">Pasar UMKM</p>
          </div>
          <p className="mt-2 max-w-[38ch] text-[16px] leading-5 text-muted">{t("reg.previewHint")}</p>

          <RegistrationPreview values={values} />
        </aside>
      </div>
    </form>
  );
}

function RegistrationPreview({ values }: { values: typeof INITIAL }) {
  const { t } = useI18n();
  const previewPhoto = getCategoryPreview(values.kategori);
  const initial = values.nama.trim().charAt(0).toUpperCase() || "?";
  const name = values.nama.trim() || t("reg.previewName");
  const description = values.deskripsi.trim() || t("reg.previewDesc");
  const isPlaceholder = !values.nama.trim();

  return (
    <>
      <article className="mt-5 bg-ground">
        <div className="relative aspect-[16/10] overflow-hidden bg-paper">
          {previewPhoto ? (
            <img
              src={previewPhoto.src}
              width={previewPhoto.width}
              height={previewPhoto.height}
              alt={previewPhoto.alt}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-blood text-bone">
              <div className="flex flex-col items-center gap-2">
                <span className="font-heading text-[clamp(2.6rem,4vw,3.4rem)] leading-none">{initial}</span>
                <span className="font-display text-[13px] font-semibold">{values.kategori}</span>
              </div>
            </div>
          )}

          <span className="absolute right-3 top-3 grid size-10 place-items-center bg-bone text-ink" aria-hidden="true">
            <HeartIcon size={19} />
          </span>
        </div>

        <div className="p-5">
          <h4 className={`max-w-[26ch] text-[clamp(1.25rem,2.2vw,1.95rem)] leading-[1.04] ${isPlaceholder ? "text-ink/45" : ""}`}>
            {name}
          </h4>

          <p className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-display text-[13px] font-semibold text-muted">
            <span>{values.kategori}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <PinIcon size={13} />
              {values.kota.trim() || "Indonesia"}
            </span>
          </p>

          <p className={`mt-2.5 line-clamp-3 max-w-[46ch] text-[16px] leading-[1.55] ${values.deskripsi.trim() ? "text-ink/80" : "text-muted"}`}>
            {description}
          </p>

          <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-2 text-[13px] text-muted">
            {values.harga.trim() && (
              <span>
                {t("card.price")} <span className="font-display font-semibold text-ink">{values.harga}</span>
              </span>
            )}
            {values.jamBuka.trim() && (
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon size={13} />
                {values.jamBuka}
              </span>
            )}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="btn min-h-11 flex-1 cursor-default opacity-70">
              <WhatsAppIcon size={17} />
              {t("card.chat")}
            </span>
          </div>
        </div>
      </article>

      <p className="mt-3 text-[13px] leading-5 text-muted">
        {previewPhoto ? `${t("reg.photoNote")} Foto: ${previewPhoto.credit}.` : t("reg.photoNote")}
      </p>
    </>
  );
}

const inputClass = "field mt-2";

function Field({ label, required = false, error, className = "", children }: { label: string; required?: boolean; error?: string; className?: string; children: ReactNode }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const field = cloneElement(children as ReactElement<{ id?: string; "aria-invalid"?: boolean }>, { id, "aria-invalid": Boolean(error) });
  return (
    <div className={className}>
      <label htmlFor={id} className="block font-display text-[16px] font-semibold text-ink">
        {label}
        {required && <span className="ml-1 text-blood" aria-hidden="true">*</span>}
      </label>
      {field}
      {error && <p className="mt-1.5 text-[13px] font-semibold text-blood" role="alert">{error}</p>}
    </div>
  );
}
