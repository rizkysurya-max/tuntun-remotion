# Aturan Produksi Video Tuntun

Dirangkum dari ucapan Simon sendiri selama semua episode, dari Mei sampai November. Pasangan dokumen ini: `ALUR-KERJA.md` (urutan kerja, susunan folder dan layer). `PRINSIP-ANIMASI.md` dan `PRINSIP-DESAIN.md` menjawab kenapa; dokumen ini menjawab berapa, kapan, dan jangan.

## 0. Kalau aturan bertentangan
1. Instruksi Simon paling baru yang spesifik untuk bagian itu.
2. Aturan yang Simon tetapkan untuk episode itu.
3. Aturan umum di dokumen ini.
4. Kebiasaan dari episode lama.

## 1. Cara bekerja
**Brief**
- **Baca brief dengan teliti, kerjakan semua butir**, tidak ada satu pun yang terlewat.
- **Berurutan dari scene 1 poin 1.** Satu selesai baru lanjut, jangan lompat-lompat.
- **Buat daftar centang**, dan centang hanya sesudah tiap poin diperiksa.
- **Screenshot dan contoh berlaku ke seluruh video.** Semua screenshot koreksi = hal yang belum benar.
- **Koreksi yang pernah diberikan berlaku terus**, juga untuk scene dan video berikutnya. Simon tidak mau mengulang brief yang sama.
- **Adegan atau objek yang sama di tempat lain ikut diperbaiki** ketika satu diperbaiki.
- **Brief besar harus menghasilkan perubahan besar**, bukan membuat ulang visual yang sama.
- **Tuntaskan proses yang sedang jalan dulu** sebelum menerapkan brief baru. Brief yang belum boleh dikerjakan disimpan dulu.

**Batas pekerjaan**
- **Ubah hanya yang diminta.** Objek lain, scene yang sudah disepakati, dan yang sudah benar dipertahankan.
- **Pastikan scene dan video sasarannya benar** sebelum mengubah.
- **Simon sedang bertanya, berdiskusi, atau minta menunggu:** jawab saja, jangan langsung generate.
- **Jangan tanya hal yang sudah pernah dijawab.** Pakai cara yang sudah terbukti di episode sebelumnya.
- **Cacat yang ditemukan dilaporkan.** Pada tahap perbaikan bug, yang ditemukan sendiri ikut diperbaiki.
- **Permintaan berpola diterapkan ke satu adegan dulu** untuk direview, baru ke seluruh video.
- **Buat visualnya dulu, baru animasinya.**
- **Scene lama dihapus** ketika scene baru dibangun.

**Laporan**
- **Jujur per butir.** Yang belum dikerjakan dibilang belum. Jangan membuat laporan palsu atau mengejar selesai dengan segala cara.
- **Crosscheck seluruh video** sebelum bilang selesai.
- **Pastikan yang Simon lihat memang sudah berubah.** Simon menilai di Studio.
- **Laporan singkat per poin**, pertanyaan Simon dijawab singkat dan dijawab dulu sebelum melanjutkan kerja.
- **Preview berupa gambar** untuk perubahan visual, kecuali Simon bilang mau mengecek sendiri.
- **Bilang kalau tidak bisa**, Simon akan membuatnya manual.
- **Selalu Bahasa Indonesia.**

**Belajar dan bahan**
- **Pelajari semua video dan semua referensi yang pernah dikirim** sebelum membangun atau memperbaiki. Bukan untuk ditiru, tapi supaya kesalahan tidak terulang dan hasilnya minimal setara video yang sudah jadi.
- **Layout mengikuti referensi kiriman.** Kalau kurang, cari tambahan sendiri (Pinterest, YouTube, Behance).
- **Gambar referensi = contoh layout dan gaya**, bukan disalin jadi visual. Gambar yang diminta dipakai diikuti persis.
- **Pelajari naskah dan pembahasannya di internet**, lalu tentukan aset seluruh scene dulu supaya visual tidak banyak berulang.
- **Sebutkan bahan yang kurang** (screenshot aplikasi, stok foto, pose tokoh). Simon yang menyediakan atau men-generate. Prompt gambar ditulis dalam Bahasa Indonesia.
- **Jangan kembali ke mode default:** layout PPT, banyak fade in/fade out, asal bangun.

