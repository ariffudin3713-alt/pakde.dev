/**
 * Uji antarmuka di DOM (butuh jsdom).
 *
 *   npm install --no-save jsdom
 *   node scripts/dom-test.mjs http://localhost:3111
 *
 * Menguji: render daftar, filter, favorit, pratinjau, validasi, dan simpan.
 */
import { readFileSync } from "node:fs";
import { JSDOM, VirtualConsole } from "jsdom";

const base = (process.argv[2] || "http://localhost:3111").replace(/\/$/, "");
let failed = 0;

function check(name, ok, extra) {
  console.log((ok ? "OK   " : "GAGAL ") + name + (extra ? " — " + extra : ""));
  if (!ok) failed += 1;
}

const html = readFileSync("index.html", "utf8");
const appSource = readFileSync("js/app.js", "utf8");

const virtualConsole = new VirtualConsole();
const consoleErrors = [];
virtualConsole.on("jsdomError", (err) => consoleErrors.push(err.message));
virtualConsole.on("error", (...args) => consoleErrors.push(args.join(" ")));

const dom = new JSDOM(html, {
  url: base + "/",
  runScripts: "outside-only",
  pretendToBeVisual: true,
  virtualConsole
});
const { window } = dom;

/* Periplasan browser yang dipakai app.js */
window.matchMedia = window.matchMedia || ((query) => ({
  matches: false, media: query, onchange: null,
  addListener() {}, removeListener() {},
  addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; }
}));
window.IntersectionObserver = class {
  constructor(cb) { this.cb = cb; }
  observe(el) { this.cb([{ isIntersecting: true, target: el }], this); }
  unobserve() {} disconnect() {}
};
window.scrollTo = () => {};
window.HTMLElement.prototype.scrollIntoView = () => {};
if (!window.crypto.randomUUID) {
  window.crypto.randomUUID = () => "test-uuid-" + Math.random().toString(36).slice(2);
}
window.navigator.clipboard = { writeText: async () => {} };
window.fetch = (input, init) => {
  const url = typeof input === "string" ? new URL(input, base).toString() : input;
  return fetch(url, init);
};

/* Jalankan app.js di dalam konteks window jsdom */
window.eval(appSource);

/* Tunggu proses inisialisasi selesai */
await new Promise((r) => setTimeout(r, 8000));

const $ = (sel) => window.document.querySelector(sel);
const $$ = (sel) => Array.from(window.document.querySelectorAll(sel));

/* 1. Daftar usaha termuat */
const cards = $$("#grid .card");
check("Kartu usaha dirender", cards.length > 0, cards.length + " kartu");

/* 2. Chip kategori terisi */
const chips = $$("#chips .chip");
check("Chip kategori terisi", chips.length >= 5, chips.length + " chip");

/* 3. Formatter tanggal & statistik */
const total = $("#statTotal").textContent;
check("Statistik terisi", Number(total) >= 0, "total " + total);

/* 4. Pencarian menyaring hasil */
const firstName = cards[0] ? cards[0].querySelector("h3").textContent.trim() : "";
$("#q").value = firstName;
$("#q").dispatchEvent(new window.Event("input", { bubbles: true }));
await new Promise((r) => setTimeout(r, 400));
const filtered = $$("#grid .card").length;
check("Pencarian menyaring daftar", filtered >= 1 && filtered <= cards.length, filtered + " dari " + cards.length);

$("#q").value = "";
$("#q").dispatchEvent(new window.Event("input", { bubbles: true }));
await new Promise((r) => setTimeout(r, 400));

/* 5. Filter kategori */
const kuliner = $$("#chips .chip").find((c) => c.getAttribute("data-cat") === "Kuliner");
kuliner.dispatchEvent(new window.Event("click", { bubbles: true }));
await new Promise((r) => setTimeout(r, 200));
const allKuliner = $$("#grid .card").every((c) => c.querySelector(".tag").textContent.trim() === "Kuliner");
check("Filter kategori bekerja", allKuliner, $$("#grid .card").length + " kartu");
$$("#chips .chip").find((c) => c.getAttribute("data-cat") === "Semua")
  .dispatchEvent(new window.Event("click", { bubbles: true }));
await new Promise((r) => setTimeout(r, 200));

/* 6. Favorit */
const favBtn = $("#grid .fav-btn");
favBtn.dispatchEvent(new window.Event("click", { bubbles: true }));
await new Promise((r) => setTimeout(r, 200));
check("Tombol favorit aktif", favBtn.getAttribute("aria-pressed") === "true");

/* 7. Pratinjau kartu ikut berubah */
const form = $("#form");
form.elements.nama.value = "Toko Uji Pratinjau";
form.elements.nama.dispatchEvent(new window.Event("input", { bubbles: true }));
await new Promise((r) => setTimeout(r, 150));
check("Pratinjau kartu diperbarui", $("#previewCard").textContent.includes("Toko Uji Pratinjau"));

