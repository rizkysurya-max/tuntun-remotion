/* p5.js di Remotion (25 Nov 2026). Salinan dari _fondasi/gambar lewat pasang.mjs.
 * 1) useP5(seed)  = p5 sebagai KALKULATOR (noise, random, lerp, map, vektor …); gambarnya SVG/React → tiap bagian bisa diedit & dianimasikan. UTAMAKAN INI.
 * 2) <P5Kanvas>   = sketsa p5 asli di kanvas, dikunci ke frame Remotion. Hasilnya satu gambar utuh (tidak bisa diedit per bagian).
 * Aturan: jangan pakai millis()/frameCount/deltaTime p5; pakai `frame` dari Remotion. Acak = seed tetap, jadi hasil render selalu sama. */
import React from 'react';
import { continueRender, delayRender, useCurrentFrame, useVideoConfig } from 'remotion';
import type P5Tipe from './p5.min.js';
import P5 from './p5.min.js';
const kosong = () => { const d = document.createElement('div'); d.style.display = 'none'; return d; };
/** p5 tanpa gambar; seed diset ulang di SETIAP render supaya urutan frame tidak mempengaruhi hasil */
export const useP5 = (seed = 1): P5Tipe => {
  const ref = React.useRef<P5Tipe | null>(null);
  if (!ref.current) ref.current = new P5((p: P5Tipe) => { p.setup = () => { p.noCanvas(); p.noLoop(); }; }, kosong());
  ref.current.randomSeed(seed); ref.current.noiseSeed(seed);
  return ref.current;
};
export const P5Kanvas: React.FC<{ width: number; height: number; seed?: number; style?: React.CSSProperties; gambar: (p: P5Tipe, t: { frame: number; fps: number; width: number; height: number }) => void }> = ({ width, height, seed = 1, style, gambar }) => {
  const frame = useCurrentFrame(), { fps } = useVideoConfig(), wadah = React.useRef<HTMLDivElement>(null), p5 = React.useRef<P5Tipe | null>(null), kini = React.useRef({ frame, gambar });
  kini.current = { frame, gambar };
  const [tunggu] = React.useState(() => delayRender('p5 menyiapkan kanvas')); const [siap, setSiap] = React.useState(false);
  React.useLayoutEffect(() => {
    const inst = new P5((p: P5Tipe) => {
      p.setup = () => { p.pixelDensity(1); p.createCanvas(width, height); p.noLoop(); setSiap(true); };
      p.draw = () => { p.randomSeed(seed); p.noiseSeed(seed); p.clear(); p.push(); kini.current.gambar(p, { frame: kini.current.frame, fps, width, height }); p.pop(); };
    }, wadah.current!);
    p5.current = inst; return () => { inst.remove(); p5.current = null; };
  }, [width, height, seed, fps]);
  React.useLayoutEffect(() => { if (siap && p5.current) { p5.current.redraw(); continueRender(tunggu); } }, [siap, frame, gambar, tunggu]);
  return <div ref={wadah} style={{ width, height, ...style }} />;
};
