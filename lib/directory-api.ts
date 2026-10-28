import type { Business, BusinessInput, ReviewInput } from "@/lib/types";
import { isRecordValue, parseBusiness } from "@/lib/validation";

const ENDPOINT = "/api/umkm";

async function readJson(response: Response): Promise<unknown> {
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error("Server mengirim respons yang tidak valid.");
  }
  if (!response.ok) {
    const message = isRecordValue(payload) && typeof payload.error === "string" ? payload.error : `Permintaan gagal (${response.status}).`;
    throw new Error(message);
  }
  return payload;
}

export async function listBusinesses(): Promise<Business[]> {
  const response = await fetch(ENDPOINT, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const data = await readJson(response);
  if (!isRecordValue(data) || !Array.isArray(data.items)) throw new Error("Format daftar usaha tidak valid.");
  return data.items.map(parseBusiness).filter((item): item is Business => item !== null);
}

export async function createBusiness(input: BusinessInput): Promise<Business> {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return readBusinessResponse(await readJson(response));
}

export async function deleteBusiness(id: string, ownerId: string): Promise<void> {
  const params = new URLSearchParams({ id, owner: ownerId });
  const response = await fetch(`${ENDPOINT}?${params.toString()}`, { method: "DELETE" });
  const data = await readJson(response);
  if (!isRecordValue(data) || data.ok !== true) throw new Error("Server belum mengonfirmasi penghapusan.");
}

export async function addBusinessReview(input: ReviewInput): Promise<Business> {
  const response = await fetch(ENDPOINT, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return readBusinessResponse(await readJson(response));
}

function readBusinessResponse(payload: unknown): Business {
  const item = isRecordValue(payload) ? parseBusiness(payload.item) : null;
  if (!item) throw new Error("Format data usaha tidak valid.");
  return item;
}
