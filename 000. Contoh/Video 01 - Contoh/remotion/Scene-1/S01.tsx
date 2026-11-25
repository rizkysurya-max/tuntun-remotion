import React from 'react';
import { Interactive } from 'remotion';
import { Chart } from './Chart';
import { ChipSupport } from './Bersama/ChipSupport';
import { Panel } from './Bersama/Panel';
import { Rumah } from './Rumah';

const Isi: React.FC = () => (
    <>
      <Interactive.Div name="latar" style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, backgroundColor: '#FDFDFD' }} />
      <Panel name="Panel" style={{ translate: '60px 140px' }} />
      <Chart name="Chart" style={{ translate: '180px 260px' }} />
      <Rumah
        name="Rumah"
        style={{
          translate: '1240px 300px'
        }}
      />
      <ChipSupport name="Chip Support" style={{ translate: '800px 626px' }} />
      <Interactive.Div name="t judul" style={{ position: 'absolute', left: 0, top: 0, width: 1920, textAlign: 'center', fontFamily: 'Plus Jakarta Sans', fontSize: 64, fontWeight: 800, color: '#1B1B33', translate: '0px 96px' }}>Harga berhenti turun di sini</Interactive.Div>
    </>
);
export const S01 = Interactive.create({ Component: Isi, componentName: 'S01', layout: 'absolute-fill' });
