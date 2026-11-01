import type { Business, Category } from "@/lib/types";

export interface BusinessIllustration {
  src: string;
  width: number;
  height: number;
  alt: string;
  credit: string;
  creditHref: string;
}

/**
 * The seed listings are demo content, so their pictures come from the open
 * collections. They illustrate the kind of business, never the actual owner,
 * and every one of them is credited again in the footer.
 */
const ILLUSTRATIONS: Record<string, BusinessIllustration> = {
  "seed-1": {
    src: "/foto/warung-martabak.jpg",
    width: 1920,
    height: 1280,
    alt: "Ilustrasi warung martabak dengan meja dan peralatan masak di pinggir jalan",
    credit: "Lord Mountbatten, CC BY-SA 3.0",
    creditHref: "https://commons.wikimedia.org/wiki/File:Warung_martabak.JPG",
  },
  "seed-2": {
    src: "/foto/maestro-batik-tulis-di-imogiri.jpg",
    width: 1920,
    height: 1280,
    alt: "Ilustrasi pengrajin batik tulis sedang menggores lilin di kain",
    credit: "Aconkyeah, CC BY-SA 4.0",
    creditHref: "https://commons.wikimedia.org/wiki/File:Maestro_Batik_Tulis_di_Imogiri.jpg",
  },
  "seed-3": {
    src: "/foto/rempah-tradisional-di-pasar.jpg",
    width: 1920,
    height: 2560,
    alt: "Ilustrasi bawang putih dan kunyit segar di atas kain di pasar tradisional",
    credit: "Nela Fatimatun, CC BY 4.0",
    creditHref: "https://commons.wikimedia.org/wiki/File:Rempah_tradisional_di_pasar.jpg",
  },
  "seed-4": {
    src: "/foto/maestro-batik-tulis-di-imogiri.jpg",
    width: 1920,
    height: 1280,
    alt: "Ilustrasi pengrajin batik tulis sedang menggores lilin di kain",
    credit: "Aconkyeah, CC BY-SA 4.0",
    creditHref: "https://commons.wikimedia.org/wiki/File:Maestro_Batik_Tulis_di_Imogiri.jpg",
  },
  "seed-8": {
    src: "/foto/rempah-tradisional-di-pasar.jpg",
    width: 1920,
    height: 2560,
    alt: "Ilustrasi rempah segar yang biasa dipakai meracik jamu tradisional",
    credit: "Nela Fatimatun, CC BY 4.0",
    creditHref: "https://commons.wikimedia.org/wiki/File:Rempah_tradisional_di_pasar.jpg",
  },
  "seed-10": {
    src: "/foto/jukung-pasar-terapung.jpg",
    width: 1920,
    height: 1280,
    alt: "Ilustrasi perahu jukung berjajar di pasar terapung Banjarmasin",
    credit: "Muhammad Haris, CC BY-SA 4.0",
    creditHref: "https://commons.wikimedia.org/wiki/File:Jukung_Pasar_Terapung.jpg",
  },
};

export function getIllustration(business: Business): BusinessIllustration | null {
  return ILLUSTRATIONS[business.id] ?? null;
}

/**
 * The live preview in the registration form needs a picture before the
 * listing exists. Categories with a fitting open photo get one; the rest
 * fall back to the lettered signboard used for new listings.
 */
const CATEGORY_PREVIEWS: Partial<Record<Category, BusinessIllustration>> = {
  Kuliner: ILLUSTRATIONS["seed-1"],
  Fashion: ILLUSTRATIONS["seed-4"],
  Kerajinan: ILLUSTRATIONS["seed-4"],
  Pertanian: ILLUSTRATIONS["seed-3"],
  Kesehatan: ILLUSTRATIONS["seed-8"],
};

export function getCategoryPreview(category: Category): BusinessIllustration | null {
  return CATEGORY_PREVIEWS[category] ?? null;
}
