# Pasar UMKM

Direktori usaha lokal Indonesia. Temukan produk dan jasa di sekitar, lalu hubungi pemiliknya langsung tanpa komisi.

## Teknologi

- Next.js App Router dan React
- TypeScript strict mode
- Tailwind CSS v4 dengan token warna terpusat
- Vercel Functions dan Vercel Blob untuk API serta penyimpanan

## Struktur aplikasi

```text
app/                                  # Route, metadata, global styles, loading/error UI
features/directory/                  # Antarmuka fitur direktori
features/directory/components/       # Kartu, filter, form, status, dan navigasi
lib/types.ts                         # Model domain dan kontrak API
lib/directory-api.ts                 # Klien API bertipe
lib/local-store.ts                   # Favorit, pemilik, dan fallback lokal
api/umkm.js                          # Vercel Function untuk data usaha
legacy/static/                       # Arsip frontend HTML lama
```

## Menjalankan lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Untuk menjalankan Next.js bersama Vercel Function dan Blob, gunakan `npm run dev:local` dan siapkan `BLOB_READ_WRITE_TOKEN` di `.env.local`. Jika API tidak aktif, direktori beralih ke penyimpanan lokal pada browser.

## Pemeriksaan dan build

```bash
npm run check
npm run build
```

## Deploy

```bash
npm run deploy
```

Penyimpanan data menggunakan Vercel Blob privat di `data/umkm.json`. API mendukung `GET`, `POST`, `PUT`, dan `DELETE` di `/api/umkm`.

© Pasar UMKM
