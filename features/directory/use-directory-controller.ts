"use client";

import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { addBusinessReview, createBusiness, deleteBusiness, listBusinesses } from "@/lib/directory-api";
import { getFavorites, getLocalBusinesses, getOwnerId, saveFavorites, saveLocalBusinesses } from "@/lib/local-store";
import { CATEGORIES, type Business, type BusinessInput, type Category, type ReviewInput, type SortOrder } from "@/lib/types";

export interface DirectoryController {
  businesses: Business[];
  ownerId: string;
  favorites: string[];
  loading: boolean;
  refreshing: boolean;
  offline: boolean;
  notice: string;
  query: string;
  heroQuery: string;
  category: Category | "Semua";
  city: string;
  sort: SortOrder;
  favoritesOnly: boolean;
  visibleCount: number;
  deletingId: string | null;
  toast: string;
  selectedBusiness: Business | null;
  setToast: Dispatch<SetStateAction<string>>;
  setSelectedBusiness: Dispatch<SetStateAction<Business | null>>;
  setHeroQuery: (value: string) => void;
  cities: string[];
  filtered: Business[];
  myBusinesses: Business[];
  categoryCounts: Record<Category, number>;
  loadData: (showSkeleton?: boolean) => Promise<void>;
  clearFilters: () => void;
  changeQuery: (value: string) => void;
  toggleFavorite: (id: string) => void;
  addBusiness: (input: BusinessInput) => Promise<Business>;
  removeBusiness: (business: Business) => Promise<void>;
  submitReview: (input: ReviewInput) => Promise<void>;
  searchFromHero: () => void;
  searchSuggestion: (value: string) => void;
  setCategory: (category: Category | "Semua") => void;
  setCity: (city: string) => void;
  setSort: (sort: SortOrder) => void;
  setFavoritesOnly: (value: boolean) => void;
  showMore: () => void;
}

