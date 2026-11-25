import { createRequire } from 'node:module';
import path from 'node:path';
import { Config } from '@remotion/cli/config';

// STUDIO TUNTUN: panel ala After Effects, seleksi, rata, komentar, perbaikan render (lihat _fondasi/studio/BACA.md)
createRequire(path.join(process.cwd(), 'x.js'))('./_fondasi/studio/pasang.cjs').pasang(Config, { akar: process.cwd() });
