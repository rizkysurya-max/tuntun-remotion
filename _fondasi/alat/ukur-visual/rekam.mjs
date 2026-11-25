// UKUR VISUAL tahap 1: rekam (25 Nov 2026, Simon "okey lanjutkan" atas usulan skrip ukur; idenya dari aturan anything2explainer & onetake, kodenya sendiri).
// Hanya MEMBACA proyek: bundel & gambar ditulis di luar proyek. Butuh AuditProbe (src/audit/AuditProbe.tsx) di proyeknya.
// pakai (dari folder proyek Remotion):  node <alat>/rekam.mjs <komposisi> <folder keluaran> [langkah=6] [awal] [akhir]
// keluaran: kotak.jsonl (satu baris per frame: kotak semua benda) + g/fNNNNN.jpg (480×270)
import { createRequire } from 'node:module'; import path from 'node:path'; import fs from 'node:fs';
const req = createRequire(path.join(process.cwd(), 'package.json')), { bundle } = req('@remotion/bundler'), { renderFrames, selectComposition } = req('@remotion/renderer');
const [, , comp, out, langkah = '6', awal, akhir] = process.argv; const G = path.join(out, 'g'); fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(G, { recursive: true });
const inputProps = { audit: true }, serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts'), enableCaching: false, symlinkPublicDir: true });
const c = await selectComposition({ serveUrl, id: comp, inputProps }); const tulis = fs.createWriteStream(path.join(out, 'kotak.jsonl')); const ada = new Set(), galat = []; let n = 0; const t0 = Date.now();
await renderFrames({ composition: c, serveUrl, inputProps, outputDir: G, imageFormat: 'jpeg', jpegQuality: 70, scale: 0.25, frameRange: [Number(awal ?? 0), Number(akhir ?? c.durationInFrames - 1)], everyNthFrame: Number(langkah), logLevel: 'error', onStart: () => {}, muted: true,
  onFrameUpdate: (k) => { if (k % 500 === 0) console.log(k, 'frame', Math.round((Date.now() - t0) / 1000), 'dtk'); },
  onBrowserLog: (l) => { const t = l.text ?? ''; if (t.startsWith('AUDIT{')) { const f = Number(t.slice(10, t.indexOf(','))); if (!ada.has(f)) { ada.add(f); tulis.write(t.slice(5) + '\n'); n++; } } else if (t.startsWith('AUDITERR')) galat.push(t); } });
await new Promise((r) => tulis.end(r)); fs.rmSync(serveUrl, { recursive: true, force: true });
fs.writeFileSync(path.join(out, 'meta.json'), JSON.stringify({ comp, fps: c.fps, w: c.width, h: c.height, n: c.durationInFrames, langkah: Number(langkah), awal: Number(awal ?? 0) }));
console.log(`terekam ${n} frame, ${fs.readdirSync(G).length} gambar, ${Math.round((Date.now() - t0) / 1000)} dtk`, galat.length ? `GALAT ${galat.length}: ${galat[0]}` : '');