**Waktu dan perangkat**
- **Simon sedang tidak ada:** lanjut ke scene berikutnya kalau ia bilang begitu; yang butuh persetujuan dikumpulkan sebagai pertanyaan.
- **Patuhi jam berhenti.** Simpan semua proses supaya bisa dilanjutkan besok.
- **Kerjakan perlahan tidak masalah** asal hasilnya benar.
- **Hanya memakai laptop Simon ini.**
- **Semua berkas episode di folder episodenya.** Bersihkan hanya berkas buatan saya yang tidak dipakai, dan video harus tetap bisa dijalankan ulang.

## 2. Naskah dan VO
- **Naskah tidak diubah.** Untuk generate VO hanya pemisah barisnya yang diatur. Kirim teks ucapnya saja, siap disalin.
- **Naskah direvisi:** bandingkan dengan yang lama, sebut bagian mana yang perlu VO baru. Kalimat yang dihapus ikut dihapus dari VO, subtitle, dan visual.
- **VO di-generate Simon.** Visual menunggu VO.
- **VO yang dikirim harus benar-benar terpasang**, termasuk di preview. VO scene lain tidak ikut terdengar.
- **Sinkron akurat:** visual, VO, dan subtitle. Visual berganti tepat saat VO mengucapkannya.
- **Jeda VO:** tambah kalau visual atau kutipan perlu waktu dibaca, kurangi kalau terlalu lama. Antar kalimat sekitar 10–20 frame, akhir scene sekitar 30 frame.
- **Tempo jangan terlalu pelan.** Lonjakan volume diperbaiki, kata yang terlalu pelan diperbesar.
- **Sambungan VO mulus**, tanpa sisa tarikan napas.
- **Catatan di dalam naskah diikuti.** Ide visual di naskah hanya panduan; buat ide sendiri yang menggambarkan naskah.
- **Bagian di atas 5 detik dipecah** jadi 2–4 ide visual.

## 3. Subtitle
- **Plus Jakarta Sans Bold 35, satu baris, ungu brand.**
- **Diberi sorotan seperti highlight** supaya terbaca; ikuti arahan per video.
- **Dipisah setelah koma, titik, dan tanda tanya.** Kalimat yang tidak muat dipecah, mengikuti pembagian baris naskah Simon.
- **Waktu dari MMS forced alignment**, diperiksa lewat `cek-subtitle.html`.
- **Alatnya sama di setiap video**, langsung dimasukkan ke Remotion.
- **Subtitle 5 bahasa** (ID/EN/CH/JP/KR): SRT saja, waktunya sama persis dengan video final, kode saham tetap, aksara China yang sederhana, satu folder dengan subfolder per judul, disertai PDF untuk dicrosscheck.

