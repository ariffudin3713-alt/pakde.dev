export const CATEGORIES = [
  "Kuliner",
  "Fashion",
  "Kerajinan",
  "Jasa",
  "Pertanian",
  "Kesehatan",
  "Pendidikan",
  "Lainnya",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type SortOrder = "terbaru" | "terlama" | "az" | "za";

export interface Review {
  id: string;
  nama: string;
  pesan: string;
  bintang: number;
  createdAt: number;
}

export interface Business {
  id: string;
  nama: string;
  kategori: Category;
  kota: string;
  alamat: string;
  ikon: string;
  deskripsi: string;
  wa: string;
  ig: string;
  jamBuka: string;
  harga: string;
  ulasan: Review[];
  rating: number;
  ownerId: string | null;
  createdAt: number;
}

export interface BusinessInput {
  nama: string;
  kategori: Category;
  kota: string;
  alamat: string;
  ikon: string;
  deskripsi: string;
  wa: string;
  ig: string;
  jamBuka: string;
  harga: string;
  ownerId: string;
}

export interface ReviewInput {
  id: string;
  nama: string;
  pesan: string;
  bintang: number;
}

export interface BusinessResponse {
  item: Business;
}
