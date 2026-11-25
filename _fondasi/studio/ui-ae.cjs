/* Tambalan teks untuk ui-ae.js: tiap tambalan berdiri sendiri; jangkar yang tak ketemu dilewati (bagian itu tampil bawaan) dan dilaporkan. */
const V = `"--remotion-studio-background": "#232323", "--remotion-studio-line-color": "#111111", "--remotion-studio-light-text": "#c8c8c8"`;
exports.TAMBAL = [
  ['tinggi baris gambar', /var TIMELINE_LAYER_HEIGHT_IMAGE = 34;/, 'var TIMELINE_LAYER_HEIGHT_IMAGE = 21;'],
  ['satu baris nama', /const stackMediaName = Boolean\(mediaSrc\);/, 'const stackMediaName = false;'],
  ['nama berkas disembunyikan', /mediaSrc \? (\/\* @__PURE__ \*\/ jsx\d*\("div", \{\s*style: \{\s*display: "flex",\s*height: 14,\s*marginTop: -2)/, 'false ? $1'],
  ['kolom label & nomor', /eye: (showVisibilityToggle \? [\s\S]{0,600}?TimelineLayerEyeSpacer, \{\}\)),(\s*arrow: [^\n]*TimelineLayerChildrenToggle)/, 'eye: aeMata({ sequence, nestedDepth, siblingIndex, connectedCompositions, mata: $1 }),$2'],
  ['lebar kolom properti', /return basePadding \+ TIMELINE_EYE_COLUMN_WIDTH \+ getTimelineRowIndentWidth\(depth\)/, 'return basePadding + TIMELINE_EYE_COLUMN_WIDTH + (basePadding === TIMELINE_ROW_BASE_PADDING ? AE_KOLOM : 0) + getTimelineRowIndentWidth(depth)'],
  ['lebar nama properti', /return `calc\(50% - \$\{getTimelineRowLeftChromeWidth\(depth, basePadding\) - TIMELINE_FIELD_LABEL_EXTRA_WIDTH\}px\)`;/, 'return `calc(50% - ${getTimelineRowLeftChromeWidth(depth, basePadding) - (basePadding === TIMELINE_ROW_BASE_PADDING ? AE_KOLOM : 0) - TIMELINE_FIELD_LABEL_EXTRA_WIDTH}px)`;'],
  ['warna batang', /hasCaptionsSchema \? TIMELINE_CAPTIONS_GRADIENT : BLUE,/, 'hasCaptionsSchema ? TIMELINE_CAPTIONS_GRADIENT : aeWarna(s),\n      "--ae-id": s.id,'],
  ['tinggi kepala', /var TIMELINE_TIME_INDICATOR_HEIGHT = 39;/, 'var TIMELINE_TIME_INDICATOR_HEIGHT = 52;'],
  ['kepala layer', /(var TimelineTimePlaceholders = \(\) => \{\s*return [^\n]*jsx\d*\("div", \{\s*style: )timeValue,\s*children: (\/\* @__PURE__ \*\/ jsx\d*\(TimeValue, \{\}\))/, `$1{ ...timeValue, ${V}, paddingBottom: 16, boxSizing: "border-box" },\n    children: aeH(__React.Fragment, null, $2, aeH(AeCari), aeH(AeKepalaLayer))`],
  ['warna waktu', /var currentTimeTypography = \{\s*color: LIGHT_TEXT,/, 'var currentTimeTypography = {\n  color: "#4aa3f0",'],
  ['latar daftar layer', /(var container34 = \{\s*flex: 1,)/, `$1 ${V}, "--remotion-studio-timeline-track-separator": "#171717", "--remotion-studio-timeline-selected-background-color": "#454545",`],
  ['tab Project', /(selected: panel === "compositions",\s*onClick: onCompositionsSelected,\s*children: )"Compositions"/, '$1"Project"'],
  ['latar panel proyek', /(var container7 = \{\s*display: "flex",\s*flexDirection: "column",\s*flex: 1,)/, `$1 ${V}, "--remotion-studio-white-alpha-06": "rgba(255,255,255,0.13)",`],
  ['info & kepala proyek', /(\/\* @__PURE__ \*\/ jsx\d*\(ExplorerQuickSwitcherTrigger, \{\s*mode: "compositions",[\s\S]{0,160}?\}\)),(\s*\/\* @__PURE__ \*\/ jsxs\d*\("div", \{\s*ref: listRef,)/, 'aeH(AeInfoProyek, { key: "ae-info" }), $1, aeH(AeKepalaProyek, { key: "ae-kepala" }),$2'],
  ['kaki proyek', /("data-composition-root-reorder-line": true,\s*style: rootReorderLine\s*\}\) : null\s*\]\s*\}\))/, '$1, aeH(AeKakiProyek, { key: "ae-kaki" })'],
  ['baris comp', /var itemStyle = \{\s*paddingRight: 2,\s*fontSize: 13,([\s\S]{0,260}?)marginBottom: 1,\s*marginLeft: 8,\s*marginRight: 4,([\s\S]{0,80}?)borderRadius: 4,\s*width: "calc\(100% - 12px\)",([\s\S]{0,60}?)height: COMPACT_CONTROL_ROW_HEIGHT,/, 'var itemStyle = {\n  paddingRight: 8, position: "relative",\n  fontSize: 12,$1marginBottom: 0,\n  marginLeft: 0,\n  marginRight: 0,$2borderRadius: 0,\n  width: "100%",$3height: 22,'],
  ['huruf nama', /(var labelStyle = \{\s*textAlign: "left",\s*textDecoration: "none",\s*)fontSize: 13,/, '$1fontSize: 12,'],
  ['indentasi', /return \{ \.\.\.rowControlStyle, paddingLeft: 12 \+ level \* 11 \};/, 'return { ...rowControlStyle, gap: 6, paddingTop: 0, paddingBottom: 0, paddingRight: AE_RUANG - 8, paddingLeft: 10 + level * 14 + (item.type === "folder" ? 0 : 15) };'],
  ['ikon folder', /item\.expanded \? \/\* @__PURE__ \*\/ jsx\d*\(ExpandedFolderIcon, \{\s*style: iconStyle,\s*color: CURRENT_COLOR\s*\}\) : \/\* @__PURE__ \*\/ jsx\d*\(CollapsedFolderIcon, \{\s*color: CURRENT_COLOR,\s*style: iconStyle\s*\}\),/, 'aeH(AeSegitiga, { key: "s", buka: item.expanded }), aeH(AeFolder, { key: "f", buka: item.expanded }),'],
  ['kolom folder', /\{\s*style: labelStyle,\s*children: item\.folderName\s*\}\)/, '{ style: labelStyle, children: aeNamaProyek(item.folderName, true) }), aeH(__React.Fragment, { key: "ae" }, aeKolom(AE_WARNA.folder, ""))'],
  ['ikon comp', /\/\* @__PURE__ \*\/ jsx\d*\(CompositionOrStillIcon, \{\s*composition: item\.composition,\s*color: CURRENT_COLOR,\s*style: iconStyle\s*\}\),(\s*\/\* @__PURE__ \*\/ jsx\d*\("span", \{\s*style: labelStyle,\s*children: )item\.composition\.id(\s*\}\))/, 'aeH(AeIkonComp, { key: "i" }),$1aeNamaProyek(item.composition.id)$2, aeH(__React.Fragment, { key: "ae" }, aeKolom(AE_WARNA.comp, aeDurasi(item.composition)))'],
];
exports.TAMBAL.push(
['saring & nomor', /const visibleTrackIndexes = (useMemo\d*)\(\(\) => layoutSnapshot\.tracks\.flatMap\(([\s\S]{0,900}?return hidden \? \[\] : \[index\];\s*\})\), \[hierarchy, collapsed, layoutSnapshot\]\);/, 'const aeQ = aePakai(() => AE_S.cari);\n  const visibleTrackIndexes = $1(() => aeSaring(layoutSnapshot, hierarchy, compositionId, layoutSnapshot.tracks.flatMap($2)), [hierarchy, collapsed, layoutSnapshot, aeQ]);'],
  // daftar layer dibalik (aeBalik): jatuh di ATAS baris = sesudahnya di kode
  ['urutan: hitung letak', /(const insertionIndex = getCanvasSequenceReorderInsertionIndex\d*\(\{\s*sourceIndexes: dragData\.siblingIndexes,\s*targetIndex: siblingIndex,\s*position: before \? )"before" : "after"/, '$1"after" : "before"'],
  ['urutan: simpan', /(targetNodePath: nodePath,\s*position: )dropTarget\.position(,\s*clientId: previewServerState\.clientId)/, '$1dropTarget.position === "before" ? "after" : "before"$2'],
  ['nama gambar', /(const timelineDisplayName = sequence\.displayName === "" && connectedCompositions\.length === 1 \? connectedCompositions\[0\]\.id : )displayName;/, '$1aeNama(displayName, sequence);'],
);
exports.tambal = (src, lapor) => { const gagal = []; for (const [nama, dari, ke] of exports.TAMBAL) { if (!dari.test(src)) { gagal.push(nama); continue; } src = src.replace(dari, ke); } if (gagal.length) lapor('[ui-ae] dilewati: ' + gagal.join(', ')); return src; };
