# Pasar UMKM

Direktori gratis untuk pelaku usaha kecil. Pengunjung bisa mencari, memfilter, lalu menghubungi pelaku usaha lewat WhatsApp — tanpa biaya, tanpa registrasi.

> Halaman statis (HTML/CSS/JS) + satu Vercel Serverless Function untuk menyimpan data usaha.

**Live:** https://pakdedev.vercel.app

---

## Fitur

**Jelajahi**
- Pencarian langsung (nama, produk, kota) dengan penanda kata kunci
- Filter kategori (dengan jumlah usaha per kategori) dan filter kota
- Urutkan: terbaru, terlama, nama A–Z, nama Z–A
- Favorit tersimpan di perangkat, tombol “favorit saya” untuk menyaring
- **Layar lebar:** daftar panjang dengan tombol “muat lebih banyak”
- **Layar kecil:** daftar ber halaman (4/8/12 usaha per halaman) dengan nomor halaman
- Status kosong, skeleton saat memuat, dan auto refresh tiap 30 detik
- Modal detail: deskripsi lengkap, salin nomor, bagikan tautan

**Halaman depan**
- Sapaan hangat, pencarian cepat, dan daftar manfaat singkat
- Kartu obrolan yang berganti isi (simulasi pembeli menghubungi lewat WhatsApp)
- Angka statistik dalam kartu melayang

**Daftarkan usaha**
- Validasi langsung per field dengan pesan error yang jelas
- Pemilih emoji untuk ikon usaha
- Penghitung karakter deskripsi dan pratinjau normalisasi nomor WhatsApp
- **Pratinjau kartu langsung** yang berubah mengikuti isian formulir
- Tombol “Isi data contoh” untuk mencoba formulir
- Section “Usaha saya” untuk melihat dan menghapus usaha yang Anda daftarkan

**Tampilan**
- Mode terang/gelap (mengikuti sistem, bisa diganti manual dan diingat)
- **Navigasi bawah khusus mobile** (Beranda, Jelajahi, Daftar, Favorit) dengan tab aktif
- Tampilan berbeda per ukuran layar: mobile memakai paging + navigasi bawah, desktop memakai daftar panjang + navigasi atas
- Animasi muncul saat digulir, penghitung statistik, toast notifikasi, konfirmasi hapus
- Fokus keyboard, label ARIA, dan dukungan `prefers-reduced-motion`

---

## Struktur

```
.
├── api/umkm.js        # Serverless Function: GET / POST / DELETE data usaha
├── css/style.css      # Seluruh gaya (light/dark, responsif, animasi)
├── js/app.js          # Logika aplikasi (filter, favorit, modal, formulir)
├── index.html         # Halaman utama
├── scripts/check.cjs  # Pemeriksaan cepat: syntax, ID, aset, karakter asing
├── scripts/seed.mjs   # Mengisi data contoh
├── legacy/            # Versi pertama (artifact Claude) yang diarsipkan
└── vercel.json        # Konfigurasi Vercel (header keamanan)
```

---

## Menjalankan secara lokal

```bash
npm install
npx vercel dev --listen 3111
```

Buka http://localhost:3111

> `vercel dev` membutuhkan file `.env.local` berisi `BLOB_READ_WRITE_TOKEN`.
> Jika token tidak tersedia, situs otomatis berjalan dalam **mode lokal**: data disimpan di
> `localStorage` perangkat dan fitur tetap bisa dicoba.

Pemeriksaan cepat:

```bash
npm run check
```

Pengujian otomatis (butuh server berjalan di `http://localhost:3111` atau URL produksi):

```bash
npm run test:api -- http://localhost:3111   # menguji API: simpan, baca, hapus, validasi
npm i --no-save jsdom                        # hanya sekali
npm run test:ui -- http://localhost:3111     # menguji antarmuka di DOM
```

---

## Deploy

```bash
npx vercel --prod
```

Situs statis disajikan langsung, sedangkan `/api/umkm` dijalankan sebagai Serverless Function
(Node.js) dengan runtime bawaan Vercel.

---

## Penyimpanan data

Data usaha disimpan di **Vercel Blob** (store privat `pasar-umkm`) pada file `data/umkm.json`.

- Penulisan memakai *optimistic concurrency control* (ETag + `ifMatch`) sehingga dua
  pendaftaran bersamaan tidak saling menimpa data.
- Penulisan lain akan otomatis mencoba ulang sampai 5 kali.
- Store dibuat lewat:

```bash
npx vercel blob create-store pasar-umkm --access private --yes
```

- Env var `BLOB_READ_WRITE_TOKEN` otomatis ditambahkan ke project Vercel.

---

## API

| Metode | URL | Keterangan |
| --- | --- | --- |
| `GET` | `/api/umkm` | Mengembalikan `{ items, count }` |
| `POST` | `/api/umkm` | Menambah usaha baru, mengembalikan `{ item }` |
| `DELETE` | `/api/umkm?id=<id>&owner=<ownerId>` | Menghapus usaha (hanya pemilik) |

Contoh:

```bash
curl -X POST http://localhost:3111/api/umkm \
  -H "Content-Type: application/json" \
  -d '{"nama":"Warung Bu Sri","kategori":"Kuliner","kota":"Surakarta","ikon":"🍜","deskripsi":"Nasi campur legendaris sejak 1998.","wa":"081234567890","ig":"warungbusri","ownerId":"demo"}'
```

Data contoh siap pakai:

```bash
npm run seed -- http://localhost:3111
```

---

## Environment variable

| Nama | Keterangan |
| --- | --- |
| `BLOB_READ_WRITE_TOKEN` | Token baca/tulis Vercel Blob (dibuat otomatis saat store dihubungkan) |

---

© Pasar UMKM — dibuat untuk mendukung pelaku usaha kecil di Indonesia.
