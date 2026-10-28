import type {
  ApiErrorResponse,
  Business,
  BusinessInput,
  BusinessListResponse,
  BusinessResponse,
} from "@/lib/types";

const ENDPOINT = "/api/umkm";

async function readJson<T>(response: Response): Promise<T> {
  const payload: unknown = await response.json();
  if (!response.ok) {
    const body = payload as ApiErrorResponse;
    throw new Error(body.error || `Permintaan gagal (${response.status}).`);
  }
  return payload as T;
}

export async function listBusinesses(): Promise<Business[]> {
  const response = await fetch(ENDPOINT, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const data = await readJson<BusinessListResponse>(response);
  return Array.isArray(data.items) ? data.items : [];
}

export async function createBusiness(input: BusinessInput): Promise<Business> {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await readJson<BusinessResponse>(response);
  return data.item;
}

export async function deleteBusiness(id: string, ownerId: string): Promise<void> {
  const params = new URLSearchParams({ id, owner: ownerId });
  const response = await fetch(`${ENDPOINT}?${params.toString()}`, { method: "DELETE" });
  await readJson<{ ok: boolean }>(response);
}
