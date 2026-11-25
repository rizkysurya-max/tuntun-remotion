#!/usr/bin/env python3
"""
AUDIT WAKTU TEKS ↔ VO (12 Nov, Simon: "beberapa timingnya tidak sesuai").
Membaca out/audit-gerak/catatan.json (rekaman tanjakan per frame dari jalankan.mjs) → untuk tiap frasa WordText (lok + kata) ambil tanjakan kata
PERTAMA-nya (a…b, jam scene = global − VO_OFFSET), pusat = (a + b) / 2. Kata VO yang diwakili = kata frasa yang PALING DEKAT waktunya di words.gen
(±420 f, dicocokkan tanpa tanda baca/huruf besar; label parafrase tanpa kata yang sama ditandai "?"). Selisih = pusat − onset kata VO.
Aturan kerja (feedback_60f_animation): tanjakan 60 f DIPUSATKAN di kata → selisih wajar −10 … +24 f. Ditandai: > +24 (TELAT) atau < −20 (MENDAHULUI).
pakai: python3 scripts/audit-gerak/waktu-teks.py [SARING_LOK_REGEX]
"""
import json, re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
OFF = int(re.search(r'VO_OFFSET = (\d+)', (ROOT / 'src/offset.ts').read_text()).group(1))
W = [(w, int(a) - OFF) for w, a, *_ in json.loads(re.search(r'= (\[.*\]);', (ROOT / 'src/words.gen.ts').read_text(), re.S).group(1))]
saring = re.compile(sys.argv[1]) if len(sys.argv) > 1 else None
norm = lambda t: re.sub(r'[^a-z0-9]', '', t.lower())
cat = json.load(open(ROOT / 'out/audit-gerak/catatan.json'))
frasa = {}
for c in cat:
    if 'kata' not in c: continue
    if saring and not saring.search(c['lok']): continue
    k = (c['lok'].split(' ')[0], c['kata'])
    if k not in frasa or c['a'] < frasa[k]['a']: frasa[k] = c
baris = []
for (sc, kata), c in sorted(frasa.items(), key=lambda kv: kv[1]['a']):
    pusat = (c['a'] + c['b']) / 2
    kandidat = [(abs(t - pusat), w, t) for w, t in W if norm(w) and any(norm(w) == norm(x) or (len(norm(x)) > 3 and norm(w).startswith(norm(x)[:5])) for x in kata.split())
                and abs(t - pusat) <= 420]
    if kandidat:
        _, w, t = min(kandidat)
        sel = pusat - t
        tanda = 'TELAT' if sel > 24 else 'MENDAHULUI' if sel < -20 else ''
        baris.append((sc, c['g'], kata, w, t + OFF, round(sel), tanda))
    else:
        baris.append((sc, c['g'], kata, '?', None, None, '?'))
for sc, g, kata, w, tg, sel, tanda in baris:
    print(f"{sc} g{g:>6} {kata[:44]:<44} ↔ {w:<14} {'' if tg is None else 'g' + str(tg):<7} {'' if sel is None else f'{sel:+d} f':>7} {tanda}")
n = sum(1 for b in baris if b[6] in ('TELAT', 'MENDAHULUI'))
print(f"{len(baris)} frasa · {n} ditandai · {sum(1 for b in baris if b[6] == '?')} tanpa kata VO yang sama (label parafrase)")
