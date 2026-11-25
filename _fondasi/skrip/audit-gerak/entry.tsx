import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Babak } from '../../src/Babak';

/** render satu frame GLOBAL komposisi (tanpa VO) — hanya untuk menjalankan logika waktu; HTML dibuang */
export const renderFrame = (g: number) => {
  (globalThis as unknown as { __frame: number }).__frame = g;
  return renderToStaticMarkup(<Babak vo={false} />).length;
};
