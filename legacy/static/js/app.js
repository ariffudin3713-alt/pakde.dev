
   /* =========================================================
   Pasar UMKM — application logic
   Struktur:
   1. Utilitas      5. Filter & pencarian
   2. State         6. Interaksi kartu (favorit, salin, hapus, detail)
   3. API (+ fallback lokal)
   4. Render        7. Formulir pendaftaran
   8. Chrome halaman (tema, nav, modal, reveal, counters)
   ========================================================= */

/* ---------- 1. Utilitas ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function esc(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function debounce(fn, wait = 180) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

/* Hormati preferensi pengguna yang tidak nyaman dengan animasi. */
function prefersReduced() {
  try { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
  catch (e) { return false; }
}

function scrollMode() {
  return prefersReduced() ? "auto" : "smooth";
}

const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem("pasarumkm:" + key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem("pasarumkm:" + key, JSON.stringify(value)); } catch (e) {}
  }
};

function toast(message, type = "") {
  const box = $("#toasts");
  if (!box) return;
  const el = document.createElement("div");
  el.className = "toast" + (type ? " " + type : "");
  el.textContent = message;
  box.appendChild(el);
  setTimeout(() => {
    el.classList.add("out");
    setTimeout(() => el.remove(), 260);
  }, 3000);
}

function waNumber(phone) {
  let d = String(phone || "").replace(/\D/g, "");
  if (d.startsWith("0")) d = "62" + d.slice(1);
  else if (d.startsWith("8")) d = "62" + d;
  return d;
}

function waLink(item, customMessage) {
  const msg = customMessage || `Halo ${item.nama || ""}, saya melihat usaha Anda di Pasar UMKM.`;
  return `https://wa.me/${waNumber(item.wa)}?text=${encodeURIComponent(msg)}`;
}

function igLink(handle) {
  return "https://instagram.com/" + encodeURIComponent(String(handle || "").replace(/^@+/, ""));
}

function formatDate(ts) {
  if (!ts) return "";
  try {
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(ts));
  } catch (e) { return ""; }
}

function timeAgo(ts) {
  if (!ts) return "belum";
  const diff = Math.max(0, Date.now() - ts);
  const s = Math.floor(diff / 1000);
  if (s < 10) return "baru saja";
  if (s < 60) return s + " detik lalu";
  const m = Math.floor(s / 60);
  if (m < 60) return m + " menit lalu";
  const h = Math.floor(m / 60);
  if (h < 24) return h + " jam lalu";
  return Math.floor(h / 24) + " hari lalu";
}

function hl(text, term) {
  const raw = String(text == null ? "" : text);
  if (!term) return esc(raw);
  const lower = raw.toLowerCase();
  const t = term.toLowerCase();
  let out = "", i = 0;
  for (;;) {
    const idx = lower.indexOf(t, i);
    if (idx === -1) { out += esc(raw.slice(i)); break; }
    out += esc(raw.slice(i, idx)) + "<mark>" + esc(raw.slice(idx, idx + t.length)) + "</mark>";
    i = idx + t.length;
  }
  return out;
}

/* ---------- 2. State ---------- */
const CATS = ["Semua", "Kuliner", "Fashion", "Kerajinan", "Jasa", "Pertanian", "Kesehatan", "Pendidikan", "Lainnya"];
function normalizeCategory(value) {
  const key = String(value || "").trim().toLowerCase();
  return CATS.slice(1).find((category) => category.toLowerCase() === key) || "Lainnya";
}
function normalizeCity(value) {
  return String(value || "").trim().normalize("NFC").toLowerCase();
}
const EMOJIS = ["🍜", "☕", "🍰", "🥘", "🍡", "🍚", "🍛", "🥟", "🍫", "🧋", "🧵", "👘", "🧶", "🎨", "🪵", "🧺", "💻", "🔧", "🧹", "🌾", "🥬", "🍯", "🐟", "🐔", "🧀", "🛍️", "📦", "🧴", "🪑", "🏪", "⚡", "💼", "🎓", "🩺", "🎁"];

/* Layar kecil memakai tampilan ber halaman, layar besar memakai daftar panjang. */
const MOBILE_QUERY = "(max-width: 760px)";
function isMobile() {
  try { return !!(window.matchMedia && window.matchMedia(MOBILE_QUERY).matches); }
  catch (e) { return false; }
}

const state = {
  items: [],
  cat: "Semua",
  query: "",
  city: "Semua",
  sort: "terbaru",
  onlyFavs: false,
  page: 1,          /* halaman aktif (mode halaman / mobile) */
  loaded: 12,       /* jumlah item yang sudah dimuat (mode desktop) */
  perPage: 12,
  mobilePerPage: 4,
  loading: true,
  offline: false,
  lastSync: 0,
  ownerId: store.get("ownerId", null) || createOwnerId(),
  favs: store.get("favs", [])
};

function resetPaging() {
  state.page = 1;
  state.loaded = state.perPage;
}

function createOwnerId() {
  const id = (crypto && crypto.randomUUID)
    ? crypto.randomUUID()
    : "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  store.set("ownerId", id);
  return id;
}

/* ---------- 3. API (+ fallback lokal) ---------- */
const API_URL = "/api/umkm";
const LOCAL_KEY = "local-items";

