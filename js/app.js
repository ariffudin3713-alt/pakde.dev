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
const CATS = ["Semua", "Kuliner", "Fashion", "Kerajinan", "Jasa", "Pertanian", "Lainnya"];
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
    const catOk = state.cat === "Semua" || item.kategori === state.cat;
    const cityOk = state.city === "Semua" || (item.kota || "") === state.city;
    const favOk = !state.onlyFavs || state.favs.includes(item.id);
    const hay = [item.nama, item.deskripsi, item.kota, item.kategori].join(" ").toLowerCase();
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
  const ig = item.ig ? `<a class="mini muted" href="${esc(igLink(item.ig))}" target="_blank" rel="noopener">Instagram</a>` : "";
  const wa = item.wa
    ? `<a class="mini solid" href="${esc(waLink(item))}" target="_blank" rel="noopener">WhatsApp</a>`
    : `<span class="mini solid" aria-disabled="true" style="opacity:.45;cursor:not-allowed">WhatsApp</span>`;
  const del = (isMine && options.allowDelete !== false)
    ? `<button type="button" class="mini danger" data-del="${esc(item.id)}">Hapus</button>` : "";

  return `<article class="card" data-id="${esc(item.id)}">
    <div class="card-top">
      <div class="ico" aria-hidden="true">${esc(item.ikon || "🏪")}</div>
      <button type="button" class="fav-btn" data-fav="${esc(item.id)}" aria-pressed="${isFav}"
        aria-label="${isFav ? "Hapus dari" : "Tambahkan ke"} favorit">${isFav ? "♥" : "♡"}</button>
    </div>
    <div class="tags">
      <span class="tag">${esc(item.kategori || "Lainnya")}</span>
      ${item.kota ? `<span class="tag alt">${esc(item.kota)}</span>` : ""}
    </div>
    <h3>${hl(item.nama, term)}</h3>
    <p>${hl(item.deskripsi, term)}</p>
    <div class="actions">
      ${wa}
      ${ig}
      <button type="button" class="mini muted" data-copy="${esc(item.wa || "")}">Salin no.</button>
      <button type="button" class="mini muted" data-detail="${esc(item.id)}">Detail</button>
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
  state.items.forEach((i) => { counts[i.kategori || "Lainnya"] = (counts[i.kategori || "Lainnya"] || 0) + 1; });
  chipsEl.innerHTML = CATS.map((c) => {
    const n = c === "Semua" ? state.items.length : (counts[c] || 0);
    return `<button type="button" class="chip" data-cat="${esc(c)}" aria-pressed="${c === state.cat}">
      ${esc(c)} <span class="count">${n}</span></button>`;
  }).join("");
}

function renderCityOptions() {
  const cities = Array.from(new Set(state.items.map((i) => (i.kota || "").trim()).filter(Boolean)))
    .sort((a, b) => a.localeCompare(b, "id"));
  const current = state.city;
  citySelect.innerHTML = `<option value="Semua">Semua kota</option>` +
    cities.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join("");
  citySelect.value = cities.includes(current) ? current : "Semua";
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
      <strong>Belum ada usaha yang terdaftar.</strong>
      Jadilah yang pertama. Daftarkan usaha Anda di bagian bawah halaman.
      <br><a class="btn" href="#daftar">Daftarkan usaha sekarang</a>
    </div>`;
    resultInfo.innerHTML = "Belum ada usaha terdaftar.";
    moreBtn.hidden = true;
    renderPager(per, 1, 1);
    return;
  }

  if (list.length === 0) {
    grid.innerHTML = `<div class="empty">
      <span class="empty-ico" aria-hidden="true">🔍</span>
      <strong>Tidak ada usaha yang cocok.</strong>
      Coba kata kunci lain atau pilih kategori lain.
      <br><button type="button" class="btn ghost" data-reset>Reset pencarian</button>
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
  const cats = new Set(state.items.map((i) => i.kategori || "Lainnya"));
  const cities = new Set(state.items.map((i) => (i.kota || "").trim()).filter(Boolean));
  animateCounter($("#statTotal"), state.items.length);
  animateCounter($("#statCats"), cats.size);
  animateCounter($("#statCities"), cities.size);
  $("#liveCount").textContent = state.items.length
    ? state.items.length + " usaha aktif saat ini"
    : "Belum ada usaha — jadilah yang pertama!";
}

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
  favToggle.setAttribute("aria-pressed", String(state.onlyFavs));
  resetPaging();
  renderGrid();
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
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  });
}

$("#refreshBtn").addEventListener("click", async () => {
  const btn = $("#refreshBtn");
  btn.disabled = true;
  await loadItems(true);
  btn.disabled = false;
  toast("Daftar diperbarui.", "ok");
});

grid.addEventListener("click", (e) => {
  if (e.target.closest("[data-reset]")) {
    state.query = ""; state.cat = "Semua"; state.city = "Semua"; state.onlyFavs = false;
    qInput.value = "";
    favToggle.setAttribute("aria-pressed", "false");
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

  const isFav = state.favs.includes(id);
  $$(`[data-fav="${cssEscape(id)}"]`).forEach((btn) => {
    btn.setAttribute("aria-pressed", String(isFav));
    btn.textContent = isFav ? "♥" : "♡";
  });
  if (state.onlyFavs) renderGrid();
  renderMyList();
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

function openModal(el) {
  lastFocused = document.activeElement;
  el.hidden = false;
  document.body.style.overflow = "hidden";
  const focusable = el.querySelector("button, a[href], input, select, textarea");
  if (focusable) focusable.focus();
}

function closeModal(el) {
  el.hidden = true;
  document.body.style.overflow = "";
  if (lastFocused && lastFocused.focus) lastFocused.focus();
}

function openDetail(id) {
  const item = state.items.find((x) => x.id === id);
  if (!item) return;
  const isFav = state.favs.includes(item.id);
  const ig = item.ig ? `<a class="btn ghost" href="${esc(igLink(item.ig))}" target="_blank" rel="noopener">Buka Instagram</a>` : "";
  $("#modalBody").innerHTML = `
    <div class="detail-head">
      <div class="ico" aria-hidden="true">${esc(item.ikon || "🏪")}</div>
      <div>
        <h3 id="modalTitle">${esc(item.nama)}</h3>
        <div class="tags">
          <span class="tag">${esc(item.kategori || "Lainnya")}</span>
          ${item.kota ? `<span class="tag alt">${esc(item.kota)}</span>` : ""}
        </div>
      </div>
    </div>
    <p class="detail-desc">${esc(item.deskripsi)}</p>
    <div class="detail-meta">
      <div><b>WhatsApp</b><span>+${esc(waNumber(item.wa))}</span></div>
      ${item.ig ? `<div><b>Instagram</b><span>@${esc(item.ig)}</span></div>` : ""}
      <div><b>Ditambahkan</b><span>${esc(formatDate(item.createdAt))}</span></div>
    </div>
    <div class="detail-actions">
      <a class="btn" href="${esc(waLink(item))}" target="_blank" rel="noopener">Hubungi via WhatsApp</a>
      ${ig}
      <button type="button" class="btn ghost" data-modal-copy="${esc(item.wa || "")}">Salin nomor</button>
      <button type="button" class="btn ghost" data-modal-fav="${esc(item.id)}">${isFav ? "♥ Hapus favorit" : "♡ Favorit"}</button>
      <button type="button" class="btn ghost" data-modal-share="${esc(item.id)}">Bagikan</button>
    </div>`;
  openModal(modal);
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
  toast("Tautan disembunyikan ke papan klip.", "ok");
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
  if (e.key === "Escape") {
    if (!modal.hidden) closeModal(modal);
    if (!confirmModal.hidden) closeModal(confirmModal);
  }
  if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
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
    if (err) { err.textContent = message; err.classList.add("show"); }
  } else {
    if (input) input.removeAttribute("aria-invalid");
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
  Object.keys(errors).forEach((k) => setError(k, errors[k]));
  if (Object.keys(errors).length) {
    const first = form.querySelector('[aria-invalid="true"]');
    if (first) first.focus();
    formHint.textContent = "Periksa kembali bagian yang ditandai merah.";
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
    favToggle.setAttribute("aria-pressed", "false");
    form.reset();
    $("#descCount").textContent = "0";
    renderAll();
    toast("Usaha Anda sudah tampil di daftar.", "ok");
    confetti();
    setTimeout(() => {
      document.getElementById("jelajahi").scrollIntoView({ behavior: "smooth", block: "start" });
      const card = grid.querySelector(`[data-id="${CSS.escape(item.id)}"]`);
      if (card) { card.classList.add("flash"); card.scrollIntoView({ behavior: "smooth", block: "center" }); }
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
    Object.keys({ nama: 1, kategori: 1, kota: 1, wa: 1, ig: 1, ikon: 1, deskripsi: 1 }).forEach((k) => setError(k, ""));
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
  { nama: "Warung Bu Sri", kategori: "Kuliner", kota: "Surakarta", ikon: "🍜", deskripsi: "Nasi campur dan sate ayam legendaris sejak 1998. Buka setiap hari 07.00–21.00, pesanan bisa dibuat untuk acara.", wa: "081234567890", ig: "warungbusri" },
  { nama: "Tenun Ikat Puspa", kategori: "Kerajinan", kota: "Yogyakarta", ikon: "🧶", deskripsi: "Tenun ikat tangan dengan pewarna alami. Melayani custom motif dan pengiriman ke seluruh Jawa.", wa: "081298765432", ig: "tenunikatpuspa" },
  { nama: "Kopi Randu Pak Rendi", kategori: "Kuliner", kota: "Semarang", ikon: "☕", deskripsi: "Kopi susu gula aren dan single origin pilihan. Roasting mingguan, bisa kiriman ke seluruh Indonesia.", wa: "085611223344", ig: "" },
  { nama: "Batik Larisan", kategori: "Fashion", kota: "Solo", ikon: "👘", deskripsi: "Batik tulis dan cap untuk harian, atasan, dan seragam. Melayani penjahit custom.", wa: "081377788899", ig: "batiklarisan" }
];

$("#fillDemo").addEventListener("click", () => {
  const demo = DEMOS[Math.floor(Math.random() * DEMOS.length)];
  form.elements.nama.value = demo.nama;
  form.elements.kategori.value = demo.kategori;
  form.elements.kota.value = demo.kota;
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
  $("#previewCard").innerHTML = cardTemplate(preview, "", { allowDelete: false });
}

/* ---------- 8. Chrome halaman ---------- */
/* Tema */
const themeToggle = $("#themeToggle");
themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = current ? current === "dark" : systemDark;
  const next = isDark ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  store.set("theme", next);
  toast(next === "dark" ? "Mode gelap aktif." : "Mode terang aktif.");
});

/* Navigasi mobile */
const nav = $("#nav");
const menuToggle = $("#menuToggle");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
});
nav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

/* Header scroll */
const header = $("header.top");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 8);
  const top = $("#toTop");
  top.hidden = window.scrollY < 600;
}, { passive: true });

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

$("#toTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* Steps accordion */
$$(".step").forEach((step) => {
  step.addEventListener("click", () => {
    const isOpen = step.getAttribute("aria-expanded") === "true";
    $$(".step").forEach((s) => s.setAttribute("aria-expanded", "false"));
    step.setAttribute("aria-expanded", String(!isOpen));
  });
});

/* Reveal on scroll */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
$$("[data-reveal]").forEach((el) => revealObserver.observe(el));

/* Counter */
function animateCounter(el, target) {
  if (!el) return;
  const from = Number(el.textContent.replace(/\D/g, "")) || 0;
  const to = Number(target) || 0;
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

/* Kartu obrolan di halaman depan */
const HERO_SAMPLES = [
  {
    nama: "Kopi Randu", kategori: "Kuliner", ikon: "☕", kota: "Bandung",
    pesan: ["Kak, kopi susu arennya masih ada?",
            "Masih ada Bang, mau 2 ya — 15 menit lagi siap 👌"]
  },
  {
    nama: "Tenun Adil", kategori: "Kerajinan", ikon: "🧶", kota: "Yogyakarta",
    pesan: ["Motif warna alamnya ada yang baru?",
            "Ada kak, minggu lalu baru selesai dijemur 🌿"]
  },
  {
    nama: "Batik Soko", kategori: "Fashion", ikon: "👘", kota: "Solo",
    pesan: ["Bisa jahit seragam sekolah 30 pcs?",
            "Bisa kak, sekitar 4 hari selesai ✂️"]
  },
  {
    nama: "Sayur Segar", kategori: "Pertanian", ikon: "🥬", kota: "Bandung",
    pesan: ["Tomatonya masih ada hari ini?",
            "Masih ada Bang, baru dipanen pagi ini 🍅"]
  }
];
let heroIndex = 0;
function renderHeroCard() {
  const el = $("#heroCard");
  if (!el) return;
  const s = HERO_SAMPLES[heroIndex % HERO_SAMPLES.length];
  el.innerHTML = `<div class="chat-inner">
      <div class="chat-head">
        <div class="chat-avatar" aria-hidden="true">${esc(s.ikon)}</div>
        <div class="chat-id">
          <strong>${esc(s.nama)}</strong>
          <span class="chat-sub">${esc(s.kategori)} · ${esc(s.kota)}</span>
        </div>
        <span class="chat-online">aktif</span>
      </div>
      <div class="chat-body">
        <div class="bubble in">${esc(s.pesan[0])}</div>
        <div class="bubble out">${esc(s.pesan[1])}</div>
      </div>
      <div class="chat-foot">
        <span class="typing" aria-hidden="true"><i></i><i></i><i></i></span> Sedang mengetik…
      </div>
    </div>`;
  heroIndex += 1;
}
renderHeroCard();
setInterval(renderHeroCard, 4500);

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
    $("#jelajahi").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

/* Navigasi bawah untuk layar kecil */
const mobileNav = $("#mobileNav");
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
      favToggle.setAttribute("aria-pressed", String(state.onlyFavs));
      resetPaging();
      renderGrid();
    }
    const target = document.querySelector(btn.getAttribute("data-go"));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveTab(btn.getAttribute("data-tab"));
  });
  setActiveTab("top");
}

/* Tampilan berubah saat lebar layar berpindah */
let lastMobile = isMobile();
window.addEventListener("resize", debounce(() => {
  const mobile = isMobile();
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
  const colors = ["#1E5B4A", "#E8A33D", "#F5EFE3", "#7FC4AA", "#9B3D2E"];
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

/* Auto refresh */
setInterval(() => {
  if (document.visibilityState === "visible" && !state.loading) loadItems(true);
}, 30000);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") loadItems(true);
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
  renderPreview();
  syncEmojiSelection();
  $("#startedAt") && ($("#startedAt").value = String(Date.now()));
  await loadItems();
  openFromQuery();
  setInterval(renderUpdated, 15000);
})();
