export function BusinessSkeletons() {
  return (
    <div className="grid gap-4 md:grid-cols-2" aria-label="Memuat daftar usaha" aria-busy="true">
      {[0, 1, 2, 3].map((item) => <div key={item} className={`animate-pulse rounded-2xl border border-line bg-white p-6 ${item === 0 ? "md:col-span-2" : ""}`}><div className="flex items-center gap-3"><div className="size-12 rounded-2xl bg-[#edf0ed]"/><div className="flex-1"><div className="h-3 w-20 rounded bg-[#edf0ed]"/><div className="mt-2 h-4 w-40 rounded bg-[#edf0ed]"/></div></div><div className="mt-6 h-3 w-full rounded bg-[#f0f2f0]"/><div className="mt-2 h-3 w-4/5 rounded bg-[#f0f2f0]"/><div className="mt-6 h-10 w-36 rounded-xl bg-[#edf0ed]"/></div>)}
    </div>
  );
}

interface EmptyStateProps {
  favoritesOnly: boolean;
  onReset: () => void;
}

export function EmptyState({ favoritesOnly, onReset }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-[#cfd8d1] bg-white px-6 py-14 text-center sm:py-20">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#f1f3f0] text-2xl" aria-hidden="true">{favoritesOnly ? "♡" : "⌕"}</span>
      <h3 className="mt-5 text-lg font-semibold tracking-[-.03em] text-ink">{favoritesOnly ? "Belum ada favorit" : "Belum menemukan usaha"}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">{favoritesOnly ? "Simpan usaha yang menarik untuk menemukannya lagi di sini." : "Coba kata pencarian atau filter lain untuk melihat lebih banyak hasil."}</p>
      {!favoritesOnly && <button type="button" onClick={onReset} className="mt-5 rounded-xl border border-line px-4 py-2.5 text-xs font-semibold text-ink transition-all duration-200 hover:border-accent hover:text-accent">Hapus semua filter</button>}
    </div>
  );
}

export function ErrorNotice({ children, onRetry }: { children: string; onRetry: () => void }) {
  return <div role="alert" className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-900 sm:flex-row sm:items-center sm:justify-between"><p>{children}</p><button type="button" onClick={onRetry} className="w-fit rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold hover:bg-red-100">Coba lagi</button></div>;
}