const api = {
  async list() {
    const res = await fetch(API_URL, { headers: { Accept: "application/json" }, cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    return Array.isArray(data.items) ? data.items : [];
  },
  async create(payload) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "HTTP " + res.status);
    return data.item;
  },
  async remove(id, ownerId) {
    const res = await fetch(API_URL + "?id=" + encodeURIComponent(id) + "&owner=" + encodeURIComponent(ownerId), {
      method: "DELETE"
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "HTTP " + res.status);
    return true;
  }
};

/* Mode lokal: dipakai bila API tidak tersedia (mis. dibuka dari file lokal). */
const local = {
  all() { return store.get(LOCAL_KEY, []); },
  save(list) { store.set(LOCAL_KEY, list); },
  add(item) {
    const list = local.all();
    list.push(item);
    local.save(list);
    return item;
  },
  remove(id, ownerId) {
    const list = local.all().filter((x) => !(x.id === id && x.ownerId === ownerId));
    local.save(list);
  }
};

async function loadItems(silent = false) {
  if (!silent) {
    state.loading = true;
    renderGrid();
  }
  try {
    state.items = await api.list();
    state.offline = false;
    if (noticeEl) noticeEl.hidden = true;
  } catch (err) {
    state.items = local.all();
    state.offline = true;
    if (!silent) showNotice("warn", "Server belum aktif, jadi pasar sedang berjalan dalam mode lokal. Data Anda disimpan di perangkat ini sampai server siap.");
  }
  state.loading = false;
  state.lastSync = Date.now();
  renderAll();
}

/* ---------- 4. Render ---------- */
const grid = $("#grid");
const myGrid = $("#myGrid");
const chipsEl = $("#chips");
const qInput = $("#q");
const citySelect = $("#city");
const sortSelect = $("#sort");
const favToggle = $("#favToggle");
const resultInfo = $("#resultInfo");
const moreBtn = $("#moreBtn");
const pager = $("#pager");
const noticeEl = $("#notice");

function showNotice(type, message) {
  if (!noticeEl) return;
  noticeEl.className = "notice " + type;
  noticeEl.innerHTML = esc(message);
  noticeEl.hidden = false;
}

function filteredItems() {
  const term = state.query.trim().toLowerCase();
  let list = state.items.filter((item) => {
    const catOk = state.cat === "Semua" || normalizeCategory(item.kategori) === state.cat;
    const cityOk = state.city === "Semua" || normalizeCity(item.kota) === normalizeCity(state.city);
    const favOk = !state.onlyFavs || state.favs.includes(item.id);
    const hay = [item.nama, item.deskripsi, item.kota, item.kategori, item.harga].join(" ").toLowerCase();
    const termOk = !term || hay.indexOf(term) !== -1;
    return catOk && cityOk && favOk && termOk;
  });

  list.sort((a, b) => {
    if (state.sort === "az") return String(a.nama || "").localeCompare(String(b.nama || ""), "id");
    if (state.sort === "za") return String(b.nama || "").localeCompare(String(a.nama || ""), "id");
    if (state.sort === "terlama") return (a.createdAt || 0) - (b.createdAt || 0);
    return (b.createdAt || 0) - (a.createdAt || 0);
  });
  return list;
}

function cardTemplate(item, term, options = {}) {
  const isMine = item.ownerId && item.ownerId === state.ownerId;
  const isFav = state.favs.includes(item.id);
  const name = esc(item.nama || "usaha ini");
  const preview = !!options.preview; /* pratinjau: tampilan saja, bukan tombol aktif */

  const ig = item.ig
    ? (preview
      ? `<span class="mini muted" aria-hidden="true">Instagram</span>`
      : `<a class="mini muted" href="${esc(igLink(item.ig))}" target="_blank" rel="noopener" aria-label="Buka Instagram ${name}">Instagram</a>`)
    : "";
  const wa = item.wa
    ? (preview
      ? `<span class="mini solid" aria-hidden="true">WhatsApp</span>`
      : `<a class="mini solid" href="${esc(waLink(item))}" target="_blank" rel="noopener" aria-label="Hubungi ${name} melalui WhatsApp">WhatsApp</a>`)
    : `<span class="mini solid" aria-disabled="true">WhatsApp</span>`;
  const copy = preview
    ? `<span class="mini muted" aria-hidden="true">Salin nomor</span>`
    : `<button type="button" class="mini muted" data-copy="${esc(item.wa || "")}" aria-label="Salin nomor WhatsApp ${name}">Salin nomor</button>`;
  const detail = preview
    ? `<span class="mini muted" aria-hidden="true">Detail</span>`
    : `<button type="button" class="mini muted" data-detail="${esc(item.id)}" aria-label="Lihat detail ${name}">Detail</button>`;
  const fav = preview
    ? `<span class="fav-btn preview-only" aria-hidden="true">
        <span class="fav-icon">${isFav ? "♥" : "♡"}</span>
        <span class="fav-text">Favorit</span>
      </span>`
    : `<button type="button" class="fav-btn" data-fav="${esc(item.id)}" aria-pressed="${isFav}"
        aria-label="Favorit ${name}">
        <span class="fav-icon" aria-hidden="true">${isFav ? "♥" : "♡"}</span>
        <span class="fav-text" aria-hidden="true">Favorit</span>
      </button>`;
  const del = (isMine && options.allowDelete !== false && !preview)
    ? `<button type="button" class="mini danger" data-del="${esc(item.id)}" aria-label="Hapus ${name} dari direktori">Hapus</button>` : "";

  const category = normalizeCategory(item.kategori);
  return `<article class="card" data-id="${esc(item.id)}" data-cat="${esc(category)}">
    <div class="card-top">
      <div class="ico" aria-hidden="true">${esc(item.ikon || "🏪")}</div>
      ${fav}
    </div>
    <span class="local-story-badge"><span aria-hidden="true">✿</span> Dari usaha lokal</span>
    <div class="tags">
      <span class="tag">${esc(category)}</span>
      ${item.kota ? `<span class="tag alt">${esc(item.kota)}</span>` : ""}
    </div>
    <h3>${hl(item.nama, term)}</h3>
    <p>${hl(item.deskripsi, term)}</p>
    <div class="actions">
      ${wa}
      ${ig}
      ${copy}
      ${detail}
      ${del}
    </div>
  </article>`;
}

function skeletonTemplate() {
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += `<div class="skeleton">
      <div class="sk-line tall"></div>
      <div class="sk-line w-40"></div>
      <div class="sk-line w-90"></div>
      <div class="sk-line w-70"></div>
    </div>`;
  }
  return out;
}

function renderChips() {
  const counts = {};
  state.items.forEach((i) => {
    const category = normalizeCategory(i.kategori);
    counts[category] = (counts[category] || 0) + 1;
  });
  chipsEl.innerHTML = CATS.map((c) => {
    const n = c === "Semua" ? state.items.length : (counts[c] || 0);
    const label = c === "Semua" ? `Semua kategori, ${n} usaha` : `${c}, ${n} usaha`;
    return `<button type="button" class="chip" data-cat="${esc(c)}" aria-pressed="${c === state.cat}" aria-label="${esc(label)}">
      ${esc(c)} <span class="count">${n}</span></button>`;
  }).join("");
}

function renderCityOptions() {
  const cityByKey = new Map();
  state.items.forEach((item) => {
    const city = String(item.kota || "").trim().normalize("NFC");
    const key = normalizeCity(city);
    if (key && !cityByKey.has(key)) cityByKey.set(key, city);
  });
  const cities = Array.from(cityByKey.values()).sort((a, b) => a.localeCompare(b, "id"));
  const current = state.city;
  citySelect.innerHTML = `<option value="Semua">Semua kota</option>` +
    cities.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join("");
  citySelect.value = cities.find((city) => normalizeCity(city) === normalizeCity(current)) || "Semua";
  state.city = citySelect.value;
}

