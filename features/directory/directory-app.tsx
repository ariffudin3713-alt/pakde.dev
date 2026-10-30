"use client";

import { CATEGORIES } from "@/lib/types";
import { useDirectoryController } from "@/features/directory/use-directory-controller";
import { BusinessCard } from "@/features/directory/components/business-card";
import { BusinessDetailDialog } from "@/features/directory/components/business-detail-dialog";
import { DirectoryToolbar } from "@/features/directory/components/directory-toolbar";
import { BusinessSkeletons, EmptyState } from "@/features/directory/components/directory-states";
import { Hero } from "@/features/directory/components/hero";
import { RegistrationForm } from "@/features/directory/components/registration-form";
import { SiteHeader } from "@/features/directory/components/site-header";
import { DirectoryStats, FaqSection, HowItWorks, MobileNavigation, RegistrationIntro, SiteFooter } from "@/features/directory/components/market-sections";
import { MotionLayer } from "@/features/directory/components/motion-layer";
import { useI18n } from "@/lib/i18n";

export function DirectoryApp() {
  const {
    businesses, ownerId, favorites, loading, refreshing, offline, notice, query, heroQuery, category, city, sort,
    favoritesOnly, openOnly, openCount, nowLabel, visibleCount, deletingId, toast, selectedBusiness,
    setToast, setSelectedBusiness, setHeroQuery, cities, filtered, myBusinesses, categoryCounts, loadData, clearFilters,
    changeQuery, toggleFavorite, addBusiness, removeBusiness, submitReview, searchFromHero, searchSuggestion,
    setCategory, setCity, setSort, setFavoritesOnly, setOpenOnly, showMore,
  } = useDirectoryController();
  const { t } = useI18n();

  const showFeature = !query && category === "Semua" && city === "Semua" && !favoritesOnly && !openOnly;

  function scrollToDirectory() {
    document.getElementById("jelajahi")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <MotionLayer />
      <SiteHeader />
      <main>
        <Hero
          query={heroQuery}
          openCount={openCount}
          nowLabel={nowLabel}
          onQueryChange={setHeroQuery}
          onSearch={searchFromHero}
          onSuggestion={searchSuggestion}
          onOpenNow={() => {
            setOpenOnly(true);
            scrollToDirectory();
          }}
        />

        <DirectoryStats businessCount={businesses.length} categoryCount={CATEGORIES.length} cityCount={cities.length} />

        <section id="jelajahi" className="relative scroll-mt-24 py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-[var(--page-max)] px-[var(--page-x)]">
            <div className="grid gap-8 lg:grid-cols-[1fr_minmax(300px,420px)] lg:items-end lg:gap-14" data-reveal-group>
              <div data-reveal>
                <h2 className="max-w-[16ch] text-[clamp(1.9rem,3.6vw,3.4rem)]">{t("explore.title")}</h2>
                <p className="mt-4 max-w-[46ch] text-[20px] leading-[1.55] text-ink/80">{t("explore.desc")}</p>
              </div>
              <figure data-reveal>
                <div className="aspect-[4/3] overflow-hidden bg-paper">
                  <img
                    src="/foto/warung-martabak.jpg"
                    width="1920"
                    height="1280"
                    alt="Warung martabak dengan meja dan peralatan masak di pinggir jalan"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="mt-2 text-[13px] leading-5 text-muted">Warung martabak. Foto: Lord Mountbatten, CC BY-SA 3.0.</figcaption>
              </figure>
            </div>

            {notice && (
              <div className={`mt-8 flex flex-col gap-3 px-4 py-3 text-[16px] leading-5 sm:flex-row sm:items-center sm:justify-between ${offline ? "bg-bone text-ink" : "bg-leaf text-bone"}`} role={offline ? "status" : "alert"}>
                <span>{notice}</span>
                {offline && (
                  <button type="button" onClick={() => void loadData()} className="w-fit font-display text-[13px] font-semibold text-blood underline decoration-2 underline-offset-4">
                    Coba sambungkan
                  </button>
                )}
              </div>
            )}

            <div className="mt-10">
              <DirectoryToolbar
                query={query}
                onQueryChange={changeQuery}
                category={category}
                onCategoryChange={setCategory}
                city={city}
                onCityChange={setCity}
                cities={cities}
                categoryCounts={categoryCounts}
                sort={sort}
                onSortChange={setSort}
                favoritesOnly={favoritesOnly}
                onFavoritesChange={() => setFavoritesOnly(!favoritesOnly)}
                openOnly={openOnly}
                onOpenChange={() => setOpenOnly(!openOnly)}
                onClearAll={clearFilters}
                onRefresh={() => void loadData()}
                refreshing={refreshing}
              />
            </div>

            <p className="mt-6 font-display text-[16px] font-semibold text-muted" role="status" aria-live="polite">
              {loading ? t("explore.loading") : `${filtered.length} ${t("explore.found")}`}
            </p>

            <div className="mt-2 grid gap-2">
              {loading ? (
                <BusinessSkeletons />
              ) : filtered.length === 0 ? (
                <EmptyState favoritesOnly={favoritesOnly} hasListings={businesses.length > 0} onReset={clearFilters} />
              ) : (
                filtered.slice(0, visibleCount).map((business, index) => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    favorite={favorites.includes(business.id)}
                    featured={index === 0 && showFeature}
                    onToggleFavorite={toggleFavorite}
                    onViewDetails={setSelectedBusiness}
                  />
                ))
              )}
            </div>

            {!loading && filtered.length > visibleCount && (
              <div className="mt-6">
                <button type="button" onClick={showMore} className="btn btn-quiet w-full sm:w-auto">
                  {t("explore.loadMore")}
                </button>
              </div>
            )}
          </div>
        </section>

        <HowItWorks />

        <section id="daftar" className="relative scroll-mt-24 bg-paper py-20 sm:py-24 lg:py-28">
          <div className="mx-auto grid max-w-[var(--page-max)] gap-10 px-[var(--page-x)] lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
            <div>
              <RegistrationIntro />
              <figure className="mt-10" data-reveal>
                <div className="aspect-[4/3] overflow-hidden bg-blood">
                  <img
                    src="/foto/maestro-batik-tulis-di-imogiri.jpg"
                    width="1920"
                    height="1280"
                    alt="Pengrajin batik tulis sedang menggores lilin di kain di Imogiri, Bantul"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="mt-2 text-[13px] leading-5 text-muted">{t("reg.photoCaption")}</figcaption>
              </figure>
            </div>

            <div className="flex flex-col gap-8">
              <RegistrationForm ownerId={ownerId} onCreate={addBusiness} />

              {myBusinesses.length > 0 && (
                <div>
                  <h3 className="text-[clamp(1.45rem,2.2vw,1.95rem)]">
                    {t("reg.mySpace")} <span className="text-muted">({myBusinesses.length})</span>
                  </h3>
                  <div className="mt-4 grid gap-2">
                    {myBusinesses.map((business) => (
                      <BusinessCard
                        key={business.id}
                        business={business}
                        favorite={favorites.includes(business.id)}
                        onToggleFavorite={toggleFavorite}
                        onViewDetails={setSelectedBusiness}
                        onDelete={removeBusiness}
                        deleting={deletingId === business.id}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <FaqSection />
      </main>

      <SiteFooter />

      <MobileNavigation
        favoritesOnly={favoritesOnly}
        onToggleFavorites={() => {
          setFavoritesOnly(!favoritesOnly);
          scrollToDirectory();
        }}
      />

      <BusinessDetailDialog business={selectedBusiness} onClose={() => setSelectedBusiness(null)} onSubmitReview={submitReview} />

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 bg-ink px-4 py-3 font-display text-[16px] font-semibold text-bone md:bottom-6" role="status">
          {toast}
        </div>
      )}
      <div className="h-16 md:hidden" aria-hidden="true" />
    </>
  );
}
