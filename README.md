# Tuntun Remotion

Studio dan aturan produksi video edukasi Tuntun di Remotion 4.0.546. Susunannya meniru After Effects: folder → comp → layer, dan tiap layer bisa diedit langsung di Studio.

## Menjalankan
Perlu Node 20.11 ke atas.

```bash
npm ci
```

```bash
npm run studio
```

Studio terbuka di `http://localhost:3030`. Video contoh ada di folder `000. Contoh`.

## Isi
| Folder | Isi |
|---|---|
| `_fondasi/ALUR-KERJA.md` | urutan kerja satu video, susunan folder, comp, dan layer |
| `_fondasi/ATURAN-PRODUKSI.md` | aturan naskah, VO, animasi, transisi, layout, visual, chart, aplikasi |
| `_fondasi/PRINSIP-*.md` | alasan di balik aturan animasi dan desain |
| `_fondasi/studio` | Studio Tuntun: panel ala After Effects, urutan layer, seleksi dan rata ala Illustrator, komentar, Kirim ke Claude |
| `_fondasi/gambar` | alat gambar p5.js dan TikZ per bagian |
| `_fondasi/alat/cek-layer` | pemeriksa: tiap bagian layer sendiri dan bisa diedit |
| `_fondasi/alat/ukur-visual` | ukur objek kecil, frame kosong, diam, teks telat |
| `_fondasi/skrip` | sinkron VO, subtitle, dan audit (disalin dari Video 06; jalur berkasnya mengikuti proyek itu, sesuaikan sebelum dipakai) |
| `studio` | pintu masuk Studio: daftar tema dan video |
| `000. Contoh` | contoh susunan satu video |

## Susunan satu video
```
025. Value Investing                    tema
└ Video 07 - Judul                      judul
  ├ 01_VO  02_File Premiere  03_Hasil  04_Asset
  └ remotion
    ├ index.tsx                         daftar folder dan comp
    ├ Render.tsx                        video jadi, hanya berisi scene
    ├ Scene-1
    │ ├ S01.tsx  Chart.tsx  Rumah.tsx
    │ └ Bersama                         panel, chip pendukung scene itu
    └ Scene-2 …
```
Video baru: salin `000. Contoh/Video 01 - Contoh`, ganti kode `CT01`, lalu tambah satu baris di `studio/Root.tsx`.

## Aturan layer yang wajib
- Satu bagian satu layer. Objek satu kesatuan satu comp. Tidak ada comp duplikat.
- Angka, teks, dan keyframe ditulis langsung di layernya. Konstanta, fungsi gerak bersama, dan `.map()` membuat layer terkunci.
- Semua gerak 60 frame: `Easing.bezier(0.65, 0, 0.35, 1)` untuk gerak, `Easing.out(Easing.back())` atau `Easing.bezier(0.34, 1.56, 0.64, 1)` untuk pop.
- Nama layer = nama bendanya, tidak kembar.

Periksa sebelum scene dikirim:
```bash
npm run layer -- "000. Contoh/Video 01 - Contoh/remotion/Scene-1/S01.tsx"
```

## Yang tidak ikut
VO, aset, hasil render, dan proyek Premiere tidak diunggah. Skill pihak ketiga juga tidak disalin; daftarnya ada di `_fondasi/skills-lock.json`. Remotion dan pustaka lain memakai lisensinya masing-masing.