function renderGrid() {
  const list = filteredItems();
  const mobile = isMobile();
  const per = mobile ? state.mobilePerPage : state.perPage;
  const total = list.length;
  const pageCount = Math.max(1, Math.ceil(total / per));
  const current = Math.min(Math.max(1, state.page), pageCount);
  const shown = mobile ? list.slice((current - 1) * per, current * per) : list.slice(0, state.loaded);
  const suffix = (state.onlyFavs ? " (favorit saja)" : "") +
    (state.query.trim() ? ` untuk “${esc(state.query.trim())}”` : "");

  if (state.loading) {
    grid.innerHTML = skeletonTemplate();
    grid.setAttribute("aria-busy", "true");
    resultInfo.innerHTML = "Memuat daftar usaha…";
    moreBtn.hidden = true;
    renderPager(per, 1, 1);
    return;
  }
  grid.setAttribute("aria-busy", "false");

  if (state.items.length === 0) {
    grid.innerHTML = `<div class="empty">
      <span class="empty-ico" aria-hidden="true">🏪</span>
      <strong>Yuk, jadi tetangga pertama di pasar ini!</strong>
      Ceritakan usaha Anda agar lebih banyak orang bisa mengenal dan mendukungnya.
      <br><a class="btn" href="#daftar">Mulai kenalkan usaha</a>
    </div>`;
    resultInfo.innerHTML = "Belum ada usaha terdaftar.";
    moreBtn.hidden = true;
    renderPager(per, 1, 1);
    return;
  }

  if (list.length === 0) {
    grid.innerHTML = `<div class="empty">
      <span class="empty-ico" aria-hidden="true">🔍</span>
      <strong>Belum ketemu yang dicari?</strong>
      Coba kata lain atau lihat semua usaha. Bisa jadi ada kejutan menarik di sana.
      <br><button type="button" class="btn ghost" data-reset>Lihat semua usaha</button>
    </div>`;
    resultInfo.innerHTML = `Tidak ada hasil untuk filter aktif.`;
    moreBtn.hidden = true;
    renderPager(per, 1, 1);
    return;
  }

  const term = state.query.trim();
  grid.innerHTML = shown.map((item) => cardTemplate(item, term)).join("");
  resultInfo.innerHTML = mobile
    ? `Halaman <b>${current}</b> dari <b>${pageCount}</b> · <b>${total}</b> usaha${suffix}`
    : `Menampilkan <b>${shown.length}</b> dari <b>${total}</b> usaha${suffix}`;
  moreBtn.hidden = mobile || shown.length >= total;
  renderPager(per, pageCount, current);
}

/* Navigasi halaman — dipakai di layar kecil */
function pageNumbers(current, pageCount) {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const keep = [1, pageCount, current, current - 1, current + 1]
    .filter((n) => n >= 1 && n <= pageCount)
    .sort((a, b) => a - b);
  const out = [];
  keep.forEach((n, i) => {
    if (i > 0 && n - keep[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}

function renderPager(per, pageCount, current) {
  if (!pager) return;
  if (!isMobile() || pageCount <= 1) {
    pager.hidden = true;
    pager.innerHTML = "";
    return;
  }
  pager.hidden = false;
  const parts = [
    `<button type="button" data-page="${current - 1}" ${current === 1 ? "disabled" : ""} aria-label="Halaman sebelumnya">‹</button>`
  ];
  pageNumbers(current, pageCount).forEach((n) => {
    if (n === "…") parts.push(`<span class="pager-gap" aria-hidden="true">…</span>`);
    else parts.push(`<button type="button" data-page="${n}" ${n === current ? 'aria-current="page"' : ""}>${n}</button>`);
  });
  parts.push(`<button type="button" data-page="${current + 1}" ${current === pageCount ? "disabled" : ""} aria-label="Halaman berikutnya">›</button>`);
  pager.innerHTML = parts.join("");
}

function renderMyList() {
  const mine = state.items.filter((i) => i.ownerId && i.ownerId === state.ownerId);
  $("#myListWrap").hidden = mine.length === 0;
  $("#myCount").textContent = mine.length;
  myGrid.innerHTML = mine.map((item) => cardTemplate(item, "")).join("");
}

function renderStats() {
  const cats = new Set(state.items.map((i) => normalizeCategory(i.kategori)));
  const cities = new Set(state.items.map((i) => normalizeCity(i.kota)).filter(Boolean));
  animateCounter($("#statTotal"), state.items.length);
  animateCounter($("#statCats"), cats.size);
  animateCounter($("#statCities"), cities.size);
  const liveNum = $("#liveCountNum");
  if (liveNum) {
    liveNum.textContent = state.items.length || 0;
  }
}

$("#stats").addEventListener("click", (e) => {
  const action = e.target.closest("[data-stat-action]");
  if (!action) return;
  const target = action.getAttribute("data-stat-action");
  document.querySelector("#jelajahi").scrollIntoView({ behavior: scrollMode(), block: "start" });
  if (target === "businesses") {
    state.cat = "Semua";
    state.city = "Semua";
    state.onlyFavs = false;
    citySelect.value = "Semua";
    favToggle.setAttribute("aria-pressed", "false");
    resetPaging();
    renderChips();
    renderGrid();
  } else if (target === "categories") {
    chipsEl.querySelector("[data-cat='Semua']")?.focus();
  } else if (target === "locations") {
    citySelect.focus();
  }
});

function renderAll() {
  renderChips();
  renderCityOptions();
  renderGrid();
  renderMyList();
  renderStats();
  renderUpdated();
}

function renderUpdated() {
  const el = $("#updatedAt");
  if (!el) return;
  el.textContent = state.lastSync ? "Diperbarui " + timeAgo(state.lastSync) : "";
  el.title = state.lastSync ? new Date(state.lastSync).toLocaleString("id-ID") : "";
}

/* ---------- 5. Filter & pencarian ---------- */
chipsEl.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-cat]");
  if (!btn) return;
  state.cat = btn.getAttribute("data-cat");
  resetPaging();
  renderChips();
  renderGrid();
});

qInput.addEventListener("input", debounce(() => {
  state.query = qInput.value;
  resetPaging();
  $("#clearSearch").hidden = !qInput.value;
  renderGrid();
}, 160));

$("#clearSearch").addEventListener("click", () => {
  qInput.value = "";
  state.query = "";
  resetPaging();
  $("#clearSearch").hidden = true;
  renderGrid();
  qInput.focus();
});

citySelect.addEventListener("change", () => {
  state.city = citySelect.value;
  resetPaging();
  renderGrid();
});

sortSelect.addEventListener("change", () => {
  state.sort = sortSelect.value;
  resetPaging();
  renderGrid();
});

favToggle.addEventListener("click", () => {
  state.onlyFavs = !state.onlyFavs;
  syncFavToggle();
  resetPaging();
  renderGrid();
  toast(state.onlyFavs ? "Menampilkan usaha favorit saja." : "Menampilkan semua usaha.");
});

/* Tombol "muat lebih banyak" hanya dipakai di layar lebar */
moreBtn.addEventListener("click", () => {
  state.loaded += state.perPage;
  renderGrid();
});

/* Jumlah usaha per halaman (layar kecil) */
$("#perPage").addEventListener("change", (e) => {
  const value = Number(e.target.value);
  if (!value) return;
  state.mobilePerPage = value;
  state.page = 1;
  renderGrid();
});

/* Navigasi halaman */
if (pager) {
  pager.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-page]");
    if (!btn || btn.disabled) return;
    const target = Number(btn.getAttribute("data-page"));
    if (!target || target < 1) return;
    state.page = target;
    renderGrid();
    const top = grid.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top: Math.max(0, top), behavior: scrollMode() });
  });
}

