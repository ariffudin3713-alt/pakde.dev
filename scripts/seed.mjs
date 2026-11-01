/**
 * Mengisi direktori dengan profil UMKM contoh yang sudah disiapkan.
 *
 *   node scripts/seed.mjs http://localhost:3111
 *   node scripts/seed.mjs https://pakde.dev.vercel.app
 *   node scripts/seed.mjs https://pakde.dev.vercel.app --replace
 *
 * Tanpa --replace, entri yang sudah ada (dikenali dari ownerId seed-demo-*)
 * dilewati supaya tidak dobel. Dengan --replace, semua entri seed lama
 * dihapus lebih dulu, lalu data baru ditambahkan.
 */
const args = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const flags = new Set(process.argv.slice(2).filter((arg) => arg.startsWith("--")));
const base = (args[0] || "http://localhost:3111").replace(/\/$/, "");
const replace = flags.has("--replace");

const samples = [
  {
    ownerId: "seed-demo-gudeg-yu-djum",
    nama: "Gudeg Yu Djum",
    kategori: "Kuliner",
    kota: "Yogyakarta",
    alamat: "Jl. Kaliurang Km. 4,5 CT III/22, Caturtunggal, Depok, Sleman, DIY",
    ikon: "🍛",
    deskripsi:
      "Gudeg resep keluarga sejak 1951, dimasak perlahan dengan kayu bakar dan santan kelapa segar. Sajian lengkap berisi gudeg kering, ayam kampung, telur pindang, tahu, tempe, dan sambal krecek. Tersedia kemasan besek untuk oleh-oleh dan pengiriman luar kota.",
    wa: "628562866001",
    ig: "gudegyudjumpusat_",
    jamBuka: "06.00 - 21.00 WIB",
    harga: "Rp 17.000 - 55.000",
    produk: [
      { nama: "Nasi gudeg lengkap", harga: "Rp 30.000", catatan: "gudeg, ayam, telur, tahu tempe, krecek" },
      { nama: "Gudeg besek oleh-oleh", harga: "Rp 45.000 - 55.000", catatan: "tahan 1 hari di suhu ruang" },
      { nama: "Ayam kampung opor", harga: "Rp 22.000", catatan: "per potong" },
      { nama: "Telur pindang", harga: "Rp 7.000", catatan: "per butir" },
      { nama: "Sambal krecek", harga: "Rp 10.000", catatan: "per porsi" },
      { nama: "Paket hemat sarapan", harga: "Rp 17.000", catatan: "nasi, gudeg, tahu tempe" }
    ],
    ulasan: [
      ["Rina Wulandari", "Gudegnya legit dan tidak terlalu manis, ayam kampungnya empuk. Datang pagi supaya masih hangat dan antreannya belum panjang.", 5],
      ["Dimas Prakoso", "Beli besek buat oleh-oleh ke Jakarta, sampai masih rapi. Sambal kreceknya yang bikin nagih.", 5],
      ["Sari Puspita", "Porsinya pas untuk sarapan. Tempatnya sederhana, tapi pelayanannya cepat walau ramai.", 4]
    ]
  },
  {
    ownerId: "seed-demo-pempek-pak-raden",
    nama: "Pempek Pak Raden",
    kategori: "Kuliner",
    kota: "Palembang",
    alamat: "Jl. Brigjen HM. Dhani Effendi No. 80-82, Bukit Kecil, Palembang, Sumatera Selatan",
    ikon: "🐟",
    deskripsi:
      "Pempek ikan tenggiri buatan rumahan sejak 1984, berdiri dari resep Hj. Nurhasanah. Kapal selam, lenjer, adaan, dan model disajikan dengan cuko kental yang asam-pedas. Tersedia paket frozen untuk dikirim ke luar kota.",
    wa: "6281279300808",
    ig: "pempekpakraden.fatmawati",
    jamBuka: "09.00 - 21.00 WIB",
    harga: "Rp 25.000 - 120.000",
    produk: [
      { nama: "Pempek kapal selam", harga: "Rp 32.000", catatan: "isi telur ayam, per buah" },
      { nama: "Pempek lenjer", harga: "Rp 28.000", catatan: "per porsi" },
      { nama: "Pempek adaan", harga: "Rp 25.000", catatan: "per porsi" },
      { nama: "Pempek model", harga: "Rp 30.000", catatan: "isi tahu dan mie" },
      { nama: "Tekwan", harga: "Rp 25.000", catatan: "kuah udang, per mangkuk" },
      { nama: "Paket frozen isi 5", harga: "Rp 85.000 - 120.000", catatan: "cuko terpisah" },
      { nama: "Cuko botol 250 ml", harga: "Rp 20.000" }
    ],
    ulasan: [
      ["Ahmad Fauzi", "Cukonya kental dan pedasnya pas, bukan cuma manis. Kapal selamnya besar, telurnya utuh.", 5],
      ["Melati Anggraini", "Pesan paket frozen buat keluarga di Bandung, packing rapi dan masih bagus saat sampai.", 5],
      ["Yoga Saputra", "Tempatnya nyaman untuk makan bersama. Sedikit menunggu saat jam makan siang.", 4]
    ]
  },
  {
    ownerId: "seed-demo-sambal-bu-rudy",
    nama: "Sambal Bu Rudy",
    kategori: "Kuliner",
    kota: "Surabaya",
    alamat: "Jl. Dharmahusada No. 144, Mojo, Gubeng, Surabaya, Jawa Timur",
    ikon: "🌶",
    deskripsi:
      "Sambal bawang khas Surabaya sejak 1995, dimasak dalam porsi kecil dengan cabai segar dan minyak kelapa. Varian bawang, teri, dan pete tersedia dalam kemasan botol maupun paket oleh-oleh. Cocok untuk lauk rumahan maupun stok warung.",
    wa: "6281287766745",
    ig: "bu.rudy",
    jamBuka: "08.00 - 20.00 WIB",
    harga: "Rp 25.000 - 95.000",
    produk: [
      { nama: "Sambal bawang 140 ml", harga: "Rp 30.000", catatan: "kemasan botol kaca" },
      { nama: "Sambal teri 140 ml", harga: "Rp 35.000", catatan: "teri medan" },
      { nama: "Sambal pete 140 ml", harga: "Rp 40.000" },
      { nama: "Paket 3 varian", harga: "Rp 95.000", catatan: "bawang, teri, pete" },
      { nama: "Nasi sambal goreng", harga: "Rp 25.000", catatan: "siap santap di tempat" },
      { nama: "Kerupuk udang 250 g", harga: "Rp 28.000" }
    ],
    ulasan: [
      ["Nur Aini", "Sambal bawangnya wangi dan pedasnya nendang, cocok buat lauk nasi hangat. Botolnya rapi jadi aman dibawa naik pesawat.", 5],
      ["Bayu Setiawan", "Selalu beli paket tiga varian kalau ke Surabaya. Yang pete paling cepat habis di rumah.", 5],
      ["Fitri Handayani", "Rasanya konsisten, tidak terlalu berminyak. Menurut saya harganya masih wajar untuk ukuran botol segini.", 5]
    ]
  },
  {
    ownerId: "seed-demo-batik-giri-alam",
    nama: "Batik Giri Alam",
    kategori: "Kerajinan",
    kota: "Banjarnegara",
    alamat: "Dusun Dagaran RT 01/RW 04, Desa Gumelem Wetan, Susukan, Banjarnegara, Jawa Tengah",
    ikon: "🧵",
    deskripsi:
      "Batik tulis Gumelem dengan pewarna alam dari mengkudu, tingi, jambal, dan daun indigo. Dikerjakan perajin perempuan desa di bawah pengelolaan Ibu Waridah, dari motif klasik Gumelem sampai pesanan motif sendiri. Melayani kain panjang, kemeja, selendang, dan workshop membatik.",
    wa: "6285155227923",
    ig: "batikgirialam",
    jamBuka: "08.00 - 17.00 WIB",
    harga: "Rp 150.000 - 1.500.000",
    produk: [
      { nama: "Kain batik tulis 2 m", harga: "Rp 450.000 - 1.500.000", catatan: "tergantung kerumitan motif" },
      { nama: "Kemeja batik pria", harga: "Rp 275.000 - 450.000", catatan: "katun primisima" },
      { nama: "Selendang batik", harga: "Rp 150.000 - 250.000" },
      { nama: "Kain cap kombinasi tulis", harga: "Rp 275.000", catatan: "motif Gumelem" },
      { nama: "Workshop membatik", harga: "Rp 150.000", catatan: "per orang, 2 jam" },
      { nama: "Pesanan motif khusus", harga: "Mulai Rp 500.000", catatan: "minimal 5 kain" }
    ],
    ulasan: [
      ["Ratna Kusumawati", "Warnanya kalem dan khas pewarna alam, tidak mencolok. Saya pesan kain untuk seragam komunitas dan hasilnya rapi.", 5],
      ["Hendra Wijaya", "Ikut workshop sebentar saat berkunjung. Perajinnya sabar menjelaskan proses cap dan tulis.", 5],
      ["Lestari Ningsih", "Kemejanya nyaman dipakai harian. Pengiriman agak lama karena dikerjakan sesuai pesanan, tapi sesuai janji.", 4]
    ]
  },
  {
    ownerId: "seed-demo-nangsib-keramik",
    nama: "Nangsib Keramik Kasongan",
    kategori: "Kerajinan",
    kota: "Bantul",
    alamat: "Jl. Kasongan RT 03, Kajen, Bangunjiwo, Kasihan, Bantul, DIY 55184",
    ikon: "🏺",
    deskripsi:
      "Gerabah Kasongan yang dibentuk dengan teknik putaran tangan dan dibakar tradisional. Produknya dari mug dan piring makan sampai vas serta guci dekorasi, dengan glasir cokelat dan abu-abu alami. Menerima pesanan seragam untuk kafe, hotel, dan suvenir acara.",
    wa: "6281392626055",
    ig: "",
    jamBuka: "08.00 - 17.00 WIB",
    harga: "Rp 35.000 - 850.000",
    produk: [
      { nama: "Mug keramik", harga: "Rp 55.000", catatan: "kapasitas 300 ml" },
      { nama: "Piring makan 25 cm", harga: "Rp 65.000" },
      { nama: "Teko keramik", harga: "Rp 185.000" },
      { nama: "Vas dekorasi", harga: "Rp 95.000 - 250.000", catatan: "tinggi 20-40 cm" },
      { nama: "Guci dekorasi besar", harga: "Rp 450.000 - 850.000" },
      { nama: "Paket tableware 4 pcs", harga: "Rp 240.000", catatan: "2 piring, 2 mangkuk" },
      { nama: "Pesanan custom kafe", harga: "Mulai Rp 35.000", catatan: "minimal 50 pcs" }
    ],
    ulasan: [
      ["Arif Nugroho", "Beli satu set mug untuk kafe kecil, bentuknya tidak seragam sempurna justru terasa buatan tangan. Packing kayu aman.", 5],
      ["Dewi Kartika", "Vasnya berat dan tebal, warnanya natural. Bisa pilih langsung di workshop dan dilihat detail glasirnya.", 5],
      ["Tomo Susanto", "Harga bersaing untuk keramik handmade. Perlu sabar kalau pesan banyak karena dikerjakan bergiliran.", 4]
    ]
  },
  {
    ownerId: "seed-demo-kopi-gayo-muhazir",
    nama: "Kopi Gayo Muhazir",
    kategori: "Kuliner",
    kota: "Takengon",
    alamat: "Jl. Lebe Kader No. 101, Takengon, Aceh Tengah, Aceh",
    ikon: "☕",
    deskripsi:
      "Kopi arabika Gayo dari kebun keluarga di dataran tinggi Bener Meriah, disangrai sendiri dalam batch kecil. Tersedia proses natural, honey, dan fully washed, baik biji utuh maupun bubuk. Bisa pesan drip bag dan cold brew untuk kebutuhan kafe.",
    wa: "6285260006080",
    ig: "kopigayo.co",
    jamBuka: "08.00 - 22.00 WIB",
    harga: "Rp 25.000 - 180.000",
    produk: [
      { nama: "Arabika Gayo bubuk 200 g", harga: "Rp 45.000", catatan: "medium roast" },
      { nama: "Arabika Gayo biji 500 g", harga: "Rp 95.000", catatan: "pilihan proses" },
      { nama: "Arabika Gayo biji 1 kg", harga: "Rp 180.000", catatan: "hemat untuk kafe" },
      { nama: "Drip bag isi 10", harga: "Rp 55.000" },
      { nama: "Cold brew botol 250 ml", harga: "Rp 25.000" },
      { nama: "Gayo honey 100 g", harga: "Rp 35.000", catatan: "coba rasa sebelum beli banyak" }
    ],
    ulasan: [
      ["Fajar Ramadhan", "Aroma bunganya jelas, aftertastenya bersih. Saya ambil biji 1 kg untuk warung dan hasil seduhnya stabil.", 5],
      ["Intan Permata", "Drip bag praktis untuk di kantor. Rasanya masih manis alami walau diseduh air panas biasa.", 5],
      ["Rizky Ananda", "Pengiriman dari Takengon butuh beberapa hari, tapi kopinya baru disangrai jadi aromanya masih kuat.", 5]
    ]
  },
  {
    ownerId: "seed-demo-wong-hang-tailor",
    nama: "Wong Hang Tailor",
    kategori: "Jasa",
    kota: "Jakarta",
    alamat: "Jl. Raya Mangga Besar No. 63C, Taman Sari, Jakarta Barat, DKI Jakarta",
    ikon: "✂",
    deskripsi:
      "Penjahit lintas generasi sejak 1933 yang kini dikelola keluarga ketiga. Melayani jas, kemeja, kebaya encim, dan seragam kantor dengan pola yang diukur langsung di badan. Menerima permak dan alterasi untuk pakaian yang sudah dimiliki.",
    wa: "6281252888853",
    ig: "wonghangtailor",
    jamBuka: "Senin - Sabtu, 09.00 - 18.00 WIB",
    harga: "Rp 50.000 - 2.500.000",
    produk: [
      { nama: "Permak & alterasi", harga: "Rp 50.000 - 200.000", catatan: "tergantung tingkat kesulitan" },
      { nama: "Kemeja batik custom", harga: "Rp 450.000", catatan: "bahan katun, 1 minggu" },
      { nama: "Jas formal dua kancing", harga: "Rp 2.500.000", catatan: "ukur badan, 3 minggu" },
      { nama: "Kebaya encim", harga: "Rp 1.200.000", catatan: "bordir tangan opsional" },
      { nama: "Seragam kantor", harga: "Rp 350.000", catatan: "per potong, minimal 10" },
      { nama: "Konsultasi ukuran", harga: "Gratis", catatan: "datang langsung" }
    ],
    ulasan: [
      ["Steven Halim", "Jasnya jatuh di badan dengan rapi, bahu tidak menggelembung. Ukuran dicek dua kali sebelum dipotong.", 5],
      ["Maria Tanuwijaya", "Kebaya warisan ibu saya dipermak di sini dan hasilnya masih mempertahankan potongan lama. Puas.", 5],
      ["Andrianto", "Hasil jahitan bagus, hanya pengerjaan menjelang lebaran agak lama. Sebaiknya pesan lebih awal.", 4]
    ]
  },
  {
    ownerId: "seed-demo-jamu-iboe",
    nama: "Jamu Iboe",
    kategori: "Kesehatan",
    kota: "Sidoarjo",
    alamat: "Jl. Raya Trosobo No. 12, Tanjungsari, Taman, Sidoarjo, Jawa Timur",
    ikon: "🌿",
    deskripsi:
      "Jamu tradisional yang diracik sejak 1910 dengan resep turun-temurun. Kunyit asam, beras kencur, sinom, dan pahitan dibuat dari rempah pilihan tanpa pengawet. Tersedia botol siap minum, bubuk instan, serta paket langganan mingguan.",
    wa: "6281252508127",
    ig: "jamu_iboe",
    jamBuka: "07.00 - 20.00 WIB",
    harga: "Rp 8.000 - 75.000",
    produk: [
      { nama: "Kunyit asam 150 ml", harga: "Rp 8.000", catatan: "botol siap minum" },
      { nama: "Beras kencur 150 ml", harga: "Rp 8.000" },
      { nama: "Sinom 150 ml", harga: "Rp 8.000" },
      { nama: "Pahitan 150 ml", harga: "Rp 9.000" },
      { nama: "Paket 6 botol", harga: "Rp 45.000", catatan: "bebas pilih varian" },
      { nama: "Jamu bubuk instan", harga: "Rp 25.000", catatan: "isi 10 sachet" },
      { nama: "Paket langganan mingguan", harga: "Rp 75.000", catatan: "12 botol, antar area Sidoarjo" }
    ],
    ulasan: [
      ["Sulastri", "Kunyit asamnya terasa rempahnya, tidak cuma manis sirup. Saya langganan tiap minggu untuk keluarga.", 5],
      ["Anton Prabowo", "Pahitannya benar-benar pahit, sesuai harapan. Botolnya rapi dan tanggal produksinya jelas.", 5],
      ["Nadia Safira", "Beras kencurnya enak dingin-dingin. Pengantaran area Sidoarjo cepat, luar kota pakai ekspedisi.", 4]
    ]
  },
  {
    ownerId: "seed-demo-psbk",
    nama: "Padepokan Seni Bagong Kussudiardja",
    kategori: "Pendidikan",
    kota: "Bantul",
    alamat: "Jl. Parangtritis Km 10, Kembaran, Tamantirto, Kasihan, Bantul, DIY",
    ikon: "🎭",
    deskripsi:
      "Padepokan seni yang didirikan Bagong Kussudiardja pada 1978, kini menjadi ruang belajar tari, karawitan, dan teater. Kelas reguler untuk anak dan dewasa dibimbing pelatih sanggar, dengan kesempatan tampil di pentas akhir semester. Pendopo dan area terbuka juga bisa disewa untuk pertunjukan.",
    wa: "6282141416252",
    ig: "psbk_jogja",
    jamBuka: "Senin - Sabtu, 08.00 - 17.00 WIB",
    harga: "Rp 100.000 - 1.500.000",
    produk: [
      { nama: "Kelas tari anak", harga: "Rp 400.000", catatan: "8 pertemuan per bulan" },
      { nama: "Kelas tari dewasa", harga: "Rp 500.000", catatan: "8 pertemuan per bulan" },
      { nama: "Kelas karawitan", harga: "Rp 350.000", catatan: "grup, per bulan" },
      { nama: "Workshop tari sehari", harga: "Rp 250.000", catatan: "per peserta, minimal 10" },
      { nama: "Kelas privat", harga: "Rp 300.000", catatan: "per sesi 90 menit" },
      { nama: "Sewa pendopo", harga: "Rp 1.500.000", catatan: "per hari, kapasitas 200 orang" },
      { nama: "Kunjungan edukasi sekolah", harga: "Rp 100.000", catatan: "per siswa" }
    ],
    ulasan: [
      ["Wulan Permatasari", "Anak saya jadi lebih percaya diri setelah ikut kelas tari. Pelatihnya tegas tapi sabar dengan anak-anak.", 5],
      ["Guruh Santosa", "Suasananya khas padepokan, pendopo kayunya masih terawat. Sewa untuk acara komunitas lancar.", 5],
      ["Maya Anggraini", "Jadwal kelas sore cocok untuk anak sekolah. Informasi administrasi sebaiknya ditanyakan lewat WhatsApp dulu.", 4]
    ]
  },
  {
    ownerId: "seed-demo-lok-baintan",
    nama: "Pasar Terapung Lok Baintan",
    kategori: "Lainnya",
    kota: "Banjar",
    alamat: "Dermaga Desa Lok Baintan, Kec. Sungai Tabuk, Kab. Banjar, Kalimantan Selatan",
    ikon: "🛶",
    deskripsi:
      "Pasar terapung di Sungai Martapura yang ramai sejak pagi buta, tempat pedagang perempuan berjualan dari atas jukung. Menjual pisang, kerupuk ikan, kue tradisional, dan kopi pagi, sekaligus menyewakan perahu untuk menyusuri pasar. Pemandu lokal bisa menemani perjalanan dari dermaga.",
    wa: "6282152455182",
    ig: "lokbaintan",
    jamBuka: "05.00 - 09.00 WITA, setiap hari",
    harga: "Rp 10.000 - 250.000",
    produk: [
      { nama: "Sewa jukung 1 jam", harga: "Rp 200.000", catatan: "maksimal 3 orang" },
      { nama: "Paket sunrise 2 jam", harga: "Rp 250.000", catatan: "termasuk pemandu" },
      { nama: "Sarapan di atas jukung", harga: "Rp 35.000", catatan: "nasi, lauk, dan kopi" },
      { nama: "Kerupuk ikan 250 g", harga: "Rp 25.000" },
      { nama: "Pisang susu satu sisir", harga: "Rp 15.000" },
      { nama: "Kopi Lok Baintan", harga: "Rp 10.000", catatan: "disajikan di perahu" },
      { nama: "Kue tradisional bungkus", harga: "Rp 10.000", catatan: "isi 3 kue" }
    ],
    ulasan: [
      ["Hidayatullah", "Berangkat jam lima pagi dan pasar sudah ramai. Pemandunya hafal cerita tiap pedagang, jadi perjalanan terasa lebih hidup.", 5],
      ["Noor Aisyah", "Kerupuk ikannya renyah dan harganya murah. Bawa uang tunai kecil karena transaksi langsung di atas perahu.", 5],
      ["Rendy Pratama", "Pengalaman yang layak dicoba sekali seumur hidup. Perahu kecil, jadi tas bawaan sebaiknya tidak terlalu banyak.", 4]
    ]
  }
];

