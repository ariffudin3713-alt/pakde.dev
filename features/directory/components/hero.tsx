interface HeroProps {
  businessCount: number;
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onSuggestion: (value: string) => void;
}

export function Hero({ businessCount, query, onQueryChange, onSearch, onSuggestion }: HeroProps) {
  return (
    <section id="home" className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--glow-accent)" }} />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:gap-20 lg:py-28">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.32em]" style={{ borderColor: "var(--border-subtle)", color: "var(--text-tertiary)", background: "color-mix(in srgb, var(--bg-surface) 90%, transparent)" }}>
            <span className="size-1.5 rounded-full bg-blue-500" />
            Direktori UMKM Indonesia
          </div>
          <h1 className="text-[clamp(2.8rem,8vw,6.2rem)] font-semibold leading-[0.96] tracking-[-0.08em]" style={{ color: "var(--text-primary)" }}>
            Temukan usaha lokal
            <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">yang layak dikenal</span>
          </h1>
          <p className="mt-6 max-w-xl text-[16px] leading-8 sm:text-[18px] sm:leading-9" style={{ color: "var(--text-secondary)" }}>
            Direktori yang terkurasi untuk mempertemukan pelaku UMKM dengan pembeli di sekitar. Hubungi langsung, tanpa komisi, tanpa perantara.
          </p>
          <form className="mt-9 flex max-w-[620px] flex-col gap-2 rounded-full border p-2 shadow-[var(--shadow-soft)] sm:flex-row sm:items-center" style={{ borderColor: "var(--border-strong)", background: "var(--bg-surface)" }} onSubmit={(event) => { event.preventDefault(); onSearch(); }} role="search" aria-label="Cari usaha lokal">
            <label className="sr-only" htmlFor="hero-query">Cari berdasarkan nama, kategori, atau kota</label>
            <span className="hidden pl-5 sm:block" style={{ color: "var(--text-tertiary)" }} aria-hidden="true"><SearchIcon /></span>
            <input id="hero-query" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Cari kopi, kerajinan, jasa, atau kota..." className="min-h-12 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none sm:px-2" style={{ color: "var(--text-primary)" }} />
            <button className="group inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-7 text-sm font-semibold text-white transition-all hover:-translate-y-0.5" type="submit">Cari usaha</button>
          </form>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px]"><span style={{ color: "var(--text-tertiary)" }}>Populer:</span>{["Kuliner", "Fashion", "Jasa", "Kerajinan"].map((term) => <button key={term} type="button" onClick={() => onSuggestion(term)} className="rounded-full border px-3 py-1.5 transition-all hover:-translate-y-0.5 hover:text-blue-600" style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)", background: "var(--bg-subtle)" }}>{term}</button>)}</div>
          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            <FeatureItem title="Gratis selamanya" desc="Tanpa biaya pendaftaran" />
            <FeatureItem title="Hubungi langsung" desc="Langsung via WhatsApp" />
            <FeatureItem title="Ramah untuk semua" desc="Sederhana & mudah dipahami" />
          </div>
        </div>

        <aside className="relative mx-auto w-full max-w-[420px] lg:justify-self-end">
          <div className="absolute -inset-10 -z-10 rounded-[3rem] bg-gradient-to-br from-blue-500/10 via-cyan-400/8 to-transparent blur-[90px]" />
          <div className="relative overflow-hidden rounded-[2rem] border shadow-[var(--shadow-card)]" style={{ borderColor: "var(--border-strong)", background: "var(--bg-surface)" }}>
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
            <div className="p-7 sm:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em]" style={{ color: "var(--text-tertiary)" }}>Ringkasan direktori</p>
                  <p className="mt-3 text-5xl font-semibold tracking-[-0.08em]" style={{ color: "var(--text-primary)" }}>{businessCount.toLocaleString("id-ID")}</p>
                  <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>Usaha terdaftar</p>
                </div>
                <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-[0_30px_60px_-40px_rgba(37,99,235,0.9)]"><PinIcon /></span>
              </div>
              <div className="my-7 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--border-subtle), transparent)" }} />
              <div className="space-y-4">
                <ListItem icon="🏡" title="Dari lingkungan sekitar" desc="Usaha kecil dengan cerita autentik" />
                <ListItem icon="💬" title="Terhubung langsung" desc="Percakapan tanpa perantara" />
                <ListItem icon="🤝" title="Saling mendukung" desc="Kuatkan ekosistem lokal" />
              </div>
              <div className="mt-7 rounded-2xl border px-5 py-4" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-subtle)" }}>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Mulai wujudkan usaha Anda dikenal</p>
                <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>Daftar gratis, tampil dalam hitungan menit</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function SearchIcon() { return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>; }
function PinIcon() { return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>; }
function FeatureItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border px-5 py-4" style={{ borderColor: "var(--border-subtle)", background: "color-mix(in srgb, var(--bg-surface) 92%, transparent)" }}>
      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{title}</p>
      <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>{desc}</p>
    </div>
  );
}
function ListItem({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid size-10 place-items-center rounded-xl border" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-subtle)" }}>{icon}</span>
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{title}</p>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>{desc}</p>
      </div>
    </div>
  );
}