$("#refreshBtn").addEventListener("click", async () => {
  const btn = $("#refreshBtn");
  btn.disabled = true;
  await loadItems(true);
  btn.disabled = false;
  if (state.offline) {
    showNotice("warn", "Server belum aktif, jadi pasar sedang berjalan dalam mode lokal. Data Anda disimpan di perangkat ini sampai server siap.");
    toast("Server belum aktif. Menampilkan data lokal.", "err");
  } else {
    toast("Daftar diperbarui.", "ok");
  }
});

grid.addEventListener("click", (e) => {
  if (e.target.closest("[data-reset]")) {
    state.query = ""; state.cat = "Semua"; state.city = "Semua"; state.onlyFavs = false;
    qInput.value = "";
    syncFavToggle();
    resetPaging();
    renderChips(); renderCityOptions(); renderGrid();
    return;
  }
  const delBtn = e.target.closest("[data-del]");
  if (delBtn) {
    e.stopPropagation();
    const id = delBtn.getAttribute("data-del");
    const item = state.items.find((x) => x.id === id);
    openConfirm("Hapus usaha ini?", `"${(item && item.nama) || "Usaha"}" akan dihapus dari direktori publik.`, async () => {
      try {
        if (state.offline) local.remove(id, state.ownerId);
        else await api.remove(id, state.ownerId);
        state.items = state.items.filter((x) => x.id !== id);
        renderAll();
        toast("Usaha sudah dihapus.", "ok");
      } catch (err) {
        toast(err.message || "Gagal menghapus. Coba lagi.", "err");
      }
    });
    return;
  }
  const favBtn = e.target.closest("[data-fav]");
  if (favBtn) {
    e.stopPropagation();
    toggleFav(favBtn.getAttribute("data-fav"));
    return;
  }
  const copyBtn = e.target.closest("[data-copy]");
  if (copyBtn) {
    e.stopPropagation();
    copyText(copyBtn.getAttribute("data-copy"));
    return;
  }
  const detailBtn = e.target.closest("[data-detail]");
  if (detailBtn) {
    e.stopPropagation();
    openDetail(detailBtn.getAttribute("data-detail"));
  }
});

myGrid.addEventListener("click", (e) => {
  const delBtn = e.target.closest("[data-del]");
  if (delBtn) {
    const id = delBtn.getAttribute("data-del");
    const item = state.items.find((x) => x.id === id);
    openConfirm("Hapus usaha ini?", `"${(item && item.nama) || "Usaha"}" akan dihapus dari direktori publik.`, async () => {
      try {
        if (state.offline) local.remove(id, state.ownerId);
        else await api.remove(id, state.ownerId);
        state.items = state.items.filter((x) => x.id !== id);
        renderAll();
        toast("Usaha sudah dihapus.", "ok");
      } catch (err) {
        toast(err.message || "Gagal menghapus. Coba lagi.", "err");
      }
    });
    return;
  }
  const favBtn = e.target.closest("[data-fav]");
  if (favBtn) { toggleFav(favBtn.getAttribute("data-fav")); return; }
  const copyBtn = e.target.closest("[data-copy]");
  if (copyBtn) { copyText(copyBtn.getAttribute("data-copy")); return; }
  const detailBtn = e.target.closest("[data-detail]");
  if (detailBtn) openDetail(detailBtn.getAttribute("data-detail"));
});

function toggleFav(id) {
  const idx = state.favs.indexOf(id);
  if (idx === -1) {
    state.favs.push(id);
    toast("Ditambahkan ke favorit.", "ok");
  } else {
    state.favs.splice(idx, 1);
    toast("Dihapus dari favorit.");
  }
  store.set("favs", state.favs);

  $$(`[data-fav="${cssEscape(id)}"]`).forEach((btn) => {
    const isFav = state.favs.includes(id);
    btn.setAttribute("aria-pressed", String(isFav));
    const icon = btn.querySelector(".fav-icon");
    if (icon) icon.textContent = isFav ? "♥" : "♡";
  });
  if (state.onlyFavs) renderGrid();
  renderMyList();
}

function syncFavToggle() {
  const pressed = String(state.onlyFavs);
  if (favToggle) favToggle.setAttribute("aria-pressed", pressed);
  const mobileFav = $("#mobileNav [data-fav]");
  if (mobileFav) mobileFav.setAttribute("aria-pressed", pressed);
}

function cssEscape(value) {
  if (window.CSS && typeof window.CSS.escape === "function") return window.CSS.escape(value);
  return String(value).replace(/["\\]/g, "\\$&");
}

async function copyText(text) {
  const value = String(text || "").trim();
  if (!value) { toast("Nomor tidak tersedia.", "err"); return; }
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
    } else {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    toast("Nomor disalin: " + value, "ok");
  } catch (e) {
    toast("Tidak bisa menyalin otomatis. Nomor: " + value, "err");
  }
}

/* ---------- 6. Modal detail ---------- */
const modal = $("#modal");
const confirmModal = $("#confirmModal");
let lastFocused = null;
let currentStars = 5;

const starPicker = document.getElementById("starPicker");
function setStars(value) {
  currentStars = Math.min(5, Math.max(1, Number(value) || 5));
  if (!starPicker) return;
  $$("button[data-star]", starPicker).forEach((btn) => {
    const active = Number(btn.getAttribute("data-star")) <= currentStars;
    btn.setAttribute("aria-pressed", String(active));
    btn.classList.toggle("active", active);
  });
}
if (starPicker) {
  starPicker.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-star]");
    if (!btn) return;
    setStars(Number(btn.getAttribute("data-star")));
  });
  setStars(5);
}

const reviewMsgEl = document.getElementById("reviewMsg");
if (reviewMsgEl) {
  reviewMsgEl.addEventListener("input", () => {
    const hint = document.getElementById("reviewHint");
    if (reviewMsgEl.value.trim().length >= 3) {
      reviewMsgEl.removeAttribute("aria-invalid");
      if (hint) hint.textContent = "";
    }
  });
}

