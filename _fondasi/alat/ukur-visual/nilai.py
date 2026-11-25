#!/usr/bin/env python3
"""UKUR VISUAL tahap 2: nilai (25 Nov 2026). Membaca keluaran rekam.mjs + waktu kata VO. Tidak mengubah apa pun.
  KECIL    objek utama (kelompok benda terbesar) < 1/3 tinggi area isi, sedang diam, >= 1 dtk
  KOSONG   hampir tak ada benda (kelompok terbesar < 1/8 tinggi & < 2 % luas) > 1,5 dtk; juga frame benar-benar kosong >= 0,2 dtk
  DIAM     tidak ada yang bergerak > 3 dtk
  TELAT    teks di layar muncul lebih dari TOL dtk sesudah katanya diucapkan (titik tengah munculnya, sesuai aturan 60 f dipusatkan di kata)
  SINGKAT  teks tampil utuh < 1 dtk
  SAMBUNG  skor 0-1 di batas adegan: berapa banyak tinta yang tetap ada dari 6 f ke 6 f berikutnya (0 = semua berganti sekaligus / kosong)
pakai: nilai.py <folder rekam> <vo-words.json> <cues.ts> <offset VO (frame)> [frame-tahan:panjang,…]"""
import collections, glob, json, os, re, sys
import numpy as np
from PIL import Image
AMAN = (96, 54, 1824, 950); TINGGI = AMAN[3] - AMAN[1]; SEL = 20; TOL = 0.25; FPS = 60

# ── gambar → peta sel 96×54 (1 sel = 20 px kanvas) ──
def muat(p):
    a = np.asarray(Image.open(p).convert('RGB')).astype(np.int16); h, w = a.shape[:2]
    latar = np.median(a[: int(h * .88)].reshape(-1, 3), axis=0); t = (np.abs(a - latar).max(2) > 34)
    t[int(h * .885):] = False; t[: int(h * .15), int(w * .78):] = False            # subtitle & watermark
    s = h / 1080 * SEL; H, W = 54, 96; ys = (np.arange(h) / s).astype(int).clip(0, H - 1); xs = (np.arange(w) / s).astype(int).clip(0, W - 1)
    sel = np.zeros((H, W), int); np.add.at(sel, (ys[:, None].repeat(w, 1)[t], xs[None, :].repeat(h, 0)[t]), 1)
    return a, t, sel >= 2, latar
def kelompok(m):
    """gabung sel bersentuhan (celah <= 40 px) → [(x0,y0,x1,y1,luas sel)] px, terbesar dulu"""
    H, W = m.shape; d = m.copy()
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1): d |= np.roll(np.roll(m, dy, 0), dx, 1)
    seen = np.zeros_like(d); out = []
    for y, x in zip(*np.where(d)):
        if seen[y, x]: continue
        st = [(y, x)]; seen[y, x] = True; pts = []
        while st:
            cy, cx = st.pop()
            if m[cy, cx]: pts.append((cy, cx))
            for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
                if 0 <= ny < H and 0 <= nx < W and d[ny, nx] and not seen[ny, nx]: seen[ny, nx] = True; st.append((ny, nx))
        if pts:
            p = np.array(pts); out.append((int(p[:, 1].min()) * SEL, int(p[:, 0].min()) * SEL, int(p[:, 1].max() + 1) * SEL, int(p[:, 0].max() + 1) * SEL, len(pts)))
    return sorted(out, key=lambda b: -(b[2] - b[0]) * (b[3] - b[1]))
def rentang(fr, benar, minim, langkah):
    out = []; a = None
    for f, b in list(zip(fr, benar)) + [(None, False)]:
        if b and a is None: a = f
        if b: z = f
        if not b and a is not None:
            if z - a + langkah >= minim: out.append((a, z + langkah))
            a = None
    return out
def jam(f): s = f / FPS; return f'{int(s // 60)}:{s % 60:05.2f}'

