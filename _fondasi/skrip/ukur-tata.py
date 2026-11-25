#!/usr/bin/env python3
"""
UKUR TATA LETAK (11 Nov) — dari still MODE UKUR (out/ukur-tata/fNNNNN.png, latar hijau kunci #00FF00).
Isi = piksel yang bukan hijau kunci (bayangan di atas hijau tetap dihitung hijau: G−max(R,B) ≥ 60 dan max(R,B) ≤ 90).
Untuk tiap frame dicetak (px FRAME PENUH 1920×1080):
  • kotak isi + PUSAT dan simpangannya dari (960, 540)        → tanda ! bila |dx| atau |dy| > AMBANG (default 6 px)
  • KELOMPOK mendatar: kolom tanpa isi ≥ CELAH px memisah kelompok → lebar tiap kelompok + JARAK antarkelompok
    → tanda ≠ bila jarak-jarak berbeda > 8 px (spacing tidak konsisten)
  • kelompok tegak dengan cara yang sama.
pakai: python3 scripts/ukur-tata.py [frame …]   (tanpa argumen = semua berkas)   · AMBANG=6 CELAH=24
      POTONG="x0,y0,x1,y1" (px frame penuh) = ukur bagian itu saja (mis. blok kutipan tanpa balok); pusat tetap dilaporkan terhadap (960, 540)
"""
import sys, glob, re, os
import numpy as np
from PIL import Image
AMBANG = float(os.environ.get('AMBANG', 6)); CELAH = int(os.environ.get('CELAH', 24))
POTONG = [float(v) for v in os.environ['POTONG'].split(',')] if os.environ.get('POTONG') else None
def isi_dari(p):
    a = np.asarray(Image.open(p).convert('RGB')).astype(int)
    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    return ((g - np.maximum(r, b)) < 60) | (np.maximum(r, b) > 90), 1920 / a.shape[1]
def kelompok(profil, k, celah):
    ada = profil > 0; out = []; i = 0; n = len(ada)
    while i < n:
        if not ada[i]: i += 1; continue
        j = i
        while j < n:
            if ada[j]: j += 1; continue
            # lubang: cek panjang
            h = j
            while h < n and not ada[h]: h += 1
            if h - j >= celah / k or h >= n: break
            j = h
        out.append((i * k, j * k)); i = j
    return out
def laporan(p):
    f = int(re.search(r'f(\d+)', p).group(1))
    isi, k = isi_dari(p)
    if POTONG:
        x0p, y0p, x1p, y1p = [int(v / k) for v in POTONG]; m = np.zeros_like(isi); m[y0p:y1p, x0p:x1p] = True; isi = isi & m
    ys, xs = np.where(isi)
    if len(xs) < 30: print(f'f{f:5d}  (kosong)'); return
    x0, x1, y0, y1 = xs.min() * k, (xs.max() + 1) * k, ys.min() * k, (ys.max() + 1) * k
    dx, dy = (x0 + x1) / 2 - 960, (y0 + y1) / 2 - 540
    t = ' !' if abs(dx) > AMBANG or abs(dy) > AMBANG else ''
    print(f'f{f:5d}  isi x {x0:5.0f}–{x1:5.0f}  y {y0:5.0f}–{y1:5.0f}   pusat ({(x0+x1)/2:6.1f}, {(y0+y1)/2:6.1f})  simpang ({dx:+5.1f}, {dy:+5.1f}){t}')
    for nama, prof in (('mendatar', isi.sum(0)), ('tegak', isi.sum(1))):
        g = kelompok(prof, k, CELAH)
        if len(g) < 2: continue
        jarak = [g[i + 1][0] - g[i][1] for i in range(len(g) - 1)]
        beda = ' ≠' if max(jarak) - min(jarak) > 8 else ''
        print(f'        {nama:8s} ' + '  '.join(f'[{a:.0f}–{b:.0f}]' for a, b in g) + '   jarak ' + ', '.join(f'{j:.0f}' for j in jarak) + beda)
args = sys.argv[1:]
paths = [f'out/ukur-tata/f{int(a):05d}.png' for a in args] if args else sorted(glob.glob('out/ukur-tata/f*.png'))
for p in paths: laporan(p)
