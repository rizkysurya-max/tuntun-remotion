# Alur kerja video Tuntun

Disusun dari pesan Simon, `ATURAN-PRODUKSI.md`, dan kode 20 proyek video Remotion. Yang bukan ucapan Simon ditandai **(cara kerja saya)**. Kalau bertentangan, ucapan Simon yang paling baru menang.

## 1. Mulai
- **Simon mengirim naskah**, saya buatkan folder dan naskah siap VO.
- **Folder episode empat:** `01_VO`, `02_File Premiere`, `03_Hasil`, `04_Asset`. Semua kebutuhan episode ada di dalamnya.
- **Naskah tidak disentuh**.
- **VO datang**, saya buatkan Studio dan subtitle.
- **Tanyakan screenshot aplikasi yang dibutuhkan**. Aset aplikasi di video lama dipakai kalau cocok.
- **Semua referensi kiriman disimpan** ke `04_Asset` dan dipakai.

## 2. VO, subtitle, watermark
- **VO dipasang di Remotion**, begitu juga subtitle dan watermark. Semua 20 proyek memang memuat VO.
- **Waktu kata** dari MMS forced alignment, diperiksa lewat `cek-subtitle.html` seperti Video 10.
- **Subtitle:** Plus Jakarta Sans Bold 35, satu baris, ungu brand, dengan sorotan supaya terbaca. Kalimat yang tidak muat dipecah.
- **Intro dan outro** ikut dipasang. Simon mengedit akhirnya di Premiere.

## 3. Pelajari dulu, baru ide visual
- **Pelajari semua video dan semua referensi yang pernah dikirim**, bukan hanya video terakhir.
- **Bukan untuk ditiru**, tapi supaya kesalahan yang sama tidak diulang dan hasilnya minimal setara video yang sudah jadi.
- **Value Investing 01 dan 03 bukan acuan visual** karena ditolak, juga gaya 2D flat-nya. Aturan dari VI 04 dan 05 tetap dipakai.
- **Ide visual menggambarkan naskah**, punya memory anchor, dan jangan terlihat seperti membaca buku.
- **Storyboard hanya kalau diminta**.
- **Hitungan akurat** memakai DrawBot, TikZ, p5.js. Ikon dan ilustrasi dari Flaticon, Freepik, dan sejenisnya.

## 4. Susunan dan layer, seperti After Effects
Permintaan Simon: semua video digambar dengan cara yang sama, per layer, supaya bisa ia edit sendiri di Studio. Acuan: `SupportResistance_ID.aep` dan `Chart Pattern.aep`.

**Folder dan comp**
- **Satu Studio untuk semua video baru**, satu alamat tetap. Video lama (4.0.454) tetap di proyeknya masing-masing.
- **Panel Project bertingkat seperti Finder**:
  - `025. Value Investing` (tema)
    - `Video 04 - Biarkan Mr. Market Melayanimu` (judul)
      - `Render` (comp video jadi, isinya hanya scene)
      - `Scene`
        - `Scene 1`
          - comp `Scene 1`
          - isi scene (`Chart`, `Rumah`, …)
          - `Bersama` (panel, chip, dan objek pendukung scene itu)
        - `Scene 2`, dan seterusnya, masing-masing dengan `Bersama`-nya sendiri
      - `Uji` (percobaan, dihapus sebelum video selesai)
- **Nama di kode memakai kode video** karena tidak boleh kembar: `VI04-S01-Rumah`. Di panel Project tampil `Rumah`.
- **Folder kode sama susunannya:** `025. Value Investing/Video 04 - …/remotion/Scene-1/Bersama/Panel.tsx`.
- **Tiap video dimuat sendiri** (`muat(() => require(…))`), supaya satu video rusak tidak menutup video lain.
- **Kode tinggal di folder episodenya**, satu Studio dibuka dari `002. Januari 2026`. Tidak ada berkas episode di luar folder episodenya. Diuji di proyek contoh: gambar sama persis, layer tetap bisa diedit.
- **Scene besar dipecah** jadi comp isi, misalnya judul, chart, zona, panel.
- **Objek satu kesatuan = satu comp**, bukan satu layer. Rumah (atap, dinding, pintu, jendela, tanah), panel, chart, chip, ponsel, tokoh. Bagiannya tetap layer sendiri di dalam comp.
- **Di scene objek itu satu baris.** Klik di kanvas memilih utuh, klik dua kali di daftar layer masuk ke isinya.
- **Ukuran comp = ukuran objeknya**, ditambah ruang kalau ada glow.
- **Gerak objek utuh di scene, gerak bagian di dalam comp.**
- **Tidak ada comp duplikat**. Objek yang sama dengan scene sebelumnya tetap satu comp, tinggal di scene pertama yang memakainya, dan scene berikutnya mengambil dari sana. Diubah sekali, berubah di semua scene.
- **Panel yang sama:** panelnya tetap, isinya yang berganti.
- **Kamera dan latar punya layer sendiri**, terpisah dari gambar.
- **Tidak ada comp sisa versi lama.**