def nilai_gambar(folder, langkah, awal=0):
    fs = sorted(glob.glob(f'{folder}/g/*.jp*g'), key=lambda p: int(re.search(r'(\d+)\.jpe?g$', p).group(1))); fr = [awal + int(re.search(r'(\d+)\.jpe?g$', p).group(1)) * langkah for p in fs]   # nama renderFrames = nomor urut
    tinggi, luas, jumlah, gerak, sambung, bx = [], [], [], [], [], []; pa = pt = None
    for p in fs:
        a, t, m, _ = muat(p); K = kelompok(m)
        if K: k = K[0]; tinggi.append(max(b[3] - b[1] for b in K)); luas.append((k[2] - k[0]) * (k[3] - k[1]) / (1920 * 900)); bx.append(k[:4])
        else: tinggi.append(0); luas.append(0); bx.append((0, 0, 0, 0))
        jumlah.append(int(m.sum()))
        if pa is None: gerak.append(1.0); sambung.append(1.0)
        else:
            d = np.abs(a - pa).max(2) > 12; d[int(d.shape[0] * .885):] = False; d[: int(d.shape[0] * .15), int(d.shape[1] * .78):] = False; gerak.append(float(d.mean()))
            mm = m | np.roll(m, 1, 0) | np.roll(m, -1, 0) | np.roll(m, 1, 1) | np.roll(m, -1, 1); pm = pt | np.roll(pt, 1, 0) | np.roll(pt, -1, 0) | np.roll(pt, 1, 1) | np.roll(pt, -1, 1)
            n = min(m.sum(), pt.sum()); sambung.append(float((m & pm).sum() + (pt & mm).sum()) / (m.sum() + pt.sum()) if n > 0 else (1.0 if m.sum() == pt.sum() else 0.0))
        pa, pt = a, m
    return dict(fr=fr, tinggi=tinggi, luas=luas, jumlah=jumlah, gerak=gerak, sambung=sambung, bx=bx)
def temuan_gambar(G, langkah):
    fr = G['fr']; T = {}
    diam = [g < 0.0006 for g in G['gerak']]
    kecil = [d and 0 < h < TINGGI / 3 and n > 0 and G.get('isi', (0, 1e9))[0] <= f < G.get('isi', (0, 1e9))[1] for f, d, h, n in zip(fr, diam, G['tinggi'], G['jumlah'])]
    T['KECIL'] = [(a, b, max(h for f, h in zip(fr, G['tinggi']) if a <= f < b)) for a, b in rentang(fr, kecil, 60, langkah)]
    nyaris = [h < TINGGI / 8 and l < .02 for h, l in zip(G['tinggi'], G['luas'])]
    T['KOSONG'] = [(a, b, 'nyaris') for a, b in rentang(fr, nyaris, 90, langkah)] + [(a, b, 'kosong') for a, b in rentang(fr, [n == 0 for n in G['jumlah']], 12, langkah)]
    T['DIAM'] = [(a, b, '') for a, b in rentang(fr, diam, 180, langkah)]
    return T

