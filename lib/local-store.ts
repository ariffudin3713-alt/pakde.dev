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

export function getLocalBusinesses(): Business[] {
  const value = read("local-items");
  return Array.isArray(value) ? value.map(parseBusiness).filter((item): item is Business => item !== null) : [];
}

export function saveLocalBusinesses(items: Business[]): void {
  write("local-items", items);
}
