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
    <section id="home" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[var(--page-max)] grid-cols-1 px-[var(--page-x)] lg:grid-cols-[1.06fr_.94fr] lg:gap-14">
        <div className="flex flex-col justify-center pb-12 pt-12 sm:pt-16 lg:min-h-[74svh] lg:py-16">
          <h1 className="max-w-[18ch] text-[clamp(2.6rem,5.2vw,4.9rem)] uppercase leading-[0.9]">
            <span className="block">{t("hero.title1")} </span>
            <span className="block">{t("hero.title2")}</span>
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
            <label className="relative flex min-w-0 flex-1 items-center bg-bone">
              <span className="pl-4 text-muted" aria-hidden="true"><SearchIcon /></span>
              <span className="sr-only">{t("toolbar.search")}</span>
              <input
                id="hero-query"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder={t("hero.searchPlaceholder")}
                className="min-h-[52px] min-w-0 flex-1 bg-transparent px-3 text-base text-ink outline-none placeholder:text-[#8b8377]"
                autoComplete="off"
              />
            </label>
            <button className="btn min-h-[52px] shrink-0" type="submit">
              {t("hero.search")}
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[16px]" data-reveal>
            <span className="text-muted">{t("hero.quick")}</span>
            {QUICK_LINKS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onSuggestion(item)}
                className="font-medium underline decoration-blood decoration-2 underline-offset-4 transition-colors duration-150 hover:text-blood"
              >
                {item}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenNow}
            className="mt-8 inline-flex min-h-11 w-fit items-center gap-2.5 text-left text-[16px] transition-colors duration-150 hover:text-blood"
          >
            <span className="grid size-6 place-items-center rounded-full bg-leaf text-bone" aria-hidden="true">
              <ClockIcon size={14} />
            </span>
            <span>
              <span className="font-display font-bold">{openCount}</span> {t("hero.openLine")}
              {nowLabel && <span className="text-muted"> · {nowLabel} {t("hero.clock")}</span>}
            </span>
            <ArrowIcon size={16} />
          </button>
        </div>

        <div className="relative mb-12 lg:my-10 lg:mb-14">
          <ScallopEdge side="left" size={16} className="absolute right-full top-0 hidden h-full w-4 text-blood lg:block" />
          <div className="relative flex h-full flex-col bg-blood p-4 sm:p-6">
            <figure className="shutter relative min-h-[340px] flex-1 overflow-hidden">
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

            <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-[13px] leading-5 text-bone/80">
              <span>{t("hero.photoCaption")}</span>
            </figcaption>

            <div className="absolute -bottom-6 left-4 -rotate-2 bg-bone px-5 py-4 text-blood sm:left-6" aria-hidden="true">
              <p className="font-display text-[26px] font-bold uppercase leading-none">{t("hero.ticket1")}</p>
              <p className="mt-1 font-display text-[13px] font-semibold leading-tight">{t("hero.ticket2")}</p>
              <p className="font-display text-[13px] font-semibold leading-tight">{t("hero.ticket3")}</p>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
