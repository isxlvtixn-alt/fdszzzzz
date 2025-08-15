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
  inspectionTimeLeft: number;
  state: TimerState;
  isSpacePressed: boolean;
  settings: TimerSettings;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  updateSettings: (newSettings: Partial<TimerSettings>) => void;
}

export const useTimer = (
  onTimeRecord: (time: number) => void,
  timerSettings?: TimerSettings
): TimerHookResult => {
  const [time, setTime] = useState(0);
  const [inspectionTimeLeft, setInspectionTimeLeft] = useState(15);
  const [state, setState] = useState<TimerState>('ready');
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

  // Update settings when external settings change
  useEffect(() => {
    if (timerSettings) {
      setSettings(timerSettings);
    }
  }, [timerSettings]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer update loop
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (state === 'running' && startTime) {
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    } else if (state === 'inspection') {
      intervalRef.current = setInterval(() => {
        setInspectionTimeLeft(prev => {
          if (prev <= 0) {
            setState('running');
            setStartTime(Date.now());
            return settings.inspectionTime;
          }
          return prev - 0.1;
        });
      }, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state, startTime, settings.inspectionTime]);

  const startTimer = useCallback(() => {
    if (state === 'ready') {
      if (settings.useInspection) {
        setState('inspection');
        setInspectionTimeLeft(settings.inspectionTime);
      } else {
        setState('running');
        setStartTime(Date.now());
        setTime(0);
      }
    } else if (state === 'inspection') {
      setState('running');
      setStartTime(Date.now());
      setTime(0);
    }
  }, [state, settings.useInspection, settings.inspectionTime]);

  const stopTimer = useCallback(() => {
    if (state === 'running') {
      setState('stopped');
      onTimeRecord(time);
    }
  }, [state, time, onTimeRecord]);

  const resetTimer = useCallback(() => {
    setState('ready');
    setTime(0);
    setInspectionTimeLeft(settings.inspectionTime);
    setStartTime(null);
  }, [settings.inspectionTime]);

  const updateSettings = useCallback((newSettings: Partial<TimerSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!isSpacePressed) {
          setIsSpacePressed(true);
          if (state === 'stopped') {
            resetTimer();
          } else if (state === 'ready' || state === 'inspection') {
            startTimer();
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(false);
        if (state === 'running') {
          stopTimer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [state, isSpacePressed, startTimer, stopTimer, resetTimer]);

  return {
    time,
    inspectionTimeLeft,
    state,
    isSpacePressed,
    settings,
    startTimer,
    stopTimer,
    resetTimer,
    updateSettings,
  };
};