/* TAMPILAN ALA AE (25 Nov) — hanya panel Project (daftar comp) & daftar layer. Disisipkan loader.cjs lewat ui-ae.cjs; tidak ikut render. */
const AE = { panel: "#232323", panel2: "#1d1d1d", garis: "#111111", teks: "#c8c8c8", redup: "#8a8a8a", biru: "#4aa3f0" };
/* nama tampil di panel Project: folder Remotion hanya boleh huruf, angka, tanda hubung. 025-Value-Investing → 025. Value Investing; VI04-S01-Rumah → Rumah. Pengecualian: globalThis.tuntunNama (25 Nov) */
const aeNamaProyek = (n, folder) => { const k = globalThis.tuntunNama?.[n]; if (k) return k;
  if (folder) { const t = /^\d{3}-/.test(n) || /^Video-\d+-/.test(n) || /^Scene-\d+$/.test(n); return t ? n.replace(/^(\d{3})-/, "$1. ").replace(/^Video-(\d+)-/, "Video $1 - ").replace(/(\S)-(?=\S)/g, "$1 ").replace(/(\S)-(?=\S)/g, "$1 ") : n; }
  const m = n.match(/^[A-Z]{2,4}\d{2}-(.+)$/); if (!m) return n; const s = m[1].match(/^S(\d{2})(?:-(.+))?$/); return (s ? s[2] ?? `Scene ${+s[1]}` : m[1]).replace(/-/g, " "); };
const AE_WARNA = { comp: "#c9a86a", teks: "#d66a5e", gambar: "#a793d6", ikon: "#6fb07f", audio: "#6cb8a8", video: "#5fa8c7", bentuk: "#6f8fd8", latar: "#8c8c8c", folder: "#d8b65a" };
const AE_COMP = new Set();
const AE_S = { cari: "", jumlah: null, comp: null, solo: new Map(), kunci: new Set((() => { try { return JSON.parse(localStorage.getItem("uiAe.kunci") ?? "[]"); } catch { return []; } })()), versi: 0, u: null, dengar: new Set() };
const AE_D = { nomor: new Map(), kunci: new Map(), induk: new Map(), nama: new Map() };
const aeUbah = () => { AE_S.versi++; AE_S.dengar.forEach((f) => f()); };
const aeDengar = (f) => { AE_S.dengar.add(f); return () => AE_S.dengar.delete(f); };
const aePakai = (f) => __React.useSyncExternalStore(aeDengar, f);
const aeKey = (t) => t.nodePathInfo ? timelineNodePathInfoToKey(t.nodePathInfo).toString() : `${t.sequence.displayName}|${t.sequence.from}|${t.sequence.duration}`;
const aeNamaCari = (t) => { const q = t.sequence, src = typeof q.src === "string" && !q.src.startsWith("data:") ? decodeURIComponent(q.src.split("?")[0].split("/").pop()) : ""; return `${q.displayName ?? ""} ${q.controls?.componentName ?? ""} ${src} ${(t.connectedCompositions ?? []).map((c) => c.id).join(" ")}`.toLowerCase(); };
/* dipanggil saat Studio menyusun baris: catat nomor, kunci, induk; lalu saring menurut kotak cari (yang cocok + induknya, walau terlipat) */
/* URUTAN SEPERTI AFTER EFFECTS (25 Nov): paling atas di daftar = paling depan. Kode TETAP (yang ditulis belakangan = di depan); yang dibalik hanya baris saudara di daftar,
   induk tetap di atas anaknya. Isi Track & Series (dikemas satu baris) tidak dibalik. Arah jatuh saat layer digeser ikut dibalik di ui-ae.cjs ("urutan …"). */
