import { useState, useEffect, useRef } from 'react';
import { useTimerStore } from '@/store/timerStore';
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

const BASE_HEIGHT = 730;
const NAV_HEIGHT = 10;

const NewIndex = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isAnyWindowOpen, setIsAnyWindowOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const {
    // State
    sessions,
    currentSessionId,
    appSettings,
    activeTab,
    cubeType,
    scramble,
    lastRecordedTime,
    
    // Actions
    addTime,
    togglePlusTwo,
    toggleDNF,
    deleteTime,
    favoriteTime,
    updateSettings,
    setActiveTab,
    setCubeType,
    setScramble,
    setLastRecordedTime,
    createSession,
    deleteSession,
    renameSession,
    setCurrentSession,
    getCurrentSession,
  } = useTimerStore();

  const currentSession = getCurrentSession();
  const { playStart, playStop, playInspection } = useSound(appSettings.sounds);

  const timerSettings: TimerSettings = {
    useInspection: appSettings.inspection,
    inspectionTime: appSettings.inspectionTime,
    stackmatMode: false,
    hideTimeWhileSolving: appSettings.hideTime,
  };

  // Handle inspection timeout (auto-DNF)
  const handleInspectionTimeout = () => {
    const time = 0; // DNF time
    addTime(time, scramble, true); // true for autoDnf
    setScramble(generateEnhancedScramble(cubeType));
    setToast({ message: 'DNF - Inspection timeout', type: 'error' });
  };

  // Handle time recording
  const handleTimeRecord = (time: number) => {
    addTime(time, scramble);
    setScramble(generateEnhancedScramble(cubeType));
    playStop();
    setToast({ message: 'Time recorded!', type: 'success' });
  };

  const { time, inspectionTimeLeft, state, isSpacePressed, handleTimerClick, handleTimerRelease } =
    useTimer(handleTimeRecord, handleInspectionTimeout, timerSettings, activeTab !== 'timer' || isAnyWindowOpen);

  // Initialize
  useEffect(() => {
    if (sessions.length === 0) {
      createSession(`${cubeType} Session`, cubeType);
    }
    if (!scramble) {
      setScramble(generateEnhancedScramble(cubeType));
    }
  }, [sessions.length, scramble, cubeType, createSession, setScramble]);

  // Handle settings changes
  const handleSettingsUpdate = (newSettings: Partial<typeof appSettings>) => {
    updateSettings(newSettings);
  };

  // Timer action handlers for last recorded time
  const handlePlusTwo = () => {
    if (lastRecordedTime && !lastRecordedTime.autoDnf) {
      togglePlusTwo(lastRecordedTime.id);
      const message = lastRecordedTime.plusTwo ? "Removed +2" : "Added +2";
      setToast({ message, type: 'info' });
    }
  };

  const handleDNF = () => {
    if (lastRecordedTime && !lastRecordedTime.autoDnf) {
      toggleDNF(lastRecordedTime.id);
      const message = lastRecordedTime.dnf ? "Removed DNF" : "Added DNF";
      setToast({ message, type: 'info' });
    }
  };

  const handleDelete = () => {
    if (lastRecordedTime) {
      deleteTime(lastRecordedTime.id);
      setLastRecordedTime(null);
      setToast({ message: 'Time deleted', type: 'info' });
    }
  };

  const handleFavorite = (comment: string) => {
    if (lastRecordedTime) {
      favoriteTime(lastRecordedTime.id, comment);
      setToast({ message: 'Added to favorites!', type: 'success' });
    }
  };

  const handleTimerClickWrapper = () => {
    if (activeTab === 'timer' && !isAnyWindowOpen) {
      handleTimerClick();
    }
  };

  // Session management handlers
  const handleCreateSession = (name: string, cubeType: string) => {
    createSession(name, cubeType);
  };

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
    setToast({ message: 'Session deleted', type: 'info' });
  };

  const handleRenameSession = (sessionId: string, newName: string) => {
    renameSession(sessionId, newName);
    setToast({ message: 'Session renamed', type: 'success' });
  };

  const handleSessionChange = (sessionId: string) => {
    setCurrentSession(sessionId);
  };

  // History tab time actions
  const handleHistoryPlusTwo = (timeId: string) => {
    togglePlusTwo(timeId);
    setToast({ message: 'Time updated', type: 'info' });
  };

  const handleHistoryDNF = (timeId: string) => {
    toggleDNF(timeId);
    setToast({ message: 'Time updated', type: 'info' });
  };

  const handleHistoryDelete = (timeId: string) => {
    deleteTime(timeId);
    setToast({ message: 'Time deleted', type: 'info' });
  };

  // Resize handler
  useEffect(() => {
    const resize = () => {
      const h = window.innerHeight - NAV_HEIGHT;
      setScale(Math.min(1, h / BASE_HEIGHT));
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Scramble generation when cube type changes
  useEffect(() => {
    setScramble(generateEnhancedScramble(cubeType));
  }, [cubeType, setScramble]);

  // Sound effects
  useEffect(() => {
    if (state === 'running') playStart();
    else if (state === 'inspection') playInspection();
  }, [state, playStart, playInspection]);

  // Theme handling
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', appSettings.theme);
  }, [appSettings.theme]);

  return (
    <div className="h-screen w-screen grid grid-rows-[1fr_auto] overflow-hidden">
      <div ref={containerRef} className="overflow-hidden relative">
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
            {/* Top panel */}
            <div className="flex items-center justify-between border-b border-border/50 p-4">
              <MenuSettings
                settings={{
                  inspection: appSettings.inspection,
                  inspectionTime: appSettings.inspectionTime,
                  hideTimeWhileSolving: appSettings.hideTime,
                  sounds: appSettings.sounds,
                  scrambleView: '3D' as '2D' | '3D',
                  theme: appSettings.theme,
                }}
                onSettingsChange={handleSettingsUpdate}
                disabled={state === 'running'}
                onOpenChange={setIsAnyWindowOpen}
              />
            </div>

            <TopBar
              scramble={scramble}
              cubeType={cubeType}
              onNewScramble={() => setScramble(generateEnhancedScramble(cubeType))}
              onCubeTypeChange={setCubeType}
              disabled={isAnyWindowOpen}
            />

            {/* Timer (scaled) */}
            <div className="flex-1 flex items-center justify-center relative">
              <div
                style={{
                  transform: `translateY(-10px) scale(${scale})`,
                  transformOrigin: 'center center',
                }}
                className="flex items-center justify-center"
              >
                <MainTimer
                  time={time}
                  inspectionTimeLeft={inspectionTimeLeft}
                  state={state}
                  isSpacePressed={isSpacePressed}
                  hideTime={appSettings.hideTime}
                  onTimerClick={handleTimerClickWrapper}
                  onTimerRelease={handleTimerRelease}
                  disabled={isAnyWindowOpen}
                  showActions={state === 'stopped' && lastRecordedTime && !isAnyWindowOpen}
                  onPlusTwo={handlePlusTwo}
                  onDNF={handleDNF}
                  onDelete={handleDelete}
                  onFavorite={handleFavorite}
                />
              </div>
            </div>

            {/* Bottom panel */}
            <div className="border-t border-border/50 bg-card/30">
              <div className="flex items-center justify-between p-3 h-17">
                <div className="w-20">
                  <BottomStats times={currentSession?.times || []} />
                </div>
                <div className="flex-1 px-2 flex justify-center">
                  <BottomVisualization
                    scramble={scramble}
                    cubeType={cubeType}
                    viewMode={'3D' as '2D' | '3D'}
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
            onSessionChange={handleSessionChange}
            onCreateSession={handleCreateSession}
            onRenameSession={handleRenameSession}
            onDeleteSession={handleDeleteSession}
            onPlusTwo={handleHistoryPlusTwo}
            onDNF={handleHistoryDNF}
            onDelete={handleHistoryDelete}
          />
        )}
      </div>

      <div className="h-12">
        <UniversalNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default NewIndex;