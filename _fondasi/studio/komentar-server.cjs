/* PENYIMPAN KOMENTAR DI FRAME (25 Nov) — server kecil di mesin ini saja (127.0.0.1, port Studio + 900), dinyalakan pasang.cjs saat Studio menyala.
 * Hanya menulis satu berkas: komentar/komentar.json. Hanya melayani halaman Studio (Origin dicek). Tidak ikut render. */
const http = require('node:http'), fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const ASAL_UJI = process.env.KOMENTAR_ASAL ? [process.env.KOMENTAR_ASAL] : [];
const baca = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { if (e.code === 'ENOENT') return { berikut: 1, komentar: [], dibuang: [] }; throw e; } };
const tulis = (f, d) => { fs.mkdirSync(path.dirname(f), { recursive: true }); const t = `${f}.${process.pid}.tmp`; fs.writeFileSync(t, JSON.stringify(d, null, 1) + '\n'); fs.renameSync(t, f); };
const teks = (v, n) => typeof v === 'string' ? v.slice(0, n) : '';
const angka = (v) => Number.isFinite(v) ? Math.round(v * 100) / 100 : null;
const lokasi = (l) => l && typeof l === 'object' ? { berkas: teks(l.berkas, 400), baris: angka(l.baris), kolom: angka(l.kolom) } : null;
const kotak = (k) => k && typeof k === 'object' ? { x: angka(k.x), y: angka(k.y), w: angka(k.w), h: angka(k.h) } : null;
const benda = (o) => o && typeof o === 'object' ? { nama: teks(o.nama, 200), jenis: teks(o.jenis, 40), teks: teks(o.teks, 200), src: teks(o.src, 300), kotak: kotak(o.kotak), lokasi: lokasi(o.lokasi) } : null;
const rapi = (d) => ({ comp: teks(d.comp, 200), frame: angka(d.frame), fps: angka(d.fps), x: angka(d.x), y: angka(d.y), objek: benda(d.objek), rantai: Array.isArray(d.rantai) ? d.rantai.slice(0, 8).map(benda) : [], komentar: teks(d.komentar, 4000) });
exports.buat = (berkas, portStudio = 3000) => { const ASAL = new Set([`http://localhost:${portStudio}`, `http://127.0.0.1:${portStudio}`, ...ASAL_UJI]); return http.createServer((q, s) => {
  const asal = q.headers.origin, host = String(q.headers.host ?? '');
  const kirim = (kode, d) => { s.writeHead(kode, { 'content-type': 'application/json', 'cache-control': 'no-store', ...(ASAL.has(asal) ? { 'access-control-allow-origin': asal, 'access-control-allow-headers': 'content-type', vary: 'origin' } : {}) }); s.end(d === undefined ? '' : JSON.stringify(d)); };
  if (!/^(localhost|127\.0\.0\.1):\d+$/.test(host) || !ASAL.has(asal)) return kirim(403, { galat: 'asal ditolak' });
  if (q.method === 'OPTIONS') return kirim(204);
  if (q.url !== '/komentar') return kirim(404, { galat: 'tidak ada' });
  try { if (q.method === 'GET') return kirim(200, baca(berkas)); } catch (e) { return kirim(500, { galat: `komentar.json tidak terbaca: ${e.message}` }); }
  if (q.method !== 'POST' || !/^application\/json/.test(q.headers['content-type'] ?? '')) return kirim(405, { galat: 'cara salah' });
  let b = ''; q.setEncoding('utf8'); q.on('data', (c) => { b += c; if (b.length > 65536) q.destroy(); });
  q.on('end', () => {
    try {
      const m = JSON.parse(b), d = baca(berkas), kini = new Date().toISOString(), i = d.komentar.findIndex((k) => k.id === m.id);
      if (m.aksi === 'tambah') {
        const k = rapi(m.data ?? {}); if (!k.komentar.trim() || !k.comp || k.frame === null) return kirim(400, { galat: 'data kurang' });
        const baru = { id: crypto.randomUUID(), no: d.berikut, status: 'baru', dibuat: kini, ...k, balasan: '' }; d.berikut += 1; d.komentar.push(baru); tulis(berkas, d); return kirim(200, { baru, ...d });
      }
      if (m.aksi === 'kirim') { // tombol "Kirim ke Claude": semua yang baru → dikirim; tunggu-kiriman.mjs yang membangunkan Claude
        const n = d.komentar.filter((k) => k.status === 'baru'); if (!n.length) return kirim(400, { galat: 'tidak ada komentar baru' });
        for (const k of n) { k.status = 'dikirim'; k.dikirim = kini; } (d.kiriman ??= []).push({ waktu: kini, nomor: n.map((k) => k.no) }); tulis(berkas, d); return kirim(200, { jumlah: n.length, ...d });
      }
      if (i < 0) return kirim(404, { galat: 'komentar tidak ditemukan' });
      if (m.aksi === 'ubah') {
        const k = d.komentar[i]; if (typeof m.komentar === 'string' && m.komentar.trim()) { k.komentar = teks(m.komentar, 4000); k.status = 'baru'; } if (m.status === 'baru' || m.status === 'selesai') k.status = m.status;
        k.diubah = kini; tulis(berkas, d); return kirim(200, d);
      }
      if (m.aksi === 'hapus') { (d.dibuang ??= []).push({ ...d.komentar[i], dihapus: kini }); d.komentar.splice(i, 1); tulis(berkas, d); return kirim(200, d); }
      return kirim(400, { galat: 'aksi tidak dikenal' });
    } catch (e) { return kirim(400, { galat: e.message }); }
  });
}); };
exports.mulai = (akar, portStudio = 3000) => {
  if (globalThis.__komentarServer) return;
  const PORT = portStudio + 900, s = exports.buat(path.join(akar, 'komentar', 'komentar.json'), portStudio); globalThis.__komentarServer = s;
  s.on('error', (e) => console.warn(`[komentar] tidak menyala: ${e.message}`));
  s.listen(PORT, '127.0.0.1', () => console.log(`[komentar] siap di 127.0.0.1:${PORT}`)); s.unref();
};