## 4. Animasi
- **Semua animasi 60 frame:** keyframe 1 di frame 1, keyframe 2 di frame 60. Dipusatkan di kata pemicunya.
- **Gerakan karakter dikecualikan** dari 60 frame dan dari ease.
- **easeInOut cubic** untuk swipe, fade, dan gerak lain. **easeOutBack** untuk pop masuk, pop keluar kebalikannya (easeInBack). Tidak ada animasi tanpa ease.
- **Pop = skala 0 ke 100** dari tengah. Anchor tepat di tengah visual.
- **Pop untuk yang bulat dan kecil:** ikon, tag, uang, panel kecil. Jangan semuanya pop; pilih trim path, swipe, atau morf menurut bentuknya.
- **Yang cocok swipe + fade jangan dibuat pop.**
- **Yang sudah skala dari 0 atau swipe masuk tidak perlu opacity.** Kecuali teks: opacity dan swipe bersamaan.
- **Garis dan garis putus-putus = trim path.** Garis penghubung muncul sesudah semua ikon atau tokoh muncul.
- **Teks:** per kata, opacity dan swipe bersamaan, dengan motion blur, tanpa masking. Kalau teks di dalam box, maskingnya seukuran box.
- **Teks yang berdiri sendiri dibuat besar**, baru mengecil saat memberi tempat ke visual.
- **Box teks:** skala lebar 0 ke 100 easeOutBack, tinggi tetap.
- **Highlight kata** tumbuh dari kiri ke kanan.
- **Yang bergerak di dalam panel atau dashboard dimasker tepat di dalam outline.**
- **Bagian yang berbeda punya anchor sendiri** (teks, ikon, box), tetapi bagian dari satu objek bergerak bersama.
- **Satu per satu dibedakan posisi berhenti atau mulainya**, bukan keyframenya.
- **Elemen muncul di tengah dulu, lalu bergeser** bersamaan dengan pop isi berikutnya, supaya kelompoknya selalu di tengah.
- **Satu kelompok memakai jenis animasi yang sama** dan keluar dengan arah yang sama, bersamaan.
- **Muncul, disorot, di-zoom, atau diklik tepat saat VO menyebutnya.** Ikon yang disebut diberi highlight.
- **Elemen yang sudah ada cukup ditegaskan**, tidak perlu dimunculkan ulang.
- **Setiap objek punya animasi masuk dan keluar.** Tidak muncul, hilang, atau berpindah tiba-tiba.
- **Jangan terlalu cepat dan jangan terlalu lambat.** Visual ditahan sampai kalimatnya selesai.
- **Layar tidak boleh diam lama.** Isi dengan ilustrasi, bukan teks.
- **Hapus gerakan yang tidak ada artinya:** geser, zoom, putaran, denyut, idle yang tidak perlu.
- **Kamera dan motion blur hanya kalau diarahkan Simon**, kecuali motion blur pada teks dan transisi ganti latar.
- **Tidak boleh jeglek, patah-patah, atau kaku.** Alat pemeriksa harus peka; jangan langsung menyalahkan Remotion.
- **Aksi yang disebut VO benar-benar terjadi di layar** sampai ada akibatnya.
- **Gerak yang saling terkait berjalan bersamaan**, bukan bergantian. Isi panel ikut mengecil dan membesar bersama panelnya.
- **Uang:** gambar uang dulu, baru nominalnya. Saat angka di-swipe, "Rp" tetap diam.
- **Foto orang masuk dengan swipe ke atas di dalam masker**, bukan pop, dan keluar dengan swipe ke bawah.

## 5. Transisi
- **Keluar dan masuk bersamaan.** Tidak boleh ada blank frame, termasuk di awal adegan.
- **Swipe bersamaan dengan adegan berikutnya** dan digeser sampai benar-benar keluar frame, bukan geser sedikit lalu fade.
- **Pop adegan baru mulai saat adegan lama yang di-swipe sudah setengah jalan.**
- **Analisis bentuk dulu, baru pilih transisi.** Kombinasikan morf, swipe, pop, dan zoom. Yang bisa morf jangan dibuat swipe.
- **Objek berbentuk sama dipakai lagi** di adegan berikutnya; dua bentuk sama digabung jadi satu. Objek, visual, atau teks yang bisa dipakai jadi bahan adegan berikutnya.
- **Yang bermorf adalah panel atau lingkarannya sendiri.** Satu objek saja yang terlihat, tidak ganda. Isinya keluar bersamaan. Beberapa panel menuju satu panel harus menyatu.
- **Morf satu gerakan**, langsung ke layout berikutnya, tidak berhenti dulu di tengah.
- **Arah swipe bervariasi** sesuai bentuk dan layout, jangan semua kiri-kanan.
- **Zoom in dan zoom out boleh.** Saat zoom out hanya candle yang menyusut, waktu dan harga tetap; contohnya adegan lama 100 ke 70% sambil memudar, adegan baru 130 ke 100% sambil muncul.
- **Elemen yang dipakai lagi tidak dibangun ulang**, dibuat berkelanjutan.
- **Jangan semua keluar dengan pop out** atau fade out.
- **Tidak ada sisa objek lama** di adegan baru, dan tidak ada tumpang tindih saat transisi.
- **Hirarki layer tidak berubah** selama transisi.
- **Transisi shape** memakai dua bentuk (2 lingkaran atau 2 kotak) seperti di video TA, warna brand, dan jangan terlalu sering.
- **Paralaks dan dua kotak:** adegan lama ikut swipe dengan ease in cubic, tidak perlu sampai keluar frame, shape dan adegan baru easeInOut cubic. Ini pengecualian khusus dari aturan ease.
- **Transisi masking harus membedakan warna latar** sebelum dan sesudahnya. Pergantian warna latar lewat film dissolve atau tint, tidak ikut di-swipe.
- **Paralaks hanya untuk pindah lingkungan di adegan analogi**, tidak untuk video tanpa tokoh.
- **Transisi yang sudah pernah dibuat di video lama dipakai sama.**

