import React from 'react';
import { Interactive } from 'remotion';
import { S01 } from './Scene-1/S01';
import { S02 } from './Scene-2/S02';

/** video jadi: hanya berisi scene */
const Isi: React.FC = () => (
    <>
      <S01 name="Scene 1" from={0} durationInFrames={360} />
      <S02 name="Scene 2" from={300} durationInFrames={240} />
    </>
);
export const Render = Interactive.create({ Component: Isi, componentName: 'Render', layout: 'absolute-fill' });
