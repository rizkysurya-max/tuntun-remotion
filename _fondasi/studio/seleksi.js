/* SELEKSI ala Illustrator (24 Nov) — disisipkan loader.cjs ke SelectedOutlineOverlay. Hanya Studio.
 *  · seret dari area kosong = kotak seleksi (objek yang TERSENTUH terpilih) · Shift/Cmd = tambah/kurangi · klik kosong = batal pilih
 *  · panah hitam ("utuh"): klik & seret memakai objek terluar, isinya tidak ikut terseret · panah putih ("isi"): lapisan terdalam · Cmd+A = semua objek */
const usePrSeleksi = () => {
  const R = __React, I = __Internals;
  const { selectItems, selectedItems, clearSelection } = useTimelineSelection();
  const sequences = I.useSequenceManagerSequences(), kalkulasi = useTimelineCalculator();
  const { overrideIdToNodePathMappings } = R.useContext(I.OverrideIdsToNodePathsGettersContext);
  const terbaru = R.useRef(null);
  terbaru.current = { selectItems, selectedItems, clearSelection, tracks: () => kalkulasi({ sequences, overrideIdsToNodePaths: overrideIdToNodePathMappings }).tracks };
  R.useEffect(() => {
    const akar = () => document.querySelector(".remotion-studio-composition-container")?.parentElement ?? null;
    const elDari = (t) => { const e = t.sequence.refForOutline?.current; return e instanceof Element && e.isConnected ? e : null; };
    const penuh = (el) => { const k = I.portalNode().getBoundingClientRect(), r = el.getBoundingClientRect(); return r.width >= k.width * 0.98 && r.height >= k.height * 0.98; };
    const id = (n) => JSON.stringify(n.sequenceSubscriptionKey) + n.index;
    const objek = () => {
      const semua = terbaru.current.tracks().filter((t) => t.nodePathInfo && t.sequence.controls?.schema?.[translateFieldKey]?.type === "translate" && !(typeof aeTerkunci === "function" && aeTerkunci(t.sequence))).map((t) => ({ t, el: elDari(t), item: { type: "sequence", nodePathInfo: t.nodePathInfo }, id: id(t.nodePathInfo) })).filter((o) => o.el && !penuh(o.el));
      const utuh = PR_SIMPAN.get("cara", "utuh") === "utuh";
      const pilih = semua.filter((o) => !semua.some((p) => p !== o && p.el !== o.el && (utuh ? p.el.contains(o.el) : o.el.contains(p.el))));
      const l = new Set(); return pilih.filter((o) => !l.has(o.id) && l.add(o.id)).map((o) => ({ ...o, b: prBatas(o.el) })).filter((o) => o.b);
    };
    const terpilih = () => terbaru.current.selectedItems.filter((i) => i.nodePathInfo);
    const idTerpilih = () => new Set(terpilih().map((i) => id(i.nodePathInfo)));
    const pasang = (items) => prFlushSync(() => { if (items.length) terbaru.current.selectItems(items); else terbaru.current.clearSelection(); });
    /* objek teratas di titik (urutan DOM: belakangan = di atas) */
    const diTitik = (x, y, a) => a.filter((o) => x >= o.b.left && x <= o.b.right && y >= o.b.top && y <= o.b.bottom).sort((p, q) => (p.el.compareDocumentPosition(q.el) & 4 ? 1 : -1))[0] ?? null;
    const bolehDiambil = (e) => {
      const k = akar(), t = e.target; if (!k || !(t instanceof Element) || !k.contains(t)) return false;
      if (t.closest("button,input,textarea,select,[role=menu],[role=menuitem],canvas.ruler")) return false;
      const svg = t.closest("svg");
      if (svg && !I.portalNode().contains(svg)) { const n = t.tagName.toLowerCase(); if (!["polygon", "svg", "line", "circle"].includes(n)) return false; }   // panduan, UV, dll. = milik Studio
      else if (!I.portalNode().contains(t) && !t.contains(I.portalNode()) && getComputedStyle(t).cursor !== "auto" && getComputedStyle(t).cursor !== "default") return false;
      return true;
    };
    /* gagang ubah ukuran (garis) & putar (lingkaran) hanya milik objek yang SEDANG terpilih; gagang lapisan dalam yang cuma tersentuh kursor diabaikan */
    const gagangTerpilih = (e, a, idS) => {
      const n = e.target.tagName.toLowerCase(); if (n !== "line" && n !== "circle" || !e.target.closest("svg") || I.portalNode().contains(e.target)) return false;
      const { clientX: x, clientY: y } = e;
      return a.filter((o) => idS.has(o.id)).some((o) => { const r = o.el.getBoundingClientRect(); return [r, o.b].some((b) => {
        if (n === "circle") return [b.left, b.right].some((u) => [b.top, b.bottom].some((v) => Math.hypot(x - u, y - v) <= 16));
        const dx = Math.min(Math.abs(x - b.left), Math.abs(x - b.right)), dy = Math.min(Math.abs(y - b.top), Math.abs(y - b.bottom));
        return dx <= 5 && y >= b.top - 5 && y <= b.bottom + 5 || dy <= 5 && x >= b.left - 5 && x <= b.right + 5; }); });
    };
    const terusan = new WeakSet();
    let diKanvas = false;
    const turun = (e) => {
      if (terusan.has(e)) return;
      diKanvas = !!akar()?.contains(e.target);
      if (e.button !== 0 || e.altKey || !bolehDiambil(e) || !isStudioInteractivityEnabled()) return;
      const x0 = e.clientX, y0 = e.clientY, tambah = e.shiftKey || e.metaKey || e.ctrlKey, a = objek(), kena = diTitik(x0, y0, a), awal = terpilih(), idAwal = idTerpilih();
      if (!tambah && gagangTerpilih(e, a, idAwal)) return;
      if (kena) {
        if (tambah) { e.preventDefault(); e.stopImmediatePropagation(); const sisa = awal.filter((i) => id(i.nodePathInfo) !== kena.id); pasang(idAwal.has(kena.id) ? sisa : [...awal.filter((i) => i.type === "sequence"), kena.item]); return; }
        const sudah = idAwal.has(kena.id), simpan = sudah ? awal : [kena.item];
        if (!sudah) pasang(simpan);                                   // Studio lalu menyeret objek yang sekarang terpilih, bukan teks di dalamnya
        const naik = (u) => { removeEventListener("pointerup", naik, true); if (Math.hypot(u.clientX - x0, u.clientY - y0) < 3) setTimeout(() => pasang(simpan), 0); };
        addEventListener("pointerup", naik, true);
        const n = e.target.tagName.toLowerCase();
        if ((n === "line" || n === "circle") && !I.portalNode().contains(e.target)) {     // gagang milik lapisan dalam → teruskan seretan ke bidang objeknya
          e.preventDefault(); e.stopImmediatePropagation();
          const bidang = document.elementsFromPoint(x0, y0).find((t) => t.tagName.toLowerCase() === "polygon" && akar()?.contains(t)); if (!bidang) return;
          const ulang = new PointerEvent("pointerdown", { bubbles: true, cancelable: true, composed: true, pointerId: e.pointerId, pointerType: e.pointerType, isPrimary: e.isPrimary, button: 0, buttons: 1, clientX: x0, clientY: y0, screenX: e.screenX, screenY: e.screenY, view: window });
          terusan.add(ulang); bidang.dispatchEvent(ulang);
        }
        return;
      }
      e.preventDefault(); e.stopImmediatePropagation();
      document.activeElement instanceof HTMLElement && document.activeElement.matches("input,textarea") && document.activeElement.blur();
      const kotak = document.createElement("div"); kotak.setAttribute("data-rata-kotak", ""); kotak.style.cssText = "position:fixed;z-index:99999;pointer-events:none;border:1px solid #0b84f3;background:rgba(11,132,243,0.12);left:0;top:0;width:0;height:0;display:none"; document.body.appendChild(kotak);
      let geser = false;
      const gerak = (m) => {
        m.preventDefault(); m.stopImmediatePropagation(); geser = geser || Math.hypot(m.clientX - x0, m.clientY - y0) >= 3; if (!geser) return;
        Object.assign(kotak.style, { display: "block", left: Math.min(x0, m.clientX) + "px", top: Math.min(y0, m.clientY) + "px", width: Math.abs(m.clientX - x0) + "px", height: Math.abs(m.clientY - y0) + "px" });
      };
      const selesai = (u) => {
        removeEventListener("pointermove", gerak, true); removeEventListener("pointerup", selesai, true); removeEventListener("pointercancel", selesai, true); kotak.remove();
        if (u.type === "pointercancel") return;
        u.preventDefault(); u.stopImmediatePropagation();
        if (!geser) { if (!tambah) pasang([]); return; }
        const L = Math.min(x0, u.clientX), Rr = Math.max(x0, u.clientX), T = Math.min(y0, u.clientY), B = Math.max(y0, u.clientY);
        const sentuh = objek().filter((o) => o.b.left <= Rr && o.b.right >= L && o.b.top <= B && o.b.bottom >= T);
        const baru = sentuh.map((o) => o.item), ada = new Set(sentuh.map((o) => o.id));
        pasang(tambah ? [...awal.filter((i) => i.type === "sequence" && !ada.has(id(i.nodePathInfo))), ...baru] : baru);
      };
      addEventListener("pointermove", gerak, true); addEventListener("pointerup", selesai, true); addEventListener("pointercancel", selesai, true);
    };
    const tikus = (e) => { if (e.button === 0 && bolehDiambil(e)) e.preventDefault(); };          // teks komposisi jangan tersorot
    const klik = (e) => { if (e.detail > 1 && bolehDiambil(e)) { e.preventDefault(); } };
    const tombol = (e) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "a" || !diKanvas || e.target instanceof Element && e.target.matches("input,textarea,[contenteditable=true]")) return;
      e.preventDefault(); e.stopImmediatePropagation(); pasang(objek().map((o) => o.item));
    };
    addEventListener("pointerdown", turun, true); addEventListener("mousedown", tikus, true); addEventListener("click", klik, true); addEventListener("keydown", tombol, true);
    const gaya = document.createElement("style"); gaya.textContent = ".remotion-studio-composition-container, .remotion-studio-composition-container * { user-select: none !important; -webkit-user-select: none !important; }"; document.head.appendChild(gaya);
    return () => { removeEventListener("pointerdown", turun, true); removeEventListener("mousedown", tikus, true); removeEventListener("click", klik, true); removeEventListener("keydown", tombol, true); gaya.remove(); };
  }, []);
};
