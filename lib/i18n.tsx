"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Locale = "id" | "en";

const DICTIONARY: Record<Locale, Record<string, string>> = {
  id: {
    "nav.home": "Beranda",
    "nav.directory": "Direktori",
    "nav.approach": "Cara kerja",
    "nav.list": "Daftar usaha",
    "nav.faq": "Tanya jawab",
    "nav.getStarted": "Daftar gratis",
    "lang.switch": "Ganti bahasa",

    "hero.title1": "Usaha lokal",
    "hero.title2": "di sekitarmu.",
    "hero.desc": "Direktori UMKM gratis. Cari warung, penjahit, pengrajin, atau jasa di kotamu, lalu chat pemiliknya langsung lewat WhatsApp.",
    "hero.searchPlaceholder": "Nama usaha, produk, atau kota",
    "hero.search": "Cari usaha",
    "hero.quick": "Coba",
    "hero.openLine": "usaha buka sekarang",
    "hero.openNow": "Lihat yang buka",
    "hero.clock": "WIB",
    "hero.free": "Gratis didaftarkan",
    "hero.commission": "Tanpa komisi",
    "hero.direct": "Chat langsung",
    "hero.photoCaption": "Rempah di pasar tradisional. Foto: Nela Fatimatun, CC BY 4.0.",
    "hero.ticket1": "Gratis",
    "hero.ticket2": "tanpa komisi",
    "hero.ticket3": "untuk UMKM",

    "stats.title": "Pasar dalam angka.",
    "stats.business": "Usaha terdaftar",
    "stats.businessDesc": "Dan terus bertambah",
    "stats.cat": "Kategori",
    "stats.catDesc": "Kuliner sampai jasa",
    "stats.city": "Kota",
    "stats.cityDesc": "Dari seluruh Indonesia",
    "stats.fee": "Komisi",
    "stats.feeDesc": "Pembeli hubungi langsung",

    "explore.title": "Direktori usaha lokal",
    "explore.desc": "Semua yang terdaftar bisa kamu hubungi langsung. Tidak ada perantara, tidak ada potongan.",
    "explore.found": "usaha",
    "explore.loading": "Memuat",
    "explore.loadMore": "Tampilkan lebih banyak",

    "how.title": "Dari daftar sampai chat.",
    "how.desc": "Tiga langkah, tanpa biaya. Usaha kamu tayang di direktori dan pembeli menghubungi langsung.",
    "how.figLabel": "Alur pendaftaran usaha: daftar, tayang, lalu chat",
    "how.step1Title": "Daftar",
    "how.step1Text": "Isi nama usaha, kategori, kota, dan nomor WhatsApp. Selesai dalam dua menit.",
    "how.step2Title": "Tayang",
    "how.step2Text": "Listing muncul di direktori dan pencarian, lengkap dengan jam buka dan kisaran harga.",
    "how.step3Title": "Chat",
    "how.step3Text": "Pembeli membuka WhatsApp kamu langsung. Tidak ada perantara yang mengambil komisi.",

    "reg.title": "Daftarkan usahamu, gratis.",
    "reg.desc": "Isi formulir di samping. Setelah tersimpan, usahamu langsung muncul di direktori ini.",
    "reg.free": "Gratis, tanpa komisi",
    "reg.freeDesc": "Tidak ada biaya pendaftaran, langganan, atau potongan transaksi.",
    "reg.live": "Langsung tayang",
    "reg.liveDesc": "Begitu disimpan, usahamu bisa ditemukan dan dihubungi.",
    "reg.forAll": "Untuk semua usaha",
    "reg.forAllDesc": "Warung, penjahit, pengrajin, jasa perbaikan, sampai toko online.",
    "reg.mySpace": "Usaha saya",
    "reg.formTitle": "Data usaha",
    "reg.formDesc": "Tulis apa adanya. Pembeli membaca ini sebelum menghubungi kamu.",
    "reg.submit": "Simpan usaha",
    "reg.saving": "Menyimpan…",
    "reg.success": "Usaha kamu sudah masuk direktori.",
    "reg.photoCaption": "Pengrajin batik tulis di Imogiri, Bantul. Foto: Aconkyeah, CC BY-SA 4.0.",

    "faq.title": "Tanya jawab.",
    "faq.desc": "Hal yang paling sering ditanyakan pemilik usaha.",
    "faq.q1": "Beneran gratis?",
    "faq.a1": "Beneran. Tidak ada biaya daftar, biaya bulanan, atau komisi dari transaksi.",
    "faq.q2": "Gimana cara pembeli menghubungi?",
    "faq.a2": "Pembeli menekan tombol Chat WhatsApp di kartu usaha, lalu langsung masuk ke chat kamu.",
    "faq.q3": "Bisa hapus usaha sendiri?",
    "faq.a3": "Bisa. Usaha yang kamu daftarkan dari perangkat ini muncul di bagian Usaha saya, dan bisa dihapus kapan saja.",
    "faq.q4": "Bisa kasih ulasan?",
    "faq.a4": "Bisa. Buka detail usaha, pilih bintang, lalu tulis pengalamanmu. Ulasan membantu pembeli lain.",
    "faq.q5": "Cocok untuk semua jenis usaha?",
    "faq.a5": "Cocok. Kuliner, fashion, kerajinan, jasa, pertanian, kesehatan, pendidikan, dan lainnya.",
    "faq.contact": "Masih ada pertanyaan?",

    "footer.desc": "Direktori UMKM gratis. Temukan usaha lokal, kenali pemiliknya, dan hubungi langsung tanpa perantara.",
    "footer.nav": "Navigasi",
    "footer.cat": "Kategori",
    "footer.about": "Tentang",
    "footer.about1": "Gratis, tanpa komisi",
    "footer.about2": "Kontak langsung WhatsApp",
    "footer.about3": "Untuk semua jenis usaha",
    "footer.made": "Dibuat untuk usaha lokal Indonesia",
    "footer.credits": "Kredit foto:",

    "toolbar.searchPlaceholder": "Cari nama, kategori, atau kota",
    "toolbar.search": "Cari usaha",
    "toolbar.refresh": "Segarkan",
    "toolbar.refreshing": "Memuat…",
    "toolbar.allCat": "Semua",
    "toolbar.allCity": "Semua kota",
    "toolbar.newest": "Terbaru",
    "toolbar.oldest": "Terlama",
    "toolbar.az": "Nama A–Z",
    "toolbar.za": "Nama Z–A",
    "toolbar.fav": "Favorit",
    "toolbar.openNow": "Buka sekarang",
    "toolbar.activeFilter": "Filter aktif",
    "toolbar.searchLabel": "Cari",
    "toolbar.clearAll": "Hapus semua",

    "card.featured": "Baru di pasar",
    "card.price": "Harga",
    "card.hours": "Buka",
    "card.rating": "Rating",
    "card.view": "Lihat detail",
    "card.review": "ulasan",
    "card.noReview": "Belum ada ulasan",
    "card.chat": "Chat WhatsApp",
    "card.delete": "Hapus",
    "card.sure": "Hapus usaha ini?",
    "card.yesDelete": "Ya, hapus",
    "card.deleting": "Menghapus…",
    "card.cancel": "Batal",
    "card.addFav": "Tambahkan ke favorit",
    "card.remFav": "Hapus dari favorit",
    "card.chatMsg": "Halo, saya melihat usaha Anda di Pasar UMKM.",

    "empty.noResult": "Nggak ada hasil",
    "empty.noResultDesc": "Coba kata kunci lain, atau hapus beberapa filter.",
    "empty.reset": "Reset filter",
    "empty.noFav": "Belum ada favorit",
    "empty.noFavDesc": "Simpan usaha yang kamu suka supaya gampang ditemukan lagi.",
    "empty.explore": "Jelajahi direktori",

    "mobile.home": "Beranda",
    "mobile.explore": "Direktori",
    "mobile.list": "Daftar",
    "mobile.fav": "Favorit",
  },
  en: {
    "nav.home": "Home",
    "nav.directory": "Directory",
    "nav.approach": "How it works",
    "nav.list": "List your business",
    "nav.faq": "FAQ",
    "nav.getStarted": "List it free",
    "lang.switch": "Change language",

    "hero.title1": "Local shops",
    "hero.title2": "near you.",
    "hero.desc": "A free directory of Indonesian small businesses. Find a warung, tailor, craftsperson, or service near you, then message the owner directly on WhatsApp.",
    "hero.searchPlaceholder": "Business, product, or city",
    "hero.search": "Search businesses",
    "hero.quick": "Try",
    "hero.openLine": "businesses open now",
    "hero.openNow": "See what's open",
    "hero.clock": "WIB",
    "hero.free": "Free to list",
    "hero.commission": "No commission",
    "hero.direct": "Message directly",
    "hero.photoCaption": "Spices at a traditional market. Photo: Nela Fatimatun, CC BY 4.0.",
    "hero.ticket1": "Free",
    "hero.ticket2": "no commission",
    "hero.ticket3": "for local business",

    "stats.title": "The market in numbers.",
    "stats.business": "Businesses listed",
    "stats.businessDesc": "And still growing",
    "stats.cat": "Categories",
    "stats.catDesc": "Food to services",
    "stats.city": "Cities",
    "stats.cityDesc": "Across Indonesia",
    "stats.fee": "Commission",
    "stats.feeDesc": "Buyers message you directly",

    "explore.title": "The local business directory",
    "explore.desc": "Every listing can be contacted directly. No middlemen, no cut taken.",
    "explore.found": "businesses",
    "explore.loading": "Loading",
    "explore.loadMore": "Show more",

    "how.title": "From listed to messaged.",
    "how.desc": "Three steps, no fees. Your business appears in the directory and buyers reach you directly.",
    "how.figLabel": "Listing flow: register, appear, chat",
    "how.step1Title": "Register",
    "how.step1Text": "Add your business name, category, city, and WhatsApp number. Two minutes.",
    "how.step2Title": "Appear",
    "how.step2Text": "Your listing shows up in the directory and search, with hours and price range.",
    "how.step3Title": "Chat",
    "how.step3Text": "Buyers open your WhatsApp directly. No middleman takes a commission.",

    "reg.title": "List your business, free.",
    "reg.desc": "Fill in the form. Once saved, your business appears in this directory.",
    "reg.free": "Free, no commission",
    "reg.freeDesc": "No signup fee, no subscription, no cut from transactions.",
    "reg.live": "Live right away",
    "reg.liveDesc": "Once saved, your business can be found and contacted.",
    "reg.forAll": "For every kind of business",
    "reg.forAllDesc": "Food stalls, tailors, craftspeople, repair services, online shops.",
    "reg.mySpace": "My businesses",
    "reg.formTitle": "Business details",
    "reg.formDesc": "Write it plainly. Buyers read this before they get in touch.",
    "reg.submit": "Save business",
    "reg.saving": "Saving…",
    "reg.success": "Your business is now in the directory.",
    "reg.photoCaption": "Batik artisan in Imogiri, Bantul. Photo: Aconkyeah, CC BY-SA 4.0.",

    "faq.title": "Questions.",
    "faq.desc": "What business owners ask most.",
    "faq.q1": "Is it really free?",
    "faq.a1": "Yes. No listing fee, no monthly fee, no commission on transactions.",
    "faq.q2": "How do buyers get in touch?",
    "faq.a2": "They press the Chat WhatsApp button on your listing and land straight in your chat.",
    "faq.q3": "Can I delete my business?",
    "faq.a3": "Yes. A business registered from this device appears under My businesses and can be removed anytime.",
    "faq.q4": "Can I leave a review?",
    "faq.a4": "Yes. Open a business, pick a rating, and write about your experience. Reviews help other buyers.",
    "faq.q5": "Does it work for any kind of business?",
    "faq.a5": "Yes. Food, fashion, crafts, services, farming, health, education, and more.",
    "faq.contact": "Still have a question?",

    "footer.desc": "A free directory of Indonesian small businesses. Find a local business, meet the owner, message them directly.",
    "footer.nav": "Navigation",
    "footer.cat": "Categories",
    "footer.about": "About",
    "footer.about1": "Free, no commission",
    "footer.about2": "Direct WhatsApp contact",
    "footer.about3": "For every kind of business",
    "footer.made": "Made for Indonesian local business",
    "footer.credits": "Photo credits:",

    "toolbar.searchPlaceholder": "Search name, category, or city",
    "toolbar.search": "Search businesses",
    "toolbar.refresh": "Refresh",
    "toolbar.refreshing": "Loading…",
    "toolbar.allCat": "All",
    "toolbar.allCity": "All cities",
    "toolbar.newest": "Newest",
    "toolbar.oldest": "Oldest",
    "toolbar.az": "Name A–Z",
    "toolbar.za": "Name Z–A",
    "toolbar.fav": "Favorites",
    "toolbar.openNow": "Open now",
    "toolbar.activeFilter": "Active filters",
    "toolbar.searchLabel": "Search",
    "toolbar.clearAll": "Clear all",

    "card.featured": "New at the market",
    "card.price": "Price",
    "card.hours": "Open",
    "card.rating": "Rating",
    "card.view": "View details",
    "card.review": "reviews",
    "card.noReview": "No reviews yet",
    "card.chat": "Chat WhatsApp",
    "card.delete": "Delete",
    "card.sure": "Delete this business?",
    "card.yesDelete": "Yes, delete",
    "card.deleting": "Deleting…",
    "card.cancel": "Cancel",
    "card.addFav": "Add to favorites",
    "card.remFav": "Remove from favorites",
    "card.chatMsg": "Hi, I saw your business on Pasar UMKM.",

    "empty.noResult": "Nothing found",
    "empty.noResultDesc": "Try another keyword, or clear a few filters.",
    "empty.reset": "Reset filters",
    "empty.noFav": "No favorites yet",
    "empty.noFavDesc": "Save businesses you like so you can find them again.",
    "empty.explore": "Browse the directory",

    "mobile.home": "Home",
    "mobile.explore": "Directory",
    "mobile.list": "List",
    "mobile.fav": "Favorites",
  },
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("id");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved === "id" || saved === "en") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem("locale", l);
      document.documentElement.lang = l;
    } catch {}
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = (key: string) => DICTIONARY[locale][key] ?? key;

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
