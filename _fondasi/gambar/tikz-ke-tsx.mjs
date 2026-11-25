// TikZ → komponen React/SVG untuk Remotion, TIAP BAGIAN TERPISAH (25 Nov 2026).  node _fondasi/gambar/tikz-ke-tsx.mjs rumah.tex src/gambar/Rumah.gen.tsx
// Isi .tex = perintah TikZ saja (tanpa \begin{document}/{tikzpicture}); baris pembuka bagian:  %% bagian atap
// Baris khusus di atas:  %% kotak 0 0 6 5  (cm, wajib: sama untuk semua bagian) · %% pustaka calc,arrows.meta · %% paket pgfplots · %% awalan \definecolor{ungu}{HTML}{5F4DEE}
// Teks jangan di TikZ: font-nya bukan Plus Jakarta Sans; tulis di Remotion.
import tikz from 'node-tikzjax'; import fs from 'node:fs'; import path from 'node:path';
// Opsional: … <lebar> <x> <y> → mencetak baris JSX per layer (angka langsung, siap ditempel ke scene).
const tex2svg = tikz.default ?? tikz, [, , masuk, keluar, ...letak] = process.argv; if (!masuk || !keluar) { console.error('pakai: tikz-ke-tsx.mjs <berkas.tex> <keluaran.tsx> [--comp src/comp/X.tsx lebar | lebar x y]'); process.exit(1); }
const NUM = '(-?(?:\\d+\\.?\\d*|\\.\\d+))', awalD = (s) => [...s.matchAll(new RegExp('\\bd="[mM]\\s*' + NUM + '[ ,]?' + NUM, 'g'))].map((m) => [+m[1], +m[2]]);
/** kotak ketat satu bagian di koordinat gambar utuh: dibangun dua kali (kotak tetap vs ketat), selisih titik awal path = pergeserannya */
const kotakKetat = (penuh, ketat) => { const a = awalD(penuh), b = awalD(ketat); if (!a.length || a.length !== b.length) return null; const dx = a[0][0] - b[0][0], dy = a[0][1] - b[0][1]; if (a.some(([x, y], i) => Math.abs(x - b[i][0] - dx) > 0.05 || Math.abs(y - b[i][1] - dy) > 0.05)) return null; const [, , w, h] = ketat.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number); return [-72.27 + dx, -72.27 + dy, w, h].map((n) => +n.toFixed(3)); };
const L = fs.readFileSync(masuk, 'utf8').split('\n'), atur = { kotak: null, pustaka: '', paket: {}, awalan: '' }, bagian = []; let umum = [];
for (const l of L) { const m = l.match(/^%%\s*(\w+)\s*(.*)$/); if (!m) { (bagian.length ? bagian.at(-1).isi : umum).push(l); continue; } const [, k, v] = m;
  if (k === 'bagian') bagian.push({ nama: v.trim(), isi: [] }); else if (k === 'kotak') atur.kotak = v.trim().split(/[\s,]+/).map(Number); else if (k === 'pustaka') atur.pustaka = v.trim(); else if (k === 'paket') v.split(',').forEach((x) => { atur.paket[x.trim()] = ''; }); else if (k === 'awalan') atur.awalan += v + '\n'; }
