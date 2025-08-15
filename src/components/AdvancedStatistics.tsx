import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatTime, formatTimeCompact } from '@/lib/timer-utils';
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';

interface AdvancedStatisticsProps {
  times: number[];
  currentSession: string;
}

export const AdvancedStatistics = ({ times, currentSession }: AdvancedStatisticsProps) => {
  if (times.length === 0) {
    return (
      <Card className="timer-card rounded-2xl p-6">
        <div className="text-center text-muted-foreground">
          <Award className="h-8 w-8 mx-auto mb-3 opacity-50" />
          <p>No solves yet</p>
          <p className="text-sm mt-1">Start solving to see statistics</p>
        </div>
      </Card>
    );
  }

  // Calculate various statistics
  const validTimes = times.filter(time => time > 0);
  const bestTime = validTimes.length > 0 ? Math.min(...validTimes) : 0;
  const worstTime = validTimes.length > 0 ? Math.max(...validTimes) : 0;
  const averageTime = validTimes.length > 0 ? validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length : 0;

  // Calculate Ao5 (Average of 5)
  const calculateAo5 = () => {
    if (times.length < 5) return 0;
    const lastFive = times.slice(-5);
    const sorted = [...lastFive].sort((a, b) => a - b);
    const middle = sorted.slice(1, -1);
    return middle.reduce((sum, time) => sum + time, 0) / middle.length;
  };

  // Calculate Ao12 (Average of 12)
  const calculateAo12 = () => {
    if (times.length < 12) return 0;
    const lastTwelve = times.slice(-12);
    const sorted = [...lastTwelve].sort((a, b) => a - b);
    const middle = sorted.slice(1, -1);
    return middle.reduce((sum, time) => sum + time, 0) / middle.length;
  };

  // Calculate Ao100
  const calculateAo100 = () => {
    if (times.length < 100) return 0;
    const lastHundred = times.slice(-100);
    const sorted = [...lastHundred].sort((a, b) => a - b);
    const middle = sorted.slice(5, -5); // Remove best 5 and worst 5
    return middle.reduce((sum, time) => sum + time, 0) / middle.length;
  };

  // Calculate standard deviation
  const calculateStandardDeviation = () => {
    if (validTimes.length < 2) return 0;
    const avg = averageTime;
    const squaredDiffs = validTimes.map(time => Math.pow(time - avg, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / validTimes.length;
    return Math.sqrt(avgSquaredDiff);
  };

  // Calculate trend (improvement over last 10 solves)
  const calculateTrend = () => {
    if (times.length < 10) return 0;
    const recent = times.slice(-5);
    const earlier = times.slice(-10, -5);
    const recentAvg = recent.reduce((sum, time) => sum + time, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, time) => sum + time, 0) / earlier.length;
    return ((recentAvg - earlierAvg) / earlierAvg) * 100;
  };

  const ao5 = calculateAo5();
  const ao12 = calculateAo12();
  const ao100 = calculateAo100();
  const stdDev = calculateStandardDeviation();
  const trend = calculateTrend();

  return (
    <Card className="timer-card rounded-2xl p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Advanced Statistics</h3>
          <Badge variant="outline">{currentSession}</Badge>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="averages">Averages</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Best</div>
                <div className="font-mono text-lg text-primary font-bold">
                  {formatTimeCompact(bestTime)}
                </div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Worst</div>
                <div className="font-mono text-lg">
                  {formatTimeCompact(worstTime)}
                </div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Average</div>
                <div className="font-mono text-lg">
                  {formatTimeCompact(averageTime)}
                </div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Solves</div>
                <div className="font-mono text-lg">
                  {times.length}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="averages" className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">Ao5</span>
                <span className="font-mono">
                  {ao5 > 0 ? formatTimeCompact(ao5) : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">Ao12</span>
                <span className="font-mono">
                  {ao12 > 0 ? formatTimeCompact(ao12) : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">Ao100</span>
                <span className="font-mono">
                  {ao100 > 0 ? formatTimeCompact(ao100) : '-'}
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">Standard Deviation</span>
                <span className="font-mono text-sm">
                  {formatTimeCompact(stdDev)}
                </span>
              </div>
              
              {times.length >= 10 && (
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium">Trend (Last 10)</span>
                  <div className="flex items-center gap-2">
                    {trend < 0 ? (
                      <TrendingDown className="h-4 w-4 text-primary" />
                    ) : trend > 0 ? (
                      <TrendingUp className="h-4 w-4 text-destructive" />
                    ) : (
                      <Target className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-mono text-sm">
                      {Math.abs(trend).toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">Success Rate</span>
                <span className="font-mono text-sm">
                  {((validTimes.length / times.length) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};