import { useState } from 'react';
import { formatTime } from '@/lib/timer-utils';
import { TimerState } from '@/hooks/useTimer';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Ban, X, Star } from 'lucide-react';

interface MainTimerProps {
  time: number;
  inspectionTimeLeft: number;
  state: TimerState;
  isSpacePressed: boolean;
  hideTime: boolean;
  onTimerClick: () => void;
  disabled?: boolean;
  // Timer Actions Props
  showActions?: boolean;
  onPlusTwo?: () => void;
  onDNF?: () => void;
  onDelete?: () => void;
  onFavorite?: (comment: string) => void;
}

export const MainTimer = ({ 
  time, 
  inspectionTimeLeft, 
  state, 
  isSpacePressed,
  hideTime,
  onTimerClick,
  disabled,
  showActions,
  onPlusTwo,
  onDNF,
  onDelete,
  onFavorite
}: MainTimerProps) => {
  const [favoriteDialogOpen, setFavoriteDialogOpen] = useState(false);
  const [favoriteComment, setFavoriteComment] = useState('');
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
    if (state === 'ready') return 'Press SPACE or TAP to start';
    if (state === 'inspection') return 'Get ready... Release SPACE to start solving';
    if (state === 'running') return 'Solving... Press SPACE to stop';
    if (state === 'stopped') return 'Press SPACE or TAP for next solve';
    return '';
  };

  const handleFavorite = () => {
    onFavorite?.(favoriteComment);
    setFavoriteComment('');
    setFavoriteDialogOpen(false);
  };

  return (
    <div 
      className="flex-1 flex flex-col items-center justify-center min-h-[50vh] cursor-pointer select-none"
      onClick={!disabled ? onTimerClick : undefined}
    >
      <div className="flex items-center gap-6">
        <div 
          className={`timer-display text-6xl md:text-8xl lg:text-9xl font-bold transition-smooth ${getTimerClass()}`}
        >
          {getDisplayTime()}
        </div>
        
        {showActions && (
          <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-300">
            {/* +2 */}
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onPlusTwo?.();
              }}
              className="h-10 w-10 p-0 rounded-full border-2 hover:border-accent hover:text-accent transition-colors"
            >
              <Plus className="h-3 w-3" />
              <span className="text-xs ml-0.5">2</span>
            </Button>

            {/* DNF */}
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDNF?.();
              }}
              className="h-10 px-3 rounded-full border-2 hover:border-destructive hover:text-destructive transition-colors"
            >
              <Ban className="h-3 w-3 mr-1" />
              <span className="text-xs">DNF</span>
            </Button>

            {/* Delete */}
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="h-10 w-10 p-0 rounded-full border-2 hover:border-destructive hover:text-destructive transition-colors"
            >
              <X className="h-3 w-3" />
            </Button>

            {/* Favorite */}
            <Dialog open={favoriteDialogOpen} onOpenChange={setFavoriteDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  className="h-10 w-10 p-0 rounded-full border-2 hover:border-timer-stopped hover:text-timer-stopped transition-colors"
                >
                  <Star className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Add to Favorites</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="favorite-comment">Comment (optional)</Label>
                    <Textarea
                      id="favorite-comment"
                      value={favoriteComment}
                      onChange={(e) => setFavoriteComment(e.target.value)}
                      placeholder="Add a note about this solve..."
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleFavorite} className="w-full">
                    Add to Favorites
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
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