const submitReview = document.getElementById("submitReview");
if (submitReview) {
  submitReview.addEventListener("click", async () => {
    const id = modal.dataset.currentId;
    if (!id) return;
    const nameEl = document.getElementById("reviewName");
    const msgEl = document.getElementById("reviewMsg");
    const hint = document.getElementById("reviewHint");
    const nama = nameEl.value;
    const pesan = msgEl.value;
    if (pesan.trim().length < 3) {
      hint.textContent = "Ulasan minimal 3 karakter. Tulis sedikitnya satu kalimat singkat.";
      msgEl.setAttribute("aria-invalid", "true");
      msgEl.focus();
      return;
    }
    msgEl.removeAttribute("aria-invalid");
    hint.textContent = "Mengirim ulasan…";
    submitReview.disabled = true;
    const originalLabel = submitReview.textContent;
    submitReview.textContent = "Mengirim…";
    try {
      const res = await fetch("/api/umkm", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, nama, pesan, bintang: currentStars })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Gagal mengirim ulasan");
      const item = state.items.find((x) => x.id === id);
      if (item) {
        item.ulasan = (data.item && data.item.ulasan) || item.ulasan;
        item.rating = (data.item && data.item.rating) || item.rating;
        renderDetail(item);
      }
      nameEl.value = "";
      msgEl.value = "";
      setStars(5);
      hint.textContent = "Ulasan berhasil dikirim. Terima kasih!";
      toast("Ulasan berhasil dikirim. Terima kasih!", "ok");
    } catch (err) {
      hint.textContent = err.message || "Ulasan gagal dikirim. Periksa koneksi lalu coba lagi.";
    } finally {
      submitReview.disabled = false;
      submitReview.textContent = originalLabel;
    }
  });
}

/* Fokus terkunci di dalam modal, latar belakang tidak bisa diakses. */
let activeModal = null;

function getFocusable(el) {
  return $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', el);
}

function setPageInert(on) {
  ["header.top", "main", "footer.footer", "#mobileNav", "#toTop"].forEach((sel) => {
    const el = $(sel);
    if (!el) return;
    if (on) el.setAttribute("inert", "");
    else el.removeAttribute("inert");
  });
}

function openModal(el) {
  if (!el) return;
  lastFocused = document.activeElement;
  activeModal = el;
  el.hidden = false;
  document.body.classList.add("modal-open");
  document.body.style.overflow = "hidden";
  setPageInert(true);

  const target = el.querySelector("[data-autofocus]") ||
    el.querySelector("h3, h2, h4") ||
    getFocusable(el)[0] || el;
  if (target && !target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  if (target && target.focus) {
    setTimeout(() => {
      try { target.focus(); } catch (e) { /* abaikan */ }
    }, 30);
  }
}

function closeModal(el) {
  if (!el || el.hidden) return;
  el.hidden = true;
  if (el === activeModal) {
    activeModal = null;
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    setPageInert(false);
  }
  if (lastFocused && document.contains(lastFocused) && lastFocused.focus) {
    try { lastFocused.focus(); } catch (e) { /* abaikan */ }
  }
}

function renderReviews(item) {
  const reviewList = document.getElementById("reviewList");
  const reviewCount = document.getElementById("reviewCount");
  if (!reviewList || !reviewCount) return;
  const ulasan = Array.isArray(item.ulasan) ? item.ulasan : [];
  reviewCount.textContent = ulasan.length + " ulasan";
  if (ulasan.length === 0) {
    reviewList.innerHTML = '<p class="hint">Belum ada ulasan. Jadilah yang pertama memberi penilaian.</p>';
    return;
  }
  reviewList.innerHTML = ulasan.map((r) => {
    const bintang = Math.max(1, Math.min(5, Number(r.bintang) || 5));
    return `<div class="review-item">
      <div class="review-top">
        <span class="review-name">${esc(r.nama || "Pengunjung")}</span>
        <span class="review-stars" aria-label="Penilaian ${bintang} dari 5 bintang">
          <span aria-hidden="true">${"★".repeat(bintang)}${"☆".repeat(5 - bintang)}</span>
        </span>
      </div>
      <p class="review-text">${esc(r.pesan)}</p>
    </div>`;
  }).join("");
}

function renderDetail(item) {
  const isFav = state.favs.includes(item.id);
  const ig = item.ig ? `<a class="btn ghost" href="${esc(igLink(item.ig))}" target="_blank" rel="noopener">Buka Instagram</a>` : "";
  const rating = Number(item.rating) || 0;
  const rounded = Math.max(0, Math.min(5, Math.round(rating)));
  const stars = rating ? "★".repeat(rounded) + "☆".repeat(5 - rounded) : "Belum ada rating";
  const phone = item.wa ? "+" + esc(waNumber(item.wa)) : "Belum diisi";

  $("#modalBody").innerHTML = `
    <div class="detail-head" data-cat="${esc(normalizeCategory(item.kategori))}">
      <div class="ico" aria-hidden="true">${esc(item.ikon || "🏪")}</div>
      <div>
        <h3 id="modalTitle" tabindex="-1">${esc(item.nama)}</h3>
        <div class="tags">
          <span class="tag">${esc(normalizeCategory(item.kategori))}</span>
          ${item.kota ? `<span class="tag alt">${esc(item.kota)}</span>` : ""}
          <span class="tag alt" aria-label="Penilaian ${esc(String(rating || "belum ada"))} dari 5">${esc(stars)}${rating ? " " + esc(String(rating)) : ""}</span>
        </div>
      </div>
    </div>
    <p class="detail-desc" id="modalDesc">${esc(item.deskripsi)}</p>
    <section class="seller-story" aria-labelledby="sellerStoryTitle">
      <div class="seller-avatar" aria-hidden="true">${esc(item.ikon || "🏪")}</div>
      <div class="seller-story-copy">
        <p class="seller-eyebrow">Cerita dari usaha lokal</p>
        <h4 id="sellerStoryTitle">Kenalan dengan ${esc(item.nama)}</h4>
        <p>${esc(item.deskripsi)}</p>
        ${item.kota ? `<span class="seller-place"><span aria-hidden="true">⌖</span> Berasal dari ${esc(item.kota)}</span>` : ""}
      </div>
    </section>
    <div class="detail-meta">
      ${item.alamat ? `<div><b>Alamat</b><span>${esc(item.alamat)}</span></div>` : ""}
      ${item.kota ? `<div><b>Lokasi</b><span>${esc(item.kota)}</span></div>` : ""}
      ${item.jamBuka ? `<div><b>Jam buka</b><span>${esc(item.jamBuka)}</span></div>` : ""}
      ${item.harga ? `<div><b>Kisaran harga</b><span>${esc(item.harga)}</span></div>` : ""}
      <div><b>WhatsApp</b><span>${phone}</span></div>
      ${item.ig ? `<div><b>Instagram</b><span>@${esc(item.ig)}</span></div>` : ""}
      <div><b>Terdaftar</b><span>${esc(formatDate(item.createdAt))}</span></div>
    </div>
    <div class="order-box">
      <label for="orderQty">Jumlah pesanan</label>
      <input id="orderQty" type="number" min="1" max="99" value="1" inputmode="numeric" aria-label="Jumlah pesanan">
      <p class="hint">Pesan akan berisi nama usaha, jumlah, dan kisaran harga bila tersedia.</p>
    </div>
    <div class="detail-actions">
      <a class="btn" data-order-wa="${esc(item.id)}" href="${esc(waLink(item, orderMessage(item, 1)))}" target="_blank" rel="noopener">Beli via WhatsApp</a>
      ${ig}
      <button type="button" class="btn ghost" data-modal-copy="${esc(item.wa || "")}">Salin nomor</button>
      <button type="button" class="btn ghost" data-modal-fav="${esc(item.id)}" aria-pressed="${isFav}">${isFav ? "Hapus dari favorit" : "Simpan ke favorit"}</button>
      <button type="button" class="btn ghost" data-modal-share="${esc(item.id)}">Bagikan</button>
    </div>`;

  renderReviews(item);
  modal.dataset.currentId = item.id;
}

function orderMessage(item, quantity) {
  return `Halo ${item.nama || ""}, saya ingin memesan:\n\nNama usaha/produk: ${item.nama || ""}\nJumlah: ${quantity} ${Number(quantity) === 1 ? "buah/porsi" : "buah/porsi"}${item.harga ? `\nKisaran harga: ${item.harga}` : ""}\n\nSaya melihat usaha Anda di Pasar UMKM.`;
}

$("#modalBody").addEventListener("input", (e) => {
  if (e.target.id !== "orderQty") return;
  const link = $("[data-order-wa]", $("#modalBody"));
  if (!link) return;
  const item = state.items.find((x) => x.id === link.getAttribute("data-order-wa"));
  const quantity = Math.max(1, Math.min(99, Number.parseInt(e.target.value, 10) || 1));
  e.target.value = quantity;
  if (item) link.href = waLink(item, orderMessage(item, quantity));
});

function openDetail(id) {
  const item = state.items.find((x) => x.id === id);
  if (!item) return;
  const wasHidden = modal.hidden;
  renderDetail(item);

  if (wasHidden) {
    $("#reviewName").value = "";
    $("#reviewMsg").value = "";
    $("#reviewHint").textContent = "";
    setStars(5);
    openModal(modal);
  } else {
    const title = document.getElementById("modalTitle");
    if (title && title.focus) {
      try { title.focus(); } catch (e) { /* abaikan */ }
    }
  }
}

$("#modalBody").addEventListener("click", (e) => {
  const copy = e.target.closest("[data-modal-copy]");
  if (copy) { copyText(copy.getAttribute("data-modal-copy")); return; }
  const fav = e.target.closest("[data-modal-fav]");
  if (fav) {
    toggleFav(fav.getAttribute("data-modal-fav"));
    openDetail(fav.getAttribute("data-modal-fav"));
    return;
  }
  const share = e.target.closest("[data-modal-share]");
  if (share) { shareItem(share.getAttribute("data-modal-share")); }
});

async function shareItem(id) {
  const item = state.items.find((x) => x.id === id);
  if (!item) return;
  const url = location.origin + location.pathname + "?usaha=" + encodeURIComponent(id);
  const text = `${item.nama} — ${item.kategori}${item.kota ? " · " + item.kota : ""} (Pasar UMKM)`;
  if (navigator.share) {
    try { await navigator.share({ title: text, text, url }); return; } catch (e) { /* dibatalkan pengguna */ }
  }
  copyText(url);
  toast("Tautan disalin ke papan klip.", "ok");
}

function openConfirm(title, message, onConfirm) {
  $("#confirmTitle").textContent = title;
  $("#confirmText").textContent = message;
  const okBtn = $("#confirmOk");
  const cancelBtn = $("#confirmCancel");
  const cleanup = () => {
    okBtn.replaceWith(okBtn.cloneNode(true));
    cancelBtn.replaceWith(cancelBtn.cloneNode(true));
  };
  okBtn.addEventListener("click", async () => {
    cleanup();
    closeModal(confirmModal);
    await onConfirm();
  });
  cancelBtn.addEventListener("click", () => { cleanup(); closeModal(confirmModal); });
  openModal(confirmModal);
}

$$("[data-close]").forEach((el) => el.addEventListener("click", () => closeModal(el.closest(".modal"))));

document.addEventListener("keydown", (e) => {
  if (activeModal) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal(activeModal);
      return;
    }
    if (e.key === "Tab") {
      const focusables = getFocusable(activeModal);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === activeModal)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    return;
  }

  if (e.key === "Escape") {
    closeNav();
    return;
  }
  if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable) {
    e.preventDefault();
    qInput.focus();
    qInput.select();
  }
});

