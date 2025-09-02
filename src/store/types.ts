export interface TimeEntry {
  id: string;
  time: number;
  scramble: string;
  favorite: boolean;
  comment?: string;
  plusTwo: boolean;
  dnf: boolean;
  autoDnf?: boolean; // For inspection timeout DNFs
  timestamp: number;
}

export interface Session {
  id: string;
  name: string;
  cubeType: string;
  times: TimeEntry[];
  createdAt: Date;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  hideTime: boolean;
  inspection: boolean;
  inspectionTime: number;
  sounds: boolean;
  soundVolume: number;
}

export type TimerState = 'stopped' | 'inspection' | 'ready' | 'running';