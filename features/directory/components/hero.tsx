interface HeroProps {
  businessCount: number;
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onSuggestion: (value: string) => void;
}

export function Hero({ businessCount, query, onQueryChange, onSearch, onSuggestion }: HeroProps) {
  return (
    <section id="home" className="relative">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:gap-24 lg:py-28">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.32em]" style={{ borderColor: "var(--border-subtle)", color: "var(--text-tertiary)" }}>
            Strategic Advisory • Local Commerce
          </div>
          <h1 className="text-[clamp(3rem,8vw,6.4rem)] font-semibold leading-[0.98] tracking-[-0.08em]" style={{ color: "var(--text-primary)" }}>
            Building credibility for
            <span className="block">local businesses</span>
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-9" style={{ color: "var(--text-secondary)" }}>
            A refined directory designed to elevate UMKM with clarity, professionalism, and direct connections. Every listing is built to earn trust.
          </p>
          <form className="mt-10 flex max-w-[580px] flex-col gap-2 border p-2 sm:flex-row sm:items-center" style={{ borderColor: "var(--border-strong)", background: "var(--bg-surface)" }} onSubmit={(event) => { event.preventDefault(); onSearch(); }} role="search" aria-label="Cari usaha lokal">
            <label className="sr-only" htmlFor="hero-query">Cari berdasarkan nama, kategori, atau kota</label>
            <span className="hidden pl-4 sm:block" style={{ color: "var(--text-tertiary)" }} aria-hidden="true"><SearchIcon /></span>
            <input id="hero-query" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search businesses, services or locations" className="min-h-12 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none sm:px-2" style={{ color: "var(--text-primary)" }} />
            <button className="inline-flex min-h-12 items-center justify-center bg-gradient-to-r from-[#1f4ed8] to-[#1a3fbf] px-7 text-sm font-semibold text-white" type="submit">Search</button>
          </form>
          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm" style={{ color: "var(--text-tertiary)" }}>
            <span>Free listing</span>
            <span>Direct WhatsApp</span>
            <span>Curated for trust</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-x-10 -top-10 -z-10 h-[420px] bg-gradient-to-b from-[rgba(31,78,216,0.05)] to-transparent" />
          <div className="relative overflow-hidden border" style={{ borderColor: "var(--border-strong)", background: "var(--bg-surface)", boxShadow: "var(--shadow-card)" }}>
            <div className="grid gap-0 lg:grid-cols-[1.1fr_.9fr]">
              <div className="p-8 sm:p-10">
                <p className="text-[11px] uppercase tracking-[0.32em]" style={{ color: "var(--text-tertiary)" }}>Featured insight</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl" style={{ color: "var(--text-primary)" }}>A measured approach to visibility</h2>
                <p className="mt-4 text-[16px] leading-8" style={{ color: "var(--text-secondary)" }}>We help local businesses present their value with precision. Clarity in information builds confidence and drives meaningful conversations.</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <Metric value={businessCount.toLocaleString("id-ID")} label="Registered businesses" />
                  <Metric value={String(Math.max(1, Math.floor(businessCount / 10) || 1)) + "+"} label="Cities represented" />
                </div>
              </div>
              <div className="relative border-t lg:border-l lg:border-t-0" style={{ borderColor: "var(--border-subtle)" }}>
                <div className="flex h-full flex-col justify-between p-8 sm:p-10">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.32em]" style={{ color: "var(--text-tertiary)" }}>Principles</p>
                    <ul className="mt-5 space-y-4">
                      <Principle title="Transparency" desc="Accurate details, direct contact." />
                      <Principle title="Professionalism" desc="Structured listings that inspire trust." />
                      <Principle title="Accessibility" desc="Simple for every generation." />
                    </ul>
                  </div>
                  <a href="#daftar" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--color-accent)" }}>List your business <span aria-hidden="true">→</span></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchIcon() { return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>; }
function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-t pt-4" style={{ borderColor: "var(--border-subtle)" }}>
      <p className="text-3xl font-semibold tracking-[-0.04em]" style={{ color: "var(--text-primary)" }}>{value}</p>
      <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>{label}</p>
    </div>
  );
}
function Principle({ title, desc }: { title: string; desc: string }) {
  return (
    <li className="border-t pt-4" style={{ borderColor: "var(--border-subtle)" }}>
      <p className="text-base font-medium" style={{ color: "var(--text-primary)" }}>{title}</p>
      <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>{desc}</p>
    </li>
  );
}