**Layer**
- **Satu bagian = satu layer.** Berlaku untuk teks, chip, glow, garis, panah, ikon, foto, panel, tepi panel, grid, sumbu, dan candle.
- **Teks:** satu baris = satu layer. Kalau katanya muncul satu per satu, tiap kata jadi layer.
- **Satu chip = satu comp berisi tiga layer:** teks, chip, chip glow.
- **Candle:** yang muncul atau disorot sendiri jadi layer sendiri. Chart panjang dipecah jadi candle, volume, grid, sumbu harga, sumbu waktu.
- **Nama = bendanya**, ditulis langsung dan tidak kembar: `chip ticker`, `t ticker`, `garis support`. Tidak ada `Shape Layer 1`.
- **Urutan daftar seperti After Effects:** paling atas = paling depan. Dari atas: teks, chip, penanda dan garis, candle, sumbu dan grid, panel tepi, panel, panel glow, latar.
- **Di kode urutannya kebalikannya** (yang ditulis belakangan = di depan). Panel Studio yang membaliknya, jadi layer baru otomatis muncul paling atas.
- **Di comp `Render`:** scene terakhir paling atas.
- **Layer mulai saat animasinya mulai**, bukan dari awal scene.

**Supaya bisa diedit di Studio**
- **Angka ditulis langsung di layernya.** Tidak lewat konstanta (`T.x`), fungsi gerak bersama, spread, atau `.map()`, karena layernya jadi terkunci.
- **Teks diketik langsung** di dalam layer, tidak dirakit kode.
- **Keyframe ditulis di layer:** `interpolate(frame, [30, 90], …)` dengan `Easing.bezier(0.65, 0, 0.35, 1)`. `Easing.inOut(Easing.cubic)` membuat keyframe terkunci; selisih keduanya paling besar 0,95%.
- **DrawBot menghitung, lalu hasilnya ditulis sekali** ke layer. Sesudah itu tidak dibangkitkan ulang, supaya editan Simon tidak tertimpa.
- **TikZ:** satu gambar = satu comp, satu bagian = satu layer. **p5:** posisi layer bisa diedit, bentuknya tetap dihitung. Kanvas p5 utuh hanya untuk tekstur latar.
- **Yang tetap satu layer:** subtitle dan VO, karena isinya dari data.
- **Gerbang:** `_fondasi/alat/cek-layer/cek-layer.mjs` harus 0 temuan sebelum scene dikirim.

## 5. Bangun per scene
- **Satu scene dulu, tunggu setuju Simon, baru scene berikutnya**.
- **Lanjut tanpa menunggu hanya kalau Simon bilang**.
- **Kesalahan yang dikomplain di satu scene tidak boleh terulang di scene berikutnya**.
- **Kirim gambar tiap perubahan**, kecuali Simon bilang mau cek sendiri.
- **Yang tidak diminta tidak diubah**, cukup dilaporkan.

## 6. Gerak dan transisi
- **Semua animasi 60 frame** (keyframe di frame 1 dan 60), dipusatkan di katanya. Gerak karakter dikecualikan.
- **easeInOut cubic** untuk swipe dan transisi, **easeOutBack** untuk pop.
- **Pop dari skala 0 ke 100** untuk ikon, tag, dan bentuk bulat. Semua garis pakai trim path, garis titik jadi garis putus-putus 3–5 px.
- **Kombinasikan morf, swipe, pop, dan zoom** menurut bentuknya. Jangan semua pop out.
- **Bentuk yang sama dipakai lagi di adegan berikutnya**, dua bentuk sama digabung. Objek yang bisa dipakai jadi bahan adegan berikutnya.
- **Swipe sampai keluar frame** dan **bersamaan** dengan adegan berikutnya. Pop in mulai saat swipe adegan lama sudah setengah.
- **Tanpa blank frame, tanpa jeglek, tanpa animasi yang tidak ada artinya**.
- **Hirarki layer tidak berubah** selama transisi.

