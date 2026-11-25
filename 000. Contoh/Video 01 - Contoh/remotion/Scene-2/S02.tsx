import React from 'react';
import { Interactive } from 'remotion';
import { Rumah } from '../Scene-1/Rumah';
import { ChipRumah } from './Bersama/ChipRumah';

const Isi: React.FC = () => (
    <>
      <Interactive.Div name="latar" style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, backgroundColor: '#FDFDFD' }} />
      <Rumah name="Rumah" style={{ translate: '680px 340px' }} />
      <ChipRumah name="Chip Rumah" style={{ translate: '810px 830px' }} />
      <Interactive.Div name="t judul" style={{ position: 'absolute', left: 0, top: 0, width: 1920, textAlign: 'center', fontFamily: 'Plus Jakarta Sans', fontSize: 64, fontWeight: 800, color: '#1B1B33', translate: '0px 160px' }}>Contoh Scene 2</Interactive.Div>
    </>
);
export const S02 = Interactive.create({ Component: Isi, componentName: 'S02', layout: 'absolute-fill' });
