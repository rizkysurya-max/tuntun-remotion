import { loadFont } from '@remotion/google-fonts/PlusJakartaSans';
import React from 'react';
import { Folder } from 'remotion';

loadFont('normal', { weights: ['500', '600', '700', '800'], subsets: ['latin'] });

/** Tiap video dimuat sendiri: kalau satu video rusak, video lain tetap terbuka. */
const muat = (ambil: () => { Isi: React.FC }): React.FC => {
  try { return ambil().Isi; } catch (e) { console.warn('Video gagal dimuat:', String(e).slice(0, 300)); return () => null; }
};
const CT01 = muat(() => require('../000. Contoh/Video 01 - Contoh/remotion'));
// video baru: tambah satu baris seperti di atas, lalu taruh di folder temanya di bawah

/** nama tampil di panel Project bila tidak bisa ditulis di nama folder Remotion (hanya huruf, angka, tanda hubung) */
(globalThis as Record<string, unknown>).tuntunNama = {};

export const Root: React.FC = () => (
  <>
    <Folder name="000-Contoh"><CT01 /></Folder>
  </>
);
