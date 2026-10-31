"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { ArrowIcon, ArrowUpIcon, CategoryMark, CheckIcon, GridIcon, HeartIcon, HomeIcon, UploadIcon } from "./icons";
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
    <section className="relative bg-blood text-bone" aria-labelledby="stats-title">
      <ScallopEdge side="bottom" size={16} className="absolute top-full left-0 z-10 h-4 w-full text-blood" />
      <div className="mx-auto max-w-[var(--page-max)] px-[var(--page-x)] pb-24 pt-16 sm:pb-28 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[.42fr_.58fr] lg:items-end lg:gap-16">
          <div data-reveal>
            <h2 id="stats-title" className="max-w-[14ch] text-[clamp(1.9rem,3.6vw,3.4rem)]">
              {t("stats.title")}
            </h2>

            <div className="mt-10 grid max-w-[34rem] grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-1 lg:gap-y-6">
              <Stat value={number(businessCount)} label={t("stats.business")} detail={t("stats.businessDesc")} />
              <Stat value={number(categoryCount)} label={t("stats.cat")} detail={t("stats.catDesc")} />
              <Stat value={number(cityCount)} label={t("stats.city")} detail={t("stats.cityDesc")} />
            </div>
          </div>

          <div className="lg:pb-2" data-reveal>
            <p className="flex items-start font-display text-[clamp(7rem,16vw,16rem)] font-bold leading-[0.78] tracking-[-.06em]">
              0
              <span className="mt-[0.14em] text-[0.28em] leading-none" aria-hidden="true">
                %
              </span>
              <span className="sr-only"> {t("stats.fee")}</span>
            </p>
            <p className="mt-6 max-w-[36ch] text-[20px] leading-[1.55] text-bone/80">
              {t("stats.commissionCaption")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label, detail }: { value: string; label: string; detail: string }) {
  return (
    <div>
      <p className="font-display text-[clamp(1.9rem,2.2vw,1.95rem)] font-bold leading-none tracking-[-.03em]">{value}</p>
      <p className="mt-2 font-display text-[13px] font-semibold text-bone/65">{label}</p>
      <p className="mt-0.5 text-[13px] leading-4 text-bone/60">{detail}</p>
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
    <section id="cara-kerja" className="relative scroll-mt-24 bg-paper py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[var(--page-max)] px-[var(--page-x)]">
        <div className="grid gap-8 lg:grid-cols-[.42fr_.58fr] lg:items-end" data-reveal-group>
          <h2 className="max-w-[14ch] text-[clamp(1.9rem,3.6vw,3.4rem)]" data-reveal>
            {t("how.title")}
          </h2>
          <p className="max-w-[44ch] text-[20px] leading-[1.55]" data-reveal>
            {t("how.desc")}
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:gap-8" aria-hidden="true" data-reveal>
          <ScatterGroup />
          <RibbonGroup />
          <OrderedGroup />
        </div>

        <ol className="mt-8 grid gap-6 lg:grid-cols-3 lg:gap-8" data-reveal-group>
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
      <h2 className="max-w-[16ch] text-[clamp(1.9rem,3.6vw,3.4rem)]">{t("reg.title")}</h2>
      <p className="mt-5 max-w-[44ch] text-[20px] leading-[1.55] text-ink/80">{t("reg.desc")}</p>
      <ul className="mt-8 grid gap-5 sm:grid-cols-3 sm:gap-6">
        {points.map((point) => (
          <li key={point.title} className="flex gap-2.5">
            <span className="mt-0.5 shrink-0 text-leaf" aria-hidden="true">
              <CheckIcon size={18} />
            </span>
            <div>
              <p className="font-display text-[16px] font-bold leading-snug">{point.title}</p>
              <p className="mt-1 text-[16px] leading-5 text-muted">{point.text}</p>
            </div>
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
    <section id="faq" className="relative scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[var(--page-max)] px-[var(--page-x)]">
        <div className="grid gap-10 lg:grid-cols-[.42fr_.58fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start" data-reveal>
            <h2 className="text-[clamp(1.9rem,3.6vw,3.4rem)]">{t("faq.title")}</h2>
            <p className="mt-4 max-w-[34ch] text-[20px] leading-[1.55] text-ink/80">{t("faq.desc")}</p>

            <figure className="mt-8 hidden lg:block">
              <div className="aspect-[4/5] w-full max-w-[320px] overflow-hidden bg-blood">
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
              <figcaption className="mt-3 max-w-[320px] text-[13px] leading-5 text-muted">
                Pasar terapung, Banjarmasin. Foto: Muhammad Haris, CC BY-SA 4.0.
              </figcaption>
            </figure>
          </div>

          <div>
            <div className="flex flex-col gap-2" data-reveal-group>
              {items.map((index) => (
                <details key={index} name="faq" className="group bg-transparent open:bg-blood open:text-bone" data-reveal>
                  <summary className="flex min-h-[72px] cursor-pointer list-none items-center justify-between gap-5 px-5 py-4 text-left font-display text-[20px] font-bold leading-snug">
                    <span>{t(`faq.q${index}`)}</span>
                    <span className="grid size-9 shrink-0 place-items-center bg-paper text-ink transition-transform duration-200 group-open:rotate-45 group-open:bg-bone group-open:text-blood" aria-hidden="true">
                      <PlusMark />
                    </span>
                  </summary>
                  <p className="max-w-[58ch] px-5 pb-6 text-[16px] leading-[1.6] text-ink/80 group-open:text-bone/85">
                    {t(`faq.a${index}`)}
                  </p>
                </details>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-5 bg-bone p-6 sm:flex-row sm:items-center sm:justify-between" data-reveal>
              <div>
                <h3 className="text-[clamp(1.25rem,2.2vw,1.95rem)]">{t("faq.contact")}</h3>
                <p className="mt-2 max-w-[46ch] text-[16px] leading-6 text-ink/75">{t("faq.contactDesc")}</p>
              </div>
              <a href="#daftar" className="btn shrink-0">
                {t("nav.getStarted")}
                <ArrowIcon size={16} />
              </a>
            </div>
          </div>
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

/* --------------------------------------------------------------- closing cta */

const CLOSING_PHOTOS = [
  {
    src: "/foto/warung-martabak.jpg",
    alt: "Warung martabak di pinggir jalan",
    width: 1920,
    height: 1280,
    credit: "Lord Mountbatten, CC BY-SA 3.0",
  },
  {
    src: "/foto/aneka-jajan-pasar-tradisional-jawa.jpg",
    alt: "Aneka jajan pasar tradisional Jawa",
    width: 1728,
    height: 1152,
    credit: "Hersy ardianty a, CC BY-SA 4.0",
  },
  {
    src: "/foto/jukung-pasar-terapung.jpg",
    alt: "Perahu jukung di pasar terapung Banjarmasin",
    width: 1920,
    height: 1280,
    credit: "Muhammad Haris, CC BY-SA 4.0",
  },
];

export function ClosingCta() {
  const { t } = useI18n();

  return (
    <section aria-labelledby="cta-title">
      <div className="grid grid-cols-3">
        {CLOSING_PHOTOS.map((photo) => (
          <figure key={photo.src} className="relative aspect-[4/3] overflow-hidden bg-paper sm:aspect-[3/2]">
            <img
              src={photo.src}
              width={photo.width}
              height={photo.height}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </figure>
        ))}
      </div>

      <div className="bg-paper">
        <div className="mx-auto grid max-w-[var(--page-max)] gap-8 px-[var(--page-x)] py-16 sm:py-20 lg:grid-cols-[.6fr_.4fr] lg:items-end">
          <div data-reveal>
            <h2 id="cta-title" className="max-w-[15ch] text-[clamp(1.9rem,3.6vw,3.4rem)]">
              {t("cta.title")}
            </h2>
            <p className="mt-4 max-w-[46ch] text-[20px] leading-[1.55] text-ink/80">{t("cta.desc")}</p>
          </div>
          <div className="flex lg:justify-end" data-reveal>
            <a href="#daftar" className="btn min-h-14 w-full px-7 text-[20px] sm:w-auto">
              {t("cta.action")}
              <ArrowIcon size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
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
                    style={{ height: `${BLOCK_HEIGHTS[index % BLOCK_HEIGHTS.length]}%`, fontSize: "clamp(2.7rem,5.4vw,5.1rem)" }}
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
          <div className="flex flex-col gap-3 text-[13px] text-bone/70 sm:flex-row sm:items-center sm:justify-between">
            <p>{"© "}{new Date().getFullYear()}{" Pasar UMKM"}</p>
            <p>{t("footer.made")}</p>
            <a href="#home" className="inline-flex w-fit items-center gap-1.5 font-display font-semibold text-bone/80 underline decoration-bone/30 underline-offset-4 transition-colors duration-150 hover:text-bone hover:decoration-bone">
              {t("footer.top")}
              <ArrowUpIcon size={14} />
            </a>
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
        className={`flex min-h-12 flex-col items-center justify-center gap-1 text-[13px] font-display font-semibold transition-colors duration-150 ${favoritesOnly ? "bg-blood text-bone" : "text-ink"}`}
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

/* Keep the category mark in the export surface for the empty state. */
export { CategoryMark };
