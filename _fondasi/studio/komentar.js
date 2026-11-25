/* KOMENTAR DI FRAME (25 Nov) — disisipkan loader.cjs ke SelectedOutlineOverlay. Hanya Studio, tidak ikut render, tidak menulis kode.
 *  · C = mode komentar (Esc / C lagi = keluar) · klik objek → tulis koreksi → Enter · pin bernomor di frame-nya · tombol "Komentar" = daftar, klik = lompat
 *  · "Kirim ke Claude" = semua komentar merah jadi "dikirim"; tunggu-kiriman.mjs membangunkan Claude (25 Nov). Merah baru · oranye dikirim · biru dikerjakan · ungu perlu jawaban · hijau selesai
 *  · disimpan ke komentar/komentar.json proyek itu lewat komentar-server.cjs (127.0.0.1, port Studio + 900): comp, frame, titik, objek, teks, baris kode */
const KM = { data: null, hidup: null, mode: false, daftar: false, pilih: null };
const kmUrl = () => window.__komentarUrl ?? `http://127.0.0.1:${(Number(location.port) || 3000) + 900}/komentar`;
const kmEl = (tag, gaya, isi) => { const e = document.createElement(tag); if (gaya) e.style.cssText = gaya; if (isi !== undefined) e.textContent = isi; return e; };
const kmFont = "font-family:Inter,Arial,sans-serif;", kmTombol = kmFont + "font-size:12px;line-height:16px;padding:5px 10px;border-radius:5px;border:1px solid #3a3f44;background:#2b3137;color:#fff;cursor:pointer;";
const KM_WARNA = { baru: "#D51C39", dikirim: "#E49C2C", dikerjakan: "#2F9FC4", tanya: "#5F4DEE", selesai: "#22B573" }, KM_KET = { dikirim: "menunggu Claude", dikerjakan: "sedang dikerjakan", tanya: "perlu jawabanmu" }, kmWarna = (k) => KM_WARNA[k.status] ?? KM_WARNA.baru;
const kmWaktu = (k) => { const f = k.fps || 60, d = k.frame / f; return `${Math.floor(d / 60)}:${(d % 60).toFixed(2).padStart(5, "0")}`; };
const usePrKomentar = () => {
  const R = __React, I = __Internals;
  const sequences = I.useSequenceManagerSequences(), kalkulasi = useTimelineCalculator(), pilihComp = useSelectComposition();
  const { overrideIdToNodePathMappings } = R.useContext(I.OverrideIdsToNodePathsGettersContext);
  const { compositions, canvasContent } = R.useContext(I.CompositionManager);
  const kini = R.useRef(null);
  kini.current = { pilihComp, compositions, comp: canvasContent?.type === "composition" ? canvasContent.compositionId : null, tracks: () => kalkulasi({ sequences, overrideIdsToNodePaths: overrideIdToNodePathMappings }).tracks };
  R.useEffect(() => {
    let mati = false, raf = 0, sidik = "";
    const akar = () => document.querySelector(".remotion-studio-composition-container")?.parentElement ?? null;
    const ukur = () => { const p = I.portalNode().getBoundingClientRect(), d = getCurrentDimensions(), a = akar()?.getBoundingClientRect(); return { p, a, sk: p.width / d.width }; };
    const keComp = (x, y) => { const { p, sk } = ukur(); return { x: (x - p.left) / sk, y: (y - p.top) / sk }; };
    const lapis = kmEl("div", "position:fixed;inset:0;z-index:9000;pointer-events:none;" + kmFont); lapis.setAttribute("data-komentar", ""); document.body.appendChild(lapis);
    const tirai = kmEl("div", "position:absolute;display:none;pointer-events:auto;cursor:crosshair;"); lapis.appendChild(tirai);
    const sorot = kmEl("div", "position:absolute;display:none;border:2px solid #E49C2C;border-radius:3px;box-sizing:border-box;pointer-events:none;"); lapis.appendChild(sorot);
    const namaSorot = kmEl("div", "position:absolute;left:-2px;top:-24px;background:#E49C2C;color:#16181B;font-size:11px;line-height:16px;font-weight:600;padding:2px 7px;border-radius:3px;white-space:nowrap;max-width:360px;overflow:hidden;text-overflow:ellipsis;"); sorot.appendChild(namaSorot);
    const spanduk = kmEl("div", "position:absolute;display:none;transform:translateX(-50%);background:#E49C2C;color:#16181B;font-size:12px;line-height:16px;font-weight:600;padding:6px 12px;border-radius:6px;white-space:nowrap;", "Mode komentar: klik objeknya. Esc = keluar"); lapis.appendChild(spanduk);
    const wadahPin = kmEl("div", "position:absolute;inset:0;pointer-events:none;"); lapis.appendChild(wadahPin);
    const pil = kmEl("button", kmTombol + "position:absolute;pointer-events:auto;background:#1f2428;"); pil.type = "button"; pil.setAttribute("data-komentar-pil", ""); lapis.appendChild(pil);
    const kirimT = kmEl("button", kmTombol + "position:absolute;display:none;pointer-events:auto;background:#5F4DEE;border-color:#5F4DEE;font-weight:600;"); kirimT.type = "button"; kirimT.setAttribute("data-komentar-kirim", ""); lapis.appendChild(kirimT);
    const panel = kmEl("div", "position:absolute;display:none;pointer-events:auto;width:340px;max-height:60vh;overflow:auto;background:#1f2428;border:1px solid #3a3f44;border-radius:8px;box-shadow:0 12px 32px rgba(0,0,0,.45);color:#fff;font-size:12px;line-height:17px;"); panel.setAttribute("data-komentar-daftar", ""); lapis.appendChild(panel);
    const pop = kmEl("div", "position:absolute;display:none;pointer-events:auto;width:320px;box-sizing:border-box;background:#1f2428;border:1px solid #3a3f44;border-radius:8px;box-shadow:0 12px 32px rgba(0,0,0,.5);color:#fff;font-size:12px;line-height:17px;padding:12px;"); pop.setAttribute("data-komentar-kotak", ""); lapis.appendChild(pop);
    const kabar = kmEl("div", "position:absolute;display:none;transform:translateX(-50%);background:#16181B;color:#fff;font-size:12px;line-height:16px;padding:8px 14px;border-radius:6px;border:1px solid #3a3f44;"); lapis.appendChild(kabar);
    const gayaHit = document.createElement("style"); gayaHit.textContent = ".remotion-studio-composition-container * { pointer-events: auto !important; }";
    for (const e of [pop, panel]) for (const t of ["keydown", "keyup", "keypress", "pointerdown", "mousedown", "wheel"]) e.addEventListener(t, (v) => v.stopPropagation());
    let tKabar = 0; const beri = (s) => { kabar.textContent = s; kabar.style.display = "block"; clearTimeout(tKabar); tKabar = setTimeout(() => { kabar.style.display = "none"; }, 3200); };
    /* ── server ── */
    const ambil = async () => {
      try { const r = await fetch(kmUrl(), { cache: "no-store" }); const d = await r.json(); if (!r.ok) throw new Error(d.galat); KM.data = d; KM.hidup = true; } catch (e) { KM.hidup = false; }
      if (!mati) gambarDaftar();
    };
    const kirim = async (m) => {
      const r = await fetch(kmUrl(), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(m) }), d = await r.json(); if (!r.ok) throw new Error(d.galat ?? r.status);
      KM.data = { berikut: d.berikut, komentar: d.komentar, dibuang: d.dibuang, kiriman: d.kiriman }; KM.hidup = true; if (!mati) gambarDaftar(); return d;
    };
    let sedangKirim = false; const kirimSemua = () => { if (sedangKirim) return; sedangKirim = true; coba(async () => { try { const d = await kirim({ aksi: "kirim" }); beri(`${d.jumlah} komentar dikirim ke Claude`); } finally { sedangKirim = false; } }); };
    const coba = (j) => j().catch((e) => beri(`Gagal menyimpan: ${e.message}. Nyalakan ulang Studio bila terus gagal.`));
    /* ── objek di titik ── */
    const penuh = (el) => { const { p } = ukur(), r = el.getBoundingClientRect(); return r.width >= p.width * 0.98 && r.height >= p.height * 0.98; };
    const teksLangsung = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    const tampak = (el) => { for (let e = el; e && e !== I.portalNode(); e = e.parentElement) { const c = getComputedStyle(e); if (c.visibility === "hidden" || parseFloat(c.opacity) < 0.05) return false; } return true; };
    const petaTrack = () => { const m = new Map(); for (const t of kini.current.tracks()) { const e = t.sequence.refForOutline?.current; if (e instanceof Element && e.isConnected && !m.has(e)) m.set(e, t); } return m; };
    const isiTeks = (el) => ((el instanceof HTMLElement ? el.innerText : el.textContent) ?? "").replace(/\s+/g, " ").trim();
    const namaBenda = (el, t) => {
      if (t?.sequence.displayName) return t.sequence.displayName;
      const s = isiTeks(el); if (s && s.length <= 60) return `"${s}"`;
      const src = el.getAttribute?.("src") ?? el.getAttribute?.("href"); if (src && !src.startsWith("data:")) return decodeURIComponent(src.split("?")[0].split("/").pop());
      const a = el.tagName.toLowerCase(); return a === "svg" || el instanceof SVGElement ? "gambar vektor" : a === "img" ? "gambar" : s ? `"${s.slice(0, 40)}…"` : "kotak";
    };
    const stackFiber = (el) => { const k = Object.keys(el).find((x) => x.startsWith("__reactFiber$")); return k ? el[k]?._debugStack?.stack ?? null : null; };
    const rantaiDi = (x, y, peta) => {
      const porta = I.portalNode(); gayaHit.isConnected || document.head.appendChild(gayaHit);
      const simpan = tirai.style.pointerEvents; tirai.style.pointerEvents = "none";
      const kena = document.elementsFromPoint(x, y).filter((e) => e !== porta && porta.contains(e)); tirai.style.pointerEvents = simpan; gayaHit.remove();
      const tergambar = (e) => {
        const r = e.getBoundingClientRect(), { p } = ukur();
        if (e instanceof SVGElement) {
          if (Math.min(r.width, r.height) < 2 && Math.max(r.width / p.width, r.height / p.height) > 0.6) return false;                        // garis kisi
          if (e.tagName.toLowerCase() === "svg" && r.width * r.height > p.width * p.height * 0.15 && !kena.some((k) => k !== e && e.contains(k))) return false;
          return true;
        }
        if (prBerwujud(e)) return true;
        const b = prBatas(e); return !!b && x >= b.left - 4 && x <= b.right + 4 && y >= b.top - 4 && y <= b.bottom + 4;
      };
      const awal = kena.find((e) => !penuh(e) && (prBerwujud(e) || teksLangsung(e) || peta.has(e)) && tampak(e) && tergambar(e)); if (!awal) return [];
      const out = [];
      for (let e = awal; e && e !== porta; e = e.parentElement) {
        const t = peta.get(e); if (penuh(e) || !(t || prBerwujud(e) || teksLangsung(e))) continue;
        if (e instanceof SVGElement && e.tagName.toLowerCase() !== "svg" && !t && e.ownerSVGElement && !penuh(e.ownerSVGElement)) continue;   // garis di dalam ikon → ikonnya
        const b = prBatas(e) ?? e.getBoundingClientRect(), pr = ukur().p; if (b.right - b.left >= pr.width * 0.98 && b.bottom - b.top >= pr.height * 0.98) continue;   // pembungkus adegan, isinya selebar frame
        const sama = out.find((o) => ["left", "top", "right", "bottom"].every((s) => Math.abs(o.b[s] - b[s]) < 1.5));
        if (sama) { if (t) Object.assign(sama, { el: e, t, nama: namaBenda(e, t) }); continue; }   // kotak sama → layer bernama terluar
        out.push({ el: e, t, b, nama: namaBenda(e, t) }); if (out.length >= 6) break;
      }
      return out;
    };
    /* bawaan: objek bernama terluar (panah hitam); tanpa nama → yang benar-benar diklik */
    const bawaan = (r) => { for (let i = r.length - 1; i >= 0; i--) if (r[i].t && !/^S\d\d\b|konteks/i.test(r[i].nama)) return i; return 0; };   // layer adegan utuh (S01…, konteks) bukan sasaran koreksi
    const lokasi = async (o) => {
      const coba1 = async (s) => { const l = await getOriginalLocationFromStack(s, "sequence"); return l?.source ? { berkas: String(l.source).replace(/^webpack:\/+/, "").replace(/^\.\//, ""), baris: l.line, kolom: l.column } : null; };
      try { const s = o.t?.sequence.getStack?.(); if (s) { const l = await coba1(s); if (l) return l; } } catch {}
      for (let e = o.el, n = 0; e && n < 4; e = e.parentElement, n++) for (const b of (stackFiber(e) ?? "").split("\n").filter((z) => /^\s+at /.test(z)).slice(0, 8)) { try { const l = await coba1("Error\n" + b); if (l) return l; } catch {} }
      return null;
    };
    const batas = (j, ms) => Promise.race([j, new Promise((r) => setTimeout(() => r(null), ms))]);
    const benda = async (o) => {
      const { p, sk } = ukur(), b = o.b;
      return { nama: o.nama, jenis: o.t ? "layer" : o.el.tagName.toLowerCase(), teks: isiTeks(o.el).slice(0, 200), src: (o.el.getAttribute?.("src") ?? "").startsWith("data:") ? "" : o.el.getAttribute?.("src") ?? "",
        kotak: { x: (b.left - p.left) / sk, y: (b.top - p.top) / sk, w: (b.right - b.left) / sk, h: (b.bottom - b.top) / sk }, lokasi: await batas(lokasi(o), 5000) };
    };
    /* ── kotak tulis & kotak baca ── */
    const taruh = (x, y, b = null) => { pop.style.display = "block"; const h = pop.offsetHeight, w = pop.offsetWidth, kanan = b ? b.right + 16 : x + 18, kiri = b ? b.left - w - 16 : x - w - 18; pop.style.left = (kanan + w <= innerWidth - 8 ? kanan : kiri >= 8 ? kiri : Math.max(8, Math.min(innerWidth - w - 8, x + 18))) + "px"; pop.style.top = Math.max(8, Math.min(innerHeight - h - 8, y - 20)) + "px"; };
    const tutupPop = () => { pop.style.display = "none"; pop.replaceChildren(); KM.pilih = null; if (!KM.mode) sorot.style.display = "none"; };
    const gambarSorot = (o) => { if (!o) { sorot.style.display = "none"; return; } Object.assign(sorot.style, { display: "block", left: o.b.left - 3 + "px", top: o.b.top - 3 + "px", width: o.b.right - o.b.left + 6 + "px", height: o.b.bottom - o.b.top + 6 + "px" }); namaSorot.textContent = o.nama; };
    const kolomTeks = (isi) => { const a = kmEl("textarea", kmFont + "display:block;width:100%;box-sizing:border-box;min-height:74px;resize:vertical;margin-top:8px;background:#14171a;color:#fff;border:1px solid #3a3f44;border-radius:5px;padding:8px;font-size:13px;line-height:18px;outline:none;"); a.placeholder = "Tulis koreksi. Enter = simpan, Shift+Enter = baris baru"; a.value = isi; return a; };
    const tulisBaru = (x, y) => {
      const r = rantaiDi(x, y, petaTrack()), c = keComp(x, y), frame = getCurrentFrame(), comp = kini.current.comp; let i = bawaan(r);
      pop.replaceChildren(); KM.pilih = "baru";
      pop.appendChild(kmEl("div", "color:#a6a9ac;font-size:11px;", `${comp} · frame ${frame} · ${kmWaktu({ frame, fps: getCurrentFps() })}`));
      const chip = kmEl("div", "display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;"); pop.appendChild(chip);
      const lukis = () => { chip.replaceChildren(); (r.length ? [...r].reverse() : []).concat([null]).forEach((o) => { const k = o ? r.indexOf(o) : -1, b = kmEl("button", kmTombol + `max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:3px 8px;${k === i ? "background:#E49C2C;color:#16181B;border-color:#E49C2C;font-weight:600;" : ""}`, o ? o.nama : "Seluruh frame"); b.type = "button"; b.onclick = () => { i = k; lukis(); a.focus(); }; chip.appendChild(b); }); gambarSorot(i >= 0 ? r[i] : null); };
      const a = kolomTeks(""); pop.appendChild(a);
      const kaki = kmEl("div", "display:flex;gap:6px;justify-content:flex-end;margin-top:8px;"), batal = kmEl("button", kmTombol, "Batal"), ok = kmEl("button", kmTombol + "background:#5F4DEE;border-color:#5F4DEE;font-weight:600;", "Simpan"); batal.type = ok.type = "button"; kaki.append(batal, ok); pop.appendChild(kaki);
      if (!r.length) i = -1; lukis();
      batal.onclick = tutupPop;
      ok.onclick = () => { const s = a.value.trim(); if (!s) { a.focus(); return; } ok.disabled = true; ok.textContent = "Menyimpan…"; coba(async () => {
        try { const rantai = await Promise.all(r.map(benda)); const d = await kirim({ aksi: "tambah", data: { comp, frame, fps: getCurrentFps(), x: c.x, y: c.y, objek: i >= 0 ? rantai[i] : { nama: "Seluruh frame", jenis: "frame" }, rantai, komentar: s } }); tutupPop(); beri(`Komentar ${d.baru.no} tersimpan`); }
        finally { ok.disabled = false; ok.textContent = "Simpan"; } }); };
      a.onkeydown = (e) => { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); ok.click(); } if (e.key === "Escape") { e.preventDefault(); tutupPop(); } };
      taruh(x, y, i >= 0 ? r[i].b : null); a.focus();
    };
    const bacaKomentar = (id, x, y) => {
      const k = KM.data?.komentar.find((z) => z.id === id); if (!k) return; pop.replaceChildren(); KM.pilih = id;
      pop.appendChild(kmEl("div", "color:#a6a9ac;font-size:11px;", `Komentar ${k.no} · ${k.objek?.nama ?? "Seluruh frame"} · frame ${k.frame}`));
      const isi = kmEl("div", "margin-top:6px;white-space:pre-wrap;font-size:13px;line-height:18px;", k.komentar); pop.appendChild(isi);
      if (k.balasan) pop.appendChild(kmEl("div", "margin-top:8px;padding:8px;border-radius:5px;background:#14171a;color:#9fe3c0;white-space:pre-wrap;", k.balasan));
      const kaki = kmEl("div", "display:flex;gap:6px;justify-content:flex-end;margin-top:10px;"); pop.appendChild(kaki);
      const T = (s, f) => { const b = kmEl("button", kmTombol, s); b.type = "button"; b.onclick = () => f(b); kaki.appendChild(b); return b; };
      T("Hapus", (b) => { if (b.dataset.yakin) { coba(async () => { await kirim({ aksi: "hapus", id }); tutupPop(); beri(`Komentar ${k.no} dihapus`); }); } else { b.dataset.yakin = "1"; b.textContent = "Yakin hapus?"; b.style.background = "#D51C39"; } });
      T("Ubah", () => { const a = kolomTeks(k.komentar); isi.replaceWith(a); kaki.replaceChildren(); T("Batal", () => bacaKomentar(id, x, y)); T("Simpan", () => { if (a.value.trim()) coba(async () => { await kirim({ aksi: "ubah", id, komentar: a.value.trim() }); bacaKomentar(id, x, y); }); }); a.onkeydown = (e) => { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); kaki.lastChild.click(); } if (e.key === "Escape") { e.preventDefault(); bacaKomentar(id, x, y); } }; a.focus(); });
      if (KM_KET[k.status]) pop.insertBefore(kmEl("div", `margin-top:8px;font-size:11px;font-weight:600;color:${k.status === "tanya" ? "#b9b0ff" : kmWarna(k)};`, k.status === "tanya" ? "Perlu jawabanmu: tekan Ubah, tulis jawabannya, lalu Kirim lagi" : KM_KET[k.status]), kaki);
      if (k.status === "dikirim") T("Tarik", () => coba(async () => { await kirim({ aksi: "ubah", id, status: "baru" }); tutupPop(); beri(`Komentar ${k.no} ditarik`); }));
      T(k.status === "selesai" ? "Buka lagi" : "Selesai", () => coba(async () => { await kirim({ aksi: "ubah", id, status: k.status === "selesai" ? "baru" : "selesai" }); tutupPop(); }));
      T("Tutup", tutupPop);
      taruh(x, y);
    };
    /* ── daftar ── */
    const gambarDaftar = () => {
      const semua = KM.data?.komentar ?? [], hit = (s) => semua.filter((k) => k.status === s).length, baru = hit("baru"), jalan = hit("dikirim") + hit("dikerjakan"), tanya = hit("tanya");
      kirimT.textContent = `Kirim ${baru} ke Claude`; kirimT.dataset.ada = baru && KM.hidup !== false ? "1" : "";
      pil.textContent = KM.hidup === false ? "Komentar mati" : `Komentar ${baru}  ·  C${jalan ? `  ·  ${jalan} dikirim` : ""}${tanya ? `  ·  ${tanya} perlu jawaban` : ""}`; pil.style.color = KM.hidup === false ? "#8b9095" : "#fff"; pil.style.borderColor = KM.mode ? "#E49C2C" : "#3a3f44";
      panel.style.display = KM.daftar ? "block" : "none"; sidik = ""; if (!KM.daftar) return;
      panel.replaceChildren(); const kep = kmEl("div", "position:sticky;top:0;background:#1f2428;padding:10px 12px;border-bottom:1px solid #3a3f44;font-weight:600;", `${baru} belum dikirim · ${jalan} dikirim${tanya ? ` · ${tanya} perlu jawaban` : ""} · ${hit("selesai")} selesai`); panel.appendChild(kep);
      if (baru) { const t = kmEl("button", kmTombol + "display:block;margin-top:8px;background:#5F4DEE;border-color:#5F4DEE;font-weight:600;", `Kirim ${baru} ke Claude`); t.type = "button"; t.onclick = kirimSemua; kep.appendChild(t); }
      if (!semua.length) panel.appendChild(kmEl("div", "padding:12px;color:#a6a9ac;", "Belum ada komentar. Tekan C lalu klik objek di frame."));
      for (const k of [...semua].sort((a, b) => { const u = ["tanya", "baru", "dikerjakan", "dikirim", "selesai"], x = u.indexOf(a.status) - u.indexOf(b.status); return x || a.comp.localeCompare(b.comp) || a.frame - b.frame; })) {
        const b = kmEl("button", kmFont + "display:block;width:100%;text-align:left;background:transparent;border:0;border-bottom:1px solid #2b3137;color:#fff;padding:9px 12px;cursor:pointer;font-size:12px;line-height:17px;" + (k.status === "selesai" ? "opacity:.55;" : "")); b.type = "button"; b.setAttribute("data-komentar-baris", String(k.no));
        b.append(kmEl("span", `display:inline-block;min-width:18px;height:18px;line-height:18px;border-radius:9px;text-align:center;font-size:11px;font-weight:700;margin-right:8px;color:#fff;background:${kmWarna(k)};`, String(k.no)), ...(KM_KET[k.status] ? [kmEl("span", `color:${k.status === "tanya" ? "#b9b0ff" : kmWarna(k)};font-weight:600;margin-right:6px;`, KM_KET[k.status])] : []), kmEl("span", "color:#a6a9ac;", `${k.comp} · ${kmWaktu(k)} · ${k.objek?.nama ?? ""}`), kmEl("div", "margin-top:3px;white-space:pre-wrap;", k.komentar));
        if (k.balasan) b.append(kmEl("div", "margin-top:3px;color:#9fe3c0;white-space:pre-wrap;", k.balasan));
        b.onclick = () => { const c = kini.current.compositions.find((z) => z.id === k.comp); if (!c) { beri(`Comp ${k.comp} tidak ada lagi`); return; } I.timeValueRef?.current?.pause?.(); kini.current.pilihComp(c, kini.current.comp !== k.comp, k.frame); tutupPop(); };
        panel.appendChild(b);
      }
    };
    /* ── pin: dalam 30 frame dari waktunya ── */
    const gambarPin = () => {
      const { p, a, sk } = ukur(), f = getCurrentFrame(), dekat = (KM.data?.komentar ?? []).filter((k) => k.comp === kini.current.comp && Math.abs(k.frame - f) <= 30);
      const s = JSON.stringify([p.left, p.top, p.width, a?.left, a?.top, a?.width, a?.height, KM.mode, kirimT.textContent, kirimT.dataset.ada, pil.textContent, dekat.map((k) => [k.id, k.status, k.frame === f])]); if (s === sidik) return; sidik = s;
      wadahPin.replaceChildren();
      if (!a) { kirimT.style.display = pil.style.display = panel.style.display = tirai.style.display = spanduk.style.display = "none"; return; }
      pil.style.display = "block"; Object.assign(pil.style, { left: a.left + 12 + "px", top: a.bottom - 40 + "px" }); Object.assign(kirimT.style, { display: kirimT.dataset.ada ? "block" : "none", left: a.left + 12 + pil.offsetWidth + 8 + "px", top: a.bottom - 40 + "px" }); Object.assign(panel.style, { left: a.left + 12 + "px", bottom: innerHeight - a.bottom + 48 + "px" });
      Object.assign(tirai.style, { display: KM.mode ? "block" : "none", left: a.left + "px", top: a.top + "px", width: a.width + "px", height: a.height + "px" });
      Object.assign(spanduk.style, { display: KM.mode ? "block" : "none", left: a.left + a.width / 2 + "px", top: a.top + 12 + "px" }); Object.assign(kabar.style, { left: a.left + a.width / 2 + "px", top: a.bottom - 52 + "px" });
      for (const k of dekat) {
        const x = p.left + k.x * sk, y = p.top + k.y * sk; if (x < a.left || x > a.right || y < a.top || y > a.bottom) continue;
        const b = kmEl("button", kmFont + `position:absolute;left:${x - 12}px;top:${y - 12}px;width:24px;height:24px;border-radius:12px 12px 12px 2px;border:2px solid #fff;padding:0;font-size:11px;line-height:20px;font-weight:700;color:#fff;cursor:pointer;pointer-events:auto;box-shadow:0 2px 6px rgba(0,0,0,.4);background:${kmWarna(k)};opacity:${k.frame === f ? 1 : 0.55};`, String(k.no)); b.type = "button"; b.setAttribute("data-komentar-pin", String(k.no)); b.title = k.komentar;
        b.onclick = (e) => { e.stopPropagation(); bacaKomentar(k.id, x, y); }; b.onpointerdown = (e) => e.stopPropagation(); wadahPin.appendChild(b);
      }
    };
    const putar = () => { if (mati) return; try { gambarPin(); } catch (e) { console.error("[komentar]", e); } raf = requestAnimationFrame(putar); };
    /* ── mode ── */
    const setMode = (v) => { if (v && KM.hidup === false) { ambil().then(() => { if (KM.hidup) setMode(true); else beri("Penyimpan komentar tidak menyala. Nyalakan ulang Studio."); }); return; } KM.mode = v; if (v) I.timeValueRef?.current?.pause?.(); else { tutupPop(); sorot.style.display = "none"; } gambarDaftar(); };
    let terakhir = 0; tirai.addEventListener("pointermove", (e) => { if (KM.pilih || e.timeStamp - terakhir < 40) return; terakhir = e.timeStamp; const r = rantaiDi(e.clientX, e.clientY, petaTrack()); gambarSorot(r.length ? r[bawaan(r)] : null); });
    tirai.addEventListener("pointerleave", () => { if (!KM.pilih) sorot.style.display = "none"; });
    tirai.addEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); if (e.button === 0) tulisBaru(e.clientX, e.clientY); });
    kirimT.onpointerdown = (e) => e.stopPropagation(); kirimT.onclick = kirimSemua;
    pil.onpointerdown = (e) => e.stopPropagation(); pil.onclick = () => { KM.daftar = !KM.daftar; gambarDaftar(); if (KM.hidup === false) ambil(); };
    const tombol = (e) => {
      const t = e.target instanceof Element ? e.target : null; if (t?.closest("input,textarea,select,[contenteditable=true],[contenteditable=''],.monaco-editor,[role=dialog]") || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.toLowerCase() === "c" && !e.shiftKey && !e.repeat && kini.current.comp) { e.preventDefault(); e.stopImmediatePropagation(); setMode(!KM.mode); return; }
      if (e.key === "Escape" && (KM.mode || pop.style.display === "block" || KM.daftar)) { e.preventDefault(); e.stopImmediatePropagation(); if (pop.style.display === "block") tutupPop(); else if (KM.mode) setMode(false); else { KM.daftar = false; gambarDaftar(); } }
    };
    addEventListener("keydown", tombol, true);
    const jam = setInterval(() => { if (document.visibilityState === "visible") ambil(); }, 4000); ambil(); raf = requestAnimationFrame(putar);
    return () => { mati = true; cancelAnimationFrame(raf); clearInterval(jam); clearTimeout(tKabar); removeEventListener("keydown", tombol, true); gayaHit.remove(); lapis.remove(); };
  }, []);
};
