interface HeroProps {
  businessCount: number;
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onSuggestion: (value: string) => void;
}

export function Hero({ businessCount, query, onQueryChange, onSearch, onSuggestion }: HeroProps) {
  return (
    <section id="home" className="relative isolate overflow-hidden text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1400px_900px_at_10%_-20%,rgba(168,85,247,0.45),transparent),radial-gradient(1200px_800px_at_90%_-10%,rgba(236,72,153,0.35),transparent),radial-gradient(1000px_700px_at_50%_120%,rgba(6,182,212,0.25),transparent)]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#120b2e] via-[#1a103d] to-[#050510]" />
      <div className="absolute -left-40 top-10 -z-10 size-[28rem] rounded-full bg-violet-500/30 blur-[160px] animate-pulse-glow" />
      <div className="absolute -right-52 bottom-[-18rem] -z-10 size-[36rem] rounded-full bg-fuchsia-500/25 blur-[200px] animate-pulse-glow" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_.85fr] lg:gap-16 lg:py-28">
        <div className="max-w-3xl">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[.24em] text-fuchsia-100 backdrop-blur-xl">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-400 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-fuchsia-300" />
            </span>
            GEN Z • UMKM VIBES
          </p>
          <h1 className="max-w-[15ch] text-[clamp(3rem,9vw,7rem)] font-semibold leading-[.9] tracking-[-.09em]">
            Temuin <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">Usaha Keren</span> di Sekitarmu
          </h1>
          <p className="mt-7 max-w-xl text-[16px] leading-8 text-slate-200 sm:text-[18px] sm:leading-9">
            Dari kopi kekinian sampe kerajinan aesthetic. Langsung chat tanpa ribet, tanpa komisi. Dukung lokal, kece bareng!
          </p>
          <form className="mt-9 flex max-w-[620px] flex-col gap-2 rounded-full border border-white/15 bg-white/5 p-2 shadow-[0_60px_120px_-80px_rgba(168,85,247,0.9)] backdrop-blur-2xl sm:flex-row sm:items-center" onSubmit={(event) => { event.preventDefault(); onSearch(); }} role="search" aria-label="Cari usaha lokal">
            <label className="sr-only" htmlFor="hero-query">Cari berdasarkan nama, kategori, atau kota</label>
            <span className="hidden pl-5 text-fuchsia-200 sm:block" aria-hidden="true"><SearchIcon /></span>
            <input id="hero-query" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Cari kopi, thrift, dessert kekinian..." className="min-h-12 min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-slate-400 sm:px-2" />
            <button className="group relative inline-flex min-h-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 px-7 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_40px_90px_-50px_rgba(236,72,153,0.95)] active:scale-[.98]" type="submit">
              <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-white/0 via-white/25 to-white/0 transition-transform duration-[900ms] group-hover:translate-x-[120%]" />
              <span className="relative">Gas Cari</span>
            </button>
          </form>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-300"><span className="mr-1 text-slate-400">Trending:</span>{["Kuliner", "Fashion", "Jasa", "Kerajinan", "Kesehatan"].map((term) => <button key={term} type="button" onClick={() => onSuggestion(term)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-medium text-white backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-fuchsia-300/60 hover:bg-white/10 active:scale-95">{term}</button>)}</div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-200">
            <span className="flex items-center gap-2"><span className="grid size-6 place-items-center rounded-full bg-emerald-400/20 text-emerald-300"><CheckIcon /></span> 100% Gratis</span>
            <span className="flex items-center gap-2"><span className="grid size-6 place-items-center rounded-full bg-cyan-400/20 text-cyan-300"><CheckIcon /></span> Langsung WA</span>
            <span className="flex items-center gap-2"><span className="grid size-6 place-items-center rounded-full bg-fuchsia-400/20 text-fuchsia-300"><CheckIcon /></span> Buat Semua Gen</span>
          </div>
        </div>

        <aside className="relative mx-auto w-full max-w-[420px] lg:justify-self-end" aria-label="Ringkasan direktori">
          <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-violet-500/25 to-fuchsia-500/20 blur-[120px]" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[2.4rem] border border-white/15 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-[0_80px_160px_-100px_rgba(168,85,247,0.95)] backdrop-blur-2xl sm:p-8">
            <div className="absolute -right-16 -top-16 size-40 rounded-full bg-gradient-to-br from-fuchsia-500/30 to-violet-500/20 blur-3xl" />
            <div className="relative">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-fuchsia-200">Vibe Check</p>
                  <p className="mt-3 text-6xl font-semibold tracking-[-.08em]">{businessCount.toLocaleString("id-ID")}</p>
                  <p className="mt-1 text-sm text-slate-300">Usaha Keren Terdaftar</p>
                </div>
                <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500/80 to-fuchsia-500/80 text-white shadow-[0_40px_80px_-50px_rgba(236,72,153,0.95)]"><PinIcon /></span>
              </div>
              <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div className="space-y-3">
                <div className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 transition-all hover:-translate-y-0.5 hover:border-fuchsia-300/50 hover:bg-white/10"><span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-amber-400/80 to-orange-500/80 text-lg shadow-lg">🔥</span><div className="flex-1"><p className="text-sm font-semibold">Local Favorite</p><p className="text-xs text-slate-300">Banyak yang lagi hits</p></div><span className="text-fuchsia-200 opacity-0 transition-opacity group-hover:opacity-100">→</span></div>
                <div className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 transition-all hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-white/10"><span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400/80 to-blue-500/80 text-lg shadow-lg">⚡</span><div className="flex-1"><p className="text-sm font-semibold">Fast Connect</p><p className="text-xs text-slate-300">Langsung WA, nggak lama</p></div><span className="text-cyan-200 opacity-0 transition-opacity group-hover:opacity-100">→</span></div>
              </div>
              <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-r from-violet-500/25 via-fuchsia-500/20 to-pink-500/25 px-5 py-4 text-sm text-slate-100">
                <p className="font-semibold">Gas daftar usaha kamu ✨</p>
                <p className="mt-1 text-xs text-slate-300">Gratis, kekinian, bisa langsung dikenal</p>
              </div>
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