/* ---------- 7. Formulir pendaftaran ---------- */
const form = $("#form");
const submitBtn = $("#submit");
const formHint = $("#formHint");

function setError(name, message) {
  const input = form.elements[name];
  const err = form.querySelector(`[data-err="${name}"]`);
  if (message) {
    if (input) input.setAttribute("aria-invalid", "true");
    if (err) {
      if (!err.id) err.id = "err-" + name;
      err.textContent = message;
      err.classList.add("show");
      if (input) input.setAttribute("aria-errormessage", err.id);
    }
  } else {
    if (input) {
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-errormessage");
    }
    if (err) { err.textContent = ""; err.classList.remove("show"); }
  }
}

function validate(values) {
  const errors = {};
  if (!values.nama || values.nama.length < 2) errors.nama = "Nama usaha wajib diisi (minimal 2 huruf).";
  if (!values.kategori) errors.kategori = "Pilih salah satu kategori.";
  if (!values.deskripsi || values.deskripsi.length < 10) errors.deskripsi = "Deskripsi minimal 10 karakter agar pembeli memahami.";
  const digits = values.wa.replace(/\D/g, "");
  if (digits.length < 9) errors.wa = "Nomor WhatsApp belum valid (minimal 9 angka).";
  if (values.ig && !/^[A-Za-z0-9._]{2,40}$/.test(values.ig)) errors.ig = "Format username Instagram belum benar.";
  if (Array.from(values.ikon || "").length > 4) errors.ikon = "Pakai maksimal 4 karakter emoji.";
  return errors;
}

function formValues() {
  const f = new FormData(form);
  return {
    nama: String(f.get("nama") || "").trim(),
    kategori: String(f.get("kategori") || "Lainnya"),
    kota: String(f.get("kota") || "").trim(),
    alamat: String(f.get("alamat") || "").trim(),
    jamBuka: String(f.get("jamBuka") || "").trim(),
    harga: String(f.get("harga") || "").trim(),
    ikon: String(f.get("ikon") || "").trim() || "🏪",
    deskripsi: String(f.get("deskripsi") || "").trim(),
    wa: String(f.get("wa") || "").trim(),
    ig: String(f.get("ig") || "").trim().replace(/^@+/, "").replace(/\s+/g, ""),
    website: String(f.get("website") || ""),
    ownerId: state.ownerId
  };
}

