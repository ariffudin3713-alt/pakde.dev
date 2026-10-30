"use client";

import { cloneElement, useState, type FormEvent, type ReactElement, type ReactNode } from "react";
import { CATEGORIES, type Business, type BusinessInput, type Category } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

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
    <form onSubmit={handleSubmit} className="bg-paper p-5 sm:p-7" noValidate>
      <div className="max-w-[46ch]">
        <h3 className="text-[clamp(1.45rem,2.2vw,1.95rem)]">{t("reg.formTitle")}</h3>
        <p className="mt-2 text-[16px] leading-[1.55] text-ink/80">{t("reg.formDesc")}</p>
      </div>

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
    </form>
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
