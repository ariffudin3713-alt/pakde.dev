"use client";

import { useI18n } from "@/lib/i18n";

interface DirectoryStatsProps {
  businessCount: number;
  categoryCount: number;
  cityCount: number;
}

export function DirectoryStats({ businessCount, categoryCount, cityCount }: DirectoryStatsProps) {
  const { t, locale } = useI18n();
  return (
    <section className="relative mx-auto grid max-w-7xl gap-4 px-5 py-10 sm:grid-cols-3 sm:px-8 sm:py-14" aria-label="Ringkasan direktori">
      <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-gradient-to-r from-transparent via-slate-300/40 to-transparent dark:via-white/10" />
      <StatCard value={businessCount.toLocaleString(locale === "id" ? "id-ID" : "en-US")} label={t("stats.business")} detail={t("stats.businessDesc")} icon="✨" glow="from-blue-500/10 to-transparent" />
      <StatCard value={String(categoryCount)} label={t("stats.cat")} detail={t("stats.catDesc")} icon="🎯" glow="from-sky-500/10 to-transparent" />
      <StatCard value={String(cityCount)} label={t("stats.city")} detail={t("stats.cityDesc")} icon="📍" glow="from-indigo-500/10 to-transparent" />
    </section>
  );
}

function StatCard({ value, label, detail, icon, glow }: { value: string; label: string; detail: string; icon: string; glow: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5">
      <div className={`absolute -right-16 -top-16 size-32 rounded-full bg-gradient-to-br ${glow} blur-3xl`} />
      <div className="relative flex items-center gap-4">
        <span className="grid size-12 place-items-center rounded-xl bg-slate-100 text-xl dark:bg-white/10">{icon}</span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 text-4xl font-semibold tracking-[-.06em] text-slate-900 dark:text-white">{value}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{detail}</p>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const { t } = useI18n();
  return (
    <section id="cara-kerja" className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-slate-300/40 to-transparent dark:via-white/10" />
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">{t("how.label")}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-.06em] text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">{t("how.title")}</h2>
        <p className="mt-4 text-base text-slate-600 dark:text-slate-300">{t("how.desc")}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Step number="01" title={t("how.step1Title")} text={t("how.step1Text")} icon="✍️" accent="from-blue-500 to-indigo-500" />
        <Step number="02" title={t("how.step2Title")} text={t("how.step2Text")} icon="🚀" accent="from-indigo-500 to-blue-600" />
        <Step number="03" title={t("how.step3Title")} text={t("how.step3Text")} icon="💬" accent="from-sky-500 to-blue-600" />
      </div>
    </section>
  );
}

function Step({ number, title, text, icon, accent }: { number: string; title: string; text: string; icon: string; accent: string }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-7 shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5">
      <div className={`absolute -right-16 -top-16 size-32 rounded-full bg-gradient-to-br ${accent} opacity-10 blur-3xl`} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className={`grid size-12 place-items-center rounded-xl bg-gradient-to-br ${accent} text-xl text-white`}>{icon}</span>
          <span className="text-4xl font-semibold tracking-[-.08em] text-slate-200 dark:text-white/10">{number}</span>
        </div>
        <h3 className="mt-6 text-xl font-semibold tracking-[-.04em] text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
      </div>
    </article>
  );
}

export function RegistrationIntro() {
  const { t } = useI18n();
  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <p className="text-[11px] font-bold uppercase tracking-[.15em] text-[var(--color-accent)]">{t("reg.label")}</p>
      <h2 className="mt-3 max-w-sm text-3xl font-bold leading-tight tracking-[-.06em] text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">{t("reg.title")}</h2>
      <p className="mt-4 max-w-sm text-base leading-7 text-slate-600 dark:text-slate-300">{t("reg.desc")}</p>
      <div className="mt-8 hidden space-y-4 lg:block">
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[var(--shadow-soft)] dark:border-white/10 dark:bg-white/5">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">✅ {t("reg.free")}</p>
          <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{t("reg.freeDesc")}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[var(--shadow-soft)] dark:border-white/10 dark:bg-white/5">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">🚀 {t("reg.live")}</p>
          <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{t("reg.liveDesc")}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[var(--shadow-soft)] dark:border-white/10 dark:bg-white/5">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">👨‍👩‍👧‍👦 {t("reg.forAll")}</p>
          <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{t("reg.forAllDesc")}</p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const { t } = useI18n();
  return (
    <section id="faq" className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-slate-300/40 to-transparent dark:via-white/10" />
      <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">{t("faq.label")}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-.06em] text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">{t("faq.title")}</h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300">{t("faq.desc")}</p>
        </div>
        <div className="space-y-3">
          <Faq question={t("faq.q1")} answer={t("faq.a1")} />
          <Faq question={t("faq.q2")} answer={t("faq.a2")} />
          <Faq question={t("faq.q3")} answer={t("faq.a3")} />
          <Faq question={t("faq.q4")} answer={t("faq.a4")} />
          <Faq question={t("faq.q5")} answer={t("faq.a5")} />
        </div>
      </div>
    </section>
  );
}

