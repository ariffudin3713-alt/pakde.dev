"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Locale = "id" | "en";

const DICTIONARY: Record<Locale, Record<string, string>> = {
  id: {
    "nav.home": "Beranda",
    "nav.directory": "Jelajahi",
    "nav.approach": "Cara Kerja",
    "nav.list": "Daftarkan Usaha",
    "nav.faq": "FAQ",
    "nav.getStarted": "Mulai",
    "theme.toggleLight": "Aktifkan mode siang",
    "theme.toggleDark": "Aktifkan mode malam",
    "lang.switch": "Ganti bahasa",

    "hero.badge": "Strategic • Lokal • Kekinian",
    "hero.title1": "Bangun Kredibilitas",
    "hero.title2": "Usaha Lokal Kamu",
    "hero.desc": "Direktori UMKM kekinian buat bikin usaha kamu lebih terlihat, lebih dipercaya, dan langsung bisa dihubungi tanpa perantara.",
    "hero.searchPlaceholder": "Cari usaha, produk, atau lokasi...",
    "hero.search": "Cari",
    "hero.free": "Gratis daftar",
    "hero.direct": "Langsung ke WA",
    "hero.trust": "Buat yang pengen dikenal",
    "hero.featured": "Sorotan",
    "hero.cardTitle": "Visibilitas yang bikin beda",
    "hero.cardDesc": "Tampilkan usaha kamu dengan tampilan yang kece biar lebih dipercaya dan disebutin orang.",
    "hero.registered": "Usaha terdaftar",
    "hero.cities": "Kota terwakili",
    "hero.principles": "Nilai kami",
    "hero.transp": "Transparan",
    "hero.transpDesc": "Kontak langsung, info jelas.",
    "hero.pro": "Profesional",
    "hero.proDesc": "Listing kece buat bangun kepercayaan.",
    "hero.acc": "Ramah semua",
    "hero.accDesc": "Mudah dipake Gen Z sampai boomer.",
    "hero.listCta": "Daftarkan usahamu →",

    "stats.business": "Usaha Keren",
    "stats.businessDesc": "Bisa kamu temuin sekarang",
    "stats.cat": "Kategori Hits",
    "stats.catDesc": "Kuliner, thrift, & lainnya",
    "stats.city": "Kota",
    "stats.cityDesc": "Makin luas makin kece",

    "explore.label": "Jelajahi",
    "explore.title": "Jelajahi Usaha Kekinian",
    "explore.desc": "Swipe, cari, chat. Semua ada buat kebutuhan kamu",
    "explore.found": "usaha ditemukan",
    "explore.loading": "Memuat...",
    "explore.loadMore": "Muat lebih banyak",

    "how.label": "Alur",
    "how.title": "Cuma 3 Langkah, Langsung Gas",
    "how.desc": "Mudah dipake buat siapa aja",
    "how.step1Title": "Buat Akun Usaha",
    "how.step1Text": "Isi form singkat, nama usaha, WA, kategori. Selesai dalam hitungan menit.",
    "how.step2Title": "Muncul di Feed",
    "how.step2Text": "Usaha kamu langsung kebaca sama orang-orang yang lagi nyari.",
    "how.step3Title": "Dapetin Orderan",
    "how.step3Text": "Orang langsung chat WA kamu. Gas ngobrol, gas jualan.",

    "reg.label": "Mulai Sekarang",
    "reg.title": "Bergabung & Berkembang Bersama",
    "reg.desc": "Tampilkan keunikan usaha kamu. Dapetin lebih banyak pelanggan tanpa biaya apapun.",
    "reg.free": "100% Gratis",
    "reg.freeDesc": "Tanpa biaya pendaftaran, tanpa biaya bulanan, tanpa komisi",
    "reg.live": "Langsung Tayang",
    "reg.liveDesc": "Usaha kamu langsung bisa dilihat dan dihubungi pembeli",
    "reg.forAll": "Untuk Semua",
    "reg.forAllDesc": "Tampilan kece & ramah buat semua kalangan",
    "reg.mySpace": "Usaha Saya",
    "reg.formTitle": "Daftarkan Usahamu",

    "faq.label": "Q&A",
    "faq.title": "Pasti ada yang kamu tanyain",
    "faq.desc": "Jawaban singkat biar langsung gas",
    "faq.q1": "Beneran gratis?",
    "faq.a1": "Beneran! Gratis daftar, gratis muncul, dan kita nggak ambil komisi dari transaksimu.",
    "faq.q2": "Gimana cara kontaknya?",
    "faq.a2": "Langsung klik tombol 'Chat WhatsApp' di kartu usaha, kamu bakal auto ke chat pemiliknya.",
    "faq.q3": "Bisa hapus usaha sendiri?",
    "faq.a3": "Bisa. Kalo kamu daftar dari device yang sama, bakal muncul di 'Usaha Saya' terus bisa dihapus kapan aja.",
    "faq.q4": "Bisa kasih review?",
    "faq.a4": "Bisa banget. Buka detail usaha, kasih bintang + review singkat buat bantu yang lain.",
    "faq.q5": "Cocok buat semua umur?",
    "faq.a5": "Cocok! Tampilan simpel, warna cerah, bisa dipake semua kalangan.",

    "footer.desc": "Direktori UMKM kekinian. Temuin, kenalan, chat langsung. Biar lokal jadi lebih kece.",
    "footer.nav": "Navigasi",
    "footer.vibe": "Vibe",
    "footer.vibe1": "⚡ Gratis & tanpa komisi",
    "footer.vibe2": "💬 Langsung ke WhatsApp",
    "footer.vibe3": "✨ Buat semua kalangan",
    "footer.vibe4": "🔥 Dukung UMKM lokal",
    "footer.made": "Made with love buat Gen Z & lokal pride",

    "toolbar.searchPlaceholder": "Cari nama, produk, kategori, atau kota",
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
    "toolbar.activeFilter": "Filter aktif",
    "toolbar.searchLabel": "Cari:",
    "toolbar.clearAll": "Hapus semua",

    "card.featured": "⭐ UNGGULAN",
    "card.price": "💰",
    "card.hours": "🕐",
    "card.view": "Lihat Detail",
    "card.review": "ulasan",
    "card.noReview": "Belum ada ulasan",
    "card.chat": "Chat WhatsApp",
    "card.delete": "Hapus",
    "card.sure": "Yakin?",
    "card.yesDelete": "Ya, hapus",
    "card.deleting": "Menghapus…",
    "card.cancel": "Batalkan",
    "card.addFav": "Tambahkan ke favorit",
    "card.remFav": "Hapus dari favorit",
    "card.chatMsg": "Halo, saya melihat usaha Anda di Pasar UMKM.",

    "empty.noResult": "Nggak nemu hasil",
    "empty.noResultDesc": "Coba ubah kata kunci atau filter kamu ya",
    "empty.reset": "Reset filter",
    "empty.noFav": "Belum ada favorit",
    "empty.noFavDesc": "Simpan usaha kesukaanmu biar gampang ketemu lagi",
    "empty.explore": "Jelajahi sekarang",

    "mobile.home": "Beranda",
    "mobile.explore": "Jelajahi",
    "mobile.list": "Daftar",
    "mobile.fav": "Favorit",
  },
  en: {
    "nav.home": "Home",
    "nav.directory": "Explore",
    "nav.approach": "How it works",
    "nav.list": "List your business",
    "nav.faq": "FAQ",
    "nav.getStarted": "Get started",
    "theme.toggleLight": "Switch to light mode",
    "theme.toggleDark": "Switch to dark mode",
    "lang.switch": "Change language",

    "hero.badge": "Strategic • Local • Fresh",
    "hero.title1": "Boost credibility for",
    "hero.title2": "your local business",
    "hero.desc": "A modern UMKM directory to help your business stand out, earn trust, and get discovered with direct WhatsApp contact.",
    "hero.searchPlaceholder": "Search business, product, or location...",
    "hero.search": "Search",
    "hero.free": "Free to list",
    "hero.direct": "Direct to WhatsApp",
    "hero.trust": "Built for visibility",
    "hero.featured": "Spotlight",
    "hero.cardTitle": "Visibility that stands out",
    "hero.cardDesc": "Showcase your business with a clean, modern look to build trust and get more chats.",
    "hero.registered": "Registered businesses",
    "hero.cities": "Cities represented",
    "hero.principles": "Our values",
    "hero.transp": "Transparent",
    "hero.transpDesc": "Direct contact, clear info.",
    "hero.pro": "Professional",
    "hero.proDesc": "Polished listings that build trust.",
    "hero.acc": "Accessible",
    "hero.accDesc": "Easy for everyone to use.",
    "hero.listCta": "List your business →",

    "stats.business": "Great businesses",
    "stats.businessDesc": "Ready to discover",
    "stats.cat": "Trending categories",
    "stats.catDesc": "Food, thrift & more",
    "stats.city": "Cities",
    "stats.cityDesc": "Growing every day",

    "explore.label": "Explore",
    "explore.title": "Discover trending UMKM",
    "explore.desc": "Search, browse, chat. All in one place",
    "explore.found": "businesses found",
    "explore.loading": "Loading...",
    "explore.loadMore": "Load more",

    "how.label": "Flow",
    "how.title": "Just 3 steps to get started",
    "how.desc": "Quick & easy for anyone",
    "how.step1Title": "List your business",
    "how.step1Text": "Fill a short form with name, WA, category. Done in minutes.",
    "how.step2Title": "Get discovered",
    "how.step2Text": "Your business shows up to people actively looking nearby.",
    "how.step3Title": "Get orders",
    "how.step3Text": "They message you directly on WhatsApp. Start selling right away.",

    "reg.label": "Get started",
    "reg.title": "Join & grow together",
    "reg.desc": "Showcase your uniqueness. Get more customers with zero cost.",
    "reg.free": "100% Free",
    "reg.freeDesc": "No signup fee, no monthly fee, no commission",
    "reg.live": "Go live instantly",
    "reg.liveDesc": "Your business is visible and contactable right after submission",
    "reg.forAll": "For everyone",
    "reg.forAllDesc": "Clean, modern UI that works for all ages",
    "reg.mySpace": "My businesses",
    "reg.formTitle": "List your business",

    "faq.label": "Q&A",
    "faq.title": "Frequently asked",
    "faq.desc": "Quick answers to common questions",
    "faq.q1": "Is it really free?",
    "faq.a1": "Yep! Listing is free, always visible, and we take 0% commission.",
    "faq.q2": "How do I contact them?",
    "faq.a2": "Just click 'Chat WhatsApp' on the business card to open a direct chat.",
    "faq.q3": "Can I delete my business?",
    "faq.a3": "Yes. If you registered from the same device, it'll appear under 'My businesses' and you can delete it anytime.",
    "faq.q4": "Can I leave a review?",
    "faq.a4": "Yes! Open the business details and leave a star rating + short review to help others.",
    "faq.q5": "Is it easy for everyone?",
    "faq.a5": "Absolutely. Clean layout, bright colors, designed to be simple for all ages.",

    "footer.desc": "Modern UMKM directory. Discover, connect, chat directly. Make local shine.",
    "footer.nav": "Navigation",
    "footer.vibe": "Vibe",
    "footer.vibe1": "⚡ Free & no commission",
    "footer.vibe2": "💬 Direct to WhatsApp",
    "footer.vibe3": "✨ For everyone",
    "footer.vibe4": "🔥 Support local businesses",
    "footer.made": "Made with love for Gen Z & local pride",

    "toolbar.searchPlaceholder": "Search name, product, category, or city",
    "toolbar.search": "Search business",
    "toolbar.refresh": "Refresh",
    "toolbar.refreshing": "Loading…",
    "toolbar.allCat": "All",
    "toolbar.allCity": "All cities",
    "toolbar.newest": "Newest",
    "toolbar.oldest": "Oldest",
    "toolbar.az": "Name A–Z",
    "toolbar.za": "Name Z–A",
    "toolbar.fav": "Favorites",
    "toolbar.activeFilter": "Active filters",
    "toolbar.searchLabel": "Search:",
    "toolbar.clearAll": "Clear all",

    "card.featured": "⭐ FEATURED",
    "card.price": "💰",
    "card.hours": "🕐",
    "card.view": "View details",
    "card.review": "reviews",
    "card.noReview": "No reviews yet",
    "card.chat": "Chat WhatsApp",
    "card.delete": "Delete",
    "card.sure": "Are you sure?",
    "card.yesDelete": "Yes, delete",
    "card.deleting": "Deleting…",
    "card.cancel": "Cancel",
    "card.addFav": "Add to favorites",
    "card.remFav": "Remove from favorites",
    "card.chatMsg": "Hi, I saw your business on Pasar UMKM.",

    "empty.noResult": "No results found",
    "empty.noResultDesc": "Try adjusting your search or filters",
    "empty.reset": "Reset filters",
    "empty.noFav": "No favorites yet",
    "empty.noFavDesc": "Save businesses you like to find them easily later",
    "empty.explore": "Start exploring",

    "mobile.home": "Home",
    "mobile.explore": "Explore",
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
