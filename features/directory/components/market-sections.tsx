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
      <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-gradient-to-r from-transparent via-violet-500/25 to-transparent" />
      <StatCard value={businessCount.toLocaleString(locale === "id" ? "id-ID" : "en-US")} label={t("stats.business")} detail={t("stats.businessDesc")} icon="✨" glow="from-violet-500/35 via-fuchsia-500/25 to-transparent" />
      <StatCard value={String(categoryCount)} label={t("stats.cat")} detail={t("stats.catDesc")} icon="🎯" glow="from-fuchsia-500/35 via-pink-500/25 to-transparent" />
      <StatCard value={String(cityCount)} label={t("stats.city")} detail={t("stats.cityDesc")} icon="📍" glow="from-cyan-400/25 via-violet-500/20 to-transparent" />
    </section>
  );
}

function StatCard({ value, label, detail, icon, glow }: { value: string; label: string; detail: string; icon: string; glow: string }) {
  return (
    <div className="group relative overflow-hidden rounded-[1.8rem] border border-slate-200/70 dark:border-white/10 bg-white/80 dark:bg-white/5 p-6 shadow-[0_60px_120px_-90px_rgba(139,92,246,0.9)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_80px_140px_-90px_rgba(236,72,153,0.9)]">
      <div className={`absolute -right-20 -top-20 size-40 rounded-full bg-gradient-to-br ${glow} blur-3xl`} />
      <div className="relative flex items-center gap-4">
        <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500/90 to-fuchsia-500/90 text-xl text-white shadow-[0_40px_80px_-50px_rgba(236,72,153,0.95)]">{icon}</span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 text-4xl font-semibold tracking-[-.08em] text-slate-900 dark:text-white">{value}</p>
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
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-violet-500/25 to-transparent" />
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-fuchsia-500 dark:text-fuchsia-400">{t("how.label")}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-.08em] text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">{t("how.title")}</h2>
        <p className="mt-4 text-base text-slate-600 dark:text-slate-300">{t("how.desc")}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Step number="01" title={t("how.step1Title")} text={t("how.step1Text")} icon="✍️" accent="from-violet-500 to-fuchsia-500" />
        <Step number="02" title={t("how.step2Title")} text={t("how.step2Text")} icon="🚀" accent="from-fuchsia-500 to-pink-500" />
        <Step number="03" title={t("how.step3Title")} text={t("how.step3Text")} icon="💬" accent="from-pink-500 to-orange-400" />
      </div>
    </section>
  );
}

