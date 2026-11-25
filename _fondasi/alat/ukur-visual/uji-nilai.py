import sys, os, json, shutil, numpy as np
from PIL import Image, ImageDraw
A, D = sys.argv[1:3]; sys.path.insert(0, A); sys.dont_write_bytecode = True; import nilai as N
shutil.rmtree(D, ignore_errors=True); os.makedirs(D + '/g'); L = 6; n = 0; J = []
def fr(gambar, items=()):
    global n; im = Image.new('RGB', (1920, 1080), '#FDFDFD'); d = ImageDraw.Draw(im)
    for x in range(0, 1920, 80): d.line((x, 0, x, 1080), fill='#F3F3F8')
    for b in gambar: d.rectangle(b, fill='#5F4DEE')
    d.rectangle((1540, 45, 1850, 140), fill='#5F4DEE'); d.rectangle((600, 980, 1300, 1030), fill='#5F4DEE')      # watermark & subtitle: harus diabaikan
    im.resize((480, 270), Image.LANCZOS).save(f'{D}/g/element-{n:04d}.jpeg', quality=70); J.append(dict(f=n * L, items=list(items))); n += 1
T = lambda t, o=1, x=400, y=400, sk=1, i='a': dict(k='txt', l='S01', t=t, b=[x - 60, y - 18, x + 60, y + 18], o=o, id=i, sk=sk)
BESAR, KECIL = (300, 200, 1500, 800), (900, 450, 1040, 590); kini = lambda: n * L
tanda = {}
tanda['besar'] = kini(); [fr([BESAR]) for _ in range(20)]
tanda['kecil'] = kini(); [fr([KECIL]) for _ in range(25)]
tanda['kosong'] = kini(); [fr([]) for _ in range(20)]
tanda['nyaris'] = kini(); [fr([(940, 500, 1000, 560)]) for _ in range(30)]
tanda['gerak'] = kini(); [fr([(300 + 20 * k, 200, 900 + 20 * k, 800)]) for k in range(20)]
tanda['diam'] = kini(); [fr([BESAR]) for _ in range(45)]
tanda['teks'] = kini()
[fr([BESAR]) for _ in range(5)]
t0 = kini(); [fr([BESAR], [T('Margin', min(1, k / 10), i='t1')]) for k in range(1, 30)]           # titik tengah di t0+24 → kata di t0+24 = tepat
t1 = kini(); [fr([BESAR], [T('Pelanggan', min(1, k / 10), i='t2')]) for k in range(1, 30)]        # kata 60 f lebih awal = telat 1 dtk
t2 = kini(); [fr([BESAR], [T('Sebentar', 1 if k > 1 else .3, i='t3')]) for k in range(0, 7)]; [fr([BESAR]) for _ in range(12)]
tanda['sambung0'] = kini(); [fr([(200, 200, 500, 500)]) for _ in range(12)]; b0 = kini(); [fr([(1200, 500, 1500, 800)]) for _ in range(12)]      # ganti total
tanda['sambung1'] = kini(); [fr([(200, 200, 500, 500)]) for _ in range(12)]; b1 = kini(); [fr([(200 + 20 * k, 200, 500 + 20 * k, 500)]) for k in range(12)]
open(D + '/kotak.jsonl', 'w').write('\n'.join(json.dumps(j) for j in reversed(J))); json.dump(dict(langkah=L, n=n * L, awal=0), open(D + '/meta.json', 'w'))
G = N.nilai_gambar(D, L); Tm = N.temuan_gambar(G, L); R = N.muncul(D, L); F = N.baris(R, L)
X = N.telat(F, [dict(w='Margin,', f=t0 + 24), dict(w='pelanggan', f=t1 + 24 - 60), dict(w='lain', f=10)]); S = N.batas_sambung(G, [('ganti', b0), ('sambung', b1)], L)
ok = lambda nama, c, d='': print('LULUS' if c else 'GAGAL', nama, d); kena = lambda k, f: any(a <= f + 60 < b for a, b, *_ in Tm[k])
ok('besar bukan KECIL', not kena('KECIL', tanda['besar'])); ok('kecil = KECIL', kena('KECIL', tanda['kecil']), Tm['KECIL']); ok('kosong terdeteksi', any(x[2] == 'kosong' and abs(x[0] - tanda['kosong']) <= 6 for x in Tm['KOSONG']), Tm['KOSONG']); ok('nyaris kosong terdeteksi', any(x[2] == 'nyaris' and x[0] <= tanda['nyaris'] + 12 < x[1] for x in Tm['KOSONG']))
ok('diam > 3 dtk', any(a >= tanda['diam'] - 6 and b <= tanda['teks'] + 60 + 999 for a, b, _ in Tm['DIAM']), Tm['DIAM']); ok('gerak bukan diam', not any(a <= tanda['gerak'] + 60 < b for a, b, _ in Tm['DIAM']))
x = {q['t']: q for q in X}; ok('kata tepat: selisih ~0', abs(x['Margin']['selisih']) < .12, x['Margin']['selisih']); ok('kata telat ~1 dtk', .85 < x['Pelanggan']['selisih'] < 1.15, x['Pelanggan']['selisih']); ok('teks singkat', any(q['t'] == 'Sebentar' and q['utuh'] < 60 for q in F), [(q['t'], q['utuh']) for q in F])
ok('ganti total: skor ~0', S[0][2] < .1, S[0][2]); ok('bersambung: skor tinggi', S[1][2] > .7, S[1][2])
