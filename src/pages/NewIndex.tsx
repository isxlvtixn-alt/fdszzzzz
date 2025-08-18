import { useState, useEffect } from 'react';
import { useTimer, TimerSettings } from '@/hooks/useTimer';
import { generateEnhancedScramble } from '@/lib/enhanced-scramble-generator';
import { MenuSettings } from '@/components/MenuSettings';
import { TopBar } from '@/components/TopBar';
import { MainTimer } from '@/components/MainTimer';
import { BottomStats } from '@/components/BottomStats';
import { BottomVisualization } from '@/components/BottomVisualization';
import { HistoryTab } from '@/components/HistoryTab';
import { MobileNavigation } from '@/components/MobileNavigation';
import { toast } from 'sonner';

interface AppSettings {
  inspection: boolean;
  inspectionTime: number;
  hideTimeWhileSolving: boolean;
  sounds: boolean;
  scrambleView: '2D' | '3D';
  theme: string;
}

interface Session {
  id: string;
  name: string;
  cubeType: string;
  times: number[];
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

  const timerSettings: TimerSettings = {
    useInspection: appSettings.inspection,
    inspectionTime: appSettings.inspectionTime,
    stackmatMode: false,
    hideTimeWhileSolving: appSettings.hideTimeWhileSolving,
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);
  
  const {
    time,
    inspectionTimeLeft,
    state,
    isSpacePressed,
    handleTimerPress,
    handleTimerRelease
  } = useTimer(handleTimeRecord, timerSettings);

  // Generate initial scramble
  useEffect(() => {
    setScramble(generateEnhancedScramble(cubeType));
  }, [cubeType]);

  function handleTimeRecord(recordedTime: number) {
    setSessions(prev => prev.map(session => 
      session.id === currentSessionId
        ? { ...session, times: [...session.times, recordedTime] }
        : session
    ));
    setScramble(generateEnhancedScramble(cubeType));
    if (appSettings.sounds) {
      // TODO: Play completion sound
    }
    toast.success('Time recorded!');
  }

  const handleNewScramble = () => {
    const newScramble = generateEnhancedScramble(cubeType);
    setScramble(newScramble);
    toast.success('New scramble generated!');
  };

  const handleCubeTypeChange = (newCubeType: string) => {
    setCubeType(newCubeType);
    setScramble(generateEnhancedScramble(newCubeType));
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
    toast.success('Session created!');
  };

  const handleRenameSession = (sessionId: string, newName: string) => {
    setSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { ...session, name: newName }
        : session
    ));
    toast.success('Session renamed!');
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
    toast.success('Session deleted!');
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
    toast.success('Time deleted!');
  };

  const handleTimerClick = () => {
    if (state === 'running') {
      handleTimerPress();
    } else {
      handleTimerRelease();
    }
  };

  // Check if any windows are open (settings or fullscreen visualization)
  const isAnyWindowOpen = false; // TODO: Track dialog states

  return (
    <div className="min-h-screen flex flex-col">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="flex flex-col h-screen">
          {/* Header with Menu and Scramble */}
          <div className="flex items-center justify-between border-b border-border/50">
            <div className="p-4">
              <MenuSettings
                settings={appSettings}
                onSettingsChange={handleAppSettingsChange}
                disabled={isAnyWindowOpen}
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
          <div className="flex-1 flex items-center justify-center">
            <MainTimer
              time={time}
              inspectionTimeLeft={inspectionTimeLeft}
              state={state}
              isSpacePressed={isSpacePressed}
              hideTime={appSettings.hideTimeWhileSolving}
              onTimerClick={handleTimerClick}
              disabled={isAnyWindowOpen}
            />
          </div>

          {/* Bottom Section */}
          <div className="border-t border-border/50">
            <div className="grid grid-cols-3 gap-4 p-4">
              {/* Left: Stats */}
              <div className="flex items-center">
                <BottomStats times={currentSession?.times || []} />
              </div>

              {/* Center: Cube Visualization */}
              <div className="flex items-center justify-center">
                <BottomVisualization
                  scramble={scramble}
                  cubeType={cubeType}
                  viewMode={appSettings.scrambleView}
                  disabled={isAnyWindowOpen}
                />
              </div>

              {/* Right: Session Info */}
              <div className="flex items-center justify-end">
                <div className="text-right text-sm text-muted-foreground">
                  <div className="font-medium">{currentSession?.name}</div>
                  <div>{currentSession?.times.length || 0} solves</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-screen">
        {activeTab === 'timer' ? (
          <>
            {/* Mobile Header */}
            <div className="flex items-center justify-between border-b border-border/50 p-4">
              <MenuSettings
                settings={appSettings}
                onSettingsChange={handleAppSettingsChange}
                disabled={isAnyWindowOpen}
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
            <div className="flex-1 flex flex-col">
              <MainTimer
                time={time}
                inspectionTimeLeft={inspectionTimeLeft}
                state={state}
                isSpacePressed={isSpacePressed}
                hideTime={appSettings.hideTimeWhileSolving}
                onTimerClick={handleTimerClick}
                disabled={isAnyWindowOpen}
              />
              
              {/* Mobile Stats */}
              <BottomStats times={currentSession?.times || []} />
              
              {/* Mobile Cube Visualization */}
              <div className="p-4 flex justify-center">
                <BottomVisualization
                  scramble={scramble}
                  cubeType={cubeType}
                  viewMode={appSettings.scrambleView}
                  disabled={isAnyWindowOpen}
                />
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

        {/* Mobile Navigation */}
        <MobileNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
};

export default NewIndex;