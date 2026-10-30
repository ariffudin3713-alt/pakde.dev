"use client";

import { cloneElement, useState, type FormEvent, type ReactElement, type ReactNode } from "react";
import { CATEGORIES, type Business, type BusinessInput, type Category } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

interface RegistrationFormProps {
  ownerId: string;
  onCreate: (input: BusinessInput) => Promise<Business>;
}

const INITIAL: Omit<BusinessInput, "ownerId"> = {
  nama: "", kategori: "Kuliner", kota: "", alamat: "", ikon: "🏪", deskripsi: "", wa: "", ig: "", jamBuka: "", harga: "",
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
      setSuccess("Usaha Anda sudah ditambahkan ke direktori.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Usaha belum dapat disimpan. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[var(--shadow-card)] sm:p-7" noValidate>
      <div className="mb-7 border-b border-white/10 pb-5">
        <p className="text-[11px] font-bold uppercase tracking-[.14em] text-green-400">✨ {t("reg.free")}</p>
        <h3 className="mt-2 text-2xl font-bold tracking-[-.05em] text-white">{t("reg.formTitle")}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">Ceritakan usaha Anda agar lebih mudah ditemukan oleh pembeli di sekitar</p>
      </div>

      {success && <p className="mb-5 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-200" role="status">✓ {success}</p>}
      {error && <p className="mb-5 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200" role="alert">{error}</p>}

      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        <Field label="Nama usaha" required error={fieldError.nama}>
          <input required maxLength={80} autoComplete="organization" value={values.nama} onChange={(event) => update("nama", event.target.value)} placeholder="Contoh: Warung Bu Sri" className={inputClass} />
        </Field>
        <Field label="Kategori" required>
          <select value={values.kategori} onChange={(event) => update("kategori", event.target.value as Category)} className={inputClass}>{CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}</select>
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
        <Field label="Ikon usaha">
          <input maxLength={4} value={values.ikon} onChange={(event) => update("ikon", event.target.value)} placeholder="🏪" className={inputClass} />
        </Field>
        <Field label="Alamat lengkap">
          <input maxLength={200} autoComplete="street-address" value={values.alamat} onChange={(event) => update("alamat", event.target.value)} placeholder="Nama jalan atau patokan" className={inputClass} />
        </Field>
        <Field label="Jam buka">
          <input maxLength={60} value={values.jamBuka} onChange={(event) => update("jamBuka", event.target.value)} placeholder="Senin–Sabtu, 08.00–17.00" className={inputClass} />
        </Field>
        <Field label="Kisaran harga">
          <input maxLength={40} value={values.harga} onChange={(event) => update("harga", event.target.value)} placeholder="Rp 10.000–50.000" className={inputClass} />
        </Field>
        <div className="sm:col-span-2"><Field label="Deskripsi usaha" required error={fieldError.deskripsi}>
          <textarea required maxLength={500} rows={4} value={values.deskripsi} onChange={(event) => update("deskripsi", event.target.value)} placeholder="Ceritakan produk, jasa, dan keunggulan usaha Anda." className={`${inputClass} resize-y`} />
        </Field><span className="mt-1 block text-right text-[11px] text-slate-500">{values.deskripsi.length}/500 karakter</span></div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
        <button type="submit" disabled={busy} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 px-6 text-sm font-semibold text-white shadow-md transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-30px_rgba(236,72,153,0.9)] active:scale-[.98] disabled:cursor-wait disabled:opacity-60">
          {busy ? "Menyimpan…" : t("nav.list")}
        </button>
        <p className="text-xs leading-5 text-slate-300">✓ {t("reg.free")} • ✓ Tanpa komisi • ✓ {t("hero.direct")}</p>
      </div>
    </form>
  );
}

const inputClass = "mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-violet-400 focus:bg-white/10 focus:ring-4 focus:ring-violet-500/10";

function Field({ label, required = false, error, className = "", children }: { label: string; required?: boolean; error?: string; className?: string; children: ReactNode }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const field = cloneElement(children as ReactElement<{ id?: string; "aria-invalid"?: boolean }>, { id, "aria-invalid": Boolean(error) });
  return <div className={className}><label htmlFor={id} className="block text-xs font-semibold text-slate-200">{label}{required && <span className="ml-1 text-violet-400" aria-hidden="true">*</span>}</label>{field}{error && <p className="mt-1.5 text-xs text-red-300" role="alert">{error}</p>}</div>;
}
