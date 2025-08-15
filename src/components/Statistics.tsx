import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatTimeCompact, getBestTime, calculateAverageOf5, calculateAverageOf12 } from '@/lib/timer-utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatisticsProps {
  times: number[];
  currentSession: string;
}

export const Statistics = ({ times, currentSession }: StatisticsProps) => {
  const validTimes = times.filter(time => time > 0);
  const bestTime = getBestTime(validTimes);
  const ao5 = calculateAverageOf5(validTimes);
  const ao12 = calculateAverageOf12(validTimes);
  const average = validTimes.length > 0 ? validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length : 0;

  const getTrendIcon = (current: number, previous: number) => {
    if (current === 0 || previous === 0) return <Minus className="h-3 w-3" />;
    if (current < previous) return <TrendingDown className="h-3 w-3 text-primary" />;
    if (current > previous) return <TrendingUp className="h-3 w-3 text-destructive" />;
    return <Minus className="h-3 w-3" />;
  };

  const StatCard = ({ title, value, trend }: { title: string; value: string; trend?: React.ReactNode }) => (
    <div className="bg-muted/30 rounded-lg p-4 text-center space-y-2">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="font-mono text-xl font-bold">{value}</div>
      {trend && (
        <div className="flex items-center justify-center">
          {trend}
        </div>
      )}
    </div>
  );

  return (
    <Card className="timer-card rounded-2xl p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Statistics</h3>
          <Badge variant="secondary" className="font-mono">
            {currentSession}
          </Badge>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Best"
            value={bestTime > 0 ? formatTimeCompact(bestTime) : '-'}
          />
          
          <StatCard
            title="Ao5"
            value={ao5 > 0 ? formatTimeCompact(ao5) : '-'}
          />
          
          <StatCard
            title="Ao12"
            value={ao12 > 0 ? formatTimeCompact(ao12) : '-'}
          />
          
          <StatCard
            title="Mean"
            value={average > 0 ? formatTimeCompact(average) : '-'}
          />
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Solves: {validTimes.length}
          </div>
          
          {validTimes.length > 0 && (
            <div className="text-xs text-muted-foreground">
              Last: {formatTimeCompact(validTimes[validTimes.length - 1])}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};