if (!atur.kotak || atur.kotak.length !== 4 || atur.kotak.some((x) => !Number.isFinite(x))) { console.error('Baris "%% kotak x0 y0 x1 y1" (cm) wajib ada.'); process.exit(1); }
if (!bagian.length) { console.error('Belum ada "%% bagian <nama>".'); process.exit(1); } const salah = bagian.find((b) => !/^[a-z][a-zA-Z0-9]*$/.test(b.nama)); if (salah) { console.error(`Nama bagian "${salah.nama}" harus camelCase tanpa spasi.`); process.exit(1); }
const [x0, y0, x1, y1] = atur.kotak, kotak = `\\path[use as bounding box] (${x0},${y0}) rectangle (${x1},${y1});`; let vb = null; const isi = [];
for (const b of bagian) {
  const src = `\\begin{document}\\begin{tikzpicture}\n${kotak}\n${umum.join('\n')}\n${b.isi.join('\n')}\n\\end{tikzpicture}\\end{document}`; let svg;
  try { svg = await tex2svg(src, { tikzLibraries: atur.pustaka, texPackages: atur.paket, addToPreamble: atur.awalan }); } catch (e) { console.error(`Bagian "${b.nama}" gagal: ${String(e.message ?? e).slice(0, 300)}`); process.exit(1); }
  const v = svg.match(/viewBox="([^"]+)"/)[1]; if (vb && vb !== v) { console.error(`Kotak bagian "${b.nama}" berbeda (${v} ≠ ${vb}): ada gambar yang keluar dari kotak.`); process.exit(1); } vb = v;
  if (/<text|<foreignObject|<script|<image/.test(svg)) { console.error(`Bagian "${b.nama}" memuat teks; tulis teksnya di Remotion.`); process.exit(1); }
  // id gradien/clip dibuat unik per bagian supaya tidak bertabrakan
  const dalam = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/\bid="([^"]+)"/g, `id="${b.nama}-$1"`).replace(/url\(#([^)]+)\)/g, `url(#${b.nama}-$1)`).replace(/(xlink:)?href="#([^"]+)"/g, `href="#${b.nama}-$2"`); 
  const ketat = kotakKetat(svg, await tex2svg(src.replace(kotak, ''), { tikzLibraries: atur.pustaka, texPackages: atur.paket, addToPreamble: atur.awalan }).catch(() => '')) ?? vb.split(' ').map(Number); if (ketat.join(' ') === vb) console.warn(`Bagian "${b.nama}": kotak ketat tidak terhitung, dipakai kotak utuh.`);
  isi.push({ nama: b.nama, dalam, ketat });
}
const nama = path.basename(keluar).replace(/\.gen\.tsx$|\.tsx$/, ''), [, , w, h] = vb.split(' ').map(Number);
const out = `/* DIBANGKITKAN _fondasi/gambar/tikz-ke-tsx.mjs dari ${path.basename(masuk)} — jangan diedit tangan. */
import React from 'react';
export const BAGIAN = ${JSON.stringify(isi.map((x) => x.nama))} as const;
export type Bagian = (typeof BAGIAN)[number];
const ISI: Record<Bagian, string> = {
${isi.map((x) => `  ${x.nama}: ${JSON.stringify(x.dalam)},`).join('\n')}
};
/** \`gaya\` = gaya per bagian (translate, scale, opacity …); poros skala = pusat bagian itu sendiri */
export const ${nama}Utuh: React.FC<{ lebar: number; gaya?: Partial<Record<Bagian, React.CSSProperties>>; style?: React.CSSProperties }> = ({ lebar, gaya = {}, style }) => (
  <svg viewBox="${vb}" width={lebar} height={lebar * ${+(h / w).toFixed(6)}} style={{ position: 'absolute', overflow: 'visible', ...style }}>
    {BAGIAN.map((b) => <g key={b} data-bagian={b} style={{ transformBox: 'fill-box', transformOrigin: 'center', ...gaya[b] }} dangerouslySetInnerHTML={{ __html: ISI[b] }} />)}
  </svg>);
/** SATU BAGIAN = SATU LAYER, kotaknya pas bagian itu: <Interactive.Svg name="${nama.toLowerCase()} ${isi[0].nama}" viewBox="…KOTAK_BAGIAN…" style={{ … }}><${nama}Bagian b="${isi[0].nama}" /></Interactive.Svg> */
export const KOTAK_BAGIAN: Record<Bagian, string> = ${JSON.stringify(Object.fromEntries(isi.map((x) => [x.nama, x.ketat.join(' ')])))};
export const ${nama}Bagian: React.FC<{ b: Bagian }> = ({ b }) => <g dangerouslySetInnerHTML={{ __html: ISI[b] }} />;
`; fs.mkdirSync(path.dirname(path.resolve(keluar)), { recursive: true }); fs.writeFileSync(keluar, out); console.log(`${nama}: ${isi.length} bagian (${isi.map((x) => x.nama).join(', ')}), ${w} × ${h} pt → ${keluar}`);
if (letak[0] === '--comp') { // satu kesatuan = satu comp; ditulis SEKALI, tidak pernah menimpa editan
  const [, f, lb] = letak, [vx, vy, vw, vh] = vb.split(' ').map(Number), k = +lb / vw, r = (n) => +n.toFixed(1), H = Math.round(vh * k); if (!f || !(+lb > 0)) { console.error('pakai: … --comp src/comp/X.tsx <lebar>'); process.exit(1); }
  if (fs.existsSync(f)) { console.error(`${f} sudah ada, tidak ditimpa (bisa berisi editan Simon).`); process.exit(1); }
  const impor = path.relative(path.dirname(path.resolve(f)), path.resolve(keluar)).replace(/\.tsx$/, ''), dari = impor.startsWith('.') ? impor : './' + impor;
  fs.mkdirSync(path.dirname(path.resolve(f)), { recursive: true });
  fs.writeFileSync(f, `import React from 'react';\nimport { Interactive } from 'remotion';\nimport { ${nama}Bagian } from '${dari}';\n\n/** SATU KESATUAN = SATU COMP (${lb} × ${H}). Bagiannya layer sendiri; di scene tampil sebagai satu objek: <${nama} name="${nama}" style={{ translate: '…px …px' }} /> */\nconst Isi: React.FC<{ readonly style?: React.CSSProperties }> = ({ style }) => (\n  <div style={{ position: 'absolute', left: 0, top: 0, width: ${lb}, height: ${H}, ...style }}>\n` + isi.map(({ nama: n, ketat: [x, y, a, b] }) => `    <Interactive.Svg name="${n}" viewBox="${[x, y, a, b].join(' ')}" style={{ position: 'absolute', left: 0, top: 0, width: ${r(a * k)}, height: ${r(b * k)}, overflow: 'visible', translate: '${r((x - vx) * k)}px ${r((y - vy) * k)}px' }}><${nama}Bagian b="${n}" /></Interactive.Svg>\n`).join('') + `  </div>\n);\nexport const ${nama} = Interactive.create({ Component: Isi, componentName: '${nama}', layout: 'none' });\n`);
  console.log(`comp → ${f}; daftarkan: <Composition id="Sxx-${nama}" component={${nama}} durationInFrames={…} fps={60} width={${lb}} height={${H}} />`);
} else if (letak.length === 3) { const [lb, X, Y] = letak.map(Number), [vx, vy, vw] = vb.split(' ').map(Number), k = lb / vw, r = (n) => +n.toFixed(1); console.log('\n' + isi.map(({ nama: n, ketat: [x, y, a, t] }) => `<Interactive.Svg name="${nama.toLowerCase()} ${n}" viewBox="${[x, y, a, t].join(' ')}" style={{ position: 'absolute', left: 0, top: 0, width: ${r(a * k)}, height: ${r(t * k)}, overflow: 'visible', translate: '${r(X + (x - vx) * k)}px ${r(Y + (y - vy) * k)}px' }}><${nama}Bagian b="${n}" /></Interactive.Svg>`).join('\n')); }