## 6. Layout
- **Rata tengah:** antar visual dan ke frame, horizontal dan vertikal. Batas bawah frame = bagian teratas teks subtitle.
- **Ukur dengan garis bantu** dan hitungan akurat (DrawBot, TikZ, p5.js). Guide harus benar-benar dipakai.
- **Jarak konsisten di seluruh video**, tidak mepet, beri ruang napas.
- **Tidak ada tumpang tindih.** Urutan tumpukan benar.
- **Visual besar sampai mendekati safe margin**, tidak kosong, tidak menyisakan ruang di atas. Jangan panel besar berisi ikon kecil.
- **Yang bisa satu baris jangan dua baris.**
- **Elemen sejenis seragam:** ukuran ikon, tag, panel, radius.
- **Isi panel, lingkaran, dan highlight tepat di tengah.** Isi tidak keluar dari panelnya.
- **Label di bawah ikon.**
- **Urutan visual mengikuti urutan VO:** kiri ke kanan, atau atas ke bawah untuk langkah bertahap.
- **Hirarki visual jelas.** Panel atau teks yang tidak punya fungsi dihapus. Tidak semua adegan perlu panel, dan judul tidak wajib.
- **Jangan seperti PowerPoint.** Adegan yang terlalu penuh dikurangi isinya.
- **Adegan analogi fullscreen**, latar penuh tanpa celah di sisi.
- **Split screen punya batas yang jelas.**
- **Safe area = batas layout**, bukan alasan memotong visual. Tidak ada yang terpotong.
- **Safe area:** kiri 96, kanan 96, atas 54, bawah 108, zona logo 360×150 kanan atas.
- **Tidak ada artefak**, misalnya noda di tepi panel atau garis 1 px.
- **Tampilan yang tidak terlihat dampak perbaikannya didesain ulang.**

## 7. Visual
**Makna**
- **Bisa dipahami orang awam, dengan atau tanpa suara.** Lewat ilustrasi, bukan menambah teks.
- **Menggambarkan naskah dengan benar**, tidak terlalu simpel, tidak membosankan. Ide tiap adegan baru, tidak mengulang. Ide yang tidak terbaca dibuat ulang.
- **Lima pertanyaan untuk tiap scene:** apa pesan utamanya, apa cara paling sederhana menunjukkannya, apakah orang awam mengerti, apakah masuk akal tanpa suara, apakah lebih mudah dipahami dari yang lama. Kalau belum memuaskan, cari cara lain.
- **Teks sedikit.** Hapus judul, nomor, label nama, "angka ilustrasi", "kamu", teks di bawah nama, dan teks dobel.
- **Hal yang disebut naskah diberi ilustrasi atau ikonnya sendiri.** Istilah dan angka kunci diberi ikon.
- **Punya memory anchor** yang relatable.
- **Teks layar Bahasa Indonesia**, kecuali istilah teknis yang diucapkan VO.
- **Plus Jakarta Sans**, judul ExtraBold.
- **Tidak ada placeholder**, lingkaran kosong, atau garis putus-putus tanpa isi.

**Ikon dan aset**
- **Ikon dan ilustrasi dari Flaticon, Freepik, dan sejenisnya**, diunduh atau di-trace sama persis. Jangan unDraw.
- **Ikon 100% menggambarkan poinnya** dan tidak ada yang sama.
- **Aset kiriman Simon wajib dipakai.** Aset dari video lama dipakai kalau cocok.
- **Kecerahan dan proporsi gambar kiriman tidak berubah**, tidak gepeng.
- **Cek bentuk asli benda di internet** sebelum menggambar.
- **Benda yang harus beraksi = ilustrasi** supaya bisa dianimasikan.
- **Aset realistis**, ukuran masuk akal terhadap benda lain. Ikon realistis hanya di panel kecil.
- **Aset baru berlatar transparan.** Potongan gambar orang tidak kasar, tanpa gradasi di kiri-kanan.
- **Objek yang sama konsisten** warna dan sumbernya di seluruh video.

