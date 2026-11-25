// AUDIT GERAK (12 Nov) — Simon: "secara layout scene 1 sampai scene 3 aku sudah cocok, namun ada penyesuaian di keyframe (harus 60 frame), easing,
// spacing, dan alignment" + "perbaiki alat yang kamu gunakan agar hasilnya akurat".
// audit-60f.py hanya membaca TEKS kode (durasi tertulis). Alat ini MENJALANKAN logika komposisi (Babak, semua scene) per frame GLOBAL di Node dan
// mencatat SETIAP tanjakan yang sedang berjalan (interpolate / tanjakan kata), lalu mengukur dalam FRAME NYATA:
//   A  durasi rancangan ≠ 60 f            B  tampil ≠ durasi rancangan (jam scene diregang/dimampatkan)
//   C  TERTAHAN di tengah (jam scene diam saat tanjakan berjalan = gerak berhenti)
//   D  MUNCUL DI TENGAH (pertama terlihat sudah > 8 %: elemen baru digambar saat tanjakannya sudah jalan = jeglek)
//   E  HILANG DI TENGAH (terakhir terlihat < 92 % lalu tidak dihitung lagi padahal tanjakannya belum selesai = jeglek)
//   + daftar KEADAAN DIAM (≥ 24 f tanpa tanjakan) untuk ukur tata letak.
// pakai: node scripts/audit-gerak/jalankan.mjs 260 12400 [awalan-berkas, mis. s0[1-3]]
import { build } from 'esbuild';
import path from 'node:path'; import fs from 'node:fs'; import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const [g0, g1] = [Number(process.argv[2] ?? 260), Number(process.argv[3] ?? 12400)];
const SARING = new RegExp(process.argv[4] ?? '^S0[1-3]$');
const out = path.join(root, 'out/audit-gerak'); fs.mkdirSync(out, { recursive: true });

const sisip = (teks, cari, ganti, nama) => { if (!teks.includes(cari)) throw new Error(`audit-gerak: pola sisip "${nama}" tidak ditemukan`); return teks.replace(cari, ganti); };
const plugin = {
  name: 'audit',
  setup(b) {
    b.onResolve({ filter: /^remotion$/ }, () => ({ path: path.join(root, 'scripts/audit-gerak/stub-remotion.tsx') }));
    b.onResolve({ filter: /^remotion-asli$/ }, () => ({ path: 'remotion', external: true }));
    b.onResolve({ filter: /^@remotion\/google-fonts/ }, () => ({ path: 'gf', namespace: 'stub' }));
    b.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({ contents: 'export const loadFont = () => ({ fontFamily: "Plus Jakarta Sans" });', loader: 'js' }));
    // tanjakan kata (WordText) & gerak panjang tidak lewat interpolate → dicatat langsung
    b.onLoad({ filter: /src\/parts\/kit\.tsx$/ }, (a) => {
      let t = fs.readFileSync(a.path, 'utf8');
      t = sisip(t, 'const mulai = at - (d + (n - 1) * jeda) / 2 + i * jeda;', 'const mulai = at - (d + (n - 1) * jeda) / 2 + i * jeda; (globalThis as any).__catat?.(f, mulai, mulai + d, (globalThis as any).__kata);', 'uKata');
      t = sisip(t, 'const T = b - a, t = Math.max(0, Math.min(T, f - a));', '(globalThis as any).__catat?.(f, a, b, "gerakLunak"); const T = b - a, t = Math.max(0, Math.min(T, f - a));', 'gerakLunak');
      t = sisip(t, "const words = children.split(' ');", "(globalThis as any).__kata = children; const words = children.split(' ');", 'WordText');
      return { contents: t, loader: 'tsx' };
    });
    b.onLoad({ filter: /src\/audit\/AuditProbe\.tsx$/ }, (a) => {
      let t = fs.readFileSync(a.path, 'utf8');
      t = sisip(t, '= ({ name, children }) =>\n  AUDIT ?', '= ({ name, children }) =>\n  ((globalThis as any).__scene = name, AUDIT) ?', 'AuditLayer');
      return { contents: t, loader: 'tsx' };
    });
  },
};
const bundel = path.join(out, 'bundel.cjs');
await build({
  entryPoints: [path.join(root, 'scripts/audit-gerak/entry.tsx')], bundle: true, platform: 'node', format: 'cjs', outfile: bundel,
  sourcemap: 'inline', jsx: 'automatic', plugins: [plugin], external: ['react', 'react-dom', 'react-dom/server'],
  loader: { '.png': 'empty', '.jpg': 'empty', '.webp': 'empty', '.mp4': 'empty', '.wav': 'empty', '.m4a': 'empty', '.json': 'json' }, logLevel: 'error',
});
process.setSourceMapsEnabled(true);
Error.stackTraceLimit = 40;
const require = createRequire(import.meta.url);
const { renderFrame } = require(bundel);

