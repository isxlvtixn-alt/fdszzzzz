import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface MainTimerProps {
  time: number;
  inspectionTimeLeft: number | null;
  state: "stopped" | "inspection" | "ready" | "running";
  isSpacePressed: boolean;
  hideTime: boolean;
  onTimerClick: () => void;
  onTimerRelease: () => void;
  disabled?: boolean;
  showActions?: boolean;
  onPlusTwo?: () => void;
  onDNF?: () => void;
  onDelete?: () => void;
  onFavorite?: (comment: string) => void;
}

export const MainTimer: React.FC<MainTimerProps> = ({
  time,
  inspectionTimeLeft,
  state,
  isSpacePressed,
  hideTime,
  onTimerClick,
  onTimerRelease,
  disabled,
  showActions,
  onPlusTwo,
  onDNF,
  onDelete,
  onFavorite,
}) => {
  const [favoriteDialogOpen, setFavoriteDialogOpen] = useState(false);
  const [favoriteComment, setFavoriteComment] = useState("");

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes > 0 ? minutes + ":" : ""}${seconds
      .toString()
      .padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  };

  const displayTime =
    state === "inspection" && inspectionTimeLeft !== null
      ? inspectionTimeLeft.toString()
      : hideTime && state === "running"
      ? "Solving..."
      : formatTime(time);

  const handleFavorite = () => {
    if (onFavorite) {
      onFavorite(favoriteComment || "Favorite solve");
      setFavoriteComment("");
      setFavoriteDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full select-none relative">
      {/* Expanded clickable timer area */}
      <div
        className={`timer-clickable-area flex flex-col items-center justify-center cursor-pointer select-none rounded-xl transition-colors relative z-10
          ${!disabled ? "hover:bg-muted/20" : ""} 
          ${isSpacePressed ? "bg-muted/30" : ""}`}
        style={{ 
          padding: "4rem",
          minHeight: "275px",
          minWidth: "800px"
        }}
        onMouseDown={!disabled ? (e) => { e.stopPropagation(); onTimerClick(); } : undefined}
        onMouseUp={!disabled ? (e) => { e.stopPropagation(); onTimerRelease(); } : undefined}
        onTouchStart={!disabled ? (e) => { e.stopPropagation(); e.preventDefault(); onTimerClick(); } : undefined}
        onTouchEnd={!disabled ? (e) => { e.stopPropagation(); e.preventDefault(); onTimerRelease(); } : undefined}
      >
        {/* Timer display */}
        <div
          className={`timer-display text-6xl md:text-8xl lg:text-9xl font-bold transition-colors select-none pointer-events-none ${
            state === "ready" ? "text-green-500" : "text-foreground"
          }`}
        >
          {displayTime}
        </div>
      </div>

      {/* Timer Actions - overlay on top */}
      {showActions && (
        <div className="absolute bottom-6 flex gap-3 text-sm z-20">
          {onPlusTwo && (
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onPlusTwo(); }}
              className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors font-medium"
            >
              +2
            </button>
          )}
          {onDNF && (
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onDNF(); }}
              className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors font-medium"
            >
              DNF
            </button>
          )}
          {onDelete && (
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="px-4 py-2 rounded-lg bg-muted-foreground/20 text-muted-foreground border border-muted-foreground/30 hover:bg-muted-foreground/30 transition-colors font-medium"
            >
              Delete
            </button>
          )}
          {onFavorite && (
            <Dialog open={favoriteDialogOpen} onOpenChange={setFavoriteDialogOpen}>
              <DialogTrigger asChild>
                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  className="px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 transition-colors font-medium"
                >
                  ★
                </button>
              </DialogTrigger>
              <DialogContent onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                  <DialogTitle>Add to Favorites</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="comment">Comment (optional)</Label>
                    <Textarea
                      id="comment"
                      value={favoriteComment}
                      onChange={(e) => setFavoriteComment(e.target.value)}
                      placeholder="Add a note about this solve..."
                      className="mt-2"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={(e) => { e.stopPropagation(); setFavoriteDialogOpen(false); }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={(e) => { e.stopPropagation(); handleFavorite(); }}
                    >
                      Add to Favorites
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </div>
  );
};