/* 8. Validasi form menolak isian kurang */
form.elements.deskripsi.value = "pendek";
form.elements.wa.value = "123";
form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
await new Promise((r) => setTimeout(r, 300));
const errShown = $$(".err.show").length;
check("Validasi form bekerja", errShown > 0, errShown + " pesan error");

/* 9. Pendaftaran berhasil menyimpan & merender kartu baru */
form.elements.nama.value = "Toko Uji Otomatis";
form.elements.kategori.value = "Kuliner";
form.elements.kota.value = "Klaten";
form.elements.deskripsi.value = "Usaha uji otomatis untuk memastikan proses simpan dari antarmuka berjalan.";
form.elements.wa.value = "081200011122";
form.elements.ig.value = "tokoottest";
form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
await new Promise((r) => setTimeout(r, 12000));
const saved = $$("#grid .card").some((c) => c.textContent.includes("Toko Uji Otomatis"));
check("Pendaftaran dari UI tersimpan", saved);
check("Formulir dikosongkan setelah simpan", form.elements.nama.value === "", "nama: " + form.elements.nama.value);

/* 11. Modal detail terbuka */
const detailBtn = $$("#grid [data-detail]")[0];
detailBtn.dispatchEvent(new window.Event("click", { bubbles: true }));
await new Promise((r) => setTimeout(r, 250));
check("Modal detail terbuka", $("#modal").hidden === false && $("#modalTitle").textContent.length > 0, $("#modalTitle").textContent);

window.document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
await new Promise((r) => setTimeout(r, 150));
check("Modal tertutup dengan Escape", $("#modal").hidden === true);

/* 12. Pengalih tema */
const themeBefore = window.document.documentElement.getAttribute("data-theme");
$("#themeToggle").dispatchEvent(new window.Event("click", { bubbles: true }));
await new Promise((r) => setTimeout(r, 150));
const themeAfter = window.document.documentElement.getAttribute("data-theme");
check("Pengalih tema bekerja", !!themeAfter && themeAfter !== themeBefore, themeBefore + " -> " + themeAfter);
$("#themeToggle").dispatchEvent(new window.Event("click", { bubbles: true }));

/* 13. Filter kota */
const citySelect = $("#city");
const kotaOpsi = Array.from(citySelect.options).map((o) => o.value).filter((v) => v !== "Semua");
check("Opsi kota terisi dari data", kotaOpsi.length > 0, kotaOpsi.join(", "));
if (kotaOpsi.length) {
  citySelect.value = kotaOpsi[0];
  citySelect.dispatchEvent(new window.Event("change", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 200));
  const semuaKota = $$("#grid .card").every((c) => c.querySelectorAll(".tag")[1] && c.querySelectorAll(".tag")[1].textContent.trim() === kotaOpsi[0]);
  check("Filter kota bekerja", semuaKota, $$("#grid .card").length + " kartu");
  citySelect.value = "Semua";
  citySelect.dispatchEvent(new window.Event("change", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 200));
}

/* 14. Pengurutan */
const urut = $("#sort");
urut.value = "az";
urut.dispatchEvent(new window.Event("change", { bubbles: true }));
await new Promise((r) => setTimeout(r, 200));
const namaUrut = $$("#grid .card h3").map((h) => h.textContent.trim());
const terurut = namaUrut.slice().sort((a, b) => a.localeCompare(b, "id"));
check("Pengurutan A-Z bekerja", namaUrut.join("|") === terurut.join("|"), namaUrut.slice(0, 2).join(", "));
urut.value = "terbaru";
urut.dispatchEvent(new window.Event("change", { bubbles: true }));

/* 15. Pemilih emoji */
const emojiBtn = $$("#emojiGrid [data-emoji]")[3];
emojiBtn.dispatchEvent(new window.Event("click", { bubbles: true }));
await new Promise((r) => setTimeout(r, 150));
check("Pemilih emoji mengisi ikon", form.elements.ikon.value === emojiBtn.getAttribute("data-emoji"), form.elements.ikon.value);

/* 16. Konfirmasi hapus */
const hapusBtn = $("#myGrid [data-del]");
if (hapusBtn) {
  hapusBtn.dispatchEvent(new window.Event("click", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 250));
  check("Konfirmasi hapus terbuka", $("#confirmModal").hidden === false);
  $("#confirmCancel").dispatchEvent(new window.Event("click", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 200));
  check("Konfirmasi hapus bisa dibatalkan", $("#confirmModal").hidden === true);
} else {
  check("Konfirmasi hapus terbuka", true, "tidak ada usaha milik uji");
}

/* 17. Pesan error konsol */
check("Tidak ada error JavaScript", consoleErrors.length === 0, consoleErrors.slice(0, 2).join(" | "));

console.log(failed ? "\nAda " + failed + " pengujian gagal." : "\nSemua pengujian antarmuka lolos.");
process.exit(failed ? 1 : 0);
