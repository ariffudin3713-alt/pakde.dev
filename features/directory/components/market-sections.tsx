interface DirectoryStatsProps {
  businessCount: number;
  categoryCount: number;
  cityCount: number;
}

export function DirectoryStats({ businessCount, categoryCount, cityCount }: DirectoryStatsProps) {
  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-5 py-10 sm:grid-cols-3 sm:px-8 sm:py-12" aria-label="Ringkasan direktori">
      <StatCard value={businessCount.toLocaleString("id-ID")} label="Usaha Lokal" detail="Beragam produk & jasa" icon="🏪" color="blue" />
      <StatCard value={String(categoryCount)} label="Kategori" detail="Pilihan yang beragam" icon="📦" color="purple" />
      <StatCard value={String(cityCount)} label="Kota" detail="Dari berbagai wilayah" icon="📍" color="orange" />
    </section>
  );
}

function StatCard({ value, label, detail, icon, color }: { value: string; label: string; detail: string; icon: string; color: "blue" | "purple" | "orange" }) {
  const colorMap = {
    blue: { border: "border-blue-200 dark:border-blue-800", bg1: "from-blue-50 dark:from-blue-900/40", bg2: "to-blue-100 dark:to-blue-900/60", dot: "bg-blue-500", text: "text-blue-600 dark:text-blue-400" },
    purple: { border: "border-purple-200 dark:border-purple-800", bg1: "from-purple-50 dark:from-purple-900/40", bg2: "to-purple-100 dark:to-purple-900/60", dot: "bg-purple-500", text: "text-purple-600 dark:text-purple-400" },
    orange: { border: "border-orange-200 dark:border-orange-800", bg1: "from-orange-50 dark:from-orange-900/40", bg2: "to-amber-100 dark:to-amber-900/60", dot: "bg-orange-500", text: "text-orange-600 dark:text-orange-400" }
  };
  const c = colorMap[color];
  return (
    <div className={`group relative overflow-hidden min-h-[130px] rounded-2xl border ${c.border} bg-gradient-to-br p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:shadow-slate-900/50 sm:min-h-[140px] sm:p-6`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${c.bg1} ${c.bg2} opacity-60`} />
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300"><span className={`size-2 rounded-full ${c.dot}`} aria-hidden="true" />{label}</p>
          <p className="mt-2 text-4xl font-bold tracking-[-.06em] text-gray-900 dark:text-white">{value}</p>
          <p className="mt-1 text-xs font-medium text-gray-600 dark:text-gray-400">{detail}</p>
        </div>
        <span className="grid size-12 place-items-center rounded-xl bg-white/80 dark:bg-slate-800/80 text-2xl shadow-sm">{icon}</span>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-blue-50/30 dark:via-blue-900/10 to-transparent" />
      <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
        <div className="max-w-md">
          <p className="text-[11px] font-bold uppercase tracking-[.15em] text-blue-600 dark:text-blue-400">Cara Kerja</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-.06em] text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">Mudah, Cepat, dan Gratis</h2>
          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400">Hanya 3 langkah untuk menghubungkan usaha lokal Anda dengan pembeli di sekitar.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          <Step number="01" title="Daftar Gratis" text="Isi formulir sederhana, pendaftaran hanya butuh beberapa menit" icon="📝" color="blue" />
          <Step number="02" title="Tampil di Direktori" text="Usaha Anda langsung bisa ditemukan oleh pembeli sekitar" icon="🔍" color="purple" />
          <Step number="03" title="Terhubung Langsung" text="Pembeli chat via WhatsApp, tanpa komisi atau perantara" icon="💬" color="green" />
        </div>
      </div>
    </section>
  );
}

function Step({ number, title, text, icon, color }: { number: string; title: string; text: string; icon: string; color: "blue" | "purple" | "green" }) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    green: "from-green-500 to-emerald-600"
  };
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:shadow-slate-900/50">
      <div className={`absolute -right-8 -top-8 size-24 rounded-full bg-gradient-to-br ${colors[color]} opacity-10 dark:opacity-20`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <span className={`grid size-12 place-items-center rounded-xl bg-gradient-to-br ${colors[color]} text-white text-xl shadow-md`}>{icon}</span>
          <span className="text-3xl font-bold text-gray-200 dark:text-slate-700">{number}</span>
        </div>
        <h3 className="text-lg font-bold tracking-[-.02em] text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">{text}</p>
      </div>
    </article>
  );
}

export function RegistrationIntro() {
  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <p className="text-[11px] font-bold uppercase tracking-[.15em] text-green-600">Mulai Sekarang</p>
      <h2 className="mt-3 max-w-sm text-3xl font-bold leading-tight tracking-[-.06em] text-gray-900 sm:text-4xl lg:text-5xl">Bergabung & Berkembang Bersama</h2>
      <p className="mt-4 max-w-sm text-base leading-7 text-gray-600">Tampilkan keunikan usaha Anda. Dapatkan lebih banyak pelanggan dari sekitar tanpa biaya apapun.</p>
      <div className="mt-8 hidden space-y-4 lg:block">
        <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-5 shadow-sm">
          <p className="flex items-center gap-2 text-sm font-bold text-green-900">✅ 100% Gratis</p>
          <p className="mt-2 text-xs leading-5 text-green-700">Tanpa biaya pendaftaran, tanpa biaya bulanan, tanpa komisi</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 shadow-sm">
          <p className="flex items-center gap-2 text-sm font-bold text-blue-900">🚀 Langsung Tayang</p>
          <p className="mt-2 text-xs leading-5 text-blue-700">Usaha Anda langsung bisa dilihat dan dihubungi pembeli</p>
        </div>
        <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-5 shadow-sm">
          <p className="flex items-center gap-2 text-sm font-bold text-purple-900">👨‍👩‍👧‍👦 Untuk Semua</p>
          <p className="mt-2 text-xs leading-5 text-purple-700">Desain sederhana dan ramah untuk semua kalangan usia</p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-purple-50/20 dark:via-purple-900/10 to-transparent" />
      <div className="grid gap-10 md:grid-cols-[.7fr_1.3fr] md:gap-16">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.15em] text-purple-600 dark:text-purple-400">FAQ</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-.06em] text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">Pertanyaan yang Sering Ditanyakan</h2>
          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400">Semua yang perlu kamu ketahui tentang Pasar UMKM</p>
        </div>
        <div className="space-y-3">
          <Faq question="Apakah Pasar UMKM benar-benar gratis?" answer="Ya, sepenuhnya gratis! Tidak ada biaya pendaftaran, tidak ada biaya bulanan, dan kami tidak mengambil komisi dari setiap transaksi." />
          <Faq question="Bagaimana pembeli bisa menghubungi saya?" answer="Pembeli cukup menekan tombol 'Chat WhatsApp' pada kartu usaha Anda, mereka akan langsung terhubung ke nomor WhatsApp yang Anda daftarkan." />
          <Faq question="Apakah saya bisa menghapus usaha saya?" answer="Bisa. Setelah mendaftar dari perangkat yang sama, usaha Anda akan muncul di bagian 'Usaha Saya' dan Anda bisa menghapusnya kapan saja." />
          <Faq question="Bisakah saya menambahkan ulasan?" answer="Tentu bisa! Buka detail usaha, isi nama (opsional), berikan penilaian bintang, dan tulis ulasan Anda. Ulasan akan membantu pembeli lain." />
          <Faq question="Apakah aman untuk semua umur?" answer="Ya, platform ini dirancang sederhana, ramah, dan aman untuk digunakan oleh semua kalangan usia, dari pelajar hingga orang tua." />
        </div>
      </div>
    </section>
  );
}

function Faq({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition-all hover:shadow-md dark:shadow-slate-900/50">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-5 p-5 text-sm font-semibold text-gray-900 dark:text-white marker:hidden">
        <span className="flex-1">{question}</span>
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 transition-all duration-200 group-open:rotate-45 group-open:bg-blue-100 dark:group-open:bg-blue-900/50 group-open:text-blue-600 dark:group-open:text-blue-400" aria-hidden="true">+</span>
      </summary>
      <div className="px-5 pb-5">
        <p className="max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">{answer}</p>
      </div>
    </details>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-800 dark:border-slate-700 bg-gradient-to-br from-gray-900 to-gray-950 dark:from-slate-950 dark:to-black text-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <a href="#home" className="text-lg font-bold tracking-[-.04em]">Pasar<span className="text-blue-400">UMKM</span></a>
            <p className="mt-3 max-w-xs text-sm leading-6 text-gray-400">Direktori usaha lokal Indonesia. Membantu menghubungkan pelaku UMKM dengan pembeli di sekitar, langsung tanpa perantara.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Navigasi</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#home" className="hover:text-white transition-colors">Beranda</a></li>
              <li><a href="#jelajahi" className="hover:text-white transition-colors">Jelajahi Usaha</a></li>
              <li><a href="#cara-kerja" className="hover:text-white transition-colors">Cara Kerja</a></li>
              <li><a href="#daftar" className="hover:text-white transition-colors">Daftarkan Usaha</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Nilai Kami</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ Gratis untuk semua</li>
              <li>✓ Tanpa komisi</li>
              <li>✓ Ramah untuk semua umur</li>
              <li>✓ Mendukung UMKM lokal</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-800 dark:border-slate-700 text-center">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} Pasar UMKM. Dibuat dengan ❤️ untuk mendukung usaha lokal Indonesia</p>
        </div>
      </div>
    </footer>
  );
}

interface MobileNavigationProps {
  favoritesOnly: boolean;
  onToggleFavorites: () => void;
}

export function MobileNavigation({ favoritesOnly, onToggleFavorites }: MobileNavigationProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-line bg-white/95 px-2 py-2 shadow-[0_-8px_30px_rgba(23,33,27,.08)] backdrop-blur-lg md:hidden" aria-label="Navigasi cepat">
      <MobileLink href="#home" label="Beranda" icon="⌂" />
      <MobileLink href="#jelajahi" label="Jelajahi" icon="⌕" />
      <MobileLink href="#daftar" label="Daftar" icon="＋" />
      <button type="button" aria-pressed={favoritesOnly} onClick={onToggleFavorites} className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-medium transition-colors hover:text-accent ${favoritesOnly ? "text-accent" : "text-muted"}`}><span className="text-lg leading-5" aria-hidden="true">♡</span>Favorit</button>
    </nav>
  );
}

function MobileLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return <a href={href} className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-medium text-muted transition-colors hover:text-accent"><span className="text-lg leading-5" aria-hidden="true">{icon}</span>{label}</a>;
}
