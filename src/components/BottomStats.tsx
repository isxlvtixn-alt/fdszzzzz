import { useMemo } from 'react';
import { formatTime } from '@/lib/timer-utils';

interface BottomStatsProps {
  times: number[];
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

    const current = times[times.length - 1];
    const best = Math.min(...times);
    
    // Calculate Ao5 (Average of 5)
    let ao5 = 0;
    if (times.length >= 5) {
      const last5 = times.slice(-5);
      const sorted = [...last5].sort((a, b) => a - b);
      // Remove best and worst, average the middle 3
      const middle3 = sorted.slice(1, 4);
      ao5 = middle3.reduce((sum, time) => sum + time, 0) / 3;
    }

    // Calculate Ao12 (Average of 12)
    let ao12 = 0;
    if (times.length >= 12) {
      const last12 = times.slice(-12);
      const sorted = [...last12].sort((a, b) => a - b);
      // Remove best and worst, average the middle 10
      const middle10 = sorted.slice(1, 11);
      ao12 = middle10.reduce((sum, time) => sum + time, 0) / 10;
    }

    return {
      current: formatTime(current),
      best: formatTime(best),
      ao5: times.length >= 5 ? formatTime(ao5) : '-',
      ao12: times.length >= 12 ? formatTime(ao12) : '-',
      count: times.length
    };
  }, [times]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 text-center">
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground uppercase tracking-wide">Last</div>
        <div className="text-sm font-mono">{stats.current}</div>
      </div>
      
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground uppercase tracking-wide">Best</div>
        <div className="text-sm font-mono text-timer-stopped">{stats.best}</div>
      </div>
      
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground uppercase tracking-wide">Ao5</div>
        <div className="text-sm font-mono">{stats.ao5}</div>
      </div>
      
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground uppercase tracking-wide">Ao12</div>
        <div className="text-sm font-mono">{stats.ao12}</div>
      </div>
    </div>
  );
};