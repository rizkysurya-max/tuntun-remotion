/* PANEL RATA ala Illustrator — disisipkan loader.cjs ke dalam bundel Studio (bukan ke node_modules).
 * Nama __React/__Internals diganti loader dengan nama di bundel. Hanya Studio; tidak ikut render. */
const PR_SIMPAN = { get: (k, d) => { try { return localStorage.getItem("panelRata." + k) ?? d; } catch { return d; } }, set: (k, v) => { try { localStorage.setItem("panelRata." + k, v); } catch {} } };
/* batas TAMPAK: kotak pembungkus tanpa latar/garis/isi dilewati, yang dihitung benda yang terlihat di dalamnya (chip di dalam kotak 400×100 → chip-nya) */
const prBerwujud = (el) => {
  const t = el.tagName.toLowerCase();
  if (["img", "svg", "canvas", "video"].includes(t) || el instanceof SVGElement) return true;
  const c = getComputedStyle(el);
  if (c.backgroundImage !== "none" || c.boxShadow !== "none" || c.borderTopStyle !== "none" && parseFloat(c.borderTopWidth) > 0) return true;
  return !(c.backgroundColor === "transparent" || /rgba\(.*, 0\)$/.test(c.backgroundColor));
};
const prGabung = (a, b) => !a ? b : !b ? a : { left: Math.min(a.left, b.left), top: Math.min(a.top, b.top), right: Math.max(a.right, b.right), bottom: Math.max(a.bottom, b.bottom) };
const prBatas = (el) => {
  const ambil = (r) => r.width > 0 && r.height > 0 ? { left: r.left, top: r.top, right: r.right, bottom: r.bottom } : null;
  if (!(el instanceof Element)) return ambil(el.getBoundingClientRect());
  if (prBerwujud(el)) return ambil(el.getBoundingClientRect());
  let out = null;
  for (const n of el.childNodes) {
    if (n.nodeType === 3 && n.textContent.trim()) { const g = document.createRange(); g.selectNodeContents(n); out = prGabung(out, ambil(g.getBoundingClientRect())); }
    else if (n.nodeType === 1 && getComputedStyle(n).display !== "none") out = prGabung(out, prBatas(n));
  }
  return out;
};
/* ── hitungan murni (koordinat komposisi) ── */
const prTepi = (b, s) => s === "left" ? b.left : s === "right" ? b.right : s === "top" ? b.top : s === "bottom" ? b.bottom : s === "ch" ? (b.left + b.right) / 2 : (b.top + b.bottom) / 2;
const prRata = (kotak, acuan, sisi) => kotak.map((b) => sisi === "cc" ? { dx: prTepi(acuan, "ch") - prTepi(b, "ch"), dy: prTepi(acuan, "cv") - prTepi(b, "cv") }
  : ["left", "ch", "right"].includes(sisi) ? { dx: prTepi(acuan, sisi) - prTepi(b, sisi), dy: 0 } : { dx: 0, dy: prTepi(acuan, sisi) - prTepi(b, sisi) });
