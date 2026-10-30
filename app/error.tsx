"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-svh place-items-center bg-ground px-[var(--page-x)] py-16 text-ink">
      <div className="max-w-lg">
        <p className="font-display text-[16px] font-semibold text-blood">Terjadi kendala</p>
        <h1 className="mt-3 max-w-[16ch] text-[clamp(1.9rem,3.6vw,3.4rem)]">Halaman belum dapat dimuat.</h1>
        <p className="mt-4 max-w-[42ch] text-[16px] leading-[1.55] text-ink/80">Coba muat ulang. Daftar usaha Anda tetap aman di perangkat ini.</p>
        <button type="button" onClick={reset} className="btn mt-7">
          Coba lagi
        </button>
      </div>
    </main>
  );
}
