/**
 * Menghapus usaha uji coba dari direktori.
 *   node scripts/cleanup-test.mjs https://pakdedev.vercel.app
 */
const base = (process.argv[2] || "http://localhost:3111").replace(/\/$/, "");
const pattern = /^(Toko Uji|Uji Otomatis|Contoh Uji)/i;

const res = await fetch(base + "/api/umkm");
const { items } = await res.json();
const targets = items.filter((i) => pattern.test(i.nama || ""));

for (const item of targets) {
  const del = await fetch(base + "/api/umkm?id=" + encodeURIComponent(item.id) + "&owner=" + encodeURIComponent(item.ownerId || ""), { method: "DELETE" });
  console.log((del.status === 200 ? "dihapus  " : "gagal    ") + item.nama + " (" + del.status + ")");
}

const after = await (await fetch(base + "/api/umkm")).json();
console.log("sisa item: " + after.items.length);
after.items.forEach((i) => console.log(" - " + i.nama + " | " + i.kategori + " | " + (i.kota || "-")));
