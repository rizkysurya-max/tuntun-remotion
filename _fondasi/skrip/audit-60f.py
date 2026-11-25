#!/usr/bin/env python3
"""
AUDIT 60 f + EASE (11 Nov, Simon: "Pastikan kamu menggunakan ease, dan menggunakan 60frame untuk setiap animasi").
Memindai src/s0*/Scene0*.tsx (+ berkas tambahan di argv) untuk pemanggilan animasi yang durasinya BUKAN 60 f atau tanpa ease:
  cin/popIn/popOut/kataP/grow dengan argumen durasi ke-3 · R(…) / interpolate(…) mentah · gerakLunak(a, b) (bentang ≠ 60 f) ·
  Easing.linear · WordText d={…}. Tiap temuan dicetak berkas:baris + potongan kode. Kosong = lulus.
"""
import re, sys, glob, pathlib
POLA = [
    (r'\b(cin|popIn|popOut|grow|kataP)\(\s*[^,()]+,\s*[^,()]+(?:\([^()]*\))?[^,()]*,\s*[^)]', 'durasi ≠ 60 (argumen ke-3)'),
    # 13 Nov (VI V05): tanjakan manual klem((f - x) / N) dengan N ≠ 60 lolos dari pola lama (denyut 40 f S03)
    (r'klem\(\(f - [^/]*/\s*(?!60\b)\d+', 'klem((f - …) / N) bentang ≠ 60'),
    (r'\bR\(\s*f', 'R() mentah'), (r'\binterpolate\(', 'interpolate() mentah'), (r'gerakLunak\(', 'gerakLunak = bentang panjang'),
    (r'Easing\.linear', 'linear (tanpa ease)'), (r'<WordText[^>]*\bd=\{', 'WordText d≠60'),
]
berkas = sorted(glob.glob('src/s0*/Scene0*.tsx')) + sys.argv[1:]
n = 0
for b in berkas:
    for i, baris in enumerate(pathlib.Path(b).read_text().splitlines(), 1):
        if baris.strip().startswith(('//', '*', '/*')): continue
        for pola, ket in POLA:
            for m in re.finditer(pola, baris):
                n += 1; print(f'{b}:{i}  {ket}:  …{baris[max(0, m.start() - 20):m.end() + 50].strip()}…')
print(f'— {n} temuan')