function Faq({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[var(--shadow-soft)] dark:border-white/10 dark:bg-white/5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-5 p-6 text-base font-semibold text-slate-900 dark:text-white marker:hidden">
        <span className="flex-1">{question}</span>
        <span className="grid size-9 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-500 transition-all group-open:rotate-45 dark:border-white/10 dark:text-slate-400" aria-hidden="true">+</span>
      </summary>
      <div className="px-6 pb-6">
        <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">{answer}</p>
      </div>
    </details>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="relative border-t border-slate-200/70 bg-white text-slate-900 dark:border-white/10 dark:bg-[#050510] dark:text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/40 to-transparent dark:via-white/10" />
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <a href="#home" className="text-lg font-semibold tracking-[-.03em]">pasar<span style={{ color: "var(--color-accent)" }}>umkm</span></a>
            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-600 dark:text-slate-300">{t("footer.desc")}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">{t("footer.nav")}</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li><a href="#home" className="transition-colors hover:text-[var(--color-accent)]">{t("nav.home")}</a></li>
              <li><a href="#jelajahi" className="transition-colors hover:text-[var(--color-accent)]">{t("nav.directory")}</a></li>
              <li><a href="#cara-kerja" className="transition-colors hover:text-[var(--color-accent)]">{t("nav.approach")}</a></li>
              <li><a href="#daftar" className="transition-colors hover:text-[var(--color-accent)]">{t("nav.list")}</a></li>
              <li><a href="#faq" className="transition-colors hover:text-[var(--color-accent)]">{t("nav.faq")}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">{t("footer.vibe")}</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>{t("footer.vibe1")}</li>
              <li>{t("footer.vibe2")}</li>
              <li>{t("footer.vibe3")}</li>
              <li>{t("footer.vibe4")}</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200/70 pt-6 text-center dark:border-white/10">
          <p className="text-xs text-slate-500 dark:text-slate-400">© {new Date().getFullYear()} Pasar UMKM • {t("footer.made")}</p>
        </div>
      </div>
    </footer>
  );
}

interface MobileNavigationProps {
  favoritesOnly: boolean;
  onToggleFavorites: () => void;
}

export function MobileNavigation({ favoritesOnly, onToggleFavorites }: MobileNavigationProps) {
  const { t } = useI18n();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-slate-200/70 bg-white px-2 py-2 shadow-[0_-8px_30px_rgba(15,23,42,.06)] md:hidden dark:border-white/10 dark:bg-[#050510]" aria-label="Navigasi cepat">
      <MobileLink href="#home" label={t("mobile.home")} icon="⌂" />
      <MobileLink href="#jelajahi" label={t("mobile.explore")} icon="⌕" />
      <MobileLink href="#daftar" label={t("mobile.list")} icon="＋" />
      <button type="button" aria-pressed={favoritesOnly} onClick={onToggleFavorites} className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-medium transition-colors ${favoritesOnly ? "text-[var(--color-accent)]" : "text-slate-500 dark:text-slate-400"}`}><span className="text-lg leading-5" aria-hidden="true">♡</span>{t("mobile.fav")}</button>
    </nav>
  );
}

function MobileLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return <a href={href} className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-medium text-slate-500 transition-colors hover:text-[var(--color-accent)] dark:text-slate-400 dark:hover:text-[var(--color-accent)]"><span className="text-lg leading-5" aria-hidden="true">{icon}</span>{label}</a>;
}
