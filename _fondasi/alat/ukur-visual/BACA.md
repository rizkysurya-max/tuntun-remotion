# Ukur visual
Dua langkah, hanya membaca proyek:
1. Dari folder proyek Remotion: `node "<folder ini>/rekam.mjs" <komposisi> <folder keluaran> 6 > /dev/null` (VI06: 88 dtk, log peramban panjang → buang)
2. `OUTRO=300 python3 "<folder ini>/nilai.py" <folder keluaran> sync/vo-words.json src/cues.ts <VO_OFFSET> <frame tahan:panjang>` (VI06: `264 1366:30`)
Uji skrip: `python3 uji-nilai.py <folder ini> <folder sementara>` → 11 kasus harus LULUS.

| Nama | Arti | Asal ide |
|---|---|---|
| KECIL | objek terbesar < 1/3 tinggi area isi, diam ≥ 1 dtk | anything2explainer |
| KOSONG | nyaris tak ada benda > 1,5 dtk, atau kosong ≥ 0,2 dtk | anything2explainer |
| DIAM | tidak ada gerak > 3 dtk | anything2explainer |
| TELAT | tengah animasi teks > 0,25 dtk SESUDAH frasanya selesai diucapkan | anything2explainer, dilonggarkan untuk 60 f |
| SINGKAT | teks utuh < 1 dtk | anything2explainer |
| SAMBUNG | berapa banyak tinta yang bertahan tiap 6 f di batas adegan, 0–1 | onetake |

Temuan = calon, bukan vonis: SELALU lihat lembar gambarnya. Alarm palsu yang sudah dikenal: judul yang diulang di rangkuman (MUNGKIN-KATA-LAIN), panel bergaris sangat muda tidak terhitung sebagai objek, swipe bertemu di tengah memberi SAMBUNG rendah walau mulus.
