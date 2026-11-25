import React from 'react';
import { Easing, Interactive, interpolate, useCurrentFrame } from 'remotion';
/** SATU KESATUAN = SATU COMP. Bagiannya tetap layer sendiri; di scene tampil sebagai satu objek. */
const Isi: React.FC<{ readonly style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 920, height: 520, ...style }}>
      <Interactive.Svg name="grid" width={920} height={520} style={{ position: 'absolute', left: 0, top: 0, translate: '0px 0px' }}><path d="M0 130H920M0 260H920M0 390H920" stroke="#E6E6F0" strokeWidth={2} /></Interactive.Svg>
      <Interactive.Svg name="candle 01" width={40} height={240} style={{ position: 'absolute', left: 0, top: 0, translate: '60px 220px', scale: interpolate(frame, [0, 60], [0, 1], { easing: Easing.bezier(0.34, 1.56, 0.64, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}><path d="M20 0V240" stroke="#1FA971" strokeWidth={4} /><rect y={50} width={40} height={140} fill="#1FA971" /></Interactive.Svg>
      <Interactive.Svg name="candle 02" width={40} height={240} from={20} style={{ position: 'absolute', left: 0, top: 0, translate: '140px 170px' }}><path d="M20 0V240" stroke="#E0483E" strokeWidth={4} /><rect y={50} width={40} height={140} fill="#E0483E" /></Interactive.Svg>
      <Interactive.Svg name="candle 03" width={40} height={240} from={40} style={{ position: 'absolute', left: 0, top: 0, translate: '220px 130px' }}><path d="M20 0V240" stroke="#1FA971" strokeWidth={4} /><rect y={50} width={40} height={140} fill="#1FA971" /></Interactive.Svg>
      <Interactive.Svg name="garis gelombang" width={480} height={80} style={{ position: 'absolute', left: 0, top: 0, translate: '380px 220px' }}><path d="M0 44C40 20 70 62 110 50S170 24 210 40S270 66 310 52S380 18 420 30S460 52 480 46" fill="none" stroke="#E49C2C" strokeWidth={4} /></Interactive.Svg>
      <Interactive.Svg name="garis support" width={920} height={8} style={{ position: 'absolute', left: 0, top: 0, translate: '0px 440px' }}><path d="M0 4H920" stroke="#5F4DEE" strokeWidth={4} strokeDasharray="920" strokeDashoffset={interpolate(frame, [60, 120], [920, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} /></Interactive.Svg>
    </div>
  );
};
export const Chart = Interactive.create({ Component: Isi, componentName: 'Chart', layout: 'none' });
