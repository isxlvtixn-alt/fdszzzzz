import { useMemo } from 'react';
import { formatTime } from '@/lib/timer-utils';
import { TimeEntry } from '@/store/types';

interface BottomStatsProps {
  times: TimeEntry[];
}

export const BottomStats = ({ times }: BottomStatsProps) => {
  const stats = useMemo(() => {
    if (times.length === 0) {
      return {
        current: '0.00',
        best: '0.00',
        ao5: '0.00',
        ao12: '0.00',
        count: 0,
      };
    }

    // корректируем время с учётом +2
    const validTimes = times
      .filter(entry => !entry.dnf)
      .map(entry => entry.plusTwo ? entry.time + 2000 : entry.time);

    if (validTimes.length === 0) {
      return {
        current: 'DNF',
        best: 'DNF',
        ao5: 'DNF',
        ao12: 'DNF',
        count: times.length,
      };
    }

    const current = times[times.length - 1];
    const currentDisplay = current.dnf
      ? 'DNF'
      : formatTime(current.plusTwo ? current.time + 2000 : current.time);
    const best = Math.min(...validTimes);

    // Ao5
    let ao5 = '-';
    if (validTimes.length >= 5) {
      const last5 = validTimes.slice(-5).sort((a, b) => a - b);
      const middle3 = last5.slice(1, 4);
      ao5 = formatTime(middle3.reduce((sum, t) => sum + t, 0) / 3);
    }

    // Ao12
    let ao12 = '-';
    if (validTimes.length >= 12) {
      const last12 = validTimes.slice(-12).sort((a, b) => a - b);
      const middle10 = last12.slice(1, 11);
      ao12 = formatTime(middle10.reduce((sum, t) => sum + t, 0) / 10);
    }

    return {
      current: currentDisplay,
      best: formatTime(best),
      ao5,
      ao12,
      count: times.length,
    };
  }, [times]);

  return (
    <div className="space-y-1 text-sm">
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