form.addEventListener("input", (e) => {
  const name = e.target.name;
  if (name && form.querySelector(`[data-err="${name}"]`)) setError(name, "");
  if (name === "deskripsi") $("#descCount").textContent = String(e.target.value || "").length;
  if (name === "wa") updateWaHint(e.target.value);
  if (name === "ikon") syncEmojiSelection();
  renderPreview();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const values = formValues();

  // Honeypot: bot mengisi field tersembunyi.
  if (values.website) {
    toast("Pendaftaran terkirim.", "ok");
    form.reset();
    return;
  }

  const errors = validate(values);
  const errorKeys = Object.keys(errors);
  Object.keys({ nama: 1, kategori: 1, kota: 1, wa: 1, ig: 1, ikon: 1, deskripsi: 1, alamat: 1, jamBuka: 1, harga: 1 })
    .forEach((k) => setError(k, errors[k] || ""));
  if (errorKeys.length) {
    const first = form.querySelector('[aria-invalid="true"]');
    if (first) first.focus();
    formHint.textContent = `Ada ${errorKeys.length} kolom yang perlu diperbaiki. Periksa pesan berwarna merah di bawah kolom terkait.`;
    toast("Formulir belum lengkap.", "err");
    return;
  }

  formHint.textContent = "";
  submitBtn.disabled = true;
  const originalLabel = submitBtn.textContent;
  submitBtn.textContent = "Menyimpan…";

  const payload = {
    nama: values.nama,
    kategori: values.kategori,
    kota: values.kota,
    alamat: values.alamat,
    jamBuka: values.jamBuka,
    harga: values.harga,
    ikon: values.ikon,
    deskripsi: values.deskripsi,
    wa: values.wa,
    ig: values.ig,
    ownerId: values.ownerId
  };

  try {
    let item;
    if (state.offline) {
      item = Object.assign({ id: "l" + Date.now().toString(36), createdAt: Date.now() }, payload);
      local.add(item);
    } else {
      item = await api.create(payload);
    }
    state.items.unshift(item);
    resetPaging();
    state.query = ""; state.cat = "Semua"; state.city = "Semua"; state.onlyFavs = false;
    qInput.value = "";
    $("#clearSearch").hidden = true;
    syncFavToggle();
    form.reset();
    $("#descCount").textContent = "0";
    formHint.textContent = "";
    renderAll();
    toast("Usaha Anda sudah tampil di daftar.", "ok");
    confetti();
    setTimeout(() => {
      document.getElementById("jelajahi").scrollIntoView({ behavior: scrollMode(), block: "start" });
      const card = grid.querySelector(`[data-id="${cssEscape(item.id)}"]`);
      if (card) { card.classList.add("flash"); card.scrollIntoView({ behavior: scrollMode(), block: "center" }); }
    }, 120);
  } catch (err) {
    formHint.textContent = err.message || "Gagal menyimpan. Periksa koneksi lalu coba lagi.";
    toast(err.message || "Gagal menyimpan. Coba lagi.", "err");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
  }
});

form.addEventListener("reset", () => {
  setTimeout(() => {
    Object.keys({ nama: 1, kategori: 1, kota: 1, wa: 1, ig: 1, ikon: 1, deskripsi: 1, alamat: 1, jamBuka: 1, harga: 1 }).forEach((k) => setError(k, ""));
    $("#descCount").textContent = "0";
    formHint.textContent = "";
    syncEmojiSelection();
    renderPreview();
  }, 0);
});

function updateWaHint(value) {
  const d = String(value || "").replace(/\D/g, "");
  const el = $("#waHint");
  if (!d) { el.textContent = "Boleh pakai 08xx atau +62xx."; return; }
  el.textContent = d.length >= 9 ? "Tersimpan sebagai +" + waNumber(value) : "Boleh pakai 08xx atau +62xx.";
}

/* Emoji picker */
const emojiGrid = $("#emojiGrid");
emojiGrid.innerHTML = EMOJIS.map((e) =>
  `<button type="button" data-emoji="${esc(e)}" aria-pressed="false" aria-label="Pilih ikon ${esc(e)}">${esc(e)}</button>`
).join("");

emojiGrid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-emoji]");
  if (!btn) return;
  form.elements.ikon.value = btn.getAttribute("data-emoji");
  syncEmojiSelection();
  renderPreview();
});

function syncEmojiSelection() {
  const current = form.elements.ikon.value.trim();
  $$("[data-emoji]", emojiGrid).forEach((b) => {
    b.setAttribute("aria-pressed", String(b.getAttribute("data-emoji") === current));
  });
}

/* Isi data contoh */
const DEMOS = [
  { nama: "Warung Bu Sri", kategori: "Kuliner", kota: "Surakarta", alamat: "Jl. Diponegoro No. 45", jamBuka: "07.00 - 21.00", harga: "Rp 15.000 - Rp 40.000", ikon: "🍜", deskripsi: "Nasi campur dan sate ayam legendaris sejak 1998. Makanan rumahan dengan cita rasa autentik Jawa.", wa: "081234567890", ig: "warungbusri" },
  { nama: "Tenun Ikat Puspa", kategori: "Kerajinan", kota: "Yogyakarta", alamat: "Kawasan Kasongan", jamBuka: "09.00 - 17.00", harga: "Rp 150.000 - Rp 2.000.000", ikon: "🧶", deskripsi: "Tenun ikat tangan dengan pewarna alami. Melayani custom motif, souvenir, dan pesanan khusus.", wa: "081298765432", ig: "tenunikatpuspa" },
  { nama: "Kopi Randu", kategori: "Kuliner", kota: "Bandung", alamat: "Jl. Braga No. 12", jamBuka: "08.00 - 22.00", harga: "Rp 12.000 - Rp 35.000", ikon: "☕", deskripsi: "Kopi susu gula aren, manual brew, dan single origin. Roasting mingguan dengan biji pilihan.", wa: "085611223344", ig: "kopirandu" },
  { nama: "Batik Larisan", kategori: "Fashion", kota: "Solo", alamat: "Pasar Klewer", jamBuka: "09.00 - 16.00", harga: "Rp 100.000 - Rp 1.500.000", ikon: "👘", deskripsi: "Batik tulis dan cap berkualitas. Melayani pemesanan seragam, kado, dan custom desain.", wa: "081377788899", ig: "batiklarisan" }
];

$("#fillDemo").addEventListener("click", () => {
  const demo = DEMOS[Math.floor(Math.random() * DEMOS.length)];
  form.elements.nama.value = demo.nama;
  form.elements.kategori.value = demo.kategori;
  form.elements.kota.value = demo.kota;
  if (form.elements.alamat) form.elements.alamat.value = demo.alamat || "";
  if (form.elements.jamBuka) form.elements.jamBuka.value = demo.jamBuka || "";
  if (form.elements.harga) form.elements.harga.value = demo.harga || "";
  form.elements.ikon.value = demo.ikon;
  form.elements.deskripsi.value = demo.deskripsi;
  form.elements.wa.value = demo.wa;
  form.elements.ig.value = demo.ig;
  $("#descCount").textContent = String(demo.deskripsi.length);
  syncEmojiSelection();
  renderPreview();
  toast("Formulir diisi dengan data contoh.");
  form.elements.nama.focus();
});

