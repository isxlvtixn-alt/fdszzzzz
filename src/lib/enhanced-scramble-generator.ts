/**
 * WCA-grade scramble generator (csTimer-like) via scrambow
 * npm i scrambow
 */
import { Scrambow, type Scramble } from 'scrambow';

/** Supported events & mapping to scrambow types */
export const CUBE_EVENTS = [
  { id: '3x3',  name: '3×3×3',  event: '333' },
  { id: '2x2',  name: '2×2×2',  event: '222' },
  { id: '4x4',  name: '4×4×4',  event: '444' },
  { id: '5x5',  name: '5×5×5',  event: '555' },
  { id: '6x6',  name: '6×6×6',  event: '666' },
  { id: '7x7',  name: '7×7×7',  event: '777' },
  { id: 'pyra', name: 'Pyraminx', event: 'pyram' },
  { id: 'skewb',name: 'Skewb',    event: 'skewb' },
  { id: 'mega', name: 'Megaminx', event: 'minx' },
  { id: 'sq1',  name: 'Square-1', event: 'sq1' },
  { id: 'clock',name: 'Clock',    event: 'clock' },
] as const;

type CubeId = typeof CUBE_EVENTS[number]['id'];

export const getScrambleInfo = (cubeType: CubeId) =>
  CUBE_EVENTS.find(e => e.id === cubeType) ??
  CUBE_EVENTS.find(e => e.id === '3x3')!; // корректный дефолт — 3x3

/** Main: generate a WCA-compliant scramble */
export const generateEnhancedScramble = (cubeType: CubeId, opts?: { seed?: number }) => {
  const info = getScrambleInfo(cubeType);

  try {
    const list = new Scrambow()
      .setType(info.event)          // важный момент — используем event-код ('444', 'minx', 'sq1' ...)
      .setSeed(opts?.seed)
      .get(1) as Scramble[] | any;

    const first = Array.isArray(list) ? list[0] : list;
    // старые/кастомные типы могут вернуть по-разному
    return (first.scramble_string ?? first.scramble ?? String(first)) as string;
  } catch (e) {
    console.error('scrambow failed, fallback:', e);
    return fallbackScramble(cubeType); // dev/offline fallback
  }
};

/** Very simple fallback for offline/dev (не WCA-точный, только чтобы не падало) */
const fallbackScramble = (cubeType: CubeId): string => {
  if (cubeType === 'sq1') return generateSquare1Fallback();
  const pool =
    cubeType === '2x2' ? ['R', 'U', 'F']
    : cubeType === 'pyra' || cubeType === 'skewb' ? ['R', 'L', 'U', 'B']
    : ['R', 'L', 'U', 'D', 'F', 'B'];

  const mods = ['', "'", '2'];
  const len =
    cubeType === '2x2' ? 9
    : cubeType === '3x3' ? 20
    : cubeType === '4x4' ? 40
    : cubeType === '5x5' ? 60
    : cubeType === '6x6' ? 80
    : cubeType === '7x7' ? 100
    : cubeType === 'mega' ? 70
    : 25;

  const out: string[] = [];
  let last = '', prev = '';
  for (let i = 0; i < len; i++) {
    let m = '';
    for (let tries = 0; tries < 50; tries++) {
      m = pool[Math.floor(Math.random() * pool.length)];
      if (m !== last && !(m === prev && last === prev)) break;
    }
    const mod = mods[Math.floor(Math.random() * mods.length)];
    out.push(m + mod);
    prev = last; last = m;
  }
  return out.join(' ');
};

const generateSquare1Fallback = (): string => {
  const s: string[] = [];
  for (let i = 0; i < 15; i++) {
    const top = Math.floor(Math.random() * 12) - 6;
    const bot = Math.floor(Math.random() * 12) - 6;
    s.push(`(${top},${bot})`);
    if (i < 14) s.push('/');
  }
  return s.join(' ');
};
