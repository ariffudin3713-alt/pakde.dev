/**
 * API data Pasar UMKM — Vercel Serverless Function (Node.js).
 *
 * Penyimpanan: Vercel Blob (store privat) dengan optimistic concurrency
 * control (ETag / ifMatch).
 *
 *   GET    /api/umkm            → daftar usaha
 *   POST   /api/umkm            → tambah usaha baru
 *   PUT    /api/umkm            → tambah ulasan
 *   DELETE /api/umkm?id=&owner= → hapus usaha (pemilik saja)
 */
import { get, head, put } from "@vercel/blob";

const DATA_PATH = "data/umkm.json";
const MAX_ITEMS = 500;
const MAX_ATTEMPTS = 5;

const CATS = new Set(["Kuliner", "Fashion", "Kerajinan", "Jasa", "Pertanian", "Kesehatan", "Pendidikan", "Lainnya"]);

/* ---------- utilitas ---------- */
function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function text(value, max) {
  return String(value == null ? "" : value)
    .replace(/[\u0000-\u001f]/g, " ")
    .trim()
    .slice(0, max);
}

function waDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function newId() {
  return "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function errorInfo(err) {
  return {
    name: String((err && err.name) || "").toLowerCase(),
    code: String((err && err.code) || "").toLowerCase(),
    message: String((err && err.message) || "").toLowerCase()
  };
}

function isNotFoundError(err) {
  const { name, code, message } = errorInfo(err);
  return (
    name.includes("notfound") ||
    code.includes("not_found") ||
    message.includes("does not exist") ||
    message.includes("not found")
  );
}

function isPreconditionError(err) {
  const { name, code, message } = errorInfo(err);
  return (
    name.includes("precondition") ||
    code.includes("precondition") ||
    code.includes("already_exists") ||
    message.includes("etag mismatch") ||
    message.includes("already exists") ||
    message.includes("precondition failed")
  );
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ---------- baca / tulis blob ---------- */
async function readStore() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  try {
    const meta = await head(DATA_PATH, { token });
    const res = await get(DATA_PATH, { access: "private", token, useCache: false });
    if (res.statusCode !== 200 || !res.stream) return { items: [], etag: null };
    const body = await new Response(res.stream).text();
    let parsed = {};
    try { parsed = JSON.parse(body); } catch { parsed = {}; }
    const items = Array.isArray(parsed.items) ? parsed.items : [];
    return { items, etag: meta.etag || null };
  } catch (err) {
    if (isNotFoundError(err)) return { items: [], etag: null };
    throw err;
  }
}

async function writeStore(items, etag) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const body = JSON.stringify({ items, updatedAt: Date.now() }, null, 2);
  const options = {
    access: "private",
    token,
    contentType: "application/json",
    addRandomSuffix: false
  };
  if (etag) {
    options.ifMatch = etag;
    options.allowOverwrite = true;
  } else {
    options.allowOverwrite = false;
  }
  await put(DATA_PATH, body, options);
}

/* Ubah data dengan optimistic concurrency control. */
async function mutate(mutator) {
  let lastError = null;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const { items, etag } = await readStore();
    const next = await mutator(items);
    try {
      await writeStore(next.items, etag);
      return next.result;
    } catch (err) {
      if (!isPreconditionError(err)) throw err;
      lastError = err;
      await sleep(60 * (attempt + 1));
    }
  }
  throw lastError || new Error("Gagal menyimpan data.");
}

/* ---------- validasi ---------- */
function sanitizeInput(body) {
  const errors = {};
  const nama = text(body.nama, 80);
  const kategori = CATS.has(body.kategori) ? body.kategori : "Lainnya";
  const kota = text(body.kota, 80);
  const alamat = text(body.alamat, 200);
  const deskripsi = text(body.deskripsi, 500);
  const wa = waDigits(body.wa);
  const ig = text(body.ig, 40).replace(/^@+/, "").replace(/[^A-Za-z0-9._]/g, "");
  const jamBuka = text(body.jamBuka, 60);
  const harga = text(body.harga, 40);
  let ikon = text(body.ikon, 8);
  ikon = Array.from(ikon).slice(0, 4).join("") || "🏪";

  if (nama.length < 2) errors.nama = "Nama usaha wajib diisi (minimal 2 huruf).";
  if (deskripsi.length < 10) errors.deskripsi = "Deskripsi minimal 10 karakter.";
  if (wa.length < 9 || wa.length > 20) errors.wa = "Nomor WhatsApp belum valid.";

  return {
    errors,
    item: { nama, kategori, kota, alamat, deskripsi, wa, ig, ikon, jamBuka, harga }
  };
}

