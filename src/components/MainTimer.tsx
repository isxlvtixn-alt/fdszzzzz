import { formatTime } from '@/lib/timer-utils';
import { TimerState } from '@/hooks/useTimer';

interface MainTimerProps {
  time: number;
  inspectionTimeLeft: number;
  state: TimerState;
  isSpacePressed: boolean;
  hideTime: boolean;
  onTimerClick: () => void;
  disabled?: boolean;
}

export const MainTimer = ({ 
  time, 
  inspectionTimeLeft, 
  state, 
  isSpacePressed,
  hideTime,
  onTimerClick,
  disabled
}: MainTimerProps) => {
  const getTimerClass = () => {
    if (disabled) return 'text-muted-foreground/50';
    if (state === 'ready' || (state === 'stopped' && isSpacePressed)) return 'timer-ready';
    if (state === 'running') return 'timer-running';
    if (state === 'stopped') return 'timer-stopped';
    if (state === 'inspection') return 'timer-inspection';
    return 'timer-ready';
  };

  const getDisplayTime = () => {
    if (state === 'inspection') {
      return Math.max(0, Math.ceil(inspectionTimeLeft)).toString();
    }
    if (hideTime && state === 'running') {
      return 'Solving...';
    }
    return formatTime(time);
  };

  const getInstruction = () => {
    if (disabled) return 'Close settings to continue';
    if (state === 'ready') return 'Press SPACE to start';
    if (state === 'inspection') return 'Get ready... Release SPACE to start solving';
    if (state === 'running') return 'Solving... Press SPACE to stop';
    if (state === 'stopped') return 'Press SPACE for next solve';
    return '';
  };

  return (
    <div 
      className="flex-1 flex flex-col items-center justify-center min-h-[50vh] cursor-pointer select-none"
      onClick={!disabled ? onTimerClick : undefined}
    >
      <div 
        className={`timer-display text-6xl md:text-8xl lg:text-9xl font-bold transition-smooth ${getTimerClass()}`}
      >
        {getDisplayTime()}
      </div>
      
      <div className="text-muted-foreground text-sm md:text-base mt-4 text-center">
        {getInstruction()}
      </div>

      {state === 'inspection' && !disabled && (
        <div className="text-timer-inspection text-xs mt-2">
          Inspection: {Math.max(0, Math.ceil(inspectionTimeLeft))}s remaining
        </div>
      )}
    </div>
  );
};