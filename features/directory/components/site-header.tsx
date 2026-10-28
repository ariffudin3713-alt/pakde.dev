import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="#home" className="group flex items-center gap-3" aria-label="Pasar UMKM, ke beranda">
          <span className="grid size-10 place-items-center rounded-xl bg-accent text-white shadow-sm transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105" aria-hidden="true">
            <StoreIcon />
          </span>
          <span className="text-[15px] font-bold tracking-[-.04em] text-ink">pasar<span className="text-accent">umkm</span></span>
        </Link>
        <nav className="hidden items-center gap-8 text-[13px] font-medium text-muted md:flex" aria-label="Navigasi utama">
          <Link className="transition-colors hover:text-accent" href="#jelajahi">Jelajahi</Link>
          <Link className="transition-colors hover:text-accent" href="#cara-kerja">Cara kerja</Link>
          <Link className="transition-colors hover:text-accent" href="#faq">FAQ</Link>
        </nav>
        <Link href="#daftar" className="inline-flex min-h-10 items-center justify-center rounded-xl bg-accent px-4 text-[13px] font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-accent-deep hover:shadow-md active:scale-[.98] sm:px-5">
          Daftarkan usaha <span className="ml-2 hidden sm:inline" aria-hidden="true">↗</span>
        </Link>
      </div>
    </header>
  );
}

function StoreIcon() {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 9h18l-1.6 10.2a2 2 0 0 1-2 1.8H6.6a2 2 0 0 1-2-1.8L3 9Z"/><path d="M8 9 11 3M16 9 13 3"/></svg>;
}
