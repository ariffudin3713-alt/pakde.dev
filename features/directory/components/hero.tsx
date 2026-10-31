"use client";

import { useI18n } from "@/lib/i18n";
import { ArrowIcon, ClockIcon, SearchIcon } from "./icons";
import { ScallopEdge } from "./scallop-edge";

interface HeroProps {
  query: string;
  openCount: number;
  nowLabel: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onSuggestion: (value: string) => void;
  onOpenNow: () => void;
}

const QUICK_LINKS = ["Kuliner", "Fashion", "Kerajinan", "Jasa"];

export function Hero({ query, openCount, nowLabel, onQueryChange, onSearch, onSuggestion, onOpenNow }: HeroProps) {
  const { t } = useI18n();

  return (
    <section id="home" className="relative overflow-hidden pb-14 pt-6 sm:pt-10 lg:pb-20 lg:pt-12">
      <div className="mx-auto grid max-w-[var(--page-max)] grid-cols-1 gap-10 px-[var(--page-x)] lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:gap-14">
        <div className="flex flex-col justify-center">
          <h1 className="lines text-[clamp(2.7rem,5.4vw,5.1rem)] uppercase leading-[0.9]">
            <span className="line">
              <span>{t("hero.title1")}</span>
            </span>
            <span className="line">
              <span>{t("hero.title2")}</span>
            </span>
          </h1>

          <p className="mt-6 max-w-[46ch] text-[20px] leading-[1.55] text-ink/85" data-reveal>
            {t("hero.desc")}
          </p>

          <form
            className="mt-8 flex w-full max-w-[600px] flex-col gap-2 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              onSearch();
            }}
            role="search"
            aria-label={t("toolbar.search")}
            data-reveal
          >
            <label className="flex min-w-0 flex-1 items-center bg-bone">
              <span className="pl-4 text-muted" aria-hidden="true">
                <SearchIcon />
              </span>
              <span className="sr-only">{t("toolbar.search")}</span>
              <input
                id="hero-query"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder={t("hero.searchPlaceholder")}
                className="min-h-[56px] min-w-0 flex-1 bg-transparent px-3 text-base text-ink outline-none placeholder:text-[#8b8377]"
                autoComplete="off"
              />
            </label>
            <button className="btn min-h-[56px] shrink-0" type="submit">
              {t("hero.search")}
              <ArrowIcon size={16} />
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-[16px]" data-reveal>
            <span className="text-muted">{t("hero.quick")}</span>
            {QUICK_LINKS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onSuggestion(item)}
                className="inline-flex min-h-9 items-center font-medium underline decoration-blood decoration-2 underline-offset-4 transition-colors duration-150 hover:text-blood"
              >
                {item}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenNow}
            className="group mt-6 inline-flex min-h-12 w-fit max-w-full items-center gap-3 bg-bone px-3.5 text-left text-[16px] transition-colors duration-150 hover:bg-leaf hover:text-bone"
          >
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-leaf text-bone transition-colors duration-150 group-hover:bg-bone group-hover:text-leaf" aria-hidden="true">
              <ClockIcon size={14} />
            </span>
            <span className="min-w-0">
              <span className="font-display font-bold">{openCount}</span>{" "}
              {nowLabel ? (
                <>
                  {t("hero.openLine")}
                  <span className="text-muted transition-colors duration-150 group-hover:text-bone/75"> · {nowLabel} {t("hero.clock")}</span>
                </>
              ) : (
                t("hero.seeOpen")
              )}
            </span>
            <ArrowIcon size={16} />
          </button>
        </div>

        <div className="relative" data-reveal>
          <ScallopEdge side="left" size={16} className="absolute right-full top-0 hidden h-full w-4 text-blood lg:block" />
          <div className="grid h-[420px] grid-cols-2 grid-rows-2 sm:h-[480px] lg:h-[min(74svh,620px)]">
            <figure className="relative row-span-2 overflow-hidden bg-blood">
              <img
                src="/foto/rempah-tradisional-di-pasar.jpg"
                width="1920"
                height="2560"
                alt="Bawang putih dan kunyit segar di atas kain di pasar tradisional"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </figure>

            <figure className="relative overflow-hidden bg-paper">
              <img
                src="/foto/warung-martabak.jpg"
                width="1920"
                height="1280"
                alt="Warung martabak dengan meja dan peralatan masak di pinggir jalan"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </figure>

            <div className="relative flex flex-col justify-between bg-blood p-4 text-bone sm:p-5">
              <span className="font-display text-[13px] font-semibold text-bone/70">Pasar UMKM</span>
              <div>
                <p className="font-heading text-[clamp(1.25rem,2.2vw,1.95rem)] leading-[0.98]">{t("hero.ticket1")}</p>
                <p className="mt-2 text-[13px] leading-5 text-bone/80">
                  {t("hero.ticket2")} · {t("hero.ticket3")}
                </p>
              </div>
            </div>
          </div>
          <figcaption className="mt-2 text-[13px] leading-5 text-muted">{t("hero.photoCaption2")}</figcaption>
        </div>
      </div>
    </section>
  );
}
