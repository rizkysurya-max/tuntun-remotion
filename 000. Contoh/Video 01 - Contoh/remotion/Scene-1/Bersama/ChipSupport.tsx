import React from 'react';
import { Interactive } from 'remotion';
/** SATU KESATUAN = SATU COMP. Bagiannya tetap layer sendiri; di scene tampil sebagai satu objek. */
const Isi: React.FC<{ readonly style?: React.CSSProperties }> = ({ style }) => {
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 300, height: 152, ...style }}>
      <Interactive.Div name="chip support glow" style={{ position: 'absolute', left: 0, top: 0, width: 220, height: 72, borderRadius: 36, backgroundColor: '#5F4DEE', opacity: 0.35, filter: 'blur(16px)', translate: '40px 40px' }} />
      <Interactive.Div name="chip support" style={{ position: 'absolute', left: 0, top: 0, width: 220, height: 72, borderRadius: 36, backgroundColor: '#5F4DEE', translate: '40px 40px' }} />
      <Interactive.Div name="t support" style={{ position: 'absolute', left: 0, top: 0, width: 220, height: 72, textAlign: 'center', lineHeight: '72px', fontFamily: 'Plus Jakarta Sans', fontSize: 36, fontWeight: 700, color: '#FFFFFF', translate: '40px 40px' }}>Support</Interactive.Div>
    </div>
  );
};
export const ChipSupport = Interactive.create({ Component: Isi, componentName: 'ChipSupport', layout: 'none' });
