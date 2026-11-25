// Pemeriksa "gambar per layer" (25 Nov 2026). Hanya membaca.  node _fondasi/alat/cek-layer/cek-layer.mjs "<folder proyek Remotion 4.0.546>" src/s01/Scene01.tsx [berkas lain …]
// Status bisa-diedit diambil dari pemeriksa milik Remotion Studio sendiri (computeSequencePropsStatus…), bukan tebakan.
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const [, , akarM, ...berkas] = process.argv; if (!akarM || !berkas.length) { console.error('pakai: cek-layer.mjs <folder proyek> <berkas.tsx> …'); process.exit(2); }
const akar = fs.realpathSync(akarM), nm = fs.realpathSync(path.join(akar, 'node_modules')), rq = createRequire(nm + '/x.js'), ts = rq('typescript');
const M = rq(nm + '/@remotion/studio-server/dist/preview-server/routes/can-update-sequence-props.js');
const BAWAAN = /^(<|shape layer|layer|null|group|div|svg|untitled|objek|kotak)\s*\d*$/i; let jumlah = 0, salah = 0;
for (const rel of berkas) {
  const file = path.resolve(akar, rel), isi = fs.readFileSync(file, 'utf8'), sf = ts.createSourceFile(file, isi, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const temuan = [], nama = new Map(); let n = 0, terkunci = 0; const brs = (x) => sf.getLineAndCharacterOfPosition(x.getStart(sf));
  const atr = (o, k) => o.attributes.properties.find((p) => ts.isJsxAttribute(p) && p.name.getText(sf) === k);
  const teks = (a) => a?.initializer && (ts.isStringLiteral(a.initializer) ? a.initializer.text : a.initializer.expression && ts.isStringLiteralLike(a.initializer.expression) ? a.initializer.expression.text : null);
  // komponen buatan sendiri = layer hanya bila dibuat dengan Interactive.create (di berkas ini atau di berkas yang diimpor langsung)
  const dibuat = new Set([...isi.matchAll(/(\w+)\s*=\s*Interactive\.create\b/g)].map((m) => m[1]));
  for (const m of isi.matchAll(/import\s*\{([^}]+)\}\s*from\s*'(\.[^']+)'/g)) { const f = ['.tsx', '.ts', '/index.tsx'].map((e) => path.resolve(path.dirname(file), m[2] + e)).find(fs.existsSync); if (!f) continue; const t = fs.readFileSync(f, 'utf8'); for (const a of m[1].split(',')) { const [asal, jadi] = a.trim().split(/\s+as\s+/); if (new RegExp('\\b' + asal + '\\s*=\\s*Interactive\\.create\\b').test(t)) dibuat.add(jadi ?? asal); } }
  const jalan = (x, dalam, ulang) => {
    let d = dalam, u = ulang;
    if (ts.isCallExpression(x) && ts.isPropertyAccessExpression(x.expression) && /^(map|flatMap|from)$/.test(x.expression.name.text)) u = true;
    const o = ts.isJsxElement(x) ? x.openingElement : ts.isJsxSelfClosingElement(x) ? x : null;
    if (o) {
      const tag = o.tagName.getText(sf), L = brs(o), namaA = atr(o, 'name'), lapis = /^Interactive\.[A-Z]/.test(tag) || dibuat.has(tag) || (tag === 'Img' && !!namaA);
      if (lapis) {
        n++; const nm2 = teks(namaA), T = (s) => temuan.push([L.line + 1, nm2 ?? tag, s]);
        if (!nm2) T('nama tidak ditulis langsung'); else { if (BAWAAN.test(nm2)) T('nama bawaan, bukan nama benda'); nama.set(nm2, (nama.get(nm2) ?? 0) + 1); if (nama.get(nm2) === 2) T('nama kembar'); }
        if (u) T('dibuat lewat .map(), tidak bisa diedit satu-satu');
        const st = atr(o, 'style')?.initializer?.expression, kunci = st && ts.isObjectLiteralExpression(st) ? st.properties.filter((p) => ts.isPropertyAssignment(p)).map((p) => 'style.' + p.name.getText(sf).replace(/['"]/g, '')) : [];
        if (st && !ts.isObjectLiteralExpression(st)) T('style bukan objek langsung'); else if (st?.properties.some(ts.isSpreadAssignment)) T('style memakai spread');
        const s = M.computeSequencePropsStatusFromFilenameByLocation({ fileName: path.relative(akar, file), line: L.line + 1, column: L.character, componentIdentity: null, keys: [...kunci, 'from', 'durationInFrames'], effects: [], remotionRoot: akar, logLevel: 'error', fileContentsCache: null });
        if (!s.success) T('Studio tidak mengenali layer ini'); else { const k = Object.entries(s.status.props).filter(([, v]) => v.status === 'computed').map(([a]) => a.replace('style.', '')); if (k.length) { terkunci++; T('terkunci di Studio: ' + k.join(', ')); } }
        if (ts.isJsxElement(x) && /^Interactive\.(Div|Span|P|H\d|Strong|Em|Text)$/.test(tag)) { const a = x.children.filter((c) => !(ts.isJsxText(c) && !c.text.trim())); if (a.some((c) => ts.isJsxExpression(c) && c.expression && !ts.isStringLiteralLike(c.expression)) && !a.some((c) => ts.isJsxElement(c) || ts.isJsxSelfClosingElement(c))) T('teks dihitung kode, tidak bisa diketik di Studio'); }
        d = true;
      } else if (!dalam && (/^(svg|img|Img|canvas|p|span|h\d|path|rect|circle|line|text)$/.test(tag) || (/^[A-Z]\w*$/.test(tag) && !/^(Sequence|Series|TransitionSeries|AbsoluteFill|Track|Folder|Composition|Tumpuk|AuditLayer)$/.test(tag)))) temuan.push([L.line + 1, tag, 'digambar di luar layer']);
    }
    ts.forEachChild(x, (c) => jalan(c, d, u));
  };
  jalan(sf, false, false); jumlah += n; salah += temuan.length;
  console.log(`\n${rel}: ${n} layer, ${temuan.length} temuan`); for (const [l, a, s] of temuan.slice(0, 40)) console.log(`  baris ${String(l).padStart(4)}  ${a}: ${s}`); if (temuan.length > 40) console.log(`  … ${temuan.length - 40} lagi`);
}
console.log(`\nJumlah: ${jumlah} layer, ${salah} temuan`); process.exit(salah ? 1 : 0);