const prBagi = (kotak, acuan, sisi) => {
  const x = ["left", "ch", "right"].includes(sisi), urut = kotak.map((b, i) => ({ i, v: prTepi(b, sisi) })).sort((a, b) => a.v - b.v), n = urut.length;
  const awal = acuan ? prTepi(acuan, x ? "left" : "top") + (urut[0].v - (x ? kotak[urut[0].i].left : kotak[urut[0].i].top)) : urut[0].v;
  const akhir = acuan ? prTepi(acuan, x ? "right" : "bottom") - ((x ? kotak[urut[n - 1].i].right : kotak[urut[n - 1].i].bottom) - urut[n - 1].v) : urut[n - 1].v;
  const out = kotak.map(() => ({ dx: 0, dy: 0 }));
  urut.forEach((u, k) => { const d = awal + (akhir - awal) * k / (n - 1) - u.v; out[u.i] = x ? { dx: d, dy: 0 } : { dx: 0, dy: d }; });
  return out;
};
const prJarak = (kotak, acuan, sumbu, px, iKunci) => {
  const x = sumbu === "h", A = x ? "left" : "top", Z = x ? "right" : "bottom", urut = kotak.map((b, i) => i).sort((p, q) => kotak[p][A] - kotak[q][A]), n = urut.length;
  const out = kotak.map(() => ({ dx: 0, dy: 0 })), set = (i, v) => { const d = v - kotak[i][A]; out[i] = x ? { dx: d, dy: 0 } : { dx: 0, dy: d }; };
  const L = (i) => kotak[i][Z] - kotak[i][A];
  if (iKunci !== null) {
    const k = urut.indexOf(iKunci);
    let p = kotak[iKunci][Z]; for (let j = k + 1; j < n; j++) { set(urut[j], p + px); p += px + L(urut[j]); }
    p = kotak[iKunci][A]; for (let j = k - 1; j >= 0; j--) { p -= px + L(urut[j]); set(urut[j], p); }
    return out;
  }
  const a = acuan ? acuan[A] : kotak[urut[0]][A], z = acuan ? acuan[Z] : Math.max(...kotak.map((b) => b[Z])), sela = (z - a - urut.reduce((s, i) => s + L(i), 0)) / (n - 1);
  let p = a; for (const i of urut) { set(i, p); p += L(i) + sela; }
  return out;
};
const PR_IKON = {
  left: "M3 2v16 M5 5h11v4H5z M5 11h7v4H5z", ch: "M10 2v3 M10 9v2 M10 15v3 M4 5h12v4H4z M6 11h8v4H6z", right: "M17 2v16 M4 5h11v4H4z M8 11h7v4H8z", cc: "M10 2v5 M10 13v5 M2 10h5 M13 10h5 M7 7h6v6H7z",
  top: "M2 3h16 M5 5h4v11H5z M11 5h4v7h-4z", cv: "M2 10h3 M9 10h2 M15 10h3 M5 4h4v12H5z M11 6h4v8h-4z", bottom: "M2 17h16 M5 4h4v11H5z M11 8h4v7h-4z",
  dTop: "M3 3h14 M3 11h14 M6 3h8v4H6z M5 11h10v4H5z", dCv: "M3 5h3 M14 5h3 M3 14h2 M15 14h2 M6 3h8v4H6z M5 12h10v4H5z", dBottom: "M3 8h14 M3 17h14 M6 4h8v4H6z M5 13h10v4H5z",
  dLeft: "M3 3v14 M11 3v14 M3 6h4v8H3z M11 5h4v10h-4z", dCh: "M5 3v3 M5 14v3 M14 3v2 M14 15v2 M3 6h4v8H3z M12 5h4v10h-4z", dRight: "M8 3v14 M17 3v14 M4 6h4v8H4z M13 5h4v10h-4z",
  jV: "M6 2h10v5H6z M4 13h14v5H4z M2 7v6 M1 7h2 M1 13h2", jH: "M2 6h5v10H2z M13 4h5v14h-5z M7 2h6 M7 1v2 M13 1v2",
  artboard: "M6 6h9l3 3v9H6z M2 6h2 M6 2v2", selection: "M4 4h12v12H4z M3 3h2v2H3z M15 3h2v2h-2z M3 15h2v2H3z M15 15h2v2h-2z", kunci: "M4 4h12v12H4z M8 10h4 M10 8v4",
  utuh: "M5 3l10 8-5 .6 2.6 5-2 1-2.6-5L5 16z", isi: "M5 3l10 8-5 .6 2.6 5-2 1-2.6-5L5 16z",
};
const PrTombol = ({ k, label, on, mati, aktif, hover, kosong }) => __React.createElement("button", {
  type: "button", "aria-label": label, disabled: mati, onClick: () => { hover(null); on(); }, onPointerDown: (e) => e.stopPropagation(), onMouseEnter: () => hover(label), onMouseLeave: () => hover(null),
  style: { width: 30, height: 26, padding: 0, border: aktif ? "1px solid #0b84f3" : "1px solid transparent", borderRadius: 4, background: aktif ? "rgba(11,132,243,0.22)" : "transparent", color: mati ? "#4a5056" : "#d6d9dc", cursor: mati ? "default" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" } },
  __React.createElement("svg", { viewBox: "0 0 20 20", width: 18, height: 18, style: { pointerEvents: "none" } }, __React.createElement("path", { d: PR_IKON[k], fill: kosong ? "none" : "currentColor", fillOpacity: k === "utuh" ? 1 : 0.55, stroke: "currentColor", strokeWidth: 1.3 })));
const PanelRata = ({ selectedTracks }) => {
  const R = __React, I = __Internals;
  const { previewServerState } = R.useContext(StudioServerConnectionCtx);
  const propStatusesRef = R.useContext(I.VisualModePropStatusesRefContext);
  const dragOverridesRef = R.useContext(I.VisualModeDragOverridesRefContext);
  const { setPropStatuses, updateDragOverrides } = R.useContext(I.VisualModeSettersContext);
  const sequences = I.useSequenceManagerSequences(), kalkulasi = useTimelineCalculator();
  const { overrideIdToNodePathMappings } = R.useContext(I.OverrideIdsToNodePathsGettersContext);
  const semua = R.useMemo(() => kalkulasi({ sequences, overrideIdsToNodePaths: overrideIdToNodePathMappings }).tracks, [kalkulasi, sequences, overrideIdToNodePathMappings]);
  const [ke, setKe] = R.useState(() => PR_SIMPAN.get("ke", "selection"));
  const [cara, setCara] = R.useState(() => PR_SIMPAN.get("cara", "utuh"));
  const [px, setPx] = R.useState(() => PR_SIMPAN.get("px", "24"));
  const [kunci, setKunci] = R.useState(null);
  const [pesan, setPesan] = R.useState(null);
  const [arah, setArah] = R.useState(null);
  const elDari = (t) => { const e = t?.sequence.refForOutline?.current; return e instanceof Element ? e : null; };
  const bisaDipilih = (t) => t && t.nodePathInfo && t.sequence.controls && t.sequence.controls.schema?.[translateFieldKey]?.type === "translate" && elDari(t);
  const penuh = (el) => { const k = I.portalNode().getBoundingClientRect(), r = el.getBoundingClientRect(); return r.width >= k.width * 0.98 && r.height >= k.height * 0.98; };
  const kartu = (t) => ({ id: JSON.stringify(t.nodePathInfo.sequenceSubscriptionKey), t, nama: t.sequence.displayName, el: elDari(t) });
  const unik = (a) => { const l = new Set(); return a.filter((d) => !l.has(d.id) && l.add(d.id)); };
  /* OBJEK YANG DIHITUNG: seluruh adegan (selebar frame) diabaikan · "utuh" = isi (teks, pop, gambar) diwakili objek terluarnya, seperti panah hitam
     Illustrator · "isi" = panah putih: lapisan terpilih apa adanya; bila induk & anak sama-sama terpilih, induknya yang dipakai, kecuali hanya ada satu induk */
  let obj = unik(selectedTracks.map((s) => s.track).filter(bisaDipilih).map(kartu)).filter((d) => !penuh(d.el));
  if (cara === "utuh") {
    const wadah = semua.filter(bisaDipilih).map(kartu).filter((d) => !penuh(d.el));
    obj = unik(obj.map((d) => { let t = d; for (const w of wadah) if (w.el !== t.el && w.el.contains(t.el)) t = w; return t; }));
  }
  const luar = (a) => a.filter((d) => !a.some((o) => o !== d && o.el !== d.el && o.el.contains(d.el)));
  let puncak = luar(obj);
  while (puncak.length === 1 && obj.length > 2) { const sisa = obj.filter((d) => d !== puncak[0]), p2 = luar(sisa); if (p2.length < 2 && sisa.length < 2) break; obj = sisa; puncak = p2; }
  obj = puncak;
  const n = obj.length, mode = n < 2 ? "artboard" : ke, kunciAktif = obj.some((d) => d.id === kunci) ? kunci : obj[n - 1]?.id;
  const jalan = (label, hitung) => {
    if (previewServerState.type !== "connected" || !isStudioInteractivityEnabled()) { setPesan("Studio belum tersambung ke server. Muat ulang halaman."); return; }
    const { width, height } = getCurrentDimensions(), kr = I.portalNode().getBoundingClientRect(), sk = kr.width / width, ok = [], lewat = [];
    for (const d of obj) {
      const c = d.t.sequence.controls, nodePath = d.t.nodePathInfo.sequenceSubscriptionKey, st = I.getPropStatusesCtx(propStatusesRef.current, nodePath), ov = dragOverridesRef.current.getDragOverrides(nodePath);
      const frame = (getCurrentFrame() - d.t.keyframeDisplayOffset) * d.t.keyframePlaybackRate;
      const skema = getSelectedOutlineActiveSchema({ schema: c.schema, currentRuntimeValueDotNotation: c.runtimeValues.getSnapshot(), dragOverrides: ov, propStatus: st, frame });
      const f = skema?.[translateFieldKey], p = st?.[translateFieldKey], b = prBatas(d.el);
      if (f?.type !== "translate" || !isPropStatusDraggable(p)) { lewat.push(`${d.nama} (posisinya dihitung kode)`); continue; }
      if (!b) { lewat.push(`${d.nama} (tidak terlihat di frame ini)`); continue; }
      const nilai = p ? String(I.getEffectiveVisualModeValue({ propStatus: p, dragOverrideValue: ov[translateFieldKey], defaultValue: f.default, frame, shouldResortToDefaultValueIfUndefined: true }) ?? f.default ?? "0px 0px") : String(f.default ?? "0px 0px");
      ok.push({ ...d, c, nodePath, f, p, nilai, kotak: { left: (b.left - kr.left) / sk, right: (b.right - kr.left) / sk, top: (b.top - kr.top) / sk, bottom: (b.bottom - kr.top) / sk } });
    }
    const catatan = lewat.length ? ` Dilewati: ${lewat.join(", ")}.` : "";
    if (!ok.length) { setPesan("Tidak ada objek yang bisa digeser." + catatan); return; }
    const K = ok.map((d) => d.kotak), art = { left: 0, top: 0, right: width, bottom: height }, iK = Math.max(0, ok.findIndex((d) => d.id === kunciAktif));
    const geser = hitung(K, mode === "artboard" ? art : mode === "kunci" ? K[iK] : K.reduce(prGabung, null), mode === "kunci" ? iK : null, art);
    if (!geser) { setPesan(`Butuh minimal 3 objek yang terlihat; sekarang ${ok.length}.` + catatan); return; }
    const pratinjau = createCanvasDragPreview({ updateDragOverrides, setPropStatuses, setPropStatusesBatch: null, getPropStatuses: (path) => propStatusesRef.current[I.makeSequencePropsSubscriptionKey(path)] });
    const changes = [], addedKeyframes = [];
    ok.forEach((d, i) => {
      const { dx, dy } = geser[i]; if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return;
      const [x, y, z] = parseTranslate(d.nilai), value = serializeTranslate([Math.round((x + dx) * 100) / 100, Math.round((y + dy) * 100) / 100, z]);
      const kf = d.p?.status === "keyframed" ? getKeyframeSourceFrame({ displayFrame: getCurrentFrame(), keyframeDisplayOffset: getKeyframeDisplayOffset({ propStatus: d.p, keyframeDisplayOffset: d.t.keyframeDisplayOffset, keyframePlaybackRate: d.t.keyframePlaybackRate }), keyframePlaybackRate: d.t.keyframePlaybackRate, propStatus: d.p }) : null;
      pratinjau.setDragOverrides(d.nodePath, translateFieldKey, kf !== null ? I.makeKeyframedDragOverride({ status: d.p, frame: kf, value }) : I.makeStaticDragOverride(value));
      const ch = { fileName: d.nodePath.absolutePath, nodePath: d.nodePath, fieldKey: translateFieldKey, value, schema: d.c.schema };
      if (kf === null) changes.push({ ...ch, defaultValue: d.f.default !== undefined ? JSON.stringify(d.f.default) : null }); else addedKeyframes.push({ ...ch, sourceFrame: kf });
    });
    const jumlah = changes.length + addedKeyframes.length;
    if (!jumlah) { setPesan("Sudah rata, tidak ada yang digeser." + catatan); return; }
    setPesan(`${label}: ${jumlah} objek digeser.` + catatan);
    saveSequencePropsWithResult({ changes, addedKeyframes: addedKeyframes.length ? addedKeyframes : null, movedKeyframes: null, setPropStatuses: pratinjau.setPropStatuses, clientId: previewServerState.clientId, undoLabel: label, redoLabel: label })
      .then((r) => { if (r && !r.canUpdate) throw new Error("elemen tidak bisa diubah"); pratinjau.acknowledge(r); })
      .catch((e) => { pratinjau.fail(); setPesan(`Gagal menyimpan: ${e.message}`); });
  };
  const aman = (label, hitung) => { try { jalan(label, hitung); } catch (e) { setPesan(`Gagal: ${e.message}`); console.error("[panel-rata]", e); } };
  const h = R.createElement, baris = (...c) => h("div", { style: { display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" } }, ...c), judul = (t) => h("div", { style: { color: "#a6a9ac", fontFamily: "sans-serif", fontSize: 12, margin: "8px 0 4px" } }, t), spasi = (k) => h("div", { key: k, style: { width: 10 } });
  const T = (p) => h(PrTombol, { ...p, hover: setArah });
  const rata = (k, l) => T({ key: k, k, label: l, mati: n === 0, on: () => aman(l, (K, a) => prRata(K, a, k)) });
  const bagi = (k, s, l) => T({ key: k, k, label: l, mati: n < 3, on: () => aman(l, (K, a, i, art) => K.length < 3 ? null : prBagi(K, mode === "artboard" ? art : null, s)) });
  const jarak = (k, s, l) => T({ key: k, k, label: l, mati: n < 2 || mode !== "kunci" && n < 3, on: () => aman(l, (K, a, i, art) => mode !== "kunci" && K.length < 3 || K.length < 2 ? null : prJarak(K, mode === "artboard" ? art : null, s, parseFloat(px) || 0, mode === "kunci" ? i : null)) });
  const tuju = (k, l) => T({ key: k, k, label: l, aktif: mode === k, mati: n < 2, on: () => { setKe(k); PR_SIMPAN.set("ke", k); } });
  const pilih = (k, l, kosong) => T({ key: k, k, label: l, aktif: cara === k, kosong, on: () => { setCara(k); PR_SIMPAN.set("cara", k); setPesan(null); } });
  const nama = obj.map((d) => d.nama), ringkas = n === 0 ? "Belum ada objek yang bisa diratakan. Klik objeknya, bukan latar atau atap." : `${n} objek: ${nama.slice(0, 4).join(", ")}${n > 4 ? ` +${n - 4}` : ""}`;
  const petunjuk = n === 1 ? "1 objek = rata ke artboard. Tambah objek: Shift+klik atau Cmd+klik." : n === 2 ? "Bagi rata butuh 3 objek (objek kunci cukup 2)." : "";
  return h("div", { "data-panel-rata": "", style: { padding: "2px 12px 10px", userSelect: "none", minWidth: 0 } },
    h("div", { "data-rata-objek": "", style: { color: "#fff", fontFamily: "sans-serif", fontSize: 12, lineHeight: "16px", marginTop: 4 } }, ringkas),
    judul("Ratakan objek"), baris(rata("left", "Rata kiri"), rata("ch", "Rata tengah mendatar"), rata("right", "Rata kanan"), rata("cc", "Rata tengah dua arah"), rata("top", "Rata atas"), rata("cv", "Rata tengah tegak"), rata("bottom", "Rata bawah")),
    judul("Bagi rata objek"), baris(bagi("dTop", "top", "Bagi rata tepi atas"), bagi("dCv", "cv", "Bagi rata tengah tegak"), bagi("dBottom", "bottom", "Bagi rata tepi bawah"), spasi("a"), bagi("dLeft", "left", "Bagi rata tepi kiri"), bagi("dCh", "ch", "Bagi rata tengah mendatar"), bagi("dRight", "right", "Bagi rata tepi kanan")),
    judul("Bagi jarak"), baris(jarak("jV", "v", "Bagi jarak tegak"), jarak("jH", "h", "Bagi jarak mendatar"), spasi("b"),
      h("input", { key: "px", type: "number", value: px, disabled: mode !== "kunci", "aria-label": "Jarak px", onKeyDown: (e) => e.stopPropagation(), onChange: (e) => { setPx(e.target.value); PR_SIMPAN.set("px", e.target.value); }, style: { width: 64, height: 24, background: "#1f2428", color: mode === "kunci" ? "#fff" : "#5b6168", border: "1px solid #3a3f44", borderRadius: 4, padding: "0 6px", fontSize: 12 } }), h("span", { key: "pxl", style: { color: "#a6a9ac", fontSize: 12, marginLeft: 4, fontFamily: "sans-serif" } }, "px")),
    judul("Ratakan ke"), baris(tuju("artboard", "Artboard (seluruh frame)"), tuju("selection", "Selection (objek terpilih)"), tuju("kunci", "Objek kunci"), spasi("c"), pilih("utuh", "Objek utuh (panah hitam)"), pilih("isi", "Isi objek (panah putih)", true)),
    mode === "kunci" ? h("select", { value: kunciAktif, "aria-label": "Daftar objek kunci", onChange: (e) => setKunci(e.target.value), style: { marginTop: 6, width: "100%", height: 26, background: "#1f2428", color: "#fff", border: "1px solid #3a3f44", borderRadius: 4, fontSize: 12 } }, obj.map((d) => h("option", { key: d.id, value: d.id }, d.nama))) : null,
    h("div", { "data-rata-pesan": "", style: { color: arah ? "#d6d9dc" : "#8fc7ff", fontFamily: "sans-serif", fontSize: 11, lineHeight: "15px", minHeight: 30, marginTop: 8 } }, arah ?? pesan ?? petunjuk));
};
