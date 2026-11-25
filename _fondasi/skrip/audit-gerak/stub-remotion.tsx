/**
 * PENGGANTI 'remotion' untuk AUDIT GERAK (12 Nov, Simon: "keyframe harus 60 frame … perbaiki alat yang kamu gunakan agar hasilnya akurat").
 * Scene dirender di Node (react-dom/server) TANPA browser: hanya logika waktu yang diperlukan. `interpolate` asli dipanggil, tetapi setiap
 * pemanggilan yang SEDANG BERJALAN (a < f < b) dicatat lewat globalThis.__catat → scripts/audit-gerak/jalankan.cjs.
 */
import React from 'react';
// @ts-ignore — paket asli (CJS) di-require saat jalan; tidak dibundel
import * as asli from 'remotion-asli';

const G = globalThis as unknown as { __catat?: (f: number, a: number, b: number) => void; __frame?: number; __inputProps?: Record<string, unknown> };
export const Easing = asli.Easing;
export const interpolate = (input: number, inR: number[], outR: number[], opt?: Record<string, unknown>) => {
  G.__catat?.(input, inR[0], inR[inR.length - 1]);
  return asli.interpolate(input, inR, outR, opt);
};
const KonteksFrame = React.createContext<number | null>(null);
export const useCurrentFrame = () => { const k = React.useContext(KonteksFrame); return k ?? G.__frame ?? 0; };
export const useVideoConfig = () => ({ fps: 60, width: 1920, height: 1080, durationInFrames: 99999, id: 'audit' });
export const getInputProps = () => G.__inputProps ?? {};
export const staticFile = (s: string) => `/${s}`;
export const getRemotionEnvironment = () => ({ isStudio: false, isRendering: true, isPlayer: false, isReadOnlyStudio: false, isClientSideRendering: false });
type P = { children?: React.ReactNode; style?: React.CSSProperties; [k: string]: unknown };
export const AbsoluteFill: React.FC<P> = ({ children, style }) => <div style={{ position: 'absolute', inset: 0, ...style }}>{children}</div>;
export const Img: React.FC<P> = ({ src, style }) => <img src={src as string} style={style} />;
export const OffthreadVideo: React.FC<P> = () => null;
export const Audio: React.FC<P> = () => null;
export const Sequence: React.FC<P> = ({ children, from = 0, durationInFrames }) => {
  const f = useCurrentFrame(), lokal = f - (from as number);
  if (lokal < 0 || (durationInFrames !== undefined && lokal >= (durationInFrames as number))) return null;
  return <KonteksFrame.Provider value={lokal}>{children}</KonteksFrame.Provider>;
};
export const Freeze: React.FC<P> = ({ children, frame }) => <KonteksFrame.Provider value={frame as number}>{children}</KonteksFrame.Provider>;
export const registerRoot = () => undefined;
export const Composition: React.FC<P> = () => null;
export const delayRender = () => 0;
export const continueRender = () => undefined;
