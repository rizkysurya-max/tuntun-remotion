# Gambar untuk Remotion: DrawBot · p5.js · TikZ (25 Nov 2026)
| Alat | Untuk | Cara | Bagian terpisah? |
|---|---|---|---|
| **DrawBot** | tata letak semua adegan | `_fondasi/.venv-drawbot/bin/python scripts/tata-s0x.py` → angka DITULIS LANGSUNG ke tiap layer sekali (bukan konstanta `T.x`) | ya, satu benda = satu layer |
| **p5.js** 1.11.13 | pola, partikel, noise, bentuk terhitung | `node _fondasi/gambar/pasang.mjs "<episode>"` → `useP5(seed)` = kalkulator, gambar SVG | ya |
| | sketsa p5 asli | `<P5Kanvas>` | tidak (satu gambar): hanya untuk tekstur latar |
| **TikZ** (node-tikzjax 1.0.5, tanpa LaTeX) | diagram geometri | `node _fondasi/gambar/tikz-ke-tsx.mjs x.tex src/gambar/X.gen.tsx` | ya, `%% bagian nama` → tambah `--comp src/comp/X.tsx <lebar>` = dibuatkan COMP-nya (satu gambar = satu comp, satu bagian = satu layer; ditulis sekali, tidak menimpa) |

- p5: jangan `millis()`, `frameCount`, `deltaTime`; pakai `frame` Remotion. `random`/`noise` selalu berseed → render selalu sama.
- TikZ: isi perintah saja; `%% kotak x0 y0 x1 y1` wajib; teks DITULIS DI REMOTION (Plus Jakarta Sans). Warna brand lewat `%% awalan \definecolor…`.
- Contoh: `contoh/rumah.tex`, `contoh/contoh-pemakaian.tsx.txt`, `contoh/hasil-uji.png`.
- Uji 25 Nov (Remotion 4.0.546): 540 frame sama persis pada 1 tab vs 5 tab; atap bergerak tanpa mengubah tanah (0 piksel).
- Lisensi: p5 LGPL-2.1, node-tikzjax LPPL-1.3c (dipakai saat membangun; hasil gambar milik kita).
- Pasang ulang pustaka: `cd _fondasi/gambar && npm ci --ignore-scripts`.
- Jebakan: macOS tidak membedakan huruf besar/kecil → jangan ada `a.ts` dan `A.tsx` sefolder. API `bundle()` menuntut folder `public` ada.
