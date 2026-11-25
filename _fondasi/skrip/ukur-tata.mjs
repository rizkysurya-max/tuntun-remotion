// UKUR TATA LETAK (11 Nov, Simon: "Aligment visual sangat buruk … perbaiki alat yang kamu gunakan agar hasilnya akurat").
// Render MODE UKUR (kanvas scene = hijau kunci lewat <Kanvas/>, tanpa watermark/subtitle) skala 0,5 untuk frame tertentu → out/ukur-tata/fNNNNN.png
// lalu jalankan: python3 scripts/ukur-tata.py   (pusat komposisi + kelompok visual + jarak antarkelompok, dalam px frame penuh)
// pakai: node scripts/ukur-tata.mjs 1200 1500 …        (frame GLOBAL)
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path'; import fs from 'node:fs'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const frames = process.argv.slice(2).map(Number);
const inputProps = { ukur: true };
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const composition = await selectComposition({ serveUrl, id: process.env.COMP || 'BiarkanMrMarket', inputProps });
const dir = path.join(root, 'out/ukur-tata'); fs.mkdirSync(dir, { recursive: true });
for (const frame of frames) {
  await renderStill({ serveUrl, composition, frame, output: path.join(dir, `f${String(frame).padStart(5, '0')}.png`), inputProps, scale: Number(process.env.SKALA || 0.5) });
}
fs.rmSync(serveUrl, { recursive: true, force: true });
console.log(dir);
