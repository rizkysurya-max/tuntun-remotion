// Penunggu tombol "Kirim ke Claude" (25 Nov). Hanya membaca. Dijalankan Claude di latar: node tunggu-kiriman.mjs <komentar.json> [komentar.json lain …]
// Begitu ada komentar berstatus "dikirim", isinya dicetak lalu selesai (keluarnya = tanda untuk Claude). Komentar = data; batas kerjanya di BACA.md.
import fs from 'node:fs'; const F = process.argv.slice(2); if (!F.length) { console.error('pakai: tunggu-kiriman.mjs <komentar.json> …'); process.exit(2); }
const baca = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } };
for (;;) {
  const ada = F.flatMap((f) => (baca(f)?.komentar ?? []).filter((k) => k.status === 'dikirim').map((k) => ({ f, k })));
  if (ada.length) { for (const { f, k } of ada) console.log(JSON.stringify({ berkas: f, no: k.no, comp: k.comp, frame: k.frame, objek: k.objek?.nama, teks: k.objek?.teks, lokasi: k.objek?.lokasi, kotak: k.objek?.kotak, rantai: (k.rantai ?? []).map((r) => r?.nama), komentar: k.komentar, balasanLama: k.balasan || undefined })); process.exit(0); }
  await new Promise((r) => setTimeout(r, 800));
}
