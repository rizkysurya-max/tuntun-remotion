import React from 'react';
import { Composition, Folder } from 'remotion';
import { Render } from './Render';
import { ChipSupport } from './Scene-1/Bersama/ChipSupport';
import { Panel } from './Scene-1/Bersama/Panel';
import { Chart } from './Scene-1/Chart';
import { Rumah } from './Scene-1/Rumah';
import { S01 } from './Scene-1/S01';
import { ChipRumah } from './Scene-2/Bersama/ChipRumah';
import { S02 } from './Scene-2/S02';
import { UjiUrutan } from './Uji/UjiUrutan';

export const Isi: React.FC = () => (
  <Folder name="Video-01-Contoh">
    <Composition id="CT01-Render" component={Render} durationInFrames={540} fps={60} width={1920} height={1080} />
    <Folder name="Scene">
      <Folder name="Scene-1">
        <Composition id="CT01-S01" component={S01} durationInFrames={300} fps={60} width={1920} height={1080} />
        <Composition id="CT01-S01-Chart" component={Chart} durationInFrames={300} fps={60} width={920} height={520} />
        <Composition id="CT01-S01-Rumah" component={Rumah} durationInFrames={300} fps={60} width={560} height={490} />
        <Folder name="Bersama">
          <Composition id="CT01-S01-Panel" component={Panel} durationInFrames={300} fps={60} width={1160} height={760} />
          <Composition id="CT01-S01-Chip-Support" component={ChipSupport} durationInFrames={300} fps={60} width={300} height={152} />
        </Folder>
      </Folder>
      <Folder name="Scene-2">
        <Composition id="CT01-S02" component={S02} durationInFrames={240} fps={60} width={1920} height={1080} />
        <Folder name="Bersama">
          <Composition id="CT01-S02-Chip-Rumah" component={ChipRumah} durationInFrames={240} fps={60} width={300} height={152} />
        </Folder>
      </Folder>
    </Folder>
    <Folder name="Uji">
      <Composition id="CT01-Uji-Urutan" component={UjiUrutan} durationInFrames={300} fps={60} width={1920} height={1080} />
    </Folder>
  </Folder>
);
