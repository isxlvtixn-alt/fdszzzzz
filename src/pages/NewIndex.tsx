import { useState, useEffect, useRef } from 'react';
import { useTimer, TimerSettings } from '@/hooks/useTimer';
import { useSound } from '@/hooks/useSound';
import { generateEnhancedScramble } from '@/lib/enhanced-scramble-generator';
import { MenuSettings } from '@/components/MenuSettings';
import { TopBar } from '@/components/TopBar';
import { MainTimer } from '@/components/MainTimer';
import { BottomStats } from '@/components/BottomStats';
import { BottomVisualization } from '@/components/BottomVisualization';
import { HistoryTab } from '@/components/HistoryTab';
import { UniversalNavigation } from '@/components/UniversalNavigation';
import { SwipeableToast } from '@/components/SwipeableToast';

interface AppSettings {
  inspection: boolean;
  inspectionTime: number;
  hideTimeWhileSolving: boolean;
  sounds: boolean;
  scrambleView: '2D' | '3D';
  theme: string;
}

interface TimeEntry {
  time: number;
  scramble: string;
  isFavorite?: boolean;
  favoriteComment?: string;
  isPlusTwo?: boolean;
  isDNF?: boolean;
}

interface Session {
  id: string;
  name: string;
  cubeType: string;
  times: TimeEntry[];
  createdAt: Date;
}

const BASE_HEIGHT = 700;
const NAV_HEIGHT = 10;

