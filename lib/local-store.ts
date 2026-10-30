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
    nama: "Kopi Lilac",
    kategori: "Kuliner",
    kota: "Jakarta",
    alamat: "Jl. Senopati No. 12",
    ikon: "☕",
    deskripsi: "Kopi spesial dengan suasana pastel yang cozy. Tersedia espresso, cold brew, dan pastry manis.",
    wa: "6281234567890",
    ig: "kopililac",
    jamBuka: "08.00 - 21.00",
    harga: "Rp 15.000 - 40.000",
    ulasan: [],
    rating: 0,
    ownerId: null,
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: "seed-2",
    nama: "Pastel Bloom Bakery",
    kategori: "Kuliner",
    kota: "Bandung",
    alamat: "Jl. Riau No. 45",
    ikon: "🧁",
    deskripsi: "Bakery bertema pastel dengan kue ulang tahun, cupcakes, dan croissant fresh setiap hari.",
    wa: "6282345678901",
    ig: "pastelbloom.bakery",
    jamBuka: "07.00 - 19.00",
    harga: "Rp 12.000 - 150.000",
    ulasan: [],
    rating: 0,
    ownerId: null,
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: "seed-3",
    nama: "Luna Threads",
    kategori: "Fashion",
    kota: "Yogyakarta",
    alamat: "Jl. Malioboro No. 88",
    ikon: "👗",
    deskripsi: "Brand lokal dengan koleksi dress pastel, blouse, dan aksesoris handmade yang kekinian.",
    wa: "6283456789012",
    ig: "lunathreads",
    jamBuka: "09.00 - 21.00",
    harga: "Rp 79.000 - 299.000",
    ulasan: [],
    rating: 0,
    ownerId: null,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: "seed-4",
    nama: "Mimi Craft Studio",
    kategori: "Kerajinan",
    kota: "Surabaya",
    alamat: "Jl. Tunjungan No. 23",
    ikon: "🎀",
    deskripsi: "Kerajinan tangan lilac & cream: clay charm, resin keytag, dan custom gift untuk momen spesial.",
    wa: "6284567890123",
    ig: "mimicraft.studio",
    jamBuka: "10.00 - 18.00",
    harga: "Rp 25.000 - 199.000",
    ulasan: [],
    rating: 0,
    ownerId: null,
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: "seed-5",
    nama: "Glowly Aesthetic",
    kategori: "Kesehatan",
    kota: "Semarang",
    alamat: "Jl. Pandanaran No. 56",
    ikon: "✨",
    deskripsi: "Salon kecantikan dengan layanan facial, lash lift, dan nail art bertema pastel aesthetic.",
    wa: "6285678901234",
    ig: "glowly.aesthetic",
    jamBuka: "09.00 - 17.00",
    harga: "Rp 50.000 - 450.000",
    ulasan: [],
    rating: 0,
    ownerId: null,
    createdAt: Date.now() - 86400000 * 1,
  },
  {
    id: "seed-6",
    nama: "Seruni Florist",
    kategori: "Lainnya",
    kota: "Denpasar",
    alamat: "Jl. Sunset Road No. 77",
    ikon: "💐",
    deskripsi: "Florist spesialis buket pastel, box flower, dan dekorasi untuk ulang tahun & lamaran.",
    wa: "6286789012345",
    ig: "seruniflorist",
    jamBuka: "08.00 - 20.00",
    harga: "Rp 70.000 - 500.000",
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