**Warna dan garis**
- **Warna brand saja**, turunannya yang terang. Hindari abu-abu.
- **Warna tidak bertabrakan** dan tidak menyatu dengan latar. Item berbeda warnanya berbeda.
- **Hijau dan merah** untuk candle, order book, naik-turun, jual-beli. **Centang selalu hijau** dan di depan lingkarannya.
- **Ikon lingkaran:** lingkaran putih, outline warna lingkaran, ikon mengikuti warna outline.
- **Semua panel diberi outline. Ketebalan outline satu angka di seluruh video.**
- **Garis titik jadi garis putus-putus**, 3–5 px, ujung rounded.
- **Glow kecil.** Bayangan selalu di bawah layer objeknya.
- **Kata bold diberi warna pembeda.** Teks harus terbaca; teks putih di warna brand tidak diganti hitam sepihak.

**Latar**
- **Mengikuti arahan Simon per video.** Terakhir: putih dengan grid.
- **Latar adegan jangan diulang terlalu sering.** Tumbuhan dan isi latar diambil dari aset yang sudah ada.

## 8. Orang, tokoh, dan kutipan
- **Orang asli dan ikon ilustrasi.** Gaya korporat dan profesional. Konsep 2D flat ditolak.
- **Orang berbeda memakai gambar berbeda**, orang yang sama memakai gambar yang sama dan berkelanjutan antar adegan. Video TA yang sudah jadi tidak ditambah tokoh.
- **Guru = orang berjas dengan nametag.** Muncul sesekali di tempat yang pas, setengah badan. Untuk "investor" jangan pakai orang berjas itu.
- **Foto di lingkaran:** lingkaran masking dan lingkaran latar sama besar dan sama timing. Masker mengikuti lingkaran warna muda, bahu dan lengan tidak terpotong.
- **Foto orang besar setengah badan.** Jumlah orang digambarkan dengan menambah orang, bukan teks. Tanpa label nama.
- **Pertanyaan di dalam thinking bubble** di atas kepala, menghadap pembicaranya, bentuknya bersih. Teks di dalam bubble dimasker bubble-nya.
- **Setiap pertanyaan di layar memakai tanda tanya.**
- **Arah hadap sesuai lawan bicaranya.** Ekspresi tidak semuanya sedih. Pergantian ekspresi cut to cut.
- **Gerak tokoh natural**, tidak kaku, pose harfiah sesuai aksinya, terus berjalan selama transisi, masuk dengan berjalan dari luar frame. Tokoh dan bangunan berpijak pada garis yang sama.
- **Kutipan:** teks biasa Plus Jakarta Semibold/Medium, yang di-highlight dan nama Plus Jakarta Black. Ukuran dan jarak sama di seluruh video.
- **Highlight kutipan muncul sesudah semua teks muncul**, dan diberi jeda supaya terbaca.
- **Kalimat kutipan asli, sudah diverifikasi, dan berbahasa Indonesia.** Tanda petik penutup mengikuti panjang kalimat.

## 9. Chart dan data
- **Setiap line chart diganti candlestick**, kecuali Simon meminta line chart (misalnya untuk PE).
- **Realistis seperti pasar asli**, animasinya mengikuti video TA, tidak terlalu cepat, tanpa opacity pada candle.
- **Candle tumbuh kiri ke kanan**, volume ikut. Chart diam, gerak besar hanya di penanda.
- **Ada skala harga, timeline, volume, dan grid**, di dalam panel atau dashboard, bukan di ponsel. Batas antar chart jelas, tidak terlalu penuh.
- **Data kiriman Simon dipakai apa adanya.** Kalau menyebut data asli, datanya harus asli.
- **Kasus nyata = ticker asli. Saham contoh = kode ilustrasi.** Tanpa disclaimer.
- **Angka dan klaim diverifikasi dulu**; yang belum ada di aplikasi divalidasi dari internet.
- **Harga tidak ditampilkan kalau bukan data nyata.** Naik-turun nilai digambarkan dengan nominal yang bertambah atau berkurang, bukan ikon membesar.
- **Harga konsisten antar scene**, angka bulat tanpa ".0". Angka baru diterapkan di semua adegan yang memuatnya.
- **Target, stop loss, dan penanda lain memakai warna brand**, bukan hijau-merah.
- **Rentang waktu digambarkan dengan timeline**, bukan teks, dan diberi tahun tambahan supaya tepat di tengah. Tag tahun sesuai timeline.
- **Garis, lingkaran, dan panah mengikuti candle dengan akurat.**

