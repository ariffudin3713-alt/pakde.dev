interface HeroProps {
  businessCount: number;
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
}

export function Hero({ businessCount, query, onQueryChange, onSearch }: HeroProps) {
  return (
    <section id="home" className="relative overflow-hidden border-b border-line bg-[#eef1ed]">
      <div className="absolute -right-36 -top-48 size-[34rem] rounded-full border border-[#dbe2dc]" aria-hidden="true" />
      <div className="absolute -right-16 -top-28 size-[24rem] rounded-full border border-[#dbe2dc]" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.2fr_.8fr] lg:gap-20 lg:py-28">
        <div className="max-w-3xl">
          <p className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.18em] text-accent">
            <span className="size-1.5 rounded-full bg-accent" /> Pasar lokal, terasa dekat
          </p>
          <h1 className="max-w-[13ch] text-[clamp(3.2rem,8.4vw,6.8rem)] font-semibold leading-[.94] tracking-[-.075em] text-ink">
            Temukan usaha <span className="text-accent">di sekitar.</span>
          </h1>
          <p className="mt-7 max-w-xl text-[15px] leading-7 text-muted sm:text-[17px] sm:leading-8">
            Cerita, produk, dan jasa dari orang-orang di lingkungan Anda. Kenali usahanya, lalu hubungi penjual langsung.
          </p>
          <form className="mt-9 flex max-w-[590px] flex-col gap-2 rounded-2xl border border-[#dce2dc] bg-white p-2 shadow-sm sm:flex-row sm:items-center" onSubmit={(event) => { event.preventDefault(); onSearch(); }} role="search" aria-label="Cari usaha lokal">
            <label className="sr-only" htmlFor="hero-query">Cari berdasarkan nama, kategori, atau kota</label>
            <span className="hidden pl-3 text-muted sm:block" aria-hidden="true"><SearchIcon /></span>
            <input id="hero-query" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Cari kopi, batik, atau kota..." className="min-h-12 min-w-0 flex-1 bg-transparent px-3 text-sm text-ink outline-none placeholder:text-[#919a93] sm:px-2" />
            <button className="min-h-12 rounded-xl bg-accent px-6 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:bg-accent-deep active:scale-[.98]" type="submit">Cari usaha</button>
          </form>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-muted">
            <span><CheckIcon /> Gratis tanpa komisi</span>
            <span><CheckIcon /> Hubungi langsung</span>
          </div>
        </div>

        <aside className="relative mx-auto w-full max-w-[410px] lg:justify-self-end" aria-label="Ringkasan direktori">
          <div className="absolute -inset-5 rounded-[2rem] border border-[#dce2dc]" aria-hidden="true" />
          <div className="relative rounded-[1.5rem] border border-[#dce2dc] bg-white p-6 shadow-md sm:p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-semibold text-muted">Ruang usaha lokal</p>
                <p className="mt-2 text-4xl font-semibold tracking-[-.06em] text-ink">{businessCount.toLocaleString("id-ID")}</p>
                <p className="mt-1 text-sm text-muted">usaha terdaftar</p>
              </div>
              <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent"><PinIcon /></span>
            </div>
            <div className="my-7 h-px bg-line" />
            <div className="space-y-4">
              <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-[#f4f5f2] text-sm">🍲</span><div><p className="text-sm font-semibold text-ink">Dari tetangga</p><p className="text-xs text-muted">Usaha kecil, cerita besar</p></div><span className="ml-auto text-accent">↗</span></div>
              <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-[#f4f5f2] text-sm">💬</span><div><p className="text-sm font-semibold text-ink">Langsung terhubung</p><p className="text-xs text-muted">Percakapan lewat WhatsApp</p></div><span className="ml-auto text-accent">↗</span></div>
            </div>
            <div className="mt-7 rounded-xl bg-[#f5f6f4] px-4 py-3 text-xs leading-5 text-muted">
              <span className="mr-2 font-semibold text-accent">Mudah dimulai</span>Daftarkan usaha Anda secara gratis.
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function SearchIcon() { return <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>; }
function PinIcon() { return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>; }
function CheckIcon() { return <svg className="mr-1.5 inline-block align-[-3px] text-accent" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 8 3.2 3.2L13 4.5"/></svg>; }
