import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw, Box, Edit3 } from 'lucide-react';
import { CUBE_EVENTS } from '@/lib/enhanced-scramble-generator';

interface TopBarProps {
  scramble: string;
  cubeType: string;
  onNewScramble: () => void;
  onCubeTypeChange: (cubeType: string) => void;
  onCustomScramble: (scramble: string) => void;
  disabled?: boolean;
}

export const TopBar = ({ scramble, cubeType, onNewScramble, onCubeTypeChange, onCustomScramble, disabled }: TopBarProps) => {
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const [customScrambleText, setCustomScrambleText] = useState('');

  const handleCustomScrambleSubmit = () => {
    if (customScrambleText.trim()) {
      onCustomScramble(customScrambleText.trim());
      setCustomScrambleText('');
      setIsCustomDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      {/* Scramble Display - Fixed height with vertical scrolling and text wrapping */}
      <div className="bg-card/50 rounded-lg border border-border/50 h-20">
        <div className="p-3 h-full overflow-y-auto">
          <p className="font-mono text-base text-foreground/90 leading-relaxed break-words">
            {scramble || 'Press refresh to generate scramble'}
          </p>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex items-center gap-2 justify-center">
        {/* Refresh Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onNewScramble}
          className="h-8 w-8 p-0"
          disabled={disabled}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>

        {/* Custom Scramble Button */}
        <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={disabled}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Custom Scramble</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your custom scramble..."
                value={customScrambleText}
                onChange={(e) => setCustomScrambleText(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCustomDialogOpen(false);
                    setCustomScrambleText('');
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleCustomScrambleSubmit}>
                  Apply
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Cube Type Selector */}
        <Select value={cubeType} onValueChange={onCubeTypeChange} disabled={disabled}>
          <SelectTrigger className="w-auto h-8 gap-2 bg-card/50 border-border/50">
            <Box className="h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CUBE_EVENTS.map((event) => (
              <SelectItem key={event.id} value={event.id}>
                {event.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};