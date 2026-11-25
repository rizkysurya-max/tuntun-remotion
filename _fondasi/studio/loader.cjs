// Menyisipkan panel-rata.js ke bundel Studio saat dibangun. node_modules TIDAK diubah. Bila Remotion berubah dan jangkar tak ditemukan → Studio tampil seperti bawaan.
const fs = require('node:fs'), path = require('node:path');
module.exports = function (src) {
  // Shift+klik di kanvas = tambah pilihan (seperti Illustrator); bawaan Studio hanya Cmd/Ctrl
  if (src.includes('var getCanvasOutlineSelectionInteraction = (')) {
    const pola = /(var getCanvasOutlineSelectionInteraction = \(\{[\s\S]*?\}\) => \(\{)\s*shiftKey,\s*toggleKey: metaKey \|\| ctrlKey\s*\}\);/;
    if (!pola.test(src)) this.emitWarning(new Error('[panel-rata] Shift+klik tidak terpasang'));
    src = src.replace(pola, '$1 shiftKey: false, toggleKey: metaKey || ctrlKey || shiftKey });');
  }
  if (!src.includes('AlignmentControlsUnmemoized')) return src;
  const berkas = path.join(__dirname, 'panel-rata.js'); this.addDependency(berkas); const berkasS = path.join(__dirname, 'seleksi.js'); this.addDependency(berkasS); const berkasK = path.join(__dirname, 'komentar.js'); this.addDependency(berkasK);
  const m = src.match(/var AlignmentControls = (React\d*)\.memo\(AlignmentControlsUnmemoized\);/), i = src.match(/var AlignmentControlsUnmemoized[\s\S]*?useContext\d*\((Internals\d*)\.VisualModePropStatusesContext\)/);
  const j = src.match(/targets === null \? \/\* @__PURE__ \*\/ (jsx\d*)\(InspectorMessage, \{\s*children: "Sequence controls unavailable"/);
  const perlu = ['saveSequencePropsWithResult', 'createCanvasDragPreview', 'parseTranslate', 'serializeTranslate', 'getSelectedOutlineActiveSchema', 'translateFieldKey', 'getKeyframeSourceFrame', 'getKeyframeDisplayOffset', 'showNotification', 'isStudioInteractivityEnabled', 'StudioServerConnectionCtx', 'getCurrentDimensions', 'useTimelineCalculator'];
  const perluK = ['useSelectComposition', 'getOriginalLocationFromStack', 'getCurrentFps', 'getCurrentFrame'], hilangK = perluK.filter((k) => !new RegExp(`(var|function|const|let) ${k}\\b|\\b${k}\\b[,\\s}]`).test(src)), komentar = fs.existsSync(berkasK) && !hilangK.length;
  if (!komentar) this.emitWarning(new Error('[komentar] tidak dipasang, jangkar hilang: ' + hilangK));
  const hilang = perlu.filter((k) => !new RegExp(`(var|function|const|let) ${k}\\b|\\b${k}\\b[,\\s}]`).test(src));
  if (!m || !i || !j || hilang.length) { this.emitWarning(new Error('[panel-rata] jangkar Studio tidak cocok, panel bawaan dipakai: ' + JSON.stringify({ m: !!m, i: !!i, j: !!j, hilang }))); return src; }
  const k = src.match(/var SelectedOutlineOverlayUnmemoized = \(\{[^}]*\}\) => \{\s*const \{ selectedItems, selectItem \} = useTimelineSelection\(\);/);
  if (k) src = src.replace(k[0], () => `${k[0]}\n  usePrSeleksi();${komentar ? ' usePrKomentar();' : ''}${fs.existsSync(path.join(__dirname, 'ui-ae.js')) ? ' usePrLayer();' : ''}`); else this.emitWarning(new Error('[seleksi] jangkar kanvas tidak cocok, seleksi bawaan dipakai'));
  const berkasA = path.join(__dirname, 'ui-ae.js'); this.addDependency(berkasA); this.addDependency(path.join(__dirname, 'ui-ae.cjs'));
  const ae = fs.existsSync(berkasA) ? '\n' + fs.readFileSync(berkasA, 'utf8') : ''; if (ae) src = require('./ui-ae.cjs').tambal(src, (t) => this.emitWarning(new Error(t))).replaceAll('__React.', m[1] + '.');
  const panel = 'import { flushSync as prFlushSync } from "react-dom";\n' + (fs.readFileSync(berkas, 'utf8') + '\n' + fs.readFileSync(berkasS, 'utf8') + (komentar ? '\n' + fs.readFileSync(berkasK, 'utf8') : '') + ae).replaceAll('__React', m[1]).replaceAll('__Internals', i[1]);
  return src.replace(m[0], () => `${panel}\nvar AlignmentControls = ${m[1]}.memo(({ track }) => ${m[1]}.createElement(PanelRata, { selectedTracks: [{ track }] }));`)
    .replace(j[0], () => `/* panel rata */ ${j[1]}(PanelRata, { selectedTracks }),\n      ${j[0]}`);
};