async function getItems() {
  const res = await fetch(base + "/api/umkm");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Gagal membaca daftar usaha (" + res.status + ")");
  return Array.isArray(data.items) ? data.items : [];
}

async function removeSeedItems(items) {
  const seeds = items.filter((item) => typeof item.ownerId === "string" && item.ownerId.startsWith("seed-"));
  for (const item of seeds) {
    try {
      const res = await fetch(
        base + "/api/umkm?id=" + encodeURIComponent(item.id) + "&owner=" + encodeURIComponent(item.ownerId),
        { method: "DELETE" }
      );
      const data = await res.json().catch(() => ({}));
      console.log(res.ok ? "HAPUS " + item.nama : "GAGAL HAPUS " + item.nama + " - " + (data.error || res.status));
    } catch (err) {
      console.log("GAGAL HAPUS " + item.nama + " - " + err.message);
    }
  }
  return seeds.length;
}

async function addReviews(businessId, reviews) {
  for (const [nama, pesan, bintang] of reviews) {
    const res = await fetch(base + "/api/umkm", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: businessId, nama, pesan, bintang })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.log("  GAGAL ULASAN " + nama + " - " + (data.error || res.status));
    }
  }
}

async function main() {
  let items = await getItems();

  if (replace) {
    const removed = await removeSeedItems(items);
    console.log("Menghapus " + removed + " entri seed lama.\n");
    items = [];
  }

  const existing = new Set(items.map((item) => item.ownerId));

  for (const sample of samples) {
    if (existing.has(sample.ownerId)) {
      console.log("LEWATI " + sample.nama + " (sudah ada)");
      continue;
    }
    try {
      const res = await fetch(base + "/api/umkm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sample)
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 201) {
        console.log("OK     " + sample.nama);
        if (data.item && Array.isArray(sample.ulasan)) await addReviews(data.item.id, sample.ulasan);
      } else {
        console.log("GAGAL  " + sample.nama + " - " + (data.error || res.status));
      }
    } catch (err) {
      console.log("GAGAL  " + sample.nama + " - " + err.message);
    }
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
