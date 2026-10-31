"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export function SiteHeader() {
  const { locale, setLocale, t } = useI18n();

  return (
    <header className="sticky top-0 z-50 bg-ground">
      <div className="mx-auto flex h-[76px] max-w-[var(--page-max)] items-center justify-between gap-4 px-[var(--page-x)]">
        <Link href="#home" className="group flex shrink-0 items-center" aria-label="Pasar UMKM, kembali ke beranda">
          <span className="font-display text-[16px] font-bold uppercase leading-none tracking-[-.02em] sm:text-[20px]">
            Pasar<span className="text-blood"> UMKM</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-[16px] md:flex" aria-label="Navigasi utama">
          <Link className="underline decoration-transparent decoration-2 underline-offset-[6px] transition-colors duration-150 hover:text-blood hover:decoration-blood" href="#jelajahi">{t("nav.directory")}</Link>
          <Link className="underline decoration-transparent decoration-2 underline-offset-[6px] transition-colors duration-150 hover:text-blood hover:decoration-blood" href="#cara-kerja">{t("nav.approach")}</Link>
          <Link className="underline decoration-transparent decoration-2 underline-offset-[6px] transition-colors duration-150 hover:text-blood hover:decoration-blood" href="#daftar">{t("nav.list")}</Link>
          <Link className="underline decoration-transparent decoration-2 underline-offset-[6px] transition-colors duration-150 hover:text-blood hover:decoration-blood" href="#faq">{t("nav.faq")}</Link>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setLocale(locale === "id" ? "en" : "id")}
            className="inline-flex min-h-11 items-center px-2 font-display text-[13px] font-bold tracking-[.02em] transition-colors duration-150 hover:text-blood"
            aria-label={t("lang.switch")}
            title={t("lang.switch")}
          >
            <span className={locale === "id" ? "text-ink" : "text-muted"}>ID</span>
            <span className="px-1 text-muted" aria-hidden="true">/</span>
            <span className={locale === "en" ? "text-ink" : "text-muted"}>EN</span>
          </button>
          <Link href="#daftar" className="btn hidden min-h-11 sm:inline-flex">
            {t("nav.getStarted")}
          </Link>
        </div>
      </div>
      <div className="h-1 bg-blood" aria-hidden="true" />
    </header>
  );
}
