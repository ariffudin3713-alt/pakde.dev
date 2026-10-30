import { CATEGORIES, type Business, type Category, type Review } from "@/lib/types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function readNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function readCategory(value: unknown): Category {
  return CATEGORIES.find((category) => category === value) ?? "Lainnya";
}

export function parseReview(value: unknown): Review | null {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.pesan !== "string") return null;
  return {
    id: value.id,
    nama: readString(value.nama, "Pengunjung"),
    pesan: value.pesan,
    bintang: Math.max(1, Math.min(5, readNumber(value.bintang, 5))),
    createdAt: readNumber(value.createdAt, Date.now()),
  };
}

export function parseBusiness(value: unknown): Business | null {
  if (!isRecord(value)) return null;
  if (typeof value.id !== "string" || typeof value.nama !== "string" || typeof value.wa !== "string") return null;

  const reviews = Array.isArray(value.ulasan)
    ? value.ulasan.map(parseReview).filter((review): review is Review => review !== null)
    : [];

  return {
    id: value.id,
    nama: value.nama,
    kategori: readCategory(value.kategori),
    kota: readString(value.kota),
    alamat: readString(value.alamat),
    ikon: readString(value.ikon),
    deskripsi: readString(value.deskripsi),
    wa: value.wa,
    ig: readString(value.ig),
    jamBuka: readString(value.jamBuka),
    harga: readString(value.harga),
    ulasan: reviews,
    rating: readNumber(value.rating),
    ownerId: typeof value.ownerId === "string" ? value.ownerId : null,
    createdAt: readNumber(value.createdAt, Date.now()),
  };
}

export function isRecordValue(value: unknown): value is UnknownRecord {
  return isRecord(value);
}