function Step({ number, title, text, icon, accent }: { number: string; title: string; text: string; icon: string; accent: string }) {
  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-slate-200/70 dark:border-white/10 bg-white/80 dark:bg-white/5 p-7 shadow-[0_70px_140px_-100px_rgba(139,92,246,0.9)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_90px_160px_-100px_rgba(236,72,153,0.95)]">
      <div className={`absolute -right-16 -top-16 size-32 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-3xl`} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className={`grid size-12 place-items-center rounded-2xl bg-gradient-to-br ${accent} text-xl text-white shadow-[0_40px_80px_-50px_rgba(236,72,153,0.95)]`}>{icon}</span>
          <span className="text-4xl font-semibold tracking-[-.1em] text-slate-200 dark:text-white/10">{number}</span>
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
      <p className="text-[11px] font-bold uppercase tracking-[.15em] text-violet-600 dark:text-fuchsia-400">{t("reg.label")}</p>
      <h2 className="mt-3 max-w-sm text-3xl font-bold leading-tight tracking-[-.06em] text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">{t("reg.title")}</h2>
      <p className="mt-4 max-w-sm text-base leading-7 text-gray-600 dark:text-slate-300">{t("reg.desc")}</p>
      <div className="mt-8 hidden space-y-4 lg:block">
        <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-5 shadow-sm dark:border-emerald-400/30 dark:from-emerald-400/10 dark:to-green-400/5">
          <p className="flex items-center gap-2 text-sm font-bold text-green-900 dark:text-emerald-200">✅ {t("reg.free")}</p>
          <p className="mt-2 text-xs leading-5 text-green-700 dark:text-emerald-100/80">{t("reg.freeDesc")}</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 shadow-sm dark:border-violet-400/30 dark:from-violet-400/10 dark:to-fuchsia-400/5">
          <p className="flex items-center gap-2 text-sm font-bold text-blue-900 dark:text-violet-200">🚀 {t("reg.live")}</p>
          <p className="mt-2 text-xs leading-5 text-blue-700 dark:text-violet-100/80">{t("reg.liveDesc")}</p>
        </div>
        <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-5 shadow-sm dark:border-fuchsia-400/30 dark:from-fuchsia-400/10 dark:to-pink-400/5">
          <p className="flex items-center gap-2 text-sm font-bold text-purple-900 dark:text-fuchsia-200">👨‍👩‍👧‍👦 {t("reg.forAll")}</p>
          <p className="mt-2 text-xs leading-5 text-purple-700 dark:text-fuchsia-100/80">{t("reg.forAllDesc")}</p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const { t } = useI18n();
  return (
    <section id="faq" className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-fuchsia-500/25 to-transparent" />
      <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-violet-500 dark:text-fuchsia-400">{t("faq.label")}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-.08em] text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">{t("faq.title")}</h2>
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
    <details className="group overflow-hidden rounded-[1.8rem] border border-slate-200/70 dark:border-white/10 bg-white/80 dark:bg-white/5 shadow-[0_60px_120px_-100px_rgba(139,92,246,0.9)] backdrop-blur-xl transition-all hover:shadow-[0_80px_140px_-100px_rgba(236,72,153,0.9)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-5 p-6 text-base font-semibold text-slate-900 dark:text-white marker:hidden">
        <span className="flex-1">{question}</span>
        <span className="grid size-9 shrink-0 place-items-center rounded-full border border-slate-200 dark:border-white/10 text-slate-500 transition-all group-open:rotate-45 group-open:text-fuchsia-400" aria-hidden="true">+</span>
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
    <footer className="relative border-t border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-[#050510]/80 text-slate-900 dark:text-white backdrop-blur-2xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <a href="#home" className="text-lg font-semibold tracking-[-.03em]">pasar<span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">umkm</span></a>
            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-600 dark:text-slate-300">{t("footer.desc")}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">{t("footer.nav")}</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li><a href="#home" className="transition-colors hover:text-violet-500 dark:hover:text-fuchsia-400">{t("nav.home")}</a></li>
              <li><a href="#jelajahi" className="transition-colors hover:text-violet-500 dark:hover:text-fuchsia-400">{t("nav.directory")}</a></li>
              <li><a href="#cara-kerja" className="transition-colors hover:text-violet-500 dark:hover:text-fuchsia-400">{t("nav.approach")}</a></li>
              <li><a href="#daftar" className="transition-colors hover:text-violet-500 dark:hover:text-fuchsia-400">{t("nav.list")}</a></li>
              <li><a href="#faq" className="transition-colors hover:text-violet-500 dark:hover:text-fuchsia-400">{t("nav.faq")}</a></li>
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
        <div className="mt-8 border-t border-slate-200/70 dark:border-white/10 pt-6 text-center">
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
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-slate-200/70 bg-white/95 px-2 py-2 shadow-[0_-10px_40px_rgba(79,70,229,.08)] backdrop-blur-xl md:hidden dark:border-white/10 dark:bg-[#050510]/90" aria-label="Navigasi cepat">
      <MobileLink href="#home" label={t("mobile.home")} icon="⌂" />
      <MobileLink href="#jelajahi" label={t("mobile.explore")} icon="⌕" />
      <MobileLink href="#daftar" label={t("mobile.list")} icon="＋" />
      <button type="button" aria-pressed={favoritesOnly} onClick={onToggleFavorites} className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-medium transition-colors ${favoritesOnly ? "text-violet-500 dark:text-fuchsia-400" : "text-slate-500 dark:text-slate-400"}`}><span className="text-lg leading-5" aria-hidden="true">♡</span>{t("mobile.fav")}</button>
    </nav>
  );
}

function MobileLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return <a href={href} className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-medium text-slate-500 transition-colors hover:text-violet-500 dark:text-slate-400 dark:hover:text-fuchsia-400"><span className="text-lg leading-5" aria-hidden="true">{icon}</span>{label}</a>;
}