const aeBalik = (snap, indeks) => {
  const kemas = (t) => { const r = t.sequence.timelineTrack; return !!r && r.role !== "track" && (r.role !== "clip" || r.seriesOffset !== null); };
  const olah = (a) => { const blok = []; for (const k of a) { if (!blok.length || snap.tracks[k].depth <= snap.tracks[blok[0][0]].depth) blok.push([k]); else blok[blok.length - 1].push(k); }
    const hasil = blok.map(([k, ...anak]) => [k, ...(anak.length ? olah(anak) : [])]); return (a.length && kemas(snap.tracks[a[0]]) ? hasil : hasil.reverse()).flat(); };
  return olah(indeks);
};
const aeSaring = (snap, hierarchy, comp, indeks) => aeBalik(snap, aeSaringAsli(snap, hierarchy, comp, indeks));
const aeSaringAsli = (snap, hierarchy, comp, indeks) => {
  let n = 0; const D = { nomor: new Map(), kunci: new Map(), induk: new Map(), nama: new Map() };
  for (const q of snap.sequences) D.induk.set(q.id, q.parent);
  for (const k of aeBalik(snap, snap.tracks.map((_, i) => i))) if (snap.tracks[k].depth === 0) D.nomor.set(snap.tracks[k].sequence.id, ++n);
  for (const t of snap.tracks) { D.kunci.set(t.sequence.id, aeKey(t)); D.nama.set(t.sequence.id, t.sequence.displayName); }
  const beda = D.nomor.size !== AE_D.nomor.size || AE_S.comp !== comp || [...D.nomor].some(([k, v]) => AE_D.nomor.get(k) !== v) || [...D.kunci].some(([k, v]) => AE_D.kunci.get(k) !== v);
  Object.assign(AE_D, D); AE_S.comp = comp; if (beda) queueMicrotask(aeUbah);
  const kata = AE_S.cari.trim().toLowerCase().split(/\s+/).filter(Boolean); if (!kata.length) { AE_S.jumlah = null; return indeks; }
  const simpan = new Set(); let cocok = 0;
  for (const t of snap.tracks) { const nm = aeNamaCari(t); if (!kata.every((k) => nm.includes(k))) continue; cocok++; simpan.add(t.sequence.id); for (const a of hierarchy.ancestors.get(t.sequence.id) ?? []) simpan.add(a); }
  const j = `${cocok}/${snap.tracks.length}`; if (j !== AE_S.jumlah) { AE_S.jumlah = j; queueMicrotask(aeUbah); }
  return snap.tracks.flatMap((t, k) => simpan.has(t.sequence.id) ? [k] : []);
};
const aeRantai = (id) => { const o = []; for (let k = id, n = 0; k && n < 40; k = AE_D.induk.get(k), n++) o.push(k); return o; };
const aeKunciSendiri = (id) => AE_S.kunci.has(AE_D.kunci.get(id) ?? "");
const aeTerkunci = (q) => !!AE_S.kunci.size && aeRantai(q.id).some(aeKunciSendiri);
const aeSoloSet = () => AE_S.solo.get(AE_S.comp) ?? new Set();
const aeSoloId = (id) => aeSoloSet().has(AE_D.kunci.get(id) ?? "");
const aeGantiKunci = (id) => { const k = AE_D.kunci.get(id); if (!k) return; AE_S.kunci.has(k) ? AE_S.kunci.delete(k) : AE_S.kunci.add(k); try { localStorage.setItem("uiAe.kunci", JSON.stringify([...AE_S.kunci])); } catch {} aeUbah(); };
const aeGantiSolo = (id, sendiri) => { const k = AE_D.kunci.get(id); if (!k) return; const x = new Set(aeSoloSet()); if (sendiri) { const ada = x.has(k) && x.size === 1; x.clear(); if (!ada) x.add(k); } else x.has(k) ? x.delete(k) : x.add(k); AE_S.solo.set(AE_S.comp, x); aeUbah(); };
const AeNomor = ({ id }) => { const n = aePakai(() => AE_D.nomor.get(id) ?? ""); return aeH("span", { "data-ae-nomor": "", style: { width: 30, boxSizing: "border-box", paddingRight: 8, textAlign: "right", fontSize: 11, lineHeight: "20px", color: AE.redup, fontVariantNumeric: "tabular-nums", flexShrink: 0 } }, n); };
const AE_GEMBOK = "M4 7V5a3 3 0 0 1 6 0v2h1v6H3V7zm1.4 0h3.2V5a1.6 1.6 0 0 0-3.2 0z";
const AeSaklar = ({ id, jenis }) => {
  const on = aePakai(() => jenis === "solo" ? aeSoloId(id) : aeKunciSendiri(id)), dalam = aePakai(() => jenis === "kunci" && !aeKunciSendiri(id) && aeRantai(id).some(aeKunciSendiri));
  const stop = (e) => e.stopPropagation();
  return aeH("button", { type: "button", "data-ae-saklar": jenis, "aria-pressed": on, "aria-label": `${jenis === "solo" ? "Solo" : "Kunci"} ${AE_D.nama.get(id) ?? ""}`, title: jenis === "solo" ? "Solo: hanya layer ini yang tampil (Alt+klik = lepas yang lain)" : "Kunci: tidak bisa dipilih atau digeser",
    onPointerDown: stop, onMouseDown: stop, onDoubleClick: stop, onClick: (e) => { e.stopPropagation(); e.currentTarget.blur(); jenis === "solo" ? aeGantiSolo(id, e.altKey) : aeGantiKunci(id); },
    style: { width: 16, height: 18, padding: 0, border: 0, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "default" } },
    aeH("svg", { viewBox: "0 0 14 14", width: 13, height: 13, style: { pointerEvents: "none" } }, jenis === "solo" ? aeH("circle", { cx: 7, cy: 7, r: 3.4, fill: on ? "#f2d04a" : "#3a3a3a", stroke: on ? "#f2d04a" : "#4a4a4a" }) : aeH("path", { d: AE_GEMBOK, fill: on ? "#e6e6e6" : dalam ? "#7a7a7a" : "#3a3a3a" })));
};
/* gambar tanpa nama → nama berkasnya, seperti footage di AE */
const aeNama = (nama, s) => { const src = typeof s.src === "string" ? s.src : ""; if (s.type !== "image" && !/^<(Img|Image)>$/.test(nama) || nama && !/^<(Img|Image)>$/.test(nama) || !src || src.startsWith("data:")) return nama; return decodeURIComponent(src.split("?")[0].split("/").pop()) || nama; };
const aeJenis = (s) => {
  const n = `${s.displayName ?? ""} ${s.controls?.componentName ?? ""}`;
  if (s.type === "audio") return "audio"; if (s.type === "video") return "video";
  if (AE_COMP.has(s.id) || /konteks|^S\d\d\b/i.test(n)) return "comp";
  if (s.type === "image" || /<(Img|Image|Gif|AnimatedImage)>/i.test(n)) return "gambar";
  if (/\b(teks|judul|nama|subtitle|baris|label|text|span|h[1-6])\b/i.test(n)) return "teks";
  if (/\b(ikon|icon|svg|lambang|lencana|path)\b/i.test(n)) return "ikon";
  if (/\b(latar|kisi|watermark|background)\b/i.test(n)) return "latar";
  return "bentuk";
};
const aeWarna = (s) => AE_WARNA[aeJenis(s)];
const aeH = (...a) => __React.createElement(...a);
/* kolom kiri layer: mata (bawaan Studio) · kotak label · nomor */
const AE_KOLOM = 75;
const aeMata = ({ sequence, nestedDepth, siblingIndex, connectedCompositions, mata }) => {
  if (connectedCompositions?.length) AE_COMP.add(sequence.id);
  return aeH("div", { "data-ae-id": sequence.id, style: { display: "flex", alignItems: "center", alignSelf: "stretch", flexShrink: 0 } }, mata, aeH(AeSaklar, { id: sequence.id, jenis: "solo" }), aeH(AeSaklar, { id: sequence.id, jenis: "kunci" }),
    aeH("span", { "data-ae-label": aeJenis(sequence), style: { width: 11, height: 11, borderRadius: 1, background: aeWarna(sequence), boxShadow: "inset 0 0 0 1px rgba(0,0,0,.45)", marginLeft: 2, flexShrink: 0 } }),
    aeH(AeNomor, { id: sequence.id }));
};
const AeKepalaLayer = () => { const t = { fontSize: 10, lineHeight: "15px", color: AE.redup, fontFamily: "Arial, Helvetica, sans-serif", fontWeight: 400 }; return aeH("div", { "data-ae-kepala": "", style: { position: "absolute", left: 0, right: 0, bottom: 0, height: 16, display: "flex", alignItems: "center", background: "#2d2d2d", borderTop: "1px solid #111", paddingLeft: 10, boxSizing: "border-box" } },
  aeH("span", { style: { width: 22, flexShrink: 0, display: "flex" } }, aeH("svg", { viewBox: "0 0 24 16", width: 12, height: 8, style: { marginLeft: 2 } }, aeH("path", { fill: AE.redup, d: "M24 8s-4.3 8-12 8C4.8 16 0 8 0 8s4.4-8 12-8c7.7 0 12 8 12 8Zm-12 4.7A4.7 4.7 0 1 0 12 3.3a4.7 4.7 0 0 0 0 9.4Zm0-2.2a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" }))),
  aeH("span", { style: { width: 16, flexShrink: 0, display: "flex", justifyContent: "center" } }, aeH("svg", { viewBox: "0 0 14 14", width: 11, height: 11 }, aeH("circle", { cx: 7, cy: 7, r: 3.4, fill: AE.redup }))), aeH("span", { style: { width: 16, flexShrink: 0, display: "flex", justifyContent: "center" } }, aeH("svg", { viewBox: "0 0 14 14", width: 11, height: 11 }, aeH("path", { d: AE_GEMBOK, fill: AE.redup }))),
  aeH("span", { style: { width: 13, flexShrink: 0, display: "flex", justifyContent: "center", paddingLeft: 2, boxSizing: "border-box" } }, aeH("svg", { viewBox: "0 0 10 10", width: 9, height: 9 }, aeH("path", { fill: AE.redup, d: "M0 0h6l4 4-6 6-4-4z" }))),
  aeH("span", { style: { ...t, width: 30, boxSizing: "border-box", paddingRight: 8, textAlign: "right", flexShrink: 0 } }, "#"), aeH("span", { style: { ...t, marginLeft: 17 } }, "Nama Layer"), aeH(AeTombolU)); };
