import { useState, useEffect, useCallback, useRef } from 'react';

export type TimerState = 'ready' | 'inspection' | 'running' | 'stopped';

export interface TimerSettings {
  useInspection: boolean;
  inspectionTime: number;
  stackmatMode: boolean;
  hideTimeWhileSolving: boolean;
}

export interface TimerHookResult {
  time: number;
  inspectionTimeLeft: number | null;
  state: TimerState;
  isSpacePressed: boolean;
  hideTime: boolean;
  handleTimerClick: () => void;
  handleTimerRelease: () => void;
}

export const useTimer = (
  onTimeRecord: (time: number) => void,
  onInspectionTimeout?: () => void,
  timerSettings?: TimerSettings,
  disabled?: boolean
): TimerHookResult => {
  const [time, setTime] = useState(0);
  const [inspectionTimeLeft, setInspectionTime] = useState<number | null>(null);
  const [currentState, setCurrentState] = useState<TimerState>('ready');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [settings, setSettings] = useState<TimerSettings>(
    timerSettings || {
      useInspection: false,
      inspectionTime: 15,
      stackmatMode: false,
      hideTimeWhileSolving: false,
    }
  );

  const state = useRef<TimerState>('ready');
  const inspectionTimeLeftRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update settings when external settings change
  useEffect(() => {
    if (timerSettings) {
      setSettings(timerSettings);
    }
  }, [timerSettings]);

  // Timer update loop
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (state.current === 'running' && startTime) {
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    } else if (state.current === 'inspection') {
      intervalRef.current = setInterval(() => {
        if (inspectionTimeLeftRef.current !== null) {
          if (inspectionTimeLeftRef.current <= 0) {
            // Auto-DNF when inspection timeout
            state.current = 'stopped';
            inspectionTimeLeftRef.current = null;
            setCurrentState('stopped');
            setInspectionTime(null);
            onInspectionTimeout?.();
          } else {
            inspectionTimeLeftRef.current -= 100;
            setInspectionTime(inspectionTimeLeftRef.current);
          }
        }
      }, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentState, startTime, onInspectionTimeout]);

  // Universal press handler
  const handleTimerPress = useCallback(() => {
    if (state.current === 'running') {
      // Stop timer
      state.current = 'stopped';
      setCurrentState('stopped');
      onTimeRecord(time);
    } else if (state.current === 'stopped') {
      // Reset timer
      state.current = 'ready';
      setCurrentState('ready');
      setTime(0);
      setStartTime(null);
      inspectionTimeLeftRef.current = null;
      setInspectionTime(null);
    }
  }, [time, onTimeRecord]);

  // Universal release handler
  const handleTimerRelease = useCallback(() => {
    if (state.current === 'ready') {
      if (settings.useInspection) {
        state.current = 'inspection';
        setCurrentState('inspection');
        inspectionTimeLeftRef.current = settings.inspectionTime * 1000;
        setInspectionTime(inspectionTimeLeftRef.current);
      } else {
        state.current = 'running';
        setCurrentState('running');
        const now = Date.now();
        setStartTime(now);
        setTime(0);
      }
    } else if (state.current === 'inspection') {
      state.current = 'running';
      setCurrentState('running');
      const now = Date.now();
      setStartTime(now);
      setTime(0);
      inspectionTimeLeftRef.current = null;
      setInspectionTime(null);
    }
  }, [settings.useInspection, settings.inspectionTime]);

  // Keyboard + mouse + touch controls
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        // Only handle spacebar when no modals/inputs are active
        const activeElement = document.activeElement;
        const isInputActive = activeElement?.tagName === 'INPUT' || 
                            activeElement?.tagName === 'TEXTAREA' || 
                            (activeElement as HTMLElement)?.isContentEditable;
        const isModalOpen = document.querySelector('[role="dialog"]');
        
        if (!isInputActive && !isModalOpen) {
          e.preventDefault();
          if (!isSpacePressed) {
            setIsSpacePressed(true);
            handleTimerPress();
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        // Only handle spacebar when no modals/inputs are active
        const activeElement = document.activeElement;
        const isInputActive = activeElement?.tagName === 'INPUT' || 
                            activeElement?.tagName === 'TEXTAREA' || 
                            (activeElement as HTMLElement)?.isContentEditable;
        const isModalOpen = document.querySelector('[role="dialog"]');
        
        if (!isInputActive && !isModalOpen) {
          e.preventDefault();
          setIsSpacePressed(false);
          handleTimerRelease();
        }
      }
    };

    // Only add keyboard listeners, remove global mouse/touch listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [state, isSpacePressed, handleTimerPress, handleTimerRelease, disabled]);

  return {
    time,
    inspectionTimeLeft: inspectionTimeLeft ? Math.ceil(inspectionTimeLeft / 1000) : null,
    state: currentState,
    isSpacePressed,
    hideTime: settings.hideTimeWhileSolving,
    handleTimerClick: handleTimerPress,
    handleTimerRelease,
  };
};
