import type { Business } from "@/lib/types";

const PREFIX = "pasarumkm:";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
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
  const saved = read<string | null>("ownerId", null);
  if (saved) return saved;
  const ownerId = window.crypto?.randomUUID?.() ?? `owner-${Date.now().toString(36)}`;
  write("ownerId", ownerId);
  return ownerId;
}

export function getFavorites(): string[] {
  return read<string[]>("favs", []);
}

export function saveFavorites(ids: string[]): void {
  write("favs", ids);
}

export function getLocalBusinesses(): Business[] {
  return read<Business[]>("local-items", []);
}

export function saveLocalBusinesses(items: Business[]): void {
  write("local-items", items);
}
