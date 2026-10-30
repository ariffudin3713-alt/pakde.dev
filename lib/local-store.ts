import type { Business } from "@/lib/types";
import { parseBusiness } from "@/lib/validation";

const PREFIX = "pasarumkm:";

function read(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw === null ? null : JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in private browsing or when the quota is full.
  }
}

export function getOwnerId(): string {
  const saved = read("ownerId");
  if (typeof saved === "string" && saved.length > 0) return saved;
  const ownerId = window.crypto?.randomUUID?.() ?? `owner-${Date.now().toString(36)}`;
  write("ownerId", ownerId);
  return ownerId;
}

export function getFavorites(): string[] {
  const value = read("favs");
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function saveFavorites(ids: string[]): void {
  write("favs", ids);
}

const SEED_BUSINESSES: Business[] = [
  {
    id: "seed-1",
    nama: "Martabak Bangka Pak Iim",
    kategori: "Kuliner",
    kota: "Bandung",
    alamat: "Jl. Cihampelas No. 118, depan BIP",
    ikon: "",
    deskripsi: "Martabak manis dan telur dimasak di atas tungku arang, kulit tebal, isi tidak pelit. Antrean biasanya mengular setelah magrib, pesan dulu lewat WhatsApp.",
    wa: "6281220033445",
    ig: "martabak.pakiim",
    jamBuka: "15.00 - 23.00",
    harga: "Rp 25.000 - 65.000",
    ulasan: [],
    rating: 0,
    ownerId: null,
    createdAt: Date.now() - 86400000 * 8,
  },
  {
    id: "seed-2",
    nama: "Batik Tulis Maestro",
    kategori: "Kerajinan",
    kota: "Yogyakarta",
    alamat: "Jl. Tirtodipuran No. 42, Mantrijeron",
    ikon: "",
    deskripsi: "Batik tulis dan cap dari perajin generasi ketiga. Bisa pesan motif sendiri untuk seragam kantor, kain panjang, atau kemeja siap pakai.",
    wa: "6282134455667",
    ig: "batik.maestro",
    jamBuka: "08.00 - 17.00",
    harga: "Rp 185.000 - 1.250.000",
    ulasan: [],
    rating: 0,
    ownerId: null,
    createdAt: Date.now() - 86400000 * 7,
  },
  {
    id: "seed-3",
    nama: "Rempah Nusantara Bu Sri",
    kategori: "Pertanian",
    kota: "Surabaya",
    alamat: "Pasar Keputran Utara, blok A-14",
    ikon: "",
    deskripsi: "Bumbu segar dan rempah kering untuk dapur rumahan: lengkuas, kencur, daun jeruk, cabai rawit, sampai kayu manis. Bisa dibungkus paket per resep.",
    wa: "6282245566778",
    ig: "rempah.busri",
    jamBuka: "05.00 - 12.00",
    harga: "Rp 5.000 - 80.000",
    ulasan: [],
    rating: 0,
    ownerId: null,
    createdAt: Date.now() - 86400000 * 6,
  },
  {
    id: "seed-4",
    nama: "Kopi Bubuk Cikini",
    kategori: "Kuliner",
    kota: "Jakarta",
    alamat: "Jl. Cikini Raya No. 27, Menteng",
    ikon: "",
    deskripsi: "Roastery kecil yang sangrai sendiri biji Gayo, Toraja, dan Kintamani. Menjual bubuk kiloan, drip bag, dan seduhan langsung di tempat.",
    wa: "6281356677889",
    ig: "kopibubuk.cikini",
    jamBuka: "07.00 - 22.00",
    harga: "Rp 35.000 - 145.000",
    ulasan: [],
    rating: 0,
    ownerId: null,
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: "seed-5",
    nama: "Jasa Jahit Bu Tuti",
    kategori: "Jasa",
    kota: "Semarang",
    alamat: "Jl. Pandanaran No. 56, samping apotek",
    ikon: "",
    deskripsi: "Permak celana, ganti resleting, sampai jahit seragam sekolah dan kebaya pesanan. Ukuran dicatat sekali, bisa titip lewat kurir untuk luar kota.",
    wa: "6282467788990",
    ig: "jahit.bututi",
    jamBuka: "09.00 - 18.00",
    harga: "Rp 20.000 - 350.000",
    ulasan: [],
    rating: 0,
    ownerId: null,
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: "seed-6",
    nama: "Dapur Nini Katering",
    kategori: "Kuliner",
    kota: "Makassar",
    alamat: "Jl. Gunung Latimojong No. 9",
    ikon: "",
    deskripsi: "Masakan rumahan harian: coto, konro, ikan bakar, dan paket nasi kotak untuk rapat. Pesanan minimal sehari sebelumnya, antar sekitar kota.",
    wa: "6282578899001",
    ig: "dapur.nini",
    jamBuka: "06.00 - 20.00",
    harga: "Rp 18.000 - 45.000 per porsi",
    ulasan: [],
    rating: 0,
    ownerId: null,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: "seed-7",
    nama: "Sanggar Tari Sekar Arum",
    kategori: "Pendidikan",
    kota: "Denpasar",
    alamat: "Jl. Hayam Wuruk No. 201, Sumerta",
    ikon: "",
    deskripsi: "Kelas tari Bali untuk anak dan remaja, dari dasar sampai pementasan. Satu kelas maksimal sepuluh murid, latihan sore setelah sekolah.",
    wa: "6282689900112",
    ig: "sekararum.sanggar",
    jamBuka: "Senin - Sabtu, 15.00 - 20.00",
    harga: "Rp 150.000 per bulan",
    ulasan: [],
    rating: 0,
    ownerId: null,
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: "seed-8",
    nama: "Klinik Herbal Sido Mukti",
    kategori: "Kesehatan",
    kota: "Surakarta",
    alamat: "Jl. Slamet Riyadi No. 88, Purwosari",
    ikon: "",
    deskripsi: "Racikan jamu tradisional dan konsultasi keluhan ringan. Tersedia kunyit asam siap minum, paket pahitan, serta pijat tradisional dengan terapis berpengalaman.",
    wa: "6282790011223",
    ig: "sidomukti.herbal",
    jamBuka: "07.00 - 21.00",
    harga: "Rp 12.000 - 150.000",
    ulasan: [],
    rating: 0,
    ownerId: null,
    createdAt: Date.now() - 86400000 * 1,
  },
  {
    id: "seed-9",
    nama: "Jukung Pasar Terapung",
    kategori: "Lainnya",
    kota: "Banjarmasin",
    alamat: "Sungai Martapura, dermaga Siring Tendean",
    ikon: "",
    deskripsi: "Perahu kayu milik keluarga yang menjual buah, kue tradisional, dan kopi pagi langsung dari atas jukung. Bisa disewa untuk menyusuri pasar terapung.",
    wa: "6285211223344",
    ig: "jukung.martapura",
    jamBuka: "05.00 - 09.00",
    harga: "Rp 10.000 - 200.000",
    ulasan: [],
    rating: 0,
    ownerId: null,
    createdAt: Date.now(),
  },
];

export function getLocalBusinesses(): Business[] {
  const value = read("local-items");
  if (Array.isArray(value) && value.length > 0) {
    return value.map(parseBusiness).filter((item): item is Business => item !== null);
  }
  const seeded = SEED_BUSINESSES.map((item) => parseBusiness(item)).filter((item): item is Business => item !== null);
  if (seeded.length > 0) {
    write("local-items", seeded);
  }
  return seeded;
}

export function saveLocalBusinesses(items: Business[]): void {
  write("local-items", items);
}