export function useDirectoryController(): DirectoryController {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [ownerId, setOwnerId] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [offline, setOffline] = useState(false);
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [heroQuery, setHeroQuery] = useState("");
  const [category, setSelectedCategory] = useState<Category | "Semua">("Semua");
  const [city, setSelectedCity] = useState("Semua");
  const [sort, setSort] = useState<SortOrder>("terbaru");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  async function loadData(showSkeleton = false): Promise<void> {
    if (showSkeleton) setLoading(true);
    else setRefreshing(true);
    try {
      const items = await listBusinesses();
      setBusinesses(items);
      setOffline(false);
      setNotice("");
    } catch {
      setBusinesses(getLocalBusinesses());
      setOffline(true);
      setNotice("Server belum tersedia. Direktori berjalan dalam mode lokal dan data baru disimpan di perangkat ini.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    setOwnerId(getOwnerId());
    setFavorites(getFavorites());
    void loadData(true);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (document.querySelector("dialog[open]")) return;
      const target = event.target;
      const editing = target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      if (event.key === "/" && !editing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        document.getElementById("directory-query")?.focus();
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const cities = useMemo(() => Array.from(new Set(businesses.map((item) => item.kota.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b, "id")), [businesses]);
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("id");
    const result = businesses.filter((item) => {
      const matchesQuery = !term || [item.nama, item.kategori, item.kota, item.deskripsi, item.alamat].some((value) => value.toLocaleLowerCase("id").includes(term));
      const matchesCategory = category === "Semua" || item.kategori === category;
      const matchesCity = city === "Semua" || item.kota === city;
      const matchesFavorite = !favoritesOnly || favorites.includes(item.id);
      return matchesQuery && matchesCategory && matchesCity && matchesFavorite;
    });
    return result.sort((a, b) => {
      if (sort === "terlama") return a.createdAt - b.createdAt;
      if (sort === "az") return a.nama.localeCompare(b.nama, "id");
      if (sort === "za") return b.nama.localeCompare(a.nama, "id");
      return b.createdAt - a.createdAt;
    });
  }, [businesses, category, city, favorites, favoritesOnly, query, sort]);

  const myBusinesses = businesses.filter((item) => item.ownerId && item.ownerId === ownerId);
  const categoryCounts = useMemo(() => CATEGORIES.reduce((counts, item) => {
    counts[item] = businesses.filter((business) => business.kategori === item).length;
    return counts;
  }, {} as Record<Category, number>), [businesses]);

  function clearFilters(): void {
    setQuery("");
    setHeroQuery("");
    setSelectedCategory("Semua");
    setSelectedCity("Semua");
    setFavoritesOnly(false);
    setVisibleCount(12);
  }

  function changeQuery(value: string): void {
    setQuery(value);
    setHeroQuery(value);
    setVisibleCount(12);
  }

  function toggleFavorite(id: string): void {
    const next = favorites.includes(id) ? favorites.filter((favorite) => favorite !== id) : [...favorites, id];
    setFavorites(next);
    saveFavorites(next);
  }

  async function addBusiness(input: BusinessInput): Promise<Business> {
    const currentOwnerId = ownerId || getOwnerId();
    if (!ownerId) setOwnerId(currentOwnerId);
    let created: Business;
    if (offline) {
      created = { ...input, ownerId: currentOwnerId, id: `local-${Date.now().toString(36)}`, createdAt: Date.now(), rating: 0, ulasan: [] };
      saveLocalBusinesses([created, ...getLocalBusinesses()]);
    } else {
      created = await createBusiness({ ...input, ownerId: currentOwnerId });
    }
    setBusinesses((current) => [created, ...current.filter((item) => item.id !== created.id)]);
    clearFilters();
    setNotice(offline ? "Usaha disimpan di perangkat ini dan akan tampil dalam mode lokal." : "Usaha Anda berhasil masuk ke direktori.");
    setToast("Usaha berhasil didaftarkan.");
    document.getElementById("jelajahi")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return created;
  }

  async function removeBusiness(business: Business): Promise<void> {
    setDeletingId(business.id);
    try {
      if (offline) {
        saveLocalBusinesses(getLocalBusinesses().filter((item) => item.id !== business.id || item.ownerId !== ownerId));
      } else {
        await deleteBusiness(business.id, ownerId);
      }
      setBusinesses((current) => current.filter((item) => item.id !== business.id));
      setToast("Usaha berhasil dihapus.");
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : "Usaha belum dapat dihapus. Coba lagi.");
    } finally {
      setDeletingId(null);
    }
  }

  async function submitReview(input: ReviewInput): Promise<void> {
    let updated: Business;
    if (offline) {
      const current = businesses.find((item) => item.id === input.id);
      if (!current) throw new Error("Usaha tidak ditemukan.");
      const reviews = [{ ...input, id: `r${Date.now().toString(36)}`, createdAt: Date.now() }, ...(current.ulasan ?? [])].slice(0, 20);
      const rating = Math.round((reviews.reduce((sum, review) => sum + review.bintang, 0) / reviews.length) * 10) / 10;
      updated = { ...current, ulasan: reviews, rating };
      saveLocalBusinesses(getLocalBusinesses().map((item) => item.id === updated.id ? updated : item));
    } else {
      updated = await addBusinessReview(input);
    }
    setBusinesses((current) => current.map((item) => item.id === updated.id ? updated : item));
    setSelectedBusiness(updated);
    setToast("Ulasan berhasil dikirim.");
  }

  function searchFromHero(): void {
    changeQuery(heroQuery);
    document.getElementById("jelajahi")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function searchSuggestion(value: string): void {
    changeQuery(value);
    document.getElementById("jelajahi")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return {
    businesses, ownerId, favorites, loading, refreshing, offline, notice, query, heroQuery, category, city, sort,
    favoritesOnly, visibleCount, deletingId, toast, selectedBusiness, setToast, setSelectedBusiness, setHeroQuery, cities, filtered,
    myBusinesses, categoryCounts, loadData, clearFilters, changeQuery, toggleFavorite, addBusiness, removeBusiness,
    submitReview, searchFromHero, searchSuggestion,
    setCategory: (value) => { setSelectedCategory(value); setVisibleCount(12); },
    setCity: (value) => { setSelectedCity(value); setVisibleCount(12); },
    setSort,
    setFavoritesOnly: (value) => { setFavoritesOnly(value); setVisibleCount(12); },
    showMore: () => setVisibleCount((count) => count + 12),
  };
}
