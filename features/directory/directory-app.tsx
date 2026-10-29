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
import { useI18n } from "@/lib/i18n";

export function DirectoryApp() {
  const { businesses, ownerId, favorites, loading, refreshing, offline, notice, query, heroQuery, category, city, sort, favoritesOnly, visibleCount, deletingId, toast, selectedBusiness, setToast, setSelectedBusiness, setHeroQuery, cities, filtered, myBusinesses, categoryCounts, loadData, clearFilters, changeQuery, toggleFavorite, addBusiness, removeBusiness, submitReview, searchFromHero, searchSuggestion, setCategory, setCity, setSort, setFavoritesOnly, showMore } = useDirectoryController();
  const { t } = useI18n();

  return (
    <>
      <SiteHeader />
      <main>
        <Hero businessCount={businesses.length} query={heroQuery} onQueryChange={setHeroQuery} onSearch={searchFromHero} onSuggestion={searchSuggestion} />

        <DirectoryStats businessCount={businesses.length} categoryCount={CATEGORIES.length} cityCount={cities.length} />

        <section id="jelajahi" className="relative scroll-mt-24 py-16 sm:py-20 lg:py-24">
          <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-slate-300/40 to-transparent dark:via-white/10" />
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">{t("explore.label")}</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-.06em] text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">{t("explore.title")}</h2>
                <p className="mt-3 max-w-xl text-base text-slate-600 dark:text-slate-300">{t("explore.desc")}</p>
              </div>
              <p className="rounded-full border border-slate-200/70 bg-white px-4 py-2 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200" role="status" aria-live="polite">{loading ? t("explore.loading") : `${filtered.length} ${t("explore.found")}`}</p>
            </div>

            {notice && <div className={`mb-5 rounded-xl border px-4 py-3 text-sm ${offline ? "border-[#d7e3d9] bg-[#f0f5f1] text-[#315540]" : "border-red-200 bg-red-50 text-red-900"}`} role={offline ? "status" : "alert"}>{notice}{offline && <button type="button" onClick={() => void loadData()} className="ml-2 font-semibold underline underline-offset-2">Coba sambungkan</button>}</div>}

            <DirectoryToolbar
              query={query} onQueryChange={changeQuery}
              category={category} onCategoryChange={setCategory}
              city={city} onCityChange={setCity} cities={cities}
              categoryCounts={categoryCounts}
              sort={sort} onSortChange={setSort}
              favoritesOnly={favoritesOnly} onFavoritesChange={() => setFavoritesOnly(!favoritesOnly)}
              onClearAll={clearFilters}
              onRefresh={() => void loadData()} refreshing={refreshing}
            />

            <div className="mt-6">
              {loading ? <BusinessSkeletons /> : filtered.length === 0 ? <EmptyState favoritesOnly={favoritesOnly} hasListings={businesses.length > 0} onReset={clearFilters} /> : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filtered.slice(0, visibleCount).map((business, index) => <div key={business.id} className={index === 0 && !query && category === "Semua" && city === "Semua" && !favoritesOnly ? "md:col-span-2" : ""}>
                    <BusinessCard business={business} favorite={favorites.includes(business.id)} featured={index === 0 && !query && category === "Semua" && city === "Semua" && !favoritesOnly} onToggleFavorite={toggleFavorite} onViewDetails={setSelectedBusiness} />
                  </div>)}
                </div>
              )}
              {!loading && filtered.length > visibleCount && <div className="mt-7 text-center"><button type="button" onClick={showMore} className="min-h-11 rounded-xl border border-slate-200/70 bg-white px-5 text-xs font-semibold text-slate-700 transition-all duration-200 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] dark:border-white/10 dark:bg-white/5 dark:text-slate-200">{t("explore.loadMore")}</button></div>}
            </div>
          </div>
        </section>

        <HowItWorks />

        <section id="daftar" className="relative scroll-mt-24 py-16 sm:py-20 lg:py-24">
          <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-slate-300/40 to-transparent dark:via-white/10" />
          <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
            <RegistrationIntro />
            <div className="space-y-8">
              <RegistrationForm ownerId={ownerId} onCreate={addBusiness} />
              {myBusinesses.length > 0 && <div>
                <div className="mb-4 flex items-end justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">{t("reg.mySpace")}</p><h3 className="mt-1 text-xl font-semibold tracking-[-.04em] text-slate-900 dark:text-white">{t("reg.mySpace")} <span className="text-slate-500 dark:text-slate-400">({myBusinesses.length})</span></h3></div></div>
                <div className="grid gap-4">{myBusinesses.map((business) => <BusinessCard key={business.id} business={business} favorite={favorites.includes(business.id)} onToggleFavorite={toggleFavorite} onViewDetails={setSelectedBusiness} onDelete={removeBusiness} deleting={deletingId === business.id} />)}</div>
              </div>}
            </div>
          </div>
        </section>

        <FaqSection />
      </main>

      <SiteFooter />

      <MobileNavigation favoritesOnly={favoritesOnly} onToggleFavorites={() => {
        setFavoritesOnly(!favoritesOnly);
        document.getElementById("jelajahi")?.scrollIntoView({ behavior: "smooth" });
      }} />

      <BusinessDetailDialog business={selectedBusiness} onClose={() => setSelectedBusiness(null)} onSubmitReview={submitReview} />

      {toast && <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-[#17211b] px-4 py-3 text-sm font-medium text-white shadow-lg md:bottom-6" role="status">✓ {toast}</div>}
      <div className="h-16 md:hidden" aria-hidden="true" />
    </>
  );
}
