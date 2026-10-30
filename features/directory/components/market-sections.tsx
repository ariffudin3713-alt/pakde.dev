"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { ArrowIcon, CategoryMark, GridIcon, HeartIcon, HomeIcon, UploadIcon } from "./icons";
import { ScallopEdge } from "./scallop-edge";

/* ------------------------------------------------------------------ stats */

interface DirectoryStatsProps {
  businessCount: number;
  categoryCount: number;
  cityCount: number;
}

export function DirectoryStats({ businessCount, categoryCount, cityCount }: DirectoryStatsProps) {
  const { t, locale } = useI18n();
  const number = (value: number) => value.toLocaleString(locale === "id" ? "id-ID" : "en-US");

  return (
    <section className="relative bg-blood text-bone" aria-label="Ringkasan direktori">
      <ScallopEdge side="bottom" size={16} className="absolute top-full left-0 z-10 h-4 w-full text-blood" />
      <div className="mx-auto max-w-[var(--page-max)] px-[var(--page-x)] pb-16 pt-12 sm:pb-20 sm:pt-14">
        <h2 className="max-w-[18ch] text-[clamp(1.9rem,3.6vw,3.4rem)]">{t("stats.title")}</h2>
        <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
          <Stat value={number(businessCount)} label={t("stats.business")} detail={t("stats.businessDesc")} />
          <Stat value={number(categoryCount)} label={t("stats.cat")} detail={t("stats.catDesc")} />
          <Stat value={number(cityCount)} label={t("stats.city")} detail={t("stats.cityDesc")} />
          <Stat value="0%" label={t("stats.fee")} detail={t("stats.feeDesc")} />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label, detail }: { value: string; label: string; detail: string }) {
  return (
    <div data-reveal>
      <p className="font-display text-[clamp(2.6rem,5.2vw,4.9rem)] font-bold leading-[0.9] tracking-[-.05em]">{value}</p>
      <p className="mt-3 font-display text-[16px] font-bold">{label}</p>
      <p className="mt-1 text-[16px] leading-5 text-bone/70">{detail}</p>
    </div>
  );
}

/* -------------------------------------------------------------- how it works */

export function HowItWorks() {
  const { t } = useI18n();
  const steps = [
    { title: t("how.step1Title"), text: t("how.step1Text") },
    { title: t("how.step2Title"), text: t("how.step2Text") },
    { title: t("how.step3Title"), text: t("how.step3Text") },
  ];

  return (
    <section id="cara-kerja" className="relative scroll-mt-24 bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-[var(--page-max)] px-[var(--page-x)]">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end" data-reveal-group>
          <h2 className="max-w-[14ch] text-[clamp(1.9rem,3.6vw,3.4rem)]" data-reveal>{t("how.title")}</h2>
          <p className="max-w-[44ch] text-[20px] leading-[1.55]" data-reveal>{t("how.desc")}</p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3 lg:gap-12" aria-hidden="true" data-reveal>
          <ScatterGroup />
          <RibbonGroup />
          <OrderedGroup />
        </div>

        <ol className="mt-10 grid gap-8 lg:grid-cols-3 lg:gap-12" data-reveal-group>
          {steps.map((step) => (
            <li key={step.title} data-reveal>
              <h3 className="font-display text-[20px] font-bold">{step.title}</h3>
              <p className="mt-2 max-w-[38ch] text-[16px] leading-[1.55] text-ink/80">{step.text}</p>
            </li>
          ))}
        </ol>

        <figure className="mt-16" data-reveal>
          <div className="aspect-[21/9] w-full overflow-hidden bg-blood">
            <img
              src="/foto/aneka-jajan-pasar-tradisional-jawa.jpg"
              width="1728"
              height="1152"
              alt="Aneka jajan pasar tradisional Jawa: serabi, kue basah, dan camilan pasar"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
          <figcaption className="mt-3 text-[13px] leading-5 text-muted">
            Jajan pasar di Jawa. Foto: Hersy ardianty a, CC BY-SA 4.0.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function ScatterGroup() {
  return (
    <div className="relative h-[180px] w-full overflow-hidden bg-ground p-4">
      <p className="absolute bottom-3 left-4 font-display text-[13px] font-semibold text-muted">Usaha belum terdaftar</p>
      {Array.from({ length: 26 }).map((_, index) => (
        <span
          key={index}
          className="absolute size-2.5 bg-blood"
          style={{
            left: `${6 + ((index * 37) % 86)}%`,
            top: `${5 + ((index * 53) % 70)}%`,
            opacity: index % 3 === 0 ? 0.85 : 0.35,
          }}
        />
      ))}
    </div>
  );
}

function RibbonGroup() {
  return (
    <div className="flex h-[180px] w-full flex-col justify-center gap-1 bg-ground p-4">
      <p className="mb-auto font-display text-[13px] font-semibold text-muted">Satu formulir</p>
      <div className="flex flex-col items-center gap-1">
        {Array.from({ length: 3 }).map((_, row) => (
          <div key={row} className="flex gap-1">
            {Array.from({ length: 9 }).map((_, column) => (
              <span key={column} className="size-2.5 bg-blood" />
            ))}
          </div>
        ))}
      </div>
      <p className="mt-auto text-center font-display text-[13px] font-semibold text-muted">Masuk ke direktori</p>
    </div>
  );
}

function OrderedGroup() {
  return (
    <div className="flex h-[180px] w-full flex-col justify-center gap-2 bg-ground p-4">
      <p className="mb-auto font-display text-[13px] font-semibold text-muted">Pembeli menemukan</p>
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, row) => (
          <div key={row} className="flex items-center gap-2">
            {Array.from({ length: 8 }).map((_, column) => (
              <span key={column} className="size-2.5 bg-blood" />
            ))}
          </div>
        ))}
      </div>
      <p className="mt-auto text-right font-display text-[13px] font-semibold text-blood">Chat WhatsApp</p>
    </div>
  );
}

