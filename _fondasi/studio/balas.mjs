// Claude menandai & membalas komentar (25 Nov): node balas.mjs <komentar.json> <no> <dikerjakan|selesai|tanya> ["balasan"]
import fs from 'node:fs'; const [, , f, no, status, balasan] = process.argv; if (!f || !no || !['dikerjakan', 'selesai', 'tanya'].includes(status)) { console.error('pakai: balas.mjs <komentar.json> <no> <dikerjakan|selesai|tanya> ["balasan"]'); process.exit(2); }
const d = JSON.parse(fs.readFileSync(f, 'utf8')), k = d.komentar.find((x) => x.no === Number(no)); if (!k) { console.error(`komentar ${no} tidak ada`); process.exit(1); }
if (k.status === 'baru') { console.error(`komentar ${no} sedang diubah/ditarik Simon, tidak disentuh`); process.exit(1); }
k.status = status; if (balasan !== undefined) k.balasan = balasan; k.diubah = new Date().toISOString(); const t = `${f}.${process.pid}.tmp`; fs.writeFileSync(t, JSON.stringify(d, null, 1) + '\n'); fs.renameSync(t, f); console.log(`komentar ${no} → ${status}`);
