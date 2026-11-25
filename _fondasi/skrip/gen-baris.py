#!/usr/bin/env python3
"""
BARIS SUBTITLE Value Investing · Video 05 (salinan VI V04 ← VI V03 ← VI V01 ← Investing 101 Video 06/05) → sync/SUBTITLE-BARIS.txt (dipakai gen-cues.py: 1 baris = 1 cue).
Naskah Simon ditulis per FRASA pendek ("bank,", "Pertama,") — 1 frasa = 1 cue akan berkedip ±0,5 dtk. Aturan di sini:
  · baris naskah dalam SATU KALIMAT digabung jadi satu cue selama masih muat satu baris layar (Bold 35, ≤ 1728 px);
  · kalimat yang lebih lebar dipotong HANYA di jeda baris naskah Simon — pecahan sesedikit mungkin, lalu yang paling rata;
  · tidak pernah melintasi scene. Baris naskah tunggal yang > 1728 px tetap utuh (gen-cues.py memotongnya di koma Simon).
Bila Simon mengirim pembagian baris sendiri, berkas ini diganti baris Simon (feedback_subtitle_baris_simon).
"""
import itertools, os, pathlib, re
from PIL import ImageFont
ROOT = pathlib.Path(__file__).resolve().parent.parent
MD = ROOT / "sync/VO-SCRIPT-AKTIF.md"  # VI V04: hanya scene yang ada di VO (gen-naskah.py)
FONT = ImageFont.truetype(os.path.expanduser("~/Library/Fonts/PlusJakartaSans-Bold.ttf"), 35)
MAXW = 1728
# VI V03 (4 Nov): baris naskah berakhiran em dash disambung tanpa spasi, sama dengan cara Simon menulis "optimistis—tanpa"
J = lambda xs: re.sub(r"— ", "—", " ".join(xs))
def lebar(t):
    l, _, r, _ = FONT.getbbox(t); return r - l - 0.35 * (len(t) - 1)
# VI V01 (29 Okt): kutipan Simon tanpa titik penutup ("…juta ya”" lalu "Ibu Sari …") = akhir kalimat juga
# VI V03 (4 Nov): baris naskah berakhiran ":" juga menutup satu baris subtitle — pengantar berdiri sendiri, sama dengan format VO Simon 4 Nov
akhir = lambda l: bool(re.search(r"([.?!:][”\"]?|”)$", l))
# PISAH MANUAL (aturan V03: potong di batas makna, jangan memotong daftar) — kunci = kalimat utuh (baris Simon digabung spasi).
# Pemilih otomatis (paling rata di jeda baris Simon) memotong daftar tahun / tiga langkah / daftar sektor / daftar isi laporan di tengahnya.
PISAH = {}  # VI V05 (13 Nov): belum ada pisah manual
PAKAI = set()
scenes, cur = [], None
for line in MD.read_text(encoding="utf-8").splitlines():
    if line.startswith("## SCENE"): cur = []; scenes.append(cur); continue
    if cur is not None and line.strip(): cur.append(line.strip())
out = []
for sc in scenes:
    kal, buf = [], []
    for l in sc:
        buf.append(l)
        if akhir(l): kal.append(buf); buf = []
    if buf: kal.append(buf)
    for k in kal:
        if J(k) in PISAH:
            parts = PISAH[J(k)]; assert J(parts) == J(k); out += parts; PAKAI.add(J(k)); continue
        if lebar(J(k)) <= MAXW: out.append(J(k)); continue
        if len(k) == 1: out.append(k[0]); continue  # V06: kalimat SATU baris naskah yang > 1728 px tetap utuh — gen-cues.py memotongnya di koma Simon
        best = None
        for n in range(1, len(k)):
            for cut in itertools.combinations(range(1, len(k)), n):
                parts = [J(k[a:b]) for a, b in zip((0,) + cut, cut + (len(k),))]
                w = [lebar(p) for p in parts]
                if max(w) <= MAXW or all(len(k[a:b]) == 1 for a, b in zip((0,) + cut, cut + (len(k),)) if lebar(J(k[a:b])) > MAXW):
                    if max(w) <= MAXW or n == len(k) - 1:
                        cand = (max(w) - min(w), parts)
                        best = cand if best is None or cand[0] < best[0] else best
            if best: break
        out += best[1]
(ROOT / "sync/SUBTITLE-BARIS.txt").write_text("\n".join(out) + "\n", encoding="utf-8")
assert PAKAI == set(PISAH), f"PISAH tak terpakai (naskah berubah?): {set(PISAH) - PAKAI}"
print(len(out), "baris subtitle dari", sum(len(s) for s in scenes), "baris naskah ·", len(PAKAI), "pisah manual")
