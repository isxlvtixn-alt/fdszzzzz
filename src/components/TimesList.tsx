import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Trash2, Star } from 'lucide-react';
import { formatTimeCompact, getBestTime } from '@/lib/timer-utils';

interface TimesListProps {
  times: number[];
  onDeleteTime: (index: number) => void;
}

export const TimesList = ({ times, onDeleteTime }: TimesListProps) => {
  const validTimes = times.filter(time => time > 0);
  const bestTime = getBestTime(validTimes);

  if (times.length === 0) {
    return (
      <Card className="timer-card rounded-2xl p-6">
        <div className="text-center text-muted-foreground py-8">
          <div className="text-lg font-medium mb-2">No times yet</div>
          <div className="text-sm">Start solving to see your times here!</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="timer-card rounded-2xl p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Times</h3>
          <Badge variant="secondary" className="font-mono">
            {times.length} solves
          </Badge>
        </div>

        <ScrollArea className="h-64">
          <div className="space-y-2">
            {times.map((time, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground font-mono w-8">
                    #{times.length - index}
                  </span>
                  <span className="font-mono text-lg">
                    {formatTimeCompact(time)}
                  </span>
                  {time === bestTime && time > 0 && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteTime(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};