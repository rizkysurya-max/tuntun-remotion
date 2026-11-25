// Siapkan p5 di satu episode:  node _fondasi/gambar/pasang.mjs "<folder proyek Remotion>"   → src/gambar/{P5.tsx, p5.min.js, p5.min.d.ts}. Berkas yang sudah ada tidak ditimpa.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const S = path.dirname(fileURLToPath(import.meta.url)), p = path.resolve(process.argv[2] ?? ''); if (!process.argv[2] || !fs.existsSync(path.join(p, 'src')) || !fs.existsSync(path.join(p, 'package.json'))) { console.error('Sebutkan folder proyek Remotion (punya src/ dan package.json).'); process.exit(1); }
const d = path.join(p, 'src/gambar'); fs.mkdirSync(d, { recursive: true });
for (const [a, b] of [['P5.tsx', 'P5.tsx'], ['node_modules/p5/lib/p5.min.js', 'p5.min.js'], ['p5.min.d.ts', 'p5.min.d.ts']]) { const t = path.join(d, b); if (fs.existsSync(t)) { console.log('sudah ada, dibiarkan:', 'src/gambar/' + b); continue; } fs.copyFileSync(path.join(S, a), t); console.log('disalin: src/gambar/' + b); }