/* ---------- handler ---------- */
export default async function handler(req, res) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return json(res, 503, { error: "Penyimpanan belum dikonfigurasi. Jalankan: vercel blob create-store ..." });
  }

  try {
    if (req.method === "GET") {
      const { items } = await readStore();
      const sorted = items
        .slice()
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        .map((item) => ({
          id: item.id,
          nama: item.nama,
          kategori: item.kategori,
          kota: item.kota,
          alamat: item.alamat || "",
          ikon: item.ikon,
          deskripsi: item.deskripsi,
          wa: item.wa,
          ig: item.ig,
          jamBuka: item.jamBuka || "",
          harga: item.harga || "",
          ulasan: Array.isArray(item.ulasan) ? item.ulasan : [],
          rating: item.rating || 0,
          ownerId: item.ownerId,
          createdAt: item.createdAt
        }));
      return json(res, 200, { items: sorted, count: sorted.length });
    }

    if (req.method === "POST") {
      let body = {};
      if (typeof req.body === "string") {
        try { body = JSON.parse(req.body || "{}"); } catch { body = {}; }
      } else if (req.body && typeof req.body === "object") {
        body = req.body;
      }

      // Honeypot: bot mengisi field tersembunyi.
      if (body.website) return json(res, 202, { ok: true });

      const { errors, item } = sanitizeInput(body);
      if (Object.keys(errors).length) return json(res, 400, { error: "Data belum lengkap.", errors });

      const ownerId = text(body.ownerId, 64) || "anon";
      const created = Object.assign({ id: newId(), ownerId, createdAt: Date.now(), ulasan: [], rating: 0 }, item);

      await mutate((items) => ({
        items: [created].concat(items).slice(0, MAX_ITEMS),
        result: created
      }));

      return json(res, 201, { item: created });
    }

    if (req.method === "PUT") {
      let body = {};
      if (typeof req.body === "string") {
        try { body = JSON.parse(req.body || "{}"); } catch { body = {}; }
      } else if (req.body && typeof req.body === "object") {
        body = req.body;
      }

      const id = text(body.id, 64);
      if (!id) return json(res, 400, { error: "ID usaha wajib diisi." });

      const nama = text(body.nama, 40) || "Pengunjung";
      const pesan = text(body.pesan, 200);
      const bintang = Math.max(1, Math.min(5, Number(body.bintang) || 5));

      if (pesan.length < 3) return json(res, 400, { error: "Ulasan minimal 3 karakter." });

      let resultItem = null;
      await mutate((items) => {
        const idx = items.findIndex((x) => x.id === id);
        if (idx === -1) return { items, result: null };
        const ulasan = Array.isArray(items[idx].ulasan) ? items[idx].ulasan : [];
        const review = { id: "r" + Date.now().toString(36), nama, pesan, bintang, createdAt: Date.now() };
        ulasan.unshift(review);
        if (ulasan.length > 20) ulasan.length = 20;
        const total = ulasan.reduce((s, r) => s + (Number(r.bintang) || 0), 0);
        const rating = Math.round((total / ulasan.length) * 10) / 10;
        items[idx].ulasan = ulasan;
        items[idx].rating = rating;
        resultItem = items[idx];
        return { items, result: items[idx] };
      });

      if (!resultItem) return json(res, 404, { error: "Usaha tidak ditemukan." });
      return json(res, 201, { item: resultItem });
    }

    if (req.method === "DELETE") {
      const id = text(req.query.id, 64);
      const owner = text(req.query.owner, 64);
      if (!id) return json(res, 400, { error: "Parameter id wajib diisi." });

      let removed = null;
      await mutate((items) => {
        const target = items.find((x) => x.id === id);
        if (!target) return { items, result: null };
        if (target.ownerId !== owner) {
          const err = new Error("Anda hanya bisa menghapus usaha Anda sendiri.");
          err.status = 403;
          throw err;
        }
        removed = target;
        return { items: items.filter((x) => x.id !== id), result: target };
      });

      if (!removed) return json(res, 404, { error: "Usaha tidak ditemukan." });
      return json(res, 200, { ok: true, removed: removed.id });
    }

    res.setHeader("Allow", "GET, POST, PUT, DELETE");
    return json(res, 405, { error: "Metode tidak diizinkan." });
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    const message = err && err.message ? err.message : "Terjadi kesalahan di server.";
    console.error("[api/umkm]", status, message, err && err.stack ? err.stack.split("\n").slice(0, 4).join(" | ") : "");
    return json(res, status, { error: status === 500 ? "Gagal memproses data. Coba lagi." : message });
  }
}
