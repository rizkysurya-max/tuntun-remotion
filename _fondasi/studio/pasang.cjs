/* STUDIO TUNTUN (25 Nov 2026, Simon: "tidak terbatas pada VI06 saja, tapi studio di apapun video yang akan kita buat") — satu sumber untuk semua episode.
 * Dipanggil dari remotion.config.ts (lihat pasang-ke-episode.mjs). node_modules TIDAK diubah; hanya tampilan Studio, tidak ikut render.
 * Isi: panel rata ala Illustrator · seleksi ala Illustrator/Photoshop · komentar di frame (C) · panel Project & layer ala AE · cari, solo, kunci, U */
const fs = require('node:fs'), os = require('node:os'), path = require('node:path'), { execFileSync } = require('node:child_process');
const DIUJI = '4.0.546';
const portStudio = () => { const a = process.argv, i = a.findIndex((x) => x === '--port' || x.startsWith('--port=')); const v = i < 0 ? NaN : Number(a[i].includes('=') ? a[i].split('=')[1] : a[i + 1]); return Number.isInteger(v) && v > 0 ? v : 3000; };
/* Chrome 158+ punya kotak pasir GPU yang tidak bisa membaca folder terlindung macOS (Desktop/Documents/Downloads) → render "Target closed". Salin (klon APFS) ke ~/.cache. */
const chrome = (akar) => {
  if (process.platform !== 'darwin' || !new RegExp(`^${os.homedir()}/(Desktop|Documents|Downloads)/`).test(akar + '/')) return null;
  try {
    const dasar = path.join(akar, 'node_modules/.remotion/chrome-headless-shell'), ver = fs.readdirSync(dasar).filter((v) => /^\d+\./.test(v)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).pop(); if (!ver) return null;
    const sub = fs.readdirSync(path.join(dasar, ver)).find((x) => x.startsWith('mac')), isi = fs.readdirSync(path.join(dasar, ver, sub))[0], sumber = path.join(dasar, ver, sub, isi), tuju = path.join(os.homedir(), '.cache/tuntun-remotion/chrome', ver, isi), exe = path.join(tuju, 'chrome-headless-shell');
    if (!fs.existsSync(exe)) { const t = `${tuju}.${process.pid}.tmp`; fs.mkdirSync(path.dirname(tuju), { recursive: true }); execFileSync('cp', ['-cR', sumber, t]); try { fs.renameSync(t, tuju); } catch { fs.rmSync(t, { recursive: true, force: true }); } }
    return fs.existsSync(exe) ? exe : null;
  } catch { return null; }
};
exports.portStudio = portStudio; exports.chrome = chrome;
exports.pasang = (Config, { akar = process.cwd(), komentar = true } = {}) => {
  let ver = '?'; try { ver = JSON.parse(fs.readFileSync(path.join(akar, 'node_modules/remotion/package.json'), 'utf8')).version; } catch {}
  if (process.argv.includes('studio') && ver !== DIUJI) console.warn(`[studio-tuntun] diuji di Remotion ${DIUJI}, proyek ini ${ver}: bagian yang tidak cocok tampil seperti bawaan.`);
  Config.overrideWebpackConfig((c) => ({ ...c, module: { ...c.module, rules: [...(c.module?.rules ?? []), { test: /@remotion[\\/](studio[\\/]dist[\\/]esm[\\/]index-.*|sdk[\\/]dist[\\/]esm[\\/]index)\.mjs$/, use: [{ loader: path.join(__dirname, 'loader.cjs') }] }] } }));
  const exe = chrome(akar); if (exe) Config.setBrowserExecutable(exe);
  if (komentar && process.argv.includes('studio')) require('./komentar-server.cjs').mulai(akar, portStudio());
};
