import { useState, useEffect } from 'react';
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
import { TimerActions } from '@/components/TimerActions';
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
    {
      id: 'default',
      name: 'Session 1',
      cubeType: '3x3',
      times: [],
      createdAt: new Date()
    }
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
  
  // Check if any windows are open (settings or fullscreen visualization)
  const [isAnyWindowOpen, setIsAnyWindowOpen] = useState(false);
  
  // Sound hooks
  const { playStart, playStop, playInspection } = useSound(appSettings.sounds);
  
  const {
    time,
    inspectionTimeLeft,
    state,
    isSpacePressed,
    handleTimerPress,
    handleTimerRelease
  } = useTimer(handleTimeRecord, timerSettings, activeTab !== 'timer' || isAnyWindowOpen);

  // Generate initial scramble
  useEffect(() => {
    setScramble(generateEnhancedScramble(cubeType));
  }, [cubeType]);

  // Play sounds on state changes
  useEffect(() => {
    if (state === 'running') {
      playStart();
    } else if (state === 'inspection') {
      playInspection();
    }
  }, [state, playStart, playInspection]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  function handleTimeRecord(recordedTime: number) {
    const timeEntry: TimeEntry = {
      time: recordedTime,
      scramble: scramble,
      isFavorite: false
    };
    
    setSessions(prev => prev.map(session => 
      session.id === currentSessionId
        ? { ...session, times: [...session.times, timeEntry] }
        : session
    ));
    
    setLastRecordedTime(recordedTime);
    setShowTimerActions(true);
    setScramble(generateEnhancedScramble(cubeType));
    playStop();
    showToast('Time recorded!', 'success');
  }

  const handleNewScramble = () => {
    const newScramble = generateEnhancedScramble(cubeType);
    setScramble(newScramble);
    setShowTimerActions(false);
    showToast('New scramble generated!', 'success');
  };

  const handleCubeTypeChange = (newCubeType: string) => {
    setCubeType(newCubeType);
    setScramble(generateEnhancedScramble(newCubeType));
    setShowTimerActions(false);
  };

  const handleAppSettingsChange = (newSettings: Partial<AppSettings>) => {
    setAppSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleCreateSession = (name: string, sessionCubeType: string) => {
    const newSession: Session = {
      id: Date.now().toString(),
      name,
      cubeType: sessionCubeType,
      times: [],
      createdAt: new Date()
    };
    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newSession.id);
    setCubeType(sessionCubeType);
    showToast('Session created!', 'success');
  };

  const handleRenameSession = (sessionId: string, newName: string) => {
    setSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { ...session, name: newName }
        : session
    ));
    showToast('Session renamed!', 'success');
  };

  const handleDeleteSession = (sessionId: string) => {
    if (sessions.length <= 1) return;
    
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    
    if (sessionId === currentSessionId) {
      const remainingSession = sessions.find(s => s.id !== sessionId);
      if (remainingSession) {
        setCurrentSessionId(remainingSession.id);
        setCubeType(remainingSession.cubeType);
      }
    }
    showToast('Session deleted!', 'success');
  };

  const handleDeleteTime = (sessionId: string, timeIndex: number) => {
    setSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { 
            ...session, 
            times: session.times.filter((_, index) => index !== timeIndex) 
          }
        : session
    ));
    showToast('Time deleted!', 'success');
  };

  // Timer Actions
  const handlePlusTwo = () => {
    if (lastRecordedTime === null) return;
    
    setSessions(prev => prev.map(session => 
      session.id === currentSessionId
        ? { 
            ...session, 
            times: session.times.map((entry, index) => 
              index === session.times.length - 1 
                ? { ...entry, isPlusTwo: true, time: entry.time + 2000 }
                : entry
            )
          }
        : session
    ));
    setShowTimerActions(false);
    showToast('+2 penalty applied', 'info');
  };

  const handleDNF = () => {
    if (lastRecordedTime === null) return;
    
    setSessions(prev => prev.map(session => 
      session.id === currentSessionId
        ? { 
            ...session, 
            times: session.times.map((entry, index) => 
              index === session.times.length - 1 
                ? { ...entry, isDNF: true }
                : entry
            )
          }
        : session
    ));
    setShowTimerActions(false);
    showToast('DNF applied', 'info');
  };

  const handleDeleteLastTime = () => {
    if (lastRecordedTime === null) return;
    
    setSessions(prev => prev.map(session => 
      session.id === currentSessionId
        ? { 
            ...session, 
            times: session.times.slice(0, -1)
          }
        : session
    ));
    setShowTimerActions(false);
    showToast('Time deleted!', 'success');
  };

  const handleFavoriteTime = (comment: string) => {
    if (lastRecordedTime === null) return;
    
    setSessions(prev => prev.map(session => 
      session.id === currentSessionId
        ? { 
            ...session, 
            times: session.times.map((entry, index) => 
              index === session.times.length - 1 
                ? { ...entry, isFavorite: true, favoriteComment: comment }
                : entry
            )
          }
        : session
    ));
    setShowTimerActions(false);
    showToast('Added to favorites!', 'success');
  };

  const handleTimerClick = () => {
    if (activeTab !== 'timer' || isAnyWindowOpen) return;
    
    if (state === 'running') {
      handleTimerPress();
    } else {
      handleTimerRelease();
      setShowTimerActions(false);
    }
  };


  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', appSettings.theme);
  }, [appSettings.theme]);

  return (
   <div className="min-h-screen flex flex-col overflow-y-auto pb-20">
      {/* Swipeable Toast */}
      {toast && (
        <SwipeableToast
          message={toast.message}
          type={toast.type}
          duration={2000}
          onClose={() => setToast(null)}
        />
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="flex flex-col h-screen">
          {/* Header with Menu and Scramble */}
          <div className="flex border-b border-border/50">
            <div className="p-4">
              <MenuSettings
                settings={appSettings}
                onSettingsChange={handleAppSettingsChange}
                disabled={isAnyWindowOpen}
                onOpenChange={setIsAnyWindowOpen}
              />
            </div>
            
            <div className="flex-1">
              <TopBar
                scramble={scramble}
                cubeType={cubeType}
                onNewScramble={handleNewScramble}
                onCubeTypeChange={handleCubeTypeChange}
                disabled={isAnyWindowOpen}
              />
            </div>
          </div>

          {/* Main Timer Area */}
          <div className="flex-1 flex items-center justify-center p-8">
            <MainTimer
              time={time}
              inspectionTimeLeft={inspectionTimeLeft}
              state={state}
              isSpacePressed={isSpacePressed}
              hideTime={appSettings.hideTimeWhileSolving}
              onTimerClick={handleTimerClick}
              disabled={activeTab !== 'timer' || isAnyWindowOpen}
            />
          </div>

          {/* Bottom Section */}
          <div className="border-t border-border/50 bg-card/30">
            <div className="flex items-center justify-between p-4 h-20">
              {/* Left: Stats */}
              <div className="w-32">
                <BottomStats times={currentSession?.times || []} />
              </div>

              {/* Center: Cube Visualization */}
              <div className="flex-1 px-4 flex justify-center">
                <BottomVisualization
                  scramble={scramble}
                  cubeType={cubeType}
                  viewMode={appSettings.scrambleView}
                  disabled={isAnyWindowOpen}
                  onOpenChange={setIsAnyWindowOpen}
                />
              </div>

              {/* Right: Session Info */}
              <div className="w-32 text-right text-sm text-muted-foreground">
                <div className="font-medium">{currentSession?.name}</div>
                <div>{currentSession?.times.length || 0} solves</div>
              </div>
            </div>
            
            {/* Timer Actions */}
            {showTimerActions && state === 'stopped' && (
              <div className="border-t border-border/50 p-3">
                <TimerActions
                  time={lastRecordedTime || 0}
                  visible={showTimerActions}
                  onPlusTwo={handlePlusTwo}
                  onDNF={handleDNF}
                  onDelete={handleDeleteLastTime}
                  onFavorite={handleFavoriteTime}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden flex flex-col h-screen overflow-hidden">
        {activeTab === 'timer' ? (
          <>
            {/* Mobile Header */}
            <div className="flex items-center justify-between border-b border-border/50 p-4">
              <MenuSettings
                settings={appSettings}
                onSettingsChange={handleAppSettingsChange}
                disabled={isAnyWindowOpen}
                onOpenChange={setIsAnyWindowOpen}
              />
              
              <div className="text-center">
                <div className="font-semibold text-sm">{currentSession?.name}</div>
                <div className="text-xs text-muted-foreground">
                  {currentSession?.times.length || 0} solves
                </div>
              </div>
            </div>

            {/* Mobile Scramble */}
            <TopBar
              scramble={scramble}
              cubeType={cubeType}
              onNewScramble={handleNewScramble}
              onCubeTypeChange={handleCubeTypeChange}
              disabled={isAnyWindowOpen}
            />

            {/* Mobile Timer */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 flex items-center justify-center p-4">
                <MainTimer
                  time={time}
                  inspectionTimeLeft={inspectionTimeLeft}
                  state={state}
                  isSpacePressed={isSpacePressed}
                  hideTime={appSettings.hideTimeWhileSolving}
                  onTimerClick={handleTimerClick}
                  disabled={activeTab !== 'timer' || isAnyWindowOpen}
                />
              </div>

              {/* Timer Actions */}
              {showTimerActions && state === 'stopped' && (
                <div className="px-4 pb-2">
                  <TimerActions
                    time={lastRecordedTime || 0}
                    visible={showTimerActions}
                    onPlusTwo={handlePlusTwo}
                    onDNF={handleDNF}
                    onDelete={handleDeleteLastTime}
                    onFavorite={handleFavoriteTime}
                  />
                </div>
              )}
              
              {/* Mobile Bottom Section */}
              <div className="border-t border-border/50 bg-card/30 flex-shrink-0 pb-14">
                <div className="flex items-center justify-between p-3 h-16">
                  {/* Left: Stats */}
                  <div className="w-20">
                    <BottomStats times={currentSession?.times || []} />
                  </div>

                  {/* Center: Cube Visualization */}
                  <div className="flex-1 px-2 flex justify-center">
                    <BottomVisualization
                      scramble={scramble}
                      cubeType={cubeType}
                      viewMode={appSettings.scrambleView}
                      disabled={isAnyWindowOpen}
                      onOpenChange={setIsAnyWindowOpen}
                    />
                  </div>

                  {/* Right: Session Info */}
                  <div className="w-20 text-right text-xs text-muted-foreground">
                    <div className="font-medium truncate">{currentSession?.name}</div>
                    <div>{currentSession?.times.length || 0} solves</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <HistoryTab
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSessionChange={setCurrentSessionId}
            onCreateSession={handleCreateSession}
            onRenameSession={handleRenameSession}
            onDeleteSession={handleDeleteSession}
            onDeleteTime={handleDeleteTime}
          />
        )}
      </div>

      {/* Universal Navigation - Only on mobile/tablet */}
      <div className="lg:hidden">
        <UniversalNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
};

export default NewIndex;