const AeTombolU = () => aeH("button", { type: "button", "data-ae-u": "", "aria-label": "Tampilkan properti yang punya keyframe", title: "U: buka/tutup properti yang punya keyframe (layer terpilih, atau semua)", onPointerDown: (e) => e.stopPropagation(), onClick: (e) => { e.currentTarget.blur(); AE_S.u?.(); }, style: { marginLeft: "auto", marginRight: 6, width: 18, height: 14, padding: 0, border: "1px solid #4a4a4a", borderRadius: 2, background: "transparent", color: AE.teks, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 10, lineHeight: "12px", cursor: "default" } }, "U");
const AeCari = () => {
  const q = aePakai(() => AE_S.cari), n = aePakai(() => AE_S.jumlah), set = (v) => { AE_S.cari = v; aeUbah(); };
  return aeH("div", { style: { position: "absolute", left: 92, right: 142, top: 8, height: 20, minWidth: 54, display: "flex", alignItems: "center", background: "#161616", border: `1px solid ${q ? AE.biru : "#3a3a3a"}`, borderRadius: 3, boxSizing: "border-box" }, onPointerDown: (e) => e.stopPropagation() },
    aeH("input", { "data-ae-cari": "", "aria-label": "Cari layer", placeholder: "Cari layer", value: q, spellCheck: false, onChange: (e) => set(e.target.value), onKeyDown: (e) => { e.stopPropagation(); if (e.key === "Escape") { set(""); e.currentTarget.blur(); } }, style: { flex: 1, minWidth: 0, height: "100%", border: 0, outline: "none", background: "transparent", color: "#e6e6e6", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 11, padding: "0 5px", boxSizing: "border-box" } }),
    q ? aeH("span", { "data-ae-jumlah": "", style: { fontSize: 10, lineHeight: "18px", color: AE.redup, fontFamily: "Arial, Helvetica, sans-serif", fontWeight: 400, paddingRight: 2, flexShrink: 0 } }, (n ?? "").split("/")[0]) : null,
    q ? aeH("button", { type: "button", "aria-label": "Hapus pencarian", onClick: () => set(""), style: { width: 16, height: 18, padding: 0, border: 0, background: "transparent", color: AE.redup, fontSize: 13, lineHeight: "16px", cursor: "default", flexShrink: 0 } }, "×") : null);
};
/* SOLO (CSS pratinjau saja), KUNCI, dan tombol U — dipasang di SelectedOutlineOverlay */
const usePrLayer = () => {
  const R = __React, I = __Internals;
  const { selectItems, selectedItems, clearSelection } = useTimelineSelection();
  const sequences = I.useSequenceManagerSequences(), kalkulasi = useTimelineCalculator();
  const { overrideIdToNodePathMappings } = R.useContext(I.OverrideIdsToNodePathsGettersContext);
  const propStatusesRef = R.useContext(I.VisualModePropStatusesRefContext);
  const { getIsExpanded } = R.useContext(ExpandedTracksGetterContext), { toggleTrack } = R.useContext(ExpandedTracksSetterContext);
  const versi = aePakai(() => AE_S.versi);
  const kini = R.useRef(null);
  kini.current = { selectItems, selectedItems, clearSelection, getIsExpanded, toggleTrack, tracks: () => kalkulasi({ sequences, overrideIdsToNodePaths: overrideIdToNodePathMappings }).tracks };
  /* layer terkunci tidak pernah boleh terpilih, lewat jalan mana pun */
  R.useEffect(() => {
    if (!AE_S.kunci.size || !selectedItems.length) return;
    const peta = new Map(); for (const t of kini.current.tracks()) if (t.nodePathInfo) peta.set(getTimelineSequenceSelectionKey(t.nodePathInfo), t.sequence);
    const sisa = selectedItems.filter((i) => { if (!i.nodePathInfo) return true; const q = peta.get(getTimelineSequenceSelectionKey(i.nodePathInfo)); return !q || !aeTerkunci(q); });
    if (sisa.length !== selectedItems.length) { if (sisa.length) selectItems(sisa); else clearSelection(); }
  }, [selectedItems, versi]);
  R.useEffect(() => {
    let mati = false, raf = 0, terakhir = 0;
    const akar = () => document.querySelector(".remotion-studio-composition-container")?.parentElement ?? null;
    const gaya = document.createElement("style"); gaya.textContent = "[data-ae-solo-on]{visibility:hidden!important}[data-ae-solo-on] [data-ae-solo]{visibility:visible!important}"; document.head.appendChild(gaya);
    const pil = document.createElement("button"); pil.type = "button"; pil.setAttribute("data-ae-solo-pil", ""); pil.style.cssText = "position:fixed;z-index:8000;display:none;font-family:Inter,Arial,sans-serif;font-size:12px;line-height:16px;font-weight:600;padding:5px 10px;border-radius:5px;border:0;background:#f2d04a;color:#16181B;cursor:pointer;"; document.body.appendChild(pil);
    pil.onpointerdown = (e) => e.stopPropagation(); pil.onclick = () => { AE_S.solo.delete(AE_S.comp); aeUbah(); };
    /* elemen DOM milik satu layer: ref-nya; tanpa ref → dicari lewat pohon React (penyedia konteks Sequence ber-id itu) */
    const fiberDari = (el) => { const k = Object.keys(el).find((x) => x.startsWith("__reactFiber$")); return k ? el[k] : null; };
    const idDi = (el) => { const o = []; for (let f = fiberDari(el)?.return; f && f.tag !== 5 && f.tag !== 3 && f.tag !== 4; f = f.return) { const v = f.tag === 10 ? f.memoizedProps?.value : null; if (v && typeof v === "object" && "cumulatedFrom" in v && "id" in v) o.push(v.id); } return o; };
    const elLayer = (ids, peta) => {
      const out = new Set(), tanpaRef = new Set(); for (const id of ids) { const e = peta.get(id)?.refForOutline?.current; if (e instanceof Element && e.isConnected) out.add(e); else tanpaRef.add(id); }
      if (tanpaRef.size) { const turun = (el) => { for (const c of el.children) { if (idDi(c).some((x) => tanpaRef.has(x))) out.add(c); else turun(c); } }; turun(I.portalNode()); }
      return out;
    };
    const lepas = () => { const p = I.portalNode(); p.removeAttribute("data-ae-solo-on"); document.querySelectorAll("[data-ae-solo]").forEach((e) => e.removeAttribute("data-ae-solo")); };
    const putar = (w) => {
      if (mati) return; raf = requestAnimationFrame(putar);
      try {
        const set = aeSoloSet(), a = akar()?.getBoundingClientRect(), p = I.portalNode();
        const ids = set.size ? [...AE_D.kunci].filter(([, k]) => set.has(k)).map(([id]) => id) : [];
        if (!ids.length || !a) { if (p.hasAttribute("data-ae-solo-on")) lepas(); pil.style.display = "none"; return; }
        pil.textContent = `Solo ${ids.length} layer  ×`; Object.assign(pil.style, { display: "block", left: a.left + 12 + "px", top: a.top + 12 + "px" });
        if (w - terakhir < 60) return; terakhir = w;
        const mau = elLayer(ids, new Map(sequencesRef().map((q) => [q.id, q])));
        document.querySelectorAll("[data-ae-solo]").forEach((e) => { if (!mau.has(e)) e.removeAttribute("data-ae-solo"); }); mau.forEach((e) => e.hasAttribute("data-ae-solo") || e.setAttribute("data-ae-solo", "")); p.hasAttribute("data-ae-solo-on") || p.setAttribute("data-ae-solo-on", "");
      } catch (e) { console.error("[solo]", e); }
    };
    const sequencesRef = () => kini.current.tracks().map((t) => t.sequence);
    raf = requestAnimationFrame(putar);
    /* kunci: baris & batang layer terkunci tidak menerima klik/seretan (kecuali tombol di barisnya) */
    const idBaris = (t) => {
      for (let e = t, n = 0; e && n < 14; e = e.parentElement, n++) {
        const v = e.style?.getPropertyValue?.("--ae-id"); if (v) return { id: v, batang: true };
        if (e.getBoundingClientRect().height <= 30) { const x = e.querySelector?.("[data-ae-id]"); if (x) return { id: x.getAttribute("data-ae-id"), batang: false }; }
      }
      return null;
    };
    const tolak = (e) => {
      if (!AE_S.kunci.size || !(e.target instanceof Element)) return;
      if (akar()?.contains(e.target)) {                                     // kanvas: klik & seret sudah disaring seleksi.js; klik ganda (ubah teks) disaring di sini
        if (e.type !== "dblclick") return; const di = document.elementsFromPoint(e.clientX, e.clientY);
        if (kini.current.tracks().some((t) => { const el = t.sequence.refForOutline?.current; return el instanceof Element && aeTerkunci(t.sequence) && di.some((x) => el === x || el.contains(x)); })) { e.preventDefault(); e.stopImmediatePropagation(); }
        return;
      }
      const b = idBaris(e.target); if (!b || !aeRantai(b.id).some(aeKunciSendiri)) return; if (!b.batang && e.target.closest("button")) return;
      e.preventDefault(); e.stopImmediatePropagation();
    };
    const JENIS = ["pointerdown", "mousedown", "click", "dblclick", "contextmenu"]; JENIS.forEach((j) => addEventListener(j, tolak, true));
    /* U */
    AE_S.u = () => {
      const { selectedItems: pilih, tracks, getIsExpanded: buka, toggleTrack: ganti } = kini.current, semua = tracks().filter((t) => t.nodePathInfo && t.sequence.controls);
      const kunciPilih = new Set(pilih.filter((i) => i.nodePathInfo).map((i) => getTimelineSequenceSelectionKey(i.nodePathInfo))), idPilih = new Set(semua.filter((t) => kunciPilih.has(getTimelineSequenceSelectionKey(t.nodePathInfo))).map((t) => t.sequence.id));
      const animasi = (t) => Object.values(I.getPropStatusesCtx(propStatusesRef.current, t.nodePathInfo.sequenceSubscriptionKey) ?? {}).some((x) => x?.status === "keyframed");
      const l = new Set(), target = semua.filter((t) => (!idPilih.size || aeRantai(t.sequence.id).some((x) => idPilih.has(x))) && animasi(t)).filter((t) => { const k = timelineNodePathInfoToStableKey(t.nodePathInfo); return !l.has(k) && l.add(k); });
      if (!target.length) { showNotification(idPilih.size ? "Layer ini tidak punya keyframe" : "Tidak ada layer ber-keyframe", 1600); return; }
      const mau = target.some((t) => !buka(t.nodePathInfo)); target.forEach((t) => { if (buka(t.nodePathInfo) !== mau) ganti(t.nodePathInfo); });
    };
    const tombol = (e) => { const t = e.target instanceof Element ? e.target : null; if (e.key.toLowerCase() !== "u" || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || e.repeat || t?.closest("input,textarea,select,[contenteditable=true],[contenteditable=''],[role=dialog]")) return; e.preventDefault(); e.stopImmediatePropagation(); AE_S.u?.(); };
    addEventListener("keydown", tombol, true);
    return () => { mati = true; cancelAnimationFrame(raf); lepas(); gaya.remove(); pil.remove(); JENIS.forEach((j) => removeEventListener(j, tolak, true)); removeEventListener("keydown", tombol, true); };
  }, []);
};
/* panel Project */
const aeDurasi = (c) => { if (!c?.durationInFrames || !c.fps) return ""; const d = Math.floor(c.durationInFrames / c.fps), f = c.durationInFrames % c.fps, p = (n) => String(n).padStart(2, "0"); return `${Math.floor(d / 3600)}:${p(Math.floor(d / 60) % 60)}:${p(d % 60)}:${p(Math.round(f))}`; };
const AeIkonComp = ({ u = 16, w = AE_WARNA.comp }) => aeH("svg", { viewBox: "0 0 16 16", width: u, height: u, style: { flexShrink: 0 } }, aeH("rect", { x: 1, y: 2.5, width: 14, height: 11, rx: 1, fill: "#3a3a3a", stroke: w }), aeH("path", { d: "M3.2 5h1.2M3.2 8h1.2M3.2 11h1.2M11.6 5h1.2M11.6 8h1.2M11.6 11h1.2", stroke: w, strokeWidth: 1.3 }), aeH("circle", { cx: 7.2, cy: 7.2, r: 1.7, fill: "#e0705f" }), aeH("path", { d: "M8 11.2 10 7.6l1.2 3.6z", fill: "#6f8fd8" }));
const AeInfoProyek = () => {
  const { compositions, canvasContent } = __React.useContext(__Internals.CompositionManager), c = canvasContent?.type === "composition" ? compositions.find((x) => x.id === canvasContent.compositionId) : null;
  const kecil = { color: AE.redup, fontSize: 11, lineHeight: "15px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
  return aeH("div", { "data-ae-info": "", style: { display: "flex", gap: 10, alignItems: "center", padding: "8px 10px", minHeight: 48, boxSizing: "border-box", background: AE.panel, borderBottom: `1px solid ${AE.garis}`, fontFamily: "Arial, Helvetica, sans-serif" } },
    aeH("div", { style: { width: 56, height: 36, background: "#111", border: "1px solid #3a3a3a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, aeH(AeIkonComp, { u: 24 })),
    c ? aeH("div", { style: { minWidth: 0 } }, aeH("div", { style: { color: "#e6e6e6", fontSize: 12, lineHeight: "16px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, c.id), aeH("div", { style: kecil }, `${c.width ?? "?"} × ${c.height ?? "?"}`), aeH("div", { style: kecil }, `Δ ${aeDurasi(c)}, ${c.fps ?? "?"} fps`)) : aeH("div", { style: kecil }, "Pilih satu comp"));
};
const AE_LEBAR = { label: 13, durasi: 60 }, AE_KANAN = 8, AE_RUANG = AE_LEBAR.label + 8 + AE_LEBAR.durasi + AE_KANAN + 6;
const aeSel = (t, w) => aeH("span", { style: { width: w, flexShrink: 0, textAlign: "right", fontSize: 11, lineHeight: "20px", color: AE.redup, fontFamily: "Arial, Helvetica, sans-serif", fontWeight: 400, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" } }, t);
const aeWadah = (...c) => aeH("span", { "data-ae-kolom": "", style: { position: "absolute", right: c[0] === "kepala" ? AE_KANAN + 6 : AE_KANAN, top: 0, bottom: 0, display: "flex", alignItems: "center", gap: 8, pointerEvents: "none" } }, ...c.filter((x) => x !== "kepala"));
const AeKepalaProyek = () => aeH("div", { style: { position: "relative", display: "flex", alignItems: "center", height: 20, padding: "0 8px 0 12px", background: "#2d2d2d", borderBottom: "1px solid #111", flexShrink: 0 } },
  aeH("style", null, "div:has(> .__remotion-composition-selector-item):hover [data-ae-durasi]{visibility:hidden}"),
  aeH("span", { style: { flex: 1, fontSize: 11, lineHeight: "20px", color: AE.teks, fontFamily: "Arial, Helvetica, sans-serif", fontWeight: 400 } }, "Nama"),
  aeWadah("kepala", aeH("svg", { key: "l", viewBox: "0 0 10 10", width: 13, height: 9 }, aeH("path", { fill: AE.redup, d: "M2 0h5l3 4-5 6-4-4z" })), aeSel("Durasi", AE_LEBAR.durasi)));
const aeKolom = (warna, durasi) => aeWadah(aeH("span", { key: "l", style: { width: 11, height: 11, margin: 1, borderRadius: 1, background: warna, boxShadow: "inset 0 0 0 1px rgba(0,0,0,.45)" } }), aeH("span", { key: "d", "data-ae-durasi": "", style: { display: "flex" } }, aeSel(durasi, AE_LEBAR.durasi)));
const AeSegitiga = ({ buka }) => aeH("svg", { viewBox: "0 0 10 10", width: 9, height: 9, style: { flexShrink: 0, transform: buka ? "rotate(90deg)" : "none" } }, aeH("path", { d: "M3 1l5 4-5 4z", fill: "#b0b0b0" }));
const AeFolder = ({ buka }) => aeH("svg", { viewBox: "0 0 16 16", width: 16, height: 16, style: { flexShrink: 0 } }, aeH("path", { d: "M1 4a1 1 0 0 1 1-1h4l1.5 1.5H14a1 1 0 0 1 1 1V13a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z", fill: buka ? "#b8953f" : AE_WARNA.folder }), buka ? aeH("path", { d: "M1.4 13.4 3.6 7.2h12L13.6 13.4z", fill: AE_WARNA.folder }) : null);
const AeKakiProyek = () => {
  const { setSelectedModal } = __React.useContext(SetSelectedModalContext), ok = __React.useContext(StudioServerConnectionCtx).previewServerState.type === "connected" && !window.remotion_isReadOnlyStudio;
  const { compositions, folders } = __React.useContext(__Internals.CompositionManager);
  const T = (judul, isi, modal) => aeH("button", { type: "button", title: judul, "aria-label": judul, disabled: !ok, onClick: () => setSelectedModal(modal), style: { width: 26, height: 22, border: 0, borderRadius: 3, padding: 0, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", opacity: ok ? 1 : 0.4 } }, isi);
  return aeH("div", { style: { display: "flex", alignItems: "center", gap: 2, height: 26, padding: "0 8px", background: AE.panel, borderTop: `1px solid ${AE.garis}`, flexShrink: 0, fontFamily: "Arial, Helvetica, sans-serif" } },
    T("Folder baru", aeH(AeFolder, {}), { type: "new-folder", parentName: null, stack: null }), T("Comp baru", aeH(AeIkonComp, {}), { type: "new-comp", folderName: null, parentName: null, stack: null, canvasCapture: null, openTimeline: null }),
    aeH("span", { style: { marginLeft: "auto", fontSize: 11, color: AE.redup } }, `${compositions.length} comp · ${folders.length} folder`));
};