## 7. Layout dan tampilan
- **Rata tengah**, antar visual dan ke frame, horizontal dan vertikal. Batas bawah frame = bagian teratas teks subtitle.
- **Jarak konsisten:** pakai satu angka di seluruh video. Tidak ada tumpang tindih.
- **Ketebalan garis satu angka untuk seluruh video**. Angkanya boleh berapa saja asal sama.
- **Visual besar**, isi scene tidak kosong, tidak terlalu sederhana.
- **Teks sedikit**, ilustrasi dan ikon diperbanyak. Yang bisa satu baris jangan dua baris.
- **Warna brand**, tidak bertabrakan.
- **Sorotan aplikasi diperbesar**, cukup 15%.
- **Latar mengikuti arahan Simon per video.** Terakhir: putih dengan grid, VI 06. Sebelumnya: VI 04 putih dengan grid, VI 05 putih, I101 V06 warna video 2 dan 3, I101 V05 abu dengan grid seperti video 4.
- **Gaya gambar:** orang asli dan ikon ilustrasi. Tokoh flat hanya untuk analogi, lalu gaya flat ditolak. Guru berjas tidak dipakai untuk "investor".
- **Rincian lain** (chart, data, quote, ponsel, tipografi) ada di `ATURAN-PRODUKSI.md` dan feedback per video.

## 8. Audit sesudah seluruh video selesai
- **Audit dilakukan sesudah semua scene selesai**.
- **Yang dicek:** alignment, jarak, tumpang tindih, warna, 60 frame, ease, jeglek, blank frame, sinkron dengan VO, garis, teks, semua brief sebelumnya.
- **Alat (cara kerja saya):** `audit-gerak`, `audit-60f.py`, `ukur-tata`, `audit-tabrakan`, `jeglek.py`, `hilang-dom.py`, `cek-layer`, ukur visual. Angka toleransi alat (±3 px, 4 px, 40/24 px) bukan aturan Simon.
- **Laporan singkat per poin dan jujur**, tanpa laporan palsu.

## 9. Koreksi Simon
- **Simon melihat hasil di Studio** dan mengirim brief seluruh video, lalu brief per scene.
- **Dikerjakan berurutan dari scene 1 poin 1**, tidak lompat, tidak ada poin yang terlewat.
- **Screenshot hanya contoh:** berlaku ke seluruh video.
- **Komentar di Studio:** tekan C, klik objek, tulis. Setelah selesai tekan **Kirim ke Claude**, baru dikerjakan berurutan dan dibalas di tiap komentar. Yang belum dikirim tidak disentuh.
- **Yang dikerjakan otomatis hanya isi video itu.** Hapus, pasang, video lain, atau komentar dua arti ditanyakan dulu.

## 10. Serah
- **Render penuh dikerjakan Simon**.
- **Studio dinyalakan ulang saat Simon minta**, dan tidak diputus saat Simon merender.
- **Rapikan folder** dari berkas buatan saya yang tidak dipakai, bukan buatan Simon.

## 11. Cara saya bekerja
- **Bilang dari awal kalau tidak bisa**.
- **Jangan menanyakan hal yang sudah pernah dijawab**: cari dulu di pesan, aturan, dan video lama.
- **Arahan yang sama tidak boleh perlu diulang**.
- **Editan Simon tidak ditimpa**.
- **Skill cinetic, huashu-motion, reanimate** hanya kalau Simon menyebut namanya.

## Aturan lama yang sudah diganti
- **Gambar sekaligus dalam satu komponen** → per layer, objek satu kesatuan satu comp.
- **Satu Studio per episode** → satu Studio untuk video baru.
- **Remotion 4.0.454** → 4.0.546 untuk video baru.
- **Subtitle tanpa sorotan** → dengan sorotan.
- **VO tidak dipasang di Remotion** (catatan lama saya) → dipasang, seperti di semua 20 proyek.
