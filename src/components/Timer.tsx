import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { formatTime } from '@/lib/timer-utils';

type TimerState = 'ready' | 'inspection' | 'running' | 'stopped';

interface TimerProps {
  onTimeRecord: (time: number) => void;
  useInspection?: boolean;
  inspectionTime?: number;
}

export const Timer = ({ onTimeRecord, useInspection = false, inspectionTime = 15 }: TimerProps) => {
  const [time, setTime] = useState(0);
  const [inspectionTimeLeft, setInspectionTimeLeft] = useState(inspectionTime);
  const [state, setState] = useState<TimerState>('ready');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [spacePressed, setSpacePressed] = useState(false);

  // Update timer display
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state === 'running' && startTime) {
      interval = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    } else if (state === 'inspection') {
      interval = setInterval(() => {
        setInspectionTimeLeft(prev => {
          if (prev <= 0) {
            setState('running');
            setStartTime(Date.now());
            return inspectionTime;
          }
          return prev - 0.1;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state, startTime, inspectionTime]);

  const handleStart = useCallback(() => {
    if (state === 'ready') {
      if (useInspection) {
        setState('inspection');
        setInspectionTimeLeft(inspectionTime);
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
  }, [state, useInspection, inspectionTime]);

  const handleStop = useCallback(() => {
    if (state === 'running') {
      setState('stopped');
      onTimeRecord(time);
    }
  }, [state, time, onTimeRecord]);

  const handleReset = useCallback(() => {
    setState('ready');
    setTime(0);
    setInspectionTimeLeft(inspectionTime);
    setStartTime(null);
  }, [inspectionTime]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!spacePressed) {
          setSpacePressed(true);
          if (state === 'stopped') {
            handleReset();
          } else if (state === 'ready' || state === 'inspection') {
            handleStart();
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setSpacePressed(false);
        if (state === 'running') {
          handleStop();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [state, spacePressed, handleStart, handleStop, handleReset]);

  const getTimerClass = () => {
    if (state === 'ready' || (state === 'stopped' && spacePressed)) return 'timer-ready';
    if (state === 'running') return 'timer-running';
    if (state === 'stopped') return 'timer-stopped';
    if (state === 'inspection') return 'timer-inspection';
    return 'timer-ready';
  };

  const getDisplayTime = () => {
    if (state === 'inspection') {
      return Math.max(0, Math.ceil(inspectionTimeLeft)).toString();
    }
    return formatTime(time);
  };

  const getInstruction = () => {
    if (state === 'ready') return 'Press SPACE to start';
    if (state === 'inspection') return 'Get ready... Release SPACE to start solving';
    if (state === 'running') return 'Solving... Press SPACE to stop';
    if (state === 'stopped') return 'Press SPACE for next solve';
    return '';
  };

  return (
    <Card className="timer-card rounded-3xl p-8 text-center transition-smooth">
      <div className="space-y-6">
        <div 
          className={`timer-display text-8xl md:text-9xl font-bold ${getTimerClass()} transition-smooth`}
        >
          {getDisplayTime()}
        </div>
        
        <div className="text-muted-foreground text-lg">
          {getInstruction()}
        </div>

        {state === 'inspection' && (
          <div className="text-timer-inspection text-sm">
            Inspection: {Math.max(0, Math.ceil(inspectionTimeLeft))}s
          </div>
        )}
      </div>
    </Card>
  );
};