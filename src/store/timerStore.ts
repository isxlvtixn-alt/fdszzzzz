import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TimeEntry, Session, AppSettings, TimerState } from './types';

interface TimerStore {
  // Sessions
  sessions: Session[];
  currentSessionId: string | null;
  
  // Settings
  appSettings: AppSettings;
  
  // Timer state
  activeTab: 'timer' | 'history';
  cubeType: string;
  scramble: string;
  lastRecordedTime: TimeEntry | null;
  
  // Actions
  createSession: (name: string, cubeType: string) => void;
  deleteSession: (sessionId: string) => void;
  renameSession: (sessionId: string, newName: string) => void;
  setCurrentSession: (sessionId: string) => void;
  getCurrentSession: () => Session | null;
  
  // Time management
  addTime: (time: number, scramble: string, autoDnf?: boolean) => void;
  togglePlusTwo: (timeId: string) => void;
  toggleDNF: (timeId: string) => void;
  deleteTime: (timeId: string) => void;
  favoriteTime: (timeId: string, comment: string) => void;
  
  // Settings
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // UI state
  setActiveTab: (tab: 'timer' | 'history') => void;
  setCubeType: (cubeType: string) => void;
  setScramble: (scramble: string) => void;
  setLastRecordedTime: (time: TimeEntry | null) => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  hideTime: false,
  inspection: false,
  inspectionTime: 15,
  sounds: false,
  soundVolume: 0.5,
  scrambleView: '2D',
};

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      sessions: [],
      currentSessionId: null,
      appSettings: DEFAULT_SETTINGS,
      activeTab: 'timer',
      cubeType: '3x3',
      scramble: '',
      lastRecordedTime: null,

      // Session actions
      createSession: (name: string, cubeType: string) => {
        const newSession: Session = {
          id: crypto.randomUUID(),
          name,
          cubeType,
          times: [],
          createdAt: new Date(),
        };
        
        set((state) => ({
          sessions: [...state.sessions, newSession],
          currentSessionId: newSession.id,
        }));
      },

      deleteSession: (sessionId: string) => {
        set((state) => {
          const remainingSessions = state.sessions.filter(s => s.id !== sessionId);
          const newCurrentId = state.currentSessionId === sessionId 
            ? (remainingSessions.length > 0 ? remainingSessions[0].id : null)
            : state.currentSessionId;
          
          return {
            sessions: remainingSessions,
            currentSessionId: newCurrentId,
          };
        });
      },

      renameSession: (sessionId: string, newName: string) => {
        set((state) => ({
          sessions: state.sessions.map(session =>
            session.id === sessionId ? { ...session, name: newName } : session
          ),
        }));
      },

      setCurrentSession: (sessionId: string) => {
        set({ currentSessionId: sessionId });
      },

      getCurrentSession: () => {
        const state = get();
        return state.sessions.find(s => s.id === state.currentSessionId) || null;
      },

      // Time management
      addTime: (time: number, scramble: string, autoDnf = false) => {
        const newTime: TimeEntry = {
          id: crypto.randomUUID(),
          time,
          scramble,
          favorite: false,
          plusTwo: false,
          dnf: autoDnf,
          autoDnf,
          timestamp: Date.now(),
        };

        set((state) => {
          if (!state.currentSessionId) {
            // Create default session if none exists
            const defaultSession: Session = {
              id: crypto.randomUUID(),
              name: `${state.cubeType} Session`,
              cubeType: state.cubeType,
              times: [newTime],
              createdAt: new Date(),
            };
            
            return {
              sessions: [...state.sessions, defaultSession],
              currentSessionId: defaultSession.id,
              lastRecordedTime: newTime,
            };
          }

          return {
            sessions: state.sessions.map(session =>
              session.id === state.currentSessionId
                ? { ...session, times: [...session.times, newTime] }
                : session
            ),
            lastRecordedTime: newTime,
          };
        });
      },

      togglePlusTwo: (timeId: string) => {
        set((state) => ({
          sessions: state.sessions.map(session =>
            session.id === state.currentSessionId
              ? {
                  ...session,
                  times: session.times.map(time =>
                    time.id === timeId && !time.autoDnf
                      ? { ...time, plusTwo: !time.plusTwo, dnf: false }
                      : time
                  ),
                }
              : session
          ),
          lastRecordedTime: state.lastRecordedTime?.id === timeId && !state.lastRecordedTime.autoDnf
            ? { ...state.lastRecordedTime, plusTwo: !state.lastRecordedTime.plusTwo, dnf: false }
            : state.lastRecordedTime,
        }));
      },

      toggleDNF: (timeId: string) => {
        set((state) => ({
          sessions: state.sessions.map(session =>
            session.id === state.currentSessionId
              ? {
                  ...session,
                  times: session.times.map(time =>
                    time.id === timeId && !time.autoDnf
                      ? { ...time, dnf: !time.dnf, plusTwo: false }
                      : time
                  ),
                }
              : session
          ),
          lastRecordedTime: state.lastRecordedTime?.id === timeId && !state.lastRecordedTime.autoDnf
            ? { ...state.lastRecordedTime, dnf: !state.lastRecordedTime.dnf, plusTwo: false }
            : state.lastRecordedTime,
        }));
      },

      deleteTime: (timeId: string) => {
        set((state) => ({
          sessions: state.sessions.map(session =>
            session.id === state.currentSessionId
              ? {
                  ...session,
                  times: session.times.filter(time => time.id !== timeId),
                }
              : session
          ),
          lastRecordedTime: state.lastRecordedTime?.id === timeId ? null : state.lastRecordedTime,
        }));
      },

      favoriteTime: (timeId: string, comment: string) => {
        set((state) => ({
          sessions: state.sessions.map(session =>
            session.id === state.currentSessionId
              ? {
                  ...session,
                  times: session.times.map(time =>
                    time.id === timeId
                      ? { ...time, favorite: true, comment }
                      : time
                  ),
                }
              : session
          ),
        }));
      },

      // Settings
      updateSettings: (settings: Partial<AppSettings>) => {
        set((state) => ({
          appSettings: { ...state.appSettings, ...settings },
        }));
      },

      // UI state
      setActiveTab: (tab: 'timer' | 'history') => {
        set({ activeTab: tab });
      },

      setCubeType: (cubeType: string) => {
        set({ cubeType });
      },

      setScramble: (scramble: string) => {
        set({ scramble });
      },

      setLastRecordedTime: (time: TimeEntry | null) => {
        set({ lastRecordedTime: time });
      },
    }),
    {
      name: 'timer-storage',
      partialize: (state) => ({
        sessions: state.sessions,
        currentSessionId: state.currentSessionId,
        appSettings: state.appSettings,
        cubeType: state.cubeType,
      }),
    }
  )
);