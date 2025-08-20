import { useMemo } from 'react';
import { formatTime } from '@/lib/timer-utils';

interface BottomStatsProps {
  times: Array<{ time: number; isPlusTwo?: boolean; isDNF?: boolean; }>;
}

export const BottomStats = ({ times }: BottomStatsProps) => {
  const stats = useMemo(() => {
    if (times.length === 0) {
      return {
        current: '0.00',
        best: '0.00',
        ao5: '0.00',
        ao12: '0.00',
        count: 0
      };
    }

    // Convert to numbers, handling DNF and +2
    const validTimes = times
      .filter(entry => !entry.isDNF)
      .map(entry => entry.time);

    if (validTimes.length === 0) {
      return {
        current: 'DNF',
        best: 'DNF',
        ao5: 'DNF',
        ao12: 'DNF',
        count: times.length
      };
    }

    const current = times[times.length - 1];
    const currentDisplay = current.isDNF ? 'DNF' : formatTime(current.time);
    const best = Math.min(...validTimes);
    
    // Calculate Ao5 (Average of 5)
    let ao5 = 0;
    if (validTimes.length >= 5) {
      const last5 = validTimes.slice(-5);
      const sorted = [...last5].sort((a, b) => a - b);
      // Remove best and worst, average the middle 3
      const middle3 = sorted.slice(1, 4);
      ao5 = middle3.reduce((sum, time) => sum + time, 0) / 3;
    }

    // Calculate Ao12 (Average of 12)
    let ao12 = 0;
    if (validTimes.length >= 12) {
      const last12 = validTimes.slice(-12);
      const sorted = [...last12].sort((a, b) => a - b);
      // Remove best and worst, average the middle 10
      const middle10 = sorted.slice(1, 11);
      ao12 = middle10.reduce((sum, time) => sum + time, 0) / 10;
    }

    return {
      current: currentDisplay,
      best: formatTime(best),
      ao5: validTimes.length >= 5 ? formatTime(ao5) : '-',
      ao12: validTimes.length >= 12 ? formatTime(ao12) : '-',
      count: times.length
    };
  }, [times]);

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Last:</span>
        <span className="font-mono">{stats.current}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Best:</span>
        <span className="font-mono text-timer-stopped">{stats.best}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Ao5:</span>
        <span className="font-mono">{stats.ao5}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Ao12:</span>
        <span className="font-mono">{stats.ao12}</span>
      </div>
    </div>
  );
};