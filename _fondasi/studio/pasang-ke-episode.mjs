// Pasang Studio Tuntun ke satu proyek episode:  node _fondasi/studio/pasang-ke-episode.mjs "<folder proyek Remotion>" [--cek]
// Hanya menambah satu blok di remotion.config.ts (cadangan: remotion.config.ts.sebelum-studio). Tidak menyentuh src, package.json, atau node_modules.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const SINI = path.dirname(fileURLToPath(import.meta.url)), [, , folder, ...opsi] = process.argv; if (!folder) { console.error('Sebutkan folder proyek Remotion.'); process.exit(1); }
const p = path.resolve(folder), cfg = ['remotion.config.ts', 'remotion.config.js'].map((f) => path.join(p, f)).find(fs.existsSync), TANDA = '// >>> STUDIO TUNTUN';
if (!fs.existsSync(path.join(p, 'package.json')) || !cfg) { console.error('Bukan proyek Remotion (package.json / remotion.config.ts tidak ada).'); process.exit(1); }
if (!fs.existsSync(path.join(SINI, 'pasang.cjs'))) process.exit(1);
const ver = (() => { try { return JSON.parse(fs.readFileSync(path.join(p, 'node_modules/remotion/package.json'), 'utf8')).version; } catch { return 'belum terpasang'; } })(), src = fs.readFileSync(cfg, 'utf8');
console.log(`proyek : ${path.basename(p)}\nRemotion: ${ver}${ver === '4.0.546' ? ' (cocok)' : ' — fitur lengkap butuh 4.0.546; di versi lain bagian yang tidak cocok tampil seperti bawaan'}`);
if (src.includes(TANDA)) { console.log('sudah terpasang, tidak ada yang diubah.'); process.exit(0); }
if (/studio-align[\\/]loader\.cjs/.test(src)) { console.log('proyek ini memakai salinan lama (studio-align). Hapus dulu blok lamanya di remotion.config.ts.'); process.exit(2); }
if (opsi.includes('--cek')) { console.log('belum terpasang (hanya cek).'); process.exit(0); }
const blok = `${TANDA} — satu sumber di _fondasi/studio (panel rata, seleksi, komentar C, panel Project & layer ala AE, cari/solo/kunci/U). Hapus blok ini = Studio bawaan.
import { createRequire as tuntunRequire } from "node:module";
import tuntunFs from "node:fs";
import tuntunPath from "node:path";
{ let d = process.cwd(); while (!tuntunFs.existsSync(tuntunPath.join(d, "_fondasi/studio/pasang.cjs")) && d !== tuntunPath.dirname(d)) d = tuntunPath.dirname(d);
  const f = tuntunPath.join(d, "_fondasi/studio/pasang.cjs"); if (tuntunFs.existsSync(f)) tuntunRequire(f)(f).pasang(Config); else console.warn("[studio-tuntun] _fondasi/studio tidak ditemukan, Studio bawaan dipakai"); }
// <<< STUDIO TUNTUN
`;
const impor = [...src.matchAll(/^import[^\n]*\n/gm)].pop(), di = impor ? impor.index + impor[0].length : 0; if (!/from\s+["']@remotion\/cli\/config["']/.test(src)) { console.error('remotion.config.ts tidak mengimpor Config dari @remotion/cli/config.'); process.exit(1); }
const cad = cfg + '.sebelum-studio'; if (!fs.existsSync(cad)) fs.copyFileSync(cfg, cad);
const t = cfg + '.tmp'; fs.writeFileSync(t, src.slice(0, di) + blok + src.slice(di)); fs.renameSync(t, cfg); console.log('terpasang di', path.basename(cfg), '· nyalakan ulang Studio supaya terbaca.');