// ── pencatat ──
const PEMBANTU = /^(R|interpolate|cin|grow|popIn\d*|popInKit|popOut\d*|pp\d*|jalur\d*|kotak\d*|angka\d*|kataP|uKata|kataV|cinV|gerakLunak|geserKe|klem\d*|Object\.\S+|Array\.\S+)$/;
const lokasi = (st) => {
  // baris stack: "    at Nama (/…/src/s03/Scene03.tsx:230:19)" atau "    at /…/src/…:l:c"
  const fr = [];
  for (const b of st.split('\n').slice(1)) {
    const m = b.match(/at (?:(\S+) \()?(?:.*\/)?(src\/[^:()]+):(\d+):\d+\)?$/);
    if (!m) continue;
    const [, nama = '<anonymous>', file, line] = m;
    if (/src\/(theme\.ts|parts\/pop\.ts)$/.test(file) || file.includes('audit-gerak')) continue;
    if (/src\/parts\/kit\.tsx$/.test(file) && nama !== 'WordText') continue;
    if (PEMBANTU.test(nama)) continue;
    fr.push(`${file.replace('src/', '')}:${line} ${nama}`);
    if (fr.length >= 2) break;
  }
  return fr.join(' ← ');
};
let g = 0, catatan = [];
globalThis.__inputProps = {};
globalThis.__catat = (f, a, b, kata) => {
  if (!(f > a + 1e-6 && f < b - 1e-6)) return;
  const sc = globalThis.__scene ?? '';
  if (!SARING.test(sc)) return;
  const st = new Error().stack, lok = `${sc} ${lokasi(st)}`;
  catatan.push({ g, f, a: +a.toFixed(3), b: +b.toFixed(3), lok, kata: typeof kata === 'string' ? kata : undefined });
};
const mulaiW = Date.now();
const fPerG = new Map(); // jam scene per frame global (diambil dari catatan) — untuk C
for (g = g0; g <= g1; g++) {
  renderFrame(g);
  if ((g - g0) % 1000 === 0) process.stderr.write(`  frame ${g} · ${catatan.length} catatan · ${((Date.now() - mulaiW) / 1000).toFixed(0)} dtk\n`);
}
fs.writeFileSync(path.join(out, 'catatan.json'), JSON.stringify(catatan));

// ── analisis per INSTANS tanjakan (lokasi + a + b + kata) ──
const inst = new Map();
for (const c of catatan) {
  const k = `${c.lok}|${c.a}|${c.b}|${c.kata ?? ''}`;
  let r = inst.get(k);
  if (!r) inst.set(k, (r = { lok: c.lok, a: c.a, b: c.b, kata: c.kata, gs: new Map() }));
  if (!r.gs.has(c.g)) r.gs.set(c.g, c.f);
}
const temuan = { A: [], B: [], C: [], D: [], E: [] };
const sibuk = new Set();
for (const r of inst.values()) {
  const gs = [...r.gs.keys()].sort((x, y) => x - y), d = r.b - r.a;
  const p = (f) => (f - r.a) / d;
  for (const x of gs) sibuk.add(x);
  const pertama = p(r.gs.get(gs[0])), terakhir = p(r.gs.get(gs[gs.length - 1]));
  // C: jam scene DIAM (f sama) pada dua frame nyata berturutan saat berjalan
  let ditahan = 0; for (let i = 1; i < gs.length; i++) if (gs[i] === gs[i - 1] + 1 && Math.abs(r.gs.get(gs[i]) - r.gs.get(gs[i - 1])) < 1e-6) ditahan++;
  // panjang nyata = rentang frame global dari pertama sampai terakhir terlihat (+1)
  const nyata = gs[gs.length - 1] - gs[0] + 1, harap = Math.round(d) - 1;
  const ket = { lok: r.lok, kata: r.kata, a: r.a, b: r.b, d: +d.toFixed(1), g0: gs[0], g1: gs[gs.length - 1], nyata, pertama: +pertama.toFixed(3), terakhir: +terakhir.toFixed(3), ditahan };
  if (Math.abs(d - 60) > 0.5) temuan.A.push(ket);
  if (!ditahan && pertama < 0.08 && terakhir > 0.92 && Math.abs(nyata - harap) > 2) temuan.B.push(ket);
  if (ditahan > 0) temuan.C.push(ket);
  if (pertama > 0.08) temuan.D.push(ket);
  if (terakhir < 0.92 && gs[gs.length - 1] < g1) temuan.E.push(ket);
}
// keadaan diam: ≥ 24 frame global berturutan tanpa satu pun tanjakan S0x
const diam = []; let s = null;
for (let x = g0; x <= g1 + 1; x++) {
  if (x <= g1 && !sibuk.has(x)) { if (s === null) s = x; }
  else if (s !== null) { if (x - s >= 24) diam.push([s, x - 1]); s = null; }
}
const ringkas = Object.fromEntries(Object.entries(temuan).map(([k, v]) => [k, v.length]));
fs.writeFileSync(path.join(out, 'temuan.json'), JSON.stringify({ rentang: [g0, g1], ringkas, temuan, diam }, null, 1));
console.log(`audit-gerak ${g0}–${g1}: ${inst.size} tanjakan · ${JSON.stringify(ringkas)} · ${diam.length} keadaan diam · ${((Date.now() - mulaiW) / 1000).toFixed(0)} dtk`);
console.log(path.join(out, 'temuan.json'));
