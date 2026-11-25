import React from 'react';
import { Interactive } from 'remotion';
import { RumahBagian } from '../gambar/Rumah.gen';
/** SATU KESATUAN = SATU COMP. Bagiannya tetap layer sendiri; di scene tampil sebagai satu objek. */
const Isi: React.FC<{ readonly style?: React.CSSProperties }> = ({ style }) => {
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 560, height: 490, ...style }}>
      <Interactive.Svg name="tanah" viewBox="-72.27 112.674 227.622 14.226" style={{ position: 'absolute', left: 0, top: 0, width: 560, height: 35, overflow: 'visible', translate: '-0.7px 454.3px' }}><RumahBagian b="tanah" /></Interactive.Svg>
      <Interactive.Svg name="dinding" viewBox="-31.09 11.588 145.264 102.585" style={{ position: 'absolute', left: 0, top: 0, width: 357.4, height: 252.4, overflow: 'visible', translate: '100.6px 205.6px' }}><RumahBagian b="dinding" /></Interactive.Svg>
      <Interactive.Svg name="atap" viewBox="-46.663 -60.889 176.407 73.977" style={{ position: 'absolute', left: 0, top: 0, width: 434, height: 182, overflow: 'visible', translate: '62.3px 27.3px' }}><RumahBagian b="atap" /></Interactive.Svg>
      <Interactive.Svg name="pintu" viewBox="24.47 47.232 34.144 65.441" style={{ position: 'absolute', left: 0, top: 0, width: 84, height: 161, overflow: 'visible', translate: '237.3px 293.3px' }}><RumahBagian b="pintu" /></Interactive.Svg>
      <Interactive.Svg name="jendela" viewBox="-16.115 35.1 115.311 29.953" style={{ position: 'absolute', left: 0, top: 0, width: 283.7, height: 73.7, overflow: 'visible', translate: '137.5px 263.5px' }}><RumahBagian b="jendela" /></Interactive.Svg>
    </div>
  );
};
export const Rumah = Interactive.create({ Component: Isi, componentName: 'Rumah', layout: 'none' });