# ── teks ↔ kata VO ──
def polos(s): return re.sub(r'[^a-z0-9]+', '', s.lower())
def muncul(folder, langkah):
    """id teks → daftar kemunculan {teks, f tengah muncul, f mendarat, f mulai keluar, kotak}"""
    # PELACAK: id DOM bergeser saat saudaranya muncul/hilang → benda dilanjutkan lewat TEKS sama + tempat terdekat (<= 140 px, jeda <= 2 sampel), lintas lapisan juga (serah-terima)
    H = []; out = []
    for d in sorted((json.loads(l) for l in open(f'{folder}/kotak.jsonl')), key=lambda d: d['f']):   # perekaman paralel → urutkan
        f = d['f']; baru = []
        for it in d['items']:
            if it['k'] != 'txt' or it.get('l') in ('Subtitle', 'Watermark', 'Backdrop') or not it.get('t') or not re.search('[A-Za-z]', it['t']): continue
            b = it['b']; cy = (b[1] + b[3]) / 2; cx = (b[0] + b[2]) / 2
            if not (0 < cx < 1920 and 0 < cy < 955): continue
            baru.append((it, cx, cy, it['o'] * min(1.0, it.get('sk', 1)) * it.get('kp', 1)))
        terpakai = set()
        pas = sorted(((abs(e['seri'][-1][2] - cx) + abs(e['seri'][-1][3] - cy) + (0 if e['id'] == it['id'] else 30), ei, bi) for bi, (it, cx, cy, v) in enumerate(baru) for ei, e in enumerate(H) if e['t'] == it['t'] and f - e['seri'][-1][0] <= 2 * langkah), key=lambda z: z[0]); dipakai = set()
        for jr, ei, bi in pas:
            if jr > 170 or ei in terpakai or bi in dipakai: continue
            terpakai.add(ei); dipakai.add(bi); it, cx, cy, v = baru[bi]; e = H[ei]; e['seri'].append((f, v, cx, cy, it['b'][3] - it['b'][1])); e['id'] = it['id']
        for bi, (it, cx, cy, v) in enumerate(baru):
            if bi not in dipakai: H.append(dict(t=it['t'], l=it['l'], id=it['id'], seri=[(f, v, cx, cy, it['b'][3] - it['b'][1])]))
        hidup = []
        for e in H: (hidup if f - e['seri'][-1][0] <= 2 * langkah else out).append(e)
        H = hidup
    out += H; R = []
    for e in out:
        S = sorted(e['seri']); mx = max(s[1] for s in S)
        if mx < .8 or len(S) < 2: continue
        tgh = next((s[0] for s in S if s[1] >= .5 * mx), None); p = [s for s in S if s[1] >= .5]
        # interpolasi titik 50 %
        for a, b in zip(S, S[1:]):
            if a[1] < .5 * mx <= b[1]: tgh = a[0] + (b[0] - a[0]) * (.5 * mx - a[1]) / max(1e-6, b[1] - a[1]); break
        utuh = [s for i, s in enumerate(S) if s[1] >= .95 * mx and (i == 0 or abs(s[2] - S[i - 1][2]) + abs(s[3] - S[i - 1][3]) < 6)]
        R.append(dict(t=e['t'], l=e['l'], awal=S[0][0], tgh=tgh, utuh=(len(utuh) * langkah), akhir=S[-1][0], x=p[len(p) // 2][2], y=p[len(p) // 2][3], h=p[len(p) // 2][4], mulai_tampil=S[0][1] >= .5 * mx))
    return R
def baris(R, langkah):
    """gabung kata-kata sebaris yang muncul berdekatan jadi satu frasa"""
    R = sorted(R, key=lambda r: (r['l'], round(r['y'] / 8), r['x'])); out = []
    for r in R:
        o = out[-1] if out else None
        if o and o['l'] == r['l'] and abs(o['y'] - r['y']) < 10 and abs(o['h'] - r['h']) < 6 and 0 < r['x'] - o['xk'] < 420 and abs(r['tgh'] - o['tghk']) <= 70 and abs(r['akhir'] - o['akhir']) <= 60 and not r['mulai_tampil']:
            o['t'] += ' ' + r['t']; o['xk'] = r['x']; o['tghk'] = r['tgh']; o['tgh'] = min(o['tgh'], r['tgh']); o['utuh'] = min(o['utuh'], r['utuh']); o['n'] += 1
        else: out.append(dict(r, xk=r['x'], tghk=r['tgh'], n=1))
    return out
def telat(F, kata, jendela=240):
    """frasa → kata VO terdekat: urutan token frasa (>= 60 %) ditemukan di VO dalam ± jendela; ambil yang terdekat dengan munculnya"""
    W = [(polos(w['w']), w['f'], w.get('z', w['f'])) for w in kata]; W = [x for x in W if x[0]]; out = []
    for r in F:
        tok = [polos(x) for x in r['t'].split()]; tok = [x for x in tok if x]
        if not tok or r['mulai_tampil'] or (len(tok) == 1 and len(tok[0]) < 4): continue
        cand = []
        for i, (w, f, _) in enumerate(W):
            if abs(f - r['tgh']) > jendela: continue
            if w != tok[0]: continue
            k = sum(1 for j, x in enumerate(tok) if i + j < len(W) and W[i + j][0] == x)
            if k / len(tok) >= .6:
                z = W[min(i + len(tok), len(W)) - 1][2]; s = r['tgh'] - z if r['tgh'] > z else r['tgh'] - f if r['tgh'] < f else 0; cand.append((abs(s), f, s))
        if cand: c = min(cand); out.append(dict(r, kata=c[1], selisih=c[2] / FPS))
    return out
def batas_sambung(G, batas, langkah, pita=60):
    out = []
    for nama, b in batas:
        idx = [i for i, f in enumerate(G['fr']) if b - pita <= f <= b + pita]
        if idx: j = min(idx, key=lambda i: G['sambung'][i]); out.append((nama, b, G['sambung'][j], G['fr'][j], min(G['jumlah'][i] for i in idx)))
    return out

if __name__ == '__main__':
    folder, vo, cues, off = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]); tahan = [tuple(map(int, x.split(':'))) for x in sys.argv[5].split(',')] if len(sys.argv) > 5 else []
    meta = json.load(open(f'{folder}/meta.json')); L = meta['langkah']
    ke = lambda v: v + sum(n for p, n in tahan if v >= p)
    kata = [dict(w=w['w'], f=off + ke(round(w['a'] * FPS)), z=off + ke(round(w['b'] * FPS))) for w in json.load(open(vo))['words']]
    SC = [(int(m[0]), off + ke(int(m[1]) - off) if int(m[1]) >= off else int(m[1]), m[2]) for m in re.findall(r'\{ n: (\d+), a: (\d+), b: \d+, bab: "([^"]+)"', open(cues).read())]
    G = nilai_gambar(folder, L, meta.get('awal', 0)); G['isi'] = (off, meta['n'] - int(os.environ.get('OUTRO', 0))); T = temuan_gambar(G, L); R = muncul(folder, L); F = baris(R, L); X = telat(F, kata)
    T['TELAT'] = sorted([x for x in X if TOL < x['selisih'] <= 2], key=lambda x: -x['selisih']); T['MUNGKIN-KATA-LAIN'] = [x for x in X if x['selisih'] > 2]; T['SINGKAT'] = [x for x in F if 0 < x['utuh'] < 60 and x['akhir'] - x['awal'] > 12 and x['akhir'] < meta['n'] - 60 and len(polos(x['t'])) >= 3]
    S = batas_sambung(G, [(f'S{n-1:02d}→S{n:02d}', f) for n, f, _ in SC if n > 1], L)
    sc = lambda f: max((n for n, a, _ in SC if f >= a), default=1)
    json.dump(dict(G=G, T={k: v for k, v in T.items()}, X=X, S=S, SC=SC), open(f'{folder}/hasil.json', 'w'), default=float)
    panel = {}
    for l in open(f'{folder}/kotak.jsonl'):
        d = json.loads(l); panel[d['f']] = max([b['b'][3] - b['b'][1] for b in d['items'] if b['k'] == 'box' and b['b'][2] - b['b'][0] < 1800 and b['b'][3] - b['b'][1] >= 300 and b['o'] > .5] or [0])
    T['KECIL'] = [(a, b, f'objek {h} px' + (' di dalam panel besar (isi kecil)' if panel.get(a + (b - a) // 2 - ((a + (b - a) // 2) % L), 0) else '')) for a, b, h in T['KECIL']]
    print(f"frame terukur {len(G['fr'])} (tiap {L} f) · frasa teks {len(F)} · cocok dengan VO {len(X)}")
    for k in ('KECIL', 'KOSONG', 'DIAM'):
        print(f'\n== {k}: {len(T[k])}');
        for a, b, x in T[k][:60]: print(f'  S{sc(a):02d}  {jam(a)}–{jam(b)}  f{a}  {(b - a) / FPS:.1f} dtk  {x}')
    print(f"\n== TELAT > {TOL} dtk: {len(T['TELAT'])} dari {len(X)}");
    for x in T['TELAT'][:40]: print(f"  S{sc(x['tgh']):02d}  {jam(x['tgh'])}  f{x['tgh']:.0f}  telat {x['selisih']:.2f} dtk  \"{x['t'][:50]}\"")
    print(f"\n== SINGKAT: {len(T['SINGKAT'])}");
    for x in T['SINGKAT'][:40]: print(f"  S{sc(x['awal']):02d}  {jam(x['awal'])}  f{x['awal']}  utuh {x['utuh'] / FPS:.1f} dtk  \"{x['t'][:50]}\"")
    print('\n== SAMBUNG di batas adegan');
    for n, b, s, f, j in S: print(f'  {n}  f{b}  skor {s:.2f} (di f{f}), sel tinta tersedikit {j}')
    d = np.array([x['selisih'] for x in X]); print('\n== MUNGKIN-KATA-LAIN (> 2 dtk):', ', '.join(f"{x['t'][:24]} f{x['tgh']:.0f} {x['selisih']:.1f}" for x in T['MUNGKIN-KATA-LAIN']))
    print(f'\nselisih teks–kata: median {np.median(d):+.2f} dtk, 10 %–90 % {np.percentile(d, 10):+.2f}…{np.percentile(d, 90):+.2f}' if len(d) else '')