/* Pratinjau kartu */
function renderPreview() {
  const v = formValues();
  const preview = {
    id: "preview",
    nama: v.nama || "Nama usaha Anda",
    kategori: v.kategori || "Kuliner",
    kota: v.kota || "Kota Anda",
    ikon: v.ikon || "🏪",
    deskripsi: v.deskripsi || "Deskripsi singkat usaha Anda akan tampil di sini. Tulis apa yang Anda jual dan keunggulannya.",
    wa: v.wa,
    ig: v.ig,
    ownerId: null
  };
  $("#previewCard").innerHTML = cardTemplate(preview, "", { allowDelete: false, preview: true });
}

/* ---------- 8. Chrome halaman ---------- */
const mobileNav = $("#mobileNav");
const nav = $("#nav");
const menuToggle = $("#menuToggle");

/* Tema */
const themeToggle = $("#themeToggle");
const darkQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

function storedTheme() {
  const value = store.get("theme", null);
  return value === "light" || value === "dark" ? value : null;
}

function currentTheme() {
  return document.documentElement.getAttribute("data-theme") ||
    (darkQuery && darkQuery.matches ? "dark" : "light");
}

function syncThemeButton() {
  if (!themeToggle) return;
  const dark = currentTheme() === "dark";
  themeToggle.setAttribute("aria-pressed", String(dark));
  themeToggle.setAttribute("aria-label", dark ? "Tema gelap" : "Tema terang");
  themeToggle.title = dark ? "Ganti ke tema terang" : "Ganti ke tema gelap";
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    store.set("theme", next);
    syncThemeButton();
    toast(next === "dark" ? "Mode gelap aktif." : "Mode terang aktif.");
  });
}

/* Ikuti perubahan tema sistem selama pengguna belum memilih tema sendiri. */
if (darkQuery && typeof darkQuery.addEventListener === "function") {
  darkQuery.addEventListener("change", () => {
    if (!storedTheme()) syncThemeButton();
  });
}

/* Navigasi mobile */
function closeNav() {
  if (!nav) return;
  nav.classList.remove("open");
  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Buka menu navigasi");
  }
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeNav();
  });
}

/* Header scroll */
const header = $("header.top");
const toTop = $("#toTop");

function updateScrollChrome() {
  if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  if (toTop) toTop.hidden = window.scrollY < 600;
}
window.addEventListener("scroll", updateScrollChrome, { passive: true });
updateScrollChrome();

/* Tab aktif pada navigasi bawah */
window.addEventListener("scroll", debounce(() => {
  if (!mobileNav || !isMobile()) return;
  const jelajahi = $("#jelajahi");
  const daftar = $("#daftar");
  if (!jelajahi || !daftar) return;
  const y = window.scrollY + 150;
  if (jelajahi.offsetTop === 0 && daftar.offsetTop === 0) return;
  let tab = "top";
  if (y >= daftar.offsetTop) tab = "daftar";
  else if (y >= jelajahi.offsetTop) tab = state.onlyFavs ? "favorit" : "jelajahi";
  setActiveTab(tab);
}, 140), { passive: true });

if (toTop) {
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: scrollMode() }));
}

/* Reveal on scroll. Bila IntersectionObserver tidak tersedia, konten langsung tampil. */
const revealEls = $$("[data-reveal]");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}

/* Counter */
function animateCounter(el, target) {
  if (!el) return;
  const to = Number(target) || 0;
  if (prefersReduced()) { el.textContent = String(to); return; }
  const from = Number(el.textContent.replace(/\D/g, "")) || 0;
  if (from === to) { el.textContent = String(to); return; }
  const duration = 900;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = String(Math.round(from + (to - from) * eased));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* Pencarian cepat di halaman depan */
const heroSearch = $("#heroSearch");
if (heroSearch) {
  heroSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = heroSearch.elements.heroQ.value.trim();
    qInput.value = value;
    state.query = value;
    resetPaging();
    $("#clearSearch").hidden = !value;
    renderGrid();
    $("#jelajahi").scrollIntoView({ behavior: scrollMode(), block: "start" });
  });
}

/* Navigasi bawah untuk layar kecil */
function setActiveTab(tab) {
  if (!mobileNav) return;
  $$(".mnav-item", mobileNav).forEach((btn) => {
    if (btn.getAttribute("data-tab") === tab) btn.setAttribute("aria-current", "true");
    else btn.removeAttribute("aria-current");
  });
}

if (mobileNav) {
  mobileNav.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-go]");
    if (!btn) return;
    if (btn.hasAttribute("data-fav")) {
      state.onlyFavs = !state.onlyFavs;
      syncFavToggle();
      resetPaging();
      renderGrid();
      toast(state.onlyFavs ? "Menampilkan usaha favorit saja." : "Menampilkan semua usaha.");
    }
    const target = document.querySelector(btn.getAttribute("data-go"));
    if (target) target.scrollIntoView({ behavior: scrollMode(), block: "start" });
    setActiveTab(btn.getAttribute("data-tab"));
  });
  setActiveTab("top");
}

/* Tampilan berubah saat lebar layar berpindah */
let lastMobile = isMobile();
window.addEventListener("resize", debounce(() => {
  const mobile = isMobile();
  if (!mobile) closeNav();
  if (mobile === lastMobile) return;
  lastMobile = mobile;
  resetPaging();
  renderGrid();
}, 150));

/* Confetti */
function confetti() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const wrap = document.createElement("div");
  wrap.className = "confetti";
  const colors = ["#6366F1", "#8B5CF6", "#10B981", "#FBBF24", "#F43F5E", "#06B6D4"];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement("i");
    piece.style.left = Math.random() * 100 + "%";
    piece.style.background = colors[i % colors.length];
    piece.style.animationDuration = 2.2 + Math.random() * 1.6 + "s";
    piece.style.animationDelay = Math.random() * 0.35 + "s";
    piece.style.setProperty("--dx", (Math.random() * 240 - 120) + "px");
    piece.style.setProperty("--rot", (Math.random() * 1080) + "deg");
    wrap.appendChild(piece);
  }
  document.body.appendChild(wrap);
  setTimeout(() => wrap.remove(), 4200);
}

/* Segarkan saat tab kembali aktif, bukan lewat pengatur waktu otomatis. */
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && !state.loading && Date.now() - state.lastSync > 60000) {
    loadItems(true);
  }
});

/* Año */
$("#year").textContent = new Date().getFullYear();

/* Buka detail dari query string (?usaha=id) */
function openFromQuery() {
  const params = new URLSearchParams(location.search);
  const id = params.get("usaha");
  if (id) {
    const item = state.items.find((x) => x.id === id);
    if (item) {
      openDetail(id);
      history.replaceState(null, "", location.pathname);
    }
  }
}

/* Init */
(async function init() {
  syncThemeButton();
  syncFavToggle();
  renderPreview();
  syncEmojiSelection();
  const startedAt = $("#startedAt");
  if (startedAt) startedAt.value = String(Date.now());
  await loadItems();
  openFromQuery();
  setInterval(renderUpdated, 60000);
})();