/* ---------------------------------------------------------------- register */

export function RegistrationIntro() {
  const { t } = useI18n();
  const points = [
    { title: t("reg.free"), text: t("reg.freeDesc") },
    { title: t("reg.live"), text: t("reg.liveDesc") },
    { title: t("reg.forAll"), text: t("reg.forAllDesc") },
  ];

  return (
    <div data-reveal>
      <h2 className="text-[clamp(1.9rem,3.6vw,3.4rem)]">{t("reg.title")}</h2>
      <p className="mt-5 max-w-[44ch] text-[20px] leading-[1.55] text-ink/80">{t("reg.desc")}</p>
      <ul className="mt-8 grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
        {points.map((point) => (
          <li key={point.title} className="max-w-[40ch]">
            <p className="font-display text-[16px] font-bold">{point.title}</p>
            <p className="mt-1 text-[16px] leading-5 text-muted">{point.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* --------------------------------------------------------------------- faq */

export function FaqSection() {
  const { t } = useI18n();
  const items = [1, 2, 3, 4, 5];

  return (
    <section id="faq" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto grid max-w-[var(--page-max)] gap-12 px-[var(--page-x)] lg:grid-cols-[.75fr_1.25fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start" data-reveal>
          <h2 className="text-[clamp(1.9rem,3.6vw,3.4rem)]">{t("faq.title")}</h2>
          <p className="mt-4 max-w-[34ch] text-[20px] leading-[1.55] text-ink/80">{t("faq.desc")}</p>

          <figure className="mt-8 hidden lg:block">
            <div className="aspect-[4/3] w-full overflow-hidden bg-blood">
              <img
                src="/foto/jukung-pasar-terapung.jpg"
                width="1920"
                height="1280"
                alt="Perahu jukung berjajar di pasar terapung Banjarmasin"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 text-[13px] leading-5 text-muted">
              Pasar terapung, Banjarmasin. Foto: Muhammad Haris, CC BY-SA 4.0.
            </figcaption>
          </figure>
        </div>

        <div className="flex flex-col gap-2" data-reveal-group>
          {items.map((index) => (
            <details key={index} name="faq" className="group bg-transparent transition-colors duration-150 hover:bg-bone/60 open:bg-blood open:text-bone" data-reveal>
              <summary className="flex min-h-[68px] cursor-pointer list-none items-center justify-between gap-5 px-5 py-4 text-left font-display text-[20px] font-bold leading-snug [&::-webkit-details-marker]:hidden">
                <span>{t(`faq.q${index}`)}</span>
                <span className="grid size-8 shrink-0 place-items-center transition-transform duration-200 group-open:rotate-45" aria-hidden="true">
                  <PlusMark />
                </span>
              </summary>
              <p className="max-w-[58ch] px-5 pb-5 text-[16px] leading-[1.6] text-ink/80 group-open:text-bone/85">
                {t(`faq.a${index}`)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlusMark() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/* ------------------------------------------------------------------ footer */

const PHOTO_CREDITS = [
  { title: "Rempah tradisional di pasar", author: "Nela Fatimatun", licence: "CC BY 4.0", href: "https://commons.wikimedia.org/wiki/File:Rempah_tradisional_di_pasar.jpg" },
  { title: "Warung martabak", author: "Lord Mountbatten", licence: "CC BY-SA 3.0", href: "https://commons.wikimedia.org/wiki/File:Warung_martabak.JPG" },
  { title: "Aneka jajan pasar tradisional jawa", author: "Hersy ardianty a", licence: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Aneka_jajan_pasar_tradisional_jawa.jpg" },
  { title: "Maestro Batik Tulis di Imogiri", author: "Aconkyeah", licence: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Maestro_Batik_Tulis_di_Imogiri.jpg" },
  { title: "Jukung Pasar Terapung", author: "Muhammad Haris", licence: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Jukung_Pasar_Terapung.jpg" },
];

const WORDMARK = ["PASAR", "UMKM"];
const BLOCK_HEIGHTS = [100, 78, 92, 68, 84, 96, 72, 88, 64];

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="relative bg-blood text-bone">
      <ScallopEdge side="top" size={18} className="absolute bottom-full left-0 h-[18px] w-full text-blood" />
      <div className="mx-auto max-w-[var(--page-max)] px-[var(--page-x)] pb-10 pt-16 sm:pt-20">
        <Link href="#home" className="block" aria-label="Pasar UMKM, kembali ke atas">
          <span className="flex h-[clamp(64px,10vw,150px)] items-end gap-3 sm:gap-5">
            {WORDMARK.map((word) => (
              <span key={word} className="flex flex-1 items-end gap-1 sm:gap-1.5">
                {word.split("").map((letter, index) => (
                  <span
                    key={`${word}-${letter}-${index}`}
                    className="grid flex-1 place-items-center bg-bone font-display font-bold uppercase leading-none text-blood"
                    style={{ height: `${BLOCK_HEIGHTS[index % BLOCK_HEIGHTS.length]}%`, fontSize: "clamp(2.6rem,5.2vw,4.9rem)" }}
                  >
                    {letter}
                  </span>
                ))}
              </span>
            ))}
          </span>
        </Link>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="max-w-[34ch]">
            <p className="text-[16px] leading-6 text-bone/80">{t("footer.desc")}</p>
          </div>
          <FooterColumn title={t("footer.nav")}>
            <Link href="#home">{t("nav.home")}</Link>
            <Link href="#jelajahi">{t("nav.directory")}</Link>
            <Link href="#cara-kerja">{t("nav.approach")}</Link>
            <Link href="#daftar">{t("nav.list")}</Link>
            <Link href="#faq">{t("nav.faq")}</Link>
          </FooterColumn>
          <FooterColumn title={t("footer.cat")}>
            {CATEGORIES.slice(0, 5).map((category) => <Link key={category} href="#jelajahi">{category}</Link>)}
          </FooterColumn>
          <FooterColumn title={t("footer.about")}>
            <span>{t("footer.about1")}</span>
            <span>{t("footer.about2")}</span>
            <span>{t("footer.about3")}</span>
          </FooterColumn>
        </div>

        <div className="mt-14 flex flex-col gap-6">
          <p className="text-[13px] leading-6 text-bone/65">
            <span className="font-display font-bold text-bone/80">{t("footer.credits")} </span>
            {PHOTO_CREDITS.map((credit, index) => (
              <span key={credit.href}>
                <a href={credit.href} target="_blank" rel="noreferrer" className="underline decoration-bone/30 underline-offset-2 transition-colors duration-150 hover:decoration-bone">
                  {credit.title}
                </a>{" "}
                oleh {credit.author} ({credit.licence})
                {index < PHOTO_CREDITS.length - 1 ? "; " : "."}
              </span>
            ))}
          </p>
          <div className="flex flex-col gap-2 text-[13px] text-bone/70 sm:flex-row sm:items-center sm:justify-between">
            <p>{"© "}{new Date().getFullYear()}{" Pasar UMKM"}</p>
            <p>{t("footer.made")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-[16px] font-bold">{title}</h2>
      <div className="mt-4 flex flex-col gap-2 text-[16px] text-bone/80">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ mobile nav */

interface MobileNavigationProps {
  favoritesOnly: boolean;
  onToggleFavorites: () => void;
}

export function MobileNavigation({ favoritesOnly, onToggleFavorites }: MobileNavigationProps) {
  const { t } = useI18n();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 bg-paper px-1 pb-[max(6px,env(safe-area-inset-bottom))] pt-1 md:hidden"
      aria-label="Navigasi cepat"
    >
      <MobileLink href="#home" label={t("mobile.home")} icon={<HomeIcon />} />
      <MobileLink href="#jelajahi" label={t("mobile.explore")} icon={<GridIcon />} />
      <MobileLink href="#daftar" label={t("mobile.list")} icon={<UploadIcon />} />
      <button
        type="button"
        aria-pressed={favoritesOnly}
        onClick={onToggleFavorites}
        className={`flex min-h-12 flex-col items-center justify-center gap-1 text-[13px] font-display font-semibold transition-colors duration-150 ${favoritesOnly ? "text-blood" : "text-ink"}`}
      >
        <HeartIcon filled={favoritesOnly} />
        {t("mobile.fav")}
      </button>
    </nav>
  );
}

function MobileLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a href={href} className="flex min-h-12 flex-col items-center justify-center gap-1 font-display text-[13px] font-semibold text-ink transition-colors duration-150 hover:text-blood">
      {icon}
      {label}
    </a>
  );
}
