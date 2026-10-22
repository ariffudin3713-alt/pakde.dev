/**
 * Uji lokal API Pasar UMKM.
 *   node scripts/smoke.mjs http://localhost:3111
 */
const base = (process.argv[2] || "http://localhost:3111").replace(/\/$/, "");
let failed = 0;

function check(name, ok, extra) {
  console.log((ok ? "OK   " : "GAGAL ") + name + (extra ? " — " + extra : ""));
  if (!ok) failed += 1;
}

const get = async () => {
  const res = await fetch(base + "/api/umkm");
  return { res, body: await res.json().catch(() => ({})) };
};

/* 1. GET daftar (boleh kosong) */
let { res, body } = await get();
check("GET /api/umkm", res.status === 200 && Array.isArray(body.items), "status " + res.status + ", " + (body.items || []).length + " item");

/* 2. POST usaha valid */
const payload = {
  nama: "Uji Otomatis Toko",
  kategori: "Kuliner",
  kota: "Sleman",
  ikon: "🍜",
  deskripsi: "Usaha uji coba dari smoke test untuk memastikan API menyimpan data dengan benar.",
  wa: "081234567890",
  ig: "ujitoko",
  ownerId: "smoke-owner"
};
const post = await fetch(base + "/api/umkm", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
});
const created = await post.json().catch(() => ({}));
check("POST /api/umkm", post.status === 201 && !!created.item && !!created.item.id, "status " + post.status);

/* 3. GET lagi — data harus ada */
({ res, body } = await get());
const found = body.items && body.items.find((x) => x.id === created.item.id);
check("Data tersimpan & terbaca", !!found, found ? found.nama : "tidak ditemukan");

/* 4. Validasi menolak data tidak lengkap */
const bad = await fetch(base + "/api/umkm", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ nama: "x" })
});
check("Validasi menolak data kurang", bad.status === 400, "status " + bad.status);

/* 5. Hapus usaha milik sendiri */
const del = await fetch(base + "/api/umkm?id=" + encodeURIComponent(created.item.id) + "&owner=" + encodeURIComponent("smoke-owner"), { method: "DELETE" });
check("DELETE /api/umkm", del.status === 200, "status " + del.status);

/* 6. Hapus dengan owner salah harus ditolak */
const delWrong = await fetch(base + "/api/umkm?id=" + encodeURIComponent(created.item.id) + "&owner=lain", { method: "DELETE" });
check("DELETE ditolak untuk owner lain", delWrong.status === 403 || delWrong.status === 404, "status " + delWrong.status);

/* 7. Halaman utama tersedia */
const page = await fetch(base + "/");
const html = await page.text();
check("GET / (halaman utama)", page.status === 200 && html.includes("Pasar UMKM"), "status " + page.status);

console.log(failed ? "\nAda " + failed + " pengujian gagal." : "\nSemua pengujian lolos.");
process.exit(failed ? 1 : 0);
