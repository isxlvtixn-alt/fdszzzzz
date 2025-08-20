import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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

interface TimerActionsProps {
  time: number;
  visible: boolean;
  onPlusTwo: () => void;
  onDNF: () => void;
  onDelete: () => void;
  onFavorite: (comment: string) => void;
}

export const TimerActions = ({
  visible,
  onPlusTwo,
  onDNF,
  onDelete,
  onFavorite
}: TimerActionsProps) => {
  const [favoriteDialogOpen, setFavoriteDialogOpen] = useState(false);
  const [favoriteComment, setFavoriteComment] = useState('');

  if (!visible) return null;

  const handleFavorite = () => {
    onFavorite(favoriteComment);
    setFavoriteComment('');
    setFavoriteDialogOpen(false);
  };

  const buttonProps = "h-12 w-12 p-0 rounded-xl border-2 transition-colors flex items-center justify-center";

  return (
    <Card className="timer-card rounded-2xl p-4 animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-center gap-3">
        {/* +2 */}
        <Button
          variant="outline"
          size="sm"
          onClick={onPlusTwo}
          className={`${buttonProps} hover:border-accent hover:text-accent`}
        >
          <Plus className="h-4 w-4" />
          <span className="text-xs ml-1">2</span>
        </Button>

        {/* DNF */}
        <Button
          variant="outline"
          size="sm"
          onClick={onDNF}
          className={`${buttonProps} hover:border-destructive hover:text-destructive`}
        >
          <Ban className="h-4 w-4 mr-1" />
          <span className="text-xs">DNF</span>
        </Button>

        {/* Delete */}
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          className={`${buttonProps} hover:border-destructive hover:text-destructive`}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Favorite */}
        <Dialog open={favoriteDialogOpen} onOpenChange={setFavoriteDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`${buttonProps} hover:border-timer-stopped hover:text-timer-stopped`}
            >
              <Star className="h-4 w-4" />
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
    </Card>
  );
};
