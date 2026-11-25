import React from 'react';
import { Interactive } from 'remotion';
/** SATU KESATUAN = SATU COMP. Bagiannya tetap layer sendiri; di scene tampil sebagai satu objek. */
const Isi: React.FC<{ readonly style?: React.CSSProperties }> = ({ style }) => {
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1160, height: 760, ...style }}>
      <Interactive.Div name="panel glow" style={{ position: 'absolute', left: 0, top: 0, width: 1000, height: 600, borderRadius: 32, backgroundColor: '#5F4DEE', opacity: 0.18, filter: 'blur(30px)', translate: '80px 80px' }} />
      <Interactive.Div name="panel" style={{ position: 'absolute', left: 0, top: 0, width: 1000, height: 600, borderRadius: 32, backgroundColor: '#FFFFFF', translate: '80px 80px' }} />
      <Interactive.Div name="panel tepi" style={{ position: 'absolute', left: 0, top: 0, width: 1000, height: 600, borderRadius: 32, border: '4px solid #5F4DEE', boxSizing: 'border-box', translate: '80px 80px' }} />
    </div>
  );
};
export const Panel = Interactive.create({ Component: Isi, componentName: 'Panel', layout: 'none' });
