/**
 * Mengisi direktori dengan beberapa usaha contoh.
 *
 *   node scripts/seed.mjs http://localhost:3111
 *   node scripts/seed.mjs https://pakde.dev.vercel.app
 */
const base = (process.argv[2] || "http://localhost:3111").replace(/\/$/, "");

const samples = [
  {
    nama: "Warung Bu Sri",
    kategori: "Kuliner",
    kota: "Surakarta",
    ikon: "🍜",
    deskripsi: "Nasi campur dan sate ayam legendaris sejak 1998. Buka setiap hari 07.00-21.00, bisa dipesan untuk acara.",
    wa: "081234567890",
    ig: "warungbusri"
  },
  {
    nama: "Tenun Ikat Puspa",
    kategori: "Kerajinan",
    kota: "Yogyakarta",
    ikon: "🧶",
    deskripsi: "Tenun ikat tangan dengan pewarna alami. Melayani custom motif dan pengiriman ke seluruh Jawa.",
    wa: "081298765432",
    ig: "tenunikatpuspa"
  },
  {
    nama: "Kopi Randu Pak Rendi",
    kategori: "Kuliner",
    kota: "Semarang",
    ikon: "☕",
    deskripsi: "Kopi susu gula aren dan single origin pilihan. Roasting mingguan, siap kirim ke seluruh Indonesia.",
    wa: "085611223344",
    ig: ""
  },
  {
    nama: "Batik Larisan",
    kategori: "Fashion",
    kota: "Solo",
    ikon: "👘",
    deskripsi: "Batik tulis dan cap untuk harian, atasan, dan seragam. Melayani penjahit custom.",
    wa: "081377788899",
    ig: "batiklarisan"
  },
  {
    nama: "Kebun Sayur Sejahtera",
    kategori: "Pertanian",
    kota: "Bandung",
    ikon: "🥬",
    deskripsi: "Sayur segar panen setiap pagi. Pesan antic untuk pengiriman harian ke tetangga.",
    wa: "082112345678",
    ig: "kebunsejahtera"
  },
  {
    nama: "Jasa Tata Rumah Arta",
    kategori: "Jasa",
    kota: "Bandung",
    ikon: "🧹",
    deskripsi: "Jasa bersih rumah, 봉 perbaikan ringan, dan perbaikan kecil. Harga rumah tangga.",
    wa: "081322334455",
    ig: "jasaarta"
  }
];

for (const sample of samples) {
  try {
    const res = await fetch(base + "/api/umkm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.assign({ ownerId: "seed-" + Date.now() }, sample))
    });
    const data = await res.json().catch(() => ({}));
    console.log(res.status === 201 ? "OK  " + sample.nama : "GAGAL " + sample.nama + " - " + (data.error || res.status));
  } catch (err) {
    console.log("GAGAL " + sample.nama + " - " + err.message);
  }
}
