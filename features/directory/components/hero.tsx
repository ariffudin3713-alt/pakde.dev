interface HeroProps {
  businessCount: number;
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onSuggestion: (value: string) => void;
}

export function Hero({ businessCount, query, onQueryChange, onSearch, onSuggestion }: HeroProps) {
  return (
    <section id="home" className="relative isolate overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,.4),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(147,51,234,.3),transparent_50%)]" aria-hidden="true" />
      <div className="absolute -right-40 -top-60 -z-10 size-[36rem] rounded-full bg-white/5 blur-3xl" aria-hidden="true" />
      <div className="absolute -left-32 bottom-0 -z-10 size-[28rem] rounded-full bg-purple-400/10 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.2fr_.8fr] lg:gap-20 lg:py-28">
        <div className="max-w-3xl">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[.18em] text-blue-100 backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)] animate-pulse" /> #DukungUMKM Lokal
          </p>
          <h1 className="max-w-[14ch] text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[.92] tracking-[-.08em] text-white">
            Temukan & Dukung <span className="bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">Usaha Lokal</span>
          </h1>
          <p className="mt-7 max-w-xl text-[16px] leading-8 text-blue-100 sm:text-[18px] sm:leading-9">
            Jelajahi beragam produk dan jasa dari usaha kecil di sekitar Anda. Temukan yang kamu butuhkan, hubungi langsung tanpa perantara!
          </p>
          <form className="mt-9 flex max-w-[590px] flex-col gap-2 rounded-2xl border border-white/30 dark:border-slate-600 bg-white dark:bg-slate-800 p-2 shadow-2xl backdrop-blur-sm sm:flex-row sm:items-center" onSubmit={(event) => { event.preventDefault(); onSearch(); }} role="search" aria-label="Cari usaha lokal">
            <label className="sr-only" htmlFor="hero-query">Cari berdasarkan nama, kategori, atau kota</label>
            <span className="hidden pl-3 text-blue-600 dark:text-blue-400 sm:block" aria-hidden="true"><SearchIcon /></span>
            <input id="hero-query" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Cari kopi, fashion, jasa..." className="min-h-12 min-w-0 flex-1 bg-transparent px-3 text-sm text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 sm:px-2" />
            <button className="min-h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 text-sm font-semibold text-white shadow-lg transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:from-orange-600 hover:to-amber-600 hover:shadow-xl active:scale-[.98]" type="submit">Cari Sekarang</button>
          </form>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-blue-200"><span className="mr-1">Populer:</span>{["Kuliner", "Fashion", "Jasa", "Kerajinan"].map((term) => <button key={term} type="button" onClick={() => onSuggestion(term)} className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-medium text-white backdrop-blur-sm transition-all duration-200 ease-out hover:scale-105 hover:bg-white/20 hover:shadow-md active:scale-95">{term}</button>)}</div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white">
            <span className="flex items-center gap-2"><span className="grid size-6 place-items-center rounded-full bg-emerald-400/20"><CheckIcon /></span> Gratis & Tanpa Komisi</span>
            <span className="flex items-center gap-2"><span className="grid size-6 place-items-center rounded-full bg-emerald-400/20"><CheckIcon /></span> Hubungi Langsung</span>
            <span className="flex items-center gap-2"><span className="grid size-6 place-items-center rounded-full bg-emerald-400/20"><CheckIcon /></span> Cocok untuk Semua Usia</span>
          </div>
        </div>

        <aside className="relative mx-auto w-full max-w-[410px] lg:justify-self-end" aria-label="Ringkasan direktori">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-white/20 to-white/5 dark:from-white/10 dark:to-white/5 blur-xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/40 dark:border-slate-600 bg-white/95 dark:bg-slate-800/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" aria-hidden="true" />
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Direktori UMKM</p>
                <p className="mt-2 text-5xl font-bold tracking-[-.06em] bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">{businessCount.toLocaleString("id-ID")}</p>
                <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">Usaha Terdaftar</p>
              </div>
              <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 text-blue-600 dark:text-blue-400 shadow-md"><PinIcon /></span>
            </div>
            <div className="my-7 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-600 to-transparent" />
            <div className="space-y-4">
              <div className="group flex items-center gap-3 rounded-xl p-2 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20"><span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 text-lg shadow-sm">🍜</span><div className="flex-1"><p className="text-sm font-semibold text-gray-900 dark:text-white">Dari Tetangga</p><p className="text-xs text-gray-600 dark:text-gray-400">Usaha kecil, cerita besar</p></div><span className="text-blue-600 dark:text-blue-400 opacity-0 transition-opacity group-hover:opacity-100">→</span></div>
              <div className="group flex items-center gap-3 rounded-xl p-2 transition-all hover:bg-green-50 dark:hover:bg-green-900/20"><span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-lg shadow-sm">💬</span><div className="flex-1"><p className="text-sm font-semibold text-gray-900 dark:text-white">Langsung Terhubung</p><p className="text-xs text-gray-600 dark:text-gray-400">Chat via WhatsApp</p></div><span className="text-green-600 dark:text-green-400 opacity-0 transition-opacity group-hover:opacity-100">→</span></div>
            </div>
            <div className="mt-7 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 px-4 py-3 text-xs leading-5 text-gray-700 dark:text-gray-300 border border-blue-100 dark:border-blue-800">
              <span className="mr-2 font-bold text-blue-700 dark:text-blue-400">✨ Gratis!</span>Daftarkan usaha Anda tanpa biaya apapun
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function SearchIcon() { return <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>; }
function PinIcon() { return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>; }
function CheckIcon() { return <svg className="mr-1.5 inline-block align-[-3px] text-[#9bceaa]" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 8 3.2 3.2L13 4.5"/></svg>; }
