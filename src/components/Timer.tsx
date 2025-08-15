import { Card } from '@/components/ui/card';
import { formatTime } from '@/lib/timer-utils';
import { useTimer, TimerSettings } from '@/hooks/useTimer';

interface TimerProps {
  onTimeRecord: (time: number) => void;
  settings: TimerSettings;
  onSettingsChange: (settings: Partial<TimerSettings>) => void;
}

export const Timer = ({ onTimeRecord, settings, onSettingsChange }: TimerProps) => {
  const { 
    time, 
    inspectionTimeLeft, 
    state, 
    isSpacePressed 
  } = useTimer(onTimeRecord, settings);

  const getTimerClass = () => {
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
    if (settings.hideTimeWhileSolving && state === 'running') {
      return 'Solving...';
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