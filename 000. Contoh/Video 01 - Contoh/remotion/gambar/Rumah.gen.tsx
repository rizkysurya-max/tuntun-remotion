/* DIBANGKITKAN _fondasi/gambar/tikz-ke-tsx.mjs dari rumah.tex — jangan diedit tangan. */
import React from 'react';
export const BAGIAN = ["tanah","dinding","atap","pintu","jendela"] as const;
export type Bagian = (typeof BAGIAN)[number];
const ISI: Record<Bagian, string> = {
  tanah: "<path fill=\"#eeebfe\" stroke=\"none\" stroke-miterlimit=\"10\" stroke-width=\".4\" d=\"M-72.27 126.9v-14.227h227.622v14.226Zm227.622-14.227\"/>",
  dinding: "<path fill=\"#fff\" stroke=\"#5f4dee\" stroke-miterlimit=\"10\" stroke-width=\"3\" d=\"M-29.59 112.673V13.088h142.263v99.585Zm142.263-99.585\"/>",
  atap: "<path fill=\"#5f4dee\" stroke=\"none\" stroke-miterlimit=\"10\" stroke-width=\".4\" d=\"m-46.663 13.088 88.204-73.977 88.204 73.977Z\"/>",
  pintu: "<g stroke=\"#000\" stroke-miterlimit=\"10\" stroke-width=\".4\"><path fill=\"#e49c2c\" stroke=\"none\" d=\"M24.47 110.673V49.23a2 2 0 0 1 2-2h30.143a2 2 0 0 1 2 2v61.442a2 2 0 0 1-2 2H26.469a2 2 0 0 1-2-2M58.612 47.23\"/><path fill=\"#fff\" stroke=\"none\" d=\"M54.06 81.375a2.56 2.56 0 1 0-5.121 0 2.56 2.56 0 0 0 5.121 0m-2.56 0\"/></g>",
  jendela: "<g stroke=\"#000\" stroke-miterlimit=\"10\" stroke-width=\".4\"><path fill=\"#5cc8e3\" stroke=\"none\" d=\"M-15.365 63.303V36.851a1 1 0 0 1 1-1h26.453a1 1 0 0 1 1 1v26.452a1 1 0 0 1-1 1h-26.453a1 1 0 0 1-1-1m28.453-27.452\"/><path fill=\"none\" stroke=\"#fff\" stroke-width=\"1.5\" d=\"M-1.138 64.303V35.851m-14.227 14.226h28.453\"/><path fill=\"#5cc8e3\" stroke=\"none\" d=\"M69.994 63.303V36.851a1 1 0 0 1 1-1h26.452a1 1 0 0 1 1 1v26.452a1 1 0 0 1-1 1H70.994a1 1 0 0 1-1-1m28.452-27.452\"/><path fill=\"none\" stroke=\"#fff\" stroke-width=\"1.5\" d=\"M84.22 64.303V35.851M69.994 50.077h28.452\"/></g>",
};
/** `gaya` = gaya per bagian (translate, scale, opacity …); poros skala = pusat bagian itu sendiri */
export const Rumah: React.FC<{ lebar: number; gaya?: Partial<Record<Bagian, React.CSSProperties>>; style?: React.CSSProperties }> = ({ lebar, gaya = {}, style }) => (
  <svg viewBox="-72 -72 227.622 199.169" width={lebar} height={lebar * 0.874999} style={{ position: 'absolute', overflow: 'visible', ...style }}>
    {BAGIAN.map((b) => <g key={b} data-bagian={b} style={{ transformBox: 'fill-box', transformOrigin: 'center', ...gaya[b] }} dangerouslySetInnerHTML={{ __html: ISI[b] }} />)}
  </svg>);
/** SATU BAGIAN = SATU LAYER, kotaknya pas bagian itu: <Interactive.Svg name="rumah tanah" viewBox="…KOTAK_BAGIAN…" style={{ … }}><RumahBagian b="tanah" /></Interactive.Svg> */
export const KOTAK_BAGIAN: Record<Bagian, string> = {"tanah":"-72.27 112.674 227.622 14.226","dinding":"-31.09 11.588 145.264 102.585","atap":"-46.663 -60.889 176.407 73.977","pintu":"24.47 47.232 34.144 65.441","jendela":"-16.115 35.1 115.311 29.953"};
export const RumahBagian: React.FC<{ b: Bagian }> = ({ b }) => <g dangerouslySetInnerHTML={{ __html: ISI[b] }} />;
