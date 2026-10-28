export function BusinessSkeletons() {
  return (
    <div className="grid gap-4 md:grid-cols-2" aria-label="Memuat daftar usaha" aria-busy="true">
      {[0, 1, 2, 3].map((item) => <div key={item} className={`animate-pulse rounded-2xl border border-line bg-white p-6 ${item === 0 ? "md:col-span-2" : ""}`}><div className="flex items-center gap-3"><div className="size-12 rounded-2xl bg-[#edf0ed]"/><div className="flex-1"><div className="h-3 w-20 rounded bg-[#edf0ed]"/><div className="mt-2 h-4 w-40 rounded bg-[#edf0ed]"/></div></div><div className="mt-6 h-3 w-full rounded bg-[#f0f2f0]"/><div className="mt-2 h-3 w-4/5 rounded bg-[#f0f2f0]"/><div className="mt-6 h-10 w-36 rounded-xl bg-[#edf0ed]"/></div>)}
    </div>
  );
}
interface EmptyStateProps {
  favoritesOnly: boolean;
  hasListings: boolean;
  onReset: () => void;
}

export function EmptyState({ favoritesOnly, hasListings, onReset }: EmptyStateProps) {
  const title = favoritesOnly ? "Belum Ada Favorit" : hasListings ? "Tidak Ditemukan" : "Jadilah Yang Pertama";
  const description = favoritesOnly
    ? "Simpan usaha yang menarik dengan menekan tombol hati untuk menemukannya lagi di sini."
    : hasListings
      ? "Coba ubah kata pencarian, kategori, atau filter lainnya untuk menemukan hasil yang sesuai."
      : "Kenalkan usaha Anda kepada pembeli di sekitar. Pendaftaran gratis dan sangat mudah!";
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center sm:py-20">
      <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-3xl shadow-sm" aria-hidden="true">{favoritesOnly ? "♥" : hasListings ? "🔍" : "✨"}</span>
      <h3 className="mt-5 text-xl font-bold tracking-[-.03em] text-gray-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-600">{description}</p>
      {!hasListings && !favoritesOnly ? <a href="#daftar" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg">Daftarkan Usaha Gratis</a> : <button type="button" onClick={onReset} className="mt-6 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">{favoritesOnly ? "Lihat Semua Usaha" : "Hapus Semua Filter"}</button>}
    </div>
  );
}
