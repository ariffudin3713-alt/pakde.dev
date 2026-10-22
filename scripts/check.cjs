/**
 * Pemeriksaan cepat untuk proyek Pasar UMKM.
 * Jalankan: npm run check
 */
const { readFileSync, existsSync } = require("node:fs");
const { execFileSync } = require("node:child_process");
const path = require("node:path");

const root = path.join(__dirname, "..");
const problems = [];
const notes = [];

/* 1. Syntax file JavaScript */
const jsFiles = ["js/app.js", "api/umkm.js", "scripts/check.cjs"];
for (const file of jsFiles) {
  const full = path.join(root, file);
  if (!existsSync(full)) { problems.push(`File hilang: ${file}`); continue; }
  try {
    execFileSync(process.execPath, ["--check", full], { stdio: "pipe" });
    notes.push(`syntax ok: ${file}`);
  } catch (err) {
    problems.push(`Syntax error di ${file}: ${err.stderr.toString().split("\n")[2] || err.message}`);
  }
}

/* 2. Karakter asing yang menyusup ke teks */
const isAllowedChar = (cp) =>
  cp < 0x0250 ||
  (cp >= 0x2000 && cp <= 0x33ff) || /* tanda baca, panah, simbol, emoji dasar */
  (cp >= 0x1f000 && cp <= 0x1faff) || /* emoji tambahan & warna skin */
  (cp >= 0xfe00 && cp <= 0xfe0f); /* variation selector */

for (const file of ["index.html", "js/app.js", "api/umkm.js"]) {
  const full = path.join(root, file);
  if (!existsSync(full)) continue;
  const text = readFileSync(full, "utf8");
  const bad = new Set();
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (!isAllowedChar(cp)) bad.add(ch);
  }
  if (bad.size) problems.push(`Karakter asing di ${file}: ${[...bad].join(" ")}`);
}

/* 3. ID yang dipakai JS harus ada di HTML */
const html = readFileSync(path.join(root, "index.html"), "utf8");
const app = readFileSync(path.join(root, "js/app.js"), "utf8");
const ids = new Set();
const idRe = /\$\("#([A-Za-z0-9_-]+)"\)/g;
let m;
while ((m = idRe.exec(app))) ids.add(m[1]);
for (const id of ids) {
  if (!html.includes(`id="${id}"`)) problems.push(`ID tidak ditemukan di index.html: #${id}`);
}
notes.push(`ID diperiksa: ${ids.size}`);

/* 4. Aset dasar */
for (const asset of ["css/style.css", "js/app.js", "api/umkm.js", "index.html", "vercel.json", "package.json"]) {
  if (!existsSync(path.join(root, asset))) problems.push(`Aset hilang: ${asset}`);
}

/* 5. Tag HTML seimbang untuk elemen kunci */
for (const tag of ["html", "head", "body", "main", "header", "footer", "form", "section"]) {
  const open = (html.match(new RegExp(`<${tag}[\\s>]`, "g")) || []).length;
  const close = (html.match(new RegExp(`</${tag}>`, "g")) || []).length;
  if (open !== close) problems.push(`Tag <${tag}> tidak seimbang: ${open} buka / ${close} tutup`);
}

console.log("— pemeriksaan Pasar UMKM —");
notes.forEach((n) => console.log("  · " + n));
if (problems.length) {
  console.error("\nMASALAH:");
  problems.forEach((p) => console.error("  ✗ " + p));
  process.exit(1);
}
console.log("\nSemua pemeriksaan lolos.");
