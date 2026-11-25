#!/usr/bin/env python3
"""konversi frame: jam LAMA (S01–S02, S04–S05) / jam v4 → frame GLOBAL komposisi (VO_OFFSET 260). pakai: python3 frame.py lama 2106 | v4 8561"""
import re, sys, bisect, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
def arr(f, n): return [float(x) for x in re.search(rf'const {n} = \[([^\]]*)\]', (ROOT / f).read_text()).group(1).split(',')]
BARU, LAMA = arr('src/waktuLama.gen.ts', 'BARU'), arr('src/waktuLama.gen.ts', 'LAMA')
KINI, V4 = arr('src/waktuV4.gen.ts', 'KINI'), arr('src/waktuV4.gen.ts', 'V4')
OFF = int(re.search(r'VO_OFFSET\s*=\s*(\d+)', (ROOT / 'src/offset.ts').read_text()).group(1))
def peta(x, A, Bb):  # A → B (awal segmen datar)
    i = bisect.bisect_left(A, x)
    if i <= 0: return Bb[0] + x - A[0]
    if i >= len(A): return Bb[-1] + x - A[-1]
    a0, a1, b0, b1 = A[i - 1], A[i], Bb[i - 1], Bb[i]
    return b0 if a1 == a0 else b0 + (x - a0) * (b1 - b0) / (a1 - a0)
def glob(jam, x): return round((peta(x, LAMA, BARU) if jam == 'lama' else peta(x, V4, KINI)) + OFF)
if __name__ == '__main__':
    jam = sys.argv[1]
    print(' '.join(str(glob(jam, float(v))) for v in sys.argv[2:]))