## 10. Tampilan aplikasi
- **Ponsel sama dengan video lain**, gaya flat, tanpa jam dan baterai.
- **Sorotan diperbesar sekitar 15%**, tidak harus dipisah dari ponselnya, tepat saat VO menyebutnya. Zoom hanya ke bagian yang dimaksud. Jangan menyorot yang tidak perlu.
- **Saat sorotan membesar, outline di ponsel dihapus** karena ikut membesar. Kalau status bar dihapus, layarnya dinaikkan.
- **Ambil hanya bagian yang dibutuhkan.** Screenshot proporsional, tidak terpotong, berlatar putih, logo saham bulat.
- **Pakai versi terbaru**, dan cari dulu dari video lama.
- **Klik terlihat tombolnya tertekan**, tanpa ikon tangan, baru transisi ke hasilnya.
- **Pergantian layar cukup fade.** Buka aplikasi dari homescreen lalu menu.
- **Rekaman:** frame pertama di-freeze selama transisi, bagian yang perlu dibaca dibekukan, yang lambat dipercepat, bukan dipotong.
- **Sesudah klik, beri jeda singkat** untuk memperlihatkan hasilnya, dan hasilnya cocok dengan setting terakhir.

## 11. Intro, breakscene, outro, CTA
- **Intro dan outro memakai berkas kiriman Simon.** Intro tanpa latar tambahan.
- **Intro ke scene 1 dan scene terakhir ke outro: film dissolve**, tanpa blank frame dan tanpa warna latar yang tiba-tiba berubah.
- **Scene terakhir dan outro jadi satu sequence** supaya gampang diedit di Premiere.
- **Scene terpisah tetap dipertahankan** sesudah digabung jadi satu video.
- **Breakscene sekitar 2,5 detik termasuk transisi**, sama di seluruh video, keluarnya kebalikan masuk.
- **Outro mengantar ke video berikutnya**, gayanya sama dengan serinya.
- **CTA versi terbaru** di semua episode, letaknya mengikuti Technical Analysis Video 01.
- **Watermark selalu terlihat**, juga saat warna latar berubah.

## 12. Studio dan render
- **Studio selalu hidup.** Kalau mati, nyalakan lagi dan lanjutkan prosesnya. Jangan putus saat Simon merender.
- **Restart Studio** saat ada VO baru, saat pekerjaan dilanjutkan, atau saat Simon minta.
- **Render penuh dilakukan Simon.** Suara hasil render tidak boleh telat dari gambar.
- **Sebutkan berkas Remotion mana yang siap dirender.**
- **Jelaskan jeglek berasal dari preview atau dari animasinya.**
- **Audit sesudah seluruh video selesai dibangun.**

## 13. Thumbnail
- **Gradasi ungu dengan grid** seperti Investing 101, mengikuti contoh layout Simon.
- **Judul 100 px.** Jangan semua memakai panel; desain mengikuti judulnya.
- **Chart diambil dari video**, bukan chart asli.
- **Nama mengikuti nama video**, semua disimpan dalam satu folder.

## 14. Khusus episode atau seri
- **Investing 101 V02:** uang kertas hijau #7EC151 bergaya isometric dari aset kiriman; tag gold #FFCB56, menjadi merah #D51C39 sesudah dicoret.
- **Investing 101 V03:** ponsel di scene 1 dan adegan portofolio saja; dua panel ke satu panel memakai transisi menyatu.
- **Investing 101 V06:** siklus tokoh flat jalan 72 frame, lari 45 frame, rig tegak dengan garis bantu.
- **Value Investing 04:** VO scene 1 mulai di frame 30.
