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
  sort: SortOrder;
  onSortChange: (sort: SortOrder) => void;
  favoritesOnly: boolean;
  onFavoritesChange: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export function DirectoryToolbar(props: DirectoryToolbarProps) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <label className="flex min-h-12 items-center gap-3 rounded-xl border border-line bg-[#fbfcfb] px-3.5 transition-all focus-within:border-accent focus-within:ring-4 focus-within:ring-[#176344]/10">
          <span className="text-muted" aria-hidden="true"><SearchIcon /></span>
          <span className="sr-only">Cari usaha</span>
          <input value={props.query} onChange={(event) => props.onQueryChange(event.target.value)} placeholder="Cari nama, produk, kategori, atau kota" className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-[#929c94]" />
          {props.query && <button type="button" onClick={() => props.onQueryChange("")} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-[#eef1ed]" aria-label="Hapus pencarian">×</button>}
        </label>
        <button type="button" onClick={props.onRefresh} disabled={props.refreshing} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line px-4 text-xs font-semibold text-ink transition-all duration-200 hover:border-accent hover:text-accent disabled:opacity-60">
          <span className={props.refreshing ? "animate-spin" : ""} aria-hidden="true">↻</span>{props.refreshing ? "Memuat…" : "Segarkan"}
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter kategori">
          <CategoryPill active={props.category === "Semua"} onClick={() => props.onCategoryChange("Semua")}>Semua</CategoryPill>
          {CATEGORIES.map((category) => <CategoryPill key={category} active={props.category === category} onClick={() => props.onCategoryChange(category)}>{category}</CategoryPill>)}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="city-filter">Filter kota</label>
          <select id="city-filter" value={props.city} onChange={(event) => props.onCityChange(event.target.value)} className="min-h-10 rounded-xl border border-line bg-white px-3 text-xs font-medium text-ink outline-none focus:border-accent">
            <option value="Semua">Semua kota</option>{props.cities.map((city) => <option value={city} key={city}>{city}</option>)}
          </select>
          <label className="sr-only" htmlFor="sort-filter">Urutkan usaha</label>
          <select id="sort-filter" value={props.sort} onChange={(event) => props.onSortChange(event.target.value as SortOrder)} className="min-h-10 rounded-xl border border-line bg-white px-3 text-xs font-medium text-ink outline-none focus:border-accent">
            <option value="terbaru">Terbaru</option><option value="terlama">Terlama</option><option value="az">Nama A–Z</option><option value="za">Nama Z–A</option>
          </select>
          <button type="button" onClick={props.onFavoritesChange} aria-pressed={props.favoritesOnly} className={`min-h-10 rounded-xl border px-3 text-xs font-semibold transition-all duration-200 ${props.favoritesOnly ? "border-accent bg-accent text-white" : "border-line bg-white text-ink hover:border-accent hover:text-accent"}`}><span aria-hidden="true">♡ </span>Favorit</button>
        </div>
      </div>
    </div>
  );
}

function CategoryPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return <button type="button" onClick={onClick} aria-pressed={active} className={`min-h-9 rounded-full border px-3.5 text-[11px] font-semibold transition-all duration-200 ease-in-out ${active ? "border-accent bg-accent text-white" : "border-line bg-white text-muted hover:border-[#b7cbbd] hover:text-accent"}`}>{children}</button>;
}
function SearchIcon() { return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>; }
