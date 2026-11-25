import React from 'react';
import { Interactive } from 'remotion';

/** percobaan urutan layer: yang ditulis belakangan = di depan = paling atas di daftar */
const Isi: React.FC = () => (
    <>
      <Interactive.Div name="latar" style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, backgroundColor: '#FDFDFD' }} />
      <Interactive.Div name="kotak ungu" style={{ position: 'absolute', left: 0, top: 0, width: 500, height: 500, borderRadius: 40, backgroundColor: '#5F4DEE', translate: '460px 160px' }} />
      <Interactive.Div name="kotak oranye" style={{ position: 'absolute', left: 0, top: 0, width: 500, height: 500, borderRadius: 40, backgroundColor: '#E49C2C', translate: '710px 290px' }} />
      <Interactive.Div name="kotak biru" style={{ position: 'absolute', left: 0, top: 0, width: 500, height: 500, borderRadius: 40, backgroundColor: '#5CC8E3', translate: '960px 420px' }} />
    </>
);
export const UjiUrutan = Interactive.create({ Component: Isi, componentName: 'UjiUrutan', layout: 'absolute-fill' });
