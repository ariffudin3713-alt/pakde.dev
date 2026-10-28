import { CATEGORIES, type Category, type SortOrder } from "@/lib/types";
import type { ReactNode } from "react";

interface DirectoryToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  category: Category | "Semua";
  onCategoryChange: (category: Category | "Semua") => void;
  city: string;
  onCityChange: (city: string) => void;
  cities: string[];
  categoryCounts: Record<Category, number>;
  sort: SortOrder;
  onSortChange: (sort: SortOrder) => void;
  favoritesOnly: boolean;
  onFavoritesChange: () => void;
  onClearAll: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export function DirectoryToolbar(props: DirectoryToolbarProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <label className="flex min-h-12 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 transition-all duration-200 ease-out focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10">
          <span className="text-blue-600" aria-hidden="true"><SearchIcon /></span>
          <span className="sr-only">Cari usaha</span>
          <input id="directory-query" value={props.query} onChange={(event) => props.onQueryChange(event.target.value)} placeholder="Cari nama, produk, kategori, atau kota" className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400" />
          {props.query && <button type="button" onClick={() => props.onQueryChange("")} className="grid size-8 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600" aria-label="Hapus pencarian">×</button>}
          {!props.query && <kbd className="hidden rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] text-gray-400 sm:inline">/</kbd>}
        </label>
        <button type="button" onClick={props.onRefresh} disabled={props.refreshing} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 text-xs font-semibold text-gray-700 transition-all duration-200 ease-out hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 active:scale-[.98] disabled:opacity-60">
          <span className={props.refreshing ? "animate-spin" : ""} aria-hidden="true">↻</span>{props.refreshing ? "Memuat…" : "Segarkan"}
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label="Filter kategori">
          <CategoryPill active={props.category === "Semua"} onClick={() => props.onCategoryChange("Semua")}>Semua <span className={props.category === "Semua" ? "text-white/70" : "text-muted/70"}>{Object.values(props.categoryCounts).reduce((sum, count) => sum + count, 0)}</span></CategoryPill>
          {CATEGORIES.map((category) => <CategoryPill key={category} active={props.category === category} onClick={() => props.onCategoryChange(category)}>{category} <span className={props.category === category ? "text-white/70" : "text-muted/70"}>{props.categoryCounts[category]}</span></CategoryPill>)}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="city-filter">Filter kota</label>
          <select id="city-filter" value={props.city} onChange={(event) => props.onCityChange(event.target.value)} className="min-h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10">
            <option value="Semua">Semua kota</option>{props.cities.map((city) => <option value={city} key={city}>{city}</option>)}
          </select>
          <label className="sr-only" htmlFor="sort-filter">Urutkan usaha</label>
          <select id="sort-filter" value={props.sort} onChange={(event) => props.onSortChange(event.target.value as SortOrder)} className="min-h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10">
            <option value="terbaru">Terbaru</option><option value="terlama">Terlama</option><option value="az">Nama A–Z</option><option value="za">Nama Z–A</option>
          </select>
          <button type="button" onClick={props.onFavoritesChange} aria-pressed={props.favoritesOnly} className={`min-h-10 rounded-xl border px-3 text-xs font-semibold transition-all duration-200 ${props.favoritesOnly ? "border-pink-500 bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md" : "border-gray-200 bg-white text-gray-700 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600"}`}><span aria-hidden="true">♥ </span>Favorit</button>
        </div>
      </div>

      {(props.query || props.category !== "Semua" || props.city !== "Semua" || props.favoritesOnly) && <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4" role="status" aria-label="Filter aktif">
        <span className="mr-1 text-[10px] font-semibold uppercase tracking-[.1em] text-muted">Filter aktif</span>
        {props.query && <FilterTag label={`Cari: ${props.query}`} onRemove={() => props.onQueryChange("")} />}
        {props.category !== "Semua" && <FilterTag label={props.category} onRemove={() => props.onCategoryChange("Semua")} />}
        {props.city !== "Semua" && <FilterTag label={props.city} onRemove={() => props.onCityChange("Semua")} />}
        {props.favoritesOnly && <FilterTag label="Favorit" onRemove={props.onFavoritesChange} />}
        <button type="button" onClick={props.onClearAll} className="ml-auto min-h-8 rounded-lg px-2 text-[11px] font-semibold text-muted underline decoration-transparent underline-offset-2 transition-all hover:text-accent hover:decoration-current">Hapus semua</button>
      </div>}
    </div>
  );
}

function CategoryPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return <button type="button" onClick={onClick} aria-pressed={active} className={`min-h-9 shrink-0 rounded-full border px-3.5 text-[11px] font-semibold transition-all duration-200 ease-out active:scale-[.97] ${active ? "border-blue-600 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md" : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"}`}>{children}</button>;
}
function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return <button type="button" onClick={onRemove} aria-label={`Hapus filter ${label}`} className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 text-[11px] font-medium text-blue-700 transition-all duration-200 hover:border-blue-400 hover:bg-blue-100">{label}<span aria-hidden="true">×</span></button>;
}
function SearchIcon() { return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>; }