const NewIndex = () => {
  const [activeTab, setActiveTab] = useState<'timer' | 'history'>('timer');
  const [cubeType, setCubeType] = useState('3x3');
  const [scramble, setScramble] = useState('');
  const [appSettings, setAppSettings] = useState<AppSettings>({
    inspection: false,
    inspectionTime: 15,
    hideTimeWhileSolving: false,
    sounds: false,
    scrambleView: '2D',
    theme: 'dark'
  });

  const [sessions, setSessions] = useState<Session[]>([
    { id: 'default', name: 'Session 1', cubeType: '3x3', times: [], createdAt: new Date() }
  ]);
  const [currentSessionId, setCurrentSessionId] = useState('default');
  const [lastRecordedTime, setLastRecordedTime] = useState<number | null>(null);
  const [showTimerActions, setShowTimerActions] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const timerSettings: TimerSettings = {
    useInspection: appSettings.inspection,
    inspectionTime: appSettings.inspectionTime,
    stackmatMode: false,
    hideTimeWhileSolving: appSettings.hideTimeWhileSolving,
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const [isAnyWindowOpen, setIsAnyWindowOpen] = useState(false);
  const { playStart, playStop, playInspection } = useSound(appSettings.sounds);

  const { time, inspectionTimeLeft, state, isSpacePressed, handleTimerPress, handleTimerRelease } =
    useTimer(handleTimeRecord, timerSettings, activeTab !== 'timer' || isAnyWindowOpen);

  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resize = () => {
      const h = window.innerHeight - NAV_HEIGHT;
      setScale(Math.min(1, h / BASE_HEIGHT));
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => setScramble(generateEnhancedScramble(cubeType)), [cubeType]);

  useEffect(() => {
    if (state === 'running') playStart();
    else if (state === 'inspection') playInspection();
  }, [state, playStart, playInspection]);

  function handleTimeRecord(recordedTime: number) {
    const timeEntry: TimeEntry = { time: recordedTime, scramble, isFavorite: false };
    setSessions(prev =>
      prev.map(session =>
        session.id === currentSessionId ? { ...session, times: [...session.times, timeEntry] } : session
      )
    );
    setLastRecordedTime(recordedTime);
    setShowTimerActions(true);
    setScramble(generateEnhancedScramble(cubeType));
    playStop();
    setToast({ message: 'Time recorded!', type: 'success' });
  }

  const updateLastTime = (
    mapper: (entry: TimeEntry) => TimeEntry,
    msg: string,
    type: 'success' | 'error' | 'info' = 'success'
  ) => {
    setSessions(prev =>
      prev.map(session =>
        session.id === currentSessionId
          ? { ...session, times: session.times.map((e, i, arr) => (i === arr.length - 1 ? mapper(e) : e)) }
          : session
      )
    );
    setShowTimerActions(false);
    setToast({ message: msg, type });
  };

  const handlePlusTwo = () =>
    lastRecordedTime &&
    updateLastTime(e => ({ ...e, isPlusTwo: true, time: e.time + 2000 }), '+2 penalty applied', 'info');
  const handleDNF = () =>
    lastRecordedTime && updateLastTime(e => ({ ...e, isDNF: true }), 'DNF applied', 'info');
  const handleDeleteLastTime = () =>
    lastRecordedTime &&
    setSessions(prev =>
      prev.map(session =>
        session.id === currentSessionId ? { ...session, times: session.times.slice(0, -1) } : session
      )
    );
  const handleFavoriteTime = (comment: string) =>
    lastRecordedTime &&
    updateLastTime(e => ({ ...e, isFavorite: true, favoriteComment: comment }), 'Added to favorites!');

  const handleTimerClick = () => {
    if (activeTab !== 'timer' || isAnyWindowOpen) return;
    handleTimerPress();
    if (state === 'stopped') {
      setShowTimerActions(false);
    }
  };

  useEffect(() => document.documentElement.setAttribute('data-theme', appSettings.theme), [appSettings.theme]);

  return (
    <div className="h-screen w-screen grid grid-rows-[1fr_auto] overflow-hidden">
      <div ref={containerRef} className="overflow-hidden">
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
          {toast && (
            <SwipeableToast
              message={toast.message}
              type={toast.type}
              duration={2000}
              onClose={() => setToast(null)}
            />
          )}

          {activeTab === 'timer' ? (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between border-b border-border/50 p-4">
                <MenuSettings
                  settings={appSettings}
                  onSettingsChange={(newSettings) => setAppSettings(prev => ({ ...prev, ...newSettings }))}
                  disabled={state === 'running'}
                  onOpenChange={setIsAnyWindowOpen}
                />
                <div className="text-center">
                  <div className="font-semibold text-sm">{currentSession?.name}</div>
                  <div className="text-xs text-muted-foreground">{currentSession?.times.length || 0} solves</div>
                </div>
              </div>

              <TopBar
                scramble={scramble}
                cubeType={cubeType}
                onNewScramble={() => setScramble(generateEnhancedScramble(cubeType))}
                onCubeTypeChange={setCubeType}
                disabled={isAnyWindowOpen}
              />

              <div className="flex-1 flex items-center justify-center p-4">
                <MainTimer
                  time={time}
                  inspectionTimeLeft={inspectionTimeLeft}
                  state={state}
                  isSpacePressed={isSpacePressed}
                  hideTime={appSettings.hideTimeWhileSolving}
                  onTimerClick={handleTimerClick}
                  onTimerRelease={handleTimerRelease}
                  disabled={isAnyWindowOpen}
                  // Timer Actions Props
                  showActions={state === 'stopped' && !isAnyWindowOpen}
                  onPlusTwo={handlePlusTwo}
                  onDNF={handleDNF}
                  onDelete={handleDeleteLastTime}
                  onFavorite={handleFavoriteTime}
                />
              </div>


              <div className="mt-4 border-t border-border/50 bg-card/30">
                <div className="flex items-center justify-between p-3 h-16">
                  <div className="w-20">
                    <BottomStats times={currentSession?.times || []} />
                  </div>
                  <div className="flex-1 px-2 flex justify-center">
                    <BottomVisualization
                      scramble={scramble}
                      cubeType={cubeType}
                      viewMode={appSettings.scrambleView}
                      disabled={isAnyWindowOpen}
                    />
                  </div>
                  <div className="w-20 text-right text-xs text-muted-foreground">
                    <div className="font-medium truncate">{currentSession?.name}</div>
                    <div>{currentSession?.times.length || 0} solves</div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <HistoryTab
              sessions={sessions}
              currentSessionId={currentSessionId}
              onSessionChange={setCurrentSessionId}
              onCreateSession={(name, cube) =>
                setSessions([...sessions, { id: Date.now().toString(), name, cubeType: cube, times: [], createdAt: new Date() }])
              }
              onRenameSession={(id, name) =>
                setSessions(sessions.map(s => (s.id === id ? { ...s, name } : s)))
              }
              onDeleteSession={id =>
                setSessions(sessions.filter(s => s.id !== id))
              }
              onDeleteTime={(id, idx) =>
                setSessions(
                  sessions.map(s =>
                    s.id === id ? { ...s, times: s.times.filter((_, i) => i !== idx) } : s
                  )
                )
              }
            />
          )}
        </div>
      </div>

      <div className="h-12">
        <UniversalNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default NewIndex;
