"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="grid min-h-screen place-items-center bg-paper px-5"><div className="max-w-md rounded-2xl border border-line bg-white p-8 text-center shadow-sm"><p className="text-[11px] font-bold uppercase tracking-[.14em] text-red-700">Terjadi kendala</p><h1 className="mt-3 text-2xl font-semibold tracking-[-.05em] text-ink">Halaman belum dapat dimuat.</h1><p className="mt-3 text-sm leading-6 text-muted">Coba muat ulang. Daftar usaha Anda tetap aman.</p><button type="button" onClick={reset} className="mt-6 min-h-11 rounded-xl bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-accent-deep">Coba lagi</button></div></main>;
}
