"use client";

import { useEffect, useMemo, useState } from "react";
import { addBusinessReview, createBusiness, deleteBusiness, listBusinesses } from "@/lib/directory-api";
import { getFavorites, getLocalBusinesses, getOwnerId, saveFavorites, saveLocalBusinesses } from "@/lib/local-store";
import { CATEGORIES, type Business, type BusinessInput, type Category, type ReviewInput, type SortOrder } from "@/lib/types";
import { BusinessCard } from "@/features/directory/components/business-card";
import { BusinessDetailDialog } from "@/features/directory/components/business-detail-dialog";
import { DirectoryToolbar } from "@/features/directory/components/directory-toolbar";
import { BusinessSkeletons, EmptyState } from "@/features/directory/components/directory-states";
import { Hero } from "@/features/directory/components/hero";
import { RegistrationForm } from "@/features/directory/components/registration-form";
import { SiteHeader } from "@/features/directory/components/site-header";

export function DirectoryApp() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [ownerId, setOwnerId] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [offline, setOffline] = useState(false);
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [heroQuery, setHeroQuery] = useState("");
  const [category, setCategory] = useState<Category | "Semua">("Semua");
  const [city, setCity] = useState("Semua");
  const [sort, setSort] = useState<SortOrder>("terbaru");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  async function loadData(showSkeleton = false) {
    if (showSkeleton) setLoading(true);
    else setRefreshing(true);
    try {
      const items = await listBusinesses();
      setBusinesses(items);
      setOffline(false);
      setNotice("");
    } catch {
      setBusinesses(getLocalBusinesses());
      setOffline(true);
      setNotice("Server belum tersedia. Direktori berjalan dalam mode lokal dan data baru disimpan di perangkat ini.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    setOwnerId(getOwnerId());
    setFavorites(getFavorites());
    void loadData(true);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (document.querySelector("dialog[open]")) return;
      const target = event.target;
      const isEditing = target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      if (event.key === "/" && !isEditing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        document.getElementById("directory-query")?.focus();
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const cities = useMemo(() => Array.from(new Set(businesses.map((item) => item.kota.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b, "id")), [businesses]);
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("id");
    const result = businesses.filter((item) => {
      const matchesQuery = !term || [item.nama, item.kategori, item.kota, item.deskripsi, item.alamat].some((value) => value.toLocaleLowerCase("id").includes(term));
      const matchesCategory = category === "Semua" || item.kategori === category;
      const matchesCity = city === "Semua" || item.kota === city;
      const matchesFavorite = !favoritesOnly || favorites.includes(item.id);
      return matchesQuery && matchesCategory && matchesCity && matchesFavorite;
    });
    return result.sort((a, b) => {
      if (sort === "terlama") return a.createdAt - b.createdAt;
      if (sort === "az") return a.nama.localeCompare(b.nama, "id");
      if (sort === "za") return b.nama.localeCompare(a.nama, "id");
      return b.createdAt - a.createdAt;
    });
  }, [businesses, category, city, favorites, favoritesOnly, query, sort]);

  const myBusinesses = businesses.filter((item) => item.ownerId && item.ownerId === ownerId);
  const categoryCount = new Set(businesses.map((item) => item.kategori)).size;
  const categoryCounts = useMemo(() => CATEGORIES.reduce((counts, item) => {
    counts[item] = businesses.filter((business) => business.kategori === item).length;
    return counts;
  }, {} as Record<Category, number>), [businesses]);
  const clearFilters = () => { setQuery(""); setHeroQuery(""); setCategory("Semua"); setCity("Semua"); setFavoritesOnly(false); setVisibleCount(12); };
  const changeQuery = (value: string) => { setQuery(value); setHeroQuery(value); setVisibleCount(12); };

  function toggleFavorite(id: string) {
    const next = favorites.includes(id) ? favorites.filter((favorite) => favorite !== id) : [...favorites, id];
    setFavorites(next);
    saveFavorites(next);
  }

  async function addBusiness(input: BusinessInput): Promise<Business> {
    const currentOwnerId = ownerId || getOwnerId();
    if (!ownerId) setOwnerId(currentOwnerId);
    let created: Business;
    if (offline) {
      created = { ...input, ownerId: currentOwnerId, id: `local-${Date.now().toString(36)}`, createdAt: Date.now(), rating: 0, ulasan: [] };
      const next = [created, ...getLocalBusinesses()];
      saveLocalBusinesses(next);
    } else {
      created = await createBusiness({ ...input, ownerId: currentOwnerId });
    }
    setBusinesses((current) => [created, ...current.filter((item) => item.id !== created.id)]);
    clearFilters();
    setNotice(offline ? "Usaha disimpan di perangkat ini dan akan tampil dalam mode lokal." : "Usaha Anda berhasil masuk ke direktori.");
    setToast("Usaha berhasil didaftarkan.");
    document.getElementById("jelajahi")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return created;
  }

  async function removeBusiness(business: Business) {
    setDeletingId(business.id);
    try {
      if (offline) {
        const next = getLocalBusinesses().filter((item) => item.id !== business.id || item.ownerId !== ownerId);
        saveLocalBusinesses(next);
      } else {
        await deleteBusiness(business.id, ownerId);
      }
      setBusinesses((current) => current.filter((item) => item.id !== business.id));
      setToast("Usaha berhasil dihapus.");
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : "Usaha belum dapat dihapus. Coba lagi.");
    } finally {
      setDeletingId(null);
    }
  }

  async function submitReview(input: ReviewInput): Promise<void> {
    let updated: Business;
    if (offline) {
      const current = businesses.find((item) => item.id === input.id);
      if (!current) throw new Error("Usaha tidak ditemukan.");
      const reviews = [{ ...input, id: `r${Date.now().toString(36)}`, createdAt: Date.now() }, ...(current.ulasan ?? [])].slice(0, 20);
      const rating = Math.round((reviews.reduce((sum, review) => sum + review.bintang, 0) / reviews.length) * 10) / 10;
      updated = { ...current, ulasan: reviews, rating };
      saveLocalBusinesses(getLocalBusinesses().map((item) => item.id === updated.id ? updated : item));
    } else {
      updated = await addBusinessReview(input);
    }
    setBusinesses((current) => current.map((item) => item.id === updated.id ? updated : item));
    setSelectedBusiness(updated);
    setToast("Ulasan berhasil dikirim.");
  }

  function searchFromHero() {
    changeQuery(heroQuery);
    document.getElementById("jelajahi")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <SiteHeader />
      <main>
        <Hero businessCount={businesses.length} query={heroQuery} onQueryChange={setHeroQuery} onSearch={searchFromHero} onSuggestion={(value) => { setHeroQuery(value); changeQuery(value); document.getElementById("jelajahi")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} />

        <section className="mx-auto grid max-w-7xl gap-4 px-5 py-8 sm:grid-cols-3 sm:px-8 sm:py-10" aria-label="Ringkasan direktori">
          <StatCard value={businesses.length.toLocaleString("id-ID")} label="Usaha lokal" detail="Cerita dan layanan dari sekitar" />
          <StatCard value={String(categoryCount || CATEGORIES.length)} label="Kategori" detail="Pilihan lintas kebutuhan" />
          <StatCard value={String(cities.length)} label="Kota terjangkau" detail="Cari yang dekat dengan Anda" />
        </section>

        <section id="jelajahi" className="scroll-mt-24 border-y border-line bg-white py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[.15em] text-accent">Direktori pilihan</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-.06em] text-ink sm:text-4xl">Jelajahi usaha</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-muted">Temukan produk yang Anda cari dan mulai percakapan langsung dengan pemiliknya.</p>
              </div>
              <p className="text-xs font-medium text-muted" role="status" aria-live="polite">{loading ? "Memuat daftar usaha…" : `${filtered.length} usaha ditemukan`}</p>
            </div>

            {notice && <div className={`mb-5 rounded-xl border px-4 py-3 text-sm ${offline ? "border-[#d7e3d9] bg-[#f0f5f1] text-[#315540]" : "border-red-200 bg-red-50 text-red-900"}`} role={offline ? "status" : "alert"}>{notice}{offline && <button type="button" onClick={() => void loadData()} className="ml-2 font-semibold underline underline-offset-2">Coba sambungkan</button>}</div>}

            <DirectoryToolbar
              query={query} onQueryChange={changeQuery}
              category={category} onCategoryChange={(value) => { setCategory(value); setVisibleCount(12); }}
              city={city} onCityChange={(value) => { setCity(value); setVisibleCount(12); }} cities={cities}
              categoryCounts={categoryCounts}
              sort={sort} onSortChange={setSort}
              favoritesOnly={favoritesOnly} onFavoritesChange={() => setFavoritesOnly((value) => !value)}
              onRefresh={() => void loadData()} refreshing={refreshing}
            />

            <div className="mt-6">
              {loading ? <BusinessSkeletons /> : filtered.length === 0 ? <EmptyState favoritesOnly={favoritesOnly} onReset={clearFilters} /> : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filtered.slice(0, visibleCount).map((business, index) => <div key={business.id} className={index === 0 && !query && category === "Semua" && city === "Semua" && !favoritesOnly ? "md:col-span-2" : ""}>
                    <BusinessCard business={business} favorite={favorites.includes(business.id)} featured={index === 0 && !query && category === "Semua" && city === "Semua" && !favoritesOnly} onToggleFavorite={toggleFavorite} onViewDetails={setSelectedBusiness} />
                  </div>)}
                </div>
              )}
              {!loading && filtered.length > visibleCount && <div className="mt-7 text-center"><button type="button" onClick={() => setVisibleCount((count) => count + 12)} className="min-h-11 rounded-xl border border-line bg-white px-5 text-xs font-semibold text-ink transition-all duration-200 hover:border-accent hover:text-accent">Muat lebih banyak</button></div>}
            </div>
          </div>
        </section>

        <section id="cara-kerja" className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[.8fr_1.2fr] lg:gap-20 lg:py-24">
          <div className="max-w-md">
            <p className="text-[11px] font-bold uppercase tracking-[.15em] text-accent">Sederhana sejak awal</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-.06em] text-ink sm:text-4xl">Dari ditemukan sampai terhubung.</h2>
            <p className="mt-4 text-sm leading-7 text-muted">Ruang digital yang ringkas untuk mempertemukan usaha lokal dengan pembeli di sekitarnya.</p>
          </div>
          <div className="divide-y divide-line border-y border-line">
            <Step number="01" title="Daftarkan usaha" text="Isi informasi penting usaha Anda. Pendaftarannya gratis dan hanya perlu beberapa menit." />
            <Step number="02" title="Muncul di pencarian" text="Pembeli menemukan usaha Anda berdasarkan nama, kategori, atau kota." />
            <Step number="03" title="Mulai percakapan" text="Pembeli menghubungi Anda langsung melalui WhatsApp. Tanpa komisi dan perantara." />
          </div>
        </section>

        <section id="daftar" className="scroll-mt-24 border-y border-line bg-[#eef1ed] py-16 sm:py-20 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-[11px] font-bold uppercase tracking-[.15em] text-accent">Mulai dari sini</p>
              <h2 className="mt-3 max-w-sm text-3xl font-semibold leading-tight tracking-[-.06em] text-ink sm:text-4xl">Usaha Anda pantas ditemukan.</h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-muted">Tampilkan apa yang membuat usaha Anda istimewa. Pembeli sekitar bisa langsung menghubungi Anda.</p>
              <div className="mt-8 hidden rounded-2xl border border-[#dbe2dc] bg-white p-5 lg:block">
                <p className="text-xs font-semibold text-ink">Tidak ada biaya tersembunyi</p>
                <p className="mt-2 text-xs leading-5 text-muted">Daftar gratis. Tidak ada komisi pada setiap transaksi.</p>
              </div>
            </div>
            <div className="space-y-8">
              <RegistrationForm ownerId={ownerId} onCreate={addBusiness} />
              {myBusinesses.length > 0 && <div>
                <div className="mb-4 flex items-end justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[.13em] text-accent">Kelola daftar Anda</p><h3 className="mt-1 text-xl font-semibold tracking-[-.04em] text-ink">Usaha saya <span className="text-muted">({myBusinesses.length})</span></h3></div></div>
                <div className="grid gap-4">{myBusinesses.map((business) => <BusinessCard key={business.id} business={business} favorite={favorites.includes(business.id)} onToggleFavorite={toggleFavorite} onViewDetails={setSelectedBusiness} onDelete={removeBusiness} deleting={deletingId === business.id} />)}</div>
              </div>}
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <div className="grid gap-10 md:grid-cols-[.7fr_1.3fr] md:gap-20">
            <div><p className="text-[11px] font-bold uppercase tracking-[.15em] text-accent">Pertanyaan umum</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.06em] text-ink sm:text-4xl">Yang perlu Anda tahu.</h2></div>
            <div className="divide-y divide-line border-y border-line">
              <Faq question="Apakah Pasar UMKM benar-benar gratis?" answer="Ya. Tidak ada biaya pendaftaran dan kami tidak mengambil komisi dari transaksi." />
              <Faq question="Bagaimana pembeli menghubungi saya?" answer="Pembeli menekan tombol WhatsApp pada kartu usaha Anda untuk memulai percakapan langsung." />
              <Faq question="Apakah saya bisa menghapus usaha sendiri?" answer="Bisa. Setelah mendaftar dari perangkat ini, usaha Anda muncul pada bagian Usaha saya dan dapat dihapus kapan saja." />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#303c34] bg-[#17211b] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <a href="#home" className="text-sm font-bold tracking-[-.04em]">pasar<span className="text-[#8fc5a3]">umkm</span></a>
          <p className="max-w-md text-xs leading-5 text-[#b7c1b9]">Direktori usaha lokal Indonesia. Terhubung langsung, tanpa komisi.</p>
          <p className="text-xs text-[#b7c1b9]">© {new Date().getFullYear()} Pasar UMKM</p>
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-line bg-white/95 px-2 py-2 shadow-[0_-8px_30px_rgba(23,33,27,.08)] backdrop-blur-lg md:hidden" aria-label="Navigasi cepat">
        <MobileLink href="#home" label="Beranda" icon="⌂" />
        <MobileLink href="#jelajahi" label="Jelajahi" icon="⌕" />
        <MobileLink href="#daftar" label="Daftar" icon="＋" />
        <button type="button" aria-pressed={favoritesOnly} onClick={() => { setFavoritesOnly((value) => !value); document.getElementById("jelajahi")?.scrollIntoView({ behavior: "smooth" }); }} className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-medium transition-colors hover:text-accent ${favoritesOnly ? "text-accent" : "text-muted"}`}><span className="text-lg leading-5">♡</span>Favorit</button>
      </nav>

      <BusinessDetailDialog business={selectedBusiness} onClose={() => setSelectedBusiness(null)} onSubmitReview={submitReview} />

      {toast && <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-[#17211b] px-4 py-3 text-sm font-medium text-white shadow-lg md:bottom-6" role="status">✓ {toast}</div>}
      <div className="h-16 md:hidden" aria-hidden="true" />
    </>
  );
}

function StatCard({ value, label, detail }: { value: string; label: string; detail: string }) {
  return <div className="group flex min-h-[112px] items-center justify-between gap-4 rounded-2xl border border-line bg-white px-5 py-5 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-[#cad7ce] hover:shadow-sm sm:min-h-[128px] sm:px-6"><div><p className="text-xs font-semibold text-muted">{label}</p><p className="mt-1.5 text-3xl font-semibold tracking-[-.06em] text-ink">{value}</p><p className="mt-1 text-[11px] text-muted">{detail}</p></div><span className="text-xl text-accent transition-transform group-hover:translate-x-1" aria-hidden="true">↗</span></div>;
}
function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return <article className="grid gap-4 py-6 sm:grid-cols-[64px_1fr] sm:gap-6 sm:py-7"><span className="text-xs font-bold tracking-[.08em] text-accent">{number}</span><div><h3 className="text-base font-semibold tracking-[-.02em] text-ink">{title}</h3><p className="mt-2 max-w-xl text-sm leading-6 text-muted">{text}</p></div></article>;
}
function Faq({ question, answer }: { question: string; answer: string }) {
  return <details className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-semibold text-ink marker:hidden"><span>{question}</span><span className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-muted transition-transform group-open:rotate-45" aria-hidden="true">＋</span></summary><p className="max-w-2xl pt-3 pr-10 text-sm leading-6 text-muted">{answer}</p></details>;
}
function MobileLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return <a href={href} className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-medium text-muted transition-colors hover:text-accent"><span className="text-lg leading-5" aria-hidden="true">{icon}</span>{label}</a>;
}
